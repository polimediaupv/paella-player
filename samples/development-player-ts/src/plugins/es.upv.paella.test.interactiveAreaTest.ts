import { InteractiveAreaPlugin, PluginModule } from "@asicupv/paella-core"
import TestPlayerPluginModule from "./TestPlayerPluginModule";

export default class TestInteractiveAreaPlugin extends InteractiveAreaPlugin {
    getPluginModuleInstance(): PluginModule | null {
        return TestPlayerPluginModule.get();
    }

    get name() {
        return "es.upv.paella.test.interactiveAreaTest";
    }

    async getContent() : Promise<HTMLElement> {
        const elem = document.createElement("div");

        elem.innerHTML = "Hello, World!";

        return elem;
    }
}