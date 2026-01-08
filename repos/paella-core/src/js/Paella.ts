import {
    defaultLoadConfigFunction,
    defaultGetVideoIdFunction,
    defaultGetManifestUrlFunction,
    defaultGetManifestFileUrlFunction,
    defaultLoadVideoManifestFunction
} from './core/initFunctions';
import { 
    resolveResourcePath,
    setupAutoHideUiTimer,
    clearAutoHideTimer,
    getUrlFileName,
    removeExtension,
    removeFileName
} from './core/utils';
import Loader from "./core/Loader";
import ErrorContainer from "./core/ErrorContainer";
import { registerPlugins, unregisterPlugins } from './core/plugin_tools';
import VideoContainer, {
    getSourceWithUrl
} from './core/VideoContainer';
import PreviewContainer from './core/PreviewContainer';
import PlaybackBar from './core/PlaybackBar';
import Events, { bindEvent, triggerEvent, unregisterEvents } from './core/Events';
import Data from './core/Data';
import CaptionCanvas from './captions/CaptionsCanvas';
import { loadLogEventPlugins, unloadLogEventPlugins } from "./core/EventLogPlugin";
import { checkManifestIntegrity } from "./core/StreamProvider";
import CookieConsent, {
    defaultGetCookieConsentCallback,
    defaultGetCookieDescriptionCallback
} from "./core/CookieConsent";
import { getAvailableContentIds } from "./core/VideoLayout";
import { createProgressIndicator } from "./core/progress-indicator.js";

import {
    defaultTranslateFunction,
    defaultSetLanguageFunction,
    defaultAddDictionaryFunction,
    setTranslateFunction,
    setGetLanguageFunction,
    setSetLanguageFunction,
    setAddDictionaryFunction,
    setGetDefaultLanguageFunction,
    addDictionary,
    getDictionaries,
    translate,
    setLanguage,
    getLanguage,
    getDefaultLanguage,
    defaultGetDictionariesFunction,
    setGetDictionariesFunction,
    defaultGetDefaultLanguageFunction,
    setupDefaultLanguage
} from "./core/Localization";

import { defaultGetLanguageFunction } from "./core/Localization";

import Log, { LOG_LEVEL } from "./core/Log";

import defaultDictionaries from "../i18n/all.js";

import Preferences from "./core/Preferences";

import Skin, { overrideSkinConfig, loadSkinStyleSheets, loadSkinIcons, unloadSkinStyleSheets } from "./core/Skin";

import PlayerState from "./core/PlayerState";

export const PlayerStateNames = Object.freeze([
    'UNLOADED',
    'LOADING_MANIFEST',
    'MANIFEST',
    'LOADING_PLAYER',
    'LOADED',
    'UNLOADING_MANIFEST',
    'UNLOADING_PLAYER',
    'ERROR'
]);

function buildPreview(this: Paella): void {
    const preview = (this.videoManifest?.metadata?.preview && resolveResourcePath(this as any, this.videoManifest?.metadata?.preview)) || this.defaultVideoPreview;
    const previewPortrait = (this.videoManifest?.metadata?.previewPortrait && resolveResourcePath(this as any, this.videoManifest?.metadata?.previewPortrait)) || this.defaultVideoPreviewPortrait;
    this._previewContainer = new PreviewContainer(this as any, this._containerElement, preview, previewPortrait);
}

import packageData from "../../package.json";
import ManifestParser from "./core/ManifestParser";

// Types
export interface InitParams {
    configResourcesUrl?: string;
    configUrl?: string;
    repositoryUrl?: string;
    manifestFileName?: string;
    defaultVideoPreview?: string;
    defaultVideoPreviewPortrait?: string;
    loadConfig?: (configUrl: string, player: Paella) => Promise<any>;
    getVideoId?: (config: any, player: Paella) => Promise<string | null>;
    getManifestUrl?: (repositoryUrl: string, videoId: string, config: any, player: Paella) => Promise<string>;
    getManifestFileUrl?: (manifestUrl: string, manifestFileName: string, config: any, player: Paella) => Promise<string>;
    loadVideoManifest?: (manifestFileUrl: string, config: any, player: Paella) => Promise<any>;
    getCookieConsentFunction?: (cookieType: string) => Promise<boolean>;
    getCookieDescriptionFunction?: () => Promise<string>;
    plugins?: Array<any>;
    customLoader?: any;
    translateFunction?: (word: string | undefined | null, keys?: any) => string;
    getLanguageFunction?: () => string;
    setLanguageFunction?: (lang: string) => void;
    addDictionaryFunction?: (lang: string, dict: any) => void;
    getDictionariesFunction?: () => any;
    getDefaultLanguageFunction?: (player: Paella) => string;
    loadDictionaries?: (player: Paella) => Promise<void>;
    getProgressIndicator?: (player: Paella) => any;
    Loader?: any;
}

export interface LoadUrlOptions {
    title?: string;
    duration?: number;
    preview?: string;
    previewPortrait?: string;
}

export interface ContainerSize {
    w: number;
    h: number;
}

export interface CustomIcon {
    pluginName: string;
    iconName: string;
}

