
import CookieConsent, {getCookieConsentFunction} from './plugins/es.upv.paella.cookieconsent';

export const cookieConsentPlugins = [
    {
        plugin: CookieConsent,
        config: {
            enabled: true
        }
    }
];

export const CookieConsentPlugin = CookieConsent;
export { getCookieConsentFunction };