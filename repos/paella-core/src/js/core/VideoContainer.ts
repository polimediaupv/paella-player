import { DomClass, createElementWithHtmlText,createElement } from './dom';
import { 
    getValidLayouts, 
    getValidContentIds, 
    getLayoutStructure, 
    getLayoutWithContentId,
    getValidContentSettings,
    type LayoutVideoRect,
    type LayoutStructure,
    isLegacyLayoutVideo
} from './VideoLayout';
import StreamProvider from './StreamProvider';
import Events, { triggerEvent } from './Events';
import { addButtonPlugin } from './ButtonPlugin';
import { translate } from './Localization';

import { loadPluginsOfType, unloadPluginsOfType } from './plugin_tools'
import { loadVideoPlugins, unloadVideoPlugins, getVideoPluginWithFileUrl } from './VideoPlugin';
import { addVideoCanvasButton, CanvasButtonPosition, setTabIndex } from './CanvasPlugin';
import VideoContainerMessage from './VideoContainerMessage';
import PlayerState from './PlayerState';
import Paella from '../Paella';
import { type Stream } from './Manifest'
import { type LayoutButton } from './VideoLayout';
import CanvasButtonPlugin from './CanvasButtonPlugin';
import ButtonPlugin from './ButtonPlugin';
import { VideoLayaoutValidContent } from './Config';

export function getSourceWithUrl(player: Paella, url: string) {
    const plugin = getVideoPluginWithFileUrl(player, url);
    return plugin?.getManifestData([url]);
}

export interface TrimmingParams {
    enabled?: boolean;
    start?: number;
    end?: number; 
}

export default class VideoContainer extends DomClass {
    private _layoutButtonPlugins: CanvasButtonPlugin[] = [];
    private _layoutId: string = "";
    private _mainLayoutContent: string | null = null;
    private _layoutButtons: HTMLButtonElement[] = [];
    private _validContentIds: string[] = [];
    private _updateInProgress = false;
    private _messageContainer: VideoContainerMessage | null = null;
    private _ready: boolean = false;
    private _streamData: Stream[] = [];
    private _validContentSettings: VideoLayaoutValidContent[] = [];
    private _baseVideoRect: HTMLElement | null = null;
    private _streamProvider: StreamProvider | null = null;
    private _hiddenVideos: HTMLElement | null = null;

    constructor(player: Paella, parent: HTMLElement | null = null) {
        const baseVideoRectClass = "base-video-rect";

        const attributes = {
            "class": "video-container"
        };

        if (player.config.videoContainer?.overPlaybackBar) {
            attributes.class += " over-playback-bar"
        }

        const children = `
            <div class="${ baseVideoRectClass }"></div>
            <div class="hidden-videos-container" style="display: none"></div>
        `
        super(player, {attributes, children, parent});

        this._hiddenVideos = this.element.getElementsByClassName("hidden-videos-container")[0] as HTMLElement;
        this._baseVideoRect = this.element.getElementsByClassName(baseVideoRectClass)[0] as HTMLElement;
        this.element.addEventListener("click", async () => {
            if (await this.paused()) {
                await this.play();
            }
            else {
                await this.pause();
            }
        });

        this._ready = false;
        
        this._streamProvider = new StreamProvider(this.player, this.baseVideoRect);
    }

    get layoutId() : string {
        return this._layoutId;
    }

    get mainLayoutContent() : string | null {
        return this._mainLayoutContent;
    }
    
    async setLayout(layoutId: string, mainContent: string | null = null) : Promise<boolean> {
        if (this.validContentIds.indexOf(layoutId) === -1) {
            return false;
        }
        else {
            const global = this.player.config.videoContainer?.restoreVideoLayout?.global;
            await this.player.preferences?.set('videoLayout', layoutId, { global });
            await this.player.preferences?.set('videoLayoutMainContent', mainContent, { global });
            const prevLayout = this._layoutId;
            this._layoutId = layoutId;
            this._mainLayoutContent = mainContent;
            await this.updateLayout();
            if (prevLayout !== layoutId) {
                triggerEvent(this.player, Events.LAYOUT_CHANGED, { prevLayout, layoutId });
            }
            return true;
        }
    }
    
    get validContentIds() : string[] {
        return this._validContentIds;
    }
    
    get validContentSettings() : any[] {
        return this._validContentSettings;
    }

    get validLayouts() : object[] {
        return getValidLayouts(this.player, this.streamData);
    }

