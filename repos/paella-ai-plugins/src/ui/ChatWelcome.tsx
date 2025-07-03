import { usePaellaPlugin } from "../plugins/PreactButtonPlugin/PreactButtonPlugin";
import "./ChatWelcome.css";

interface ChatWelcomeProps {
    onClick?: () => void;
}

export default function ChatWelcome({ onClick = () => {} }: ChatWelcomeProps) {
    const paellaPlugin = usePaellaPlugin();

    return (        
        <div className="welcome">
            <div className="welcome-content">
                <h1>Welcome to Your AI Assistant! 🚀</h1>

                <div>
                    <p>You can talk and interact about the content of the video you're watching, ask questions, get explanations, or simply chat about the topic.</p>
                    
                    <h2>Requirements:</h2>
                    <p>This assistant uses the power of your GPU through <strong>WebGPU</strong> to run AI models directly in your browser.</p>
                    <ul>
                        <li>✅ Your browser must support <strong>WebGPU</strong>.</li>
                        <li>✅ You need enough memory to load and run the model.</li>
                    </ul>

                    <p className="note">⚠️ <strong>Note:</strong> The assistant may not work on all devices, or performance may be slow depending on your hardware. If you experience issues, try using a different browser or a more powerful device.</p>

                    <h2>Explore and enjoy the experience!</h2>
                </div>
                
                
                <div className="button-container">
                    <button role="button" onClick={onClick}>
                        {paellaPlugin.player.translate("Start")}
                    </button>
                </div>
            </div>
        </div>            
    );
}