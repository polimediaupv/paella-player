// Old style import
//import { Paella } from 'paella-core';

// paella-core 2.0 style import
import { Paella, createElementWithHtmlText, createTimeLinePreview, log, utils } from '@asicupv/paella-core';
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
} from 'paella-zoom-plugin';
import {
    Video360CanvasPlugin
} from 'paella-webgl-plugins';
import {
    HlsVideoFormatPlugin,
    HlsLiveVideoFormatPlugin,
    HlsCaptionsSelectorButtonPlugin
} from '@asicupv/paella-video-plugins';
import {
    DebugUserTrackingDataPlugin,
    UserEventTrackerPlugin
} from '@asicupv/paella-user-tracking';

import '@asicupv/paella-basic-plugins/paella-basic-plugins.css';
import '@asicupv/paella-core/paella-core.css';
import '@asicupv/paella-slide-plugins/paella-slide-plugins.css';

import './custom-progress-indicator.css';

const createCustomProgressIndicator = ({ container, player, duration, currentTime, precision }) => {
    container.classList.add('progress-indicator');
    container.classList.add('custom-progress-indicator');
    container.innerHTML = `
        <div class="range-container">
            <div class="timeline-preview-container"></div>
            <div class="elapsed"></div>
            <div class="remaining"></div>
            <input type="range" min="0" max="${duration * precision}" value="${currentTime * precision}" tabindex="0" role="slider" class="slider">
            <ul class="markers-container"></ul>
        </div>
    `;

    const elapsed = container.querySelector('.elapsed');
    const remaining = container.querySelector('.remaining');
    const range = container.querySelector('.slider');

    const timeLinePreviewContainer = container.querySelector('.timeline-preview-container');
    const timeLinePreview = createTimeLinePreview({ container: timeLinePreviewContainer });

    // Controls if the user is seeking the range element. In this case, we must avoid
    // to update the range value via the setCurrentTime method.
    let seeking = false;

    let onChangeCallback = null;
    const markers = [];
    const getMarker = (time) => markers.find(marker => marker.time < time && marker.time + marker.frameDuration >= time)?.marker;
    const progressIndicator = {
        player,
        elapsed,
        remaining,
        range,
        timeLinePreview,

        markersContainer: container.querySelector('.markers-container'),

        addMarker({ time, duration, frameDuration }) {
            const marker = createElementWithHtmlText(`<li>
                <div class="elapsed"></div>
                <div class="remaining"></div>
            </li>`);
            marker.style.left = `${time / duration * 100}%`;
            marker.style.width = `calc(${frameDuration / duration * 100}% - 4px)`;
            this.markersContainer.appendChild(marker);
            markers.push({
                marker,
                time,
                frameDuration
            })
        },

        updateRemaining() {
            const position = this.range.value / this.range.max * 100;
            this.elapsed.style.width = `${position}%`;
            this.remaining.style.width = `${100 - position}%`;

            const currentMarker = getMarker(this.range.value / precision);
            const currentIndex = markers.findIndex(marker => marker.marker === currentMarker);
            markers.forEach((marker, index) => {
                if (index < currentIndex) {
                    marker.marker.querySelector(".elapsed").style.width = "100%";
                    marker.marker.querySelector(".remaining").style.width = "0%";
                }
                else if (index === currentIndex) {
                    const elapsed = (this.range.value / precision - marker.time) / marker.frameDuration * 100;
                    marker.marker.querySelector(".elapsed").style.width = `${elapsed}%`;
                    marker.marker.querySelector(".remaining").style.width = `${100 - elapsed}%`;
                }
                else {
                    marker.marker.querySelector(".elapsed").style.width = "0%";
                    marker.marker.querySelector(".remaining").style.width = "100%";
                }
            });
        },

        setDuration(duration) {
            if (!seeking) {
                this.range.max = duration * precision;
                this.updateRemaining();
            }
        },

        setCurrentTime(currentTime) {
            if (!seeking) {
                this.range.value = currentTime * precision;
                this.updateRemaining();
            }
        },

        onChange(callback) {
            onChangeCallback = callback;
        }
    };

    range.addEventListener('pointerdown', () => {
        seeking = true;
    });

    let prevMarker = null;
    range.addEventListener('mousemove', async (event) => {
        const frameList = player.frameList?.frames || [];
        if (frameList && frameList.length) {
            const duration = await player.videoContainer.duration();
            const width = event.target.clientWidth;
            const position = event.layerX;
            const normalizedPosition = position / width;
            const time = normalizedPosition * duration;
            const frame = frameList.filter(frame => frame.time <= time).pop();
            const url = frame && (frame.thumb || frame.url);
            const text = frame && utils.secondsToTime(duration * normalizedPosition);
            const marker = getMarker(time);
            if (marker !== prevMarker && prevMarker !== null) {
                prevMarker.classList.remove('active');
            }
            marker && marker.classList.add('active');
            prevMarker = marker;
            
            timeLinePreview.setImage(url, text);
            timeLinePreview.setText(text);
            timeLinePreview.setPosition(normalizedPosition);

            timeLinePreview.show();
        }
    });

    range.addEventListener('mouseleave', () => {
        timeLinePreview.hide();
        prevMarker && prevMarker.classList.remove('active');
    });

    range.addEventListener('pointerup', () => {
        seeking = false;
        if (typeof(onChangeCallback) === 'function') {
            onChangeCallback(range.value / precision);
        }
    });

    range.addEventListener('input', () => {
        progressIndicator.updateRemaining();
    });

    const seekSeconds = async (seconds) => {
        const currentTime = await player.videoContainer.currentTime();
        await player.videoContainer.setCurrentTime(currentTime + seconds);
    }

    range.addEventListener('keydown', evt => {
        if (evt.key === 'ArrowLeft') {
            seekSeconds(-10);        
            evt.preventDefault();
            evt.stopPropagation();
        }
        else if (evt.key === 'ArrowRight') {
            seekSeconds(10);
            evt.preventDefault();
            evt.stopPropagation();
        }

    });

    progressIndicator.updateRemaining();

    return progressIndicator;
}

window.addEventListener("load", async () => {
    const player = new Paella('playerContainer', {
        // Custom progress indicator function
        getProgressIndicator: createCustomProgressIndicator,

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
                    order: 5,
                    parentContainer: 'options', // See config.json 
                    description: "Downloads"
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
            },
            {
                plugin: DebugUserTrackingDataPlugin,
                config: {
                    enabled: true,
                    context: "userTracking",
                    events: [
                        "PLAY",
                        "PAUSE",
                        "SEEK",
                        "TIMEUPDATE"
                    ]
                }
            },
            {
                plugin: UserEventTrackerPlugin,
                config: {
                    enabled: true,
                    context: "userTracking"
                }
            }
        ]
    });
    
    await player.loadManifest();
    window.player = player;
});
