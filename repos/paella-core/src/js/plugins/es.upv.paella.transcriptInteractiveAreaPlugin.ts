import InteractiveAreaPlugin from '../core/InteractiveAreaPlugin';
import { createElementWithHtmlText } from '../core/dom';
import { bindEvent } from '../core/Events';
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
        this.player.videoCanvasArea?.refreshPanelContent();
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
        this.player.videoCanvasArea?.refreshPanelContent();
    }

    removeTranscription(params: number | { id: number }): void {
        const id = typeof params === 'number' ? params : params.id;
        this.#entries.delete(id);
        this.player.videoCanvasArea?.refreshPanelContent();
    }

    clearTranscriptions(): void {
        this.#entries.clear();
        this.player.videoCanvasArea?.refreshPanelContent();
    }

    async getContent(): Promise<HTMLElement> {
        const entries = this.sortedEntries;
        let html = '<div class="paella-transcript-container">';
        for (const entry of entries) {
            if (entry.state === 'error' || entry.state === 'warning' || entry.state === 'info') {
                html += `<div class="paella-transcript-error-block state-${entry.state}">${entry.text}</div>`;
            } else {
                html += `<span class="paella-transcript-entry state-${entry.state}">${entry.text}</span>`;
            }
        }
        html += '</div>';

        return createElementWithHtmlText(html);
    }
}
