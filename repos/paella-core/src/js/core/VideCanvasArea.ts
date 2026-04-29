import Paella from "../Paella";
import { DomClass } from "./dom";
import VideoContainer from "./VideoContainer"
import "../../css/video-canvas-area.css";

export const setVideoCanvasAreaVideoContainer = Symbol();

export default class VideoCanvasArea extends DomClass {
    protected _visible: boolean = false;
    protected _videoContainer: VideoContainer | null = null;
    protected _panelSize: "small" | "medium" | "large" = "medium";

    protected _interactiveAreaContainer: DomClass | null = null;

    [setVideoCanvasAreaVideoContainer](videoContainer: VideoContainer): void {
        this._videoContainer = videoContainer;
    }

    constructor(player: Paella, parent: HTMLElement) {
        super(player, {
            tag: 'div',
            attributes: {
                class: "video-canvas-area"
            },
            parent
        });

        // _videoContainer class is set fron Paella class using the setVideoCanvasAreaVideoContainer token
        this._interactiveAreaContainer = new DomClass(player, {
            tag: 'div',
            attributes: {
                class: "interactive-area-container"
            },
            parent: this.element
        });
    }

    setPanelSize(size: "small" | "medium" | "large") {
        this._panelSize = size;
        this.rebuild();
    }

    showPanel() {
        this._visible = true;
        this._interactiveAreaContainer?.element.classList.add("visible");
        this.rebuild();
    }

    hidePanel() {
        this._visible = false;
        this._interactiveAreaContainer?.element.classList.remove("visible");
        this.rebuild();
    }

    onResize() {
        this.rebuild();
    }

    get videoContainer() : VideoContainer | null {
        return this._videoContainer;
    }

    protected rebuild() {
        const aspectRatio = this.element.offsetWidth / this.element.offsetHeight;
        const rightPanelClass = "right-panel";
        const bottomPanelClass = "bottom-panel";
        this.videoContainer?.element.classList.remove(rightPanelClass, bottomPanelClass);
        this.videoContainer?.element.classList.remove("small-panel", "medium-panel", "large-panel");

        if (this._visible) {
            this.videoContainer?.element?.classList.add(aspectRatio > 1 ? rightPanelClass : bottomPanelClass);
            this.videoContainer?.element?.classList.add(`${this._panelSize}-panel`);
        }

        this.videoContainer?.updateLayout();
    }
}

