import CanvasPlugin, { Canvas } from '../core/CanvasPlugin';
import Paella from '../Paella';

export class AudioCanvas extends Canvas {
    constructor(player: Paella, videoContainer: HTMLElement) {
        super('div', player, videoContainer);
        this.element.classList.add("image-canvas");
    }

    async loadCanvas(player: Paella) {
        (player as any).element.style.width = "100%";
        (player as any).element.style.height= "100%";
    }
}

export default class AudioCanvasPlugin extends CanvasPlugin {
    get name() {
		return super.name || "es.upv.paella.audioCanvas";
	}

    get canvasType() { return 'audio'; }

    getCanvasInstance(videoContainer: HTMLElement) {
        return new AudioCanvas(this.player, videoContainer);
    }

    isCompatible(stream: any) : boolean {
        return true;
    }
}
