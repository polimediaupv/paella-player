import { useRealTimeCaptionTranscriber } from "./RTCTranscriberContext";
// import { usePaellaPlugin, usePaellaTranslate } from "../../PreactButtonPlugin/PreactButtonPlugin";
import "./RunningPage.css";

export const RunningPage = () => {
    const {
        // status,
        transcript,
        // startTranscribing,
        // stopTranscribing,
        // resetSession,
        // error,
    } = useRealTimeCaptionTranscriber();
    // const t = usePaellaTranslate();
    // const paellaPlugin = usePaellaPlugin()
    // const isTranscribing = status === "transcribing";
    const transcriptText = transcript.trimStart();
    // const hasTranscript = transcriptText.length > 0;

    // const handleRecordToggle = () => {
    //     if (isTranscribing) {
    //         stopRecording();
    //         return;
    //     }
    //     console.log(error);

    //     //__paella_instances__[0].videoContainer.streamProvider.mainAudioPlayer.video
    //     const mainAudioPlayer = paellaPlugin.player.videoContainer?.streamProvider.mainAudioPlayer;
    //     console.log("______")
    //     console.log((mainAudioPlayer as any).video)

    //     const video = (mainAudioPlayer as any).video
    //     // (document.getElementById("video") as HTMLVideoElement | null) ||
    //     // (document.querySelector("video") as HTMLVideoElement | null);
    //     startRecording(video);
    // };

    // const controlLabel = isTranscribing ? t("Stop") : t("Start");
    // const streamStatus = isTranscribing ? t("listening") : t("ready");
    // const micStatus = isTranscribing ? t("recording") : t("idle");
    // const showStartScreen = !isTranscribing && !hasTranscript && !error;

    return (
        <section className="rtc-app-running">
            <div >
                {transcriptText}

            </div>
            {/* <div className="rtc-running-controls">
                <button type="button" className="rtc-running-btn" onClick={handleRecordToggle}>
                    {controlLabel}
                </button>
                <button type="button" className="rtc-running-btn rtc-running-btn-secondary" onClick={resetSession}>
                    {t("Reset")}
                </button>
            </div> */}
        </section>
    );
};
