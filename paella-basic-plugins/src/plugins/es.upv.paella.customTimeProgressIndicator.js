import { ButtonPlugin, Events, utils } from "paella-core";
import BasicPluginsModule from "./BasicPluginsModule";

export default class CustomTimeProgressIndicator extends ButtonPlugin {
    getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.customTimeProgressIndicator";
    }

    async isEnabled() {
        const e = await super.isEnabled();

        return e && (this.player.videoManifest.metadata?.visibleTimeLine ?? true);
    }

    async load() {
        const totalDuration = await this.player.videoContainer.duration();
        const showTotal = this.config.showTotal === undefined ? true : this.config.showTotal;
        const updateTime = (time) => {
            const current = utils.secondsToTime(time);
            this.title = showTotal ? `${current} / ${utils.secondsToTime(totalDuration)}` : current;
        }
        
        updateTime(0);
        this.player.bindEvent(Events.TIMEUPDATE, ({currentTime}) => {
            updateTime(currentTime);
        })
    }

    get interactive() {
        return false;
    }

    get dynamicWidth() {
        return true;
    }

    get titleSize() {
        return this.config.textSize || "medium";
    }
}