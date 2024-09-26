import { PluginModule } from "paella-core";
import packageData from "../../package.json";

let g_pluginModule = null;

export default class WebGLPluginsModule extends PluginModule {
    static Get() {
        if (!g_pluginModule) {
            g_pluginModule = new WebGLPluginsModule();
        }
        return g_pluginModule;
    }

    get moduleName() {
        return "paella-webgl-plugins";
    }

    get moduleVersion() {
        return packageData.version;
    }
}