import PluginModule from "../core/PluginModule";
import packageData from "../../../package.json";

let g_pluginModule: PaellaCoreVideoFormats | null = null;

export default class PaellaCoreVideoFormats extends PluginModule {
    static Get(): PaellaCoreVideoFormats {
        if (!g_pluginModule) {
            g_pluginModule = new PaellaCoreVideoFormats();
        }
        return g_pluginModule;
    }

    get moduleName(): string {
        return "paella-core default video formats";
    }

    get moduleVersion(): string {
        return packageData.version;
    }
}
