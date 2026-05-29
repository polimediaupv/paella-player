import { useRealTimeCaptionTranscriber } from "./RTCTranscriberContext";
import { usePaellaTranslate } from "../../PreactButtonPlugin/PreactButtonPlugin";
import "./RunningPage.css";

export const RunningPage = () => {
    const { status } = useRealTimeCaptionTranscriber();
    const t = usePaellaTranslate();
    const isTranscribing = status === "transcribing";

    return (
        <section className="rtc-app-running">
            <div>
                {isTranscribing ? t("Transcribing...") : t("Ready")}
            </div>
        </section>
    );
};
