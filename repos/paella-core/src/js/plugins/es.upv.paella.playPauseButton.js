import ButtonPlugin from '../core/ButtonPlugin';
import Events, { bindEvent } from '../core/Events';

import defaultPlayIcon from '../../icons/play';
import defaultPauseIcon from '../../icons/pause';
import defaultReplayIcon from '../../icons/replay';

import PaellaCorePlugins from './PaellaCorePlugins';

export default class PlayButtonPlugin extends ButtonPlugin {
	getPluginModuleInstance() {
        return PaellaCorePlugins.Get();
    }
	
	get name() {
		return super.name || "es.upv.paella.playPauseButton";
	}

	async load() {
		const playIcon = this.player.getCustomPluginIcon(this.name,"play") || defaultPlayIcon;
		const pauseIcon = this.player.getCustomPluginIcon(this.name,"pause") || defaultPauseIcon;
		const replayIcon = this.player.getCustomPluginIcon(this.name,"replay") || defaultReplayIcon;
		this.icon = playIcon;
		const ariaLabelPause = this.player.translate(this.config.ariaLabelPause || "Pause");
		const ariaLabelPlay = this.player.translate(this.config.ariaLabelPlay || "Play");
		const titlePause = this.player.translate(this.config.titlePause || "Pause");
		const titlePlay = this.player.translate(this.config.titlelPlay || "Play");
		bindEvent(this.player, Events.PLAY, () => {
			this.icon = pauseIcon;
			this.button.ariaLabel = ariaLabelPause;
			this.button.title = titlePause;
		});
		bindEvent(this.player, Events.PAUSE, () => {
			this.icon = playIcon;
			this.button.ariaLabel = ariaLabelPlay;
			this.button.title = titlePlay;
		});
		bindEvent(this.player, Events.ENDED, () => {
			this.icon = replayIcon;
			this.button.ariaLabel = ariaLabelPlay;
			this.button.title = titlePlay;
		});
		bindEvent(this.player, Events.STOP, () => {
			this.icon = playIcon;
			this.button.ariaLabel = ariaLabelPlay
			this.button.title = titlePlay;
		});
	}
	
	async action() {
		if (await this.player.paused()) {
			await this.player.videoContainer.play();
		}
		else {
			await this.player.videoContainer.pause();
		}
	}

	async getHelp() {
		return {
			title: this.player.translate("Play/Pause button"),
			description: this.player.translate("Starts and stops video playback. When the video reaches the end, this button also allows you to restart playback from the beginning.")
		};
	}
}