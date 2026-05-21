import { AudioProcessorPlugin, type PluginModule } from "@asicupv/paella-core";
import BasicPluginsModule from "./BasicPluginsModule";

export default class AudioEnhancementPlugin extends AudioProcessorPlugin {
    protected _enabled: boolean = false;

    protected _threshold: number = -24;
    protected _knee: number = 10;
    protected _ratio: number = 4;
    protected _attack: number = 0.005;
    protected _release: number = 0.1;

    protected _gainValue: number = 2.5;

    getPluginModuleInstance(): PluginModule | null {
        return BasicPluginsModule.Get();
    }

    get name() {
        return "es.upv.paella.audioEnhancement";
    }

    async getConnections(audioCtx: AudioContext) {
        const compressorNode = audioCtx.createDynamicsCompressor();
        compressorNode.threshold.value = this._threshold;
        compressorNode.knee.value = this._knee;
        compressorNode.ratio.value = this._ratio;
        compressorNode.attack.value = this._attack;
        compressorNode.release.value = this._release;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = this._gainValue;

        compressorNode.connect(gainNode);

        console.log("Audio boost is " + (this._enabled ? "enabled" :  "disabled"));

        return {
            input: compressorNode,
            output: gainNode,
            enabled: this._enabled
        };
    }

    async enable() {
        this._enabled = true;
        await this.reloadProcessor();
    }

    async disable() {
        this._enabled = false;
        await this.reloadProcessor();
    }
}
