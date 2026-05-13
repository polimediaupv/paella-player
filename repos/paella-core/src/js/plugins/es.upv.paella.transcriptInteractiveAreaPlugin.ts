import InteractiveAreaPlugin from '../core/InteractiveAreaPlugin';
import { createElement, createElementWithHtmlText } from '../core/dom';
import Events from '../core/Events';
import type { InteractiveAreaPluginConfig } from '../core/Config';

export type TranscriptEntryState = "past" | "current" | "live"
 | "future" | "error" | "warning" | "info";

export interface TranscriptEntry {
    id: number;
    text: string;
    state: TranscriptEntryState;
}

export interface TranscriptPluginConfig extends InteractiveAreaPluginConfig {
    // No specific config needed beyond base
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

        this._domElement = createElementWithHtmlText(`
            <div class="paella-transcript-entry state-${item.state}">
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
            this._domElement.className = `paella-transcript-entry state-${state}`;
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

    protected async getTranscriptItem(id: number) : Promise<TranscriptDomItem> {
        const item = this.#transcriptItems.find(item => item.item.id === id);
        if (!item) {
            const newItem = new TranscriptDomItem({ id, text: '', state: 'current' });
            this.#transcriptItems.push(newItem);
            this.#transcriptItems.sort((a, b) => a.item.id - b.item.id);
            return newItem;
        }
        return item;
    }

    async load() {
        this.#contentElement = createElementWithHtmlText(`
            <div class="paella-transcript-container paella-interactive-area-content">
            </div>
        `);

        this.player.bindEvent(Events.TIMEUPDATE, (data: any) => {
            // Array.from(this.#entries.entries()).forEach(([id, entry]) => {
            //     const entryTime = Number(id);
            //     if (entryTime < data.currentTime - this.#pastTreshold) {
            //         if (entry.state !== 'past') {
            //             entry.state = 'past';
            //         }
            //     } else if (entryTime <= data.currentTime) {
            //         if (entry.state !== 'current' && entry.state !== 'live') {
            //             entry.state = 'current';
            //         }
            //     } else {
            //         if (entry.state !== 'future') {
            //             entry.state = 'future';
            //         }
            //     }
            // });
            this.updateContent();
        });
    }

    async addTranscription({ text, state }: { text: string; state: TranscriptEntryState }): Promise<number> {
        const id = Math.round(await this.player.currentTime() || 0);
        const item = await this.getTranscriptItem(id);
        item.update({ text, state });
        this.updateContent();
        return id;
    }

    async updateTranscription({ id, text, state }: { id: number; text?: string; state?: TranscriptEntryState }): Promise<void> {
        const item = await this.getTranscriptItem(id);
        if (!item) {
            return;
        }
        item.update({ text, state });
        this.updateContent();
    }

    removeTranscription(params: number | { id: number }): void {
        // const id = typeof params === 'number' ? params : params.id;
        // this.#entries.delete(id);
        // this.#domMap.delete(id);
        // this.updateContent();
    }

    clearTranscriptions(): void {
        // this.#entries.clear();
        // this.#domMap.clear();
        // this.#domCache?.container?.remove();
        // this.#domCache = null;
        // this.#initialized = false;
        // this.updateContent();
    }

    async getContent(): Promise<HTMLElement> {
        const container = this.#contentElement!;
        this.scrollToCurrent();
        return container;
    }

    updateContent(): void {
        if (!this.#contentElement) {
            return;
        }
        this.#transcriptItems.forEach(item => {
            if (Array.from(this.#contentElement?.children || []).find(child => child === item.domElement) === undefined) {
                console.log("Adding item to DOM", item.item);
                this.#contentElement!.appendChild(item.domElement);
            }
        });
        this.scrollToCurrent();
    }

    scrollToCurrent() {
        // TODO: Implement this
    }
}
