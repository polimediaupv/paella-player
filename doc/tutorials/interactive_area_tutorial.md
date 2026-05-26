# Tutorial: Interactive Area Plugins

This tutorial walks you through building Interactive Area plugins in Paella. You will learn how to create a simple custom interactive area plugin, and how to use the built-in `TranscriptPlugin` to feed real-time text content into the interactive area.

---

## Table of Contents

- [Step 1: Create a Simple InteractiveAreaPlugin](#step-1-create-a-simple-interactiveareaplugin)
- [Step 2: Create a Button to Show the Panel](#step-2-create-a-button-to-show-the-panel)
- [Step 3: Use the TranscriptPlugin API](#step-3-use-the-transcriptplugin-api)
- [Step 4: Feed Captions into the Transcript](#step-4-feed-captions-into-the-transcript)
- [Special Case: TranscriptPlugin as Infrastructure](#special-case-transcriptplugin-as-infrastructure)

---

## Step 1: Create a Simple InteractiveAreaPlugin

The simplest interactive area plugin returns a static HTML element.

### Full Implementation

```typescript
// es.upv.paella.test.interactiveAreaTest.ts
import { InteractiveAreaPlugin, PluginModule } from "@asicupv/paella-core";
import TestPlayerPluginModule from "./TestPlayerPluginModule";

export default class TestInteractiveAreaPlugin extends InteractiveAreaPlugin {
    getPluginModuleInstance(): PluginModule | null {
        return TestPlayerPluginModule.get();
    }

    get name() {
        return "es.upv.paella.test.interactiveAreaTest";
    }

    async getContent(): Promise<HTMLElement> {
        const elem = document.createElement("div");
        elem.innerHTML = "Hello, World!";
        return elem;
    }
}
```

### Explanation

1. **`get name()`** — returns the unique plugin identifier. This is how `showInteractiveAreaPlugin()` looks up the plugin.
2. **`getContent()`** — creates a `<div>`, sets its content, and returns it. This method is called every time the panel is shown, so you can generate dynamic content based on the current playback time.
3. **`getPluginModuleInstance()`** — returns the plugin package's module instance.

To make the content dynamic, use `this.player.currentTime()`:

```typescript
async getContent(): Promise<HTMLElement> {
    const currentTime = await this.player.currentTime();
    const div = document.createElement("div");
    div.innerHTML = `<p>Transcript at ${currentTime.toFixed(1)}s</p>`;
    return div;
}
```

---

## Step 2: Create a Button to Show the Panel

Now create a button that shows this plugin's panel when clicked.

```typescript
class MyButtonPlugin extends ButtonPlugin {
    async action() {
        this.player.videoCanvasArea?.showInteractiveAreaPlugin("es.upv.paella.test.interactiveAreaTest");
    }
}
```

The `showInteractiveAreaPlugin()` method:
1. Looks up the plugin registered under type `"interactiveArea"` with the given name.
2. Calls `getContent()` on the plugin.
3. Replaces the panel content with the returned element.
4. Shows the panel.

You can also hide the panel:

```typescript
this.player.videoCanvasArea?.hidePanel();
```

And change the panel size:

```typescript
this.player.videoCanvasArea?.setPanelSize("medium");  // 50/50 split
this.player.videoCanvasArea?.setPanelSize("large");   // 67% panel
this.player.videoCanvasArea?.setPanelSize("small");   // 33% panel
```

---

## Step 3: Use the TranscriptPlugin API

The `TranscriptPlugin` (`es.upv.paella.transcriptInteractiveAreaPlugin`) is a built-in infrastructure plugin that manages a scrollable transcript. Other plugins feed data into it rather than creating their own DOM.

### Accessing the Transcript Plugin

```typescript
const result = this.player.getPlugin("es.upv.paella.transcriptInteractiveAreaPlugin");
const transcript = result?.interactiveArea;
```

### Adding a Transcript Entry

```typescript
const id = transcript.addTranscription({
    text: "This is the transcript text",
    state: "current"
});
```

The `id` is automatically set to `Math.round(currentTime)`. If two entries share the same ID, they will be merged.

### Updating a Transcript Entry

```typescript
transcript.updateTranscription(id, { state: "current" });
```

### Removing a Transcript Entry

```typescript
transcript.removeTranscription(id);
```

### Clearing All Entries

```typescript
transcript.clearTranscriptions();
```

---

## Step 4: Feed Captions into the Transcript

This example reads video captions in real time and feeds them into the TranscriptPlugin. It demonstrates a complete real-world pattern.

### Full Implementation

```typescript
// es.upv.paella.test.captionsTranscriptContainer.ts
import TestPlayerPluginModule from "./TestPlayerPluginModule";
import { ButtonPlugin, Events } from "@asicupv/paella-core";

export default class CaptionsTranscriptContainerPlugin extends ButtonPlugin {
    private _cues: Record<number, { text: string, id: number }> = {};

    get name() {
        return "es.upv.paella.test.CaptionsTranscriptContainerPlugin";
    }

    getPluginModuleInstance(): TestPlayerPluginModule {
        return TestPlayerPluginModule.get();
    }

    async load() {
        // 1. Get the transcript plugin instance
        const transcript = this.player.getPlugin(
            "es.upv.paella.transcriptInteractiveAreaPlugin"
        ).interactiveArea;

        // 2. Listen for time updates
        this.player.bindEvent(Events.TIMEUPDATE, (data: any) => {
            const currentTime: number = data.currentTime;

            // 3. Get the current caption at this playback position
            const firstCaptions = this.player.captionsCanvas?.getCaptions({
                lang: this.player.captions[0].lang
            });
            if (!firstCaptions) return;

            const cue = firstCaptions.getCue(currentTime);
            if (!cue) return;

            // 4. Check if we already have a cached entry for this cue
            const cached = this._cues[cue.start];
            if (!cached) {
                // First time seeing this caption: add it
                const id = transcript.addTranscription({
                    text: cue.captions.join(" "),
                    state: "current"
                });
                this._cues[cue.start] = { text: cue.captions.join(" "), id };
            } else {
                // Already seen: just update its state
                transcript.updateTranscription(cached.id, { state: "current" });
            }
        });

        // 5. Listen for seeks (useful for cleanup or resetting)
        this.player.bindEvent(Events.SEEK, (data: any) => {
            // Handle seeking logic here
        });
    }

    async action(): Promise<void> {
        // Show the transcript panel when the button is clicked
        this.player.videoCanvasArea?.showInteractiveAreaPlugin(
            "es.upv.paella.transcriptInteractiveAreaPlugin"
        );
    }
}
```

### Explanation

1. **`load()`** is called once when the plugin initializes. It binds to the `TIMEUPDATE` event, which fires continuously during playback.
2. Each time the time updates, the plugin checks for a caption at the current time using `getCaptions().getCeue()`.
3. If the caption hasn't been seen before, it calls `addTranscription()` to create a new entry.
4. If it has been seen, it calls `updateTranscription()` to refresh the state.
5. The button's `action()` shows the transcript panel via `showInteractiveAreaPlugin()`.

The TranscriptPlugin automatically handles:
- Sorting entries by ID
- Updating states to `past`, `current`, `live`, or `future` as playback progresses
- Scrolling to the current entry
- Inserting discontinuity markers for large gaps (> 20s)

---

## Special Case: TranscriptPlugin as Infrastructure

The `TranscriptPlugin` is special because it is **not designed to be shown directly**. Instead:

1. It is loaded by the framework as a regular `InteractiveAreaPlugin`.
2. Other plugins access it via `this.player.getPlugin("es.upv.paella.transcriptInteractiveAreaPlugin").interactiveArea`.
3. They call its API methods (`addTranscription`, `updateTranscription`, etc.) to feed content.
4. When those plugins want to show the transcript, they call `showInteractiveAreaPlugin("es.upv.paella.transcriptInteractiveAreaPlugin")`.

This is similar to how `AudioProcessorPlugin` works: the audio processor itself processes audio, and a separate `ButtonPlugin` controls it. In both cases, there is a "processing" plugin and a "control" plugin.

| Pattern | Audio Processor | Interactive Area |
|---------|----------------|------------------|
| Processing plugin | `AudioProcessorPlugin` | `TranscriptPlugin` |
| Control plugin | `ButtonPlugin` | `ButtonPlugin` |
| Accessor pattern | `player.getPlugin("...").audioProcessor` | `player.getPlugin("...").interactiveArea` |
| Control methods | `enable()` / `disable()` | `addTranscription()`, `updateTranscription()`, etc. |
| Show panel | N/A (audio has no visual panel) | `showInteractiveAreaPlugin()` |

This separation of concerns lets you compose complex behaviors from smaller, focused plugins.
