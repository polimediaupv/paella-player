import { test, expect, Page } from '@playwright/test';
import { openPausedPlayer, seekTo } from './helpers';

// Uses the development repository examples; remote media requires network access.

async function selectCaptions(page: Page, language: string) {
    await page.getByRole('button', { name: 'Select captions', exact: true }).click();
    await page.locator(`.menu-button-item[data-id="${language}"]`).click();
}

for (const videoId of ['webvtt-captions', 'dfxp-captions']) {
    test(`${videoId}: cues follow seeks, gaps and disabling`, async ({ page }) => {
        await openPausedPlayer(page, videoId);
        await page.evaluate(() => {
            const player = window.__paella_instances__[0];
            (window as any).__captionEvents = [];
            player.bindEvent(player.Events.CAPTIONS_ENABLED, (event: any) =>
                (window as any).__captionEvents.push(event.language));
            player.bindEvent(player.Events.CAPTIONS_DISABLED, () =>
                (window as any).__captionEvents.push('disabled'));
        });
        await selectCaptions(page, 'es');
        const text = page.locator('.captions-canvas .text-container');
        await seekTo(page, 3);
        await expect(text).toContainText('ok voy a hablar de');
        await expect(text).toContainText('psicosis');
        await seekTo(page, 7);
        await expect(text).toHaveText('su trabajo era realmente el inicio de la ciencia');
        await seekTo(page, 6);
        await expect(text).toBeHidden();
        await seekTo(page, 3);
        await expect(text).toBeVisible();
        await selectCaptions(page, '-1');
        await expect(page.locator('.captions-canvas')).toBeHidden();
        expect(await page.evaluate(() => (window as any).__captionEvents)).toEqual(['es', 'disabled']);
    });
}

test('manifest captions can switch between three languages', async ({ page }) => {
    await openPausedPlayer(page, 'belmar-16-9-hls');
    for (const language of ['de', 'en', 'es']) {
        await selectCaptions(page, language);
        await seekTo(page, 2.5);
        // Independent expected text from the example caption resources.
        const expected = { de: 'im Einklang mit', en: 'in line with', es: 'a lo' }[language]!;
        await expect(page.locator('.captions-canvas .text-container')).toContainText(expected);
        expect(await page.evaluate(() => window.__paella_instances__[0].captionsCanvas.currentCaptions.language))
            .toBe(language);
        await seekTo(page, 0.5);
    }
});

test('a video without captions does not offer the captions selector', async ({ page }) => {
    await openPausedPlayer(page, 'belmar-single');
    await expect(page.getByRole('button', { name: 'Select captions', exact: true })).toBeHidden();
    expect(await page.evaluate(() => window.__paella_instances__[0].captionsCanvas.captions.length)).toBe(0);
});

test('embedded HLS subtitles can be selected and disabled', async ({ page }) => {
    await openPausedPlayer(page, 'hls-captions');
    const selector = page.getByRole('button', { name: 'Select captions', exact: true });
    await selector.click();
    const firstTrack = page.locator('.menu-button-item:not([data-id="-1"])').first();
    await expect(firstTrack).toBeVisible();
    await firstTrack.click();
    await expect.poll(() => page.evaluate(() =>
        window.__paella_instances__[0].videoContainer.streamProvider.mainAudioPlayer._hls.subtitleTrack))
        .toBe(0);
    await selector.click();
    await page.locator('.menu-button-item[data-id="-1"]').click();
    await expect.poll(() => page.evaluate(() =>
        window.__paella_instances__[0].videoContainer.streamProvider.mainAudioPlayer._hls.subtitleTrack))
        .toBe(-1);
});
