import { CanvasPlugin, Canvas, createElementWithHtmlText } from 'paella-core';
import ZoomPluginsModule from './ZoomPluginsModule';

import "../styles/zoom.css";


function setZoom(container, playerElement, newZoom) {
    const containerSize = {
        w: container.offsetWidth,
        h: container.offsetHeight
    };
    const containerCenter = {
        left: containerSize.w / 2,
        top: containerSize.h / 2 
    }
    
    playerElement.style.width = `${newZoom * 100}%`;
    playerElement.style.height = `${newZoom * 100}%`;

    const playerSize = {
        left: playerElement.offsetLeft,
        top: playerElement.offsetTop,
        w: playerElement.offsetWidth,
        h: playerElement.offsetHeight
    };
    const playerCenter = {
        left: playerSize.w / 2,
        top: playerSize.h / 2
    };
    const offset = {
        left: playerCenter.left - containerCenter.left,
        top: playerCenter.top - containerCenter.top
    };
    
    if (newZoom == 1) {
        playerElement.style.left = `0px`;
        playerElement.style.top = `0px`;
        offset.left = containerCenter.left;
        offset.top = containerCenter.top;
    }
    else {
        playerElement.style.left = `-${offset.left}px`;
        playerElement.style.top = `-${offset.top}px`;
    }

    return offset;
}

function movePlayer(player, currentPosition, offset) {
    const newPosition = {
        left: currentPosition.left + offset.left,
        top: currentPosition.top + offset.top
    }
    const parent = player.parentElement;
    
    player.style.top = `-${newPosition.top}px`;

    const top = (player.offsetHeight + player.offsetTop) - parent.offsetHeight;
    if (top<0) {
        newPosition.top = currentPosition.top;
    }

    player.style.left = `-${newPosition.left}px`;
    const left = (player.offsetWidth + player.offsetLeft) - parent.offsetWidth;
    if (left<0) {
        newPosition.left = currentPosition.left;
    }

    return newPosition;
}

export class ZoomCanvas extends Canvas {
    constructor(player, videoContainer, config) {
        super('div', player, videoContainer);
        this.config = config;
        this._maxZoom = this.config.maxZoom || 4;
        this._showButtons = this.config.showButtons!==undefined ? this.config.showButtons : true;
    }

    async loadCanvas(player) {
        this.currentZoom = 1;
        this._videoPlayer = player;

        player.element.style.width = "100%";
        player.element.style.height = "100%";
        player.element.style.position = "absolute";
        player.element.style.top = "0";
        player.element.style.left = "0";

        this.element.style.overflow = "hidden";
        this.element.style.position = "relative";

        const zoomHandle = evt => {
            evt.stopPropagation();
            if (!evt.altKey) {
                this.showAltKeyMessage();
                return;
            }
            this.hideAltKeyMessage();
            const delta = evt.deltaY !== undefined ? evt.deltaY * 0.1 : evt.detail * 4;
            const newZoom = this.currentZoom + delta * -0.01;
            if (newZoom>1 && newZoom<=this._maxZoom) {
                this.currentZoom = newZoom;
                this._playerCenter = setZoom(this.element, this._videoPlayer.element, this.currentZoom);
            }
            else if (newZoom <= 1) {
                this.currentZoom = 1;
                this._playerCenter = setZoom(this.element, this._videoPlayer.element, this.currentZoom);
            }
            evt.preventDefault();
        };
        
        this.element.addEventListener("DOMMouseScroll", zoomHandle);
        this.element.addEventListener("mousewheel", zoomHandle);

        let drag = false;
        let preventClick = false;
        let dragPosition = null;
        const beginDrag = () => drag = true;
        const endDrag = () => drag = false;
        const cancelClick = evt => {
            if (preventClick) {
                evt.stopPropagation();
                evt.preventDefault();
            }
        }
        this.element.addEventListener("mousedown", beginDrag);
        this.element.addEventListener("mouseleave", endDrag);
        this.element.addEventListener("mouseup", endDrag);
        this.element.addEventListener("click", cancelClick);
        this.element.addEventListener("mouseup", cancelClick);

        this.element.addEventListener("mousemove", evt => {
            if (drag && this._playerCenter) {
                if (dragPosition === null) {
                    dragPosition = { left: evt.clientX, top: evt.clientY };
                }
                preventClick = true;
                const offset = { 
                    left: dragPosition.left - evt.clientX, 
                    top: dragPosition.top - evt.clientY
                };
                if (this.currentZoom == 1) {
                    this._playerCenter = { left: 0, top: 0 };
                }
                else {
                    this._playerCenter = movePlayer(this._videoPlayer.element, this._playerCenter, offset);
                }
                dragPosition = { left: evt.clientX, top: evt.clientY };
            }
            else {
                preventClick = false;
                dragPosition = null;
            }
        });

        // "press alt" message
        const message = this.player.translate("Use Alt+Scroll to zoom");
        this._zoomMessage = createElementWithHtmlText(`
            <div class="zoom-message">${message}</div>
        `, this.element);
        this._zoomMessage.style.display = "none";
    }

    showAltKeyMessage() {
        if (this._hideTimeout) {
            clearTimeout(this._hideTimeout);
        }
        this._zoomMessage.style.display = "";
        this._hideTimeout = setTimeout(() => {
            this.hideAltKeyMessage();
        }, 2000);
    }

    hideAltKeyMessage() {
        this._zoomMessage.style.display = "none";
        this._hideTimeout = null;
    }

    zoomIn() {
        const zoom = this.currentZoom * 1.1;
        if (zoom<this._maxZoom) {
            this.currentZoom = zoom;
            this._playerCenter = setZoom(this.element, this._videoPlayer.element, this.currentZoom);
        }
    }

    zoomOut() {
        const zoom = this.currentZoom * 0.9;
        if (zoom>=1) {
            this.currentZoom = zoom;
            this._playerCenter = setZoom(this.element, this._videoPlayer.element, this.currentZoom);
        }
    }
}

export default class ZoomCanvasPlugin extends CanvasPlugin {
    getPluginModuleInstance() {
        return ZoomPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.zoomPlugin";
    }

    get canvasType() { return "video"; }

    isCompatible(stream) {
        if (!Array.isArray(stream.canvas) || stream.canvas.length === 0) {
            // By default, the default canvas is HTML video canvas
            return true;
        }
        
        return super.isCompatible(stream);
    }

    getCanvasInstance(videoContainer) {
        return new ZoomCanvas(this.player, videoContainer, this.config);
    }
}
