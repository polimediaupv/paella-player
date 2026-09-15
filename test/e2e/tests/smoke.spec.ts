import { test, expect, Page } from '@playwright/test';

/**
 * Smoke tests for the Paella test player (test/player).
 *
 * The player instance is accessed through window.__paella_instances__[0],
 * which the Paella constructor publishes automatically.
 */

/**
 * Waits for the first player instance to reach the given state
 * (see PlayerStateNames in paella-core).
 */
async function waitForPlayerState(page: Page, stateName: string, videoId?: string): Promise<void> {
    await page.waitForFunction(
        ({ stateName, videoId }) => {
            const player = window.__paella_instances__?.[0];
            if (!player) return false;
            if (player.stateText !== stateName) return false;
            return !videoId || player.videoId === videoId;
        },
        { stateName, videoId },
        { timeout: 30_000 },
    );
}

/**
 * Loads the player UI by pressing the preview "Play video" button,
 * which is what a real user does (loadManifest() stops in the MANIFEST
 * state until play() calls loadPlayer()).
 */
async function pressPreviewPlay(page: Page): Promise<void> {
    await page.locator('.preview-container button[aria-label="Play video"]').click();
    await waitForPlayerState(page, 'LOADED');
}

async function openPlayer(page: Page, videoId: string): Promise<void> {
    await page.goto(`/?id=${videoId}`);
    // The manifest is loaded and the preview (with play button) is shown
    await waitForPlayerState(page, 'MANIFEST', videoId);
}

test.describe('Paella smoke', () => {

    test('player loads and shows the player container', async ({ page }) => {
        await openPlayer(page, 'belmar-single');

        await expect(page.locator('#playerContainer')).toHaveClass(/player-container/);

        // The preview play button is shown before the player UI is loaded
        await expect(page.locator('.preview-container')).toBeVisible();
    });

    test('play and pause fire the corresponding events', async ({ page }) => {
        await openPlayer(page, 'belmar-single');

        // Register listeners for the PLAY and PAUSE events on the instance
        await page.evaluate(() => {
            const player = window.__paella_instances__[0];
            (window as any).__firedEvents = [];
            player.bindEvent(player.Events.PLAY, () => (window as any).__firedEvents.push('play'));
            player.bindEvent(player.Events.PAUSE, () => (window as any).__firedEvents.push('pause'));
        });

        // Pressing the preview play button loads the player UI and plays
        await pressPreviewPlay(page);
        await page.waitForFunction(() => window.__firedEvents?.includes('play'));

        await page.evaluate(() => window.__paella_instances__[0].pause());
        await page.waitForFunction(() => window.__firedEvents?.includes('pause'));
    });

    test('changing the video via ?id= loads the new manifest', async ({ page }) => {
        await openPlayer(page, 'belmar-single');

        await page.goto('/?id=audio-only');
        await waitForPlayerState(page, 'MANIFEST', 'audio-only');
    });

    test('a non existent video id results in an error state', async ({ page }) => {
        await page.goto('/?id=does-not-exist');
        await waitForPlayerState(page, 'ERROR');

        // The error message is shown inside the container
        await expect(page.locator('.error-container')).toBeVisible();
    });

});
