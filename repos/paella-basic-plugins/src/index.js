
import AudioSelectorButton from './plugins/es.upv.paella.audioSelector';
import BackwardButton from './plugins/es.upv.paella.backwardButtonPlugin';
import CaptionsSelectorButton from './plugins/es.upv.paella.captionsSelectorPlugin';
import DownloadsButton from './plugins/es.upv.paella.downloadsPlugin';
import FindCaptionsButton from './plugins/es.upv.paella.findCaptionsPlugin';
import ForwardButton from './plugins/es.upv.paella.forwardButtonPlugin';
import FullscreenButton from './plugins/es.upv.paella.fullscreenButton';
import KeyboardHelpButton from './plugins/es.upv.paella.keyboardShortcutsHelp';
import LayoutSelectorButton from './plugins/es.upv.paella.layoutSelector';
import PlaybackRateButton from './plugins/es.upv.paella.playbackRateButton';
import QualitySelectorButton from './plugins/es.upv.paella.qualitySelector';
import VolumeButton from './plugins/es.upv.paella.volumeButtonPlugin';

export const basicPlugins = [
    {
        plugin: AudioSelectorButton,
        config: {
            enabled: false
        }
    },
    {
        plugin: BackwardButton,
        config: {
            enabled: false
        }
    },
    {
        plugin: CaptionsSelectorButton,
        config: {
            enabled: false
        }
    },
    {
        plugin: DownloadsButton,
        config: {
            enabled: false
        }
    },
    {
        plugin: FindCaptionsButton,
        config: {
            enabled: false
        }
    },
    {
        plugin: ForwardButton,
        config: {
            enabled: false
        }
    },
    {
        plugin: FullscreenButton,
        config: {
            enabled: false
        }
    },
    {
        plugin: KeyboardHelpButton,
        config: {
            enabled: false
        }
    },
    {
        plugin: LayoutSelectorButton,
        config: {
            enabled: false
        }
    },
    {
        plugin: PlaybackRateButton,
        config: {
            enabled: false
        }
    },
    {
        plugin: QualitySelectorButton,
        config: {
            enabled: false
        }
    },
    {
        plugin: VolumeButton,
        config: {
            enabled: false
        }
    }
];

export const AudioSelectorButtonPlugin = AudioSelectorButton;
export const BackwardButtonPlugin = BackwardButton;
export const CaptionsSelectorButtonPlugin = CaptionsSelectorButton;
export const DownloadsButtonPlugin = DownloadsButton;
export const FindCaptionsButtonPlugin = FindCaptionsButton;
export const ForwardButtonPlugin = ForwardButton;
export const FullscreenButtonPlugin = FullscreenButton;
export const KeyboardHelpButtonPlugin = KeyboardHelpButton;
export const LayoutSelectorButtonPlugin = LayoutSelectorButton;
export const PlaybackRateButtonPlugin = PlaybackRateButton;
export const QualitySelectorButtonPlugin = QualitySelectorButton;
export const VolumeButtonPlugin = VolumeButton;
