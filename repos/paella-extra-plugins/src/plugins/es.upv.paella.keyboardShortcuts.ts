import { type Paella, isVolumeApiAvailable, type PopUpButtonPluginConfig } from '@asicupv/paella-core';
import { TableInfoPopUpPlugin, type ContentTableInfo } from '@asicupv/paella-core';
import PackagePluginModule from './PackagePluginModule';
import KeyBoardIcon from '../icons/keyboard.svg?raw';

import '../css/KeyboardShortcuts.css';


import CaptionsOffIcon from '../icons/keyboardShotcuts/captions-off.svg?raw';
import CaptionsOnIcon from '../icons/keyboardShotcuts/captions.svg?raw';
import VolumeMuteIcon from '../icons/keyboardShotcuts/volume-off.svg?raw';
import VolumeHighIcon from '../icons/keyboardShotcuts/volume-1.svg?raw';
import VolumeLowIcon from '../icons/keyboardShotcuts/volume-2.svg?raw';
import GaugeIcon from '../icons/keyboardShotcuts/gauge.svg?raw';
import FastForwardIcon from '../icons/keyboardShotcuts/fast-forward.svg?raw';
import RewindIcon from '../icons/keyboardShotcuts/rewind.svg?raw';



export type KeyboardShortcutsPluginConfig = PopUpButtonPluginConfig & {
    installKeyboardManager?: boolean; // If true, installs the keyboard event listener
    validPlaybackRates?: number[]; // Valid playback rates for the plugin
}

export default class KeyboardShortcutsPlugin extends TableInfoPopUpPlugin<KeyboardShortcutsPluginConfig> {
    private isCaptionsEnabled = false;
    private isVolumeEnabled = false;


    preload() {
        const pluginConfig: KeyboardShortcutsPluginConfig = this.config || {};

        if (pluginConfig.enabled && pluginConfig.installKeyboardManager) {
            this.installKeyboardManager();
        }
    }

    getPluginModuleInstance() {
        return PackagePluginModule.Get();
    }

    get name() {
        return super.name || 'es.upv.paella.keyboardShortcuts';
    }

    getAriaLabel() {
        return this.player.translate('Keyboard shortcuts');
    }

    getDescription() {
        return this.getAriaLabel();
    }

    async getHelp() {
        return {
            title: "Keyboard shortcuts help",
            description: "Displays a list of available keyboard shortcuts to control the video player."
        };
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, 'buttonIcon') || KeyBoardIcon;
    }

    async isEnabled() {
        // Disable the plugin on iPhone, because it's very extrange to have a physical keyboard on an iPhone
        const iPhone = /iphone/i.test(navigator.userAgent);
        const parentEnabled = await super.isEnabled();
        const enabled = !iPhone && parentEnabled;

        return enabled;
    }

    async checkFunctionality() {
        // Check captions availability evert time the pop-up is opened
        if (!this.player.captionsCanvas) {
            this.isCaptionsEnabled = false;
            return;
        }

        this.isCaptionsEnabled = this.player.captionsCanvas.captions?.length > 0;
        this.isVolumeEnabled = await isVolumeApiAvailable();
    }

    async getShortcuts() {
        await this.checkFunctionality();

        const shortcuts = [
            // Basic Playback
            {
                category: "Playback",
                shortcuts: []
            },
            // Navigation
            {
                category: "Navigation",
                shortcuts: [
                    { key: "←/→", description: "Seek backward/forward 5 seconds on seek bar" },
                    { key: "j", description: "Seek backward 10 seconds" },
                    { key: "l", description: "Seek forward 10 seconds" },
                    { key: "Home/End", description: "Seek to the beginning/last seconds of the video" },
                    { key: "0-9", description: "Seek to the 0% to 90% of the video" }
                ]
            },
            // Control velocity and volume
            {
                category: "Control",
                shortcuts: [
                    { key: "u", description: "Slow down the video playback rate" },
                    { key: "o", description: "Speed up the video playback rate" }
                ]
            }
        ];

        // Playback shortcuts - always add play/pause
        const playbackShortcuts = [
            { key: "Spacebar", description: "Play/Pause when the seek bar is selected" },
            { key: "k", description: "Play/Pause in player" }
        ];

        // Only add mute shortcut if volume API is available
        if (this.isVolumeEnabled) {
            playbackShortcuts.push(
                { key: "m", description: "Mute/unmute the video" }
            );
        }

        shortcuts[0].shortcuts = playbackShortcuts;

        // Only add volume control shortcuts if volume API is available
        if (this.isVolumeEnabled) {
            shortcuts[2].shortcuts.unshift(
                { key: "↑/↓", description: "Increase/Decrease volume 5%" }
            );
        }

        // Interface category with conditional captions shortcut
        const interfaceShortcuts = [
            { key: "f", description: "Activate full screen (press f again or Esc to exit)" }
        ];

        // Only add captions shortcut if captions are available
        if (this.isCaptionsEnabled) {
            interfaceShortcuts.push(
                { key: "c", description: "Activate/Hide closed captions and subtitles" }
            );
        }

        shortcuts.push({
            category: "Interface",
            shortcuts: interfaceShortcuts
        });

        return shortcuts;
    }

    async getContentTableInfo(): Promise<ContentTableInfo> {
        const shortcuts = await this.getShortcuts();
        const table = shortcuts.map(category => ({
            category: this.player.translate(category.category),
            rows: category.shortcuts.map(shortcut => ({
                key: `<kbd>${this.player.translate(shortcut.key)}</kbd>`,
                value: this.player.translate(shortcut.description)
            }))
        }));

        return {
            footer: `<small>${this.player.translate("Shortcuts work when the player has focus")}</small>`,
            table
        };
    }

    installKeyboardManager() {
        this.player.log.warn("Installing keyboard manager. Only do this if you're sure you want to install the keyboard manager; it may interfere with other functions of your site. For more information, see the Paella Player documentation page.", `${this.getPluginModuleInstance().moduleName} [${this.name}]`);
        document.addEventListener('keydown', createKeyboardEventListener(this.player, this.config?.validPlaybackRates));
    }
}



