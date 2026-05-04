import { useRealTimeCaptionTranscriber } from "./RTCTranscriberContext";
import { usePaellaTranslate } from "../../PreactButtonPlugin/PreactButtonPlugin";
import "./ErrorPage.css";

const BombIcon = () => (
    <div className="rtc-app-error-icon" style={{ display: "flex", justifyContent: "center" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="80px" height="80px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bomb-icon lucide-bomb"><circle cx="11" cy="13" r="9"/><path d="M14.35 4.65 16.3 2.7a2.41 2.41 0 0 1 3.4 0l1.6 1.6a2.4 2.4 0 0 1 0 3.4l-1.95 1.95"/><path d="m22 2-1.5 1.5"/></svg>
    </div>
)



export const ErrorPage = () => {
    const { error } = useRealTimeCaptionTranscriber();
    const t = usePaellaTranslate();    
    const translatedError = error ? t(error) : t("Error");

    return (
        <section className="rtc-app-error" aria-live="polite">            
            <h1>{t("Error")}</h1>
            <BombIcon />

            {/* <p className="rtc-app-error-subtitle">
                {isError ? error : loadingMessage || t("Downloading model...")}
            </p> */}

            <div className="rtc-app-error-message-box">                
                <span>{translatedError}</span>
            </div>
        </section>
    );
};
