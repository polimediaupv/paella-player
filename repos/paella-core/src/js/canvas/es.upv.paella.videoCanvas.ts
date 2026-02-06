import CanvasPlugin, { Canvas } from '../core/CanvasPlugin';
import { Video } from '../core/VideoPlugin';
import Paella from "../Paella";

export class VideoCanvas extends Canvas {
    constructor(player: Paella, videoContainer: HTMLElement) {
        super('div', player, videoContainer);
    }

    async loadCanvas(player: Video) {
        player.element.style.width = "100%";
        player.element.style.height = "100%";
        player.element.style.position = "absolute";
        player.element.style.top = "0";
        player.element.style.left = "0";
    }
}

export default class VideoCanvasPlugin extends CanvasPlugin {
    get name() {
		return super.name || "es.upv.paella.videoCanvas";
	}

    get canvasType() { return "video"; }

    isCompatible(stream: any) : boolean {
        if (!Array.isArray(stream.canvas) || stream.canvas.length === 0) {
            // By default, the default canvas is HTML video canvas
            return true;
        }
        
        return super.isCompatible(stream);
    }

    getCanvasInstance(videoContainer: HTMLElement) : Canvas {
        return new VideoCanvas(this.player, videoContainer);
    }
}
