import { MenuButtonPlugin } from "@asicupv/paella-core";
import BasicPluginsModule from './BasicPluginsModule';

import { ScreenIcon as screenIcon } from '../icons/screen.js';

export default class AudioSelectorPlugin extends MenuButtonPlugin {
    getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.audioSelector";
    }

    getAriaLabel() {
        return "Select the active audio track";
    }

    getDescription() {
        return this.getAriaLabel();
    }

    get dynamicWidth() {
        return this.config.showIcon === false;
    }

    get titleSize() { return this.config.showIcon === false ? "large" : "small"; }

    async isEnabled() {
        if (!(await super.isEnabled())) {
            return false;
        }

        const audioTracks = await this.player.videoContainer.streamProvider.getAudioTracks();
        return audioTracks?.length > 1;
    }

    async load() {
        if (this.config.showIcon === false) {

        }
        else {
            this.icon = this.player.getCustomPluginIcon(this.name,"screenIcon") || screenIcon;
        }

        this._audioTracks = await this.player.videoContainer.streamProvider.getAudioTracks();

        await this.updateAudioLabel();
    }

    async getMenu() {
        const current = this.player.videoContainer.streamProvider.currentAudioTrack;
        const result = this._audioTracks.map(track => {
            return {
                id: track.id,
                title: this.player.translate(track.name) || this.player.translate(track.language),
                data: track,
                selected: track === current
            }
        });
        return result;
    }

    async updateAudioLabel() {
        const track = this.player.videoContainer.streamProvider.currentAudioTrack;
        this.title = track.language;
    }

    async itemSelected(itemData) {
        await this.player.videoContainer.streamProvider.setCurrentAudioTrack(itemData.data);
        this.updateAudioLabel();
    }
}