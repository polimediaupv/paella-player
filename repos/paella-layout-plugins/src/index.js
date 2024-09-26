
import DualVideoSideBySideLayout from './plugins/es.upv.paella.dualVideoSideBySide';

export default function getLayoutPluginsContext() {
    return require.context("./plugins", true, /\.js/)
}

export const layoutPlugins = [
    {
        plugin: DualVideoSideBySideLayout,
        config: {
            enabled: true
        }
    }
]

export const allPlugins = layoutPlugins;

export const DualVideoSideBySideLayoutPlugin = DualVideoSideBySideLayout;
