import { ButtonType, ItemData, MenuButtonPlugin, MenuButtonPluginConfig } from '@asicupv/paella-core';
import { ZoomButtonPluginConfig, ZoomCanvas } from './es.upv.paella.zoomPlugin';

import ZoomPluginsModule from './ZoomPluginsModule';

import { ZoomInIcon as defaultZoomInButton } from '../icons/mini-zoom-in.js';
import { ZoomOutIcon as defaultZoomOutButton } from '../icons/mini-zoom-out.js';

export type ZoomMenuButtonPluginConfig = MenuButtonPluginConfig & {
    target: string;
}

export default class ZoomMenuButtonPlugin<TConfig extends ZoomMenuButtonPluginConfig = ZoomMenuButtonPluginConfig> extends MenuButtonPlugin<TConfig> {
    protected _target: string = "";
    protected _canvas: ZoomCanvas | null = null;

    getPluginModuleInstance() {
        return ZoomPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.zoomMenuButtonPlugin";
    }

    getAriaLabel() {
        return "Show video zoom options";
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
            this._target = this.config.target || "presenter";
            this._canvas = this.player.videoContainer.streamProvider.streams[this._target].canvas;
            return this._canvas instanceof ZoomCanvas;
        }
        catch (err) {
            this.player.log.warn("ZoomMenuButtonPlugin: no such target stream", this._target);
            return false;
        }
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name,"zoomInIcon") || defaultZoomInButton;
    }

    async getMenu() {
        return [
            {
                id: "in",
                title: "Zoom in",
                icon: this.player.getCustomPluginIcon(this.name,"zoomInIcon") || defaultZoomInButton
            },
            {
                id: "out",
                title: "Zoom out",
                icon: this.player.getCustomPluginIcon(this.name,"zoomOutIcon") || defaultZoomOutButton
            }
        ]
    }

    get buttonType() : ButtonType {
        return "button"
    }

    get showTitles() {
        return false;
    }

    itemSelected(itemData: ItemData) {
        switch (itemData.id) {
        case "in":
            this._canvas?.zoomIn();
            break;
        case "out":
            this._canvas?.zoomOut();
            break;
        }
    }
}
