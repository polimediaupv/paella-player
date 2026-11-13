import { test, expect } from '@playwright/test';
import { hoverTimeline, openPausedPlayer, seekTo } from './helpers';

// Uses the development repository examples; remote media requires network access.

for (const videoId of ['dual-stream-c', 'dual-stream-f-c', 'dual-stream-f-t-c']) {
    test(`${videoId}: chapter markers and titles follow the pointer`, async ({ page }) => {
        await openPausedPlayer(page, videoId);
        const markers = page.locator('.markers-container > li');
        await expect(markers).toHaveCount(5);
        const preview = page.locator('.timeline-preview');
        for (const [time, title] of [[37, 'Planteamiento del ejercicio'], [39, 'Resolución del ejercicio'],
            [610, 'Dudas y preguntas'], [744, 'Componente horizontal del campo magnético'],
            [850, 'Ejercicio extra: dos espiras circulares y estudio del solenoide']] as const) {
            await hoverTimeline(page, time);
            await expect(preview).toBeVisible();
            await expect(preview.locator('.timeline-preview-text')).toHaveText(title);
            await expect(page.locator('.markers-container > li.active')).toHaveCount(1);
        }
        await page.mouse.move(0, 0);
        await expect(preview).toBeHidden();
        await expect(page.locator('.markers-container > li.active')).toHaveCount(0);
    });
}

test('progress bar supports pointer seeking and keyboard jumps', async ({ page }) => {
    await openPausedPlayer(page, 'belmar-single');
    await hoverTimeline(page, 200);
    await page.mouse.down();
    await page.mouse.up();
    await expect.poll(() => page.evaluate(() => window.__paella_instances__[0].videoContainer.currentTime()))
        .toBeCloseTo(200, -1);
    await seekTo(page, 100);
    const slider = page.locator('.progress-indicator input');
    await slider.press('ArrowRight');
    await expect.poll(() => page.evaluate(() => window.__paella_instances__[0].videoContainer.currentTime()))
        .toBeCloseTo(110, 0);
    await slider.press('ArrowLeft');
    await expect.poll(() => page.evaluate(() => window.__paella_instances__[0].videoContainer.currentTime()))
        .toBeCloseTo(100, 0);
});
