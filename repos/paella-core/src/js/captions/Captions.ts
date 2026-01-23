
import { timeToSeconds, secondsToTime } from '../core/utils';

export type CaptionCue = {
    label: string;
    start: number;
    startString?: string;
    end: number;
    endString?: string;
    captions: string[];
}

export default class Captions {
    private _cues: CaptionCue[];
    private _label: string;
    private _lang: string;

    get cues() {
        return this._cues;
    }

    get label() {
        return this._label;
    }

    get language() {
        return this._lang;
    }

    set label(l) {
        this._label = l;
    }

    set language(l) {
        this._lang = l;
    }

    constructor(label = "", lang = "") {
        this._cues = [];
        this._label = label;
        this._lang = lang;
    }

    addCue({
        label = "",
        start,
        end,
        captions
    } : {
        label: string,
        start: number,
        end: number,
        captions: string | string[]
    } ) {
        const cue: CaptionCue = {
            label,
            start: 0,
            end: 0,
            captions: []
        };

        if (typeof(captions) === "string") {
            cue.captions = [captions];
        }
        else if (Array.isArray(captions)) {
            cue.captions = captions;
        }
        else {
            throw Error("Invalid cue caption format: must be an array of strings or a string");
        }

        if (typeof(start) === "string") {
            cue.start = timeToSeconds(start) || 0;
            cue.startString = start;
        }
        else if (typeof(start) === "number") {
            cue.start = start;
            cue.startString = secondsToTime(start);
        }
        else {
            throw Error("Invalid cue timestamp format: must be a valid time string or a number of seconds");
        }

        if (typeof(end) === "string") {
            cue.end = timeToSeconds(end) || 0;
            cue.endString = end;
        }
        else if (typeof(end) === "number") {
            cue.end = end;
            cue.endString = secondsToTime(end);
        }
        else {
            throw Error("Invalid cue timestamp format: must be a valid time string or a number of seconds");
        }

        this._cues.push(cue);
        return cue;
    }

    getCue(instant: number | string) : CaptionCue | null {
        if (typeof(instant) === "string") {
            instant = timeToSeconds(instant) || 0;
        }
        else if (typeof(instant) !== "number") {
            throw Error("Invalid time instant format getting cue");
        }

        let result: CaptionCue | null = null;
        this._cues.some(cue => {
            if (instant>=cue.start && instant<=cue.end) {
                result = cue;
                return true;
            }
        });
        return result;
    }
}
