declare module "@asicupv/paella-user-tracking" {
    import type { Plugin, PluginRef } from "@asicupv/paella-core";

    export const userTrackingPlugins: PluginRef[];
    export const allPlugins: PluginRef[];

    export const GoogleAnalyticsUserTrackingDataPlugin: Plugin;
    export const MatomoUserTrackingDataPlugin: Plugin;
    export const DebugUserTrackingDataPlugin: Plugin;
    export const UserEventTrackerPlugin: Plugin;
}
