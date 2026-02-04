import VideoPlugin, { Video } from '../core/VideoPlugin';
import { resolveResourcePath, supportsVideoType } from '../core/utils';
import Paella from '../Paella';
import PaellaCoreVideoFormats from './PaellaCoreVideoFormats';
import { HtmlVideo } from './es.upv.paella.htmlVideoFormat';
import VideoQualityItem from '../core/VideoQualityItem';

interface Mp4Source {
    src: string;
    mimetype?: string;
    res: {
        w: string | number;
        h: string | number;
    };
}

interface StreamData {
    sources: {
        mp4?: Mp4Source[];
    };
    content?: string;
}

interface HtmlVideoConfig {
    crossOrigin?: string | false;
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

export class Mp4Video extends Video {
    protected _sources!: Mp4Source[];
    protected _currentSource!: Mp4Source;
    protected _streamData!: StreamData;
    protected _initialVolume?: number;

    isMainAudio: boolean;
    
    protected _config: HtmlVideoConfig;
    protected _videoEnabled: boolean;
    protected _currentQuality!: number;
    protected _endedCallback?: () => void;
    protected _handleLoadedCallback?: (evt: Event) => void;
    protected _disabledProperties!: DisabledProperties;
    protected video!: HTMLVideoElement;

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

    async getQualities(): Promise<VideoQualityItem[]> {
        return [];
    }

    async setQuality(q: VideoQualityItem): Promise<boolean> {
        return false;
    }

    get currentQuality(): VideoQualityItem | null {
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

    // This function is called when the player loads, and it should
    // make everything ready for video playback to begin.
    async loadStreamData(streamData: any = null): Promise<boolean> {
        this._streamData = this._streamData || streamData!;
        this.player.log.debug("es.upv.paella.mp4VideoFormat: loadStreamData");

        if (!this._currentSource) {
            this._sources = streamData!.sources.mp4!;
            this._sources.sort((a, b) => {
                return Number(a.res.w) - Number(b.res.w);
            });
            this._currentQuality = this._sources.length - 1;
            this._currentSource = this._sources[this._currentQuality];
        }

        if (!this.isMainAudioPlayer) {
            this.video.muted = true;
        }

        if (this._initialVolume) {
            this.video.volume = this._initialVolume;
            if (this._initialVolume === 0) {
                this.video.muted = true;
            }
        }
        
        this.video.src = resolveResourcePath(this.player, this._currentSource.src);
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
        
        this.player.log.debug(`es.upv.paella.mp4VideoFormat (${ this.streamData.content }): video loaded and ready.`);
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

export default class Mp4VideoPlugin extends VideoPlugin {
    getPluginModuleInstance(): PaellaCoreVideoFormats {
        return PaellaCoreVideoFormats.Get();
    }
    
    get name(): string {
		return super.name || "es.upv.paella.mp4VideoFormat";
	}

    get streamType(): string {
        return "mp4";
    }

    async isCompatible(streamData: any): Promise<boolean> {
        const { mp4 } = streamData.sources;
        return mp4 != null && mp4[0]?.mimetype && supportsVideoType(mp4[0].mimetype);
    }

    async getVideoInstance(playerContainer: HTMLElement, isMainAudio: boolean): Promise<Video | null> {
        return new Mp4Video(this.player, playerContainer, isMainAudio, this.config as any);
    }
    
    getCompatibleFileExtensions(): string[] {
        return ["m4v","mp4"];
    }

    getManifestData(fileUrls: string[]): { mp4: Mp4Source[] } {
        return {
            mp4: fileUrls.map(url => ({
                src: url,
                mimetype: 'video/mp4',
                res: { w: 0, h: 0 }
            }))
        };
    }
}