// Used in the first step of loadManifest and loadUrl
async function preLoadPlayer(this: Paella): Promise<void> {
    this._playerState = PlayerState.LOADING_MANIFEST;
    this._manifestLoaded = true;

    this.log.debug("Loading paella player");
    this._config = await this.initParams.loadConfig!(this.configUrl, this);

    // Override config.json options from skin
    overrideSkinConfig.apply(this.skin, [this._config]);

    setupDefaultLanguage(this as any);

    this._defaultVideoPreview = this._config.defaultVideoPreview || this._initParams.defaultVideoPreview || "";
    this._defaultVideoPreviewPortrait = this._config.defaultVideoPreviewPortrait || this._initParams.defaultVideoPreviewPortrait || "";

    this._cookieConsent = new CookieConsent(this as any, {
        getConsent: this._initParams.getCookieConsentFunction as any, 
        getDescription: this._initParams.getCookieDescriptionFunction as any
    });

    this._preferences = new Preferences(this as any);

    const urlSearch = new URLSearchParams(window.location.search);
    const caseInsensitiveParams = new URLSearchParams();
    for (const [name, value] of urlSearch) {
        caseInsensitiveParams.append(name.toLowerCase(), value);
    }
    const urlParamLogLevel = caseInsensitiveParams.get("loglevel");
    const logLevel = (urlParamLogLevel && Array.from(Object.keys(LOG_LEVEL)).indexOf(urlParamLogLevel.toUpperCase()) !== -1) ?
        urlParamLogLevel :
        this._config.logLevel || "INFO";
    this._log.setLevel(logLevel);

    // Load localization dictionaries
    await this._initParams.loadDictionaries!(this);

    registerPlugins(this as any);

    // EventLogPlugin plugins are loaded first, so that all lifecycle events can be captured.
    await loadLogEventPlugins(this as any);

    // Create video container.
    this._videoContainer = new VideoContainer(this as any, this._containerElement);

    // This function will load the video plugins
    await this.videoContainer!.create();

    // Load plugin modules dictionaries
    for (const module of this.pluginModules) {
        const dict = module.getDictionaries && await module.getDictionaries();
        if (dict) {
            for (const lang in dict) {
                addDictionary(lang as any, dict[lang]);
            }
        }
    }
}

// Used in the last step of loadManifest and loadUrl
async function postLoadPlayer(this: Paella): Promise<void> {
    this.log.debug("Video manifest loaded:");
    this.log.debug(this.videoManifest);

    // Load data plugins
    this._data = new Data(this as any);

    // Load default dictionaries
    for (const lang in defaultDictionaries) {
        const dict = (defaultDictionaries as any)[lang];
        addDictionary(lang as any, dict);
    }

    this._playerState = PlayerState.MANIFEST;
    triggerEvent(this as any, Events.MANIFEST_LOADED);

    // The video preview is required
    if (!this.videoManifest?.metadata?.preview) {
        throw new Error("No preview image found in video manifest, and no default preview image defined.");
    }
    else {
        buildPreview.apply(this);
    }

    checkManifestIntegrity(this._videoManifest);

    const configDictionaries = this.config?.dictionaries;
    for (const lang in configDictionaries) {
        this.addDictionary(lang, configDictionaries[lang]);
    }
}

/**
 * Paella Player - Main player class that provides video playback functionality
 * with support for multiple streams, plugins, user interface customization,
 * and various video formats.
 * @class
 */
export default class Paella {
    _log: Log;
    _packageData: any;
    _skin: Skin;
    _containerElement: HTMLElement;
    _initParams: InitParams;
    _config: any;
    _defaultVideoPreview: string;
    _defaultVideoPreviewPortrait: string;
    _videoId: string | null;
    _manifestUrl: string | null;
    _manifestFileUrl: string | null;
    _manifestData: any;
    _videoManifest: any;
    _playerLoaded: boolean;
    _manifestLoaded: boolean;
    _resizeEventListener: any;
    _playerState: number;
    _customPluginIcons: Record<string, string>;
    _previewContainer?: PreviewContainer;
    _cookieConsent?: CookieConsent;
    _preferences?: Preferences;
    _videoContainer?: VideoContainer;
    _playbackBar?: PlaybackBar;
    _captionsCanvas?: CaptionCanvas;
    _manifestParser?: ManifestParser;
    _loader?: any;
    _errorContainer?: ErrorContainer;
    _data?: Data;
    _hideUiTime?: number;
    _uiHidden: boolean;
    _resizeEndTimer?: number;
    _requestedCustomIcons?: CustomIcon[];
    __pluginModules?: any[];
    __pluginData__?: any;

