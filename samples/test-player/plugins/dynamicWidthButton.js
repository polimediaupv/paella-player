import { ButtonPlugin, PaellaCorePlugins } from '@asicupv/paella-core';

const icon = `
<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M17.464 6.518a6 6 0 1 0 -3.023 7.965" />
    <path d="M17.482 17.464a6 6 0 1 0 -7.965 -3.023" />
    <path d="M6.54 17.482a6 6 0 1 0 3.024 -7.965" />
    <path d="M6.518 6.54a6 6 0 1 0 7.965 3.024" />
</svg>`;

const TEXTS = [
    "Dynamic Text 1",
    "Hello World",
    "Dynamic Text 2"
];

export default class DynamicWidthButtonPlugin extends ButtonPlugin {
    getPluginModuleInstance() {
        return PaellaCorePlugins.Get();
    }

    get name() {
        return super.name || "es.upv.paella.dynamicWidthButton";
    }

    get dynamicWidth() { return true; }

    async load() {
        this.icon = icon;
        this._currentText = 0;
        this.title = TEXTS[this._currentText];
    }

    async action() {
        this._currentText = (this._currentText + 1) % TEXTS.length;
        this.setState({ text: TEXTS[this._currentText]});
    }
}
