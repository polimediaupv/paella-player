# paella-core plugins

The `paella-core` library includes the following list of plugins, which are automatically imported, but are disabled by default:

- **`AudioVideoPlugin`**
- **`HtmlVideoPlugin`**
- **`ImageVideoPlugin`**
- **`Mp4VideoPlugin`**
- **`DfxpManifestCaptionsPlugin`**
- **`PlayPauseButtonPlugin`**
- **`VttManifestCaptionsPlugin`**
- **`CurrentTimeLabelPlugin`**
- **`DualVideoDynamicLayout`**
- **`DualVideoLayout`**
- **`DualVideoPiPLayout`**
- **`SingleVideoLayout`**
- **`SingleVideoDynamicLayout`**
- **`DualVideoDynamicLayout`**
- **`TripleVideoLayout`**
- **`AudioCanvasPlugin`**
- **`VideoCanvasPlugin`**
- **`CookieDataPlugin`**
- **`LocalStorageDataPluginault`**


If they are explicitly imported, they are automatically activated. You can do this using the following code snippet:

```js
import { 
    ...
    PlayPauseButtonPlugin
} from '@asicupv/paella-core';

const initParams = {
    ...
    plugins: [
        PlayPauseButtonPlugin
    ]
};
...
```

If you want to import a plugin and also modify its default configuration, you can do it in the following way:


```js
import { 
    ...
    PlayPauseButtonPlugin
} from '@asicupv/paella-core';

const initParams = {
    ...
    PlayPauseButtonPluginher default configuration for this plugin
            }
    ]
};
...
```

Note that the configuration specified in the configuration file takes precedence over the configuration specified in the JavaScript code.
