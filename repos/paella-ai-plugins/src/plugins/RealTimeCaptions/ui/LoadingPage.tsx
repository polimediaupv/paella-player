import { useRealTimeCaptionTranscriber } from "./RTCTranscriberContext";
import { usePaellaTranslate } from "../../PreactButtonPlugin/PreactButtonPlugin";
import "./LoadingPage.css";

export const LoadingPage = () => {
  const { loadingProgress, loadingMessage, error } = useRealTimeCaptionTranscriber();
  const t = usePaellaTranslate();
  const progressClamped = Math.min(100, Math.max(0, loadingProgress));
  const progressRounded = Math.round(progressClamped);
  const isError = !!error;
  const translatedMessage = isError
    ? (error ? t(error) : t("Error loading model"))
    : t(loadingMessage || "Downloading model...");

  return (
    <section className={`rtc-loading${isError ? " is-error" : ""}`} aria-live="polite">      

      <h1>{isError ? t("Error loading model") : t("Loading model")}</h1>

      <p className="rtc-loading-subtitle">
        {translatedMessage}
      </p>

      <div className="rtc-loading-progress-head">
        <span>{t("Progress")}</span>
        <span>{progressRounded}%</span>
      </div>

      <div className="rtc-loading-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressRounded}>
        <div className="rtc-loading-bar-fill" style={{ width: `${progressClamped}%` }} />
      </div>

      <div className="rtc-loading-message-box">
        <span className="rtc-loading-message-dot" aria-hidden="true" />
        <span>{translatedMessage}</span>
      </div>
    </section>
  );
};
