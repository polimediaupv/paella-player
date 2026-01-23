import { ButtonType, MenuButtonPlugin, type MenuButtonPluginConfig, type VideoQualityItem } from "@asicupv/paella-core";
import BasicPluginsModule from './BasicPluginsModule';

import { ScreenIcon as defaultScreenIcon }  from '../icons/screen.js';
import { SettingsIcon as defaultSettingsIcon }  from '../icons/settings.js';

type QualitySelectorPluginConfig = MenuButtonPluginConfig & {
    showIcon?: boolean;
}

type QualityMenuItem = {
    id: number;
    title: string;
    width: number;
    height: number;
    data: VideoQualityItem;
    selected: boolean;
};


export default class QualitySelectorPlugin extends MenuButtonPlugin<QualitySelectorPluginConfig> {
    private _qualities: VideoQualityItem[] = [];
    private _stateText: string | null = null;

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

        this._qualities = await this.player.videoContainer?.streamProvider.getQualities() as VideoQualityItem[];

        return this._qualities && this._qualities.length > 1;
    }

    async load() {
        if (this.config.showIcon === false) {

        }
        else {
            this.icon = this.player.getCustomPluginIcon("es.upv.paella.qualitySelector","screenIcon") || defaultScreenIcon;
            this.menuIcon = this.player.getCustomPluginIcon("es.upv.paella.qualitySelector","settingsIcon") || defaultSettingsIcon;
        }

        await this.updateQualityLabel();
    }

    async getMenu(): Promise<QualityMenuItem[]> {
        await this.updateQualityLabel();
        const quality = await this.player.videoContainer?.streamProvider.getCurrentQuality();
        const result = this._qualities.map(q => {
            const selected = q.index === quality?.index;
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
            const quality = await this.player.videoContainer?.streamProvider.getCurrentQuality();
            if (quality) {
                if (this.isMenuButton) {
                    this.title = this.description;
                    this._stateText = quality.shortLabel;
                }
                else {
                    this.title = quality.shortLabel;
                }
            }
            else {
                setTimeout(() => updateLabel(), 500);
            }
        }

        updateLabel();
    }

    async itemSelected(itemData: QualityMenuItem) {
        await this.player.videoContainer?.streamProvider.setQuality(itemData.data);
        this.updateQualityLabel();
    }

    get buttonType(): ButtonType {
        return "radio";
    }

    get stateText() {
        return this._stateText;
    }

    async getHelp() {
        return {
            title: "Video quality",
            description: "Allows you to select the video quality from the available options."
        }
    }
}
