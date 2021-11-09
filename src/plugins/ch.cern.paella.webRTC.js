import { ButtonPlugin } from 'paella-core';

import WebRTCIcon from './icons/WebRTCOn.svg';

export default class WebRTCPlugin extends ButtonPlugin {

    async load() {
		this.icon = WebRTCIcon;
        console.log("WebRTCPlugin loading ...");
	}

    async action() {
        console.log("WebRTCPlugin action ...");
        const currentTime = await this.player.videoContainer.currentTime();
		console.log(currentTime);
    }

    async isEnabled() {
        if (!(await super.isEnabled())) {
            console.log("WebRTCPlugin button disabled.");
            return false;
        }
        console.log("WebRTCPlugin button enabled.");
    }
}