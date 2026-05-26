import PackagePluginModule from '../PackagePluginModule';
import ButtonIcon from "../../icons/audio-lines.svg?raw";
import { PreactButtonPlugin, type PreactButtonPluginConfig } from '../PreactButtonPlugin/PreactButtonPlugin';
import type { ComponentChildren } from 'preact';
import type { RealTimeCaptions } from './RealTimeCaptions';

import { MainAppContent } from './ui/MainAppContent';
import { VoxtralRealTimeCaptions } from './VoxtralRealTimeCaptions';




export default class RealTimeCaptionsPlugin extends PreactButtonPlugin<PreactButtonPluginConfig> {

    _rtcTranscriber: RealTimeCaptions | null = null;

    getPluginModuleInstance() {
        return PackagePluginModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.ai.realTimeCaptions";
    }


    getAriaLabel() {
        return this.player.translate('AI Real-Time Captions');
    }

    getDescription() {
        return this.getAriaLabel();
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, "button") || ButtonIcon;
        // const {VoxtralRealTimeCaptions} = await import('./VoxtralRealTimeCaptions');
        this._rtcTranscriber = new VoxtralRealTimeCaptions(this.player);

    }

    async getHelp() {
        return {
            title: "AI Real-Time Captions",
            description: "This plugin transcribes the video in real time using an artificial intelligence model that runs in the browser.",
        };
    }

    async isEnabled(): Promise<boolean> {
        if (!(await super.isEnabled())) {
            return false;
        }

        return true;
    }

    async getReactNode(): Promise<ComponentChildren> {
        return (<MainAppContent />);
    }    

    getMainAudioPlayerElement(): HTMLVideoElement | null {
        const mainAudioPlayer = this.player.videoContainer?.streamProvider.mainAudioPlayer;

        const element = (mainAudioPlayer as any)?.video || null;

        if (element instanceof HTMLVideoElement) {
            return element;
        }

        return null;
    }

}


