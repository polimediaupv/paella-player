import { ButtonPlugin } from 'paella-core';
import BasicPluginsModule from './BasicPluginsModule';

import defaultBackwardIcon from '../icons/back-30-s.svg';

export default class BackwardButtonPlugin extends ButtonPlugin {
	getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.backwardButtonPlugin";
    }

	getAriaLabel() {
        return this.player.translate("Backward $1 seconds",[this.time]);
    }

    getDescription() {
        return this.getAriaLabel();
    }
	
	async isEnabled() {
		const enabled = await super.isEnabled();
		this.time = this.config.time || 30;
		return enabled;
	}

	async load() {
		const addSuffix = this.config.suffix !== undefined ? this.config.suffix : true;
		this.suffix = addSuffix ? "s" : ""; 
		this.icon = this.player.getCustomPluginIcon(this.name,"backwardIcon") || defaultBackwardIcon;
		setTimeout(() => {
			Array.from(this.iconElement.getElementsByClassName('time-text'))
				.forEach(textIcon => {
					textIcon.innerHTML = this.time + this.suffix;
				})
		}, 100);
	}
	
	async action() {
		const currentTime = await this.player.videoContainer.currentTime();
		this.player.videoContainer.setCurrentTime(currentTime - this.time);
	}
}
