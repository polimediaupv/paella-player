import ButtonPlugin from '../core/ButtonPlugin';
import PaellaCorePlugins from './PaellaCorePlugins';
import { secondsToTime } from '../core/utils';
import Events from '../core/Events';

export default class CurrentTimeLabelPlugin extends ButtonPlugin {
    getPluginModuleInstance() {
        return PaellaCorePlugins.Get();
    }

    get name() {
        return 'es.upv.paella.currentTimeLabel';
    }

    async load() {
        this.title = secondsToTime(0);

        const updateTitle = async () => {
            const currentTime = await this.player.videoContainer?.currentTime() ?? 0;
            let newTitle = secondsToTime(currentTime);

            const cfg = (this.config as any) ?? {};
            const sizeRestriction = (this.player.videoContainer?.elementSize?.w || Number.MAX_SAFE_INTEGER) < (cfg.totalTimeMinContainerSize || 0);
            if (cfg.showTotalTime && !sizeRestriction) {
                const duration = await this.player.videoContainer?.duration() ?? 0;
                newTitle += ` / ${secondsToTime(duration)}`;
            }

            this.title = newTitle;
        };

        this.player.bindEvent(Events.TIMEUPDATE, () => updateTitle());
        this.player.bindEvent(Events.TRIMMING_CHANGED, () => updateTitle());
        this.player.bindEvent(Events.SEEK, () => updateTitle());
    }

    get interactive() {
        return false;
    }

    get dynamicWidth() {
        return true;
    }
}
