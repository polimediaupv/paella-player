declare module "@asicupv/paella-video-plugins" {
    import type { Plugin, PluginRef } from "@asicupv/paella-core";

    export const videoPlugins: PluginRef[];
    export const allPlugins: PluginRef[];

    export const HlsVideoFormatPlugin: Plugin;
    export const HlsLiveVideoFormatPlugin: Plugin;
    export const HlsCaptionsSelectorButtonPlugin: Plugin;
    export const Mp4MultiQualityVideoFormatPlugin: Plugin;
}
