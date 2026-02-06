import { PluginModule } from "@asicupv/paella-core";
import packageData from "../../package.json";
import dictionaries from '../i18n/all.js';

let g_pluginModule: ZoomPluginsModule | null = null;

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
