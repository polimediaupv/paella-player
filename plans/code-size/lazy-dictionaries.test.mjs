import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(resolve('repos/paella-core/package.json'));
const ts = require('typescript');
let instance = 0;
async function load(name) {
    const source = await readFile(`repos/paella-core/src/js/core/${name}.ts`, 'utf8');
    const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
    return import(`data:text/javascript;base64,${Buffer.from(outputText + `\n// ${instance++}`).toString('base64')}`);
}

test('loader: exact aliases share in-flight imports, all-language API, unknown codes and retry', async () => {
    const { createDictionaryLoader } = await load('DictionaryLoader');
    let imports = 0;
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    const get = createDictionaryLoader({
        'es-ES': async () => { imports++; await gate; return { default: { key: 'español' } }; },
        en: async () => ({ default: { key: 'English' } })
    }, { es: 'es-ES' });
    const a = get('es');
    const b = get('es-ES');
    await Promise.resolve();
    assert.equal(imports, 1);
    release();
    assert.deepEqual(await a, await b);
    assert.deepEqual(Object.keys(await get()).sort(), ['en', 'es', 'es-ES']);
    assert.equal(imports, 1);
    assert.equal(await get('ES'), null);
    assert.equal(await get('es-MX'), null);
    assert.equal(await get('toString'), null);
    let attempts = 0;
    const retry = createDictionaryLoader({ en: async () => {
        if (++attempts === 1) throw Error('temporary');
        return { default: { key: 'retried' } };
    } });
    await assert.rejects(retry('en'), /temporary/);
    assert.equal((await retry('en')).en.key, 'retried');
    assert.equal(attempts, 2);
});

test('coordinator: selective and legacy providers, fallback, late registration and override order', async () => {
    const l = await load('Localization');
    const owner = {};
    l.setupDefaultLanguage({ config: { defaultLanguage: 'en' } });
    await l.setLanguage('es');
    const calls = [];
    l.registerDictionaryProvider(owner, { async getDictionaries(language) {
        calls.push(language);
        return { [language]: { key: `module:${language}`, only: 'module' } };
    } });
    await l.prepareDictionaries();
    assert.deepEqual(calls, ['es', 'en']);
    let legacyCalls = 0;
    l.registerDictionaryProvider(owner, { async getDictionaries() {
        legacyCalls++;
        return { es: { key: 'legacy' }, en: { fallback: 'English' } };
    } });
    await l.prepareDictionaries();
    assert.equal(legacyCalls, 1);
    assert.equal(l.translate('key'), 'legacy');
    assert.equal(l.translate('fallback'), 'English');
    // Config dictionaries are added at startup for *all* languages, even those
    // whose provider chunks have not yet been requested.
    l.addDictionary('fr', { key: 'config:fr' });
    l.addDictionary('es', { key: 'config:es' });
    await l.setLanguage('fr');
    assert.equal(l.translate('key'), 'config:fr');
    assert.equal(l.translate('only'), 'module');
    const count = calls.length;
    await l.setLanguage('es');
    await l.setLanguage('fr');
    assert.equal(calls.length, count);
    assert.equal(l.translate('key'), 'config:fr');
    // Individual UI providers activate on load, after core/config, as before.
    l.registerDictionaryProvider(owner, { async getDictionaries(language) {
        return { [language]: { key: `individual:${language}` } };
    } });
    await l.prepareDictionaries();
    assert.equal(l.translate('key'), 'individual:fr');
    l.addDictionary('fr', { key: 'application:fr' });
    await l.setLanguage('fr');
    assert.equal(l.translate('key'), 'application:fr');
    l.unregisterDictionaryProviders(owner);
    const unregistered = calls.length;
    await l.setLanguage('it');
    assert.equal(calls.length, unregistered);
});

test('coordinator: async/sync custom callbacks, custom storage and missing exact fallback', async () => {
    const l = await load('Localization');
    const store = {};
    let selected = 'en';
    const events = [];
    l.setSetLanguageFunction(async lang => {
        events.push('setter:start');
        await Promise.resolve();
        selected = lang;
        events.push('setter:end');
    });
    l.setGetLanguageFunction(() => selected);
    l.setAddDictionaryFunction((lang, dictionary) => { Object.assign(store[lang] ||= {}, dictionary); });
    l.setGetDictionariesFunction(() => store);
    l.setGetDefaultLanguageFunction(() => 'en-US');
    l.setupDefaultLanguage({});
    l.registerDictionaryProvider({}, { async getDictionaries(lang) {
        events.push(`provider:${lang}`);
        return lang === 'en-US' ? { 'en-US': { key: 'fallback' } } : null;
    } });
    await l.setLanguage('zz');
    assert.deepEqual(events, ['setter:start', 'setter:end', 'provider:zz', 'provider:en-US']);
    assert.equal(l.getDictionaries(), store);
    assert.equal(store['en-US'].key, 'fallback');
    assert.equal(store.en, undefined);
    l.setTranslateFunction(word => store[selected]?.[word] || store['en-US']?.[word] || word);
    assert.equal(l.translate('key'), 'fallback');
    l.setSetLanguageFunction(lang => { selected = lang; });
    await l.setLanguage('en-US');
    assert.equal(l.translate('key'), 'fallback');
});

test('coordinator: rejection is propagated, retry is possible, concurrent setters are ordered', async () => {
    const l = await load('Localization');
    l.setupDefaultLanguage({ config: { defaultLanguage: 'en' } });
    let attempts = 0;
    l.registerDictionaryProvider({}, { async getDictionaries(language) {
        if (language === 'es' && ++attempts === 1) throw Error('failed import');
        return { [language]: { key: language } };
    } });
    await assert.rejects(l.setLanguage('es'), /failed import/);
    await l.setLanguage('es');
    assert.equal(l.translate('key'), 'es');
    assert.equal(attempts, 2);
    await Promise.all([l.setLanguage('fr'), l.setLanguage('it')]);
    assert.equal(l.getLanguage(), 'it');
    assert.equal(l.translate('key'), 'it');
});

test('coordinator: application writes during an import keep precedence, equal fallback is requested once', async () => {
    const l = await load('Localization');
    l.setupDefaultLanguage({ config: { defaultLanguage: 'es' } });
    let release, started;
    const gate = new Promise(resolve => { release = resolve; });
    const entered = new Promise(resolve => { started = resolve; });
    let calls = 0;
    l.registerDictionaryProvider({}, { async getDictionaries(language) {
        calls++;
        started();
        await gate;
        return { [language]: { key: 'provider', extra: 'loaded' } };
    } });
    const pending = l.setLanguage('es');
    await entered;
    l.addDictionary('es', { key: 'application' });
    release();
    await pending;
    assert.equal(calls, 1);
    assert.equal(l.translate('key'), 'application');
    assert.equal(l.translate('extra'), 'loaded');
});
