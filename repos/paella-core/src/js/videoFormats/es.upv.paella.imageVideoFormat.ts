import VideoPlugin, { Video } from '../core/VideoPlugin';
import { resolveResourcePath } from '../core/utils';
import VideoQualityItem from '../core/VideoQualityItem';
import Paella from '../Paella';
import PaellaCoreVideoFormats from './PaellaCoreVideoFormats';

interface ImageFrame {
    time: number;
    src: string;
}

interface ImageSource {
    frames: ImageFrame[];
    duration: number;
    res: {
        w: number;
        h: number;
    };
}

interface StreamData {
    sources: {
        image?: ImageSource[];
    };
}

function updateFrame(this: ImageVideo, t: number): void {
	let frame = this._currentSource.frames[0];
	this._currentSource.frames.some(f => {
		if (f.time <= this._currentTime) {
			frame = f;
		}
		else {
			return true;
		}
	});
	this.img.src = frame.src;
}

function startTimeUpdate(this: ImageVideo): void {
	this._startTimestamp = Date.now();
	const timerFunc = () => {
		this._timer = setTimeout(timerFunc, 250);
		const current = Date.now();
		const interval = current - this._startTimestamp;
		this._currentTime += interval / 1000;
		this._startTimestamp = current;
		updateFrame.apply(this, [this._currentTime]);
	};
	
	timerFunc();
}

function stopTimeUpdate(this: ImageVideo): void {
	if (this._timer !== null) {
		clearTimeout(this._timer);
		this._timer = null;
	}
}

export class ImageVideo extends Video {
	_currentTime: number;
	_startTimestamp: number;
	_playbackRate: number;
	_timer: ReturnType<typeof setTimeout> | null;
	_sources!: ImageSource[];
	_qualities!: VideoQualityItem[];
	_currentQuality!: number;
	_currentSource!: ImageSource;
	img!: HTMLImageElement;
	
	constructor(player: Paella, parent: HTMLElement) {
		super('img', player, parent);
		
		this._currentTime = 0;
		this._startTimestamp = 0;
		this._playbackRate = 1;
		this._timer = null;
		
		(this as any).video = this.element;
	}
	
	async play(): Promise<boolean> {
		startTimeUpdate.apply(this);
		return true;
	}
	
	async pause(): Promise<boolean> {
		stopTimeUpdate.apply(this);
		return true;
	}
	
	async duration(): Promise<number> {
		return this._currentSource.duration;
	}
	
	get currentTimeSync(): number {
		return this._currentTime;
	}
	
	async currentTime(): Promise<number> {
		return this._currentTime;
	}
	
	async setCurrentTime(t: number): Promise<boolean> {
		this._currentTime = t;
		updateFrame.apply(this, [t]);
		return true;
	}
	
	async volume(): Promise<number> {
		return 0;
	}
	
	async setVolume(v: number): Promise<boolean> {
		return true;
	}
	
	async paused(): Promise<boolean> {
		return this._timer === null;
	}
	
	async playbackRate(): Promise<number> {
		return this._playbackRate;
	}
	
	// @ts-expect-error - Base class has incorrect signature
	async setPlaybackRate(pr: number): Promise<boolean> {
		this._playbackRate = pr;
		return true;
	}
	
	async getQualities() {
		return this._qualities;
	}
	
	async setQuality(q?: number): Promise<boolean> {
		// TODO: This implement this
		return false;
	}
	
	// @ts-expect-error - Returns actual quality index instead of null
	get currentQuality() {
		return this._currentQuality;
	}
	
	// @ts-expect-error - Returns actual dimensions instead of null
	async getDimensions() {
		return this._currentSource.res;
	}
	
	async loadStreamData(streamData: StreamData): Promise<boolean> {
		this._sources = streamData.sources.image!;
		this._qualities = this._sources.map(src => {
			return new VideoQualityItem({
				src: src.frames[0].src,
				label: `${src.res.w}x${src.res.h}`,
				shortLabel: `${src.res.h}p`,
				width: src.res.w,
				height: src.res.h
			});
		});

		// Select the higher quality frame, by default
		this._currentQuality = this._qualities.length - 1;
		this._qualities.forEach((q, i) => {
			const currentQuality = this._qualities[this._currentQuality];
			if (currentQuality.compare(q) > 0) {
				this._currentQuality = i;
			}
		});
		this._currentSource = this._sources[this._currentQuality];
		
		// Sort frames
		this._sources.forEach(src => {
			src.frames.sort((a, b) => a.time - b.time);
		});
		
		return true;
	}
}

export default class ImageVideoPlugin extends VideoPlugin {
	getPluginModuleInstance(): PaellaCoreVideoFormats {
        return PaellaCoreVideoFormats.Get();
    }
	
	get name(): string {
		return super.name || "es.upv.paella.imageVideoFormat";
	}

	get streamType(): string {
		return "image";
	}

	async isCompatible(streamData: StreamData): Promise<boolean> {
		return streamData.sources.image != null;
	}
	
	// @ts-expect-error - Returns actual instance instead of null
	async getVideoInstance(playerContainer: HTMLElement, isMainAudio: boolean) {
		return new ImageVideo(this.player, playerContainer);
	}
}
