# paella-webgl-plugins

A set of canvas plugins to show videos using a WebGL canvas.

## Usage

**Step 1:** Import the plugin context and add it to the Paella Player initialization parameters:

Usin plugin context API:

```javascript
...
import getWebGLPluginsContext from 'paella-webgl-plugins';

let paella = new Paella('player-container', {
    customPluginContext: [
        getWebGLPluginsContext()
    ]
});
...
```

Using explicit plugin import API (paella-basic-plugins >= 1.41):

```javascript
...
import {
    webglPlugins, // All plugins
} from 'paella-webgl-plugins';

let paella = new Paella('player-container', {
    plugins: [
        ...webglPlugins
    ]
});
...
```

From version 1.42.1, you can also use the generic plugin array name to import all the plugins:

```js
import { allPlugins as webglPlugins } from 'paella-webgl-plugins'
...
```

All the plugin libraries exports the `allPlugins` array. This is done in order to have a method to import all plugins using always the same name for all libraries.

**Step 2:** Configure the plugins you want to use in the paella player configuration.

```json
{
    "plugins": {
        ...
       "es.upv.paella.video360Canvas": {
            "enabled": true,
            ...
        },
        ... other plugin settings
    }
}
```

## Video 360 Canvas

It is a canvas plugin that allows you to display 360-degree videos recorded in equirectangular format. Mouse or touch actions on the canvas are used to zoom and scroll the video, therefore with this canvas the play/pause by clicking on the video canvas is disabled.

This video canvas works with those streams that have `video360` as canvas identifier in the [video manifest](https://paellaplayer.upv.es/#/doc/video_manifest.md).

**data.json:**

```json
{
    ...
    "streams": [
        {
            "sources": {...},
            "content": "presenter",
            "canvas":["video360"]
        }
    ]
}
```

**config.json:**

```json
{
    "plugins": {
        "es.upv.paella.video360Canvas": {
            "enabled": true,
            "maxZoom": 2,
            "minZoom": 0.5,
            "speedX": 0.4,
            "speedY": 0.4
        }
    }
}
```

**Exported as** `Video360CanvasPlugin`.
¡