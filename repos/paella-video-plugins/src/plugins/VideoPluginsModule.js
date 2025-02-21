import { PluginModule } from "@asicupv/paella-core";
import packageData from "../../package.json";

let g_pluginModule = null;

export default class VideoPluginsModule extends PluginModule {
    static Get() {
        if (!g_pluginModule) {
            g_pluginModule = new VideoPluginsModule();
        }
        return g_pluginModule;
    }

    get moduleName() {
        return "paella-video-plugins";
    }

    get moduleVersion() {
        return packageData.version;
    }
}