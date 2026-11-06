import { createDictionaryLoader } from './DictionaryLoader';

export default {
    getDictionaries: createDictionaryLoader({
        'en-US': () => import('../../i18n/en-US.json'),
        'es-ES': () => import('../../i18n/es-ES.json'),
        'de-DE': () => import('../../i18n/de-DE.json'),
        'fr-FR': () => import('../../i18n/fr-FR.json'),
        'it-IT': () => import('../../i18n/it-IT.json'),
        'ca-ES': () => import('../../i18n/ca-ES.json')
    }, {
        en: 'en-US', es: 'es-ES', de: 'de-DE', fr: 'fr-FR', it: 'it-IT', ca: 'ca-ES'
    })
};
