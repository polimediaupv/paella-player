import CanvasPlugin, { Canvas } from '../core/CanvasPlugin';
import Paella from "../Paella";

export class VideoCanvas extends Canvas {
    constructor(player: Paella, videoContainer: HTMLElement) {
        super('div', player, videoContainer);
    }

    async loadCanvas(player: Paella) {
        (player as any).element.style.width = "100%";
        (player as any).element.style.height = "100%";
        (player as any).element.style.position = "absolute";
        (player as any).element.style.top = "0";
        (player as any).element.style.left = "0";
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
