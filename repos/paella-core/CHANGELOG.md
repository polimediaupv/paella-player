# @asicupv/paella-core

## 2.10.0

### Minor Changes

- Now the timeline image in video manifest can contain a base64 image

## 2.9.9

### Patch Changes

- Duplicated plugin removed from plugins export

## 2.9.8

### Patch Changes

- Type definition updated to export missing plugins

## 2.9.7

### Patch Changes

- fdb1e95: Fix TS types

## 2.9.6

### Patch Changes

- Merge conflict fixed in paella-core package

## 2.9.5

### Patch Changes

- Minor fixes in typescript definition file

## 2.9.4

### Patch Changes

- Bug fixed in TypeScript definition file
- Some TypeScript types updated

## 2.9.3

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

## 2.9.2

### Patch Changes

- f7aa0cf: Fix Typescript types

## 2.9.1

### Patch Changes

- Improvements in CSS class naming

## 2.9.0

### Minor Changes

- 6eabffd: Add TableInfoPopUpPlugin class

## 2.8.3

### Patch Changes

- Minor CSS issues fixed in menu item buttons

## 2.8.2

### Patch Changes

- Bug fixed downloading timeline from external server. Bug fixed in stylesheets

## 2.8.1

### Patch Changes

- Improvements in CSS

## 2.8.0

### Minor Changes

- New ButtonPlugin API to create button plugins with anchor instead of button element

## 2.7.0

### Minor Changes

- 1389118: Improvements in CSS variables relating to SVG icons
- 417f077: New plugin API added: preload

## 2.6.0

### Minor Changes

- 6454b85: New CSS variables to control Video Container Message styles

## 2.5.0

### Patch Changes

- New API: timeline images
- Improvements and bug fixes in video container message API.
- Changes in typescript types (Plugins)

## 2.4.1

### Minor Changes

- Adjust the direction of the buttons in the menu and add a right chevron icon to the PopUpButton plugins.
- Add aria-label to back button in popups.
- New CSS variables added to customize menu items.

## 2.4.0

### Patch Changes

- Add the `name` property to the group buttons, just like the playbar buttons have.
- New feature: chapters. See documentation on video manifest for more information.

## 2.3.3

### Minor Changes

- Changes to TypeScript type files
- New custom icon added to configure the loader: `@asicupv/paella-core`, `LoaderIcon`

## 2.3.2

### Minor Changes

- Fixed a bug loading icons in button group configuration. Now the `icon` attribute in button groups accepts absolute paths and SVG code.

## 2.3.1

### Minor Changes

- Fixed minor bugs in TypeScript definitions

## 2.3.0

### Patch Changes

- New API to get help strings from ButtonPlugin and CanvasButtonPlugin
