import PlayerResource from './PlayerResource';
import { getVideoPlugin } from './VideoPlugin';
import { loadCanvasPlugins, getCanvasPlugin, unloadCanvasPlugins } from './CanvasPlugin';
import Events, { triggerIfReady } from './Events';


/**
 * Checks the integrity of a video manifest
 * @param {object} manifest - The video manifest to validate
 * @throws {Error} If the manifest is missing required fields
 */
export function checkManifestIntegrity(manifest) {
	const check = (field, error) => {
		if (!field) {
			throw new Error(`Invalid video manifest: ${error}`);
		}
	}

	check(manifest.streams, "missing 'streams' object.");
	check(manifest.streams.length>0, "the 'streams' array is empty.");
	check(manifest.metadata?.preview, "the 'metadata.preview' field is required.");
}

/**
 * Manages video streams and their playback synchronization.
 * Provides an interface for controlling multiple video streams as a single entity.
 * @class StreamProvider
 * @extends PlayerResource
 */
export default class StreamProvider extends PlayerResource {
	/**
	 * Creates a new StreamProvider instance
	 * @param {Paella} player - The player instance
	 * @param {VideoContainer} videoContainer - The video container instance
	 */
	constructor(player, videoContainer) {
		super(player, videoContainer);
		this._videoContainer = videoContainer;
		this._streamData = null;
		this._streams = null;
		this._players = [];
		
		this._mainAudioPlayer = null;
		
		this._streamSyncTimer = null;
		
		this._trimming = {
			enabled: false,
			start: 100,
			end: 200
		}
	}
	
	/**
	 * Loads and initializes video streams
	 * @param {Stream[]} streamData - Array of stream data to load
	 * @throws {Error} If incompatible stream type or missing canvas plugin
	 */
	async load(streamData) {
		this._streamData = streamData;
		this._streams = {};
		
		let mainAudioContent = this.player.config.defaultAudioStream || "presenter";
		if (this._streamData.length === 1) {
			mainAudioContent = this._streamData[0].content;
		}
		streamData.some(s => {
			if (s.role === "mainAudio") {
				mainAudioContent = s.content;
				return true;
			}
		});
	
		
		this.player.log.debug("Finding compatible video plugins");

		await loadCanvasPlugins(this.player);
		
		// Find video plugins for each stream
		for (const stream of this._streamData) {
			const canvasPlugin = getCanvasPlugin(this.player, stream);
			if (!canvasPlugin) {
				throw Error(`Canvas plugin not found: ${ stream.canvas }`);
			}

			const isMainAudio = stream.content === mainAudioContent;
			const videoPlugin = await getVideoPlugin(this.player, stream);
			if (!videoPlugin) {
				throw Error(`Incompatible stream type: ${ stream.content }`);
			}
			
			this._streams[stream.content] = {
				stream,
				isMainAudio,
				videoPlugin,
				canvasPlugin
			}
		}
		
		for (const content in this._streams) {
			const s = this._streams[content];
			s.canvas = await s.canvasPlugin.getCanvasInstance(this._videoContainer);
			s.player = await s.videoPlugin.getVideoInstance(s.canvas.element, s.isMainAudio);
			if (mainAudioContent===content) {
				this._mainAudioPlayer = s.player;
				s.player.initVolume(1);
			}
			else {
				s.player.initVolume(0);
			}
			
			await s.player.load(s.stream, this);
			await s.canvas.loadCanvas(s.player);		
			s.player.onVideoEnded(() => {
				// Pause all streams, to prevent other vídeos from playing, when not all the
				// streams have the same duration.
				this.executeAction("pause");
				
				// Set current time to 0 to put the video in the initial state
				this.executeAction("setCurrentTime", 0);

				// Trigger the ended event
				triggerIfReady(this.player, Events.ENDED);
			})
			this._players.push(s.player);
		}

		if (this.mainAudioPlayer === null) {
			this.player.log.error("The video stream containing the audio track could not be identified. The `role` attribute must be specified in the main video stream, or the `defaultAudioStream` attribute must be set correctly in the player configuration.");
			throw new Error("The video stream containing the audio track could not be identified.");
		}
	}

	/**
	 * Unloads all streams and cleans up resources
	 */
	async unload() {
		this.stopStreamSync();
		await unloadCanvasPlugins(this.player);
	}
	
