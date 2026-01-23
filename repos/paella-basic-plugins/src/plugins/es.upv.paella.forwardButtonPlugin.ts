import { ButtonPlugin, type ButtonPluginConfig } from "@asicupv/paella-core";
import BasicPluginsModule from './BasicPluginsModule';

import { ForwardIcon as defaultForwardIcon } from '../icons/forward-30-s.js';

type ForwardButtonPluginConfig = ButtonPluginConfig & {
    time?: number;
    suffix?: boolean;
}

export default class ForwardButtonPlugin extends ButtonPlugin<ForwardButtonPluginConfig> {
    private time = 30;
    private suffix = "s";

	getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.forwardButtonPlugin";
    }

	getAriaLabel() {
        return this.player.translate("Forward $1 seconds",[this.config.time]);
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
		this.icon = this.player.getCustomPluginIcon(this.name,"forwardIcon") || defaultForwardIcon;
        const iconElement = (this as { iconElement?: HTMLElement }).iconElement;
		setTimeout(() => {
			Array.from(iconElement?.getElementsByClassName('time-text') || [])
				.forEach(textIcon => {
					(textIcon as HTMLElement).innerHTML = this.time + this.suffix;
				});
		}, 100);
	}
	
	async action() {
		const currentTime = await this.player.videoContainer?.currentTime() || 0;
		this.player.videoContainer?.setCurrentTime(currentTime + this.time);
	}

	async getHelp() {
        return {
            title: "Forward button",
            description: "Allows you to fast-forward the video by a specified number of seconds."
        };
    }
}
