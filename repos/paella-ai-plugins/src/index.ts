import AIContentPlugin, { type AIContentData, type AIContentPluginConfig } from './plugins/es.upv.paella.ai.content';
import AIToolsDataTestPlugin from './plugins/es.upv.paella.ai.content.data-test';
import AIChatPlugin from './plugins/es.upv.paella.ai.chat';

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
                enabled: true,
            }
        }
    },
    {
        plugin: AIToolsDataTestPlugin,
        config: {
            enabled: false,
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