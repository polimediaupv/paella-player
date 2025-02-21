
export function createTimeLinePreview({ container }) {
    container.innerHTML = `
        <div class="timeline-preview hidden">
            <img src="" alt="" />
            <p></p>
        </div>
    `;

    const image = container.querySelector('img');
    const text = container.querySelector('p');
    const previewBox = container.querySelector('.timeline-preview');

    const timeLinePreview = {
        setImage(src,alt) {
            if (src !== image.src) {
                image.src = src;
                image.alt = alt;
            }
        },
    
        setText(txt) {
            text.innerText = txt;
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

