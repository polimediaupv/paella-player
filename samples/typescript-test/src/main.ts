

import { Paella } from '@asicupv/paella-core';
import {
    basicPlugins,
    AudioSelectorButtonPlugin,
    BackwardButtonPlugin
} from '@asicupv/paella-basic-plugins';

import '@asicupv/paella-core/paella-core.css';

window.addEventListener("load", async () => {
    const player = new Paella('playerContainer', {

        plugins: [
            ...basicPlugins,
            AudioSelectorButtonPlugin,
            {
                plugin: BackwardButtonPlugin,
                config: {
                    enabled: true
                }
            }
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