    get streamData() : Stream[] {
        return this._streamData;
    }

    get baseVideoRect() : HTMLElement {
        return this._baseVideoRect!;
    }
    
    get streamProvider() : StreamProvider {
        return this._streamProvider!;
    }
    
    async create() : Promise<void> {
        this._baseVideoRect!.style.display = "none";

        await loadPluginsOfType(this.player, "layout");

        await loadVideoPlugins(this.player);
    }

    async load(streamData: Stream[]) : Promise<void> {
        this._streamData = streamData;

        if (this.player.config.videoContainer?.restoreVideoLayout?.enabled) {
            const global = this.player.config.videoContainer?.restoreVideoLayout?.global;
            this._layoutId = await this.player.preferences?.get("videoLayout", { global }) || this.player.config.defaultLayout;
            this._mainLayoutContent = await this.player.preferences?.get("videoLayoutMainContent", { global }) || null;
        }
        else {
            this._layoutId = this.player.config.defaultLayout;
            this._mainLayoutContent = null;
        }


        await this.streamProvider.load(streamData);
        
        // Find the content identifiers that are compatible with the stream data
        this._validContentIds = getValidContentIds(this.player, streamData);
        
        this._validContentSettings = getValidContentSettings(this.player, streamData);
        
        // Load video layout
        await this.updateLayout(null);

        this._baseVideoRect!.style.display = "";

        // Restore volume and playback rate
        const storedVolume = await this.player.preferences?.get("volume", { global: true });
        const playbackRate = await this.player.preferences?.get("playbackRate", { global: true });
        const lastKnownTime = await this.player.preferences?.get("lastKnownTime", { global: false });

        if (this.player.config.videoContainer?.restoreVolume && storedVolume !== null && storedVolume !== undefined) {
            await this.streamProvider.setVolume(storedVolume);
        }
        if (this.player.config.videoContainer?.restorePlaybackRate && playbackRate !== null && playbackRate !== undefined) {
            await this.streamProvider.setPlaybackRate(playbackRate);
        }
        
        if (this.player.videoManifest.trimming) {
            await this.player.videoContainer?.setTrimming(this.player.videoManifest.trimming);
        }

        if (this.player.config.videoContainer?.restoreLastTime?.enabled && !this.streamProvider.isLiveStream)
        {
            const saveCurrentTime = async () => {
                const paused = await this.paused();
                if (!paused) {
                    const currentTime = await this.currentTime();
                    await this.player.preferences?.set("lastKnownTime", currentTime, { global: false });
                }
                setTimeout(saveCurrentTime, 1000);
            }

            if (lastKnownTime) {
                const time = await this.player.preferences?.get('lastKnownTime', { global: false });
                const duration = await this.duration();
                const remainingSeconds = this.player.config.videoContainer?.restoreLastTime?.remainingSeconds;
                if ((duration - time) > remainingSeconds) {
                    await this.setCurrentTime(time);
                }
            }

            saveCurrentTime();
        }

        this._messageContainer = new VideoContainerMessage(this.player, this.element);

        this._ready = true;
    }

    async unload() {
        this.removeFromParent();

        // Button plugins are unloaded in PlaybackBar

        await unloadPluginsOfType(this.player, "layout");

        await unloadVideoPlugins(this.player);

        await this.streamProvider.unload();
    }

    async updateLayout(mainContent: string | null = null) : Promise<boolean> {
        // The second argument in this function is for internal use only
        const ignorePlayerState = arguments[1];

        if (mainContent) {
            this._mainLayoutContent = mainContent;
        }
        if (!ignorePlayerState && this.player.state !== PlayerState.LOADED) {
            return false;
        }

        if (this._updateInProgress) {
            this.player.log.warn("Recursive update layout detected");
            return false;
        }
        this._updateInProgress = true;

        let status = true;
        
        this._layoutButtons = [];
        
        // Current layout: if not selected, or the selected layout is not compatible, load de default layout
        if (!this._layoutId || this._validContentIds.indexOf(this._layoutId) === -1) {
            this._layoutId = this.player.config.defaultLayout;
            this._mainLayoutContent = null;

            // Check if the default layout is compatible
            if (this._validContentIds.indexOf(this._layoutId) === -1) {
                this._layoutId = this._validContentIds[0];
            }
            status = false;
        }

        const layoutPlugin = getLayoutWithContentId(this.player, this.streamProvider.streamData, this._layoutId);
        if (layoutPlugin?.layoutType === "static") {
            throw new Error("Static layouts are not supported anymore");
        }
        else if (layoutPlugin?.layoutType === "dynamic") {
            status = await this.updateLayoutDynamic();
        }

        // Update the layout button plugins
        this._layoutButtonPlugins = this._layoutButtons.map((btn: HTMLButtonElement) => {
            const plugin = this.player.getPlugin(btn.name || "", "canvasButton");
            if (plugin) {
                (plugin as any)._targetContent = btn.getAttribute("data-target-content");
                (plugin as any)._button = btn;
            }
            return plugin;
        }).filter((plugin: CanvasButtonPlugin) => plugin != null);

        this._updateInProgress = false;
        return status;
    }
    
