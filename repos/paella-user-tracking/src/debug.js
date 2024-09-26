import { Paella } from 'paella-core';
import getUserTrackingPluginsContext from './index';

const initParams = {
	customPluginContext: [
		getUserTrackingPluginsContext()
	]
};

let paella = new Paella('player-container', initParams);

paella.loadManifest()
	.then(() => console.log("done"))
	.catch(e => console.error(e));
