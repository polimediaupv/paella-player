import { test } from '@playwright/test';
import { openPlayer, pressPreviewPlay } from './helpers';

/**
 * Reproduction tests: one test per video id in test/player/public/repository.
 *
 * Each test opens the player for the given id (waiting for the MANIFEST
 * state), presses the preview play button (which starts playback), and waits
 * for the player to reach the LOADED state. This verifies that every video
 * in the repository can at least be started. No seek is exercised, because
 * not every video supports it.
 *
 * NOTE: the media is served from the remote repositories referenced by the
 * manifests (repository.paellaplayer.upv.es / streaming.upv.es), so these
 * tests require network access.
 */

/**
 * Every video id available in the test repository (one per directory under
 * test/player/public/repository containing a data.json manifest).
 */
const VIDEO_IDS = [
    'audio-and-images',
    'audio-no-frames',
    'audio-only',
    'belmar-16-9-hls',
    'belmar-html',
    'belmar-multiresolution-remote',
    'belmar-multiresolution-single',
    'belmar-nopreview',
    'belmar-single',
    'belmar-trimming',
    //'bug-test',
    'dfxp-captions',
    'different-length-master-larger-1',
    'different-length-master-shorter-1',
    'dual-stream-c',
    'dual-stream-f-c',
    'dual-stream-f-t',
    'dual-stream-f-t-c',
    'dual-stream-t',
    'dual-stream-t-c',
    //'error-hls-video',
    //'error-no-main-audio',
    //'error-video',
    'hls-captions',
    //'hls-live',
    'hls-multiaudio',
    'hls-multiquality',
    'hls-single',
    //'live-tv-apunt',
    //'ll-hls',
    'n-stream',
    'no-metadata',
    'portrait',
    'portrait-dual',
    'test-firefox',
    'test-single-stream-main-audio',
    'video-360',
    'webvtt-captions',
];

test.describe('Video reproduction (one test per repository id)', () => {
    for (const videoId of VIDEO_IDS) {
        test(`can start ${videoId}`, async ({ page }) => {
            // The manifest loads and the preview with the play button is shown
            await openPlayer(page, videoId);

            // Pressing play loads the player UI and starts playback
            await pressPreviewPlay(page);
        });
    }
});
