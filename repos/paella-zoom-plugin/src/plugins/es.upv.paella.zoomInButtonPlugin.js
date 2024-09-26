import { ButtonPlugin } from 'paella-core';
import { ZoomCanvas } from './es.upv.paella.zoomPlugin';

import ZoomPluginsModule from './ZoomPluginsModule';

import { ZoomInIcon as defaultZoomInButton } from '../icons/mini-zoom-in.js';

export default class ZoomInButtonPlugin extends ButtonPlugin {
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
        
        this.target = this.config.target;
        this._canvas = this.player.videoContainer.streamProvider.streams[this.target].canvas;
        return this._canvas instanceof ZoomCanvas;
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name,"zoomInIcon") || defaultZoomInButton;
    }

    async action() {
        this._canvas.zoomIn();
    }
}