    hideUserInterface() {
        if (this._layoutButtons) {
            this.player.log.debug("Hide video container user interface");
            const hideFunc = (button: HTMLButtonElement) => {
                (button as any)._prevDisplay = button.style.display;
                button.style.display = "none";
            }
            this._layoutButtons.forEach(hideFunc);
        
            for (const content in this.streamProvider.streams) {
                const stream = this.streamProvider.streams[content];
                stream.canvas.hideButtons();
            }
        }
    }
    
    showUserInterface() {
        if (this._layoutButtons) {
            const showFunc = (button: HTMLButtonElement) => button.style.display = (button as any)._prevDisplay || "block";
            this._layoutButtons.forEach(showFunc);
            for (const content in this.streamProvider.streams) {
                const stream = this.streamProvider.streams[content];
                stream.canvas.showButtons();
            }
        }
    }

    get message() : VideoContainerMessage {
        return this._messageContainer!;
    }

    get elementSize() : { w: number, h: number } {
        return { w: this.element.offsetWidth, h: this.element.offsetHeight };
    }

    get ready() : boolean {
        return this._ready;
    }

    get isLiveStream() : boolean {
        return this.streamProvider.isLiveStream;
    }

    async play() : Promise<any> {
        const result = await this.streamProvider.play();
        triggerEvent(this.player, Events.PLAY);
        return result;
    }

    async pause() : Promise<any>{
        const result = await this.streamProvider.pause();
        triggerEvent(this.player, Events.PAUSE);
        return result;
    }
    
    async stop() : Promise<any> {
        this.streamProvider.stop();
        triggerEvent(this.player, Events.STOP);
    }
    
    async paused() : Promise<boolean>  {
        return this.streamProvider.paused();
    }

    async setCurrentTime(t: number) : Promise<any> {
        const result = await this.streamProvider.setCurrentTime(t);
        triggerEvent(this.player, Events.SEEK, { prevTime: result.prevTime, newTime: result.newTime });
        return result.result;
    }
    
    async currentTime() : Promise<number> {
        return this.streamProvider.currentTime();
    }
    
    async volume() : Promise<number> {
        return this.streamProvider.volume();
    }
    
    async setVolume(v: number) : Promise<any> {
        const result = await this.streamProvider.setVolume(v);
        triggerEvent(this.player, Events.VOLUME_CHANGED, { volume: v });
        await this.player.preferences?.set("volume", v, { global: true });
        return result;
    }
    
    async duration() : Promise<number> {
        return await this.streamProvider.duration();
    }

    async playbackRate() : Promise<number> {
        return await this.streamProvider.playbackRate();
    }

    async setPlaybackRate(r: number) : Promise<any> {
        const result = await this.streamProvider.setPlaybackRate(r);
        triggerEvent(this.player, Events.PLAYBACK_RATE_CHANGED, { newPlaybackRate: r });
        await this.player.preferences?.set("playbackRate", r, { global: true });
        return result;
    }

    get isTrimEnabled() : boolean {
        return this.streamProvider.isTrimEnabled;
    }

    get trimStart() : number {
        return this.streamProvider.trimStart;
    }

    get trimEnd() : number {
        return this.streamProvider.trimEnd;
    }

    async setTrimming({ enabled, start, end } : TrimmingParams) : Promise<any> {
        const result = await this.streamProvider.setTrimming({
            enabled: enabled ?? false,
            start: start ?? 0,
            end: end ?? 0
        });
        triggerEvent(this.player, Events.TRIMMING_CHANGED, { 
            enabled, 
            start, 
            end 
        });
        return result;
    }

