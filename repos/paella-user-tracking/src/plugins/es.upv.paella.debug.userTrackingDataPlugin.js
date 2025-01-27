
import { DataPlugin } from '@asicupv/paella-core';
import UserTrackingPlugins from "./UserTrackingPlugins";

export default class DebugUserTrackingDataPlugin extends DataPlugin {
    getPluginModuleInstance() {
		return UserTrackingPlugins.Get();
	}

	get name() {
		return super.name || "es.upv.paella.debug.userTrackingDataPlugin";
	}

    async write(context, { id }, data) {
        console.log(`id: ${ id }`, context, data);
    }
}
