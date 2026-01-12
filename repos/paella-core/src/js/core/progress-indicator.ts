import { createTimeLinePreview } from "./timeline-preview.js";
import { createElementWithHtmlText } from "./dom.js";
import Paella from "../Paella.js";
import type { Frame, Chapter } from "./Manifest";

type OnChangeCallback = (currentTime: number) => void;
type Marker = {
    marker: HTMLElement,
    time: number,
    frameDuration: number
}

export class ProgressIndicatorImpl {
    private container: HTMLElement;
    private player: Paella;
    private elapsed: HTMLElement;
    private remaining: HTMLElement;
    private range: HTMLInputElement;
    private timeLinePreview: ReturnType<typeof createTimeLinePreview>;
    private markersContainer: HTMLElement;
    private precision: number;

    private markers: Marker[] = [];

    private seeking: boolean = false;

    private onChangeCallback: OnChangeCallback | null = null;

    constructor(container: HTMLElement, player: Paella, duration: number, currentTime: number, precision: number) {
        this.container = container;
        this.player = player;
        this.precision = precision;

        container.classList.add('progress-indicator');
        container.classList.add('custom-progress-indicator');
        container.innerHTML = `
            <div class="range-container">
                <div class="timeline-preview-container"></div>
                <div class="tracker">
                    <div class="elapsed"></div>
                    <div class="remaining"></div>
                </div>
                <input type="range" min="0" max="${duration * precision}" value="${currentTime * precision}" tabindex="0" role="slider" class="slider">
                <ul class="markers-container"></ul>
            </div>
        `;

        this.elapsed = container.querySelector('.elapsed') as HTMLElement;
        this.remaining = container.querySelector('.remaining') as HTMLElement;
        this.range = container.querySelector('.slider') as HTMLInputElement;

        const timeLinePreviewContainer = container.querySelector('.timeline-preview-container') as HTMLElement;
        this.timeLinePreview = createTimeLinePreview({ container: timeLinePreviewContainer });

        this.markersContainer = container.querySelector('.markers-container') as HTMLElement;

        this.range.addEventListener('pointerdown', () => {
            this.seeking = true;
        });

        let prevMarker: HTMLElement | null = null;
        this.range.addEventListener('mousemove', async (event: MouseEvent) => {
            const frameList = player.frameList?.frames || [];
            const chapters = player.chapters?.chapterList || [];
            if (frameList.length || chapters.length) {
                const duration = await player.videoContainer?.duration() ?? 0;
                const width = (event.target as HTMLElement).clientWidth;
                const position = event.layerX;
                const normalizedPosition = position / width;
                const time = normalizedPosition * duration;
                const frame = frameList.filter((frame: Frame) => frame.time <= time).pop();
                const chapter = chapters.filter((chapter: Chapter) => chapter.time <= time).pop();
                const timelineImage = await player.getTimelineFrameAtTime(time);
                const url = timelineImage ||
                    (chapter && chapter.thumb) ||
                    (frame && (frame.thumb || frame.url));
                const text = chapter && chapter.title;
                        
                const marker = this.getMarker(time);
                if (marker !== prevMarker && prevMarker !== null) {
                    prevMarker.classList?.remove('active');
                }
                marker && marker.classList?.add('active');
                prevMarker = marker || null;
                
                this.timeLinePreview.setImage(url, text);
                this.timeLinePreview.setText(text);
                this.timeLinePreview.setTime(time);
                this.timeLinePreview.setPosition(normalizedPosition);

                this.timeLinePreview.show();
            }
        })

        this.range.addEventListener('mouseleave', () => {
            this.timeLinePreview.hide();
            prevMarker && prevMarker.classList.remove('active');
        });

        this.range.addEventListener('pointerup', () => {
            this.seeking = false;
            // The focus must be removed from the element for the UI hiding mechanism to work.
            (document.activeElement as HTMLElement)?.blur();
            if (typeof(this.onChangeCallback) === 'function') {
                this.onChangeCallback(Number(this.range.value) / this.precision);
            }
        });

        this.range.addEventListener('pointerup', () => {
            this.seeking = false;

            (document.activeElement as HTMLElement)?.blur();
            if (typeof(this.onChangeCallback) === 'function') {
                this.onChangeCallback(Number(this.range.value) / this.precision);
            }
        })

        this.range.addEventListener('input', () => {
            this.updateRemaining();
        });

        const seekSeconds = async (seconds: number) => {
            const currentTime = await player.videoContainer?.currentTime() ?? 0;
            await player.videoContainer?.setCurrentTime(currentTime + seconds);
        }

        this.range.addEventListener('keydown', evt => {
            if (evt.key === 'ArrowLeft') {
                seekSeconds(-10);        
                evt.preventDefault();
                evt.stopPropagation();
            }
            else if (evt.key === 'ArrowRight') {
                seekSeconds(10);
                evt.preventDefault();
                evt.stopPropagation();
            }
        });
    }

    addMarker({
        time, duration, frameDuration, addGap = true
    } : {
        time: number, duration: number, frameDuration: number, addGap?: boolean
    }) {
        const marker = createElementWithHtmlText(`<li>
            <div class="elapsed"></div>
            <div class="remaining"></div>
        </li>`);
        marker.style.left = `${time / duration * 100}%`;
        marker.style.width = addGap ? `calc(${frameDuration / duration * 100}% - var(--slide-marker-gap))` : `${frameDuration / duration * 100}%`;
        this.markersContainer.appendChild(marker);
        this.markers.push({
            marker,
            time,
            frameDuration
        });
    }

    getMarker(time: number) {
        return this.markers.find(marker => marker.time < time && marker.time + marker.frameDuration >= time)?.marker;
    }
    
    updateRemaining() {
        const position = Number(this.range.value) / Number(this.range.max) * 100;
        this.elapsed.style.width = `${position}%`;
        this.remaining.style.width = `${100 - position}%`;

        const currentMarker = this.getMarker(Number(this.range.value) / this.precision);
        const currentIndex = this.markers.findIndex(marker => marker.marker === currentMarker);
        this.markers.forEach((marker, index) => {
            const elapsedElem = marker.marker.querySelector(".elapsed") as HTMLElement;
            const remainingElem = marker.marker.querySelector(".remaining") as HTMLElement;
            if (!elapsedElem || !remainingElem) return;

            if (index < currentIndex) {
                elapsedElem.style.width = "100%";
                remainingElem.style.width = "0%";
            }
            else if (index === currentIndex) {
                const elapsed = (Number(this.range.value) / this.precision - marker.time) / marker.frameDuration * 100;
                elapsedElem.style.width = `${elapsed}%`;
                remainingElem.style.width = `${100 - elapsed}%`;
            }
            else {
                elapsedElem.style.width = "0%";
                remainingElem.style.width = "100%";
            }
        });
    }

    setDuration(duration: number) {
        if (!this.seeking) {
            this.range.max = "" + (duration * this.precision);
            this.updateRemaining();
        }
    }

    setCurrentTime(currentTime: number) {
        if (!this.seeking) {
            this.range.value = "" + (currentTime * this.precision);
            this.updateRemaining();
        }
    }

    onChange(callback: OnChangeCallback) {
        this.onChangeCallback = callback;
    }

    hideTimeLine() {
        this.container.classList.add('hide-timeline');
    }
}

export function createProgressIndicator({
    container,
    player,
    duration = 100,
    currentTime = 0,
    precision = 100
} : {
    container: HTMLElement,
    player: Paella,
    duration?: number,
    currentTime?: number,
    precision?: number
}) {
    return new ProgressIndicatorImpl(container, player, duration, currentTime, precision);
}
