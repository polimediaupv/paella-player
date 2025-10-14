import type Paella from "../Paella";

/**
 * Paella Player event constants.
 * Defines all events that can be triggered during player lifecycle and user interactions.
 */
enum Events {
	/** Playback started event */
	PLAY = "paella:play",
	/** Playback paused event */
	PAUSE = "paella:pause",
	/** Playback stopped event */
	STOP = "paella:stop",
	/** Playback ended event */
	ENDED = "paella:ended",
	/** Seek operation performed event */
	SEEK = "paella:seek",
	/** Fullscreen state changed event */
	FULLSCREEN_CHANGED = "paella:fullscreenchanged",
	/** Entered fullscreen mode event */
	ENTER_FULLSCREEN = "paella:enterfullscreen",
	/** Exited fullscreen mode event */
	EXIT_FULLSCREEN = "paella:exitfullscreen",
	/** Volume changed event */
	VOLUME_CHANGED = "paella:volumeChanged",
	/** Time update event (fired periodically during playback) */
	TIMEUPDATE = "paella:timeupdate",
	/** Video trimming settings changed event */
	TRIMMING_CHANGED = "paella:trimmingChanged",
	/** Caption track changed event */
	CAPTIONS_CHANGED = "paella:captionsChanged",
	/** Captions enabled event */
	CAPTIONS_ENABLED = "paella:captionsEnabled",
	/** Captions disabled event */
	CAPTIONS_DISABLED = "paella:captionsDisabled",
	/** Button pressed event */
	BUTTON_PRESS = "paella:buttonPress",
	/** Popup shown event */
	SHOW_POPUP = "paella:showPopUp",
	/** Popup hidden event */
	HIDE_POPUP = "paella:hidePopUp",
	/** Video manifest loaded event */
	MANIFEST_LOADED = "paella:manifestLoaded",
	/** Stream loaded event */
	STREAM_LOADED = "paella:streamLoaded",
	/** Player fully loaded event */
	PLAYER_LOADED = "paella:playerLoaded",
	/** Player unloaded event */
	PLAYER_UNLOADED = "paella:playerUnloaded",
	/** Container resized event */
	RESIZE = "paella:resize",
	/** Container resize ended event */
	RESIZE_END = "paella:resizeEnd",
	/** Video layout changed event */
	LAYOUT_CHANGED = "paella:layoutChanged",
	/** Playback rate changed event */
	PLAYBACK_RATE_CHANGED = "paella:playbackRateChanged",
	/** Video quality changed event */
	VIDEO_QUALITY_CHANGED = "paella:videoQualityChanged",
	/** User interface hidden event */
	HIDE_UI = "paella:hideUI",
	/** User interface shown event */
	SHOW_UI = "paella:showUI",
	/** Cookie consent settings changed event */
	COOKIE_CONSENT_CHANGED = "paella:cookieConsentChanged",
	/** Log message event */
	LOG = "paella:log"
}

export default Events;

/**
 * Binds event listeners to a player instance
 * @param {any} player - The player instance
 * @param {string | string[]} events - Event name(s) to bind
 * @param {Function} callback - Callback function to execute when event is triggered
 * @param {boolean} [unregisterOnUnload=true] - Whether to unregister this listener on player unload
 * @returns {Function} The callback function
 */
export function bindEvent(player: Paella, events: string | string[], callback: Function, unregisterOnUnload: boolean = true) {
	(player as any).__eventListeners__ = (player as any).__eventListeners__ || {};
	if (!Array.isArray(events)) {
		events = [events];
	}
	events.forEach((event: string) => {
		(player as any).__eventListeners__[event] = (player as any).__eventListeners__[event] || [];
		(player as any).__eventListeners__[event].push({
			callback,
			unregisterOnUnload
		});
	})
	return callback;
}

/**
 * Triggers an event on a player instance
 * @param {any} player - The player instance
 * @param {string} event - Event name to trigger
 * @param {object} [params={}] - Parameters to pass to event listeners
 */
export function triggerEvent(player: Paella, event: string, params: object = {}) {
	(player as any).__eventListeners__ &&
	(player as any).__eventListeners__[event] &&
	(player as any).__eventListeners__[event].forEach((cbData: any) => cbData.callback(params));
}

/**
 * Triggers an event only if the player is ready
 * @param {any} player - The player instance
 * @param {string} event - Event name to trigger
 * @param {object} [params={}] - Parameters to pass to event listeners
 */
export function triggerIfReady(player: Paella, event: string, params: object = {}) {
	if (player.ready) {
		triggerEvent(player, event, params);
	}
}

/**
 * Unregisters event listeners that are marked to be unregistered on player unload
 * @param {any} player - The player instance
 */
export function unregisterEvents(player: Paella) {
	if (!(player as any).__eventListeners__) {
		return;
	}

	for (const event in (player as any).__eventListeners__) {
		(player as any).__eventListeners__[event] = (player as any).__eventListeners__[event].filter((cbData: any) => cbData.unregisterOnUnload == false);
		player.log.debug("Unregister event: " + (player as any).__eventListeners__[event]);
	}
}
