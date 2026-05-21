import { ButtonPlugin, type ButtonPluginConfig } from "@asicupv/paella-core";
import BasicPluginsModule from "./BasicPluginsModule";

import {
    AudioEnhancementIcon,
    AudioEnhancementDisabledIcon
} from "../icons/audio-enhancement-icons.js";

type AudioEnhancementButtonPluginConfig = ButtonPluginConfig & {
    ariaLabelEnable?: string;
    ariaLabelDisable?: string;
    titleEnable?: string;
    titleDisable?: string;
}

export default class AudioEnhancementButtonPlugin extends ButtonPlugin<AudioEnhancementButtonPluginConfig> {
    #enhanced: boolean = false;

    getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.audioEnhancementButton";
    }

    getAriaLabel() {
        return "Toggle audio enhancement";
    }

    getDescription() {
        return this.getAriaLabel();
    }

    async load() {
        this.icon = AudioEnhancementDisabledIcon;
        this.#setTexts(false);
    }

    async action() {
        const result = this.player.getPlugin("es.upv.paella.audioEnhancement");
        const audioPlugin = result?.audioProcessor;
        if (!audioPlugin) {
            return;
        }

        if (this.#enhanced) {
            await audioPlugin.disable();
            this.#enhanced = false;
            this.icon = AudioEnhancementDisabledIcon;
            this.#setTexts(false);
        } else {
            await audioPlugin.enable();
            this.#enhanced = true;
            this.icon = AudioEnhancementIcon;
            this.#setTexts(true);
        }
    }

    async getHelp() {
        return {
            title: "Audio enhancement toggle",
            description: "Allows you to toggle audio enhancement (compression and gain) on and off."
        };
    }

    #setTexts(isEnhanced: boolean) {
        const ariaLabel = isEnhanced ?
            this.player.translate(this.config.ariaLabelDisable || "Disable audio enhancement") :
            this.player.translate(this.config.ariaLabelEnable || "Enable audio enhancement");
        const titleLabel = isEnhanced ?
            this.player.translate(this.config.titleDisable || "Disable audio enhancement") :
            this.player.translate(this.config.titleEnable || "Enable audio enhancement");
        const button = (this as { button: HTMLElement & { ariaLabel?: string } }).button;
        button.title = titleLabel;
        button.ariaLabel = ariaLabel;
    }
}
