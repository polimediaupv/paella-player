import { DomClass, createElementWithHtmlText } from './dom';

import { loadPluginsOfType, unloadPluginsOfType } from './plugin_tools'
import ButtonPlugin, { addButtonPlugin } from './ButtonPlugin';
import { pauseAutoHideUiTimer, resumeAutoHideUiTimer } from './utils';
import PlaybackBarPopUp from './PlaybackBarPopUp';
import Paella from '../Paella.js';
import Plugin from './Plugin.js';
import type { Frame, Chapter } from "./ManifestParser";
import Events from "./Events";
import UserInterfacePlugin from './UserInterfacePlugin';
import { ProgressIndicatorImpl } from './progress-indicator';

/**
 * PlaybackBar class manages the player's control interface including button plugins,
 * progress indicator, and popup functionality.
 */
export default class PlaybackBar extends DomClass {
	#popUp: PlaybackBarPopUp | null = null
	#playbackBarContainer: HTMLElement | null = null
	#topContainer: HTMLElement | null = null
	#navContainer: HTMLElement | null = null
	#buttonPluginsLeft: HTMLElement | null = null
	#centerContainer: HTMLElement | null = null
	#buttonPluginsRight: HTMLElement | null = null
	#progressIndicator: ProgressIndicatorImpl | null = null
	#enabled = true
	#enabledPlugins: Plugin[] = []

