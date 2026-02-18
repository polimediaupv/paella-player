
const defaultVertex = `

attribute vec4 inVertexPos;

void main() {
    gl_Position = inVertexPos;
}
`;

const defaultFragment = `
void main() {
    gl_FragColor = vec4(1.0, 0.5, 1.0, 1.0);
}
`;

type GLContext = WebGLRenderingContext | WebGL2RenderingContext;

type ShaderOptions = {
    vertex?: string;
    fragment?: string;
    attribs?: string[];
    uniforms?: string[];
};

type VertexBufferBinding = {
    bindPositions(): void;
    bindTexCoord(): void;
};

const loadShader = (gl: GLContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) {
        console.error('Unable to create shader');
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Error compiling shdaer: \n${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
}

export default class Shader {
    gl: GLContext;
    _shaderProgram: WebGLProgram | null;
    attribs: Record<string, number>;
    uniforms: Record<string, WebGLUniformLocation | null>;

    constructor(gl: GLContext, { vertex = defaultVertex, fragment = defaultFragment, attribs = [], uniforms = [] }: ShaderOptions = {}) {
        this.gl = gl;
        const vShader = loadShader(gl, gl.VERTEX_SHADER, vertex);
        const fShader = loadShader(gl, gl.FRAGMENT_SHADER, fragment);

        if (!vShader || !fShader) {
            console.error('Unable to initialize shader program: shader creation failed');
            this._shaderProgram = null;
            this.attribs = {};
            this.uniforms = {};
            return;
        }

        const shaderProgram = gl.createProgram();
        if (!shaderProgram) {
            console.error('Unable to initialize shader program: program creation failed');
            gl.deleteShader(vShader);
            gl.deleteShader(fShader);
            this._shaderProgram = null;
            this.attribs = {};
            this.uniforms = {};
            return;
        }
        gl.attachShader(shaderProgram, vShader);
        gl.attachShader(shaderProgram, fShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error(`Unable to initialize shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
        }

        gl.deleteShader(vShader);
        gl.deleteShader(fShader);
        this._shaderProgram = shaderProgram;

        this.attribs = {};
        attribs.forEach(attrib => {
            this.attribs[attrib] = gl.getAttribLocation(shaderProgram, attrib);
            if (this.attribs[attrib] == -1) {
                console.warn(`Attribute not found in shader: '${attrib}'`);
            }
        });


        this.uniforms = {};
        uniforms.forEach(uniform => {
            this.uniforms[uniform] = gl.getUniformLocation(shaderProgram, uniform);
            if (this.uniforms[uniform] === null) {
                console.warn(`Uniform not found in shader: ${uniform}`);
            }
        });
    }

    useProgram(): void {
        this.gl.useProgram(this._shaderProgram);
    }

    enablePositionArray(attribName: string, vertexBuffer: VertexBufferBinding): void {
        vertexBuffer.bindPositions();
        this.enableArray(attribName, 3);
    }

    enableTexCoordArray(attribName: string, vertexBuffer: VertexBufferBinding): void {
        vertexBuffer.bindTexCoord();
        this.enableArray(attribName, 2);
    }

    enableArray(attribName: string, numComponents: number): void {
        const { gl } = this;
        gl.enableVertexAttribArray(this.attribs[attribName]);
        gl.vertexAttribPointer(this.attribs[attribName], numComponents, gl.FLOAT, false, 0, 0);
    }

    bindTexture(uniformName: string, texture: WebGLTexture | null): void {
        const { gl } = this;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(this.uniforms[uniformName], 0);
    }

    bindFloat(uniformName: string, value: number): void {
        this.gl.uniform1f(this.uniforms[uniformName], value);
    }

    bindMatrix4(uniformName: string, value: Float32List): void {
        this.gl.uniformMatrix4fv(this.uniforms[uniformName], false, value);
    }
}