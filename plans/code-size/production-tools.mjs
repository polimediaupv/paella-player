import { mkdir, mkdtemp, readFile, copyFile } from 'node:fs/promises';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer } from 'node:http';
import { execFileSync } from 'node:child_process';

export const migratedPackages = [
    ['paella-basic-plugins', 'VolumeButtonPlugin'],
    ['paella-slide-plugins', 'ArrowSlidesPlugin'],
    ['paella-zoom-plugin', 'ZoomCanvasPlugin'],
    ['paella-extra-plugins', 'VersionPlugin'],
    ['paella-ai-plugins', 'AIContentPlugin']
];
export const regions = ['en-US', 'es-ES', 'de-DE', 'fr-FR', 'it-IT', 'ca-ES'];
export const supported = pkg => pkg === 'paella-zoom-plugin' ? ['en-US', 'es-ES', 'de-DE', 'ca-ES'] : regions;

// Only files listed by npm pack are copied; no workspace links or source files.
export async function publishedSandbox() {
    const base = join(tmpdir(), 'opencode');
    await mkdir(base, { recursive: true });
    const root = await mkdtemp(join(base, 'paella-dictionaries-'));
    const packages = [];
    for (const name of ['paella-core', 'paella-embedapi', ...migratedPackages.map(([name]) => name)]) {
        const source = resolve('repos', name);
        const [pack] = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json'], { cwd: source, encoding: 'utf8' }));
        const directory = join(root, 'node_modules', '@asicupv', name);
        for (const { path } of pack.files) {
            const target = join(directory, path);
            await mkdir(dirname(target), { recursive: true });
            await copyFile(join(source, path), target);
        }
        const manifest = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
        packages.push({ name, directory, manifest, files: pack.files.map(file => file.path) });
    }
    return { root, packages };
}

export async function staticServer(root, html) {
    root = resolve(root);
    const types = { '.js': 'text/javascript', '.cjs': 'text/javascript', '.html': 'text/html',
        '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg',
        '.png': 'image/png', '.gif': 'image/gif', '.wasm': 'application/wasm' };
    const server = createServer(async (request, response) => {
        const pathname = new URL(request.url, 'http://localhost').pathname;
        if (pathname === '/' && html) {
            response.setHeader('Content-Type', 'text/html');
            response.end(html);
            return;
        }
        try {
            const path = resolve(root, '.' + decodeURIComponent(pathname === '/' ? '/index.html' : pathname));
            if (!path.startsWith(root + sep)) throw Error('invalid path');
            const data = await readFile(path);
            response.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream');
            response.end(data);
        }
        catch { response.writeHead(404).end(); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    return { url: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}
