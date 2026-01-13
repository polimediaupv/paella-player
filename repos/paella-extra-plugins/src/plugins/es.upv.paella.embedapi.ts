import { EventLogPlugin, Events, type PluginConfig } from '@asicupv/paella-core';
import PackagePluginModule from './PackagePluginModule';
import { EmbedApiEvents, type FunctionCallRequestParams, type FunctionCallResponseParams } from '@asicupv/paella-embedapi'


export type EmbedApiPluginConfig = PluginConfig & {
    iFrameNamePrefix?: string;
    events?: string[];
};

function getPaellaEvents(eventNames: string[]) {
  return eventNames
    ?.filter((key): key is (keyof typeof Events) => key in Events)
    .map(key => Events[key]);
}

export default class EmbedApiPlugin extends EventLogPlugin<EmbedApiPluginConfig> {
  getPluginModuleInstance() {
    return PackagePluginModule.Get();
  }

  get name() {
    return super.name || "es.upv.paella.embedapi";
  }

  async isEnabled() {
    let enabled = false;    
    const isEmbedded = (window.self !== window.top);
    const iFrameNamePrefix: string = this.config?.iFrameNamePrefix ?? '';

    if (await super.isEnabled() && isEmbedded) {    
      // This iFrame prefix is used by the iFrameEmbedApi
      // When constructing the embedded player iFrame
      if (iFrameNamePrefix) {
        enabled = (window.name != null && window.name.startsWith(iFrameNamePrefix));
      }
      else {
        enabled = true;
      }
    }

    return enabled;
  }

  async load() {
    if (window.parent !== window) {
      window.addEventListener('message', this, false);
    }
  }

  async unload() {    
    if (window.parent !== window) {
      window.removeEventListener('message', this, false);
    }
  }  

  get events() {
    const evs = getPaellaEvents(this.config.events as any) ?? Object.values(Events)
    return evs;
  }

  async onEvent(event: Events, params: any) {
    if ((event == Events.SHOW_POPUP) || (event == Events.HIDE_POPUP)) {
      delete params.popUp;
    }

    // pass the event to the parent window
    this._postMessage(event, params);
  }

  async handleEvent(event: MessageEvent) {
    const eventName = event?.data?.event;
    if (!eventName?.startsWith('paella:')) {
      return;
    }
    // Handle paella Events
    // console.log('EmbedApiPlugin: handleEvent', event);
    this.player.log.debug(`handleEvent ${eventName}: ${event}`, `${this.getPluginModuleInstance().moduleName} [${this.name}]`);
    if (eventName === Events.PLAY) {
      this.player.play();
    }
    else if (eventName === Events.PAUSE) {
      this.player.pause();
    }
    else if (eventName === Events.STOP) {
      this.player.stop();
    }
    else if (eventName === Events.SEEK) {
      if (this.player?.ready) {
        this.player.setCurrentTime(event.data.params.newTime)
      }
      // else send error to the parent window?
    }
    else if (eventName === Events.VOLUME_CHANGED) {
      this.player.setVolume(event.data.params.volume);
    }
    else if (eventName === Events.PLAYBACK_RATE_CHANGED) {
      this.player.setPlaybackRate(event.data.params.newPlaybackRate);
    }
    else if (eventName === Events.TRIMMING_CHANGED) {
      this.player.videoContainer?.setTrimming(event.data.params);
    }
    
    else if (eventName == EmbedApiEvents.FUNCTION_CALL_REQUEST) {
      this.handleFunctionCalling(event.data.params);
    }
    else {
      this.player.log.warn(`Event ${eventName} not handled: ${JSON.stringify(event.data)}`, `${this.getPluginModuleInstance().moduleName} [${this.name}]`);
    }
  }


  async handleFunctionCalling({func, resolveId}: FunctionCallRequestParams) {
    let response;
    let error;

    try {
      if (func === 'version') {
        response = this.player.version;
      }
      else if (func === 'ready') {
        response = this.player.ready;
      }
      else if (func === 'state') {
        response = this.player.state;
      }
      else if (func === 'metadata') {
        response = this.player.metadata;
      }
      else if (func === 'captions') {
        response = this.player.captions;
      }
      else if (func === 'paused') {
        response = await this.player.paused();
      }
      else if (func === 'isFullScreenSupported') {
        response = this.player.isFullScreenSupported();
      }
      else if (func === 'enterFullscreen') {
        response = await this.player.enterFullscreen();
      }
      else if (func === 'exitFullscreen') {
        response = await this.player.exitFullscreen();
      }
      else if (func === 'isFullscreen') {
        response = this.player.isFullscreen;
      }
      else if (func === 'currentTime') {
        response = await this.player.currentTime();
      }
      else if (func === 'volume') {
        response = await this.player.volume();
      }
      else if (func === 'duration') {
        response = await this.player.duration();
      }
      else if (func === 'playbackRate') {
        response = await this.player.playbackRate();
      }
      else if (func === 'isTrimEnabled') {
        response = this.player.videoContainer?.isTrimEnabled;
      }
      else if (func === 'trimStart') {
        response = this.player.videoContainer?.trimStart;
      }
      else if (func === 'trimEnd') {
        response = this.player.videoContainer?.trimEnd;
      }
    }
    catch(e: unknown) {
      if (e instanceof Error) {
        error = e.message;
      }
      else {
        error = e;
      }
    }

    // Send response to the parent window
    const responseParams: FunctionCallResponseParams = {
      responseId: resolveId,
      func,
      response,
      error
    };
    this._postMessage(EmbedApiEvents.FUNCTION_CALL_RESPONSE, responseParams);
  }


  // Send a postMessage to the parent window
  _postMessage(event: string, params: any) {
    try {
      const newMessage = {
        sender: window.name,
        event,
        params
      };
  
      window.parent.postMessage(newMessage, '*');    
    }
    catch(error: unknown) {
      this.player.log.error(`Error posting message to the parent window: ${error}`, `${this.getPluginModuleInstance().moduleName} [${this.name}]`);
      
      // if (error instanceof Error) {
      //   this.player.log.debug(error.stack, `${this.getPluginModuleInstance().moduleName} [${this.name}]`);
      // }
    }    
  }
}