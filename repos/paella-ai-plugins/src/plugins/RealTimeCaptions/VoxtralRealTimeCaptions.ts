import type {
    PreTrainedModel,
    Processor,
    ProgressInfo
} from "@huggingface/transformers";
import { RealTimeCaptions, type RTCStatus } from "./RealTimeCaptions";



const MODEL_ID = "onnx-community/Voxtral-Mini-4B-Realtime-2602-ONNX";
const SAMPLE_RATE = 16000;
const MODEL_FILE_COUNT = 3;
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
    private _transcript: string = "";

    private _model: PreTrainedModel | null = null;
    private _processor: Processor | null = null;
    private _isRecording: boolean = false;
    private _stopRequested: boolean = false;
    private _audioBuffer: Float32Array = new Float32Array(0);
    private _audioContext: AudioContext | null = null;
    private _sourceNode: MediaElementAudioSourceNode | null = null;
    private _silentGainNode: GainNode | null = null;
    private _connectedVideoElement: HTMLVideoElement | null = null;
    private _workletNode: AudioWorkletNode | null = null;



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

    get transcript() {
        return this._transcript;
    }

    private getErrorMessage(error: unknown, fallback: string) {
        return error instanceof Error ? error.message : fallback;
    }

    private appendAudio(newSamples: Float32Array) {
        if (newSamples.length === 0) {
            return;
        }

        const previousSamples = this._audioBuffer;
        const mergedSamples = new Float32Array(
            previousSamples.length + newSamples.length,
        );
        mergedSamples.set(previousSamples);
        mergedSamples.set(newSamples, previousSamples.length);
        this._audioBuffer = mergedSamples;
    }

    private cleanupAudio() {
        this._isRecording = false;

        try {
            this._sourceNode?.disconnect();
            this._workletNode?.disconnect();
            this._silentGainNode?.disconnect();
        }
        catch {
            // Ignore disconnect errors if graph is already detached.
        }

        if (this._workletNode) {
            this._workletNode.port.onmessage = null;
        }

        if (this._audioContext?.state === "running") {
            void this._audioContext.suspend();
        }
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

        const audio = () => this._audioBuffer;
        const runtimeProcessor = processor as any;
        const numSamplesFirst = runtimeProcessor.num_samples_first_audio_chunk;
        await this.waitUntil(
            () => audio().length >= numSamplesFirst || this._stopRequested,
        );

        if (this._stopRequested) {
            this.cleanupAudio();
            this._status = "ready";
            this.notifyUpdate();
            return;
        }

        const firstChunkInputs = await runtimeProcessor(
            audio().subarray(0, numSamplesFirst),
            { is_streaming: true, is_first_audio_chunk: true },
        );

        const featureExtractor = runtimeProcessor.feature_extractor;
        const { hop_length, n_fft } = featureExtractor.config;
        const winHalf = Math.floor(n_fft / 2);
        const samplesPerTok = runtimeProcessor.audio_length_per_tok * hop_length;

        const thisPlugin = this;
        async function* inputFeaturesGenerator() {
            yield firstChunkInputs.input_features;

            let melFrameIdx = runtimeProcessor.num_mel_frames_first_audio_chunk;
            let startIdx = melFrameIdx * hop_length - winHalf;

            while (!thisPlugin._stopRequested) {
                const endNeeded =
                    startIdx + runtimeProcessor.num_samples_per_audio_chunk;

                await thisPlugin.waitUntil(
                    () => audio().length >= endNeeded || thisPlugin._stopRequested,
                );

                if (thisPlugin._stopRequested) break;

                const availableSamples = audio().length;
                let batchEndSample = endNeeded;
                while (batchEndSample + samplesPerTok <= availableSamples) {
                    batchEndSample += samplesPerTok;
                }

                const chunkInputs = await runtimeProcessor(
                    audio().slice(startIdx, batchEndSample),
                    { is_streaming: true, is_first_audio_chunk: false },
                );

                yield chunkInputs.input_features;

                melFrameIdx += chunkInputs.input_features.dims[2];
                startIdx = melFrameIdx * hop_length - winHalf;
            }
        }

        const tokenizer = runtimeProcessor.tokenizer;
        const specialIds = new Set(tokenizer.all_special_ids.map(BigInt));
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
                // TODO: this is a bit hacky
                this._transcript += printableText;
                this.notifyUpdate();
            }
        };
        
        const {BaseStreamer} = await import("@huggingface/transformers");
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

                tokenCache = tokenCache.concat(tokens);
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

        try {
            await (model as any).generate({
                input_ids: firstChunkInputs.input_ids,
                input_features: inputFeaturesGenerator(),
                max_new_tokens: 4096,
                streamer: streamer as any,
            });
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

    async startTranscribing(videoElement: HTMLVideoElement) {      
        console.log("uuuuuuuu")  
        if (!this._model || !this._processor) {
            this._error = "Model not loaded";
            this._status = "error";
            this.notifyUpdate();
            return;
        }
        
        this._error = null;
        this._audioBuffer = new Float32Array(0);
        this._isRecording = true;
        this._stopRequested = false;
        this._status = "transcribing";
        this.notifyUpdate();

        try {
            // const stream = await navigator.mediaDevices.getUserMedia({
            //     audio: {
            //         channelCount: 1,
            //         sampleRate: SAMPLE_RATE,
            //     },
            // });
            // this._mediaStream = stream;

            if (this._audioContext === null) {
                this._audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
            }
            const audioContext = this._audioContext;
            await audioContext.resume();

            if (this._sourceNode === null) {
                this._sourceNode = audioContext.createMediaElementSource(videoElement);
                this._connectedVideoElement = videoElement;
            }
            else if (this._connectedVideoElement !== videoElement) {
                throw new Error("This transcription instance is already bound to another video element");
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
                this._sourceNode.disconnect();
                this._workletNode.disconnect();
                this._silentGainNode.disconnect();
            }
            catch {
                // Graph may already be disconnected.
            }

            this._sourceNode.connect(audioContext.destination);
            this._sourceNode.connect(this._workletNode);
            this._workletNode.connect(this._silentGainNode);
            this._silentGainNode.connect(audioContext.destination);


            await this.runTranscription(this._model, this._processor);
        }
        catch (error) {
            console.error("Recording error:", error);
            this.cleanupAudio();
            this._error = this.getErrorMessage(error, "Recording failed");
            this._status = "ready";
            this.notifyUpdate();
        }
    }

    stopTranscribing() {
        this._stopRequested = true;
        this._isRecording = false;
        this.cleanupAudio();
    }

    resetSession(): void {
        this._stopRequested = false;
        this._audioBuffer = new Float32Array(0);
        this._transcript = "";
        // this._error = null;
        this.notifyUpdate();
    }
}
