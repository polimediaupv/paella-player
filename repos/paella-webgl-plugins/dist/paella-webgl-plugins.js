var H = (h) => {
  throw TypeError(h);
}, Q = (h, t, e) => t.has(h) || H("Cannot " + e), N = (h, t, e) => (Q(h, t, "read from private field"), e ? e.call(h) : t.get(h)), K = (h, t, e) => t.has(h) ? H("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(h) : t.set(h, e), J = (h, t, e, s) => (Q(h, t, "write to private field"), t.set(h, e), e), G;
class X {
  constructor(t) {
    K(this, G, null), J(this, G, t);
  }
  get player() {
    return N(this, G);
  }
}
G = /* @__PURE__ */ new WeakMap();
function tt({ tag: h = "div", attributes: t = {}, children: e = "", innerText: s = "", parent: n = null }) {
  const r = document.createElement(h);
  r.innerText = s;
  for (let a in t)
    r.setAttribute(a, t[a]);
  return r.innerHTML = e, n && n.appendChild(r), r;
}
function et(h, t = null) {
  const e = document.createElement("div");
  e.innerHTML = h;
  const s = e.children[0];
  return t && t.appendChild(s), s;
}
var x;
class st extends X {
  constructor(t, { tag: e = "div", attributes: s = [], children: n = "", parent: r = null }) {
    super(t), K(this, x, null), J(this, x, tt({ tag: e, attributes: s, children: n, parent: r })), Object.defineProperty(this, e, {
      get: () => N(this, x)
    });
  }
  get element() {
    return N(this, x);
  }
  get parent() {
    return N(this, x).parentElement;
  }
  hide() {
    this.element.style.display = "none";
  }
  show(t = "block") {
    this.element.style.display = null;
  }
  get isVisible() {
    const t = window.getComputedStyle(this.element);
    return t.display !== "none" && t.display !== "";
  }
  setAttribute(t, e) {
    N(this, x).setAttribute(t, e);
  }
  removeFromParent() {
    var t;
    (t = N(this, x).parentElement) == null || t.removeChild(N(this, x));
  }
  setParent(t) {
    this.removeFromParent(), t.appendChild(N(this, x));
  }
}
x = /* @__PURE__ */ new WeakMap();
class it extends X {
  constructor(t, e) {
    super(t), this._name = e;
  }
  getPluginModuleInstance() {
    return null;
  }
  get config() {
    return this._config;
  }
  get type() {
    return "none";
  }
  get order() {
    var t;
    return ((t = this._config) == null ? void 0 : t.order) || 0;
  }
  get description() {
    var t;
    return ((t = this._config) == null ? void 0 : t.description) || "";
  }
  get name() {
    return this._name;
  }
  async isEnabled() {
    var t;
    return (t = this.config) == null ? void 0 : t.enabled;
  }
  async load() {
  }
  async unload() {
  }
}
class rt extends X {
  get moduleName() {
    return this.player.log.warn(`Incomplete player module definition: '${__filename}.moduleName'`), "-";
  }
  get moduleVersion() {
    return this.player.log.warn(`Incomplete player module definition: '${__filename}.moduleVersion'`), "0.0.0";
  }
  async getDictionaries() {
    return null;
  }
}
class nt extends st {
  constructor(t, e, s) {
    super(e, { tag: t, parent: s }), this.element.className = "video-canvas", this._userArea = null, this._buttonsArea = et(`
        <div class="button-area">
        </div>
        `, this.element);
  }
  async loadCanvas(t) {
    throw Error(`${this.name}: loadCanvas() not implemented`);
  }
  get userArea() {
    return this._userArea || (this._userArea = document.createElement("div"), this._userArea.className = "user-area", this.element.appendChild(this._userArea)), this._userArea;
  }
  get buttonsArea() {
    return this._buttonsArea;
  }
  showButtons() {
    this.buttonsArea.style.display = null;
  }
  hideButtons() {
    this.buttonsArea.style.display = "none";
  }
}
class ht extends it {
  get type() {
    return "canvas";
  }
  get canvasType() {
    return "";
  }
  isCompatible(t) {
    return Array.isArray(t == null ? void 0 : t.canvas) ? t.canvas.indexOf(this.canvasType) !== -1 : t.canvas === this.canvasType;
  }
  getCanvasInstance(t) {
    throw Error(`${this.name} canvas plugin: getCanvasInstance() not implemented`);
  }
}
const ot = Object.freeze({
  DISABLED: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5
});
ot.INFO;
class at {
  constructor(t) {
    if (this.gl = t.getContext("webgl"), this.gl === null)
      throw new Error("This browser does not support WebGL");
  }
  async init({ clearColor: t = [0, 0, 0, 1] } = {}) {
    const e = this.gl;
    e.enable(e.DEPTH_TEST), e.clearColor(...t), e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT);
  }
}
const ut = `

attribute vec4 inVertexPos;

void main() {
    gl_Position = inVertexPos;
}
`, lt = `
void main() {
    gl_FragColor = vec4(1.0, 0.5, 1.0, 1.0);
}
`, Y = (h, t, e) => {
  const s = h.createShader(t);
  return h.shaderSource(s, e), h.compileShader(s), h.getShaderParameter(s, h.COMPILE_STATUS) || console.error(`Error compiling shdaer: 
${h.getShaderInfoLog(s)}`), s;
};
class ct {
  constructor(t, { vertex: e = ut, fragment: s = lt, attribs: n = [], uniforms: r = [] }) {
    this.gl = t;
    const a = Y(t, t.VERTEX_SHADER, e), o = Y(t, t.FRAGMENT_SHADER, s), l = t.createProgram();
    t.attachShader(l, a), t.attachShader(l, o), t.linkProgram(l), t.getProgramParameter(l, t.LINK_STATUS) || console.error(`Unable to initialize shader program: ${t.getProgramInfoLog(l)}`), t.deleteShader(a), t.deleteShader(o), this._shaderProgram = l, this.attribs = {}, n.forEach((u) => {
      this.attribs[u] = t.getAttribLocation(l, u), this.attribs[u] == -1 && console.warn(`Attribute not found in shader: '${u}'`);
    }), this.uniforms = {}, r.forEach((u) => {
      this.uniforms[u] = t.getUniformLocation(l, u), this.uniforms[u] === null && console.warn(`Uniform not found in shader: ${u}`);
    });
  }
  useProgram() {
    this.gl.useProgram(this._shaderProgram);
  }
  enablePositionArray(t, e) {
    e.bindPositions(), this.enableArray(t, 3);
  }
  enableTexCoordArray(t, e) {
    e.bindTexCoord(), this.enableArray(t, 2);
  }
  enableArray(t, e) {
    const { gl: s } = this;
    s.enableVertexAttribArray(this.attribs[t]), s.vertexAttribPointer(this.attribs[t], e, s.FLOAT, !1, 0, 0);
  }
  bindTexture(t, e) {
    const { gl: s } = this;
    s.activeTexture(s.TEXTURE0), s.bindTexture(s.TEXTURE_2D, e), s.uniform1i(this.uniforms[t], 0);
  }
  bindFloat(t, e) {
    this.gl.uniform1f(this.uniforms[t], e);
  }
  bindMatrix4(t, e) {
    this.gl.uniformMatrix4fv(this.uniforms[t], !1, e);
  }
}
function j(h, t) {
  const e = h.createBuffer();
  return h.bindBuffer(h.ARRAY_BUFFER, e), h.bufferData(h.ARRAY_BUFFER, new Float32Array(t), h.STATIC_DRAW), e;
}
function gt(h, t) {
  const e = h.createBuffer();
  return h.bindBuffer(h.ELEMENT_ARRAY_BUFFER, e), h.bufferData(h.ELEMENT_ARRAY_BUFFER, new Uint16Array(t), h.STATIC_DRAW), e;
}
class dt {
  constructor(t, e, s, n) {
    this.gl = t, this.positionArray = e, this.positionBuffer = j(t, e), this.texCoordArray = s, this.texCoordBuffer = j(t, s), this.indexArray = n, this.indexBuffer = gt(t, n);
  }
  bindPositions() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
  }
  bindTexCoord() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
  }
  draw() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer), this.gl.drawElements(this.gl.TRIANGLES, this.indexArray.length, this.gl.UNSIGNED_SHORT, 0);
  }
}
class wt {
  constructor(t, e) {
    this.gl = t, this.video = e, this.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.texture);
    const s = new Uint8Array([0, 0, 255, 255]);
    t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, 1, 1, 0, t.RGBA, t.UNSIGNED_BYTE, s), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR);
  }
  updateTexture() {
    const { gl: t } = this;
    t.bindTexture(t.TEXTURE_2D, this.texture), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, this.video);
  }
}
const mt = Math.PI * 2, W = Math.PI / 2;
function ft([h, t, e]) {
  return e = -e + Math.PI / 2, [
    h * Math.cos(t) * Math.cos(e),
    h * Math.sin(t),
    h * -Math.cos(t) * Math.sin(e)
  ];
}
function V(h, t, e) {
  return (e - h) / (t - h);
}
function pt(h) {
  const t = Math.PI / h, e = h * 2, s = [], n = [];
  let r = -Math.PI / 2;
  for (let u = 0; u <= h; u++) {
    const p = V(-W, W, -r);
    let m = 0, f = e + (u > 0 && u < h ? 1 : 0);
    for (let b = 0; b < f; b++)
      s.push(ft([1, r, m])), n.push([V(0, mt, m), p]), m += t;
    r += t;
  }
  const a = [];
  for (let u = 0; u < s.length; u++)
    a.push([1, 1, 0]);
  const o = [];
  let l = 0;
  for (let u = 0; u < h; u++) {
    const p = u > 0 ? 1 : 0;
    for (let m = 0; m < e; m++) {
      const f = l + m, b = l + m + 1, y = f + e + p, E = b + e + p;
      u === 0 && o.push([f, E, y]), u === h - 1 && o.push([f, b, y]), u > 0 && u < h - 1 && h > 2 && (o.push([f, E, y]), o.push([f, b, E]));
    }
    u === 0 ? l += e : l += e + 1;
  }
  return {
    positions: s.flat(),
    colors: a.flat(),
    triangles: o.flat(),
    uvs: n.flat(),
    normals: s.flat()
  };
}
const bt = 3.141592653589793, Z = 1e-7, z = Float32Array, Et = (h) => h > -Z && h < Z ? 0 : h, c = (h) => Et(h) === 0, g = (h, t) => Math.abs(h - t) < Z, I = (h, t) => {
  if (h.length != t.length) throw new Error("Invalid vector length in operation");
};
class i extends z {
  constructor() {
    switch (arguments.length) {
      case 0:
        super([0, 0]);
        break;
      case 1:
        arguments[0].length > 1 && arguments[0].length < 5 && super(arguments[0]);
        break;
      case 2:
        arguments[0].length === 2 && typeof arguments[1] == "number" ? super([arguments[0][0], arguments[0][1], arguments[1]]) : arguments[0].length === 3 && typeof arguments[1] == "number" ? super([arguments[0][0], arguments[0][1], arguments[0][2], arguments[1]]) : typeof arguments[0] == "number" && typeof arguments[1] == "number" && super([arguments[0], arguments[1]]);
        break;
      case 3:
        arguments[0].length === 2 && typeof arguments[1] == "number" && typeof arguments[2] == "number" ? super([arguments[0][0], arguments[0][1], arguments[1], arguments[2]]) : typeof arguments[0] == "number" && typeof arguments[1] == "number" && typeof arguments[2] == "number" && super([arguments[0], arguments[1], arguments[2]]);
        break;
      case 4:
        super([arguments[0], arguments[1], arguments[2], arguments[3]]);
        break;
      default:
        throw new Error("Invalid parameters in Vec constructor");
    }
  }
  normalize() {
    const t = i.Magnitude(this);
    switch (this.length) {
      case 4:
        this[3] = this[3] / t;
      case 3:
        this[2] = this[2] / t;
      case 2:
        this[1] = this[1] / t, this[0] = this[0] / t;
        break;
      default:
        throw new Error(`Invalid vector size: ${this.length}`);
    }
    return this;
  }
  assign(t) {
    switch (I(this, t), this.length) {
      case 4:
        this[3] = t[3];
      case 3:
        this[2] = t[2];
      case 2:
        this[1] = t[1], this[0] = t[0];
        break;
      default:
        throw new Error(`Invalid vector size: ${this.length}`);
    }
  }
  set(t, e, s = null, n = null) {
    if (this.length === 2)
      this[0] = t, this[1] = e;
    else if (this.length === 3 && s !== null)
      this[0] = t, this[1] = e, this[2] = s;
    else if (this.length === 4 && n !== null)
      this[0] = t, this[1] = e, this[2] = s, this[3] = n;
    else
      throw new Error(`Invalid vector size: ${this.length}. Trying to set x=${t}, y=${e}, z=${s}, w=${n}`);
  }
  scale(t) {
    switch (this.length) {
      case 4:
        this[3] = this[3] * t;
      case 3:
        this[2] = this[2] * t;
      case 2:
        this[1] = this[1] * t, this[0] = this[0] * t;
        break;
      default:
        throw new Error(`Invalid vector size: ${v.length}`);
    }
    return this;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
  get w() {
    return this[3];
  }
  set x(t) {
    return this[0] = t, this;
  }
  set y(t) {
    return this[1] = t, this;
  }
  set z(t) {
    return this[2] = t, this;
  }
  set w(t) {
    return this[3] = t, this;
  }
  get r() {
    return this[0];
  }
  get g() {
    return this[1];
  }
  get b() {
    return this[2];
  }
  get a() {
    return this[3];
  }
  set r(t) {
    return this[0] = t, this;
  }
  set g(t) {
    return this[1] = t, this;
  }
  set b(t) {
    return this[2] = t, this;
  }
  set a(t) {
    return this[3] = t, this;
  }
  get width() {
    switch (this.length) {
      case 2:
        return this[0];
      case 4:
        return this[2];
      default:
        throw new Error("Vec.width function used on non size or viewport vectors (two or four elements)");
    }
  }
  get height() {
    switch (this.length) {
      case 2:
        return this[1];
      case 4:
        return this[3];
      default:
        throw new Error("Vec.width function used on non size or viewport vectors (two or four elements)");
    }
  }
  set width(t) {
    return this[0] = t, this;
  }
  set height(t) {
    return this[1] = t, this;
  }
  get xy() {
    switch (this.length) {
      case 2:
        return new i(this);
      case 3:
      case 4:
        return new i(this[0], this[1]);
      default:
        throw new Error(`Invalid vector size: ${this.length}`);
    }
  }
  get xz() {
    switch (this.length) {
      case 3:
      case 4:
        return new i(this[0], this[2]);
      case 2:
      default:
        throw new Error(`Invalid vector size: ${this.length}`);
    }
  }
  get yz() {
    switch (this.length) {
      case 3:
      case 4:
        return new i(this[1], this[2]);
      case 2:
      default:
        throw new Error(`Invalid vector size: ${this.length}`);
    }
  }
  set xy(t) {
    return this[0] = t[0], this[1] = t[1], this;
  }
  set xz(t) {
    if (this.length < 3)
      throw new Error("Invalid vector size");
    return this[0] = t[0], this[2] = t[1], this;
  }
  set yz(t) {
    if (this.length < 3)
      throw new Error("Invalid vector size");
    return this[1] = t[0], this[2] = t[1], this;
  }
  get xyz() {
    if (this.length < 3)
      throw new Error(`Invalid vector size: ${this.length}`);
    return new i(this[0], this[1], this[2]);
  }
  set xyz(t) {
    if (t.length < 3 || this.length < 3)
      throw new Error(`Invalid vector size to set: l;${this.length}, r:${t.length}`);
    return this[0] = t[0], this[1] = t[1], this[2] = t[2], this;
  }
  // Copy operator
  get xyzw() {
    if (this.length < 4)
      throw new Error(`Invalid vector size: ${this.length}, 4 required`);
    return new i(this[0], this[1], this[2], this[3]);
  }
  // Assign operator
  set xyzw(t) {
    if (this.length < 4 || t.length < 4)
      throw new Error(`Invalid vector size to set: l;${this.length}, r:${t.length}`);
    return this[0] = t[0], this[1] = t[1], this[2] = t[2], this[3] = t[3], this;
  }
  get rgb() {
    if (this.length < 3)
      throw new Error(`Invalid vector size: ${this.length}, but at least 3 required`);
    return new i(this[0], this[1], this[2]);
  }
  set rgb(t) {
    if (t.length < 3 || this.length < 3)
      throw new Error(`Invalid vector size to set: l;${this.length}, r:${t.length}`);
    return this[0] = t[0], this[1] = t[1], this[2] = t[2], this;
  }
  get rg() {
    if (v.length < 3 || this.length < 3)
      throw new Error(`Invalid vector size to set: l;${this.length}, r:${v.length}`);
    return new i(this[0], this[1]);
  }
  get gb() {
    if (v.length < 3 || this.length < 3)
      throw new Error(`Invalid vector size to set: l;${this.length}, r:${v.length}`);
    return new i(this[1], this[2]);
  }
  get rb() {
    if (v.length < 3 || this.length < 3)
      throw new Error(`Invalid vector size to set: l;${this.length}, r:${v.length}`);
    return new i(this[0], this[2]);
  }
  get hexColor() {
    const t = Math.round(this.r * 255), e = Math.round(this.g * 255), s = Math.round(this.b * 255), n = (r) => r.toString(16).toUpperCase();
    return `#${n(t)}${n(e)}${n(s)}`;
  }
  get cssColor() {
  }
  get aspectRatio() {
    return this.width / this.height;
  }
  toString() {
    switch (this.length) {
      case 2:
        return `[${this[0]}, ${this[1]}]`;
      case 3:
        return `[${this[0]}, ${this[1]}, ${this[2]}]`;
      case 4:
        return `[${this[0]}, ${this[1]}, ${this[2]}, ${this[5]}]`;
    }
  }
  static CheckEqualLength(t, e) {
    I(t, e);
  }
  static Max(t, e) {
    switch (I(t, e), t.length) {
      case 2:
        return new i([
          t[0] > e[0] ? t[0] : e[0],
          t[1] > e[1] ? t[1] : e[1]
        ]);
      case 3:
        return new i([
          t[0] > e[0] ? t[0] : e[0],
          t[1] > e[1] ? t[1] : e[1],
          t[2] > e[2] ? t[2] : e[2]
        ]);
      case 4:
        return new i([
          t[0] > e[0] ? t[0] : e[0],
          t[1] > e[1] ? t[1] : e[1],
          t[2] > e[2] ? t[2] : e[2],
          t[3] > e[3] ? t[3] : e[3]
        ]);
      default:
        throw new Error(`Invalid vector size: ${t.length}`);
    }
  }
  static Min(t, e) {
    switch (I(t, e), t.length) {
      case 2:
        return new i([
          t[0] < e[0] ? t[0] : e[0],
          t[1] < e[1] ? t[1] : e[1]
        ]);
      case 3:
        return new i([
          t[0] < e[0] ? t[0] : e[0],
          t[1] < e[1] ? t[1] : e[1],
          t[2] < e[2] ? t[2] : e[2]
        ]);
      case 4:
        return new i([
          t[0] < e[0] ? t[0] : e[0],
          t[1] < e[1] ? t[1] : e[1],
          t[2] < e[2] ? t[2] : e[2],
          t[3] < e[3] ? t[3] : e[3]
        ]);
      default:
        throw new Error(`Invalid vector size: ${t.length}`);
    }
  }
  static Add(t, e) {
    switch (I(t, e), t.length) {
      case 2:
        return new i([
          t[0] + e[0],
          t[1] + e[1]
        ]);
      case 3:
        return new i([
          t[0] + e[0],
          t[1] + e[1],
          t[2] + e[2]
        ]);
      case 4:
        return new i([
          t[0] + e[0],
          t[1] + e[1],
          t[2] + e[2],
          t[3] + e[3]
        ]);
      default:
        throw new Error(`Invalid vector size: ${t.length}`);
    }
  }
  static Sub(t, e) {
    switch (I(t, e), t.length) {
      case 2:
        return new i([
          t[0] - e[0],
          t[1] - e[1]
        ]);
      case 3:
        return new i([
          t[0] - e[0],
          t[1] - e[1],
          t[2] - e[2]
        ]);
      case 4:
        return new i([
          t[0] - e[0],
          t[1] - e[1],
          t[2] - e[2],
          t[3] - e[3]
        ]);
      default:
        throw new Error(`Invalid vector size: ${t.length}`);
    }
  }
  static Magnitude(t) {
    switch (t.length) {
      case 2:
        return Math.sqrt(t[0] * t[0] + t[1] * t[1]);
      case 3:
        return Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2]);
      case 4:
        return Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2] + t[3] * t[3]);
      default:
        throw new Error(`Invalid vector size: ${t.length}`);
    }
  }
  static Distance(t, e) {
    return I(t, e), i.Magnitude(i.Sub(t, e));
  }
  static Dot(t, e) {
    switch (I(t, e), t.length) {
      case 2:
        return t[0] * e[0] + t[1] * e[1];
      case 3:
        return t[0] * e[0] + t[1] * e[1] + t[2] * e[2];
      case 4:
        return t[0] * e[0] + t[1] * e[1] + t[2] * e[2] + t[3] * e[3];
      default:
        throw new Error(`Invalid vector size: ${t.length}`);
    }
  }
  static Cross(t, e) {
    switch (I(t, e), t.length) {
      case 2:
        return t[0] * e[1] - t[1] - e[0];
      case 3:
        return new i([
          t[1] * e[2] - t[2] * e[1],
          t[2] * e[0] - t[0] * e[2],
          t[0] * e[1] - t[1] * e[0]
        ]);
      default:
        throw new Error(`Invalid vector size for cross product: ${t.length}`);
    }
  }
  static Normalized(t) {
    const e = i.Magnitude(t);
    switch (t.length) {
      case 2:
        return new i([t[0] / e, t[1] / e]);
      case 3:
        return new i([t[0] / e, t[1] / e, t[2] / e]);
      case 4:
        return new i([t[0] / e, t[1] / e, t[2] / e, t[3] / e]);
      default:
        throw new Error(`Invalid vector size: ${t.length}`);
    }
  }
  static Mult(t, e) {
    switch (t.length) {
      case 2:
        return new i([t[0] * e, t[1] * e]);
      case 3:
        return new i([t[0] * e, t[1] * e, t[2] * e]);
      case 4:
        return new i([t[0] * e, t[1] * e, t[2] * e, t[3] * e]);
      default:
        throw new Error(`Invalid vector size: ${t.length}`);
    }
  }
  static Div(t, e) {
    switch (t.length) {
      case 2:
        return new i([t[0] / e, t[1] / e]);
      case 3:
        return new i([t[0] / e, t[1] / e, t[2] / e]);
      case 4:
        return new i([t[0] / e, t[1] / e, t[2] / e, t[3] / e]);
      default:
        throw new Error(`Invalid vector size: ${t.length}`);
    }
  }
  static Equals(t, e) {
    if (t.length != e.length)
      return !1;
    switch (t.length) {
      case 2:
        return g(t[0], e[0]) && g(t[1], e[1]);
      case 3:
        return g(t[0], e[0]) && g(t[1], e[1]) && g(t[2], e[2]);
      case 4:
        return g(t[0], e[0]) && g(t[1], e[1]) && g(t[2], e[2]) && g(t[3], e[3]);
      default:
        throw new Error(`Invalid vector size: ${t.length}`);
    }
  }
  static IsZero(t) {
    switch (t.length) {
      case 2:
        return c(t[0]) || c(t[1]);
      case 3:
        return c(t[0]) || c(t[1]) || c(t[2]);
      case 4:
        return c(t[0]) || c(t[1]) || c(t[2]) || c(t[3]);
      default:
        throw new Error(`Invalid vector size: ${t.length}`);
    }
  }
  static IsNaN(t) {
    switch (t.length) {
      case 2:
        return isNaN(t[0]) || isNaN(t[1]);
      case 3:
        return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]);
      case 4:
        return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]) || isNaN(t[3]);
      default:
        throw new Error(`Invalid vector size: ${t.length}`);
    }
  }
  /////// Constructors
  static Vec2() {
    return new i(0, 0);
  }
  static Vec3() {
    return new i(0, 0, 0);
  }
  static Vec4() {
    return new i(0, 0, 0, 0);
  }
}
class F extends z {
  constructor() {
    if (arguments.length === 9)
      super(arguments);
    else if (arguments.length === 1 && arguments[0].length === 9)
      super(arguments[0]);
    else if (arguments.length === 0)
      super([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    else
      throw new Error("Invalid parameter size in Mat3 constructor");
  }
  identity() {
    return this[0] = 1, this[1] = 0, this[2] = 0, this[3] = 0, this[4] = 1, this[5] = 0, this[6] = 0, this[7] = 0, this[8] = 1, this;
  }
  zero() {
    return this[0] = 0, this[1] = 0, this[2] = 0, this[3] = 0, this[4] = 0, this[5] = 0, this[6] = 0, this[7] = 0, this[8] = 0, this;
  }
  row(t) {
    return new i(
      this[t * 3],
      this[t * 3 + 1],
      this[t * 3 + 2]
    );
  }
  setRow(t, e, s = null, n = null) {
    if ((e == null ? void 0 : e.length) >= 3)
      this[t * 3] = e[0], this[t * 3 + 1] = e[1], this[t * 3 + 2] = e[2];
    else if (typeof e == "number" && typeof s == "number" && typeof n == "number")
      this[t * 3] = e, this[t * 3 + 1] = s, this[t * 3 + 2] = n;
    else
      throw new Error("Invalid parameter setting matrix row");
    return this;
  }
  col(t) {
    return new i(
      this[t],
      this[t + 3],
      this[t + 3 * 2]
    );
  }
  setCol(t, e, s = null, n = null) {
    if ((e == null ? void 0 : e.length) >= 3)
      this[t] = e[0], this[t + 3] = e[1], this[t + 3 * 2] = e[2];
    else if (typeof e == "number" && typeof s == "number" && typeof n == "number")
      this[t] = e, this[t + 3] = s, this[t + 3 * 2] = n;
    else
      throw new Error("Invalid parameter setting matrix row");
    return this;
  }
  assign(t) {
    if (t.length === 9)
      this[0] = t[0], this[1] = t[1], this[2] = t[2], this[3] = t[3], this[4] = t[4], this[5] = t[5], this[6] = t[6], this[7] = t[7], this[8] = t[8];
    else if (t.length === 16)
      this[0] = t[0], this[1] = t[1], this[2] = t[2], this[3] = t[4], this[4] = t[5], this[5] = t[6], this[6] = t[8], this[7] = t[9], this[8] = t[10];
    else
      throw new Error("Invalid plarameter setting matrix data");
    return this;
  }
  setScale(t, e, s) {
    const n = new i(this[0], this[3], this[6]).normalize().scale(t), r = new i(this[1], this[4], this[7]).normalize().scale(e), a = new i(this[2], this[5], this[8]).normalize().scale(s);
    return this[0] = n.x, this[3] = n.y, this[6] = n.z, this[1] = r.x, this[4] = r.y, this[7] = r.z, this[2] = a.x, this[5] = a.y, this[8] = a.z, this;
  }
  traspose() {
    const t = this[3], e = this[7], s = this[6];
    return this[3] = this[1], this[6] = this[2], this[7] = this[5], this[1] = t, this[2] = s, this[5] = e, this;
  }
  mult(t) {
    if (typeof t == "number")
      this[0] *= t, this[1] *= t, this[2] *= t, this[3] *= t, this[4] *= t, this[5] *= t, this[6] *= t, this[7] *= t, this[8] *= t;
    else if (t instanceof z && t.length === 9) {
      const e = this.row(0), s = this.row(1), n = this.row(2), r = t.col(0), a = t.col(1), o = t.col(2);
      this[0] = i.Dot(e, r), this[1] = i.Dot(e, a), this[2] = i.Dot(e, o), this[3] = i.Dot(s, r), this[4] = i.Dot(s, a), this[5] = i.Dot(s, o), this[6] = i.Dot(n, r), this[7] = i.Dot(n, a), this[8] = i.Dot(n, o);
    } else
      throw new Error("Invalid parameter in Mat3.mult()");
    return this;
  }
  multVector(t) {
    if (t.length === 2 || t.length === 3) {
      const e = t[0], s = t[1], n = t.length === 2 ? 1 : t[2];
      return new i(
        this[0] * e + this[3] * s + this[6] * n,
        this[1] * e + this[4] * s + this[7] * n,
        this[2] * e + this[5] * s + this[8] * n
      );
    } else
      throw new Error("Invalid parameter in Mat3.multVector()");
  }
  toString() {
    return `[ ${this[0]}, ${this[1]}, ${this[2]}
  ${this[3]}, ${this[4]}, ${this[5]}
  ${this[6]}, ${this[7]}, ${this[8]} ]`;
  }
  static MakeIdentity() {
    return new F().identity();
  }
  static MakeZero() {
    return new F().zero();
  }
  static MakeWithQuaternion(t) {
    const e = F.MakeIdentity();
    return e.setRow(0, new i(1 - 2 * t[1] * t[1] - 2 * t[2] * t[2], 2 * t[0] * t[1] - 2 * t[2] * t[3], 2 * t[0] * t[2] + 2 * t[1] * t[3])), e.setRow(1, new i(2 * t[0] * t[1] + 2 * t[2] * t[3], 1 - 2 * t[0] * t[0] - 2 * t[2] * t[2], 2 * t[1] * t[2] - 2 * t[0] * t[3])), e.setRow(2, new i(2 * t[0] * t[2] - 2 * t[1] * t[3], 2 * t[1] * t[2] + 2 * t[0] * t[3], 1 - 2 * t[0] * t[0] - 2 * t[1] * t[1])), e;
  }
  static IsZero(t) {
    return c(v[0]) && c(v[1]) && c(v[2]) && c(v[3]) && c(v[4]) && c(v[5]) && c(v[6]) && c(v[7]) && c(v[8]);
  }
  static IsIdentity(t) {
    return g(v[0], 1) && c(v[1]) && c(v[2]) && c(v[3]) && g(v[4], 1) && c(v[5]) && c(v[6]) && c(v[7]) && g(v[8], 1);
  }
  static GetScale(t) {
    return new i(
      i.Magnitude(new i(t[0], t[3], t[6])),
      i.Magnitude(new i(t[1], t[4], t[7])),
      i.Magnitude(new i(t[2], t[5], t[8]))
    );
  }
  static Equals(t, e) {
    return g(t[0], e[0]) && g(t[1], e[1]) && g(t[2], e[2]) && g(t[3], e[3]) && g(t[4], e[4]) && g(t[5], e[5]) && g(t[6], e[6]) && g(t[7], e[7]) && g(t[8], e[8]);
  }
  static IsNaN(t) {
    return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]) && isNaN(t[3]) || isNaN(t[4]) || isNaN(t[5]) && isNaN(t[6]) || isNaN(t[7]) || isNaN(t[8]);
  }
}
class d extends z {
  constructor() {
    const t = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ];
    if (arguments.length === 9)
      t[0] = arguments[0], t[1] = arguments[1], t[2] = arguments[2], t[4] = arguments[3], t[5] = arguments[4], t[6] = arguments[5], t[8] = arguments[6], t[9] = arguments[7], t[10] = arguments[8], t[15] = 1;
    else if (arguments.length === 1 && arguments[0].length === 9)
      t[0] = arguments[0][0], t[1] = arguments[0][1], t[2] = arguments[0][2], t[4] = arguments[0][3], t[5] = arguments[0][4], t[6] = arguments[0][5], t[8] = arguments[0][6], t[9] = arguments[0][7], t[10] = arguments[0][8], t[15] = 1;
    else if (arguments.length === 16)
      t[0] = arguments[0], t[1] = arguments[1], t[2] = arguments[2], t[3] = arguments[3], t[4] = arguments[4], t[5] = arguments[5], t[6] = arguments[6], t[7] = arguments[7], t[8] = arguments[8], t[9] = arguments[9], t[10] = arguments[10], t[11] = arguments[11], t[12] = arguments[12], t[13] = arguments[13], t[14] = arguments[14], t[15] = arguments[15];
    else if (arguments.length === 1 && arguments[0].length === 16)
      t[0] = arguments[0][0], t[1] = arguments[0][1], t[2] = arguments[0][2], t[3] = arguments[0][3], t[4] = arguments[0][4], t[5] = arguments[0][5], t[6] = arguments[0][6], t[7] = arguments[0][7], t[8] = arguments[0][8], t[9] = arguments[0][9], t[10] = arguments[0][10], t[11] = arguments[0][11], t[12] = arguments[0][12], t[13] = arguments[0][13], t[14] = arguments[0][14], t[15] = arguments[0][15];
    else if (arguments.length != 0)
      throw new Error("Invalid parameter size in Matrix3 constructor");
    super(t);
  }
  ////// Initializers
  identity() {
    return this[0] = 1, this[1] = 0, this[2] = 0, this[3] = 0, this[4] = 0, this[5] = 1, this[6] = 0, this[7] = 0, this[8] = 0, this[9] = 0, this[10] = 1, this[11] = 0, this[12] = 0, this[13] = 0, this[14] = 0, this[15] = 1, this;
  }
  zero() {
    return this[0] = 0, this[1] = 0, this[2] = 0, this[3] = 0, this[4] = 0, this[5] = 0, this[6] = 0, this[7] = 0, this[8] = 0, this[9] = 0, this[10] = 0, this[11] = 0, this[12] = 0, this[13] = 0, this[14] = 0, this[15] = 0, this;
  }
  perspective(t, e, s, n) {
    let r = Math.tan(t * bt / 360) * s, a = r * e;
    return this.frustum(-a, a, -r, r, s, n), this;
  }
  frustum(t, e, s, n, r, a) {
    let o = e - t, l = n - s, u = a - r;
    return this.setRow(0, new i(r * 2 / o, 0, 0, 0)), this.setRow(1, new i(0, r * 2 / l, 0, 0)), this.setRow(2, new i((e + t) / o, (n + s) / l, -(a + r) / u, -1)), this.setRow(3, new i(0, 0, -(a * r * 2) / u, 0)), this;
  }
  ortho(t, e, s, n, r, a) {
    let o = e - t, l = n - s, u = a - r;
    return this[0] = 2 / o, this[1] = 0, this[2] = 0, this[3] = 0, this[4] = 0, this[5] = 2 / l, this[6] = 0, this[7] = 0, this[8] = 0, this[9] = 0, this[10] = -2 / u, this[11] = 0, this[12] = -(t + e) / o, this[13] = -(n + s) / l, this[14] = -(a + r) / u, this[15] = 1, this;
  }
  lookAt(t, e, s) {
    this.identity();
    const n = new i(s), r = i.Sub(t, e);
    r.normalize();
    const a = i.Cross(n, r);
    return a.normalize(), n.normalize(), this.m00 = a.x, this.m10 = a.y, this.m20 = a.z, this.m30 = -i.Dot(a, t), this.m01 = n.x, this.m11 = n.y, this.m21 = n.z, this.m31 = -i.Dot(n, t), this.m02 = r.x, this.m12 = r.y, this.m22 = r.z, this.m32 = -i.Dot(r, t), this.m03 = 0, this.m13 = 0, this.m23 = 0, this.m33 = 1, this;
  }
  ///// Setters and getters
  get m00() {
    return this[0];
  }
  get m01() {
    return this[1];
  }
  get m02() {
    return this[2];
  }
  get m03() {
    return this[3];
  }
  get m10() {
    return this[4];
  }
  get m11() {
    return this[5];
  }
  get m12() {
    return this[6];
  }
  get m13() {
    return this[7];
  }
  get m20() {
    return this[8];
  }
  get m21() {
    return this[9];
  }
  get m22() {
    return this[10];
  }
  get m23() {
    return this[11];
  }
  get m30() {
    return this[12];
  }
  get m31() {
    return this[13];
  }
  get m32() {
    return this[14];
  }
  get m33() {
    return this[15];
  }
  set m00(t) {
    this[0] = t;
  }
  set m01(t) {
    this[1] = t;
  }
  set m02(t) {
    this[2] = t;
  }
  set m03(t) {
    this[3] = t;
  }
  set m10(t) {
    this[4] = t;
  }
  set m11(t) {
    this[5] = t;
  }
  set m12(t) {
    this[6] = t;
  }
  set m13(t) {
    this[7] = t;
  }
  set m20(t) {
    this[8] = t;
  }
  set m21(t) {
    this[9] = t;
  }
  set m22(t) {
    this[10] = t;
  }
  set m23(t) {
    this[11] = t;
  }
  set m30(t) {
    this[12] = t;
  }
  set m31(t) {
    this[13] = t;
  }
  set m32(t) {
    this[14] = t;
  }
  set m33(t) {
    this[15] = t;
  }
  get mat3() {
    return new F(
      this[0],
      this[1],
      this[2],
      this[4],
      this[5],
      this[6],
      this[8],
      this[9],
      this[10]
    );
  }
  get forwardVector() {
    return d.TransformDirection(this, new i(0, 0, 1));
  }
  get rightVector() {
    return d.TransformDirection(this, new i(1, 0, 0));
  }
  get upVector() {
    return d.TransformDirection(this, new i(0, 1, 0));
  }
  get backwardVector() {
    return d.TransformDirection(this, new i(0, 0, -1));
  }
  get leftVector() {
    return d.TransformDirection(this, new i(-1, 0, 0));
  }
  get downVector() {
    return d.TransformDirection(this, new i(0, -1, 0));
  }
  row(t) {
    return new i(
      this[t * 4],
      this[t * 4 + 1],
      this[t * 4 + 2],
      this[t * 4 + 3]
    );
  }
  setRow(t, e, s = null, n = null, r = null) {
    if (e.length >= 4)
      this[t * 4] = e[0], this[t * 4 + 1] = e[1], this[t * 4 + 2] = e[2], this[t * 4 + 3] = e[3];
    else if (typeof e == "number" && typeof s == "number" && typeof n == "number" && typeof r == "number")
      this[t * 4] = e, this[t * 4 + 1] = s, this[t * 4 + 2] = n, this[t * 4 + 3] = r;
    else
      throw new Error("Invalid parameter setting matrix row");
    return this;
  }
  col(t) {
    return new i(
      this[t],
      this[t + 4],
      this[t + 4 * 2],
      this[t + 4 * 3]
    );
  }
  setCol(t, e, s = null, n = null, r = null) {
    if (e.length >= 4)
      this[t] = e[0], this[t + 4] = e[1], this[t + 4 * 2] = e[2], this[t + 4 * 3] = e[3];
    else if (typeof e == "number" && typeof s == "number" && typeof n == "number" && typeof r == "number")
      this[t] = e, this[t + 4] = s, this[t + 4 * 2] = n, this[t + 4 * 3] = r;
    else
      throw new Error("Invalid parameter setting matrix row");
    return this;
  }
  assign(t) {
    return t.length == 9 ? (this[0] = t[0], this[1] = t[1], this[2] = t[2], this[3] = 0, this[4] = t[3], this[5] = t[4], this[6] = t[5], this[7] = 0, this[8] = t[6], this[9] = t[7], this[10] = t[8], this[11] = 0, this[12] = 0, this[13] = 0, this[14] = 0, this[15] = 1) : t.length == 16 && (this[0] = t[0], this[1] = t[1], this[2] = t[2], this[3] = t[3], this[4] = t[4], this[5] = t[5], this[6] = t[6], this[7] = t[7], this[8] = t[8], this[9] = t[9], this[10] = t[10], this[11] = t[11], this[12] = t[12], this[13] = t[13], this[14] = t[14], this[15] = t[15]), this;
  }
  translate(t, e, s) {
    return this.mult(d.MakeTranslation(t, e, s)), this;
  }
  rotate(t, e, s, n) {
    return this.mult(d.MakeRotation(t, e, s, n)), this;
  }
  scale(t, e, s) {
    return this.mult(d.MakeScale(t, e, s)), this;
  }
  toString() {
    return `[ ${this[0]}, ${this[1]}, ${this[2]}, ${this[3]}
  ${this[4]}, ${this[5]}, ${this[6]}, ${this[7]}
  ${this[8]}, ${this[9]}, ${this[10]}, ${this[11]}
  ${this[12]}, ${this[13]}, ${this[14]}, ${this[15]} ]`;
  }
  setScale(t, e, s) {
    const n = new i(this[0], this[4], this[8]).normalize().scale(t), r = new i(this[1], this[5], this[9]).normalize().scale(e), a = new i(this[2], this[6], this[10]).normalize().scale(s);
    return this[0] = n.x, this[4] = n.y, this[8] = n.z, this[1] = r.x, this[5] = r.y, this[9] = r.z, this[2] = a.x, this[6] = a.y, this[10] = a.z, this;
  }
  setPosition(t, e, s) {
    return typeof t == "number" ? (this[12] = t, this[13] = e, this[14] = s) : (this[12] = t.x, this[13] = t.y, this[14] = t.z), this;
  }
  mult(t) {
    if (typeof t == "number")
      return this[0] *= t, this[1] *= t, this[2] *= t, this[3] *= t, this[4] *= t, this[5] *= t, this[6] *= t, this[7] *= t, this[8] *= t, this[9] *= t, this[10] *= t, this[11] *= t, this[12] *= t, this[13] *= t, this[14] *= t, this[15] *= t, this;
    const e = this.row(0), s = this.row(1), n = this.row(2), r = this.row(3), a = t.col(0), o = t.col(1), l = t.col(2), u = t.col(3);
    return this[0] = i.Dot(e, a), this[1] = i.Dot(e, o), this[2] = i.Dot(e, l), this[3] = i.Dot(e, u), this[4] = i.Dot(s, a), this[5] = i.Dot(s, o), this[6] = i.Dot(s, l), this[7] = i.Dot(s, u), this[8] = i.Dot(n, a), this[9] = i.Dot(n, o), this[10] = i.Dot(n, l), this[11] = i.Dot(n, u), this[12] = i.Dot(r, a), this[13] = i.Dot(r, o), this[14] = i.Dot(r, l), this[15] = i.Dot(r, u), this;
  }
  multVector(t) {
    if (t.length < 3)
      throw new Error("Invalid parameter multiplying Mat4 by vector");
    const e = t[0], s = t[1], n = t[2], r = t.length > 3 ? t[3] : 1;
    return new i(
      this[0] * e + this[4] * s + this[8] * n + this[12] * r,
      this[1] * e + this[5] * s + this[9] * n + this[13] * r,
      this[2] * e + this[6] * s + this[10] * n + this[14] * r,
      this[3] * e + this[7] * s + this[11] * n + this[15] * r
    );
  }
  invert() {
    const t = this[0], e = this[1], s = this[2], n = this[3], r = this[4], a = this[5], o = this[6], l = this[7], u = this[8], p = this[9], m = this[10], f = this[11], b = this[12], y = this[13], E = this[14], T = this[15], R = t * a - e * r, A = t * o - s * r, $ = t * l - n * r, P = e * o - s * a, D = e * l - n * a, C = s * l - n * o, M = u * y - p * b, S = u * E - m * b, k = u * T - f * b, B = p * E - m * y, L = p * T - f * y, U = m * T - f * E;
    let w = R * U - A * L + $ * B + P * k - D * S + C * M;
    return w ? (w = 1 / w, this[0] = (a * U - o * L + l * B) * w, this[1] = (s * L - e * U - n * B) * w, this[2] = (y * C - E * D + T * P) * w, this[3] = (m * D - p * C - f * P) * w, this[4] = (o * k - r * U - l * S) * w, this[5] = (t * U - s * k + n * S) * w, this[6] = (E * $ - b * C - T * A) * w, this[7] = (u * C - m * $ + f * A) * w, this[8] = (r * L - a * k + l * M) * w, this[9] = (e * k - t * L - n * M) * w, this[10] = (b * D - y * $ + T * R) * w, this[11] = (p * $ - u * D - f * R) * w, this[12] = (a * S - r * B - o * M) * w, this[13] = (t * B - e * S + s * M) * w, this[14] = (y * A - b * P - E * R) * w, this[15] = (u * P - p * A + m * R) * w) : this.zero(), this;
  }
  traspose() {
    const t = new i(this[0], this[4], this[8], this[12]), e = new i(this[1], this[5], this[9], this[13]), s = new i(this[2], this[6], this[10], this[14]), n = new i(this[3], this[7], this[11], this[15]);
    return this.setRow(0, t), this.setRow(1, e), this.setRow(2, s), this.setRow(3, n), this;
  }
  ///////// Factory methods
  static MakeIdentity() {
    return new d().identity();
  }
  static MakeZero() {
    return new d().zero();
  }
  static MakeWithQuaternion(t) {
    const e = d.MakeIdentity();
    return e.setRow(0, new i(1 - 2 * t[1] * t[1] - 2 * t[2] * t[2], 2 * t[0] * t[1] - 2 * t[2] * t[3], 2 * t[0] * t[2] + 2 * t[1] * t[3], 0)), e.setRow(1, new i(2 * t[0] * t[1] + 2 * t[2] * t[3], 1 - 2 * t[0] * t[0] - 2 * t[2] * t[2], 2 * t[1] * t[2] - 2 * t[0] * t[3], 0)), e.setRow(2, new i(2 * t[0] * t[2] - 2 * t[1] * t[3], 2 * t[1] * t[2] + 2 * t[0] * t[3], 1 - 2 * t[0] * t[0] - 2 * t[1] * t[1], 0)), e;
  }
  static MakeTranslation(t, e, s) {
    return t instanceof z && t.length >= 3 && (e = t[1], s = t[2], t = t[0]), new d(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      t,
      e,
      s,
      1
    );
  }
  static MakeRotation(t, e, s, n) {
    const r = new i(e, s, n);
    r.normalize();
    var a = Math.cos(t), o = 1 - a, l = Math.sin(t);
    return new d(
      r.x * r.x * o + a,
      r.x * r.y * o + r.z * l,
      r.x * r.z * o - r.y * l,
      0,
      r.y * r.x * o - r.z * l,
      r.y * r.y * o + a,
      r.y * r.z * o + r.x * l,
      0,
      r.z * r.x * o + r.y * l,
      r.z * r.y * o - r.x * l,
      r.z * r.z * o + a,
      0,
      0,
      0,
      0,
      1
    );
  }
  static MakeScale(t, e, s) {
    return t instanceof z && t.length >= 3 && (e = t[1], s = t[2], t = t[0]), new d(
      t,
      0,
      0,
      0,
      0,
      e,
      0,
      0,
      0,
      0,
      s,
      0,
      0,
      0,
      0,
      1
    );
  }
  static MakePerspective(t, e, s, n) {
    return new d().perspective(t, e, s, n);
  }
  static MakeFrustum(t, e, s, n, r, a) {
    return new d().frustum(t, e, s, n, r, a);
  }
  static MakeOrtho(t, e, s, n, r, a) {
    return new d().ortho(t, e, s, n, r, a);
  }
  static MakeLookAt(t, e, s) {
    return new d().lookAt(t, e, s);
  }
  // Other static methods
  static Mult(t, e) {
    return new d(t).mult(e);
  }
  static Unproject(t, e, s, n, r, a) {
    let o = new d(r);
    o.mult(n), o.invert();
    const l = new i(
      (t - a.y) / a.width * 2 - 1,
      (e - a.x) / a.height * 2 - 1,
      s * 2 - 1,
      1
    ), u = new Vec4(o.multVector(l));
    return u.z == 0 ? u.set(0) : u.set(
      u.x / u.w,
      u.y / u.w,
      u.z / u.w,
      u.w / u.w
    ), u;
  }
  static GetScale(t) {
    return new i(
      i.Magnitude([t[1], t[5], t[9]]),
      i.Magnitude([t[0], t[4], t[8]]),
      i.Magnitude([t[2], t[6], t[10]])
    );
  }
  static GetRotation(t) {
    const e = d.GetScale(t);
    return new d(
      t[0] / e.x,
      t[1] / e.y,
      t[2] / e.z,
      0,
      t[4] / e.x,
      t[5] / e.y,
      t[6] / e.z,
      0,
      t[8] / e.x,
      t[9] / e.y,
      t[10] / e.z,
      0,
      0,
      0,
      0,
      1
    );
  }
  static GetPosition(t) {
    return new i(t[12], t[13], t[14]);
  }
  static GetInverted(t) {
    const e = new d(t);
    return e.invert(), e;
  }
  static GetNormalMatrix(t) {
    return new d(t).invert().traspose().mat3;
  }
  static Equals(t, e) {
    return t[0] == e[0] && t[1] == e[1] && t[2] == e[2] && t[3] == e[3] && t[4] == e[4] && t[5] == e[5] && t[6] == e[6] && t[7] == e[7] && t[8] == e[8] && t[9] == e[9] && t[10] == e[10] && t[11] == e[11] && t[12] == e[12] && t[13] == e[13] && t[14] == e[14] && t[15] == e[15];
  }
  static TransformDirection(t, e) {
    const s = new i(e), n = new d(t);
    return n.setRow(3, new i(0, 0, 0, 1)), s.assign(n.multVector(s).xyz), s.normalize(), s;
  }
  static IsNan() {
    return isNaN(this[0]) || isNaN(this[1]) || isNaN(this[2]) || isNaN(this[3]) || isNaN(this[4]) || isNaN(this[5]) || isNaN(this[6]) || isNaN(this[7]) || isNaN(this[8]) || isNaN(this[9]) || isNaN(this[10]) || isNaN(this[11]) || isNaN(this[12]) || isNaN(this[13]) || isNaN(this[14]) || isNaN(this[15]);
  }
  static IsZero(t) {
    return c(t[0]) && c(t[1]) && c(t[2]) && c(t[3]) && c(t[4]) && c(t[5]) && c(t[6]) && c(t[7]) && c(t[8]) && c(t[9]) && c(t[10]) && c(t[11]) && c(t[12]) && c(t[13]) && c(t[14]) && c(t[15]);
  }
  static IsIdentity(t) {
    return g(t[0], 1) && g(t[1], 0) && g(t[2], 0) && g(t[3], 0) && g(t[4], 0) && g(t[5], 1) && g(t[6], 0) && g(t[7], 0) && g(t[8], 0) && g(t[9], 0) && g(t[10], 1) && g(t[11], 0) && g(t[12], 0) && g(t[13], 0) && g(t[14], 0) && g(t[15], 1);
  }
}
const yt = "@asicupv/paella-webgl-plugins", xt = "2.0.0-beta.0", It = { ".": "./dist/paella-webgl-plugins.js", "./*": "./src/*", "./paella-webgl-plugins.css": "./dist/paella-webgl-plugins.css" }, Nt = "A plugin to zoom videos for Paella Player", Tt = "./dist/paella-webgl-plugins.js", zt = "module", Rt = "./dist/paella-webgl-plugins.js", At = { dev: "vite", build: "vite build --emptyOutDir" }, $t = ["dist/paella-webgl-plugins.js"], Pt = { type: "git", url: "git+https://github.com/polimediaupv/paella-webgl-plugins.git" }, Dt = ["paella", "player", "zoom", "slide", "presentation", "blackboard", "whiteboard"], Ct = "Fernando Serrano Carpena <ferserc1@gmail.com>", Mt = "SEE LICENSE IN license.txt", St = { url: "https://github.com/polimediaupv/paella-webgl-plugins/issues" }, kt = "https://github.com/polimediaupv/paella-webgl-plugins#readme", Bt = { vite: "^6.0.11" }, Lt = { "@asicupv/paella-core": "^2.0.0-beta.4" }, Ut = {
  name: yt,
  version: xt,
  exports: It,
  description: Nt,
  main: Tt,
  type: zt,
  module: Rt,
  scripts: At,
  files: $t,
  repository: Pt,
  keywords: Dt,
  author: Ct,
  license: Mt,
  bugs: St,
  homepage: kt,
  devDependencies: Bt,
  dependencies: Lt
};
let O = null;
class _ extends rt {
  static Get() {
    return O || (O = new _()), O;
  }
  get moduleName() {
    return "paella-webgl-plugins";
  }
  get moduleVersion() {
    return Ut.version;
  }
}
const Ft = `
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
`, Gt = `
precision highp float;
uniform sampler2D uVideoTexture;

varying vec2 fsTexCoord;

void main() {
    gl_FragColor = texture2D(uVideoTexture,fsTexCoord);
}
`, Ot = (h, t = !1) => {
  h.parentNode.removeChild(h), document.body.appendChild(h), h.style.position = "fixed", h.style.width = "100px", h.style.height = "50px", h.style.top = "0px", h.style.left = "0px", t || (h.style.display = "none");
};
class Zt extends nt {
  constructor(t, e, s) {
    super("canvas", t, e), this.config = s, this.maxZoom = s.maxZoom ?? 3, this.minZoom = s.minZoom ?? 0.3, this.speedX = s.speedX ?? 1, this.speedY = s.speedY ?? 1;
    let n = [0, 0], r = !1;
    this._pitch = 0, this._yaw = 0;
    let a = [0, 0];
    this.element.addEventListener("mousedown", (o) => {
      r = !0, n = [o.clientX, o.clientY], a = [o.clientX, o.clientY], o.stopPropagation();
    }), this.element.addEventListener("click", (o) => {
      o.stopPropagation();
    }), this.element.addEventListener("mouseup", async (o) => {
      a[0] == o.clientX && a[1] == o.clientY && (await t.paused() ? t.play() : t.pause()), r = !1, o.stopPropagation();
    }), this.element.addEventListener("wheel", (o) => {
      this.currentZoom += o.deltaY / 1e3, this.currentZoom > this.maxZoom ? this.currentZoom = this.maxZoom : this.currentZoom < this.minZoom && (this.currentZoom = this.minZoom), o.stopPropagation(), o.preventDefault();
    }), this.element.addEventListener("mouseout", (o) => {
      r = !1, o.stopPropagation();
    }), this.element.addEventListener("mousemove", (o) => {
      if (t.showUserInterface(), r) {
        const l = [o.clientX, o.clientY], u = [n[0] - l[0], n[1] - l[1]];
        n = l, this._yaw += u[0] * 4e-3 * this.speedX, this._pitch += u[1] * 4e-3 * this.speedY, this._yaw > 2 * Math.PI ? this._yaw = this._yaw - 2 * Math.PI : this._yaw < 0 && (this._yaw = 2 * Math.PI + this._yaw), this._pitch > Math.PI / 2 ? this._pitch = Math.PI / 2 : this._pitch <= -Math.PI / 2 && (this._pitch = -Math.PI / 2);
      }
      o.stopPropagation();
    });
  }
  async loadCanvas(t) {
    this.currentZoom = 1, this._videoPlayer = t, t.element.style.width = "100%", t.element.style.height = "100%", t.element.style.position = "absolute", t.element.style.top = "0", t.element.style.left = "0", this.element.style.overflow = "hidden", this.element.style.position = "relative", this._videoPlayer = t, t.element.crossOrigin = "", Ot.apply(this, [t.element, !1]), this._webGLCanvas = new at(this.element), await this._webGLCanvas.init({ clearColor: [0.2, 0.3, 0.8, 1] });
    const { gl: e } = this._webGLCanvas, s = new wt(e, t.element), n = new ct(e, {
      vertex: Ft,
      fragment: Gt,
      attribs: ["inVertexPos", "inTexCoord"],
      uniforms: ["uView", "uProj", "uVideoTexture"]
    }), r = pt(30), a = new dt(e, r.positions, r.uvs, r.triangles), o = this.element, l = () => {
      const u = o.clientWidth, p = o.clientHeight, m = 45 * this.currentZoom, f = u / p, b = d.MakePerspective(m, isNaN(f) ? 16 / 9 : f, 0.01, 10), y = d.MakeIdentity(), E = d.MakeRotation(this._yaw, 0, 1, 0);
      E.rotate(this._pitch, 1, 0, 0), s.updateTexture(), o.width = u, o.height = p, e.viewport(0, 0, u, p), e.clear(e.COLOR_BUFFER_BIT), n.useProgram(), n.enablePositionArray("inVertexPos", a), n.enableTexCoordArray("inTexCoord", a), n.bindMatrix4("uView", d.Mult(E, y)), n.bindMatrix4("uProj", b), n.bindTexture("uVideoTexture", s.texture), a.draw(), requestAnimationFrame(l);
    };
    l();
  }
}
let q = class extends ht {
  getPluginModuleInstance() {
    return _.Get();
  }
  get name() {
    return super.name || "es.upv.paella.video360Canvas";
  }
  get canvasType() {
    return "video360";
  }
  isCompatible(t) {
    var e;
    return (e = t.canvas) != null && e.find((s) => s == this.canvasType) ? !0 : super.isCompatible(t);
  }
  getCanvasInstance(t) {
    return new Zt(this.player, t, this.config);
  }
};
const _t = [
  {
    plugin: q,
    config: {
      enabled: !1
    }
  }
], Yt = q;
export {
  Yt as Video360CanvasPlugin,
  _t as webglPlugins
};
