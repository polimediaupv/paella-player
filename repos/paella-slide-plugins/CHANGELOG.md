# @asicupv/paella-slide-plugins

## 3.0.0-beta.1

### Patch Changes

- Prepare the next Paella Player 3 beta: load translations on demand in core and localized plugins; add asynchronous language preparation; reuse HTML video playback for MP4 and adapt multi-quality playback; fix menu focus, preview thumbnails, keyboard playback shortcuts and caption rendering; replace LangChain community adapters with local WebLLM and embeddings integrations and improve chat error handling; fix Matomo consent and tracking events; correct Embed API CommonJS packaging; update dependencies, build configuration and TypeScript declarations; minify core production builds and bundle input normalization CSS locally.

## 3.0.0-beta.0

### Major Changes

- paella-core 3 pre release

### Patch Changes

- Updated dependencies
  - @asicupv/paella-core@3.0.0-beta.0

## 2.6.2

### Patch Changes

- Bug fixed in plugin naming

## 2.6.1

### Patch Changes

- 2b33c22: Fix dependencies with @asicupv/paella-core

## 2.6.0

### Minor Changes

- All code has been migrated to TypeScript.

## 2.5.4

### Patch Changes

- Improvements and bug fixes in localization and other UI texts
- 4fffc95: Update localization
- e1abbca: Update localization

## 2.5.3

### Patch Changes

- New localization strings added

## 2.5.2

### Patch Changes

- Core library version updated

## 2.5.1

### Patch Changes

- 6d5d3d0: Add scrollbar styles to use CSS variables for consistency and maintainability

  New CSS vars:
  --scrollbar-width: 8px;
  --scrollbar-height: 8px;
  --scrollbar-track-color: var(--secondary-bg-color-hover, transparent);
  --scrollbar-track-border-radius: var(--popup-item-border-radius, 8px);
  --scrollbar-thumb-color: var(--highlight-bg-color);
  --scrollbar-thumb-color-hover: var(--highlight-bg-color-hover);
  --scrollbar-thumb-border-radius: var(--popup-item-border-radius, 8px);

## 2.5.0

### Minor Changes

- Core library dependency updated

## 2.4.0

### Minor Changes

- 1389118: Improvements in CSS variables relating to SVG icons

## 2.3.1

### Minor Changes

- Add aria-label to es.upv.paella.arrowSlidesNavigator navigation buttons

## 2.3.0

### Patch Changes

- Implementation for the new ButtonPlugin help retrieval API has been added.
