import { Events, EventLogPlugin, LOG_LEVEL } from '@asicupv/paella-core';
import UserTrackingPlugins from "./UserTrackingPlugins";

//const eventKeys = Object.keys(Events);

const getPaellaEvents = (events) => events.map(eventName => Events[eventName]);

export default class UserEventTrackerPlugin extends EventLogPlugin {
	getPluginModuleInstance() {
		return UserTrackingPlugins.Get();
	}

	get name() {
		return super.name || "es.upv.paella.userEventTracker";
	}

	get events() {
		if (this.config.events) {
			return getPaellaEvents(this.config.events);
		}
		else {
			return [
				Events.PLAY,
				Events.PAUSE,
				Events.SEEK,
				Events.STOP,
				Events.ENDED,
				Events.FULLSCREEN_CHANGED,
				Events.VOLUME_CHANGED,
				Events.BUTTON_PRESS,
				Events.RESIZE_END
			]
		}
	}

	async onEvent(event, params) {
		const context = this.config.context || "userTracking";
		const id = this.player.videoId;

		if (event === Events.LOG && params.severity <= LOG_LEVEL[this.config.logLevel]) {
			this.player.data && await this.player.data.write(
				context,
				{ id },
				{
					event,
					params
				}
			)
		}
		else if (event !== Events.LOG && this.player.data) {
			// Remove plugin reference to avoid circular references
			if (params.plugin) {
				const { name, config } = params.plugin;
				params.plugin = { name, config }
			}
			const trackingData = { event, params }
	
			switch (event) {
			case Events.SHOW_POPUP:
			case Events.HIDE_POPUP:
			case Events.BUTTON_PRESS:
				trackingData.plugin = params.plugin?.name || null;
			}
	
			
			await this.player.data.write(
				context,
				{ id },
				trackingData
			);
		}
	}
}
