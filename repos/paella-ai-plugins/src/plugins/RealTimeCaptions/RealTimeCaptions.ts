

export type RTCStatus = "idle" | "loading" | "ready" | "transcribing" | "error";

export abstract class RealTimeCaptions  {

    private rtcEventListeners: Array<(instance: RealTimeCaptions) => void> = [];

    addRTCEventListener(listener: (instance: RealTimeCaptions) => void) {
        this.rtcEventListeners.push(listener);
    }
    removeRTCEventListener(listener: (instance: RealTimeCaptions) => void) {
        this.rtcEventListeners = this.rtcEventListeners.filter(l => l !== listener);
    }

    protected notifyUpdate() {
        this.rtcEventListeners.forEach(listener => listener(this));
    }

    
    
    abstract get status(): RTCStatus;
    abstract get loadingProgress(): number;
    abstract get loadingMessage(): string;
    abstract get error(): string | null;

    abstract loadModel(): Promise<void>;
    abstract unloadModel(): void;
    abstract startTranscribing(): Promise<void>;
    abstract stopTranscribing(): void;
    abstract resetSession(): void;
    
}
