
import { useState } from "preact/hooks";
import AIAgentChatPlugin, { usePaellaPlugin } from "../es.upv.paella.ai.agentchat"
import type { LoadProgressCallback } from "../es.upv.paella.ai.agentchat";
import ChatWelcome from "./ChatWelcome";
import { LoadingPage } from "./LoadingPage";
import {AgentChat} from "./AgentChat";

export const MainAppContent = () => {
    const paellaPlugin = usePaellaPlugin<AIAgentChatPlugin>();
    const [showWelcomeView, setShowWelcomeView] = useState<boolean>(paellaPlugin.showWelcomeMessage);
    const [loadingPhase, setLoadingPhase] = useState<'model' | 'vectorstore' | null>(null);
    const [modelProgress, setModelProgress] = useState<number>(0);
    const [modelText, setModelText] = useState<string>('');
    const [vectorStoreProgress, setVectorStoreProgress] = useState<number>(0);
    const [errorLoading, setErrorLoading] = useState<string | null>(null);

    const progressCallback: LoadProgressCallback = async (phase, progress, total, text) => {
        setLoadingPhase(phase);
        if (phase === 'model') {
            setModelProgress(progress);
            if (text) setModelText(text);
        } else {
            setVectorStoreProgress(total > 0 ? progress / total : 1);
        }
        await new Promise(resolve => setTimeout(resolve, 0));
    };

    const initAssistant = async () => {
        setErrorLoading(null);
        setLoadingPhase('vectorstore');
        try {
            await paellaPlugin.loadAll(progressCallback);
        }
        catch (error) {
            // A missing transcript is not an error: the plugin degrades the
            // assistant automatically. Anything else (model configuration,
            // vector store failures...) is reported here with a retry option,
            // instead of dropping the user into a non-functional chat.
            const message = error instanceof Error ? error.message : String(error);
            paellaPlugin.player.log.error(`${paellaPlugin.name}: failed to initialize the assistant: ${message}`);
            setErrorLoading(message);
        }
        finally {
            setLoadingPhase(null);
        }
    };

    const handleCloseWelcomeView = (): void => {
        paellaPlugin.showWelcomeMessage = false;
        setShowWelcomeView(false);
        initAssistant();
    };

    return (
        <>
            { showWelcomeView
                ? <ChatWelcome onClick={handleCloseWelcomeView}/>
                : (loadingPhase !== null || errorLoading !== null)
                    ? <LoadingPage
                        phase={loadingPhase ?? 'vectorstore'}
                        modelProgress={modelProgress}
                        modelText={modelText}
                        vectorStoreProgress={vectorStoreProgress*100}
                        error={errorLoading}
                        onRetry={initAssistant} />
                    : <AgentChat />
            }
        </>
        );
}
