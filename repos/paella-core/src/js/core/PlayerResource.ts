import type Paella from "../Paella"

/**
 * PlayerResource is a base class that provides access to the player instance.
 * All classes that need to interact with the player should extend this class.
 */
export default class PlayerResource {

    #player: Paella

    /**
     * Creates a new PlayerResource instance
     */
    constructor(player: Paella) {
        this.#player = player;
    }

    /**
     * Gets the player instance
     */
    get player() : Paella { return this.#player; }
}