import Plugin from './Plugin';

export default class UserInterfacePlugin extends Plugin {
    constructor(player,name) {
        super(player,name);
        this.__uiPlugin = true;
    }

    async getDictionaries() {
        return null;
    }

    async getHelp() {
        return null;
    }

    async getTranslatedHelp() {
        const help = await this.getHelp();
        if (help) {
            return {
                title: this.player.translate(help.title),
                description: this.player.translate(help.description)
            };
        }
        return null;
    }
}