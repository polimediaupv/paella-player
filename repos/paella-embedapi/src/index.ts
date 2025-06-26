import { EmbedPlayer as PaellaPlayer } from './EmbedPlayer';
import { YTEmbedPlayer as Player } from './YTEmbedPlayer';

export * from './EmbedPlayer';
export * from './YTEmbedPlayer';
export * from './EmbedEvents';

// Paella Embed API
window.PaellaEmbedApi = {
    Player: PaellaPlayer
};


// YouTube IFrame API Paella Compatibility Layer
window.YT = {
    Player,
}

window.addEventListener("load", (_event: Event) => {
    if (window.onYouTubeIframeAPIReady !== undefined) {
        window.onYouTubeIframeAPIReady();
    }
});
