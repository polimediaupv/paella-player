import { expect, test, type Page } from '@playwright/test';
import { openPausedPlayer } from './helpers';

async function pressVolumeKey(page: Page, key: string, percent: number, icon: 'off' | '1' | '2') {
    await page.keyboard.press(key);
    const message = page.locator('.video-container-message .center-middle .message-content');
    await expect(message.locator('.text')).toHaveText(`${percent}%`);
    await expect(message.locator(`svg.lucide-volume-${icon}`)).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.__paella_instances__[0].volume()))
        .toBeCloseTo(percent / 100, 4);
}

test.beforeEach(async ({ page }) => {
    await openPausedPlayer(page, 'belmar-single');
    await page.evaluate(() => window.__paella_instances__[0].setVolume(0.4));
});

test('M mutes and restores the previous volume', async ({ page }) => {
    await pressVolumeKey(page, 'm', 0, 'off');
    await pressVolumeKey(page, 'm', 40, '1');
});

test('volume arrows use five-point steps and respect zero', async ({ page }) => {
    await page.evaluate(() => window.__paella_instances__[0].setVolume(0));
    await pressVolumeKey(page, 'ArrowDown', 0, 'off');
    await pressVolumeKey(page, 'ArrowUp', 5, '1');
    await pressVolumeKey(page, 'ArrowDown', 0, 'off');
});

test('volume arrows choose the icon from the resulting level', async ({ page }) => {
    await pressVolumeKey(page, 'ArrowUp', 45, '1');
    await pressVolumeKey(page, 'ArrowUp', 50, '2');
    await pressVolumeKey(page, 'ArrowUp', 55, '2');
    await pressVolumeKey(page, 'ArrowDown', 50, '2');
    await pressVolumeKey(page, 'ArrowDown', 45, '1');
});
