import { VideoPlugin, VideoQualityItem, Mp4Video, utils, Mp4Source } from '@asicupv/paella-core';
import VideoPluginsModule from './VideoPluginsModule';

export class Mp4MultiQualityVideo extends Mp4Video {
    protected _sources: Mp4Source[] = [];
    private _qualities: VideoQualityItem[] | null = null
    private _currentQualityItem: VideoQualityItem | null = null;

    async getQualities(): Promise<VideoQualityItem[]> {
        if (!this._qualities) {
            this._qualities = this._sources.map((src: any, i: number) => new VideoQualityItem({
                index: i,
                label: `${src.res.w}x${src.res.h}`,
                shortLabel: `${src.res.h}p`,
                width: src.res.w,
                height: src.res.h,
                src: src.src,
            }));
        }

        return this._qualities;
    }

    async setQuality(q: VideoQualityItem): Promise<boolean> {
        if (!(q instanceof VideoQualityItem)) {
            throw new Error("Invalid parameter setting video quality");
        }

        this.player.log.debug(`es.upv.paella.mp4MultiQualityVideoFormat: Change video quality to ${q.shortLabel}`);
        this._currentQualityItem = q;

        // Clear data, set the `src` attribute to the new video file and then
        // set some values to previous values.
        const currentTime = this.video.currentTime;
        const playbackRate = this.video.playbackRate;
        this.clearStreamData();
        this.video.src = q.src;
        this.video.currentTime = currentTime;
        this.video.playbackRate = playbackRate;
        if (this._endedCallback) {
            this.video.addEventListener('ended', this._endedCallback);
        }

        // Wait for the `canplay` event to know that the video has loaded sufficiently.
        await new Promise(resolve => {
            const f = () => {
                this.video.pause();
                this.video.removeEventListener('canplay', f);
                resolve(null);
            };
            this.video.addEventListener('canplay', f);
        });
        return true;
    }

    get currentQuality(): VideoQualityItem | null {
        return this._currentQualityItem;
    }

    async loadStreamData(streamData: any = null): Promise<boolean> {
        // this.player.log.debug("es.upv.paella.mp4MultiQualityVideoFormat: loadStreamData");
        this._sources = streamData.sources.mp4;
        this._sources.sort((a: any, b: any) => {
            return Number(a.res.w) - Number(b.res.w);
        });

        if (!this._qualities) {
            const qualities = await this.getQualities();

            // Select a fitting initial quality
            const screenRes = [window.screen.width, window.screen.height]
                .map((x: number) => x * window.devicePixelRatio);
            let screenMin = Math.min(screenRes[0], screenRes[1]);
            let screenMax = Math.max(screenRes[0], screenRes[1]);

            // This is the test recommended by MDN:
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
            //
            // Of course, ideally one wouldn't have to look at the user agent string
            // at all and would get the information one wants via different means.
            // But for what we want to query, there are no different means. The
            // `devicePixelRatio` helps only marginally. Network speed information
            // API is still unstable. Since this is only the initial quality and
            // this test works well the vast majority of times, it makes sense to
            // just use it. We use something between 720p and 1080p as resolution
            // target. The YouTube app seems to use 720p as default.
            const isMobile = /Mobi/i.test(window.navigator.userAgent);
            if (isMobile) {
                screenMin = Math.max(screenMin, 900);
                screenMax = Math.max(screenMin, 1600);
            }

            // Find the largest video that still fully fits inside the screen. The
            // array is already sorted in ascending order. Note that we only
            // compare the minimums and maximums to not run into landscape vs.
            // portrait mode problems. Ideally, we would change the quality when
            // the device is turned, but that would be way more involved.
            let qualityIndex = 0;
            for (let i = 1; i < this._sources.length; i += 1) {
                const src = this._sources[i];
                const w = typeof src.res.w === "string" ? parseInt(src.res.w) : src.res.w;
                const h = typeof src.res.h === "string" ? parseInt(src.res.h) : src.res.h;
                const srcMin = Math.min(w, h);
                const srcMax = Math.max(w, h);
                if (srcMin <= screenMin && srcMax <= screenMax) {
                    qualityIndex = i;
                }
            }

            this._currentQuality = qualityIndex;
            this._currentQualityItem = qualities[qualityIndex];
        }
        this._currentSource = this._sources[this._currentQuality];

        return await super.loadStreamData(streamData);
    }
}

export default class Mp4MultiQualityVideoFormatPlugin extends VideoPlugin {
    getPluginModuleInstance() {
        return VideoPluginsModule.Get();
    }
    
    get streamType(): string {
        return "mp4";
    }

    get name(): string {
        return "es.upv.paella.mp4MultiQualityVideoFormat";
    }

    async isCompatible(streamData: any): Promise<boolean> {
        const { mp4 } = streamData.sources;
        return mp4 && utils.supportsVideoType(mp4[0]?.mimetype);
    }

    async getVideoInstance(playerContainer: HTMLElement, isMainAudio: boolean): Promise<Mp4MultiQualityVideo> {
        return new Mp4MultiQualityVideo(this.player, playerContainer, isMainAudio, this.config as any);
    }
}