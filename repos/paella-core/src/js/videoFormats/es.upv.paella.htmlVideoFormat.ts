import { getFileExtension, resolveResourcePath, supportsVideoType } from "../core/utils";
import VideoPlugin, { Video } from "../core/VideoPlugin";
import VideoQualityItem from "../core/VideoQualityItem";
import Paella from "../Paella";
import PaellaCoreVideoFormats from "./PaellaCoreVideoFormats";

interface HtmlSource {
    src: string;
    mimetype: string;
}

interface StreamData {
    sources: {
        html?: HtmlSource[];
    };
    content?: string;
}

interface DisabledProperties {
    duration: number;
    volume: number;
    videoWidth: number;
    videoHeight: number;
    playbackRate: number;
    paused: boolean;
    currentTime: number;
}

interface HtmlVideoConfig {
    crossOrigin?: string | false;
}

export class HtmlVideo extends Video {
    _config: HtmlVideoConfig;
    isMainAudio: boolean;
    _videoEnabled: boolean;
    _sources!: HtmlSource[];
    _currentQuality!: number;
    _endedCallback?: () => void;
    _handleLoadedCallback?: (evt: Event) => void;
    _streamData!: StreamData;
    _disabledProperties!: DisabledProperties;
    video!: HTMLVideoElement;

    constructor(player: Paella, parent: HTMLElement, isMainAudio: boolean, config?: HtmlVideoConfig) {
        super('video', player, parent);
        this._config = config || {};

        const crossorigin = this._config.crossOrigin ?? "";
        this.element.setAttribute("playsinline","");
        if (crossorigin !== false) {
            this.element.setAttribute("crossorigin", crossorigin);
        }

        this.isMainAudio = isMainAudio;

        // Autoplay is required to play videos in some browsers
        this.element.setAttribute("autoplay","");
        (this.element as HTMLVideoElement).autoplay = true;

        // The video is muted by default, to allow autoplay to work
        if (!isMainAudio) {
            (this.element as HTMLVideoElement).muted = true;
        }

        this._videoEnabled = true;
    }

    async play(): Promise<boolean> { 
        if (this._videoEnabled) {
            try {
                await this.waitForLoaded();
                await this.video.play();
                return true;
            }
            catch (e) {
                // Prevent AbortError exception
                return false;
            }
        }
        else {
            this._disabledProperties.paused = false;
            return true;
        }
    }
    
    async pause(): Promise<boolean> {
        if (this._videoEnabled) {
            await this.waitForLoaded();
            this.video.pause();
            return true;
        }
        else {
            this._disabledProperties.paused = true;
            return true;
        }
    }

    async duration(): Promise<number> {
        if (this._videoEnabled) {
            await this.waitForLoaded();
            return this.video.duration;
        }
        else {
            return this._disabledProperties.duration;
        }
    }

    get currentTimeSync(): number {
        if (this._videoEnabled) {
            return this.ready ? this.video.currentTime : -1;
        }
        else {
            return this._disabledProperties.currentTime;
        }
    }
    
    async currentTime(): Promise<number> {
        if (this._videoEnabled) {
            await this.waitForLoaded();
            return this.currentTimeSync;
        }
        else {
            return this._disabledProperties.currentTime;
        }
    }

    async setCurrentTime(t: number): Promise<boolean> {
        if (this._videoEnabled) {
            await this.waitForLoaded();
            this.video.currentTime = t;
            return true;
        }
        else {
            this._disabledProperties.currentTime = t;
            return true;
        }
    }

    async volume(): Promise<number> {
        if (this._videoEnabled) {
            await this.waitForLoaded();
            return this.video.volume;
        }
        else {
            return this._disabledProperties.volume;
        }
    }

    async setVolume(v: number): Promise<boolean> {
        if (this._videoEnabled) {
            await this.waitForLoaded();
            if (v === 0) {
                this.video.setAttribute("muted", "");
            }
            else {
                this.video.removeAttribute("muted");
            }
            this.video.volume = v;
            return true;
        }
        else {
            this._disabledProperties.volume = v;
            return true;
        }
    }

    async paused(): Promise<boolean> {
        if (this._videoEnabled) {
            await this.waitForLoaded();
            return this.video.paused;
        }
        else {
            return this._disabledProperties.paused;
        }
    }

    async playbackRate(): Promise<number> {
        if (this._videoEnabled) {
            await this.waitForLoaded();
            return await this.video.playbackRate;
        }
        else {
            return this._disabledProperties.playbackRate;
        }
    }

    async setPlaybackRate(pr: number): Promise<boolean> {
        if (this._videoEnabled) {
            await this.waitForLoaded();
            this.video.playbackRate = pr;
            return true;
        }
        else {
            this._disabledProperties.playbackRate = pr;
            return true;
        }
    }

