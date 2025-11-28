

import { createElementWithHtmlText, DomClass } from './dom';
import Paella from '../Paella';
import ErrorIcon from '../../icons/error.js';


export default class ErrorContainer extends DomClass {
    constructor(player: Paella, message: string = "") {
        super(player, { parent: player.containerElement });

        this.element.className = "error-container";
        
        createElementWithHtmlText(`
            <div>
                <i>${ErrorIcon}</i>
                <p>${message}</p>
            </div>`, this.element);
    }
}
