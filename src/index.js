import { Paella, utils, ButtonPlugin } from 'paella-core';
import { getPluginContext } from 'paella-basic-plugins';

const initParams = {
    customPluginContext: [
        require.context("./plugins", true, /\.js/),
        getPluginContext()
    ]
};

let paella = new Paella('player-container', initParams);

console.log(utils.secondsToTime(123312));

paella.loadManifest()
    .then(() => console.log("done"))
    .catch(e => console.error(e));