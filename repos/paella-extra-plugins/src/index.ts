import OnBoardingPlugin from './plugins/es.upv.paella.onboarding.js';
import CookieConsentPlugin, { getCookieConsentFunction } from './plugins/es.upv.paella.cookieconsent';
import RelatedDocumentsPlugin, { type RelatedDocumentsPluginconfig, type RelatedDocuments, type RelatedDocument } from './plugins/es.upv.paella.relatedDocuments.js';
import RelatedDocumentsDataTestPlugin, {type RelatedDocumentsDataTestPluginConfig } from './plugins/es.upv.paella.relatedDocuments.dataTest.js';
import VersionPlugin from './plugins/es.upv.paella.version.js';
import RelatedVideosPlugin, { type RelatedVideosPluginConfig } from './plugins/es.upv.paella.relatedVideos.js';
import RelatedVideosDataTestPlugin, { type  RelatedVideosDataTestPluginConfig, type RelatedVideosDataResponse} from './plugins/es.upv.paella.relatedVideos.dataTest.js';
import KeyboardShortcutsPlugin, { type KeyboardShortcutsPluginConfig, createKeyboardEventListener } from './plugins/es.upv.paella.keyboardShortcuts.js';
import EmbedApiPlugin, { type EmbedApiPluginConfig } from './plugins/es.upv.paella.embedapi.js';
import type { ButtonPluginConfig, PluginConfig, PopUpButtonPluginConfig } from '@asicupv/paella-core';

export const extraPlugins = [
    {
        plugin: OnBoardingPlugin,
        config: {
            enabled: false
        } satisfies PluginConfig
    },
    {
        plugin: CookieConsentPlugin,
        config: {
            enabled: false,
            side: "right"
        } satisfies ButtonPluginConfig
    },
    {
        plugin: RelatedDocumentsPlugin,
        config: {
            enabled: false,
            side: "right"
        } satisfies RelatedDocumentsPluginconfig
    },
    {
        plugin: RelatedDocumentsDataTestPlugin,
        config: {
            enabled: false,
            context: ["related.documents"],
            docs: []
        } satisfies RelatedDocumentsDataTestPluginConfig
    },
    {
        plugin: VersionPlugin,
        config: {
            enabled: false,
            side: "right"
        } satisfies PopUpButtonPluginConfig
    },
    {
        plugin: RelatedVideosPlugin,
        config: {
            enabled: true,
            side: "right"
        } satisfies RelatedVideosPluginConfig
    },
    {
        plugin: RelatedVideosDataTestPlugin,
        config: {
            enabled: false,
            context: ["relatedVideos"]
        } satisfies RelatedVideosDataTestPluginConfig
    },
    {
        plugin: KeyboardShortcutsPlugin,
        config: {
            enabled: false,
            side: "right",
            installKeyboardManager: false,
            validPlaybackRates: [0.5, 0.75, 1, 1.25, 1.5, 2]
        } satisfies KeyboardShortcutsPluginConfig
    },
    {
        plugin: EmbedApiPlugin,
        config: {
            enabled: false
        } satisfies EmbedApiPluginConfig
    }
];


export {
    OnBoardingPlugin,
    CookieConsentPlugin, getCookieConsentFunction,
    RelatedDocumentsPlugin, type RelatedDocumentsPluginconfig, type RelatedDocuments, type RelatedDocument,
    RelatedDocumentsDataTestPlugin, type RelatedDocumentsDataTestPluginConfig,
    VersionPlugin,
    RelatedVideosPlugin, type RelatedVideosPluginConfig,
    RelatedVideosDataTestPlugin, type RelatedVideosDataTestPluginConfig, type RelatedVideosDataResponse,
    KeyboardShortcutsPlugin, type KeyboardShortcutsPluginConfig, createKeyboardEventListener,
    EmbedApiPlugin, type EmbedApiPluginConfig
};