    getVideoRect(target: string | number | null = null) : {x: number, y: number, width: number, height: number, element: HTMLElement} | null {
        let element = this.baseVideoRect;
        if (typeof(target) === "string" && this.streamProvider.streams) {
            element = this.streamProvider.streams[target]?.canvas.element;

            if (!element) {
                this.player.log.warn(`videoContainer.getVideoRect: Invalid target '${target}'. Valid targets are: ${Object.keys(this.streamProvider.streams).join(", ")}`);
                this.player.log.warn("Please, configure a valid target in the 'targetContent' property of the configuration file, or provide a valid target in the 'frameList.targetContent' property of the video manifest");
                return null;
            }
        }
        else if (target === 0 && this.streamProvider.streams) {
            element = this.streamProvider.streams[Object.keys(this.streamProvider.streams)[0]]?.canvas.element;
        }
        
        return {
            x: element?.offsetLeft, 
            y: element?.offsetTop, 
            width: element?.offsetWidth, 
            height: element?.offsetHeight,            
            element
        };
    }

    appendChild(element: HTMLElement, rect: {x: number, y: number, width: number, height: number} | null = null, zIndex: number = 1) : HTMLElement {
        if (rect) {
            const { width, height } = this.getVideoRect() || { width: 1, height: 1 };
            rect.x = rect.x * 100 / width;
            rect.width = rect.width * 100 / width;
            rect.y = rect.y * 100 / height;
            rect.height = rect.height * 100 / height;
            element.style.position = "absolute";
            element.style.left = `${ rect.x }%`;
            element.style.top = `${ rect.y }%`;
            element.style.width = `${ rect.width }%`;
            element.style.height = `${ rect.height }%`;
            if (zIndex!==null) element.style.zIndex = "" + zIndex;
        }
        this.baseVideoRect.appendChild(element);
        return element;
    }

    removeChild(element: HTMLElement) {
        this.baseVideoRect.removeChild(element);
    }

    get layoutButtons() : HTMLButtonElement[] {
        return this._layoutButtons!;
    }

    get layoutButtonPlugins() : CanvasButtonPlugin[] {
        return this._layoutButtonPlugins!;
    }
 
