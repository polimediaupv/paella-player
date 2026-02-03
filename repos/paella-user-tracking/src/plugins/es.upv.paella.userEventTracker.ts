import { Events, EventLogPlugin, LOG_LEVEL } from '@asicupv/paella-core';
import UserTrackingPlugins from "./UserTrackingPlugins";

//const eventKeys = Object.keys(Events);

const getPaellaEvents = (events: string[]): Events[] => events.map((eventName: string) => Events[eventName as keyof typeof Events]);

export default class UserEventTrackerPlugin extends EventLogPlugin {
	getPluginModuleInstance() {
		return UserTrackingPlugins.Get();
	}

	get name() {
		return super.name || "es.upv.paella.userEventTracker";
	}

	get events(): Events[] {
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

	async onEvent(event: string, params: any): Promise<void> {
		if (!this.player.data) {
			this.player.log.warn(`${this.name}: Data plugin not available. User event tracking disabled.`);
			return;
		}

		const context: string[] = [];// = this.config.context || "userTracking";
		if (typeof this.config.context === "string") {
			context.push(this.config.context);
		}
		else if (Array.isArray(this.config.context)) {
			this.config.context.forEach((c: string) => context.push(c));
		}
		else {
			context.push("userTracking");
		}
		const id = this.player.videoId;

		const writeEvent = async (data: any) => {
			const p: Promise<void>[] = [];
			context.forEach((c: string) => p.push(this.player.data!.write(
				c,
				JSON.stringify({ id }),
				data
			)));
			await Promise.all(p);
		}

		if (event === Events.LOG && params.severity <= LOG_LEVEL[this.config.logLevel || "INFO"]) {
			await writeEvent({
				event,
				params
			});
		}
		else if (event !== Events.LOG && this.player.data) {
			// Remove plugin reference to avoid circular references
			if (params.plugin) {
				const { name, config } = params.plugin;
				params.plugin = { name, config }
			}
			const trackingData = { event, params, plugin: params.plugin.name }
	
			switch (event) {
			case Events.SHOW_POPUP:
			case Events.HIDE_POPUP:
			case Events.BUTTON_PRESS:
				trackingData.plugin = params.plugin?.name || null;
			}
	
			await writeEvent(trackingData);
		}
	}
}
