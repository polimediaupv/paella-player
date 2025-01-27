
import { DataPlugin, Events, bindEvent  } from "@asicupv/paella-core";
import UserTrackingPlugins from "./UserTrackingPlugins";

export default class MatomoUserTrackingDataPlugin extends DataPlugin {

    getPluginModuleInstance() {
		return UserTrackingPlugins.Get();
	}

	get name() {
		return super.name || "es.upv.paella.matomo.userTrackingDataPlugin";
	}

    async isEnabled() {
        if (!(await super.isEnabled())) {
          return false;
        }
        else {
            this.matomoGlobalLoaded = this.config.matomoGlobalLoaded ?? false;
            this.server = this.config.server;
            this.siteId = this.config.siteId;
            this.events = this.config.events;
            
            if (!this.matomoGlobalLoaded && !(this.server && this.siteId)) {
                this.player.log.warn('Matomo plugin: Plugin is enabled, but is not configured correctly. Please configue `matomoGlobalLoaded`, `server`and `siteId` parameters.');
                return false;
            }
            return true;
        }
    }

    async getCurrentUserId() {
        return null;
    }

    async trackCustomDimensions() {
        const templateVars = await this.getTemplateVars();
        const customDimensions = this.config.customDimensions ?? {};

        try {
            Object.entries(customDimensions).forEach(([customDimensionId, customDimensionValueTemplate]) => {
                const customDimensionValue = this.applyTemplate(customDimensionValueTemplate, templateVars);
                _paq.push(['setCustomDimension', customDimensionId, customDimensionValue]);
                this.player.log.debug(`Matomo plugin: setting custom dimension id=${customDimensionId} to '${customDimensionValue}'`);
            });
        }
        catch(e) {            
        }
    }

    async getTemplateVars(data) {
        let eventData = this.getEventData(data);

        return {
            videoId: this.player._videoId,
            metadata: this.player.videoManifest.metadata,
            event: data?.event || '',
            eventData: eventData
        };
    }

    getEventData(data) {

        switch (data?.event) {
            case Events.SEEK:
                return Math.round(data.params.newTime);
            case Events.VOLUME_CHANGED:
                return data.params.volume*100;
            case Events.BUTTON_PRESS:
                return data.params.plugin.name;
            case Events.SHOW_POPUP:
                return data.params.plugin.name;
            case Events.HIDE_POPUP:
                return data.params.plugin.name;
            case Events.RESIZE_END:
                return `${ data.params.size.w }x${ data.params.size.h }`;
            case Events.LAYOUT_CHANGED:
                return data.params.layoutId;
            case Events.PLAYBACK_RATE_CHANGED:
                return data.params.newPlaybackRate;
            case Events.CAPTIONS_ENABLED:
                return data.params.language;
        }

        return '';
    }

    async load() {
        const heartBeatTime = this.config.heartBeatTime || 15;

        var _paq = window._paq = window._paq || [];
        // _paq.push(['requireConsent']);
        _paq.push(['requireCookieConsent']);
        bindEvent(this.player, Events.COOKIE_CONSENT_CHANGED, () => {
            this.player.log.debug('Matomo: Cookie consent changed.');
            if (this.player.cookieConsent.getConsentForType(this.config.cookieType)) {
                // _paq.push(['rememberConsentGiven']);
                _paq.push(['rememberCookieConsentGiven']);
            }
            else {
                // _paq.push(['forgetConsentGiven']);
                _paq.push(['forgetCookieConsentGiven']);
            }
        });
        
        
        if (this.matomoGlobalLoaded) {
            var _paq = window._paq = window._paq || [];
            this.player.log.debug('Assuming Matomo analytics is initialized globaly.');
            if (this.config.server) {
                this.player.log.warn('Matomo plugin: `server` parameter is defined, but never used because Matomo is loaded globaly in the page. Is it an error? Please check it.');
            }
            if (this.config.siteId) {
                this.player.log.warn('Matomo plugin: `siteId` parameter is defined, but never used because Matomo is loaded globaly in the page. Is it an error? Please check it.');
            }
        }
        else {
            const server = this.server;
            const siteId = this.siteId;            
            this.player.log.debug("Matomo analytics plugin enabled.");
            this.trackCustomDimensions();
            const userId =  await this.getCurrentUserId();
            if (userId) {
                _paq.push(['setUserId', userId]);
            }
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
                var u=server;
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', siteId]);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();
        }
        // accurately measure the time spent in the visit
        _paq.push(['enableHeartBeatTimer', heartBeatTime]);
        this.trackCustomDimensions();
        // Scan For Media
        bindEvent(this.player, Events.STREAM_LOADED, () => {
            _paq.push(['MediaAnalytics::scanForMedia']);
        });
    }
    
    applyTemplate(txt, templateVars) {        
        return txt.replace(/\${[^{]*}/g, (t)=>{
            return t.substring(2, t.length-1).split(".").reduce((a,b)=>{return a[b];}, templateVars)
        });
    };

    async write(context, { id }, data) {
        if (this.events) {
            const categoryT = this.events.category || 'PaellaPlayer';
            const actionT = this.events.action || '${event}';
            const nameT = this.events.name || '${eventData}';

            const templateVars = await this.getTemplateVars(data);

            const category = this.applyTemplate(categoryT, templateVars);
            const action = this.applyTemplate(actionT, templateVars);
            const name = this.applyTemplate(nameT, templateVars);
            
            _paq.push(['trackEvent', category, action, name]);
            this.player.log.debug(`Matomo plugin: track event category='${category}', action='${action}', name='${name}'`);
        }
    }
}