    /**
     * Creates a new Paella player instance.
     * @param {string|HTMLElement} containerElement - The container element ID or HTML element where the player will be mounted
     * @param {InitParams} [initParams={}] - Initialization parameters for the player
     * @param {string} [initParams.configResourcesUrl] - URL for configuration resources
     * @param {string} [initParams.configUrl] - URL for the configuration file
     * @param {string} [initParams.repositoryUrl] - Default directory with the manifest video repository
     * @param {string} [initParams.manifestFileName] - Default manifest file name
     * @param {Function} [initParams.loadConfig] - Custom function to load configuration
     * @param {Function} [initParams.getVideoId] - Custom function to get video ID
     * @param {Function} [initParams.getManifestUrl] - Custom function to get manifest URL
     * @param {Function} [initParams.getManifestFileUrl] - Custom function to get manifest file URL
     * @param {Function} [initParams.loadVideoManifest] - Custom function to load video manifest
     * @param {Function} [initParams.getCookieConsentFunction] - Custom function for cookie consent
     * @param {Array<PluginRef|Plugin>} [initParams.plugins] - Array of plugin references or instances
     */
    constructor(containerElement: string | HTMLElement, initParams: InitParams = {}) {
        this._log = new Log(this as any);

        this._packageData = packageData;

        // The default log level before loading the configuration is
        // VERBOSE, to ensure that all previous messages are displayed
        this._log.setLevel(LOG_LEVEL.VERBOSE);

        // Debug: create an array of all paella player instances
        (window as any).__paella_instances__ = (window as any).__paella_instances__ || [];
        (window as any).__paella_instances__.push(this);

        this.log.debug("New paella player instance");
        
        
        if (typeof(containerElement) === "string") {
            containerElement = document.getElementById(containerElement)!;
        }
        
        containerElement.classList.add("player-container");

        this.log.debug("Loading skin manager");
        this._skin = new Skin(this as any);
        
        this._containerElement = containerElement;
        this._initParams = initParams;
        
        // Default initParams values:
        this._initParams.manifestFileName = this._initParams.manifestFileName || "data.json";
        this._initParams.loadConfig = this._initParams.loadConfig || (defaultLoadConfigFunction as any);
        this._initParams.getVideoId = this._initParams.getVideoId || (defaultGetVideoIdFunction as any);
        this._initParams.getManifestUrl = this._initParams.getManifestUrl || (defaultGetManifestUrlFunction as any);
        this._initParams.getManifestFileUrl = this._initParams.getManifestFileUrl || (defaultGetManifestFileUrlFunction as any);
        this._initParams.loadVideoManifest = this._initParams.loadVideoManifest || (defaultLoadVideoManifestFunction as any);
        this._initParams.translateFunction = this._initParams.translateFunction || (defaultTranslateFunction as any);
        this._initParams.getLanguageFunction = this._initParams.getLanguageFunction || (defaultGetLanguageFunction as any);
        this._initParams.setLanguageFunction = this._initParams.setLanguageFunction || (defaultSetLanguageFunction as any);
        this._initParams.addDictionaryFunction = this._initParams.addDictionaryFunction || (defaultAddDictionaryFunction as any);
        this._initParams.getDictionariesFunction = this._initParams.getDictionariesFunction || (defaultGetDictionariesFunction as any);
        this._initParams.getDefaultLanguageFunction = this._initParams.getDefaultLanguageFunction || (defaultGetDefaultLanguageFunction as any);
        this._initParams.Loader = this._initParams.customLoader || Loader;
        this._initParams.getCookieConsentFunction = this._initParams.getCookieConsentFunction || (defaultGetCookieConsentCallback as any);
        this._initParams.getCookieDescriptionFunction = this._initParams.getCookieDescriptionFunction || (defaultGetCookieDescriptionCallback as any);
        this._initParams.getProgressIndicator = this._initParams.getProgressIndicator || (createProgressIndicator as any);

        this._initParams.loadDictionaries = this._initParams.loadDictionaries || async function(player: Paella) {
            addDictionary("en", {
                "Hello": "Hello",
                "World": "World"
            });

            addDictionary("es", {
                "Hello": "Hola",
                "World": "Mundo"
            });

            setLanguage(navigator.language.substring(0,2) as any);
        }

        const userPlugins = this._initParams.plugins || [];
        this._initParams.plugins = [
            ...userPlugins
        ]

        setTranslateFunction(this._initParams.translateFunction!);
        setSetLanguageFunction(this._initParams.setLanguageFunction!);
        setGetLanguageFunction(this._initParams.getLanguageFunction! as any);
        setAddDictionaryFunction(this._initParams.addDictionaryFunction!);
        setGetDictionariesFunction(this._initParams.getDictionariesFunction!);
        setGetDefaultLanguageFunction(this._initParams.getDefaultLanguageFunction! as any);

        this._config = null;
        this._defaultVideoPreview = "";
        this._defaultVideoPreviewPortrait = "";
        this._videoId = null;
        this._manifestUrl = null;
        this._manifestFileUrl = null;
        this._manifestData = null;
        this._videoManifest = null;

        // Load status flags
        this._playerLoaded = false;
        this._manifestLoaded = false;
        this._uiHidden = false;

        const resize = () => {
            this.resize();
        }
        this._resizeEventListener = window.addEventListener("resize", resize);
        
        this.containerElement.addEventListener("fullscreenchange", () => {
            triggerEvent(this as any, Events.FULLSCREEN_CHANGED, { status: this.isFullscreen });
            this.isFullscreen ? triggerEvent(this as any, Events.ENTER_FULLSCREEN) : triggerEvent(this as any, Events.EXIT_FULLSCREEN);
        });

        this._playerState = PlayerState.UNLOADED;

        this._customPluginIcons = {};
    }

    /**
     * Gets the current version of the player.
     * @type {string}
     */
    get version(): string {
        return this._packageData.version;
    }

    /**
     * Gets the array of loaded plugin modules.
     * @type {PluginModule[]}
     */
    get pluginModules(): any[] {
        return this.__pluginModules || [];
    }

    /**
     * Gets the logger instance for the player.
     * @type {Log}
     */
    get log(): Log {
        return this._log;
    }

    /**
     * Indicates if the player is ready for use (fully loaded).
     * @type {boolean}
     */
    get ready(): boolean {
        return this._playerState === PlayerState.LOADED;
    }

    /**
     * Gets the current player state as a numeric value.
     * @type {number}
     */
    get state(): number {
        return this._playerState;
    }

    /**
     * Gets the current player state as a human-readable string.
     * @type {string}
     */
    get stateText(): string {
        return PlayerStateNames[this.state];
    }

    /**
     * Indicates if the player has loaded successfully.
     * @type {boolean}
     */
    get playerLoaded(): boolean {
        return this._playerLoaded;
    }

    /**
     * Indicates if the configuration has been loaded.
     * @type {boolean}
     */
    get configLoaded(): boolean {
        return this.configUrl !== null;
    }

    /**
     * Indicates if the video manifest has been loaded.
     * @type {boolean}
     */
    get videoManifestLoaded(): boolean {
        return this.videoManifest !== null;
    }

    /**
     * Indicates if the video streams have been loaded.
     * @type {boolean}
     */
    get videoLoaded(): boolean {
        return this.videoContainer?.ready || false;
    }

    /**
     * Gets the Events constants object.
     * @type {Events}
     */
    get Events(): typeof Events {
        return Events;
    }

    /**
     * Gets the PlayerState constants object.
     * @type {PlayerState}
     */
    get PlayerState(): typeof PlayerState {
        return PlayerState;
    }

