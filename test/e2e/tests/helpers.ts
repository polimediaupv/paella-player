import { expect, Page } from '@playwright/test';

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

/** Pause after startup so seeks and cue assertions do not race playback. */
export async function openPausedPlayer(page: Page, videoId: string): Promise<void> {
    await openPlayer(page, videoId);
    await pressPreviewPlay(page);
    await page.evaluate(() => window.__paella_instances__[0].pause());
}

export async function seekTo(page: Page, time: number): Promise<void> {
    await page.evaluate(time => window.__paella_instances__[0].videoContainer.setCurrentTime(time), time);
    await expect.poll(() => page.evaluate(() => window.__paella_instances__[0].videoContainer.currentTime()))
        .toBeCloseTo(time, 0);
}

/** Trigger the actual pointer interaction at a known time on the progress bar. */
export async function hoverTimeline(page: Page, time: number): Promise<void> {
    await page.mouse.move(5, 5);
    await page.locator('#playerContainer').hover();
    const range = page.locator('.progress-indicator input[type="range"]');
    const duration = await page.evaluate(() => window.__paella_instances__[0].videoContainer.duration());
    const box = await range.boundingBox();
    if (!box) throw new Error('Timeline is not visible');
    await page.mouse.move(box.x + box.width * time / duration, box.y + box.height / 2);
}
