declare module "@asicupv/paella-core" {

    export type PluginConfig = Record<string, unknown> & {
        enabled: boolean;
        order: number;
    };

    export interface Plugin {

    }

    export type LogLevel = "DISABLED" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "VERBOSE";

    export type DynamicLayoutAlignment = "align-center" | "align-top" | "align-bottom" | "align-left" | "align-right";

    export type ButtonPluginSide = "left" | "right";

    export interface Config {
        /** Default video ID to be used when one is not specified explicitly */
        fallbackId:                  string;

        /** Default directory with the manifest video repository */
        repositoryUrl:               string;

        /** Default manifest file name */
        manifestFileName:            string;

        /** Default layout to be used when one has not yet been configured. */
        defaultLayout:               string;

        /** Default translation language for text strings, when no translations are available for the current language. */
        defaultLanguage:             string;

        /** Default preview image, which is used when one has not been specified in the video manifest. */
        defaultVideoPreview:         string;

        /** Default preview image for the portrait mode, which is used when one has not been specified in the video manifest. */
        defaultVideoPreviewPortrait: string;

        /** Log level to use */
        logLevel:                    LogLevel;

        /** General user interface settings */
        ui: {
            /** Timeout to hide the interface, from when the user stops interacting with the player. */
            hideUITimer:      number;

            /** Hide the interface when the mouse leaves the video area */
            hideOnMouseLeave: boolean;
        };

        /** Preference storage settings */
        preferences: {
            /** Storage type to use for the preferences. */
            currentSource: string;

            /** Storage types */
            sources:       {

                /** Store settings in cookies */
                cookie?: {
                    /** Consent type used to store the settings (see Cookie Consent settings) */
                    consentType: string;
                },

                /** Store settings using a Data plugin */
                dataPlugin?: {
                    /** Context of the data plugin to use */
                    context: string;
                    name:    string;
                };
            }
        };

        /** Video container settings */
        videoContainer:              {
            /** Place the video container above or below the playback bar. */
            overPlaybackBar:     boolean;

            /** Restore the playback rate setting in the next player load */
            restorePlaybackRate: boolean;

            /** Restore the volume setting in the next player load */
            restoreVolume:       boolean;

            /** Restore the video layout in the next load of the current video */
            restoreVideoLayout: {
                /** Enable or disable this setting */
                enabled: boolean;

                /** If global=false, then the layout is only restored the next load of the current video */
                global:  boolean;
            }

            restoreLastTime: {
                /** Enable or disable this setting */
                enabled:          boolean;

                /** Remaining video time after which the last known instant of playback will not be restored */
                remainingSeconds: number;
            };
            
            /** Alignment of the video canvas in dynamic layout mode */
            dynamicLayout:       {
                landscapeVerticalAlignment:  DynamicLayoutAlignment;
                portraitHorizontalAlignment: DynamicLayoutAlignment;
            }
        };

        /** Button groups */
        buttonGroups: {
            /** Enable or disable the button group */
            enabled:         boolean;

            /** Button group name. This name will be used in the child buttons as `parentContainer` attribute */
            groupName:       string;

            /** Button group description */
            description:     string;

            /** Button group icon */
            icon:            string;

            /** Loading order */
            order:           number;

            /** Button group position */
            side:            ButtonPluginSide;

            /** Parent button group name */
            parentContainer: string;

            /** Title used in the menu title bar */
            menuTitle:       string;
        }[];

        /** Cookie consent options */
        cookieConsent: {
            /** Type of the cookie consent, for example `analytical` */
            type:        string;

            /** Human readable name of the cookie consent, for example 'Analytical Cookies' */
            title:       string;

            /** Description of the cookie consent, for example 'Cookies used to analyze the user behavior' */
            description: string;

            /** Is this cookie group required for the website to work? */
            required:    boolean;

            /** Is enabled by default? */
            value:       boolean;
        }[];

        plugins: Record<string, PluginConfig>;
    }

    export interface Transcription {
        index: number;
        preview: string;
        time: number;
        text: string;
        duration: number;
    }

    export interface Frame {
        id: string;
        time: number,
        mimetype: string,
        url: string,
        thumb: string
    }

    export interface FrameList {
        targetContent: string;
        frames: Frame[];
    }

    export interface Source {
        src: string;
        // Currently unused...
        mimetype: string;
        res?: {
            w: number;
            h: number;
        };
    }

