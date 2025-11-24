import Paella from "../Paella";
import { DomClass, createElementWithHtmlText } from "./dom";

export enum VideoContainerMessagePosition {
    TOP_LEFT = "topLeft",
    TOP_MIDDLE = "topMiddle",
    TOP_RIGHT = "topRight",
    CENTER_LEFT = "centerLeft",
    CENTER_MIDDLE = "centerMiddle",
    CENTER_RIGHT = "centerRight",
    BOTTOM_LEFT = "bottomLeft",
    BOTTOM_MIDDLE = "bottomMiddle",
    BOTTOM_RIGHT = "bottomRight"
}

export type VideoContainerMessagePositionType = VideoContainerMessagePosition;

const createMessageContainer = ({
    icon, text, timeout, cssClass, parent
} : {
    icon?: string | null, text?: string | null, timeout: number, cssClass: string, parent: HTMLElement 
}) => {
    cssClass = cssClass || "";
    timeout = timeout || 1000;
    const result = createElementWithHtmlText(`
        <div class="message-content ${ cssClass }">
            ${ icon ? `<i class="icon">${ icon }</i>` : "" }
            ${ text ? `<p class="text">${ text }</p>` : "" }
        </div>
    `);

    parent.innerHTML = "";
    parent.appendChild(result);
    if ((parent as any).data_timer) {
        clearTimeout((parent as any).data_timer);
        (parent as any).data_timer = null;
    }
    (parent as any).data_timer = setTimeout(() => {
        parent.removeChild(result);
    }, timeout);
    return result;
}

export default class VideoContainerMessage extends DomClass {
    constructor(player: Paella, parent: HTMLElement | null = null) {
        const attributes = { "class": "video-container-message" };
        super(player, { attributes, parent });
            
        (this as any)._topLeftContainer = createElementWithHtmlText(`<div class="container top-left"></div>`, this.element);
        (this as any)._topMiddleContainer = createElementWithHtmlText(`<div class="container top-middle"></div>`, this.element);
        (this as any)._topRightContainer = createElementWithHtmlText(`<div class="container top-right"></div>`, this.element);
        (this as any)._centerLeftContainer = createElementWithHtmlText(`<div class="container center-left"></div>`, this.element);
        (this as any)._centerMiddleContainer = createElementWithHtmlText(`<div class="container center-middle"></div>`, this.element);
        (this as any)._centerRightContainer = createElementWithHtmlText(`<div class="container center-right"></div>`, this.element);
        (this as any)._bottomLeftContainer = createElementWithHtmlText(`<div class="container bottom-left"></div>`, this.element);
        (this as any)._bottomMiddleContainer = createElementWithHtmlText(`<div class="container bottom-middle"></div>`, this.element);
        (this as any)._bottomRightContainer = createElementWithHtmlText(`<div class="container bottom-right"></div>`, this.element);
    }

    show({ icon = null, text = "", timeout = 1000, position = VideoContainerMessagePosition.CENTER_MIDDLE, cssClass = "" }: {
        icon?: string | null;
        text?: string;
        timeout?: number;
        position?: VideoContainerMessagePosition;
        cssClass?: string;
    }) {
        switch (position) {
        case VideoContainerMessagePosition.TOP_LEFT:
            createMessageContainer.apply(this, [{ icon, text, timeout, cssClass, parent: (this as any)._topLeftContainer }]);
            break;
        case VideoContainerMessagePosition.TOP_MIDDLE:
            createMessageContainer.apply(this, [{ icon, text, timeout, cssClass, parent: (this as any)._topMiddleContainer }]);
            break;
        case VideoContainerMessagePosition.TOP_RIGHT:
            createMessageContainer.apply(this, [{ icon, text, timeout, cssClass, parent: (this as any)._topRightContainer }]);
            break;
        case VideoContainerMessagePosition.CENTER_LEFT:
            createMessageContainer.apply(this, [{ icon, text, timeout, cssClass, parent: (this as any)._centerLeftContainer }]);
            break;
        case VideoContainerMessagePosition.CENTER_MIDDLE:
            createMessageContainer.apply(this, [{ icon, text, timeout, cssClass, parent: (this as any)._centerMiddleContainer }]);
            break;
        case VideoContainerMessagePosition.CENTER_RIGHT:
            createMessageContainer.apply(this, [{ icon, text, timeout, cssClass, parent: (this as any)._centerRightContainer }]);
            break;
        case VideoContainerMessagePosition.BOTTOM_LEFT:
            createMessageContainer.apply(this, [{ icon, text, timeout, cssClass, parent: (this as any)._bottomLeftContainer }]);
            break;
        case VideoContainerMessagePosition.BOTTOM_MIDDLE:
            createMessageContainer.apply(this, [{ icon, text, timeout, cssClass, parent: (this as any)._bottomMiddleContainer }]);
            break;
        case VideoContainerMessagePosition.BOTTOM_RIGHT:
            createMessageContainer.apply(this, [{ icon, text, timeout, cssClass, parent: (this as any)._bottomRightContainer }]);
            break;
        }        
    }
}
