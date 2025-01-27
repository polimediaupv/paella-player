
import Video360Canvas from './plugins/es.upv.paella.video360Canvas';

export const webglPlugins = [
    {
        plugin: Video360Canvas,
        config: {
            enabled: false
        }
    }
];

export const Video360CanvasPlugin = Video360Canvas;
