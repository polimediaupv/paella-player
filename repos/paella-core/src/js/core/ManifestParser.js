import { resolveResourcePath } from "./utils";

export default class ManifestParser {
    constructor(manifestData, player) {
        this._player = player;
        this._videoManifest = JSON.parse(JSON.stringify(manifestData));

        this._metadata = this._videoManifest.metadata || {};
        this._streams = {};
        this._frameList = {};
        this._chapters = {};
        this._trimming = this._videoManifest.trimming;
        this._captions = this._videoManifest.captions;
        this._visibleTimeLine = this._videoManifest.visibleTimeLine;

        // Check if the timeline data is Ok
        if (this._metadata.timeline &&
            (!this._metadata.timeline.url || !this._metadata.timeline.rows || !this._metadata.timeline.cols)
         ) {
            player.log.warn("ManifestParser: malformed timeline in manifest");
            this._metadata.timeline = null;
        }

        function getNativeSource() {
            if (this.streams.length !== 1) {
                return null;
            }
            if (this.isAudioOnly) {
                return this.audioOnlySource.src;
            }
            const stream = this.streams[0];
            const source = stream.sources.mp4 || stream.sources.hls || stream.sources.hlsLive;
            if (!source) {
                return null;
            }
            const video = document.createElement('video');
            if (stream.sources.mp4 && 
                stream.sources.mp4.length &&
                video.canPlayType(stream.sources.mp4[0].mimetype || "video/mp4") === "probably"
                )
            {
                return stream.sources.mp4[0].src;
            }
            const hls = stream.sources.hls || stream.sources.hlsLive;
            if (hls &&
                hls.length &&
                video.canPlayType(hls[0].mimetype || "application/vnd.apple.mpegurl") !== "" &&
                /safari/i.test(navigator.userAgent))    // HLS native only on Safari
            {
                return hls[0].src;
            }
            return null;
        }

        this._streams = {
            streams: this._videoManifest.streams,
            get contents() {
                return this.streams.map(s => s.content);
            },
            getStream(content) {
                return this.streams.find(s => s.content === content);
            },
            getSourceTypes(content) {
                const stream = this.getStream(content);
                return stream && Object.keys(stream.sources) || null;
            },
            getCanvasTypes(content) {
                const stream = this.getStream(content);
                return stream ? stream.canvas || ["video"] : null;
            },
            get isAudioOnly() {
                // Check if the manifest only contains audio streams
                const content = this.contents.length === 1 && this.contents[0];
                const canvasTypes = content && this.getCanvasTypes(content) || [];
                const streams = this.getStream(content);
                return canvasTypes.length === 1 && 
                    canvasTypes[0] === "audio" &&
                    streams.sources.audio && streams.sources.audio.length > 0;
            },
            get audioOnlySource() {
                if (!this.isAudioOnly) {
                    return null;
                }
                return this.getStream(this.contents[0]).sources.audio[0];
            },
            get isNativelyPlayable() {
                return getNativeSource.apply(this) !== null;
            },
            get nativeSource() {
                return getNativeSource.apply(this);
            },
            get nativeType() {
                if (!this.isNativelyPlayable) {
                    return null;
                }
                return this.isAudioOnly ? 'audio' : 'video';
            },
            get nativePlayer() {
                const type = this.nativeType;
                if (type) {
                    const player = document.createElement(type);
                    player.src = this.nativeSource;
                    return player;
                }
                else {
                    return null;
                }
            }
        };

        if (this._videoManifest.frameList &&
            !Array.isArray(this._videoManifest.frameList) &&
            typeof(this._videoManifest.frameList) === "object" &&
            typeof(this._videoManifest.frameList.targetContent) === "string" &&
            Array.isArray(this._videoManifest.frameList.frames)) 
        {
            this._videoManifest.frameList.frames = this._videoManifest.frameList.frames.sort((a,b) => a.time - b.time);
            this._frameList = this._videoManifest.frameList;
        }
        else if (Array.isArray(this._videoManifest.frameList)) {
            this._videoManifest.frameList = this._videoManifest.frameList.sort((a,b) => a.time - b.time);
            this._frameList = {
                targetContent: null,
                frames: this._videoManifest.frameList
            }
        }
        else {
            this._frameList = {
                targetContent: null,
                frames: []
            }
        }

        this._frameList.getImage = (time, ignoreTrimming = false) => {
            if (!this._frameList.frames) {
                return null;
            }

            if (this._player?.videoContainer && this._player._videoContainer.isTrimEnabled && !ignoreTrimming) {
                time += this._player.videoContainer.trimStart;
            }
            else if (!this._player?._videoContainer && !ignoreTrimming) {
                console.warn("frameList.getImage(): player instance is null. The trimming information will be ignored.");
            }

            return [...this._frameList.frames]
                .sort((a,b) => b.time - a.time)
                .find(f => f.time < time)
        }

        if (this._videoManifest.chapters) {
            if (!Array.isArray(this._videoManifest.chapters.chapterList)) {
                console.warn("ManifestParser: malformed chapters in manifest");
            }
            this._chapters = {
                chapterList: this._videoManifest.chapters.chapterList
            }
        }
        else {
            this._chapters = {
                chapterList: []
            };
        }

        Object.defineProperty(this._frameList, "isEmpty", {
            get() {
                return Array.isArray(manifestData.frameList) && manifestData.frameList.length === 0 ||
                        !manifestData.frameList;
            }
        });

        Object.freeze(this._metadata);
        Object.freeze(this._streams);
        Object.freeze(this._trimming);
        Object.freeze(this._captions);
    }

    get metadata() {
        return this._metadata;
    }

    get streams() {
        return this._streams;
    }

    get frameList() {
        return this._frameList;
    }

    get chapters() {
        return this._chapters;
    }
    
    get captions() {
        return this._captions;
    }

    get trimming() {
        return this._trimming;
    }

    get visibleTimeLine() {
        return this._visibleTimeLine;
    }

    async getTimelineFrameAtTime(time) {
        if (this._metadata.timeline) {
            const imageUrl = resolveResourcePath(this._player, this._metadata.timeline.url);
            this._timelineImage = this._timelineImage || await new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous"; // Ensure cross-origin compatibility
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = imageUrl;
            });

            const duration = await this._player.videoContainer.duration();
            const rows = this._metadata.timeline.rows;
            const cols = this._metadata.timeline.cols;
            const total = rows * cols;
            const index = Math.floor((time / duration) * total);
            const row = Math.floor(index / cols);
            const col = index % cols;
            const canvas = document.createElement('canvas');
            const width = this._timelineImage.width / cols;
            const height = this._timelineImage.height / rows;
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this._timelineImage,
                width * row, height * col, width, height, 0, 0, width, height
            );
            return canvas.toDataURL();
        }
        return null;
    }
}