	constructor(player: Paella, parent: HTMLElement) {
		const inlineMode = player.config.progressIndicator?.inlineMode ?? false;
		const attributes = { "class": "playback-bar-container" };
		super(player, { attributes, parent });

		this.#popUp = new PlaybackBarPopUp(this);

		this.element.addEventListener('mouseenter', () => pauseAutoHideUiTimer(player));
		this.element.addEventListener('mouseleave', () => resumeAutoHideUiTimer(player));

		
		const toolbarAriaLabel = player.translate("Toolbar");
		const leftSideButtonsAriaLabel = player.translate("Left-side buttons");
		const rightSideButtonsAriaLabel = player.translate("Right-side buttons");
		this.#playbackBarContainer = createElementWithHtmlText('<section class="playback-bar"></section>', this.element);
		this.#topContainer = createElementWithHtmlText(`<div></div>`);
		this.#navContainer = createElementWithHtmlText(`<nav role="toolbar" aria-label="${toolbarAriaLabel}"></nav>`);

		this.#buttonPluginsLeft = createElementWithHtmlText(`<ul role="group" aria-label="${leftSideButtonsAriaLabel}"></ul>`, this.#navContainer);
		this.#centerContainer = createElementWithHtmlText(`<div></div>`, this.#navContainer);
		this.#buttonPluginsRight = createElementWithHtmlText(`<ul  role="group" aria-label="${rightSideButtonsAriaLabel}"></ul>`, this.#navContainer);
		
		const createProgressIndicator = player._initParams.getProgressIndicator;

		if (!createProgressIndicator) {
			throw Error("PlaybackBar: player._initParams.getProgressIndicator is not defined");
		}

		const duration = 1000;
		const currentTime = 0;
		const precision = 100;
		if (inlineMode) {
			// @ts-ignore
			this.#progressIndicator = createProgressIndicator({ container: this.#centerContainer, player, duration, currentTime, precision });
		}
		else {
			this.#playbackBarContainer.appendChild(this.#topContainer);
			// @ts-ignore
			this.#progressIndicator = createProgressIndicator({ container: this.#topContainer, player, duration, currentTime, precision });
		}
		this.#progressIndicator?.onChange(async (currentTime: number) => {
			await player.videoContainer?.setCurrentTime(currentTime);
		});

		this.#playbackBarContainer.appendChild(this.#navContainer);
	}

	/**
	 * Gets the popup instance associated with this playback bar
	 */
	get popUp(): PlaybackBarPopUp | null {
		return this.#popUp;
	}

	/**
	 * Gets whether the playback bar is enabled
	 */
	get enabled(): boolean {
		return this.#enabled;
	}

	/**
	 * Sets the enabled state of the playback bar
	 */
	set enabled(e: boolean) {
		this.#enabled = e;
		if (!this.#enabled) {
			this.hide();
		}
		else {
			this.showUserInterface();
		}
	}
	
	/**
	 * Loads the playback bar and its button plugins
	 */
	async load() {
		this.#enabledPlugins = [];
		
		this.player.log.debug("Loading button plugins");
		await loadPluginsOfType(this.player,"button",async (plugin: Plugin) => {
			const btn = plugin as ButtonPlugin;
			this.player.log.debug(` Button plugin: ${ plugin.name }`);
			this.#enabledPlugins.push(plugin);
			if (btn.side === "left") {
				await addButtonPlugin(btn, this.buttonPluginsLeft);
			}
			else if (btn.side === "right") {
				await addButtonPlugin(btn, this.buttonPluginsRight);
			}
		}, async plugin => {
			const btn = plugin as ButtonPlugin;
			if (btn.parentContainer === "playbackBar") {
				return await plugin.isEnabled();
			}
			else {
				return false;
			}
		});

		const duration = await this.player.videoContainer?.duration();
		if (duration === null || duration === undefined) return;
		this.#progressIndicator?.setDuration(duration ?? 0);

		const manifest = {
			metadata: this.player.metadata,
			frameList: this.player.frameList,
			chapters: this.player.chapters
		};
		const markSource = manifest.metadata?.timelineMarks;
		let markList: (Frame | Chapter)[] | null = null;
		if (markSource === "frameList" && manifest.frameList.frames.length > 0) {
			markList = manifest.frameList.frames;
		}
		else if (markSource === "chapters" && manifest.chapters.chapterList.length > 0) {
			markList = manifest.chapters.chapterList;
		}
		else if (!markSource && manifest.chapters.chapterList.length > 0) {
			markList = manifest.chapters.chapterList;
		}
		else if (!markSource && manifest.frameList.frames.length > 0) {
			markList = manifest.frameList.frames;
		}
		
		markList?.forEach((markData, i, allFrames) => {
			const nextFrame = allFrames[i + 1];
			const frameDuration = nextFrame ? nextFrame.time - markData.time : duration - markData.time;
			this.#progressIndicator?.addMarker({ time: markData.time, duration, frameDuration, addGap: i < allFrames.length - 1 });
		});

		this.player.bindEvent([Events.TIMEUPDATE, Events.SEEK], (event: any) => {
			this.#progressIndicator?.setCurrentTime(event.newTime ?? event.currentTime);
		});

		this.player.bindEvent(Events.TRIMMING_CHANGED, async (event: any) => {
			const newDuration = event.end - event.start;
			this.#progressIndicator?.setDuration(newDuration);
			const currentTime = await this.player.videoContainer?.currentTime() ?? 0;
			this.#progressIndicator?.setCurrentTime(currentTime);
		});

		this.onResize();

		// This CSS variable is generated to be used in the CSS file
		const playbackBarHeight = (this.element?.querySelector(".playback-bar") as HTMLElement)?.offsetHeight ?? 0;
		this.player.containerElement.style.setProperty('--playback-bar-height', `${playbackBarHeight}px`);
	}

	/**
	 * Unloads the playback bar and removes all plugins
	 */
	async unload() {
		// Remove elements from parent
		this.removeFromParent();

		// Unload plugins
		await unloadPluginsOfType(this.player, "button");
		this.#buttonPluginsLeft!.innerHTML = ""
		this.#buttonPluginsRight!.innerHTML = "";
	}
	
	/**
	 * Hides the playback bar user interface
	 */
	hideUserInterface() {
		this.player.log.debug("Hide playback bar user interface");
		this.hide();
	}
	
	/**
	 * Shows the playback bar user interface if enabled
	 */
	showUserInterface() {
		if (this.#enabled) {
			const inlineMode = this.player.config.progressIndicator?.inlineMode ?? false;
			const showMode = inlineMode ? 'flex' : 'block';
			this.show(showMode);
			this.onResize();
		}
	}
	
	/**
	 * Gets the right-side button plugins container
	 */
	get buttonPluginsRight(): HTMLElement | null {
		return this.#buttonPluginsRight;
	}
	
	/**
	 * Gets the left-side button plugins container
	 */
	get buttonPluginsLeft(): HTMLElement | null {
		return this.#buttonPluginsLeft;
	}
	
	/**
	 * Gets the progress indicator instance
	 */
	get progressIndicator(): any {
		return this.#progressIndicator;
	}

	/**
	 * Gets the current container size
	 */
	get containerSize(): { width: number, height: number } {
		const width = this.element.clientWidth;
		const height = this.element.clientHeight;
		return { width, height } 
	}
	
	/**
	 * Handles resize events for the playback bar
	 */
	onResize() {
		const { containerSize } = this;
		this.#enabledPlugins
			.forEach(plugin => plugin instanceof UserInterfacePlugin && plugin.onResize(containerSize));
	}

	/**
	 * Gets all button plugins sorted by order
	 */
	getButtonPlugins(): Plugin[] {
		return this.#enabledPlugins.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	}

	/**
	 * Gets all visible button plugins (non-hidden) sorted by order
	 */
	getVisibleButtonPlugins(): Plugin[] {
  		return this.getButtonPlugins().filter(plugin => plugin instanceof ButtonPlugin && !plugin.hidden);
 	}
}
