

import type Paella from "../Paella";

export type Language =
    "aa" | "ab" | "ae" | "af" | "ak" | "am" | "an" | "ar" | "as" | "av" | "ay" | "az" | "ba" | "be" | "bg" | "bh" | "bi" | "bm" | "bn" | "bo" | "br" | "bs" | "ca" | "ce" | "ch" | "co" | "cr" | "cs" | "cu" | "cv" | "cy" | "da" | "de" | "dv" | "dz" | "ee" | "el" | "en" | "eo" | "es" | "et" | "eu" | "fa" | "ff" | "fi" | "fj" | "fo" | "fr" | "fy" | "ga" | "gd" | "gl" | "gn" | "gu" | "gv" | "ha" | "he" | "hi" | "ho" | "hr" | "ht" | "hu" | "hy" | "hz" | "ia" | "id" | "ie" | "ig" | "ii" | "ik" | "io" | "is" | "it" | "iu" | "ja" | "jv" | "ka" | "kg" | "ki" | "kj" | "kk" | "kl" | "km" | "kn" | "ko" | "kr" | "ks" | "ku" | "kv" | "kw" | "ky" | "la" | "lb" | "lg" | "li" | "ln" | "lo" | "lt" | "lu" | "lv" | "mg" | "mh" | "mi" | "mk" | "ml" | "mn" | "mr" | "ms" | "mt" | "my" | "na" | "nb" | "nd" | "ne" | "ng" | "nl" | "nn" | "no" | "nr" | "nv" | "ny" | "oc" | "oj" | "om" | "or" | "os" | "pa" | "pi" | "pl" | "ps" | "pt" | "qu" | "rm" | "rn" | "ro" | "ru" | "rw" | "sa" | "sc" | "sd" | "se" | "sg" | "si" | "sk" | "sl" | "sm" | "sn" | "so" | "sq" | "sr" | "ss" | "st" | "su" | "sv" | "sw" | "ta" | "te" | "tg" | "th" | "ti" | "tk" | "tl" | "tn" | "to" | "tr" | "ts" | "tt" | "tw" | "ty" | "ug" | "uk" | "ur" | "uz" | "ve" | "vi" | "vo" | "wa" | "wo" | "xh" | "yi" | "yo" | "za" | "zh" | "zu";

export type Dictionary = Record<string, string>;
export type Dictionaries = Partial<Record<Language, Dictionary>>;

export type TranslateFunction = (word: string) => string;
export type SetLanguageFunction = (lang: Language) => void | Promise<void>;
export type GetLanguageFunction = () => Language;
export type AddDictionaryFunction = (lang: Language, dict: Dictionary) => void;
export type GetDictionariesFunction = () => Dictionaries;
export type GetDefaultLanguageFunction = (player: Paella) => Language;

let g_currentLang: Language = "en";
let g_defaultLanguage: Language = "en";

const g_dictionaries: Dictionaries = {
};

export function defaultTranslateFunction(word: string) {
    const dict = g_dictionaries[g_currentLang] || {}
    const defaultDict = g_dictionaries[g_defaultLanguage] || {};
    return dict[word] || defaultDict[word] || word;
}

export function defaultSetLanguageFunction(lang: Language) {
    g_currentLang = lang;    
}

export function defaultGetLanguageFunction() {
    return g_currentLang;
}

export function defaultAddDictionaryFunction(lang: Language, dict: Dictionary) {

    g_dictionaries[lang] = g_dictionaries[lang] || {};
    
    for (const key in dict) {
        const translation = dict[key];
        g_dictionaries[lang][key] = translation;
    }
}

export function defaultGetDictionariesFunction() {
    return g_dictionaries;
}

export function defaultGetDefaultLanguageFunction(player: Paella) {
    return player.config.defaultLanguage || navigator.language;
}

let g_translateFunc: TranslateFunction = defaultTranslateFunction;

let g_setLanguageFunc: SetLanguageFunction = defaultSetLanguageFunction;

let g_getLanguageFunc: GetLanguageFunction = defaultGetLanguageFunction;

let g_defaultAddDictionary: AddDictionaryFunction = defaultAddDictionaryFunction;

let g_defaultGetDictionaries: GetDictionariesFunction = defaultGetDictionariesFunction;

let g_defaultGetDefaultLang: GetDefaultLanguageFunction = defaultGetDefaultLanguageFunction;

