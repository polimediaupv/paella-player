import VideoPlugin from '../core/VideoPlugin';
import { resolveResourcePath, supportsVideoType } from '../core/utils';
import Paella from '../Paella';
import PaellaCoreVideoFormats from './PaellaCoreVideoFormats';
import { HtmlVideo } from './es.upv.paella.htmlVideoFormat';

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

export class Mp4Video extends HtmlVideo {
    // @ts-expect-error - More specific type than parent
    declare _sources: Mp4Source[];
    _currentQuality!: number;
    _currentSource!: Mp4Source;
    // @ts-expect-error - More specific type than parent
    declare _streamData: StreamData;
    _initialVolume?: number;
    _endedCallback?: () => void;

    constructor(player: Paella, parent: HTMLElement, isMainAudio: boolean, config?: HtmlVideoConfig) {
        super(player, parent, isMainAudio, config);
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

    // @ts-expect-error - Returns actual instance instead of null
    async getVideoInstance(playerContainer: HTMLElement, isMainAudio: boolean) {
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
