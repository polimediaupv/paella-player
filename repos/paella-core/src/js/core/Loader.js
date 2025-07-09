

import { createElementWithHtmlText, DomClass } from './dom';

import ProgressIndicatorIcon from '../../icons/progress_indicator';

export default class Loader extends DomClass {
    constructor(player) {
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
