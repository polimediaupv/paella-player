import { Paella, Frame } from '@asicupv/paella-core';

export function checkSlides(player: Paella) {
    return getFrames(player).length > 0;
}

export function getFrames(player: Paella) {
    const frames = player.frameList?.frames || [];
    frames.sort((a: Frame, b: Frame) => {
        return a.time - b.time;
    });
    return frames;
}

export async function nextSlide(player: Paella) {
    const frames = getFrames(player);
    const { videoContainer } = player;
    if (!videoContainer) return;

    // Convert all to untrimmed time
    const initOffset = videoContainer.isTrimEnabled ? videoContainer.trimStart : 0;
    const max = initOffset + Math.trunc(await videoContainer.duration());
    const current = initOffset + Math.trunc(await videoContainer.currentTime());
    let frame = frames.find((f: Frame) => f.time > current && f.time < max);

    if (frame) {
        await videoContainer.setCurrentTime(frame.time - initOffset);
    }
}

export async function previousSlide(player: Paella) {
    if (!player.videoContainer) return;
    const frames = getFrames(player);
    const { videoContainer } = player;
    const initOffset = videoContainer.isTrimEnabled ? videoContainer.trimStart : 0;
    const current = Math.trunc(await videoContainer.currentTime()) + initOffset;
    let frame: Frame | null = null;
    frames.some((f: Frame) => {
        if (f.time<current) {
            frame = f;
        }
        return f.time>=current;
    });

    if (frame) {
        const seekTime = (frame as Frame).time<initOffset ? initOffset : (frame as Frame).time;
        await videoContainer.setCurrentTime(seekTime - initOffset);
    }
}
