type Dictionary = Record<string, string>;

const defaultDictionaries: Record<string, Dictionary> = {};

import enUS from './en-US.json';
import esES from './es-ES.json';
import deDE from './de-DE.json';
import frFR from './fr-FR.json';
import itIT from './it-IT.json';
import caES from './ca-ES.json';

defaultDictionaries['en-US'] = enUS;
defaultDictionaries['en'] = enUS;
defaultDictionaries['es-ES'] = esES;
defaultDictionaries['es'] = esES;
defaultDictionaries['de-DE'] = deDE;
defaultDictionaries['de'] = deDE;
defaultDictionaries['fr-FR'] = frFR;
defaultDictionaries['fr'] = frFR;
defaultDictionaries['it-IT'] = itIT;
defaultDictionaries['it'] = itIT;
defaultDictionaries['ca-ES'] = caES;
defaultDictionaries['ca'] = caES;

export default defaultDictionaries;
