
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
    sources: {
        html?: Source[];
        mp4?: Source[];
        hls?: Source[];
        hlsLive?: Source[];
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
}
