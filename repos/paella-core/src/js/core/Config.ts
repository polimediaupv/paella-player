
import type { Dictionaries } from "./Localization";

export type LogLevel = "DISABLED" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "VERBOSE";

export type DynamicLayoutAlignment = "align-center" | "align-top" | "align-bottom" | "align-left" | "align-right";

export type ButtonPluginSide = "left" | "right";

export type ButtonSize = "small" | "medium" | "large";

export type PopUpType = "timeline" | "modal";

export type PluginConfig = {
    enabled?: boolean
    order?: number
    description?: string
    parentContainer?: string
    id?: string
    name?: string
    ariaLabel?: string
    tabIndex?: number
    minContainerSize?: number
    side?: ButtonPluginSide
    closePopUps?: boolean
    urlTarget?: string
    closeParentPopUp?: boolean
    menuTitle?: string
    customPopUpClass?: string
    popUpType?: PopUpType
    closeOnSelect?: boolean
};

export type GenericPluginConfig = PluginConfig & Record<string, any>;

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
    buttonGroups?: {
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
    }[];

    /** Cookie consent options */
    cookieConsent?: {
        /** Type of the cookie consent, for example `analytical` */
        type?:        string;

        /** Human readable name of the cookie consent, for example 'Analytical Cookies' */
        title?:       string;

        /** Description of the cookie consent, for example 'Cookies used to analyze the user behavior' */
        description?: string;

        /** Is this cookie group required for the website to work? */
        required?:    boolean;

        /** Is enabled by default? */
        value?:       boolean;
    }[];

    plugins?: Record<string, GenericPluginConfig>;

    dictionaries?: Dictionaries
}