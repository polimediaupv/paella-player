import MenuButtonPlugin from 'paella-core/core/MenuButtonPlugin';
import VideoPluginsModule from './VideoPluginsModule.js';

import { CaptionsIcon as captionsPlugin } from '../icons/captions_cc.js';

export default class HlsCaptionsSelectorPlugin extends MenuButtonPlugin{
    getPluginModuleInstance() {
        return VideoPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.hlsCaptionsSelectorPlugin";
    }

    getAriaLabel() {
        return "Select captions";
    }

    getDescription() {
        return this.getAriaLabel();
    }

    async isEnabled() {
        const result = await super.isEnabled();
        this._hls = this.player.videoContainer.streamProvider.mainAudioPlayer._hls;
        return this._hls && result;
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name,"captionsIcon") || captionsPlugin;
        const tracks = this._hls.subtitleTracks || [];
        this._tracks = tracks;
        const subtitleTrack = this._hls.subtitleTrack ?? -1;
        this._disabledTrack = {
            id: -1,
            title: "Disabled",
            index: -1,
            selected: true
        };
        this._selected = null;

        if (tracks.length==0) {
            this.disable();
        }
    }

    async getMenu() {
        const result = [ {
            id: -1,
            title: "Disabled",
            index: -1,
            selected: this._selected === null
        } ];

        this._tracks.forEach((c,i) => {
            result.push({
                id: c.attrs.LANGUAGE || c.attrs.NAME,
                title: c.attrs.NAME || c.attrs.LANGUAGE,
                index: i,
                selected: c.language === this._selected
            });
        })
        return result;
    }

    get buttonType() {
        return "radio";
    }

    itemSelected(itemData) {
        this._hls.subtitleTrack = itemData.index;
        this._selected = this._tracks.find(t => t.index === itemData.index)?.language;
    }
}
