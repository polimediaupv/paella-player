import { createDictionaryLoader } from '@asicupv/paella-core';

export default createDictionaryLoader({
    'en-US': () => import('./en-US.json'),
    'es-ES': () => import('./es-ES.json'),
    'de-DE': () => import('./de-DE.json'),
    'fr-FR': () => import('./fr-FR.json'),
    'it-IT': () => import('./it-IT.json'),
    'ca-ES': () => import('./ca-ES.json')
}, {
    en: 'en-US', es: 'es-ES', de: 'de-DE', fr: 'fr-FR', it: 'it-IT', ca: 'ca-ES'
});
