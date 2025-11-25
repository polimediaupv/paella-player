
export default class VideoQualityItem {
    private _label: string;
    private _shortLabel: string
    private _index: number;
    private _src: string;
    private _res: { w: number, h: number };
    private _bitrate: number;
    private _isAuto: boolean;

    constructor({
        label,
        shortLabel,
        isAuto = false,
        index = 0,
        src = "",
        width = -1,
        height = -1,
        bitrate = -1
    } : {
        label: string,
        shortLabel: string,
        isAuto?: boolean,
        index?: number,
        src?: string,
        width?: number,
        height?: number,
        bitrate?: number
    }) {
        this._label = label;
        this._shortLabel = shortLabel;
        this._index = index;
        this._src = src;
        this._res = {
            w: width,
            h: height
        }
        this._bitrate = bitrate;
        this._isAuto = isAuto;
    }

    get label() { return this._label; }
    get shortLabel() { return this._shortLabel; }
    get index() { return this._index; }
    get src() { return this._src; }
    get res() { return this._res; }
    get bitrate() { return this._bitrate; }
    get isAuto() { return this._isAuto; }

    get quality() {
        if (this._res.w !== -1 && this._res.h !== -1) {
            return this._res.w * this._res.h;
        }
        else {
            return this._bitrate;
        }
    }

    compare(other: VideoQualityItem) {
        return other.quality - this.quality;
    }
}
