import * as utils from "./utils.js";
export function createTimeLinePreview({ container } : { container: HTMLElement }) {
    container.innerHTML = `
        <div class="timeline-preview hidden">
            <img src="" alt="" />
            <p class="timeline-preview-text"></p>
            <p class="timeline-preview-time"></p>
        </div>
    `;

    const image = container.querySelector('img') as HTMLImageElement;
    const text = container.querySelector('p.timeline-preview-text') as HTMLElement;
    const time = container.querySelector('p.timeline-preview-time') as HTMLElement;
    const previewBox = container.querySelector('.timeline-preview') as HTMLElement;

    const timeLinePreview = {
        setImage(src: string | undefined | null, alt: string | undefined | null) {
            if (!image) return;
            if (src === undefined || src === null) {
                image.style.display = "none";
                return;
            }
            if (src !== image.src) {
                image.style.display = "";
                image.src = src;
                image.alt = alt ?? "";
            }
        },
    
        setText(txt: string | undefined | null) {
            if (txt === undefined || txt === null) {
                txt = "";
            }
            if (!text) return;
            text.innerText = txt;
        },

        setTime(timeText: string | number | undefined | null) {
            if (timeText === undefined || timeText === null) {
                timeText = "";
            }
            else if (typeof(timeText) !== "string") {
                timeText = utils.secondsToTime(timeText);
            }
            time.innerText = timeText;
        },

        setPosition(normalizedX: number) {
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

