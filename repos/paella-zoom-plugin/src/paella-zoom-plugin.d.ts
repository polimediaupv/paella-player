declare module "@asicupv/paella-zoom-plugin" {
    import type { CanvasPlugin, PluginRef, CanvasButtonPlugin, MenuButtonPlugin, ButtonPlugin } from "@asicupv/paella-core";

    export const zoomPlugins: PluginRef[];
    export const allPlugins: PluginRef[];

    export class ZoomCanvasPlugin extends CanvasPlugin {}
    export class ZoomInButtonPlugin extends ButtonPlugin {}
    export class ZoomOutButtonPlugin extends ButtonPlugin {}
    export class ZoomMenuButtonPlugin extends MenuButtonPlugin {}
    export class CanvasZoomInButtonPlugin extends CanvasButtonPlugin {}
    export class CanvasZoomOutButtonPlugin extends CanvasButtonPlugin {}
}
