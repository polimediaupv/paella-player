import { CanvasButtonPlugin } from "paella-core";
import { checkSlides, nextSlide } from "../js/SlideNavigation";
import SlidePluginsModule from "./SlidePluginsModule";

import { ArrowRightIcon as DefaultArrowRightIcon } from '../icons/arrow-right.js';


export default class NextSlideNavigatorButton extends CanvasButtonPlugin {
    getPluginModuleInstance() {
        return SlidePluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.nextSlideNavigatorButton";
    }

    getAriaLabel() {
        return this.getDescription();
    }

    getDescription() {
        return this.player.translate("Seek video to the next slide");
    }

    async isEnabled() {
        const enabled = await super.isEnabled();
        return enabled && checkSlides(this.player);
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, "arrowRightIcon") || DefaultArrowRightIcon;
    }

    async action() {
        await nextSlide(this.player);
    }
}