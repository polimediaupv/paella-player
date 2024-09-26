
export default class WebGLCanvas {
    constructor(canvas) {
        this.gl = canvas.getContext("webgl");

        if (this.gl === null) {
            throw new Error("This browser does not support WebGL");
        }
    }
    
    async init({ clearColor = [0, 0, 0, 1] } = {}) {
        const gl = this.gl; 
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(...clearColor);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}