    /**
     * Gets the PlayerStateNames array.
     * @type {PlayerStateNames}
     */
    get PlayerStateNames(): readonly string[] {
        return PlayerStateNames;
    }

    /**
     * Gets the preferences manager instance.
     * @type {Preferences}
     */
    get preferences(): Preferences | undefined {
        return this._preferences;
    }

    /**
     * Gets the skin manager instance.
     * @type {Skin}
     */
    get skin(): Skin {
        return this._skin;
    }

    /**
     * Gets the cookie consent manager instance.
     * @type {CookieConsent}
     */
    get cookieConsent(): CookieConsent | undefined {
        return this._cookieConsent;
    }

    /**
     * Gets the data manager instance for plugin data storage.
     * @type {Data}
     */
    get data(): Data | undefined {
        return this._data;
    }

    /**
     * Indicates if the player container currently has focus.
     * @type {boolean}
     */
    get containsFocus(): boolean {
        return this.containerElement.contains(document.activeElement);
    }

    /**
     * Gets/sets the time in milliseconds after which the UI will be hidden.
     * @type {number}
     */
    get hideUiTime(): number | undefined {
        return this._hideUiTime;
    }

    set hideUiTime(val: number | undefined) {
        this._hideUiTime = val;
    }
    
    /**
     * Gets the current size of the player container.
     * @type {{w: number, h: number}}
     */
    get containerSize(): ContainerSize { 
        return { 
            w: this._containerElement.offsetWidth, 
            h: this._containerElement.offsetHeight 
        }; 
    }
    
    /**
     * Gets the HTML container element for the player.
     * @type {HTMLElement}
     */
    get containerElement(): HTMLElement { 
        return this._containerElement; 
    }

    /**
     * Gets the initialization parameters used to create the player.
     * @type {InitParams}
     */
    get initParams(): InitParams { 
        return this._initParams; 
    }

    /**
     * Gets the URL for configuration resources.
     * @type {string}
     */
    get configResourcesUrl(): string {
        return this._initParams?.configResourcesUrl || 'config/';
    }
    
    /**
     * Gets the URL for the main configuration file.
     * @type {string}
     */
    get configUrl(): string {
        return this._initParams?.configUrl || 'config/config.json';
    }

    /**
     * Gets the loaded configuration object.
     * @type {Config}
     */
    get config(): any {
        return this._config;
    }

    /**
     * Gets the default video preview image URL.
     * @type {string}
     */
    get defaultVideoPreview(): string {
        return this._defaultVideoPreview;
    }

    /**
     * Gets the default video preview image URL for portrait mode.
     * @type {string}
     */
    get defaultVideoPreviewPortrait(): string {
        return this._defaultVideoPreviewPortrait;
    }

    /**
     * Gets the current video identifier.
     * @type {string}
     */
    get videoId(): string | null {
        return this._videoId;
    }

    /**
     * Gets the base URL where the video repository is located.
     * @type {string}
     */
    get repositoryUrl(): string {
        return this._initParams?.repositoryUrl || this.config?.repositoryUrl || "";
    }

    /**
     * Gets the base URL where the video manifest file is located.
     * @type {string}
     */
    get manifestUrl(): string | null {
        return this._manifestUrl;
    }

    /**
     * Gets the video manifest file name.
     * @type {string}
     */
    get manifestFileName(): string {
        return this.config?.manifestFileName || this._initParams?.manifestFileName || "";
    }

    /**
     * Gets the full path of the video manifest file.
     * @type {string}
     */
    get manifestFileUrl(): string | null {
        return this._manifestFileUrl;
    }

    /**
     * Gets the loaded video manifest object.
     * @type {Manifest}
     */
    get videoManifest(): any {
        return this._videoManifest;
    }

    /**
     * Gets the preview container instance.
     * @type {PreviewContainer}
     */
    get previewContainer(): PreviewContainer | undefined {
        return this._previewContainer;
    }

    /**
     * Gets the video container instance that manages video playback.
     * @type {VideoContainer}
     */
    get videoContainer(): VideoContainer | undefined {
        return this._videoContainer;
    }

    /**
     * Gets the playback bar instance.
     * @type {PlaybackBar}
     */
    get playbackBar(): PlaybackBar | undefined {
        return this._playbackBar;
    }

    /**
     * Gets the captions canvas instance for subtitle display.
     * @type {CaptionsCanvas}
     */
    get captionsCanvas(): CaptionCanvas | undefined {
        return this._captionsCanvas;
    }

    /**
     * Gets the video metadata from the manifest.
     * @type {Record<string, any>}
     */
    get metadata(): Record<string, any> {
        return this._manifestParser?.metadata || {};
    }

    /**
     * Gets the video streams array from the manifest.
     * @type {Stream[]}
     */
    get streams(): any[] {
        return (this._manifestParser?.streams || []) as any[];
    }

    /**
     * Gets the frame list for video thumbnails.
     * @type {FrameList}
     */
    get frameList(): any {
        return this._manifestParser?.frameList || { frames: [] };
    }

    /**
     * Gets the chapters information.
     * @type {Chapters}
     */
    get chapters(): any {
        return this._manifestParser?.chapters || { chapterList: []  };
    }

    /**
     * Gets the captions information.
     * @type {Caption[]}
     */
    get captions(): any[] {
        return this._manifestParser?.captions || [];
    }

    /**
     * Gets the trimming parameters for the video.
     * @type {TrimmingParams}
     */
    get trimming(): any {
        return this._manifestParser?.trimming || {};
    }

    /**
     * Indicates if the timeline should be visible.
     * @type {boolean}
     */
    get visibleTimeLine(): boolean {
        return this._manifestParser?.visibleTimeLine || true;
    }

    /**
     * Gets the timeline frame at the current playback time.
     * @returns {Promise<string|null>} The timeline frame URL or null if not available
     */
    async getTimelineFrame(): Promise<string | null> {
        const currentTime = await this.videoContainer!.streamProvider.currentTimeIgnoringTrimming();
        return this._manifestParser!.getTimelineFrameAtTime(currentTime);
    }

