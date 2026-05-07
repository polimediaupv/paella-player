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
        bindEvent(this.player, 'paella:addOrUpdateTranscription', (params: { id: number; text: string; state: TranscriptEntryState, newLine?: boolean }) => {
            this.addOrUpdateTranscription(params);
            this.refreshIfNeeded();
        });
        bindEvent(this.player, 'paella:addTranscription', (params: { id: number; text: string; state: TranscriptEntryState, newLine?: boolean }) => {
            this.addTranscription(params);
            this.refreshIfNeeded();
        });
        bindEvent(this.player, 'paella:updateTranscription', (params: { id: number; text?: string; state?: TranscriptEntryState }) => {
            this.updateTranscription(params);
            this.refreshIfNeeded();
        });
        bindEvent(this.player, 'paella:removeTranscription', (params: number | { id: number }) => {
            this.removeTranscription(params);
            this.refreshIfNeeded();
        });
        bindEvent(this.player, 'paella:clearTranscriptions', () => {
            this.clearTranscriptions();
            this.refreshIfNeeded();
        });
    }

    addTranscription(params: { id: number; text: string; state: TranscriptEntryState, newLine?: boolean }): void {
        if (params.id === undefined || params.text === undefined) {
            return;
        }
        this.#entries.set(params.id, {
            id: params.id,
            text: params.text + (params.newLine === true ? "<br/>" : ""),
            state: params.state ?? 'current'
        });
    }

    addOrUpdateTranscription(params: { id: number; text: string; state: TranscriptEntryState, newLine?: boolean }): void {
        const existing = this.#entries.get(params.id);
        if (existing) {
            existing.text = params.text + (params.newLine === true ? "<br/>" : "");
            if (params.state !== undefined) {
                existing.state = params.state;
            }
        } else {
            this.addTranscription(params);
        }
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
    }

    removeTranscription(params: number | { id: number }): void {
        const id = typeof params === 'number' ? params : params.id;
        this.#entries.delete(id);
    }

    clearTranscriptions(): void {
        this.#entries.clear();
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

    protected refreshIfNeeded(): void {
        this.player.videoCanvasArea?.refreshPanelContent();
    }
}
