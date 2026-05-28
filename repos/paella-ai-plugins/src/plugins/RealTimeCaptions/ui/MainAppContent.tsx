import { usePaellaPlugin, usePaellaTranslate } from "../../PreactButtonPlugin/PreactButtonPlugin";
import { useRealTimeCaptionTranscriber } from './RTCTranscriberContext';
import { IdlePage } from './IdlePage';
import { LoadingPage } from './LoadingPage';
import { RunningPage } from './RunningPage';
import "./MainAppContent.css";
import type RealTimeCaptionsPlugin from "../es.upv.paella.ai.realTimeCaptions";
import { ErrorPage } from "./ErrorPage";




const PAGE_BY_STATUS = {
    idle: IdlePage,
    loading: LoadingPage,
    error: ErrorPage,
    ready: RunningPage,
    transcribing: RunningPage,
} as const;


export const MainAppContent = () => {
    const {
        status,
        loadingMessage,
        startTranscribing,
        stopTranscribing,
        // resetSession,
        error,
    } = useRealTimeCaptionTranscriber();
    const t = usePaellaTranslate();
    const plugin = usePaellaPlugin<RealTimeCaptionsPlugin>();

    const transcriptEnabled = status === "ready" || status === "transcribing";
    const isTranscribing = status === "transcribing";
    const isError = !!error;
    const translatedLoadingMessage = loadingMessage ? t(loadingMessage) : t("Downloading model...");
    const translatedErrorMessage = error ? t(error) : t("Error");
    const statusLoadingMessage = isError
        ? translatedErrorMessage
        : status == 'idle' 
            ? t("Model not loaded")
            : translatedLoadingMessage
    
    

    const Page = PAGE_BY_STATUS[status];

    const handleRecordToggle = () => {
        if (isTranscribing) {
            stopTranscribing();
        } else {
            startTranscribing();
        }
    }
    return (
        <div className="rtc-app">
            <div className="rtc-app-content">
                <Page />
            </div>
            <footer className="rtc-app-footer">
                <span style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "5px"}}>                    
                    <label class={`rtc-toggle ${!transcriptEnabled ? 'disabled' : ''}`} aria-disabled={!transcriptEnabled} aria-label={t("Toggle transcription")}>
                        <input type="checkbox" checked={isTranscribing} disabled={!transcriptEnabled} onChange={handleRecordToggle}> </input>
                        <svg aria-label="disabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                        <svg aria-label="enabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="4" fill="none" stroke="currentColor"><path d="M20 6 9 17l-5-5"></path></g></svg> 
                    </label>
                    <span>{`${isTranscribing ? t("Transcribing") : t("Transcription disabled")}`}</span>
                </span>                
                <span>{statusLoadingMessage}</span>
            </footer>  
        </div>
    );
};


/* <span class="inline-block w-2.5 h-5 align-middle cursor-blink ml-1" style="background-color: rgb(255, 130, 5);"></span> */

// .cursor-blink {
//     animation: 1s step-end infinite blink;
// }