import Plugin from "./Plugin";
import { loadPluginsOfType } from "./plugin_tools";
import Paella from "../Paella";
import type { InteractiveAreaPluginConfig } from "./Config";

const g_enabledInteractiveAreaPlugins: InteractiveAreaPlugin[] = [];
export async function loadInteractiveAreaPlugins(player: Paella) {
    await loadPluginsOfType(player, "interactiveArea", async (plugin) => {
        g_enabledInteractiveAreaPlugins.push(plugin as InteractiveAreaPlugin);
    });
}

export async function unloadInteractiveAreaPlugins(player: Paella) {
    g_enabledInteractiveAreaPlugins.slice(0);
}

export default class InteractiveAreaPlugin<PluginC extends InteractiveAreaPluginConfig = InteractiveAreaPluginConfig> extends Plugin<PluginC> {
    get type() { return "interactiveArea"; }

    async getContent() : Promise<HTMLElement> {
        throw Error(`getContent() not implemented`);
    }
}