    export interface Stream {
        content: string;
        role?: "mainAudio";
        sources: {
            html?: Source[];
            mp4?: Source[];
            hls?: Source[];
            hlsLive?: Source[];
        };
    }

    export interface CaptionManifestItem {
        id: string,
        format: string;
        url: string;
        lang: string;
        text: string;
    }

    export interface Manifest {
        metadata: {
            duration?: number;
            title?: string;
            preview?: string;
        } & Record<string, unknown>;

        streams: Stream[];

        captions?: CaptionManifestItem[];

        frameList?: FrameList;

        transcriptions?: Transcription[];
    }

    export interface PluginRef {
        plugin: Plugin;
        config: PluginConfig;
    }

    export interface InitParams {
        configResourcesUrl?: string;
        configUrl?: string;
        repositoryUrl?: string;
        manifestFileName?: string;

        loadConfig?: (configUrl: string, player: Paella) => Promise<Config>;
        getVideoId?: (config: Config, player: Paella) => string | null;
        getManifestUrl?: (repoUrl: string, videoId: string) => string;
        getManifestFileUrl?: (manifestUrl: string, manifestFileName: string) => string;
        loadVideoManifest?: (manifestUrl: string, config: Config, player: Paella) => Manifest;
        getCookieConsentFunction?: (type: string) => boolean;

        plugins?: (PluginRef | Plugin)[];
    }

    export type LogLevel = "DISABLED" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "VERBOSE";
    export interface Log {
        setLevel(level: LogLevel | number): void;
        currentLevel(): number;
        error(msg: string, context?: string | null): void;
        warn(msg: string, context?: string | null): void;
        info(msg: string, context?: string | null): void;
        debug(msg: string, context?: string | null): void;
        verbose(msg: string, context?: string | null): void;
    }

    export interface PluginModule {
        readonly moduleName: string;
        readonly moduleVersion: string;
    }

    export interface Preferences {
        async set(key: string, value: any, options?: { global?: boolean }): Promise<void>;
        async get(key: string, options?: { global?: boolean }): Promise<any>;
    }

    export interface Events {
        readonly PLAY: string;
        readonly PAUSE: string;
        readonly STOP: string;
        readonly ENDED: string;
        readonly SEEK: string;
        readonly FULLSCREEN_CHANGED: string;
        readonly ENTER_FULLSCREEN: string;
        readonly EXIT_FULLSCREEN: string;
        readonly VOLUME_CHANGED: string;
        readonly TIMEUPDATE: string;
        readonly TRIMMING_CHANGED: string;
        readonly CAPTIONS_CHANGED: string;
        readonly CAPTIONS_ENABLED: string;
        readonly CAPTIONS_DISABLED: string;
        readonly BUTTON_PRESS: string;
        readonly SHOW_POPUP: string;
        readonly HIDE_POPUP: string;
        readonly MANIFEST_LOADED: string;
        readonly STREAM_LOADED: string;
        readonly PLAYER_LOADED: string;
        readonly PLAYER_UNLOADED: string;
        readonly RESIZE: string;
        readonly RESIZE_END: string;
        readonly LAYOUT_CHANGED: string;
        readonly PLAYBACK_RATE_CHANGED: string;
        readonly VIDEO_QUALITY_CHANGED: string;
        readonly HIDE_UI: string;
        readonly SHOW_UI: string;
        readonly COOKIE_CONSENT_CHANGED: string;
        readonly LOG: string;
    }

    export interface PlayerState {
        readonly UNLOADED: 0;
        readonly LOADING_MANIFEST: 1;
        readonly MANIFEST: 2;
        readonly LOADING_PLAYER: 3;
        readonly LOADED: 4;
        readonly UNLOADING_MANIFEST: 5;
        readonly UNLOADING_PLAYER: 6;
        readonly ERROR: 7;
    }

    export type PlayerStateNames = [
        "UNLOADED",
        "LOADING_MANIFEST",
        "MANIFEST",
        "LOADING_PLAYER",
        "LOADED",
        "UNLOADING_MANIFEST",
        "UNLOADING_PLAYER",
        "ERROR"
    ]

    export interface Skin {
        loadSkin(skinParam: string | object): Promise<void>;
        unloadSkin(): void;
    }

    export interface CookieConsent {
        updateConsentData(): void;
        getConsentForType(type: string): boolean;
    }
    
