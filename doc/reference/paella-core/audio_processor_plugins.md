# Audio Processor Plugins

Audio processor plugins let you process the video's audio using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). You can add effects like compression, equalization, gain adjustment, or any combination of audio nodes.

---

## Table of Contents

- [Overview](#overview)
- [AudioProcessorPlugin Base Class](#audioprocessorplugin-base-class)
- [AudioProcessorPluginConfig Type](#audioprocessorpluginconfig-type)
- [PluginModule Base Class](#pluginmodule-base-class)
- [Audio Graph Wiring](#audio-graph-wiring)
- [Plugin Registration](#plugin-registration)

---

## Overview

Paella builds an audio processor graph by chaining together all registered plugins of type `audioProcessor`. Each plugin returns an input node and an output node, which the framework connects in series from the video's source node to the audio destination.

The key classes and types are:

| Symbol | Description |
|--------|-------------|
| `AudioProcessorPlugin` | Base class to extend for audio processing plugins |
| `AudioProcessorPluginConfig` | Configuration type for audio processor plugins |
| `PluginModule` | Base class for plugin module metadata (name, version, dictionaries) |

---

## AudioProcessorPlugin Base Class

Extends `Plugin<PluginC>` and registers itself with `type = "audioProcessor"`.

### Methods

### `get type()` → `string`

Returns the fixed string `"audioProcessor"`. This is how the plugin registry identifies the plugin type.

```typescript
get type() { return "audioProcessor"; }
```

### `async getConnections(audioContext: AudioContext): Promise<{ input: AudioNode, output: AudioNode, enabled?: boolean }>`

**Mandatory to override.** Creates and returns the Web Audio API nodes that form this processor's chain. The framework connects the returned nodes in series.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `audioContext` | `AudioContext` | The audio context to create nodes from |

**Returns a Promise resolving to:**

| Field | Type | Description |
|-------|------|-------------|
| `input` | `AudioNode` | The node that receives audio from the previous processor (or the video source) |
| `output` | `AudioNode` | The node whose output feeds the next processor (or the audio destination) |
| `enabled` | `boolean` (optional) | If `false`, this processor is skipped entirely in the chain |

**Default implementation:** Creates a single `GainNode` with `gain.value = 0.5` as both input and output (a passthrough at half volume).

### `async reloadProcessor(): Promise<void>`

Reloads the entire audio processor graph by calling `streamProvider.reloadAudioProcessors()`. Use this after changing internal configuration so the audio chain is rebuilt.

### `async isEnabled(): Promise<boolean>`

Inherited from `Plugin`. Returns the value of `this._config.enabled`, or `false` by default.

### `async load(): Promise<void>`

Inherited from `Plugin`. Called once when the plugin is initialized. Empty by default. Override to perform setup (e.g., creating persistent audio nodes, binding events).

### `async unload(): Promise<void>`

Inherited from `Plugin`. Called when the plugin is torn down. Empty by default. Override to disconnect nodes, clean up resources.

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `player` | `Paella` | — | The player instance (from `PlayerResource` base) |
| `config` | `ConfigT` | `{}` (cast) | Read-only access to the plugin config |
| `order` | `number \| null` | `0` | Loading order within audio processors |
| `description` | `string \| null` | `""` | Human-readable description |
| `name` | `string \| null` | set at registration | Unique plugin identifier |
| `_config` | `ConfigT` | `{}` | Public backing field for config |

---

## AudioProcessorPluginConfig Type

```typescript
type AudioProcessorPluginConfig = {
    enabled?: boolean;    // whether the plugin is active on load (default: false)
    order?: number;       // loading/rendering order within audio processors
    description?: string; // human-readable description
}
```

This type currently extends the base `PluginConfig` without additional fields. The extension point is reserved for future audio-specific configuration.

---

## PluginModule Base Class

Plugins report their module metadata through `getPluginModuleInstance()`. The framework registers the returned module if its `moduleName` is unique.

### Methods

### `get moduleName()` → `string`

The display name of the plugin module. Override to return a meaningful identifier.

### `get moduleVersion()` → `string`

The version of the module (typically semver).

### `async getDictionaries()` → `Promise<Dictionaries \| null>`

Return i18n translation dictionaries keyed by language code (e.g., `{ en: { ... }, es: { ... } }`).

### Typical Implementation Pattern

```typescript
let g_instance: MyModule | null = null;

export default class MyModule extends PluginModule {
    static Get() {
        if (!g_instance) {
            g_instance = new MyModule();
        }
        return g_instance;
    }

    get moduleName() {
        return "my-plugin-package";
    }

    get moduleVersion() {
        return "1.0.0";
    }

    async getDictionaries() {
        return { en: { hello: "Hello" }, es: { hello: "Hola" } };
    }
}
```

---

## Audio Graph Wiring

The framework builds the audio graph as follows (simplified):

1. Create an `AudioContext` and a `MediaElementAudioSourceNode` from the video element.
2. Collect all registered plugins of type `"audioProcessor"`.
3. For each plugin in order:
   a. Call `getConnections(audioContext)`.
   b. If `connections.enabled === false`, skip it entirely.
   c. Connect `lastOutput → connections.input`.
   d. Set `lastOutput = connections.output`.
   e. Track all nodes for cleanup.
4. Connect the final `lastOutput → AudioContext.destination`.

The chain looks like:

```
[Video Source] → [Processor 1] → [Processor 2] → ... → [Audio Destination]
```

To implement a processor, create the nodes you need, wire them together internally, and return the chain's input and output nodes.

---

## Plugin Registration

Audio processor plugins are registered the same way as other paella plugins:

1. **Export from your plugin package:**

```typescript
// index.ts
import AudioEnhancementPlugin from './plugins/es.upv.paella.audioEnhancement';

export const audioPlugins = [
    {
        plugin: AudioEnhancementPlugin,
        config: { enabled: false }
    }
];
```

2. **Pass to the player at initialization:**

```typescript
import { Paella } from "@asicupv/paella-core";
import { audioPlugins } from "your-plugin-package";

const player = new Paella('playerContainer', {
    plugins: audioPlugins
});
await player.loadManifest();
```

Each entry in `plugins` must follow the `{ plugin: Class, config: Partial<PluginConfig> }` shape.
