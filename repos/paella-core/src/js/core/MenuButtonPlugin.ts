
import PopUpButtonPlugin from './PopUpButtonPlugin';
import Plugin from "./Plugin";
import ButtonPlugin from './ButtonPlugin';
import { createElementWithHtmlText } from './dom';
import { resumeAutoHideUiTimer } from './utils';


const titleElement = (title: string | null) => title ? `<span class="menu-title">${title}</span>` : "";
const iconElement = (icon: string | null) => icon ? `<i class="menu-icon">${icon}</i>` : "";
const ariaLabel = (title: string | null) => title ? `aria-label="${title}"` : "";
const stateTextElement = (text: string | null) => text ? `<span class="state-text">${text}</span>` : "";
const stateIconElement = (icon: string | null) => icon ? `<i class="state-icon">${icon}</i>` : "";
const stateElem = (text: string | null, icon: string | null) => text || icon ? `<span class="button-state">${stateTextElement(text)}${stateIconElement(icon)}</span>` : "";

type ButtonType = "check" | "radio" | "button";

type ItemData = {
	icon?: string | null
	iconText?: string | null
	id: number
	plugin?: ButtonPlugin,
	stateIcon?: string | null
	stateText?: string | null
	title?: string | null
	showTitle?: boolean
	selected?: boolean
}

type GetMenuItemParams = {
	itemData: ItemData
	buttonType: ButtonType
	container: HTMLElement
	allItems: ItemData[]
	menuName: string
	selectedItems: any
	itemPlugin?: ButtonPlugin
}

async function getMenuItem(this: MenuButtonPlugin, {
	itemData,
	buttonType,
	container,
	allItems,
	menuName,
	selectedItems,
	itemPlugin
} : GetMenuItemParams) : Promise<HTMLElement> {
	const { id = 0, title = null, icon = null, iconText = null, showTitle = true, stateText = null, stateIcon = null } = itemData;
	const plugin: MenuButtonPlugin = this;

	const anchorUrl = itemPlugin && await itemPlugin.getAnchorUrl();
	if (anchorUrl) {
		(itemPlugin as any)._isAnchor = true;
	}
	
	const item = document.createElement("li");
	const isSelected = selectedItems[id] ?? false;
	const urlTarget = itemPlugin && itemPlugin.anchorTarget !== null ? `target="${itemPlugin.anchorTarget}" ` : "";
	const downloadFilename = itemPlugin && itemPlugin.anchorDownloadFilename !== null ? `download="${itemPlugin.anchorDownloadFilename}" ` : "";
	const referrerPolicy = itemPlugin && itemPlugin.anchorReferrerPolicy !== null ? `referrerpolicy="${itemPlugin.anchorReferrerPolicy}" ` : "";
	const button = itemPlugin?.isAnchor ? createElementWithHtmlText(`
		<a class="menu-button-item${ isSelected ? " selected" : ""}" ${ariaLabel(title)} data-id="${id}"" id="${plugin.name}_menuItem_${id}" name="${id}" href="${anchorUrl}" ${urlTarget}${downloadFilename}${referrerPolicy}>
			${ iconElement(icon) }
			${ showTitle ? titleElement(title) : "" }
			${ stateText || stateIcon ? stateElem(stateText, stateIcon) : ""}
		</a>
	`) : createElementWithHtmlText(`
		<button class="menu-button-item${ isSelected ? " selected" : ""}" ${ariaLabel(title)} data-id="${id}"" id="${plugin.name}_menuItem_${id}" name="${id}">
			${ iconElement(icon) }
			${ showTitle ? titleElement(title) : "" }
			${ stateText || stateIcon ? stateElem(stateText, stateIcon) : ""}
		</button>
	`);

	// Save a reference to the button in the item plugin, if it exists
	if (itemPlugin) {
		(itemPlugin as any)._button = button;
	}

	button.addEventListener("keydown", evt => {
		const captureEvent = () => {
			evt.stopPropagation();
			evt.preventDefault();
		};

		// Manage the tab and esc keys to cycle the elements in the menu and close it
		if (evt.key === "ArrowUp") {
			const prev = (button as any).dataPrev;
			prev?.focus();
			captureEvent();
		}
		else if (evt.key === "ArrowDown") {
			const prev = (button as any).dataNext
			prev?.focus();
			captureEvent();
		}
		else if (evt.key === "Tab") {
			// dataNext and dataPrev are set on getContent() function
			const nextFocus = evt.shiftKey ? (evt.target as any).dataPrev: (evt.target as any).dataNext;
			nextFocus?.focus();
			captureEvent();
		}
		else if (evt.key === "Escape") {
			if (!this.player.playbackBar.popUp.pop()) {
				this.focus();
			}
			else {
				plugin.button?.focus();
			}
			captureEvent();
		}
	});
	button.addEventListener("click", async evt => {
		if (buttonType === "check") {
			const item = allItems.find(item => item.id === id);
			selectedItems[id] = !selectedItems[id];
			plugin.itemSelected(item || null, allItems);
		}
		else if (buttonType === "radio") {
			selectedItems[id] = true;
			let item = null;
			allItems.forEach(currentItem => {
				if (currentItem.id === id) {
					item = currentItem;
				}
				else {
					selectedItems[currentItem.id] = false;
				}
			});
			plugin.itemSelected(item, allItems);
		}
		else {
			const item = allItems.find(item => item.id === id);
			plugin.itemSelected(item || null, allItems);
		}

		await plugin.checkRefreshContent();
		evt.stopPropagation();

		if (plugin.closeOnSelect) {
			plugin.closeMenu();
			resumeAutoHideUiTimer(plugin.player);
		}
	});
	item.appendChild(button);
	container.appendChild(item);
	return item;
}

