import { Canvas, CanvasButtonPlugin, Paella } from "@asicupv/paella-core";
import { ZoomCanvas } from "./es.upv.paella.zoomPlugin";

import ZoomPluginsModule from "./ZoomPluginsModule";

import { ZoomOutIcon as defaultZoomOutButton } from '../icons/mini-zoom-out.js';

import { ZoomButtonPluginConfig } from "./es.upv.paella.zoomPlugin";

export default class CanvasZoomOutButtonPlugin<TConfig extends ZoomButtonPluginConfig = ZoomButtonPluginConfig> extends CanvasButtonPlugin<TConfig> {
    protected _streams: Record<string, any> = {};

    getPluginModuleInstance() {
        return ZoomPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.canvasZoomOutButtonPlugin";
    }

    getAriaLabel() {
        return this.player.translate('Zoom out');
    }

    getDescription() {
        return this.getAriaLabel();
    }

    async isEnabled() {
        if (!(await super.isEnabled())) {
            return false;
        }

        if (!this.player.videoContainer?.streamProvider?.streams) {
            return false;
        }
        
        try {
            let result = false;
            this._streams = this.player.videoContainer.streamProvider.streams;
            for (const s in this._streams) {
                result ||= this._streams[s].canvas instanceof ZoomCanvas;
            }
            
            return result;
        }
        catch (err) {
            this.player.log.warn("CanvasZoomOutButtonPlugin: no such target stream");
            return false;
        }
    }
    
    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name,"zoomOutIcon") || defaultZoomOutButton;
    }

    async action(content: any, videoPlayer: Paella, videoCanvas: Canvas, canvasPlugin: Plugin) {
        if (videoCanvas instanceof ZoomCanvas) {
            videoCanvas.zoomOut();
        }
    }
}