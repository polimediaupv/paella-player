
export default class PlayerResource {

    #player = null

    constructor(player) {
        this.#player = player;
    }

    get player() { return this.#player; }
}