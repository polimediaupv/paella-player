import InteractiveAreaPlugin from '../core/InteractiveAreaPlugin';
import { createElement, createElementWithHtmlText } from '../core/dom';
import Events from '../core/Events';
import type { InteractiveAreaPluginConfig } from '../core/Config';


export interface TranscriptPluginConfig extends InteractiveAreaPluginConfig {
    // No specific config needed beyond base
}

export type TranscriptEntryState = "past" | "current" | "live"
 | "future" | "error" | "warning" | "info";

export interface TranscriptEntry {
    id: number;
    text: string;
    state: TranscriptEntryState;
}

class TranscriptDomItem {
    _domElement: HTMLElement;
    _item: TranscriptEntry;

    get domElement() {
        return this._domElement;
    }
    
    get item() {
        return this._item;
    }

    constructor(item: TranscriptEntry) {
        this._item = item;

        if (!item.id) {
            console.warn("WARN: invalid transcription item ID");
        }

        this._domElement = createElementWithHtmlText(`
            <div class="paella-transcript-entry state-${item.state} transcript-item-${item.id}">
                ${item.text}
            </div>
        `);
    }

    update({ text, state }: { text?: string; state?: TranscriptEntryState }) {
        if (text !== undefined) {
            this._item.text = text;
            this._domElement.innerHTML = text;
        }
        if (state !== undefined) {
            this._item.state = state;
            this._domElement.className = `paella-transcript-entry state-${state} transcript-item-${this.item.id}`;
        }
    }
}

export default class TranscriptPlugin extends InteractiveAreaPlugin<TranscriptPluginConfig> {
    #contentElement: HTMLElement | null = null;
    #transcriptItems: TranscriptDomItem[] = [];
    #pastTreshold: number = 8; // seconds
    #discontinuityTreshold: number = 20; // seconds

    get name() {
        return 'es.upv.paella.transcriptInteractiveAreaPlugin';
    }

    getPluginModuleInstance() {
        return null;
    }

    async isEnabled(): Promise<boolean> {
        const enabled = await super.isEnabled();
        return enabled;
    }

    protected async genId(): Promise<number> {
        return Math.round(await this.player.currentTime() || 0);
    }

    protected findTranscriptItem(id: number) : TranscriptDomItem | null {
        return this.#transcriptItems.find(item => item.item.id === id) || null;
    }

    protected async getTranscriptItem(id: number) : Promise<TranscriptDomItem> {
        const item = this.findTranscriptItem(id);
        if (!item) {
            const newItem = new TranscriptDomItem({ id, text: '', state: 'current' });
            this.#transcriptItems.push(newItem);
            this.#transcriptItems.sort((a, b) => a.item.id - b.item.id);
            return newItem;
        }
        return item;
    }

    protected async getCurrentTranscriptItem() : Promise<TranscriptDomItem | null> {
        const currentTime = await this.player.currentTime() || 0;
        let currentItem: TranscriptDomItem | null = null;
        this.#transcriptItems.some(item => {
            if (item.item.id > currentTime) {
                return true;
            }
            currentItem = item;
            return false;
        }) 
        return currentItem;
    }

    async load() {
        this.#contentElement = createElementWithHtmlText(`
            <div class="paella-transcript-container paella-interactive-area-content">
            </div>
        `);

        this.player.bindEvent(Events.TIMEUPDATE, async (data: any) => {

            this.#transcriptItems.forEach(item => {
                const entryTime = item.item.id;
                if (entryTime < data.currentTime - this.#pastTreshold) {
                    if (item.item.state !== 'past') {
                        item.update({ state: 'past' });
                    }
                } else if (entryTime <= data.currentTime) {
                    if (item.item.state !== 'current' && item.item.state !== 'live') {
                        item.update({ state: 'current' });
                    }
                } else {
                    if (item.item.state !== 'future') {
                        item.update({ state: 'future' });
                    }
                }
            })
            await this.updateContent();
        });
    }

    async addTranscription({ text, state }: { text: string; state: TranscriptEntryState }): Promise<number> {
        if (text.trim() === "") {
            return -1;
        }

        const id = Math.round(await this.player.currentTime() || 0);
        const item = await this.getTranscriptItem(id);
        item.update({ text, state });
        this.updateContent();
        return id;
    }

    async updateTranscription({ id, text, state }: { id: number; text?: string; state?: TranscriptEntryState }): Promise<void> {
        if (id === undefined || id === null) {
            return;
        }

        const item = await this.getTranscriptItem(id);
        if (!item) {
            return;
        }
        item.update({ text, state });
        this.updateContent();
    }

    removeTranscription(params: number | { id: number }): void {
        const id = typeof params === 'number' ? params : params.id;
        const item = this.findTranscriptItem(id);
        if (item) {
            item.domElement.remove();
            this.#transcriptItems = this.#transcriptItems.filter(item => item.item.id !== id);
            this.updateContent();
        }
    }

    clearTranscriptions(): void {
        this.#transcriptItems = [];

        if (!this.#contentElement) {
            return;
        }

        this.#contentElement.innerHTML = "";
        this.updateContent();
    }

    async getContent(): Promise<HTMLElement> {
        const container = this.#contentElement!;
        this.scrollToCurrent();
        return container;
    }

    async updateContent(): Promise<void> {
        this.removeDiscontinuities();

        const minDiscontinuityTime = this.#discontinuityTreshold;
        const content = this.#contentElement;

        if (!content) {
            return;
        }

        for (let i = 0; i < this.#transcriptItems.length; i++) {
            const item = this.#transcriptItems[i];
            const itemElem = item.domElement;

            let nextElem: HTMLElement | null = null;

            for (let j = i + 1; j < this.#transcriptItems.length; j++) {
                const candidate = this.#transcriptItems[j].domElement;

                if (candidate.parentElement === content) {
                    nextElem = candidate;
                    break;
                }
            }

            if (nextElem) {
                if (itemElem.nextElementSibling !== nextElem) {
                    content.insertBefore(itemElem, nextElem);
                }
            }
            else {
                if (content.lastElementChild !== itemElem) {
                    content.appendChild(itemElem);
                }
            }

            const nextItem = this.#transcriptItems[i + 1];

            if (nextItem) {
                const currentTime = Number(item.item.id);
                const nextTime = Number(nextItem.item.id);

                if (nextTime - currentTime >= minDiscontinuityTime) {
                    const discontinuity = this.createDiscontinuity();

                    if (itemElem.nextElementSibling) {
                        content.insertBefore(discontinuity, itemElem.nextElementSibling);
                    }
                    else {
                        content.appendChild(discontinuity);
                    }
                }
            }
        }

        await this.scrollToCurrent();
    }

    async scrollToCurrent() {
        const item = await this.getCurrentTranscriptItem();
        if (item) {
            item.domElement.scrollIntoView({
                block: "nearest",
                inline: "nearest",
                behavior: "smooth"
            });
        }
    }

    protected createDiscontinuity() {
        return createElementWithHtmlText(`
            <div class="discontinuity">...</div>`);
    }

    protected removeDiscontinuities() {
        this.#contentElement?.querySelectorAll(".discontinuity").forEach(elem => {
            elem.remove();
        })
    }

    protected findPreviousTranscriptItem(
        currentTime: number
    ) {
        return this.#transcriptItems.findLast(item => item.item.id < currentTime);
    }

    protected findNextTranscriptItem(
        currentTime: number
    ) {
        return this.#transcriptItems.find(item => item.item.id > currentTime);
    }
}
