import { PluginModule } from '@asicupv/paella-core';
import packageData from '../package.json';

export default class TestPluginModule extends PluginModule {
    static #singleton = null;

    static Get() {
        if (!TestPluginModule.#singleton) {
            TestPluginModule.#singleton = new TestPluginModule();
        }
        return TestPluginModule.#singleton;
    }

    get moduleName() {
        return 'TestPluginModule';
    }

    get moduleVersion() {
        return packageData.version;
    }
}
