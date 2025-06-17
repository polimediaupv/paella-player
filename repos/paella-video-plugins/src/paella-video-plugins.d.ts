declare module "@asicupv/paella-video-plugins" {
    import type { VideoPlugin, PluginRef } from "@asicupv/paella-core";

    export const videoPlugins: PluginRef[];
    export const allPlugins: PluginRef[];

    export class HlsVideoFormatPlugin extends VideoPlugin {}
    export class HlsLiveVideoFormatPlugin extends VideoPlugin {}
    export class HlsCaptionsSelectorButtonPlugin extends VideoPlugin {}
    export class Mp4MultiQualityVideoFormatPlugin extends VideoPlugin {}
}
