import { createTimeLinePreview } from "./timeline-preview.js";
import { createElementWithHtmlText } from "./dom.js";
import * as utils from "./utils.js";

export function createProgressIndicator({ container, player, duration = 100, currentTime = 0, precision = 100}) {
    container.classList.add('progress-indicator');
    container.classList.add('custom-progress-indicator');
    container.innerHTML = `
        <div class="range-container">
            <div class="timeline-preview-container"></div>
            <div class="elapsed"></div>
            <div class="remaining"></div>
            <input type="range" min="0" max="${duration * precision}" value="${currentTime * precision}" tabindex="0" role="slider" class="slider">
            <ul class="markers-container"></ul>
        </div>
    `;

    const elapsed = container.querySelector('.elapsed');
    const remaining = container.querySelector('.remaining');
    const range = container.querySelector('.slider');

    const timeLinePreviewContainer = container.querySelector('.timeline-preview-container');
    const timeLinePreview = createTimeLinePreview({ container: timeLinePreviewContainer });

    // Controls if the user is seeking the range element. In this case, we must avoid
    // to update the range value via the setCurrentTime method.
    let seeking = false;

    let onChangeCallback = null;
    const markers = [];
    const getMarker = (time) => markers.find(marker => marker.time < time && marker.time + marker.frameDuration >= time)?.marker;
    const progressIndicator = {
        player,
        elapsed,
        remaining,
        range,
        timeLinePreview,

        markersContainer: container.querySelector('.markers-container'),

        addMarker({ time, duration, frameDuration }) {
            const marker = createElementWithHtmlText(`<li>
                <div class="elapsed"></div>
                <div class="remaining"></div>
            </li>`);
            marker.style.left = `${time / duration * 100}%`;
            marker.style.width = `calc(${frameDuration / duration * 100}% - 4px)`;
            this.markersContainer.appendChild(marker);
            markers.push({
                marker,
                time,
                frameDuration
            })
        },

        updateRemaining() {
            const position = this.range.value / this.range.max * 100;
            this.elapsed.style.width = `${position}%`;
            this.remaining.style.width = `${100 - position}%`;

            const currentMarker = getMarker(this.range.value / precision);
            const currentIndex = markers.findIndex(marker => marker.marker === currentMarker);
            markers.forEach((marker, index) => {
                if (index < currentIndex) {
                    marker.marker.querySelector(".elapsed").style.width = "100%";
                    marker.marker.querySelector(".remaining").style.width = "0%";
                }
                else if (index === currentIndex) {
                    const elapsed = (this.range.value / precision - marker.time) / marker.frameDuration * 100;
                    marker.marker.querySelector(".elapsed").style.width = `${elapsed}%`;
                    marker.marker.querySelector(".remaining").style.width = `${100 - elapsed}%`;
                }
                else {
                    marker.marker.querySelector(".elapsed").style.width = "0%";
                    marker.marker.querySelector(".remaining").style.width = "100%";
                }
            });
        },

        setDuration(duration) {
            if (!seeking) {
                this.range.max = duration * precision;
                this.updateRemaining();
            }
        },

        setCurrentTime(currentTime) {
            if (!seeking) {
                this.range.value = currentTime * precision;
                this.updateRemaining();
            }
        },

        onChange(callback) {
            onChangeCallback = callback;
        }
    };

    range.addEventListener('pointerdown', () => {
        seeking = true;
    });

    let prevMarker = null;
    range.addEventListener('mousemove', async (event) => {
        const frameList = player.frameList?.frames || [];
        if (frameList && frameList.length) {
            const duration = await player.videoContainer.duration();
            const width = event.target.clientWidth;
            const position = event.layerX;
            const normalizedPosition = position / width;
            const time = normalizedPosition * duration;
            const frame = frameList.filter(frame => frame.time <= time).pop();
            const url = frame && (frame.thumb || frame.url);
            const text = frame && utils.secondsToTime(duration * normalizedPosition);
            const marker = getMarker(time);
            if (marker !== prevMarker && prevMarker !== null) {
                prevMarker.classList.remove('active');
            }
            marker && marker.classList.add('active');
            prevMarker = marker;
            
            timeLinePreview.setImage(url, text);
            timeLinePreview.setText(text);
            timeLinePreview.setPosition(normalizedPosition);

            timeLinePreview.show();
        }
    });

    range.addEventListener('mouseleave', () => {
        timeLinePreview.hide();
        prevMarker && prevMarker.classList.remove('active');
    });

    range.addEventListener('pointerup', () => {
        seeking = false;
        if (typeof(onChangeCallback) === 'function') {
            onChangeCallback(range.value / precision);
        }
    });

    range.addEventListener('input', () => {
        progressIndicator.updateRemaining();
    });

    const seekSeconds = async (seconds) => {
        const currentTime = await player.videoContainer.currentTime();
        await player.videoContainer.setCurrentTime(currentTime + seconds);
    }

    range.addEventListener('keydown', evt => {
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

    progressIndicator.updateRemaining();

    return progressIndicator;
}