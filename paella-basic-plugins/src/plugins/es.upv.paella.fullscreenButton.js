import { Events, bindEvent, ButtonPlugin } from 'paella-core';
import BasicPluginsModule from './BasicPluginsModule';

import fullscreenIcon from '../icons/fullscreen.svg';
import windowedIcon from '../icons/windowed.svg';

export default class PauseButtonPlugin extends ButtonPlugin {
	getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.fullscreenButton";
    }

	getAriaLabel() {
        return "Toggle fullscreen";
    }

    getDescription() {
        return this.getAriaLabel();
    }
	
	async isEnabled() {
		const enabled = await super.isEnabled()
		return enabled && this.player.isFullScreenSupported()
	}
	
	async load() {
		const fsIcon = this.player.getCustomPluginIcon(this.name,"fullscreenIcon") || fullscreenIcon;
		const wIcon = this.player.getCustomPluginIcon(this.name,"windowedIcon") || fullscreenIcon;
		this.icon = fsIcon
		bindEvent(this.player, Events.FULLSCREEN_CHANGED, (data) => {
			if (data.status) {
				this.icon = wIcon;
			}
			else {
				this.icon = fsIcon;
			}
		})
	}
	
	async action() {
		if (this.player.isFullscreen) {
			await this.player.exitFullscreen();
		}
		else {
			await this.player.enterFullscreen();
		}
	}
}