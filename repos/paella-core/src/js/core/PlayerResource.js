/**
 * PlayerResource is a base class that provides access to the player instance.
 * All classes that need to interact with the player should extend this class.
 * @class PlayerResource
 */
export default class PlayerResource {

    #player = null

    /**
     * Creates a new PlayerResource instance
     * @param {Paella} player - The player instance
     */
    constructor(player) {
        this.#player = player;
    }

    /**
     * Gets the player instance
     * @returns {Paella} The player instance
     */
    get player() { return this.#player; }
}