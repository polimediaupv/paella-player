import { AudioProcessorPlugin, PluginModule } from "@asicupv/paella-core";
import TestPlayerPluginModule from "./TestPlayerPluginModule";


export default class DelayPlugin extends AudioProcessorPlugin {
    getPluginModuleInstance(): PluginModule | null {
        return TestPlayerPluginModule.get();
    }
    
    get name() {
        return "es.upv.paella.test.DelayPlugin";
    }

    async getConnections(audioCtx: AudioContext) {
        const delayNode = audioCtx.createDelay(0.5);
        const delayFeedback = audioCtx.createGain();
        const dryGain = audioCtx.createGain();
        
        delayNode.delayTime.value = 0.3;
        delayFeedback.gain.value = 0.25;
        dryGain.gain.value = 1.0;

        delayNode.connect(dryGain);
        delayNode.connect(delayFeedback);
        delayFeedback.connect(delayNode);

        return {
            input: delayNode,
            output: dryGain
        }
    }
}
