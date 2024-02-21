// Old style import
//import { Paella } from 'paella-core';

// paella-core 2.0 style import
import Paella from 'paella-core/Paella';
import Events from 'paella-core/core/Events';
import { createWindow } from 'paella-core/ui/floating-window';
import { makePushNavigator } from 'paella-core/ui/push-navigator';
import { VolumeButtonPlugin, FullscreenButtonPlugin } from 'paella-basic-plugins';

import StateButtonPlugin from './plugins/stateButton.js';
import DynamicWidthButtonPlugin from './plugins/dynamicWidthButton.js';
import NoIconButtonPlugin from './plugins/noIconButton.js';

// specific for vite package manager: import css from paella-core
//import 'paella-basic-plugins/paella-basic-plugins.css';
import 'paella-core/paella-core.css';

window.addEventListener("load", async () => {
    const player = new Paella('playerContainer', {
  
        plugins: [
            VolumeButtonPlugin,
            {
                plugin: StateButtonPlugin,
                config: { enabled: true, side: "right" }
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
    //modalWindow.show();
})

/*
const content = document.createElement("div");
content.innerHTML = `
<article>
    <p>In Rust, the concept of borrowing refers to the way the language handles memory and data ownership. When you lend a variable, you are allowing another part of the code to use it without taking ownership of it. This is useful for avoiding problems such as race conditions and memory access errors.</p>
    <p>There are two types of loans in Rust: immutable loans and mutable loans.</p>
    <p>Immutable loans: Allow one or more references to read data. During borrowing, the original data cannot be modified.</p>
    <p>Mutable loans: Allow a single reference to modify data. During the loan, the original data cannot be read or modified by any other reference.</p>
    <p>Rust guarantees memory safety through its owning and borrowing system, which helps prevent errors common in other programming languages.</p>
    <button>Smart Pointers</button>
</article>
`;
content.querySelector("button").addEventListener("click", () => {
    navigator.pushPage(content2);
});

const content2 = document.createElement("div");
content2.innerHTML = `
<article>
    <p>Smart pointers in Rust are data structures that not only act like pointers but have additional metadata and capabilities. Unlike regular pointers, smart pointers provide additional functionalities like automatic cleanup (deallocating memory when it's no longer needed), tracking ownership, and reference counting.</p>
    <p>Here are some types of smart pointers in Rust:</p>
    <ul>
        <li>Box&lt;T&gt;: This is used for storing data on the heap rather than the stack. What makes it special is that it's a non-cloneable smart pointer. When a Box goes out of scope, the destructor is called and the heap memory is deallocated.</li>
        <li>Rc&lt;T&gt;: The Rc stands for Reference Counting. It allows multiple owners and keeps track of the number of references to a value which determines when to clean up.</li>
        <li>RefCell&lt;T&gt;: This type has the ability to have interior mutability, a design pattern in Rust that allows you to mutate data even when there are immutable references to that data.</li>
        <li>Arc&lt;T&gt;: This is an atomic reference counter, similar to Rc but safe to use in concurrent situations.</li>
    </ul>
    <p>Remember, Rust's smart pointers are a powerful feature that helps manage memory safely and efficiently.</p>
    <button>Borrowing</button>
</article>
`;
content2.querySelector("button").addEventListener("click", () => {
    navigator.pushPage(content);
});
const navigator = makePushNavigator(content, { });

// All the parameters are optional
const modalWindow = createWindow({ 
    content: navigator,       // This can also be a text string
    title: "Rust Language", 
    closeButton: true,
    top: 100,
    left: 100,
    width: 400,
    //height: 200,
    initiallyHidden: true,
    modal: true
});
*/



