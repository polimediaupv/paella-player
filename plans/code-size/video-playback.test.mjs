import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { staticServer } from './production-tools.mjs';
import { mp4 } from './video-fixture.mjs';
const { chromium } = createRequire(resolve('test/e2e/package.json'))('@playwright/test');

test('HTML/MP4 production playback, source differences, lifecycle and video-package subclasses', { timeout: 45000 }, async () => {
    const base = join(tmpdir(), 'opencode');
    await mkdir(base, { recursive: true });
    const root = await mkdtemp(join(base, 'paella-video-'));
    let server, browser;
    try {
        await cp('repos/paella-core/dist', join(root, 'core'), { recursive: true });
        await cp('repos/paella-video-plugins/dist', join(root, 'video'), { recursive: true });
        await mkdir(join(root, 'media'));
        for (const name of ['low', 'middle', 'high']) await writeFile(join(root, 'media', `${name}.mp4`), mp4);
        server = await staticServer(root, '<script type="importmap">{"imports":{"@asicupv/paella-core":"/core/paella-core.js"}}</script>');
        browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
        const page = await browser.newPage();
        page.setDefaultTimeout(15000);
        await page.goto(server.url);
        const result = await page.evaluate(async baseline => {
            const c = await import('/core/paella-core.js');
            const plugins = await import('/video/paella-video-plugins.js');
            function check(value, message) { if (!value) throw Error(message); }
            function equal(actual, expected, message) {
                check(JSON.stringify(actual) === JSON.stringify(expected), `${message}: ${JSON.stringify(actual)} != ${JSON.stringify(expected)}`);
            }
            function once(element, event) { return new Promise(resolve => element.addEventListener(event, resolve, { once: true })); }
            const parent = document.body.appendChild(document.createElement('div'));
            const logs = [];
            const player = { manifestUrl: `${location.origin}/media`, log: { debug: message => logs.push(message) } };
            const sources = () => [
                { src: 'high.mp4', mimetype: 'video/mp4', res: { w: '64', h: '48' } },
                { src: 'low.mp4', res: { w: 16, h: 12 } },
                { src: 'middle.mp4', mimetype: 'video/mp4', res: { w: 32, h: 24 } }
            ];
            const data = format => ({ content: 'presenter', sources: format === 'mp4' ? { mp4: sources() } : {
                html: [{ src: 'unsupported.mp4', mimetype: 'video/not-supported' }, { src: 'low.mp4', mimetype: 'video/mp4' }]
            } });
            if (!baseline) check(c.Mp4Video.prototype instanceof c.HtmlVideo, 'Mp4Video inherits HtmlVideo');
            const mp4Plugin = new c.Mp4VideoFormatPlugin(player, 'mp4');
            const htmlPlugin = new c.HtmlVideoFormatPlugin(player, 'html');
            equal([mp4Plugin.name, htmlPlugin.name], ['es.upv.paella.mp4VideoFormat', 'es.upv.paella.htmlVideoFormat'], 'format IDs');
            equal([mp4Plugin.streamType, htmlPlugin.streamType], ['mp4', 'html'], 'stream types');
            equal(mp4Plugin.getCompatibleFileExtensions(), ['m4v', 'mp4'], 'MP4 extensions');
            equal(htmlPlugin.getCompatibleFileExtensions(), ['m4v', 'mp4', 'ogg', 'webm', 'ogv'], 'HTML extensions');
            check(await mp4Plugin.isCompatible(data('mp4')), 'MP4 manifest recognized');
            check(await htmlPlugin.isCompatible(data('html')), 'HTML manifest recognized');
            equal(await mp4Plugin.isCompatible({ sources: { mp4: [] } }), undefined, 'empty MP4 compatibility remains unchanged');
            check(!await mp4Plugin.isCompatible({ sources: { mp4: [{ mimetype: 'video/not-supported' }] } }), 'unsupported MP4');
            equal(await htmlPlugin.isCompatible({ sources: { html: [{ mimetype: 'video/not-supported' }] } }), false, 'unsupported HTML');
            equal(mp4Plugin.getManifestData(['a.m4v']).mp4[0], { src: 'a.m4v', mimetype: 'video/mp4', res: { w: 0, h: 0 } }, 'MP4 manifest creation');
            equal(htmlPlugin.getManifestData(['a.mp4', 'b.webm', 'c.ogv']).html.map(source => source.mimetype), ['video/mp4', 'video/webm', 'video/ogg'], 'HTML manifest creation');
            check(c.plugins.some(ref => ref.plugin === c.HtmlVideoFormatPlugin) && c.plugins.some(ref => ref.plugin === c.Mp4VideoFormatPlugin), 'both formats registered');

            let cases = 0;
            for (const format of ['html', 'mp4']) {
                const Class = format === 'html' ? c.HtmlVideo : c.Mp4Video;
                for (const main of [true, false]) {
                    for (const crossOrigin of [undefined, false, 'use-credentials']) {
                        const v = new Class(player, parent, main, { crossOrigin });
                        const media = v.element;
                        check(media.hasAttribute('playsinline') && media.hasAttribute('autoplay') && media.autoplay, 'inline/autoplay attributes');
                        equal(media.getAttribute('crossorigin'), crossOrigin === false ? null : crossOrigin ?? '', 'crossorigin contract');
                        equal(media.muted, !main, 'initial mute');
                        v.initVolume(main ? 0.25 : 0);
                        let ended = 0;
                        v.onVideoEnded(() => { ended++; });
                        const stream = data(format);
                        check(await v.load(stream, { mainAudioPlayer: main ? v : null }), 'load');
                        check(v.ready, 'ready after load');
                        await v.pause();
                        equal(await v.paused(), true, 'pause');
                        equal(await v.volume(), format === 'mp4' && main ? 0.25 : 1, 'format-specific initial volume');
                        equal(media.muted, !main, 'loaded mute');
                        check(Math.abs(await v.duration() - 2) < 0.1, 'duration');
                        equal(await v.getDimensions(), { w: 64, h: 48 }, 'dimensions');
                        equal(await v.getQualities(), [], 'base qualities');
                        equal(v.currentQuality, null, 'base current quality');
                        equal(await v.setQuality(new c.VideoQualityItem({ index: 0, label: 'test', shortLabel: 'test', width: 64, height: 48 })), false, 'base quality selection');
                        if (format === 'mp4') {
                            equal(stream.sources.mp4.map(source => Number(source.res.w)), [16, 32, 64], 'ascending MP4 source order');
                            equal(v._currentQuality, 2, 'highest initial MP4 quality');
                            check(media.currentSrc.endsWith('/high.mp4'), 'MP4 selected src');
                            equal(media.querySelectorAll('source').length, 0, 'MP4 does not append sources');
                        }
                        else {
                            equal([...media.querySelectorAll('source')].map(source => source.type), ['video/not-supported', 'video/mp4'], 'HTML source order/types');
                            check(media.currentSrc.endsWith('/low.mp4'), 'HTML chooses supported source');
                            equal(v._currentQuality, 0, 'HTML initial quality');
                        }
                        const sought = once(media, 'seeked');
                        await v.setCurrentTime(0.4);
                        await sought;
                        check(Math.abs(await v.currentTime() - 0.4) < 0.05 && Math.abs(v.currentTimeSync - 0.4) < 0.05, `seek/current time ${format}/${main}/${crossOrigin}: ${await v.currentTime()}, ${v.currentTimeSync}`);
                        await v.setPlaybackRate(1.25);
                        equal(await v.playbackRate(), 1.25, 'playback rate');
                        await v.setVolume(0);
                        equal(await v.volume(), 0, 'zero volume');
                        check(media.hasAttribute('muted'), 'muted attribute at zero volume');
                        await v.setVolume(0.6);
                        equal(await v.volume(), 0.6, 'nonzero volume');
                        check(!media.hasAttribute('muted'), 'muted attribute removed');
                        const nativePlay = media.play;
                        media.play = () => Promise.reject(new DOMException('Test interruption', 'AbortError'));
                        equal(await v.play(), false, 'interrupted play is handled');
                        media.play = nativePlay;
                        equal(await v.play(), true, 'play');
                        equal(await v.paused(), false, 'playing');
                        await v.pause();
                        const nativeTime = media.currentTime;
                        const savedTime = v._disabledProperties.currentTime;
                        await v.disable();
                        equal(v.isEnabled, main, 'main audio cannot be disabled');
                        if (!main) {
                            equal(await v.getDimensions(), { w: 64, h: 48 }, 'disabled dimensions');
                            check(Math.abs(await v.duration() - 2) < 0.1, 'disabled duration');
                            equal(await v.currentTime(), savedTime, 'disabled snapshot is the load-time snapshot');
                            await v.setCurrentTime(0.9);
                            await v.setVolume(0.2);
                            await v.setPlaybackRate(1.5);
                            await v.play();
                            equal([await v.currentTime(), v.currentTimeSync, await v.volume(), await v.playbackRate(), await v.paused()], [0.9, 0.9, 0.2, 1.5, false], 'disabled cached controls');
                            equal(media.paused, true, 'disabled play does not play the element');
                            await v.pause();
                            equal(await v.paused(), true, 'disabled pause');
                            await v.enable();
                            equal(v.isEnabled, true, 'enable');
                            check(Math.abs(await v.currentTime() - nativeTime) < 0.05, 'enable does not apply cached settings');
                            equal(await v.volume(), 0.6, 'native volume after enable');
                            equal(await v.playbackRate(), 1.25, 'native rate after enable');
                        }
                        const finished = once(media, 'ended');
                        await v.setPlaybackRate(4);
                        const nearEnd = once(media, 'seeked');
                        await v.setCurrentTime(1.8);
                        await nearEnd;
                        await v.play();
                        await finished;
                        equal(ended, 1, 'ended callback');
                        await v.clearStreamData();
                        equal(v.ready, false, 'clear resets readiness');
                        equal(media.getAttribute('src'), '', 'clear src');
                        media.dispatchEvent(new Event('ended'));
                        equal(ended, 1, 'clear removes ended listener');
                        if (format === 'mp4') {
                            // The selected MP4 source is intentionally retained across reloads.
                            await v.load({ content: 'reloaded', sources: { mp4: [{ src: 'low.mp4', res: { w: 16, h: 12 } }] } }, { mainAudioPlayer: main ? v : null });
                            check(media.currentSrc.endsWith('/high.mp4'), 'MP4 reload retains selected source');
                            await v.pause();
                            media.dispatchEvent(new Event('ended'));
                            equal(ended, 2, 'reload restores exactly one ended listener');
                            await v.clearStreamData();
                        }
                        v.removeFromParent();
                        // Player unload/reload creates a fresh video instance in both formats.
                        const reloaded = new Class(player, parent, main, { crossOrigin });
                        await reloaded.load(data(format), { mainAudioPlayer: main ? reloaded : null });
                        check(reloaded.ready, 'reload with fresh instance');
                        await reloaded.pause();
                        await reloaded.clearStreamData();
                        reloaded.removeFromParent();
                        cases++;
                    }
                }
                const zero = new Class(player, parent, true);
                zero.initVolume(0);
                await zero.load(data(format), { mainAudioPlayer: zero });
                await zero.pause();
                equal(await zero.volume(), 1, 'existing falsy initial-volume behavior');
                await zero.clearStreamData();
                zero.removeFromParent();

                // Exercise waitForLoaded's event path independently of decoding timing.
                const waiting = new Class(player, parent, false);
                let readyState = 0;
                Object.defineProperty(waiting.element, 'readyState', { get: () => readyState });
                let resolved = false;
                const pending = waiting.waitForLoaded().then(() => { resolved = true; });
                await Promise.resolve();
                equal(resolved, false, 'loading wait stays pending');
                readyState = 2;
                waiting.element.dispatchEvent(new Event('loadeddata'));
                await pending;
                equal(waiting.ready, true, 'loadeddata resolves waiting');
                await waiting.clearStreamData();
                waiting.element.dispatchEvent(new Event('loadeddata'));
                equal(waiting.ready, false, 'clear removes loadeddata listener');
                waiting.removeFromParent();
            }
            const multiPlugin = new plugins.Mp4MultiQualityVideoFormatPlugin(player, 'multi');
            const multi = await multiPlugin.getVideoInstance(parent, true);
            const multiSources = sources().map(source => ({ ...source, src: `${location.origin}/media/${source.src}` }));
            await multi.load({ content: 'presenter', sources: { mp4: multiSources } }, { mainAudioPlayer: multi });
            await multi.pause();
            check(multi instanceof c.Mp4Video, 'external MP4 subclass');
            const qualities = await multi.getQualities();
            equal(qualities.map(quality => Number(quality.res.w)), [16, 32, 64], 'external quality list');
            const multiSeek = once(multi.video, 'seeked');
            await multi.setCurrentTime(0.3);
            await multiSeek;
            await multi.setPlaybackRate(1.25);
            await multi.setQuality(qualities[0]);
            equal(multi.currentQuality, qualities[0], 'external quality selection');
            check(multi.video.currentSrc.endsWith('/low.mp4'), 'quality switch source');
            equal(await multi.playbackRate(), 1.25, 'quality switch keeps speed');
            await multi.clearStreamData();
            multi.removeFromParent();
            const hls = new plugins.hlsTools.HlsVideo(player, parent, {}, false);
            check(hls instanceof c.HtmlVideo, 'external HLS subclass');
            equal(hls.video.getAttribute('playsinline'), '', 'HLS inherits element setup');
            hls.removeFromParent();
            check(logs.some(message => message.includes('es.upv.paella.htmlVideoFormat (presenter): video loaded and ready.')), 'HTML log message');
            check(logs.some(message => message.includes('es.upv.paella.mp4VideoFormat (presenter): video loaded and ready.')), 'MP4 log message');
            return { cases, baseline };
        }, !!process.env.PAELLA_VIDEO_BASELINE_REF);
        assert.equal(result.cases, 12);
        const types = await readFile('repos/paella-core/dist/paella-core.d.ts', 'utf8');
        if (!result.baseline) assert.match(types, /class Mp4Video extends HtmlVideo<Mp4Source, StreamData\$?\d*>/);
        console.log(`Real local MP4 decoding: ${result.cases} HTML/MP4 cases, wait/events, reloads, MP4 multi-quality and HLS subclass${result.baseline ? ' (pre-refactor baseline)' : ''}`);
    }
    finally {
        if (browser) await browser.close();
        if (server) await server.close();
        await rm(root, { recursive: true, force: true });
    }
});
