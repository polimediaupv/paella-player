import { Page } from '@playwright/test';

/**
 * Shared helpers for the Paella e2e suite.
 *
 * The player instance is accessed through window.__paella_instances__[0],
 * which the Paella constructor publishes automatically.
 */

/**
 * Waits for the first player instance to reach the given state
 * (see PlayerStateNames in paella-core: UNLOADED, LOADING_MANIFEST,
 * MANIFEST, LOADING_PLAYER, LOADED, UNLOADING_MANIFEST, UNLOADING_PLAYER,
 * ERROR).
 */
export async function waitForPlayerState(page: Page, stateName: string, videoId?: string, timeoutMs = 60_000): Promise<void> {
    await page.waitForFunction(
        ({ stateName, videoId }) => {
            const player = window.__paella_instances__?.[0];
            if (!player) return false;
            if (player.stateText !== stateName) return false;
            return !videoId || player.videoId === videoId;
        },
        { stateName, videoId },
        { timeout: timeoutMs },
    );
}

/**
 * Loads the player UI by pressing the preview "Play video" button,
 * which is what a real user does (loadManifest() stops in the MANIFEST
 * state until play() calls loadPlayer()). Resolves when the player
 * reaches the LOADED state.
 */
export async function pressPreviewPlay(page: Page, timeoutMs = 60_000): Promise<void> {
    await page.locator('.preview-container button[aria-label="Play video"]').click();
    await waitForPlayerState(page, 'LOADED', undefined, timeoutMs);
}

/**
 * Opens the player for the given video id and waits for the manifest to be
 * loaded (MANIFEST state: the preview with the play button is shown).
 */
export async function openPlayer(page: Page, videoId: string, timeoutMs = 60_000): Promise<void> {
    await page.goto(`/?id=${videoId}`);
    await waitForPlayerState(page, 'MANIFEST', videoId, timeoutMs);
}
