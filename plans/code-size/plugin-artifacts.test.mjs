import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join, posix, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { publishedSandbox, staticServer, migratedPackages, supported } from './production-tools.mjs';

const require = createRequire(resolve('test/e2e/package.json'));
const { chromium } = require('@playwright/test');
const ts = createRequire(resolve('repos/paella-core/package.json'))('typescript');

test('published libraries: ESM/CJS paths, maps, selective providers, aliases and complete dictionaries', async () => {
    const sandbox = await publishedSandbox();
    let server, browser;
    try {
        const imports = {};
        for (const pkg of sandbox.packages) {
            const rootExport = pkg.manifest.exports['.'];
            const entry = typeof rootExport === 'string' ? rootExport : rootExport.import;
            imports[pkg.manifest.name] = `/node_modules/@asicupv/${pkg.name}/${entry.replace(/^\.\//, '')}`;
            const files = new Set(pkg.files);
            for (const exported of typeof rootExport === 'string' ? [rootExport] : Object.values(rootExport)) {
                assert(files.has(exported.replace(/^\.\//, '')), `published export ${pkg.name}: ${exported}`);
            }
            let languages = 0;
            for (const file of pkg.files.filter(file => /\.(js|cjs)$/.test(file))) {
                const code = await readFile(join(pkg.directory, file), 'utf8');
                const ast = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
                function visit(node) {
                    let specifier;
                    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
                        specifier = node.moduleSpecifier;
                    }
                    if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
                        (ts.isIdentifier(node.expression) && node.expression.text === 'require'))) specifier = node.arguments[0];
                    if (specifier && ts.isStringLiteralLike(specifier) && specifier.text.startsWith('.')) {
                        assert(files.has(posix.join(posix.dirname(file), specifier.text)), `${pkg.name}/${file}: ${specifier.text}`);
                    }
                    ts.forEachChild(node, visit);
                }
                visit(ast);
                const mapName = code.match(/sourceMappingURL=([^\s]+)/)?.[1];
                if (mapName) assert(files.has(posix.join(posix.dirname(file), mapName)), `published map ${file}`);
                const map = mapName && JSON.parse(await readFile(join(pkg.directory, posix.dirname(file), mapName), 'utf8'));
                const dictionarySources = map?.sources.filter(source => /\/i18n\/[^/]+\.json$/.test(source)) || [];
                const isEntry = file === entry.replace(/^\.\//, '') || file === rootExport.require?.replace(/^\.\//, '');
                if (isEntry) assert.equal(dictionarySources.length, 0, `no eager dictionaries in ${pkg.name}/${file}`);
                if (dictionarySources.length) {
                    assert(mapName, `dictionary sourcemap ${file}`);
                    languages++;
                }
            }
            if (migratedPackages.some(([name]) => name === pkg.name)) {
                assert.equal(languages, supported(pkg.name).length * (pkg.name === 'paella-extra-plugins' ? 2 : 1), pkg.name);
            }
            if (pkg.name === 'paella-embedapi') assert.equal(languages, 0, 'embedapi must not rebundle core dictionaries');
        }

        server = await staticServer(sandbox.root, `<script type="importmap">${JSON.stringify({ imports })}</script>`);
        browser = await chromium.launch({ headless: true });
        for (const [name, plugin] of migratedPackages) {
            const context = await browser.newContext();
            const page = await context.newPage();
            const requested = [];
            page.on('request', request => requested.push(new URL(request.url()).pathname));
            await page.goto(server.url);
            await page.evaluate(async ({ name, plugin }) => {
                const exports = await import(`@asicupv/${name}`);
                window.provider = new exports[plugin]({}, 'test').getPluginModuleInstance();
            }, { name, plugin });
            const prefix = `/node_modules/@asicupv/${name}/dist/`;
            const isLanguage = path => path.startsWith(prefix) && /(?:^|[-/])(?:en-US|es-ES|de-DE|fr-FR|it-IT|ca-ES)[-.]/.test(path);
            assert.equal(requested.filter(isLanguage).length, 0, `no eager network requests: ${name}`);
            const selected = await page.evaluate(async () => {
                const provider = window.provider;
                const first = await provider.getDictionaries('en');
                const second = await provider.getDictionaries('en-US');
                return { first, same: first.en === second.en, missing: await provider.getDictionaries('zz'),
                    wrongCase: await provider.getDictionaries('en-us') };
            });
            assert.deepEqual(selected.first.en, JSON.parse(await readFile(`repos/${name}/src/i18n/en-US.json`, 'utf8')));
            assert.deepEqual(Object.keys(selected.first).sort(), ['en', 'en-US']);
            assert.equal(selected.same, true);
            assert.equal(selected.missing, null);
            assert.equal(selected.wrongCase, null);
            assert.equal(requested.filter(isLanguage).length, 1, `alias shares download: ${name}`);
            const all = await page.evaluate(async () => window.provider.getDictionaries());
            const codes = supported(name);
            assert.deepEqual(Object.keys(all).sort(), codes.flatMap(code => [code, code.slice(0, 2)]).sort());
            for (const code of codes) {
                const expected = JSON.parse(await readFile(`repos/${name}/src/i18n/${code}.json`, 'utf8'));
                assert.deepEqual(all[code], expected, `${name}/${code}`);
                const result = await page.evaluate(async code => window.provider.getDictionaries(code.slice(0, 2)), code);
                assert.deepEqual(result[code], expected);
                assert.deepEqual(Object.keys(result).sort(), [code, code.slice(0, 2)].sort());
            }
            if (name === 'paella-zoom-plugin') {
                assert.equal(await page.evaluate(async () => window.provider.getDictionaries('fr')), null);
                assert.equal(await page.evaluate(async () => window.provider.getDictionaries('it-IT')), null);
            }
            assert.equal(requested.filter(isLanguage).length, codes.length, `one request per language: ${name}`);
            console.log(`${name}: ${codes.length} language chunks verified from published files`);
            await context.close();
        }

        // Native require resolves only copied published files. These are browser
        // libraries: a minimal window is needed at import time, not SSR support.
        const cjsExpected = {};
        for (const code of supported('paella-extra-plugins')) {
            const dictionary = JSON.parse(await readFile(`repos/paella-extra-plugins/src/i18n/${code}.json`, 'utf8'));
            cjsExpected[code] = cjsExpected[code.slice(0, 2)] = dictionary;
        }
        const cjs = execFileSync(process.execPath, ['-e', `
            global.window = { addEventListener() {} };
            const assert = require('node:assert/strict');
            const extra = require('@asicupv/paella-extra-plugins');
            const embed = require('@asicupv/paella-embedapi');
            assert.equal(typeof embed.EmbedPlayer, 'function');
            const provider = new extra.VersionPlugin({}, 'test').getPluginModuleInstance();
            (async () => {
                const en = await provider.getDictionaries('en');
                assert.deepEqual(Object.keys(en).sort(), ['en', 'en-US']);
                const all = await provider.getDictionaries();
                assert.deepEqual(all, ${JSON.stringify(cjsExpected)});
                assert.equal(await provider.getDictionaries('zz'), null);
                console.log('CJS: extra + embedapi require and all six language chunks passed');
            })().catch(error => { console.error(error); process.exitCode = 1; });
        `], { cwd: sandbox.root, encoding: 'utf8' });
        console.log(cjs.trim());
    }
    finally {
        if (browser) await browser.close();
        if (server) await server.close();
        await rm(sandbox.root, { recursive: true, force: true });
    }
});
