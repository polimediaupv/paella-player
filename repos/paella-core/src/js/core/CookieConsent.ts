
import Events, { triggerEvent } from "./Events";
import Paella from "../Paella";

export type CookieConsentData = {
    /** Type of the cookie consent, for example `analytical` */
    type?:        string

    /** Human readable name of the cookie consent, for example 'Analytical Cookies' */
    title?:       string

    /** Description of the cookie consent, for example 'Cookies used to analyze the user behavior' */
    description?: string

    /** Is this cookie group required for the website to work? */
    required?:    boolean

    /** Is enabled by default? */
    value?:       boolean
}

export type GetCookieConsentCallback = (type: string) => Promise<boolean>;
export type GetCookieDescriptionCallback = (cookieObject: CookieConsentData) => string;

export const defaultGetCookieConsentCallback: GetCookieConsentCallback = async (type: any) => {
    return false;
}

export const defaultGetCookieDescriptionCallback: GetCookieDescriptionCallback = (cookieObject: any) => {
    return cookieObject.description;
}

export default class CookieConsent {
    private _player: Paella;
    private _cookieConsentData: CookieConsentData[];
    private _getConsentCallback: GetCookieConsentCallback;
    private _getDescriptionCallback: GetCookieDescriptionCallback;

    constructor(player: Paella, {
            getConsent,
            getDescription
        } : {
            getConsent?: GetCookieConsentCallback
            getDescription?: GetCookieDescriptionCallback
        } = {})
    {
        this._player = player;

        this._cookieConsentData = player.config.cookieConsent || [];

        this._getConsentCallback = getConsent || defaultGetCookieConsentCallback;
        this._getDescriptionCallback = getDescription || defaultGetCookieDescriptionCallback;

        this._cookieConsentData.forEach(consentObject => {
            consentObject.description = this._getDescriptionCallback(consentObject);
        });

        this.updateConsentData();
    }

    async updateConsentData() {
        for (const consentElement of this._cookieConsentData) {
            consentElement.value = (consentElement.type && await this._getConsentCallback(consentElement.type)) || consentElement.required || false;
        }
        triggerEvent(this._player, Events.COOKIE_CONSENT_CHANGED, { cookieConsent: this } );
    }

    async getConsentForType(type: string) : Promise<boolean> {
        const object = this._cookieConsentData.find(c => c.type === type);
        return object?.value || false;
    }
}
