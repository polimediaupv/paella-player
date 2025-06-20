import PluginModule from "../core/PluginModule";
import packageData from "../../../package.json";

let g_pluginModule = null;

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
        return packageData.version;
    }

    getDictionaries() {
        return {
            "es": {
                "playPauseButtonHelp.title": "Ayuda del botón de reproducción/pausa",
                "playPauseButtonHelp.description": "Este botón permite reproducir o pausar el video."
            },
            "en": {
                "playPauseButtonHelp.title": "Play/Pause button help",
                "playPauseButtonHelp.description": "This button allows you to play or pause the video."
            }
        }
    }
}