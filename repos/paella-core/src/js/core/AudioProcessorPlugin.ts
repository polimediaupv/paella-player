import Plugin from "./Plugin"
import { loadPluginsOfType } from "./plugin_tools"
import Paella from "../Paella";
import type { AudioProcessorPluginConfig } from "./Config";

// const g_enabledAudioProcessorPlugins: AudioProcessorPlugin[] = [];
// export async function loadAudioProcessorPlugins(
//     player: Paella,
//     context: AudioContext,
//     source: MediaElementAudioSourceNode,
//     destination: AudioDestinationNode
// ) {
//     await loadPluginsOfType(player, "audioProcessor", async (plugin) => {
//         const audioPlugin = plugin as AudioProcessorPlugin;
//         g_enabledAudioProcessorPlugins.push(audioPlugin);
//     });

//     let lastProcessorInput: AudioNode = source;
//     for (const processor of g_enabledAudioProcessorPlugins) {
//         const connections = await processor.getConnections(context);
//         lastProcessorInput.connect(connections.input);
//         lastProcessorInput = connections.output;
//     }
//     lastProcessorInput.connect(destination);
// }

const g_enabledAudioProcessorPlugins: AudioProcessorPlugin[] = [];

// Track the individual connections (edges) created by the processor chain
// instead of the nodes themselves. This lets us tear the chain down with the
// targeted `from.disconnect(to)` form, which removes ONLY the edge we created.
//
// This is important because the `source` and `destination` nodes are shared:
// consumers of the direct StreamProvider API (e.g. the real time captions
// plugin) connect their own graph to the same `audioSourceNode`. Calling the
// parameterless `node.disconnect()` would wipe every outgoing connection of
// the source node, silently breaking those external taps and forcing the user
// to reconnect them. Disconnecting per-edge leaves external taps untouched.
let g_loadedAudioProcessorConnections: { from: AudioNode, to: AudioNode }[] = [];

export function unloadAudioProcessorPlugins() {
	for (const { from, to } of g_loadedAudioProcessorConnections) {
		try {
			from.disconnect(to);
		}
		catch {
			// Ignore already disconnected edges
		}
	}

	g_loadedAudioProcessorConnections = [];
}

export async function loadAudioProcessorPlugins(
	player: Paella,
	context: AudioContext,
	source: AudioNode,
	destination: AudioDestinationNode
) {
	unloadAudioProcessorPlugins();

	g_enabledAudioProcessorPlugins.length = 0;

	await loadPluginsOfType(player, "audioProcessor", async (plugin) => {
		const audioPlugin = plugin as AudioProcessorPlugin;
		g_enabledAudioProcessorPlugins.push(audioPlugin);
	});

	const connect = (from: AudioNode, to: AudioNode) => {
		from.connect(to);
		g_loadedAudioProcessorConnections.push({ from, to });
	};

	let lastProcessorOutput: AudioNode = source;

	for (const processor of g_enabledAudioProcessorPlugins) {
		const connections = await processor.getConnections(context);
        if (connections.enabled === false) {
            continue;
        }

		connect(lastProcessorOutput, connections.input);

		lastProcessorOutput = connections.output;
	}

	connect(lastProcessorOutput, destination);
}

export async function unloadInteractiveAreaPlugins(player: Paella) {
    g_enabledAudioProcessorPlugins.slice(0);
}


export default class AudioProcessorPlugin<PluginC extends AudioProcessorPluginConfig = AudioProcessorPluginConfig> extends Plugin<PluginC> {
    get type() { return "audioProcessor"; }

    async getConnections(audioContext: AudioContext) : Promise<{
        input: AudioNode,
        output: AudioNode,
        enabled?: boolean
    }>{
        // Very simple audio processor: a gain control
        const volumeNode = audioContext.createGain();
        volumeNode.gain.value = 0.5;
        return {
            input: volumeNode,
            output: volumeNode
        }
    }

    async reloadProcessor() {
        this.player.videoContainer?.streamProvider.reloadAudioProcessors();
    }
}