    /**
     * Gets the timeline frame at a specific time.
     * @param {number} time - The time in seconds
     * @returns {Promise<string|null>} The timeline frame URL or null if not available
     */
    async getTimelineFrameAtTime(time: number): Promise<string | null> {
        const start = this.videoContainer!.isTrimEnabled ? this.videoContainer!.trimStart : 0;
        return this._manifestParser!.getTimelineFrameAtTime(time - start);
    }

    /**
     * Translate a word or phrase.
     * @param {string | undefined | null} word - The word to translate.
     * @param {Object} [keys=null] - Optional keys for placeholders.
     * @returns {string} - The translated word.
     */
    translate(word: string | undefined | null, keys: any = null): string {
        return translate(word as any, keys) as any;
    }

    /**
     * Set the current language.
     * @param {string} lang - The language code.
     */
    setLanguage(lang: string): void {
        setLanguage(lang as any);
    }

    /**
     * Get the current language.
     * @returns {string} - The current language code.
     */
    getLanguage(): string {
        return getLanguage();
    }

    /**
     * Add a dictionary for a specific language.
     * @param {string} lang - The language code.
     * @param {Object} dict - The dictionary object.
     */
    addDictionary(lang: string, dict: any): void {
        addDictionary(lang as any, dict);
    }

    /**
     * Get all loaded dictionaries.
     * @returns {Object} - The dictionaries.
     */
    getDictionaries(): any {
        return getDictionaries();
    }

    /**
     * Get the default language.
     * @returns {string} - The default language code.
     */
    getDefaultLanguage(): string {
        return getDefaultLanguage(this as any);
    }

    /**
     * Bind an event to the player.
     * @param {string | string[]} eventName - The event name.
     * @param {Function} fn - The callback function.
     * @param {boolean} [unregisterOnUnload=true] - Whether to unregister the event on unload.
     */
    bindEvent(eventName: string | string[], fn: (data: any) => void, unregisterOnUnload: boolean = true): void {
        bindEvent(this as any, eventName, (data: any) => fn(data), unregisterOnUnload);
    }

    /**
     * Gets a plugin instance by name and optionally by type.
     * @param {string} name - The plugin name
     * @param {string|null} [type=null] - The plugin type (optional)
     * @returns {Plugin|Record<string, Plugin>|undefined} The plugin instance(s)
     */
    getPlugin(name: string, type: string | null = null): any | Record<string, any> | undefined {
        if (type) {
            const plugins = this.__pluginData__?.pluginInstances[type];
            if (plugins) {
                return plugins.find((p: any) => {
                    if (p.name === name) {
                        return p;
                    }
                });
            }
        }
        else {
            const result: Record<string, any> = {};
            for (const t in this.__pluginData__?.pluginInstances) {
                const instances = this.__pluginData__.pluginInstances[t];
                const p = instances.find((p: any) => {
                    if (p.name === name) {
                        return p;
                    }
                });
                if (p) {
                    result[t] = p;
                }
            }
            return result;
        }
    }

    /**
     * Waits for the player to reach a specific state.
     * @param {string|number} state - The target state (name or numeric value)
     * @returns {Promise<void>} A promise that resolves when the state is reached
     * @throws {Error} If the state is invalid
     */
    waitState(state: string | number): Promise<void> {
        return new Promise((resolve, reject) => {
            const checkState = () => {
                if (this.state === state) {
                    resolve();
                }
                else {
                    setTimeout(checkState, 50);
                }
            }
            if (typeof(state) === 'string') {
                state = (PlayerState as any)[state];
            }
            
            const numState = state as number;
            if (numState < 0 || numState > Object.values(PlayerState).length) {
                reject(Error(`Invalid player state '${state}'`));
            }
    
            checkState();
        })
    }

    /**
     * Load a video from a URL.
     * @param {string|string[]} url - The video URL(s).
     * @param {Object} [options] - Additional options.
     * @param {string} [options.title] - The video title.
     * @param {number} [options.duration] - The video duration.
     * @param {string} [options.preview] - The preview image URL.
     * @param {string} [options.previewPortrait] - The portrait preview image URL.
     */
    async loadUrl(url: string | string[], { title, duration, preview, previewPortrait }: LoadUrlOptions = {}): Promise<void> {
        if (this._playerState !== PlayerState.UNLOADED) {
            throw new Error(this.translate("loadUrl(): Invalid current player state: $1", [PlayerStateNames[this._playerState]]));
        }
        if (this._manifestLoaded) {
            throw new Error(this.translate("loadUrl(): Invalid current player state: $1", [PlayerStateNames[this._playerState]]));
        }
        if (!url) {
            throw new Error(this.translate("loadUrl(): No URL specified."));
        }

        if (!Array.isArray(url)) {
            url = [url];
        }

        if (!title) {
            title = getUrlFileName(url[0]);
            this.log.warn("Paella.loadUrl(): no title specified. Using URL file name as video name.");
        }

        try {
            await preLoadPlayer.apply(this);

            if (!preview && (this.defaultVideoPreview !== "" || this.defaultVideoPreviewPortrait !== "")) {
                preview = this.defaultVideoPreview;
                previewPortrait = this.defaultVideoPreviewPortrait;
                this.log.warn("Paella.loadUrl(): no preview image specified. Using default preview image.");
            }
            else if (!preview && !previewPortrait) {
                throw new Error("Paella.loadUrl(): no preview image specified and no default preview image configured.");
            }

            this._videoId = removeExtension(getUrlFileName(url[0])!);
            
            this._manifestUrl = removeFileName(url[0]);
            this._manifestFileUrl = url[0];

            this.log.debug(`Loading video with identifier '${this.videoId}' from URL '${this.manifestFileUrl}'`);

            const validContents = getAvailableContentIds(this as any, url.length)[0];
            this._videoManifest = {
                metadata: {
                    duration,
                    title,
                    preview,
                    previewPortrait
                },

                streams: url.map((u, i) => {
                    const sources = getSourceWithUrl(this as any, u);
                    return {
                        sources,
                        content: validContents[i],
                        role: i === 0 ? 'mainAudio' : null
                    };
                })
            };

            await postLoadPlayer.apply(this);
        }
        catch (err: any) {
            this._playerState = PlayerState.ERROR;
            this.log.error(err);
            this._errorContainer = new ErrorContainer(this as any, this.translate(err.message));
            throw err;
        }
    }

