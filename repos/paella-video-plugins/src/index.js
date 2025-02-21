
import HlsLiveVideoFormat from './plugins/es.upv.paella.hlsLiveVideoFormat';
import HlsVideoFormat, {
    HlsVideo,
    getHlsSupport,
    defaultHlsConfig,
    HlsSupport
} from './plugins/es.upv.paella.hlsVideoFormat';
import HlsCaptionsSelector from './plugins/es.upv.paella.hlsCaptionsSelectorPlugin';
import Mp4MultiQualityFormat from './plugins/es.upv.paella.mp4MultiQualityPlugin';

export default function getVideoPluginsContext() {
    return require.context("./plugins", true, /\.js/)
}

export const videoPlugins = [
    {
        plugin: HlsVideoFormat,
        config: {
            enabled: false
        },
    },
    {
        plugin: HlsLiveVideoFormat,
        config: {
            enabled: false
        },
        
    },
    {
        plugin: HlsCaptionsSelector,
        config: {
            enabled: false
        }
    },
    {
        plugin: Mp4MultiQualityFormat,
        config: {
            enabled: false
        }
    }
];

export const allPlugins = videoPlugins;

export const HlsVideoFormatPlugin = HlsVideoFormat;
export const HlsLiveVideoFormatPlugin = HlsLiveVideoFormat;
export const HlsCaptionsSelectorButtonPlugin = HlsCaptionsSelector;
export const Mp4MultiQualityVideoFormatPlugin = Mp4MultiQualityFormat;

export const hlsTools = {
    HlsVideo,
    getHlsSupport,
    defaultHlsConfig,
    HlsSupport
}

