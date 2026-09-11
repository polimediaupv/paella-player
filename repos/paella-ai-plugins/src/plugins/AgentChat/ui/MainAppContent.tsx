
import { useState } from "preact/hooks";
import AIAgentChatPlugin, { usePaellaPlugin } from "../es.upv.paella.ai.agentchat"
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

    const handleCloseWelcomeView = async () => {
        paellaPlugin.showWelcomeMessage = false;
        setShowWelcomeView(false);
        await paellaPlugin.loadAll(async (phase, progress, total, text) => {
            setLoadingPhase(phase);
            if (phase === 'model') {
                setModelProgress(progress);
                if (text) setModelText(text);
            } else {
                setVectorStoreProgress(progress / total);
            }
            if (phase === 'vectorstore' && progress === 0 && total === 0) {
                setErrorLoading(paellaPlugin.player.translate("Error loading transcript"));
            }
            await new Promise(resolve => setTimeout(resolve, 0));
        });
        setLoadingPhase(null);
    };

    return (
        <>
            { showWelcomeView        
                ? <ChatWelcome onClick={handleCloseWelcomeView}/>
                : (loadingPhase !== null)
                    ? <LoadingPage 
                        phase={loadingPhase}
                        modelProgress={modelProgress}
                        modelText={modelText}
                        vectorStoreProgress={vectorStoreProgress*100}
                        error={errorLoading} />
                    : <AgentChat />
            }
        </>
        );
}
