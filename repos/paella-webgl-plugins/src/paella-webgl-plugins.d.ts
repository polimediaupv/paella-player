declare module "@asicupv/paella-webgl-plugins" {
    import type { VideoPlugin, PluginRef } from "@asicupv/paella-core";

    export const webglPlugins: PluginRef[];
    export class Video360CanvasPlugin extends VideoPlugin {}
}
