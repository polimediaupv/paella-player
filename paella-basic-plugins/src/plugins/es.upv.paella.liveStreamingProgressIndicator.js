import { ProgressIndicatorPlugin } from "paella-core";
import BasicPluginsModule from "./BasicPluginsModule";

function draw(context, width, height, isHover) {
    const xPos = this._side === 'left' ? this._margin : this._side === 'center' ? width / 2: width - this._margin;
    const circleSize = 8;
    const textMargin = this._side === 'left' ? circleSize + 4 : this._side === 'center' ? 0 : -(circleSize + 4);
    const circleMargin = this._side === 'center' ? -40 : 0;
    context.fillStyle = this._textColor;
    context.font = `11px Arial`;
    context.textAlign = this._side;
    context.fillText("Live stream", xPos + textMargin, height / 2 + 3);

    context.beginPath();
    context.fillStyle = this._circleColor;
    context.arc(xPos + circleMargin, height / 2, circleSize / 2, 0, 2 * Math.PI, false);
    context.fill();
}

export default class LiveStreamingProgressIndicatorPlugin extends ProgressIndicatorPlugin {
    getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.liveStreamingProgressIndicator";
    }

    get minHeight() {
        return 20;
    }

    get minHeightHover() {
        return 20;
    }

    async isEnabled() {
        const e = await super.isEnabled();
        return e && this.player.videoContainer.isLiveStream;
    }

    async load() {
        this._layer = this.config.layer ?? 'foreground';
        this._side = this.config.side ?? 'right';
        this._margin = this.config.margin ?? 50;
        this._textColor = this.config.textColor ?? "white";
        this._circleColor = this.config.circleColor ?? "red";

        if (['foreground','background'].indexOf(this._layer) === -1) {
            throw new Error("Invalid layer set in plugin 'es.upv.paella.liveStreamingPlugin'. Valid values are 'foreground' or 'background'");
        }

        if (['left','center', 'right'].indexOf(this._side) === -1) {
            throw new Error("Invalid side set in plugin 'es.upv.paella.liveStreamingPlugin'. Valid values are 'left', 'center' or 'right'");
        }
    }

    drawForeground(context, width, height, isHover) {
        if (this._layer === 'foreground') {
            draw.apply(this, [context, width, height, isHover]);
        }
    }

    drawBackground(context, width, height, isHover) {
        if (this._layer === 'background') {
            draw.apply(this, [context, width, height, isHover]);
        }
    }
}