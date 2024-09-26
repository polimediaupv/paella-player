import { ButtonPlugin } from 'paella-core';
import { ZoomCanvas } from './es.upv.paella.zoomPlugin';
import ZoomPluginsModule from './ZoomPluginsModule';

import { ZoomOutIcon as defaultZoomOutButton } from '../icons/mini-zoom-out.js';

export default class ZoomOutButtonPlugin extends ButtonPlugin {
    getPluginModuleInstance() {
        return ZoomPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.zoomOutButtonPlugin";
    }

    getAriaLabel() {
        return "Zoom out";
    }

    getDescription() {
        return this.getAriaLabel();
    }

    async isEnabled() {
        if (!(await super.isEnabled())) {
            return false;
        }
        
        this.target = this.config.target;
        this._canvas = this.player.videoContainer.streamProvider.streams[this.target].canvas;
        return this._canvas instanceof ZoomCanvas;
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name,"zoomOutIcon") || defaultZoomOutButton;
    }

    async action() {
        this._canvas.zoomOut();
    }
}
