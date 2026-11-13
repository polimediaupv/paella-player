import { test, expect } from '@playwright/test';
import { openPausedPlayer, seekTo } from './helpers';

// Uses the development repository examples; remote media requires network access.

for (const videoId of ['belmar-single', 'no-metadata']) {
    test(`${videoId}: slides are sorted, clickable and track seeking`, async ({ page }) => {
        await openPausedPlayer(page, videoId);
        const toggle = page.getByRole('button', { name: 'Show slides', exact: true });
        await toggle.click();
        const slides = page.locator('.frame-control-plugin-container .image-list > button');
        await expect(slides).toHaveCount(4);
        expect(await slides.locator('img').evaluateAll(images => images.map(img => img.getAttribute('alt'))))
            .toEqual(['frame_0', 'frame_363', 'frame_751', 'frame_854']);
        await slides.nth(1).click();
        await expect.poll(() => page.evaluate(() => window.__paella_instances__[0].videoContainer.currentTime()))
            .toBeCloseTo(363, 0);
        await expect(slides.nth(1)).toHaveClass(/selected/);
        await seekTo(page, 760);
        // Selection is refreshed by TIMEUPDATE; resume briefly to exercise it.
        await page.evaluate(() => window.__paella_instances__[0].play());
        await expect(slides.nth(2)).toHaveClass(/selected/);
        await page.evaluate(() => window.__paella_instances__[0].pause());
        await slides.nth(0).hover();
        await expect(page.locator('.frame-control-preview')).toBeVisible();
        await page.mouse.move(0, 0);
        await expect(page.locator('.frame-control-preview')).toHaveCount(0);
        await slides.nth(0).focus();
        await page.keyboard.press('Escape');
        await expect(page.locator('.frame-control-plugin-container')).toBeHidden();
        await expect(toggle).toBeFocused();
    });
}

test('trimmed video only lists slides inside the playable interval', async ({ page }) => {
    await openPausedPlayer(page, 'belmar-trimming');
    await page.getByRole('button', { name: 'Show slides', exact: true }).click();
    const slides = page.locator('.frame-control-plugin-container .image-list > button');
    await expect(slides).toHaveCount(2);
    expect(await slides.locator('img').evaluateAll(images => images.map(img => img.getAttribute('alt'))))
        .toEqual(['frame_0', 'frame_363']);
    await slides.nth(1).click();
    await expect.poll(() => page.evaluate(() => window.__paella_instances__[0].videoContainer.currentTime()))
        .toBeCloseTo(363, 0);
});

test('video without frameList does not offer slide navigation', async ({ page }) => {
    await openPausedPlayer(page, 'dual-stream-c');
    await expect(page.getByRole('button', { name: 'Show slides', exact: true })).toBeHidden();
});
