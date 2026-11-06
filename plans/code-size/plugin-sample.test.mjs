import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { staticServer, migratedPackages, supported } from './production-tools.mjs';
const { chromium } = createRequire(resolve('test/e2e/package.json'))('@playwright/test');

test('production sample: only active/fallback languages, consumer chunk paths and alias cache', async () => {
    const root = 'samples/development-player-ts/dist';
    const assets = `${root}/assets`;
    const dictionaries = new Map();
    for (const file of (await readdir(assets)).filter(file => file.endsWith('.js.map'))) {
        const map = JSON.parse(await readFile(`${assets}/${file}`, 'utf8'));
        const sources = [];
        for (const source of map.sources) {
            const match = source.match(/\/repos\/([^/]+)\/dist\/([^/]+)$/);
            const language = match?.[2].match(/(?:^|-)(en-US|es-ES|de-DE|fr-FR|it-IT|ca-ES|en|es)(?:-|\.)/)?.[1];
            if (language) sources.push(`${match[1]}:${language}`);
        }
        if (sources.length) dictionaries.set(file.replace(/\.map$/, ''), sources);
    }
    assert.equal(dictionaries.size, 36, 'six principal providers (zoom: four languages) + two core help chunks');
    const server = await staticServer(root);
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        for (const [locale, fallback] of [['es-ES', 'en'], ['it-IT', 'de-DE']]) {
            const context = await browser.newContext({ locale });
            const page = await context.newPage();
            page.setDefaultTimeout(15000);
            const requests = [], errors = [], failed = [];
            page.on('request', request => {
                if (request.url().startsWith(server.url) && request.url().endsWith('.js')) requests.push(basename(new URL(request.url()).pathname));
            });
            page.on('pageerror', error => errors.push(error.message));
            page.on('response', response => {
                if (response.url().endsWith('.js') && response.status() >= 400) failed.push(response.url());
            });
            page.on('requestfailed', request => { if (request.url().endsWith('.js')) failed.push(request.url()); });
            await page.route('**/config/config.json', async route => {
                const config = JSON.parse(await readFile(`${root}/config/config.json`, 'utf8'));
                await route.fulfill({ json: { ...config, defaultLanguage: fallback } });
            });
            // Only the local manifest/preview phase is exercised, not remote video playback.
            await page.route('https://**/*', route => route.fulfill({ contentType: 'image/gif',
                body: Buffer.from('R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', 'base64') }));
            await page.goto(`${server.url}/?id=belmar-single`);
            await page.waitForFunction(() => window.__paella_instances__?.[0]?.state === 2);
            const info = await page.evaluate(() => {
                const p = window.__paella_instances__[0];
                return { language: p.getLanguage(), modules: p.pluginModules.map(module => module.moduleName.replace(/^@asicupv\//, '')) };
            });
            const language = locale.substring(0, 2);
            assert.equal(info.language, language);
            for (const [name] of migratedPackages) assert(info.modules.includes(name), `registered module ${name}`);
            const expected = new Set();
            for (const code of [language, fallback]) {
                for (const name of ['paella-core', ...migratedPackages.map(([name]) => name)]) {
                    const region = supported(name).find(region => region === code || region.slice(0, 2) === code);
                    if (region) expected.add(`${name}:${region}`);
                }
                if (['es', 'en'].includes(code)) expected.add(`paella-core:${code}`);
            }
            const actual = () => new Set(requests.flatMap(file => dictionaries.get(file) || []));
            assert.deepEqual([...actual()].sort(), [...expected].sort(), `${locale}, fallback ${fallback}`);
            const initialCount = requests.filter(file => dictionaries.has(file)).length;
            assert.equal(initialCount, expected.size, 'no duplicate language requests');
            console.log(`sample ${locale}, fallback ${fallback}: ${initialCount} language chunks`);
            if (locale === 'es-ES') {
                await page.evaluate(async () => { await window.__paella_instances__[0].setLanguage('fr'); });
                for (const name of ['paella-core', ...migratedPackages.map(([name]) => name)]) {
                    if (supported(name).includes('fr-FR')) expected.add(`${name}:fr-FR`);
                }
                assert.deepEqual([...actual()].sort(), [...expected].sort());
                const afterFrench = requests.length;
                await page.evaluate(async () => {
                    await window.__paella_instances__[0].setLanguage('fr-FR');
                    await window.__paella_instances__[0].setLanguage('fr');
                });
                assert.equal(requests.length, afterFrench, 'French aliases do not download chunks again');
            }
            assert.deepEqual(errors, []);
            assert.deepEqual(failed, []);
            await context.close();
        }
    }
    finally {
        if (browser) await browser.close();
        await server.close();
    }
});
