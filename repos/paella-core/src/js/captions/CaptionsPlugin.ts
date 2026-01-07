import Plugin from '../core/Plugin';
import { loadPluginsOfType } from '../core/plugin_tools';
import Paella from '../Paella';

export async function loadCaptionsPlugins(player: Paella) {
    const enabledCaptionsPlugins: Plugin[] = [];
    await loadPluginsOfType(player, "captions", async (plugin) => {
        enabledCaptionsPlugins.push(plugin);
    });

    for (let i in enabledCaptionsPlugins) {
        const plugin = enabledCaptionsPlugins[i];
        if (plugin instanceof CaptionsPlugin) {
            const captions = await plugin.getCaptions();
            const captionsCanvas = player.captionsCanvas;
            captions.forEach(c => captionsCanvas.addCaptions(c));
        }
    }
}

export default class CaptionsPlugin extends Plugin {
    get type() { return "captions"; }
    
    async load() {
        this.player.log.debug("load captions plugin");
    }

    async getCaptions(): Promise<any[]> {
        this.player.log.warn(`CaptionsPlugin ${this.name}: getCaptions() is not implemented.`);
        return [];
    }
}