    private async updateLayoutDynamic(): Promise<boolean> {
        const layoutStructure = getLayoutStructure(
            this.player,
            this.streamProvider.streamData,
            this._layoutId,
            this._mainLayoutContent
        );

        if (!layoutStructure) {
            return false;
        }

        if (!isLegacyLayoutVideo(layoutStructure)) {
            this.player.log.warn("The layout structure contains videos without position and size information. This layout structure is not compatible with the current video container implementation.");
            return false;
        }

        await this.enableVideos(layoutStructure);

        this.hideAllVideoPlayers();

        this.baseVideoRect.classList.add("dynamic");
        this.baseVideoRect.classList.remove("static");
        this.baseVideoRect.innerHTML = "";


        const videoContainerWidth = this.element.clientWidth;
        const videoContainerHeight = this.element.clientHeight;
        const isLandscape = videoContainerWidth > videoContainerHeight;
        this.baseVideoRect.classList.remove("align-center");
        this.baseVideoRect.classList.remove("align-top");
        this.baseVideoRect.classList.remove("align-bottom");
        this.baseVideoRect.classList.remove("align-left");
        this.baseVideoRect.classList.remove("align-right");

        if (isLandscape) {
            const videoCanvasAlign = this.player.config.videoContainer?.dynamicLayout?.landscapeVerticalAlignment || "align-center";
            this.baseVideoRect.classList.remove("portrait");
            this.baseVideoRect.classList.add("landscape");
            this.baseVideoRect.classList.add(videoCanvasAlign);
        }
        else {
            const videoCanvasAlign = this.player.config.videoContainer?.dynamicLayout?.portraitHorizontalAlignment || "align-center";
            this.baseVideoRect.classList.add("portrait");
            this.baseVideoRect.classList.remove("landscape");
            this.baseVideoRect.classList.add(videoCanvasAlign);
        }
        const width = this.baseVideoRect.clientWidth;
        const height = this.element.clientHeight;
        const buttonElements: HTMLButtonElement[] = [];
        this._layoutButtons = [];

        if (layoutStructure?.videos?.length === 1) {
            const canvasElements = [];
            const video = layoutStructure.videos[0];
            if (!this.streamProvider.streams) {
                return false;
            }

            const videoData = this.streamProvider.streams[video?.content || ""];
            const { player, canvas } = videoData;

            canvas.clearButtonsArea();
            buttonElements.push(...await addVideoCanvasButton(this.player, layoutStructure, canvas, video, video.content || ""));
            buttonElements.forEach(btn => btn.setAttribute("data-target-content", video.content || ""));

            canvas.element.style = {};
            canvas.element.style.display = "block";
            canvas.element.style.width = "100%";
            canvas.element.style.height = "100%";
            canvas.element.style.overflow = "hidden";
            if (video.positionControl === "layout" || !video.positionControl) {
                canvas.element.style.position = "relative";
            }
            if (typeof video.className === "string") {
                video.className && canvas.element.classList.add(video.className);
            }
            else if (Array.isArray(video.className)) {
                video.className.forEach(cls => canvas.element.classList.add(cls));
            }
            canvasElements.push(canvas.element);
            canvas.element.sortIndex = 0;
            canvasElements.forEach(e => this.baseVideoRect.appendChild(e));
            setTimeout(() => {
                setTabIndex(this.player, layoutStructure, buttonElements.flat());
            }, 100);
        }
        else if (layoutStructure?.videos?.length) {
            let i = 0;
            const canvasElements = [];
            
            for (const video of layoutStructure.videos) {
                if (!this.streamProvider.streams) {
                    continue;
                }
                const videoData = this.streamProvider.streams[video?.content || ""];
                const { player, canvas } = videoData;
                const res = await player.getDimensions();
                const videoAspectRatio = res.w / res.h;
                const maxWidth = width;
                const maxHeight = height;
                const baseSize = (isLandscape ? maxWidth : maxHeight) * (video.size || 100) / 100;
                let videoWidth = Math.round(isLandscape ? baseSize : baseSize * videoAspectRatio);
                let videoHeight = Math.round(isLandscape ? baseSize / videoAspectRatio : baseSize);
                if (videoWidth>maxWidth) {
                    videoWidth = maxWidth;
                    videoHeight = Math.round(videoWidth / videoAspectRatio);
                }
                if (videoHeight>maxHeight) {
                    videoHeight = maxHeight;
                    videoWidth = Math.round(videoHeight * videoAspectRatio);
                }
                

                canvas.clearButtonsArea();
                buttonElements.push(...await addVideoCanvasButton(this.player, layoutStructure, canvas, video, video.content || ""));
                buttonElements.forEach(btn => btn.setAttribute("data-target-content", video.content || ""));

                canvas.element.style = {};
                canvas.element.style.display = "block";
                canvas.element.style.width = `${videoWidth}px`;
                canvas.element.style.height = `${videoHeight}px`;
                canvas.element.style.overflow = "hidden";
                canvas.element.className = "video-canvas";
                if (video.positionControl === "layout" || !video.positionControl) {
                    canvas.element.style.position = "relative";
                }
                if (typeof video.className === "string") {
                    video.className && canvas.element.classList.add(video.className);
                }
                else if (Array.isArray(video.className)) {
                    video.className.forEach(cls => canvas.element.classList.add(cls));
                }
                canvas.element.sortIndex = i++;
                canvasElements.push(canvas.element);
            }
            if (isLandscape) {
                const landscapeContainer = createElementWithHtmlText(`<div class="landscape-container"></div>`, this.baseVideoRect);
                canvasElements.forEach(e => landscapeContainer.appendChild(e));
            }
            else {
                canvasElements.forEach(e => this.baseVideoRect.appendChild(e));
            }
            setTimeout(() => {
                setTabIndex(this.player, layoutStructure, buttonElements.flat());
            }, 100);
        }

        this._layoutButtons = buttonElements;

        return true;
    }


    async enableVideos(layoutStructure: LayoutStructure) {
        for (const content in this.streamProvider.streams) {
            const isPresent = layoutStructure?.videos?.find(video => video.content === content) != null;
            const video = this.streamProvider.streams[content];
            
            if (isPresent && !video.player.isEnabled) {
                await video.player.enable();
            }
            else if (!isPresent && video.player.isEnabled) {
                await video.player.disable();
            }
        }
    }

    hideAllVideoPlayers() {
        for (const key in this.streamProvider.streams) {
            const videoData = this.streamProvider.streams[key];
            videoData.canvas.element.style.display = "none";
            this._hiddenVideos?.appendChild(videoData.canvas.element);
        }
    }
}


