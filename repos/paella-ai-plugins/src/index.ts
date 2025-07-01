import AIContentPlugin, { type AIContentData, type AIContentPluginConfig } from './plugins/es.upv.paella.ai.content';
import AIToolsDataTestPlugin from './plugins/es.upv.paella.ai.content.data-test';


export const aiToolsPlugins = [
    {
        plugin: AIContentPlugin,
        config: {
            enabled: false,
        },
    },
    
    {
        plugin: AIToolsDataTestPlugin,
        config: {
            enabled: false,
        }
    }
];


export { AIContentPlugin as AIToolsPlugin, type AIContentData as AIToolsData, type AIContentPluginConfig as AIToolsPluginConfig };