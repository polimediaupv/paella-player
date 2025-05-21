declare module "@asicupv/paella-zoom-plugin" {
    import type { Plugin, PluginRef } from "@asicupv/paella-core";

    export const zoomPlugins: PluginRef[];
    export const allPlugins: PluginRef[];

    export const ZoomCanvasPlugin: Plugin;
    export const ZoomInButtonPlugin: Plugin;
    export const ZoomOutButtonPlugin: Plugin;
    export const ZoomMenuButtonPlugin: Plugin;
    export const CanvasZoomInButtonPlugin: Plugin;
    export const CanvasZoomOutButtonPlugin: Plugin;
}
