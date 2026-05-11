import Paella from "../Paella";
import { createElementWithHtmlText, DomClass } from "./dom";
import VideoContainer from "./VideoContainer"
import "../../css/video-canvas-area.css";
import {
    getPluginsOfType,
    loadPluginsOfType,
    unloadPluginsOfType
} from "./plugin_tools";
import InteractiveAreaPlugin, {
    loadInteractiveAreaPlugins,
    unloadInteractiveAreaPlugins
} from "./InteractiveAreaPlugin";

import LeftIcon from "../../icons/direction-icon-left";
import RightIcon from "../../icons/direction-icon-right";
import UpIcon from "../../icons/direction-icon-up";
import DownIcon from "../../icons/direction-icon-down";

export const setVideoCanvasAreaVideoContainer = Symbol();

type PanelSize = "small" | "medium" | "large";

export default class VideoCanvasArea extends DomClass {
    protected _visible: boolean = false;
    protected _videoContainer: VideoContainer | null = null;
    protected _panelSize: PanelSize = "medium";
    protected _buttons: HTMLElement;
    protected _interactiveAreaContainer: DomClass | null = null;
    protected _currentPluginName: string | null = null;

    [setVideoCanvasAreaVideoContainer](videoContainer: VideoContainer): void {
        this._videoContainer = videoContainer;
    }

    constructor(player: Paella, parent: HTMLElement) {
        super(player, {
            tag: 'div',
            attributes: {
                class: "video-canvas-area"
            },
            parent
        });

        this._buttons = createElementWithHtmlText(`
            <div class="buttons">
                <button class="resize-button-increase">
                    <i class="horizontal-icon">${LeftIcon}</i>
                    <i class="vertical-icon">${UpIcon}</i>
                </button>
                <button class="resize-button-decrease">
                    <i class="horizontal-icon">${RightIcon}</i>
                    <i class="vertical-icon">${DownIcon}</i>
                </button>
            </div>
        `, this.element);

        // _videoContainer class is set fron Paella class using the setVideoCanvasAreaVideoContainer token
        this._interactiveAreaContainer = new DomClass(player, {
            tag: 'div',
            attributes: {
                class: "interactive-area-container"
            },
            parent: this.element
        });

        const increaseButton = this._buttons.querySelector(".resize-button-increase");
        const decreaseButton = this._buttons.querySelector(".resize-button-decrease");
        increaseButton?.addEventListener("click", () => {
            this.increasePanelSize();
        });
        decreaseButton?.addEventListener("click", () => {
            this.decreasePanelSize();
        });
    }

    setPanelSize(size: PanelSize) {
        this._panelSize = size;
        this.rebuild();
    }

    get currentPanelSize() {
        return this._panelSize;
    }

    increasePanelSize() {
        const cur = this.currentPanelSize;
        if (cur === "small") {
            this.setPanelSize("medium");
        }
        else if (cur === "medium") {
            this.setPanelSize("large");
        }
    }

    decreasePanelSize() {
        const cur = this.currentPanelSize;
        if (cur === "medium") {
            this.setPanelSize("small");
        }
        else if (cur === "large") {
            this.setPanelSize("medium");
        }
    }

    async load() {
        await loadInteractiveAreaPlugins(this.player);
    }

    async unload() {
        await unloadInteractiveAreaPlugins(this.player);
    }

    async showInteractiveAreaPlugin(pluginName: string) : Promise<void> {
        const plugins = getPluginsOfType(this.player, "interactiveArea");
        const plugin = plugins.find(p => p.name === pluginName);
        if (!plugin) {
            console.warn(`Interactive area plugin not found: ${ pluginName }. Check if the plugin is loaded.`);
            return;
        }

        if (!this._interactiveAreaContainer) {
            throw new Error("Unexpected error: the interactive area container is not valid");
        }
        const pluginContent = await (plugin  as InteractiveAreaPlugin).getContent();

        this._currentPluginName = pluginName;
        this._interactiveAreaContainer.element.replaceChildren();
        this._interactiveAreaContainer.element.appendChild(pluginContent);
        this.showPanel();
    }

    showPanel() {
        this._visible = true;
        this._interactiveAreaContainer?.element.classList.add("visible");
        this.rebuild();
    }

    hidePanel() {
        this._visible = false;
        this._interactiveAreaContainer?.element.classList.remove("visible");
        this.rebuild();
    }

    /**
     * Refreshes the content of the currently visible interactive area plugin
     * by calling getContent() on the plugin and replacing the panel DOM.
     * Does nothing if no panel is currently visible.
     */
    async refreshPanelContent(): Promise<void> {
        if (!this._visible || !this._currentPluginName) {
            return;
        }
        const plugins = getPluginsOfType(this.player, "interactiveArea");
        const plugin = plugins.find(p => p.name === this._currentPluginName);
        if (!plugin) {
            return;
        }
        const content = await (plugin as InteractiveAreaPlugin).getContent();
        this._interactiveAreaContainer?.element.replaceChildren(content);
    }

    onResize() {
        this.rebuild();
    }

    get videoContainer() : VideoContainer | null {
        return this._videoContainer;
    }

    get currentPluginName() : string | null {
        return this._currentPluginName;
    }

    protected rebuild() {
        const aspectRatio = this.element.offsetWidth / this.element.offsetHeight;
        const rightPanelClass = "right-panel";
        const bottomPanelClass = "bottom-panel";
        this.videoContainer?.element.classList.remove(rightPanelClass, bottomPanelClass);
        this.videoContainer?.element.classList.remove("small-panel", "medium-panel", "large-panel");

        if (this._visible) {
            this.videoContainer?.element?.classList.add(aspectRatio > 1 ? rightPanelClass : bottomPanelClass);
            this.videoContainer?.element?.classList.add(`${this._panelSize}-panel`);
        }

        this.videoContainer?.updateLayout();
    }
}
