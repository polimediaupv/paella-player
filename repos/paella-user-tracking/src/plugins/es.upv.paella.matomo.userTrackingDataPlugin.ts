
import { DataPlugin, Events, bindEvent, type DataPluginConfig  } from "@asicupv/paella-core";
import UserTrackingPlugins from "./UserTrackingPlugins";

interface MatomoUserTrackingDataPluginConfig extends DataPluginConfig {
    matomoGlobalLoaded?: boolean;
    server?: string;
    siteId?: string;
    trackerUrl?: {
        php?: string;
        js?: string;
    };
    disableAlwaysUseSendBeacon?: boolean;
    heartBeatTime?: number;
    customDimensions?: Record<string, string>;
    mediaAnalyticsTitle?: string;
    cookieType?: string;
    events?: {
        category?: string;
        action?: string;
        name?:  string;
    };
}
export default class MatomoUserTrackingDataPlugin extends DataPlugin<MatomoUserTrackingDataPluginConfig> {
    private matomoGlobalLoaded: boolean = false;
    private server: string | undefined = undefined;
    private siteId: string | undefined = undefined;
    private events: { category?: string; action?: string; name?:  string; } | undefined = undefined;

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
                (window as any)._paq.push(['setCustomDimension', customDimensionId, customDimensionValue]);
                this.player.log.debug(`Matomo plugin: setting custom dimension id=${customDimensionId} to '${customDimensionValue}'`);
            });
        }
        catch(e) {
        }
    }

    async getTemplateVars(data: any = {}) {
        let eventData = this.getEventData(data);

        return {
            videoId: this.player._videoId,
            metadata: this.player.videoManifest.metadata,
            event: data?.event || '',
            eventData: eventData
        };
    }

    getEventData(data: any) : string | number {

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

        (window as any)._paq = (window as any)._paq || [];
        // (window as any)._paq.push(['requireConsent']);
        (window as any)._paq.push(['requireCookieConsent']);
        bindEvent(this.player, Events.COOKIE_CONSENT_CHANGED, () => {
            this.player.log.debug('Matomo: Cookie consent changed.');
            if (this.player.cookieConsent?.getConsentForType(this.config.cookieType || "")) {
                // (window as any)._paq.push(['rememberConsentGiven']);
                (window as any)._paq.push(['rememberCookieConsentGiven']);
            }
            else {
                // (window as any)._paq.push(['forgetConsentGiven']);
                (window as any)._paq.push(['forgetCookieConsentGiven']);
            }
        });


        if (this.matomoGlobalLoaded) {
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
            const trackerUrl = {
                php: this.config.trackerUrl?.php ?? 'matomo.php',
                js: this.config.trackerUrl?.js ?? 'matomo.js'
            };
            const disableAlwaysUseSendBeacon = this.config.disableAlwaysUseSendBeacon ?? false;
            this.player.log.debug("Matomo analytics plugin enabled.");
            this.trackCustomDimensions();
            const userId =  await this.getCurrentUserId();
            if (userId) {
               (window as any)._paq.push(['setUserId', userId]);
            }
            (window as any)._paq.push(['trackPageView']);
            (window as any)._paq.push(['enableLinkTracking']);
            (function() {
                var u=server;
                (window as any)._paq.push(['setTrackerUrl', u+trackerUrl.php]);
                (window as any)._paq.push(['setSiteId', siteId]);
                if (disableAlwaysUseSendBeacon) {
                    (window as any)._paq.push(['disableAlwaysUseSendBeacon', 'true']);
                }
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                // @ts-ignore
                g.type='text/javascript'; g.async=true; g.src=u+trackerUrl.js; s.parentNode.insertBefore(g,s);
            })();
        }
        // accurately measure the time spent in the visit
        (window as any)._paq.push(['enableHeartBeatTimer', heartBeatTime]);
        this.trackCustomDimensions();

        // Set title for Matomo Media Analytics plugin and scan for media
        const templateVars = await this.getTemplateVars();
        bindEvent(this.player, Events.STREAM_LOADED, () => {
            const videoTitle = this.config.mediaAnalyticsTitle ? this.applyTemplate(this.config.mediaAnalyticsTitle, templateVars) : document.title;
            const videoNodeList = this.player.containerElement.querySelectorAll('video');
            for (let i = 0; i < videoNodeList.length; i++) {
                // if multiple videos, data should only be send once
                if (i > 0) {
                    videoNodeList[i].setAttribute('data-matomo-ignore','');
                } else {
                    videoNodeList[i].dataset.matomoTitle = videoTitle;
                }
            }
            (window as any)._paq.push(['MediaAnalytics::scanForMedia']);
        });
    }

    applyTemplate(txt: string, templateVars: any) {
        return txt.replace(/\${[^{]*}/g, (t)=>{
            return t.substring(2, t.length-1).split(".").reduce((a,b)=>{return a[b];}, templateVars)
        });
    };

    async write(context: string, id: string, data: any) {
        if (this.events) {
            const categoryT = this.events.category || 'PaellaPlayer';
            const actionT = this.events.action || '${event}';
            const nameT = this.events.name || '${eventData}';

            const templateVars = await this.getTemplateVars(data);

            const category = this.applyTemplate(categoryT, templateVars);
            const action = this.applyTemplate(actionT, templateVars);
            const name = this.applyTemplate(nameT, templateVars);

            (window as any)._paq.push(['trackEvent', category, action, name]);
            this.player.log.debug(`Matomo plugin: track event category='${category}', action='${action}', name='${name}'`);
        }
    }
}