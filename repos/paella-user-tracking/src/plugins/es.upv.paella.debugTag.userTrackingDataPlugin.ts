
import { DataPlugin, type DataPluginConfig } from '@asicupv/paella-core';
import UserTrackingPlugins from "./UserTrackingPlugins";

interface DebugTagTrackingDataPluginConfig extends DataPluginConfig {
    tagId?: string;
}

export default class DebugTagTrackingDataPlugin extends DataPlugin<DebugTagTrackingDataPluginConfig> {
    private _elem: HTMLElement | null = null;

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

    async write(context: string, id: string, data: any) {
        if (this._elem) {
            this._elem.innerHTML += '<br/>' + id + " " + data.event;
        }
    }
}