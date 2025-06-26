import { ButtonPlugin, type Paella } from '@asicupv/paella-core';

import 'vanilla-cookieconsent/dist/cookieconsent.css';
import * as CookieConsent from 'vanilla-cookieconsent';

import defaultCookieIcon from '../icons/cookie.svg?raw';
import PackagePluginModule from './PackagePluginModule';

import '../styles/CookieConsent.css';

export default class CookieConsentPlugin extends ButtonPlugin {
    static acceptedCategory(category: string) {
        return CookieConsent.acceptedCategory(category);
    }

    constructor(player: Paella) {
        super(player, 'es.upv.paella.cookieconsent');
        const myconfig = player.config?.plugins[this.name];
        if (player.config.cookieConsent && myconfig && myconfig.enabled) {
            player.log.info('CookieConsentPlugin enabled');
            /**
             * All config. options available here:
             * https://cookieconsent.orestbida.com/reference/configuration-reference.html
             */
            const categories = player.config.cookieConsent.reduce<CookieConsent.CookieConsentConfig['categories']>((acc, category) => {
                acc[category.type] = { enabled: true, readOnly: category.required };
                return acc;
            }, {});
            const sections = player.config.cookieConsent.map((category) => {
                return {
                    title: category.title,
                    description: category.description,
                    linkedCategory: category.type
                };
            }, {});

            CookieConsent.run({ // Added 'await' keyword here
                categories,
                disablePageInteraction: true,
                language: {
                    default: 'en',                    
                    translations: {
                        en: {
                            consentModal: {
                                title: 'We use cookies',
                                description: 'Cookie modal description',
                                acceptAllBtn: 'Accept all',
                                acceptNecessaryBtn: 'Reject all',
                                showPreferencesBtn: 'Manage individual preferences'
                            },
                            preferencesModal: {
                                title: 'Manage cookie preferences',
                                acceptAllBtn: 'Accept all',
                                acceptNecessaryBtn: 'Reject all',
                                savePreferencesBtn: 'Accept current selection',
                                closeIconLabel: 'Close modal',
                                sections: [
                                    {
                                        title: 'Somebody said ... cookies?',
                                        description: 'I want one!'
                                    },
                                    ...sections,
                                    {
                                        title: 'More information',
                                        description: 'For any queries in relation to my policy on cookies and your choices, please <a href="#contact-page">contact us</a>'
                                    }
                                ]
                            }
                        }
                    }
                },
                onFirstConsent: () => {
                    this.player.cookieConsent.updateConsentData();
                },
                onConsent: () => {
                    this.player.cookieConsent.updateConsentData();
                },
                onChange: () => {
                    this.player.log.info('Cookie consent changed.');
                    this.player.cookieConsent.updateConsentData();
                }
            })
            .catch((err) => {
                player.log.error(`Error initializing cookie consent: ${err}`);
            });
        }
    }

    getPluginModuleInstance() {
        return PackagePluginModule.Get();
    }

    async isEnabled() {        
        if (!(await super.isEnabled())) {
            return false;
        }
        
        return !!this.player?.config?.cookieConsent;
    }

    getAriaLabel() {
        return 'Cookie consent';
    }

    getDescription() {
        return this.getAriaLabel();
    }

    async getHelp() {
        return {
            title: "Cookie Consent Plugin",
            description: "This plugin manages cookie consent preferences for the player, allowing users to accept or reject cookies and configure their preferences."
        };
    }

    async load() {
        console.log("Loading CookieConsentPlugin");
        this.icon = this.player.getCustomPluginIcon(this.name, 'buttonIcon') || defaultCookieIcon;
    }

    async action() {        
        CookieConsent.showPreferences();
    }
}


export function getCookieConsentFunction(type: string) {
    const value = CookieConsentPlugin.acceptedCategory(type);
    return value;
}