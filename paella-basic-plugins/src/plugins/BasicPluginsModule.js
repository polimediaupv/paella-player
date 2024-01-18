import { PluginModule } from "paella-core";
import packageData from "../../package.json";
import dictionaries from '../dictionaries';

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
        return dictionaries;
    }
}