
import Paella, { PlayerStateNames } from './Paella';
import PlayerState from './core/PlayerState';
import * as utils from './core/utils';
import {
    defaultLoadConfigFunction,
    defaultGetVideoIdFunction,
    defaultGetManifestUrlFunction,
    defaultGetManifestFileUrlFunction,
    defaultLoadVideoManifestFunction
} from './core/initFunctions';
import {
    defaultGetCookieConsentCallback,
    defaultGetCookieDescriptionCallback
} from './core/CookieConsent';
import { createProgressIndicator } from './core/progress-indicator';

import Plugin from './core/Plugin';
import { importPlugins, getPluginsOfType, loadPluginsOfType } from './core/plugin_tools';
import UserInterfacePlugin from './core/UserInterfacePlugin';
import ButtonPlugin from './core/ButtonPlugin';
import PopUpButtonPlugin from './core/PopUpButtonPlugin';
import MenuButtonPlugin from './core/MenuButtonPlugin';
import VideoLayout from './core/VideoLayout';
import VideoPlugin, { Video, isVolumeApiAvailable } from './core/VideoPlugin';
import Events, { bindEvent, triggerEvent, triggerIfReady } from './core/Events';
import PlayerResource from './core/PlayerResource';
import CanvasPlugin, { CanvasButtonPosition, Canvas } from './core/CanvasPlugin';
import Data, { DataPlugin } from './core/Data';
import VideoQualityItem from './core/VideoQualityItem';
import AudioTrackData from './core/AudioTrackData';
import EventLogPlugin from './core/EventLogPlugin';
import ButtonGroupPlugin from './core/ButtonGroupPlugin';
import PluginModule from './core/PluginModule';
import { checkManifestIntegrity } from './core/StreamProvider';
import Loader from './core/Loader';
import { createTimeLinePreview } from './core/timeline-preview';

import { DomClass, createElementWithHtmlText, createElement } from './core/dom';

import WebVTTParser, { parseWebVTT } from './captions/WebVTTParser';
import DFXPParser, { parseDFXP } from './captions/DFXPParser';
import CaptionsPlugin from './captions/CaptionsPlugin';
import Captions from './captions/Captions';

import { VideoContainerMessagePosition } from './core/VideoContainerMessage';

import ManifestParser from './core/ManifestParser';

import PaellaCorePlugins from './plugins/PaellaCorePlugins'

import {
    defaultTranslateFunction,
    defaultSetLanguageFunction,
    defaultGetLanguageFunction,
    defaultAddDictionaryFunction,
    defaultGetDictionariesFunction,
    defaultGetDefaultLanguageFunction,
    translate,
    setLanguage,
    getLanguage,
    addDictionary,
    getDictionaries,
    getDefaultLanguage
} from "./core/Localization";

import Log, {
    log,
    LOG_LEVEL
} from "./core/Log";

/******* Export the built-in plugin classes *******/
// video formats
import HtmlVideoFormatPlugin, { HtmlVideo} from './videoFormats/es.upv.paella.htmlVideoFormat';
import Mp4VideoFormatPlugin, { Mp4Video } from './videoFormats/es.upv.paella.mp4VideoFormat';
import ImageVideoFormatPlugin, { ImageVideo } from './videoFormats/es.upv.paella.imageVideoFormat';
import AudioVideoPlugin, { AudioOnlyVideo } from './videoFormats/es.upv.paella.audioVideoFormat';

// Buttons
import PlayPauseButtonPlugin from './plugins/es.upv.paella.playPauseButton';
import CurrentTimeLabelPlugin from './plugins/es.upv.paella.currentTimeLabelPlugin';

// Video layouts
import SingleVideoLayoutPlugin from './layouts/es.upv.paella.singleVideo';
import DualVideoLayoutPlugin from './layouts/es.upv.paella.dualVideo';
import DualVideoDynamicLayoutPlugin from './layouts/es.upv.paella.dualVideoDynamic';
import TripleVideoLayoutPlugin from './layouts/es.upv.paella.tripleVideo';

// Captions
import VttManifestCaptionsPlugin from './plugins/es.upv.paella.vttManifestCaptionsPlugin';
import DfxpManifestCaptionsPlugin from './plugins/es.upv.paella.dfxpManifestCaptionsPlugin';


// Video canvas
import VideoCanvasPlugin, { VideoCanvas } from './canvas/es.upv.paella.videoCanvas';

// Canvas button
import CanvasButtonPlugin from './core/CanvasButtonPlugin';

// Plugins
import plugins from './paella_plugins';

// Styles

import "@ferserc1/input-style-unifier";

import "../css/base.css";
import "../css/playback-bar.css";
import "../css/accessibility.css";
import "../css/vars.css";
import "../css/menu-button.css";
import "../css/timeline-preview.css";
import "../css/pop-up.css";
import "../css/captions.css";
import "../css/loader.css";
import "../css/video-container.css";

export {
    Paella,
    PlayerState,
    PlayerStateNames,
    utils,
    defaultLoadConfigFunction,
    defaultGetVideoIdFunction,
    defaultGetManifestUrlFunction,
    defaultGetManifestFileUrlFunction,
    defaultLoadVideoManifestFunction,
    defaultGetCookieConsentCallback,
    defaultGetCookieDescriptionCallback,
    PlayerResource,
    Loader,
    
    Plugin,
    PluginModule,
    importPlugins,
    getPluginsOfType,
    loadPluginsOfType,
    UserInterfacePlugin,
    ButtonPlugin,
    PopUpButtonPlugin,
    MenuButtonPlugin,
    VideoLayout,
    VideoPlugin,
    Video,
    Canvas,
    CanvasButtonPosition,
    CanvasPlugin,
    VideoQualityItem,
    AudioTrackData,
    EventLogPlugin,
    ButtonGroupPlugin,
    isVolumeApiAvailable,
    createTimeLinePreview,
    PaellaCorePlugins,
    createProgressIndicator,

    ManifestParser,

    checkManifestIntegrity,
    
    Events,
    bindEvent,
    triggerEvent,
    triggerIfReady,

    DomClass,
    createElement,
    createElementWithHtmlText,

    WebVTTParser,
    parseWebVTT,
    DFXPParser,
    parseDFXP,
    CaptionsPlugin,
    Captions,

    Data,
    DataPlugin,

    HtmlVideo,
    Mp4Video,
    ImageVideo,
    AudioOnlyVideo,

    HtmlVideoFormatPlugin,
    Mp4VideoFormatPlugin,
    ImageVideoFormatPlugin,
    AudioVideoPlugin,

    defaultTranslateFunction,
    defaultSetLanguageFunction,
    defaultGetLanguageFunction,
    defaultAddDictionaryFunction,
    defaultGetDictionariesFunction,
    defaultGetDefaultLanguageFunction,
    translate,
    setLanguage,
    getLanguage,
    addDictionary,
    getDictionaries,
    getDefaultLanguage,

    Log,
    log,
    LOG_LEVEL,

    PlayPauseButtonPlugin,
    CurrentTimeLabelPlugin,

    VttManifestCaptionsPlugin,
    DfxpManifestCaptionsPlugin,

    SingleVideoLayoutPlugin,
    DualVideoLayoutPlugin,
    DualVideoDynamicLayoutPlugin,
    TripleVideoLayoutPlugin,

    VideoCanvasPlugin,
    VideoCanvas,

    CanvasButtonPlugin,

    VideoContainerMessagePosition,

    plugins
}

