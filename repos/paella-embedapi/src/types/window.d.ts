import type { EmbedPlayer, PellaAuthCallback } from "../EmbedPlayer";
import type { YTEmbedPlayer } from "../YTEmbedPlayer";
import type { VideoIdToUrlCallback } from "../EmbedPlayer";

declare global {  
  interface Window {
    // Paella Embed API
    PaellaEmbedApi: {
      Player: typeof EmbedPlayer
    }
    paellaVideoIdToUrl?: VideoIdToUrlCallback;
    onPaellaAuthRequired?: PellaAuthCallback;

    // YouTube IFrame API Paella Compatibility Layer
    YT: {      
      Player: typeof YTEmbedPlayer
    },
    onYouTubeIframeAPIReady?: () => void;
  }
}


export {};