    export interface Data {
        read(context: string, key: string): Promise<any>;
        write(context: string, key: string, data: any): Promise<void>;
        remove(context: string, key: string): Promise<void>;
    }

    export interface StreamPlayer {
        readonly isEnabled: boolean;
        readonly isMainAudioPlayer: boolean;
        readonly isVisible: boolean;
    }

    export interface StreamProperties {
        readonly isMainAudio: boolean;
        readonly player: StreamPlayer;
        readonly stream: Stream;
    }

    export interface AudioTrack {
        readonly groupId: string;
        readonly id: number;
        readonly language: string;
        readonly name: string;
        readonly selected: boolean;
    }

    export interface StreamQuality {
        readonly bitrate: number;
        readonly index: number;
        readonly isAuto: boolean;
        readonly label: string;
        readonly shortLabel: string;
    }

    export interface StreamProvider {
        // Properties
        readonly streamData: Stream[];
        readonly streams: Record<string, StreamProperties>;
        readonly players: StreamPlayer[];
        readonly mainAudioPlayer: any;
        readonly isTrimEnabled: boolean;
        readonly trimStart: number;
        readonly trimEnd: number;
        readonly isLiveStream: boolean;
        readonly currentAudioTrack: AudioTrack | null;

        // Basic playback control
        play(): Promise<any>;
        pause(): Promise<any>;
        stop(): Promise<void>;
        paused(): Promise<boolean>;
        setCurrentTime(t: number): Promise<{result: any, prevTime: number, newTime: number}>;
        currentTime(): Promise<number>;
        currentTimeIgnoringTrimming(): Promise<number>;
        volume(): Promise<number>;
        setVolume(v: number): Promise<any>;
        duration(): Promise<number>;
        durationIgnoringTrimming(): Promise<number>;
        playbackRate(): Promise<number>;
        setPlaybackRate(rate: number): Promise<any>;

        // Trimming
        setTrimming(options: {enabled: boolean, start: number, end: number}): Promise<void>;

        // Quality control
        getQualityReferencePlayer(): Promise<StreamPlayer>;
        getCurrentQuality(): Promise<StreamQuality>;
        getQualities(): Promise<StreamQuality[]>;
        setQuality(quality: StreamQuality): Promise<void>;

        // Audio tracks
        supportsMultiaudio(): Promise<boolean>;
        getAudioTracks(): Promise<AudioTrack[]>;
        setCurrentAudioTrack(track: AudioTrack): Promise<void>;
    }

    export interface VideoContainer {
        // Properties
        readonly streamProvider: StreamProvider;
        readonly streamData: any[];
        readonly layoutId: string;
        readonly validContentIds: string[];
        readonly validLayouts: any[];
        readonly ready: boolean;
        readonly isTrimEnabled: boolean;
        readonly trimStart: number;
        readonly trimEnd: number;
        
        // Methods
        setLayout(layoutId: string): Promise<boolean>;
        
        // Video control
        play(): Promise<any>;
        pause(): Promise<any>;
        stop(): Promise<void>;
        paused(): Promise<boolean>;
        setCurrentTime(t: number): Promise<any>;
        currentTime(): Promise<number>;
        volume(): Promise<number>;
        setVolume(v: number): Promise<any>;
        duration(): Promise<number>;
        playbackRate(): Promise<number>;
        setPlaybackRate(r: number): Promise<any>;
        setTrimming(options: { enabled?: boolean, start?: number, end?: number }): Promise<any>;
        
        // UI related
        showUserInterface(): void;
        hideUserInterface(): void;
        
        // Layout
        getVideoRect(target?: string | number | null): { x: number, y: number, width: number, height: number, element: HTMLElement } | null;
        appendChild(element: HTMLElement, rect?: { x: number, y: number, width: number, height: number } | null, zIndex?: number): HTMLElement;
        removeChild(element: HTMLElement): void;
    }

    export interface CaptionCue {
        readonly start: number;
        readonly end: number;
        readonly text: string[];
    }

    export type AddCueParams = {
        label: string
        start: number
        end: number
        captions: string | string[]
    }
    export interface Caption {
        readonly cues: CaptionCue[];
        label: string;
        language: string;

        addCue(params : AddCueParams): void;
        getCue(instant: number): CaptionCue | null;
    }

