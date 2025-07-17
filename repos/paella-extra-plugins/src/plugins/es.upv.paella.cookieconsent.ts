import { ButtonPlugin, type Paella } from '@asicupv/paella-core';

import 'vanilla-cookieconsent/dist/cookieconsent.css';
// import * as CookieConsent from 'vanilla-cookieconsent';
import defaultCookieIcon from '../icons/cookie.svg?raw';
import PackagePluginModule from './PackagePluginModule';

import '../css/CookieConsent.css';

export default class CookieConsentPlugin extends ButtonPlugin {
    static CookieConsent?: typeof import('vanilla-cookieconsent') 

    static acceptedCategory(category: string): boolean {
        return CookieConsentPlugin.CookieConsent?.acceptedCategory(category) ?? false;
    }

    constructor(player: Paella) {
        super(player, 'es.upv.paella.cookieconsent');
        const myconfig = player.config?.plugins[this.name];
        if (player.config.cookieConsent && myconfig && myconfig.enabled) {
            player.log.info('CookieConsentPlugin enabled', `${this.getPluginModuleInstance().moduleName} [${this.name}]`);
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

            import('vanilla-cookieconsent').then((CookieConsent) => {
                CookieConsentPlugin.CookieConsent = CookieConsent;                
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
                        this.player.log.info('Cookie consent changed.', `${this.getPluginModuleInstance().moduleName} [${this.name}]`);
                        this.player.cookieConsent.updateConsentData();
                    }
                })
                .catch((err) => {
                    player.log.error(`Error initializing cookie consent: ${err}`, `${this.getPluginModuleInstance().moduleName} [${this.name}]`);
                });
            })
            .catch((err) => {
                player.log.error(`Error loading cookie consent module: ${err}`, `${this.getPluginModuleInstance().moduleName} [${this.name}]`);
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
        
        return ((!!this.player?.config?.cookieConsent) && (CookieConsentPlugin.CookieConsent !== undefined));
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
        this.icon = this.player.getCustomPluginIcon(this.name, 'buttonIcon') || defaultCookieIcon;
    }

    async action() {        
        CookieConsentPlugin.CookieConsent?.showPreferences();
    }
}


export function getCookieConsentFunction(type: string) {
    const value = CookieConsentPlugin.acceptedCategory(type);
    return value;
}