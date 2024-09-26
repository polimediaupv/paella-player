import { CanvasPlugin, Canvas } from 'paella-core';
import WebGLCanvas from '../js/WebGLCanvas';
import Shader from '../js/Shader';
import SceneObject from '../js/SceneObject';
import VideoTexture from '../js/VideoTexture';
import { createSphere } from '../js/primitives';
import Mat4 from '../js/math/Mat4';
import WebGLPluginsModule from './WebGLPluginModule';

const vertex = `
precision highp float;
attribute vec3 inVertexPos;
attribute vec2 inTexCoord;

varying vec2 fsTexCoord;

uniform mat4 uView;
uniform mat4 uProj;

void main() {
    gl_Position = uProj * uView * vec4(inVertexPos,1.0);
    fsTexCoord = inTexCoord;
}
`;

const fragment = `
precision highp float;
uniform sampler2D uVideoTexture;

varying vec2 fsTexCoord;

void main() {
    gl_FragColor = texture2D(uVideoTexture,fsTexCoord);
}
`;

const removeVideoElement = (video, debug = false) => {
    const playerParent = video.parentNode;
    playerParent.removeChild(video);
    document.body.appendChild(video);
    video.style.position = "fixed";
    video.style.width = "100px";
    video.style.height = "50px";
    video.style.top = "0px";
    video.style.left = "0px";
    if (!debug) {
        video.style.display = "none";
    }
}

export class Video360Canvas extends Canvas {
    constructor(player, videoContainer, config) {
        super('canvas', player, videoContainer);
        this.config = config;
        this.maxZoom = config.maxZoom ?? 3;
        this.minZoom = config.minZoom ?? 0.3;
        this.speedX = config.speedX ?? 1;
        this.speedY = config.speedY ?? 1;

        let downPosition = [0,0];
        let drag = false;
        this._pitch = 0;
        this._yaw = 0;
        let initialDownPosition = [0,0];
        this.element.addEventListener('mousedown', evt => {
            drag = true;
            downPosition = [evt.clientX, evt.clientY];
            initialDownPosition = [evt.clientX, evt.clientY];
            evt.stopPropagation();
        });

        this.element.addEventListener('click', evt => {
            evt.stopPropagation();
        });

        this.element.addEventListener('mouseup', async evt => {
            if (initialDownPosition[0] == evt.clientX && initialDownPosition[1] == evt.clientY) {
                const isPaused = await player.paused();
                isPaused ? player.play() : player.pause();
            }
            drag = false;
            evt.stopPropagation();
        });

        this.element.addEventListener('wheel', evt => {
            this.currentZoom += evt.deltaY / 1000;
            if (this.currentZoom > this.maxZoom) {
                this.currentZoom = this.maxZoom;
            }
            else if (this.currentZoom < this.minZoom) {
                this.currentZoom = this.minZoom;
            }
            evt.stopPropagation();
            evt.preventDefault();
        });

        this.element.addEventListener('mouseout', evt => {
            drag = false;
            evt.stopPropagation();
        });

        this.element.addEventListener('mousemove', evt => {
            player.showUserInterface();
            if (drag) {
                const newPos = [evt.clientX, evt.clientY];
                const diff = [downPosition[0] - newPos[0], downPosition[1] - newPos[1]];
                downPosition = newPos;
                this._yaw += diff[0] * 0.004 * this.speedX;
                this._pitch += diff[1] * 0.004 * this.speedY;
                if (this._yaw>2*Math.PI) {
                    this._yaw = this._yaw - 2 * Math.PI;
                }
                else if (this._yaw<0) {
                    this._yaw = 2 * Math.PI + this._yaw;
                }

                if (this._pitch>Math.PI / 2) {
                    this._pitch = Math.PI / 2;
                }
                else if (this._pitch<=-Math.PI / 2) {
                    this._pitch = -Math.PI / 2;
                }

            }
            evt.stopPropagation();
        });
    }

    async loadCanvas(player) {
        this.currentZoom = 1;
        this._videoPlayer = player;

        player.element.style.width = "100%";
        player.element.style.height = "100%";
        player.element.style.position = "absolute";
        player.element.style.top = "0";
        player.element.style.left = "0";

        this.element.style.overflow = "hidden";
        this.element.style.position = "relative";

        this._videoPlayer = player;
        player.element.crossOrigin = "";
        removeVideoElement.apply(this, [player.element, false])

        this._webGLCanvas = new WebGLCanvas(this.element);
        await this._webGLCanvas.init({ clearColor: [0.2, 0.3, 0.8, 1] });

        const { gl } = this._webGLCanvas;

        const videoTexture = new VideoTexture(gl, player.element);

        const shader = new Shader(gl, { 
            vertex, fragment, 
            attribs: [ 'inVertexPos', 'inTexCoord' ], 
            uniforms: [ 'uView', 'uProj', 'uVideoTexture' ]
        });

        const sphereData = createSphere(30);
        const sphere = new SceneObject(gl, sphereData.positions, sphereData.uvs, sphereData.triangles);
        
        const canvas = this.element;
        const draw = () => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;

            const fov = 45 * this.currentZoom;
            const aspectRatio = w / h;
            const projection = Mat4.MakePerspective(fov, isNaN(aspectRatio) ? 16/9 : aspectRatio, 0.01, 10.0);
            const view = Mat4.MakeIdentity();
            const model = Mat4.MakeRotation(this._yaw, 0, 1, 0);
            model.rotate(this._pitch, 1, 0, 0);

            videoTexture.updateTexture();
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
            gl.clear(gl.COLOR_BUFFER_BIT);
    
            shader.useProgram();
            shader.enablePositionArray('inVertexPos', sphere);
            shader.enableTexCoordArray('inTexCoord', sphere);
            shader.bindMatrix4('uView', Mat4.Mult(model,view));
            shader.bindMatrix4('uProj', projection);
            shader.bindTexture('uVideoTexture', videoTexture.texture);
            sphere.draw();
            requestAnimationFrame(draw);    
        }
        draw();
    }
}

export default class Video360CanvasPlugin extends CanvasPlugin {
    getPluginModuleInstance() {
        return WebGLPluginsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.video360Canvas";
    }

    get canvasType() { return "video360"; }

    isCompatible(stream) {
        if (stream.canvas?.find(c => c == this.canvasType)) {
            return true;
        }
        
        return super.isCompatible(stream);
    }

    getCanvasInstance(videoContainer) {
        return new Video360Canvas(this.player, videoContainer, this.config);
    }
}
