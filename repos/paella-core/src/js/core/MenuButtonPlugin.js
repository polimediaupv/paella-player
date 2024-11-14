
import PopUpButtonPlugin from './PopUpButtonPlugin';
import { createElementWithHtmlText } from './dom';

const titleElement = (title) => title ? `<span class="menu-title">${title}</span>` : "";
const iconElement = (icon) => icon ? `<i class="menu-icon">${icon}</i>` : "";
const ariaLabel = (title) => title ? `aria-label="${title}"` : "";
const stateTextElement = (text) => text ? `<span class="state-text">${text}</span>` : "";
const stateIconElement = (icon) => icon ? `<i class="state-icon">${icon}</i>` : "";
const stateElem = (text,icon) => text || icon ? `<span class="button-state">${stateTextElement(text)}${stateIconElement(icon)}</span>` : "";

function getMenuItem(itemData, buttonType, container, allItems, menuName, selectedItems) {
	const { id = 0, title = null, icon = null, showTitle = true, stateText = null, stateIcon = null } = itemData;
	const plugin = this;

	const item = document.createElement("li");
	const isSelected = selectedItems[id] ?? false;
	const button = createElementWithHtmlText(`
		<button class="menu-button-item${ isSelected ? " selected" : ""}" ${ariaLabel(title)} data-id="${id}">
			${ iconElement(icon) }
			${ showTitle ? titleElement(title) : "" }
			${ stateText || stateIcon ? stateElem(stateText, stateIcon) : ""}
		</button>
	`);
	button.addEventListener("click", async evt => {
		if (buttonType === "check") {
			const item = allItems.find(item => item.id === id);
			selectedItems[id] = !selectedItems[id];
			plugin.itemSelected(item, allItems);
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
			plugin.itemSelected(item, allItems);
		}

		await plugin.checkRefreshContent();
		evt.stopPropagation();
		
		if (plugin.closeOnSelect) {
			plugin.closeMenu();
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

	setSelected(id, value) {
		if (this._selectedItems) {
			this._selectedItems[id] = value;
		}
	}

	async getContent() {
		const content = createElementWithHtmlText(`<menu></menu>`);
		this._content = content;

		const menuItems = await this.getMenu();
		this._menuItems = menuItems;
		let firstItem = null;
		
		if (!this._selectedItems) {
			this._selectedItems = {};
			// The `selected` property of the menu items is used to set the initial state. Once initialized, the
			// selection value is managed by the plugin and the `selected` property is ignored.
			this._menuItems.forEach(itemData => {
				if (itemData.selected !== undefined && itemData.selected !== null) {
					this._selectedItems[itemData.id] = itemData.selected;
				}
			});
		}

		const menuName = self.crypto.randomUUID();
		const itemElems = menuItems.map(item => getMenuItem.apply(this, [item, this.buttonType(), content, menuItems, menuName, this._selectedItems]))
		firstItem = itemElems[0];
		
		setTimeout(() => {
			firstItem && firstItem.focus();
		}, 50);

		return content;
	}

	get menuTitle() {
		return this.config.menuTitle || null;
	}
	
	async getMenu() {
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
		return this._menuItems;
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
	
	itemSelected(itemData,menuItems) {
		this.player.log.warn(`MenuButtonPlugin (${ this.name }): itemSelected() function not implemented.`);
	}
	
	closeMenu() {
		this.player.playbackBar.popUp.hide();
	}

	async showPopUp() {
		// Refresh popup content to set focus on the first menu item
		this.refreshContent = true;
		await super.showPopUp();
	}
}
