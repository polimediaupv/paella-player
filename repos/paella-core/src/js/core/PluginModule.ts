
import PlayerResource from "./PlayerResource";
import { type Dictionaries } from "./Localization";

export default class PluginModule extends PlayerResource {
    get moduleName() : string {
        this.player.log.warn(`Incomplete player module definition: '${ __filename }.moduleName'`);
        return "-";
    }

    get moduleVersion() : string {
        this.player.log.warn(`Incomplete player module definition: '${ __filename }.moduleVersion'`);
        return "0.0.0";
    }

    async getDictionaries() : Promise<Dictionaries | null> {
        return null;
    }
}
