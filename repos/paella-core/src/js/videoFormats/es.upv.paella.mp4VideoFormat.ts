import VideoPlugin, { Video } from '../core/VideoPlugin';
import { resolveResourcePath, supportsVideoType } from '../core/utils';
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

export class Mp4Video extends HtmlVideo<Mp4Source, StreamData> {
    protected _currentSource!: Mp4Source;
    protected _initialVolume?: number;

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
        return this.finishLoading("es.upv.paella.mp4VideoFormat");
    }
}

export default class Mp4VideoPlugin extends VideoPlugin {
    getPluginModuleInstance(): PaellaCoreVideoFormats {
        return PaellaCoreVideoFormats.Get();
    }

    get name(): string {
		return "es.upv.paella.mp4VideoFormat";
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
