# Transcription Plugin Implementation Plan

This plan outlines the implementation of a text transcript view as an `InteractiveAreaPlugin` inside the `paella-core` package. The plugin manages a collection of transcript entries via custom string events and provides real-time updates when the panel is visible.

---

## Architecture Overview

```
Consumer App (triggers events)
  ├─ triggerEvent(player, "paella:addTranscription", { id, text, state })
  ├─ triggerEvent(player, "paella:updateTranscription", { id, text, state })
  ├─ triggerEvent(player, "paella:removeTranscription", id)
  └─ triggerEvent(player, "paella:clearTranscriptions")

paella-core
  ├─ Events.ts → document new events
  ├─ VideoCanvasArea.ts → new API: refreshPanelContent()
  └─ plugins/es.upv.paella.transcriptPlugin.ts → TranscriptPlugin
```

The `TranscriptPlugin` stores entries in a Map keyed by numeric ID, maintains insertion order, and regenerates its DOM via `getContent()` on each event when visible.

---

## Phase 1: VideoCanvasArea `refreshPanelContent()` API

**Goal:** Expose a method on `VideoCanvasArea` that triggers a `getContent()` call on the currently visible interactive area plugin, and updates the panel DOM without hiding the panel.

**File:** `repos/paella-core/src/js/core/VideoCanvasArea.ts`

**Changes:**

1. Add a private field to track which plugin is currently visible (a `string` - the plugin name).
2. In `showInteractiveAreaPlugin()`, store the resolved plugin's name in this field.
3. Add a new public method:

```typescript
async refreshPanelContent(): Promise<void> {
    if (!this._visible || !this._currentPluginName) {
        return;
    }
    const plugins = getPluginsOfType(this.player, "interactiveArea");
    const plugin = plugins.find(p => p.name === this._currentPluginName);
    if (!plugin) {
        return;
    }
    const content = await (plugin as InteractiveAreaPlugin).getContent();
    this._interactiveAreaContainer?.element.replaceChildren(content);
}
```

4. Export this method as part of the `VideoCanvasArea` type so consumers can call it from `player.videoCanvasArea.refreshPanelContent()`.

**Dependencies:** None (standalone addition to VideoCanvasArea).

---

## Phase 2: Event Documentation

**Goal:** Document the four new string events in the `Events.ts` file so consumers know what event names to fire.

**File:** `repos/paella-core/src/js/core/Events.ts`

**Changes:**

1. Add JSDoc comments documenting the four events near the `Events` enum. The events are string-based and not typed in the enum - consumers pass them directly to `triggerEvent`. The documentation will appear as a block comment before the enum:

```typescript
/**
 * Transcript management events (string events, not typed in the enum).
 *
 * paella:addTranscription - Payload: { id: number, text: string, state: string }
 *   Adds a new transcript entry. Entries are stored and displayed in ascending order by `id`.
 *
 * paella:updateTranscription - Payload: { id: number, text: string, state: string }
 *   Updates an existing transcript entry identified by `id`. If no entry exists with that id, no action is taken.
 *
 * paella:removeTranscription - Payload: number
 *   Removes the transcript entry identified by the given `id`.
 *
 * paella:clearTranscriptions - Payload: none
 *   Removes all transcript entries.
 */
```

2. Optionally, add a small helper function (not exported) to validate payload shape - or skip validation entirely for simplicity, since these are consumed by the plugin directly.

**Dependencies:** None.

---

## Phase 3: TranscriptPlugin Implementation

**Goal:** Create the `TranscriptPlugin` class in `repos/paella-core/src/js/plugins/`.

**File:** `repos/paella-core/src/js/plugins/es.upv.paella.transcriptPlugin.ts`

**Changes:**

1. Create `es.upv.paella.transcriptPlugin.ts` exporting a default class `TranscriptPlugin extends InteractiveAreaPlugin`.

2. **State management:**
   - A `Map<number, { id: number; text: string; state: string }>` to hold transcript entries keyed by ID.
   - A getter method `get sortedEntries(): TranscriptEntry[]` that returns entries sorted by `id`.

3. **Event registration in `load()`:**
   - Use `bindEvent()` to register four listeners:
     - `paella:addTranscription` → `this.addTranscription(params)`
     - `paella:updateTranscription` → `this.updateTranscription(params)`
     - `paella:removeTranscription` → `this.removeTranscription(params)`
     - `paella:clearTranscriptions` → `this.clearTranscriptions()`
   - Each method mutates the internal Map.
   - After each mutation, check if the panel is currently visible and call `refreshPanelContent()` if so.

4. **`getContent()` implementation:**
   - Create a `<div>` with class `paella-transcript-container`.
   - Iterate over sorted entries.
   - For each entry, create a `<div class="paella-transcript-entry">` with the text and a `<span class="paella-transcript-state">` for the state.
   - Apply different styling classes based on the state value (e.g., `state-current`, `state-past`, `state-future`).
   - Return the container.

