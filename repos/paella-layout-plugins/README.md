# A layout plugin set for Paella Player

## Usage

**Step 1:** Import the plugin context and add it to the Paella Player initialization parameters:

Using plugin context API:

```javascript
...
import getBasicPluginsContext from 'paella-layout-plugins';

let paella = new Paella('player-container', {
    customPluginContext: [
        getBasicPluginsContext()
    ]
});
...
```

Using explicit plugin import API (paella-layout-plugins >= 1.41):

```javascript
...
import {
    layoutPlugins
} from 'paella-layout-plugins';

let paella = new Paella('player-container', {
    plugins: [
        ...layoutPlugins
    ]
});
...
```

From version 1.41.1, you can also use the generic plugin array name to import all the plugins:

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
        "es.upv.paella.dualVideoSideBySide": {
            "enabled": true,
            ...
        }
        ... other plugin settings
    }
}
```

## Included plugins

### Dual video side by side

An alternative layout plugin to the official one, which allows to display videos side by side with different sizes.

The `cookieType` attribute is used to configure the type of cookie we want to use to save the last layout configuration, and must match one of the values defined in the cookieConsent configuration. For more information, see the [documentation on cookie consent](https://paellaplayer.upv.es/#/doc/cookie_consent.md).

The `validContent` attribute specifies which streams will be accepted for the layout. For more information on configuring video layouts, see [the official `paella-core` documentation](https://paellaplayer.upv.es/#/doc/video_layout.md).

```json
{
    "plugins": {
        "es.upv.paella.dualVideoSideBySide": {
            "enabled": true,
            "order": 0,
            "side": "right",
            "validContent": [
                { 
                    "id": "presenter-presentation", 
                    "content": ["presenter","presentation"], 
                    "icon": "present-mode-3.svg", 
                    "title": "Presenter and presentation"
                },
                {
                    "id": "presenter-2-presentation",
                    "content": ["presenter-2","presentation"],
                    "icon": "present-mode-3.svg",
                    "title": "Presenter and presentation"
                },
                {
                    "id": "presenter-presenter-2",
                    "content": ["presenter","presenter-2"],
                    "icon": "present-mode-3.svg",
                    "title": "Presenter and presentation"
                }
            ]
        },
        ...
    }
}
```

**Exported as** `DualVideoSideBySideLayoutPlugin`.

**Icon customization data:**

- Plugin identifier: `es.upv.paella.dualVideoSideBySide`
- Icon names:
    * `iconMinimize`
    * `iconMaximize`
    * `iconClose`
