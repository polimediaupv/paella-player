import TestPlayerPluginModule from "./TestPlayerPluginModule";
import { ButtonPlugin, Events } from "@asicupv/paella-core"



export default class CaptionsTranscriptContainerPlugin extends ButtonPlugin {
    private _cues: Record<number, { text: string, id: number }> = {};

    get name() {
        return "es.upv.paella.test.CaptionsTranscriptContainerPlugin";
    }

    getPluginModuleInstance(): TestPlayerPluginModule {
        return TestPlayerPluginModule.get();
    }

    async load() {
        const transcript = this.player.getPlugin("es.upv.paella.transcriptInteractiveAreaPlugin").interactiveArea;
        this.player.bindEvent(Events.TIMEUPDATE, (data: any) => {
            const captions = this.player.captions[0];
            if (!captions) {
                return;
            }

            const firstCaptions = this.player.captionsCanvas?.getCaptions({ lang: captions.lang });
            if (!firstCaptions) {
                return;
            }

            const currentTime: number = data.currentTime;
            const cue = firstCaptions.getCue(currentTime);
            if (!cue) {
                return;
            }

            const cueData = this._cues[cue.start];
            if (!cueData) {
                const id = transcript.addTranscription({ text: cue.captions.join(" "), state: "current" });
                this._cues[cue.start] = { text: cue.captions.join(" "), id };
            }
            else {
                if (!cueData.id) {
                    console.log("Susmuertos")
                }
                transcript.updateTranscription(cueData.id, { state: "current" });
            }
        });

        this.player.bindEvent(Events.SEEK, (data: any) => {
            console.log(data);
        });
    }

    async action(): Promise<void> {
        this.player?.videoCanvasArea?.showInteractiveAreaPlugin("es.upv.paella.transcriptInteractiveAreaPlugin");
    }
}
