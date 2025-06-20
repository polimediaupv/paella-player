
import { DomClass, createElementWithHtmlText } from './dom';

const g_iconContainerStyle = `
    position: absolute; 
    top: 0px; 
    left: 0px; 
    right: 0px; 
    bottom: 0px; 
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
`;

const g_iconStyle = `
    pointer-events: none;
    width: 20%;
    max-width: 400px;
    min-width: 100px;
    opacity: 0.6;
`;

const g_buttonStyle = `
    display: block;
    width: 20%;
    background: none;
    border: none;
    cursor: pointer;
`;

import PlayIcon from '../../icons/play_icon_fullscreen';

export default class PreviewContainer extends DomClass {
    constructor(player, parentElement,backgroundImage,backgroundImagePortrait) {
        const attributes = {
            "class": "preview-container",
            "role": "button",
            "aria-label": "Play video"
        };
        super(player, {attributes, parent: parentElement});

        const playPreview = player.getCustomPluginIcon("@asicupv/paella-core", "playPreview") || PlayIcon;

        this._img = createElementWithHtmlText(`
        <div class="preview-image-container">
            ${ backgroundImage ? `<img src="${backgroundImage}" class="preview-image-container preview-image-landscape" alt=""/>` : "" }
            ${ backgroundImagePortrait ? `<img src="${backgroundImagePortrait}" class="preview-image-container preview-image-portrait" alt=""/>` : "" }
            <div style="${ g_iconContainerStyle }">
                <button style="${g_buttonStyle}" role="button" aria-label="Play video">
                    <i class="preview-play-icon" style="${ g_iconStyle }">${ playPreview }</i>
                </button>
            </div>
        </div>
        `, this.element);

        this.element.setAttribute('id','playerContainerClickArea');
        this.element.addEventListener("click", (evt) => {
            player.play();
        });

        const mustCheckOrientation = backgroundImage && backgroundImagePortrait;
        const checkOrientation = () => {
            if (mustCheckOrientation) {
                const aspectRatio = this.element.clientWidth / this.element.clientHeight;
                const landscapeElements = Array.from(this.element.getElementsByClassName('preview-image-landscape'));
                const portraitElements = Array.from(this.element.getElementsByClassName('preview-image-portrait'));
                if (aspectRatio>=1) {
                    landscapeElements.forEach(e => e.style.display = "");
                    portraitElements.forEach(e => e.style.display = "none");
                }
                else {
                    landscapeElements.forEach(e => e.style.display = "none");
                    portraitElements.forEach(e => e.style.display = "");
                }
            }
        }

        window.addEventListener("resize", () => {
            checkOrientation();
        });

        checkOrientation();
    }

    loadBackgroundImage(src) {
        this._img.setAttribute("src",src);
    }
}
