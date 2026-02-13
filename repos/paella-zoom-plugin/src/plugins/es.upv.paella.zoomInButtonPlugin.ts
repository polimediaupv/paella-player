import { ButtonPlugin } from '@asicupv/paella-core';
import { ZoomCanvas } from './es.upv.paella.zoomPlugin';
import ZoomPluginsModule from './ZoomPluginsModule';

import { ZoomInIcon as defaultZoomInButton } from '../icons/mini-zoom-in.js';
import { ZoomButtonPluginConfig } from './es.upv.paella.zoomPlugin';

    
export default class ZoomInButtonPlugin<TConfig extends ZoomButtonPluginConfig = ZoomButtonPluginConfig> extends ButtonPlugin<TConfig> {
    public target: string = "";

    protected _canvas: ZoomCanvas | null = null;

    getPluginModuleInstance() {
        return ZoomPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.zoomInButtonPlugin";
    }

    getAriaLabel() {
        return "Zoom in";
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
            this.target = this.config.target;
            this._canvas = this.player.videoContainer.streamProvider.streams[this.target].canvas;
            return this._canvas instanceof ZoomCanvas;
        }
        catch (err) {
            this.player.log.warn("ZoomInButtonPlugin: no such target stream", this.target);
            return false;
        }
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name,"zoomInIcon") || defaultZoomInButton;
    }

    async action() {
        this._canvas?.zoomIn();
    }
}
