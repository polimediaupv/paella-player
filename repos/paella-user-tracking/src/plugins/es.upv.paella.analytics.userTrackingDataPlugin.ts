
import { DataPlugin, type DataPluginConfig } from "@asicupv/paella-core";
import UserTrackingPlugins from "./UserTrackingPlugins";

interface AnalyticsUserTrackingDataPluginConfig extends DataPluginConfig {
    trackingId: string;
    domain?: string;
    category?: boolean | string;
}

export default class AnalyticsUserTrackingDataPlugin<PluginC extends AnalyticsUserTrackingDataPluginConfig = AnalyticsUserTrackingDataPluginConfig> extends DataPlugin<PluginC> {
    getPluginModuleInstance() {
		return UserTrackingPlugins.Get();
	}

	get name() {
		return super.name || "es.upv.paella.analytics.userTrackingDataPlugin";
	}

    async load() {
        const trackingId = this.config.trackingId;
        const domain = this.config.domain || "auto";
        if (trackingId) {
            this.player.log.debug("Google Analytics Enabled");
            
            // @ts-ignore
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                // @ts-ignore
                (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
                // @ts-ignore
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','//www.google-analytics.com/analytics.js','__gaTracker');
            // @ts-ignore
            __gaTracker('create', trackingId, domain);
            // @ts-ignore
            __gaTracker('send', 'pageview');
        }
        else {
            this.player.log.debug("No Google Tracking ID found in config file. Disabling Google Analytics");
        }
    }
    
    async write(context: string, id: string, data: any) {
        if (this.config.category === undefined || this.config.category === true) {
            const category = this.config.category || "PaellaPlayer";
            const action = data.event;
            const labelData: Record<string, any> = {
                videoId: id,
                plugin: data.plugin
            }

            try {
                // Test if data parameters can be serialized
                JSON.stringify(data.params);
                labelData.params = data.params;
            }
            catch(e) {}

            const label = JSON.stringify(labelData);

            // @ts-ignore
            __gaTracker(' send', 'event', category, action, label);
        }
    }
}