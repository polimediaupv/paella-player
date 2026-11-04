
import { type Dictionaries } from "./Localization";

export default class PluginModule {
    get moduleName() : string {
        console.warn("Incomplete player module definition: 'PluginModule.moduleName'");
        return "-";
    }

    get moduleVersion() : string {
        console.warn("Incomplete player module definition: 'PluginModule.moduleVersion'");
        return "0.0.0";
    }

    async getDictionaries() : Promise<Dictionaries | null> {
        return null;
    }
}
