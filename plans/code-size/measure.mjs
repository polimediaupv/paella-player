// Run from the repository root after the production builds.
import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { gzipSync } from 'node:zlib';
import { createRequire } from 'node:module';
const require = createRequire(resolve('repos/paella-core/package.json'));
const ts = require('typescript');
const root = resolve('samples/development-player-ts/dist');
async function files(dir) {
    return (await Promise.all((await readdir(dir, { withFileTypes: true })).map(e =>
        e.isDirectory() ? files(resolve(dir, e.name)) : resolve(dir, e.name)))).flat();
}
async function measure(label, paths) {
    const rows = await Promise.all(paths.sort().map(async path => {
        const data = await readFile(path);
        return { file: relative(process.cwd(), path), bytes: data.length, gzip: gzipSync(data).length };
    }));
    return { label, files: rows, bytes: rows.reduce((n, r) => n + r.bytes, 0), gzip: rows.reduce((n, r) => n + r.gzip, 0) };
}
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const initial = new Set();
async function visit(path) {
    if (initial.has(path)) return;
    initial.add(path);
    if (!path.endsWith('.js')) return;
    const source = ts.createSourceFile(path, await readFile(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    for (const node of source.statements) {
        if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
            const spec = node.moduleSpecifier.text;
            if (spec.startsWith('.')) await visit(resolve(dirname(path), spec));
        }
    }
}
for (const match of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)) {
    await visit(resolve(root, match[1].replace(/^\//, '')));
}
const reports = [];
for (const pkg of (await readdir('repos', { withFileTypes: true })).filter(e => e.isDirectory()).map(e => e.name).sort()) {
    const paths = await files(resolve('repos', pkg, 'dist'));
    reports.push(await measure(pkg + ' (all emitted JS/CSS, including CJS)', paths.filter(p => /\.([cm]?js|css)$/.test(p))));
}
reports.push(await measure('sample: all emitted JS/CSS', (await files(root)).filter(p => /\.([cm]?js|css)$/.test(p))));
reports.push(await measure('sample: initial static JS/CSS graph (not a browser trace)', [...initial]));
console.log(JSON.stringify({ node: process.version, gzip: 'Node zlib defaults; each response compressed separately', reports }, null, 2));
