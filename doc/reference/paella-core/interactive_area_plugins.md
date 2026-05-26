# Interactive Area Plugins Reference

The Interactive Area is a dynamic panel that shares display space with the video. It can display interactive content closely related to the current playback time, such as transcriptions, live translations, or time-linked quizzes.

---

## Table of Contents

- [Overview](#overview)
- [InteractiveAreaPlugin Base Class](#interactiveareaplugin-base-class)
- [TranscriptPlugin Class](#transcriptplugin-class)
- [TranscriptEntry Type](#transcriptentry-type)
- [TranscriptEntryState Values](#transcriptentrystate-values)
- [VideoCanvasArea Panel API](#videocanvasarea-panel-api)
- [CSS Custom Properties](#css-custom-properties)
- [Plugin Registration](#plugin-registration)

---

## Overview

The Interactive Area appears to the right of the video on wide viewports and below the video on narrow viewports. Content is displayed via `InteractiveAreaPlugin` instances that return an `HTMLElement` from their `getContent()` method.

Key symbols:

| Symbol | Description |
|--------|-------------|
| `InteractiveAreaPlugin` | Base class to extend for interactive area plugins |
| `TranscriptPlugin` | Built-in transcript plugin (infrastructure, not for direct display) |
| `TranscriptEntry` | Data type for a single transcript entry |
| `TranscriptEntryState` | State enum for transcript entries |
| `VideoCanvasArea` | Panel API for showing, hiding, and resizing the interactive area |

---

## InteractiveAreaPlugin Base Class

Extends `Plugin<PluginC>` and registers itself with `type = "interactiveArea"`.

### Methods

### `get type()` → `string`

Returns the fixed string `"interactiveArea"`.

```typescript
get type() { return "interactiveArea"; }
```

### `async getContent(): Promise<HTMLElement>`

**Mandatory to override.** Returns the DOM element that will be displayed in the interactive area panel. This is called each time `showInteractiveAreaPlugin(pluginName)` is invoked, so you can generate content dynamically based on the current playback time.

```typescript
async getContent(): Promise<HTMLElement> {
    const div = document.createElement("div");
    div.innerHTML = "Hello, Interactive Area!";
    return div;
}
```

### `async isEnabled(): Promise<boolean>`

Inherited from `Plugin`. Returns the value of `this._config.enabled`, or `false` by default. Override to implement dynamic enable/disable logic.

### `async load(): Promise<void>`

Inherited from `Plugin`. Called once when the plugin is initialized. Override to set up DOM elements, bind events, etc.

### `async unload(): Promise<void>`

Inherited from `Plugin`. Called when the plugin is torn down. Override to clean up resources.

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `player` | `Paella` | — | The player instance |
| `config` | `ConfigT` | `{}` (cast) | Read-only access to config |
| `order` | `number \| null` | `0` | Loading order |
| `description` | `string \| null` | `""` | Human-readable description |
| `name` | `string \| null` | set at registration | Unique plugin identifier |

---

## TranscriptPlugin Class

Built-in plugin (`es.upv.paella.transcriptInteractiveAreaPlugin`) that manages a scrollable transcript in the interactive area. This is an **infrastructure plugin** — it is not meant to be displayed directly via a button click. Instead, other plugins use its API to add/update/remove transcript entries, and then optionally show the panel via `showInteractiveAreaPlugin()`.

### Methods

### `addTranscription({ text, state }): Promise<number>`

Adds a new transcript entry at the current playback time. Returns the entry's ID (which is `Math.round(currentTime)`), or `-1` if text is empty.

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | `string` | The transcript text |
| `state` | `TranscriptEntryState` | Initial state of the entry |

### `updateTranscription({ id, text, state }): Promise<void>`

Updates an existing transcript entry by its ID. Any omitted field (`text`, `state`) is left unchanged.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `number` | The entry ID (usually the rounded playback time) |
| `text` | `string` (optional) | New text for the entry |
| `state` | `TranscriptEntryState` (optional) | New state for the entry |

### `removeTranscription(params: number \| { id: number }): void`

Removes a transcript entry by its ID.

### `clearTranscriptions(): void`

Removes all transcript entries and clears the container.

### `scrollToCurrent(): Promise<void>`

Scrolls the panel to the current transcript entry (the one whose ID is closest to but not greater than the current playback time).

---

## TranscriptEntry Type

```typescript
interface TranscriptEntry {
    id: number;        // Unique identifier (rounded playback time in seconds)
    text: string;      // Displayed text content
    state: TranscriptEntryState;  // Current state
}
```

---

## TranscriptEntryState Values

| Value | Description |
|-------|-------------|
| `"past"` | Entry is far enough in the past (> 8s before current time) |
| `"current"` | Entry matches the current playback position |
| `"live"` | Entry represents live content at the current time |
| `"future"` | Entry is in the future (not yet reached) |
| `"error"` | An error occurred for this entry |
| `"warning"` | A warning condition for this entry |
| `"info"` | Informational state for this entry |

---

## VideoCanvasArea Panel API

Access the panel via `player.videoCanvasArea`.

### `showInteractiveAreaPlugin(pluginName: string): Promise<void>`

Shows the interactive area panel and loads the named plugin's content. Calls `getContent()` on the plugin and inserts the returned element into the panel.

### `hidePanel(): void`

Hides the panel. Content is retained in memory.

### `setPanelSize(size: PanelSize): void`

Sets the panel size explicitly.

| Size | Video Width | Panel Width |
|------|-------------|-------------|
| `"small"` | 67% | 33% |
| `"medium"` | 50% | 50% |
| `"large"` | 33% | 67% |

### `get currentPanelSize(): "small" \| "medium" \| "large"`

Returns the current panel size.

### `increasePanelSize(): void`

Cycles to the next larger size (`small → medium → large`).

### `decreasePanelSize(): void`

Cycles to the next smaller size (`large → medium → small`).

### `refreshPanelContent(): Promise<void>`

Refreshes the currently visible panel by calling `getContent()` on the current plugin and replacing the DOM content.

### `get currentPluginName(): string \| null`

Returns the name of the currently visible interactive area plugin, or `null` if the panel is hidden.

---

## CSS Custom Properties

Override these in your application's CSS to customize the interactive area layout.

### Panel Size Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--interactive-area-small-size` | `33%` | Panel width at `small` size |
| `--interactive-area-medium-size` | `50%` | Panel width at `medium` size |
| `--interactive-area-large-size` | `66%` | Panel width at `large` size |

### Button Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--interactive-area-buttons-width` | `70px` | Width of resize button strip (horizontal layout) |
| `--interactive-area-buttons-height` | `70px` | Height of resize button strip (vertical layout) |
| `--interactive-area-buttons-padding` | — | Padding inside the button area |
| `--interactive-area-buttons-gap` | — | Gap between resize buttons |

### Button Styling Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--interactive-area-button-icon-color` | `var(--icon-color)` | Icon SVG color |
| `--interactive-area-button-background-color` | `var(--main-bg-color)` | Button background |
| `--interactive-area-button-border-radius` | `var(--button-border-radius)` | Button border radius |
| `--interactive-area-button-border` | `none` | Button border |

### Transcript Entry Styling

Transcript entries receive a class `state-{state}` that you can target for styling:

```css
.state-current {
    background: rgba(255, 255, 255, 0.15);
    font-weight: bold;
}

.state-past {
    opacity: 0.6;
}

.state-future {
    opacity: 0.4;
}

.state-error {
    color: #ff4444;
}
```

---

## Plugin Registration

Register interactive area plugins by passing them to the player at initialization:

```typescript
import { Paella } from "@asicupv/paella-core";
import MyInteractiveAreaPlugin from "your-plugin-package";

const player = new Paella('playerContainer', {
    plugins: [
        {
            plugin: MyInteractiveAreaPlugin,
            config: { enabled: true }
        }
    ]
});
await player.loadManifest();
```

The `interactiveArea` type is automatically recognized when the plugin class extends `InteractiveAreaPlugin`.
