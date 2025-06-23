# paella-cookieconsent-plugin

A plugin to manage cookie consent in Paella Player.

This plugin is useful when the site integrating Paella Player does not already have a way to manage cookie consent. If the site already handles cookie consent, you should implement the `getCookieConsentFunction` from `PaellaInitParams`. For more details on how to implement this function, refer to the Paella documentation.

## Usage

**Step 1:** Import the plugin context and add it to the Paella Player initialization parameters:

```javascript
...
import getCookieConsentPluginContext from 'paella-cookieconsent-plugin';

let paella = new Paella('player-container', {
    customPluginContext: [
        getCookieConsentPluginContext()
    ]
});
...
```

**Step 2:** Configure the `cookieConsent` property and add the plugin in the `plugins` section of the Paella Player configuration file.

```json
{
    "cookieConsent": [
        {
            "type": "necessary",
            "title": "Necessary",
            "description": "Cookies required for proper operation.",
            "required": true
        },
        {
            "type": "preferences",
            "title": "Preferences",
            "description": "Cookies used to store user preferences that can be configured in the application. If disabled, some of these features may not work properly.",
            "required": false
        },
        {
            "type": "analytical",
            "title": "Analytical",
            "description": "Cookies used to analyze user behavior and thus provide clues about future improvements in the application.",
            "required": false
        },
        {
            "type": "marketing",
            "title": "Marketing",
            "description": "Cookies used to better tailor ads to user preferences.",
            "required": false
        }
    ],
    ...
    "plugins": {
        "es.upv.paella.cookieConsentPlugin": {
            "enabled": true
        }
    }
}
```

**Step 3:** Add the `getCookieConsentFunction` function to the `InitParams` when creating the player.

The `getCookieConsentFunction` is used to retrieve the user's cookie consent preferences. This function must be passed as part of the initialization parameters when creating the Paella Player instance.

```javascript
import { getCookieConsentFunction } from 'paella-cookieconsent-plugin';

const player = new Paella('playerContainer', {
    getCookieConsentFunction: getCookieConsentFunction,
    ...
});
```

This function ensures that the plugins and features in Paella Player respect the user's cookie preferences, such as enabling or disabling specific functionalities based on the consent type.

## Description

The `paella-cookieconsent-plugin` displays a cookie consent banner in the video player. 

### Icon Customization

- Plugin identifier: `es.upv.paella.cookieConsentPlugin`
- Icon name:
    * `cookieIcon`

## Example

```json
{
    "cookieConsent": [
        {
            "type": "necessary",
            "title": "Necessary",
            "description": "Cookies required for proper operation.",
            "required": true
        },
        {
            "type": "preferences",
            "title": "Preferences",
            "description": "Cookies used to store user preferences that can be configured in the application. If disabled, some of these features may not work properly.",
            "required": false
        },
        {
            "type": "analytical",
            "title": "Analytical",
            "description": "Cookies used to analyze user behavior and thus provide clues about future improvements in the application.",
            "required": false
        },
        {
            "type": "marketing",
            "title": "Marketing",
            "description": "Cookies used to better tailor ads to user preferences.",
            "required": false
        }
    ],
    "plugins": {
        "es.upv.paella.cookieConsentPlugin": {
            "enabled": true
        }
    }
}
```
