import {usePaellaPlugin} from "../es.upv.paella.ai.agentchat"
import "./ChatWelcome.css";

interface ChatWelcomeProps {
    onClick?: () => void;
}

export default function ChatWelcome({ onClick = () => {} }: ChatWelcomeProps) {
    const paellaPlugin = usePaellaPlugin();

    return (        
        <div className="welcome">
            <div className="welcome-content">
                <h1>{paellaPlugin.player.translate("Welcome to Your AI Assistant! 🚀")}</h1>

                <div>
                    <p>{paellaPlugin.player.translate("You can talk and interact about the content of the video you're watching, ask questions, get explanations, or simply chat about the topic.")}</p>
                    
                    <h2>{paellaPlugin.player.translate("How it works")}</h2>
                    <p>{paellaPlugin.player.translate("This assistant uses an AI model that analyzes the video transcript to find relevant information. It can only answer questions about the content of the current video.")}</p>
                    
                    <ul>
                        <li>✅ {paellaPlugin.player.translate("Ask questions about concepts mentioned in the class")}</li>
                        <li>✅ {paellaPlugin.player.translate("Get explanations about specific topics")}</li>
                        <li>✅ {paellaPlugin.player.translate("Search for information within the transcript")}</li>
                    </ul>

                    <p className="note">💡 <strong>{paellaPlugin.player.translate("Note:")}</strong> {paellaPlugin.player.translate("The assistant can only answer questions based on the video transcript. It cannot access external information or content from other sources.")}</p>

                    <h2>{paellaPlugin.player.translate("Explore and enjoy the experience!")}</h2>
                </div>
                
                
                <div className="button-container">
                    <button onClick={onClick}>
                        {paellaPlugin.player.translate("Start")}
                    </button>
                </div>
            </div>
        </div>            
    );
}