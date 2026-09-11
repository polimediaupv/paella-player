import AIAgentChatPlugin, { usePaellaPlugin } from "../es.upv.paella.ai.agentchat"
import "./LoadingPage.css";

interface LoadingPageProps {
    phase: 'model' | 'vectorstore';
    modelProgress: number;
    modelText: string;
    vectorStoreProgress: number;
    error: string | null;
}

export const LoadingPage = ({phase, modelProgress, modelText, vectorStoreProgress, error}: LoadingPageProps) => {  
  const plugin = usePaellaPlugin<AIAgentChatPlugin>();
  const t = plugin?.player.translate || ((msg: string) => msg);

  const isError = !!error;
  const isModelPhase = phase === 'model';
  
  const progress = isModelPhase ? modelProgress : vectorStoreProgress;
  const progressClamped = Math.min(100, Math.max(0, progress));
  const progressRounded = Math.round(progressClamped);

  const title = isError
    ? t("Error loading transcript")
    : isModelPhase
      ? t("Preparing AI assistant...")
      : t("Loading video transcript...");

  const subtitle = isError
    ? t("Error loading transcript")
    : isModelPhase
      ? (modelText || t("Preparing AI assistant..."))
      : t("Analyzing transcript...");

  return (
    <section className={`rtc-loading${isError ? " is-error" : ""}`} aria-live="polite">      

      <h1>{title}</h1>

      <p className="rtc-loading-subtitle">
        {subtitle}
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
        <span>{subtitle}</span>
      </div>
    </section>
  );
};
