import type {
    PreTrainedModel,
    Processor,
    ProgressInfo
} from "@huggingface/transformers";
import { RealTimeCaptions, type RTCStatus } from "./RealTimeCaptions";
import type { Paella } from "@asicupv/paella-core";

const MODEL_ID = "onnx-community/Voxtral-Mini-4B-Realtime-2602-ONNX";
const MODEL_FILE_COUNT = 3;
const MAX_AUDIO_BUFFER_SECONDS = 30;
const MAX_TRANSCRIPT_CHUNKS = 50;
const CAPTURE_PROCESSOR_NAME = "paella-rtc-voxtral-capture-processor";
const CAPTURE_WORKLET_SOURCE = `
  class CaptureProcessor extends AudioWorkletProcessor {
    process(inputs) {
      const input = inputs[0];
      if (input.length > 0 && input[0].length > 0) {
        this.port.postMessage(input[0]);
      }
      return true;
    }
  }
  registerProcessor("${CAPTURE_PROCESSOR_NAME}", CaptureProcessor);
`;


export class VoxtralRealTimeCaptions extends RealTimeCaptions {
    
    private _status: RTCStatus = "idle";
    private _loadingProgress: number = 0;
    private _loadingMessage: string = "";
    private _error: string | null = null;

    private _model: PreTrainedModel | null = null;
    private _processor: Processor | null = null;
    private _isRecording: boolean = false;
    private _stopRequested: boolean = false;
    private _audioChunks: Float32Array[] = [];
    private _audioLength: number = 0;

    private _audioContext: AudioContext | null = null;
    private _sourceNode: MediaElementAudioSourceNode | null = null;
    private _silentGainNode: GainNode | null = null;
    private _workletNode: AudioWorkletNode | null = null;
    private _player: Paella;
    private _sampleRate: number = 0;

    private readonly CHUNK_DURATION = 6;
    private _transcriptChunks: Array<{ startTime: number; duration: number; id: number; text: string }> = [];
    private _transcriptPlugin: any = null;

    constructor(player: Paella) {
        super();
        this._player = player;
    }

    get status() {
        return this._status;
    }

    get loadingProgress() {
        return this._loadingProgress;
    }

    get loadingMessage() {
        return this._loadingMessage;
    }

    get error() {
        return this._error;
    }

    private getErrorMessage(error: unknown, fallback: string) {
        return error instanceof Error ? error.message : fallback;
    }

    private get audioLength() {
        return this._audioLength;
    }

    private getAudioRange(start: number, end: number): Float32Array {
        const clampedStart = Math.max(0, start);
        const clampedEnd = Math.min(this._audioLength, end);
        const length = Math.max(0, clampedEnd - clampedStart);
        const result = new Float32Array(length);

        if (length === 0) {
            return result;
        }

        let chunkStart = 0;
        let resultOffset = 0;
        for (const chunk of this._audioChunks) {
            const chunkEnd = chunkStart + chunk.length;
            if (chunkEnd <= clampedStart) {
                chunkStart = chunkEnd;
                continue;
            }
            if (chunkStart >= clampedEnd) {
                break;
            }
            const copyStart = Math.max(clampedStart, chunkStart) - chunkStart;
            const copyEnd = Math.min(clampedEnd, chunkEnd) - chunkStart;
            result.set(chunk.subarray(copyStart, copyEnd), resultOffset);
            resultOffset += copyEnd - copyStart;
            chunkStart = chunkEnd;
        }

        return result;
    }

    private trimAudioBefore(sampleIndex: number) {
        if (sampleIndex <= 0 || this._audioChunks.length === 0) {
            return;
        }

        let remainingToTrim = Math.min(sampleIndex, this._audioLength);
        const retainedChunks: Float32Array[] = [];
        for (const chunk of this._audioChunks) {
            if (remainingToTrim >= chunk.length) {
                remainingToTrim -= chunk.length;
                this._audioLength -= chunk.length;
                continue;
            }

            if (remainingToTrim > 0) {
                retainedChunks.push(chunk.slice(remainingToTrim));
                this._audioLength -= remainingToTrim;
                remainingToTrim = 0;
            }
            else {
                retainedChunks.push(chunk);
            }
        }
        this._audioChunks = retainedChunks;
    }

    private appendAudio(newSamples: Float32Array) {
        if (newSamples.length === 0) {
            return;
        }
        this._audioChunks.push(newSamples);
        this._audioLength += newSamples.length;
    }

