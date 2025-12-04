import Plugin from './Plugin';
import Events, { bindEvent } from './Events';
import Paella from '../Paella';

import { loadPluginsOfType } from './plugin_tools'

export async function loadLogEventPlugins(player: Paella) {
    await loadPluginsOfType(player, "eventLog", async (plugin) => {
        plugin.events.forEach((event: Events) => {
            bindEvent(player, event, async (params: any) => {
                await plugin.onEvent(event, params);
            })
        })
    });
}

export async function unloadLogEventPlugins(player: Paella) {
    
}

export default class EventLogPlugin extends Plugin {
    get type() { return "eventLog"; }

    get events() : Events[] {
        return [];
    }

    async onEvent(event: Events, params: any) : Promise<void> {
        this.player.log.warn(`${this.name}: onEvent() function is not overwritten.`)
    }
}
