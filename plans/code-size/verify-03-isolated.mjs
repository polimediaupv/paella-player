// The development watchers may own dist/. Verify production without stopping them.
import { cp, mkdir, mkdtemp, readdir, symlink, access, writeFile, rm } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
const source = process.cwd();
const step = process.argv[2] || '03';
if (!['03', '04'].includes(step)) throw Error(`Unsupported verification step: ${step}`);
const base = join(tmpdir(), 'opencode');
await mkdir(base, { recursive: true });
const snapshot = await mkdtemp(join(base, `paella-production-${step}-`));
try {
    const omitted = new Set(['node_modules', 'dist', '.git', '.turbo', 'test-results', 'playwright-report']);
    for (const path of ['package.json', 'package-lock.json', 'turbo.json', '.gitignore', 'repos', 'samples', 'test', 'plans/code-size']) {
        await cp(join(source, path), join(snapshot, path), { recursive: true,
            filter: path => !relative(source, path).split('/').some(part => omitted.has(part)) });
    }
    const targetModules = join(snapshot, 'node_modules');
    await mkdir(targetModules);
    for (const entry of await readdir(join(source, 'node_modules'))) {
        if (entry === '@asicupv') {
            await mkdir(join(targetModules, entry));
            for (const name of await readdir(join(source, 'node_modules', entry))) {
                await symlink(join(snapshot, 'repos', name), join(targetModules, entry, name));
            }
        }
        else await symlink(join(source, 'node_modules', entry), join(targetModules, entry));
    }
    for (const parent of ['repos', 'samples', 'test']) {
        for (const entry of await readdir(join(snapshot, parent), { withFileTypes: true })) {
            if (!entry.isDirectory()) continue;
            const modules = join(source, parent, entry.name, 'node_modules');
            try { await access(modules); }
            catch { continue; }
            await symlink(modules, join(snapshot, parent, entry.name, 'node_modules'));
        }
    }
    console.log(`Isolated production verification: ${snapshot}`);
    const run = (command, args) => execFileSync(command, args, { cwd: snapshot, stdio: 'inherit' });
    try {
        const output = execFileSync('npm', ['exec', 'turbo', 'run', 'build', '--', '--filter=development-player-ts...', '--force', '--concurrency=1'],
            { cwd: snapshot, encoding: 'utf8', stdio: 'pipe' });
        console.log(output.split('\n').filter(line => /Tasks:|Cached:|Time:/.test(line)).join('\n'));
    }
    catch (error) {
        console.error(error.stdout?.toString(), error.stderr?.toString());
        throw error;
    }
    for (const name of ['paella-basic-plugins', 'paella-slide-plugins', 'paella-zoom-plugin', 'paella-extra-plugins', 'paella-ai-plugins']) {
        run('npm', ['exec', `--workspace=@asicupv/${name}`, '--', 'tsc', '--noEmit']);
    }
    console.log('Typecheck: 5 migrated packages passed');
    run(process.execPath, ['--test',
        'plans/code-size/localization.test.mjs', 'plans/code-size/lazy-dictionaries.test.mjs',
        'plans/code-size/core-production.test.mjs', 'plans/code-size/core-artifacts.test.mjs',
        'plans/code-size/plugin-artifacts.test.mjs', 'plans/code-size/plugin-sample.test.mjs',
        ...(step === '04' ? ['plans/code-size/minification.test.mjs'] : [])]);
    const sizes = execFileSync(process.execPath, ['plans/code-size/measure.mjs'], { cwd: snapshot, encoding: 'utf8' });
    await writeFile(join(source, `plans/code-size/${step}-sizes.json`), sizes);
}
finally {
    await rm(snapshot, { recursive: true, force: true });
}
