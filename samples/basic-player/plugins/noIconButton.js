import ButtonPlugin from 'paella-core/core/ButtonPlugin.js';
import PaellaCorePlugins from 'paella-core/plugins/PaellaCorePlugins.js';

const PLAYBACK_RATES = [
    0.25,
    0.5,
    0.75,
    1,
    1.25,
    1.5,
    2
];
export default class NoIconButtonPlugin extends ButtonPlugin {
    getPluginModuleInstance() {
        return PaellaCorePlugins.Get();
    }

    get name() {
        return "es.upv.paella.noIconButton";
    }

    get dynamicWidth() { return false; }

    async load() {
        const pr = await this.player.videoContainer.playbackRate();
        this.title = `${pr}x`;
    }

    async action() {
        const pr = await this.player.videoContainer.playbackRate();
        const newPr = PLAYBACK_RATES.find(r => r > pr) || PLAYBACK_RATES[0];
        await this.player.videoContainer.setPlaybackRate(newPr);
        this.title = `${newPr}x`;
    }
}

