import Plugin from './Plugin';
import type Paella from '../Paella';

export interface HelpData {
    title: string;
    description: string;
}

export default class UserInterfacePlugin extends Plugin {
    constructor(player: Paella, name: string) {
        super(player,name);
        this.__uiPlugin = true;
    }

    async getDictionaries() {
        return null;
    }

    async getHelp() : Promise<HelpData | null> {
        return null;
    }

    async getTranslatedHelp() : Promise<HelpData | null> {
        const help = await this.getHelp();
        if (help) {
            return {
                title: this.player.translate(help.title),
                description: this.player.translate(help.description)
            };
        }
        return null;
    }

    onResize({ width, height } : { width: number, height: number }) : void {}

    get hidden() : boolean { return false; }
}
