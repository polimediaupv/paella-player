
import { DataPlugin } from '@asicupv/paella-core';
import UserTrackingPlugins from "./UserTrackingPlugins";

export default class DebugTagTrackingDataPlugin extends DataPlugin {
    getPluginModuleInstance() {
		return UserTrackingPlugins.Get();
	}

	get name() {
		return super.name || "es.upv.paella.debugTag.userTrackingDataPlugin";
	}

    async load() {
        if (this.config.tagId) {
            this._elem = document.getElementById(this.config.tagId);
        }
    }

    async write(context, { id }, data) {
        if (this._elem) {
            this._elem.innerHTML += '<br/>' + id + " " + data.event;
        }
    }
}