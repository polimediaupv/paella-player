import * as utils from "./utils.js";
export function createTimeLinePreview({ container }) {
    container.innerHTML = `
        <div class="timeline-preview hidden">
            <img src="" alt="" />
            <p class="timeline-preview-text"></p>
            <p class="timeline-preview-time"></p>
        </div>
    `;

    const image = container.querySelector('img');
    const text = container.querySelector('p.timeline-preview-text');
    const time = container.querySelector('p.timeline-preview-time');
    const previewBox = container.querySelector('.timeline-preview');

    const timeLinePreview = {
        setImage(src,alt) {
            if (src === undefined || src === null) {
                image.style.display = "none";
                return;
            }
            if (src !== image.src) {
                image.style.display = "";
                image.src = src;
                image.alt = alt;
            }
        },
    
        setText(txt) {
            if (txt === undefined || txt === null) {
                txt = "";
            }
            text.innerText = txt;
        },

        setTime(timeText) {
            if (timeText === undefined || timeText === null) {
                timeText = "";
            }
            else if (typeof(timeText) !== "string") {
                timeText = utils.secondsToTime(timeText);
            }
            time.innerText = timeText;
        },

        setPosition(normalizedX) {
            if (normalizedX > 0.5) {
                previewBox.style.left = "";
                previewBox.style.right = `${100 - normalizedX * 100}%`;
            }
            else {
                previewBox.style.right = "";
                previewBox.style.left = `${normalizedX * 100}%`;
            }
        },

        show() {
            previewBox.classList.remove('hidden');
        },

        hide() {
            previewBox.classList.add('hidden');
        }
    }

    return timeLinePreview;
}