export function translate(word?: string | null, keys: string[] | null = null) {
    const translated = word && g_translateFunc(word);
    if (translated && keys && Array.isArray(keys)) {
        let result = translated;
        keys.forEach((key,index) => {
            const temp = `$${index + 1}`;
            result = result.replace(temp,key);
        });
        return result;
    }
    else {
        return translated;
    }
}

export function setLanguage(lang: Language): Promise<void> {
    return enqueuePreparation(async () => {
        await g_setLanguageFunc(lang);
        await prepareRegisteredDictionaries();
    });
}

export function getLanguage() {
    return g_getLanguageFunc();
}

export function addDictionary(lang: Language, dict: Dictionary) {
    const order = ++g_dictionaryOrder;
    const orders = g_dictionaryKeyOrders[lang] ||= Object.create(null);
    for (const key of Object.keys(dict)) orders[key] = order;
    g_defaultAddDictionary(lang, dict);
}

export function getDictionaries() {
    return g_defaultGetDictionaries();
}

export function getDefaultLanguage(player: Paella) {
    return g_defaultGetDefaultLang(player);
}

export function setTranslateFunction(fn: TranslateFunction) {
    g_translateFunc = fn;
}

export function setSetLanguageFunction(fn: SetLanguageFunction) {
    g_setLanguageFunc = fn;
}

export function setGetLanguageFunction(fn: GetLanguageFunction) {
    g_getLanguageFunc = fn;
}

export function setAddDictionaryFunction(fn: AddDictionaryFunction) {
    g_defaultAddDictionary = fn;
}

export function setGetDictionariesFunction(fn: GetDictionariesFunction) {
    g_defaultGetDictionaries = fn;
}

export function setGetDefaultLanguageFunction(fn: GetDefaultLanguageFunction) {
    g_defaultGetDefaultLang = fn;
}

export function setupDefaultLanguage(player: Paella) {
    g_defaultLanguage = getDefaultLanguage(player);
}

// Providers are activated at their original lifecycle position. Keep that write
// order when a language is loaded later, including application/config overrides.
interface RegisteredDictionaryProvider {
    getDictionaries(language?: string): Promise<Dictionaries | null>;
}
interface DictionaryRegistration {
    provider: RegisteredDictionaryProvider;
    order: number;
    prepared: Set<string>;
}
const g_dictionaryProviders = new Map<object, Map<object, DictionaryRegistration>>();
const g_dictionaryKeyOrders: Record<string, Record<string, number>> = Object.create(null);
let g_dictionaryOrder = 0;
let g_preparation: Promise<void> = Promise.resolve();

function enqueuePreparation(operation: () => Promise<void>): Promise<void> {
    const pending = g_preparation.then(operation);
    // Observe errors without hiding them from the caller or poisoning retries.
    g_preparation = pending.catch(() => {});
    return pending;
}

export function registerDictionaryProvider(owner: object, provider: RegisteredDictionaryProvider): void {
    let providers = g_dictionaryProviders.get(owner);
    if (!providers) {
        providers = new Map();
        g_dictionaryProviders.set(owner, providers);
    }
    if (!providers.has(provider)) {
        providers.set(provider, { provider, order: ++g_dictionaryOrder, prepared: new Set() });
    }
}

export function unregisterDictionaryProviders(owner: object): void {
    g_dictionaryProviders.delete(owner);
}

async function prepareRegisteredDictionaries(): Promise<void> {
    const languages = new Set<string>([getLanguage(), g_defaultLanguage]);
    // Sequential application is intentional: completion order must not change precedence.
    for (const providers of g_dictionaryProviders.values()) {
        for (const registration of providers.values()) {
            for (const language of languages) {
                if (registration.prepared.has(language)) continue;
                const dictionaries = await registration.provider.getDictionaries(language);
                if (dictionaries) {
                    for (const [code, dictionary] of Object.entries(dictionaries)) {
                        if (!dictionary || registration.prepared.has(code)) continue;
                        const orders = g_dictionaryKeyOrders[code] ||= Object.create(null);
                        const additions: Dictionary = {};
                        for (const [key, value] of Object.entries(dictionary)) {
                            if ((orders[key] ?? -1) <= registration.order) {
                                additions[key] = value;
                                orders[key] = registration.order;
                            }
                        }
                        if (Object.keys(additions).length) g_defaultAddDictionary(code as Language, additions);
                        registration.prepared.add(code);
                    }
                }
                registration.prepared.add(language);
            }
        }
    }
}

/** Prepare the current selection without calling the application's language setter. */
export function prepareDictionaries(): Promise<void> {
    return enqueuePreparation(prepareRegisteredDictionaries);
}
