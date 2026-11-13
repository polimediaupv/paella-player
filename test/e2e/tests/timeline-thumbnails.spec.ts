import { test, expect, Page } from '@playwright/test';
import { hoverTimeline, openPausedPlayer } from './helpers';

// Uses the development repository examples; remote media requires network access.

/** Build expected crops independently from the rendered image, in row-major order. */
async function expectedCrop(page: Page, videoId: string, index: number) {
    return page.evaluate(async ({ videoId, index }) => {
        const image = new Image();
        image.src = `/repository/${videoId}/timeline.jpg`;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.width / 10;
        canvas.height = image.height / 10;
        canvas.getContext('2d')!.drawImage(image,
            (index % 10) * canvas.width, Math.floor(index / 10) * canvas.height,
            canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL();
    }, { videoId, index });
}

for (const videoId of ['dual-stream-t', 'dual-stream-f-t', 'dual-stream-f-t-c']) {
    test(`${videoId}: timeline preview uses the correct sprite cell`, async ({ page }) => {
        await openPausedPlayer(page, videoId);
        const duration = await page.evaluate(() => window.__paella_instances__[0].videoContainer.duration());
        // Cell centres avoid rounding at boundaries; non-diagonal cells detect transposition.
        for (const index of [0, 17, 62, 99]) {
            const expected = await expectedCrop(page, videoId, index);
            await hoverTimeline(page, duration * (index + 0.5) / 100);
            const image = page.locator('.timeline-preview img');
            await expect(image).toBeVisible();
            await expect.poll(async () => await image.getAttribute('src') === expected,
                { message: `Expected timeline sprite cell ${index}` }).toBe(true);
            await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
                .toBe(true);
        }
    });
}

test('without a sprite the preview falls back to the current slide thumbnail', async ({ page }) => {
    await openPausedPlayer(page, 'belmar-single');
    for (const [time, id] of [[100, 'frame_0'], [400, 'frame_363'], [800, 'frame_751']] as const) {
        const expected = await page.evaluate(id =>
            window.__paella_instances__[0].frameList.frames.find((frame: any) => frame.id === id).thumb, id);
        await hoverTimeline(page, time);
        await expect(page.locator('.timeline-preview img')).toHaveAttribute('src', expected);
        await expect(page.locator('.timeline-preview img')).toBeVisible();
    }
});

// The exact end time used to select a cell beyond the sprite bounds.
test('timeline sprite clamps times to the first and last cells', async ({ page }) => {
    await openPausedPlayer(page, 'dual-stream-f-t');
    const duration = await page.evaluate(() => window.__paella_instances__[0].videoContainer.duration());
    for (const [time, index] of [[-1, 0], [duration, 99], [duration + 1, 99]]) {
        const expected = await expectedCrop(page, 'dual-stream-f-t', index);
        const actual = await page.evaluate(time => window.__paella_instances__[0].getTimelineFrameAtTime(time), time);
        expect(actual === expected, `Expected boundary cell ${index} at ${time}`).toBe(true);
    }
});
