declare module "@asicupv/paella-basic-plugins" {
    import type { ButtonPlugin, PluginRef } from "@asicupv/paella-core";

    export const basicPlugins: PluginRef[];

    export class AudioSelectorButtonPlugin extends ButtonPlugin {}
    export class BackwardButtonPlugin extends ButtonPlugin {}
    export class CaptionsSelectorButtonPlugin extends ButtonPlugin {}
    export class DownloadsButtonPlugin extends ButtonPlugin {}
    export class FindCaptionsButtonPlugin extends ButtonPlugin {}
    export class ForwardButtonPlugin extends ButtonPlugin {}
    export class FullscreenButtonPlugin extends ButtonPlugin {}
    export class LayoutSelectorButtonPlugin extends ButtonPlugin {}
    export class PlaybackRateButtonPlugin extends ButtonPlugin {}
    export class QualitySelectorButtonPlugin extends ButtonPlugin {}
    export class VolumeButtonPlugin extends ButtonPlugin {}
}