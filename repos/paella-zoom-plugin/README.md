# paella-zoom-plugin

A plugin to zoom videos for Paella Player.

## Usage

**Step 1:** Import the plugin context and add it to the Paella Player initialization parameters:

Usin plugin context API:

```javascript
...
import getZoomPluginContext from 'paella-zoom-plugin';

let paella = new Paella('player-container', {
    customPluginContext: [
        getZoomPluginContext()
    ]
});
...
```

Using explicit plugin import API (paella-zoom-plugin >= 1.41):

```javascript
...
import {
    zoomPlugins, // All plugins
    ZoomCanvasPlugin      // Independent plugin
} from 'paella-zoom-plugin';

let paella = new Paella('player-container', {
    plugins: [
        ...zoomPlugins,    // All plugins
        { // One plugin
            plugin: ZoomCanvasPlugin,
            config: {
                enabled: true
            }
        }
    ]
});
...
```

From version 1.41.3, you can also use the generic plugin array name to import all the plugins:

```js
import { allPlugins as zoomPlugin } from 'paella-zoom-plugin'
...
```

All the plugin libraries exports the `allPlugins` array. This is done in order to have a method to import all plugins using always the same name for all libraries.

**Step 2:** Configure the plugins you want to use in the paella player configuration.

```json
{
    "plugins": {
        ...
        "es.upv.paella.zoomMenuButtonPlugin": {
          "enabled": true,
          ...
        }
      }
        ... other plugin settings
    }
}
```

## Description

This set of plugins consists of four different plugins:

- zoom plugin: is the main plugin, of canvas type, and provides the ability to zoom in and out on video streams. It's mandatory to activate this plugin for the rest of the plugins in this set to work

**data.json:**

```mixed
{
  ...
  "streams": [
    {
      "sources": {
        ...
      },
      "content": "presenter",
      "canvas": ["video"]  << "video" is the default canvas
    }
  ]
}
```

Note that, as "video" is the default canvas type, it's not mandatory that the stream is configured with the `canvas` attribute to use the zoom canvas.

- zoom menu button plugin: adds a button that displays a menu with the options to zoom in and out.
- Zoom in button plugin: adds a button that enlarges the video
- Zoom out button plugin: adds a button that reduces the video.


## Included plugins

### Zoom plugin

This is a canvas plugin, which will work on videos whose canvas is set to "video" in the video manifest. Note that for the zoom to work, you must disable the default canvas in the configuration file, or set a higher priority:

```mixed
{
  "plugins": {
     ...
    
     "es.upv.paella.videoCanvas": {
      	"enabled": false,		< deactivate default canvas	
      	"order": 1		< or set lower priority
      },

      "es.upv.paella.zoomPlugin": {
    		"enabled": true,
        "order": 0,
        "maxZoom": 800,
        "showButtons": true
      },
			...
	}
}
```

Zooming works with the mouse scroll wheel by holding down the `alt` key. It is also possible to show zoom in and zoom out buttons on the video canvas by activating the `showButtons` option.

![zoom_buttons.jpg](zoom_buttons.jpg)

**Exported as** `ZoomCanvasPlugin`.

###  Zoom menu plugin

Displays the options to zoom in or zoom out the video using a drop-down menu. This plugin works on a specific target, which matches the `content` attribute of the video manifest:

**data.json:**

```mixed
{
  ...
  "streams": [
    {
      "sources": {
        ...
      },
      "content": "presenter",	<< content target to zoom
      "canvas": ["video"]
    }
  ]
}
```


**config.json:**

```json
{
  "plugins": {
    "es.upv.paella.zoomMenuButtonPlugin": {
      "enabled": true,
        "parentContainer": "playbackBar",
        "side": right,
        "target": "presenter"		<< content target to zoom
      }
	}
}
```

**Exported as** `ZoomMenuButtonPlugin`.

**Icon customization data:**

- Plugin identifier: `es.upv.paella.zoomMenuButtonPlugin`
- Icon names:
    * `zoomInIcon`
    * `zoomOutIcon`


### Zoom in and zoom out buttons

These are two button plugins that allow you to zoom in and zoom out the video independently, instead of being grouped in a menu as with the `zoomMenuPlugin` plugin.

**config.json:**

```json
{
  "plugins": {
      "es.upv.paella.zoomInButtonPlugin": {
    		"enabled": true,
        "parentContainer": "videoContainer",
        "side": "right",
        "target": "presenter"
      },
	    "es.upv.paella.zoomOutButtonPlugin": {
    		"enabled": true,
        "parentContainer": "videoContainer",
        "side": "right",
        "target": "presenter"
      }
	}
}
```

**Exported as** `ZoomInButtonPlugin` and `ZoomOutButtonPlugin`.

**Icon customization data:**

- Plugin identifier: `es.upv.paella.zoomInButtonPlugin`
- Icon names:
    * `zoomInIcon`

- Plugin identifier: `es.upv.paella.zoomOutButtonPlugin`
- Icon names:
    * `zoomOutIcon`


### Zoom in and zoom out canvas buttons

These plugins are equivalent to the two previous plugins (`zoomOutButtonPlugin` and `zoomInButtonPlugin`), but are intended to be included in the video canvas.

**config.json:**

```json
{
  "plugins": {
    "es.upv.paella.canvasZoomInButtonPlugin": {
      "enabled": true,
      "side": "right",
      "target": "presenter"
    },
    "es.upv.paella.canvasZoomOutButtonPlugin": {
      "enabled": true,
      "side": "right",
      "target": "presenter"
    }
  }
}
```

**Exported as** `CanvasZoomInButtonPlugin` and `CanvasZoomOutButtonPlugin`.

**Icon customization data:**

- Plugin identifier: `es.upv.paella.canvasZoomInButtonPlugin`
- Icon names:
    * `zoomInIcon`

- Plugin identifier: `es.upv.paella.canvasZoomOutButtonPlugin`
- Icon names:
    * `zoomOutIcon`
