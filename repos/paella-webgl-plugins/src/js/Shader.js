
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

const loadShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Error compiling shdaer: \n${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
}

export default class Shader {
    constructor(gl, { vertex = defaultVertex, fragment = defaultFragment, attribs = [], uniforms = [] }) {
        this.gl = gl;
        const vShader = loadShader(gl, gl.VERTEX_SHADER, vertex);
        const fShader = loadShader(gl, gl.FRAGMENT_SHADER, fragment);

        const shaderProgram = gl.createProgram();
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

    useProgram() {
        this.gl.useProgram(this._shaderProgram);
    }

    enablePositionArray(attribName, vertexBuffer) {
        vertexBuffer.bindPositions();
        this.enableArray(attribName, 3);
    }

    enableTexCoordArray(attribName, vertexBuffer) {
        vertexBuffer.bindTexCoord();
        this.enableArray(attribName, 2);
    }

    enableArray(attribName, numComponents) {
        const { gl } = this;
        gl.enableVertexAttribArray(this.attribs[attribName]);
        gl.vertexAttribPointer(this.attribs[attribName], numComponents, gl.FLOAT, false, 0, 0);
    }

    bindTexture(uniformName, texture) {
        const { gl } = this;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(this.uniforms[uniformName], 0);
    }

    bindFloat(uniformName, value) {
        this.gl.uniform1f(this.uniforms[uniformName], value);
    }

    bindMatrix4(uniformName, value) {
        this.gl.uniformMatrix4fv(this.uniforms[uniformName], false, value);
    }
}