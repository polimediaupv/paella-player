import AudioVideoPlugin from "./videoFormats/es.upv.paella.audioVideoFormat";
import HtmlVideoPlugin from "./videoFormats/es.upv.paella.htmlVideoFormat";
import ImageVideoPlugin from "./videoFormats/es.upv.paella.imageVideoFormat";
import Mp4VideoPlugin from "./videoFormats/es.upv.paella.mp4VideoFormat";

import DfxpManifestCaptionsPlugin from "./plugins/es.upv.paella.dfxpManifestCaptionsPlugin";
import PlayPauseButtonPlugin from "./plugins/es.upv.paella.playPauseButton";
import VttManifestCaptionsPlugin from "./plugins/es.upv.paella.vttManifestCaptionsPlugin";
import CurrentTimeLabelPlugin from "./plugins/es.upv.paella.currentTimeLabelPlugin";

import DualVideoDynamicLayout from "./layouts/es.upv.paella.dualVideoDynamic";
import SingleVideoDynamicLayout from "./layouts/es.upv.paella.singleVideoDynamic";
import DualVideoPiPDynamicLayout from "./layouts/es.upv.paella.dualVideoPiPDynamic";

import AudioCanvasPlugin from "./canvas/es.upv.paella.audioCanvas";
import VideoCanvasPlugin from "./canvas/es.upv.paella.videoCanvas";

import CookieDataPlugin from "./data/es.upv.paella.cookieDataPlugin";
import LocalStorageDataPlugin from "./data/es.upv.paella.localStorageDataPlugin";

export default [
    {
        plugin: AudioVideoPlugin,
        config: {
            enabled: false
        }
    },
    {
        plugin: HtmlVideoPlugin,
        config: {
            enabled: false
        }
    },
    {
        plugin: ImageVideoPlugin,
        config: {
            enabled: false
        }
    },
    {
        plugin: Mp4VideoPlugin,
        config: {
            enabled: false
        }
    },
    {
        plugin: DfxpManifestCaptionsPlugin,
        config: {
            enabled: false
        }
    },
    {
        plugin: PlayPauseButtonPlugin,
        config: {
            enabled: false
        }
    },
    {
        plugin: VttManifestCaptionsPlugin,
        config: {
            enabled: false
        }
    },
    {
        plugin: CurrentTimeLabelPlugin,
        config: {
            enabled: false
        }
    },
    {
        plugin: DualVideoDynamicLayout,
        config: {
            enabled: false
        }
    },
    {
        plugin: SingleVideoDynamicLayout,
        config: {
            enabled: false
        }
    },
    {
        plugin: DualVideoPiPDynamicLayout,
        config: {
            enabled: false
        }
    },
    {
        plugin: AudioCanvasPlugin,
        config: {
            enabled: false
        }
    },
    {
        plugin: VideoCanvasPlugin,
        config: {
            enabled: false
        }
    },
    {
        plugin: CookieDataPlugin,
        config: {
            enabled: false,
            context: ["default"]
        }
    },
    {
        plugin: LocalStorageDataPlugin,
        config: {
            enable: true,
            context: ["default"]
        }
    }
]