export default class MenuButtonPlugin extends PopUpButtonPlugin {
	
	get closeOnSelect() {
		if (this.config.closeOnSelect === undefined) {
			if (this.buttonType !== "check") {
				this.config.closeOnSelect = true;
			}
			else {
				this.config.closeOnSelect = false;
			}
		}
		return this.config.closeOnSelect;
	}

	setSelected(id: string, value: any) {
		if ((this as any)._selectedItems) {
			(this as any)._selectedItems[id] = value;
		}
	}

	async getContent() {
		// If the menu is reloaded, and there is an item that has the focus, this will restore it once it is reloaded.
		const currentActiveElementId = document.activeElement?.id;

		const content = createElementWithHtmlText(`<menu></menu>`);
		(this as any)._content = content;

		const menuItems = await this.getMenu();
		(this as any)._menuItems = menuItems;

		if (!(this as any)._selectedItems) {
			(this as any)._selectedItems = {};
			// The `selected` property of the menu items is used to set the initial state. Once initialized, the
			// selection value is managed by the plugin and the `selected` property is ignored.
			(this as any)._menuItems.forEach((itemData: ItemData) => {
				if (itemData.selected !== undefined && itemData.selected !== null) {
					(this as any)._selectedItems[itemData.id] = itemData.selected;
				}
			});
		}

		const menuName = self.crypto.randomUUID();
		const itemElems: HTMLElement[] = [];
		for (const item of menuItems) {
			await getMenuItem.apply(this,  [{
				itemData: item, 
				buttonType: typeof (this as any).buttonType === 'function' ? (this as any).buttonType() : this.buttonType,
				container: content,
				allItems: menuItems,
				menuName,
				selectedItems: (this as any)._selectedItems,
				itemPlugin: item.plugin
			}]);
		}
		itemElems.forEach((item, i, arr) => {
			const button = item.querySelector("button");
			let next = arr[i + 1];
			let prev = arr[i - 1];

			if (i === (arr.length - 1)) {
				next = arr[0];
			}

			if (i === 0) {
				prev = arr[arr.length - 1];
			}

			if (button) {
				(button as any).dataNext = next?.querySelector("button");
				(button as any).dataPrev = prev?.querySelector("button");
			}
		});
		(this as any)._firstItem = itemElems[0]?.querySelector("button");

		if (currentActiveElementId) {
			setTimeout(() => {
				// If this element still exists in the DOM, it means that the menu has been redrawn. 
				// In that case, we restore the focus
				document.getElementById(currentActiveElementId)?.focus();
			}, 10);
		}
		return content;
	}

	get menuTitle() {
		return this.config.menuTitle || null;
	}
	
	async getMenu(): Promise<ItemData[]> {
		// menuItem options:
		// - id: unique identifier of the menu item
		// - title: text to display in the menu item
		// - icon: icon to display in the menu item
		// - iconText: text to display in the icon
		// - showTitle: if false, the title is not displayed
		// - stateText: text to display in the state element
		// - stateIcon: icon to display in the state element
		// - selected: initial state of the menu item
		// - data: additional data to be used in the itemSelected() function
		// - plugin: reference to the plugin that created the menu
		const items = [
			{ id: 0, title: "Option 1" },
			{ id: 1, title: "Option 2" },
			{ id: 2, title: "Option 3" },
			{ id: 3, title: "Option 4" },
			{ id: 4, title: "Option 5" }
		];
		return items;
	}
	
	// Returns the menuItems with the current menu state
	get menuItems() {
		return (this as any)._menuItems;
	}
	
	// If showTitles is false, then the 'title' attribute of the menu
	// items is used only as aria-label.
	// If the menu item has no icon, then the `showTitles` property is ignored
	get showTitles() {
		return true;
	}
	
	get buttonType() {
		// check, radio or button
		return "radio";	
	}
	
	itemSelected(itemData: ItemData | null, menuItems: ItemData[]) {
		this.player.log.warn(`MenuButtonPlugin (${ this.name }): itemSelected() function not implemented.`);
	}
	
	closeMenu() {
		this.player.playbackBar.popUp.hide();
	}

	async showPopUp() {
		// Refresh popup content to set focus on the first menu item
		this.refreshContent = true;
		await super.showPopUp();

		if (this.player.containsFocus && (this as any)._firstItem) {
			(this as any)._firstItem.focus();
		}
	}
}
