
import { timeToSeconds } from '../core/utils';
import Captions from './Captions';

const TIMESTAMP = "(?:\\d*:){1,2}\\d*(?:\\.\\d+)?";
const CUE_TIMING = `(${TIMESTAMP})\\s*\\-\\->\\s*(${TIMESTAMP})`;

const re = {
    cueTiming: new RegExp(CUE_TIMING)
};

const parseCue = (captions: Captions, line: string, i: number, lines: string[]) => {
    const result = re.cueTiming.exec(line);
    if (result) {
        const label = lines[i - 1];
        const cap = [];
        for (let j = 1; i+j<lines.length && lines[i+j] !== ''; ++j) {
            cap.push(lines[i+j]);
        }
        captions.addCue({
            label: label,
            start: timeToSeconds(result[1]) ?? 0,
            end: timeToSeconds(result[2]) ?? 0,
            captions: cap
        });
    }
}

export function parseWebVTT(text: string) : Captions {
    const captions = new Captions();
    
    if (text !== "") {
        text = text.replace(/\r\n/gm,"\n");
        text = text.replace(/\r/gm,"\n");

        text.split(/\n/).forEach((line,i,lines) => {
            parseCue(captions,line,i,lines);
        })
    }

    return captions;
}

export default class WebVTTParser {
    private _text: string;
    private _captions: Captions;
    
    constructor(text = "") {
        this._text = text;
        this._captions = parseWebVTT(text);
    }

    get text() {
        return this._text;
    }

    set text(text) {
        this._text = text;
        this._captions = parseWebVTT(text);
    }

    get captions() {
        return this._captions;
    }
}

