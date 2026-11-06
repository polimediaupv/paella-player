import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { staticServer } from './production-tools.mjs';

const require = createRequire(resolve('repos/paella-core/package.json'));
const { resolveConfig } = await import(pathToFileURL(require.resolve('vite')).href);
const { TraceMap, decodedMappings, originalPositionFor, sourceContentFor } = require('@jridgewell/trace-mapping');
const { chromium } = createRequire(resolve('test/e2e/package.json'))('@playwright/test');

test('production uses Oxc, development stays readable, sourcemaps and library defaults remain enabled', async () => {
    for (const [config, root] of [
        ['repos/paella-core/vite.config.js', 'repos/paella-core/src'],
        ['samples/development-player-ts/vite.config.ts', 'samples/development-player-ts']
    ]) {
        for (const mode of ['production', 'development']) {
            const resolved = await resolveConfig({ configFile: resolve(config), root: resolve(root), mode }, 'build', mode);
            assert.equal(resolved.build.minify, mode === 'development' ? false : 'oxc');
            assert.equal(resolved.build.sourcemap, true);
            assert.equal(!!resolved.build.cssMinify, mode !== 'development');
            // Let Vite preserve ESM-library annotations; don't override output
            // minification or introduce property mangling.
            assert.equal(resolved.build.rollupOptions.output?.minify, undefined);
        }
    }
    const core = await readFile('repos/paella-core/dist/paella-core.js', 'utf8');
    assert.match(core, /\/\*\s*[@#]__PURE__\s*\*\//, 'pure annotations survive library minification');
});

function firstMapping(trace) {
    for (const [line, segments] of decodedMappings(trace).entries()) {
        const segment = segments.find(segment => segment.length >= 4);
        if (segment) return { line: line + 1, column: segment[0] };
    }
    throw Error('No mapped positions');
}

async function traceToSource(mapFile, position, allowJsonSourceOnly = false) {
    for (let depth = 0; depth < 4; depth++) {
        const trace = new TraceMap(JSON.parse(await readFile(mapFile, 'utf8')));
        const original = originalPositionFor(trace, position);
        // Vite's JSON transform already emitted source-only maps before this
        // step. Preserve the original data without inventing code positions.
        if (!original.source && allowJsonSourceOnly && trace.sources.length === 1 && trace.sources[0].endsWith('.json')) {
            return { source: resolve(dirname(mapFile), trace.sources[0]),
                content: sourceContentFor(trace, trace.sources[0]), line: null, column: null };
        }
        assert(original.source && original.line !== null && original.column !== null);
        const content = sourceContentFor(trace, original.source);
        assert.equal(typeof content, 'string');
        const source = resolve(dirname(mapFile), original.source);
        if (!source.endsWith('.js')) return { ...original, source, content };
        mapFile = `${source}.map`;
        position = original;
    }
    throw Error('Sourcemap chain did not reach an original source');
}

test('production maps retain embedded sources, JS mappings and source-only JSON artifacts', async () => {
    for (const directory of ['repos/paella-core/dist', 'samples/development-player-ts/dist/assets']) {
        let count = 0, sourceOnlyJson = 0;
        for (const file of (await readdir(directory)).filter(file => file.endsWith('.js'))) {
            const map = JSON.parse(await readFile(`${directory}/${file}.map`, 'utf8'));
            assert(map.sources.length > 0, file);
            assert.equal(map.sourcesContent.length, map.sources.length, file);
            assert(map.sourcesContent.every(content => typeof content === 'string'), file);
            const trace = new TraceMap(map);
            if (map.sources.every(source => source.endsWith('.json')) && !map.mappings) {
                for (const source of map.sources) {
                    assert.equal(sourceContentFor(trace, source), await readFile(resolve(directory, source), 'utf8'));
                }
                sourceOnlyJson++;
                continue;
            }
            const original = originalPositionFor(trace, firstMapping(trace));
            assert(original.source && original.line > 0, file);
            assert.equal(typeof sourceContentFor(trace, original.source), 'string', file);
            // The consumer map first points to the library output. Trace its
            // English language chunk all the way back to the original JSON.
            if (map.sources.some(source => /paella-core\/dist\/en-US-/.test(source))) {
                const source = await traceToSource(resolve(directory, `${file}.map`), firstMapping(trace), true);
                assert(source.source.endsWith('/paella-core/src/i18n/en-US.json'));
                assert.equal(source.content, await readFile('repos/paella-core/src/i18n/en-US.json', 'utf8'));
            }
            count++;
        }
        console.log(`${directory}: ${count} JS maps with valid positions, ${sourceOnlyJson} source-only JSON maps; all sources embedded`);
    }
});

test('a real exception from the minified sample traces back through core to Paella.ts', async () => {
    const root = resolve('samples/development-player-ts/dist');
    const server = await staticServer(root);
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        page.setDefaultTimeout(15000);
        await page.route('https://**/*', route => route.fulfill({ contentType: 'image/gif',
            body: Buffer.from('R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', 'base64') }));
        await page.goto(`${server.url}/?id=belmar-single`);
        await page.waitForFunction(() => window.__paella_instances__?.[0]?.state === 2);
        const stack = await page.evaluate(async () => {
            try { await window.__paella_instances__[0].loadUrl(''); }
            catch (error) { return error.stack; }
        });
        const frame = stack.match(/(http:\/\/[^\s)]+\.js):(\d+):(\d+)/);
        assert(frame, stack);
        const mapFile = resolve(root, '.' + new URL(frame[1]).pathname + '.map');
        const original = await traceToSource(mapFile, { line: Number(frame[2]), column: Number(frame[3]) - 1 });
        assert(original.source.endsWith('/paella-core/src/js/Paella.ts'), original.source);
        const context = original.content.split('\n').slice(original.line - 2, original.line + 1).join('\n');
        assert.match(context, /loadUrl\(\): Invalid current player state/);
        console.log(`Minified browser exception mapped to Paella.ts:${original.line}:${original.column}`);
    }
    finally {
        if (browser) await browser.close();
        await server.close();
    }
});
