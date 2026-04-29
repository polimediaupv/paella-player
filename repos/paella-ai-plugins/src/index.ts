import AIContentPlugin, { type AIContentData, type AIContentPluginConfig } from './plugins/es.upv.paella.ai.content';
import AIToolsDataTestPlugin from './plugins/es.upv.paella.ai.content.data-test';
import AIChatPlugin from './plugins/es.upv.paella.ai.chat';
import RealTimeCaptionsPlugin from './plugins/RealTimeCaptions/es.upv.paella.ai.realTimeCaptions';

export const aiToolsPlugins = [
    {
        plugin: AIContentPlugin,
        config: {
            enabled: false,
        },
    },
    {
        plugin: AIChatPlugin,
        config: {
            enabled: false,
            chat: {
                enabled: true
            }
        }
    },
    {
        plugin: AIToolsDataTestPlugin,
        config: {
            enabled: false,
        }
    },
    {
        plugin: RealTimeCaptionsPlugin,
        config: {
            enabled: false
        }
    }

];


export {
    AIContentPlugin,
    AIChatPlugin,
    AIToolsDataTestPlugin,
    type AIContentData,
    type AIContentPluginConfig
};