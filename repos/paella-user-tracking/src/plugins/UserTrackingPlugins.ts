import { PluginModule } from "@asicupv/paella-core";
import packageData from "../../package.json";

let g_pluginModule: UserTrackingPlugins | null = null;

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
