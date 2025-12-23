import { DataPlugin } from '../core/Data';

import PaellaCoreDataPlugins from './PaellaCoreDataPlugins';

export default class LocalStorageDataPlugin extends DataPlugin {
    getPluginModuleInstance() {
        return PaellaCoreDataPlugins.Get();
    }

    get name() {
        return super.name || "es.upv.paella.localStorageDataPlugin";
    }
    
    serializeKey(context: string, params: any) {
        if (typeof(params) === "object") {
            params = JSON.stringify(params);
        }
        return `${context}|${params}`;
    }

    async read(context: string, keyParams: string) {
        const key = this.serializeKey(context, keyParams);
        let value = localStorage.getItem(key);
        try {
            value = value && JSON.parse(value);
        }
        catch (e) {}
        this.player.log.debug(`LocalStorageDataPlugin.read: ${key}`);
        return value;
    }

    async write(context: string, keyParams: string, data: any) {
        const key = this.serializeKey(context, keyParams);
        if (data && typeof(data) === "object") {
            try {
                data = JSON.stringify(data);
            }
            catch (e) {
                this.player.log.warn(`LocalStorageDataPlugin.write: ${key}: invalid data object.`);
                data = "";
            }
        }
        localStorage.setItem(key, data);
        this.player.log.debug(`LocalStorageDataPlugin.write: ${key}`);
    }

    async remove(context: string, keyParams: string) {
        const key = this.serializeKey(context, keyParams);
        localStorage.setItem(key, "");
        this.player.log.debug(`LocalStorageDataPlugin.remove: ${key}`);
    }
}
