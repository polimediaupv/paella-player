import { DataPlugin, type DataPluginConfig } from '@asicupv/paella-core';
import type { Captions } from '@asicupv/paella-core';
import PackagePluginModule from '../PackagePluginModule';


export type AIAgentChatContentData = string | null;

export interface AIAgentChatDataTestPluginConfig extends DataPluginConfig {    
};


export class AIAgentChatDataBasePlugin<C extends DataPluginConfig> extends DataPlugin<C, AIAgentChatContentData> {
    async read(_context: string, key: string): Promise<AIAgentChatContentData> {     
        return null;
    }
}



export class AIAgentChatDataPlugin extends AIAgentChatDataBasePlugin<AIAgentChatDataTestPluginConfig> {
    getPluginModuleInstance() {
        return PackagePluginModule.Get();
    }

    get name() {
        return "es.upv.paella.ai.agentchat.data";
    }

    /**
     * Select the best caption track based on language priority:
     * 1. Player's current language
     * 2. English (as common fallback)
     * 3. First available track
     */
    private selectCaptionsLanguage(): Captions | null {
        const available = this.player.captionsCanvas?.captions ?? [];
        if (available.length === 0) {
            this.player.log.warn(`${this.name}: No caption tracks available.`);
            return null;
        }

        // 1. Try player's current language
        const playerLang = this.player.getLanguage();
        const byPlayerLang = available.find(c => c.language === playerLang);
        if (byPlayerLang) {
            this.player.log.info(`${this.name}: Using captions in player language "${playerLang}".`);
            return byPlayerLang;
        }

        // 2. Fallback to English
        const english = available.find(c => c.language === "en");
        if (english) {
            this.player.log.info(`${this.name}: Using English captions (player language "${playerLang}" not available).`);
            return english;
        }

        // 3. Use first available
        const fallback = available[0];
        this.player.log.info(`${this.name}: Using fallback captions "${fallback.label}" (${fallback.language}).`);
        return fallback;
    }

    /**
     * Convert seconds to VTT timestamp format (HH:MM:SS.mmm)
     */
    private secondsToVTTTime(seconds: number): string {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const ms = Math.round((seconds % 1) * 1000);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
    }

    /**
     * Reconstruct VTT text from parsed CaptionCue array
     */
    private captionsToVTT(captions: Captions): string {
        let vtt = "WEBVTT\n\n";
        captions.cues.forEach(cue => {
            const start = this.secondsToVTTTime(cue.start);
            const end = this.secondsToVTTTime(cue.end);
            const text = cue.captions.join("\n");
            vtt += `${start} --> ${end}\n${text}\n\n`;
        });
        return vtt;
    }

    async read(_context: string, key: string): Promise<AIAgentChatContentData> {
        console.log("Read")
        const selected = this.selectCaptionsLanguage();
        console.log (`Read lang: ${selected}`)
        if (!selected) {
            return null;
        }
        console.log("jaja");
        return this.captionsToVTT(selected);
    }
}
