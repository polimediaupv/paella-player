import { 
    createElementWithHtmlText,
    PopUpButtonPlugin,
    Events,
    bindEvent,
    utils,
    PopUpType,
    Frame
} from '@asicupv/paella-core';
import SlidePluginsModule from './SlidePluginsModule';

import { PhotoIcon as defaultPhotoIcon } from '../icons/photo.js';
import { ArrowLeftIcon as defaultArrowLeftIcon } from '../icons/arrow-left.js';
import { ArrowRightIcon as defaultArrowRightIcon } from '../icons/arrow-right.js';

// @ts-ignore
import '../css/frameControlButton.css';

export default class FrameControlButtonPlugin extends PopUpButtonPlugin {
    private _autoScrollPaused: boolean = false;
    private frames: Frame[] | null = null;
    private frameElements: HTMLElement[] | null = null;
    private _currentFrame: HTMLElement | null = null;

    getPluginModuleInstance() {
        return SlidePluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.frameControlButtonPlugin";
    }

    getAriaLabel() {
        return this.player.translate("Show slides");
    }

    getDescription() {
        return this.getAriaLabel();
    }

    get popUpType() : PopUpType { return "timeline"; }

    async isEnabled() : Promise<boolean> {
        const enabled = await super.isEnabled();
        this.frames = this.player.frameList?.frames;
        this.frames?.sort((a,b) => {
            return a.time - b.time;
        });
        return enabled && this.frames?.length ? true : false;
    }

    async action(event: Events) {
        await super.action(event);

        if (!this.player.videoContainer) return;

        const currentTime = await this.player.videoContainer.currentTime();
        let currentButton: HTMLElement | null = null;
        this.frameElements?.some(item => {
            currentButton = item;
            return (item as any).__data.time > currentTime;
        })
        if (currentButton) {
            (currentButton as HTMLElement).focus();
        }
    }

