import VideoPlugin, { Video } from '../core/VideoPlugin';
import { resolveResourcePath } from '../core/utils';
import Paella from '../Paella';
import PaellaCoreVideoFormats from './PaellaCoreVideoFormats';

interface AudioSource {
    src: string;
}

interface StreamData {
    sources: {
        audio?: AudioSource[];
    };
    content?: string;
}

function getAsyncImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", evt => {
            resolve(img);
        });
        img.addEventListener("error", evt => {
            reject(new Error("Could not load preview image. The preview image is required in audio only streams"));
        });
        img.src = src;
    });
}

function asyncLoadAudio(player: Paella, audio: HTMLAudioElement, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        audio.oncanplay = () => resolve();
        audio.onerror = () => reject(new Error(player.translate("Error loading audio: $1", [src])));
        audio.src = resolveResourcePath(player, src);
        resolve();
    });
}


export class AudioOnlyVideo extends Video {
    isMainAudio: boolean;
    _ready: boolean;
    _previewImage!: HTMLImageElement;
    _imageContainer!: HTMLDivElement;
    _source!: AudioSource;
    _streamData!: StreamData;
    audio!: HTMLAudioElement;

    constructor(player: Paella, parent: HTMLElement, isMainAudio: boolean) {
        super('audio', player, parent);

        this.isMainAudio = isMainAudio;
        this._ready = false;
    }

    get streamType(): string { return "audio"; }

    waitForLoaded(): Promise<void> {
        return new Promise(resolve => {
            const waitReady = () => {
                if (this._ready) {
                    resolve();
                }
                else {
                    setTimeout(waitReady, 100);
                }
            }
    
            waitReady();
        });
    }

    async play(): Promise<boolean> {
        await this.waitForLoaded();
        await this.audio.play();
        return true;
    }

    async pause(): Promise<boolean> {
        await this.waitForLoaded();
        this.audio.pause();
        return true;
    }

    async duration(): Promise<number> {
        await this.waitForLoaded();
        return this.audio.duration;
    }

    get currentTimeSync(): number {
        return this.audio?.currentTime || 0;
    }

    async currentTime(): Promise<number> {
        await this.waitForLoaded();
        return this.audio.currentTime;
    }

    async setCurrentTime(t: number): Promise<boolean> {
        await this.waitForLoaded();
        this.audio.currentTime = t;
        return true;
    }

    async volume(): Promise<number> {
        await this.waitForLoaded();
        return this.audio.volume;
    }

    async setVolume(v: number): Promise<boolean> {
        await this.waitForLoaded();
        this.audio.volume = v;
        return true;
    }

    async paused(): Promise<boolean> {
        await this.waitForLoaded();
        return this.audio.paused;
    }

    async playbackRate(): Promise<number> {
        await this.waitForLoaded();
        return this.audio.playbackRate;
    }

    async setPlaybackRate(pr: number): Promise<boolean> {
        await this.waitForLoaded();
        this.audio.playbackRate = pr;
        return true;
    }

    // getQualities(), setQuality(q), get currentQuality(): audio format does not support multiquality

    async getDimensions(): Promise<{ w: number; h: number; }> {
        return { 
            w: this._previewImage.width, 
            h: this._previewImage.height
        };
    }

    async loadStreamData(streamData: StreamData | null = null): Promise<boolean> {
        this._streamData = this._streamData || streamData!;
        this.player.log.debug("es.upv.paella.audioVideoFormat: loadStreamData");

        const previewSrc = this.player.videoManifest.metadata.preview;
        if (!previewSrc || previewSrc == null) {
            throw new Error("Invalid video manifest data: preview image is required");
        }
        this._previewImage = await getAsyncImage(previewSrc);
        this._imageContainer = document.createElement("div");
        this._imageContainer.className = "image-container";
        if (this.parent) {
            this.parent.appendChild(this._imageContainer);
            this._imageContainer.appendChild(this._previewImage);
        }

        this._source = streamData!.sources.audio?.[0]!;
        if (!this._source) {
            throw new Error("Invalid source in audio only video stream");
        }

        if (!this.isMainAudioPlayer) {
            throw new Error("Audio only video stream must be main audio player. Check the role property at video manifest");
        }

        await asyncLoadAudio(this.player, this.audio, this._source.src);

        const fixAspectRatio = () => {
            if (!this.player.videoContainer?.baseVideoRect.offsetWidth ||
                !this.player.videoContainer?.baseVideoRect.offsetHeight) {
                return;
            }
            const parentRatio = 
                this.player.videoContainer?.baseVideoRect.offsetWidth /
                this.player.videoContainer?.baseVideoRect.offsetHeight;
            const imageRatio = this._previewImage.width / this._previewImage.height;
            if (parentRatio > imageRatio) {
                this._previewImage.classList.add('landscape');
                this._previewImage.classList.remove('portrait');
            }
            else {
                this._previewImage.classList.add('portrait');
                this._previewImage.classList.remove('landscape');
            }
        };

        if (this.player.frameList.frames.length > 0) {
            this.audio.addEventListener("timeupdate", (evt: Event) => {
                const img = this.player.frameList.getImage((evt.target as HTMLAudioElement).currentTime, true);
                if (this._previewImage.src != img.url) {
                    this._previewImage.src = img.url;
                    this._previewImage.onload = () => fixAspectRatio();
                }
            });
        }

        window.addEventListener("resize", evt => fixAspectRatio());
        fixAspectRatio();

        this._ready = true;
        return true;
    }
}

export default class AudioVideoPlugin extends VideoPlugin {
    getPluginModuleInstance(): PaellaCoreVideoFormats {
        return PaellaCoreVideoFormats.Get();
    }

    get name(): string {
		return super.name || "es.upv.paella.audioVideoFormat";
	}

    get streamType(): string {
        return "audio";
    }

    async isCompatible(streamData: StreamData): Promise<boolean> {
        return streamData.sources.audio != null;
    }

    async getVideoInstance(playerContainer: HTMLElement, isMainAudio: boolean): Promise<Video | null> {
        return new AudioOnlyVideo(this.player, playerContainer, isMainAudio);
    }

    getCompatibleFileExtensions(): string[] {
        return ["m4a","mp3"];
    }

    getManifestData(fileUrls: string[]): { audio: AudioSource[] } {
        return {
            audio: fileUrls.map(url => ({
                src: url
            }))
        };
    }
}
