import PopUpButtonPlugin from 'paella-core/core/PopUpButtonPlugin.js';
import PaellaCorePlugins from 'paella-core/plugins/PaellaCorePlugins.js';

export default class TestPopUpButtonPlugin extends PopUpButtonPlugin {
    getPluginModuleInstance() {
        return PaellaCorePlugins.Get();
    }

    get name() {
        return 'es.upv.paella.testPopUpButtonPlugin';
    }

    async load() {
        this.icon = `
        <svg width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 17.6l-2 -1.1v-2.5" />
            <path d="M4 10v-2.5l2 -1.1" />
            <path d="M10 4.1l2 -1.1l2 1.1" />
            <path d="M18 6.4l2 1.1v2.5" />
            <path d="M20 14v2.5l-2 1.12" />
            <path d="M14 19.9l-2 1.1l-2 -1.1" />
            <path d="M12 12l2 -1.1" />
            <path d="M18 8.6l2 -1.1" />
            <path d="M12 12l0 2.5" />
            <path d="M12 18.5l0 2.5" />
            <path d="M12 12l-2 -1.12" />
            <path d="M6 8.6l-2 -1.1" />
        </svg>`;

    }

    async getContent() {
        const content = document.createElement('div');
        content.innerHTML = '<p>Test Pop Up Button Plugin Content</p>';
        return content;
    }
}