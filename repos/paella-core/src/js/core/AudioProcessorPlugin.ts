import Plugin from "./Plugin"
import { loadPluginsOfType } from "./plugin_tools"
import Paella from "../Paella";
import type { AudioProcessorPluginConfig } from "./Config";

const g_enabledAudioProcessorPlugins: AudioProcessorPlugin[] = [];
export async function loadAudioProcessorPlugins(
    player: Paella,
    context: AudioContext,
    source: MediaElementAudioSourceNode,
    destination: AudioDestinationNode
) {
    await loadPluginsOfType(player, "audioProcessor", async (plugin) => {
        const audioPlugin = plugin as AudioProcessorPlugin;
        g_enabledAudioProcessorPlugins.push(audioPlugin);
    });

    let lastProcessorInput: AudioNode = source;
    for (const processor of g_enabledAudioProcessorPlugins) {
        const connections = await processor.getConnections(context);
        lastProcessorInput.connect(connections.input);
        lastProcessorInput = connections.output;
    }
    lastProcessorInput.connect(destination);
}

export async function unloadInteractiveAreaPlugins(player: Paella) {
    g_enabledAudioProcessorPlugins.slice(0);
}


export default class AudioProcessorPlugin<PluginC extends AudioProcessorPluginConfig = AudioProcessorPluginConfig> extends Plugin<PluginC> {
    get type() { return "audioProcessor"; }

    async getConnections(audioContext: AudioContext) : Promise<{
        input: AudioNode,
        output: AudioNode
    }>{
        // Very simple audio processor: a gain control
        const volumeNode = audioContext.createGain();
        volumeNode.gain.value = 0.5;
        return {
            input: volumeNode,
            output: volumeNode
        }
    }
}
