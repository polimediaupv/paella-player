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
    HlsCaptionsSelectorButtonPlugin,
    CaptionsSelectorButtonPlugin,
    KeyboardHelpButtonPlugin
} from 'paella-basic-plugins';

// specific for vite package manager: import css from paella-core
import 'paella-basic-plugins/paella-basic-plugins.css';
import 'paella-core/paella-core.css';

window.addEventListener("load", async () => {
    const player = new Paella('playerContainer', {
  
        plugins: [
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
            }
        ]
    });
    
    await player.loadManifest();
    window.player = player;
});
