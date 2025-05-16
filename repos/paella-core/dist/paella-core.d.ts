
declare module "paella-core" {

    export type PluginConfig = Record<string, unknown> & {
        enabled: boolean;
    };

    export type CookieConsent = {
        type: string;
        title: string;
        required: boolean;
        description: string;
    };

    export interface Config {
        /** Is passed to `InitParams.getManifestUrl`. Default: empty string. */
        repositoryUrl?: string;

        /** Is passed to `InitParams.getManifestFileUrl`. Default: empty string. */
        manifestFileName?: string;

        // TODO: what exactly does this do?
        defaultLayout?: string;

        fallbackId?: string;

        logLevel?: "DISABLED" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "VERBOSE";

        cookieConsent?: CookieConsent[];
        plugins: Record<string, PluginConfig>;
    }

    export interface Plugin {

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

        plugins?: PluginRef[];
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


    export interface Caption {
        id: string,
        format: string;
        url: string;
        lang: string;
        text: string;
    }

    export interface Manifest {
        metadata: {
            duration: number;
            title?: string;
            preview?: string;
        } & Record<string, unknown>;

        streams: Stream[];

        captions?: Caption[];

        frameList?: Frame[];

        transcriptions?: Transcription[];
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

    export class Paella {
        public constructor(node: string | HTMLElement, options?: InitParams);
    }
}