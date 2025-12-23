
import PlayerResource from "./PlayerResource";
import { type Dictionaries } from "./Localization";

export default class PluginModule {
    get moduleName() : string {
        console.warn(`Incomplete player module definition: '${ __filename }.moduleName'`);
        return "-";
    }

    get moduleVersion() : string {
        console.warn(`Incomplete player module definition: '${ __filename }.moduleVersion'`);
        return "0.0.0";
    }

    async getDictionaries() : Promise<Dictionaries | null> {
        return null;
    }
}
