import { createTimeLinePreview } from "./timeline-preview.js";
import { secondsToTime } from "./utils.js";

export function createProgressIndicator({ container, player, duration = 1000, currentTime = 0, precision = 100 }) {
    container.classList.add('progress-indicator');
    container.innerHTML = `
        <div class="range-container">
            <div class="timeline-preview-container"></div>
            <div class="elapsed"></div>
            <div class="remaining"></div>
            <ul class="markers-container"></ul>
            <input type="range" min="0" max="${duration * precision}" value="${currentTime * precision}" class="slider">
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
    const progressIndicator = {
        player,
        elapsed,
        remaining,
        range,
        timeLinePreview,

        markersContainer: container.querySelector('.markers-container'),

        addMarker({ time, duration }) {
            const marker = document.createElement('li');
            marker.style.left = `${time / duration * 100}%`;
            this.markersContainer.appendChild(marker);
        },

        updateRemaining() {
            const position = this.range.value / this.range.max * 100;
            this.elapsed.style.width = `${position}%`;
            this.remaining.style.width = `${100 - position}%`;
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

    range.addEventListener('mousemove', async (event) => {
        const frameList = player.frameList?.frames || [];
        if (frameList) {
            const duration = await player.videoContainer.duration();
            const width = event.target.clientWidth;
            const position = event.clientX;
            const normalizedPosition = position / width;
            const time = normalizedPosition * duration;
            const frame = frameList.filter(frame => frame.time <= time).pop();
            const url = frame && (frame.thumb || frame.url);
            const text = frame && secondsToTime(duration * normalizedPosition);
            
            timeLinePreview.setImage(url, text);
            timeLinePreview.setText(text);
            timeLinePreview.setPosition(normalizedPosition);
            timeLinePreview.show();
        }
    });

    range.addEventListener('mouseleave', () => {
        timeLinePreview.hide();
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

    progressIndicator.updateRemaining();

    return progressIndicator;
}