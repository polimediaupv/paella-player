import {
    PopUpButtonPlugin,
    createElement,
    bindEvent,
    Events,
    type Captions,
    type CaptionCue,
    type CaptionCanvas,
    PopUpType
} from "@asicupv/paella-core";

// @ts-ignore
import '../css/FindCaptionsPlugin.css';

import { BinocularsIcon as searchIcon } from '../icons/binoculars.js';
import BasicPluginsModule from './BasicPluginsModule';

export default class FindCaptionsPlugin extends PopUpButtonPlugin {
    private _captionsCanvas: CaptionCanvas | null = null;
    private _resultsContainer: HTMLElement | null = null;
    private _cueElements: (HTMLElement & { cue: CaptionCue })[] = [];
    private _searchInput: HTMLInputElement | null = null;
    private _timeupdateEvent: ((evt: { currentTime: number }) => void) | null = null;

    getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return "es.upv.paella.findCaptionsPlugin";
    }

    getAriaLabel() {
        return this.player.translate('Search in captions');
    }

    getDescription() {
        return this.getAriaLabel();
    }

    async getContent() {
        const placeholderText = this.player.translate("Search");
        const content = createElement({ attributes: { class: "captions-search-container" } });
        const resultsContainer = createElement({ attributes: { class: "search-results" }, parent: content });
        this._resultsContainer = resultsContainer;

        const searchContainer = createElement({ attributes: { class: "search-input-container" }, parent: content });
        const input = createElement({
            tag: "input",
            attributes: { type: "search", placeholder: placeholderText, "aria-label": placeholderText },
            parent: searchContainer
        }) as HTMLInputElement;
        this._searchInput = input;
        input.addEventListener('click', (evt: MouseEvent) => {
            evt.stopPropagation();
        });

        const browserLanguage = navigator.language.substring(0,2);
        const isCurrentLanguage = (lang: string) => {
            // If there are some captions enabled, compare with this language
            if (this.player.captionsCanvas?.currentCaptions) {
                return lang === this.player.captionsCanvas.currentCaptions.language;
            }

            // Otherwise, compare with the browser language
            return lang === browserLanguage;
        }

        const appendCue = (cue: CaptionCue, text: string) => {
            const element = Object.assign(createElement({
                tag: "p",
                attributes: { class: "result-item" },
                parent: resultsContainer
            }), { cue });
            element.textContent = `${cue.startString}: ${text}`;
            element.addEventListener("click", async (evt: MouseEvent) => {
                evt.stopPropagation();
                await this.player.videoContainer?.setCurrentTime(cue.start);
            });
            this._cueElements.push(element);
        };

        const showAllCaptions = () => {
            const tracks = this.captions;
            const captions = tracks?.find(track => isCurrentLanguage(track.language)) ?? tracks?.[0];

            this._cueElements = [];
            captions?.cues.forEach(cue => appendCue(cue, cue.captions[0]));
        }

        showAllCaptions();

        let searchTimer: ReturnType<typeof setTimeout> | null = null;
        input.addEventListener("keyup", evt => evt.stopPropagation());
        input.addEventListener("input", evt => {
            evt.stopPropagation();
            if (searchTimer) {
                clearTimeout(searchTimer);
            }

            searchTimer = setTimeout(() => {
                searchTimer = null;
                if (input !== this._searchInput) return;

                resultsContainer.replaceChildren();
                this._cueElements = [];
                const query = input.value.toLowerCase();
                if (!query) {
                    showAllCaptions();
                    return;
                }

                const results: Record<string, { cue: CaptionCue; text: Record<string, string[]> }> = {};
                this.captions?.forEach(lang => {
                    lang.cues.forEach(cue => {
                        if (cue.startString && cue.captions.some(cap => cap.toLowerCase().includes(query))) {
                            results[cue.startString] = results[cue.startString] || { cue, text: {} };
                            results[cue.startString].text[lang.language] = cue.captions;
                        }
                    });
                });

                const currentLanguage = this.player.getLanguage();
                for (const { cue, text } of Object.values(results)) {
                    appendCue(cue, (text[currentLanguage] || Object.values(text)[0])[0]);
                }
                if (this._cueElements.length === 0) {
                    const message = createElement({ tag: "p", parent: resultsContainer });
                    message.textContent = this.player.translate("No results found");
                }
            }, 1000);
        });

        // If there is no text in search field, scroll to current caption on time update
        if (!this._timeupdateEvent) {
            this._timeupdateEvent = async (evt: { currentTime: number }) => {
                if (this._searchInput?.value === "" && this._cueElements.length) {
                    const scrollTop = this._resultsContainer?.scrollTop || 0;
                    const clientHeight = this._resultsContainer?.clientHeight || 0;
                    this._cueElements.forEach(elem => {
                        if (elem.cue.start <= evt.currentTime && elem.cue.end >= evt.currentTime) {
                            elem.classList.add('current');
                            const elemPosTop = elem.offsetTop - scrollTop;
                            if (elemPosTop < 0 || elemPosTop > clientHeight) {
                                this._resultsContainer?.scrollTo({ top: elem.offsetTop - 20 });
                            }
                        }
                        else {
                            elem.classList.remove('current');
                        }
                    });
                }
            }
            this.player.bindEvent(Events.TIMEUPDATE, this._timeupdateEvent, true);
        }

        // Force reload content
        setTimeout(() => this.refreshContent = true, 10);
        return content;
    }

    get popUpType(): PopUpType {
        return "modal";
    }

    get captions(): Captions[] | null {
        return this.player.captionsCanvas?.captions || null;
    }

    get customPopUpClass(): string {
        return "find-captions";
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name,"findCaptionsIcon") || searchIcon;
        this._captionsCanvas = this.player.captionsCanvas || null;

        if (this.captions?.length === 0) {
            this.disable();
        }

        bindEvent(this.player, Events.CAPTIONS_CHANGED, () => {
            if (this.captions?.length && this.captions?.length > 0) {
                this.enable();
            }
        })
    }

    async getHelp() {
        return {
            title: "Find captions",
            description: "Allows you to search for specific captions within the video."
        };
    }
}
