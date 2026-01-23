import {
    PopUpButtonPlugin,
    createElementWithHtmlText,
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
    private _cueElements: HTMLElement[] = [];
    private _timeupdateEvent: ((evt: { currentTime: number }) => void) | null = null;

    getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.findCaptionsPlugin";
    }

    getAriaLabel() {
        return this.player.translate('Search in captions');
    }

    getDescription() {
        return this.getAriaLabel();
    }

    async getContent() {
        const placeholderText = this.player.translate("Search");
        const content = createElementWithHtmlText(`<div class="captions-search-container"></div>`);

        this._resultsContainer = createElementWithHtmlText('<div class="search-results"></div>', content);

        const searchContainer = createElementWithHtmlText(
            `<div class="search-input-container">
                <input type="search" placeholder="${placeholderText}"/>
            </div>`, content);
        const input = searchContainer.querySelector('input') as HTMLInputElement | null;
        if (!input || !this._resultsContainer) {
            return content;
        }
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

        const showAllCaptions = () => {
            let captions: Captions | null = null;
            this.captions?.some(lang => {
                if (isCurrentLanguage(lang.language)) {
                    captions = lang;
                }
            });
            if (!captions && this.captions && this.captions.length > 0) {
                captions = this.captions[0];
            }

            this._cueElements = [];
            captions && captions.cues.forEach(cue => {
                const cueElem: HTMLElement = createElementWithHtmlText(`<p class="result-item">${cue.startString}: ${cue.captions[0]}</p>`, this._resultsContainer);
                (cueElem as any)._cue = cue;
                cueElem.addEventListener('click', async (evt: MouseEvent) => {
                    const target = evt.target as any;
                    if (target._cue) {
                        const time = target._cue.start;
                        await this.player.videoContainer?.setCurrentTime(time);
                    }
                    evt.stopPropagation();
                });
                this._cueElements.push(cueElem);
            })
        }

        showAllCaptions();

        let searchTimer: ReturnType<typeof setTimeout> | null = null;
        input.addEventListener('keyup', (evt: KeyboardEvent) => {
            if (searchTimer) {
                clearTimeout(searchTimer);
            }
            if (!this._resultsContainer) return;

            this._resultsContainer.innerHTML = "";
            const currentLanguage = this.player.getLanguage();
            searchTimer = setTimeout(() => {
                const results: Record<string, { cue: CaptionCue; text: Record<string, string[]> }> = {};
                this.captions?.forEach(lang => {
                    lang.cues.forEach(cue => {
                        if (cue.captions.find(cap => (new RegExp(input.value,"i")).test(cap))) {
                            if (!cue.startString) {
                                return;
                            }
                            results[cue.startString] = results[cue.startString] || { cue, text: {} }
                            results[cue.startString].text[lang.language] = cue.captions;
                        }
                    })
                });
                
                this._cueElements = [];
                for (const timeString in results) {
                    const res = results[timeString];
                    const text = res.text[currentLanguage] || res.text[Object.keys(res.text)[0]];
                    const resultElem = createElementWithHtmlText(`<p class="result-item">${res.cue.startString}: ${text[0]}</p>`, this._resultsContainer);
                    (resultElem as any)._cue = res.cue;
                    resultElem.addEventListener('click', async (evt: MouseEvent) => {
                        const target = evt.target as any;
                        if (target._cue) {
                            const time = target._cue.start;
                            await this.player.videoContainer?.setCurrentTime(time);
                        }
                        evt.stopPropagation();
                    });
                    this._cueElements.push(resultElem);
                }
                if (Object.keys(results).length === 0 && input.value !== '') {
                    createElementWithHtmlText(`<p>${this.player.translate("No results found")}</p>`, this._resultsContainer);
                }
                else if (input.value === '') {
                    showAllCaptions();
                }
                searchTimer = null;
            }, 1000);
            
            evt.stopPropagation();
        });

        // If there is no text in search field, scroll to current caption on time update
        if (!this._timeupdateEvent) {
            this._timeupdateEvent = async (evt: { currentTime: number }) => {
                if (input.value === "" && this._cueElements?.length) {
                    const scrollTop = this._resultsContainer?.scrollTop || 0;
                    const clientHeight = this._resultsContainer?.clientHeight || 0;
                    this._cueElements.forEach(elem => {
                        if ((elem as any)._cue && (elem as any)._cue.start <= evt.currentTime && (elem as any)._cue.end >= evt.currentTime) {
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