5. **Plugin identity:**
   - `get name() { return "es.upv.paella.transcript"; }`
   - `getPluginModuleInstance()` returns `null`.

**Dependencies:** Phase 1 must be complete (VideoCanvasArea.refreshPanelContent).

---

## Phase 4: Exports and Wiring

**Goal:** Ensure the new plugin is importable from `@asicupv/paella-core` and registered in the plugin registry.

**File:** `repos/paella-core/src/js/index.ts`

**Changes:**

1. Import the new plugin:
   ```typescript
   import TranscriptPlugin from './plugins/es.upv.paella.transcriptPlugin';
   ```
2. Export it in the `export { ... }` block:
   ```typescript
   TranscriptPlugin,
   ```

**File:** `repos/paella-core/src/js/paella_plugins.ts`

**Changes:**

1. Add a plugin registration entry:
   ```typescript
   {
       plugin: TranscriptPlugin,
       config: { enabled: false }
   },
   ```

**Dependencies:** Phase 3 must be complete.

---

## Phase 5: CSS Styling

**Goal:** Add default CSS for the transcript panel so it looks usable out of the box.

**File:** `repos/paella-core/src/css/video-canvas-area.css` (or a new `transcript.css` file imported from the plugin).

**Changes:**

1. Add styles for the transcript container and entries:

```css
/* Transcript panel styles */
.paella-transcript-container {
    padding: 12px;
    overflow-y: auto;
    height: 100%;
    color: var(--main-fg-color);
    font-size: 14px;
    line-height: 1.5;
}

.paella-transcript-entry {
    padding: 8px 12px;
    margin-bottom: 4px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.15s ease;
}

.paella-transcript-entry:hover {
    background-color: var(--main-bg-color-hover);
}

.paella-transcript-entry.state-current {
    background-color: var(--highlight-bg-color);
    color: white;
}

.paella-transcript-state {
    display: block;
    font-size: 11px;
    opacity: 0.7;
    margin-top: 2px;
}
```

2. Import the new CSS from `repos/paella-core/src/js/index.ts` or include it in `video-canvas-area.css` directly.

**Dependencies:** Independent (can be done in parallel with Phase 3).

---

## Phase 6: Verification

**Goal:** Ensure everything builds and the plugin functions correctly.

**Steps:**

1. Run `npm run build:libs` to verify the `paella-core` package builds without errors.
2. Verify the sample app imports and registers the plugin by adding it to `samples/development-player-ts/src/main.ts`:
   ```typescript
   import { TranscriptPlugin } from '@asicupv/paella-core';
   // ... in the plugins array:
   {
       plugin: TranscriptPlugin,
       config: { enabled: true }
   }
   ```
3. Test event firing in the browser console:
   ```javascript
   paellaPlayer = window.paella; // or however the player is exposed
   triggerEvent(p, "paella:addTranscription", { id: 1, text: "First line", state: "past" });
   triggerEvent(p, "paella:addTranscription", { id: 2, text: "Second line", state: "current" });
   triggerEvent(p, "paella:addTranscription", { id: 3, text: "Third line", state: "future" });
   p.videoCanvasArea?.showInteractiveAreaPlugin("es.upv.paella.transcript");
   ```
4. Verify:
   - Entries appear sorted by ID.
   - `paella:updateTranscription` modifies the text/state of an existing entry.
   - `paella:removeTranscription` removes an entry.
   - `paella:clearTranscriptions` clears all entries.
   - Live updates work when the panel is visible (content regenerates on each event).

**Dependencies:** All prior phases must be complete.

---

## Key Considerations

### Visibility detection
The TranscriptPlugin needs to know whether the panel is visible to decide whether to call `refreshPanelContent()`. Options:
- **Preferred:** Add a public getter `isPanelVisible(): boolean` on `VideoCanvasArea` in Phase 1. This is cleaner than accessing protected fields.
- **Alternative:** Store a reference to the `VideoCanvasArea` in the plugin and check `_visible` directly (current private field access).

### DOM replacement strategy
`getContent()` returns a fresh DOM element each time. Using `replaceChildren()` is more efficient than `innerHTML = ""` followed by `appendChild()` because it:
- Handles cleanup of existing child nodes properly (events, references).
- Is a single atomic operation.

### Sorting guarantee
Entries are always sorted by `id` in ascending order. Since `Map` preserves insertion order, but the consumer may call `addTranscription` with IDs out of sequence (e.g., add id:5 then id:1), the `sortedEntries` getter must sort explicitly on each access.

### Thread safety
All Map mutations and DOM updates happen synchronously on the main thread. No web workers or async iteration needed.

### Future extensibility
The `state` field is currently a free-form string. In a future iteration it could be constrained to values like `"past"`, `"current"`, `"future"` with corresponding CSS classes and potentially semantic behaviors (auto-seeking on click).
