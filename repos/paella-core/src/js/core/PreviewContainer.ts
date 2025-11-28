
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
import Paella from '../Paella';

export default class PreviewContainer extends DomClass {
    private _img: HTMLElement;

    constructor(player: Paella, parentElement: HTMLElement, backgroundImage?: string, backgroundImagePortrait?: string) {
        const attributes = {
            "class": "preview-container",
            "role": "button",
            "aria-label": "Play video"
        };
        super(player, {attributes, parent: parentElement});

        const playPreview = player.getCustomPluginIcon("@asicupv/paella-core", "playPreview") || PlayIcon;

        this._img = createElementWithHtmlText(`
        <div class="preview-image-container">
            ${ backgroundImage ? `<img src="${backgroundImage}" class="preview-image-landscape" alt=""/>` : "" }
            ${ backgroundImagePortrait ? `<img src="${backgroundImagePortrait}" class="preview-image-portrait" alt=""/>` : "" }
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
                const landscapeElements = Array.from(this.element.getElementsByClassName('preview-image-landscape') as HTMLCollectionOf<HTMLElement>);
                const portraitElements = Array.from(this.element.getElementsByClassName('preview-image-portrait') as HTMLCollectionOf<HTMLElement>);
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

    loadBackgroundImage(src: string) {
        this._img.setAttribute("src",src);
    }
}
