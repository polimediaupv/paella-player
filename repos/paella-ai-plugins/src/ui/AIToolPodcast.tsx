import type { AIContentData } from "../plugins/es.upv.paella.ai.content";
import AIToolAlert from "./AIToolAlert";
import "./AIToolPodcast.css";

type ScriptItem = {
    speaker: string;
    text: string;
};

type AIToolPodcastProps = {
    data: AIContentData;    
};

export default function AIToolPodcast({data}: AIToolPodcastProps) {
    let script: ScriptItem[] | undefined;
    if (data?.content) {
        try {        
            script = JSON.parse(data.content);
        }
        catch (e) {}
    }
    
    console.log(data);
    return (
        <div
            className="aitool-podcast"
        >
            <AIToolAlert />
            { data?.mediaUrl &&
                <audio controls>
                    <source src={data?.mediaUrl} type="audio/ogg" />
                    Your browser does not support the audio element.
                </audio>
            }
            { script && script.length > 0 &&
                <ul>
                    { script.map((item, index) => 
                        <li key={index}>
                            <div className="speaker"> {item.speaker} </div>
                            <div className="text"> {item.text} </div>
                        </li>
                    )}
                </ul>
            }
        </div>
    );
}