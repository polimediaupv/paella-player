import { chromium } from 'playwright';
const ids = ['audio-and-images','audio-no-frames','audio-only','belmar-16-9-hls','belmar-html','belmar-multiresolution-remote','belmar-multiresolution-single','belmar-nopreview','belmar-single','belmar-trimming','bug-test','dfxp-captions','different-length-master-larger-1','different-length-master-shorter-1','dual-stream-c','dual-stream-f-c','dual-stream-f-t','dual-stream-f-t-c','dual-stream-t','dual-stream-t-c','error-hls-video','error-no-main-audio','error-video','hls-captions','hls-live','hls-multiaudio','hls-multiquality','hls-single','live-tv-apunt','ll-hls','n-stream','no-metadata','portrait','portrait-dual','test-firefox','test-single-stream-main-audio','video-360','webvtt-captions'];
const browser = await chromium.launch();
const results = {};
for (const id of ids) {
    const page = await browser.newPage();
    let err = '';
    page.on('pageerror', e => { if (!err) err = e.message.slice(0, 120); });
    try {
        await page.goto(`http://localhost:8123/?id=${id}`);
        const manifestOk = await page.waitForFunction(() => window.__paella_instances__?.[0]?.stateText === 'MANIFEST', null, { timeout: 20000 }).then(() => true).catch(() => false);
        if (!manifestOk) { results[id] = 'NO-MANIFEST: ' + await page.evaluate(() => window.__paella_instances__?.[0]?.stateText); await page.close(); continue; }
        const btn = page.locator('.preview-container button[aria-label="Play video"]');
        if (await btn.count() === 0) { results[id] = 'NO-PLAY-BTN'; await page.close(); continue; }
        await btn.first().click();
        // wait for LOADED or ERROR
        const final = await page.waitForFunction(() => {
            const s = window.__paella_instances__?.[0]?.stateText;
            return (s === 'LOADED' || s === 'ERROR') ? s : false;
        }, null, { timeout: 30000 }).then(() => true).catch(() => null);
        const state = final ? await page.evaluate(() => window.__paella_instances__[0].stateText) : 'TIMEOUT:' + await page.evaluate(() => window.__paella_instances__?.[0]?.stateText);
        results[id] = state === 'ERROR' && err ? 'ERROR: ' + err : state;
    } catch (e) { results[id] = 'EXC: ' + e.message.slice(0, 100); }
    await page.close();
}
for (const id of ids) console.log(`${results[id]?.startsWith?.('LOADED') ? 'OK ' : 'XX '}${id}: ${results[id]}`);
await browser.close();
