
<<<<<<< HEAD

import { utils } from 'paella-core';
import { Paella } from 'paella-core';
=======
import { Paella, utils } from 'paella-core';
>>>>>>> 2f9de3dddeea1102374214b5d8ca2e6a52a02814
import getBasicPluginContext from 'paella-basic-plugins';
import getSlidePluginContext from 'paella-slide-plugins';
import getweblecturePluginContext from 'paella-weblecture-plugin';
import getUserTrackingPluginContext from 'paella-user-tracking';

<<<<<<< HEAD
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
        getweblecturePluginContext(),
        getSlidePluginContext(),
        getUserTrackingPluginContext()
    ],
    repositoryUrl: 'repository',
    getVideoId: getMyVideoIdFunction
};
=======
import packageData from "../package.json";
>>>>>>> 2f9de3dddeea1102374214b5d8ca2e6a52a02814

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
