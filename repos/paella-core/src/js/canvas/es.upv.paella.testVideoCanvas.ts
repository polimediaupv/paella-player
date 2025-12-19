import CanvasPlugin, { Canvas } from '../core/CanvasPlugin';
import Paella from '../Paella';

export class TestVideoCanvas extends Canvas {
    constructor(player: Paella, videoContainer: HTMLElement) {
        super('div', player, videoContainer);
    }

    async loadCanvas(player: Paella) {
        const parent = this.parent;
        // Test zoom
        (player as any).element.style.width = "200%";
        (player as any).element.style.height = "200%";
        (player as any).element.style.top = "-25%";
        (player as any).element.style.left = "-25%";
        (player as any).element.style.position = "absolute";

        this.element.style.overflow = "hidden";
        this.element.style.position = "relative";

        this.player.log.debug("test video canvas");
    }
}

export default class TestVideoCanvasPlugin extends CanvasPlugin {
    get canvasType() { return "video"; }

    async isEnabled() {
        this.player.log.debug("TestVideoCanvasPlugin");
        return super.isEnabled();
    }

    isCompatible(stream: any) : boolean {
        if (!Array.isArray(stream.canvas) || stream.canvas.length === 0) {
            return true;
        }

        return super.isCompatible(stream);
    }

    getCanvasInstance(videoContainer: HTMLElement) : Canvas {
        return new TestVideoCanvas(this.player, videoContainer);
    }
}