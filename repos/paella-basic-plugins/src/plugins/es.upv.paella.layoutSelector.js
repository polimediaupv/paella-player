import { MenuButtonPlugin, utils } from "@asicupv/paella-core";
import BasicPluginsModule from './BasicPluginsModule';

import { PresentationModeIcon as presentationMode } from '../icons/presentation-mode.js';

export default class LayoutSelectorPlugin extends MenuButtonPlugin {
	getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.layoutSelector";
    }

	getAriaLabel() {
        return "Video layout";
    }

    getDescription() {
        return this.getAriaLabel();
    }

	async isEnabled() {
		if (!(await super.isEnabled())) {
			return false;
		}

		return this.player.videoContainer.validContentSettings.length > 1;
	}
	
	async load() {
		this.icon = this.player.getCustomPluginIcon(this.name, "layoutIcon") || presentationMode;
		this._showIcons = this.config.showIcons ?? true;
	}
	
	async getMenu() {
		const contentSettings = this.player.videoContainer.validContentSettings;
		return Promise.all(await contentSettings.map(async item => {
			const configPath = utils.joinPath([this.player.configResourcesUrl, item.icon]);
			const icon = this._showIcons && await utils.loadSvgIcon(configPath) || null;
			return {
				id: item.id,
				title: item.title,
				icon,
				selected: this.player.videoContainer.layoutId === item.id
			}
		}));
	}
	
	get showTitles() {
		return false;
	}
	
	get buttonType() {
		return "radio";
	}
	
	itemSelected(itemData, /* menuItems */) {
		this.player.videoContainer.setLayout(itemData.id);
	}

	async getHelp() {
        return {
            title: "Layout selector",
            description: "Allows you to choose the video layout from the available options."
        };
    }
}