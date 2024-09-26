
function createVertexBuffer(gl, vertexData) {
    const result = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, result);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    return result;
}

function createIndexBuffer(gl, indexData) {
    const result = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, result);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
    return result;
}

export default class SceneObject {
    constructor(gl, position, texCoord, index) {
        this.gl = gl;
        this.positionArray = position;
        this.positionBuffer = createVertexBuffer(gl, position);
        this.texCoordArray = texCoord;
        this.texCoordBuffer = createVertexBuffer(gl, texCoord);
        this.indexArray = index;
        this.indexBuffer = createIndexBuffer(gl, index);
    }

    bindPositions() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    }

    bindTexCoord() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    }

    draw() {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.indexArray.length, this.gl.UNSIGNED_SHORT, 0);
    }
}