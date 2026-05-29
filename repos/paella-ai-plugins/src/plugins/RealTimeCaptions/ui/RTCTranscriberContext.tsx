import { useCallback, useEffect, useState } from "preact/hooks";
import RealTimeCaptionsPlugin from "../es.upv.paella.ai.realTimeCaptions";
import type { RealTimeCaptions } from "../RealTimeCaptions";
import { usePaellaPlugin } from "../../PreactButtonPlugin/PreactButtonPlugin";



export const useRealTimeCaptionTranscriber = () => {
    const plugin = usePaellaPlugin<RealTimeCaptionsPlugin>();
    const transcriber = plugin?._rtcTranscriber;


    const [status, setStatus ] = useState(transcriber?.status || "idle");
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {        
        const handleStateChange = (instance: RealTimeCaptions) => {
            setStatus(instance.status);
            setLoadingProgress(instance.loadingProgress);
            setLoadingMessage(instance.loadingMessage);
            setError(instance.error);
        };

        plugin?._rtcTranscriber?.addRTCEventListener(handleStateChange);

        return () => {
            plugin?._rtcTranscriber?.removeRTCEventListener(handleStateChange);
        };
    }, [plugin]);


    const loadModel = useCallback(() => {
        return transcriber!.loadModel();
    }, [transcriber]);

    const resetSession = useCallback(() => {
        return transcriber!.resetSession();
    }, [transcriber]);

    const startTranscribing = useCallback(() => {
        return transcriber!.startTranscribing();
    }, [transcriber]);

    const stopTranscribing = useCallback(() => {
        return  transcriber!.stopTranscribing();
    }, [transcriber]);


    return { status, loadingProgress, loadingMessage, error, loadModel, resetSession, startTranscribing, stopTranscribing };

};
