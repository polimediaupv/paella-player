# paella-slide-plugins

A set of plugins to handle slides for Paella Player

## Usage

**Step 1:** Import the plugin context and add it to the Paella Player initialization parameters:

Using plugin context API:

```js
...
import getSlidePluginsContext from 'paella-slide-plugins';

let paella = new Paella('player-container', {
    customPluginContext: [
        getSlidePluginsContext()
    ]
});
...
```

Using explicit plugin import API (paella-slide-plugins >= 1.41)

```js
import {
    slidePlugins, // All plugins
    FullscreenButtonPlugin      // Independent plugin
} from 'paella-slide-plugins';

let paella = new Paella('player-container', {
    plugins: [
        ...slidePlugins,    // All plugins
        { // One plugin
            plugin: FullscreenButtonPlugin,
            config: {
                enabled: true
            }
        }
    ]
});
```

From version 1.45.6, you can also use the generic plugin array name to import all the plugins:

```js
import { allPlugins as layoutPlugins } from 'paella-layout-plugins'
...
```

All the plugin libraries exports the `allPlugins` array. This is done in order to have a method to import all plugins using always the same name for all libraries.


**Step 2:** Configure the plugins you want to use in the paella player configuration.

```json
{
    "plugins": {
        ...
        "es.upv.paella.frameControlButtonPlugin": {
            "enabled": true,
            "side": "right",
            "order": 0
        }
        ... other plugin settings
    }
}
```

## Included plugins

### Frame control button plugin

Displays a list of available slides, and allows you to navigate to the corresponding time instant with each slide.

When the user hovers the mouse cursor over the slide thumbnails, the slide is displayed in full size over one of the videos. The video where the slide is displayed is the one whose `content` attribute matches the `targetContent` attribute of the plugin configuration.

```json
{
    "es.upv.paella.frameControlButtonPlugin": {
        "enabled": true,
        "targetContent": "presentation"
    },
    ...
}
```

**Exported as** `FrameControlButtonPlugin`.

**Icon customization data:**

- Plugin identifier: `es.upv.paella.frameControlButtonPlugin`
- Icon names:
    * `photoIcon`: icon in the button bar.
    * `arrowLeftIcon`: arrow left, in slides panel.
    * `arrowRightIcon`: arrow right, in slides panel.

### Arrow slide navigator

It allows you to add forward and backward navigation controls over one of the videos, allowing you to jump to the next and previous slide's time snapshot, respectively.

The video where the arrow buttons are placed is the one whose `content` attribute matches the `target` attibute in the configuration. This attribute is a list, where we will place the content tags in order. In this way, if in the current video there is no stream corresponding to the first tag, the corresponding video with the second tag will be used, and so on.

```json
{
    "es.upv.paella.arrowSlidesNavigator": {
        "enabled": true,
        "target": [
            "presentation",
            "presenter"
        ]
    },
    ...
}
```

**Exported as** `ArrowslidesPlugin`.

**Icon customization data:**

- Plugin identifier: `es.upv.paella.frameControlButtonPlugin`
- Icon names:
    * `arrowLeftIcon`: arrow left, in slides panel.
    * `arrowRightIcon`: arrow right, in slides panel.


### Next Slide Navigator Button

This is a video canvas button that allows you to navigate to the next frame. It is intended to replace, together with `Previous Slide Navigator Button`, the `Arrow Slide Navigator` plugin, when we want to place these buttons in the button area of the video canvas. Therefore, it is not consistent to activate `Next Slide Navigator Button` and `Previous Slide Navigator Button` if `Arrow Slide Navigator` is also activated.


```json
{
    "es.upv.paella.nextSlideNavigatorButton": {
        "enabled": true,
        "content": [
            "presentation"
        ]
    },
    ...
}
```

**Exported as** `NextSlideNavigatorButtonPlugin`.

**Icon customization data:**

- Plugin identifier: `es.upv.paella.nextSlideNavigatorButton`
- Icon names:
    * `arrowLeftIcon`: arrow left, in slides panel.


### Previous Slide Navigator Button

This is a video canvas button that allows you to navigate to the previous frame. It is intended to replace, together with `Next Slide Navigator Button`, the `Arrow Slide Navigator` plugin, when we want to place these buttons in the button area of the video canvas. Therefore, it is not consistent to activate `Next Slide Navigator Button` and `Previous Slide Navigator Button` if `Arrow Slide Navigator` is also activated.


```json
{
    "es.upv.paella.prevSlideNavigatorButton": {
        "enabled": true,
        "content": [
            "presentation"
        ]
    },
    ...
}
```

**Exported as** `PrevSlideNavigatorButtonPlugin`.

**Icon customization data:**

- Plugin identifier: `es.upv.paella.prevSlideNavigatorButton`
- Icon names:
    * `arrowRightIcon`: arrow right, in slides panel.

### Important note about Next and Previous slide navigation plugins

Remember that to place the buttons in the correct order, the `side` and `order` parameters of the `NextSlideNavigationPlugin` and `PrevSlideNavigationPlugin` plugins are relevant. The position will imply that the button is placed using the `float: right` or `float: left` styles, and this influences the order in which the buttons appear. Likewise, the order determines which plugin will be loaded first. If the plugins are placed at the left side of the video canvas, the first button to be loaded must be "prevSlideNavigationButton", but the order must to be inverted if the buttons are placed at the right side.

**Example: place the buttons at the left side of the video:**

```json
{
    "plugins": {
        ...

        "es.upv.paella.nextSlideNavigatorButton": {
            ...
            "side": "left",
            "order": 1
        },

        "es.upv.paella.prevSlideNavigatorButton": {
            ...
            "side": "left",
            "order": 0
        }
    }
}
```

**Example: place the buttons at the right side of the video:**

```json
{
    "plugins": {
        ...

        "es.upv.paella.nextSlideNavigatorButton": {
            ...
            "side": "right",
            "order": 0
        },

        "es.upv.paella.prevSlideNavigatorButton": {
            ...
            "side": "right",
            "order": 1
        }
    }
}
```

### Utilities

This package also exports the following utility functions:

**`await nextSlide(player)`:** Seek video to the next frame position. It receives the player as parameter.

**`await previousSlide(player)`:** Seek video to the previous frame position. It receives the player as parameter.

**`await checkSlides(player)`:** Checks if the current video contains navigable frames. It receives the player as parameter.

**`await getFrames(player)`:** Returns the sorted list of frames of the current video, or an empty array if the video contains no frames. It receives the player as parameter.

```js
import { getFrames, nextSlide, checkSlide } from 'paella-basic-plugins';
```