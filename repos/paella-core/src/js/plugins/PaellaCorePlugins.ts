import PluginModule from "../core/PluginModule";
import { createDictionaryLoader } from '../core/DictionaryLoader';

const getDictionaries = createDictionaryLoader({
    es: () => import('./i18n/es.json'),
    en: () => import('./i18n/en.json')
});

let g_pluginModule: PaellaCorePlugins | null = null;

export default class PaellaCorePlugins extends PluginModule {
    static Get() {
        if (!g_pluginModule) {
            g_pluginModule = new PaellaCorePlugins();
        }
        return g_pluginModule;
    }

    get moduleName() {
        return "paella-core default plugins";
    }

    get moduleVersion() {
        return __PAELLA_VERSION__;
    }

    getDictionaries(language?: string) {
        return getDictionaries(language);
    }
}
