# AGENTS

## Repo shape (npm workspaces + Turbo)
- This is a monorepo with npm workspaces at `repos/*` (publishable libraries) and `samples/*` (example apps).
- Root orchestration is Turbo (`turbo.json`); root scripts are the authoritative entrypoint for cross-package work.
- Turbo task dependencies use `^build` to build package dependencies first.

## Monorepo dependency conventions
- `@asicupv/paella-core` is the host/runtime package for the plugin ecosystem.
- For plugin/library packages in `repos/*` that consume core APIs, declare `@asicupv/paella-core` in `peerDependencies` (not `dependencies`).
- Keep actual runtime third-party libraries in `dependencies` (for example `hls.js` in `paella-video-plugins`), and keep build/type tooling in `devDependencies`.

## High-value commands
- Install: `npm ci` (repo uses `package-lock.json`, `packageManager: npm@10.2.4`).
- Build all: `npm run build`.
- Build only libraries: `npm run build:libs`.
- Build only samples: `npm run build:samples`.
- Dev across library packages: `npm run dev:libs`.
- Main local demo loop: `npm run dev` (targets `development-player-ts` via Turbo filter).
- i18n validation across packages that implement it: `npm run i18n:check`.

## Package build conventions (easy to guess wrong)
- Most packages in `repos/*` use Vite library mode with `root: ./src` and output to `dist/`.
- There are two build patterns:
  - `vite build --emptyOutDir && npm run bundle:types` (e.g. `paella-core`, basic/slide/video/zoom/webgl/user-tracking).
  - `tsc && vite build --emptyOutDir` (e.g. `paella-ai-plugins`, `paella-extra-plugins`, `paella-embedapi`).
- If you change exported types, run the package `build` script (not only `vite build`) so declaration outputs stay consistent.

## Entry points and boundaries
- Core runtime entrypoint is `repos/paella-core/src/js/index.ts` (exports core APIs and imports core CSS).
- Plugin packages expose aggregations from their `src/index.ts` (for example `basicPlugins`, `videoPlugins`, `webglPlugins`, `extraPlugins`, `aiToolsPlugins`).
- Fastest integration sanity check is the TS sample at `samples/development-player-ts` (`src/main.ts` wires core + most plugin packages together).

## CSS + plugin wiring gotcha
- Paella 2.x expects explicit plugin and stylesheet imports in consuming apps; do not assume plugin CSS is auto-injected.
- When changing plugin exports or public usage patterns, verify against `samples/development-player-ts/src/main.ts` import style.

## Testing / CI reality
- There is no root `test` script or unified lint/typecheck pipeline configured at the monorepo root.
- CI workflows present in this repo are mostly legacy per-package publish workflows under `repos/*/.github/workflows/npm-publish.yml`.
- For verification, prefer targeted package builds and sample builds over searching for nonexistent global test commands.

## Release/versioning workflow hooks
- Changesets is configured at root (`.changeset/config.json`, `baseBranch: main`).
- Useful release commands: `npm run changeset:add`, `npm run changeset:version`, `npm run changeset:status`, `npm run changeset:publish`.
- `changeset:publish` runs `build:libs` first; if library changes fail to build, publish will fail.
