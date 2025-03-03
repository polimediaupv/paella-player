# 1 - Vanilla Player

Although it is not the most common, you can use `paella-core` directly from the web browser. During this series of tutorials we will use Vite as a building system, but before we start we will see how to create a simple video player without using any building system, so you can adapt it to your project as you wish.

## Get `paella-core` library

The only way right now to get `paella-core` and the rest of the auxiliary plugin libraries is to use the npm package:

```sh
$ npm install @asicupv/paella-core
```

## Create main source file

Create an HTML document to host the player. Create the file next to the `node_modules` folder that will have been created in the location where you have executed `npm install`.

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Paella Player Tutorial</title>
    <style>
      body {
        margin: 0px;
        font-family: sans-serif;
      }

      #playerContainer {
        width: 100vw; height: 100vh
      }
    </style>
    <link
      rel="stylesheet"
      href="./node_modules/@asicupv/paella-core/dist/paella-core.css"
      />
  </head>
  <body>
    <div id="playerContainer"></div>
    <script type="module">
      import { Paella } from './node_modules/@asicupv/paella-core/dist/paella-core.js';

      const player = new Paella('playerContainer');

      const videoUrl = "https://repository.paellaplayer.upv.es/belmar-multiresolution/media/480-presenter.mp4";
      const preview = "https://repository.paellaplayer.upv.es/belmar-multiresolution/preview/belmar-preview.jpg";
      await player.loadUrl(videoUrl, { preview });

    </script>
  </body>
</html>
```

You will also need a configuration file with the basic settings for the player. Create a `config` folder next to the `index.html` file, and inside this folder, create a `config.json` file:

**config.json**

```json
{
    "plugins": {
        "es.upv.paella.singleVideoDynamic": {
            "enabled": "true",
            "validContent": [
                { "id": "presenter", "content": ["presenter"], "icon": "", "title": "Presenter" },
                { "id": "presentation", "content": ["presentation"], "icon": "", "title": "Presentation" }
            ]
        },

        "es.upv.paella.htmlVideoFormat": {
            "enabled": true
        },

        "es.upv.paella.videoCanvas": {
            "enabled": true
        },

        "es.upv.paella.playPauseButton": {
            "enabled": true
        },

        "es.upv.paella.currentTimeLabel": {
            "enabled": true,
            "side": "left",
            "showTotalTime": true
        }
    }
}
```

You will also need a web server to test it. If you use Visual Studio Code, you can use an extension to serve files, such as *Live Server*.

If you use *Live Server*, you will have a new *Go Live* option at the bottom right edge of the Visual Studio Code window. You can click there to start the HTTP development server. This will open a default browser window with the video player.


## About the code

### Player container

To load the video player, first we need an element where to place it. In this case we have added a `div` with some basic styles to position it in the page and to have a size. This is the first requirement: we need an element within the DOM tree with a previously established size. This element will be the *player container*. In this case, we have used a style sheet so that the container occupies the whole document.

### Style sheets

The `paella-core` library needs some CSS styles to work. We need to include these stylesheets for the browser to take them into account. We have loaded the player CSS file directly from the npm package:

```html
<link
    rel="stylesheet"
    href="./node_modules/@asicupv/paella-core/dist/paella-core.css"
    />
```

Some of the additional plugin libraries for `paella-core` also require stylesheets, and if you use them you will need to include them.

### The Paella class

The `Paella` class is the one that implements the entry point of the video player. It is one of the elements that are exported in the `@asicupv/paella-core` package. In the example code we have imported it directly from the npm package because we are not using any building system. In the next tutorial we will see how it would be imported if the code is compiled.

```html
<script type="module">
    import { Paella } from './node_modules/@asicupv/paella-core/dist/paella-core.js';
    ...
