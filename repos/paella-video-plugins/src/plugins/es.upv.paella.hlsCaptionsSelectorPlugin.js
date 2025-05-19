import { MenuButtonPlugin } from '@asicupv/paella-core';
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
        this._video = this.player.videoContainer.streamProvider.mainAudioPlayer.video;
        return this._hls && result;
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name,"captionsIcon") || captionsPlugin;
        const hlsTracks = this._hls.subtitleTracks || [];
        const videoTracks = this._video.textTracks || [];
        
        if (hlsTracks.length > 0) {
            this._tracks = hlsTracks;
            this._trackType = "hls";
        }
        else {
            this._videoTracks = videoTracks;
            const getTextTracks = () => {
                console.log("getTextTracks");
                return Array.from(videoTracks).map((t, i) => ({
                    attrs: {
                        LANGUAGE: t.language,
                        NAME: t.label,
                    },
                    language: t.language
                }));
            }
            this._tracks = getTextTracks();
            if (this._videoTracks.length > 0) {
                this._trackType = "native";
                this._tracks = getTextTracks();
                if (this._tracks.length > 0) {
                    this.enable();
                }
            }
            videoTracks.onaddtrack = () => {
                this._trackType = "native";
                this._tracks = getTextTracks();
                if (this._tracks.length > 0) {
                    this.enable();
                }
            }
        }

        const subtitleTrack = this._hls.subtitleTrack ?? -1;
        this._disabledTrack = {
            id: -1,
            title: "Disabled",
            index: -1,
            selected: true
        };
        this._selected = null;

        if (this._tracks.length==0) {
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
        console.log(itemData);
        
        if (itemData.index === -1) {
            this._selected = null;
            if (this._trackType === "hls") {
                this._hls.subtitleTrack = -1;
            }
            else if (this._trackType === "native") {
                Array.from(this._videoTracks).forEach(t => t.mode = "disabled");
            }
        }
        else {
            if (this._trackType === "hls") {
                this._hls.subtitleTrack = itemData.index;
            }
            else if (this._trackType === "native") {
                this._videoTracks[itemData.index].mode = "showing";
            }
            this._selected = this._tracks.find(t => t.index === itemData.index)?.language;
        }
    }
}