    private getTranscriptPlugin() {
        if (this._transcriptPlugin) {
            return this._transcriptPlugin;
        }

        const result = this._player.getPlugin("es.upv.paella.transcriptInteractiveAreaPlugin");
        if (!result || !result.interactiveArea) {
            throw new Error("The transcript interactive area plugin is not loaded. Enable 'es.upv.paella.transcriptInteractiveAreaPlugin' in the player configuration.");
        }

        this._transcriptPlugin = result.interactiveArea;
        return this._transcriptPlugin;
    }

    private findCurrentChunk(currentTime: number) {
        return this._transcriptChunks.find(
            chunk => currentTime >= chunk.startTime && currentTime < chunk.startTime + chunk.duration
        ) || null;
    }

    private async pushTranscription(printableText: string) {
        try {
            const transcriptPlugin = this.getTranscriptPlugin();
            const currentTime = await this._player.currentTime() || 0;
            const chunk = this.findCurrentChunk(currentTime);

            if (chunk) {
                const newText = chunk.text + printableText;
                chunk.text = newText;
                await transcriptPlugin.updateTranscription({ id: chunk.id, text: newText });
            }
            else {
                const chunkStart = Math.floor(currentTime / this.CHUNK_DURATION) * this.CHUNK_DURATION;
                const id = await transcriptPlugin.addTranscription({ text: printableText, state: "current" });
                this._transcriptChunks.push({ startTime: chunkStart, duration: this.CHUNK_DURATION, id, text: printableText });

                if (this._transcriptChunks.length > MAX_TRANSCRIPT_CHUNKS) {
                    this._transcriptChunks = this._transcriptChunks.slice(-MAX_TRANSCRIPT_CHUNKS);
                }
            }
        }
        catch (error) {
            console.error("Failed to push transcription:", error);
        }
    }

    private showTranscriptPanel() {
        this._player.videoCanvasArea?.showInteractiveAreaPlugin("es.upv.paella.transcriptInteractiveAreaPlugin");
    }

    private hideTranscriptPanel() {
        this._player.videoCanvasArea?.hidePanel();
    }

    private cleanupAudio() {
        this._isRecording = false;

        try {
            this._workletNode?.disconnect();
            this._silentGainNode?.disconnect();
        }
        catch {
            // Ignore disconnect errors if graph is already detached.
        }

        if (this._workletNode) {
            this._workletNode.port.onmessage = null;
        }

        this._audioChunks = [];
        this._audioLength = 0;
    }