```

To keep the example as simple as possible, we have used a `script` element of type `module`, so that we can use the `import` statement to load the `Paella` class.

The constructor of the `Paella` class receives two parameters:

- The player container: this can be an element in the DOM tree or a string with the identifier of that element.
- An initialization object: this parameter is optional, and in this case we are not going to use it.

```js
const player = new Paella('playerContainer');
```

### Play a video

To play a video we need at least two elements:

- A preview image: it is possible to set a default preview image in the configuration file, and if this is done, the preview is optional. However, it is advisable to specify one.
- The video URL: this can be a URL to a video or a relative path to a file hosted on the same server.

To upload a video using these parameters, we will use the `loadUrl` function:

```js
const videoUrl = "https://repository.paellaplayer.upv.es/belmar-multiresolution/media/480-presenter.mp4";
const preview = "https://repository.paellaplayer.upv.es/belmar-multiresolution/preview/belmar-preview.jpg";
await player.loadUrl(videoUrl, { preview });
```

## The configuration file

We have added a configuration file in the `config/config.json` path. This configuration file is mandatory, and serves to supply the minimum data necessary for `paella-core` to be able to play videos. La biblioteca `paella-core` funciona mediante plugins. El reproductor de vídeo no es capaz ni siquiera de saber qué elementos DOM tiene que usar ni dónde tiene que colocarlos, si no es a través de plugins. 

This is because `paella-core` is intended to create multi stream video players (which we will see later), and to be able to play more than one video stream simultaneously, we have to indicate somehow where it has to place each video.

The `paella-core` library comes with the necessary plugins to create a basic player, but by default they are not enabled. If they were enabled by default, they could cause conflict with other plugins that we would like to add to perform the same operations. In addition to this, there are plugins that require some configuration parameters to work. For these two reasons, the minimum necessary configuration file will contain the information of the plugins we want to load.

```json
{
    "plugins": [
        ...
    ]
}
```

In this case, we have load four plugins:

**Video layout plugin:** this type of plugin is used to tell `paella-core` where to place the video canvas depending on the type of content. We have loaded a simple video plugin. This is a layout that is only going to show one stream. Later we will see how to add more than one video stream using other layout plugins. We will also study in depth what the information we are supplying to the plugin consists of.

```json
"es.upv.paella.singleVideoDynamic": {
    "enabled": "true",
    "validContent": [
        { "id": "presenter", "content": ["presenter"], "icon": "", "title": "Presenter" },
        { "id": "presentation", "content": ["presentation"], "icon": "", "title": "Presentation" }
    ]
}
```

**Video format plugin:** The video format plugins are the ones that give `paella-core` the ability to play videos using different standards. There can also be different types of plugins compatible with the same standard: for example, in this case we are loading the `htmlVideoFormat` plugin, which is the native method of the web browser. In this format, we leave it up to the browser to decide which video stream it will prefer to play, depending on its MIME type. But we also have available the `mp4VideoFormat` plugin, which only supports `mp4` format videos, but allows some extra features that are not native to the browser.

We can also use other more advanced plugins with the `@asicupv/paella-video-formats` library, such as live video streams using HLS, or `mp4VideoFormat` compatible videos that also support dynamic video quality change.

```json
"es.upv.paella.htmlVideoFormat": {
    "enabled": true
}
```

**Video canvas:** This is the area where the video will be placed. Some video formats require specific canvas formats. For example, there is the possibility of playing a sound file associated to a list of static frames in the form of images (as if it were a persentation). In this case we would have a video with two streams, one of audio and one of images. These formats are loaded using the `audioVidoeFormat` and `imageVideoFormat` video format plugins. The `imageVideoFormat` format is able to use a canvas of type `videoCanvas`, where instead of a video, it will place the images of the sequence. However, the audio format requires a special `audioCanvas` canvas. We will learn more about this in the tutorial on audio playback.

```json
"es.upv.paella.videoCanvas": {
    "enabled": true
}
```

**Interactive controls:** We need a button to start and pause the playback. This action can be done by clicking directly on the player canvas, but it is desirable to have a button in the toolbar. The toolbar buttons are also plugins. The `paella-core` library only includes the play/pause button, the rest of the plugins (for example, the volume button) are in additional libraries that we will be studying in future tutorials.

```json
"es.upv.paella.playPauseButton": {
    "enabled": true
}
```

**Non-interactive controls:** Finally, we need information about the progress of the video. In version 1.x of `paella-core`, this was integrated in the playback bar. This made it complicated to customize the way we want to display the time indicator, and so the possibility to add the time indicator using a new type of non-interactive control plugins was introduced. These plugins work just like buttons in the sense that they can be placed on the toolbar in the same way, but they do not expect interaction from the user. In `paella-core` 2.x the progress bar timer has been removed, and now needs to be added via a non-interactive control plugin, which is provided as part of `paella-core`:

```json
"es.upv.paella.currentTimeLabel": {
    "enabled": true,
    "side": "left",
    "showTotalTime": true
}
```

