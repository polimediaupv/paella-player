
import{ 
    ButtonPlugin, 
    createElementWithHtmlText, 
    Events, 
    bindEvent,
    isVolumeApiAvailable
} from 'paella-core';
import BasicPluginsModule from './BasicPluginsModule';

import {
    volumeHigh as defaultVolumeHighIcon,
    volumeMid as defaultVolumeMidIcon,
    volumeLow as defaultVolumeLowIcon,
    volumeMute as defaultVolumeMuteIcon
 } from '../icons/volume-icons.js';

import "../css/slider.css";

function buildSlider() {
    this.sliderContainer.innerHTML = "";
    const volumeSlider = createElementWithHtmlText(`
        <div class="volume-slider">
            <div class="volume-slider-fill"></div>
            <div class="volume-slider-empty"></div>
        </div>`, this.sliderContainer);
    let mouseDown = false;
    const sliderFill = volumeSlider.getElementsByClassName('volume-slider-fill')[0];
    const sliderEmpty = volumeSlider.getElementsByClassName('volume-slider-empty')[0];
    sliderFill.style.width = "50%";
    sliderEmpty.style.width = "50%";
    this._sliderFill = sliderFill;
    this._sliderEmpty = sliderEmpty;

    const setVolume = async (offsetX) => {
        const offset = 4;
        const { offsetWidth } = volumeSlider;
        let newVolume = offsetX * 100 / offsetWidth;
        if (newVolume < offset) {
            newVolume = 0;
        }
        if (newVolume > 100 - offset) {
            newVolume = 100;
        }
        newVolume /= 100;
        await this.player.videoContainer.setVolume(newVolume);
    }

    volumeSlider.addEventListener("mousedown", async (evt) => {
        mouseDown = true;
        await setVolume(evt.offsetX);
    });

    volumeSlider.addEventListener("mousemove", async (evt) => {
        if (mouseDown) {
            await setVolume(evt.offsetX);                    
        }
    });

    volumeSlider.addEventListener("mouseleave", () => {
        mouseDown = false;
    });

    volumeSlider.addEventListener("mouseup", () => {
        mouseDown = false;
    });

    if (!this.volumeAlwaysVisible) {
        this.sliderContainer.style.display = "none";
    }

    
}


export default class VolumePlugin extends ButtonPlugin {
    getPluginModuleInstance() {
        return BasicPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.volumeButtonPlugin";
    }

    async isEnabled() {
        const e = await super.isEnabled();
        return e && await isVolumeApiAvailable();
    }

    getAriaLabel() {
        return "Volume";
    }

    getDescription() {
        return this.getAriaLabel();
    }

    get className() {
        return "volume-button";
    }

    async updateIcon(vol) {
        const volumeHighIcon = this.player.getCustomPluginIcon(this.name,"volumeHighIcon") || defaultVolumeHighIcon;
        const volumeMidIcon = this.player.getCustomPluginIcon(this.name,"volumeMidIcon") || defaultVolumeMidIcon;
        const volumeLowIcon = this.player.getCustomPluginIcon(this.name,"volumeLowIcon") || defaultVolumeLowIcon;
        const volumeMuteIcon = this.player.getCustomPluginIcon(this.name,"volumeMuteIcon") || defaultVolumeMuteIcon;
        switch (true) {
        case vol===0:
            this.icon = volumeMuteIcon;
            break;
        case vol>0 && vol<=0.3:
            this.icon = volumeLowIcon;
            break;
        case vol>0.3 && vol<=0.6:
            this.icon = volumeMidIcon;
            break;
        case vol>0.6:
            this.icon = volumeHighIcon;
            break;
        default:
            this.icon = volumeHighIcon;
        }

        //if (this._sliderFill) {
        //    this._sliderFill.style.width = `${ vol * 100}px`;
        //}
        //if (vol > 0.95) {
        //    this._sliderFill.classList.add('fill-100');
        //}
        //else {
        //    this._sliderFill.classList.remove('fill-100');
        //}
//
        //if (this._sliderEmpty) {
        //    this._sliderEmpty.style.width = `${ 100 - vol * 100}px`;
        //}
        //if (vol < 0.05) {
        //    this._sliderEmpty.classList.add('empty-100');
        //}
        //else {
        //    this._sliderEmpty.classList.remove('empty-100');
        //}
    }

    get sliderContainer() {
        if (this.config.side === "left") {
            return this.rightArea;
        }
        else {
            return this.leftArea;
        }
    }
    
    async load() {
        this.showContainerOnFocus = this.config.showVolumeOnFocus ?? true;
        this.volumeAlwaysVisible = this.config.volumeAlwaysVisible ?? false;

        this._prevVolume = await this.player.videoContainer.volume();
        //buildSlider.apply(this);

        bindEvent(this.player, Events.VOLUME_CHANGED, ({volume}) => {
            this.updateIcon(volume)
        });
        
        this.updateIcon(this._prevVolume);

        const sliderContainer = document.createElement('span');
        sliderContainer.classList.add("side-container-hidden");
        sliderContainer.innerHTML = `
            <input type="range" class="isu" min="0" max="100" value="50" class="slider" tabindex="${ this.tabIndex + 1}"/>
        `
        this.container.appendChild(sliderContainer);
    }

    showSideContainer() {
        if (!this.volumeAlwaysVisible) {
            //this.sliderContainer.style.display = "inline-block";
        }
    }

    hideSideContainer() {
        if (!this.volumeAlwaysVisible) {
            //this.sliderContainer.style.display = "none";
        }
    }

    async mouseOver(target) {
        if (target === this.container) {
            this.showSideContainer();
        }
    }

    async mouseOut(target) {
        if (target === this.container) {
            this.hideSideContainer();
        }
    }

    async focusIn() {
        if (this.showContainerOnFocus) {
            //this.showSideContainer();
        }
    }

    async focusOut() {
        if (this.showContainerOnFocus) {
            //this.hideSideContainer();
        }
    }

    async action() {
        const currentVolume = await this.player.videoContainer.volume();

        console.log("VolumePlugin.action(): ", currentVolume);

        let newVolume = 0;
        if (currentVolume === 0 && this._prevVolume === 0) {
            newVolume = 1;
        }
        else if (currentVolume === 0 && this._prevVolume > 0) {
            newVolume = this._prevVolume;
        }
        else {
            newVolume = 0;
        }
        await this.player.videoContainer.setVolume(newVolume)
        this._prevVolume = currentVolume;
    }
}
