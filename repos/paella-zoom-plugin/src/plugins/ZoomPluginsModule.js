import { PluginModule } from "paella-core";
import packageData from "../../package.json";
import dictionaries from '../dictionaries';

let g_pluginModule = null;

export default class ZoomPluginsModule extends PluginModule {
    static Get() {
        if (!g_pluginModule) {
            g_pluginModule = new ZoomPluginsModule();
        }
        return g_pluginModule;
    }

    get moduleName() {
        return packageData.name;
    }

    get moduleVersion() {
        return packageData.version;
    }

    async getDictionaries() {
        return dictionaries;
    }
}