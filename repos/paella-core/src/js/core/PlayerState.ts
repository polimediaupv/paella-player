
/**
 * Represents the different states that a player can be in during its lifecycle.
 * This enum maintains backward compatibility with existing JavaScript code
 * by using explicit numeric values.
 */
enum PlayerState {
    /** Player is unloaded and not initialized */
    UNLOADED = 0,
    /** Player is currently loading the manifest */
    LOADING_MANIFEST = 1,
    /** Manifest has been loaded successfully */
    MANIFEST = 2,
    /** Player is loading/initializing */
    LOADING_PLAYER = 3,
    /** Player is fully loaded and ready */
    LOADED = 4,
    /** Player is unloading the manifest */
    UNLOADING_MANIFEST = 5,
    /** Player is being unloaded */
    UNLOADING_PLAYER = 6,
    /** An error occurred during any operation */
    ERROR = 7
}

export default PlayerState;

