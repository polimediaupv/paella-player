import { MenuButtonPlugin, Events, bindEvent, type CaptionCanvas, ItemData, ButtonType } from "@asicupv/paella-core";
import BasicPluginsModule from './BasicPluginsModule';

import { CaptionsIcon as captionsPlugin } from '../icons/captions_cc.js';


export default class CaptionsSelectorPlugin extends MenuButtonPlugin {
    private _captionsCanvas: CaptionCanvas | null = null;
    private _selected: string | null = null;

    getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.captionsSelectorPlugin";
    }

    getAriaLabel() {
        return "Select captions";
    }

    getDescription() {
        return this.getAriaLabel();
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name,"captionsIcon") || captionsPlugin;
        this._captionsCanvas = this.player.captionsCanvas || null;
        this._selected = null;

        if (this._captionsCanvas?.captions.length === 0) {
            this.disable();
        }

        bindEvent(this.player, Events.CAPTIONS_CHANGED, () => {
            if (this._captionsCanvas?.captions.length !== undefined && this._captionsCanvas?.captions.length > 0) {
                this.enable();
            }
        });

        bindEvent(this.player, Events.CAPTIONS_ENABLED, (captionsData: { language: string }) => {
            this._selected = captionsData.language;
        });

        bindEvent(this.player, Events.CAPTIONS_DISABLED, () => {
            this._selected = null;
        });
    }

    async getMenu(): Promise<ItemData[]> {
        const result: ItemData[] = [
            {
                id: -1,
                title: this.player.translate("Disabled"),
                index: -1,
                selected: this._selected === null
            }
        ];

        this._captionsCanvas?.captions.forEach((c, i) => {
            result.push({
                id: c.language,
                title: c.label,
                index: i,
                selected: c.language === this._selected
            });
        })
        return result;
    }

    get buttonType(): ButtonType {
        return "radio";
    }

    itemSelected(itemData: ItemData) {
        if (!this._captionsCanvas) {
            return;
        }
        if (itemData.index === -1) {
            this._captionsCanvas.disableCaptions();
        }
        else {
            this._captionsCanvas.enableCaptions({ index: itemData.index });
        }
    }

    async getHelp() {
        return {
            title: "Captions selector",
            description: "Allows you to select and enable captions for the video."
        };
    }
}
