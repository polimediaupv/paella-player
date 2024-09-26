import { PluginModule } from "paella-core";
import packageData from "../../package.json";
import es from "../i18n/es-ES.json";
import en from "../i18n/en-US.json";
import de from "../i18n/de-DE.json";

const dictionaries = {
    "es": es,
    "en": en,
    "de": de
};

let g_pluginModule = null;

export default class SlidePluginsModule extends PluginModule {
    static Get() {
        if (!g_pluginModule) {
            g_pluginModule = new SlidePluginsModule();
        }
        return g_pluginModule;
    }
    
    get moduleName() {
        return packageData.name;
    }

    get moduleVersion() {
        return packageData.version;
    }

    async getDictionaries() {
        return dictionaries;
    }
}