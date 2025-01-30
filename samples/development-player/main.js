 
// Import packages directly from the source code folder. This method only
// works with the git repository, because the source code is not published
// in the npm registry.
// To import packages from the npm registry, use the following syntax:
//      import { Paella } from '@paellaplayer/paella-core';
// The same applies to the rest of the packages.
import { Paella } from '@asicupv/paella-core/src/js/index.js';
import { 
    VolumeButtonPlugin, 
    FullscreenButtonPlugin, 
    QualitySelectorButtonPlugin,
    PlaybackRateButtonPlugin,
    LayoutSelectorButtonPlugin,
    AudioSelectorButtonPlugin,
    BackwardButtonPlugin,
    ForwardButtonPlugin,
    CaptionsSelectorButtonPlugin,
    DownloadsButtonPlugin,
    FindCaptionsButtonPlugin
} from '@asicupv/paella-basic-plugins/src/index.js';
import {
    ArrowSlidesPlugin,
    FrameControlButtonPlugin,
    NextSlideNavigatorButtonPlugin,
    PrevSlideNavigatorButtonPlugin
} from '@asicupv/paella-slide-plugins/src/index.js';
import {
    ZoomCanvasPlugin,
    CanvasZoomInButtonPlugin,
    CanvasZoomOutButtonPlugin,
    ZoomInButtonPlugin,
    ZoomOutButtonPlugin,
    ZoomMenuButtonPlugin
} from '@asicupv/paella-zoom-plugin/src/index.js';
import {
    Video360CanvasPlugin
} from '@asicupv/paella-webgl-plugins/src/index.js';
import {
    HlsVideoFormatPlugin,
    HlsLiveVideoFormatPlugin,
    HlsCaptionsSelectorButtonPlugin
} from '@asicupv/paella-video-plugins/src/index.js';

// When the paella player and libraries are imported from the source code,
// There is no need to import the CSS files, because the styles are already
// included in the source code.
// import '@asicupv/paella-basic-plugins/paella-basic-plugins.css';
// import '@asicupv/paella-core/paella-core.css';
// import '@asicupv/paella-slide-plugins/paella-slide-plugins.css';

window.addEventListener("load", async () => {
    const player = new Paella('playerContainer', {
  
        plugins: [
            {
                plugin: HlsVideoFormatPlugin,
                config: {
                    enabled: true,
                    priority: 0
                }
            },
            {
                plugin: HlsLiveVideoFormatPlugin,
                config: {
                    enabled: true,
                    priority: 1
                }
            },
            {
                plugin: FullscreenButtonPlugin,
                config: {
                    enabled: true,
                    side: 'right',
                }
            },
            {
                plugin: QualitySelectorButtonPlugin,
                config: {
                    enabled: true,
                    side: 'right'
                }
            },
            {
                plugin: PlaybackRateButtonPlugin,
                config: {
                    enabled: true,
                    side: 'left',
                    order: 1
                }
            },
            {
                plugin: BackwardButtonPlugin,
                config: {
                    enabled: true,
                    side: 'left',
                    order: 2
                }
            },
            {
                plugin: ForwardButtonPlugin,
                config: {
                    enabled: true,
                    side: 'left',
                    order: 3
                }
            },
            {
                plugin: VolumeButtonPlugin,
                config: {
                    enabled: true,
                    order: 4,
                    side: "left",
                    ariaLabel: "Volume toggle button",
                    id: "volumeButton"
                }
            },
            {
                plugin: LayoutSelectorButtonPlugin,
                config: {
                    enabled: true,
                    side: 'right',
                    order: 1
                }
            },
            {
                plugin: AudioSelectorButtonPlugin,
                config: {
                    enabled: true,
                    side: 'right',
                    order: 2
                }
            },
            {
                plugin: HlsCaptionsSelectorButtonPlugin,
                config: {
                    enabled: true,
                    side: 'right',
                    order: 3
                }
            },
            {
                plugin: CaptionsSelectorButtonPlugin,
                config: {
                    enabled: true,
                    side: 'right',
                    order: 3
                }
            },
            {
                plugin: DownloadsButtonPlugin,
                config: {
                    enabled: true,
                    side: 'right',
                    order: 5
                }
            },
            {
                plugin: FindCaptionsButtonPlugin,
                config: {
                    enabled: true,
                    side: 'right',
                    order: 6
                }
            },
            {
                plugin: ArrowSlidesPlugin,
                config: {
                    enabled: true,
                    target: [
                        "presentation",
                        "presenter"
                    ]
                }
            },
            {
                plugin: FrameControlButtonPlugin,
                config: {
                    enabled: true,
                    side: 'right',
                    menuTitle: "Slides"
                }
            },
            {
                plugin: PrevSlideNavigatorButtonPlugin,
                config: {
                    enabled: true,
              
                    content: [
                        "presentation"
                    ]
                }
            },
            {
                plugin: NextSlideNavigatorButtonPlugin,
                config: {
                    enabled: true,
              
                    content: [
                        "presentation"
                    ]
                }
            },
            {
                plugin: ZoomCanvasPlugin,
                config: {
                    enabled: true,
                    order: 1
                }
            },
            {
                plugin: CanvasZoomInButtonPlugin,
                config: {
                    enabled: true,
                    order: 2,
                    content: [
                        "presenter",
                        "presentation"
                    ]
                }
            },
            {
                plugin: CanvasZoomOutButtonPlugin,
                config: {
                    enabled: true,
                    order: 3,
                    content: [
                        "presenter",
                        "presentation"
                    ]
                }
            },
            {
                plugin: ZoomInButtonPlugin,
                config: {
                    enabled: false,
                    order: 4,
                    target: "presentation"
                }
            },
            {
                plugin: ZoomOutButtonPlugin,
                config: {
                    enabled: false,
                    order: 5,
                    target: "presentation"
                }
            },
            {
                plugin: ZoomMenuButtonPlugin,
                config: {
                    enabled: false,
                    order: 6,
                    target: "presentation"
                }
            },
            {
                plugin: Video360CanvasPlugin,
                config: {
                    enabled: true,
                    order: 1,
                    maxZoom: 2,
                    minZoom: 0.5,
                    speedX: 0.4,
                    speedY: 0.4
                }
            }
        ]
    });
    
    await player.loadManifest();
    window.player = player;
});
