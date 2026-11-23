// import remarkEmoji from 'remark-emoji'
import { MarkdownMessage } from "./MarkdownMessage.jsx";
import AIToolAlert from "./AIToolAlert";
import "./AIToolView.css";
import type { AIContentData } from '../plugins/es.upv.paella.ai.content';


interface AIToolViewProps {
    // toolName?: string;
    data: AIContentData;      
}

export default function AIToolView({ data }: AIToolViewProps) {
    let markdown = data?.content;
    return (
        <div className="aitool-view">
            <AIToolAlert />
            <div>
                <MarkdownMessage text={markdown ?? ""} />
            </div>
        </div>
    );
}