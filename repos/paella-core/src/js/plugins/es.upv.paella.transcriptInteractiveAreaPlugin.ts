import InteractiveAreaPlugin from '../core/InteractiveAreaPlugin';
import { createElementWithHtmlText } from '../core/dom';
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
    #pastTreshold: number = 8; // seconds
    #discontinuityTreshold: number = 30; // Time in seconds to consider a discontinuity in the transcript entries (e.g., due to seeking)

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
        this.updateContent();
    }

    removeTranscription(params: number | { id: number }): void {
        const id = typeof params === 'number' ? params : params.id;
        this.#entries.delete(id);
        this.updateContent();
    }

    clearTranscriptions(): void {
        this.#entries.clear();
        this.updateContent();
    }

    async getContent(): Promise<HTMLElement> {
        const entries = this.sortedEntries;
        let html = '<div class="paella-transcript-container">';
        let lastTime = -1;
        for (const entry of entries) {
            if (lastTime < 0) {
                lastTime = entry.id;
            }
            
            if (entry.id - lastTime > this.#discontinuityTreshold) {
                html += `<div class="paella-transcript-discontinuity">...</div>`;
                lastTime = entry.id;
            }

            if (entry.state === 'error' || entry.state === 'warning' || entry.state === 'info') {
                html += `<div class="paella-transcript-error-block state-${entry.state}">${entry.text}</div>`;
            } else {
                html += `<span class="paella-transcript-entry state-${entry.state}">${entry.text}</span>`;
            }
        }
        html += '</div>';

        setTimeout(() => this.scrollToCurrent(), 100);

        return createElementWithHtmlText(html);
    }

    scrollToCurrent() {
        const currentEntry = this.player.videoCanvasArea?.element.querySelector('.paella-transcript-entry.state-current');
        if (currentEntry) {
            currentEntry.scrollIntoView({ block: 'center' });
        }
    }

    updateContent() {
        if (this.player.videoCanvasArea?.currentPluginName === this.name) {
            this.player.videoCanvasArea?.refreshPanelContent();
        }
    }
}
