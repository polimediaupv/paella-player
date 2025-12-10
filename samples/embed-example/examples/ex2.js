function onYouTubeIframeAPIReady() {
    const player = new YT.Player('player', {
        width: 1280,
        height: 720,
        videoId: 'M7lc1UVf-VE',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    console.log("Player ready");
    event.target.setVolume(100);
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    console.log('State changed: ' + event.data);
}

function onPlayerError(event) {
    console.log("Error: " + event)
}



window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;