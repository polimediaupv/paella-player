declare module "@asicupv/paella-basic-plugins" {
    import type { Plugin, PluginRef } from "@asicupv/paella-core";

    export const basicPlugins: PluginRef[];

    export const AudioSelectorButtonPlugin: Plugin;
    export const BackwardButtonPlugin: Plugin;
    export const CaptionsSelectorButtonPlugin: Plugin;
    export const DownloadsButtonPlugin: Plugin;
    export const FindCaptionsButtonPlugin: Plugin;
    export const ForwardButtonPlugin: Plugin;
    export const FullscreenButtonPlugin: Plugin;
    export const LayoutSelectorButtonPlugin: Plugin;
    export const PlaybackRateButtonPlugin: Plugin;
    export const QualitySelectorButtonPlugin: Plugin;
    export const VolumeButtonPlugin: Plugin;
}