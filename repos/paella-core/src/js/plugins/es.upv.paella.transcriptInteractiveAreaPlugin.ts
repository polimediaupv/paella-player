import InteractiveAreaPlugin from '../core/InteractiveAreaPlugin';
import { createElement } from '../core/dom';
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

export default class TranscriptPlugin extends InteractiveAreaPlugin<TranscriptPluginConfig> {
    #entries = new Map<number, TranscriptEntry>();
    #domMap = new Map<number, HTMLElement>();
    #domCache: { container: HTMLElement } | null = null;
    #initialized = false;
    #pastTreshold: number = 8; // seconds

    private createEntryElement(entry: TranscriptEntry): HTMLElement {
        return createElement({ tag: 'span', attributes: { class: `paella-transcript-entry state-${entry.state}` }, parent: null });
    }

    get name() {
        return 'es.upv.paella.transcriptInteractiveAreaPlugin';
    }

    getPluginModuleInstance() {
        return null;
    }

    get sortedEntries(): TranscriptEntry[] {
        return Array.from(this.#entries.values()).sort((a, b) => a.id - b.id);
    }

    async isEnabled(): Promise<boolean> {
        const enabled = await super.isEnabled();
        return enabled;
    }

    async load() {
        this.player.bindEvent(Events.TIMEUPDATE, (data: any) => {
            Array.from(this.#entries.entries()).forEach(([id, entry]) => {
                const entryTime = Number(id);
                if (entryTime < data.currentTime - this.#pastTreshold) {
                    if (entry.state !== 'past') {
                        entry.state = 'past';
                    }
                } else if (entryTime <= data.currentTime) {
                    if (entry.state !== 'current' && entry.state !== 'live') {
                        entry.state = 'current';
                    }
                } else {
                    if (entry.state !== 'future') {
                        entry.state = 'future';
                    }
                }
            });
            this.updateContent();
        });
    }

    async addTranscription(params: { text: string; state: TranscriptEntryState, newLine?: boolean }): Promise<number> {
        const id = Math.round(await this.player.currentTime() || 0);
        if (this.#entries.has(id)) {
            this.updateTranscription({ id, text: params.text, state: params.state });
            return id;
        }

        this.#entries.set(id, {
            id,
            text: params.text + (params.newLine === true ? "<br/>" : ""),
            state: params.state ?? 'current'
        });
        this.updateContent();
        return id;
    }

    updateTranscription(params: { id: number; text?: string; state?: TranscriptEntryState }): void {
        const entry = this.#entries.get(params.id);
        if (!entry) {
            return;
        }
        if (params.text !== undefined) {
            entry.text = params.text;
        }
        if (params.state !== undefined) {
            entry.state = params.state;
        }
        if (this.#initialized) {
            this.updateContent();
        }
    }

    removeTranscription(params: number | { id: number }): void {
        const id = typeof params === 'number' ? params : params.id;
        this.#entries.delete(id);
        this.#domMap.delete(id);
        this.updateContent();
    }

    clearTranscriptions(): void {
        this.#entries.clear();
        this.#domMap.clear();
        this.#domCache?.container?.remove();
        this.#domCache = null;
        this.#initialized = false;
        this.updateContent();
    }

    async getContent(): Promise<HTMLElement> {
        if (!this.#initialized) {
            this.#domCache = { container: createElement({ tag: 'div', attributes: { class: 'paella-transcript-container paella-interactive-area-content' } }) };
            this.#domMap.clear();
            this.#initialized = true;
        }
        
        this.syncContent();
        this.scrollToCurrent();
        return this.#domCache!.container;
    }

    private syncContent(): void {
        const container = this.#domCache?.container;
        if (!container) return;

        const entries = this.sortedEntries;
        const keys = new Set<number>();
        for (const entry of entries) keys.add(entry.id);

        // Phase 1: reconcile DOM with entries (insert/update/move/remove existing nodes)
        let child = container.firstChild;
        let expectedIndex = 0;
        while (expectedIndex < entries.length && child) {
            if (!(child instanceof HTMLElement) || child.getAttribute('data-entry-id') == null) {
                child = child.nextSibling;
                continue;
            }
            const expectedKey = entries[expectedIndex].id;
            const entryId = Number(child.getAttribute('data-entry-id'));
            if (entryId === expectedKey) {
                this.updateEntryDOM(child as HTMLElement, entries[expectedIndex]);
                expectedIndex++;
                child = child.nextSibling;
            } else {
                const expectedEl = this.#domMap.get(expectedKey);
                if (expectedEl) {
                    this.updateEntryDOM(expectedEl, entries[expectedIndex]);
                    if (child) { child.before(expectedEl); } else { container.appendChild(expectedEl); }
                    expectedIndex++;
                    child = child.nextSibling;
                } else {
                    const newEl = this.createEntryElement(entries[expectedIndex]);
                    newEl.setAttribute('data-entry-id', String(expectedKey));
                    newEl.innerHTML = entries[expectedIndex].text;
                    this.#domMap.set(expectedKey, newEl);
                    if (child) { child.before(newEl); } else { container.appendChild(newEl); }
                    expectedIndex++;
                    child = child.nextSibling;
                }
            }
        }

        // Phase 2: if child is null but there are still entries to add, append all remaining
        if (expectedIndex < entries.length) {
            while (expectedIndex < entries.length) {
                const entry = entries[expectedIndex];
                const newEl = this.createEntryElement(entry);
                newEl.setAttribute('data-entry-id', String(entry.id));
                newEl.innerHTML = entry.text;
                this.#domMap.set(entry.id, newEl);
                container.appendChild(newEl);
                expectedIndex++;
            }
        }

        // Phase 3: remove orphaned entries (deleted from data but still in DOM)
        child = container.firstChild;
        while (child) {
            const next = child.nextSibling;
            if (child instanceof HTMLElement && child.getAttribute('data-entry-id') != null) {
                const entryId = Number(child.getAttribute('data-entry-id'));
                if (!keys.has(entryId)) {
                    child.remove();
                }
            }
            child = next;
        }
    }

    private updateEntryDOM(el: HTMLElement, entry: TranscriptEntry): void {
        el.classList.remove('state-past', 'state-current', 'state-live', 'state-future', 'state-error', 'state-warning', 'state-info');
        el.classList.add(`state-${entry.state}`);
        el.innerHTML = entry.text;
    }

    private scrollToCurrent(): void {
        const currentEntry = this.#domCache?.container.querySelector('.paella-transcript-entry.state-current');
        if (currentEntry) {
            currentEntry.scrollIntoView({ block: 'center' });
        }
    }

    updateContent(): void {
        if (this.#initialized && this.player.videoCanvasArea?.currentPluginName === this.name) {
            this.syncContent();
            this.scrollToCurrent();
        }
    }
}
