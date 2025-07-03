import type { Dictionary, Language } from '@asicupv/paella-core';
const defaultDictionaries: Partial<Record<Language, Dictionary>> = {};

import enUS from './en-US.json';
import esES from './es-ES.json';

defaultDictionaries['en-US' as Language] = enUS;
defaultDictionaries['en' as Language] = enUS;
defaultDictionaries['es-ES' as Language] = esES;
defaultDictionaries['es' as Language] = esES;

export default defaultDictionaries;
