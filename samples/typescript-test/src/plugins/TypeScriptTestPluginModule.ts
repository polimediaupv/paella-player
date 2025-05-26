import { PluginModule } from "@asicupv/paella-core";

let g_instance: PluginModule | null = null;

export default class TypeScriptTestPluginModule extends PluginModule {
    static Get() {
        if (!g_instance) {
            g_instance = new TypeScriptTestPluginModule();
        }
        return g_instance;
    }

    get moduleName() {
        return "es.upv.paella.TypeScriptTestPluginModule";
    }

    get moduleVersion() {
        return "1.0.0";
    }
}