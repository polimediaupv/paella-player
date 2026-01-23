import { MenuButtonPlugin, Events, type MenuButtonPluginConfig, ButtonType } from "@asicupv/paella-core";
import BasicPluginsModule from './BasicPluginsModule';

import { ScreenIcon as screenIcon } from '../icons/screen.js';
import { PlaybackRateIcon as defaultPlaybackRateIcon } from "../icons/playback-rate.js";

// @ts-ignore
import '../css/playbackRate.css';

type PlaybackRateButtonConfig = MenuButtonPluginConfig & {
    showIcon?: boolean;
    rates?: number[];
}

type PlaybackRateMenuItem = {
    id: number;
    title: string;
    selected: boolean;
};

export default class PlaybackRateButton extends MenuButtonPlugin<PlaybackRateButtonConfig> {
    private _stateText: string | null = null;
    private _rates: number[] = [];

    getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.playbackRateButton";
    }

    getAriaLabel() {
        return this.player.translate("Playback rate");
    }

    getDescription() {
        return this.getAriaLabel();
    }

    get dynamicWidth() {
		return this.config.showIcon === false;
	}

    async load() {
        if (this.config.showIcon === false) {

        }
        else {
            this.icon = this.player.getCustomPluginIcon(this.name,"screenIcon") || screenIcon;
            this.menuIcon = this.player.getCustomPluginIcon(this.name,"playbackRateIcon") || defaultPlaybackRateIcon;
        }

        const currentRate = await this.player.videoContainer?.playbackRate();

        if (this.isMenuButton) {
            this.title = this.description;
            this._stateText = `${currentRate}x`;
        }
        else {
            this.title = `${currentRate}x`;
        }
        this._rates = this.config.rates || [0.5, 0.75, 1, 1.25, 1.5, 2];

        this.player.bindEvent(Events.PLAYBACK_RATE_CHANGED, (params: { newPlaybackRate: number }) => {
            this.title = params.newPlaybackRate + "x";
        })
    }

    async getMenu(): Promise<PlaybackRateMenuItem[]> {
        const playbackRate = await this.player.videoContainer?.playbackRate();
        const getItem = (rate: number): PlaybackRateMenuItem => {
            return {
                id: rate,
                title: `${ rate }x`,
                selected: rate == playbackRate
            }            
        }
        return this._rates.map(r => getItem(r));
    }

    get titleSize() { return this.config.showIcon === false ? "large" : "small"; }

    async itemSelected(itemData: PlaybackRateMenuItem) {
        await this.player.videoContainer?.setPlaybackRate(itemData.id);
        if (this.isMenuButton) {
            this.title = this.description;
            this._stateText = itemData.title;
        }
        else {
            this.title = itemData.title;
        }
    }

    get buttonType(): ButtonType {
        return "radio";
    }

    get stateText() {
        return this._stateText;
    }
    
    async getHelp() {
        return {
            title: "Playback rate selector",
            description: "Allows you to adjust the playback speed of the video."
        };
    }
}
