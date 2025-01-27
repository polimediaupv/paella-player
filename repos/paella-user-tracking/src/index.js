
import GoogleAnalyticsUserTrackingData from './plugins/es.upv.paella.analytics.userTrackingDataPlugin';
import MatomoUserTrackingData from './plugins/es.upv.paella.matomo.userTrackingDataPlugin';
import DebugUserTrackingData from './plugins/es.upv.paella.debug.userTrackingDataPlugin';
import UserEventTracker from './plugins/es.upv.paella.userEventTracker';

export const userTrackingPlugins = [
    {
        plugin: GoogleAnalyticsUserTrackingData,
        config: {
            enabled: true
        },
    },
    {
        plugin: MatomoUserTrackingData,
        config: {
            enabled: true
        },
    },
    {
        plugin: DebugUserTrackingData,
        config: {
            enabled: true
        },
    },
    {
        plugin: UserEventTracker,
        config: {
            enabled: true
        },
    }
];

export const allPlugins = userTrackingPlugins;

export const GoogleAnalyticsUserTrackingDataPlugin = GoogleAnalyticsUserTrackingData;
export const MatomoUserTrackingDataPlugin = MatomoUserTrackingData;
export const DebugUserTrackingDataPlugin = DebugUserTrackingData;
export const UserEventTrackerPlugin = UserEventTracker;
