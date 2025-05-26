

import { Paella } from '@asicupv/paella-core';
import {
    basicPlugins
} from '@asicupv/paella-basic-plugins';
import { videoPlugins } from '@asicupv/paella-video-plugins';
import { webglPlugins } from '@asicupv/paella-webgl-plugins';
import { slidePlugins } from '@asicupv/paella-slide-plugins';
import { userTrackingPlugins } from '@asicupv/paella-user-tracking';
import { zoomPlugins } from '@asicupv/paella-zoom-plugin';

import '@asicupv/paella-core/paella-core.css';
import '@asicupv/paella-basic-plugins/paella-basic-plugins.css';
import '@asicupv/paella-slide-plugins/paella-slide-plugins.css';

import TestPlugin from "./plugins/TestButtonPlugin";

window.addEventListener("load", async () => {
    const player = new Paella('playerContainer', {

        plugins: [
            {
                plugin: TestPlugin,
                config: {
                    enabled: true
                }
            },
            ...basicPlugins,
            ...videoPlugins,
            ...webglPlugins,
            ...slidePlugins,
            ...userTrackingPlugins,
            ...zoomPlugins
        ]
    });

    console.log(player.version);
    player.log.warn('This is a warning');
    player.log.error('This is an error');

    console.log("Player States: " + player.PlayerState);
    console.log("Player State Names: " + player.PlayerStateNames);

    player.bindEvent(player.Events.PLAY, (event) => {
        console.log(event);
    });

    await player.loadManifest();

    
});
