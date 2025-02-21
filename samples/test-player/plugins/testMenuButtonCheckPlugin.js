import { MenuButtonPlugin } from '@asicupv/paella-core';
import TestPluginModule from './TestPluginModule';

export default class TestMenuButtonCheckPlugin extends MenuButtonPlugin {
    getPluginModuleInstance() {
        return TestPluginModule.Get();
    }

    get name() {
        return 'es.upv.paella.testMenuButtonCheckPlugin';
    }

    async load() {
        this.icon = `
        <svg width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
            <polyline points="12 12 12 16 14 16" />
        </svg>`;
    }

    buttonType() {
        return "check";
    }

    get menuTitle() {
        return "Test Menu";
    }

    async getMenu() {
        return [
            { id: 0, title: "Option 1" },
            { id: 1, title: "Option 2" },
            { id: 2, title: "Option 3" },
            { id: 3, title: "Option 4" },
            { id: 4, title: "Option 5" }
        ]
    }

    itemSelected(itemData, menuItems) {
        console.log("Item selected: ", itemData.id);
    }
}

