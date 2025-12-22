import Captions from "./Captions";
import { timeToMilliseconds } from "../core/utils";
import Paella from "../Paella";

export function parseDFXP(player: Paella, text: string) : {[lang: string]: Captions} {
    const captions: {[lang: string]: Captions} = {};


    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');

    Array.from(doc.getElementsByTagName('div')).forEach(div => {
        const lang = div.getAttribute('xml:lang') || "unknonw";
        captions[lang] = captions[lang] || new Captions(player.translate(lang), lang);
        
        Array.from(div.getElementsByTagName('p')).forEach(p => {
            const begin = timeToMilliseconds(p.getAttribute('begin') || '0s') ?? 0;
            captions[lang].addCue({
                label: `caption_${p.getAttribute('xml:id') || begin}`,
                start: begin / 1000,
                end: (timeToMilliseconds(p.getAttribute('end') || '0s') ?? 0) / 1000,
                captions: [p.innerHTML]
            });
        })
    })
    

    return captions;
}

export default class DFXPParser {
    private player: Paella;
    private _text: string;
    private _captions: {[lang: string]: Captions};

    constructor(player: Paella, text = "") {
        this.player = player;
        this._text = text;
        this._captions = parseDFXP(this.player, text);
    }

    get text() {
        return this._text;
    }

    set text(text) {
        this._text = text;
        this._captions = parseDFXP(this.player, text);
    }

    get captions() {
        return this._captions;
    }
}
