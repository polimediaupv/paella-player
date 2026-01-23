import { PluginModule, type Dictionaries } from "@asicupv/paella-core";
import packageData from "../../package.json";

import defaultDictionaries from "../i18n/all.js";

let g_pluginModule: BasicPluginsModule | null = null;

export default class BasicPluginsModule extends PluginModule {
    static Get() {
        if (!g_pluginModule) {
            g_pluginModule = new BasicPluginsModule();
        }
        return g_pluginModule;
    }
    
    get moduleName() {
        return "paella-basic-plugins";
    }

    get moduleVersion() {
        return packageData.version;
    }

    async getDictionaries(): Promise<Dictionaries | null> {
        return defaultDictionaries as Dictionaries;
    }
}