	/**
	 * Gets all stream players
	 * @returns {StreamPlayer[]} Array of stream players
	 */
	get players() {
		return this._players;
	}
	
	/**
	 * Gets the raw stream data loaded from the video manifest
	 * @returns {Stream[]} Array of stream data
	 */
	// This is the raw streamData loaded from the video manifest
	get streamData() {
		return this._streamData;
	}
	
	/**
	 * Gets available streams indexed by content identifier
	 * @returns {Record<string, StreamProperties>} Object containing stream properties for each content ID
	 */
	// This property stores the available streams, indexed by the content identifier, and contains the
	// stream data, the video plugin and the player, for each content identifier.
	get streams() {
		return this._streams;
	}
	
	/**
	 * Gets the main audio player
	 * @returns {any} The main audio player instance
	 */
	get mainAudioPlayer() {
		return this._mainAudioPlayer;
	}
	
	/**
	 * Gets whether trimming is enabled and properly configured
	 * @returns {boolean} True if trimming is enabled and end time is greater than start time
	 */
	get isTrimEnabled() {
		return this._trimming?.enabled &&
			this._trimming?.end > this._trimming?.start;
	}
	
	/**
	 * Gets the trimming start time
	 * @returns {number} Start time in seconds
	 */
	get trimStart() {
		return this._trimming?.start;
	}
	
	/**
	 * Gets the trimming end time
	 * @returns {number} End time in seconds
	 */
	get trimEnd() {
		return this._trimming?.end;
	}
	
	/**
	 * Sets trimming parameters for the video
	 * @param {TrimmingParams} options - Trimming configuration
	 * @param {boolean} [options.enabled] - Whether trimming is enabled
	 * @param {number} [options.start] - Start time in seconds
	 * @param {number} [options.end] - End time in seconds
	 * @throws {Error} If start time is greater than or equal to end time
	 */
	async setTrimming({ enabled, start, end }) {
		if (start>=end) {
			throw Error(`Error setting trimming: start time (${ start }) must be lower than end time ${ end }`);
		}
		this._trimming = {
			enabled,
			start,
			end
		};
		const currentTime = await this.currentTime()
		triggerIfReady(this.player, Events.TIMEUPDATE, { currentTime: enabled ? start + currentTime : currentTime });
	}
	
	/**
	 * Starts stream synchronization timer
	 */
	startStreamSync() {
		this._timeSync = true;
		const setupSyncTimer = async () => {
			if (!this._players.length) {
				this.player.log.warn("Player not yet loaded. Waiting for video sync.");
				return;
			}
			
			let currentTime = this.mainAudioPlayer.currentTimeSync;
			const maxSync = 0.2;

			if (this.players.length>1) {
				for (let i = 0; i<this.players.length; ++i) {
					const secPlayer = this.players[i];
					if (secPlayer !== this.mainAudioPlayer) {
						const playerTime = secPlayer.currentTimeSync;
						if (Math.abs(currentTime - playerTime) > maxSync) {
							this.player.log.debug("Video synchronization triggered");
							secPlayer.setCurrentTime(currentTime);
						}
					}
				}
			}
			
			// Check trimming
			if (this.isTrimEnabled) {
				let trimmedCurrentTime = currentTime - this.trimStart;
				if (this.trimEnd<=currentTime) {
					await this.executeAction("pause");
					await this.setCurrentTime(0);
					this.stopStreamSync();
					currentTime = 0;
					triggerIfReady(this.player, Events.ENDED, {});
					return;
				}
				else if (currentTime<this.trimStart) {
					await this.setCurrentTime(0);
					currentTime = this.trimStart;
					trimmedCurrentTime = 0;
				}
				
				triggerIfReady(this.player, Events.TIMEUPDATE, { currentTime: trimmedCurrentTime });
				this._timeupdateTimer = setTimeout(() => {
					if (this._timeSync) {
						setupSyncTimer();
					}
				}, 250);
			}
			else if (this._timeSync) {
				triggerIfReady(this.player, Events.TIMEUPDATE, { currentTime });
				this._timeupdateTimer = setTimeout(() => {
					setupSyncTimer();	
				}, 250);
			}
		}
		setupSyncTimer();
	}
	
	/**
	 * Stops stream synchronization timer
	 */
	stopStreamSync() {
		this._timeSync = false;
		if (this._timeupdateTimer) {
			clearTimeout(this._timeupdateTimer);
		}
	}
	
