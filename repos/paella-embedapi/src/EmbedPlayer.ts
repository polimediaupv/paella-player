import {Events, type Captions} from '@asicupv/paella-core';
import { EmbedApiEvents } from './EmbedEvents';


export type VideoIdToUrlCallback = (id: string) => string;
export type PellaAuthCallback = () => void;

export type FunctionCallRequestParams = {
  func: string;
  params: Record<string, any>;
  resolveId: number;
}

export type FunctionCallResponseParams = {
  responseId: number;
  func: string;
  response: any;
  error?: any;
}

type OnEventCallback = (event: string, params: object) => void;

export type PlayerInitParams = {
    title?: string,
    width?: number | string,
    height?: number | string,
    videoId?: string,
    videoIdToUrl?: VideoIdToUrlCallback,
    onPaellaAuthRequired?: PellaAuthCallback,
    onEvents?: OnEventCallback;
}

export type LoadVideoParams = {
    trimming?: {
        startTrimming?: number,
        endTrimming?: number
    }
}

export class EmbedPlayer {
    static Events = Events;
    _nextFunctionCallingId: number = 0;
    __eventListeners__: {
        [key: string]: {callback: OnEventCallback}[]
    } = {};
    __functionCallingListeners__: {
        [key: number]: {resolve: Function, reject: Function}
    } = {};
    _onEvents: OnEventCallback | null = null;
    _iFrame: HTMLIFrameElement;
    _videoIdToUrl: VideoIdToUrlCallback | null = null;
    _onPaellaAuthRequired: PellaAuthCallback | null = null;

    constructor(containerElement:HTMLElement|string, initParams:PlayerInitParams = {}) {
        this._onEvents = initParams.onEvents ?? null;        
        this._videoIdToUrl = initParams.videoIdToUrl ?? window.paellaVideoIdToUrl ?? null;
        this._onPaellaAuthRequired = initParams.onPaellaAuthRequired ?? window.onPaellaAuthRequired ?? null;

        // Listen to messages from the iFrame
        window.addEventListener('message', this, false);
                
        if (typeof (containerElement) === "string") {
            const elementFound = document.getElementById(containerElement);
            if (!elementFound) {
                throw new Error('Container element not found');
            }
    
            containerElement = elementFound
        }
        

        if (containerElement.tagName.toUpperCase() == 'IFRAME') {
            this._iFrame = containerElement as HTMLIFrameElement;
        }
        else {
            // Create the iFrame element
            const containerId = containerElement.id || 'player';
            this._iFrame = document.createElement('iframe');
            this._iFrame.width = initParams.width ? `${initParams.width}` : '100%';
            this._iFrame.height = initParams.height ? `${initParams.height}` : '100%';
            this._iFrame.style.cssText = 'resize: none; overflow: hidden; border: 0';
            this._iFrame.name = containerId;
            this._iFrame.id = containerId;
            this._iFrame.allow="autoplay; fullscreen";
            containerElement.replaceWith(this._iFrame);
        }

        this._iFrame.title = initParams.title || 'Paella Player';        
        if (initParams.videoId) {
            if (!this._videoIdToUrl) {
                throw new Error('videoIdToUrl callback is required');
            }
            else {
                const url = this._videoIdToUrl(initParams.videoId);
                if (url != this._iFrame.src) {
                    this.loadVideoByUrl(url) 
                }
            }
        }        
    }

    loadVideoByUrl(mediaContentUrl:string, params?:LoadVideoParams): void {
        if (params?.trimming && params.trimming.startTrimming && params.trimming.endTrimming) {
            this.bindEvent(Events.PLAYER_LOADED, async () => {
                // Retrieve video duration in case a default trim end time is needed
                const videoDuration = await this.duration() //paella.videoManifest?.metadata?.duration;
                // Retrieve trimming data
                const trimmingData = {
                    start: await this.trimStart() ?? 0,
                    end: await this.trimEnd() ?? videoDuration
                };

                let startTrimming: number = 0;  // default start time
                let endTrimming: number = videoDuration; // raw video duration;

                if (params?.trimming?.startTrimming) {
                    startTrimming = trimmingData.start + Math.floor(params.trimming.startTrimming);
                }
                if (params?.trimming?.endTrimming) {
                    endTrimming = Math.min(trimmingData.start + Math.floor(params.trimming.endTrimming), videoDuration);
                }

                this._functionCalling("setTrimming", {
                    enabled: true,
                    start: startTrimming,
                    end: endTrimming
                });
            });
        }

        if (this._iFrame) {
            this._iFrame.src = mediaContentUrl;
        }

        // TODO: implement startSeconds and endSeconds
    }

