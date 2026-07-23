
import { type Dictionaries } from "./Localization";

export default class PluginModule {
    get moduleName() : string {
        console.warn(`Incomplete player module definition: '${ this.constructor.name }.moduleName'`);
        return "-";
    }

    get moduleVersion() : string {
        console.warn(`Incomplete player module definition: '${ this.constructor.name }.moduleVersion'`);
        return "0.0.0";
    }

    async getDictionaries() : Promise<Dictionaries | null> {
        return null;
    }
}
