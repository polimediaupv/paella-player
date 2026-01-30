import { Events, EventLogPlugin, createElementWithHtmlText, Frame } from '@asicupv/paella-core';

import { checkSlides, getFrames, nextSlide, previousSlide } from '../js/SlideNavigation';

import SlidePluginsModule from './SlidePluginsModule';
// @ts-ignore
import "../css/arrowSlidesNavigator.css";
import { ArrowLeftIcon as defaultArrowLeftIcon } from '../icons/arrow-left.js';
import { ArrowRightIcon as defaultArrowRightIcon } from '../icons/arrow-right.js';

export default class ArrowSlidesNavigatorPlugin extends EventLogPlugin {
    protected frames: Frame[] | null = null;
    
    getPluginModuleInstance() {
        return SlidePluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.arrowSlidesNavigator";
    }

    get events() {
        return [
            Events.PLAYER_LOADED
        ];
    }

    async onEvent(event: Events) {
        if (!this.player.videoContainer || !this.player.videoContainer.streamProvider.streams) return;
        const arrowLeftIcon = this.player.getCustomPluginIcon(this.name, "arrowLeftIcon") || defaultArrowLeftIcon;
        const arrowRightIcon = this.player.getCustomPluginIcon(this.name, "arrowRightIcon") || defaultArrowRightIcon;

        console.debug("Loading arrow slides navigation plugin");
        const targets = Array.isArray(this.config.target) ? this.config.target : [this.config.target];
        const streams = this.player.videoContainer.streamProvider.streams;
        const target = targets.find(t => {
            return streams[t as keyof typeof streams] !== null
        });

        const stream = streams[target as keyof typeof streams];
        this.frames = getFrames(this.player);

        if (stream && this.frames?.length) {
            const mainContainer = createElementWithHtmlText(`<div class="arrow-slides-navigator"></div>`, stream.canvas.userArea);
            const leftButton = createElementWithHtmlText(`
            <button class="button-prev" aria-label="${this.player.translate('Seek video to the previous slide')}"><i>${arrowLeftIcon}</i></button>
            `, mainContainer);
            leftButton.addEventListener("click", async evt => {
                evt.stopPropagation();
                await previousSlide(this.player);
            });

            const rightButton = createElementWithHtmlText(`
            <button class="button-next" aria-label="${this.player.translate('Seek video to the next slide')}"><i>${arrowRightIcon}</i></button>
            `, mainContainer);
            rightButton.addEventListener("click", async evt => {
                evt.stopPropagation();
                await nextSlide(this.player);
            });
        }
        else {
            console.warn("No matching stream content or frames found for arrow slides navigator plugin");
        }
    }
}