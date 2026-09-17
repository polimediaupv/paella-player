import { test, expect, Page } from '@playwright/test';
import { openPlayer, waitForPlayerState } from './helpers';

/**
 * Error tests: the player must fail for these video ids.
 *
 * Both manifests are structurally valid (they reach the MANIFEST state and
 * show the preview with the play button), so the failure is triggered when
 * the user presses play and the player interface is loaded (loadPlayer):
 *
 *  - error-hls-video: the configured HLS stream (.m3u8) is not available
 *    (the server returns a 404), so hls.js raises a fatal
 *    MANIFEST_LOAD_ERROR and the video format plugin rejects the load.
 *  - error-no-main-audio: the manifest has no stream flagged as the main
 *    audio (no `role: "mainAudio"` and no stream matching the configured
 *    default audio), so the StreamProvider cannot identify the audio track.
 *
 * In both cases the player transitions to the ERROR state and renders the
 * error message inside the `.error-container` element.
 *
 * NOTE: the media is served from the remote repositories referenced by the
 * manifests (streaming.upv.es / repository.paellaplayer.upv.es), so these
 * tests require network access.
 */

/**
 * Presses the preview "Play video" button (which calls play() -> loadPlayer())
 * and waits for the player to reach the ERROR state instead of LOADED.
 */
async function pressPreviewPlayExpectingError(page: Page, videoId: string, timeoutMs = 30_000): Promise<void> {
    await page.locator('.preview-container button[aria-label="Play video"]').click();
    await waitForPlayerState(page, 'ERROR', videoId, timeoutMs);
}

test.describe('Paella player errors', () => {

    test('error-hls-video fails because the HLS video is not available (404)', async ({ page }) => {
        // The manifest loads fine and the preview is shown
        await openPlayer(page, 'error-hls-video');

        // Loading the player fails when the HLS stream cannot be fetched
        await pressPreviewPlayExpectingError(page, 'error-hls-video');

        // The error message reported by the HLS video format plugin is shown
        await expect(page.locator('.error-container')).toBeVisible();
        await expect(page.locator('.error-container p')).toContainText('The video is not available');
    });

    test('error-no-main-audio fails because the manifest has no main audio stream', async ({ page }) => {
        // The manifest loads fine and the preview is shown
        await openPlayer(page, 'error-no-main-audio');

        // Loading the player fails because the audio stream cannot be resolved
        await pressPreviewPlayExpectingError(page, 'error-no-main-audio');

        // The error message reported by the StreamProvider is shown
        await expect(page.locator('.error-container')).toBeVisible();
        await expect(page.locator('.error-container p')).toContainText('audio track could not be identified');
    });

});
