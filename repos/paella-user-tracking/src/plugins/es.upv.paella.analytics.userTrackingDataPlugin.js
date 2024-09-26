
import { DataPlugin  } from "paella-core";
import UserTrackingPlugins from "./UserTrackingPlugins";

export default class AnalyticsUserTrackingDataPlugin extends DataPlugin {
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
            /* jshint ignore:start */
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','//www.google-analytics.com/analytics.js','__gaTracker');
            /* jshint ignore:end */
            __gaTracker('create', trackingId, domain);
            __gaTracker('send', 'pageview');
        }
        else {
            this.player.log.debug("No Google Tracking ID found in config file. Disabling Google Analytics");
        }
    }
    
    async write(context, { id }, data) {
        if (this.config.category === undefined || this.config.category === true) {
            const category = this.config.category || "PaellaPlayer";
            const action = data.event;
            const labelData = {
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

            __gaTracker(' send', 'event', category, action, label);
        }
    }
}