    /**
     * Load the video manifest.
     */
    async loadManifest(): Promise<void> {
        if (this._playerState !== PlayerState.UNLOADED) {
            throw new Error(this.translate("loadManifest(): Invalid current player state: $1", [PlayerStateNames[this._playerState]]));
        }
        if (this._manifestLoaded) return;

        try {
            await preLoadPlayer.apply(this);
    
            this._videoId = await this.initParams.getVideoId!(this._config, this);
            if (this.videoId === null) {
                throw new Error('No video identifier specified');
            }
    
            this._manifestUrl = await this.initParams.getManifestUrl!(this.repositoryUrl, this.videoId, this._config, this);
            
            this._manifestFileUrl = await this.initParams.getManifestFileUrl!(this._manifestUrl, this.manifestFileName, this._config, this);
    
            this.log.debug(`Loading video with identifier '${this.videoId}' from URL '${this.manifestFileUrl}'`);
    
            this._videoManifest = await this.initParams.loadVideoManifest!(this.manifestFileUrl!, this._config, this as any);
            this._videoManifest.metadata = this._videoManifest.metadata || {};
            if (!this._videoManifest.metadata.preview && (this.defaultVideoPreview !== "" || this.defaultVideoPreviewPortrait !== "")) {
                this._videoManifest.metadata.preview = this.defaultVideoPreview;
                this._videoManifest.metadata.previewPortrait = this.defaultVideoPreviewPortrait;
                this.log.warn("Paella.loadUrl(): no preview image specified. Using default preview image.");
            }

            this._manifestParser = new ManifestParser(this.videoManifest, this as any);
    
            // Load custom icons from skin
            unloadSkinStyleSheets.apply(this.skin);
            await loadSkinIcons.apply(this.skin);

            // Load custom style sheets
            await loadSkinStyleSheets.apply(this.skin);

            await postLoadPlayer.apply(this);
        }
        catch (err: any) {
            this._playerState = PlayerState.ERROR;
            this.log.error(err);
            this._errorContainer = new ErrorContainer(this as any, this.translate(err.message));
            throw err;
        }
    }

    /**
     * Load the player interface.
     * @returns {Promise<void>}
     */
    async loadPlayer(): Promise<void> {
        try {
            this._captionsCanvas = new CaptionCanvas(this as any, this._containerElement);

            if (this._playerState !== PlayerState.MANIFEST) {
                throw new Error(this.translate("loadPlayer(): Invalid current player state: $1", [PlayerStateNames[this._playerState]]));
            }
    
            this._playerState = PlayerState.LOADING_PLAYER;
    
            this._previewContainer?.removeFromParent();
    
            this._loader = new this.initParams.Loader!(this);
            await this._loader.create();
    
            await this.videoContainer!.load(this.videoManifest?.streams);
    
            triggerEvent(this as any, Events.STREAM_LOADED);
            
            this._playbackBar = new PlaybackBar(this as any, this.containerElement);
            
            await this._playbackBar.load();
            
            // UI hide timer
            this._hideUiTime = this.config.ui?.hideUITimer ?? 5000;
            setupAutoHideUiTimer(this as any);
            
            this._captionsCanvas.load();
    
            this._playerState = PlayerState.LOADED;
    
            // Reload the video layout once the playback bar is loaded
            await this.videoContainer!.updateLayout();

            triggerEvent(this as any, Events.PLAYER_LOADED);
    
            const hideTimeLine = !(this.videoManifest.metadata.visibleTimeLine ?? true);
            if (hideTimeLine) {
                this.playbackBar!.progressIndicator.hideTimeLine();
            }
            
            if (!this._loader.debug) {
                this._loader.removeFromParent();
                this._loader = undefined;
            }
                
        }
        catch (err: any) {
            this._playerState = PlayerState.ERROR;
            if (this._loader) {
                this._loader.removeFromParent();
                this._loader = undefined;
            }
            this._errorContainer = new ErrorContainer(this as any, err.message);
            throw err;
        }
    }

    /**
     * Load the player (manifest and interface).
     * @returns {Promise<void>}
     */
    async load(): Promise<void> {
        switch (this.state) {
        case PlayerState.UNLOADED:
            await this.loadManifest();
            await this.loadPlayer();
            break;
        case PlayerState.MANIFEST:
            await this.loadPlayer();
            break;
        case PlayerState.LOADED:
            break;
        default:
            throw new Error(this.translate("Could not load player: state transition in progress: $1", [PlayerStateNames[this.state]]));
        }
    }

    /**
     * Unload the player.
     * @returns {Promise<void>}
     */
    async unload(): Promise<void> {
        switch (this.state) {
        case PlayerState.UNLOADED:
            break;
        case PlayerState.MANIFEST:
            await this.unloadManifest();
            break;
        case PlayerState.LOADED:
        case PlayerState.ERROR:
            await this.unloadPlayer();
            await this.unloadManifest();
            break;
        default:
            throw new Error(this.translate("Could not unload player: state transition in progress: $1", [PlayerStateNames[this.state]]));
        }
    }

