// Production-only browser check. Uses the existing Playwright installation.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(resolve('test/e2e/package.json'));
const { chromium } = require('@playwright/test');
const dist = resolve('repos/paella-core/dist');

test('production: lifecycle, selective/legacy UI, async setter and requested language chunks only', async () => {
    const server = createServer(async (request, response) => {
        const path = new URL(request.url, 'http://localhost').pathname;
        if (path === '/') {
            response.setHeader('Content-Type', 'text/html');
            response.end('<div id="player"></div>');
            return;
        }
        try {
            if (path !== '/' + basename(path)) throw Error('invalid path');
            const data = await readFile(resolve(dist, '.' + path));
            response.setHeader('Content-Type', path.endsWith('.js') ? 'text/javascript' : 'application/octet-stream');
            response.end(data);
        }
        catch { response.writeHead(404).end(); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ locale: 'es-ES' });
        const page = await context.newPage();
        const requested = [];
        page.on('request', request => {
            const path = new URL(request.url()).pathname;
            if (path.endsWith('.js')) requested.push(path.slice(1));
        });
        await page.goto(`http://127.0.0.1:${server.address().port}/`);
        await page.evaluate(async () => { window.core = await import('/paella-core.js'); });
        assert.deepEqual(requested, ['paella-core.js']);
        const initial = await page.evaluate(async () => {
            const c = window.core;
            const calls = [];
            class Module extends c.PluginModule {
                get moduleName() { return 'test module'; }
                get moduleVersion() { return '1'; }
                async getDictionaries(language) {
                    calls.push(language);
                    return { [language]: { module: `module:${language}`, collision: 'module' } };
                }
            }
            const module = new Module();
            class Member extends c.Plugin {
                get name() { return 'test.member'; }
                getPluginModuleInstance() { return module; }
            }
            class UI extends c.UserInterfacePlugin {
                get name() { return 'test.ui'; }
                get type() { return 'test-ui'; }
                async getDictionaries(language) {
                    return { [language]: { collision: `ui:${language}` } };
                }
                async load() { this.loadedTranslation = this.player.translate('collision'); }
            }
            class LegacyUI extends c.UserInterfacePlugin {
                get name() { return 'test.legacy'; }
                get type() { return 'legacy-ui'; }
                async getDictionaries() { return { es: { legacy: 'antiguo' }, fr: { legacy: 'ancien' } }; }
            }
            class DisabledUI extends UI {
                get name() { return 'test.disabled'; }
                async getDictionaries() { throw Error('disabled provider must not run'); }
            }
            const p = window.player = new c.Paella('player', {
                loadConfig: async () => ({
                    defaultLanguage: 'en-US', logLevel: 'ERROR', plugins: {},
                    dictionaries: { es: { collision: 'config:es' }, fr: { collision: 'config:fr' } }
                }),
                getVideoId: async () => 'test',
                getManifestUrl: async () => '/',
                getManifestFileUrl: async () => '/test.json',
                loadVideoManifest: async () => ({
                    metadata: { preview: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' },
                    streams: [{ content: 'presenter', sources: { mp4: [{ src: '/test.mp4', mimetype: 'video/mp4' }] } }]
                }),
                plugins: [Member, UI, LegacyUI, { plugin: DisabledUI, config: { enabled: false } }]
            });
            let atManifest;
            p.bindEvent(c.Events.MANIFEST_LOADED, () => { atManifest = p.translate('collision'); });
            await p.loadManifest();
            return {
                language: p.getLanguage(), module: p.translate('module'), collision: p.translate('collision'),
                atManifest, calls, translated: p.translate('May the force be with you'),
                formats: c.plugins.filter(ref => ref.plugin.prototype.type === 'video').length,
                parsers: [typeof c.parseWebVTT, typeof c.parseDFXP]
            };
        });
        assert.equal(initial.language, 'es');
        assert.equal(initial.module, 'module:es');
        assert.equal(initial.collision, 'config:es');
        assert.equal(initial.atManifest, 'module');
        assert.deepEqual(initial.calls, ['es', 'en-US']);
        assert.equal(initial.translated, 'Que la fuerza te acompañe');
        assert.deepEqual(initial.parsers, ['function', 'function']);
        assert.equal(initial.formats, 4);
        const chunks = (await readdir(dist)).filter(name => name.endsWith('.js') && name !== 'paella-core.js');
        assert.equal(chunks.length, 8);
        const initialChunks = requested.filter(name => name !== 'paella-core.js');
        assert.equal(initialChunks.length, 3);
        assert(initialChunks.some(name => name.startsWith('es-ES-')));
        assert(initialChunks.some(name => name.startsWith('en-US-')));
        assert(initialChunks.some(name => /^es-(?!ES-).+\.js$/.test(name)));
        assert(!initialChunks.some(name => /^(de|fr|it|ca)-/.test(name)));
        const changed = await page.evaluate(async () => {
            const c = window.core, p = window.player;
            await c.setLanguage('fr');
            const config = p.translate('collision');
            await c.loadPluginsOfType(p, 'test-ui');
            await c.loadPluginsOfType(p, 'legacy-ui');
            const loaded = c.getPluginsOfType(p, 'test-ui')[0].loadedTranslation;
            await p.setLanguage('fr-FR');
            const regional = p.getDictionaries()['fr-FR']['May the force be with you'];
            await p.setLanguage('fr');
            const ui = p.translate('collision');
            p.addDictionary('fr', { collision: 'application' });
            await p.setLanguage('fr');
            return { config, loaded, regional, ui, legacy: p.translate('legacy'), application: p.translate('collision') };
        });
        assert.equal(changed.config, 'config:fr');
        assert.equal(changed.loaded, 'ui:fr');
        assert.equal(changed.ui, 'ui:fr');
        assert.equal(changed.legacy, 'ancien');
        assert.equal(changed.application, 'application');
        assert.equal(changed.regional, 'May the force be with you');
        assert.equal(requested.filter(name => name.startsWith('fr-FR-')).length, 1);
        assert.equal(requested.length, 5);
        const missing = await page.evaluate(async () => {
            await window.player.setLanguage('zz');
            return { language: window.player.getLanguage(), coreKey: window.player.getDictionaries().zz?.['May the force be with you'] };
        });
        assert.equal(missing.language, 'zz');
        assert.equal(missing.coreKey, undefined);
        assert.equal(requested.length, 5);
        console.log('Requested production JS:', requested.join(', '));
        const help = await page.evaluate(async () => {
            const provider = window.core.PaellaCorePlugins.Get();
            const all = await provider.getDictionaries();
            return { codes: Object.keys(all).sort(), absent: await provider.getDictionaries('es-ES') };
        });
        assert.deepEqual(help.codes, ['en', 'es']);
        assert.equal(help.absent, null);
        await context.close();

        const customContext = await browser.newContext({ locale: 'de-DE' });
        const customPage = await customContext.newPage();
        const customRequests = [];
        customPage.on('request', request => {
            const path = new URL(request.url()).pathname;
            if (path.endsWith('.js')) customRequests.push(path.slice(1));
        });
        await customPage.goto(`http://127.0.0.1:${server.address().port}/`);
        const custom = await customPage.evaluate(async () => {
            const c = await import('/paella-core.js');
            const store = {}, events = [];
            let selected = 'en';
            const p = new c.Paella('player', {
                loadConfig: async () => ({ defaultLanguage: 'en-US', plugins: {}, logLevel: 'ERROR',
                    dictionaries: { it: { 'May the force be with you': 'config' } } }),
                getDefaultLanguageFunction: () => 'fr-FR',
                getLanguageFunction: () => selected,
                setLanguageFunction: async lang => {
                    await Promise.resolve();
                    selected = lang;
                    events.push(`setter:${lang}`);
                },
                addDictionaryFunction: (lang, dictionary) => Object.assign(store[lang] ||= {}, dictionary),
                getDictionariesFunction: () => store,
                translateFunction: word => store[selected]?.[word] || store['fr-FR']?.[word] || word,
                loadDictionaries: async player => {
                    events.push('loader:start');
                    await player.setLanguage('it');
                    events.push('loader:end');
                },
                getVideoId: async () => 'test',
                getManifestUrl: async () => '/',
                getManifestFileUrl: async () => '/test.json',
                loadVideoManifest: async () => ({
                    metadata: { preview: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' },
                    streams: [{ content: 'presenter', sources: { mp4: [{ src: '/test.mp4', mimetype: 'video/mp4' }] } }]
                })
            });
            await p.loadManifest();
            const result = { selected, events, codes: Object.keys(p.getDictionaries()).sort(),
                translation: p.translate('May the force be with you') };
            await p.destroy();
            // Destroy unregisters providers; this must not fetch the German chunk.
            await c.setLanguage('de');
            return result;
        });
        assert.equal(custom.selected, 'it');
        assert.deepEqual(custom.events, ['loader:start', 'setter:it', 'loader:end']);
        assert.deepEqual(custom.codes, ['fr', 'fr-FR', 'it', 'it-IT']);
        assert.equal(custom.translation, 'config');
        assert.equal(customRequests.length, 3);
        assert(customRequests.some(name => name.startsWith('it-IT-')));
        assert(customRequests.some(name => name.startsWith('fr-FR-')));
        await customContext.close();
    }
    finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
});
