import AIContentPlugin, { type AIContentData, type AIContentPluginConfig } from './plugins/es.upv.paella.ai.content';
import AIToolsDataTestPlugin from './plugins/es.upv.paella.ai.content.data-test';
import AIChatPlugin from './plugins/es.upv.paella.ai.chat';
import RealTimeCaptionsPlugin from './plugins/RealTimeCaptions/es.upv.paella.ai.realTimeCaptions';
import AIAgentChatButtonPlugin from './plugins/AgentChat/es.upv.paella.ai.agentchat.button';
import AIAgentChatPlugin from './plugins/AgentChat/es.upv.paella.ai.agentchat';
import {AIAgentChatDataPlugin} from './plugins/AgentChat/es.upv.paella.ai.agentchat.data-test';

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
    },
    {
        plugin: AIAgentChatButtonPlugin,
        config: {
            enabled: true
        }
    },
    {
        plugin: AIAgentChatPlugin,
        config: {
            enabled: true,
            dataContext: "agentchat.captions",
            settings: {
                modelType: "openai",
                baseURL: `${location.origin}/ai-proxy/v1`,
                apiKey: "dummy",
                modelName: "big-pickle",
            }
        }
    },
    {
        plugin: AIAgentChatDataPlugin,
        config: {
            enabled: true,
            context: ["agentchat.captions"],
        }
    }
];


export {
    AIContentPlugin,
    AIChatPlugin,
    AIToolsDataTestPlugin,
    RealTimeCaptionsPlugin,
    type AIContentData,
    type AIContentPluginConfig
};