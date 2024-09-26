
import Video360Canvas from './plugins/es.upv.paella.video360Canvas';

export default function getWebGLPluginsContext() {
    return require.context("./plugins", true, /\.js/)
}

export const webglPlugins = [
    {
        plugin: Video360Canvas,
        config: {
            enabled: false
        }
    }
];

export const allPlugins = webglPlugins;

export const Video360CanvasPlugin = Video360Canvas;
