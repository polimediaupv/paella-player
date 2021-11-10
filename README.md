# Paella Player demo (version 7 and beyond)

This is the main repo of Paella Player for versions 7 and beyond. Note that Paella Player plugins may live in different repos.

Build Paella Player:

```zsh
npm install
npm run build
```

The player will be located in the `dist` directory.

To test Paella Player locally:

```zsh
npm install
npm run dev
```

Then open the following URL in a browser:

For captions demo:
[http://localhost:8080/?id=hls-captions](http://localhost:8080/?id=hls-captions)

For hls demo:
[http://localhost:8080/?id=hls-cern](http://localhost:8080/?id=hls-cern)

For webrtc demo (webrtc plugin):
[http://localhost:8080/?id=hls-webrtc](http://localhost:8080/?id=hls-webrtc)

Documentation lives here:
[https://github.com/polimediaupv/paella-core/blob/main/doc/index.md]
