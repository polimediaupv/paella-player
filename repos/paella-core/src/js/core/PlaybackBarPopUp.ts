import { translate } from './Localization';
import type PlaybackBar from './PlaybackBar';

const buildSectionContainer = (parent: HTMLElement) : HTMLElement => {
    const section = document.createElement('section') as HTMLElement;
    section.classList.add('pop-up');


    // TODO: Title bar, pop navigator button
    section.innerHTML = `
        <header class="pop-up-title">
            <button class="action-back" aria-label="${translate('Back')}">
                <svg width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M15 6l-6 6l6 6" />
                </svg>
            </button>
            <h2>title</h2>
        </header>
        <div class="pop-up-content">
        </div>
    `;
    parent.appendChild(section);

    (section as any).setTitle = (title: string) => {
        section.querySelector('header.pop-up-title h2')!.textContent = title;
    };

    (section as any).popButton = () => section.querySelector('header.pop-up-title button');

    (section as any).onPopClicked = (callback: () => void) => {
        if ((section as any)._clickCallback) {
            (section as any).popButton().removeEventListener('click', (section as any)._clickCallback);
        }
        (section as any)._clickCallback = callback;
        (section as any).popButton().addEventListener('click', callback);
    };

    (section as any).hidePopButton = () => (section as any).popButton().style.display = 'none';

    (section as any).showPopButton = () => (section as any).popButton().style.display = '';

    (section as any).setContent = (content: string) => {
        (section as any).querySelector('div.pop-up-content').innerHTML = '';
        (section as any).querySelector('div.pop-up-content').appendChild(content);
    };

    return section;
}

let g_popUpId = 0;
function getPopUpId() {
    return ++g_popUpId;
}

export default class PlaybackBarPopUp {
    #playbackBar;
    #element;
    #content: HTMLElement[] = [];
    #title = "";
    #triggerElement: HTMLElement | null = null;

    constructor(playbackBar: PlaybackBar) {
        this.#playbackBar = playbackBar;
        this.#element = document.createElement('div');
        this.#element.className = 'pop-up-wrapper';
        playbackBar.element.prepend(this.#element);
        this.#element.classList.add('hidden');
        this.#element.addEventListener('click', evt => evt.stopPropagation());
        this.#playbackBar.element.addEventListener('click', (evt) => {
            evt.stopPropagation();
            this.hide();
        });
    }

    get title() {
        return this.#title;
    }

    set title(title) {
        this.#title = title;
        
    }

    get currentContent() : HTMLElement | null {
        return this.#content.length && this.#content[this.#content.length - 1] || null;
    }

    get currentContentId() {
        return (this.currentContent as any)?.dataContentId ?? -1;
    }

    show({ content, title = "", parent = null, attachLeft = false, attachRight = false, triggerElement } : {
        content: HTMLElement
        title: string
        parent: HTMLElement | null
        attachLeft: boolean
        attachRight: boolean
        triggerElement?: HTMLElement    // This is the button that triggered the pop-up
    }) {
        if (!content) {
            throw new Error('PlaybackBarPopUp.show(): No content provided.');
        }

        content.setAttribute("data-pop-up-content-id", "" + getPopUpId());
        (content as any).dataContentId = content.getAttribute("data-pop-up-content-id");
        const currentContent: HTMLElement | null = this.#content.length && this.#content[this.#content.length - 1] || null;
        const parentId = parent && parent.getAttribute("data-pop-up-content-id");

        if (currentContent && currentContent?.getAttribute("data-pop-up-content-id") !== parentId) {
            // Clear content
            this.#element.innerHTML = "";
            this.#content = [];
            this.#triggerElement?.removeAttribute("aria-expanded");
            this.#triggerElement?.classList.remove("active-popup-button");
            this.#triggerElement = null;
        }
        else if (currentContent) {
            (currentContent as any).container.classList.add('out');
        }
        
        this.#content.push(content);

        this.#playbackBar.element.classList.add('pop-up-active');
        this.#element.classList.remove('hidden');

        const container = buildSectionContainer(this.#element);
        (container as any).setTitle(title);
        (content as any).container = container;

        if (attachLeft === true) {
            this.#element.classList.add('left');
        }
        else {
            this.#element.classList.remove('left');
        }

        if (attachRight === true) {
            this.#element.classList.add('right');
        }
        else {
            this.#element.classList.remove('right');
        }
        (container as any).setContent(content);
        if (this.#content.length > 1) {
            (container as any).onPopClicked(() => {
                this.#content.pop();
                (this.#content[this.#content.length - 1] as any)?.container.classList.remove('out');
                this.#element.removeChild(container);
            });
        }
        else {
            (container as any).hidePopButton();
        }
        
        this.title = title;
        
        if (!this.#triggerElement) {
            this.#triggerElement = triggerElement || null;
            this.#triggerElement?.setAttribute("aria-expanded", "true");
            this.#triggerElement?.classList.add("active-popup-button");
        }

        return (content as any).dataContentId;
    }

    pop() {
        if (this.#element.querySelectorAll(".pop-up").length === 1) {
            this.hide();
            return false;
        }

        const clickEvent = new Event('click');
        const backButton = this.#element.querySelector('.pop-up:not(.out) .action-back');
        (backButton as any).dispatchEvent(clickEvent);
        return true;
    }
    
    hide() {
        this.#playbackBar.element.classList.remove('pop-up-active');
        this.#element.classList.add('hidden');
        this.#triggerElement?.removeAttribute("aria-expanded");
        this.#triggerElement?.classList.remove("active-popup-button");
        this.#triggerElement = null;
    }

    get isHidden() {
        return this.#element.classList.contains('hidden');
    }
}
