import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const ts = createRequire(resolve('repos/paella-core/package.json'))('typescript');

test('core artifacts: published chunks/maps, public declarations and no eager dictionaries', async () => {
    const cwd = 'repos/paella-core';
    const [pack] = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json'], { cwd, encoding: 'utf8' }));
    const published = new Set(pack.files.map(file => file.path));
    const js = (await readdir(`${cwd}/dist`)).filter(file => file.endsWith('.js'));
    assert.equal(js.length, 9);
    for (const file of js) {
        assert(published.has(`dist/${file}`), file);
        assert(published.has(`dist/${file}.map`), `${file}.map`);
        JSON.parse(await readFile(`${cwd}/dist/${file}.map`, 'utf8'));
    }
    assert(published.has('dist/paella-core.css'));
    assert(published.has('dist/paella-core.d.ts'));
    const types = await readFile(`${cwd}/dist/paella-core.d.ts`, 'utf8');
    assert.match(types, /setLanguage\(lang: string\): Promise<void>/);
    assert.match(types, /setLanguage\(lang: Language\): Promise<void>/);
    assert.match(types, /getDictionaries\(_language\?: string\)/);
    assert.match(types, /export declare function createDictionaryLoader/);
    const main = await readFile(`${cwd}/dist/paella-core.js`, 'utf8');
    assert(!main.includes('Que la fuerza te acompañe'));
    assert(!main.includes('Ayuda del botón de reproducción/pausa'));
    const dynamicImports = new Set();
    function visit(node) {
        if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword &&
            ts.isStringLiteralLike(node.arguments[0])) dynamicImports.add(node.arguments[0].text);
        ts.forEachChild(node, visit);
    }
    visit(ts.createSourceFile('paella-core.js', main, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS));
    for (const file of js.filter(file => file !== 'paella-core.js')) {
        assert(dynamicImports.has(`./${file}`), `dynamic import ${file}`);
    }
    console.log(`npm pack --dry-run: ${js.length} JS + ${js.length} maps; CSS and declarations included`);
});
