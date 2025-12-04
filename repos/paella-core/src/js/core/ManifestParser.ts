import { resolveResourcePath } from "./utils";
import Paella from "../Paella";

export interface Transcription {
    index: number;
    preview: string;
    time: number;
    text: string;
    duration: number;
}

export interface Frame {
    id: string;
    time: number,
    mimetype: string,
    url: string,
    thumb: string
}

export interface FrameList {
    targetContent: string;
    frames: Frame[];
}

export interface Chapter {
    id: string;
    title: string;
    description?: string;
    time: number;
    thumb?: string
}

export interface Chapters {
    chapterList: Chapter[]
}

export interface Source {
    src: string;
    // Currently unused...
    mimetype: string;
    res?: {
        w: number;
        h: number;
    };
}

export interface Stream {
    content: string;
    role?: string;
    canvas?: string[];
    sources: {
        html?: Source[];
        mp4?: Source[];
        hls?: Source[];
        hlsLive?: Source[];
        audio?: Source[];
    };
}

export interface CaptionManifestItem {
    id: string,
    format: string;
    url: string;
    lang: string;
    text: string;
}

export interface TimelineImages {
    url: string;
    rows: number;
    cols: number;
}

export interface Trimming {
    start: number;
    end: number;
    enabled: boolean;
}

export interface Manifest {
    metadata?: {
        duration?: number;
        title?: string;
        preview?: string;
        timelineMarks?: "frameList" | "chapters";
        timeline?: TimelineImages
    } & Record<string, unknown>;

    streams: Stream[];

    captions?: CaptionManifestItem[];

    frameList?: FrameList;

    chapters?: Chapters;

    transcriptions?: Transcription[];

    visibleTimeLine?: boolean;

    trimming?: Trimming;
}

