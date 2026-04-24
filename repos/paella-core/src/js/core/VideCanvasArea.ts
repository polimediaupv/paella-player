import Paella from "../Paella";
import { DomClass } from "./dom";


export default class VideoCanvasArea extends DomClass {
    constructor(player: Paella, parent: HTMLElement) {
        super(player, {
            tag: 'div',
            attributes: {
                class: "video-canvas-area"
            },
            parent
        });
    }

    // TODO: Implement canvas area specific methods
    // - Text panel
}

