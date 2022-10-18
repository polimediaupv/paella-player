import { ButtonPlugin } from 'paella-core';
import defaultCookieIcon from '../icons/cookie.svg';


export default class CookieConsentButtonPlugin extends ButtonPlugin {

	async isEnabled() {
		if (!(await super.isEnabled())) {
			return false;
		}
        if (!window.cookieconsent) {
            this.player.log.warn(`"Cookie Consent by TermsFeed" library not loaded. You need to load in your web to use this plugin.`);
            return false;
        }

        const consentChanged = () => {
			this.player.log.debug("Cookie consent changed");
			this.player.cookieConsent.updateConsentData();	
		}
		window.addEventListener("cc_noticeBannerOkOrAgreePressed", consentChanged);
		window.addEventListener("cc_noticeBannerRejectPressed", consentChanged);
		window.addEventListener("cc_preferencesCenterSavePressed", consentChanged);

        return true;
	}

	getAriaLabel() {
		return "Cookie consent";
	}

	getDescription() {
		return this.getAriaLabel();
	}

	async load() {
		this.icon = this.player.getCustomPluginIcon(this.name, "cookieIcon") || defaultCookieIcon;
	}

	async action() {
		window.cookieconsent.openPreferencesCenter()
	}
}
