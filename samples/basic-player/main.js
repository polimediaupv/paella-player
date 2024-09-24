// Old style import
//import { Paella } from 'paella-core';

// paella-core 2.0 style import
import Paella from 'paella-core/Paella';
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
    KeyboardHelpButtonPlugin,
    DownloadsButtonPlugin,
    FindCaptionsButtonPlugin
} from 'paella-basic-plugins';
import {
    ArrowSlidesPlugin,
    FrameControlButtonPlugin,
    NextSlideNavigatorButtonPlugin,
    PrevSlideNavigatorButtonPlugin
} from 'paella-slide-plugins';
import {
    ZoomCanvasPlugin,
    CanvasZoomInButtonPlugin,
    CanvasZoomOutButtonPlugin,
    ZoomInButtonPlugin,
    ZoomOutButtonPlugin,
    ZoomMenuButtonPlugin
} from 'paella-zoom-plugin';
import {
    Video360CanvasPlugin
} from 'paella-webgl-plugins';
import {
    HlsVideoFormatPlugin,
    HlsLiveVideoFormatPlugin,
    HlsCaptionsSelectorButtonPlugin
} from 'paella-video-plugins';

// specific for vite package manager: import css from paella-core
import 'paella-basic-plugins/paella-basic-plugins.css';
import 'paella-core/paella-core.css';

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
                plugin: KeyboardHelpButtonPlugin,
                config: {
                    enabled: true,
                    side: 'right',
                    order: 4
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
