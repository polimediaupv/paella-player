
import { DomClass, createElementWithHtmlText } from '../core/dom';
import { loadCaptionsPlugins } from './CaptionsPlugin';
import Events, { bindEvent, triggerEvent } from '../core/Events';
import Captions from './Captions';
import Paella from '../Paella';

type SizeClass = 'size-s' | 'size-m' | 'size-l' | 'size-xl' | 'size-xxl';
type ContainerSizeClass = {
    maxWidth?: number;
    className: SizeClass;
}

const containerSizeClasses: ContainerSizeClass[] = [
    { maxWidth: 400, className: 'size-s' },
    { maxWidth: 600, className: 'size-m' },
    { maxWidth: 900, className: 'size-l' },
    { maxWidth: 1100, className: 'size-xl' },
    { className: 'size-xxl' }
];
const getContainerSizeClass = (size: number) : SizeClass => {
    return containerSizeClasses
        .find(item => item.maxWidth && item.maxWidth>=size || item.maxWidth === undefined)?.className || 'size-xxl';
}

export default class CaptionCanvas extends DomClass {
    private _captionsContainer: HTMLElement;
    private _captions: Captions[];
    private _currentCaptions: Captions | null;

    constructor(player: Paella, parent: HTMLElement | null = null) {
        const attributes = {
            "class": "captions-canvas visible-ui"
        };
        super(player, { tag: 'div', attributes, parent });

        this._captionsContainer = createElementWithHtmlText(`
            <div class="text-container">
            </div>
        `, this.element);
        
        this._captions = [];

        this.hide();

        this._currentCaptions = null;

        const timeChanged = async (evt: any) => {
            const offset = player.videoContainer.isTrimEnabled ? player.videoContainer.trimStart : 0;
            const time = offset + (evt.currentTime || evt.newTime || 0);
            if (this._currentCaptions) {
                const cue = this._currentCaptions.getCue(time);
                this._captionsContainer.innerHTML = "";
                cue && cue.captions.forEach(c => {
                    this._captionsContainer.innerHTML += c;
                    this._captionsContainer.innerHTML += '<br/>';
                });
                cue ? this._captionsContainer.style.display = "" : this._captionsContainer.style.display = 'none';
                this.resize();
            }
        };

        bindEvent(this.player, Events.TIMEUPDATE, timeChanged);
        bindEvent(this.player, Events.SEEK, timeChanged);
        bindEvent(this.player, Events.RESIZE, () => this.resize());
        bindEvent(this.player, Events.SHOW_UI, () => this.element.classList.add('visible-ui'));
        bindEvent(this.player, Events.HIDE_UI, () => this.element.classList.remove('visible-ui'));
    }

    async load() {
        await loadCaptionsPlugins(this.player);
    }

    unload() {        
    }

    resize() {
        const sizeClass = getContainerSizeClass(this._captionsContainer.clientWidth);
        containerSizeClasses.forEach(c => this.element.classList.remove(c.className));
        this.element.classList.add(sizeClass);
    }

    addCaptions(captions: Captions) {
        this._captions.push(captions);
        triggerEvent(this.player, Events.CAPTIONS_CHANGED, { captions: this._captions });
    }

    get captions() {
        return this._captions;
    }

    get currentCaptions() {
        return this._currentCaptions;
    }

    getCaptions({ label, index, lang } : { label?: string, index?: number, lang?: string }) : Captions | undefined {
        if (label === undefined && index === undefined && lang === undefined) {
            throw Error("Could not find captions: you must specify the label, the index or the language");
        }

        if (index !== undefined) {
            return this._captions[index];
        }
        else {
            return this._captions.find(c => {
                if (label !== undefined) {
                    return c.label === label;
                }
                else if (lang !== undefined) {
                    return c.language === lang;
                }
            });
        }
    }

    enableCaptions(searchOptions: { label?: string, index?: number, lang?: string }) {
        const requestedCaptions = this.getCaptions(searchOptions);
        if (requestedCaptions !== this._currentCaptions) {
            this._currentCaptions = requestedCaptions || null;
            if (this.currentCaptions) {
                const { language, label } = this.currentCaptions;
                triggerEvent(this.player, Events.CAPTIONS_ENABLED, { language, label })
            }
        }
        this.show();
    }

    disableCaptions() {
        if (this.currentCaptions) {
            triggerEvent(this.player, Events.CAPTIONS_DISABLED);
        }
        this._currentCaptions = null;
        this.hide();
    }
}
