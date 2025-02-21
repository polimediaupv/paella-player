var dt = (n) => {
  throw TypeError(n);
};
var ht = (n, e, t) => e.has(n) || dt("Cannot " + t);
var d = (n, e, t) => (ht(n, e, "read from private field"), t ? t.call(n) : e.get(n)), T = (n, e, t) => e.has(n) ? dt("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), I = (n, e, t, i) => (ht(n, e, "write to private field"), i ? i.call(n, t) : e.set(n, t), t);
const g = Object.freeze({
  PLAY: "paella:play",
  PAUSE: "paella:pause",
  STOP: "paella:stop",
  ENDED: "paella:ended",
  SEEK: "paella:seek",
  FULLSCREEN_CHANGED: "paella:fullscreenchanged",
  ENTER_FULLSCREEN: "paella:enterfullscreen",
  EXIT_FULLSCREEN: "paella:exitfullscreen",
  VOLUME_CHANGED: "paella:volumeChanged",
  TIMEUPDATE: "paella:timeupdate",
  TRIMMING_CHANGED: "paella:trimmingChanged",
  CAPTIONS_CHANGED: "paella:captionsChanged",
  CAPTIONS_ENABLED: "paella:captionsEnabled",
  CAPTIONS_DISABLED: "paella:captionsDisabled",
  BUTTON_PRESS: "paella:buttonPress",
  SHOW_POPUP: "paella:showPopUp",
  HIDE_POPUP: "paella:hidePopUp",
  MANIFEST_LOADED: "paella:manifestLoaded",
  STREAM_LOADED: "paella:streamLoaded",
  PLAYER_LOADED: "paella:playerLoaded",
  PLAYER_UNLOADED: "paella:playerUnloaded",
  RESIZE: "paella:resize",
  RESIZE_END: "paella:resizeEnd",
  LAYOUT_CHANGED: "paella:layoutChanged",
  PLAYBACK_RATE_CHANGED: "paella:playbackRateChanged",
  VIDEO_QUALITY_CHANGED: "paella:videoQualityChanged",
  HIDE_UI: "paella:hideUI",
  SHOW_UI: "paella:showUI",
  COOKIE_CONSENT_CHANGED: "paella:cookieConsentChanged",
  LOG: "paella:log"
});
function A(n, e, t, i = !0) {
  return n.__eventListeners__ = n.__eventListeners__ || {}, Array.isArray(e) || (e = [e]), e.forEach((s) => {
    n.__eventListeners__[s] = n.__eventListeners__[s] || [], n.__eventListeners__[s].push({
      callback: t,
      unregisterOnUnload: i
    });
  }), t;
}
function E(n, e, t = {}) {
  n.__eventListeners__ && n.__eventListeners__[e] && n.__eventListeners__[e].forEach((i) => i.callback(t));
}
function se(n, e, t = {}) {
  n.ready && E(n, e, t);
}
function Li(n) {
  if (n.__eventListeners__)
    for (const e in n.__eventListeners__)
      n.__eventListeners__[e] = n.__eventListeners__[e].filter((t) => t.unregisterOnUnload == !1), n.log.debug("Unregister event: " + n.__eventListeners__[e]);
}
function Et(n) {
  return new Promise((e, t) => {
    fetch(n).then((i) => i.text()).then((i) => {
      e(i);
    }).catch((i) => t(i));
  });
}
function St(n) {
  const e = new URLSearchParams(window.location.search);
  return e.has(n) ? e.get(n) : null;
}
function Tt(n) {
  const e = window.location.hash.replace("#", "?"), t = new URLSearchParams(e);
  return t.has(n) ? t.get(n) : null;
}
function G(n, e) {
  const t = e || "/";
  return n = n.map((i, s) => (s && (i = i.replace(new RegExp("^" + t), "")), s !== n.length - 1 && (i = i.replace(new RegExp(t + "$"), "")), i)), n.join(t);
}
function It(n) {
  return new RegExp("^([a-z]+://|//)", "i").test(n) || /^\//.test(n);
}
function Ae(n) {
  try {
    return new URL(n).pathname.split("/").pop();
  } catch {
    return n.split("/").pop();
  }
}
function kt(n) {
  return n.split(".").reduce((e, t, i, s) => i < s.length - 1 ? e !== "" ? `${e}.${t}` : t : e, "");
}
function Ke(n) {
  const e = (t) => {
    const i = t.split("/").reduce((s, a, r, o) => r < o.length - 1 ? s !== "" ? `${s}/${a}` : a : s, "");
    return (t[0] === "/" ? `/${i}` : i) + "/";
  };
  try {
    const t = new URL(n);
    return t.origin + e(t.pathname);
  } catch {
    return e(n);
  }
}
function Je(n) {
  return Ae(n).split(".").pop();
}
function Z(n, e) {
  return It(e) ? e : G([n.manifestUrl, e]);
}
function Dt(n) {
  n.__hideTimerPaused__ = !0;
}
function xt(n) {
  n.__hideTimerPaused__ = !1;
}
function At(n, e = "hideUiTime") {
  var a;
  n.__hideTimer__ = null;
  const t = async () => n.__hideTimerPaused__ ? (n.log.debug("UI not hidden because the auto hide timer is paused"), !1) : i() ? (n.log.debug("UI not hidden because there is a focused element"), !1) : (await n.hideUserInterface(), !0);
  (a = n.config.ui) != null && a.hideOnMouseLeave && n.containerElement.addEventListener("mouseleave", () => {
    t();
  });
  const i = () => {
    const r = document.activeElement;
    return (n.playbackBar.element.contains(r) || n.videoContainer.element.contains(r)) && [
      "input",
      "textarea",
      "button"
    ].find((o) => r.tagName.toLowerCase(o)) !== -1;
  }, s = async () => {
    n.__hideTimer__ && clearTimeout(n.__hideTimer__), await n.showUserInterface(), n.__hideTimer__ = setTimeout(async () => {
      n.__hideTimer__ = null, t() || s();
    }, n[e]);
  };
  n.containerElement.addEventListener("mousemove", async (r) => {
    s();
  }), A(n, g.PLAY, async () => {
    s();
  }), A(n, g.PAUSE, async () => {
    await n.showUserInterface();
  }), A(n, g.ENDED, async () => {
    await n.showUserInterface();
  }), document.addEventListener("keydown", async () => {
    s();
  });
}
function Mt(n) {
  n.__hideTimer__ && (clearTimeout(n.__hideTimer__), delete n.__hideTimer__);
}
function ie(n) {
  const e = Math.floor(n / 60 / 60), t = Math.floor(n / 60) - e * 60, i = Math.floor(n % 60);
  return (e > 0 ? e.toString().padStart(2, "0") + ":" : "") + t.toString().padStart(2, "0") + ":" + i.toString().padStart(2, "0");
}
function xe(n) {
  const t = /^(?:(\d+):){0,1}(\d+):(\d+)(\.\d+)?$/.exec(n);
  if (t) {
    const i = t[1] !== void 0 ? Number(t[1]) : 0, s = Number(t[2]), a = Number(t[3]);
    return i * 3600 + s * 60 + a;
  }
  return null;
}
function qe(n) {
  const t = /^(?:(\d+):){0,1}(\d+):(\d+)\.(\d+)?$/.exec(n);
  if (t) {
    const i = t[1] !== void 0 ? Number(t[1]) : 0, s = Number(t[2]), a = Number(t[3]), r = t[4] && Number(t[4]) || 0;
    return i * 36e5 + s * 6e4 + a * 1e3 + r;
  }
  return null;
}
function ne(n, e, t = 365) {
  let i = /* @__PURE__ */ new Date();
  i.setTime(i.getTime() + t * 24 * 60 * 60 * 1e3);
  let s = `expires=${i.toUTCString()}`;
  document.cookie = `${n}=${e};${s};path=/;SameSite=None;` + (/Apple/.test(navigator.vendor) ? "" : "Secure;");
}
function Rt(n, e, t, i, s = 365) {
  n.cookieConsent.getConsentForType(e) && ne(t, i, s);
}
function Y(n) {
  let e = n + "=", i = decodeURIComponent(document.cookie).split(";");
  for (let s = 0; s < i.length; ++s) {
    let a = i[s];
    for (; a.charAt(0) == " "; )
      a = a.substring(1);
    if (a.indexOf(e) == 0)
      return a.substring(e.length, a.length);
  }
  return "";
}
function Pi(n) {
  const e = Y(n), t = Number(e);
  return e !== "" && !isNaN(t) ? t : null;
}
function Ei(n) {
  try {
    return JSON.parse(Y(n));
  } catch {
    return null;
  }
}
function Xe(n, e = !0) {
  return new Promise((t) => {
    const i = document.createElement("link");
    i.setAttribute("rel", "stylesheet"), i.setAttribute("href", n), i.onload = () => t(i);
    const s = document.getElementsByTagName("head")[0];
    e && s.appendChild(i), t();
  });
}
function Vt(n) {
  document.getElementsByTagName("head")[0].removeChild(n);
}
function we(n, e, t = !0) {
  for (const i in e) {
    const s = n[i];
    let a = e[i];
    t && Array.isArray(s) && Array.isArray(a) ? (s.forEach((r) => {
      a = a.filter((o) => typeof r == "object" && typeof o == "object" && r.id === o.id ? (we(r, o, t), !1) : !0);
    }), a.forEach((r) => {
      s.push(r);
    })) : typeof s == "object" && a ? we(s, a, t) : n[i] = e[i];
  }
}
function Nt(n, { excludedTags: e = null } = {}) {
  const t = document.createElement("div");
  t.innerHTML = n;
  const i = ["script"];
  return e && i.push(...e), i.flatMap((s) => Array.from(t.getElementsByTagName(s))).forEach((s) => {
    s.parentElement.removeChild(s);
  }), t.innerHTML;
}
let De = null;
function et(n) {
  if (!n) return !1;
  De || (De = document.createElement("video"));
  let e = De.canPlayType(n);
  if (e === "maybe" || e === "probably")
    return !0;
  if (/video\/mp4/i.test(n))
    return e = De.canPlayType("video/mp4"), e === "maybe" || e === "probably";
}
const oa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clearAutoHideTimer: Mt,
  getCookie: Y,
  getFileExtension: Je,
  getHashParameter: Tt,
  getJSONCookie: Ei,
  getNumericCookie: Pi,
  getUrlFileName: Ae,
  getUrlParameter: St,
  isAbsoluteUrl: It,
  joinPath: G,
  loadStyle: Xe,
  loadSvgIcon: Et,
  mergeObjects: we,
  pauseAutoHideUiTimer: Dt,
  removeExtension: kt,
  removeFileName: Ke,
  resolveResourcePath: Z,
  resumeAutoHideUiTimer: xt,
  sanitizeHTML: Nt,
  secondsToTime: ie,
  setCookie: ne,
  setCookieIfAllowed: Rt,
  setupAutoHideUiTimer: At,
  supportsVideoType: et,
  timeToMilliseconds: qe,
  timeToSeconds: xe,
  unloadStyle: Vt
}, Symbol.toStringTag, { value: "Module" }));
async function Si(n, e) {
  return e.log.debug("Using default configuration loading function."), (await fetch(n)).json();
}
async function Ti(n, e) {
  return e.log.debug("Using default getVideoId function"), Tt("id") || St("id") || n.fallbackId;
}
async function Ii(n, e, t, i) {
  return i.log.debug("Using default getManifestUrl function"), G([n, e]);
}
async function ki(n, e, t, i) {
  return i.log.debug("Using default getManifestFileUrl function"), G([n, e]);
}
async function Di(n, e, t) {
  t.log.debug("Using default loadVideoManifest function");
  const i = await fetch(n);
  if (i.ok)
    return await i.json();
  throw new Error(t.translate("Error loading video manifest: $1 $2", [i.status, i.statusText]));
}
var be;
class de {
  constructor(e) {
    T(this, be, null);
    I(this, be, e);
  }
  get player() {
    return d(this, be);
  }
}
be = new WeakMap();
function Ut({ tag: n = "div", attributes: e = {}, children: t = "", innerText: i = "", parent: s = null }) {
  const a = document.createElement(n);
  a.innerText = i;
  for (let r in e)
    a.setAttribute(r, e[r]);
  return a.innerHTML = t, s && s.appendChild(a), a;
}
function L(n, e = null) {
  const t = document.createElement("div");
  t.innerHTML = n;
  const i = t.children[0];
  return e && e.appendChild(i), i;
}
var V;
class z extends de {
  constructor(t, { tag: i = "div", attributes: s = [], children: a = "", parent: r = null }) {
    super(t);
    T(this, V, null);
    I(this, V, Ut({ tag: i, attributes: s, children: a, parent: r })), Object.defineProperty(this, i, {
      get: () => d(this, V)
    });
  }
  get element() {
    return d(this, V);
  }
  get parent() {
    return d(this, V).parentElement;
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
  setAttribute(t, i) {
    d(this, V).setAttribute(t, i);
  }
  removeFromParent() {
    var t;
    (t = d(this, V).parentElement) == null || t.removeChild(d(this, V));
  }
  setParent(t) {
    this.removeFromParent(), t.appendChild(d(this, V));
  }
}
V = new WeakMap();
const xi = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(1,0,0,1,3,-3.88857)">
        <path d="M128,35.819C65.633,35.819 14.999,86.453 14.999,148.82C14.999,163.127 17.663,176.817 22.549,189.403L22.475,189.447C11.612,170.791 5.889,149.588 5.889,128C5.889,60.56 60.56,5.889 128,5.889L128,35.819Z" style="fill:url(#_Linear1);"/>
    </g>
    <g transform="matrix(-1,1.22465e-16,-1.22465e-16,-1,258,251.914)">
        <path d="M128,35.819C65.633,35.819 14.999,86.453 14.999,148.82C14.999,163.127 17.663,176.817 22.549,189.403L22.475,189.447C11.612,170.791 5.889,149.588 5.889,128C5.889,60.56 60.56,5.889 128,5.889L128,35.819Z" style="fill:url(#_Linear2);"/>
    </g>
    <defs>
        <linearGradient id="_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-89.3028,140.734,-140.734,-89.3028,144.417,48.7125)"><stop offset="0" style="stop-color:rgb(13,13,13);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(175,175,175);stop-opacity:0.5"/></linearGradient>
        <linearGradient id="_Linear2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-89.3028,140.734,-140.734,-89.3028,144.417,48.7125)"><stop offset="0" style="stop-color:rgb(13,13,13);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(175,175,175);stop-opacity:0.5"/></linearGradient>
    </defs>
</svg>
`;
class Ai extends z {
  constructor(e) {
    super(e, { parent: e.containerElement }), this.element.className = "loader-container";
  }
  async create() {
    L(`<i>${xi}</i>`, this.element);
  }
  get debug() {
    return !1;
  }
}
const Mi = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g id="Cancel" transform="matrix(5.54545,6.8353e-32,6.8353e-32,5.54545,-2567.37,-10735.5)">
        <path d="M486.05,1937C498.192,1937 508.05,1946.86 508.05,1959C508.05,1971.14 498.192,1981 486.05,1981C473.908,1981 464.05,1971.14 464.05,1959C464.05,1946.86 473.908,1937 486.05,1937ZM478.979,1950.52L477.565,1951.93L484.636,1959L477.565,1966.07L478.979,1967.49L486.05,1960.41L493.121,1967.49L494.535,1966.07L487.464,1959L494.535,1951.93L493.121,1950.52L486.05,1957.59L478.979,1950.52Z" style="fill:rgb(210,0,0);"/>
    </g>
</svg>
`;
class $e extends z {
  constructor(e, t = "") {
    super(e, { parent: e.containerElement }), this.element.className = "error-container", L(`
            <div>
                <i>${Mi}</i>
                <p>${t}</p>
            </div>`, this.element);
  }
}
class he extends de {
  constructor(e, t) {
    super(e), this._name = t;
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
    var e;
    return ((e = this._config) == null ? void 0 : e.order) || 0;
  }
  get description() {
    var e;
    return ((e = this._config) == null ? void 0 : e.description) || "";
  }
  get name() {
    return this._name;
  }
  async isEnabled() {
    var e;
    return (e = this.config) == null ? void 0 : e.enabled;
  }
  async load() {
  }
  async unload() {
  }
}
class Ne extends he {
  get type() {
    return "video";
  }
  get streamType() {
    return "mp4";
  }
  async isCompatible() {
    return !1;
  }
  async getVideoInstance() {
    return null;
  }
  getCompatibleFileExtensions() {
    return [];
  }
  getManifestData(e) {
  }
}
const Me = [];
async function Ri(n) {
  await $(n, "video", (e) => {
    Me.push(e);
  });
}
async function Vi(n) {
  Me.slice(0);
}
function Ft(n) {
  if (Me.length === 0)
    throw Error("No video plugins loaded. Note that `loadVideoPlugins()` must to be called before using `getVideoPlugins()`.");
  return Me;
}
function Ni(n, e) {
  const t = Je(e);
  return Ft().find((s) => s.getCompatibleFileExtensions().indexOf(t) !== -1);
}
async function Ui(n, e) {
  const t = Ft();
  let i = null;
  for (const s of t)
    if (await s.isCompatible(e)) {
      i = s;
      break;
    }
  return i;
}
async function Fi() {
  return await new Promise((e) => {
    const t = document.createElement("audio"), i = setTimeout(() => e(!1), 100);
    t.addEventListener("volumechange", (s) => {
      clearTimeout(i), e(!0);
    }), t.volume = 0.5;
  });
}
class tt extends z {
  constructor(e, t, i) {
    const s = {
      class: "video-player"
    };
    super(t, { tag: e, attributes: s, parent: i }), this._streamProvider = null, this._streamData = null, this._ready = !1;
  }
  async isVolumeApiAvailable() {
    return await Fi();
  }
  get streamData() {
    return this._streamData;
  }
  get ready() {
    return this._ready;
  }
  async load(e, t) {
    return this._streamProvider = t, this._streamData = e, await this.loadStreamData(e);
  }
  get isMainAudioPlayer() {
    return this._streamProvider.mainAudioPlayer === this;
  }
  // The player must call _videoEndedCallback when the video is ended
  onVideoEnded(e) {
    this._videoEndedCallback = e;
  }
  // The video instance must implement the following functions and properties
  async play() {
    return !1;
  }
  async pause() {
    return !1;
  }
  async duration() {
    return -1;
  }
  get currentTimeSync() {
    return -1;
  }
  async currentTime() {
    return -1;
  }
  async setCurrentTime() {
    return !1;
  }
  async volume() {
    return -1;
  }
  async setVolume() {
    return !1;
  }
  initVolume(e) {
    this._initialVolume = e;
  }
  async paused() {
    return !0;
  }
  async playbackRate() {
    return -1;
  }
  async setPlaybackRate() {
    return !1;
  }
  async getQualities() {
    return null;
  }
  async setQuality() {
    return !1;
  }
  get currentQuality() {
    return null;
  }
  async getDimensions() {
    return null;
  }
  async supportsMultiaudio() {
    return !1;
  }
  async getAudioTracks() {
    return null;
  }
  async setCurrentAudioTrack() {
  }
  get currentAudioTrack() {
    return null;
  }
  async loadStreamData(e) {
    return !1;
  }
  get isEnabled() {
    return this._enabled;
  }
  async enable() {
    this._enabled = !0;
  }
  async disable() {
    this._enabled = !1;
  }
}
class Ue extends de {
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
const Oi = "@asicupv/paella-core", $i = { ".": "./dist/paella-core.js", "./src/": "./src/", "./paella-core.css": "./dist/paella-core.css" }, Bi = "2.0.4", Gi = "Multi stream HTML video player", zi = "./dist/paella-core.js", Hi = ["dist/paella-core.css", "dist/paella-core.js", "dist/paella-core.umd.cjs", "dist/paella-core.js.map", "dist/paella-core.umd.cjs.map"], ji = "./dist/paella-core.js", Wi = "module", qi = { dev: "vite build --watch", build: "vite build --emptyOutDir" }, Qi = { type: "git", url: "git+https://github.com/polimediaupv/paella-player.git" }, Yi = ["html", "player", "video", "hls"], Zi = "Fernando Serrano Carpena <ferserc1@gmail.com>", Ki = "ECL-2.0", Ji = { url: "https://github.com/polimediaupv/paella-player/issues" }, Xi = "https://github.com/polimediaupv/paella-player#readme", en = { vite: "^6.0.11" }, tn = { "@ferserc1/input-style-unifier": "^0.0.2" }, Te = {
  name: Oi,
  exports: $i,
  version: Bi,
  description: Gi,
  main: zi,
  files: Hi,
  module: ji,
  type: Wi,
  scripts: qi,
  repository: Qi,
  keywords: Yi,
  author: Zi,
  license: Ki,
  bugs: Ji,
  homepage: Xi,
  devDependencies: en,
  dependencies: tn
};
let Be = null;
class pe extends Ue {
  static Get() {
    return Be || (Be = new pe()), Be;
  }
  get moduleName() {
    return "paella-core default video formats";
  }
  get moduleVersion() {
    return Te.version;
  }
}
function nn(n) {
  return new Promise((e, t) => {
    const i = new Image();
    i.addEventListener("load", (s) => {
      e(i);
    }), i.addEventListener("error", (s) => {
      t(new Error("Could not load preview image. The preview image is required in audio only streams"));
    }), i.src = n;
  });
}
function sn(n, e, t) {
  return new Promise((i, s) => {
    e.oncanplay = () => i(), e.onerror = () => s(new Error(n.translate("Error loading audio: $1", [t]))), e.src = Z(n, t), i();
  });
}
class an extends tt {
  constructor(e, t, i) {
    super("audio", e, t), this.isMainAudio = i, this._ready = !1;
  }
  get streamType() {
    return "audio";
  }
  waitForLoaded() {
    return new Promise((e) => {
      const t = () => {
        this._ready ? e() : setTimeout(t, 100);
      };
      t();
    });
  }
  async play() {
    await this.waitForLoaded(), this.audio.play();
  }
  async pause() {
    await this.waitForLoaded(), this.audio.pause();
  }
  async duration() {
    return await this.waitForLoaded(), this.audio.duration;
  }
  get currentTimeSync() {
    var e;
    return ((e = this.audio) == null ? void 0 : e.currentTime) || 0;
  }
  async currentTime() {
    return await this.waitForLoaded(), this.audio.currentTime;
  }
  async setCurrentTime(e) {
    await this.waitForLoaded(), this.audio.currentTime = e;
  }
  async volume() {
    return await this.waitForLoaded(), this.audio.volume;
  }
  async setVolume(e) {
    await this.waitForLoaded(), this.audio.volume = e;
  }
  async paused() {
    return await this.waitForLoaded(), this.audio.paused;
  }
  async playbackRate() {
    return await this.waitForLoaded(), this.audio.playbackRate;
  }
  async setPlaybackRate(e) {
    await this.waitForLoaded(), this.audio.playbackRate = e;
  }
  // getQualities(), setQuality(q), get currentQuality(): audio format does not support multiquality
  async getDimensions() {
    return {
      w: this._previewImage.width,
      h: this._previewImage.height
    };
  }
  async loadStreamData(e = null) {
    this._streamData = this._streamData || e, this.player.log.debug("es.upv.paella.audioVideoFormat: loadStreamData");
    const t = this.player.videoManifest.metadata.preview;
    if (!t || t == null)
      throw new Error("Invalid video manifest data: preview image is required");
    if (this._previewImage = await nn(t), this._imageContainer = document.createElement("div"), this._imageContainer.className = "image-container", this.parent.appendChild(this._imageContainer), this._imageContainer.appendChild(this._previewImage), this._source = e.sources.audio && e.sources.audio[0], !this._source)
      throw new Error("Invalid source in audio only video stream");
    if (!this.isMainAudioPlayer)
      throw new Error("Audio only video stream must be main audio player. Check the role property at video manifest");
    await sn(this.player, this.audio, this._source.src);
    const i = () => {
      const s = this.player.videoContainer.baseVideoRect.offsetWidth / this.player.videoContainer.baseVideoRect.offsetHeight, a = this._previewImage.width / this._previewImage.height;
      s > a ? (this._previewImage.classList.add("landscape"), this._previewImage.classList.remove("portrait")) : (this._previewImage.classList.add("portrait"), this._previewImage.classList.remove("landscape"));
    };
    this.player.frameList.frames.length > 0 && this.audio.addEventListener("timeupdate", (s) => {
      const a = this.player.frameList.getImage(s.target.currentTime, !0);
      this._previewImage.src != a.url && (this._previewImage.src = a.url, this._previewImage.onload = () => i());
    }), window.addEventListener("resize", (s) => i()), i(), this._ready = !0;
  }
}
class rn extends Ne {
  getPluginModuleInstance() {
    return pe.Get();
  }
  get name() {
    return super.name || "es.upv.paella.audioVideoFormat";
  }
  get streamType() {
    return "audio";
  }
  async isCompatible(e) {
    return e.sources.audio != null;
  }
  async getVideoInstance(e, t) {
    return new an(this.player, e, t);
  }
  getCompatibleFileExtensions() {
    return ["m4a", "mp3"];
  }
  getManifestData(e) {
    return {
      audio: e.map((t) => ({
        src: t
      }))
    };
  }
}
class Ot extends tt {
  constructor(e, t, i, s) {
    super("video", e, t), this._config = s || {};
    const a = this._config.crossOrigin ?? "";
    this.element.setAttribute("playsinline", ""), a !== !1 && this.element.setAttribute("crossorigin", a), this.isMainAudio = i, this.element.setAttribute("autoplay", ""), this.element.autoplay = !0, i || (this.element.muted = !0), this._videoEnabled = !0;
  }
  async play() {
    if (this._videoEnabled)
      try {
        return await this.waitForLoaded(), this.video.play();
      } catch {
      }
    else
      this._disabledProperties.paused = !1;
  }
  async pause() {
    if (this._videoEnabled)
      return await this.waitForLoaded(), this.video.pause();
    this._disabledProperties.paused = !0;
  }
  async duration() {
    return this._videoEnabled ? (await this.waitForLoaded(), this.video.duration) : this._disabledProperties.duration;
  }
  get currentTimeSync() {
    return this._videoEnabled ? this.ready ? this.video.currentTime : -1 : this._disabledProperties.currentTime;
  }
  async currentTime() {
    return this._videoEnabled ? (await this.waitForLoaded(), this.currentTimeSync) : this._disabledProperties.currentTime;
  }
  async setCurrentTime(e) {
    return this._videoEnabled ? (await this.waitForLoaded(), this.video.currentTime = e) : (this._disabledProperties.currentTime = e, e);
  }
  async volume() {
    return this._videoEnabled ? (await this.waitForLoaded(), this.video.volume) : this._disabledProperties.volume;
  }
  async setVolume(e) {
    return this._videoEnabled ? (await this.waitForLoaded(), e === 0 ? this.video.setAttribute("muted", "") : this.video.removeAttribute("muted"), this.video.volume = e) : (this._disabledProperties.volume = e, e);
  }
  async paused() {
    return this._videoEnabled ? (await this.waitForLoaded(), this.video.paused) : this._disabledProperties.paused;
  }
  async playbackRate() {
    return this._videoEnabled ? (await this.waitForLoaded(), await this.video.playbackRate) : this._disabledProperties.playbackRate;
  }
  async setPlaybackRate(e) {
    return this._videoEnabled ? (await this.waitForLoaded(), this.video.playbackRate = e) : (this._disabledProperties.playbackRate = e, e);
  }
  async getQualities() {
  }
  async setQuality() {
  }
  get currentQuality() {
    return 0;
  }
  async getDimensions() {
    return this._videoEnabled ? (await this.waitForLoaded(), { w: this.video.videoWidth, h: this.video.videoHeight }) : { w: this._disabledProperties.videoWidth, h: this._disabledProperties.videoHeight };
  }
  saveDisabledProperties(e) {
    this._disabledProperties = {
      duration: e.duration,
      volume: e.volume,
      videoWidth: e.videoWidth,
      videoHeight: e.videoHeight,
      playbackRate: e.playbackRate,
      paused: e.paused,
      currentTime: e.currentTime
    };
  }
  async loadStreamData(e = null) {
    this._streamData = this._streamData || e, this.player.log.debug("es.upv.paella.htmlVideoFormat: loadStreamData"), this._sources = e.sources.html, this._currentQuality = 0, this.isMainAudioPlayer || (this.video.muted = !0), this._sources.forEach(({ src: t, mimetype: i }) => {
      t = Z(this.player, t);
      const s = document.createElement("source");
      s.src = t, s.type = i, this.video.appendChild(s);
    }), this._endedCallback = this._endedCallback || (() => {
      typeof this._videoEndedCallback == "function" && this._videoEndedCallback();
    }), this.video.addEventListener("ended", this._endedCallback);
    try {
      await this.video.play();
    } catch {
    }
    await this.waitForLoaded(), this.player.log.debug(`es.upv.paella.htmlVideoFormat (${this.streamData.content}): video loaded and ready.`), this.saveDisabledProperties(this.video);
  }
  async clearStreamData() {
    this.video.src = "", this.video.removeEventListener("ended", this._endedCallback), this.video.removeEventListener("loadeddata", this._handleLoadedCallback), this._ready = !1;
  }
  get isEnabled() {
    return this._videoEnabled;
  }
  async enable() {
    this._videoEnabled = !0;
  }
  async disable() {
    return this.isMainAudio ? this.player.log.debug("video.disable() - the video is not disabled because it is the main audio source.") : this._videoEnabled = !1, this._videoEnabled;
  }
  waitForLoaded() {
    return new Promise((e, t) => {
      this.video.readyState >= 2 && (this._ready = !0), this.ready ? e() : (this._handleLoadedCallback = (i) => {
        this.video.readyState >= 2 && (this.video.pause(), this._ready = !0, e());
      }, this.video.addEventListener("loadeddata", this._handleLoadedCallback));
    });
  }
}
class on extends Ne {
  getPluginModuleInstance() {
    return pe.Get();
  }
  get name() {
    return super.name || "es.upv.paella.htmlVideoFormat";
  }
  get streamType() {
    return "html";
  }
  async isCompatible(e) {
    const { html: t } = e.sources;
    return t && t.some((i) => et(i.mimetype));
  }
  async getVideoInstance(e, t) {
    return new Ot(this.player, e, t, this.config);
  }
  getCompatibleFileExtensions() {
    return ["m4v", "mp4", "ogg", "webm", "ogv"];
  }
  getManifestData(e) {
    const t = (i) => {
      switch (Je(i)) {
        case "mp4":
        case "m4v":
          return "video/mp4";
        case "webm":
          return "video/webm";
        case "ogg":
        case "ogv":
          return "video/ogg";
        default:
          return null;
      }
    };
    return {
      html: e.map((i) => ({
        src: i,
        mimetype: t(i)
      }))
    };
  }
}
class ln {
  constructor({ label: e, shortLabel: t, isAuto: i = !1, index: s = 0, src: a = "", width: r = -1, height: o = -1, bitrate: l = -1 }) {
    this._label = e, this._shortLabel = t, this._index = s, this._src = a, this._res = {
      w: r,
      h: o
    }, this._bitrate = l, this._isAuto = i;
  }
  get label() {
    return this._label;
  }
  get shortLabel() {
    return this._shortLabel;
  }
  get index() {
    return this._index;
  }
  get src() {
    return this._src;
  }
  get res() {
    return this._res;
  }
  get bitrate() {
    return this._bitrate;
  }
  get isAuto() {
    return this._isAuto;
  }
  get quality() {
    return this._res.w !== -1 && this._res.h !== -1 ? this._res.w * this._res.h : this._bitrate;
  }
  compare(e) {
    return e.quality - this.quality;
  }
}
function $t(n) {
  let e = this._currentSource.frames[0];
  this._currentSource.frames.some((t) => {
    if (t.time <= this._currentTime)
      e = t;
    else
      return !0;
  }), this.img.src = e.src;
}
function cn() {
  this._startTimestamp = Date.now();
  const n = () => {
    this._timer = setTimeout(n, 250);
    const e = Date.now(), t = e - this._startTimestamp;
    this._currentTime += t / 1e3, this._startTimestamp = e, $t.apply(this, [this._currentTime]);
  };
  n();
}
function un() {
  this._timer && (clearTimeout(this._timer), this._timer = null);
}
class dn extends tt {
  constructor(e, t) {
    super("img", e, t), this._currentTime = 0, this._startTimesamp = 0, this._playbackRate = 1, this._timer = null, this.video = this.domElement;
  }
  async play() {
    cn.apply(this);
  }
  async pause() {
    un.apply(this);
  }
  async duration() {
    return this._currentSource.duration;
  }
  get currentTimeSync() {
    return this._currentTime;
  }
  async currentTime() {
    return this._currentTime;
  }
  async setCurrentTime(e) {
    this._currentTime = e, $t.apply(this, [e]);
  }
  async volume() {
    return 0;
  }
  async setVolume(e) {
  }
  async paused() {
    return this._timer === null;
  }
  async playbackRate() {
    return this._playbackRate;
  }
  async setPlaybackRate(e) {
    this._playbackRate = e;
  }
  async getQualities() {
    return this._qualities;
  }
  async setQuality() {
  }
  get currentQuality() {
    return this._currentQuality;
  }
  async getDimensions() {
    return this._currentSource.res;
  }
  async loadStreamData(e) {
    return this._sources = e.sources.image, this._qualities = this._sources.map((t) => new ln({
      src: t.frames[0].src,
      label: `${t.res.w}x${t.res.h}`,
      shortLabel: `${t.res.h}p`,
      width: t.res.w,
      height: t.res.h
    })), this._currentQuality = this._qualities.length - 1, this._qualities.forEach((t, i) => {
      this._qualities[this._currentQuality].compare(t) > 0 && (this._currentQuality = i);
    }), this._currentSource = this._sources[this._currentQuality], this._sources.forEach((t) => {
      t.frames.sort((i, s) => i.time - s.time);
    }), !0;
  }
}
class hn extends Ne {
  getPluginModuleInstance() {
    return pe.Get();
  }
  get name() {
    return super.name || "es.upv.paella.imageVideoFormat";
  }
  get streamType() {
    return "image";
  }
  async isCompatible(e) {
    return e.sources.image != null;
  }
  async getVideoInstance(e, t) {
    return new dn(this.player, e, this.config, t);
  }
}
class pn extends Ot {
  constructor(e, t, i, s) {
    super(e, t, i, s);
  }
  // This function is called when the player loads, and it should
  // make everything ready for video playback to begin.
  async loadStreamData(e = null) {
    this._streamData = this._streamData || e, this.player.log.debug("es.upv.paella.mp4VideoFormat: loadStreamData"), this._currentSource || (this._sources = null, this._currentQuality = 0, this._sources = e.sources.mp4, this._sources.sort((t, i) => Number(t.res.w) - Number(i.res.w)), this._currentQuality = this._sources.length - 1, this._currentSource = this._sources[this._currentQuality]), this.isMainAudioPlayer || (this.video.muted = !0), this._initialVolume && (this.video.volume = this._initialVolume, this._initialVolume === 0 && (this.video.muted = !0)), this.video.src = Z(this.player, this._currentSource.src), this._endedCallback = this._endedCallback || (() => {
      typeof this._videoEndedCallback == "function" && this._videoEndedCallback();
    }), this.video.addEventListener("ended", this._endedCallback);
    try {
      await this.video.play();
    } catch {
    }
    await this.waitForLoaded(), this.player.log.debug(`es.upv.paella.mp4VideoFormat (${this.streamData.content}): video loaded and ready.`), this.saveDisabledProperties(this.video);
  }
}
class gn extends Ne {
  getPluginModuleInstance() {
    return pe.Get();
  }
  get name() {
    return super.name || "es.upv.paella.mp4VideoFormat";
  }
  get streamType() {
    return "mp4";
  }
  isCompatible(e) {
    var i;
    const { mp4: t } = e.sources;
    return t && et((i = t[0]) == null ? void 0 : i.mimetype);
  }
  async getVideoInstance(e, t) {
    return new pn(this.player, e, t, this.config);
  }
  getCompatibleFileExtensions() {
    return ["m4v", "mp4"];
  }
  getManifestData(e) {
    return {
      mp4: e.map((t) => ({
        src: t,
        mimetype: "video/mp4"
      }))
    };
  }
}
async function mn(n) {
  const e = [];
  await $(n, "captions", async (t) => {
    e.push(t);
  });
  for (let t in e) {
    const s = await e[t].getCaptions(), a = n.captionsCanvas;
    s.forEach((r) => a.addCaptions(r));
  }
}
class Bt extends he {
  get type() {
    return "captions";
  }
  async load() {
    this.player.log.debug("load captions plugin");
  }
  async getCaptions() {
    return this.player.log.warn(`CaptionsPlugin ${this.name}: getCaptions() is not implemented.`), [];
  }
}
class Gt {
  get cues() {
    return this._cues;
  }
  get label() {
    return this._label;
  }
  get language() {
    return this._lang;
  }
  set label(e) {
    this._label = e;
  }
  set language(e) {
    this._lang = e;
  }
  constructor(e = "", t = "") {
    this._cues = [], this._label = e, this._lang = t;
  }
  addCue({ label: e = "", start: t, end: i, captions: s }) {
    const a = {
      label: e
    };
    if (typeof s == "string")
      a.captions = [s];
    else if (Array.isArray(s))
      a.captions = s;
    else
      throw Error("Invalid cue caption format: must be an array of strings or a string");
    if (typeof t == "string")
      a.start = xe(t), a.startString = t;
    else if (typeof t == "number")
      a.start = t, a.startString = ie(t);
    else
      throw Error("Invalid cue timestamp format: must be a valid time string or a number of seconds");
    if (typeof i == "string")
      a.end = xe(i), a.endString = i;
    else if (typeof i == "number")
      a.end = i, a.endString = ie(i);
    else
      throw Error("Invalid cue timestamp format: must be a valid time string or a number of seconds");
    return this._cues.push(a), a;
  }
  getCue(e) {
    if (typeof e == "string")
      e = xe(e);
    else if (typeof e != "number")
      throw Error("Invalid time instant format getting cue");
    let t = null;
    return this._cues.some((i) => {
      if (e >= i.start && e <= i.end)
        return t = i, !0;
    }), t;
  }
}
function pt(n, e) {
  const t = {}, s = new DOMParser().parseFromString(e, "text/xml");
  return Array.from(s.getElementsByTagName("div")).forEach((a) => {
    const r = a.getAttribute("xml:lang") || "unknonw";
    t[r] = t[r] || new Gt(n.translate(r), r), Array.from(a.getElementsByTagName("p")).forEach((o) => {
      const l = qe(o.getAttribute("begin"));
      t[r].addCue({
        label: `caption_${o.getAttribute("xml:id") || l}`,
        start: l / 1e3,
        end: qe(o.getAttribute("end")) / 1e3,
        captions: o.innerHTML
      });
    });
  }), t;
}
class fn {
  constructor(e, t = "") {
    this.player = e, this._text = t, this._captions = pt(this.player, t);
  }
  get text() {
    return this._text;
  }
  set text(e) {
    this._text = e, this._captions = pt(e);
  }
  get captions() {
    return this._captions;
  }
}
let Ge = null;
class ge extends Ue {
  static Get() {
    return Ge || (Ge = new ge()), Ge;
  }
  get moduleName() {
    return "paella-core default plugins";
  }
  get moduleVersion() {
    return Te.version;
  }
}
class yn extends Bt {
  getPluginModuleInstance() {
    return ge.Get();
  }
  get name() {
    return super.name || "es.upv.paella.dfxpManifestCaptionsPlugin";
  }
  async isEnabled() {
    return await super.isEnabled() && this.player.videoManifest.captions && this.player.videoManifest.captions.length > 0;
  }
  async getCaptions() {
    const e = [], t = [];
    return this.player.videoManifest.captions.forEach((i) => {
      t.push(new Promise(async (s, a) => {
        if (/dfxp/i.test(i.format)) {
          const r = Z(this.player, i.url), o = await fetch(r);
          if (o.ok) {
            let l = await o.text();
            l = l.replace(/[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, ""), l = l.replace(/&\w+;/gmi, ""), l = l.replaceAll("<br>", "");
            const u = new fn(this.player, l);
            Object.entries(u.captions).forEach(([m, h]) => {
              e.push(h);
            }), s();
          } else
            a();
        } else
          a();
      }));
    }), await Promise.allSettled(t), e;
  }
}
class it extends he {
  constructor(e, t, i) {
    super(e, t, i), this.__uiPlugin = !0;
  }
  async getDictionaries() {
    return null;
  }
}
let nt = "en", zt = "";
const ae = {};
function Ht(n) {
  const e = ae[nt] || {}, t = ae[zt] || {};
  return e[n] || t[n] || n;
}
function jt(n) {
  nt = n;
}
function Wt() {
  return nt;
}
function qt(n, e) {
  ae[n] = ae[n] || {};
  for (const t in e) {
    const i = e[t];
    ae[n][t] = i;
  }
}
function Qt() {
  return ae;
}
function Yt(n) {
  return n.config.defaultLanguage || navigator.language;
}
let Zt = Ht, Kt = jt, Jt = Wt, Xt = qt, ei = Qt, ti = Yt;
function Ce(n, e = null) {
  const t = Zt(n);
  if (Array.isArray(e)) {
    let i = t;
    return e.forEach((s, a) => {
      const r = `$${a + 1}`;
      i = i.replace(r, s);
    }), i;
  } else
    return t;
}
function gt(n) {
  Kt(n);
}
function vn() {
  return Jt();
}
function ve(n, e) {
  Xt(n, e);
}
function _n() {
  return ei();
}
function ii(n) {
  return ti(n);
}
function wn(n) {
  Zt = n;
}
function Cn(n) {
  Kt = n;
}
function bn(n) {
  Jt = n;
}
function Ln(n) {
  Xt = n;
}
function Pn(n) {
  ei = n;
}
function En(n) {
  ti = n;
}
function Sn(n) {
  zt = ii(n);
}
async function Re(n, e) {
  var u, m;
  const t = L("<li></li>", e);
  t.plugin = n;
  const i = Ce(n.ariaLabel), s = Ce(n.description), a = n.dynamicWidth ? "dynamic-width" : "fixed-width", r = n.id ? `id="${n.id}" ` : "", o = n.buttonName ? `name="${n.buttonName}" ` : "", l = n.tabIndex ? ` tabindex="${n.tabIndex}" ` : "";
  if (n.interactive) {
    const h = L(`
			<button type="button" ${r}${o}class="${a}"${l}aria-label="${i}" title="${s}">
			</button>
		`, t);
    n.className !== "" && h.classList.add(n.className), n._button = h, n._container = t, h._pluginData = n, t._pluginData = n, h.addEventListener("click", (c) => {
      const f = h._pluginData;
      E(f.player, g.BUTTON_PRESS, {
        plugin: f
      }), f.action(c, null), c.stopPropagation(), c.pageX !== 0 && c.pageY !== 0 && document.activeElement.blur();
    });
    let p = null;
    const v = () => {
      p && (clearTimeout(p), p = null);
    }, C = () => {
      v(), p = setTimeout(() => {
        n.leftSideContainerPresent && n.leftSideContainer.classList.add("hidden"), n.rightSideContainerPresent && n.rightSideContainer.classList.add("hidden"), p = null;
      }, 300);
    }, b = () => {
      v(), n.leftSideContainerPresent && n.leftSideContainer.classList.remove("hidden"), n.rightSideContainerPresent && n.rightSideContainer.classList.remove("hidden");
    };
    h.addEventListener("focus", b), h.addEventListener("mouseover", b), h.addEventListener("mouseout", C), h.addEventListener("blur", C), (((u = n.player.config.accessibility) == null ? void 0 : u.clickWithSpacebar) !== void 0 ? (m = n.player.config.accessibility) == null ? void 0 : m.clickWithSpacebar : !0) || (h.addEventListener("keyup", (c) => {
      c.keyCode == 32 && c.preventDefault();
    }), h.addEventListener("keydown", (c) => {
      c.keyCode == 32 && c.preventDefault();
    })), n.className !== "" && h.classList.add(n.className);
  } else {
    const h = L(`
			<div ${r}${o} class="non-interactive ${a}" title="${s}">
			</div>
		`, t);
    n._button = h, n._container = t, h._pluginData = n, t._pluginData = n, n.className !== "" && h.classList.add(n.className);
  }
}
const mt = () => {
  const n = document.createElement("span");
  return n.classList.add("side-container"), n.classList.add("hidden"), n;
};
class Tn {
  onIconChanged(e, t, i) {
  }
  onTitleChanged(e, t, i) {
  }
  onStateChanged(e, t, i, s, a) {
  }
}
var W, q, Le;
class st extends it {
  constructor() {
    super(...arguments);
    T(this, W, null);
    T(this, q, null);
    T(this, Le, []);
  }
  get type() {
    return "button";
  }
  // _container and _button are loaded in PlaybackBar
  get container() {
    return this._container;
  }
  get button() {
    return this._button;
  }
  get interactive() {
    return !0;
  }
  get dynamicWidth() {
    return !1;
  }
  getId() {
    return null;
  }
  get id() {
    return this.config.id || this.getId();
  }
  getButtonName() {
    return null;
  }
  get buttonName() {
    return this.config.name || this.getButtonName() || this.name;
  }
  get ariaLabel() {
    return this.config.ariaLabel || this.getAriaLabel();
  }
  getAriaLabel() {
    return "";
  }
  get tabIndex() {
    return this.config.tabIndex || this.getTabIndex();
  }
  getTabIndex() {
    return null;
  }
  getDescription() {
    return "";
  }
  get description() {
    return this.config.description || this.getDescription();
  }
  get minContainerSize() {
    return this.config.minContainerSize || this.getMinContainerSize();
  }
  getMinContainerSize() {
    return 0;
  }
  setObserver(t) {
    if (t instanceof Tn)
      this._observer = t;
    else if (typeof t.onIconChanged == "function" || typeof t.onTitleChanged == "function" || typeof t.onStateChanged == "function")
      this._observer = t;
    else
      throw new Error("Invalid observer for ButtonPlugin");
  }
  get icon() {
    return this._icon || (this._icon = ""), this._icon;
  }
  set icon(t) {
    var i;
    if (typeof t == "string" && (t = Nt(t)), this._icon = t, t && this._button instanceof HTMLElement) {
      const s = this._button.querySelector("i") || L("<i></i>", this._button);
      s.innerHTML = t;
    } else if (this._button instanceof HTMLElement) {
      const s = this._button.querySelector("i");
      s && this._button.removeChild(s);
    }
    (i = this._observer) != null && i.onIconChanged && this._observer.onIconChanged(this, this._icon, t);
  }
  get title() {
    return this._title || "";
  }
  set title(t) {
    var i;
    if (this._title = t, t && this._button instanceof HTMLElement) {
      const s = this._button.querySelector("span") || L(`<span class="button-title-${this.titleSize}"></span>`, this._button);
      s.innerHTML = t;
    } else if (this._button instanceof HTMLElement) {
      const s = this._button.querySelector("span");
      s && this._button.removeChild(s);
    }
    (i = this._observer) != null && i.onTitleChanged && this._observer.onTitleChanged(this, this._title, t);
  }
  // "small", "medium", "large"
  get titleSize() {
    return "medium";
  }
  // "left" or "right"
  get side() {
    var i;
    return ((i = this.config) == null ? void 0 : i.side) || "left";
  }
  get closePopUps() {
    return this.config.closePopUps || this.getClosePopUps();
  }
  getClosePopUps() {
    return !0;
  }
  // "playbackBar" or "videoContainer"
  get parentContainer() {
    var i;
    return ((i = this.config) == null ? void 0 : i.parentContainer) || "playbackBar";
  }
  get className() {
    return "";
  }
  enable() {
    this._enabled = !0, this.show();
  }
  disable() {
    this._enabled = !1, this.hide();
  }
  hide() {
    this._button && (this._button.style.display = "none");
  }
  show() {
    if (this._enabled === !1)
      return;
    const { width: t } = this.player.playbackBar.containerSize;
    this._button && (t > this.minContainerSize || this.parentContainer !== "playbackBar") && (this._button.style.display = null);
  }
  get leftSideContainer() {
    return d(this, W) || (I(this, W, mt()), this.container.appendChild(d(this, W))), d(this, W);
  }
  get leftSideContainerPresent() {
    return d(this, W) !== null;
  }
  get rightSideContainer() {
    return d(this, q) || (I(this, q, mt()), this.container.appendChild(d(this, q))), d(this, q);
  }
  get rightSideContainerPresent() {
    return d(this, q) !== null;
  }
  get stateText() {
    return null;
  }
  get stateIcon() {
    return null;
  }
  setState({ text: t = null, icon: i = null } = {}) {
    var r, o;
    const s = this._statusText, a = this._statusIcon;
    this._statusText = t, this._statusIcon = i, d(this, Le).forEach((l) => l(this)), this._statusIcon && (this.icon = this._statusIcon), this._statusText && (this.title = this._statusText), (o = (r = this._observer) == null ? void 0 : r.onStateChanged) == null || o.call(r, this, s, t, a, i);
  }
  onStateChange(t) {
    typeof t == "function" ? d(this, Le).push(t) : this.player.log.warn("Invalid callback for ButtonPlugin.onStateChange");
  }
  async action(t, i = null) {
  }
  onResize({ width: t, height: i }) {
    t < this.minContainerSize ? this.hide() : this.show();
  }
  focus() {
    var t;
    (t = this.button) == null || t.focus();
  }
  blur() {
    var t;
    (t = this.button) == null || t.blur();
  }
  isFocus() {
    return this.button === document.activeElement;
  }
}
W = new WeakMap(), q = new WeakMap(), Le = new WeakMap();
const In = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 23 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <g id="play" transform="matrix(1.36051e-16,0.480277,-0.550439,1.55927e-16,74.9184,-144.269)">
        <path d="M325.373,94.327L350.358,136.107L300.387,136.107L325.373,94.327Z"/>
    </g>
</svg>
`, kn = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 24 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <g id="pause" transform="matrix(1,0,0,0.956522,-48,-7.65217)">
        <path d="M64,8L72,8L72,31L64,31L64,8ZM48,8L56,8L56,31L48,31L48,8Z"/>
    </g>
</svg>
`, Dn = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 40 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(1.94013e-16,0.689169,-0.784942,2.23746e-16,110.436,-203.562)">
        <g id="play">
            <path d="M304.588,115.214C304.588,105.205 313.901,97.079 325.373,97.079C336.844,97.079 346.157,105.205 346.157,115.214C346.157,125.223 336.844,133.349 325.373,133.349L325.373,128.287C333.642,128.287 340.356,122.43 340.356,115.214C340.356,107.999 333.642,102.141 325.373,102.141C317.103,102.141 310.39,107.999 310.39,115.214L304.588,115.214Z"/>
            <g transform="matrix(-2.33361,-6.00363e-16,1.21708e-15,-2.59724,320.246,134.358)">
                <path d="M5.454,3.35L9.398,7.505L1.511,7.505L5.454,3.35Z"/>
            </g>
        </g>
    </g>
</svg>
`;
class xn extends st {
  getPluginModuleInstance() {
    return ge.Get();
  }
  get name() {
    return super.name || "es.upv.paella.playPauseButton";
  }
  async load() {
    const e = this.player.getCustomPluginIcon(this.name, "play") || In, t = this.player.getCustomPluginIcon(this.name, "pause") || kn, i = this.player.getCustomPluginIcon(this.name, "replay") || Dn;
    this.icon = e, this.player.translate(this.config.ariaLabelPause || "pause");
    const s = this.player.translate(this.config.ariaLabelPlay || "play");
    A(this.player, g.PLAY, () => {
      this.icon = t, this.button.ariaLabel = s, this.button.title = this.config.ariaLabelPause || s;
    }), A(this.player, g.PAUSE, () => {
      this.icon = e, this.button.ariaLabel = s, this.button.title = this.config.ariaLabelPause || s;
    }), A(this.player, g.ENDED, () => {
      this.icon = i, this.button.ariaLabel = s, this.button.title = this.config.ariaLabelPause || s;
    }), A(this.player, g.STOP, () => {
      this.icon = e, this.button.ariaLabel = s, this.button.title = this.config.ariaLabelPause || s;
    });
  }
  async action() {
    await this.player.paused() ? await this.player.videoContainer.play() : await this.player.videoContainer.pause();
  }
}
const ft = "(?:\\d*:){1,2}\\d*(?:\\.\\d+)?", An = `(${ft})\\s*\\-\\->\\s*(${ft})`, Mn = {
  cueTiming: new RegExp(An)
}, Rn = (n, e, t, i) => {
  const s = Mn.cueTiming.exec(e);
  if (s) {
    const a = i[t - 1], r = [];
    for (let o = 1; t + o < i.length && i[t + o] !== ""; ++o)
      r.push(i[t + o]);
    n.addCue({
      label: a,
      start: s[1],
      end: s[2],
      captions: r
    });
  }
};
function yt(n) {
  const e = new Gt();
  return n !== "" && (n = n.replace(/\r\n/gm, `
`), n = n.replace(/\r/gm, `
`), n.split(/\n/).forEach((t, i, s) => {
    Rn(e, t, i, s);
  })), e;
}
class Vn {
  constructor(e = "") {
    this._text = e, this._captions = yt(e);
  }
  get text() {
    return this._text;
  }
  set text(e) {
    this._text = e, this._captions = yt(e);
  }
  get captions() {
    return this._captions;
  }
}
class Nn extends Bt {
  getPluginModuleInstance() {
    return ge.Get();
  }
  get name() {
    return super.name || "es.upv.paella.vttManifestCaptionsPlugin";
  }
  async isEnabled() {
    return await super.isEnabled() && this.player.videoManifest.captions && this.player.videoManifest.captions.length > 0;
  }
  async getCaptions() {
    const e = [], t = [];
    return this.player.videoManifest.captions.forEach((i) => {
      t.push(new Promise(async (s, a) => {
        if (/vtt/i.test(i.format)) {
          const r = Z(this.player, i.url), o = await fetch(r);
          if (o.ok) {
            const l = await o.text(), u = new Vn(l);
            u.captions.label = i.text, u.captions.language = i.lang, e.push(u.captions), s();
          } else
            a();
        } else
          a();
      }));
    }), await Promise.allSettled(t), e;
  }
}
class Un extends st {
  getPluginModuleInstance() {
    return ge.Get();
  }
  get name() {
    return "es.upv.paella.currentTimeLabel";
  }
  async load() {
    this.title = ie(0);
    const e = async () => {
      const t = await this.player.videoContainer.currentTime();
      let i = ie(t);
      if (this.config.showTotalTime) {
        const s = await this.player.videoContainer.duration();
        i += ` / ${ie(s)}`;
      }
      this.title = i;
    };
    this.player.bindEvent(g.TIMEUPDATE, () => e()), this.player.bindEvent(g.TRIMMING_CHANGED, () => e()), this.player.bindEvent(g.SEEK, () => e());
  }
  get interactive() {
    return !1;
  }
  get dynamicWidth() {
    return !0;
  }
}
function Fe(n, e) {
  return ui(n, "layout").filter((i) => i.config && i.config.enabled && i.canApply(e));
}
function ni(n, e) {
  const t = Fe(n, e), i = [];
  return t.forEach((s) => {
    i.push(...s.getValidContentIds(e));
  }), i;
}
function Fn(n, e) {
  const t = [];
  return ui(n, "layout").filter((i) => {
    var s, a;
    if ((s = i.config) != null && s.enabled && ((a = i.config) != null && a.validContent))
      return i.config.validContent.every((r) => r.content.length === e);
  }).forEach((i) => i.config.validContent.forEach((s) => t.push(s.content))), t;
}
function si(n, e, t) {
  const i = Fe(n, e);
  let s = null;
  return i.some((a) => {
    if (a.getValidContentIds(e).indexOf(t) !== -1)
      return s = a, !0;
  }), s;
}
function On(n, e) {
  const t = Fe(n, e), i = ni(n, e);
  let s = [];
  return t.forEach((a) => {
    s = [...s, ...a.config.validContent];
  }), s.filter((a) => i.indexOf(a.id) !== -1);
}
function ai(n, e, t, i = null) {
  const s = si(n, e, t);
  if (s) {
    const a = s.getLayoutStructure(e, t, i);
    return a.plugin = s, a;
  }
  return null;
}
class me extends it {
  get type() {
    return "layout";
  }
  get layoutType() {
    return "static";
  }
  getTabIndexStart() {
    return 10;
  }
  get tabIndexStart() {
    var e;
    return ((e = this.config) == null ? void 0 : e.tabIndexStart) || this.getTabIndexStart();
  }
  // Return the layout identifier, for example, presenter-presentation
  get identifier() {
    return "default";
  }
  get icon() {
    return "icon.png";
  }
  // Return the array of valid content in the configuration of the plugin
  get validContent() {
    var e;
    return ((e = this.config) == null ? void 0 : e.validContent) || [];
  }
  get validContentIds() {
    const e = [];
    return this.validContent.forEach((t) => e.push(t.id)), e;
  }
  // Gets the valid content ids that matches the streamData
  getValidContentIds(e) {
    const t = [];
    return this.validContent.forEach((i) => {
      i.content.every((s) => e.some((a) => s === a.content)) && t.push(i.id);
    }), t;
  }
  // Get the valid stream data combination, according to the plugin configuration
  // The result of this function must be an array of arrays with all the possible
  // combinations. For example, for a dual stream layout and three elements in
  // streamData that matches the valid content, the resulting valid streams must be:
  // [
  //      [streamA, streamB],
  //      [streamA, streamC],
  //      [streamC, streamB]   
  // ]
  getValidStreams(e) {
    const t = [];
    return this.validContent.forEach((i) => {
      let s = [];
      i.content.every((a) => e.some((r) => {
        if (a === r.content)
          return s.push(r), !0;
      })) && t.push(s);
    }), t;
  }
  canApply(e) {
    return this.getValidStreams(e).length > 0;
  }
  getLayoutStructure() {
    return {};
  }
  // Add buttons to videos
  // [
  //      icon    (required)
  //      click   (required)
  //      tabIndex
  //      ariaLabel
  //      title
  //      className
  //      position (CanvasButtonPosition.LEFT, CanvasButtonPosition.CENTER, CanvasButtonPosition.RIGHT)
  //]
  getVideoCanvasButtons(e, t, i) {
    return [];
  }
}
function $n(n) {
  return {
    icon: n.icon,
    position: n.position,
    title: n.description,
    ariaLabel: n.ariaLabel,
    name: n.buttonName,
    click: async (e) => {
      const t = n.player.videoContainer.streamProvider.streams[e];
      await n.action(e, t == null ? void 0 : t.player, t == null ? void 0 : t.canvas, t == null ? void 0 : t.canvasPlugin);
    }
  };
}
async function Bn(n, e) {
  const t = [];
  return await $(
    n,
    "canvasButton",
    async (i) => {
      n.log.debug(` Canvas button plugin: ${i.name}`), t.push(i);
    }
  ), t.filter((i) => i.content.indexOf(e.content) !== -1).map((i) => $n(i));
}
class la extends it {
  get type() {
    return "canvasButton";
  }
  get content() {
    return this._config.content || ["presenter"];
  }
  get ariaLabel() {
    return this._config.ariaLabel || this.getAriaLabel();
  }
  getAriaLabel() {
    return "";
  }
  get tabIndex() {
    return this.config.tabIndex;
  }
  get description() {
    return this.config.description || this.getDescription();
  }
  getDescription() {
    return "";
  }
  get icon() {
    return this._icon;
  }
  set icon(e) {
    this._icon = e;
  }
  get side() {
    var e;
    return ((e = this.config) == null ? void 0 : e.side) || "left";
  }
  get buttonName() {
    return this.name;
  }
  get position() {
    switch (this.side) {
      case "left":
        return S.LEFT;
      case "center":
        return S.CENTER;
      case "right":
        return S.RIGHT;
      default:
        throw new Error(`Invalid CanvasButtonPlugin side set: ${this.side}`);
    }
  }
  async action(e) {
    this.player.log.warn(`Action not implemented in canvas button plugin ${this.name}`);
  }
}
const Qe = [];
async function Gn(n) {
  await $(n, "canvas", (e) => {
    Qe.push(e);
  });
}
async function zn(n) {
}
function Hn(n, e) {
  if (Qe.length === 0)
    throw Error("No canvas plugins loaded. Note that `loadCanvasPlugins()` must to be called before use `getCanvasPlugins()`");
  let t = null;
  return Qe.some((i) => {
    if (i.isCompatible(e))
      return t = i, !0;
  }), t;
}
const S = Object.freeze({
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right"
}), jn = function({
  icon: n,
  tabIndex: e,
  ariaLabel: t,
  title: i,
  className: s,
  position: a = S.CENTER,
  click: r,
  content: o,
  name: l
}) {
  if (!n)
    throw new Error("Error in video layout definition. getVideoCanvasButtons(): missing 'icon' attribute.");
  if (!r)
    throw new Error("Error in video layout definition. getVideoCanvasButtons(): missing 'click' function.");
  let u = `class="align-${a}${s ? " " + s : ""}"`;
  t && (u += ` aria-label="${t}"`), i && (u += ` title="${i}"`), e !== void 0 && (u += ` tabindex="${e}"`), l !== void 0 && (u += ` name="${l}"`);
  const m = L(`
        <button ${u}><i class="button-icon" style="pointer-events: none">${n}</i></button>
    `);
  return this.buttonsArea.appendChild(m), m.addEventListener("click", async (h) => (h.stopPropagation(), await r(o), !1)), m;
}, Ye = async (n, e, t, i, s) => {
  const a = e.plugin;
  let r = a.tabIndexStart;
  const o = await Bn(n, i), l = [];
  return [
    ...o,
    ...a.getVideoCanvasButtons(e, i.content, i, t)
  ].forEach((m) => {
    m.tabIndex = r++, m.content = s;
    const h = jn.apply(t, [m]);
    l.push(h);
  }), l;
}, Ze = (n, e, t) => {
  let { tabIndexStart: i } = e.plugin;
  t.sort((s, a) => {
    const r = s.getBoundingClientRect().left, o = a.getBoundingClientRect().left;
    return r - o;
  }).forEach((s) => {
    s.setAttribute("tabindex", i++);
  });
};
class ri extends z {
  constructor(e, t, i) {
    super(t, { tag: e, parent: i }), this.element.className = "video-canvas", this._userArea = null, this._buttonsArea = L(`
        <div class="button-area">
        </div>
        `, this.element);
  }
  async loadCanvas(e) {
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
class oi extends he {
  get type() {
    return "canvas";
  }
  get canvasType() {
    return "";
  }
  isCompatible(e) {
    return Array.isArray(e == null ? void 0 : e.canvas) ? e.canvas.indexOf(this.canvasType) !== -1 : e.canvas === this.canvasType;
  }
  getCanvasInstance(e) {
    throw Error(`${this.name} canvas plugin: getCanvasInstance() not implemented`);
  }
}
let ze = null;
class K extends Ue {
  static Get() {
    return ze || (ze = new K()), ze;
  }
  get moduleName() {
    return "paella-core default video layouts";
  }
  get moduleVersion() {
    return Te.version;
  }
}
const at = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(0.920758,0,0,0.920758,2.50561,1.21236)">
        <path d="M11.937,17.699L11.937,21.044C11.937,21.656 11.573,22.209 11.012,22.451C10.45,22.693 9.798,22.578 9.354,22.158L1.874,15.1C1.568,14.811 1.394,14.408 1.394,13.986C1.394,13.564 1.568,13.161 1.874,12.872L9.354,5.814C9.798,5.394 10.45,5.279 11.012,5.521C11.573,5.763 11.937,6.316 11.937,6.928L11.937,10.272L22.937,10.272C23.783,10.272 24.469,10.958 24.469,11.804L24.469,16.168C24.469,17.014 23.783,17.699 22.937,17.699L11.937,17.699ZM26.063,23.11L26.063,19.765C26.063,19.153 26.427,18.6 26.988,18.358C27.55,18.116 28.201,18.231 28.646,18.651L36.126,25.709C36.432,25.999 36.606,26.402 36.606,26.823C36.606,27.245 36.432,27.648 36.126,27.937L28.646,34.996C28.201,35.415 27.55,35.53 26.988,35.288C26.427,35.046 26.063,34.493 26.063,33.882L26.063,30.537L15.063,30.537C14.217,30.537 13.531,29.851 13.531,29.005L13.531,24.641C13.531,23.795 14.217,23.11 15.063,23.11L26.063,23.11Z"/>
    </g>
</svg>
`, Ve = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(-0.620305,0,0,0.839332,25.2077,0.462208)">
        <path d="M-20.625,8.591C-20.625,6.174 -17.975,4.215 -14.704,4.215L31.492,4.215C34.763,4.215 37.413,6.174 37.413,8.591L37.413,35.582C37.413,37.998 34.763,39.957 31.492,39.957L-14.704,39.957C-17.975,39.957 -20.625,37.998 -20.625,35.582L-20.625,8.591ZM1.285,12.825L8.1,7.789L-15.786,7.789L-15.786,25.442L-8.972,20.406L6.737,32.016L16.994,24.435L1.285,12.825Z" />
    </g>
</svg>
`, _e = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(0.707107,0.707107,-0.707107,0.707107,20,-8.28427)">
        <path d="M23,17L23,4.998C23,4.203 22.684,3.44 22.122,2.878C21.56,2.316 20.797,2 20.002,2C20.001,2 19.999,2 19.998,2C19.203,2 18.44,2.316 17.878,2.878C17.316,3.44 17,4.203 17,4.998C17,9.375 17,17 17,17L4.998,17C4.203,17 3.44,17.316 2.878,17.878C2.316,18.44 2,19.203 2,19.998C2,19.999 2,20.001 2,20.002C2,20.797 2.316,21.56 2.878,22.122C3.44,22.684 4.203,23 4.998,23C9.375,23 17,23 17,23L17,35.002C17,35.797 17.316,36.56 17.878,37.122C18.44,37.684 19.203,38 19.998,38C19.999,38 20.001,38 20.002,38C20.797,38 21.56,37.684 22.122,37.122C22.684,36.56 23,35.797 23,35.002C23,30.625 23,23 23,23L35.002,23C35.797,23 36.56,22.684 37.122,22.122C37.684,21.56 38,20.797 38,20.002C38,20.001 38,19.999 38,19.998C38,19.203 37.684,18.44 37.122,17.878C36.56,17.316 35.797,17 35.002,17C30.625,17 23,17 23,17Z"/>
    </g>
</svg>`, Ie = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g>
        <path d="M18,13.029L18,26.971C18,27.509 17.786,28.025 17.406,28.406C17.025,28.786 16.509,29 15.971,29L3.029,29C2.491,29 1.975,28.786 1.594,28.406C1.214,28.025 1,27.509 1,26.971L1,13.029C1,12.491 1.214,11.975 1.594,11.594C1.975,11.214 2.491,11 3.029,11L15.971,11C16.509,11 17.025,11.214 17.406,11.594C17.786,11.975 18,12.491 18,13.029ZM39,13.029L39,26.971C39,27.509 38.786,28.025 38.406,28.406C38.025,28.786 37.509,29 36.971,29L24.029,29C23.491,29 22.975,28.786 22.594,28.406C22.214,28.025 22,27.509 22,26.971L22,13.029C22,12.491 22.214,11.975 22.594,11.594C22.975,11.214 23.491,11 24.029,11L36.971,11C37.509,11 38.025,11.214 38.406,11.594C38.786,11.975 39,12.491 39,13.029ZM21,7L21,33L19,33L19,7L21,7Z"/>
    </g>
</svg>
`, Wn = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(-0.620305,0,0,0.839332,25.2077,0.462208)">
        <g transform="matrix(-1.61211,0,0,1.19142,40.6376,-0.550686)">
            <path d="M38.001,14.89L16.256,14.89C15.767,14.89 15.297,15.084 14.951,15.43C14.605,15.776 14.41,16.246 14.41,16.735C14.41,21.528 14.41,33.999 14.41,33.999L5.673,33.999C3.644,33.999 2,32.355 2,30.327L2,7.673C2,5.644 3.644,4 5.673,4L34.329,4C36.358,4 38.001,5.644 38.001,7.673L38.001,14.89Z"/>
        </g>
        <g transform="matrix(-1.62701,0,0,1.19712,41.1319,-0.602464)">
            <path d="M39.174,17.858C39.174,17.501 39.032,17.158 38.781,16.906C38.529,16.653 38.188,16.511 37.833,16.511C33.587,16.511 20.516,16.511 17.043,16.511C16.816,16.511 16.598,16.602 16.438,16.763C16.278,16.924 16.188,17.142 16.188,17.37C16.188,20.366 16.188,30.369 16.188,34.019C16.188,34.376 16.329,34.719 16.581,34.971C16.832,35.224 17.173,35.366 17.529,35.366C21.597,35.366 33.765,35.366 37.833,35.366C38.188,35.366 38.529,35.224 38.781,34.971C39.032,34.719 39.174,34.376 39.174,34.019C39.174,30.548 39.174,21.329 39.174,17.858Z"/>
        </g>
    </g>
</svg>
`;
class vt extends me {
  getPluginModuleInstance() {
    return K.Get();
  }
  get name() {
    return super.name || "es.upv.paella.dualVideoDynamic";
  }
  get layoutType() {
    return "dynamic";
  }
  async load() {
    this.pipContentIds = this.config.pipContentIds || [], this.allowSwitchSide = this.config.allowSwitchSide !== void 0 ? this.config.allowSwitchSide : !0;
  }
  getVideoCanvasButtons(e, t, i, s) {
    const a = this.player.getCustomPluginIcon(this.name, "iconMaximize") || Ve, r = this.player.getCustomPluginIcon(this.name, "iconSideBySide") || Ie, o = this.player.getCustomPluginIcon(this.name, "iconSwitchSide") || at, l = this.player.getCustomPluginIcon(this.name, "iconClose") || _e, u = this.player.getCustomPluginIcon(this.name, "iconPiP") || Wn, m = () => this._currentContent.find((C) => C.id === t), h = () => m().size === 25, p = () => m().size > 50, v = [];
    return h() || p() ? v.push({
      icon: r,
      position: S.LEFT,
      title: this.player.translate("Dual stream 50%"),
      ariaLabel: this.player.translate("Dual stream 50%"),
      name: this.name + ":iconSideBySide",
      click: async () => {
        this._currentContent.forEach((C) => {
          C.size = 50;
        }), await this.player.videoContainer.updateLayout();
      }
    }) : v.push({
      icon: a,
      position: S.LEFT,
      title: this.player.translate("Maximize video"),
      ariaLabel: this.player.translate("Maximize video"),
      name: this.name + ":iconMaximize",
      click: async () => {
        this._currentContent.forEach((C) => {
          C.size = C.id === t ? 75 : 25;
        }), await this.player.videoContainer.updateLayout();
      }
    }), this.allowSwitchSide && v.push({
      icon: o,
      position: S.LEFT,
      title: this.player.translate("Switch side"),
      ariaLabel: this.player.translate("Switch side"),
      name: this.name + ":iconSwitchSide",
      click: async () => {
        const C = this._currentContent[0].id, b = this._currentContent[1].id, _ = this._currentContent[0].size, c = this._currentContent[1].size;
        this._currentContent[0].id = b, this._currentContent[0].size = c, this._currentContent[1].id = C, this._currentContent[1].size = _, await this.player.videoContainer.updateLayout();
      }
    }), v.push({
      icon: l,
      position: S.RIGHT,
      title: this.player.translate("Close video"),
      ariaLabel: this.player.translate("Close video"),
      name: this.name + ":iconClose",
      click: async () => {
        const b = this.player.videoContainer.validContentIds.filter((_) => _.indexOf("-") === -1).find((_) => _ != t);
        await this.player.videoContainer.setLayout(b);
      }
    }), this.pipContentIds.length > 0 && v.push({
      icon: u,
      position: S.LEFT,
      title: this.player.translate("Picture-in-picture"),
      ariaLabel: this.player.translate("Picture-in-picture"),
      name: this.name + ":iconPiP",
      click: async () => {
        const C = this.player.videoContainer.validContentIds.find((b) => this.pipContentIds.indexOf(b) !== -1);
        await this.player.videoContainer.setLayout(C, t);
      }
    }), v;
  }
  getLayoutStructure(e, t, i) {
    if (!this._currentContent) {
      const { content: s } = this.validContent.find((a) => a.id === t);
      this._currentContent = s.map((a) => ({
        id: a,
        size: 50
      }));
    }
    return {
      id: "dual-dynamic",
      videos: [
        {
          content: this._currentContent[0].id,
          visible: !0,
          size: this._currentContent[0].size
        },
        {
          content: this._currentContent[1].id,
          visible: !0,
          size: this._currentContent[1].size
        }
      ]
    };
  }
}
const li = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(-0.620305,0,0,0.839332,25.2077,0.462208)">
        <g transform="matrix(-1.50139,0,0,1.10483,39.8625,1.72153)">
            <path d="M22.034,28.802C22.58,28.752 23.089,28.64 23.626,28.496C28.793,27.112 31.864,21.792 30.48,16.625C30.189,15.54 29.715,14.525 29.088,13.619L31.915,8.722C33.663,10.535 34.942,12.776 35.606,15.251C37.748,23.248 32.996,31.48 24.999,33.622C24.011,33.887 23.04,34.063 22.034,34.123L22.034,40.015L13,31.5L22.034,23.015L22.034,28.802Z" />
        </g>
        <g transform="matrix(1.50139,1.35303e-16,1.83867e-16,-1.10483,-24.8768,44.5033)">
            <path d="M22.161,28.786C22.706,28.736 23.089,28.64 23.626,28.496C28.793,27.112 31.864,21.792 30.48,16.625C30.189,15.54 29.715,14.525 29.088,13.619L31.915,8.722C33.663,10.535 34.942,12.776 35.606,15.251C37.748,23.248 32.996,31.48 24.999,33.622C24.011,33.887 23.167,34.048 22.161,34.107L22.161,40L13,31.5L22.161,23L22.161,28.786Z" />
        </g>
    </g>
</svg>
`, qn = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(-0.620305,0,0,0.839332,25.2077,0.462208)">
        <g transform="matrix(-1.61211,0,0,1.25099,40.6376,0.938594)">
            <path d="M26,18.498C26,16.566 24.356,15 22.327,15C17.811,15 10.189,15 5.673,15C3.644,15 2,16.566 2,18.498C2,22.151 2,27.849 2,31.502C2,33.434 3.644,35 5.673,35C10.189,35 17.811,35 22.327,35C24.356,35 26,33.434 26,31.502C26,27.849 26,22.151 26,18.498Z" />
        </g>
        <path d="M-2.889,42.341L-16.002,42.341C-17.664,42.341 -19.01,41.345 -19.01,40.117L-19.01,11.346L-15.787,13.728L-15.787,36.879C-15.787,37.695 -15.348,38.478 -14.567,39.056C-13.785,39.633 -12.726,39.958 -11.621,39.958L-2.889,39.958L-2.889,42.341ZM30.962,18.512L30.962,8.485C30.962,7.669 30.523,6.886 29.741,6.308C28.96,5.731 27.9,5.406 26.795,5.406L-4.721,5.406L-7.945,3.024L31.181,3.024C32.842,3.024 34.189,4.019 34.189,5.247L34.189,18.512L30.962,18.512Z" />
        <g transform="matrix(-0.595969,-0.440448,-1.13993,0.842464,17.4661,11.4472)">
            <path d="M18.389,14.006L18.389,18L5,11L18.389,4L18.389,7.994L36,7.994L36,14.006L18.389,14.006Z" />
        </g>
    </g>
</svg>
`;
let O = 0;
const rt = [
  // First layout: side by side
  {
    id: "side-by-side",
    videos: [
      {
        content: null,
        rect: [
          { aspectRatio: "16/9", width: 560, height: 315, top: 218, left: 712 },
          { aspectRatio: "16/10", width: 560, height: 350, top: 206, left: 712 },
          { aspectRatio: "4/3", width: 560, height: 420, top: 173, left: 712 },
          { aspectRatio: "5/3", width: 560, height: 336, top: 206, left: 712 },
          { aspectRatio: "5/4", width: 560, height: 448, top: 160, left: 712 }
        ],
        visible: !0,
        layer: 1
      },
      {
        content: null,
        rect: [
          { aspectRatio: "16/9", width: 688, height: 387, top: 166, left: 10 },
          { aspectRatio: "16/10", width: 688, height: 430, top: 148, left: 10 },
          { aspectRatio: "4/3", width: 688, height: 516, top: 111, left: 10 },
          { aspectRatio: "5/3", width: 690, height: 414, top: 154, left: 10 },
          { aspectRatio: "5/4", width: 690, height: 552, top: 96, left: 10 }
        ],
        visible: !0,
        layer: "1"
      }
    ],
    buttons: []
  },
  // Second layout: PIP left
  {
    id: "pip-left",
    videos: [
      {
        content: null,
        rect: [
          { aspectRatio: "16/9", left: 0, top: 0, width: 1280, height: 720 },
          { aspectRatio: "16/10", left: 64, top: 0, width: 1152, height: 720 },
          { aspectRatio: "5/3", left: 40, top: 0, width: 1200, height: 720 },
          { aspectRatio: "5/4", left: 190, top: 0, width: 900, height: 720 },
          { aspectRatio: "4/3", left: 160, top: 0, width: 960, height: 720 }
        ],
        visible: !0,
        layer: 1
      },
      {
        content: null,
        rect: [
          { aspectRatio: "16/9", left: 50, top: 470, width: 350, height: 197 },
          { aspectRatio: "16/10", left: 50, top: 448, width: 350, height: 219 },
          { aspectRatio: "5/3", left: 50, top: 457, width: 350, height: 210 },
          { aspectRatio: "5/4", left: 50, top: 387, width: 350, height: 280 },
          { aspectRatio: "4/3", left: 50, top: 404, width: 350, height: 262 }
        ],
        visible: !0,
        layer: 2
      }
    ],
    buttons: []
  },
  // Third layout: PIP right
  {
    id: "pip-right",
    videos: [
      {
        content: null,
        rect: [
          { aspectRatio: "16/9", left: 0, top: 0, width: 1280, height: 720 },
          { aspectRatio: "16/10", left: 64, top: 0, width: 1152, height: 720 },
          { aspectRatio: "5/3", left: 40, top: 0, width: 1200, height: 720 },
          { aspectRatio: "5/4", left: 190, top: 0, width: 900, height: 720 },
          { aspectRatio: "4/3", left: 160, top: 0, width: 960, height: 720 }
        ],
        visible: !0,
        layer: 1
      },
      {
        content: null,
        rect: [
          { aspectRatio: "16/9", left: 880, top: 470, width: 350, height: 197 },
          { aspectRatio: "16/10", left: 880, top: 448, width: 350, height: 219 },
          { aspectRatio: "5/3", left: 880, top: 457, width: 350, height: 210 },
          { aspectRatio: "5/4", left: 880, top: 387, width: 350, height: 280 },
          { aspectRatio: "4/3", left: 880, top: 404, width: 350, height: 262 }
        ],
        visible: !0,
        layer: 2
      }
    ],
    buttons: []
  }
];
function Qn(n) {
  return O = (O + 1) % rt.length, ot(n);
}
function fe(n, e) {
  return O = e < rt.length ? e : O, ot(n);
}
function ot(n) {
  let e = JSON.parse(JSON.stringify(rt[O]));
  return e.videos[0].content = n[0], e.videos[1].content = n[1], e;
}
class Yn extends me {
  getPluginModuleInstance() {
    return K.Get();
  }
  get name() {
    return super.name || "es.upv.paella.dualVideo";
  }
  get identifier() {
    return "dual-video";
  }
  async load() {
    let e = Y("dualVideoLayoutIndex");
    e !== "" && (O = Number(e)), this.player.log.debug("Dual video layout loaded");
  }
  getValidStreams(e) {
    return super.getValidStreams(e).filter((t) => t.length === 2);
  }
  switchContent() {
    const e = this._currentContent[0], t = this._currentContent[1];
    this._currentContent[0] = t, this._currentContent[1] = e, this.player.videoContainer.updateLayout();
  }
  async switchMinimized() {
    Qn(this._currentContent), await this.player.videoContainer.updateLayout();
  }
  async minimizeVideo(e) {
    let t = !0;
    if (e === this._currentContent[0]) {
      const i = this._currentContent[0], s = this._currentContent[1];
      this._currentContent[0] = s, this._currentContent[1] = i, t = !1;
    }
    O === 1 && t ? fe(this._currentContent, 2) : fe(this._currentContent, 1), await this.player.videoContainer.updateLayout();
  }
  async maximizeVideo(e) {
    let t = !0;
    if (e === this._currentContent[1]) {
      const i = this._currentContent[0], s = this._currentContent[1];
      this._currentContent[0] = s, this._currentContent[1] = i, t = !1;
    }
    O === 1 && t ? fe(this._currentContent, 2) : fe(this._currentContent, 1), await this.player.videoContainer.updateLayout();
  }
  async setSideBySide() {
    fe(this._currentContent, 0), await this.player.videoContainer.updateLayout();
  }
  get minimizedContent() {
    return O === 0 ? "" : this._currentContent[1];
  }
  async closeVideo(e) {
    const i = this.player.videoContainer.validContentIds.filter((s) => s.indexOf("-") === -1).find((s) => s != e);
    await this.player.videoContainer.setLayout(i);
  }
  getVideoCanvasButtons(e, t, i, s) {
    if (e.id === "side-by-side")
      return [
        // Swap
        {
          icon: this.player.getCustomPluginIcon(this.name, "iconRotate") || li,
          position: S.LEFT,
          title: this.player.translate("Swap position of the videos"),
          ariaLabel: this.player.translate("Swap position of the videos"),
          name: this.name + ":iconRotate",
          click: async () => {
            await this.switchContent();
          }
        },
        // Minimize
        {
          icon: this.player.getCustomPluginIcon(this.name, "iconMaximize") || Ve,
          position: S.LEFT,
          title: this.player.translate("Maximize video"),
          ariaLabel: this.player.translate("Maximize video"),
          name: this.name + ":iconMaximize",
          click: async () => {
            await this.maximizeVideo(t);
          }
        },
        // Close
        {
          icon: this.player.getCustomPluginIcon(this.name, "iconClose") || _e,
          position: S.RIGHT,
          title: this.player.translate("Close video"),
          ariaLabel: this.player.translate("Close video"),
          name: this.name + ":iconClose",
          click: async () => {
            await this.closeVideo(t);
          }
        }
      ];
    {
      const a = [];
      return t === this.minimizedContent ? (a.push({
        icon: this.player.getCustomPluginIcon(this.name, "iconMaximize") || Ve,
        position: S.LEFT,
        title: this.player.translate("Maximize video"),
        ariaLabel: this.player.translate("Maximize video"),
        name: this.name + ":iconMaximize",
        click: async () => {
          await this.switchContent();
        }
      }), a.push({
        icon: this.player.getCustomPluginIcon(this.name, "iconSwitchSide") || at,
        position: S.LEFT,
        title: this.player.translate("Place the video on the other side of the screen"),
        ariaLabel: this.player.translate("Place the video on the other side of the screen"),
        name: this.name + ":iconSwitchSide",
        click: async () => {
          await this.minimizeVideo(t);
        }
      }), a.push({
        icon: this.player.getCustomPluginIcon(this.name, "iconClose") || _e,
        position: S.RIGHT,
        title: this.player.translate("Close video"),
        ariaLabel: this.player.translate("Close video"),
        name: this.name + ":iconClose",
        click: async () => {
          await this.closeVideo(t);
        }
      })) : (a.push({
        icon: this.player.getCustomPluginIcon(this.name, "iconMinimize") || qn,
        position: S.LEFT,
        title: this.player.translate("Minimize video"),
        ariaLabel: this.player.translate("Minimize video"),
        name: this.name + ":iconMinimize",
        click: async () => {
          await this.switchContent();
        }
      }), a.push({
        icon: this.player.getCustomPluginIcon(this.name, "iconSideBySide") || Ie,
        position: S.LEFT,
        title: this.player.translate("Put the videos side by side"),
        ariaLabel: this.player.translate("Put the videos side by side"),
        name: this.name + ":iconSideBySide",
        click: async () => {
          await this.setSideBySide();
        }
      }), a.push({
        icon: this.player.getCustomPluginIcon(this.name, "iconClose") || _e,
        position: S.RIGHT,
        title: this.player.translate("Close video"),
        ariaLabel: this.player.translate("Close video"),
        name: this.name + ":iconClose",
        click: async () => {
          await this.closeVideo(t);
        }
      })), a;
    }
  }
  getLayoutStructure(e, t) {
    if (!this._currentContent || this._currentContentId !== t) {
      const { content: a } = this.validContent.find((l) => l.id === t);
      this._currentContent = a, this._currentContentId = t;
      const r = Y("dualVideoLayoutContent0"), o = Y("dualVideoLayoutContent1");
      r !== "" && o !== "" && this._currentContent.indexOf(r) !== -1 && this._currentContent.indexOf(o) !== -1 && (this._currentContent[0] = r, this._currentContent[1] = o);
    }
    const i = ot(this._currentContent), s = {
      id: i.id,
      player: this.player,
      name: { es: "Dos streams con posición dinámica" },
      hidden: !1,
      videos: i.videos,
      buttons: []
    };
    return ne("dualVideoLayoutIndex", O), ne("dualVideoLayoutContent0", this._currentContent[0]), ne("dualVideoLayoutContent1", this._currentContent[1]), s;
  }
}
const _t = {
  id: "pip-left",
  name: { es: "Dos streams imagen dentro de imagen" },
  hidden: !1,
  videos: [
    {
      content: null,
      rect: [
        { aspectRatio: "16/9", left: 0, top: 0, width: 1280, height: 720 },
        { aspectRatio: "16/10", left: 64, top: 0, width: 1152, height: 720 },
        { aspectRatio: "5/3", left: 40, top: 0, width: 1200, height: 720 },
        { aspectRatio: "5/4", left: 190, top: 0, width: 900, height: 720 },
        { aspectRatio: "4/3", left: 160, top: 0, width: 960, height: 720 },
        { aspectRatio: "9/16", left: 617, top: 17, width: 386, height: 687 }
      ],
      visible: !0,
      layer: 1
    },
    {
      content: null,
      rect: [
        { aspectRatio: "16/9", left: 50, top: 470, width: 350, height: 197 },
        { aspectRatio: "16/10", left: 50, top: 448, width: 350, height: 219 },
        { aspectRatio: "5/3", left: 50, top: 457, width: 350, height: 210 },
        { aspectRatio: "5/4", left: 50, top: 387, width: 350, height: 280 },
        { aspectRatio: "4/3", left: 50, top: 404, width: 350, height: 262 },
        { aspectRatio: "9/16", left: 224, top: 301, width: 224, height: 400 }
      ],
      visible: !0,
      layer: 2
    }
  ],
  buttons: []
}, Zn = {
  id: "pip-right",
  name: { es: "Dos streams imagen dentro de imagen a la derecha" },
  hidden: !1,
  videos: [
    {
      content: null,
      rect: [
        { aspectRatio: "16/9", left: 0, top: 0, width: 1280, height: 720 },
        { aspectRatio: "16/10", left: 64, top: 0, width: 1152, height: 720 },
        { aspectRatio: "5/3", left: 40, top: 0, width: 1200, height: 720 },
        { aspectRatio: "5/4", left: 190, top: 0, width: 900, height: 720 },
        { aspectRatio: "4/3", left: 160, top: 0, width: 960, height: 720 },
        { aspectRatio: "9/16", left: 242, top: 17, width: 386, height: 687 }
      ],
      visible: !0,
      layer: 1
    },
    {
      content: null,
      rect: [
        { aspectRatio: "16/9", left: 880, top: 470, width: 350, height: 197 },
        { aspectRatio: "16/10", left: 880, top: 448, width: 350, height: 219 },
        { aspectRatio: "5/3", left: 880, top: 457, width: 350, height: 210 },
        { aspectRatio: "5/4", left: 880, top: 387, width: 350, height: 280 },
        { aspectRatio: "4/3", left: 880, top: 404, width: 350, height: 262 },
        { aspectRatio: "9/16", left: 887, top: 304, width: 224, height: 400 }
      ],
      visible: !0,
      layer: 2
    }
  ],
  buttons: []
};
class Kn extends me {
  getPluginModuleInstance() {
    return K.Get();
  }
  get name() {
    return super.name || "es.upv.paella.dualVideoPiP";
  }
  get identifier() {
    return "dual-video-pip";
  }
  async load() {
    this._currentLayout = _t, this.dualVideoContentIds = this.config.dualVideoContentIds || [];
  }
  getValidStreams(e) {
    return super.getValidStreams(e).filter((t) => t.length === 2);
  }
  getVideoCanvasButtons(e, t, i, s) {
    const a = this.player.getCustomPluginIcon(this.name, "iconClose") || _e, r = this.player.getCustomPluginIcon(this.name, "iconSwitchSide") || at, o = this.player.getCustomPluginIcon(this.name, "iconMaximize") || Ve, l = this.player.getCustomPluginIcon(this.name, "iconSideBySide") || Ie, u = [
      {
        icon: a,
        position: S.RIGHT,
        title: this.player.translate("Close video"),
        ariaLabel: this.player.translate("Close video"),
        name: this.name + ":iconClose",
        click: async () => {
          const h = this.player.videoContainer.validContentIds.filter((p) => p.indexOf("-") === -1).find((p) => p !== t);
          await this.player.videoContainer.setLayout(h);
        }
      }
    ];
    return t === this._pipVideo ? (u.push({
      icon: r,
      position: S.LEFT,
      title: this.player.translate("Switch side"),
      ariaLabel: this.player.translate("Switch side"),
      name: this.name + ":iconSwitchSide",
      click: async () => {
        this.switchSide(), await this.player.videoContainer.updateLayout(this._fullVideo);
      }
    }), u.push({
      icon: o,
      position: S.LEFT,
      title: this.player.translate("Maximize video"),
      ariaLabel: this.player.translate("Maximize video"),
      name: this.name + ":iconMaximize",
      click: async () => {
        this.switchSources(), await this.player.videoContainer.updateLayout(this._fullVideo);
      }
    })) : this.dualVideoContentIds.length > 0 && u.push({
      icon: l,
      position: S.LEFT,
      title: this.player.translate("Set side by side"),
      ariaLabel: this.player.translate("Set side by side"),
      name: this.name + ":iconSideBySide",
      click: async () => {
        const m = this.player.videoContainer.validContentIds, h = this.dualVideoContentIds.find((p) => m.indexOf(p) !== -1);
        h && this.player.videoContainer.setLayout(h);
      }
    }), u;
  }
  switchSide() {
    this._currentLayout.id === "pip-left" ? this._currentLayout = Zn : this._currentLayout = _t;
  }
  switchSources() {
    const e = this._pipVideo;
    this._pipVideo = this._fullVideo, this._fullVideo = e;
  }
  getLayoutStructure(e, t, i) {
    const { content: s } = this.validContent.find((r) => r.id === t);
    i && s.find((r) => r === i) ? (this._fullVideo = i, this._pipVideo = s.find((r) => r !== i)) : (!this._pipVideo || !this._fullVideo) && (this._pipVideo = s[0], this._fullVideo = s[1]);
    const a = JSON.parse(JSON.stringify(this._currentLayout));
    return a.player = this.player, a.videos[0].content = this._fullVideo, a.videos[1].content = this._pipVideo, a;
  }
}
class Jn extends me {
  getPluginModuleInstance() {
    return K.Get();
  }
  get name() {
    return super.name || "es.upv.paella.singleVideo";
  }
  get identifier() {
    return "single-video";
  }
  async load() {
    this.player.log.debug("Single video layout loaded"), this.dualVideoContentIds = this.config.dualVideoContentIds || [
      "presenter-presentation-dynamic",
      "presenter-2-presentation-dynamic",
      "presenter-presenter-2-dynamic",
      "presenter-presentation",
      "presenter-2-presentation",
      "presenter-presenter-2"
    ];
  }
  getValidStreams(e) {
    return super.getValidStreams(e).filter((t) => t.length === 1);
  }
  getVideoCanvasButtons(e, t, i, s) {
    return this._multiStream ? [
      {
        icon: this.player.getCustomPluginIcon(this.name, "iconSideBySide") || Ie,
        position: S.LEFT,
        title: this.player.translate("Two videos 50%"),
        ariaLabel: this.player.translate("Two videos 50%"),
        name: this.name + ":iconSideBySide",
        click: () => {
          const a = this.player.videoContainer.validContentIds, r = this.dualVideoContentIds.find((o) => a.indexOf(o) !== -1);
          r && this.player.videoContainer.setLayout(r);
        }
      }
    ] : [];
  }
  getLayoutStructure(e, t) {
    const i = this.validContent.find((a) => a.id === t), s = {
      player: this.player,
      name: { es: "One stream" },
      hidden: !1,
      videos: [
        {
          content: i.content[0],
          rect: [
            { aspectRatio: "1/1", left: 280, top: 0, width: 720, height: 720 },
            { aspectRatio: "6/5", left: 208, top: 0, width: 864, height: 720 },
            { aspectRatio: "5/4", left: 190, top: 0, width: 900, height: 720 },
            { aspectRatio: "4/3", left: 160, top: 0, width: 960, height: 720 },
            { aspectRatio: "11/8", left: 145, top: 0, width: 990, height: 720 },
            { aspectRatio: "1.41/1", left: 132, top: 0, width: 1015, height: 720 },
            { aspectRatio: "1.43/1", left: 125, top: 0, width: 1029, height: 720 },
            { aspectRatio: "3/2", left: 100, top: 0, width: 1080, height: 720 },
            { aspectRatio: "16/10", left: 64, top: 0, width: 1152, height: 720 },
            { aspectRatio: "5/3", left: 40, top: 0, width: 1200, height: 720 },
            { aspectRatio: "16/9", left: 0, top: 0, width: 1280, height: 720 },
            { aspectRatio: "1.85/1", left: 0, top: 14, width: 1280, height: 692 },
            { aspectRatio: "2.35/1", left: 0, top: 87, width: 1280, height: 544 },
            { aspectRatio: "2.41/1", left: 0, top: 94, width: 1280, height: 531 },
            { aspectRatio: "2.76/1", left: 0, top: 128, width: 1280, height: 463 }
          ],
          visible: !0,
          layer: 1
        }
      ],
      background: { content: "slide_professor_paella.jpg", zIndex: 5, rect: { left: 0, top: 0, width: 1280, height: 720 }, visible: !0, layer: 0 },
      logos: [{ content: "paella_logo.png", zIndex: 5, rect: { top: 10, left: 10, width: 49, height: 42 } }],
      buttons: [],
      onApply: function() {
      }
    };
    return e.length > 1 && (this._multiStream = !0), s;
  }
}
class Xn extends me {
  getPluginModuleInstance() {
    return K.Get();
  }
  get name() {
    return super.name || "es.upv.paella.singleVideoDynamic";
  }
  get layoutType() {
    return "dynamic";
  }
  async load() {
    this.player.log.debug("Single video dynamic layout loaded"), this.dualVideoContentIds = this.config.dualVideoContentIds || [
      "presenter-presentation-dynamic",
      "presenter-2-presentation-dynamic",
      "presenter-presenter-2-dynamic",
      "presenter-presentation",
      "presenter-2-presentation",
      "presenter-presenter-2"
    ];
  }
  getVideoCanvasButtons(e, t, i, s) {
    const a = this.player.getCustomPluginIcon(this.name, "iconSideBySide") || Ie, r = [];
    return this._multiStream && r.push({
      icon: a,
      position: S.LEFT,
      title: this.player.translate("Dual stream 50%"),
      ariaLabel: this.player.translate("Dual stream 50%"),
      name: this.name + ":iconSideBySide",
      click: async () => {
        const o = this.player.videoContainer.validContentIds, l = this.dualVideoContentIds.find((u) => o.indexOf(u) !== -1);
        l && this.player.videoContainer.setLayout(l);
      }
    }), r;
  }
  getLayoutStructure(e, t, i) {
    e.length > 1 && (this._multiStream = !0);
    const { content: s } = this.validContent.find((a) => a.id === t);
    return this._currentContent = s.map((a) => ({
      id: a,
      size: 50
    })), {
      id: "single-dynamic",
      videos: [
        {
          content: this._currentContent[0].id,
          visible: !0,
          size: this._currentContent[0].size
        }
      ]
    };
  }
}
const es = {
  videos: [
    {
      content: {},
      rect: [
        { aspectRatio: "16/9", left: 239, top: 17, width: 803, height: 451 }
      ],
      visible: !0,
      layer: 1
    },
    {
      content: {},
      rect: [
        { aspectRatio: "16/9", left: 44, top: 482, width: 389, height: 218 }
      ],
      visible: !0,
      layer: 1
    },
    {
      content: {},
      rect: [
        { aspectRatio: "16/9", left: 847, top: 482, width: 389, height: 218 }
      ],
      visible: !0,
      layer: 1
    }
  ],
  buttons: [
    {
      rect: { left: 618, top: 495, width: 45, height: 45 },
      onClick: function(n) {
        this.rotate();
      },
      label: "Rotate",
      icon: "icon_rotate.svg",
      layer: 2
    }
  ]
};
function ts(n) {
  let e = JSON.parse(JSON.stringify(es));
  return e.videos[0].content = n[0], e.videos[1].content = n[1], e.videos[2].content = n[2], e;
}
class is extends me {
  getPluginModuleInstance() {
    return K.Get();
  }
  get name() {
    return super.name || "es.upv.paella.tripleVideo";
  }
  get identifier() {
    return "triple-video";
  }
  async load() {
    this.player.log.debug("Triple video layout loaded");
  }
  getValidStreams(e) {
    return super.getValidStreams(e).filter((t) => t.length === 3);
  }
  switchContent() {
    const e = this._currentContent[0], t = this._currentContent[1], i = this._currentContent[2];
    this._currentContent[0] = i, this._currentContent[1] = e, this._currentContent[2] = t, this.player.videoContainer.updateLayout();
  }
  getLayoutStructure(e, t) {
    if (!this._currentContent || this._currentContentId !== t) {
      this._currentContentId = t;
      const { content: a } = this.validContent.find((r) => r.id === t);
      this._currentContent = a;
    }
    const i = ts(this._currentContent);
    return {
      player: this.player,
      name: { es: "Three streams with dynamic position" },
      hidden: !1,
      videos: i.videos,
      buttons: [
        {
          rect: i.buttons[0].rect,
          onClick: () => {
            this.switchContent();
          },
          label: "Switch",
          icon: li,
          layer: 2,
          ariaLabel: "Swap the position of the videos",
          title: "Swap the position of the videos"
        }
      ]
    };
  }
}
class ns extends ri {
  constructor(e, t) {
    super("div", e, t), this.element.classList.add("image-canvas");
  }
  async loadCanvas(e) {
    e.element.style.width = "100%", e.element.style.height = "100%";
  }
}
class ss extends oi {
  get name() {
    return super.name || "es.upv.paella.audioCanvas";
  }
  get canvasType() {
    return "audio";
  }
  getCanvasInstance(e) {
    return new ns(this.player, e);
  }
}
class as extends ri {
  constructor(e, t) {
    super("div", e, t);
  }
  async loadCanvas(e) {
    e.element.style.width = "100%", e.element.style.height = "100%";
  }
}
class rs extends oi {
  get name() {
    return super.name || "es.upv.paella.videoCanvas";
  }
  get canvasType() {
    return "video";
  }
  async isCompatible(e) {
    return !Array.isArray(e.canvas) || e.canvas.length === 0 ? !0 : await super.isCompatible(e);
  }
  getCanvasInstance(e) {
    return new as(this.player, e);
  }
}
class ci extends he {
  get type() {
    return "data";
  }
  get context() {
    return this.config.context || [];
  }
  async read() {
    throw Error(`DataPlugin.read() not implemented in data plugin '${this.name}'`);
  }
  async write() {
    throw Error(`DataPlugin.write() not implemented in data plugin '${this.name}'`);
  }
  async remove() {
    throw Error(`DataPlugin.remove() not implemented in data plugin '${this.name}'`);
  }
}
class os extends de {
  constructor(e) {
    super(e), this._dataPlugins = {}, $(this.player, "data", async (t) => {
      var i;
      (i = t.context) == null || i.forEach((s) => {
        this._dataPlugins[s] = this._dataPlugins[s] || [], this._dataPlugins[s].push(t);
      });
    });
  }
  getDataPlugin(e) {
    let t = this._dataPlugins[e] && this._dataPlugins[e].length > 0 && this._dataPlugins[e][0];
    if (t || (t = this._dataPlugins.default && this._dataPlugins.default.length > 0 && this._dataPlugins.default[0]), !t)
      throw Error(`No data plugin found for context '${e}'`);
    return t;
  }
  getDataPlugins(e) {
    let t = this._dataPlugins[e] && this._dataPlugins[e].length > 0 && this._dataPlugins[e];
    if (t || (t = this._dataPlugins.default && this._dataPlugins.default.length > 0 && this._dataPlugins.default), !t)
      throw Error(`No data plugin found for context '${e}'`);
    return t;
  }
  async read(e, t) {
    return await this.getDataPlugin(e).read(e, t);
  }
  async write(e, t, i) {
    const s = this.getDataPlugins(e);
    if (Array.isArray(s)) {
      let a = null;
      for (let r = 0; r < s.length; ++r)
        a = await s[r].write(e, t, i);
      return a;
    } else {
      if (s)
        return await s.write(e, t, i);
      this.player.log.warn(`No such data plugin found for context '${e}'`);
    }
  }
  async remove(e, t) {
    const i = this.getDataPlugins(e);
    if (i.length > 1) {
      let s = null;
      for (let a = 0; a < i.length; ++a)
        s = await i[a].remove(e, t);
      return s;
    } else
      return await i.remove(e, t);
  }
}
let He = null;
class Oe extends Ue {
  static Get() {
    return He || (He = new Oe()), He;
  }
  get moduleName() {
    return "paella-core default data plugins";
  }
  get moduleVersion() {
    return Te.version;
  }
}
class ls extends ci {
  getPluginModuleInstance() {
    return Oe.Get();
  }
  get name() {
    return super.name || "es.upv.paella.cookieDataPlugin";
  }
  serializeKey(e, t) {
    return typeof t == "object" && (t = JSON.stringify(t)), `${e}|${t}`;
  }
  async read(e, t) {
    const i = this.serializeKey(e, t);
    let s = Y(i);
    try {
      s = JSON.parse(s);
    } catch {
    }
    return this.player.log.debug(`CookieDataPlugin.read: ${i}`), s;
  }
  async write(e, t, i) {
    const s = this.serializeKey(e, t);
    if (i && typeof i == "object")
      try {
        i = JSON.stringify(i);
      } catch {
        this.player.log.warn(`CookieDataPlugin.write: ${s}: invalid data object.`), i = "";
      }
    ne(s, i), this.player.log.debug(`CookieDataPlugin.write: ${s}`);
  }
  async remove(e, t) {
    const i = this.serializeKey(e, t);
    ne(i, ""), this.player.log.debug(`CookieDataPlugin.remove: ${i}`);
  }
}
class cs extends ci {
  getPluginModuleInstance() {
    return Oe.Get();
  }
  get name() {
    return super.name || "es.upv.paella.localStorageDataPlugin";
  }
  serializeKey(e, t) {
    return typeof t == "object" && (t = JSON.stringify(t)), `${e}|${t}`;
  }
  async read(e, t) {
    const i = this.serializeKey(e, t);
    let s = localStorage.getItem(i);
    try {
      s = JSON.parse(s);
    } catch {
    }
    return this.player.log.debug(`LocalStorageDataPlugin.read: ${i}`), s;
  }
  async write(e, t, i) {
    const s = this.serializeKey(e, t);
    if (i && typeof i == "object")
      try {
        i = JSON.stringify(i);
      } catch {
        this.player.log.warn(`LocalStorageDataPlugin.write: ${s}: invalid data object.`), i = "";
      }
    localStorage.setItem(s, i), this.player.log.debug(`LocalStorageDataPlugin.write: ${s}`);
  }
  async remove(e, t) {
    const i = this.serializeKey(e, t);
    localStorage.setItem(i, ""), this.player.log.debug(`LocalStorageDataPlugin.remove: ${i}`);
  }
}
const us = [
  {
    plugin: rn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: on,
    config: {
      enabled: !1
    }
  },
  {
    plugin: hn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: gn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: yn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: xn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: Nn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: Un,
    config: {
      enabled: !1
    }
  },
  {
    plugin: vt,
    config: {
      enabled: !1
    }
  },
  {
    plugin: Yn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: Kn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: Jn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: Xn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: vt,
    config: {
      enabled: !1
    }
  },
  {
    plugin: is,
    config: {
      enabled: !1
    }
  },
  {
    plugin: ss,
    config: {
      enabled: !1
    }
  },
  {
    plugin: rs,
    config: {
      enabled: !1
    }
  },
  {
    plugin: ls,
    config: {
      enabled: !1,
      context: ["default"]
    }
  },
  {
    plugin: cs,
    config: {
      enable: !0,
      context: ["default"]
    }
  }
];
class ds extends st {
  constructor() {
    super(...arguments), this._refreshContent = !0;
  }
  set refreshContent(e) {
    this._refreshContent = e;
  }
  get refreshContent() {
    return this._refreshContent;
  }
  get closeParentPopUp() {
    return this.config.closeParentPopUp || this.getCloseParentPopUp();
  }
  getCloseParentPopUp() {
    return !1;
  }
  async action(e, t) {
    super.action(e, t), this.parentPopUp = t, await this.showPopUp();
  }
  get parentPopUp() {
    return this._parentPopUp;
  }
  set parentPopUp(e) {
    this._parentPopUp = e;
  }
  get popUp() {
    return this._popUp;
  }
  get menuTitle() {
    return this.config.menuTitle || null;
  }
  get moveable() {
    return this.config.moveable ?? !1;
  }
  get resizeable() {
    return this.config.resizeable ?? !1;
  }
  get customPopUpClass() {
    return this.config.customPopUpClass ?? "";
  }
  get closeActions() {
    var i, s;
    const e = ((i = this.config.closeActions) == null ? void 0 : i.clickOutside) ?? !0, t = ((s = this.config.closeActions) == null ? void 0 : s.closeButton) ?? !1;
    return {
      clickOutside: e,
      closeButton: t
    };
  }
  get currentContent() {
    return this._currentContent;
  }
  async getContent() {
    return L("<p>Pop Up Button Plugin Content</p>");
  }
  async checkRefreshContent() {
    if (this.refreshContent) {
      const e = await this.getContent();
      this._currentContent.innerHTML = "", Array.from(e.children).forEach((i) => this._currentContent.appendChild(i));
    }
  }
  get popUpType() {
    return this.config.popUpType || "modal";
  }
  hidePopUp() {
    this.player.playbackBar.popUp.isHidden || this.player.playbackBar.popUp.hide();
  }
  async showPopUp() {
    this._keyEventHandler || (this._keyEventHandler = (t) => {
      t.key === "Escape" && this.hidePopUp();
    }, this.button.addEventListener("keydown", this._keyEventHandler));
    const e = this.player.playbackBar.popUp;
    if (e.isHidden || this._contentId !== e.currentContentId) {
      const t = await this.getContent();
      this._currentContent = t, this._contentId = e.show({
        title: this.menuTitle || this.description,
        content: t,
        attachRight: this.popUpType === "timeline" || this.side === "right",
        attachLeft: this.popUpType === "timeline" || this.side === "left",
        parent: this.parentPopUp
      });
    } else
      e.hide();
  }
}
const hs = (n) => n ? `<span class="menu-title">${n}</span>` : "", ps = (n) => n ? `<i class="menu-icon">${n}</i>` : "", gs = (n) => n ? `aria-label="${n}"` : "", ms = (n) => n ? `<span class="state-text">${n}</span>` : "", fs = (n) => n ? `<i class="state-icon">${n}</i>` : "", ys = (n, e) => n || e ? `<span class="button-state">${ms(n)}${fs(e)}</span>` : "";
function vs(n, e, t, i, s, a, r) {
  const { id: o = 0, title: l = null, icon: u = null, showTitle: m = !0, stateText: h = null, stateIcon: p = null } = n, v = this, C = document.createElement("li"), b = a[o] ?? !1, _ = L(`
		<button class="menu-button-item${b ? " selected" : ""}" ${gs(l)} data-id="${o}"" id="${v.name}_menuItem_${o}">
			${ps(u)}
			${m ? hs(l) : ""}
			${h || p ? ys(h, p) : ""}
		</button>
	`);
  return r && (r._button = _), _.addEventListener("keydown", (c) => {
    var P;
    const f = () => {
      c.stopPropagation(), c.preventDefault();
    };
    if (c.key === "ArrowUp") {
      const y = _.dataPrev;
      y == null || y.focus(), f();
    } else if (c.key === "ArrowDown") {
      const y = _.dataNext;
      y == null || y.focus(), f();
    } else if (c.key === "Tab") {
      const y = c.shiftKey ? c.target.dataPrev : c.target.dataNext;
      y == null || y.focus(), f();
    } else c.key === "Escape" && (this.player.playbackBar.popUp.pop() ? (P = v.button) == null || P.focus() : this.focus(), f());
  }), _.addEventListener("click", async (c) => {
    var f;
    if (e === "check") {
      const P = i.find((y) => y.id === o);
      a[o] = !a[o], v.itemSelected(P, i);
    } else if (e === "radio") {
      a[o] = !0;
      let P = null;
      i.forEach((y) => {
        y.id === o ? P = y : a[y.id] = !1;
      }), v.itemSelected(P, i);
    } else {
      const P = i.find((y) => y.id === o);
      v.itemSelected(P, i);
    }
    await v.checkRefreshContent(), c.stopPropagation(), v.closeOnSelect && (v.closeMenu(), (f = v.button) == null || f.focus());
  }), C.appendChild(_), t.appendChild(C), C;
}
class _s extends ds {
  get closeOnSelect() {
    return this.config.closeOnSelect === void 0 && (this.buttonType !== "check" ? this.config.closeOnSelect = !0 : this.config.closeOnSelect = !1), this.config.closeOnSelect;
  }
  setSelected(e, t) {
    this._selectedItems && (this._selectedItems[e] = t);
  }
  async getContent() {
    var r, o;
    const e = (r = document.activeElement) == null ? void 0 : r.id, t = L("<menu></menu>");
    this._content = t;
    const i = await this.getMenu();
    this._menuItems = i, this._selectedItems || (this._selectedItems = {}, this._menuItems.forEach((l) => {
      l.selected !== void 0 && l.selected !== null && (this._selectedItems[l.id] = l.selected);
    }));
    const s = self.crypto.randomUUID(), a = i.map((l) => vs.apply(this, [l, typeof this.buttonType == "function" ? this.buttonType() : this.buttonType, t, i, s, this._selectedItems, l.plugin]));
    return a.forEach((l, u, m) => {
      const h = l.querySelector("button");
      let p = m[u + 1], v = m[u - 1];
      u === m.length - 1 && (p = m[0]), u === 0 && (v = m[m.length - 1]), h.dataNext = p == null ? void 0 : p.querySelector("button"), h.dataPrev = v == null ? void 0 : v.querySelector("button");
    }), this._firstItem = (o = a[0]) == null ? void 0 : o.querySelector("button"), e && setTimeout(() => {
      var l;
      (l = document.getElementById(e)) == null || l.focus();
    }, 10), t;
  }
  get menuTitle() {
    return this.config.menuTitle || null;
  }
  async getMenu() {
    return [
      { id: 0, title: "Option 1" },
      { id: 1, title: "Option 2" },
      { id: 2, title: "Option 3" },
      { id: 3, title: "Option 4" },
      { id: 4, title: "Option 5" }
    ];
  }
  // Returns the menuItems with the current menu state
  get menuItems() {
    return this._menuItems;
  }
  // If showTitles is false, then the 'title' attribute of the menu
  // items is used only as aria-label.
  // If the menu item has no icon, then the `showTitles` property is ignored
  get showTitles() {
    return !0;
  }
  get buttonType() {
    return "radio";
  }
  itemSelected(e, t) {
    this.player.log.warn(`MenuButtonPlugin (${this.name}): itemSelected() function not implemented.`);
  }
  closeMenu() {
    this.player.playbackBar.popUp.hide();
  }
  async showPopUp() {
    this.refreshContent = !0, await super.showPopUp(), this.player.containsFocus && this._firstItem && this._firstItem.focus();
  }
}
class ws extends _s {
  get closeOnSelect() {
    return this.config.closeOnSelect ?? !1;
  }
  async load() {
    this._iconPath && (this.icon = await Et(this._iconPath));
  }
  async getContent() {
    return this._buttonPlugins || (this._buttonPlugins = [], await $(this.player, "button", async (e) => {
      this.player.log.debug(`Load button plugins into "${this.groupName}" container`), this._buttonPlugins.push(e), e.setObserver(this);
    }, async (e) => e.parentContainer === this.groupName ? await e.isEnabled() : !1)), await super.getContent();
  }
  onIconChanged(e, t, i) {
  }
  onTitleChanged(e, t, i) {
  }
  onStateChanged(e, t, i, s, a) {
  }
  get groupName() {
    var e;
    return ((e = this.config) == null ? void 0 : e.groupName) || "buttonGroup";
  }
  get popUpType() {
    return "no-modal";
  }
  getClosePopUps() {
    return !1;
  }
  buttonType() {
    return "button";
  }
  async getMenu() {
    return this._buttonPlugins.map((e) => ({
      id: e.name,
      title: e.title || e.description,
      icon: e.icon,
      plugin: e
    }));
  }
  itemSelected(e, t) {
    const i = this._buttonPlugins.find((s) => s.name === e.id);
    if (i) {
      const s = new Event("menuitemselected");
      i.action(s, this.currentContent);
    }
  }
  async showPopUp() {
    var e;
    await super.showPopUp(), setTimeout(() => {
      this._firstItem && this._firstItem.focus();
    }, 50), (e = this.buttons) == null || e.forEach((t) => {
      t.style.display === "none" ? this.hideButtonContainer(t) : this.showButtonContainer(t);
    });
  }
  get buttons() {
    return this._content && Array.from(this._content.getElementsByClassName("button-plugin"));
  }
  hideButtonContainer(e) {
    var i;
    const t = (i = e.parentNode) == null ? void 0 : i.parentNode;
    t && (t.style.display = "none");
  }
  showButtonContainer(e) {
    var i;
    const t = (i = e.parentNode) == null ? void 0 : i.parentNode;
    t && (t.style.display = null);
  }
}
const lt = (n, e, t, i = {}) => {
  const s = new n(e, t);
  return t = s.name || t, t ? (e.config.plugins && e.config.plugins[t] && we(i, e.config.plugins[t], !1), s._config = i, s) : (e.log.warn(`The instance of the ${n.name} plugin cannot be created because it is being loaded explicitly and does not have the name property implemented.`), null);
};
function ct(n, e, t, i, s = !1) {
  const a = t.type;
  let r = -1;
  if (n.__pluginData__.pluginInstances[a] && n.__pluginData__.pluginInstances[a].find((l, u) => {
    if (l.name === t.name)
      return r = u, !0;
  }) && !s) {
    n.log.info(`Plugin ${t.name} of type ${a} already registered.`);
    return;
  }
  n.__pluginData__.pluginClasses[e] = i, n.__pluginData__.pluginInstances[a] = n.__pluginData__.pluginInstances[a] || [], r !== -1 && n.__pluginData__.pluginInstances[a].splice(r, 1), n.__pluginData__.pluginInstances[a].push(t), n.__pluginModules = n.__pluginModules || [];
  const o = t.getPluginModuleInstance();
  if (o && (o._player = o._player || n, !n.__pluginModules.find((l) => l.constructor.name === o.constructor.name))) {
    const l = o.moduleName, u = o.moduleVersion;
    n.log.debug(`Plugin module imported: ${l}: v${u}`), n.__pluginModules.push(o);
  }
}
function Cs(n, e) {
  let t = null, i = { enabled: !0 };
  if (typeof e == "function" ? t = e : typeof e == "object" && typeof e.plugin == "function" && (t = e.plugin, i = e.config), !t)
    n.log.warn("Error importing plugin with explicit import API. Check the 'plugins' array at init params");
  else {
    const s = lt(t, n, null, i);
    if (!s)
      n.log.warn(`Unable to create an instance of the plugin ${t.name}`);
    else {
      const a = s.constructor.name;
      ct(n, a, s, t, !0);
    }
  }
}
function ca(n, e) {
  const t = n.config;
  e.keys().forEach((i) => {
    const s = e(i), a = i.substring(2, i.length - 3);
    if (t.plugins[a]) {
      const r = s.default, o = lt(r, n, a, {});
      ct(n, i, o, r, !1);
    } else if (/^[a-z0-9]+$/i.test(a)) {
      n.__pluginModules = n.__pluginModules || [];
      const r = s.default, o = new r(n);
      if (!n.__pluginModules.find((l) => l.constructor.name === o.constructor.name)) {
        const l = o.moduleName, u = o.moduleVersion;
        n.log.debug(`Plugin module imported: ${l}: v${u}`), n.__pluginModules.push(o);
      }
    }
  });
}
function bs(n) {
  const e = n.config;
  if (n.__pluginData__ = n.__pluginData__ || {
    pluginClasses: [],
    pluginInstances: {}
  }, n.__pluginData__.pluginClasses.length !== 0) return;
  [
    ...us,
    ...n.initParams.plugins
  ].forEach((i) => {
    Cs(n, i);
  });
  const { buttonGroups: t } = e;
  t && t.forEach((i, s) => {
    const a = `button_group_${s}`, r = lt(ws, n, a, i);
    r._iconPath = G([n.configResourcesUrl, i.icon]), ct(n, r.type, r, `ButtonGroupPlugin${s}`, !1);
  }), n.log.debug("Plugins have been registered:");
}
function Ls(n) {
  delete n.__pluginData__;
}
function ui(n, e) {
  var t;
  return ((t = n.__pluginData__) == null ? void 0 : t.pluginInstances[e]) || [];
}
async function $(n, e, t = null, i = null) {
  if (!n.__pluginData__.pluginInstances[e]) {
    n.log.info(`There are no defined plugins of type '${e}'`);
    return;
  }
  n.__pluginData__.pluginInstances[e].sort((s, a) => s.order - a.order), n.__pluginData__.pluginInstances[e].forEach((s) => n.log.debug(`type: ${e}, name: ${s.name}`)), typeof i != "function" && (i = async function(s) {
    return await s.isEnabled();
  });
  for (const s in n.__pluginData__.pluginInstances[e]) {
    const a = n.__pluginData__.pluginInstances[e][s];
    if (await i(a)) {
      if (a.__uiPlugin) {
        const o = await a.getDictionaries();
        if (typeof o == "object")
          for (const l in o) {
            const u = o[l];
            n.addDictionary(l, u);
          }
      }
      typeof t == "function" && await t(a), await a.load();
    }
  }
}
async function di(n, e) {
  var t;
  (t = n.__pluginData__.pluginInstances[e]) == null || t.forEach(async (i) => {
    await i.unload();
  });
}
function Ps(n) {
  var t;
  const e = (i, s) => {
    if (!i)
      throw new Error(`Invalid video manifest: ${s}`);
  };
  e(n.streams, "missing 'streams' object."), e(n.streams.length > 0, "the 'streams' array is empty."), e((t = n.metadata) == null ? void 0 : t.preview, "the 'metadata.preview' field is required.");
}
class Es extends de {
  constructor(e, t) {
    super(e, t), this._videoContainer = t, this._streamData = null, this._streams = null, this._players = [], this._mainAudioPlayer = null, this._streamSyncTimer = null, this._trimming = {
      enabled: !1,
      start: 100,
      end: 200
    };
  }
  async load(e) {
    this._streamData = e, this._streams = {};
    let t = this.player.config.defaultAudioStream || "presenter";
    this._streamData.length === 1 && (t = this._streamData[0].content), e.some((i) => {
      if (i.role === "mainAudio")
        return t = i.content, !0;
    }), this.player.log.debug("Finding compatible video plugins"), await Gn(this.player);
    for (const i of this._streamData) {
      const s = Hn(this.player, i);
      if (!s)
        throw Error(`Canvas plugin not found: ${i.canvas}`);
      const a = i.content === t, r = await Ui(this.player, i);
      if (!r)
        throw Error(`Incompatible stream type: ${i.content}`);
      this._streams[i.content] = {
        stream: i,
        isMainAudio: a,
        videoPlugin: r,
        canvasPlugin: s
      };
    }
    for (const i in this._streams) {
      const s = this._streams[i];
      s.canvas = await s.canvasPlugin.getCanvasInstance(this._videoContainer), s.player = await s.videoPlugin.getVideoInstance(s.canvas.element, s.isMainAudio), t === i ? (this._mainAudioPlayer = s.player, s.player.initVolume(1)) : s.player.initVolume(0), await s.player.load(s.stream, this), await s.canvas.loadCanvas(s.player), s.player.onVideoEnded(() => {
        this.executeAction("pause"), this.executeAction("setCurrentTime", 0), se(this.player, g.ENDED);
      }), this._players.push(s.player);
    }
    if (this.mainAudioPlayer === null)
      throw this.player.log.error("The video stream containing the audio track could not be identified. The `role` attribute must be specified in the main video stream, or the `defaultAudioStream` attribute must be set correctly in the player configuration."), new Error("The video stream containing the audio track could not be identified.");
  }
  async unload() {
    this.stopStreamSync(), await zn(this.player);
  }
  get players() {
    return this._players;
  }
  // This is the raw streamData loaded from the video manifest
  get streamData() {
    return this._streamData;
  }
  // This property stores the available streams, indexed by the content identifier, and contains the
  // stream data, the video plugin and the player, for each content identifier.
  get streams() {
    return this._streams;
  }
  get mainAudioPlayer() {
    return this._mainAudioPlayer;
  }
  get isTrimEnabled() {
    var e, t, i;
    return ((e = this._trimming) == null ? void 0 : e.enabled) && ((t = this._trimming) == null ? void 0 : t.end) > ((i = this._trimming) == null ? void 0 : i.start);
  }
  get trimStart() {
    var e;
    return (e = this._trimming) == null ? void 0 : e.start;
  }
  get trimEnd() {
    var e;
    return (e = this._trimming) == null ? void 0 : e.end;
  }
  async setTrimming({ enabled: e, start: t, end: i }) {
    if (t >= i)
      throw Error(`Error setting trimming: start time (${t}) must be lower than end time ${i}`);
    this._trimming = {
      enabled: e,
      start: t,
      end: i
    };
    const s = await this.currentTime();
    se(this.player, g.TIMEUPDATE, { currentTime: e ? t + s : s });
  }
  startStreamSync() {
    this._timeSync = !0;
    const e = async () => {
      if (!this._players.length) {
        this.player.log.warn("Player not yet loaded. Waiting for video sync.");
        return;
      }
      let t = this.mainAudioPlayer.currentTimeSync;
      const i = 0.2;
      if (this.players.length > 1)
        for (let s = 0; s < this.players.length; ++s) {
          const a = this.players[s];
          if (a !== this.mainAudioPlayer) {
            const r = a.currentTimeSync;
            Math.abs(t - r) > i && (this.player.log.debug("Video synchronization triggered"), a.setCurrentTime(t));
          }
        }
      if (this.isTrimEnabled) {
        let s = t - this.trimStart;
        if (this.trimEnd <= t) {
          await this.executeAction("pause"), await this.setCurrentTime(0), this.stopStreamSync(), t = 0, se(this.player, g.ENDED, {});
          return;
        } else t < this.trimStart && (await this.setCurrentTime(0), t = this.trimStart, s = 0);
        se(this.player, g.TIMEUPDATE, { currentTime: s }), this._timeupdateTimer = setTimeout(() => {
          this._timeSync && e();
        }, 250);
      } else this._timeSync && (se(this.player, g.TIMEUPDATE, { currentTime: t }), this._timeupdateTimer = setTimeout(() => {
        e();
      }, 250));
    };
    e();
  }
  stopStreamSync() {
    this._timeSync = !1, this._timeupdateTimer && clearTimeout(this._timeupdateTimer);
  }
  executeAction(e, t = []) {
    return Array.isArray(t) || (t = [t]), new Promise((i) => {
      let s = [], a = [];
      this.players.forEach((r) => {
        a.push(new Promise((o) => {
          r[e](...t).then((l) => {
            s.push(l), o();
          });
        }));
      }), Promise.allSettled(a).then(() => i(s));
    });
  }
  get isLiveStream() {
    return this._streamData.some((e) => Array.from(Object.keys(e.sources)).indexOf("hlsLive") !== -1);
  }
  async play() {
    return this.startStreamSync(), await this.executeAction("play");
  }
  async pause() {
    return this.stopStreamSync(), await this.executeAction("pause");
  }
  async stop() {
    this.stopStreamSync(), await this.executeAction("pause"), await this.executeAction("setCurrentTime", 0);
  }
  async paused() {
    return (await this.executeAction("paused"))[0];
  }
  async setCurrentTime(e) {
    const t = await this.duration();
    e < 0 ? e = 0 : e > t && (e = t);
    const i = (await this.executeAction("currentTime"))[0];
    let s = null;
    if (this.isTrimEnabled) {
      e = e + this.trimStart, e = e >= this.trimEnd ? this.trimEnd : e;
      const r = (await this.executeAction("setCurrentTime", [e]))[0], o = (await this.executeAction("currentTime"))[0];
      s = {
        result: r,
        prevTime: i - this.trimStart,
        newTime: o - this.trimStart
      };
    } else {
      const r = (await this.executeAction("setCurrentTime", [e]))[0], o = (await this.executeAction("currentTime"))[0];
      s = { result: r, prevTime: i, newTime: o };
    }
    const a = await this.currentTime();
    return se(this.player, g.TIMEUPDATE, { currentTime: a }), s;
  }
  async currentTime() {
    const e = await this.mainAudioPlayer.currentTime();
    return this.isTrimEnabled ? e - this.trimStart : e;
  }
  async currentTimeIgnoringTrimming() {
    return await this.mainAudioPlayer.currentTime();
  }
  async volume() {
    return this.mainAudioPlayer ? await this.mainAudioPlayer.volume() : (await this.executeAction("volume"))[0];
  }
  async setVolume(e) {
    return this.mainAudioPlayer ? await this.mainAudioPlayer.setVolume(e) : (await this.executeAction("setVolume", [e]))[0];
  }
  async duration() {
    return this.isTrimEnabled ? this.trimEnd - this.trimStart : await this.durationIgnoringTrimming();
  }
  async durationIgnoringTrimming() {
    return (await this.executeAction("duration")).reduce((t, i) => Math.min(t, i), Number.MAX_VALUE);
  }
  async playbackRate() {
    return (await this.executeAction("playbackRate"))[0];
  }
  async setPlaybackRate(e) {
    return (await this.executeAction("setPlaybackRate", [e]))[0];
  }
  async getQualityReferencePlayer() {
    let e = null, t = [];
    if (Object.keys(this.streams).length > 0)
      for (const i in this.streams) {
        const s = this.streams[i], a = await s.player.getQualities() || [];
        !e && a.length > t.length && (t = a, e = s.player);
      }
    return e || this.mainAudioPlayer;
  }
  async getCurrentQuality() {
    return (await this.getQualityReferencePlayer()).currentQuality;
  }
  async getQualities() {
    return await (await this.getQualityReferencePlayer()).getQualities();
  }
  async setQuality(e) {
    const i = await (await this.getQualityReferencePlayer()).getQualities(), s = i.length;
    let a = -1;
    if (i.some((r, o) => (e.index === r.index && (a = o), a !== -1)), a >= 0) {
      const r = a / s;
      for (const o in this.streams) {
        const l = this.streams[o], u = await l.player.getQualities() || [];
        if (this.player.log.debug(u), u.length > 1) {
          const m = Math.round(u.length * r), h = u[m];
          await l.player.setQuality(h);
        }
      }
    }
  }
  async supportsMultiaudio() {
    return this.mainAudioPlayer.supportsMultiaudio();
  }
  async getAudioTracks() {
    return this.mainAudioPlayer.getAudioTracks();
  }
  async setCurrentAudioTrack(e) {
    return this.mainAudioPlayer.setCurrentAudioTrack(e);
  }
  get currentAudioTrack() {
    return this.mainAudioPlayer.currentAudioTrack;
  }
}
const U = Object.freeze({
  TOP_LEFT: "topLeft",
  TOP_MIDDLE: "topMiddle",
  TOP_RIGHT: "topRight",
  CENTER_LEFT: "centerLeft",
  CENTER_MIDDLE: "centerMiddle",
  CENTER_RIGHT: "centerRight",
  BOTTOM_LEFT: "bottomLeft",
  BOTTOM_MIDDLE: "bottomMiddle",
  BOTTOM_RIGHT: "bottomRight"
}), B = (n, e, t, i, s) => {
  i = i || "", t = t || 1e3;
  const a = L(`
        <div class="message-content ${i}">
            ${n ? `<i class="icon">${n}</i>` : ""}
            ${e ? `<p class="text">${e}</p>` : ""}
        </div>
    `);
  return s.innerHTML = "", s.appendChild(a), s.timer && (clearTimeout(s.timer), s.timer = null), s.timer = setTimeout(() => {
    s.removeChild(a);
  }, t), a;
};
class Ss extends z {
  constructor(e, t) {
    const i = { class: "video-container-message" };
    super(e, { attributes: i, parent: t }), this._topLeftContainer = L('<div class="container top-left"></div>', this.element), this._topMiddleContainer = L('<div class="container top-middle"></div>', this.element), this._topRightContainer = L('<div class="container top-right"></div>', this.element), this._centerLeftContainer = L('<div class="container center-left"></div>', this.element), this._centerMiddleContainer = L('<div class="container center-middle"></div>', this.element), this._centerRightContainer = L('<div class="container center-right"></div>', this.element), this._bottomLeftContainer = L('<div class="container bottom-left"></div>', this.element), this._bottomMiddleContainer = L('<div class="container bottom-middle"></div>', this.element), this._bottomRightContainer = L('<div class="container bottom-right"></div>', this.element);
  }
  show({ icon: e = null, text: t = "", timeout: i = 1e3, position: s = U.CENTER_MIDDLE, cssClass: a = "" }) {
    switch (s) {
      case U.TOP_LEFT:
        B.apply(this, [e, t, i, a, this._topLeftContainer]);
        break;
      case U.TOP_MIDDLE:
        B.apply(this, [e, t, i, a, this._topMiddleContainer]);
        break;
      case U.TOP_RIGHT:
        B.apply(this, [e, t, i, a, this._topRightContainer]);
        break;
      case U.CENTER_LEFT:
        B.apply(this, [e, t, i, a, this._centerLeftContainer]);
        break;
      case U.CENTER_MIDDLE:
        B.apply(this, [e, t, i, a, this._centerMiddleContainer]);
        break;
      case U.CENTER_RIGHT:
        B.apply(this, [e, t, i, a, this._centerRightContainer]);
        break;
      case U.BOTTOM_LEFT:
        B.apply(this, [e, t, i, a, this._bottomLeftContainer]);
        break;
      case U.BOTTOM_MIDDLE:
        B.apply(this, [e, t, i, a, this._bottomMiddleContainer]);
        break;
      case U.BOTTOM_RIGHT:
        B.apply(this, [e, t, i, a, this._bottomRightContainer]);
        break;
    }
  }
}
const w = Object.freeze({
  UNLOADED: 0,
  LOADING_MANIFEST: 1,
  MANIFEST: 2,
  LOADING_PLAYER: 3,
  LOADED: 4,
  UNLOADING_MANIFEST: 5,
  UNLOADING_PLAYER: 6,
  ERROR: 7
});
function Ts(n, e) {
  return Array.isArray[e] || (e = [e]), Ni(n, e).getManifestData(e);
}
async function Is(n) {
  return { w: 1280, h: 720 };
}
async function hi(n) {
  var e;
  for (const t in this.streamProvider.streams) {
    const i = ((e = n == null ? void 0 : n.videos) == null ? void 0 : e.find((a) => a.content === t)) != null, s = this.streamProvider.streams[t];
    i && !s.player.isEnabled ? await s.player.enable() : !i && s.player.isEnabled && await s.player.disable();
  }
}
function pi() {
  for (const n in this.streamProvider.streams) {
    const e = this.streamProvider.streams[n];
    e.canvas.element.style.display = "none", this._hiddenVideos.appendChild(e.canvas.element);
  }
}
async function ks() {
  var a, r;
  const n = ai(this.player, this.streamProvider.streamData, this._layoutId, this._mainLayoutContent);
  await hi.apply(this, [n]), pi.apply(this);
  const e = await Is(this.player), t = 100 / e.w, i = 100 / e.h;
  if (this.baseVideoRect.classList.remove("dynamic"), this.baseVideoRect.classList.add("static"), (a = n == null ? void 0 : n.videos) != null && a.length) {
    const o = [];
    for (const l of n.videos) {
      const u = this.streamProvider.streams[l.content], { stream: m, player: h, canvas: p } = u, v = await h.getDimensions(), C = v.w / v.h;
      let b = Number.MAX_VALUE, _ = null;
      p.buttonsArea.innerHTML = "", o.push(await Ye(this.player, n, p, l, l.content)), l.rect.forEach((c) => {
        const f = /^(\d+.?\d*)\/(\d+.?\d*)$/.exec(c.aspectRatio), P = f ? Number(f[1]) / Number(f[2]) : 1, y = Math.abs(C - P);
        y < b && (_ = c, b = y);
      }), p.element.style.display = "block", p.element.style.position = "absolute", p.element.style.left = `${(_ == null ? void 0 : _.left) * t}%`, p.element.style.top = `${(_ == null ? void 0 : _.top) * i}%`, p.element.style.width = `${(_ == null ? void 0 : _.width) * t}%`, p.element.style.height = `${(_ == null ? void 0 : _.height) * i}%`, p.element.style.zIndex = l.layer, this.baseVideoRect.appendChild(p.element);
    }
    setTimeout(() => {
      Ze(this.player, n, o.flat());
    }, 100);
  }
  const s = this.baseVideoRect.getElementsByClassName("video-layout-button");
  return Array.from(s).forEach((o) => this.baseVideoRect.removeChild(o)), (r = n == null ? void 0 : n.buttons) == null || r.forEach((o) => {
    const l = Ut({
      tag: "button",
      attributes: {
        class: "video-layout-button",
        "aria-label": Ce(o.ariaLabel),
        title: Ce(o.title),
        style: `
                    left: ${o.rect.left * t}%;
                    top: ${o.rect.top * i}%;
                    width: ${o.rect.width * t}%;
                    height: ${o.rect.height * i}%;
                    z-index: ${o.layer};
                `
      },
      parent: this.baseVideoRect,
      children: o.icon
    });
    l.layout = n, l.buttonAction = o.onClick, l.addEventListener("click", async (u) => {
      E(this.player, g.BUTTON_PRESS, {
        plugin: n.plugin,
        layoutStructure: n
      }), await u.target.buttonAction.apply(u.target.layout), u.stopPropagation();
    }), this._layoutButtons.push(l);
  }), !0;
}
async function Ds() {
  var r, o, l, u, m, h;
  const n = ai(this.player, this.streamProvider.streamData, this._layoutId, this._mainLayoutContent);
  await hi.apply(this, [n]), pi.apply(this), this.baseVideoRect.classList.add("dynamic"), this.baseVideoRect.classList.remove("static"), this.baseVideoRect.innerHTML = "";
  const e = this.element.clientWidth, t = this.element.clientHeight, i = e > t;
  if (this.baseVideoRect.classList.remove("align-center"), this.baseVideoRect.classList.remove("align-top"), this.baseVideoRect.classList.remove("align-bottom"), this.baseVideoRect.classList.remove("align-left"), this.baseVideoRect.classList.remove("align-right"), i) {
    const p = ((o = (r = this.player.config.videoContainer) == null ? void 0 : r.dynamicLayout) == null ? void 0 : o.landscapeVerticalAlignment) || "align-center";
    this.baseVideoRect.classList.remove("portrait"), this.baseVideoRect.classList.add("landscape"), this.baseVideoRect.classList.add(p);
  } else {
    const p = ((u = (l = this.player.config.videoContainer) == null ? void 0 : l.dynamicLayout) == null ? void 0 : u.portraitHorizontalAlignment) || "align-center";
    this.baseVideoRect.classList.add("portrait"), this.baseVideoRect.classList.remove("landscape"), this.baseVideoRect.classList.add(p);
  }
  const s = this.baseVideoRect.clientWidth, a = this.element.clientHeight;
  if (((m = n == null ? void 0 : n.videos) == null ? void 0 : m.length) === 1) {
    const p = [], v = [], C = n.videos[0], b = this.streamProvider.streams[C.content], { player: _, canvas: c } = b;
    c.buttonsArea.innerHTML = "", v.push(await Ye(this.player, n, c, C, C.content)), c.element.style = {}, c.element.style.display = "block", c.element.style.width = "100%", c.element.style.height = "100%", c.element.style.overflow = "hidden", c.element.style.position = "relative", p.push(c.element), c.element.sortIndex = 0, p.forEach((f) => this.baseVideoRect.appendChild(f)), setTimeout(() => {
      Ze(this.player, n, v.flat());
    }, 100);
  } else if ((h = n == null ? void 0 : n.videos) != null && h.length) {
    let p = 0;
    const v = [], C = [];
    for (const b of n.videos) {
      const _ = this.streamProvider.streams[b.content], { player: c, canvas: f } = _, P = await c.getDimensions(), y = P.w / P.h, M = s, J = a, H = (i ? M : J) * b.size / 100;
      let j = Math.round(i ? H : H * y), N = Math.round(i ? H / y : H);
      j > M && (j = M, N = Math.round(j / y)), N > J && (N = J, j = Math.round(N * y)), f.buttonsArea.innerHTML = "", C.push(await Ye(this.player, n, f, b, b.content)), f.element.style = {}, f.element.style.display = "block", f.element.style.width = `${j}px`, f.element.style.height = `${N}px`, f.element.style.overflow = "hidden", f.element.style.position = "relative", f.element.sortIndex = p++, v.push(f.element);
    }
    if (i) {
      const b = L('<div class="landscape-container"></div>', this.baseVideoRect);
      v.forEach((_) => b.appendChild(_));
    } else
      v.forEach((b) => this.baseVideoRect.appendChild(b));
    setTimeout(() => {
      Ze(this.player, n, C.flat());
    }, 100);
  }
  return !0;
}
class xs extends z {
  constructor(e, t) {
    var r;
    const i = "base-video-rect", s = {
      class: "video-container"
    };
    (r = e.config.videoContainer) != null && r.overPlaybackBar && (s.class += " over-playback-bar");
    const a = `
            <div class="${i}"></div>
            <div class="hidden-videos-container" style="display: none"></div>
        `;
    super(e, { attributes: s, children: a, parent: t }), this._hiddenVideos = this.element.getElementsByClassName("hidden-videos-container")[0], this._baseVideoRect = this.element.getElementsByClassName(i)[0], this.element.addEventListener("click", async () => {
      await this.paused() ? await this.play() : await this.pause();
    }), this._ready = !1, this._players = [], this._streamProvider = new Es(this.player, this.baseVideoRect);
  }
  get layoutId() {
    return this._layoutId;
  }
  get mainLayoutContent() {
    return this._mainLayoutContent;
  }
  async setLayout(e, t = null) {
    var i, s;
    if (this.validContentIds.indexOf(e) === -1)
      return !1;
    {
      const a = (s = (i = this.player.config.videoContainer) == null ? void 0 : i.restoreVideoLayout) == null ? void 0 : s.global;
      await this.player.preferences.set("videoLayout", e, { global: a }), await this.player.preferences.set("videoLayoutMainContent", t, { global: a });
      const r = this._layoutId;
      this._layoutId = e, this._mainLayoutContent = t, await this.updateLayout(), r !== e && E(this.player, g.LAYOUT_CHANGED, { prevLayout: r, layoutId: e });
    }
  }
  get validContentIds() {
    return this._validContentIds;
  }
  get validContentSettings() {
    return this._validContentSettings;
  }
  get validLayouts() {
    return Fe(this.player, this.streamData);
  }
  get streamData() {
    return this._streamData;
  }
  get baseVideoRect() {
    return this._baseVideoRect;
  }
  get streamProvider() {
    return this._streamProvider;
  }
  async create() {
    this._baseVideoRect.style.display = "none", await $(this.player, "layout"), await Ri(this.player);
  }
  async load(e) {
    var o, l, u, m, h, p, v, C, b, _;
    if (this._streamData = e, (l = (o = this.player.config.videoContainer) == null ? void 0 : o.restoreVideoLayout) != null && l.enabled) {
      const c = (m = (u = this.player.config.videoContainer) == null ? void 0 : u.restoreVideoLayout) == null ? void 0 : m.global;
      this._layoutId = await this.player.preferences.get("videoLayout", { global: c }) || this.player.config.defaultLayout, this._mainLayoutContent = await this.player.preferences.get("videoLayoutMainContent", { global: c }) || null;
    } else
      this._layoutId = this.player.config.defaultLayout, this._mainLayoutContent = null;
    await this.streamProvider.load(e), this._validContentIds = ni(this.player, e), this._validContentSettings = On(this.player, e), await this.updateLayout(null, !0);
    const t = L(
      '<div class="button-plugins left-side"></div>',
      this.element
    ), i = L(
      '<div class="button-plugins right-side"></div>',
      this.element
    );
    this._buttonPlugins = [t, i], this.player.log.debug("Loading videoContainer button plugins"), await $(this.player, "button", async (c) => {
      this.player.log.debug(` Button plugin: ${c.name}`), c.side === "left" ? await Re(c, t) : c.side === "right" && await Re(c, i);
    }, async (c) => c.parentContainer === "videoContainer" ? await c.isEnabled() : !1), this._baseVideoRect.style.display = "";
    const s = await this.player.preferences.get("volume", { global: !0 }), a = await this.player.preferences.get("playbackRate", { global: !0 }), r = await this.player.preferences.get("lastKnownTime", { global: !1 });
    if ((h = this.player.config.videoContainer) != null && h.restoreVolume && s !== null && s !== void 0 && await this.streamProvider.setVolume(s), (p = this.player.config.videoContainer) != null && p.restorePlaybackRate && a !== null && a !== void 0 && await this.streamProvider.setPlaybackRate(a), this.player.videoManifest.trimming && await this.player.videoContainer.setTrimming(this.player.videoManifest.trimming), (C = (v = this.player.config.videoContainer) == null ? void 0 : v.restoreLastTime) != null && C.enabled && !this.streamProvider.isLiveStream) {
      const c = async () => {
        if (!await this.paused()) {
          const P = await this.currentTime();
          await this.player.preferences.set("lastKnownTime", P, { global: !1 });
        }
        setTimeout(c, 1e3);
      };
      if (r) {
        const f = await this.player.preferences.get("lastKnownTime", { global: !1 }), P = await this.duration(), y = (_ = (b = this.player.config.videoContainer) == null ? void 0 : b.restoreLastTime) == null ? void 0 : _.remainingSeconds;
        P - f > y && await this.setCurrentTime(f);
      }
      c();
    }
    this._messageContainer = new Ss(this.player, this.element), this._ready = !0;
  }
  async unload() {
    this.removeFromParent(), await di(this.player, "layout"), await Vi(this.player), await this.streamProvider.unload();
  }
  // Return true if the layout this.layoutId is compatible with the current stream data.
  async updateLayout(e = null) {
    const t = arguments[1];
    if (e && (this._mainLayoutContent = e), !t && this.player.state !== w.LOADED)
      return;
    if (this._updateInProgress)
      return this.player.log.warn("Recursive update layout detected"), !1;
    this._updateInProgress = !0;
    let i = !0;
    this._layoutButtons = [], (!this._layoutId || this._validContentIds.indexOf(this._layoutId) === -1) && (this._layoutId = this.player.config.defaultLayout, this._mainLayoutContent = null, this._validContentIds.indexOf(this._layoutId) === -1 && (this._layoutId = this._validContentIds[0]), i = !1);
    const s = si(this.player, this.streamProvider.streamData, this._layoutId);
    return s.layoutType === "static" ? i = ks.apply(this) : s.layoutType === "dynamic" && (i = Ds.apply(this)), this._updateInProgress = !1, i;
  }
  hideUserInterface() {
    if (this._layoutButtons && this._buttonPlugins) {
      this.player.log.debug("Hide video container user interface");
      const e = (t) => {
        t._prevDisplay = t.style.display, t.style.display = "none";
      };
      this._layoutButtons.forEach(e), this._buttonPlugins.forEach(e);
      for (const t in this.streamProvider.streams)
        this.streamProvider.streams[t].canvas.hideButtons();
    }
  }
  showUserInterface() {
    if (this._layoutButtons && this._buttonPlugins) {
      const e = (t) => t.style.display = t._prevDisplay || "block";
      this._layoutButtons.forEach(e), this._buttonPlugins.forEach(e);
      for (const t in this.streamProvider.streams)
        this.streamProvider.streams[t].canvas.showButtons();
    }
  }
  get message() {
    return this._messageContainer;
  }
  get elementSize() {
    return { w: this.element.offsetWidth, h: this.element.offsetHeight };
  }
  get ready() {
    return this._ready;
  }
  get isLiveStream() {
    return this.streamProvider.isLiveStream;
  }
  async play() {
    const e = await this.streamProvider.play();
    return E(this.player, g.PLAY), e;
  }
  async pause() {
    const e = await this.streamProvider.pause();
    return E(this.player, g.PAUSE), e;
  }
  async stop() {
    this.streamProvider.stop(), E(this.player, g.STOP);
  }
  async paused() {
    return this.streamProvider.paused();
  }
  async setCurrentTime(e) {
    const t = await this.streamProvider.setCurrentTime(e);
    return E(this.player, g.SEEK, { prevTime: t.prevTime, newTime: t.newTime }), t.result;
  }
  async currentTime() {
    return this.streamProvider.currentTime();
  }
  async volume() {
    return this.streamProvider.volume();
  }
  async setVolume(e) {
    const t = await this.streamProvider.setVolume(e);
    return E(this.player, g.VOLUME_CHANGED, { volume: e }), await this.player.preferences.set("volume", e, { global: !0 }), t;
  }
  async duration() {
    return await this.streamProvider.duration();
  }
  async playbackRate() {
    return await this.streamProvider.playbackRate();
  }
  async setPlaybackRate(e) {
    const t = await this.streamProvider.setPlaybackRate(e);
    return E(this.player, g.PLAYBACK_RATE_CHANGED, { newPlaybackRate: e }), await this.player.preferences.set("playbackRate", e, { global: !0 }), t;
  }
  get isTrimEnabled() {
    return this.streamProvider.isTrimEnabled;
  }
  get trimStart() {
    return this.streamProvider.trimStart;
  }
  get trimEnd() {
    return this.streamProvider.trimEnd;
  }
  async setTrimming({ enabled: e, start: t, end: i }) {
    const s = await this.streamProvider.setTrimming({
      enabled: e,
      start: t,
      end: i
    });
    return E(this.player, g.TRIMMING_CHANGED, {
      enabled: e,
      start: t,
      end: i
    }), s;
  }
  getVideoRect(e = null) {
    var i, s;
    let t = this.baseVideoRect;
    if (typeof e == "string") {
      if (t = (i = this.streamProvider.streams[e]) == null ? void 0 : i.canvas.element, !t)
        return this.player.log.warn(`videoContainer.getVideoRect: Invalid target '${e}'. Valid targets are: ${Object.keys(this.streamProvider.streams).join(", ")}`), this.player.log.warn("Please, configure a valid target in the 'targetContent' property of the configuration file, or provide a valid target in the 'frameList.targetContent' property of the video manifest"), null;
    } else e === 0 && (t = (s = this.streamProvider.streams[Object.keys(this.streamProvider.streams)[0]]) == null ? void 0 : s.canvas.element);
    return {
      x: t == null ? void 0 : t.offsetLeft,
      y: t == null ? void 0 : t.offsetTop,
      width: t == null ? void 0 : t.offsetWidth,
      height: t == null ? void 0 : t.offsetHeight,
      element: t
    };
  }
  appendChild(e, t = null, i = 1) {
    if (t) {
      const { width: s, height: a } = this.getVideoRect();
      t.x = t.x * 100 / s, t.width = t.width * 100 / s, t.y = t.y * 100 / a, t.height = t.height * 100 / a, e.style.position = "absolute", e.style.left = `${t.x}%`, e.style.top = `${t.y}%`, e.style.width = `${t.width}%`, e.style.height = `${t.height}%`, i !== null && (e.style.zIndex = i);
    }
    return this.baseVideoRect.appendChild(e), e;
  }
  removeChild(e) {
    this.baseVideoRect.removeChild(e);
  }
}
const As = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <rect id="Play" x="0" y="0" width="300" height="300" style="fill:none;"/>
    <g id="Play1" serif:id="Play">
        <g transform="matrix(1.21457,0,0,1.21457,-55.8704,-35.2227)">
            <circle cx="169.5" cy="152.5" r="123.5" style="fill:rgb(128,128,128);"/>
            <path d="M169.5,29C237.662,29 293,84.338 293,152.5C293,220.662 237.662,276 169.5,276C101.338,276 46,220.662 46,152.5C46,84.338 101.338,29 169.5,29ZM169.5,37.233C233.117,37.233 284.767,88.883 284.767,152.5C284.767,216.117 233.117,267.767 169.5,267.767C105.883,267.767 54.233,216.117 54.233,152.5C54.233,88.883 105.883,37.233 169.5,37.233Z" style="fill:rgb(235,235,235);"/>
        </g>
        <g transform="matrix(6.12323e-17,1,-1,6.12323e-17,347,-59)">
            <path d="M209,82L317,253L101,253L209,82Z" style="fill:rgb(235,235,235);"/>
        </g>
    </g>
</svg>
`, Ms = `
    background-color: #e4e4e4;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%); 
`, je = `
    width: 100%;
`, Rs = `
    position: absolute; 
    top: 0px; 
    left: 0px; 
    right: 0px; 
    bottom: 0px; 
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
`, Vs = `
    pointer-events: none;
    width: 20%;
    max-width: 400px;
    min-width: 100px;
    opacity: 0.6;
`, Ns = `
    display: block;
    width: 20%;
    background: none;
    border: none;
    cursor: pointer;
`;
class Us extends z {
  constructor(e, t, i, s) {
    const a = {
      class: "preview-container",
      style: Ms,
      role: "button",
      "aria-label": "Play video"
    };
    super(e, { attributes: a, parent: t }), this._img = L(`
        <div style="${je}">
            ${i ? `<img style="${je}" src="${i}" class="preview-image-landscape" alt=""/>` : ""}
            ${s ? `<img style="${je}" src="${s}" class="preview-image-portrait" alt=""/>` : ""}
            <div style="${Rs}">
                <button style="${Ns}" role="button" aria-label="Play video">
                    <i class="preview-play-icon" style="${Vs}">${As}</i>
                </button>
            </div>
        </div>
        `, this.element), this.element.setAttribute("id", "playerContainerClickArea"), this.element.addEventListener("click", (l) => {
      e.play();
    });
    const r = i && s, o = () => {
      if (r) {
        const l = this.element.clientWidth / this.element.clientHeight, u = Array.from(this.element.getElementsByClassName("preview-image-landscape")), m = Array.from(this.element.getElementsByClassName("preview-image-portrait"));
        l >= 1 ? (u.forEach((h) => h.style.display = ""), m.forEach((h) => h.style.display = "none")) : (u.forEach((h) => h.style.display = "none"), m.forEach((h) => h.style.display = ""));
      }
    };
    window.addEventListener("resize", () => {
      o();
    }), o();
  }
  loadBackgroundImage(e) {
    this._img.setAttribute("src", e);
  }
}
const Fs = (n) => {
  const e = document.createElement("section");
  return e.classList.add("pop-up"), e.innerHTML = `
        <header class="pop-up-title">
            <button class="action-back">
                <svg width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M15 6l-6 6l6 6" />
                </svg>
            </button>
            <h2>title</h2>
        </header>
        <div class="pop-up-content">
        </div>
    `, n.appendChild(e), e.setTitle = (t) => {
    e.querySelector("header.pop-up-title h2").textContent = t;
  }, e.popButton = () => e.querySelector("header.pop-up-title button"), e.onPopClicked = (t) => {
    e._clickCallback && e.popButton().removeEventListener("click", e._clickCallback), e._clickCallback = t, e.popButton().addEventListener("click", t);
  }, e.hidePopButton = () => e.popButton().style.display = "none", e.showPopButton = () => e.popButton().style.display = "", e.setContent = (t) => {
    e.querySelector("div.pop-up-content").innerHTML = "", e.querySelector("div.pop-up-content").appendChild(t);
  }, e;
};
let Os = 0;
function $s() {
  return ++Os;
}
var ee, k, x, Pe;
class Bs {
  constructor(e) {
    T(this, ee, null);
    T(this, k, null);
    T(this, x, []);
    T(this, Pe, "");
    I(this, ee, e), I(this, k, document.createElement("div")), d(this, k).className = "pop-up-wrapper", e.element.prepend(d(this, k)), d(this, k).classList.add("hidden"), d(this, k).addEventListener("click", (t) => t.stopPropagation()), d(this, ee).element.addEventListener("click", (t) => {
      t.stopPropagation(), this.hide();
    });
  }
  get title() {
    return d(this, Pe);
  }
  set title(e) {
    I(this, Pe, e);
  }
  get currentContent() {
    return d(this, x).length && d(this, x)[d(this, x).length - 1];
  }
  get currentContentId() {
    var e;
    return ((e = this.currentContent) == null ? void 0 : e.dataContentId) ?? -1;
  }
  show({ content: e, title: t = "", parent: i = null, attachLeft: s = !1, attachRight: a = !1 }) {
    if (!e)
      throw new Error("PlaybackBarPopUp.show(): No content provided.");
    e.setAttribute("data-pop-up-content-id", $s()), e.dataContentId = e.getAttribute("data-pop-up-content-id");
    const r = d(this, x).length && d(this, x)[d(this, x).length - 1], o = i && i.getAttribute("data-pop-up-content-id");
    r && r.getAttribute("data-pop-up-content-id") !== o ? (d(this, k).innerHTML = "", I(this, x, [])) : r && r.container.classList.add("out"), d(this, x).push(e), d(this, ee).element.classList.add("pop-up-active"), d(this, k).classList.remove("hidden");
    const l = Fs(d(this, k));
    return l.setTitle(t), e.container = l, s === !0 ? d(this, k).classList.add("left") : d(this, k).classList.remove("left"), a === !0 ? d(this, k).classList.add("right") : d(this, k).classList.remove("right"), l.setContent(e), d(this, x).length > 1 ? l.onPopClicked(() => {
      d(this, x).pop(), d(this, x)[d(this, x).length - 1].container.classList.remove("out"), d(this, k).removeChild(l);
    }) : l.hidePopButton(), this.title = t, e.dataContentId;
  }
  pop() {
    if (d(this, k).querySelectorAll(".pop-up").length === 1)
      return this.hide(), !1;
    const e = new Event("click");
    return d(this, k).querySelector(".pop-up:not(.out) .action-back").dispatchEvent(e), !0;
  }
  hide() {
    d(this, ee).element.classList.remove("pop-up-active"), d(this, k).classList.add("hidden");
  }
  get isHidden() {
    return d(this, k).classList.contains("hidden");
  }
}
ee = new WeakMap(), k = new WeakMap(), x = new WeakMap(), Pe = new WeakMap();
var Ee, re, oe, Q, le, Se, ce, R, te, ue;
class Gs extends z {
  constructor(t, i) {
    var m;
    const s = ((m = t.config.progressIndicator) == null ? void 0 : m.inlineMode) ?? !1;
    super(t, { attributes: { class: "playback-bar-container" }, parent: i });
    T(this, Ee, null);
    T(this, re, null);
    T(this, oe, null);
    T(this, Q, null);
    T(this, le, null);
    T(this, Se, null);
    T(this, ce, null);
    T(this, R, null);
    T(this, te, !0);
    T(this, ue, []);
    I(this, Ee, new Bs(this)), this.element.addEventListener("mouseenter", () => Dt(t)), this.element.addEventListener("mouseleave", () => xt(t)), I(this, re, L('<section class="playback-bar"></section>', this.element)), I(this, oe, L("<div></div>")), I(this, Q, L("<nav></nav>")), I(this, le, L("<ul></ul>", d(this, Q))), I(this, Se, L("<div></div>", d(this, Q))), I(this, ce, L("<ul></ul>", d(this, Q)));
    const r = t._initParams.getProgressIndicator, o = 1e3, l = 0, u = 100;
    s ? I(this, R, r({ container: d(this, Se), player: t, duration: o, currentTime: l, precision: u })) : (d(this, re).appendChild(d(this, oe)), I(this, R, r({ container: d(this, oe), player: t, duration: o, currentTime: l, precision: u }))), d(this, R).onChange(async (h) => {
      await t.videoContainer.setCurrentTime(h);
    }), d(this, re).appendChild(d(this, Q));
  }
  get popUp() {
    return d(this, Ee);
  }
  get enabled() {
    return d(this, te);
  }
  set enabled(t) {
    I(this, te, t), d(this, te) ? this.showUserInterface() : this.hide();
  }
  async load() {
    I(this, ue, []), this.player.log.debug("Loading button plugins"), await $(this.player, "button", async (i) => {
      this.player.log.debug(` Button plugin: ${i.name}`), d(this, ue).push(i), i.side === "left" ? await Re(i, this.buttonPluginsLeft) : i.side === "right" && await Re(i, this.buttonPluginsRight);
    }, async (i) => i.parentContainer === "playbackBar" ? await i.isEnabled() : !1);
    const t = await this.player.videoContainer.duration();
    d(this, R).setDuration(t), this.player.frameList.frames.forEach((i, s, a) => {
      const r = a[s + 1], o = r ? r.time - i.time : t - i.time;
      d(this, R).addMarker({ time: i.time, duration: t, frameDuration: o, addGap: s < a.length - 1 });
    }), this.player.bindEvent([this.player.Events.TIMEUPDATE, this.player.Events.SEEK], (i) => {
      d(this, R).setCurrentTime(i.newTime ?? i.currentTime);
    }), this.player.bindEvent(this.player.Events.TRIMMING_CHANGED, async (i) => {
      const s = i.end - i.start;
      d(this, R).setDuration(s);
      const a = await this.player.videoContainer.currentTime();
      d(this, R).setCurrentTime(a);
    }), this.onResize();
  }
  async unload() {
    this.removeFromParent(), await di(this.player, "button"), d(this, le).innerHTML = "", d(this, ce).innerHTML = "";
  }
  hideUserInterface() {
    this.player.log.debug("Hide playback bar user interface"), this.hide();
  }
  showUserInterface() {
    var t;
    if (d(this, te)) {
      const s = ((t = this.player.config.progressIndicator) == null ? void 0 : t.inlineMode) ?? !1 ? "flex" : "block";
      this.show(s), this.onResize();
    }
  }
  get buttonPluginsRight() {
    return d(this, ce);
  }
  get buttonPluginsLeft() {
    return d(this, le);
  }
  get progressIndicator() {
    return d(this, R);
  }
  get containerSize() {
    const t = this.element.clientWidth, i = this.element.clientHeight;
    return { width: t, height: i };
  }
  onResize() {
    const { containerSize: t } = this;
    d(this, ue).forEach((i) => i.onResize(t));
  }
}
Ee = new WeakMap(), re = new WeakMap(), oe = new WeakMap(), Q = new WeakMap(), le = new WeakMap(), Se = new WeakMap(), ce = new WeakMap(), R = new WeakMap(), te = new WeakMap(), ue = new WeakMap();
const gi = [
  { maxWidth: 400, className: "size-s" },
  { maxWidth: 600, className: "size-m" },
  { maxWidth: 900, className: "size-l" },
  { maxWidth: 1100, className: "size-xl" },
  { className: "size-xxl" }
], zs = (n) => gi.find((e) => e.maxWidth && e.maxWidth >= n || e.maxWidth === void 0).className;
class Hs extends z {
  constructor(e, t) {
    const i = {
      class: "captions-canvas visible-ui"
    };
    super(e, { tag: "div", attributes: i, parent: t }), this._captionsContainer = L(`
            <div class="text-container">
            </div>
        `, this.element), this._captions = [], this.hide(), this._currentCaptions = null;
    const s = async (a) => {
      const o = (e.videoContainer.isTrimEnabled ? e.videoContainer.trimStart : 0) + (a.currentTime || a.newTime || 0);
      if (this._currentCaptions) {
        const l = this._currentCaptions.getCue(o);
        this._captionsContainer.innerHTML = "", l && l.captions.forEach((u) => {
          this._captionsContainer.innerHTML += u, this._captionsContainer.innerHTML += "<br/>";
        }), l ? this._captionsContainer.style.display = null : this._captionsContainer.style.display = "none", this.resize();
      }
    };
    A(this.player, g.TIMEUPDATE, s), A(this.player, g.SEEK, s), A(this.player, g.RESIZE, () => this.resize()), A(this.player, g.SHOW_UI, () => this.element.classList.add("visible-ui")), A(this.player, g.HIDE_UI, () => this.element.classList.remove("visible-ui"));
  }
  async load() {
    await mn(this.player);
  }
  unload() {
  }
  resize() {
    const e = zs(this._captionsContainer.clientWidth);
    gi.forEach((t) => this.element.classList.remove(t.className)), this.element.classList.add(e);
  }
  addCaptions(e) {
    this._captions.push(e), E(this.player, g.CAPTIONS_CHANGED, { captions: this._captions });
  }
  get captions() {
    return this._captions;
  }
  get currentCaptions() {
    return this._currentCaptions;
  }
  getCaptions({ label: e, index: t, lang: i }) {
    if (e === void 0 && t === void 0 && i === void 0)
      throw Error("Could not find captions: you must specify the label, the index or the language");
    return t !== void 0 ? this._captions[t] : this._captions.find((s) => {
      if (e !== void 0)
        return s.label === e;
      if (i !== void 0)
        return s.language === i;
    });
  }
  enableCaptions(e) {
    const t = this.getCaptions(e);
    if (t !== this._currentCaptions && (this._currentCaptions = t, this.currentCaptions)) {
      const { language: i, label: s } = this.currentCaptions;
      E(this.player, g.CAPTIONS_ENABLED, { language: i, label: s });
    }
    this.show();
  }
  disableCaptions() {
    this.currentCaptions && E(this.player, g.CAPTIONS_DISABLED), this._currentCaptions = null, this.hide();
  }
}
async function js(n) {
  await $(n, "eventLog", async (e) => {
    e.events.forEach((t) => {
      A(n, t, async (i) => {
        await e.onEvent(t, i);
      });
    });
  });
}
async function Ws(n) {
}
class ua extends he {
  get type() {
    return "eventLog";
  }
  get events() {
    return [];
  }
  async onEvent(e, t) {
    this.player.log.warn(`${this.name}: onEvent() function is not overwritten.`);
  }
}
const mi = (n) => !1, fi = (n) => n.description;
class qs {
  constructor(e, t) {
    this._player = e, this._cookieConsentData = e.config.cookieConsent || [], this._getConsentCallback = t.getConsent || mi, this._getDescriptionCallback = t.getDescription || fi, this._cookieConsentData.forEach((i) => {
      i.description = this._getDescriptionCallback(i);
    }), this.updateConsentData();
  }
  updateConsentData() {
    this._cookieConsentData.forEach((e) => {
      e.value = this._getConsentCallback(e.type) || e.required;
    }), E(this._player, g.COOKIE_CONSENT_CHANGED, { cookieConsent: this });
  }
  getConsentForType(e) {
    const t = this._cookieConsentData.find((i) => i.type === e);
    return (t == null ? void 0 : t.value) || !1;
  }
}
function Qs({ container: n }) {
  n.innerHTML = `
        <div class="timeline-preview hidden">
            <img src="" alt="" />
            <p></p>
        </div>
    `;
  const e = n.querySelector("img"), t = n.querySelector("p"), i = n.querySelector(".timeline-preview");
  return {
    setImage(a, r) {
      a !== e.src && (e.src = a, e.alt = r);
    },
    setText(a) {
      t.innerText = a;
    },
    setPosition(a) {
      a > 0.5 ? (i.style.left = "", i.style.right = `${100 - a * 100}%`) : (i.style.right = "", i.style.left = `${a * 100}%`);
    },
    show() {
      i.classList.remove("hidden");
    },
    hide() {
      i.classList.add("hidden");
    }
  };
}
function Ys({ container: n, player: e, duration: t = 100, currentTime: i = 0, precision: s = 100 }) {
  n.classList.add("progress-indicator"), n.classList.add("custom-progress-indicator"), n.innerHTML = `
        <div class="range-container">
            <div class="timeline-preview-container"></div>
            <div class="elapsed"></div>
            <div class="remaining"></div>
            <input type="range" min="0" max="${t * s}" value="${i * s}" tabindex="0" role="slider" class="slider">
            <ul class="markers-container"></ul>
        </div>
    `;
  const a = n.querySelector(".elapsed"), r = n.querySelector(".remaining"), o = n.querySelector(".slider"), l = n.querySelector(".timeline-preview-container"), u = Qs({ container: l });
  let m = !1, h = null;
  const p = [], v = (c) => {
    var f;
    return (f = p.find((P) => P.time < c && P.time + P.frameDuration >= c)) == null ? void 0 : f.marker;
  }, C = {
    player: e,
    elapsed: a,
    remaining: r,
    range: o,
    timeLinePreview: u,
    markersContainer: n.querySelector(".markers-container"),
    addMarker({ time: c, duration: f, frameDuration: P, addGap: y = !0 }) {
      const M = L(`<li>
                <div class="elapsed"></div>
                <div class="remaining"></div>
            </li>`);
      M.style.left = `${c / f * 100}%`, M.style.width = y ? `calc(${P / f * 100}% - var(--slide-marker-gap))` : `${P / f * 100}%`, this.markersContainer.appendChild(M), p.push({
        marker: M,
        time: c,
        frameDuration: P
      });
    },
    updateRemaining() {
      const c = this.range.value / this.range.max * 100;
      this.elapsed.style.width = `${c}%`, this.remaining.style.width = `${100 - c}%`;
      const f = v(this.range.value / s), P = p.findIndex((y) => y.marker === f);
      p.forEach((y, M) => {
        if (M < P)
          y.marker.querySelector(".elapsed").style.width = "100%", y.marker.querySelector(".remaining").style.width = "0%";
        else if (M === P) {
          const J = (this.range.value / s - y.time) / y.frameDuration * 100;
          y.marker.querySelector(".elapsed").style.width = `${J}%`, y.marker.querySelector(".remaining").style.width = `${100 - J}%`;
        } else
          y.marker.querySelector(".elapsed").style.width = "0%", y.marker.querySelector(".remaining").style.width = "100%";
      });
    },
    setDuration(c) {
      m || (this.range.max = c * s, this.updateRemaining());
    },
    setCurrentTime(c) {
      m || (this.range.value = c * s, this.updateRemaining());
    },
    onChange(c) {
      h = c;
    }
  };
  o.addEventListener("pointerdown", () => {
    m = !0;
  });
  let b = null;
  o.addEventListener("mousemove", async (c) => {
    var P;
    const f = ((P = e.frameList) == null ? void 0 : P.frames) || [];
    if (f.length) {
      const y = await e.videoContainer.duration(), M = c.target.clientWidth, H = c.layerX / M, j = H * y, N = f.filter((bi) => bi.time <= j).pop(), Ci = N && (N.thumb || N.url), ut = N && ie(y * H), ke = v(j);
      ke !== b && b !== null && b.classList.remove("active"), ke && ke.classList.add("active"), b = ke, u.setImage(Ci, ut), u.setText(ut), u.setPosition(H), u.show();
    }
  }), o.addEventListener("mouseleave", () => {
    u.hide(), b && b.classList.remove("active");
  }), o.addEventListener("pointerup", () => {
    m = !1, typeof h == "function" && h(o.value / s);
  }), o.addEventListener("input", () => {
    C.updateRemaining();
  });
  const _ = async (c) => {
    const f = await e.videoContainer.currentTime();
    await e.videoContainer.setCurrentTime(f + c);
  };
  return o.addEventListener("keydown", (c) => {
    c.key === "ArrowLeft" ? (_(-10), c.preventDefault(), c.stopPropagation()) : c.key === "ArrowRight" && (_(10), c.preventDefault(), c.stopPropagation());
  }), C.updateRemaining(), C;
}
const D = Object.freeze({
  DISABLED: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5
});
let yi = D.INFO;
const vi = (n, e = null) => {
  const t = typeof n == "string" ? D[n.toUpperCase()] : n;
  if (t < D.DISABLED || t > D.VERBOSE)
    throw Error(`setLogLevel: invalid log level ${t}`);
  e ? (e.__logSettings = e.__logSettings || {}, e.__logSettings.logLevel = t) : yi = t;
}, _i = (n = null) => n ? n.__logSettings.logLevel : yi, ye = ({
  msg: n,
  level: e = D.INFO,
  player: t = null,
  context: i = "paella-core"
}) => {
  t && !t.__logSettings && vi(t, D.INFO);
  const s = _i(t);
  if (e < D.DISABLED)
    throw Error(`printMessage: invalid log level ${e}`);
  if (t && E(t, g.LOG, { severity: e, context: i, message: n, currentLogLevel: s }), e <= s)
    switch (e) {
      case D.ERROR:
        console.error(`${i} - Error: ${n}`);
        break;
      case D.WARN:
        console.warn(`${i} - Warning: ${n}`);
        break;
      case D.INFO:
        console.info(`${i} - Info: ${n}`);
        break;
      case D.DEBUG:
        console.debug(`${i} - Debug: ${n}`);
        break;
      case D.VERBOSE:
        console.log(`${i} - Verbose: ${n}`);
        break;
    }
}, X = {
  setLevel: (n, e = null) => {
    vi(n, e);
  },
  currentLevel: (n = null) => _i(n),
  error: (n, e = null, t = "paella-core") => {
    ye({
      msg: n,
      level: D.ERROR,
      player: e,
      context: t
    });
  },
  warn: (n, e = null, t = "paella-core") => {
    ye({
      msg: n,
      level: D.WARN,
      player: e,
      context: t
    });
  },
  info: (n, e = null, t = "paella-core") => {
    ye({
      msg: n,
      level: D.INFO,
      player: e,
      context: t
    });
  },
  debug: (n, e = null, t = "paella-core") => {
    ye({
      msg: n,
      level: D.DEBUG,
      player: e,
      context: t
    });
  },
  verbose: (n, e = null, t = "paella-core") => {
    ye({
      msg: n,
      level: D.VERBOSE,
      player: e,
      context: t
    });
  }
};
class Zs {
  constructor(e, t = "paella-core") {
    this._player = e, this._context = t;
  }
  get context() {
    return this._context;
  }
  get player() {
    return this._player;
  }
  setLevel(e) {
    X.setLevel(e, this._player);
  }
  currentLevel() {
    return X.currentLevel(this._player);
  }
  error(e, t = null) {
    X.error(e, this._player, t || this._context);
  }
  warn(e, t = null) {
    X.warn(e, this._player, t || this._context);
  }
  info(e, t = null) {
    X.info(e, this._player, t || this._context);
  }
  debug(e, t = null) {
    X.debug(e, this._player, t || this._context);
  }
  verbose(e, t = null) {
    X.verbose(e, this._player, t || this._context);
  }
}
const wt = {}, We = '{ "global": {}, "videos": {} }';
async function Ct() {
  switch (this.source.name) {
    case "cookie":
      try {
        return JSON.parse(Y("preferences"));
      } catch {
        return JSON.parse(We);
      }
    case "dataPlugin":
      try {
        return await this.player.data.read(this.source.context, {}) || JSON.parse(We);
      } catch {
        return JSON.parse(We);
      }
  }
}
async function Ks(n) {
  switch (this.source.name) {
    case "cookie":
      Rt(this.player, this.source.consentType, "preferences", JSON.stringify(n));
      break;
    case "dataPlugin":
      await this.player.data.write(this.source.context, {}, n);
      break;
  }
}
class Js extends de {
  constructor(e) {
    super(e);
    const { currentSource: t, sources: i } = e.config.preferences || {
      currentSource: "cookie",
      sources: {
        cookie: {
          consentType: "necessary"
        }
      }
    };
    if (this.source = i[t], this.source.name = t, this._loaded = !1, !this.source)
      throw Error("Invalid configuration in preferences. Check the configuration file.");
  }
  async set(e, t, { global: i = !1 } = {}) {
    const s = await Ct.apply(this);
    i ? s.global[e] = t : (s.videos[this.player.videoId] = s.videos[this.player.videoId] || {}, s.videos[this.player.videoId][e] = t), await Ks.apply(this, [s]);
  }
  async get(e, { global: t = !1 } = {}) {
    const i = await Ct.apply(this);
    return t ? i.global[e] : i.videos[this.player.videoId] && i.videos[this.player.videoId][e] || void 0;
  }
}
function Xs(n) {
  var e;
  (e = this._skinData) != null && e.configOverrides && we(n, this._skinData.configOverrides);
}
async function ea() {
  var n;
  if ((n = this._skinData) != null && n.styleSheets) {
    const e = [];
    this._skinData.styleSheets.forEach((t) => {
      if (!/\{.*/.test(t)) if (this._externalResourcesAllowed) {
        const i = G([this._skinUrl, t]);
        e.push(new Promise(async (s) => {
          await Xe(i, !1), s();
        }));
      } else
        throw new Error("No external resources allowed loading skin object");
    }), await Promise.allSettled(e);
  }
}
async function ta() {
  var n;
  if (this.player.__skinStyleSheets__ = this.player.__skinStyleSheets__ || [], (n = this._skinData) != null && n.styleSheets) {
    const e = [];
    this._skinData.styleSheets.forEach((t) => {
      if (/\{.*/.test(t))
        e.push(new Promise((i) => {
          const s = document.createElement("style");
          s.innerHTML = t, this.player.__skinStyleSheets__.push(s), document.head.appendChild(s), i();
        }));
      else {
        const i = G([this._skinUrl, t]);
        e.push(new Promise(async (s) => {
          const a = await Xe(i);
          this.player.__skinStyleSheets__.push(a), s();
        }));
      }
    }), await Promise.allSettled(e);
  }
}
function bt() {
  this.player.__skinStyleSheets__ = this.player.__skinStyleSheets__ || [], this.player.__skinStyleSheets__.forEach((n) => {
    Vt(n);
  }), this.player.__skinStyleSheets__ = [];
}
async function ia() {
  var n;
  Array.isArray((n = this._skinData) == null ? void 0 : n.icons) && await Promise.all(this._skinData.icons.map(({ plugin: e, identifier: t, icon: i }) => new Promise(async (s, a) => {
    const r = document.createElement("div");
    if (r.innerHTML = i, r.children[0] && r.children[0].tagName === "svg")
      s();
    else if (this._externalResourcesAllowed) {
      const o = G([this._skinUrl, i]);
      (await fetch(o)).ok ? s() : a(new Error(`Skin icon not found at URL '${o}'`));
    } else
      throw new Error("No external resources allowed loading skin object");
  })));
}
async function na() {
  var n;
  Array.isArray((n = this._skinData) == null ? void 0 : n.icons) && await Promise.all(this._skinData.icons.map(({ plugin: e, identifier: t, icon: i }) => new Promise(async (s, a) => {
    const r = document.createElement("div");
    if (r.innerHTML = i, r.children[0] && r.children[0].tagName === "svg")
      this.player.addCustomPluginIcon(e, t, i), s();
    else {
      const o = G([this._skinUrl, i]), l = await fetch(o);
      if (l.ok) {
        const u = await l.text();
        this.player.addCustomPluginIcon(e, t, u), s();
      } else
        a(new Error(`Skin icon not found at URL '${o}'`));
    }
  })));
}
class sa {
  constructor(e) {
    this._player = e;
  }
  get player() {
    return this._player;
  }
  async loadSkin(e) {
    if (typeof e == "string") {
      this._skinUrl = Ke(e), this._externalResourcesAllowed = !0;
      const t = await fetch(e);
      if (!t.ok)
        throw new Error(`Error loading skin from URL ${e}`);
      this._skinData = await t.json();
    } else typeof e == "object" && (this._skinUrl = "", this._externalResourcesAllowed = !1, this._skinData = e);
    try {
      await ea.apply(this), await ia.apply(this), (this._player.state === w.LOADED || this._player.state === w.MANIFEST) && await this._player.reload();
    } catch (t) {
      throw this._skinUrl = "", this._externalResourcesAllowed = !0, this._skinData = {}, t;
    }
  }
  unloadSkin() {
    var e, t;
    Array.isArray((e = this._skinData) == null ? void 0 : e.icons) && ((t = this._skinData) == null || t.icons.forEach(({ plugin: i, identifier: s }) => {
      this.player.removeCustomPluginIcon(i, s);
    })), this._skinUrl = null, this._skinData = {}, (this._player.state === w.LOADED || this._player.state === w.MANIFEST) && this._player.reload();
  }
}
class aa {
  constructor(e, t) {
    this._player = t, this._videoManifest = JSON.parse(JSON.stringify(e)), this._metadata = this._videoManifest.metadata || {}, this._streams = {}, this._frameList = {}, this._trimming = this._videoManifest.trimming, this._captions = this._videoManifest.captions, this._visibleTimeLine = this._videoManifest.visibleTimeLine;
    function i() {
      if (this.streams.length !== 1)
        return null;
      if (this.isAudioOnly)
        return this.audioOnlySource.src;
      const s = this.streams[0];
      if (!(s.sources.mp4 || s.sources.hls || s.sources.hlsLive))
        return null;
      const r = document.createElement("video");
      if (s.sources.mp4 && s.sources.mp4.length && r.canPlayType(s.sources.mp4[0].mimetype || "video/mp4") === "probably")
        return s.sources.mp4[0].src;
      const o = s.sources.hls || s.sources.hlsLive;
      return o && o.length && r.canPlayType(o[0].mimetype || "application/vnd.apple.mpegurl") !== "" && /safari/i.test(navigator.userAgent) ? o[0].src : null;
    }
    this._streams = {
      streams: this._videoManifest.streams,
      get contents() {
        return this.streams.map((s) => s.content);
      },
      getStream(s) {
        return this.streams.find((a) => a.content === s);
      },
      getSourceTypes(s) {
        const a = this.getStream(s);
        return a && Object.keys(a.sources) || null;
      },
      getCanvasTypes(s) {
        const a = this.getStream(s);
        return a ? a.canvas || ["video"] : null;
      },
      get isAudioOnly() {
        const s = this.contents.length === 1 && this.contents[0], a = s && this.getCanvasTypes(s) || [], r = this.getStream(s);
        return a.length === 1 && a[0] === "audio" && r.sources.audio && r.sources.audio.length > 0;
      },
      get audioOnlySource() {
        return this.isAudioOnly ? this.getStream(this.contents[0]).sources.audio[0] : null;
      },
      get isNativelyPlayable() {
        return i.apply(this) !== null;
      },
      get nativeSource() {
        return i.apply(this);
      },
      get nativeType() {
        return this.isNativelyPlayable ? this.isAudioOnly ? "audio" : "video" : null;
      },
      get nativePlayer() {
        const s = this.nativeType;
        if (s) {
          const a = document.createElement(s);
          return a.src = this.nativeSource, a;
        } else
          return null;
      }
    }, this._videoManifest.frameList && !Array.isArray(this._videoManifest.frameList) && typeof this._videoManifest.frameList == "object" && typeof this._videoManifest.frameList.targetContent == "string" && Array.isArray(this._videoManifest.frameList.frames) ? this._frameList = this._videoManifest.frameList : Array.isArray(this._videoManifest.frameList) ? this._frameList = {
      targetContent: null,
      frames: this._videoManifest.frameList
    } : this._frameList = {
      targetContent: null,
      frames: []
    }, this._frameList.frames.sort((s, a) => s.time - a.time), this._frameList.getImage = (s, a = !1) => {
      var r, o;
      return (r = this._player) != null && r.videoContainer && this._player._videoContainer.isTrimEnabled && !a ? s += this._player.videoContainer.trimStart : !((o = this._player) != null && o._videoContainer) && !a && console.warn("frameList.getImage(): player instance is null. The trimming information will be ignored."), [...this._frameList.frames].sort((l, u) => u.time - l.time).find((l) => l.time < s);
    }, Object.defineProperty(this._frameList, "isEmpty", {
      get() {
        return Array.isArray(e.frameList) && e.frameList.length === 0 || !e.frameList;
      }
    }), Object.freeze(this._metadata), Object.freeze(this._streams), Object.freeze(this._trimming), Object.freeze(this._captions);
  }
  get metadata() {
    return this._metadata;
  }
  get streams() {
    return this._streams;
  }
  get frameList() {
    return this._frameList;
  }
  get captions() {
    return this._captions;
  }
  get trimming() {
    return this._trimming;
  }
  get visibleTimeLine() {
    return this._visibleTimeLine;
  }
}
const F = Object.freeze([
  "UNLOADED",
  "LOADING_MANIFEST",
  "MANIFEST",
  "LOADING_PLAYER",
  "LOADED",
  "UNLOADING_MANIFEST",
  "UNLOADING_PLAYER",
  "ERROR"
]);
function wi() {
  var t, i, s, a, r, o, l, u;
  const n = ((i = (t = this.videoManifest) == null ? void 0 : t.metadata) == null ? void 0 : i.preview) && Z(this, (a = (s = this.videoManifest) == null ? void 0 : s.metadata) == null ? void 0 : a.preview) || this.defaultVideoPreview, e = ((o = (r = this.videoManifest) == null ? void 0 : r.metadata) == null ? void 0 : o.previewPortrait) && Z(this, (u = (l = this.videoManifest) == null ? void 0 : l.metadata) == null ? void 0 : u.previewPortrait) || this.defaultVideoPreviewPortrait;
  this._previewContainer = new Us(this, this._containerElement, n, e);
}
async function Lt() {
  this._playerState = w.LOADING_MANIFEST, this._manifestLoaded = !0, this.log.debug("Loading paella player"), this._config = await this.initParams.loadConfig(this.configUrl, this), Xs.apply(this.skin, [this._config]), Sn(this), this._defaultVideoPreview = this._config.defaultVideoPreview || this._initParams.defaultVideoPreview || "", this._defaultVideoPreviewPortrait = this._config.defaultVideoPreviewPortrait || this._initParams.defaultVideoPreviewPortrait || "", this._cookieConsent = new qs(this, {
    getConsent: this._initParams.getCookieConsentFunction,
    getDescription: this._initParams.getCookieDescriptionFunction
  }), this._preferences = new Js(this);
  const n = new URLSearchParams(window.location.search), e = new URLSearchParams();
  for (const [s, a] of n)
    e.append(s.toLowerCase(), a);
  const t = e.get("loglevel"), i = t && Array.from(Object.keys(D)).indexOf(t.toUpperCase()) !== -1 ? t : this._config.logLevel || "INFO";
  this._log.setLevel(i), await this._initParams.loadDictionaries(this), bs(this), await js(this), this._videoContainer = new xs(this, this._containerElement), await this.videoContainer.create();
  for (const s of this.pluginModules) {
    const a = s.getDictionaries && await s.getDictionaries();
    if (a)
      for (const r in a)
        ve(r, a[r]);
  }
}
async function Pt() {
  var n, e;
  this.log.debug("Video manifest loaded:"), this.log.debug(this.videoManifest), this._data = new os(this);
  for (const t in wt) {
    const i = wt[t];
    ve(t, i);
  }
  if (this._playerState = w.MANIFEST, E(this, g.MANIFEST_LOADED), (e = (n = this.videoManifest) == null ? void 0 : n.metadata) != null && e.preview)
    wi.apply(this);
  else
    throw new Error("No preview image found in video manifest, and no default preview image defined.");
  Ps(this._videoManifest);
}
class da {
  constructor(e, t = {}) {
    this._log = new Zs(this), this._packageData = Te, this._log.setLevel(D.VERBOSE), window.__paella_instances__ = window.__paella_instances__ || [], window.__paella_instances__.push(this), this.log.debug("New paella player instance"), typeof e == "string" && (e = document.getElementById(e)), e.classList.add("player-container"), this.log.debug("Loading skin manager"), this._skin = new sa(this), this._containerElement = e, this._initParams = t, this._initParams.manifestFileName = this._initParams.manifestFileName || "data.json", this._initParams.loadConfig = this._initParams.loadConfig || Si, this._initParams.getVideoId = this._initParams.getVideoId || Ti, this._initParams.getManifestUrl = this._initParams.getManifestUrl || Ii, this._initParams.getManifestFileUrl = this._initParams.getManifestFileUrl || ki, this._initParams.loadVideoManifest = this._initParams.loadVideoManifest || Di, this._initParams.customPluginContext = this._initParams.customPluginContext || [], this._initParams.translateFunction = this._initParams.translateFunction || Ht, this._initParams.getLanguageFunction = this._initParams.getLanguageFunction || Wt, this._initParams.setLanguageFunction = this._initParams.setLanguageFunction || jt, this._initParams.addDictionaryFunction = this._initParams.addDictionaryFunction || qt, this._initParams.getDictionariesFunction = this._initParams.getDictionariesFunction || Qt, this._initParams.getDefaultLanguageFunction = this._initParams.getDefaultLanguageFunction || Yt, this._initParams.Loader = this._initParams.customLoader || Ai, this._initParams.getCookieConsentFunction = this._initParams.getCookieConsentFunction || mi, this._initParams.getCookieDescriptionFunction = this._initParams.getCookieDescriptionFunction || fi, this._initParams.getProgressIndicator = this._initParams.getProgressIndicator || Ys, this._initParams.loadDictionaries = this._initParams.loadDictionaries || async function(a) {
      ve("en", {
        Hello: "Hello",
        World: "World"
      }), ve("es", {
        Hello: "Hola",
        World: "Mundo"
      }), gt(navigator.language.substring(0, 2));
    };
    const i = this._initParams.plugins || [];
    this._initParams.plugins = [
      ...i
    ], wn(this._initParams.translateFunction), Cn(this._initParams.setLanguageFunction), bn(this._initParams.getLanguageFunction), Ln(this._initParams.addDictionaryFunction), Pn(this._initParams.getDictionariesFunction), En(this._initParams.getDefaultLanguageFunction), this._config = null, this._defaultVideoPreview = "", this._defaultVideoPreviewPortrait = "", this._videoId = null, this._manifestUrl = null, this._manifestFileUrl = null, this._manifestData = null, this._videoManifest = null, this._playerLoaded = !1;
    const s = () => {
      this.resize();
    };
    window.addEventListener("resize", s), this.containerElement.addEventListener("fullscreenchange", () => {
      E(this, g.FULLSCREEN_CHANGED, { status: this.isFullscreen }), this.isFullscreen ? E(this, g.ENTER_FULLSCREEN) : E(this, g.EXIT_FULLSCREEN);
    }), this._playerState = w.UNLOADED, this._customPluginIcons = {};
  }
  get version() {
    return this._packageData.version;
  }
  get pluginModules() {
    return this.__pluginModules || [];
  }
  get log() {
    return this._log;
  }
  get ready() {
    return this._playerState === w.LOADED;
  }
  get state() {
    return this._playerState;
  }
  get stateText() {
    return F[this.state];
  }
  get Events() {
    return g;
  }
  get preferences() {
    return this._preferences;
  }
  get skin() {
    return this._skin;
  }
  get containsFocus() {
    return this.containerElement.contains(document.activeElement);
  }
  translate(e, t = null) {
    return Ce(e, t);
  }
  setLanguage(e) {
    gt(e);
  }
  getLanguage() {
    return vn();
  }
  addDictionary(e, t) {
    ve(e, t);
  }
  getDictionaries() {
    return _n();
  }
  getDefaultLanguage() {
    return ii(this);
  }
  bindEvent(e, t, i = !0) {
    A(this, e, (s) => t(s), i);
  }
  getShortcuts() {
    return getShortcuts(this);
  }
  pauseCaptureShortcuts() {
    return pauseCaptureShortcuts(this);
  }
  resumeCaptureShortcuts() {
    return resumeCaptureShortcuts(this);
  }
  getPlugin(e, t = null) {
    if (t) {
      const i = this.__pluginData__.pluginInstances[t];
      if (i)
        return i.find((s) => {
          if (s.name === e)
            return s;
        });
    } else {
      const i = {};
      for (const s in this.__pluginData__.pluginInstances) {
        const r = this.__pluginData__.pluginInstances[s].find((o) => {
          if (o.name === e)
            return o;
        });
        r && (i[s] = r);
      }
      return i;
    }
  }
  get hideUiTime() {
    return this._hideUiTime;
  }
  set hideUiTime(e) {
    this._hideUiTime = e;
  }
  get containerSize() {
    return { w: this._containerElement.offsetWidth, h: this._containerElement.offsetHeight };
  }
  get containerElement() {
    return this._containerElement;
  }
  get initParams() {
    return this._initParams;
  }
  get cookieConsent() {
    return this._cookieConsent;
  }
  // Status flags getters
  // The configuration is loaded
  get configLoaded() {
    return this.configUrl !== null;
  }
  // The video manifest file is loaded
  get videoManifestLoaded() {
    return this.videoManifest !== null;
  }
  // The video streams are loaded
  get videoLoaded() {
    var e;
    return ((e = this.videoContainer) == null ? void 0 : e.ready) || !1;
  }
  // The player user interface is loaded
  get playerLoaded() {
    return this._playerLoaded;
  }
  get configResourcesUrl() {
    var e;
    return ((e = this._initParams) == null ? void 0 : e.configResourcesUrl) || "config/";
  }
  get configUrl() {
    var e;
    return ((e = this._initParams) == null ? void 0 : e.configUrl) || "config/config.json";
  }
  get config() {
    return this._config;
  }
  get defaultVideoPreview() {
    return this._defaultVideoPreview;
  }
  get defaultVideoPreviewPortrait() {
    return this._defaultVideoPreviewPortrait;
  }
  get videoId() {
    return this._videoId;
  }
  // Base URL where the video repository is located, for example "repository/"
  get repositoryUrl() {
    var e, t;
    return ((e = this._initParams) == null ? void 0 : e.repositoryUrl) || ((t = this.config) == null ? void 0 : t.repositoryUrl) || "";
  }
  // Base URL where the video manifest file is located, for example "repository/[video_id]"
  get manifestUrl() {
    return this._manifestUrl;
  }
  // Video manifest file name, for example "data.json"
  get manifestFileName() {
    var e, t;
    return ((e = this.config) == null ? void 0 : e.manifestFileName) || ((t = this._initParams) == null ? void 0 : t.manifestFileName) || "";
  }
  // Full path of the video manifest, for example "repository/[video_id]/data.json"
  get manifestFileUrl() {
    return this._manifestFileUrl;
  }
  // Video manifest file content (data.json)
  get videoManifest() {
    return this._videoManifest;
  }
  get previewContainer() {
    return this._previewContainer;
  }
  get videoContainer() {
    return this._videoContainer;
  }
  get playbackBar() {
    return this._playbackBar;
  }
  get captionsCanvas() {
    return this._captionsCanvas;
  }
  get data() {
    return this._data;
  }
  get PlayerState() {
    return w;
  }
  get PlayerStateNames() {
    return F;
  }
  // Manifest query functions
  get metadata() {
    var e;
    return ((e = this._manifestParser) == null ? void 0 : e.metadata) || {};
  }
  get streams() {
    var e;
    return ((e = this._manifestParser) == null ? void 0 : e.streams) || [];
  }
  get frameList() {
    var e;
    return ((e = this._manifestParser) == null ? void 0 : e.frameList) || {};
  }
  get captions() {
    var e;
    return ((e = this._manifestParser) == null ? void 0 : e.captions) || [];
  }
  get trimming() {
    var e;
    return ((e = this._manifestParser) == null ? void 0 : e.trimming) || {};
  }
  get visibleTimeLine() {
    var e;
    return ((e = this._manifestParser) == null ? void 0 : e.visibleTimeLine) || !0;
  }
  waitState(e) {
    return new Promise((t, i) => {
      const s = () => {
        this.state === e ? t() : setTimeout(s, 50);
      };
      typeof e == "string" && (e = w[e]), (e < 0 || e > Object.values(w).length) && i(Error(`Invalid player state '${e}'`)), s();
    });
  }
  async loadUrl(e, { title: t, duration: i, preview: s, previewPortrait: a } = {}) {
    if (this._playerState !== w.UNLOADED)
      throw new Error(this.translate("loadUrl(): Invalid current player state: $1", [F[this._playerState]]));
    if (this._manifestLoaded)
      throw new Error(this.translate("loadUrl(): Invalid current player state: $1", [F[this._playerState]]));
    if (!e)
      throw new Error(this.translate("loadUrl(): No URL specified."));
    Array.isArray(e) || (e = [e]), t || (t = Ae(e[0]), this.log.warn("Paella.loadUrl(): no title specified. Using URL file name as video name."));
    try {
      if (await Lt.apply(this), !s && (this.defaultVideoPreview !== "" || this.defaultVideoPreviewPortrait !== ""))
        s = this.defaultVideoPreview, a = this.defaultVideoPreviewPortrait, this.log.warn("Paella.loadUrl(): no preview image specified. Using default preview image.");
      else if (!s && !a)
        throw new Error("Paella.loadUrl(): no preview image specified and no default preview image configured.");
      this._videoId = kt(Ae(e[0])), this._manifestUrl = Ke(e[0]), this._manifestFileUrl = e[0], this.log.debug(`Loading video with identifier '${this.videoId}' from URL '${this.manifestFileUrl}'`);
      const r = Fn(this, e.length)[0];
      this._videoManifest = {
        metadata: {
          duration: i,
          title: t,
          preview: s,
          previewPortrait: a
        },
        streams: e.map((o, l) => ({
          sources: Ts(this, o),
          content: r[l],
          role: l === 0 ? "mainAudio" : null
        }))
      }, await Pt.apply(this);
    } catch (r) {
      throw this._playerState = w.ERROR, this.log.error(r), this._errorContainer = new $e(this, this.translate(r.message)), r;
    }
  }
  async loadManifest() {
    if (this._playerState !== w.UNLOADED)
      throw new Error(this.translate("loadManifest(): Invalid current player state: $1", [F[this._playerState]]));
    if (!this._manifestLoaded)
      try {
        if (await Lt.apply(this), this._videoId = await this.initParams.getVideoId(this._config, this), this.videoId === null)
          throw new Error("No video identifier specified");
        this._manifestUrl = await this.initParams.getManifestUrl(this.repositoryUrl, this.videoId, this._config, this), this._manifestFileUrl = await this.initParams.getManifestFileUrl(this._manifestUrl, this.manifestFileName, this._config, this), this.log.debug(`Loading video with identifier '${this.videoId}' from URL '${this.manifestFileUrl}'`), this._videoManifest = await this.initParams.loadVideoManifest(this.manifestFileUrl, this._config, this), this._videoManifest.metadata = this._videoManifest.metadata || {}, !this._videoManifest.metadata.preview && (this.defaultVideoPreview !== "" || this.defaultVideoPreviewPortrait !== "") && (this._videoManifest.metadata.preview = this.defaultVideoPreview, this._videoManifest.metadata.previewPortrait = this.defaultVideoPreviewPortrait, this.log.warn("Paella.loadUrl(): no preview image specified. Using default preview image.")), this._manifestParser = new aa(this.videoManifest, this), bt.apply(this.skin), await na.apply(this.skin), await ta.apply(this.skin), await Pt.apply(this);
      } catch (e) {
        throw this._playerState = w.ERROR, this.log.error(e), this._errorContainer = new $e(this, this.translate(e.message)), e;
      }
  }
  async loadPlayer() {
    var e, t, i;
    try {
      if (this._captionsCanvas = new Hs(this, this._containerElement), this._playerState !== w.MANIFEST)
        throw new Error(this.translate("loadPlayer(): Invalid current player state: $1", [F[this._playerState]]));
      this._playerState = w.LOADING_PLAYER, (e = this._previewContainer) == null || e.removeFromParent(), this._loader = new this.initParams.Loader(this), await this._loader.create(), await this.videoContainer.load((t = this.videoManifest) == null ? void 0 : t.streams), E(this, g.STREAM_LOADED), this._playbackBar = new Gs(this, this.containerElement), await this._playbackBar.load(), this._hideUiTime = ((i = this.config.ui) == null ? void 0 : i.hideUITimer) ?? 5e3, At(this), this._captionsCanvas.load(), this._playerState = w.LOADED, await this.videoContainer.updateLayout(), E(this, g.PLAYER_LOADED), !(this.videoManifest.metadata.visibleTimeLine ?? !0) && this.playbackBar.progressIndicator.hideTimeLine(), this._loader.debug || (this._loader.removeFromParent(), this._loader = null);
    } catch (s) {
      throw this._playerState = w.ERROR, this._loader && (this._loader.removeFromParent(), this._loader = null), this._errorContainer = new $e(this, s.message), s;
    }
  }
  async load() {
    switch (this.state) {
      case w.UNLOADED:
        await this.loadManifest(), await this.loadPlayer();
        break;
      case w.MANIFEST:
        await this.loadPlayer();
        break;
      case w.LOADED:
        break;
      default:
        throw new Error(this.translate("Could not load player: state transition in progress: $1", [F[this.state]]));
    }
  }
  async unload() {
    switch (this.state) {
      case w.UNLOADED:
        break;
      case w.MANIFEST:
        await this.unloadManifest();
        break;
      case w.LOADED:
      case w.ERROR:
        await this.unloadPlayer(), await this.unloadManifest();
        break;
      default:
        throw new Error(this.translate("Could not unload player: state transition in progress: $1", [F[this.state]]));
    }
  }
  async unloadManifest() {
    var e;
    if (this._playerState !== w.MANIFEST && this._playerState !== w.ERROR)
      throw new Error(this.translate("unloadManifest(): Invalid current player state: $1", [F[this._playerState]]));
    this._errorContainer && (this._errorContainer.removeFromParent(), this._errorContainer = null), this._playerState = w.UNLOADING_MANIFEST, this.log.debug("Unloading paella player"), await Ws(), await Ls(this), this._manifestLoaded = !1, (e = this._previewContainer) == null || e.removeFromParent(), this._preferences = null, this._playerState = w.UNLOADED, bt.apply(this.skin);
  }
  async unloadPlayer() {
    var e, t, i, s, a;
    if (this._playerState !== w.LOADED && this._playerState !== w.ERROR)
      throw new Error(this.translate("unloadManifest(): Invalid current player state: $1", [F[this._playerState]]));
    this._errorContainer && (this._errorContainer.removeFromParent(), this._errorContainer = null), this._playerState = w.UNLOADING_PLAYER, await ((e = this._videoContainer) == null ? void 0 : e.unload()), this._videoContainer = null, await ((t = this._playbackBar) == null ? void 0 : t.unload()), this._playbackBar = null, (i = this._captionsCanvas) == null || i.unload(), this._captionsCanvas = null, Mt(this), E(this, g.PLAYER_UNLOADED), (a = (s = this.videoManifest) == null ? void 0 : s.metadata) != null && a.preview && wi.apply(this), Li(this), this._playerState = w.MANIFEST;
  }
  async reload(e = null) {
    switch (this.state) {
      case w.UNLOADED:
        break;
      case w.MANIFEST:
        await this.unloadManifest();
        break;
      case w.LOADED:
        await this.unload();
        break;
    }
    typeof e == "function" && await e(), await this.load();
  }
  async resize() {
    var e, t;
    if ((e = this.videoContainer) == null || e.updateLayout(), (t = this.playbackBar) == null || t.onResize(), this.videoContainer) {
      const i = () => ({
        w: this.videoContainer.element.offsetWidth,
        h: this.videoContainer.element.offsetHeight
      });
      E(this, g.RESIZE, { size: i() }), this._resizeEndTimer && clearTimeout(this._resizeEndTimer), this._resizeEndTimer = setTimeout(() => {
        E(this, g.RESIZE_END, { size: i() });
      }, 1e3);
    }
  }
  async hideUserInterface() {
    var e, t, i;
    await ((e = this.videoContainer) == null ? void 0 : e.paused()) || (this._uiHidden = !0, (t = this.videoContainer) == null || t.hideUserInterface(), (i = this.playbackBar) == null || i.hideUserInterface(), E(this, g.HIDE_UI));
  }
  async showUserInterface() {
    var e, t;
    (e = this.videoContainer) == null || e.showUserInterface(), (t = this.playbackBar) == null || t.showUserInterface(), this._uiHidden && E(this, g.SHOW_UI), this._uiHidden = !1;
  }
  // Playback functions
  async play() {
    this.videoContainer.ready || await this.loadPlayer(), await this.videoContainer.play();
  }
  async pause() {
    var e;
    await ((e = this.videoContainer) == null ? void 0 : e.pause());
  }
  async paused() {
    return this.videoContainer ? this.videoContainer.paused() : !0;
  }
  async stop() {
    var e;
    await ((e = this.videoContainer) == null ? void 0 : e.stop());
  }
  isFullScreenSupported() {
    return this.containerElement.requestFullscreen || this.containerElement.webkitRequestFullScreen;
  }
  async enterFullscreen() {
    let e = null;
    return this.containerElement.requestFullscreen ? e = this.containerElement.requestFullscreen() : this.containerElement.webkitRequestFullScreen && (this.log.debug("Safari enter fullscreen"), e = this.containerElement.webkitRequestFullScreen()), setTimeout(() => this.resize(), 500), e;
  }
  async exitFullscreen() {
    if (document.exitFullscreen && this.isFullscreen)
      return document.exitFullscreen();
    if (document.webkitCancelFullScreen && this.isFullscreen)
      return this.log.debug("Safari exit fullscreen"), document.webkitCancelFullScreen();
  }
  get isFullscreen() {
    return document.fullscreenElement === this.containerElement || document.webkitFullscreenElement === this.containerElement;
  }
  addCustomPluginIcon(e, t, i) {
    this._customPluginIcons[`${e}-${t}`] = i;
  }
  removeCustomPluginIcon(e, t) {
    this._customPluginIcons[`${e}-${t}`] = null;
  }
  getCustomPluginIcon(e, t) {
    return this._requestedCustomIcons = this._requestedCustomIcons || [], this._requestedCustomIcons.find((i) => i.pluginName === e && i.iconName === t) || this._requestedCustomIcons.push({
      pluginName: e,
      iconName: t
    }), this._customPluginIcons[`${e}-${t}`];
  }
  get requestedCustomIcons() {
    return this._requestedCustomIcons || [];
  }
}
class ha {
  constructor({
    id: e,
    name: t,
    groupId: i = "",
    language: s = "",
    selected: a = !1
  }) {
    this._id = e, this._name = t, this._groupId = i, this._lang = s, this._selected = a;
  }
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get groupId() {
    return this._groupId;
  }
  get language() {
    return this._lang;
  }
  get selected() {
    return this._selected;
  }
  set selected(e) {
    this._selected = e;
  }
}
export {
  an as AudioOnlyVideo,
  ha as AudioTrackData,
  rn as AudioVideoPlugin,
  ws as ButtonGroupPlugin,
  st as ButtonPlugin,
  ri as Canvas,
  la as CanvasButtonPlugin,
  S as CanvasButtonPosition,
  oi as CanvasPlugin,
  Gt as Captions,
  Bt as CaptionsPlugin,
  Un as CurrentTimeLabelPlugin,
  fn as DFXPParser,
  os as Data,
  ci as DataPlugin,
  yn as DfxpManifestCaptionsPlugin,
  z as DomClass,
  vt as DualVideoDynamicLayoutPlugin,
  Yn as DualVideoLayoutPlugin,
  ua as EventLogPlugin,
  g as Events,
  Ot as HtmlVideo,
  on as HtmlVideoFormatPlugin,
  dn as ImageVideo,
  hn as ImageVideoFormatPlugin,
  D as LOG_LEVEL,
  Ai as Loader,
  Zs as Log,
  aa as ManifestParser,
  _s as MenuButtonPlugin,
  pn as Mp4Video,
  gn as Mp4VideoFormatPlugin,
  da as Paella,
  ge as PaellaCorePlugins,
  xn as PlayPauseButtonPlugin,
  de as PlayerResource,
  w as PlayerState,
  F as PlayerStateNames,
  he as Plugin,
  Ue as PluginModule,
  ds as PopUpButtonPlugin,
  Jn as SingleVideoLayoutPlugin,
  is as TripleVideoLayoutPlugin,
  it as UserInterfacePlugin,
  tt as Video,
  as as VideoCanvas,
  rs as VideoCanvasPlugin,
  U as VideoContainerMessagePosition,
  me as VideoLayout,
  Ne as VideoPlugin,
  ln as VideoQualityItem,
  Nn as VttManifestCaptionsPlugin,
  Vn as WebVTTParser,
  ve as addDictionary,
  A as bindEvent,
  Ps as checkManifestIntegrity,
  Ut as createElement,
  L as createElementWithHtmlText,
  Ys as createProgressIndicator,
  Qs as createTimeLinePreview,
  qt as defaultAddDictionaryFunction,
  mi as defaultGetCookieConsentCallback,
  fi as defaultGetCookieDescriptionCallback,
  Yt as defaultGetDefaultLanguageFunction,
  Qt as defaultGetDictionariesFunction,
  Wt as defaultGetLanguageFunction,
  ki as defaultGetManifestFileUrlFunction,
  Ii as defaultGetManifestUrlFunction,
  Ti as defaultGetVideoIdFunction,
  Si as defaultLoadConfigFunction,
  Di as defaultLoadVideoManifestFunction,
  jt as defaultSetLanguageFunction,
  Ht as defaultTranslateFunction,
  ii as getDefaultLanguage,
  _n as getDictionaries,
  vn as getLanguage,
  ui as getPluginsOfType,
  ca as importPlugins,
  Fi as isVolumeApiAvailable,
  $ as loadPluginsOfType,
  X as log,
  pt as parseDFXP,
  yt as parseWebVTT,
  us as plugins,
  gt as setLanguage,
  Ce as translate,
  E as triggerEvent,
  se as triggerIfReady,
  oa as utils
};
//# sourceMappingURL=paella-core.js.map