    // Handler for messages received from the iFrame
    handleEvent(event: MessageEvent) {
        if (event.data.sender == this._iFrame?.name) {
            if (event.data.event === EmbedApiEvents.AUTH) {
                if (this._onPaellaAuthRequired !== null) {
                    this._onPaellaAuthRequired();
                }
            }            
            if (this._onEvents) {
                this._onEvents(event.data.event, event.data.params);
            }
            this?.__eventListeners__ && this.__eventListeners__[event.data.event]?.forEach(cbData => cbData.callback(event.data.event, event.data.params));

            if (event.data.event === EmbedApiEvents.FUNCTION_CALL_RESPONSE) {
                const params: FunctionCallResponseParams = event.data.params;
                const responseId = params.responseId;
                if (responseId in this.__functionCallingListeners__) {
                    if (params.error) {
                        this.__functionCallingListeners__[responseId].reject(params.error);
                    }
                    else {
                        this.__functionCallingListeners__[responseId].resolve(params.response);
                    }
                    delete this.__functionCallingListeners__[responseId];
                }
            }
        }      
    }

    bindEvent(event: string, callback: OnEventCallback) {
	    this.__eventListeners__[event] = this.__eventListeners__[event] || [];
	    this.__eventListeners__[event].push({callback});
	    return this;
    }

    _triggerEvent(event:string, params:object) {
        this._iFrame?.contentWindow?.postMessage({event, params}, '*');
    }

    _functionCalling<T>(func:string, params = {}) : Promise<T>{
        const callId = this._nextFunctionCallingId ?? 0;
        this._nextFunctionCallingId = callId + 1;
        
        return new Promise((resolve, reject) => {
            this.__functionCallingListeners__[callId] = {resolve,reject};
            const evData: FunctionCallRequestParams = {
                func,
                params,
                resolveId: callId
            };
            this._triggerEvent(EmbedApiEvents.FUNCTION_CALL_REQUEST, evData);
        });
    }

    async version(): Promise<string> {
        return this._functionCalling("version");
    }

    async ready(): Promise<boolean> {
        return this._functionCalling("ready");
    }

    async state(): Promise<number>{
        return this._functionCalling("state");
    }

    stateText() {
        //return PlayerStateNames[this.state];
    }
    
    videoId() {
        // return this._videoId;
    }

    async metadata(): Promise<Record<string, any>> {
        return this._functionCalling("metadata");
    }

    async captions(): Promise<Captions[]> {
        return this._functionCalling("captions");
    }

    // Playback control methods
    async play(): Promise<void> {
        return this._triggerEvent(Events.PLAY, {});
    }
    async pause(): Promise<void> {
        return this._triggerEvent(Events.PAUSE, {});
    }
    // async togglePlay(): Promise<void> {}        
    async paused(): Promise<boolean> {
        return this._functionCalling<boolean>("paused");
    }
    async stop(): Promise<void> {
        return this._triggerEvent(Events.STOP, {});
    }
    async setCurrentTime(t: number): Promise<void> {
        this._triggerEvent(Events.SEEK, { newTime: t });
    }
    async currentTime(): Promise<number> {
        return this._functionCalling<number>("currentTime");        
    }
    async volume(): Promise<number> {
        return this._functionCalling<number>("volume");
    }    
    async setVolume(v: number): Promise<void> {
        this._triggerEvent(Events.VOLUME_CHANGED, { volume: v });
    }

    async duration(): Promise<number> {
        return this._functionCalling<number>("duration");
    }
    async playbackRate(): Promise<number> {
        return this._functionCalling<number>("playbackRate");
    }
    async setPlaybackRate(r: number): Promise<void> {
        this._triggerEvent(Events.PLAYBACK_RATE_CHANGED, { newPlaybackRate: r });
    }
    // async skipSeconds(s: number): Promise<void> {}
    // async rewindSeconds(s: number): Promise<void> {}


    // Fullscreen methods
    isFullScreenSupported() {
        return this._functionCalling<boolean>("isFullScreenSupported");
    }
    enterFullscreen(): void {
        this._functionCalling<void>("enterFullscreen");
    }
    exitFullscreen(): void {
        this._functionCalling<void>("exitFullscreen");
    }



    isFullscreen() {
        return this._functionCalling<boolean>("isFullscreen");
    }

    isTrimEnabled() {
        return this._functionCalling<boolean>("isTrimEnabled");
    }

    trimStart() {
        return this._functionCalling<number>("trimStart");
    }

    trimEnd() {
        return this._functionCalling<number>("trimEnd");
    }

    setTrimming({ enabled, start, end }: { enabled: boolean, start: number, end: number }) {
        this._triggerEvent(Events.TRIMMING_CHANGED, {enabled, start, end});
    }


    // Accessing and modifying DOM nodes
    /**
     * This method returns the DOM node for the embedded <iframe>
     */
    getIframe(): HTMLIFrameElement {
        return this._iFrame;
    }

    /**
     * Removes the <iframe> containing the player.
     */
    destroy(): void {
        throw new Error('Not implemented');
        // this._player.destroy();
    }
}