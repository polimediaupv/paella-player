import MenuButtonPlugin, { ItemData, type ButtonType } from './MenuButtonPlugin';
import { type PopUpType } from './Config';
import ButtonPlugin from './ButtonPlugin';
import { loadPluginsOfType } from './plugin_tools';
import { loadSvgIcon, isSvgString } from './utils';
import Events from './Events';

export default class ButtonGroupPlugin extends MenuButtonPlugin {
    get closeOnSelect() {
        return this.config.closeOnSelect ?? false;
    }

    async load() {
        if ((this as any)._iconPath && isSvgString((this as any)._iconPath)) {
            this.icon = (this as any)._iconPath;
        }
        else if ((this as any)._iconPath) {
            this.icon = await loadSvgIcon((this as any)._iconPath);
        }
    }

    async getContent() {
        if (!(this as any)._buttonPlugins) {
            (this as any)._buttonPlugins = [];
            await loadPluginsOfType<ButtonPlugin>(this.player, "button", async (plugin) => {
                this.player.log.debug(`Load button plugins into "${this.groupName}" container`);
                (this as any)._buttonPlugins.push(plugin);
                plugin.setObserver(this);
            }, async plugin => {
                const containerName = plugin.parentContainer;
                if (containerName === this.groupName) {
                    return await plugin.isEnabled();
                }
                else {
                    return false;
                }
            });
        }
        return await super.getContent();
    }

    onIconChanged(plugin: ButtonPlugin, prevIcon: string, newIcon: string) {
        // TODO: Change icon in menu button, if menu is open
    }

    onTitleChanged(plugin: ButtonPlugin, prevTitle: string, newTitle: string) {
        // TODO: Change text in menu button, if menu is open
    }

    onStateChanged(plugin: ButtonPlugin, prevText: string, newText: string, prevIcon: string, newIcon: string) {
        // TODO: Change text and icon in menu button, if menu is open
    }

    getGroupName() {
        return "buttonGroup";
    }

    get groupName() {
        return this.config?.groupName || this.getGroupName();
    }

    get popUpType() : PopUpType {
        return "modal";
    }

    getClosePopUps() {
        return false;
    }

    get buttonType() : ButtonType {
        return "button";
    }

    async getMenu() {
        return (this as any)._buttonPlugins.map((plugin: ButtonPlugin) => {
            return {
                id: plugin.name,
                title: plugin.title || plugin.description,
                icon: plugin.menuIcon !== "" ? plugin.menuIcon : plugin.icon,
                stateText: plugin.stateText,
                stateIcon: plugin.stateIcon,
                plugin,
                iconText: plugin.title
            }
        });
    }

    itemSelected(itemData: ItemData, _menuItems: ItemData[]) {
        const plugin = ((this as any)._buttonPlugins as ButtonPlugin[]).find((plugin: any) => "" + plugin.name === "" + itemData.id);
        if (plugin) {
            plugin.action(Events.MENU_ITEM_SELECTED, this.currentContent);
        }
    }

    async showPopUp() {
		await super.showPopUp();

        setTimeout(() => {
            if ((this as any)._firstItem) {
                (this as any)._firstItem.focus();
            }
        }, 50);

        this.buttons?.forEach((btn: HTMLElement) => {
            if (btn.style.display === 'none') {
                this.hideButtonContainer(btn);
            }
            else {
                this.showButtonContainer(btn);
            }
        });
	}

    get buttons() {
        return (this as any)._content && [...(this as any)._content.getElementsByClassName('menu-button-item'), ...(this as any)._content.getElementsByClassName('button-plugin')];
    }

    async getButtons() {
        if (!(this as any)._content) {
            await this.showPopUp();
            await this.hidePopUp();
        }
        return this.buttons;
    }

    get buttonPlugins() {
        return (this as any)._buttonPlugins && [...(this as any)._buttonPlugins];
    }

    async getButtonPlugins() {
        if (!(this as any)._buttonPlugins) {
            await this.showPopUp();
            await this.hidePopUp();
        }
        return this.buttonPlugins;
    }

    async getVisibleButtonPlugins() {
        const result = await this.getButtonPlugins();
        return result.filter((p: ButtonPlugin) => !p.hidden);
    }

    hideButtonContainer(btn: HTMLElement) {
        const container: ParentNode | null | undefined = btn.parentNode?.parentNode;
        if (container && container instanceof HTMLElement) {
            container.style.display = "none";
        }
    }

    showButtonContainer(btn: HTMLElement) {
        const container: ParentNode | null | undefined = btn.parentNode?.parentNode;
        if (container && container instanceof HTMLElement) {
            container.style.display = "";
        }
    }
}
