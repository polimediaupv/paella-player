
import type { Dictionaries } from "./Localization";
import type { CookieConsentData } from "./CookieConsent";

export type LogLevel = "DISABLED" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "VERBOSE";

export type DynamicLayoutAlignment = "align-center" | "align-top" | "align-bottom" | "align-left" | "align-right";

export type ButtonPluginSide = "left" | "right";

export type ButtonSize = "small" | "medium" | "large";

export type PopUpType = "timeline" | "modal";

export type VideoLayaoutValidContent = {
    id: string
    content: string[]
    icon?: string | null
    title?: string | null
}

export type PluginConfig = {
    enabled?: boolean
    order?: number
    description?: string
};

export type CanvasPluginConfig = PluginConfig & { };

export type EventLogPluginConfig = PluginConfig & {
    context?: string[] | string
    target?: string | string[]
    events?: string[]
    logLevel?: LogLevel
};

export type VideoPluginConfig = PluginConfig & {};

export type UserInterfacePluginConfig = PluginConfig & {
    parentContainer?: string
    id?: string
    name?: string
    ariaLabel?: string
    tabIndex?: number
    size?: ButtonSize
    side?: ButtonPluginSide
};

export type ButtonPluginConfig = UserInterfacePluginConfig & {
    minContainerSize?: number
    urlTarget?: string
    closeParentPopUp?: boolean
    closePopUps?: boolean
};

export type PopUpButtonPluginConfig = ButtonPluginConfig & {
    customPopUpClass?: string
    popUpType?: PopUpType
    closeOnSelect?: boolean
    menuTitle?: string
    targetContent?: string
};

export type TableInfoPopUpPluginConfig = PopUpButtonPluginConfig & { };

export type MenuButtonPluginConfig = PopUpButtonPluginConfig & {
    groupName?: string
};

export type VideoLayoutPluginConfig = PluginConfig & {
    tabIndexStart?: number
    validContent?: VideoLayaoutValidContent[]
};

export type DataPluginConfig = PluginConfig & {
    context?: string[]
};

export type GenericPluginConfig =
    MenuButtonPluginConfig &
    VideoLayoutPluginConfig &
    DataPluginConfig &
    CanvasPluginConfig &
    EventLogPluginConfig &
    VideoPluginConfig &
    Record<string, any>;

export type PreferencesSources = {

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
};

export type ButtonGroupConfig = {
    /** Enable or disable the button group */
    enabled:         boolean;

    /** Button group name. This name will be used in the child buttons as `parentContainer` attribute */
    groupName:       string;

    /** Button group description */
    description:     string;

    /** Button group icon */
    icon?:            string;

    /** Loading order */
    order?:           number;

    /** Button group position */
    side?:            ButtonPluginSide;

    /** Parent button group name */
    parentContainer?: string;

    /** Title used in the menu title bar */
    menuTitle?:       string;
}

export interface Config {
    /** Default video ID to be used when one is not specified explicitly */
    fallbackId?:                  string;

    /** Default directory with the manifest video repository */
    repositoryUrl?:               string;

    /** Default manifest file name */
    manifestFileName?:            string;

    /** Default layout to be used when one has not yet been configured. */
    defaultLayout?:               string;

    /** Default translation language for text strings, when no translations are available for the current language. */
    defaultLanguage?:             string;

    /** Default preview image, which is used when one has not been specified in the video manifest. */
    defaultVideoPreview?:         string;

    /** Default preview image for the portrait mode, which is used when one has not been specified in the video manifest. */
    defaultVideoPreviewPortrait?: string;

    /** Log level to use */
    logLevel?:                    LogLevel;

    /** General user interface settings */
    ui?: {
        /** Timeout to hide the interface, from when the user stops interacting with the player. */
        hideUITimer?:      number;

        /** Hide the interface when the mouse leaves the video area */
        hideOnMouseLeave?: boolean;
    };

    /** Preference storage settings */
    preferences?: {
        /** Storage type to use for the preferences. */
        currentSource: string;

        /** Storage types */
        sources: PreferencesSources;
    };

    /** Video container settings */
    videoContainer?:              {
        /** Place the video container above or below the playback bar. */
        overPlaybackBar?:     boolean;

        /** Restore the playback rate setting in the next player load */
        restorePlaybackRate?: boolean;

        /** Restore the volume setting in the next player load */
        restoreVolume?:       boolean;

        /** Restore the video layout in the next load of the current video */
        restoreVideoLayout?: {
            /** Enable or disable this setting */
            enabled?: boolean;

            /** If global=false, then the layout is only restored the next load of the current video */
            global?:  boolean;
        }

        restoreLastTime?: {
            /** Enable or disable this setting */
            enabled?:          boolean;

            /** Remaining video time after which the last known instant of playback will not be restored */
            remainingSeconds?: number;
        };
        
        /** Alignment of the video canvas in dynamic layout mode */
        dynamicLayout?:       {
            landscapeVerticalAlignment?:  DynamicLayoutAlignment;
            portraitHorizontalAlignment?: DynamicLayoutAlignment;
        }
    };

    /** Button groups */
    buttonGroups?: ButtonGroupConfig[];

    /** Cookie consent options */
    cookieConsent?: CookieConsentData[];

    plugins?: Record<string, GenericPluginConfig>;

    dictionaries?: Dictionaries
}