import { MenuButtonPlugin } from 'paella-core';
import BasicPluginsModule from './BasicPluginsModule';

import { ScreenIcon as defaultScreenIcon }  from '../icons/screen.js';

export default class QualitySelectorPlugin extends MenuButtonPlugin {
    getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.qualitySelector";
    }

    getAriaLabel() {
        return "Video quality";
    }

    getDescription() {
        return this.getAriaLabel();
    }

    get dynamicWidth() {
        return this.config.showIcon === false;
    }

    get titleSize() { return this.config.showIcon === false ? "large" : "small"; }

    async isEnabled() {
        if (!(await super.isEnabled())) {
            return false;
        }

        this._qualities = await this.player.videoContainer.streamProvider.getQualities();

        return this._qualities && this._qualities.length>1;
    }

    async load() {
        if (this.config.showIcon === false) {

        }
        else {
            this.icon = this.player.getCustomPluginIcon("es.upv.paella.qualitySelector","screenIcon") || defaultScreenIcon;
        }

        await this.updateQualityLabel();
    }

    async getMenu() {
        const quality = await this.player.videoContainer.streamProvider.getCurrentQuality();
        const result = this._qualities.map(q => {
            const selected = q.index === quality.index;
            return {
                id: q.index,
                title: q.label,
                width: q.res.w,
                height: q.res.h,
                data: q,
                selected: selected
            }
        })
        return result;
    }

    async updateQualityLabel() {
        const updateLabel = async () => {
            const quality = await this.player.videoContainer.streamProvider.getCurrentQuality();
            if (quality) {
                this.title = quality.shortLabel;
            }
            else {
                setTimeout(() => updateLabel(), 500);
            }
        }

        updateLabel();
    }

    async itemSelected(itemData) {
        await this.player.videoContainer.streamProvider.setQuality(itemData.data);
        this.updateQualityLabel();
    }

    get buttonType() {
        return "radio";
    }
}
