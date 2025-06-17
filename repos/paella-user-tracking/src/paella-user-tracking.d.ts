declare module "@asicupv/paella-user-tracking" {
    import type { PluginRef, EventLogPlugin, DataPlugin } from "@asicupv/paella-core";

    export const userTrackingPlugins: PluginRef[];
    export const allPlugins: PluginRef[];

    export class GoogleAnalyticsUserTrackingDataPlugin extends DataPlugin {}
    export class MatomoUserTrackingDataPlugin extends DataPlugin {}
    export class DebugUserTrackingDataPlugin extends DataPlugin {}
    export class UserEventTrackerPlugin extends EventLogPlugin {}
}
