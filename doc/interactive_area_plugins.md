# Interactive Area Plugins

The **Interactive Area** is a dynamic panel that shares display space with the video. It is hidden by default and can be shown to present interactive content closely related to the current playback time. Unlike standard subtitles, the interactive area supports larger content and potential interactivity, such as transcriptions, live translations with retained text, or time-linked quizzes.

The area appears to the right of the video on wide viewports and below the video on narrow/viewports, maximizing available space through a CSS Grid layout.

## Table of Contents

- [Getting Access to the Interactive Area API](#getting-access-to-the-interactive-area-api)
- [Showing and Hiding the Panel](#showing-and-hiding-the-panel)
- [Changing Panel Size](#changing-panel-size)
- [Creating an InteractiveAreaPlugin](#creating-an-interactiveareaplugin)
  - [Plugin Registration](#plugin-registration)
- [Customizing CSS Styles with Variables](#customizing-css-styles-with-variables)

---

## Getting Access to the Interactive Area API

The interactive area is accessed through the `videoCanvasArea` property on the main **Paella** player instance. This property is available after the player has finished loading. If you want to show an interactive area plugin on player load, you can do the following steps:

```typescript
import paella from "@asicupv/paella-core";

// Create the player instance
const player = new Paella('playerContainer', {
    // ... configure the player
});

// Bind event to show the panel when the player is loaded
player.bindEvent("playerLoaded", () => {
    player.videoCanvasArea?.showInteractivePanel("my.plugin.name");
});

// Load manifest
await player.loadManifest();
```

### Accessing videoCanvasArea from a Button Plugin

In typical usage, an `InteractiveAreaPlugin` is shown in response to user interaction — for example, when a button plugin is clicked. You can access the videoCanvasArea from within any other plugin or UI component via the player instance:

```typescript
class MyInteractiveAreaButtonPlugin extends ButtonPlugin {
    ...

    action() {
        const va = this.player.videoCanvasArea;
        if (va) {
            va.showInteractiveAreaPlugin("es.upv.paella.myInteractiveAreaPlugin");
        }
    }
}
```

---

## Showing and Hiding the Panel

### `showInteractiveAreaPlugin(pluginName: string)`

Loads and displays an interactive area plugin by its registered name. If the named plugin is not found, a warning is logged and no action is taken.

```typescript
player.videoCanvasArea?.showInteractiveAreaPlugin("es.upv.paella.transcript");
```

This method:
1. Looks up the plugin registered under type `"interactiveArea"`
2. Calls `plugin.getContent()` to retrieve the DOM element
3. Clears any existing content and inserts the new element
4. Shows the panel, resetting to whichever size is currently set (defaulting to medium)

### `hidePanel()`

Hides the interactive area panel and clears its visibility state. The content is retained in memory, so subsequent calls to `showInteractiveAreaPlugin` with the same plugin name will display quickly.

```typescript
player.videoCanvasArea?.hidePanel();
```

---

## Changing Panel Size

The interactive area supports three configurable sizes. The `small`, `medium`, and `large` labels refer to the **video container's** size, so they are inversely proportional to the interactive area panel width:

| Size     | Panel Width                  | Video Container Width       |
|----------|------------------------------|-----------------------------|
| `small`  | Takes up space next to a large video: **33% panel**, **67%** video |
| `medium` | Balanced 50/50 split: **50% panel**, **50%** video |
| `large`  | Expands the panel: **67% panel**, **33%** video |

### Programmatic API

```typescript
const va = player.videoCanvasArea;

// Set an explicit size
va?.setPanelSize("small");   // 67% video, 33% panel
va?.setPanelSize("medium");  // 50% video, 50% panel
va?.setPanelSize("large");   // 33% video, 67% panel

// Get the current size
const current = va?.currentPanelSize;  // "small" | "medium" | "large"

// Increase size (small → medium → large)
va?.increasePanelSize();

// Decrease size (large → medium → small)
va?.decreasePanelSize();
```

### Built-in UI Buttons

Resize buttons appear automatically above the interactive area panel when the panel is visible. They show directional icons that change based on layout:
- **Horizontal** (right-panel): horizontal arrows for in/out resize
- **Vertical** (bottom-panel): vertical arrows for in/out resize

Users can click these buttons to incrementally cycle through sizes.

---

## Creating an InteractiveAreaPlugin

To create a custom interactive area plugin, extend the `InteractiveAreaPlugin` base class and implement its `getContent()` method. The method must return a Promise that resolves to an `HTMLElement`.

### Example: Simple Transcript Plugin

```typescript
import { InteractiveAreaPlugin, PluginModule } from "@asicupv/paella-core";

export default class TranscriptPlugin extends InteractiveAreaPlugin {
    // Return the plugin module instance if applicable
    getPluginModuleInstance(): PluginModule | null {
        return null;
    }

    // Unique identifier used to find the plugin for display
    get name() {
        return "es.upv.paella.transcript";
    }

    // Return the DOM element that will appear in the interactive area
    async getContent() : Promise<HTMLElement> {
        const div = document.createElement("div");
        div.classList.add("transcript-container");

        // Example: get transcript content at the current playback position
        const currentTime = await this.player.currentTime();

        // ... build your content based on currentTime ...
        div.innerHTML = `<p>Transcript at ${currentTime.toFixed(1)}s</p>`;

        return div;
    }
}
```

### Example: Multi-element Interactive Content

For richer, interactive content with child elements (buttons, inputs, etc.), construct the DOM tree before returning:

```typescript
async getContent() : Promise<HTMLElement> {
    const container = document.createElement("div");
    container.classList.add("quiz-panel");

    const questionEl = document.createElement("h3");
    questionEl.textContent = "What is the capital of France?";

    const option1 = document.createElement("button");
    option1.textContent = "Paris";
    option1.addEventListener("click", () => console.log("Correct!"));

    const option2 = document.createElement("button");
    option2.textContent = "London";
    option2.addEventListener("click", () => console.log("Incorrect."));

    container.appendChild(questionEl);
    container.appendChild(option1);
    container.appendChild(option2);

    return container;
}
```

### Plugin Lifecycle Notes

- **`getContent()` is called lazily.** It is invoked each time `showInteractiveAreaPlugin(pluginName)` runs. This means you can dynamically generate content based on the current playback time or any other state.
- **No caching is done internally.** If you need to retain content state, manage it inside your plugin.

---

## Customizing CSS Styles with Variables

The interactive area layout is driven entirely by [CSS custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties). You can override these variables in your application's global styles or on the player container to match your design.

### Panel Size Variables

Control how much space each size option occupies:

```css
/* Default values (set in paella-core/src/css/vars.css) */
:root {
    --interactive-area-small-size: 33%;   /* Video container takes this space at 'small' size — panel gets the rest (67%) */
    --interactive-area-medium-size: 50%;  /* Video container at medium — panel gets 50% */
    --interactive-area-large-size: 66%;   /* Video container at large — panel gets 34% */
}
```

These are computed using `calc()` inverses (e.g., `--video-container-large-size: calc(100% - var(--interactive-area-small-size))`) on the video container side. To change how much space the panel takes, override `--interactive-area-small-size`, `--interactive-area-medium-size`, and `--interactive-area-large-size`.

### Layout Variables

Control the gap and spacing for resize buttons:

```css
:root {
    /* Width of the resize button strip (horizontal layout) */
    --interactive-area-buttons-width: 70px;

    /* Height of the resize button strip (vertical layout) */
    --interactive-area-buttons-height: 70px;

    /* Padding inside the button area */
    --interactive-area-buttons-padding: 2px;

    /* Gap between resize buttons within the bar */
    --interactive-area-buttons-gap: var(--interactive-area-buttons-padding);
}
```

### Button Styling Variables

Customize the appearance of resize buttons:

```css
:root {
    /* Icon SVG color */
    --interactive-area-button-icon-color: var(--icon-color);

    /* Button background color */
    --interactive-area-button-background-color: var(--main-bg-color);

    /* Button border radius */
    --interactive-area-button-border-radius: var(--button-border-radius);

    /* Button border (default: none) */
    --interactive-area-button-border: none;
}
```

### Example: Fully Customized Theme

Here is an example of overriding many variables to create a distinct brand theme for the interactive area:

```css

/* In your application's CSS, applied to :root or .player-container */
:root {
    /* Custom sizes: these control the panel width directly.
       A smaller --interactive-area-*-size value means a larger video and vice versa */
    --interactive-area-small-size: 25%;   /* 'small' panel mode → video gets 75% */
    --interactive-area-medium-size: 40%;  /* 'medium' panel mode → video gets 60% */
    --interactive-area-large-size: 55%;   /* 'large' panel mode → video gets 45% */

    /* Wider resize button bar */
    --interactive-area-buttons-width: 100px;
    --interactive-area-buttons-height: 100px;

    /* Custom button appearance */
    --interactive-area-button-icon-color: #ff6600;
    --interactive-area-button-background-color: rgba(50, 50, 80, 0.9);
    --interactive-area-button-border-radius: 12px;
    --interactive-area-button-border: 2px solid rgba(255, 102, 0, 0.4);
}
```

### Container Content Styling

The content you return from `getContent()` lands directly inside the `.interactive-area-container` element, which carries a `.visible` class when displayed. Apply custom styles to your plugin's returned elements as usual — the container does not impose fixed dimensions on children, so you may set explicit widths/heights within your content elements.

```css
/* Style the content inside the interactive area */
.interactive-area-container.visible .transcript-panel {
    padding: 16px;
    font-size: 14px;
    color: white;
    overflow-y: auto;
}

.interactive-area-container.visible .quiz-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
```

### Layout Structure Overview (CSS Grid)

The player uses a CSS Grid inside `.video-canvas-area` with two layout modes:

**Horizontal (wide) mode**: when aspect ratio > 1
```css
.video-canvas-area {
    display: grid;
    /* Column 1: video container | Column 2: buttons bar | Column 3: interactive area */
    grid-template-columns: var(--video-container-medium-size)
        var(--interactive-area-buttons-width) minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
}
```

**Vertical (narrow) mode**: when aspect ratio <= 1
```css
.video-canvas-area {
    display: grid;
    /* Column 1 spans full width to center content */
    grid-template-columns: minmax(0, 1fr);
    /* Row 1: video container | Row 2: buttons bar | Row 3: interactive area */
    grid-template-rows: var(--video-container-medium-size)
        var(--interactive-area-buttons-height) minmax(0, 1fr);
}
```

The grid columns/rows swap sizes based on the current panel size (`small-panel`, `medium-panel`, or `large-panel`), which are applied to the `.video-container` element when visible.
