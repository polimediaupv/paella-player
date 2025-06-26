import { Paella } from '@asicupv/paella-core';
import { basicPlugins } from '@asicupv/paella-basic-plugins';
import { slidePlugins } from '@asicupv/paella-slide-plugins';
import { zoomPlugins } from '@asicupv/paella-zoom-plugin';
import { userTrackingPlugins } from '@asicupv/paella-user-tracking';
import { webglPlugins } from '@asicupv/paella-webgl-plugins';
import { iFramePlugins } from '@asicupv/paella-iframe-plugin';
import { videoPlugins } from '@asicupv/paella-video-plugins';

import '@asicupv/paella-core/paella-core.css';
import '@asicupv/paella-basic-plugins/paella-basic-plugins.css';
import '@asicupv/paella-slide-plugins/paella-slide-plugins.css';
import '@asicupv/paella-zoom-plugin/paella-zoom-plugin.css';

window.onload = async () => {
    const initParams = {
        plugins: [
            ...videoPlugins,
            ...basicPlugins,
            ...slidePlugins,
            ...zoomPlugins,
            ...userTrackingPlugins,
            ...webglPlugins,
            ...iFramePlugins 
        ],


        // loadVideoManifest: async function (url, config, player) {
        //     // In this demo page there is no authentication, so we need to simulate it.
        //     // When we try to load a video with the url "/test-auth-videoId/data.json" we will simulate the authentication process.
        //     if ( url.search("/test-auth-videoId/data.json") > 0) {
        //         const iFramePlugin = player.getPlugin("es.upv.paella.iFramePlugin")?.eventLog;
        //         if (iFramePlugin?.isEnabled()) {
        //             // Require authentication from the parent iFrame.
        //             await iFramePlugin?.sendAuthenticationRequestToParent({showLoader:true, stopExecution:true});
        //         }
        //     }
            
        //     return await defaultLoadVideoManifestFunction(url, config, player)
        // }
    };
    
    try {
        const paella = new Paella('player-container', initParams);
        // load Paella
        await paella.loadManifest()
        console.log("OK");        
    }
    catch (e) {
        console.error(e);
    }

}    