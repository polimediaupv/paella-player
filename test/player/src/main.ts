
import { Paella } from '@asicupv/paella-core';
import {
    CaptionsSelectorButtonPlugin,
    FullscreenButtonPlugin,
    QualitySelectorButtonPlugin,
    VolumeButtonPlugin
} from '@asicupv/paella-basic-plugins';
import { FrameControlButtonPlugin } from '@asicupv/paella-slide-plugins';
import { videoPlugins } from '@asicupv/paella-video-plugins';
import { webglPlugins } from '@asicupv/paella-webgl-plugins';

import '@asicupv/paella-basic-plugins/paella-basic-plugins.css';
import '@asicupv/paella-core/paella-core.css';
import '@asicupv/paella-slide-plugins/paella-slide-plugins.css';

window.addEventListener("load", async () => {
    // Minimal player used as Playwright test runtime. The Paella
    // constructor publishes every instance in window.__paella_instances__.
    const player = new Paella('playerContainer', {
        plugins: [
            ...videoPlugins,
            ...webglPlugins,
            { plugin: CaptionsSelectorButtonPlugin, config: { enabled: true, side: 'right' } },
            { plugin: FrameControlButtonPlugin, config: { enabled: true, side: 'right' } },
            {
                plugin: VolumeButtonPlugin,
                config: {
                    enabled: true,
                    side: 'left'
                }
            },
            {
                plugin: FullscreenButtonPlugin,
                config: {
                    enabled: true,
                    side: 'right'
                }
            },
            {
                plugin: QualitySelectorButtonPlugin,
                config: {
                    enabled: true,
                    side: 'right'
                }
            }
        ]
    });

    await player.loadManifest();
});
