import { chromium } from 'playwright';
const ids = ['hls-captions','hls-live','hls-single','bug-test','error-video'];
const browser = await chromium.launch();
for (const id of ids) {
    const page = await browser.newPage();
    let err = '';
    page.on('pageerror', e => { if (!err) err = e.message.slice(0, 150); });
    await page.goto(`http://localhost:8123/?id=${id}`);
    await page.waitForFunction(() => window.__paella_instances__?.[0]?.stateText === 'MANIFEST', null, { timeout: 20000 });
    const btn = page.locator('.preview-container button[aria-label="Play video"]');
    await btn.first().click();
    const final = await page.waitForFunction(() => {
        const s = window.__paella_instances__?.[0]?.stateText;
        return (s === 'LOADED' || s === 'ERROR') ? s : false;
    }, null, { timeout: 40000 }).catch(() => null);
    const state = final ? await page.evaluate(() => window.__paella_instances__[0].stateText) : 'TIMEOUT:' + await page.evaluate(() => window.__paella_instances__?.[0]?.stateText);
    console.log(`${state === 'LOADED' ? 'OK ' : 'XX '}${id}: ${state}${state === 'ERROR' && err ? ' | ' + err : ''}`);
    await page.close();
}
await browser.close();
