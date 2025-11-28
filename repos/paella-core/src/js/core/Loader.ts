

import { createElementWithHtmlText, DomClass } from './dom';
import Paella from '../Paella';

import ProgressIndicatorIcon from '../../icons/progress_indicator';

export default class Loader extends DomClass {
    private _icon: string;
    
    constructor(player: Paella) {
        super(player, { parent: player.containerElement });

        this.element.className = "loader-container";
        this._icon = player.getCustomPluginIcon('@asicupv/paella-core', 'LoaderIcon') || ProgressIndicatorIcon;
    }

    async create() {
        createElementWithHtmlText(`<i>${ this._icon }</i>`, this.element);
    }

    get debug() {
        return false;
    }
}
