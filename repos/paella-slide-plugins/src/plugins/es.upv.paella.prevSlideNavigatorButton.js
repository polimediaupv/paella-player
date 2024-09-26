import { CanvasButtonPlugin } from "paella-core";
import { checkSlides, previousSlide } from "../js/SlideNavigation";
import SlidePluginsModule from "./SlidePluginsModule";

import { ArrowLeftIcon as DefaultArrowLeftIcon } from '../icons/arrow-left.js';

export default class PrevSlideNavigatorButton extends CanvasButtonPlugin {
    getPluginModuleInstance() {
        return SlidePluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.prevSlideNavigatorButton";
    }

    getAriaLabel() {
        return this.getDescription();
    }

    getDescription() {
        return this.player.translate("Seek video to the previous slide");
    }

    async isEnabled() {
        const enabled = await super.isEnabled();
        return enabled && checkSlides(this.player);
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, "arrowLeftIcon") || DefaultArrowLeftIcon;
    }

    async action() {
        await previousSlide(this.player);
    }
}