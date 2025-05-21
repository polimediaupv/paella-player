declare module "@asicupv/paella-slide-plugins" {
    import type { Plugin, PluginRef } from "@asicupv/paella-core";

    export const slidePlugins: PluginRef[];
    export const allPlugins: PluginRef[];

    export const ArrowSlidesPlugin: Plugin;
    export const FrameControlButtonPlugin: Plugin;
    export const NextSlideNavigatorButtonPlugin: Plugin;
    export const PrevSlideNavigatorButtonPlugin: Plugin;

    export const utils: {
        nextSlide: Function;
        previousSlide: Function;
        checkSlides: Function;
        getFrames: Function;
    };
}
