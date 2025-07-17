declare module "@asicupv/paella-user-tracking" {
    import type { PluginRef, EventLogPlugin, DataPlugin, DataPluginConfig, EventName } from "@asicupv/paella-core";

    export const userTrackingPlugins: PluginRef[];
    export const allPlugins: PluginRef[];

    export type UserTrackingData = {
        event: EventName;
        params: object;
    }

    export type GoogleAnalyticsUserTrackingDataPluginConfig = DataPluginConfig & {
        trackingId?: string;
        domain?: string;
        category?: string;
    }


    export class GoogleAnalyticsUserTrackingDataPlugin<C extends GoogleAnalyticsUserTrackingDataPluginConfig = GoogleAnalyticsUserTrackingDataPluginConfig> extends DataPlugin<C, UserTrackingData> {}

    export type MatomoUserTrackingDataPluginConfig = DataPluginConfig & {        
        server?: string;
        siteId?: string;
        trackerUrl?: {
            php?: string;
            js?: string;
        };
        matomoGlobalLoaded?: boolean;
        mediaAnalyticsTitle?: string;
        cookieType?: string;        
        events?: Record<string, string>;
        customDimensions?: Record<string, string>;
        disableAlwaysUseSendBeacon?: boolean;
    }
    
    export class MatomoUserTrackingDataPlugin<C extends MatomoUserTrackingDataPluginConfig = MatomoUserTrackingDataPluginConfig> extends DataPlugin<C, UserTrackingData> {}

    export class DebugUserTrackingDataPlugin extends DataPlugin {}
    export class UserEventTrackerPlugin extends EventLogPlugin {}
}
