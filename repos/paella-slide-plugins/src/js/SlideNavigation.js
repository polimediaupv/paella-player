
export function checkSlides(player) {
    return getFrames(player).length > 0;
}

export function getFrames(player) {
    const frames = player.frameList?.frames || [];
    frames.sort((a,b) => {
        return a.time - b.time;
    });
    return frames;
}

export async function nextSlide(player) {
    const frames = getFrames(player);
    const { videoContainer } = player;
    // Convert all to untrimmed time
    const initOffset = videoContainer.isTrimEnabled ? videoContainer.trimStart : 0;
    const max = initOffset + Math.trunc(await videoContainer.duration());
    const current = initOffset + Math.trunc(await videoContainer.currentTime());
    let frame = null;
    frames.some(f => {
        if (f.time>current && f.time<max) {
            frame = f;
        }
        return frame !== null;
    });

    if (frame) {
        await player.videoContainer.setCurrentTime(frame.time - initOffset);
    }
}

export async function previousSlide(player) {
    const frames = getFrames(player);
    const { videoContainer } = player;
    const initOffset = videoContainer.isTrimEnabled ? videoContainer.trimStart : 0;
    const current = Math.trunc(await videoContainer.currentTime()) + initOffset;
    let frame = null;
    frames.some(f => {
        if (f.time<current) {
            frame = f;
        }
        return f.time>=current;
    });

    if (frame) {
        const seekTime = frame.time<initOffset ? initOffset : frame.time;
        await player.videoContainer.setCurrentTime(seekTime - initOffset);
    }
}