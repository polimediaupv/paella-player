
import Captions from './Captions';
import { WebVTTParser as Parser } from 'webvtt-parser';

export function parseWebVTT(text: string, parser: Parser) : Captions {
    const captions = new Captions();
    
    if (text !== "") {
        const result = parser.parse(text);
        result.cues.forEach(cue => {
            captions.addCue({
                label: cue.text,
                start: cue.startTime,
                end: cue.endTime,
                captions: [cue.text]
            })
        });
    }

    return captions;
}

export default class WebVTTParser {
    private _text: string;
    private _captions: Captions;
    private _parser = new Parser();
    
    constructor(text = "") {
        this._text = text;
        this._captions = parseWebVTT(text, this._parser);
    }

    get text() {
        return this._text;
    }

    set text(text) {
        this._text = text;
        this._captions = parseWebVTT(text, this._parser);
    }

    get captions() {
        return this._captions;
    }
}

