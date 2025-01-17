import { ButtonPlugin } from '@asicupv/paella-core';
import TestPluginModule from './TestPluginModule';

const swipeDown = `
<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0 -8z" />
    <path d="M12 12v8" />
    <path d="M9 17l3 3l3 -3" />
</svg>`;

const swipeLeft = `
<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 12a4 4 0 1 0 -8 0a4 4 0 0 0 8 0z" />
    <path d="M12 12h-8" />
    <path d="M7 15l-3 -3l3 -3" />
</svg>
`;

const swipeRight = `
<svg xmlns="http://www.w3.org/2000/svg"" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 12a4 4 0 1 1 8 0a4 4 0 0 1 -8 0z" />
    <path d="M12 12h8" />
    <path d="M17 15l3 -3l-3 -3" />
</svg>`;

const swipeUp = `
<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 16m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <path d="M12 12v-8" />
    <path d="M9 7l3 -3l3 3" />
</svg>`;

const State = Object.freeze({
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
});

const StateIcons = [
    swipeUp,
    swipeRight,
    swipeDown,
    swipeLeft
];

const StateTexts = [
    "up",
    "right",
    "down",
    "left"
];

export default class StateButtonPlugin extends ButtonPlugin {
    getPluginModuleInstance() {
        return TestPluginModule.Get();
    }

    get name() {
        return "es.upv.paella.stateButtonPlugin";
    }

    async load() {
        this.#updateState();
    }

    #state = State.UP;

    async action() {
        this.#state = (this.#state + 1) % Object.keys(State).length;
        this.#updateState();
    }

    #updateState() {
        this.setState({ icon: StateIcons[this.#state], text: StateTexts[this.#state] });
    }
}
