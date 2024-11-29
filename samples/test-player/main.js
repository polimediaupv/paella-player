// Old style import
//import { Paella } from 'paella-core';

// paella-core 2.0 style import
import Paella from 'paella-core/Paella';
import Events from 'paella-core/core/Events';
import { VolumeButtonPlugin, FullscreenButtonPlugin } from 'paella-basic-plugins';

import StateButtonPlugin from './plugins/stateButton.js';
import DynamicWidthButtonPlugin from './plugins/dynamicWidthButton.js';
import NoIconButtonPlugin from './plugins/noIconButton.js';
import TestPopUpButtonPlugin from './plugins/testPopUpPlugin.js';
import TestMenuButtonPlugin from './plugins/testMenuButtonPlugin.js';
import TestMenuButtonRadioPlugin from './plugins/testMenuButtonRadioPlugin.js';
import TestMenuButtonCheckPlugin from './plugins/testMenuButtonCheckPlugin.js';

// specific for vite package manager: import css from paella-core
//import 'paella-basic-plugins/paella-basic-plugins.css';
import 'paella-core/paella-core.css';

window.addEventListener("load", async () => {
    const player = new Paella('playerContainer', {
  
        plugins: [
            VolumeButtonPlugin,
            {
                plugin: StateButtonPlugin,
                config: { enabled: true, side: "right", parentContainer: "options" }
            },
            {
                plugin: DynamicWidthButtonPlugin,
                config: { enabled: true, side: "right" }
            },
            {
                plugin: NoIconButtonPlugin,
                config: { enabled: true, side: "left", order: 1 }
            },
            {
                plugin: FullscreenButtonPlugin,
                config: { enabled: true, side: "right", order: 0 }
            },
            {
                plugin: TestPopUpButtonPlugin,
                config: { enabled: true, side: "right", order: 5, parentContainer: "options", description: "Test PopUp" }
            },
            {
                plugin: TestMenuButtonPlugin,
                config: { enabled: true, side: "right", order: 6, closeOnSelect: false, menuTitle: "Select a Rice Dish 🥘", description: "Typical rice dishes", parentContainer: "options" }
            },
            {
                plugin: TestMenuButtonRadioPlugin,
                config: { enabled: true, side: "right", order: 7, closeOnSelect: false }
            },
            {
                plugin: TestMenuButtonCheckPlugin,
                config: { enabled: true, side: "right", order: 8, closeOnSelect: false }
            }
        ]
    });
    
    await player.loadManifest();
    window.player = player;
});

// UI test
const uiTestContainer = document.getElementById("uiTest");

const button = document.createElement("button");
button.innerHTML = "Show modal window";
uiTestContainer.appendChild(button);


// Implementation prototype for the PlaybackBarPopUp API
const content = document.createElement('article')
content.innerHTML = `
<p>Implementation tests for the PlaybackBarPopUp API</p>
<button>Tell me more</button>
`;

const child = document.createElement('article')
child.innerHTML = `
<p>This is a child pop up content. </p><p>You can go back using the back button at the title bar</p>
<button>Open another pop up</button>`;
content.querySelector("button").addEventListener("click", () => {
    player.playbackBar.popUp.show({ title:"Child Content", content: child, attachRight: true, parent: content });
});

const grandson = document.createElement('article');
grandson.innerHTML = `
<p>This is a grandson pop up content. </p><p>You can go back using the back button at the title bar</p>`;
child.querySelector("button").addEventListener("click", () => {
    player.playbackBar.popUp.show({ title:"Grandson Content", content: grandson, attachRight: true, parent: child });
});

button.addEventListener("click", () => {
    if (player.playbackBar.popUp.isHidden) {
        player.playbackBar.popUp.show({ title: "PlaybackBarPopUp API test", content, attachRight: true });
    }
    else {
        player.playbackBar.popUp.hide();
    }
})
