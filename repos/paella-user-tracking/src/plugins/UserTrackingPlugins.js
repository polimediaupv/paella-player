import { PluginModule } from "paella-core";
import packageData from "../../package.json";

let g_pluginModule = null;

export default class UserTrackingPlugins extends PluginModule {
    static Get() {
        if (!g_pluginModule) {
            g_pluginModule = new UserTrackingPlugins();
        }
        return g_pluginModule;
    }

    get moduleName() {
        return "paella-user-tracking";
    }

    get moduleVersion() {
        return packageData.version;
    }
}