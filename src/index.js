
import { Paella } from 'paella-core';
import getBasicPluginContext from 'paella-basic-plugins';

const initParams = {
    customPluginContext: [
        require.context("./plugins", true, /\.js/),
        getBasicPluginContext()
    ]
};

let paella = new Paella('player-container', initParams);

paella.loadManifest()
    .then(() => console.log("done"))
    .catch(e => console.error(e));