    private waitUntil(condition: () => boolean): Promise<void> {
        return new Promise((resolve) => {
            if (condition()) return resolve();
            const interval = setInterval(() => {
                if (condition()) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50);
        });
    }

    private async runTranscription(model: PreTrainedModel, processor: Processor) {
        let audioOffset = 0;
        // Absolute sample index where the next generate() session must resume.
        // It tracks the processing frontier (next chunk to read), NOT audioOffset,
        // which lags up to MAX_AUDIO_BUFFER_SECONDS behind for context.
        let frontier = 0;
        const audioLength = () => audioOffset + this.audioLength;
        const audioRange = (start: number, end: number) =>
            this.getAudioRange(start - audioOffset, end - audioOffset);

        const runtimeProcessor = processor as any;
        const numSamplesFirst = runtimeProcessor.num_samples_first_audio_chunk;
        const featureExtractor = runtimeProcessor.feature_extractor;
        const { hop_length, n_fft } = featureExtractor.config;
        const winHalf = Math.floor(n_fft / 2);
        const samplesPerTok = runtimeProcessor.audio_length_per_tok * hop_length;
        const tokenizer = runtimeProcessor.tokenizer;
        const specialIds = new Set(tokenizer.all_special_ids.map(BigInt));
        const { BaseStreamer } = await import("@huggingface/transformers");
        const thisPlugin = this;

        try {
            // A single generate() call is bounded by max_new_tokens, so for a long
            // video the budget is exhausted after a few minutes and generate()
            // resolves on its own. Run consecutive streaming sessions, each resuming
            // from the current processing frontier, until transcription is stopped.
            while (!this._stopRequested) {
                const sessionBase = frontier;

                await this.waitUntil(
                    () => audioLength() >= sessionBase + numSamplesFirst || this._stopRequested
                );

                if (this._stopRequested) {
                    break;
                }

                const firstChunkInputs = await runtimeProcessor(
                    audioRange(sessionBase, sessionBase + numSamplesFirst),
                    { is_streaming: true, is_first_audio_chunk: true },
                );

                let tokenCache: bigint[] = [];
                let printLen = 0;
                let isPrompt = true;

                const flushDecodedText = () => {
                    if (tokenCache.length === 0) {
                        return;
                    }

                    const text = tokenizer.decode(tokenCache, {
                        skip_special_tokens: true,
                    });
                    const printableText = text.slice(printLen);
                    printLen = text.length;

                    if (printableText.length > 0) {
                        thisPlugin.pushTranscription(printableText);
                    }
                };

                async function* inputFeaturesGenerator() {
                    yield firstChunkInputs.input_features;
                    let melFrameIdx = runtimeProcessor.num_mel_frames_first_audio_chunk;
                    let startIdx = sessionBase + melFrameIdx * hop_length - winHalf;
                    frontier = startIdx;

                    const trimBefore = Math.max(0, startIdx - winHalf);
                    if (trimBefore > audioOffset) {
                        thisPlugin.trimAudioBefore(trimBefore - audioOffset);
                        audioOffset = trimBefore;
                    }

                    while (!thisPlugin._stopRequested) {
                        const endNeeded =
                            startIdx + runtimeProcessor.num_samples_per_audio_chunk;

                        await thisPlugin.waitUntil(
                            () => audioLength() >= endNeeded || thisPlugin._stopRequested
                        );

                        if (thisPlugin._stopRequested) break;

                        const availableSamples = audioLength();
                        let batchEndSample = endNeeded;
                        while (batchEndSample + samplesPerTok <= availableSamples) {
                            batchEndSample += samplesPerTok;
                        }

                        const chunkInputs = await runtimeProcessor(
                            audioRange(startIdx, batchEndSample),
                            { is_streaming: true, is_first_audio_chunk: false },
                        );

                        yield chunkInputs.input_features;

                        melFrameIdx += chunkInputs.input_features.dims[2];
                        startIdx = sessionBase + melFrameIdx * hop_length - winHalf;
                        frontier = startIdx;

                        const newTrimPoint = batchEndSample - winHalf;
                        if (newTrimPoint > audioOffset) {
                            const maxKeep = MAX_AUDIO_BUFFER_SECONDS * thisPlugin._sampleRate;
                            const consumed = newTrimPoint - audioOffset;
                            if (consumed > maxKeep) {
                                thisPlugin.trimAudioBefore(consumed - maxKeep);
                                audioOffset += consumed - maxKeep;
                            }
                        }
                    }
                }

                const streamer = new (class extends BaseStreamer {
                    put(value: bigint[][]) {
                        if (thisPlugin._stopRequested) {
                            return;
                        }

                        if (isPrompt) {
                            isPrompt = false;
                            return;
                        }

                        const tokens = value[0];

                        if (tokens.length === 1 && specialIds.has(tokens[0])) {
                            return;
                        }

                        tokenCache.push(...tokens);
                        flushDecodedText();
                    }

                    end() {
                        if (thisPlugin._stopRequested) {
                            tokenCache = [];
                            printLen = 0;
                            isPrompt = true;
                            return;
                        }

                        flushDecodedText();
                        tokenCache = [];
                        printLen = 0;
                        isPrompt = true;
                    }
                })();

                await (model as any).generate({
                    input_ids: firstChunkInputs.input_ids,
                    input_features: inputFeaturesGenerator(),
                    max_new_tokens: 256,
                    streamer: streamer as any,
                });
            }
        } catch (error) {
            if (!this._stopRequested) {
                console.error("Transcription error:", error);
                this._error = this.getErrorMessage(error, "Transcription failed");
                this.notifyUpdate();
            }
        } finally {
            this.cleanupAudio();
            this._status = "ready";
            this.notifyUpdate();
        }
    }

    async loadModel() {
        if (this._status === "loading" || this._status === "ready") {
            return;
        }

        this.unloadModel();
        this._status = "loading";
        this._loadingProgress = 0;
        this._loadingMessage = "Preparing model download...";
        this._error = null;
        this.notifyUpdate();

        try {
            const progressMap = new Map<string, number>();
            const progressCallback = (info: ProgressInfo) => {
                if (
                    info.status !== "progress" ||
                    !info.file.endsWith(".onnx_data") ||
                    info.total === 0
                ) {
                    return;
                }

                progressMap.set(info.file, info.loaded / info.total);

                const totalProgress = Array.from(progressMap.values()).reduce(
                    (sum, value) => sum + value,
                    0,
                );

                this._loadingMessage = "Downloading model...";
                this._loadingProgress = Math.min((totalProgress / MODEL_FILE_COUNT) * 100, 100);
                this.notifyUpdate();
            };

            const {VoxtralRealtimeForConditionalGeneration} = await import("@huggingface/transformers");
            const {VoxtralRealtimeProcessor} = await import("@huggingface/transformers");
            const model =
                await VoxtralRealtimeForConditionalGeneration.from_pretrained(
                    MODEL_ID,
                    {
                        dtype: {
                            audio_encoder: "q4f16",
                            embed_tokens: "q4f16",
                            decoder_model_merged: "q4f16",
                        },
                        device: "webgpu",
                        progress_callback: progressCallback,
                    },
                );

            this._loadingMessage = "Loading processor...";
            const processor =
                await VoxtralRealtimeProcessor.from_pretrained(MODEL_ID);

            this._model = model;
            this._processor = processor;
            this._loadingProgress = 100;
            this._loadingMessage = "Model ready";
            this._status = "ready";
            this.notifyUpdate();
        }
        catch (error) {
            console.error("Failed to load model:", error);
            this._error = this.getErrorMessage(error, "Failed to load model");
            this._loadingMessage = "Initialization failed";
            this._status = "error";
            this.notifyUpdate();
        }
    }

    async startTranscribing() {
        if (!this._model || !this._processor) {
            this._error = "Model not loaded";
            this._status = "error";
            this.notifyUpdate();
            return;
        }

        this._error = null;
        this._audioChunks = [];
        this._audioLength = 0;
        this._transcriptChunks = [];

        this._isRecording = true;
        this._stopRequested = false;
        this._status = "transcribing";
        this.notifyUpdate();

        this.showTranscriptPanel();

        try {
            if (this._audioContext === null) {
                this._audioContext = this._player.videoContainer!.streamProvider.audioContext;
            }
            const audioContext = this._audioContext;
            this._sampleRate = audioContext.sampleRate;
            await audioContext.resume();

            if (this._sourceNode === null) {
                this._sourceNode = this._player.videoContainer!.streamProvider.audioSourceNode;
            }

            if (this._silentGainNode === null) {
                this._silentGainNode = audioContext.createGain();
                this._silentGainNode.gain.value = 0;
            }

            if (this._workletNode === null) {
                const workletBlob = new Blob([CAPTURE_WORKLET_SOURCE], {
                    type: "application/javascript",
                });
                const workletUrl = URL.createObjectURL(workletBlob);
                await audioContext.audioWorklet.addModule(workletUrl);
                URL.revokeObjectURL(workletUrl);

                this._workletNode = new AudioWorkletNode(
                    audioContext,
                    CAPTURE_PROCESSOR_NAME,
                );
            }

            this._workletNode.port.onmessage = (event: MessageEvent<Float32Array>) => {
                if (this._isRecording) {
                    this.appendAudio(new Float32Array(event.data));
                }
            };

            // Rebuild graph every start to avoid duplicated connections.
            try {
                this._workletNode.disconnect();
                this._silentGainNode.disconnect();
            }
            catch {
                // Graph may already be disconnected.
            }

            this._sourceNode.connect(this._workletNode);
            this._workletNode.connect(this._silentGainNode);
            this._silentGainNode.connect(this._player.videoContainer!.streamProvider.audioDestinationNode);


            await this.runTranscription(this._model, this._processor);
        }
        catch (error) {
            console.error("Recording error:", error);
            this.cleanupAudio();
            this._error = this.getErrorMessage(error, "Recording failed");
            this._status = "ready";
            this.notifyUpdate();
        }
        finally {
            this.hideTranscriptPanel();
        }
    }

    stopTranscribing() {
        this._stopRequested = true;
        this._isRecording = false;
        this.cleanupAudio();
        this.hideTranscriptPanel();
    }

    resetSession(): void {
        this._stopRequested = false;
        this._audioChunks = [];
        this._audioLength = 0;
        this._transcriptChunks = [];

        try {
            const transcriptPlugin = this.getTranscriptPlugin();
            transcriptPlugin.clearTranscriptions();
        }
        catch {
            // Transcript plugin not available
        }

        this.notifyUpdate();
    }

    unloadModel(): void {
        if (this._status === "transcribing") {
            this.stopTranscribing();
        }

        try {
            (this._model as any)?.dispose?.();
        }
        catch {
            // Model may already be disposed
        }

        this._model = null;
        this._processor = null;
        this._audioChunks = [];
        this._audioLength = 0;
        this._transcriptChunks = [];
        this._transcriptPlugin = null;
        this._status = "idle";
        this._error = null;
        this.notifyUpdate();
    }
}