    async getContent() : Promise<HTMLElement> {
        if (!this.player.videoContainer) {
            throw new Error("Video container not available");
        }

        const arrowLeftIcon = this.player.getCustomPluginIcon(this.name, "arrowLeftIcon") || defaultArrowLeftIcon;
        const arrowRightIcon = this.player.getCustomPluginIcon(this.name, "arrowRightIcon") || defaultArrowRightIcon;

        const defaultContent = "presentation";
        const previewContent = this.player.frameList.targetContent || this.config.targetContent || defaultContent;
        const alternativeContent = this.config.targetContent || defaultContent;
        const content = createElementWithHtmlText('<div class="frame-control-plugin-container"></div>');
        
        const leftButton = createElementWithHtmlText(`<button class="btn-left"><i class="button-icon">${ arrowLeftIcon }</i></button>`,content);
        const imageContainer = createElementWithHtmlText('<div class="image-list"></div>',content);
        const rightButton = createElementWithHtmlText(`<button class="btn-right"><i class="button-icon">${ arrowRightIcon }</i></button>`,content);
        const { videoContainer } = this.player;
        const duration = await videoContainer.duration();

        // Add event listener to imageContainer to detect when the user scrolls
        let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
        imageContainer.addEventListener("scroll", async evt => {
            this._autoScrollPaused = true;
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                this._autoScrollPaused = false;
            }, 2000);
        });

        const start = videoContainer.isTrimEnabled ? videoContainer.trimStart : 0;
        const end = videoContainer.isTrimEnabled ? videoContainer.trimEnd : duration;

        const getTime = (t: number) => {
            t = this.player.videoContainer?.isTrimEnabled ? t - this.player.videoContainer.trimStart : t;
            return utils.secondsToTime(t < 0 ? 0 : t);
        }

        const handleEscKey = (evt: KeyboardEvent) => {
            if (evt.key === "Escape") {
                evt.preventDefault();
                evt.stopPropagation();
                this.hidePopUp();
                this.button.focus();
            }
        }

        if (!this.frames) {
            return document.createElement("div");
        }

        this.frameElements = this.frames?.filter((frameData,i) => {
                const nextFrame = this.frames![i + 1];
                return (nextFrame?.time>=start || frameData.time>=start) && frameData.time<=end;
            })
            .map(frameData => {
                const description = `${ this.player.translate(`go to`) } ${ getTime(frameData.time) }`;
                const frameElement = createElementWithHtmlText(`
                <button id="frame_${frameData.id}" aria-label="${ description }" title="${ description }"><img src="${ frameData.thumb }" alt="${ frameData.id }"/></button>
                `, imageContainer);
                (frameElement as any).__data = frameData;
                frameElement.addEventListener("click", async evt => {
                    const time = (evt.currentTarget as any).__data.time - start;
                    await this.player.videoContainer!.setCurrentTime(time>=0 ? time : 0);
                    evt.currentTarget && this.setSelected(evt.currentTarget as HTMLElement, this.frameElements);
                });
                frameElement.addEventListener("keydown", handleEscKey);
                frameElement.addEventListener("mouseover", async evt => {
                    if (this._currentFrame) {
                        this.player.videoContainer!.removeChild(this._currentFrame);
                    }
                    const preview = document.createElement("img");
                    preview.className = "frame-control-preview";
                    preview.src = frameData.url;
                    const rect = this.player.videoContainer!.getVideoRect(previewContent) ||
                        this.player.videoContainer!.getVideoRect(alternativeContent) ||
                        this.player.videoContainer!.getVideoRect(defaultContent) ||
                        this.player.videoContainer!.getVideoRect(0);
                    this._currentFrame = this.player.videoContainer!.appendChild(preview, rect);
                });
                frameElement.addEventListener("mouseout", async evt => {
                    if (this._currentFrame) {
                        this.player.videoContainer!.removeChild(this._currentFrame);
                        this._currentFrame = null;
                    }
                })
                return frameElement;
            });

        const displacement = () => this.frameElements && this.frameElements[0] ? this.frameElements[0].offsetWidth : 0;
        leftButton.addEventListener('click', () => {
            imageContainer.scrollLeft -= displacement();
        });

        rightButton.addEventListener('click', () => {
            imageContainer.scrollLeft += displacement();
        });

        // Accessibility: close popup with Escape key
        leftButton.addEventListener("keydown", handleEscKey);
        rightButton.addEventListener("keydown", handleEscKey);

        
        setTimeout(() => this.frameElements && this.frameElements[0] && this.frameElements[0].focus(), 50);
        
        return content;
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, "photoIcon") || defaultPhotoIcon;
        const timeOffset = 3;

        bindEvent(this.player, Events.TIMEUPDATE, async (params: any) => {
            const start = this.player.videoContainer!.isTrimEnabled ? this.player.videoContainer!.trimStart : 0;
            // this.frameElements is not available until the content popup has been opened.
            let currentElement = this.frameElements && this.frameElements[0];
            this.frameElements?.some(elem => {
                if ((elem as any).__data.time>Math.floor(params.currentTime + start + timeOffset)) {
                    return true;
                }
                currentElement = elem;
            });

            if (currentElement) {
                this.setSelected(currentElement, this.frameElements);
            }
        });

        bindEvent(this.player, Events.TRIMMING_CHANGED, (evt: any) => {
            this.refreshContent = true;
        });
    }

    async getHelp() {
        return {
            title: "Video slides",
            description: "Allows you to browse through the slides of the presentation associated with the video."
        }
    }

    private setSelected(item: HTMLElement, allItems: HTMLElement[] | null) {
        allItems?.forEach(e => e.classList.remove('selected'));
        item.classList.add('selected');

        if (this._autoScrollPaused) {
            return;
        }

        // Scroll parent to show the selected item
        const parent = item.parentElement;
        if (parent === null) {
            return;
        }
        const parentRect = parent.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        if (itemRect.left < parentRect.left) {
            parent.scrollLeft -= parentRect.left - itemRect.left;
        }
        else if (itemRect.right > parentRect.right) {
            parent.scrollLeft += itemRect.right - parentRect.right;
        }
    }
}
