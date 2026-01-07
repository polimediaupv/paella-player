import CanvasButtonPlugin from "../core/CanvasButtonPlugin";
import PaellaCorePlugins from "./PaellaCorePlugins";

import TestIcon from "../../icons/screen";

import type Paella from "../Paella";
import type { Canvas } from "../core/CanvasPlugin";

export default class CanvasButtonPluginTest extends CanvasButtonPlugin {
    getPluginModuleInstance() {
        return PaellaCorePlugins.Get();
    }

    get name() {
		return super.name || "es.upv.paella.canvasButtonPluginTest";
	}

    async load() {
        this.icon = TestIcon;
    }

    async action(content: any, videoPlayer: Paella, videoCanvas: Canvas, canvasPlugin: any) {
        console.log(`Content: ${ content }`);
        console.log(videoPlayer);
        console.log(videoCanvas);
        console.log(canvasPlugin);
        //this.player.playbackBar.enabled = !this.player.playbackBar.enabled;
    }
}
