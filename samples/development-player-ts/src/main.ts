
import { ButtonGroupPlugin, Paella } from '@asicupv/paella-core';
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
} from '@asicupv/paella-basic-plugins';
import {
    ArrowSlidesPlugin,
    FrameControlButtonPlugin,
    NextSlideNavigatorButtonPlugin,
    PrevSlideNavigatorButtonPlugin
} from '@asicupv/paella-slide-plugins';
import {
    ZoomCanvasPlugin,
    CanvasZoomInButtonPlugin,
    CanvasZoomOutButtonPlugin,
    ZoomInButtonPlugin,
    ZoomOutButtonPlugin,
    ZoomMenuButtonPlugin
} from '@asicupv/paella-zoom-plugin';
// import {
//     Video360CanvasPlugin
// } from '@asicupv/paella-webgl-plugins';
// import {
//     HlsVideoFormatPlugin,
//     HlsLiveVideoFormatPlugin,
//     HlsCaptionsSelectorButtonPlugin,
//     Mp4MultiQualityVideoFormatPlugin
// } from '@asicupv/paella-video-plugins';

import { webglPlugins } from '@asicupv/paella-webgl-plugins';
import { videoPlugins } from '@asicupv/paella-video-plugins';

import TestPlayerPluginModule from "./plugins/es.upv.paella.test.anchorButton.ts";

import {extraPlugins, getCookieConsentFunction}  from '@asicupv/paella-extra-plugins';
import '@asicupv/paella-extra-plugins/paella-extra-plugins.css';

import { aiToolsPlugins } from '@asicupv/paella-ai-plugins';

import '@asicupv/paella-basic-plugins/paella-basic-plugins.css';
import '@asicupv/paella-core/paella-core.css';
import '@asicupv/paella-slide-plugins/paella-slide-plugins.css';

import '@asicupv/paella-ai-plugins/paella-ai-plugins.css';

import CustomPlayIcon from "./CustomPlayIcon.ts";

window.addEventListener("load", async () => {
    const player = new Paella('playerContainer', {
  
        getCookieConsentFunction: getCookieConsentFunction,
        plugins: [
            {
                plugin: TestPlayerPluginModule,
                config: {
                    enabled: true,
                    urlTarget: "__blank",
                    parentContainer: "options",
                    description: "Googlear"
                }
            },
            // {
            //     plugin: HlsVideoFormatPlugin,
            //     config: {
            //         enabled: true,
            //         priority: 0
            //     }
            // },
            // {
            //     plugin: HlsLiveVideoFormatPlugin,
            //     config: {
            //         enabled: true,
            //         priority: 1
            //     }
            // },
            // {
            //     plugin: Mp4MultiQualityVideoFormatPlugin,
            //     config: {
            //         enabled: true,
            //         priority: 0
            //     }
            // },
            ...videoPlugins,
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
                    side: 'right',
                    parentContainer: "options"
                }
            },
            {
                plugin: PlaybackRateButtonPlugin,
                config: {
                    enabled: true,
                    side: 'right',
                    _parentContainer: "options"
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
            // {
            //     plugin: HlsCaptionsSelectorButtonPlugin,
            //     config: {
            //         enabled: true,
            //         side: 'right',
            //         order: 3
            //     }
            // },
            ...webglPlugins,
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
                    parentContainer: "options"
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
                    // menuTitle: "Slides",
                    target: "presentation"
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
            // {
            //     plugin: Video360CanvasPlugin,
            //     config: {
            //         enabled: true,
            //         order: 1,
            //         maxZoom: 2,
            //         minZoom: 0.5,
            //         speedX: 0.4,
            //         speedY: 0.4
            //     }
            // },
            ...extraPlugins,            
            ...aiToolsPlugins
        ]
    });

    player.addCustomPluginIcon("@asicupv/paella-core", "playPreview", CustomPlayIcon);
    player.addCustomPluginIcon("@asicupv/paella-core", "LoaderIcon", CustomPlayIcon);
    player.skin.loadSkin("/skin/skin_1.json");
    await player.loadManifest();

    player.bindEvent(player.Events.PLAYER_LOADED, async () => {
        for (const plugin of player.playbackBar.getVisibleButtonPlugins()) {
            if (plugin instanceof ButtonGroupPlugin) {
                const buttonsInGroup = await plugin.getVisibleButtonPlugins();
                console.log(buttonsInGroup.map(p => p.name));
            }
        }
    });
});
