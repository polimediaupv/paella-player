const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const plus10sButton = document.getElementById('10s');

let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        width: 640,
        height: 360,
        videoId: 'M7lc1UVf-VE',
        playerVars: { 'autoplay': 0, 'controls': 1 },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError,
            'onPlaybackQualityChange': onPlaybackQualityChange,
            'onPlaybackRateChange': onPlaybackRateChange,
            'onApiChange': onApiChange,
            'onAutoplayBlocked': function (event) {
                console.log('Autoplay blocked', event);
            },

        }
    });
}

function onPlaybackQualityChange(event) {
    console.log('Quality changed', event);
}
function onPlaybackRateChange(event) {
    console.log('Rate changed', event);
}
function onApiChange(event) {
    console.log('API changed', event);
}


function onPlayerReady(event) {
    console.log("Player ready");
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    console.log('State changed', event.data);
}

function onPlayerError(event) {
    console.log("Error: " + event)
}


// Bind events
playButton.addEventListener('click', function () {
    player.playVideo();
});
pauseButton.addEventListener('click', function () {
    player.pauseVideo();
});
plus10sButton.addEventListener('click', function () {
    player.seekTo(player.getCurrentTime() + 10, true);
});


window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;