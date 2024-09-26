import { PluginModule } from "paella-core";
import packageData from "../../package.json";

let g_pluginModule = null;

export default class LayoutPluginsModule extends PluginModule {
    static Get() {
        if (!g_pluginModule) {
            g_pluginModule = new LayoutPluginsModule();
        }
        return g_pluginModule;
    }
    
    get moduleName() {
        return "paella-layout-plugins";
    }

    get moduleVersion() {
        return packageData.version;
    }
}