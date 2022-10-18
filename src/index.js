
import { Paella, utils } from 'paella-core';
import getBasicPluginContext from 'paella-basic-plugins';
import getSlidePluginContext from 'paella-slide-plugins';
import getZoomPluginContext from 'paella-zoom-plugin';
import getUserTrackingPluginContext from 'paella-user-tracking';

import packageData from "../package.json";

// Customized icons
import windowedIcon from "./icons/windowedIcon.svg";
import fullscreenIcon from "./icons/fullscreenIcon.svg";
import volumeHighIcon from "./icons/volumeHighIcon.svg";
import volumeMidIcon from "./icons/volumeMidIcon.svg";
import volumeLowIcon from "./icons/volumeLowIcon.svg";
import volumeMuteIcon from "./icons/volumeMuteIcon.svg";
import screenIcon from "./icons/screenIcon.svg";
import layoutIcon from "./icons/layoutIcon.svg";
import backwardIcon from "./icons/backwardIcon.svg";
import forwardIcon from "./icons/forwardIcon.svg";
import keyboardIcon from "./icons/keyboardIcon.svg";
import downloadIcon from "./icons/downloadIcon.svg";
import captionsIcon from "./icons/captionsIcon.svg";
import findCaptionsIcon from './icons/findCaptionsIcon.svg';
import slidesIcon from './icons/slidesIcon.svg';

function myWebsiteCheckConsentFunction(type) {
    const cookie_consent_level = utils.getCookie('cookie_consent_level');
    var consent_level = {}
    try {
        consent_level = JSON.parse(cookie_consent_level);
    }
    catch(e) {}
    return consent_level[type] || false;
}

window.onload = async () => {
    const initParams = {
        customPluginContext: [
            require.context("./plugins", true, /\.js/),
            getBasicPluginContext(),
            getSlidePluginContext(),
            getZoomPluginContext(),
            getUserTrackingPluginContext()
        ],
        getCookieConsentFunction: (type) => {
            return myWebsiteCheckConsentFunction(type);
        }
    };
    
    class PaellaPlayer extends Paella {
        get version() {
            const player = packageData.version;
            const coreLibrary = super.version;
            const pluginModules = this.pluginModules.map(m => `${ m.moduleName }: ${ m.moduleVersion }`);
            return {
                player,
                coreLibrary,
                pluginModules
            };
        }
    }
    
    let paella = new PaellaPlayer('player-container', initParams);

    try {
        await paella.loadManifest()
        console.log("Load done");

        await utils.loadStyle('style.css');
        console.log("Style loaded using Paella Core API");

        // Customized icon tests
		// fullscreen 
		paella.addCustomPluginIcon("es.upv.paella.fullscreenButton","fullscreenIcon",fullscreenIcon);
		paella.addCustomPluginIcon("es.upv.paella.fullscreenButton","windowedIcon",windowedIcon);

		// volume
		paella.addCustomPluginIcon("es.upv.paella.volumeButtonPlugin","volumeHighIcon",volumeHighIcon);
		paella.addCustomPluginIcon("es.upv.paella.volumeButtonPlugin","volumeMidIcon",volumeMidIcon);
		paella.addCustomPluginIcon("es.upv.paella.volumeButtonPlugin","volumeLowIcon",volumeLowIcon);
		paella.addCustomPluginIcon("es.upv.paella.volumeButtonPlugin","volumeMuteIcon",volumeMuteIcon);

		// quality selector
		paella.addCustomPluginIcon("es.upv.paella.qualitySelector","screenIcon",screenIcon);

		// playback rate
		paella.addCustomPluginIcon("es.upv.paella.playbackRateButton","screenIcon",screenIcon);

		// layout selector
		paella.addCustomPluginIcon("es.upv.paella.layoutSelector","layoutIcon",layoutIcon);

		// backward 30 segonds
		paella.addCustomPluginIcon("es.upv.paella.backwardButtonPlugin","backwardIcon",backwardIcon);

		// forward 30 segonds
		paella.addCustomPluginIcon("es.upv.paella.forwardButtonPlugin","forwardIcon",forwardIcon);

		// keyboard icon
		paella.addCustomPluginIcon("es.upv.paella.keyboardShortcutsHelp","keyboardIcon",keyboardIcon);

		// audio selector
		paella.addCustomPluginIcon("es.upv.paella.audioSelector","screenIcon",screenIcon);

		// download icon
		paella.addCustomPluginIcon("es.upv.paella.downloadsPlugin","downloadIcon",downloadIcon);

		// find captions icon
		paella.addCustomPluginIcon("es.upv.paella.findCaptionsPlugin","findCaptionsIcon",findCaptionsIcon);

		// captions icon
		paella.addCustomPluginIcon("es.upv.paella.captionsSelectorPlugin","captionsIcon",captionsIcon);

        // slides icon
        paella.addCustomPluginIcon("es.upv.paella.frameControlButtonPlugin","photoIcon",slidesIcon);
    }
    catch (e) {
        console.error(e);
    }

}    
