# Paella Player user tracking plugin

It contains basic plugins for capturing user events, such as button or key presses.

## Usage

**Step 1:** Import the plugin context and add it to the Paella Player initialization parameters:

Usin plugin context API:

```javascript
...
import getUserTrackingPluginsContext from 'paella-user-tracking';

let paella = new Paella('player-container', {
    customPluginContext: [
        getUserTrackingPluginsContext()
    ]
});
...
```

Using explicit plugin import API (paella-user-tracking >= 1.41):

```javascript
...
import {
    userTrackingPlugins, // All plugins
    MatomoUserTrackingDataPlugin      // Independent plugin
} from 'paella-basic-plugins';

let paella = new Paella('player-container', {
    plugins: [
        ...userTrackingPlugins,    // All plugins
        { // One plugin
            plugin: MatomoUserTrackingDataPlugin,
            config: {
                enabled: true
            }
        }
    ]
});
...
```

From version 1.42.2, you can also use the generic plugin array name to import all the plugins:

```js
import { allPlugins as userTracking } from 'paella-user-tracking'
...
```

All the plugin libraries exports the `allPlugins` array. This is done in order to have a method to import all plugins using always the same name for all libraries.


**Step 2:** Configure the plugins you want to use in the paella player configuration.

```json
{
    "plugins": {
        ...
        "es.upv.paella.userEventTracker": {
            "enabled": true
            ...
        }
        ... other plugin settings
    }
}
```

## Included plugins

### User event tracker

It is an [event plugin](https://github.com/polimediaupv/paella-core/blob/main/doc/event_log_plugins.md) that records user events and sends them to a [data target](https://github.com/polimediaupv/paella-core/blob/main/doc/data_plugins.md). Subsequently, a second [data plugin](https://github.com/polimediaupv/paella-core/blob/main/doc/data_plugins.md) will be responsible for collecting this data and sending it to the corresponding target. The events captured by the plugin will be sent to the context defined by the `context` attribute of the plugin configuration.

```json
{
    "es.upv.paella.userEventTracker": {
        "enabled": true,
        "context": "userTracking"
    },
    ...
}

The events captured by the plugin are as follows:

```js
    Events.PLAY,
    Events.PAUSE,
    Events.SEEK,
    Events.STOP,
    Events.ENDED,
    Events.FULLSCREEN_CHANGED,
    Events.VOLUME_CHANGED,
    Events.BUTTON_PRESS,
    Events.SHOW_POPUP,
    Events.HIDE_POPUP,
    Events.RESIZE_END
```

**Exported as** `UserEventTrackerPlugin`.

### Debug user tracking data plugin

Collects the events sent by the `es.upv.paella.userEventTracker` plugin and sends them to the javascript console. It allows to debug the event configuration. The plugin can subscribe to one or more data contexts, but generally it will subscribe to the same context where the `en.upv.paella.userEventTracker` plugin sends events.

```json
{
    "es.upv.paella.debug.userTrackingDataPlugin": {
        "enabled": true,
        "context": [
            "userTracking"
        ],
        "events": [
            "PLAY",
            "PAUSE",
            "SEEK",
            "TIMEUPDATE"
        ]
    },
    ...
}
```

The `events` property is used to specify the events that will trigger an user tracking data event. If the `events` key is not defined in the configuration, the following events will be used by default:

- **PLAY**
- **PAUSE**
- **SEEK**
- **STOP**
- **ENDED**
- **FULLSCREEN_CHANGED**
- **VOLUME_CHANGED**
- **BUTTON_PRESS**
- **RESIZE_END**

If you define the `events` property, the list that you define will replace all the default events. In addition to this, if the `LOG` event is captured, the `logLevel` attribute can be used to customize the log level we want to write. Note that the log level defined in `paella-core` does not affect `LOG` events, as these are always generated. The `paella-core` log level only affects whether or not the log message will be written to the console:

```json
{
    "es.upv.paella.debug.userTrackingDataPlugin": {
        ...
        "events": [
            ...
            "LOG"
        ],
        "logLevel"; "DEBUG"
    },
    ...
}
```

**Exported as** `DebugUserTrackingDataPlugin`.

### Matomo user tracking data plugin

Collects the events sent by the `es.upv.paella.userEventTracker` plugin and sends them to Matomo. In the plugin configuration, we'll set one or more data `context`, that must contains at least those defined in the `es.upv.paella.userEventTracker` plugin configuration, and the specific data for the analytics account.

```json
{
    "es.upv.paella.matomo.userTrackingDataPlugin": {
        "enabled": false,
        "context": [
            "userTracking"
        ],        
        "server": "//matomo.server.com/",
        "siteId": "1",
        "matomoGlobalLoaded": false,
        "events": {
            "category": "PaellaPlayer",
            "action": "${event}",
            "name": "${videoId}"
        },
        "customDimensions": {
            "1": "${videoId}"
        }
    },
}
```

`events` property can be a boolean value or an object

* true: events are loagged with default values.
* false: events are not logged.
* object: events are logged with custom template values.
    ```json
    {
        "category": "PaellaPlayer",
        "action": "${event}",
        "name": "${videoId}"
    }
    ```
Available template variables are:

* `${event}`: The event name.
* `${videoId}`: The video identifier.
* `${eventData}`: A text representation of the data received by the event.
* `${metadata}`: The video manifest metadata field.

`customDimensions` property is an object where `key` is the custom dimension id and the `value` is a string template.

```json
{
    "1": "${videoId}"
}
```

### Adapt to your institution

You can extends this plugin and adapt it to your institution. In most cases you only need to implement two functions:

* `getCurrentUserId`: returns a text representation of the logged user.
* `getTemplateVars`: return an object with te available template variables.

```js
import { MatomoUserTrackingDataPlugin } from 'paella-user-tracking';

export default class MyExtentedMatomoUserTrackingDataPlugin extends MatomoUserTrackingDataPlugin {

    async getCurrentUserId() {
        return 'anonymous';
    }

    async getTemplateVars() {
        let templateVars = await super.getTemplateVars();
        
        return {
            ...templateVars,
            newvar: "My new variable"
        };
    }
```

**Exported as** `MatomoUserTrackingDataPlugin`.

### Google Analytics user tracking data plugin

Collects the events sent by the `es.upv.paella.userEventTracker` plugin and sends them to Google Analytics. In the plugin configuration, we'll set one or more data `context`, that must contains at least those defined in the `es.upv.paella.userEventTracker` plugin configuration, and the specific data for the analytics account.

```json
{
    "es.upv.paella.analytics.userTrackingDataPlugin": {
        "enabled": false,
        "trackingId": "G-xxxxxxxxxx",
        "domain": "",
        "category": true,
        "context": [
            "userTracking"
        ]
    },
}
```

**Exported as** `GoogleAnalyticsUserTrackingDataPlugin`.


