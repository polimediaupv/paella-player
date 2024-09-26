import {
	PopUpButtonPlugin,
	createElementWithHtmlText
} from 'paella-core';
import BasicPluginsModule from './BasicPluginsModule';

import { KeyboardIcon as defaultKeyboardIcon } from '../icons/keyboard.js';
import '../css/KeyboardShortcutsHelp.css';

export default class KeyboardShortcutsHelpPlugin extends PopUpButtonPlugin {
	getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.keyboardShortcutsHelp";
    }

	async isEnabled() {
		const enabled = await super.isEnabled();
		return enabled && this.player.getShortcuts().length > 0;
	}

	async load() {
		this.icon = this.player.getCustomPluginIcon(this.name,"keyboardIcon") || defaultKeyboardIcon;
	}

	get popUpType() {
		return 'no-modal';
	}

	getKeyText(sc) {
		let key = this.player.translate(sc.keyCode);
		if (sc.keyModifiers.altKey) {
			key += " + Alt";
		}
		if (sc.keyModifiers.ctrlKey) {
			key += " + Ctrl";
		}
		if (sc.keyModifiers.shiftKey) {
			key += " + Shift";
		}
		return key;
	}

	get menuTitle() {
		return this.config.menuTitle || 'Keyboard shortcuts'
	}

	async getContent() {
		const content = createElementWithHtmlText(`
          <div class="keyboardshortcutshelp-plugin"></div>
        `);

		const descriptions = {};

		this.player.getShortcuts().forEach(sc => {
			const description = this.player.translate(sc.description);
			if (!descriptions[description]) {
				descriptions[description] = [sc];
			}
			else {
				descriptions[description].push(sc);
			}
		});

		for (const desc in descriptions) {
			const shortcuts = descriptions[desc];
			let keys = "";
			shortcuts.forEach(sc => {
				if (keys !== "") {
					keys += " / ";
				}
				keys += this.player.translate(this.getKeyText(sc));
			});

			const item = createElementWithHtmlText(`
			<div class="row">
				<div class="description"> ${desc} </div>
				<div class="key"> ${keys}</div>
            </div>
			`);
			content.appendChild(item);
		}


		return content;
	}
}
