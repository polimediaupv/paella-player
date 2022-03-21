
import { Paella, utils } from 'paella-core';
import getBasicPluginContext from 'paella-basic-plugins';
import getSlidePluginContext from 'paella-slide-plugins';
import getZoomPluginContext from 'paella-zoom-plugin';
import getUserTrackingPluginContext from 'paella-user-tracking';

import packageData from "../package.json";

window.onload = async () => {
    const initParams = {
        customPluginContext: [
            require.context("./plugins", true, /\.js/),
            getBasicPluginContext(),
            getSlidePluginContext(),
            getZoomPluginContext(),
            getUserTrackingPluginContext()
        ]
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
    }
    catch (e) {
        console.error(e);
    }

}    
