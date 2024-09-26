import { ButtonPlugin } from 'paella-core';
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
}