    /**
     * Unloads and then completely removes this Paella instance. Reverts all
     * effects of the constructor. This method is useful for SPAs where
     * the instance should be completely removed on navigation.
     * @returns {Promise<void>}
     */
    async destroy(): Promise<void> {
        await this.unload();

        window.removeEventListener("resize", this._resizeEventListener);

        setTranslateFunction(defaultTranslateFunction);
        setSetLanguageFunction(defaultSetLanguageFunction);
        setGetLanguageFunction(defaultGetLanguageFunction);
        setAddDictionaryFunction(defaultAddDictionaryFunction);
        setGetDictionariesFunction(defaultGetDictionariesFunction);
        setGetDefaultLanguageFunction(defaultGetDefaultLanguageFunction);

        if ((window as any).__paella_instances__ && Array.isArray((window as any).__paella_instances__)) {
            const index = (window as any).__paella_instances__.indexOf(this);
            if (index > -1) {
                (window as any).__paella_instances__.splice(index, 1);
            }
        }
    }
    
    /**
     * Unloads the video manifest and all its resources.
     * @returns {Promise<void>}
     */
    async unloadManifest(): Promise<void> {
        if (this._playerState !== PlayerState.MANIFEST && this._playerState !== PlayerState.ERROR) {
            throw new Error(this.translate("unloadManifest(): Invalid current player state: $1", [PlayerStateNames[this._playerState]]));
        }
        if (this._errorContainer) {
            this._errorContainer.removeFromParent();
            this._errorContainer = undefined;
        }
        this._playerState = PlayerState.UNLOADING_MANIFEST;
        
        this.log.debug("Unloading paella player");
        
        // EventLogPlugin plugins are loaded first, so that all lifecycle events can be captured.
        await unloadLogEventPlugins(this as any);
        
        await unregisterPlugins(this as any);
        
        this._manifestLoaded = false;
        this._previewContainer?.removeFromParent();
        this._preferences = undefined;
        this._playerState = PlayerState.UNLOADED;

        // Unload skin style sheets
        unloadSkinStyleSheets.apply(this.skin);
    }

    /**
     * Unload the player interface.
     * @returns {Promise<void>}
     */
    async unloadPlayer(): Promise<void> {
        if (this._playerState !== PlayerState.LOADED && this._playerState !== PlayerState.ERROR) {
            throw new Error(this.translate("unloadManifest(): Invalid current player state: $1", [PlayerStateNames[this._playerState]]));
        }
        if (this._errorContainer) {
            this._errorContainer.removeFromParent();
            this._errorContainer = undefined;
        }
        this._playerState = PlayerState.UNLOADING_PLAYER;
        
        await this._videoContainer?.unload();
        this._videoContainer = undefined;
        
        await this._playbackBar?.unload();
        this._playbackBar = undefined;
        
        this._captionsCanvas?.unload();
        this._captionsCanvas = undefined;
        
        clearAutoHideTimer(this as any);
        
        triggerEvent(this as any, Events.PLAYER_UNLOADED);
        
        if (this.videoManifest?.metadata?.preview) {
            buildPreview.apply(this);
        }
        
        unregisterEvents(this as any);
        this._playerState = PlayerState.MANIFEST;
    }

    /**
     * Reload the player.
     * @param {Function} [onUnloadFn=null] - Function to call after unloading.
     * @returns {Promise<void>}
     */
    async reload(onUnloadFn: (() => Promise<void>) | null = null): Promise<void> {
        switch (this.state) {
        case PlayerState.UNLOADED:
            break;
        case PlayerState.MANIFEST:
            await this.unloadManifest();
            break;
        case PlayerState.LOADED:
            await this.unload();
            break;
        }
        
        if (typeof(onUnloadFn) === "function") {
            await onUnloadFn();
        }
        await this.load();
    }

    /**
     * Resizes the player and triggers resize events.
     * @returns {Promise<void>}
     */
    async resize(): Promise<void> {
        this.videoContainer?.updateLayout();
        this.playbackBar?.onResize();

        if (this.videoContainer) {    
            const getSize = () => {
                return {
                    w: this.videoContainer!.element.offsetWidth,
                    h: this.videoContainer!.element.offsetHeight
                }
            };
            triggerEvent(this as any, Events.RESIZE, { size: getSize() });

            if (this._resizeEndTimer) {
                clearTimeout(this._resizeEndTimer);
            }

            this._resizeEndTimer = window.setTimeout(() => {
                triggerEvent(this as any, Events.RESIZE_END, { size: getSize() });
            }, 1000);
        }
    }
    
    /**
     * Hide the user interface.
     * @returns {Promise<void>}
     */
    async hideUserInterface(): Promise<void> {
        if (!(await this.videoContainer?.paused())) {
            this._uiHidden = true;
            this.videoContainer?.hideUserInterface();
            this.playbackBar?.hideUserInterface();
            triggerEvent(this as any, Events.HIDE_UI);
        }
    }
    
    /**
     * Show the user interface.
     * @returns {Promise<void>}
     */
    async showUserInterface(): Promise<void> {
        this.videoContainer?.showUserInterface();
        this.playbackBar?.showUserInterface();
        this._uiHidden && triggerEvent(this as any, Events.SHOW_UI);
        this._uiHidden = false;
    }

    /**
     * Play the video.
     * @returns {Promise<void>}
     */
    async play(): Promise<void> {
        if (!this.videoContainer!.ready) {
            await this.loadPlayer();
        }

        return await this.videoContainer!.play();
    }

    /**
     * Pause the video.
     * @returns {Promise<void>}
     */
    async pause(): Promise<void> {
        return await this.videoContainer?.pause();
    }

    /**
     * Toggle between play and pause.
     * @returns {Promise<void>}
     */
    async togglePlay(): Promise<void> {
        if (!this.videoContainer!.ready) {
            return await this.play();
        }

        if (await this.paused()) {
            return await this.play();
        }
        else {
            return await this.pause();
        }
    }

