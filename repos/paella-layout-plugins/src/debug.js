import { Paella } from 'paella-core';
import getLayoutPluginsContext from './index';

const initParams = {
	customPluginContext: [
		getLayoutPluginsContext()
	]
};

let paella = new Paella('player-container', initParams);

paella.loadManifest()
	.then(() => {})
	.catch(e => console.error(e));
