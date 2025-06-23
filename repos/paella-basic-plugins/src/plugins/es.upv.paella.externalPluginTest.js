import { ButtonPlugin } from "@asicupv/paella-core";
import BasicPluginsModule from './BasicPluginsModule';

import userIcon from '../icons/user.svg';

export default class TestExternalPlugin extends ButtonPlugin {
    getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.externalPluginTest";
    }

    get icon() {
        return userIcon;
    }

    async action() {
        alert("Test external plugin");
    }

    async getHelp() {
        return {
            title: "Test external plugin",
            description: "A test plugin to demonstrate external plugin functionality."
        };
    }
}
