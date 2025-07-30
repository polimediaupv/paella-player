---
"@asicupv/paella-slide-plugins": patch
"@asicupv/paella-core": patch
---

Add scrollbar styles to use CSS variables for consistency and maintainability

New CSS vars:
--scrollbar-width: 8px;
--scrollbar-height: 8px;
--scrollbar-track-color: var(--secondary-bg-color-hover, transparent);
--scrollbar-track-border-radius: var(--popup-item-border-radius, 8px);
--scrollbar-thumb-color: var(--highlight-bg-color);
--scrollbar-thumb-color-hover: var(--highlight-bg-color-hover);
--scrollbar-thumb-border-radius: var(--popup-item-border-radius, 8px);
