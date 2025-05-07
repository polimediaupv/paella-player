import {
    PopUpButtonPlugin,
    createElementWithHtmlText,
    PaellaCorePlugins
} from "@asicupv/paella-core";
import myPluginIcon from "./icons/my-plugin-icon.js";

export default class MyPopUpPlugin extends PopUpButtonPlugin {
    getPluginModuleInstance() {
        return PaellaCorePlugins.Get();
    }

    get name() {
		return super.name || "es.upv.paella.testPopUp";
	}

    async getContent() {
        const content = createElementWithHtmlText(`<div class="my-popup-content">Hello, this is a pop-up!</div>`);
        return content;
    }

    get popUpType() {
        return "modal";
    }

    async load() {
        this.icon = myPluginIcon;
    }

}