    export type CaptionSearchOptions = {
        label?: string
        index?: number
        lang?: string
    }
    export interface CaptionsCanvas {
        addCaptions(captions: Caption): void;
        getCaptions(params : CaptionSearchOptions): Caption | null;
        enableCaptions(searchOptions: CaptionSearchOptions): void;
        disableCaptions(): void;

        readonly captions: Caption[];
        readonly currentCaptions: Caption | null;
    }

    export class Paella {
        public constructor(node: string | HTMLElement, options?: InitParams);

        // Version and status
        readonly version: string;
        readonly ready: boolean;
        readonly state: number;
        readonly stateText: string;
        readonly playerLoaded: boolean;
        readonly configLoaded: boolean;
        readonly videoManifestLoaded: boolean;
        readonly videoLoaded: boolean;
        readonly isFullscreen: boolean;

        // Key components and managers
        readonly log: Log;
        readonly pluginModules: PluginModule[];
        readonly preferences: Preferences;
        readonly skin: Skin;
        readonly Events: Events;
        readonly PlayerState: PlayerState;
        readonly PlayerStateNames: PlayerStateNames;
        readonly cookieConsent: CookieConsent;
        readonly data: Data;

        // Container and UI related
        readonly containerSize: { w: number, h: number };
        readonly containsFocus: boolean;
        readonly hideUiTime: number;

        readonly videoContainer: VideoContainer;
        readonly captionsCanvas: CaptionsCanvas;

        // Configuration related
        readonly initParams: InitParams;
        readonly config: Config;
        readonly configUrl: string;
        readonly configResourcesUrl: string;

        // Video and manifest related
        readonly videoId: string;
        readonly manifestUrl: string;
        readonly manifestFileName: string;
        readonly manifestFileUrl: string;
        readonly videoManifest: Manifest;
        readonly repositoryUrl: string;
        readonly defaultVideoPreview: string;
        readonly defaultVideoPreviewPortrait: string;

        // Manifest data getters
        readonly metadata: Record<string, any>;
        readonly streams: Stream[];
        readonly frameList: FrameList;
        readonly captions: Caption[];
        readonly trimming: { start?: number, end?: number, enabled?: boolean };
        readonly visibleTimeLine: boolean;

        // Methods
        translate(word: string, keys?: Record<string, any> | null): string;
        setLanguage(lang: string): void;
        getLanguage(): string;
        addDictionary(lang: string, dict: Record<string, string>): void;
        getDictionaries(): Record<string, Record<string, string>>;
        getDefaultLanguage(): string;

        bindEvent(eventName: string, fn: (eventParams: Record<string, any>) => void, unregisterOnUnload?: boolean): void;
        getPlugin(name: string, type?: string | null): Plugin | null;
        waitState(state: string | number): Promise<void>;
        
        // Player control methods
        loadUrl(url: string | string[], options?: { title?: string, duration?: number, preview?: string, previewPortrait?: string }): Promise<void>;
        loadManifest(): Promise<void>;
        loadPlayer(): Promise<void>;
        load(): Promise<void>;
        unload(): Promise<void>;
        unloadManifest(): Promise<void>;
        unloadPlayer(): Promise<void>;
        reload(onUnloadFn?: Function | null): Promise<void>;
        resize(): Promise<void>;
        hideUserInterface(): Promise<void>;
        showUserInterface(): Promise<void>;
        
        // Playback control methods
        play(): Promise<void>;
        pause(): Promise<void>;
        togglePlay(): Promise<void>;
        paused(): Promise<boolean>;
        stop(): Promise<void>;
        setCurrentTime(t: number): Promise<void>;
        currentTime(): Promise<number>;
        volume(): Promise<number>;
        setVolume(v: number): Promise<void>;
        duration(): Promise<number>;
        playbackRate(): Promise<number>;
        setPlaybackRate(r: number): Promise<void>;
        skipSeconds(s: number): Promise<void>;
        rewindSeconds(s: number): Promise<void>;
        
        // Fullscreen methods
        isFullScreenSupported(): boolean;
        enterFullscreen(): Promise<void>;
        exitFullscreen(): Promise<void>;
        
        // Custom plugin icons
        addCustomPluginIcon(pluginName: string, iconName: string, svgData: string): void;
        removeCustomPluginIcon(pluginName: string, iconName: string): void;
        getCustomPluginIcon(pluginName: string, iconName: string): string | null;
    }
}
