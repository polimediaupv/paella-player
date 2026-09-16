import { test, expect } from '@playwright/test';
import { openPlayer, pressPreviewPlay, waitForPlayerState } from './helpers';

/**
 * Smoke tests for the Paella test player (test/player).
 */

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
        await page.waitForFunction(() => (window as any).__firedEvents?.includes('play'));

        await page.evaluate(() => window.__paella_instances__[0].pause());
        await page.waitForFunction(() => (window as any).__firedEvents?.includes('pause'));
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
