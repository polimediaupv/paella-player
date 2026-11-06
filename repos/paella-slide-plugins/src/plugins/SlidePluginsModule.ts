import { PluginModule } from "@asicupv/paella-core";
import packageData from "../../package.json";

import getDictionaries from "../i18n/all.js";

let g_pluginModule: SlidePluginsModule | null = null;

export default class SlidePluginsModule extends PluginModule {
    static Get() {
        if (!g_pluginModule) {
            g_pluginModule = new SlidePluginsModule();
        }
        return g_pluginModule;
    }
    
    get moduleName() {
        return packageData.name;
    }

    get moduleVersion() {
        return packageData.version;
    }

    async getDictionaries(language?: string) {
        return getDictionaries(language);
    }
}
