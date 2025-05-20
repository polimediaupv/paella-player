

import { Paella } from '@asicupv/paella-core';
import { } from '@asicupv/paella-basic-plugins';

import '@asicupv/paella-core/paella-core.css';

window.addEventListener("load", async () => {
    const player = new Paella('playerContainer', {

        plugins: [
        ]
    });

    console.log(player.version);
    player.log.warn('This is a warning');
    player.log.error('This is an error');

    
    player.bindEvent(player.Events.PLAY, (event) => {
        console.log(event);
    });

    

    await player.loadManifest();

    player.videoContainer.streamProvider.streamData[0].content;
    
});
