
import PlayerResource from './PlayerResource';

export function createElement({tag='div',attributes={},children="",innerText="",parent=null}) {
    const result = document.createElement(tag);
    result.innerText = innerText;
    for (let key in attributes) {
        result.setAttribute(key,attributes[key]);
    }
    result.innerHTML = children;
    if (parent) {
        parent.appendChild(result);
    }
    return result;
}

export function createElementWithHtmlText(htmlText,parent = null) {
    const tmpElem = document.createElement('div');
    tmpElem.innerHTML = htmlText;
    const result = tmpElem.children[0];
    if (parent) {
        parent.appendChild(result);
    }
    return result;
}

export class DomClass extends PlayerResource {
    #element = null

    constructor(player, {tag='div',attributes=[],children="",parent=null}) {
        super(player);
        this.#element = createElement({tag,attributes,children,parent});

        // Add a getter as a shortcut to the DOM element tag
        Object.defineProperty(this, tag, {
            get: () => this.#element
        });
    }

    get element() {
        return this.#element;
    }

    get parent() {
        return this.#element.parentElement;
    }
    
    hide() {
        this.element.style.display = "none";
    }
    
    show(showMode = "block") {
        this.element.style.display = null;
    }
    
    get isVisible() {
        const style = window.getComputedStyle(this.element);
        return  style.display !== "none" &&
                style.display !== "";
    }

    setAttribute(name,value) {
        this.#element.setAttribute(name,value);
    }

    removeFromParent() {
        this.#element.parentElement?.removeChild(this.#element);
    }
    
    setParent(parent) {
        this.removeFromParent();
        parent.appendChild(this.#element);
    }
}