export const createKeyboardEventListener = (player: Paella, validPlaybackRates: number[] = [0.5, 0.75, 1, 1.25, 1.5, 2]) => {

    const volumeMuteIcon = player.getCustomPluginIcon("es.upv.paella.keyboardShortcuts", 'volumeMuteIcon') || VolumeMuteIcon;
    const volumeHighIcon = player.getCustomPluginIcon("es.upv.paella.keyboardShortcuts", 'volumeHighIcon') || VolumeHighIcon;
    const volumeLowIcon = player.getCustomPluginIcon("es.upv.paella.keyboardShortcuts", 'volumeLowIcon') || VolumeLowIcon;
    const captionsOffIcon = player.getCustomPluginIcon("es.upv.paella.keyboardShortcuts", 'captionsOffIcon') || CaptionsOffIcon;
    const captionsOnIcon = player.getCustomPluginIcon("es.upv.paella.keyboardShortcuts", 'captionsOnIcon') || CaptionsOnIcon;
    const increaseSpeedIcon = player.getCustomPluginIcon("es.upv.paella.keyboardShortcuts", 'increaseSpeedIcon') || GaugeIcon;
    const decreaseSpeedIcon = player.getCustomPluginIcon("es.upv.paella.keyboardShortcuts", 'decreaseSpeedIcon') || GaugeIcon;
    const fastForwardIcon = player.getCustomPluginIcon("es.upv.paella.keyboardShortcuts", 'fastForwardIcon') || FastForwardIcon;
    const rewindIcon = player.getCustomPluginIcon("es.upv.paella.keyboardShortcuts", 'rewindIcon') || RewindIcon;

    const decreaseSpeed = async () => {
        const currentPR = await player.playbackRate() || 1;
        let selected = 0;
        validPlaybackRates.some(p => {
            if (selected === 0) {
                selected = p;
            }
            if (p < currentPR) {
                selected = p;
            }
            else {
                return true;
            }
        });
        await player.setPlaybackRate(selected);
        (player.videoContainer as any).message.show({
            text: `${selected}X`,
            icon: decreaseSpeedIcon,
            position: "centerMiddle",
            timeout: 2000
        });
    }

    const increaseSpeed = async () => {
        const currentPR = await player.playbackRate() || 1;
        let selected = 0;
        validPlaybackRates.some(p => {
            if (p > currentPR) {
                selected = p;
                return true;
            }
        });
        if (selected === 0) {
            selected = validPlaybackRates[validPlaybackRates.length - 1];
        }
        await player.setPlaybackRate(selected);
        (player.videoContainer as any).message.show({
            text: `${selected}X`,
            icon: increaseSpeedIcon,
            position: "centerMiddle",
            timeout: 2000
        });
    }

    const toggleCaptions = async () => {
        const length = player.captionsCanvas?.captions?.length || 0;
        if (length > 0) {
            if (player.captionsCanvas?.currentCaptions != null) {
                player.captionsCanvas.disableCaptions();
                (player.videoContainer as any).message.show({
                    text: player.translate("Disable captions"),
                    icon: captionsOffIcon,
                    position: "centerMiddle",
                    timeout: 2000
                });
            }
            else {
                let langIndex = null;
                navigator.languages.some((l) => {
                    return player.captionsCanvas?.captions.some((cap, idx) => {
                        if (l == cap.language) {
                            langIndex = idx;
                            return true;
                        }
                        return false;
                    });
                });
                player.captionsCanvas?.enableCaptions({ index: (langIndex || 0) });
                (player.videoContainer as any).message.show({
                    text: player.translate("Enable captions"),
                    icon: captionsOnIcon,
                    position: "centerMiddle",
                    timeout: 2000
                });
            }
        }
    }

    // This variable is used to store the last volume level before muting
    let _lastVolume: number | undefined = undefined;

    return async (event: KeyboardEvent) => {
        // Avoid acting if there is an element with focus (input, textarea, etc.)
        const focused = document.querySelector(":focus-visible");
        if (focused && (focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA')) { //|| focused.contentEditable === 'true')) {
            return;
        }


        switch (event.code) {
            // Playback controls
            // case 'Space':
            case 'KeyK':
                event.preventDefault();
                await player.paused() ? player.play() : player.pause();
                break;

            case 'KeyM':
                event.preventDefault();
                const currentVolume = await player.volume() || 1;
                const newVolume = currentVolume > 0 ? (_lastVolume = currentVolume, 0) : (_lastVolume || 1);
                await player.setVolume(newVolume);
                (player.videoContainer as any).message.show({
                    text: `${Math.round(newVolume * 100)}%`,
                    icon: (newVolume == 0) ? volumeMuteIcon : VolumeHighIcon,
                    position: "centerMiddle",
                    timeout: 2000
                });
                break;

            // Navigation
            case 'ArrowLeft':
                if (!focused) {
                    event.preventDefault();
                    const currentTime = await player.currentTime() || 0;
                    player.setCurrentTime(Math.max(0, currentTime - 5));
                    (player.videoContainer as any).message.show({
                        text: undefined,
                        icon: rewindIcon,
                        position: "centerLeft",
                        timeout: 2000
                    });
                }
                break;

            case 'ArrowRight':
                if (!focused) {
                    event.preventDefault();
                    const currentTime = await player.currentTime() || 0;
                    const duration = await player.duration() || 0;
                    player.setCurrentTime(Math.min(duration, currentTime + 5));
                    (player.videoContainer as any).message.show({
                        text: undefined,
                        icon: fastForwardIcon,
                        position: "centerRight",
                        timeout: 2000
                    });
                }
                break;

            case 'KeyJ':
                event.preventDefault();
                const currentTimeJ = await player.currentTime() || 0;
                player.setCurrentTime(Math.max(0, currentTimeJ - 10));
                (player.videoContainer as any).message.show({
                    text: undefined,
                    icon: rewindIcon,
                    position: "centerLeft",
                    timeout: 2000
                });
                break;

            case 'KeyL':
                event.preventDefault();
                const currentTimeL = await player.currentTime() || 0;
                const durationL = await player.duration() || 0;
                player.setCurrentTime(Math.min(durationL, currentTimeL + 10));
                (player.videoContainer as any).message.show({
                    text: undefined,
                    icon: fastForwardIcon,
                    position: "centerRight",
                    timeout: 2000
                });
                break;

            case 'Home':
                event.preventDefault();
                player.setCurrentTime(0);
                break;

            case 'End':
                event.preventDefault();
                const durationE = await player.duration() || 0;
                player.setCurrentTime(durationE);
                break;

            // Volume control
            case 'ArrowUp':
                if (!focused) {
                    event.preventDefault();
                    const volume = await player.volume() || 1;
                    const newVolume = Math.min(1, volume + 0.05);
                    player.setVolume(newVolume);
                    (player.videoContainer as any).message.show({
                        text: `${Math.round(newVolume * 100)}%`,
                        icon: volumeHighIcon,
                        position: "centerMiddle",
                        timeout: 2000
                    });
                }
                break;

            case 'ArrowDown':
                if (!focused) {
                    event.preventDefault();
                    const volume = await player.volume() || 1;
                    const newVolume = Math.max(0, volume - 0.05);
                    player.setVolume(newVolume);
                    (player.videoContainer as any).message.show({
                        text: `${Math.round(newVolume * 100)}%`,
                        icon: (newVolume == 0) ? volumeMuteIcon : volumeLowIcon,
                        position: "centerMiddle",
                        timeout: 2000
                    });
                }
                break;

            // Playback speed
            case 'KeyU':
                event.preventDefault();
                await decreaseSpeed();
                break;

            case 'KeyO':
                event.preventDefault();
                await increaseSpeed();
                break;

            // Interface
            case 'KeyF':
                event.preventDefault();
                if (player.isFullscreen) {
                    player.exitFullscreen();
                } else {
                    player.enterFullscreen();
                }
                break;

            case 'KeyC':
                event.preventDefault();
                await toggleCaptions();
                break;

            case 'Escape':
                if (player.isFullscreen) {
                    event.preventDefault();
                    player.exitFullscreen();
                }
                break;

            // Number keys for seeking to percentage
            case 'Digit0':
            case 'Digit1':
            case 'Digit2':
            case 'Digit3':
            case 'Digit4':
            case 'Digit5':
            case 'Digit6':
            case 'Digit7':
            case 'Digit8':
            case 'Digit9':
                event.preventDefault();
                const digit = parseInt(event.code.replace('Digit', ''));
                const duration = await player.duration() || 0;
                const seekTime = (digit / 10) * duration;
                player.setCurrentTime(seekTime);
                break;

            default:
                // No action for other keys
                break;
        }
    }
}