import { AudioProcessorPlugin, PluginModule } from "@asicupv/paella-core";
import TestPlayerPluginModule from "./TestPlayerPluginModule";

function generateImpulseResponse(audioCtx: AudioContext, duration: number) {
    const sampleRate = audioCtx.sampleRate;
    const length = sampleRate * duration;
    const impulse = audioCtx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2.5);
        left[i] = (Math.random() * 2 - 1) * decay;
        right[i] = (Math.random() * 2 - 1) * decay;
    }

    return impulse;
}

export default class ReverbPlugin extends AudioProcessorPlugin {
    private _enabled: boolean = true;

    getPluginModuleInstance(): PluginModule | null {
        return TestPlayerPluginModule.get();
    }
    
    get name() {
        return "es.upv.paella.test.ReverbPlugin";
    }

    async getConnections(audioCtx: AudioContext) {
        const reverbNode = audioCtx.createConvolver();
        const wetGain = audioCtx.createGain();

        reverbNode.buffer = generateImpulseResponse(audioCtx, 2.0);
        wetGain.gain.value = 1.0;

        reverbNode.connect(wetGain);

        return {
            input: reverbNode,
            output: wetGain,
            enabled: this._enabled
        }
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