function getNativeSource(this: StreamsManifest) : string | null {
    if (this.streams.length !== 1) {
        return null;
    }
    if (this.isAudioOnly) {
        return this.audioOnlySource?.src ?? null;
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

class StreamsManifest {
    streams: Stream[];

    constructor(streams: Stream[]) {
        this.streams = streams;
    }

    get contents(): string[] {
        return this.streams.map(s => s.content);
    }

    getStream(content: string): Stream | null {
        return this.streams.find(s => s.content === content) || null;
    }

    getSourceTypes(content: string): string[] | null {
        const stream = this.getStream(content);
        return stream ? Object.keys(stream.sources) : null;
    }

    getCanvasTypes(content: string): string[] {
        const stream = this.getStream(content);
        return stream ? stream.canvas || ["video"] : [];
    }

    get isAudioOnly(): boolean {
        // Check if the manifest only contains audio streams
        if (this.contents.length !== 1) {
            return false;
        }

        const content: string = this.contents[0];
        const canvasTypes: string[] = this.getCanvasTypes(content);
        const stream = this.getStream(content);
        return canvasTypes.length === 1 && 
            canvasTypes[0] === "audio" &&
            stream?.sources.audio && stream?.sources.audio.length > 0 || false;
    }

    get audioOnlySource(): Source | null {
        if (!this.isAudioOnly) {
            return null;
        }
        const content: string = this.contents[0];
        const stream = this.getStream(content);
        return stream?.sources?.audio && stream?.sources?.audio[0] || null;
    }

    get isNativelyPlayable(): boolean {
        return getNativeSource.apply(this) !== null;
    }

    get nativeSource(): string | null {
        return getNativeSource.apply(this);
    }

    get nativeType() : string | null {
        if (!this.isNativelyPlayable) {
            return null;
        }
        return this.isAudioOnly ? 'audio' : 'video';
    }

    get nativePlayer(): HTMLMediaElement | null {
        const type = this.nativeType;
        const nativeSource = this.nativeSource;
        if (type && nativeSource) {
            const player: HTMLMediaElement = document.createElement(type) as HTMLMediaElement;
            player.src = nativeSource;
            return player;
        }
        return null;
    }
}

class FrameListManifest {
    private player?: Paella | null;
    public targetContent: string | null;
    public frames: Frame[];

    constructor(player: Paella, frameList: any) {
        this.player = player;
        const sortFrames = (a: Frame, b: Frame) => a.time - b.time;

        if (frameList &&
            !Array.isArray(frameList) &&
            typeof(frameList) === "object" &&
            typeof(frameList.targetContent) === "string" &&
            Array.isArray(frameList.frames)) 
        {
            this.frames = frameList.frames.sort(sortFrames);
            this.targetContent = frameList.targetContent;
        }
        else if (Array.isArray(frameList)) {
            this.frames = frameList.sort(sortFrames);
            this.targetContent = null;
        }
        else {
            this.frames = [];
            this.targetContent = null;
        }
    }

    getImage(time: number, ignoreTrimming = false): Frame | null {
        if (this.frames.length === 0) {
            return null;
        }

        if (this.player?.videoContainer.isTrimEnabled && !ignoreTrimming) {
            time += this.player.videoContainer.trimStart;
        }
        else if (!this.player?.videoContainer && !ignoreTrimming) {
            console.warn("frameList.getImage(): player instance is null. The trimming information will be ignored.");
        }

        return [...this.frames]
            .find(f => f.time < time) || null;
    }

    get isEmpty() : boolean {
        return this.frames.length === 0;
    }
}

class MetadataManifest {
    public duration?: number;
    public title?: string;
    public preview?: string;
    public timelineMarks?: "frameList" | "chapters";
    public timeline?: TimelineImages

    constructor(metadata: any) {
        this.duration = metadata?.duration;
        this.title = metadata?.title;
        this.preview = metadata?.preview;
        this.timelineMarks = metadata?.timelineMarks;
        if (metadata?.timeline &&
            (!metadata.timeline.url || !metadata.timeline.rows || !metadata.timeline.cols)
        ) {
            console.warn("ManifestParser: malformed timeline in manifest");
        }
        else if (metadata?.timeline) {
            this.timeline = metadata?.timeline;
        }
    }
}

class ChapterManifest {
    public chapterList: Chapter[];

    constructor(chapters: any) {
        if (chapters) {
            if (!Array.isArray(chapters?.chapterList)) {
                console.warn("ManifestParser: malformed chapters in manifest");
            }
            else if (chapters?.chapterList.some((c: any) => typeof(c.id) !== "string" || typeof(c.title) !== "string" || typeof(c.time) !== "number")) {
                console.warn("ManifestParser: malformed chapters in manifest");
            }
            this.chapterList = chapters.chapterList;
        }
        else {
            this.chapterList = [];
        }
    }
}

class TrimmingManifest {
    public start: number
    public end: number
    public enabled: boolean

    constructor(trimming: any) {
        this.start = trimming?.start || 0;
        this.end = trimming?.end || 0;
        this.enabled = trimming?.enabled || false;
    }
}

export default class ManifestParser {
    private _player: Paella;
    private _videoManifest: Manifest;
    private _metadata: MetadataManifest;
    private _streams: StreamsManifest;
    private _frameList: FrameListManifest;
    private _chapters: ChapterManifest;
    private _visibleTimeLine: boolean;
    private _captions?: CaptionManifestItem[];
    private _trimming: TrimmingManifest;
    private _timelineImage: HTMLImageElement | null = null;

    constructor(manifestData: any, player: Paella) {
        this._player = player;
        this._videoManifest = JSON.parse(JSON.stringify(manifestData)) as Manifest;
        this._metadata = new MetadataManifest(this._videoManifest.metadata);
        this._streams = new StreamsManifest(this._videoManifest.streams);
        this._frameList = new FrameListManifest(
            player,
            this._videoManifest.frameList
        );
        this._chapters = new ChapterManifest(this._videoManifest.chapters);
        this._trimming = new TrimmingManifest(this._videoManifest.trimming);

        this._captions = this._videoManifest.captions;

        this._visibleTimeLine = this._videoManifest.visibleTimeLine ?? false;
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

    async getTimelineFrameAtTime(time: number): Promise<string | null> {
        if (this._metadata.timeline) {
            const imageUrl = resolveResourcePath(this._player, this._metadata.timeline.url);
            this._timelineImage = this._timelineImage || await new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous"; // Ensure cross-origin compatibility
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = imageUrl;
            });

            if (this._timelineImage) {
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
                ctx!.drawImage(this._timelineImage,
                    width * row, height * col, width, height, 0, 0, width, height
                );
                return canvas.toDataURL();
            }
        }
        return null;
    }
}
