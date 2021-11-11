

import { utils } from 'paella-core';
import { Paella } from 'paella-core';
import getBasicPluginContext from 'paella-basic-plugins';
import getSlidePluginContext from 'paella-slide-plugins';
import getfreakyloopPluginContext from 'paella-freakyloop-plugin';
import getUserTrackingPluginContext from 'paella-user-tracking';

export async function getMyVideoIdFunction() {
    console.debug("Using MY specific getVideoId function");
    if (utils.getUrlParameter("year")){
        return (utils.getUrlParameter("year") + "/" + utils.getUrlParameter("id"));
    }else{
        return utils.getUrlParameter("id") 
    }
}

export async function getMyVideoYearFunction() {
    console.debug("Using MY specific getMyVideoYear function");
    return utils.getUrlParameter("year");
}

export async function getMyRepositoryURLFunction() {
    console.debug("Using MY specific getMyRepositoryURL function");
    return 'media_data';
}

export async function getMyManifestUrlFunction() {
    console.debug("Using MY specific getManifestUrl function");
    return utils.joinPath([getMyRepositoryURLFunction(), getMyVideoYearFunction(), getMyVideoIdFunction()]);
}

export async function getMySessionFunction() {
    console.debug("Using MY specific getMySession function");
    console.debug(utils.getUrlParameter("session"));
    return utils.getUrlParameter("session");
}


const initParams = {
    customPluginContext: [
        require.context("./plugins", true, /\.js/),
        getBasicPluginContext(),
        getfreakyloopPluginContext(),
        getSlidePluginContext(),
        getUserTrackingPluginContext()
    ],
    repositoryUrl: 'repository',
    getVideoId: getMyVideoIdFunction
};

let paella = new Paella('player-container', initParams);

paella.loadManifest()
    .then(() => console.log("done"))
    .catch(e => console.error(e));

