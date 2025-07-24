import { PluginModule } from "@asicupv/paella-core";

let g_pluginModule: PluginModule | null = null;

export default class TestPlayerPluginModule extends PluginModule {
    static get() {
        if (!g_pluginModule) {
            g_pluginModule = new TestPlayerPluginModule();
        }
        return g_pluginModule;
    }

    get moduleName(): string {
        return "TestPlayerPluginModule";
    }

    get moduleVersion(): string {
        return "1.0.0";
    }
}
