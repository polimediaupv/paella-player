declare module "@asicupv/paella-slide-plugins" {
    import type { CanvasButtonPlugin, PluginRef, EventLogPlugin, PopUpButtonPlugin } from "@asicupv/paella-core";

    export const slidePlugins: PluginRef[];
    export const allPlugins: PluginRef[];

    export class ArrowSlidesPlugin extends EventLogPlugin {}
    export class FrameControlButtonPlugin extends PopUpButtonPlugin {}
    export class NextSlideNavigatorButtonPlugin extends CanvasButtonPlugin {}
    export class PrevSlideNavigatorButtonPlugin extends CanvasButtonPlugin {}

    export const utils: {
        nextSlide: Function;
        previousSlide: Function;
        checkSlides: Function;
        getFrames: Function;
    };
}
