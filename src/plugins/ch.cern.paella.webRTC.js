//import WebRTC from 'webrtc.js';

import {
    ButtonPlugin
} from 'paella-core';

import WebRTCIcon from './icons/CERN.svg';

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
}