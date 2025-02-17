import { DomClass, createElementWithHtmlText } from './dom';

import { loadPluginsOfType, unloadPluginsOfType } from './plugin_tools'
import { addButtonPlugin } from './ButtonPlugin';
import { pauseAutoHideUiTimer, resumeAutoHideUiTimer } from './utils';
import PlaybackBarPopUp from './PlaybackBarPopUp.js';

export default class PlaybackBar extends DomClass {
	#popUp = null
	#playbackBarContainer = null
	#topContainer = null
	#navContainer = null
	#buttonPluginsLeft = null
	#centerContainer = null
	#buttonPluginsRight = null
	#progressIndicator = null
	#enabled = true
	#enabledPlugins = []

	constructor(player,parent) {
		const inlineMode = player.config.progressIndicator?.inlineMode ?? false;
		const attributes = { "class": "playback-bar-container" };
		super(player, { attributes, parent });

		this.#popUp = new PlaybackBarPopUp(this);

		this.element.addEventListener('mouseenter', () => pauseAutoHideUiTimer(player));
		this.element.addEventListener('mouseleave', () => resumeAutoHideUiTimer(player));

		
		this.#playbackBarContainer = createElementWithHtmlText('<section class="playback-bar"></section>', this.element);
		this.#topContainer = createElementWithHtmlText(`<div></div>`);
		this.#navContainer = createElementWithHtmlText('<nav></nav>');

		this.#buttonPluginsLeft = createElementWithHtmlText(`<ul></ul>`, this.#navContainer);
		this.#centerContainer = createElementWithHtmlText(`<div></div>`, this.#navContainer);
		this.#buttonPluginsRight = createElementWithHtmlText(`<ul></ul>`, this.#navContainer);
		
		const createProgressIndicator = player._initParams.getProgressIndicator;

		const duration = 1000;
		const currentTime = 0;
		const precision = 100;
		if (inlineMode) {
			this.#progressIndicator = createProgressIndicator({ container: this.#centerContainer, player, duration, currentTime, precision });
		}
		else {
			this.#playbackBarContainer.appendChild(this.#topContainer);
			this.#progressIndicator = createProgressIndicator({ container: this.#topContainer, player, duration, currentTime, precision });
		}
		this.#progressIndicator.onChange(async (currentTime) => {
			await player.videoContainer.setCurrentTime(currentTime);
		});

		this.#playbackBarContainer.appendChild(this.#navContainer);
	}

	get popUp() {
		return this.#popUp;
	}

	get enabled() {
		return this.#enabled;
	}

	set enabled(e) {
		this.#enabled = e;
		if (!this.#enabled) {
			this.hide();
		}
		else {
			this.showUserInterface();
		}
	}
	
	async load() {
		this.#enabledPlugins = [];
		
		this.player.log.debug("Loading button plugins");
		await loadPluginsOfType(this.player,"button",async (plugin) => {
			this.player.log.debug(` Button plugin: ${ plugin.name }`);
			this.#enabledPlugins.push(plugin);
			if (plugin.side === "left") {
				await addButtonPlugin(plugin, this.buttonPluginsLeft);
			}
			else if (plugin.side === "right") {
				await addButtonPlugin(plugin, this.buttonPluginsRight);
			}
		}, async plugin => {
			if (plugin.parentContainer === "playbackBar") {
				return await plugin.isEnabled();
			}
			else {
				return false;
			}
		});

		const duration = await this.player.videoContainer.duration();
		this.#progressIndicator.setDuration(duration);

		this.player.frameList.frames.forEach((frameData, i, allFrames) => {
			const nextFrame = allFrames[i + 1];
			const frameDuration = nextFrame ? nextFrame.time - frameData.time : duration - frameData.time;
			this.#progressIndicator.addMarker({ time: frameData.time, duration, frameDuration, addGap: i < allFrames.length - 1 });

		});

		this.player.bindEvent([this.player.Events.TIMEUPDATE, this.player.Events.SEEK], (event) => {
			this.#progressIndicator.setCurrentTime(event.newTime ?? event.currentTime);
		});

		this.player.bindEvent(this.player.Events.TRIMMING_CHANGED, async (event) => {
			const newDuration = event.end - event.start;
			this.#progressIndicator.setDuration(newDuration);
			const currentTime = await this.player.videoContainer.currentTime();
			this.#progressIndicator.setCurrentTime(currentTime);
		});

		this.onResize();
	}

	async unload() {
		// Remove elements from parent
		this.removeFromParent();

		// Unload plugins
		await unloadPluginsOfType(this.player, "button");
		this.#buttonPluginsLeft.innerHTML = ""
		this.#buttonPluginsRight.innerHTML = "";
	}
	
	hideUserInterface() {
		this.player.log.debug("Hide playback bar user interface");
		this.hide();
	}
	
	showUserInterface() {
		if (this.#enabled) {
			const inlineMode = this.player.config.progressIndicator?.inlineMode ?? false;
			const showMode = inlineMode ? 'flex' : 'block';
			this.show(showMode);
			this.onResize();
		}
	}
	
	get buttonPluginsRight() {
		return this.#buttonPluginsRight;
	}
	
	get buttonPluginsLeft() {
		return this.#buttonPluginsLeft;
	}
	
	get progressIndicator() {
		return this.#progressIndicator;
	}

	get containerSize() {
		const width = this.element.clientWidth;
		const height = this.element.clientHeight;
		return { width, height } 
	}
	
	onResize() {
		const { containerSize } = this;
		this.#enabledPlugins.forEach(plugin => plugin.onResize(containerSize));
	}
}