	/**
	 * Executes an action on all stream players
	 * @param {string} fnName - Function name to execute
	 * @param {any|any[]} [params=[]] - Parameters to pass to the function
	 * @returns {Promise<any[]>} Array of results from all players
	 */
	executeAction(fnName, params = []) {
		// Important: this implementation must be done using promises instead of async/await, due to
		// a bug in babel that causes that the resulting array may not be available when the async function
		// is completed.
		if (!Array.isArray(params)) {
			params = [params];
		}
		return new Promise((resolve) => {
			let res = [];
			let p = [];
			this.players.forEach(player => {
				p.push(new Promise(innerResolve => {
					player[fnName](...params).then(r => {
						res.push(r);
						innerResolve();
					})
				}));
			})
			
			Promise.allSettled(p).then(() => resolve(res));
		})
	}

	/**
	 * Gets whether any stream is a live stream
	 * @returns {boolean} True if any stream contains hlsLive sources
	 */
	get isLiveStream() {
		return this._streamData.some(sd => Array.from(Object.keys(sd.sources)).indexOf("hlsLive") !== -1);
	}
	
	/**
	 * Starts playback of all streams
	 * @returns {Promise<any>} Promise that resolves when playback starts
	 */
	async play() {
		this.startStreamSync();
		const result = await this.executeAction("play");
		return result;
	}

	/**
	 * Pauses playback of all streams
	 * @returns {Promise<any>} Promise that resolves when playback is paused
	 */
	async pause() {
		this.stopStreamSync();
		const result = await this.executeAction("pause");
		return result;
	}
	
	/**
	 * Stops playback and resets current time to 0
	 * @returns {Promise<void>} Promise that resolves when playback is stopped
	 */
	async stop() {
		this.stopStreamSync()
		await this.executeAction("pause");
		await this.executeAction("setCurrentTime", 0);
	}
	
	/**
	 * Gets whether playback is paused
	 * @returns {Promise<boolean>} Promise that resolves to true if paused
	 */
	async paused() {
		return (await this.executeAction("paused"))[0];
	}

	/**
	 * Sets the current playback time
	 * @param {number} t - Time in seconds
	 * @returns {Promise<{result: any, prevTime: number, newTime: number}>} Object containing operation result and time values
	 */
	async setCurrentTime(t) {
		const duration = await this.duration();
        if (t < 0) {
            t = 0;
        }
        else if (t > duration) {
            t = duration;
        }

		const prevTime = (await this.executeAction("currentTime"))[0];
		let returnValue = null;

		if (this.isTrimEnabled) {
			t = t + this.trimStart;
			t = t >= this.trimEnd ? this.trimEnd : t;
			const result = (await this.executeAction("setCurrentTime", [t]))[0];
			const newTime = (await this.executeAction("currentTime"))[0];
			returnValue = {
				result,
				prevTime: prevTime - this.trimStart,
				newTime: newTime - this.trimStart
			}
		}
		else {
			const result = (await this.executeAction("setCurrentTime", [t]))[0];
			const newTime = (await this.executeAction("currentTime"))[0];
			returnValue = { result, prevTime, newTime };
		}
		
		const currentTime = await this.currentTime();
		triggerIfReady(this.player, Events.TIMEUPDATE, { currentTime: currentTime });

		return returnValue;
	}
	
	/**
	 * Gets the current playback time (respects trimming)
	 * @returns {Promise<number>} Current time in seconds
	 */
	async currentTime() {
		const currentTime = await this.mainAudioPlayer.currentTime();
		if (this.isTrimEnabled) {
			return currentTime - this.trimStart;
		}
		else {
			return currentTime;
		}
	}
	
	/**
	 * Gets the current playback time ignoring trimming settings
	 * @returns {Promise<number>} Current time in seconds without trimming offset
	 */
	async currentTimeIgnoringTrimming() {
		const currentTime = await this.mainAudioPlayer.currentTime();
		return currentTime;
	}
	
	/**
	 * Gets the current volume level
	 * @returns {Promise<number>} Volume level between 0 and 1
	 */
	async volume() {
		if (this.mainAudioPlayer) {
			return await this.mainAudioPlayer.volume();
		}
		else {		
			return (await this.executeAction("volume"))[0];
		}
	}
	
