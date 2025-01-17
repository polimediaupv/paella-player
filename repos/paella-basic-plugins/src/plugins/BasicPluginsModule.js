import { PluginModule } from "@asicupv/paella-core";
import packageData from "../../package.json";

let g_pluginModule = null;

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

    async getDictionaries() {
        return {};
    }
}