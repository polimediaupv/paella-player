# Tutorial: Audio Processor Plugins

This tutorial walks you through building an audio enhancement plugin that applies dynamic compression and gain boost to the video audio. You will also learn how to create a button plugin that toggles the enhancement on and off.

---

## Table of Contents

- [Step 1: Create the Plugin Module](#step-1-create-the-plugin-module)
- [Step 2: Create the Audio Processor Plugin](#step-2-create-the-audio-processor-plugin)
- [Step 3: Register the Plugin with the Player](#step-3-register-the-plugin-with-the-player)
- [Step 4: Create the Toggle Button Plugin](#step-4-create-the-toggle-button-plugin)
- [Step 5: Wire the Button to the Audio Processor](#step-5-wire-the-button-to-the-audio-processor)

---

## Step 1: Create the Plugin Module

Every plugin package needs a module class that provides metadata (name, version, translation dictionaries). This is returned by `getPluginModuleInstance()`.

```typescript
// BasicPluginsModule.ts
import { PluginModule } from "@asicupv/paella-core";

let g_instance: BasicPluginsModule | null = null;

export default class BasicPluginsModule extends PluginModule {
    static Get() {
        if (!g_instance) {
            g_instance = new BasicPluginsModule();
        }
        return g_instance;
    }

    get moduleName() {
        return "paella-basic-plugins";
    }

    get moduleVersion() {
        return "1.0.0";
    }

    async getDictionaries() {
        return {
            en: {
                "audioEnhancement.enable": "Enable audio enhancement",
                "audioEnhancement.disable": "Disable audio enhancement"
            },
            es: {
                "audioEnhancement.enable": "Activar mejora de audio",
                "audioEnhancement.disable": "Desactivar mejora de audio"
            }
        };
    }
}
```

The module follows a singleton pattern (`Get()`) so all plugins in the package share the same instance.

---

## Step 2: Create the Audio Processor Plugin

The core plugin extends `AudioProcessorPlugin` and implements `getConnections()` to define the audio processing chain.

### Full Implementation

```typescript
// es.upv.paella.audioEnhancement.ts
import { AudioProcessorPlugin, type PluginModule } from "@asicupv/paella-core";
import BasicPluginsModule from "./BasicPluginsModule";

export default class AudioEnhancementPlugin extends AudioProcessorPlugin {
    protected _enabled: boolean = false;

    // Compression settings
    protected _threshold: number = -24;
    protected _knee: number = 10;
    protected _ratio: number = 4;
    protected _attack: number = 0.005;
    protected _release: number = 0.1;

    // Gain boost setting
    protected _gainValue: number = 2.5;

    getPluginModuleInstance(): PluginModule | null {
        return BasicPluginsModule.Get();
    }

    get name() {
        return "es.upv.paella.audioEnhancement";
    }

    async getConnections(audioCtx: AudioContext) {
        // 1. Create a dynamics compressor node
        const compressorNode = audioCtx.createDynamicsCompressor();
        compressorNode.threshold.value = this._threshold;
        compressorNode.knee.value = this._knee;
        compressorNode.ratio.value = this._ratio;
        compressorNode.attack.value = this._attack;
        compressorNode.release.value = this._release;

        // 2. Create a gain node for boost
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = this._gainValue;

        // 3. Wire them in series
        compressorNode.connect(gainNode);

        console.log("Audio boost is " + (this._enabled ? "enabled" : "disabled"));

        // 4. Return the chain's input and output
        return {
            input: compressorNode,
            output: gainNode,
            enabled: this._enabled
        };
    }

    async enable() {
        this._enabled = true;
        await this.reloadProcessor();
    }

    async disable() {
        this._enabled = false;
        await this.reloadProcessor();
    }
}
```

### Explanation

**`getConnections()`** creates two Web Audio nodes and wires them together:

1. **`DynamicsCompressorNode`** — compresses the audio signal. Parameters:
   - `threshold`: level below which compression starts (dB)
   - `knee`: smoothness of the compression curve (dB)
   - `ratio`: compression ratio
   - `attack`: time to reach full compression (seconds)
   - `release`: time to stop compressing after signal drops below threshold (seconds)

2. **`GainNode`** — boosts the gain of the compressed signal.

The framework connects nodes in series: the previous node's output → `input` → `output` → next node's input. By returning `compressorNode` as `input` and `gainNode` as `output`, the chain becomes:

```
[Previous] → [Compressor] → [Gain] → [Next]
```

**`enable()` / `disable()`** toggle a local `_enabled` flag and call `reloadProcessor()` to rebuild the audio graph. When `enabled` is `false`, the framework skips this plugin entirely.

---

## Step 3: Register the Plugin with the Player

Export the plugin from your package's `index.ts`:

```typescript
// index.ts
import AudioEnhancementPlugin from './plugins/es.upv.paella.audioEnhancement';

export const basicPlugins = [
    {
        plugin: AudioEnhancementPlugin,
        config: { enabled: false }
    }
];
```

Then pass it to the player:

```typescript
import { Paella } from "@asicupv/paella-core";
import { basicPlugins } from "@asicupv/paella-basic-plugins";

const player = new Paella('playerContainer', {
    plugins: basicPlugins
});
await player.loadManifest();
```

---

## Step 4: Create the Toggle Button Plugin

Now create a button that toggles the audio enhancement. This plugin is a `ButtonPlugin` — the pattern for all toolbar buttons.

```typescript
// es.upv.paella.audioEnhancementButton.ts
import { ButtonPlugin, type ButtonPluginConfig } from "@asicupv/paella-core";
import BasicPluginsModule from "./BasicPluginsModule";

import {
    AudioEnhancementIcon,
    AudioEnhancementDisabledIcon
} from "../icons/audio-enhancement-icons.js";

type AudioEnhancementButtonPluginConfig = ButtonPluginConfig & {
    ariaLabelEnable?: string;
    ariaLabelDisable?: string;
    titleEnable?: string;
    titleDisable?: string;
}

export default class AudioEnhancementButtonPlugin extends ButtonPlugin<AudioEnhancementButtonPluginConfig> {
    #enhanced: boolean = false;

    getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.audioEnhancementButton";
    }

    getAriaLabel() {
        return "Toggle audio enhancement";
    }

    getDescription() {
        return this.getAriaLabel();
    }

    async load() {
        this.icon = AudioEnhancementDisabledIcon;
        this.#setTexts(false);
    }

    async action() {
        // Access the audio processor plugin instance
        const result = this.player.getPlugin("es.upv.paella.audioEnhancement");
        const audioPlugin = result?.audioProcessor;
        if (!audioPlugin) {
            return;
        }

        if (this.#enhanced) {
            await audioPlugin.disable();
            this.#enhanced = false;
            this.icon = AudioEnhancementDisabledIcon;
            this.#setTexts(false);
        } else {
            await audioPlugin.enable();
            this.#enhanced = true;
            this.icon = AudioEnhancementIcon;
            this.#setTexts(true);
        }
    }

    async getHelp() {
        return {
            title: "Audio enhancement toggle",
            description: "Allows you to toggle audio enhancement (compression and gain) on and off."
        };
    }

    #setTexts(isEnhanced: boolean) {
        const ariaLabel = isEnhanced ?
            this.player.translate(this.config.ariaLabelDisable || "Disable audio enhancement") :
            this.player.translate(this.config.ariaLabelEnable || "Enable audio enhancement");
        const titleLabel = isEnhanced ?
            this.player.translate(this.config.titleDisable || "Disable audio enhancement") :
            this.player.translate(this.config.titleEnable || "Enable audio enhancement");
        const button = (this as { button: HTMLElement & { ariaLabel?: string } }).button;
        button.title = titleLabel;
        button.ariaLabel = ariaLabel;
    }
}
```

---

## Step 5: Wire the Button to the Audio Processor

The key pattern in `action()` is accessing the audio processor from another plugin:

```typescript
const result = this.player.getPlugin("es.upv.paella.audioEnhancement");
const audioPlugin = result?.audioProcessor;
```

This returns an object with an `audioProcessor` property that gives you access to the `AudioEnhancementPlugin` instance. From there you can call `enable()` and `disable()`.

The button plugin updates its icon and aria labels to reflect the current state, providing visual and accessibility feedback.

### Register the Button Plugin

```typescript
// index.ts
import AudioEnhancementButtonPlugin from './plugins/es.upv.paella.audioEnhancementButton';

export const basicPlugins = [
    {
        plugin: AudioEnhancementPlugin,
        config: { enabled: false }
    },
    {
        plugin: AudioEnhancementButtonPlugin,
        config: {}
    }
];
```

### Complete Working Example

The audio enhancement button icon changes when clicked, showing the enabled/disabled state to the user, and the audio processing chain is rebuilt each time the state changes.