	/**
	 * Sets the volume level
	 * @param {number} v - Volume level between 0 and 1
	 * @returns {Promise<any>} Promise that resolves when volume is set
	 */
	async setVolume(v) {
		if (this.mainAudioPlayer) {
			return await this.mainAudioPlayer.setVolume(v);
		}
		else {
			return (await this.executeAction("setVolume",[v]))[0];
		}
	}
	
	/**
	 * Gets the video duration (respects trimming)
	 * @returns {Promise<number>} Duration in seconds
	 */
	async duration() {
		if (this.isTrimEnabled) {
			return this.trimEnd - this.trimStart;	
		}
		else {
			return await this.durationIgnoringTrimming();
		}
	}
	
	/**
	 * Gets the video duration ignoring trimming settings
	 * @returns {Promise<number>} Full duration in seconds without trimming
	 */
	async durationIgnoringTrimming() {
		const result = (await this.executeAction("duration")).reduce((acc, val) => Math.min(acc, val), Number.MAX_VALUE);
		return result;
	}

	/**
	 * Gets the current playback rate
	 * @returns {Promise<number>} Playback rate (1.0 is normal speed)
	 */
	async playbackRate() {
		return (await this.executeAction("playbackRate"))[0];
	}

	/**
	 * Sets the playback rate
	 * @param {number} rate - Playback rate (1.0 is normal speed)
	 * @returns {Promise<any>} Promise that resolves when playback rate is set
	 */
	async setPlaybackRate(rate) {
		return (await this.executeAction("setPlaybackRate",[rate]))[0];
	}

	/**
	 * Gets the player with the most quality options for quality control reference
	 * @returns {Promise<StreamPlayer>} The reference player for quality control
	 */
	async getQualityReferencePlayer() {
		let player = null;
		let referenceQualities = [];
		if (Object.keys(this.streams).length>0) {
			for (const content in this.streams) {
				const stream = this.streams[content];
				const q = (await stream.player.getQualities()) || [];
				if (!player && q.length > referenceQualities.length) {
					referenceQualities = q;
					player = stream.player;
				}
			}
		}
		return player || this.mainAudioPlayer;
	}

	/**
	 * Gets the current video quality
	 * @returns {Promise<StreamQuality>} Current quality settings
	 */
	async getCurrentQuality() {
		return (await this.getQualityReferencePlayer()).currentQuality;
	}

	/**
	 * Gets available video qualities
	 * @returns {Promise<StreamQuality[]>} Array of available quality options
	 */
	async getQualities() {
		const player = await this.getQualityReferencePlayer();
		return await player.getQualities();
	}

	/**
	 * Sets the video quality for all streams
	 * @param {StreamQuality} quality - Quality settings to apply
	 * @returns {Promise<void>} Promise that resolves when quality is set
	 */
	async setQuality(quality) {
		const player = await this.getQualityReferencePlayer();

		const qualities = await player.getQualities();
		const total = qualities.length;
		let index = -1;
		qualities.some((q,i) => {
			if (quality.index === q.index) {
				index = i;
			}
			return index !== -1;
		});

		if (index>=0) {
			const qualityFactor = index / total;
			for (const content in this.streams) {
				const stream = this.streams[content];
				const streamQualities = (await stream.player.getQualities()) || [];
				this.player.log.debug(streamQualities);
				if (streamQualities.length>1) {
					const qualityIndex = Math.round(streamQualities.length * qualityFactor);
					const selectedQuality = streamQualities[qualityIndex];
					await stream.player.setQuality(selectedQuality);
				}
			}
		}
	}

	/**
	 * Checks if the main audio player supports multiple audio tracks
	 * @returns {Promise<boolean>} True if multi-audio is supported
	 */
	async supportsMultiaudio() {
		return this.mainAudioPlayer.supportsMultiaudio();
	}

	/**
	 * Gets available audio tracks
	 * @returns {Promise<AudioTrack[]>} Array of available audio tracks
	 */
	async getAudioTracks() {
		return this.mainAudioPlayer.getAudioTracks();
	}

	/**
	 * Sets the current audio track
	 * @param {AudioTrack} track - Audio track to set as current
	 * @returns {Promise<any>} Promise that resolves when audio track is set
	 */
	async setCurrentAudioTrack(track) {
		return this.mainAudioPlayer.setCurrentAudioTrack(track);
	}

	/**
	 * Gets the currently selected audio track
	 * @returns {AudioTrack|null} Current audio track or null if none selected
	 */
	get currentAudioTrack() {
		return this.mainAudioPlayer.currentAudioTrack;
	}
}