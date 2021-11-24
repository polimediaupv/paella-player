import { ButtonPlugin } from 'paella-core'
import { Events, bindEvent } from 'paella-core';
import { triggerEvent } from 'paella-core';
import { utils } from 'paella-core';

import fullscreenIcon from './icons/WebRTCOn.svg';

export const cernEvents = {
    FRAME_ARISED: "paramsPlugin:triggerAction"
  };

export default class paramsPlugin extends ButtonPlugin {

	getAriaLabel() {
        return "CERN button";
    }

    getDescription() {
        return this.getAriaLabel();
    }

	async getDictionaries() {
		return {
			es: {
				"CERN button": "CERN action button"
			}
		}
	}

	async isEnabled() {
        console.log("params button is enabled");
	}

	async load() {
		this.icon = fullscreenIcon;

        bindEvent(this.player, Events.PLAY, () => console.log("CERN video is playing"));
        bindEvent(this.player, cernEvents.FRAME_ARISED, (params) => {
            console.log("CERN Trigger FRAME_ARISED action");
            console.log(params);
          });
        bindEvent(this.player, Events.MANIFEST_LOADED, (params) => {
            console.log("CERN Events.MANIFEST_LOADED");
            console.log(params);
          });
        bindEvent(player, Events.PLAYER_LOADED, (params) => {
            console.log("CERN Events.PLAYER_LOADED. Current time: "+(utils.getUrlParameter("start")));
            this._videoPlayer.setCurrentTime(utils.getUrlParameter("start"));
            console.log(params);
        });

	}

    async action() {
        console.log("Test");
        triggerEvent(this.player, cernEvents.FRAME_ARISED, { param1: 1, param2: "2" });
    }
}