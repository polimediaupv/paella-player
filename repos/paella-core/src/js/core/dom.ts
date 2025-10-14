import PlayerResource from './PlayerResource';
import type Player from '../Paella'

type CreateElementAttributes = {
    tag: string
    attributes: Record<string, string>
    children: string
    parent: HTMLElement | null
    innerText?: string | null
}

/**
 * Creates a DOM element with the specified configuration
 * @param {object} options - Element creation options
 * @param {string} [options.tag='div'] - HTML tag name
 * @param {Record<string, string>} [options.attributes={}] - Element attributes
 * @param {string} [options.children=""] - Inner HTML content
 * @param {string} [options.innerText=""] - Inner text content
 * @param {HTMLElement|null} [options.parent=null] - Parent element to append to
 * @returns {HTMLElement} The created DOM element
 */
export function createElement({ tag='div', attributes={}, children="", innerText="", parent=null } : CreateElementAttributes): HTMLElement {
    const result = document.createElement(tag);
    if (innerText !== null) {
        result.innerText = innerText;
    }

    for (let key in attributes) {
        result.setAttribute(key,attributes[key]);
    }
    result.innerHTML = children;
    if (parent) {
        parent.appendChild(result);
    }
    return result;
}

/**
 * Creates a DOM element from HTML text string
 * @param {string} htmlText - HTML string to parse
 * @param {HTMLElement|null} [parent=null] - Parent element to append to
 * @returns {HTMLElement} The created DOM element
 */
export function createElementWithHtmlText(htmlText: string, parent: HTMLElement | null = null): HTMLElement {
    const tmpElem = document.createElement('div');
    tmpElem.innerHTML = htmlText;
    const result = tmpElem.children[0] as HTMLElement;
    if (parent) {
        parent.appendChild(result);
    }
    return result;
}

/**
 * DomClass provides a base class for creating DOM-based components within the player.
 * It extends PlayerResource and manages a single DOM element with common operations.
 * @extends PlayerResource
 */
export class DomClass extends PlayerResource {
    #element: HTMLElement

    /**
     * Creates a new DomClass instance with a DOM element
     * @param {Paella} player - The player instance
     * @param {object} options - DOM element creation options
     * @param {string} [options.tag='div'] - HTML tag name for the element
     * @param {Record<string, string>} [options.attributes=[]] - Element attributes
     * @param {string} [options.children=""] - Inner HTML content
     * @param {HTMLElement|null} [options.parent=null] - Parent element to append to
     */
    constructor(player: Player, { tag='div', attributes={}, children="", parent=null } : CreateElementAttributes) {
        super(player);
        this.#element = createElement({ tag, attributes, children, parent });

        // Add a getter as a shortcut to the DOM element tag
        Object.defineProperty(this, tag, {
            get: () => this.#element
        });
    }

    /**
     * Gets the DOM element associated with this instance
     * @returns {HTMLElement} The DOM element
     */
    get element() {
        return this.#element;
    }

    /**
     * Gets the parent element of this DOM element
     * @returns {HTMLElement|null} The parent element, or null if no parent
     */
    get parent() {
        return this.#element.parentElement;
    }
    
    /**
     * Hides the DOM element by setting display style to "none"
     */
    hide() {
        this.element.style.display = "none";
    }
    
    /**
     * Shows the DOM element by removing the display style restriction
     * @param {string} [showMode="block"] - The display mode to use when showing
     */
    show(showMode = "block") {
        this.element.style.display = "";
    }
    
    /**
     * Gets whether the element is currently visible
     * @returns {boolean} True if the element is visible, false otherwise
     */
    get isVisible() {
        const style = window.getComputedStyle(this.element);
        return  style.display !== "none" &&
                style.display !== "";
    }

    /**
     * Sets an attribute on the DOM element
     * @param {string} name - The attribute name
     * @param {string} value - The attribute value
     */
    setAttribute(name: string, value: string) {
        this.#element.setAttribute(name,value);
    }

    /**
     * Removes this element from its parent
     */
    removeFromParent() {
        this.#element.parentElement?.removeChild(this.#element);
    }
    
    /**
     * Sets a new parent for this element, removing it from the current parent first
     * @param {HTMLElement} parent - The new parent element
     */
    setParent(parent: HTMLElement) {
        this.removeFromParent();
        parent.appendChild(this.#element);
    }
}
