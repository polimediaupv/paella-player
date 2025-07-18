import OnBoardingPlugin from './plugins/es.upv.paella.onboarding.js';
import CookieConsentPlugin, { getCookieConsentFunction } from './plugins/es.upv.paella.cookieconsent';

export const extraPlugins = [
    {
        plugin: OnBoardingPlugin,
        config: {
            enabled: true
        }
    },
    {
        plugin: CookieConsentPlugin,
        config: {
            enabled: true
        }
    }
];


export {
    OnBoardingPlugin,
    CookieConsentPlugin,
    getCookieConsentFunction
};


