
import { Paella } from 'paella-core';
import getBasicPluginContext from 'paella-basic-plugins';
import getSlidePluginContext from 'paella-slide-plugins';
import getfreakyloopPluginContext from 'paella-freakyloop-plugin';
import getUserTrackingPluginContext from 'paella-user-tracking';

const initParams = {
    customPluginContext: [
        require.context("./plugins", true, /\.js/),
        getBasicPluginContext(),
        getfreakyloopPluginContext(),
        getSlidePluginContext(),
        getUserTrackingPluginContext()
    ]
};

let paella = new Paella('player-container', initParams);

paella.loadManifest()
    .then(() => console.log("done"))
    .catch(e => console.error(e));

