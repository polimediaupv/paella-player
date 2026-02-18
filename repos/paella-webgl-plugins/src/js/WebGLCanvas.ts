
export default class WebGLCanvas {
    gl: WebGLRenderingContext;

    constructor(canvas: HTMLCanvasElement) {
        const gl = canvas.getContext("webgl");

        if (gl === null) {
            throw new Error("This browser does not support WebGL");
        }

        this.gl = gl;
    }
    
    async init({ clearColor = [0, 0, 0, 1] }: { clearColor?: [number, number, number, number] } = {}): Promise<void> {
        const gl = this.gl; 
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(...clearColor);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}