    async getQualities(): Promise<null> {
        return null;
    }

    async setQuality(q: VideoQualityItem): Promise<boolean> {
        return false;
    }

    get currentQuality(): null {
        return null;
    }

    async getDimensions() {
        if (this._videoEnabled) {
            await this.waitForLoaded();
            return { w: this.video.videoWidth, h: this.video.videoHeight };
        }
        else {
            return { w: this._disabledProperties.videoWidth, h: this._disabledProperties.videoHeight };
        }
    }

    saveDisabledProperties(video: HTMLVideoElement): void {
        this._disabledProperties = {
            duration: video.duration,
            volume: video.volume,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
            playbackRate: video.playbackRate,
            paused: video.paused,
            currentTime: video.currentTime
        };
    }

    async loadStreamData(streamData: StreamData | null = null): Promise<boolean> {
        this._streamData = this._streamData || streamData!;
        this.player.log.debug("es.upv.paella.htmlVideoFormat: loadStreamData");

        this._sources = streamData!.sources.html!;
        this._currentQuality = 0;

        if (!this.isMainAudioPlayer) {
            this.video.muted = true;
        }

        this._sources.forEach(({ src, mimetype }) => {
            src = resolveResourcePath(this.player, src);
            const source = document.createElement('source');
            source.src = src;
            source.type = mimetype;
            this.video.appendChild(source);
        });

        this._endedCallback = this._endedCallback || (() => {
            if (typeof((this as any)._videoEndedCallback) == "function") {
                (this as any)._videoEndedCallback();
            }
        });
        this.video.addEventListener("ended", this._endedCallback);

        // It's necessary to play the video because some browsers don't update the
        // readyState property until the video is played.
        try {
            await this.video.play();
        }
        catch (err) {
            // Prevent AbortError exception
        }
        await this.waitForLoaded();

        this.player.log.debug(`es.upv.paella.htmlVideoFormat (${ this.streamData.content }): video loaded and ready.`);
        this.saveDisabledProperties(this.video);
        return true;
    }

    async clearStreamData(): Promise<void> {
        this.video.src = "";
        if (this._endedCallback) {
            this.video.removeEventListener("ended", this._endedCallback);
        }
        if (this._handleLoadedCallback) {
            this.video.removeEventListener("loadeddata", this._handleLoadedCallback);
        }
        (this as any)._ready = false;
    }

    get isEnabled(): boolean {
        return this._videoEnabled;
    }

    async enable(): Promise<void> {
        this._videoEnabled = true;
    }

    async disable(): Promise<void> {
        if (this.isMainAudio) {
            this.player.log.debug("video.disable() - the video is not disabled because it is the main audio source.");
        }
        else {
            this._videoEnabled = false;
        }
    }

    waitForLoaded(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.video.readyState >= 2) {
                (this as any)._ready = true;
            }

            if (this.ready) {
                resolve();
            }
            else {
                this._handleLoadedCallback = evt => {
                    if (this.video.readyState >= 2) {
                        this.video.pause();
                        (this as any)._ready = true;
                        resolve();
                    }
                };
                this.video.addEventListener("loadeddata", this._handleLoadedCallback);
            }
        });
    }
}

export default class HtmlVideoPlugin extends VideoPlugin {
    getPluginModuleInstance(): PaellaCoreVideoFormats {
        return PaellaCoreVideoFormats.Get();
    }
    
    get name(): string {
		return super.name || "es.upv.paella.htmlVideoFormat";
	}

    get streamType(): string {
        return "html";
    }

    async isCompatible(streamData: StreamData): Promise<boolean> {
        const { html } = streamData.sources;
        return html != null && html.some(videoData => supportsVideoType(videoData.mimetype));
    }

    async getVideoInstance(playerContainer: HTMLElement, isMainAudio: boolean): Promise<Video | null> {
        return new HtmlVideo(this.player, playerContainer, isMainAudio, this.config as any);
    }

    getCompatibleFileExtensions(): string[] {
        return ["m4v","mp4","ogg","webm","ogv"];
    }

    getManifestData(fileUrls: string[]): { html: HtmlSource[] } {
        const getMimeType = (url: string): string | null => {
            switch (getFileExtension(url)) {
            case 'mp4':
            case 'm4v':
                return 'video/mp4';
            case 'webm':
                return 'video/webm';
            case 'ogg':
            case 'ogv':
                return 'video/ogg';
            default:
                return null;
            }
        };
        return {
            html: fileUrls.map(url => ({
                src: url,
                mimetype: getMimeType(url)!
            }))
        };
    }
}
