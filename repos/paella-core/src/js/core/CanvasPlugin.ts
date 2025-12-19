import Plugin from './Plugin';
import { getPluginsOfType, loadPluginsOfType } from './plugin_tools';
import { DomClass, createElement, createElementWithHtmlText } from './dom';
import CanvasButtonPlugin, { getCanvasButtons } from './CanvasButtonPlugin';
import Paella from '../Paella';
import VideoContainer from './VideoContainer';
import { type LayoutButton } from './VideoLayout';

const g_enabledCanvasPlugins: CanvasPlugin[] = [];
export async function loadCanvasPlugins(player: Paella) {
    await loadPluginsOfType(player, "canvas", async (plugin) => {
        g_enabledCanvasPlugins.push(plugin as CanvasPlugin);
    });
}

export async function unloadCanvasPlugins(player: Paella) {
    g_enabledCanvasPlugins.slice(0);
}

export function getCanvasPlugin(player: Paella, stream: string) {
    if (g_enabledCanvasPlugins.length === 0) {
        throw Error("No canvas plugins loaded. Note that `loadCanvasPlugins()` must to be called before use `getCanvasPlugins()`");
    }
    let plugin = null;

    g_enabledCanvasPlugins.some(p => {
        if (p.isCompatible(stream)) {
            plugin = p;
            return true;
        }
    });

    return plugin;
}

export const CanvasButtonPosition = Object.freeze({
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right'
});

const addButton = function(this: Canvas, {
    icon,
    tabIndex,
    ariaLabel,
    title,
    className,
    position = CanvasButtonPosition.CENTER,
    click,
    content,
    name
} : {
    icon: string
    tabIndex?: number
    ariaLabel?: string
    title?: string
    className?: string
    position?: 'left' | 'center' | 'right'
    click: (content:any) => Promise<void>
    content?: any
    name?: string
}) {
    if (!icon) {
        throw new Error("Error in video layout definition. getVideoCanvasButtons(): missing 'icon' attribute.");
    }
    if (!click) {
        throw new Error("Error in video layout definition. getVideoCanvasButtons(): missing 'click' function.");
    }
    let attributes = `class="align-${position}${ className ? " " + className : ""}"`;
    if (ariaLabel) {
        attributes += ` aria-label="${ariaLabel}"`;
    }
    if (title) {
        attributes += ` title="${title}"`;
    }
    if (tabIndex !== undefined) {
        attributes += ` tabindex="${tabIndex}"`;
    }
    if (name !== undefined) {
        attributes += ` name="${name}"`;
    }
    const btn = createElementWithHtmlText(`
        <button ${attributes}><i class="button-icon" style="pointer-events: none">${ icon }</i></button>
    `);
    switch (position) {
    case 'left':
        this.leftButtonsArea.appendChild(btn);
        break;
    case 'center':
        this.centerButtonsArea.appendChild(btn);
        break;
    case 'right':
        this.rightButtonsArea.appendChild(btn);
        break;
    }
    btn.addEventListener('click', async (evt) => {
        evt.stopPropagation();
        await click(content);
        return false;
    });
    return btn;
}

export const addVideoCanvasButton = async (player: Paella, layoutStructure: any, canvas: Canvas, video: any, content: string) => {
    const plugin = layoutStructure.plugin;
    let tabIndexStart = plugin.tabIndexStart;
    const externalButtons = await getCanvasButtons(player, video);
    const buttonElements: HTMLElement[] = [];
    const buttons = [...externalButtons,
        ...plugin.getVideoCanvasButtons(layoutStructure, video.content, video, canvas)];
    buttons.forEach(btnData => {
        btnData.tabIndex = tabIndexStart++;
        btnData.content = content;
        const btn = addButton.apply(canvas, [btnData]);
        buttonElements.push(btn);
    });
    
    return buttonElements;
}

export const setTabIndex = (player: Paella, layoutStructure: any, buttons: HTMLElement[]) => {
    let { tabIndexStart } = layoutStructure.plugin;
    buttons.sort((b1,b2) => {
        const b1Left = b1.getBoundingClientRect().left;
        const b2Left = b2.getBoundingClientRect().left;
        return b1Left - b2Left;
    }).forEach(btn => {
        btn.setAttribute("tabindex", "" + (tabIndexStart++));
    })
}

export class Canvas extends DomClass {
   
    constructor(tag: string, player: Paella, parent: HTMLElement | null = null) {
        super(player, { tag, parent });
        this.element.className = "video-canvas";

        (this as any)._userArea = null;

        (this as any)._buttonsArea = createElementWithHtmlText(`
        <div class="button-area">
            <div class="buttons-left"></div>
            <div class="buttons-center"></div>
            <div class="buttons-right"></div>
        </div>
        `, this.element);
    }

    async loadCanvas(player: Paella) {
        throw Error(`loadCanvas() not implemented`);
    }

    get userArea() {
        if (!(this as any)._userArea) {
            (this as any)._userArea = document.createElement('div');
            (this as any)._userArea.className = "user-area";
            this.element.appendChild((this as any)._userArea);
        }
        return (this as any)._userArea;
    }

    get leftButtonsArea() {
        return (this as any)._buttonsArea.querySelector(".buttons-left");
    }

    get centerButtonsArea() {
        return (this as any)._buttonsArea.querySelector(".buttons-center");
    }

    get rightButtonsArea() {
        return (this as any)._buttonsArea.querySelector(".buttons-right");
    }

    clearButtonsArea() {
        (this as any)._buttonsArea.childNodes.forEach((area: any) => {
            area.innerHTML = "";
        });
    }

    showButtons() {
        (this as any)._buttonsArea.style.display = null;
    }

    hideButtons() {
        (this as any)._buttonsArea.style.display = "none";
    }
}

export default class CanvasPlugin extends Plugin {
    get type() { return "canvas"; }

    get canvasType() { return ""; }

    isCompatible(stream: any) {
        if (Array.isArray(stream?.canvas)) {
            return stream.canvas.indexOf(this.canvasType) !== -1;
        }
        else {
            return stream.canvas === this.canvasType;
        }
    }

    getCanvasInstance(videoContainer: HTMLElement) : Canvas {
        throw Error(`${this.name} canvas plugin: getCanvasInstance() not implemented`);
    }
}