    /**
     * Check if the video is paused.
     * @returns {Promise<boolean>}
     */
    async paused(): Promise<boolean> {
        if (!this.videoContainer) {
            return true;
        }
        else {
            return this.videoContainer.paused();
        }
    }

    /**
     * Stop the video.
     * @returns {Promise<void>}
     */
    async stop(): Promise<void> {
        return await this.videoContainer?.stop();
    }

    /**
     * Set the current playback time.
     * @param {number} t - The time in seconds.
     * @returns {Promise<void>}
     */
    async setCurrentTime(t: number): Promise<void> {
        return await this.videoContainer?.setCurrentTime(t);
    }

    /**
     * Get the current playback time.
     * @returns {Promise<number>}
     */
    async currentTime(): Promise<number | undefined> {
        return this.videoContainer?.currentTime();
    }

    /**
     * Get the current volume.
     * @returns {Promise<number>}
     */
    async volume(): Promise<number | undefined> {
        return this.videoContainer?.volume();
    }

    /**
     * Set the volume.
     * @param {number} v - The volume level (0-1).
     * @returns {Promise<void>}
     */
    async setVolume(v: number): Promise<void> {
        return this.videoContainer?.setVolume(v);
    }

    /**
     * Get the video duration.
     * @returns {Promise<number>}
     */
    async duration(): Promise<number | undefined> {
        return this.videoContainer?.duration();
    }

    /**
     * Get the playback rate.
     * @returns {Promise<number>}
     */
    async playbackRate(): Promise<number | undefined> {
        return this.videoContainer?.playbackRate();
    }

    /**
     * Set the playback rate.
     * @param {number} r - The playback rate.
     * @returns {Promise<void>}
     */
    async setPlaybackRate(r: number): Promise<void> {
        return this.videoContainer?.setPlaybackRate(r);
    }
    
    /**
     * Skip forward by a number of seconds.
     * @param {number} s - The number of seconds to skip.
     * @returns {Promise<void>}
     */
    async skipSeconds(s: number): Promise<void> {
        const currentTime = await this.currentTime();
        return await this.setCurrentTime(currentTime! + s);
    }

    /**
     * Rewind by a number of seconds.
     * @param {number} s - The number of seconds to rewind.
     * @returns {Promise<void>}
     */
    async rewindSeconds(s: number): Promise<void> {
        const currentTime = await this.currentTime();
        return await this.setCurrentTime(currentTime! - s);
    }

    /**
     * Check if fullscreen is supported.
     * @returns {boolean}
     */
    isFullScreenSupported(): boolean {
        return !!(this.containerElement as any).requestFullscreen ||
            !!(this.containerElement as any).webkitRequestFullScreen;
    }
    
    /**
     * Enter fullscreen mode.
     * @returns {Promise<void>}
     */
    async enterFullscreen(): Promise<void> {
        let result: Promise<void> | null = null;
        if ((this.containerElement as any).requestFullscreen) {
            result = (this.containerElement as any).requestFullscreen();
        }
        else if ((this.containerElement as any).webkitRequestFullScreen) {
            this.log.debug("Safari enter fullscreen");
            result = (this.containerElement as any).webkitRequestFullScreen();
        }
        setTimeout(() => this.resize(), 500);
        return result || Promise.resolve();
    } 

    /**
     * Exit fullscreen mode.
     * @returns {Promise<void>}
     */
    async exitFullscreen(): Promise<void> {
        if ((document as any).exitFullscreen && this.isFullscreen) {
            return (document as any).exitFullscreen();
        }
        else if ((document as any).webkitCancelFullScreen && this.isFullscreen) {
            this.log.debug("Safari exit fullscreen");
            return (document as any).webkitCancelFullScreen();
        }
    }
    
    /**
     * Check if the player is in fullscreen mode.
     * @returns {boolean}
     */
    get isFullscreen(): boolean {
        return  (document as any).fullscreenElement === this.containerElement ||
                (document as any).webkitFullscreenElement === this.containerElement;
    }

    /**
     * Add a custom plugin icon.
     * @param {string} pluginName - The plugin unique identifier, for example `es.upv.paella.playPauseButton`.
     * @param {string} iconName - The icon name in the plugin.
     * @param {string} svgData - The SVG data for the icon.
     */
    addCustomPluginIcon(pluginName: string, iconName: string, svgData: string): void {
        this._customPluginIcons[`${pluginName}-${iconName}`] = svgData;
    }

    /**
     *  Remove a custom plugin icon.
     * @param {string} pluginName - The plugin unique identifier, for example `es.upv.paella.playPauseButton`.
     * @param {string} iconName - The icon name in the plugin.
     */
    removeCustomPluginIcon(pluginName: string, iconName: string): void {
        delete this._customPluginIcons[`${pluginName}-${iconName}`];
    }

    /**
     * Get a custom plugin icon.
     * @param {string} pluginName - The plugin name.
     * @param {string} iconName - The icon name.
     * @returns {string|null} - The SVG data for the icon, or null if not found.
     */
    getCustomPluginIcon(pluginName: string, iconName: string): string | null | undefined {
        this._requestedCustomIcons = this._requestedCustomIcons || [];
        if (!this._requestedCustomIcons.find(item => item.pluginName === pluginName && item.iconName === iconName)) {
            this._requestedCustomIcons.push({
                pluginName,
                iconName
            });
        }
        return this._customPluginIcons[`${pluginName}-${iconName}`];
    }

    /**
     * Gets the list of requested custom icons during the current session.
     * @type {Array<{pluginName: string, iconName: string}>}
     */
    get requestedCustomIcons(): CustomIcon[] {
        return this._requestedCustomIcons || [];
    }
}
