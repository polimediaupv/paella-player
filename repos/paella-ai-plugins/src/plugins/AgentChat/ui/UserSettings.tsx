import { useState } from 'preact/hooks';
import { usePaellaPlugin, type Settings } from "../es.upv.paella.ai.agentchat";
import type AIAgentChatPlugin from "../es.upv.paella.ai.agentchat";
import "./UserSettings.css";

interface UserSettingsProps {
    settings: Settings;
    onClose?: () => void;
    onSave?: (newSettings: Settings) => Promise<void>;
}

export function UserSettings({ settings, onClose = () => {}, onSave }: UserSettingsProps) {
    const paellaPlugin = usePaellaPlugin<AIAgentChatPlugin>();

    const [modelType, setModelType] = useState<Settings['modelType']>(settings.modelType);
    const [baseURL, setBaseURL] = useState(settings.baseURL);
    const [apiKey, setApiKey] = useState(settings.apiKey);
    const [modelName, setModelName] = useState(settings.modelName);

    const handleSave = async () => {
        const newSettings: Settings = {
            modelType,
            baseURL,
            apiKey,
            modelName,
        };
        if (onSave) {
            await onSave(newSettings);
        } else {
            paellaPlugin.updateSettings(newSettings);
            onClose();
        }
    };

    return (
        <div className="settings">
            <header className="settings-header">
                <h1>{paellaPlugin.player.translate("Settings")}</h1>
                <button type="button" className="settings-close" onClick={onClose} title={paellaPlugin.player.translate("Close")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                    </svg>
                </button>
            </header>

            <p className="settings-description">
                {paellaPlugin.player.translate("Select the AI model and adjust its parameters.")}
            </p>

            <ul className="settings-list">
                <li>
                    <div className="title">{paellaPlugin.player.translate("Model type")}</div>
                    <select value={modelType} onChange={(e) => setModelType(e.currentTarget.value as Settings['modelType'])}>
                        <option value="openai">OpenAI API</option>
                    </select>
                </li>

                {modelType === 'openai' && (
                    <>
                        <li>
                            <div className="title">{paellaPlugin.player.translate("API URL")}</div>
                            <input type="text" value={baseURL} placeholder="https://api.openai.com/v1"
                                onChange={(e) => setBaseURL(e.currentTarget.value)} />
                        </li>
                        <li>
                            <div className="title">{paellaPlugin.player.translate("API Key")}</div>
                            <input type="password" value={apiKey} placeholder="sk-..."
                                onChange={(e) => setApiKey(e.currentTarget.value)} />
                        </li>
                    </>
                )}

                <li>
                    <div className="title">{paellaPlugin.player.translate("Model")}</div>
                    <input type="text" value={modelName} placeholder="gpt-4o"
                        onChange={(e) => setModelName(e.currentTarget.value)} />
                </li>
            </ul>

            <footer className="settings-footer">
                <button type="button" onClick={onClose}>
                    {paellaPlugin.player.translate("Cancel")}
                </button>
                <button type="button" className="settings-save" onClick={handleSave}>
                    {paellaPlugin.player.translate("Save settings")}
                </button>
            </footer>
        </div>
    );
}
