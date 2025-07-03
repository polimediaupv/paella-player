import { Fragment, useState } from 'react';
import "./ChatSettings.css";
import { usePaellaPlugin } from '../plugins/PreactButtonPlugin/PreactButtonPlugin';
import type { Settings } from '../plugins/es.upv.paella.ai.chat';



interface ChatSettingsProps {
    settings: Settings;
    onSettingsChange?: (settings: Settings) => void;
    onSettingsDefault?: () => void;
    onClose?: () => void;
}

export default function ChatSettings({
    settings, 
    onSettingsChange = () => {},
    onSettingsDefault = () => {},
    onClose = () => {}
}: ChatSettingsProps) {
    const [modelType, setModelType] = useState<Settings['modelType']>(settings?.modelType ?? 'webllm');
    const [openAIURL, setOpenAIURL] = useState<string>(settings?.openAIURL ?? 'https://api.openai.com/v1');
    const [openAIPasswd, setOpenAIPasswd] = useState<string>(settings?.openAIPasswd ?? '');
    const [model, setModel] = useState<string>(settings?.model ?? (modelType === 'webllm' ? 'Llama-3.1-8B-Instruct-q4f32_1-MLC' : 'gpt-4o'));
    const [contextWindowLength, setContextWindowLength] = useState<string>(settings?.contextWindowLength ?? '1K');
    const [temperature, setTemperature] = useState<number>(settings?.temperature ?? 1.0);
    const [maxTokens, setMaxTokens] = useState<number>(settings?.maxTokens ?? 4000);
    const [frequecyPenalty, setFrequecyPenalty] = useState<number>(settings?.frequecyPenalty ?? 0.0);
    const [presencePenalty, setPresencePenalty] = useState<number>(settings?.presencePenalty ?? 0.0);
    const [systemPrompt, setSystemPrompt] = useState<string>(settings?.systemPrompt ?? '');

    const paellaPlugin = usePaellaPlugin();

    const handleSettingsChange = (): void => {
        onSettingsChange({
            modelType,
            openAIURL,
            openAIPasswd,
            model,
            contextWindowLength,
            temperature,
            maxTokens,
            frequecyPenalty,
            presencePenalty,
            systemPrompt
        });
    };

    return (        
        <div className="settings">            
            <h1> {paellaPlugin.player.translate("Settings")} </h1>
            <div> {paellaPlugin.player.translate("You can select the AI model and adjust its parameters, such as temperature, maximum tokens, and penalties.")}</div>
            <div> {paellaPlugin.player.translate("These changes will affect the way the assistant generates responses.")}</div>

            <h2>{paellaPlugin.player.translate("Model parameters")}</h2>
            <ul className="settings-list">
            <li>
                    <div className="title"> {paellaPlugin.player.translate("Model type")} </div>
                    <select defaultValue={modelType} onChange={(e) => setModelType(e.target.value as Settings['modelType'])}>
                        <option value="webllm"> WebLLM </option>
                        <option value="openai"> OpenAI API </option>
                    </select>
                </li>
                { modelType === 'openai' && <Fragment>
                    <li>
                        <div className="title"> OpenAI URL </div>
                        <input type="text" aria-describedby="OpenAI URL" placeholder="https://api.openai.com/v1" value={openAIURL} onChange={(e) => setOpenAIURL(e.target.value)} />
                    </li>                
                    <li>
                        <div className="title"> OpenAI Password </div>
                        <input type="password" aria-describedby="OpenAI URL" placeholder="******" value={openAIPasswd} onChange={(e) => setOpenAIPasswd(e.target.value)} />
                    </li>
                </Fragment> }

                <li>
                    <div className="title">{paellaPlugin.player.translate("Model")}</div>
                    <input type="text" aria-describedby={paellaPlugin.player.translate("Model")} placeholder="llama3.3" value={model} onChange={(e) => setModel(e.target.value)} />
                </li>

                { modelType === 'webllm' && <Fragment>
                    <li>
                        <div className="title">
                            <div>{paellaPlugin.player.translate("Context window lenghth")} </div>
                            <div className="sub-title"> {paellaPlugin.player.translate("The maximum number of tokens for the context window")} </div>
                        </div>
                        <select defaultValue={contextWindowLength} onChange={(e) => setContextWindowLength(e.target.value)}>
                            <option value="1K"> 1K </option>
                            <option value="2K"> 2K </option>
                            <option value="4K"> 4K </option>
                            <option value="8K"> 8K </option>
                            <option value="16K"> 16K </option>
                            <option value="32K"> 32K </option>
                            <option value="64K"> 64K </option>
                            <option value="128K"> 128K </option>
                        </select>
                    </li>
                </Fragment> }

                <li>
                    <div className="title">
                        <div>{paellaPlugin.player.translate("Temperature")}  </div>
                        <div className="sub-title"> {paellaPlugin.player.translate("A higher value generates a more random output.")}  </div>
                    </div>
                    <input type="number" aria-describedby={paellaPlugin.player.translate("Temperature")} 
                        placeholder="1.0" min="0" max="2" step="0.1"
                        value={temperature} onChange={(e) => { setTemperature(parseFloat(e.target.value)); }}
                    ></input>
                </li>

                <li>
                    <div className="title">
                        <div>{paellaPlugin.player.translate("Maximum tokens")} </div>
                        <div className="sub-title"> {paellaPlugin.player.translate("Maximum length of generated tokens.")} </div>
                    </div>
                    <input type="number" aria-describedby={paellaPlugin.player.translate("Maximum tokens")} 
                        placeholder="4000" min="0" step="1"
                        value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    ></input>
                </li>

                <li>
                    <div className="title">
                        <div>{paellaPlugin.player.translate("Presence penalty")} </div>
                        <div className="sub-title"> {paellaPlugin.player.translate("A higher value increases the probability of talking about new topics.")} </div>
                    </div>
                    <input type="number" aria-describedby={paellaPlugin.player.translate("Presence penalty")}
                        placeholder="0" min="-2.0" max="2.0" step="0.1"
                        value={frequecyPenalty} onChange={(e) => setFrequecyPenalty(parseFloat(e.target.value))}
                    ></input>
                </li>

                <li>
                    <div className="title">
                        <div>{paellaPlugin.player.translate("Frequency penalty")} </div>
                        <div className="sub-title"> {paellaPlugin.player.translate("A higher value decreases the probability of repeating the same line.")} </div>
                    </div>
                    <input type="number" aria-describedby={paellaPlugin.player.translate("Frequency penalty")}
                        placeholder="0" min="-2.0" max="2.0" step="0.1"
                        value={presencePenalty} onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
                    ></input>
                </li>
            </ul>

            <h2>{paellaPlugin.player.translate("System prompt")}</h2>
            <ul className="settings-list">
                <li>
                    <div className="title">
                    {paellaPlugin.player.translate("System prompt")}
                        <div className="sub-title"> {paellaPlugin.player.translate("The initial instruction that guides the model's behavior and tone in a conversation.")} </div>
                    </div>
                    <textarea aria-describedby={paellaPlugin.player.translate("System prompt")} placeholder="You are a helpful assistant" rows={3} cols={30} value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} />
                </li>
            </ul>

            <footer>
                <button role="button" onClick={onSettingsDefault}>
                {paellaPlugin.player.translate("Return to defaults")}
                </button>
                <button role="button" onClick={onClose}>
                {paellaPlugin.player.translate("Cancel")}
                </button>
                <button role="button" onClick={handleSettingsChange}>
                    {paellaPlugin.player.translate("Ok")}
                </button>
            </footer>
        </div>            
    );
}