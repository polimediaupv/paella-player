import { useRealTimeCaptionTranscriber } from "./RTCTranscriberContext";
import { usePaellaPlugin, usePaellaTranslate } from "../../PreactButtonPlugin/PreactButtonPlugin";
import "./IdlePage.css";
import type RealTimeCaptionsPlugin from "../es.upv.paella.ai.realTimeCaptions";

const CARD_KEYS = ["1", "2"] as const;

export const IdlePage = () => {
    const { loadModel, startTranscribing } = useRealTimeCaptionTranscriber();
    const t = usePaellaTranslate();
    const plugin = usePaellaPlugin<RealTimeCaptionsPlugin>();


    const handleStartTranscriptionClick  = async () => {
        await loadModel();        
        startTranscribing();
    }

    return (
        <section className="rtc-app-idle" aria-labelledby="rtc-landing-title">
            <div className="rtc-app-idle-cta-area">
                <div className="rtc-app-card" role="listitem">
                    <p style={{fontSize: '1.25rem'}}>
                        {t("This plugin transcribes the video in real time using an artificial intelligence model that runs in the browser.")}
                        <br />
                        {t("To get started, click the button below to load the transcription model.")}
                    </p>
                </div>
            </div>
            <div className="rtc-app-idle-cards" role="list">
                {CARD_KEYS.map((key) => (
                    <div className="rtc-app-card" role="listitem" key={key}>
                        <div className="rtc-app-card-head">
                            <span className="rtc-app-badge">{key}</span>
                            <h2>{t(`RTC Feature ${key} Title`)}</h2>
                        </div>
                        <p>{t(`RTC Feature ${key} Description`)}</p>
                    </div>
                ))}
            </div>            

            <footer className="rtc-app-idle-cta-area">
                <button
                    className="rtc-app-idle-cta"
                    onClick={handleStartTranscriptionClick}
                    type="button"
                    aria-label={t("Start transcription")}
                >
                    <span>{t("Start transcription")}</span>
                    <span aria-hidden="true">→</span>
                </button>
                <p className="rtc-app-idle-note">
                    {t("Requires a browser that supports WebGPU (w/ shader-f16)")}
                </p>
            </footer>
        </section>
    );
};
