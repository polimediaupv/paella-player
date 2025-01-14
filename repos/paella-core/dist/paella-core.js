var ct = (n) => {
  throw TypeError(n);
};
var ut = (n, e, t) => e.has(n) || ct("Cannot " + t);
var u = (n, e, t) => (ut(n, e, "read from private field"), t ? t.call(n) : e.get(n)), S = (n, e, t) => e.has(n) ? ct("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), T = (n, e, t, i) => (ut(n, e, "write to private field"), i ? i.call(n, t) : e.set(n, t), t);
const m = Object.freeze({
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
function P(n, e, t = {}) {
  n.__eventListeners__ && n.__eventListeners__[e] && n.__eventListeners__[e].forEach((i) => i.callback(t));
}
function ne(n, e, t = {}) {
  n.ready && P(n, e, t);
}
function vi(n) {
  if (n.__eventListeners__)
    for (const e in n.__eventListeners__)
      n.__eventListeners__[e] = n.__eventListeners__[e].filter((t) => t.unregisterOnUnload == !1), n.log.debug("Unregister event: " + n.__eventListeners__[e]);
}
function Lt(n) {
  return new Promise((e, t) => {
    fetch(n).then((i) => i.text()).then((i) => {
      e(i);
    }).catch((i) => t(i));
  });
}
function Pt(n) {
  const e = new URLSearchParams(window.location.search);
  return e.has(n) ? e.get(n) : null;
}
function Et(n) {
  const e = window.location.hash.replace("#", "?"), t = new URLSearchParams(e);
  return t.has(n) ? t.get(n) : null;
}
function $(n, e) {
  const t = e || "/";
  return n = n.map((i, s) => (s && (i = i.replace(new RegExp("^" + t), "")), s !== n.length - 1 && (i = i.replace(new RegExp(t + "$"), "")), i)), n.join(t);
}
function St(n) {
  return new RegExp("^([a-z]+://|//)", "i").test(n) || /^\//.test(n);
}
function xe(n) {
  try {
    return new URL(n).pathname.split("/").pop();
  } catch {
    return n.split("/").pop();
  }
}
function Tt(n) {
  return n.split(".").reduce((e, t, i, s) => i < s.length - 1 ? e !== "" ? `${e}.${t}` : t : e, "");
}
function Ze(n) {
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
function Ke(n) {
  return xe(n).split(".").pop();
}
function Q(n, e) {
  return St(e) ? e : $([n.manifestUrl, e]);
}
function It(n) {
  n.__hideTimerPaused__ = !0;
}
function Dt(n) {
  n.__hideTimerPaused__ = !1;
}
function kt(n, e = "hideUiTime") {
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
  }), A(n, m.PLAY, async () => {
    s();
  }), A(n, m.PAUSE, async () => {
    await n.showUserInterface();
  }), A(n, m.ENDED, async () => {
    await n.showUserInterface();
  }), document.addEventListener("keydown", async () => {
    s();
  });
}
function xt(n) {
  n.__hideTimer__ && (clearTimeout(n.__hideTimer__), delete n.__hideTimer__);
}
function ee(n) {
  const e = Math.floor(n / 60 / 60), t = Math.floor(n / 60) - e * 60, i = Math.floor(n % 60);
  return (e > 0 ? e.toString().padStart(2, "0") + ":" : "") + t.toString().padStart(2, "0") + ":" + i.toString().padStart(2, "0");
}
function ke(n) {
  const t = /^(?:(\d+):){0,1}(\d+):(\d+)(\.\d+)?$/.exec(n);
  if (t) {
    const i = t[1] !== void 0 ? Number(t[1]) : 0, s = Number(t[2]), a = Number(t[3]);
    return i * 3600 + s * 60 + a;
  }
  return null;
}
function We(n) {
  const t = /^(?:(\d+):){0,1}(\d+):(\d+)\.(\d+)?$/.exec(n);
  if (t) {
    const i = t[1] !== void 0 ? Number(t[1]) : 0, s = Number(t[2]), a = Number(t[3]), r = t[4] && Number(t[4]) || 0;
    return i * 36e5 + s * 6e4 + a * 1e3 + r;
  }
  return null;
}
function te(n, e, t = 365) {
  let i = /* @__PURE__ */ new Date();
  i.setTime(i.getTime() + t * 24 * 60 * 60 * 1e3);
  let s = `expires=${i.toUTCString()}`;
  document.cookie = `${n}=${e};${s};path=/;SameSite=None;` + (/Apple/.test(navigator.vendor) ? "" : "Secure;");
}
function At(n, e, t, i, s = 365) {
  n.cookieConsent.getConsentForType(e) && te(t, i, s);
}
function q(n) {
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
function wi(n) {
  const e = q(n), t = Number(e);
  return e !== "" && !isNaN(t) ? t : null;
}
function Ci(n) {
  try {
    return JSON.parse(q(n));
  } catch {
    return null;
  }
}
function Je(n, e = !0) {
  return new Promise((t) => {
    const i = document.createElement("link");
    i.setAttribute("rel", "stylesheet"), i.setAttribute("href", n), i.onload = () => t(i);
    const s = document.getElementsByTagName("head")[0];
    e && s.appendChild(i), t();
  });
}
function Mt(n) {
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
function Rt(n, { excludedTags: e = null } = {}) {
  const t = document.createElement("div");
  t.innerHTML = n;
  const i = ["script"];
  return e && i.push(...e), i.flatMap((s) => Array.from(t.getElementsByTagName(s))).forEach((s) => {
    s.parentElement.removeChild(s);
  }), t.innerHTML;
}
let De = null;
function Xe(n) {
  if (!n) return !1;
  De || (De = document.createElement("video"));
  let e = De.canPlayType(n);
  if (e === "maybe" || e === "probably")
    return !0;
  if (/video\/mp4/i.test(n))
    return e = De.canPlayType("video/mp4"), e === "maybe" || e === "probably";
}
const na = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clearAutoHideTimer: xt,
  getCookie: q,
  getFileExtension: Ke,
  getHashParameter: Et,
  getJSONCookie: Ci,
  getNumericCookie: wi,
  getUrlFileName: xe,
  getUrlParameter: Pt,
  isAbsoluteUrl: St,
  joinPath: $,
  loadStyle: Je,
  loadSvgIcon: Lt,
  mergeObjects: we,
  pauseAutoHideUiTimer: It,
  removeExtension: Tt,
  removeFileName: Ze,
  resolveResourcePath: Q,
  resumeAutoHideUiTimer: Dt,
  sanitizeHTML: Rt,
  secondsToTime: ee,
  setCookie: te,
  setCookieIfAllowed: At,
  setupAutoHideUiTimer: kt,
  supportsVideoType: Xe,
  timeToMilliseconds: We,
  timeToSeconds: ke,
  unloadStyle: Mt
}, Symbol.toStringTag, { value: "Module" }));
async function bi(n, e) {
  return e.log.debug("Using default configuration loading function."), (await fetch(n)).json();
}
async function Li(n, e) {
  return e.log.debug("Using default getVideoId function"), Et("id") || Pt("id") || n.fallbackId;
}
async function Pi(n, e, t, i) {
  return i.log.debug("Using default getManifestUrl function"), $([n, e]);
}
async function Ei(n, e, t, i) {
  return i.log.debug("Using default getManifestFileUrl function"), $([n, e]);
}
async function Si(n, e, t) {
  t.log.debug("Using default loadVideoManifest function");
  const i = await fetch(n);
  if (i.ok)
    return await i.json();
  throw new Error(t.translate("Error loading video manifest: $1 $2", [i.status, i.statusText]));
}
var be;
class ue {
  constructor(e) {
    S(this, be, null);
    T(this, be, e);
  }
  get player() {
    return u(this, be);
  }
}
be = new WeakMap();
function Vt({ tag: n = "div", attributes: e = {}, children: t = "", innerText: i = "", parent: s = null }) {
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
var R;
class B extends ue {
  constructor(t, { tag: i = "div", attributes: s = [], children: a = "", parent: r = null }) {
    super(t);
    S(this, R, null);
    T(this, R, Vt({ tag: i, attributes: s, children: a, parent: r })), Object.defineProperty(this, i, {
      get: () => u(this, R)
    });
  }
  get element() {
    return u(this, R);
  }
  get parent() {
    return u(this, R).parentElement;
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
    u(this, R).setAttribute(t, i);
  }
  removeFromParent() {
    var t;
    (t = u(this, R).parentElement) == null || t.removeChild(u(this, R));
  }
  setParent(t) {
    this.removeFromParent(), t.appendChild(u(this, R));
  }
}
R = new WeakMap();
const Ti = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
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
class Ii extends B {
  constructor(e) {
    super(e, { parent: e.containerElement }), this.element.className = "loader-container";
  }
  async create() {
    L(`<i>${Ti}</i>`, this.element);
  }
  get debug() {
    return !1;
  }
}
const Di = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g id="Cancel" transform="matrix(5.54545,6.8353e-32,6.8353e-32,5.54545,-2567.37,-10735.5)">
        <path d="M486.05,1937C498.192,1937 508.05,1946.86 508.05,1959C508.05,1971.14 498.192,1981 486.05,1981C473.908,1981 464.05,1971.14 464.05,1959C464.05,1946.86 473.908,1937 486.05,1937ZM478.979,1950.52L477.565,1951.93L484.636,1959L477.565,1966.07L478.979,1967.49L486.05,1960.41L493.121,1967.49L494.535,1966.07L487.464,1959L494.535,1951.93L493.121,1950.52L486.05,1957.59L478.979,1950.52Z" style="fill:rgb(210,0,0);"/>
    </g>
</svg>
`;
class Oe extends B {
  constructor(e, t = "") {
    super(e, { parent: e.containerElement }), this.element.className = "error-container", L(`
            <div>
                <i>${Di}</i>
                <p>${t}</p>
            </div>`, this.element);
  }
}
class de extends ue {
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
class Ve extends de {
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
const Ae = [];
async function ki(n) {
  await F(n, "video", (e) => {
    Ae.push(e);
  });
}
async function xi(n) {
  Ae.slice(0);
}
function Nt(n) {
  if (Ae.length === 0)
    throw Error("No video plugins loaded. Note that `loadVideoPlugins()` must to be called before using `getVideoPlugins()`.");
  return Ae;
}
function Ai(n, e) {
  const t = Ke(e);
  return Nt().find((s) => s.getCompatibleFileExtensions().indexOf(t) !== -1);
}
async function Mi(n, e) {
  const t = Nt();
  let i = null;
  for (const s of t)
    if (await s.isCompatible(e)) {
      i = s;
      break;
    }
  return i;
}
async function Ri() {
  return await new Promise((e) => {
    const t = document.createElement("audio"), i = setTimeout(() => e(!1), 100);
    t.addEventListener("volumechange", (s) => {
      clearTimeout(i), e(!0);
    }), t.volume = 0.5;
  });
}
class et extends B {
  constructor(e, t, i) {
    const s = {
      class: "video-player"
    };
    super(t, { tag: e, attributes: s, parent: i }), this._streamProvider = null, this._streamData = null, this._ready = !1;
  }
  async isVolumeApiAvailable() {
    return await Ri();
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
class Ne extends ue {
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
const Vi = "paella-core", Ni = {
  ".": "./src/js/index.js",
  "./*": "./src/js/*",
  "./paella-core.css": "./dist/paella-core.css"
}, Ui = "2.0.0", Fi = "Multistream HTML video player", Oi = "./src/js/index.js", $i = [
  "dist/paella-core.css"
], Bi = "./src/js/index.js", Gi = "module", zi = {
  dev: "vite",
  build: "vite build --emptyOutDir"
}, Hi = {
  type: "git",
  url: "git+https://github.com/polimediaupv/paella-player.git"
}, ji = [
  "html",
  "player",
  "video",
  "hls"
], Wi = "Fernando Serrano Carpena <ferserc1@gmail.com>", qi = "ECL-2.0", Qi = {
  url: "https://github.com/polimediaupv/paella-player/issues"
}, Yi = "https://github.com/polimediaupv/paella-player#readme", Zi = {
  vite: "^5.0.8"
}, Ki = {
  "@ferserc1/input-style-unifier": "^0.0.1"
}, Te = {
  name: Vi,
  exports: Ni,
  version: Ui,
  description: Fi,
  main: Oi,
  files: $i,
  module: Bi,
  type: Gi,
  scripts: zi,
  repository: Hi,
  keywords: ji,
  author: Wi,
  license: qi,
  bugs: Qi,
  homepage: Yi,
  devDependencies: Zi,
  dependencies: Ki
};
let $e = null;
class he extends Ne {
  static Get() {
    return $e || ($e = new he()), $e;
  }
  get moduleName() {
    return "paella-core default video formats";
  }
  get moduleVersion() {
    return Te.version;
  }
}
function Ji(n) {
  return new Promise((e, t) => {
    const i = new Image();
    i.addEventListener("load", (s) => {
      e(i);
    }), i.addEventListener("error", (s) => {
      t(new Error("Could not load preview image. The preview image is required in audio only streams"));
    }), i.src = n;
  });
}
function Xi(n, e, t) {
  return new Promise((i, s) => {
    e.oncanplay = () => i(), e.onerror = () => s(new Error(n.translate("Error loading audio: $1", [t]))), e.src = Q(n, t), i();
  });
}
class en extends et {
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
    if (this._previewImage = await Ji(t), this._imageContainer = document.createElement("div"), this._imageContainer.className = "image-container", this.parent.appendChild(this._imageContainer), this._imageContainer.appendChild(this._previewImage), this._source = e.sources.audio && e.sources.audio[0], !this._source)
      throw new Error("Invalid source in audio only video stream");
    if (!this.isMainAudioPlayer)
      throw new Error("Audio only video stream must be main audio player. Check the role property at video manifest");
    await Xi(this.player, this.audio, this._source.src);
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
class tn extends Ve {
  getPluginModuleInstance() {
    return he.Get();
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
    return new en(this.player, e, t);
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
class Ut extends et {
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
      t = Q(this.player, t);
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
class nn extends Ve {
  getPluginModuleInstance() {
    return he.Get();
  }
  get name() {
    return super.name || "es.upv.paella.htmlVideoFormat";
  }
  get streamType() {
    return "html";
  }
  async isCompatible(e) {
    const { html: t } = e.sources;
    return t && t.some((i) => Xe(i.mimetype));
  }
  async getVideoInstance(e, t) {
    return new Ut(this.player, e, t, this.config);
  }
  getCompatibleFileExtensions() {
    return ["m4v", "mp4", "ogg", "webm", "ogv"];
  }
  getManifestData(e) {
    const t = (i) => {
      switch (Ke(i)) {
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
class sn {
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
function Ft(n) {
  let e = this._currentSource.frames[0];
  this._currentSource.frames.some((t) => {
    if (t.time <= this._currentTime)
      e = t;
    else
      return !0;
  }), this.img.src = e.src;
}
function an() {
  this._startTimestamp = Date.now();
  const n = () => {
    this._timer = setTimeout(n, 250);
    const e = Date.now(), t = e - this._startTimestamp;
    this._currentTime += t / 1e3, this._startTimestamp = e, Ft.apply(this, [this._currentTime]);
  };
  n();
}
function rn() {
  this._timer && (clearTimeout(this._timer), this._timer = null);
}
class on extends et {
  constructor(e, t) {
    super("img", e, t), this._currentTime = 0, this._startTimesamp = 0, this._playbackRate = 1, this._timer = null, this.video = this.domElement;
  }
  async play() {
    an.apply(this);
  }
  async pause() {
    rn.apply(this);
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
    this._currentTime = e, Ft.apply(this, [e]);
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
    return this._sources = e.sources.image, this._qualities = this._sources.map((t) => new sn({
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
class ln extends Ve {
  getPluginModuleInstance() {
    return he.Get();
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
    return new on(this.player, e, this.config, t);
  }
}
class cn extends Ut {
  constructor(e, t, i, s) {
    super(e, t, i, s);
  }
  // This function is called when the player loads, and it should
  // make everything ready for video playback to begin.
  async loadStreamData(e = null) {
    this._streamData = this._streamData || e, this.player.log.debug("es.upv.paella.mp4VideoFormat: loadStreamData"), this._currentSource || (this._sources = null, this._currentQuality = 0, this._sources = e.sources.mp4, this._sources.sort((t, i) => Number(t.res.w) - Number(i.res.w)), this._currentQuality = this._sources.length - 1, this._currentSource = this._sources[this._currentQuality]), this.isMainAudioPlayer || (this.video.muted = !0), this._initialVolume && (this.video.volume = this._initialVolume, this._initialVolume === 0 && (this.video.muted = !0)), this.video.src = Q(this.player, this._currentSource.src), this._endedCallback = this._endedCallback || (() => {
      typeof this._videoEndedCallback == "function" && this._videoEndedCallback();
    }), this.video.addEventListener("ended", this._endedCallback);
    try {
      await this.video.play();
    } catch {
    }
    await this.waitForLoaded(), this.player.log.debug(`es.upv.paella.mp4VideoFormat (${this.streamData.content}): video loaded and ready.`), this.saveDisabledProperties(this.video);
  }
}
class un extends Ve {
  getPluginModuleInstance() {
    return he.Get();
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
    return t && Xe((i = t[0]) == null ? void 0 : i.mimetype);
  }
  async getVideoInstance(e, t) {
    return new cn(this.player, e, t, this.config);
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
async function dn(n) {
  const e = [];
  await F(n, "captions", async (t) => {
    e.push(t);
  });
  for (let t in e) {
    const s = await e[t].getCaptions(), a = n.captionsCanvas;
    s.forEach((r) => a.addCaptions(r));
  }
}
class Ot extends de {
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
class $t {
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
      a.start = ke(t), a.startString = t;
    else if (typeof t == "number")
      a.start = t, a.startString = ee(t);
    else
      throw Error("Invalid cue timestamp format: must be a valid time string or a number of seconds");
    if (typeof i == "string")
      a.end = ke(i), a.endString = i;
    else if (typeof i == "number")
      a.end = i, a.endString = ee(i);
    else
      throw Error("Invalid cue timestamp format: must be a valid time string or a number of seconds");
    return this._cues.push(a), a;
  }
  getCue(e) {
    if (typeof e == "string")
      e = ke(e);
    else if (typeof e != "number")
      throw Error("Invalid time instant format getting cue");
    let t = null;
    return this._cues.some((i) => {
      if (e >= i.start && e <= i.end)
        return t = i, !0;
    }), t;
  }
}
function dt(n, e) {
  const t = {}, s = new DOMParser().parseFromString(e, "text/xml");
  return Array.from(s.getElementsByTagName("div")).forEach((a) => {
    const r = a.getAttribute("xml:lang") || "unknonw";
    t[r] = t[r] || new $t(n.translate(r), r), Array.from(a.getElementsByTagName("p")).forEach((o) => {
      const l = We(o.getAttribute("begin"));
      t[r].addCue({
        label: `caption_${o.getAttribute("xml:id") || l}`,
        start: l / 1e3,
        end: We(o.getAttribute("end")) / 1e3,
        captions: o.innerHTML
      });
    });
  }), t;
}
class hn {
  constructor(e, t = "") {
    this.player = e, this._text = t, this._captions = dt(this.player, t);
  }
  get text() {
    return this._text;
  }
  set text(e) {
    this._text = e, this._captions = dt(e);
  }
  get captions() {
    return this._captions;
  }
}
let Be = null;
class pe extends Ne {
  static Get() {
    return Be || (Be = new pe()), Be;
  }
  get moduleName() {
    return "paella-core default plugins";
  }
  get moduleVersion() {
    return Te.version;
  }
}
class pn extends Ot {
  getPluginModuleInstance() {
    return pe.Get();
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
          const r = Q(this.player, i.url), o = await fetch(r);
          if (o.ok) {
            let l = await o.text();
            l = l.replace(/[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, ""), l = l.replace(/&\w+;/gmi, ""), l = l.replaceAll("<br>", "");
            const c = new hn(this.player, l);
            Object.entries(c.captions).forEach(([f, h]) => {
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
class tt extends de {
  constructor(e, t, i) {
    super(e, t, i), this.__uiPlugin = !0;
  }
  async getDictionaries() {
    return null;
  }
}
let it = "en", Bt = "";
const se = {};
function Gt(n) {
  const e = se[it] || {}, t = se[Bt] || {};
  return e[n] || t[n] || n;
}
function zt(n) {
  it = n;
}
function Ht() {
  return it;
}
function jt(n, e) {
  se[n] = se[n] || {};
  for (const t in e) {
    const i = e[t];
    se[n][t] = i;
  }
}
function Wt() {
  return se;
}
function qt(n) {
  return n.config.defaultLanguage || navigator.language;
}
let Qt = Gt, Yt = zt, Zt = Ht, Kt = jt, Jt = Wt, Xt = qt;
function Ce(n, e = null) {
  const t = Qt(n);
  if (Array.isArray(e)) {
    let i = t;
    return e.forEach((s, a) => {
      const r = `$${a + 1}`;
      i = i.replace(r, s);
    }), i;
  } else
    return t;
}
function ht(n) {
  Yt(n);
}
function gn() {
  return Zt();
}
function _e(n, e) {
  Kt(n, e);
}
function mn() {
  return Jt();
}
function ei(n) {
  return Xt(n);
}
function fn(n) {
  Qt = n;
}
function yn(n) {
  Yt = n;
}
function _n(n) {
  Zt = n;
}
function vn(n) {
  Kt = n;
}
function wn(n) {
  Jt = n;
}
function Cn(n) {
  Xt = n;
}
function bn(n) {
  Bt = ei(n);
}
async function Me(n, e) {
  var c, f;
  const t = L("<li></li>", e);
  t.plugin = n;
  const i = Ce(n.ariaLabel), s = Ce(n.description), a = n.dynamicWidth ? "dynamic-width" : "fixed-width", r = n.id ? `id="${n.id}" ` : "", o = n.buttonName ? `name="${n.buttonName}" ` : "", l = n.tabIndex ? ` tabindex="${n.tabIndex}" ` : "";
  if (n.interactive) {
    const h = L(`
			<button type="button" ${r}${o}class="${a}"${l}aria-label="${i}" title="${s}">
			</button>
		`, t);
    n.className !== "" && h.classList.add(n.className), n._button = h, n._container = t, h._pluginData = n, t._pluginData = n, h.addEventListener("click", (d) => {
      const C = h._pluginData;
      P(C.player, m.BUTTON_PRESS, {
        plugin: C
      }), C.action(d, null), d.stopPropagation(), d.pageX !== 0 && d.pageY !== 0 && document.activeElement.blur();
    });
    let g = null;
    const y = () => {
      g && (clearTimeout(g), g = null);
    }, p = () => {
      y(), g = setTimeout(() => {
        n.leftSideContainerPresent && n.leftSideContainer.classList.add("hidden"), n.rightSideContainerPresent && n.rightSideContainer.classList.add("hidden"), g = null;
      }, 300);
    }, w = () => {
      y(), n.leftSideContainerPresent && n.leftSideContainer.classList.remove("hidden"), n.rightSideContainerPresent && n.rightSideContainer.classList.remove("hidden");
    };
    h.addEventListener("focus", w), h.addEventListener("mouseover", w), h.addEventListener("mouseout", p), h.addEventListener("blur", p), (((c = n.player.config.accessibility) == null ? void 0 : c.clickWithSpacebar) !== void 0 ? (f = n.player.config.accessibility) == null ? void 0 : f.clickWithSpacebar : !0) || (h.addEventListener("keyup", (d) => {
      d.keyCode == 32 && d.preventDefault();
    }), h.addEventListener("keydown", (d) => {
      d.keyCode == 32 && d.preventDefault();
    })), n.className !== "" && h.classList.add(n.className);
  } else {
    const h = L(`
			<div ${r}${o} class="non-interactive ${a}" title="${s}">
			</div>
		`, t);
    n._button = h, n._container = t, h._pluginData = n, t._pluginData = n, n.className !== "" && h.classList.add(n.className);
  }
}
const pt = () => {
  const n = document.createElement("span");
  return n.classList.add("side-container"), n.classList.add("hidden"), n;
};
class Ln {
  onIconChanged(e, t, i) {
  }
  onTitleChanged(e, t, i) {
  }
  onStateChanged(e, t, i, s, a) {
  }
}
var H, j, Le;
class nt extends tt {
  constructor() {
    super(...arguments);
    S(this, H, null);
    S(this, j, null);
    S(this, Le, []);
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
    if (t instanceof Ln)
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
    if (typeof t == "string" && (t = Rt(t)), this._icon = t, t && this._button instanceof HTMLElement) {
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
    return u(this, H) || (T(this, H, pt()), this.container.appendChild(u(this, H))), u(this, H);
  }
  get leftSideContainerPresent() {
    return u(this, H) !== null;
  }
  get rightSideContainer() {
    return u(this, j) || (T(this, j, pt()), this.container.appendChild(u(this, j))), u(this, j);
  }
  get rightSideContainerPresent() {
    return u(this, j) !== null;
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
    this._statusText = t, this._statusIcon = i, u(this, Le).forEach((l) => l(this)), this._statusIcon && (this.icon = this._statusIcon), this._statusText && (this.title = this._statusText), (o = (r = this._observer) == null ? void 0 : r.onStateChanged) == null || o.call(r, this, s, t, a, i);
  }
  onStateChange(t) {
    typeof t == "function" ? u(this, Le).push(t) : this.player.log.warn("Invalid callback for ButtonPlugin.onStateChange");
  }
  async action(t, i = null) {
    this.player.log.warn(`Action not implemented in button plugin ${this.name}`);
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
H = new WeakMap(), j = new WeakMap(), Le = new WeakMap();
const Pn = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 23 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <g id="play" transform="matrix(1.36051e-16,0.480277,-0.550439,1.55927e-16,74.9184,-144.269)">
        <path d="M325.373,94.327L350.358,136.107L300.387,136.107L325.373,94.327Z"/>
    </g>
</svg>
`, En = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 24 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <g id="pause" transform="matrix(1,0,0,0.956522,-48,-7.65217)">
        <path d="M64,8L72,8L72,31L64,31L64,8ZM48,8L56,8L56,31L48,31L48,8Z"/>
    </g>
</svg>
`, Sn = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
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
class Tn extends nt {
  getPluginModuleInstance() {
    return pe.Get();
  }
  get name() {
    return super.name || "es.upv.paella.playPauseButton";
  }
  async load() {
    const e = this.player.getCustomPluginIcon(this.name, "play") || Pn, t = this.player.getCustomPluginIcon(this.name, "pause") || En, i = this.player.getCustomPluginIcon(this.name, "replay") || Sn;
    this.icon = e, this.player.translate(this.config.ariaLabelPause || "pause");
    const s = this.player.translate(this.config.ariaLabelPlay || "play");
    A(this.player, m.PLAY, () => {
      this.icon = t, this.button.ariaLabel = s, this.button.title = this.config.ariaLabelPause || s;
    }), A(this.player, m.PAUSE, () => {
      this.icon = e, this.button.ariaLabel = s, this.button.title = this.config.ariaLabelPause || s;
    }), A(this.player, m.ENDED, () => {
      this.icon = i, this.button.ariaLabel = s, this.button.title = this.config.ariaLabelPause || s;
    }), A(this.player, m.STOP, () => {
      this.icon = e, this.button.ariaLabel = s, this.button.title = this.config.ariaLabelPause || s;
    });
  }
  async action() {
    await this.player.paused() ? await this.player.videoContainer.play() : await this.player.videoContainer.pause();
  }
}
const gt = "(?:\\d*:){1,2}\\d*(?:\\.\\d+)?", In = `(${gt})\\s*\\-\\->\\s*(${gt})`, Dn = {
  cueTiming: new RegExp(In)
}, kn = (n, e, t, i) => {
  const s = Dn.cueTiming.exec(e);
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
function mt(n) {
  const e = new $t();
  return n !== "" && (n = n.replace(/\r\n/gm, `
`), n = n.replace(/\r/gm, `
`), n.split(/\n/).forEach((t, i, s) => {
    kn(e, t, i, s);
  })), e;
}
class xn {
  constructor(e = "") {
    this._text = e, this._captions = mt(e);
  }
  get text() {
    return this._text;
  }
  set text(e) {
    this._text = e, this._captions = mt(e);
  }
  get captions() {
    return this._captions;
  }
}
class An extends Ot {
  getPluginModuleInstance() {
    return pe.Get();
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
          const r = Q(this.player, i.url), o = await fetch(r);
          if (o.ok) {
            const l = await o.text(), c = new xn(l);
            c.captions.label = i.text, c.captions.language = i.lang, e.push(c.captions), s();
          } else
            a();
        } else
          a();
      }));
    }), await Promise.allSettled(t), e;
  }
}
class Mn extends nt {
  getPluginModuleInstance() {
    return pe.Get();
  }
  get name() {
    return "es.upv.paella.currentTimeLabel";
  }
  async load() {
    this.title = ee(0);
    const e = async () => {
      const t = await this.player.videoContainer.currentTime();
      let i = ee(t);
      if (this.config.showTotalTime) {
        const s = await this.player.videoContainer.duration();
        i += ` / ${ee(s)}`;
      }
      this.title = i;
    };
    this.player.bindEvent(m.TIMEUPDATE, () => e()), this.player.bindEvent(m.TRIMMING_CHANGED, () => e()), this.player.bindEvent(m.SEEK, () => e());
  }
  get interactive() {
    return !1;
  }
  get dynamicWidth() {
    return !0;
  }
}
function Ue(n, e) {
  return li(n, "layout").filter((i) => i.config && i.config.enabled && i.canApply(e));
}
function ti(n, e) {
  const t = Ue(n, e), i = [];
  return t.forEach((s) => {
    i.push(...s.getValidContentIds(e));
  }), i;
}
function Rn(n, e) {
  const t = [];
  return li(n, "layout").filter((i) => {
    var s, a;
    if ((s = i.config) != null && s.enabled && ((a = i.config) != null && a.validContent))
      return i.config.validContent.every((r) => r.content.length === e);
  }).forEach((i) => i.config.validContent.forEach((s) => t.push(s.content))), t;
}
function ii(n, e, t) {
  const i = Ue(n, e);
  let s = null;
  return i.some((a) => {
    if (a.getValidContentIds(e).indexOf(t) !== -1)
      return s = a, !0;
  }), s;
}
function Vn(n, e) {
  const t = Ue(n, e), i = ti(n, e);
  let s = [];
  return t.forEach((a) => {
    s = [...s, ...a.config.validContent];
  }), s.filter((a) => i.indexOf(a.id) !== -1);
}
function ni(n, e, t, i = null) {
  const s = ii(n, e, t);
  if (s) {
    const a = s.getLayoutStructure(e, t, i);
    return a.plugin = s, a;
  }
  return null;
}
class ge extends tt {
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
function Nn(n) {
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
async function Un(n, e) {
  const t = [];
  return await F(
    n,
    "canvasButton",
    async (i) => {
      n.log.debug(` Canvas button plugin: ${i.name}`), t.push(i);
    }
  ), t.filter((i) => i.content.indexOf(e.content) !== -1).map((i) => Nn(i));
}
class sa extends tt {
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
        return E.LEFT;
      case "center":
        return E.CENTER;
      case "right":
        return E.RIGHT;
      default:
        throw new Error(`Invalid CanvasButtonPlugin side set: ${this.side}`);
    }
  }
  async action(e) {
    this.player.log.warn(`Action not implemented in canvas button plugin ${this.name}`);
  }
}
const qe = [];
async function Fn(n) {
  await F(n, "canvas", (e) => {
    qe.push(e);
  });
}
async function On(n) {
}
function $n(n, e) {
  if (qe.length === 0)
    throw Error("No canvas plugins loaded. Note that `loadCanvasPlugins()` must to be called before use `getCanvasPlugins()`");
  let t = null;
  return qe.some((i) => {
    if (i.isCompatible(e))
      return t = i, !0;
  }), t;
}
const E = Object.freeze({
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right"
}), Bn = function({
  icon: n,
  tabIndex: e,
  ariaLabel: t,
  title: i,
  className: s,
  position: a = E.CENTER,
  click: r,
  content: o,
  name: l
}) {
  if (!n)
    throw new Error("Error in video layout definition. getVideoCanvasButtons(): missing 'icon' attribute.");
  if (!r)
    throw new Error("Error in video layout definition. getVideoCanvasButtons(): missing 'click' function.");
  let c = `class="align-${a}${s ? " " + s : ""}"`;
  t && (c += ` aria-label="${t}"`), i && (c += ` title="${i}"`), e !== void 0 && (c += ` tabindex="${e}"`), l !== void 0 && (c += ` name="${l}"`);
  const f = L(`
        <button ${c}><i class="button-icon" style="pointer-events: none">${n}</i></button>
    `);
  return this.buttonsArea.appendChild(f), f.addEventListener("click", async (h) => (h.stopPropagation(), await r(o), !1)), f;
}, Qe = async (n, e, t, i, s) => {
  const a = e.plugin;
  let r = a.tabIndexStart;
  const o = await Un(n, i), l = [];
  return [
    ...o,
    ...a.getVideoCanvasButtons(e, i.content, i, t)
  ].forEach((f) => {
    f.tabIndex = r++, f.content = s;
    const h = Bn.apply(t, [f]);
    l.push(h);
  }), l;
}, Ye = (n, e, t) => {
  let { tabIndexStart: i } = e.plugin;
  t.sort((s, a) => {
    const r = s.getBoundingClientRect().left, o = a.getBoundingClientRect().left;
    return r - o;
  }).forEach((s) => {
    s.setAttribute("tabindex", i++);
  });
};
class si extends B {
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
class ai extends de {
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
let Ge = null;
class Y extends Ne {
  static Get() {
    return Ge || (Ge = new Y()), Ge;
  }
  get moduleName() {
    return "paella-core default video layouts";
  }
  get moduleVersion() {
    return Te.version;
  }
}
const st = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(0.920758,0,0,0.920758,2.50561,1.21236)">
        <path d="M11.937,17.699L11.937,21.044C11.937,21.656 11.573,22.209 11.012,22.451C10.45,22.693 9.798,22.578 9.354,22.158L1.874,15.1C1.568,14.811 1.394,14.408 1.394,13.986C1.394,13.564 1.568,13.161 1.874,12.872L9.354,5.814C9.798,5.394 10.45,5.279 11.012,5.521C11.573,5.763 11.937,6.316 11.937,6.928L11.937,10.272L22.937,10.272C23.783,10.272 24.469,10.958 24.469,11.804L24.469,16.168C24.469,17.014 23.783,17.699 22.937,17.699L11.937,17.699ZM26.063,23.11L26.063,19.765C26.063,19.153 26.427,18.6 26.988,18.358C27.55,18.116 28.201,18.231 28.646,18.651L36.126,25.709C36.432,25.999 36.606,26.402 36.606,26.823C36.606,27.245 36.432,27.648 36.126,27.937L28.646,34.996C28.201,35.415 27.55,35.53 26.988,35.288C26.427,35.046 26.063,34.493 26.063,33.882L26.063,30.537L15.063,30.537C14.217,30.537 13.531,29.851 13.531,29.005L13.531,24.641C13.531,23.795 14.217,23.11 15.063,23.11L26.063,23.11Z"/>
    </g>
</svg>
`, Re = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(-0.620305,0,0,0.839332,25.2077,0.462208)">
        <path d="M-20.625,8.591C-20.625,6.174 -17.975,4.215 -14.704,4.215L31.492,4.215C34.763,4.215 37.413,6.174 37.413,8.591L37.413,35.582C37.413,37.998 34.763,39.957 31.492,39.957L-14.704,39.957C-17.975,39.957 -20.625,37.998 -20.625,35.582L-20.625,8.591ZM1.285,12.825L8.1,7.789L-15.786,7.789L-15.786,25.442L-8.972,20.406L6.737,32.016L16.994,24.435L1.285,12.825Z" />
    </g>
</svg>
`, ve = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
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
`, Gn = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
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
class ft extends ge {
  getPluginModuleInstance() {
    return Y.Get();
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
    const a = this.player.getCustomPluginIcon(this.name, "iconMaximize") || Re, r = this.player.getCustomPluginIcon(this.name, "iconSideBySide") || Ie, o = this.player.getCustomPluginIcon(this.name, "iconSwitchSide") || st, l = this.player.getCustomPluginIcon(this.name, "iconClose") || ve, c = this.player.getCustomPluginIcon(this.name, "iconPiP") || Gn, f = () => this._currentContent.find((p) => p.id === t), h = () => f().size === 25, g = () => f().size > 50, y = [];
    return h() || g() ? y.push({
      icon: r,
      position: E.LEFT,
      title: this.player.translate("Dual stream 50%"),
      ariaLabel: this.player.translate("Dual stream 50%"),
      name: this.name + ":iconSideBySide",
      click: async () => {
        this._currentContent.forEach((p) => {
          p.size = 50;
        }), await this.player.videoContainer.updateLayout();
      }
    }) : y.push({
      icon: a,
      position: E.LEFT,
      title: this.player.translate("Maximize video"),
      ariaLabel: this.player.translate("Maximize video"),
      name: this.name + ":iconMaximize",
      click: async () => {
        this._currentContent.forEach((p) => {
          p.size = p.id === t ? 75 : 25;
        }), await this.player.videoContainer.updateLayout();
      }
    }), this.allowSwitchSide && y.push({
      icon: o,
      position: E.LEFT,
      title: this.player.translate("Switch side"),
      ariaLabel: this.player.translate("Switch side"),
      name: this.name + ":iconSwitchSide",
      click: async () => {
        const p = this._currentContent[0].id, w = this._currentContent[1].id, _ = this._currentContent[0].size, d = this._currentContent[1].size;
        this._currentContent[0].id = w, this._currentContent[0].size = d, this._currentContent[1].id = p, this._currentContent[1].size = _, await this.player.videoContainer.updateLayout();
      }
    }), y.push({
      icon: l,
      position: E.RIGHT,
      title: this.player.translate("Close video"),
      ariaLabel: this.player.translate("Close video"),
      name: this.name + ":iconClose",
      click: async () => {
        const w = this.player.videoContainer.validContentIds.filter((_) => _.indexOf("-") === -1).find((_) => _ != t);
        await this.player.videoContainer.setLayout(w);
      }
    }), this.pipContentIds.length > 0 && y.push({
      icon: c,
      position: E.LEFT,
      title: this.player.translate("Picture-in-picture"),
      ariaLabel: this.player.translate("Picture-in-picture"),
      name: this.name + ":iconPiP",
      click: async () => {
        const p = this.player.videoContainer.validContentIds.find((w) => this.pipContentIds.indexOf(w) !== -1);
        await this.player.videoContainer.setLayout(p, t);
      }
    }), y;
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
const ri = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
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
`, zn = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
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
let U = 0;
const at = [
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
function Hn(n) {
  return U = (U + 1) % at.length, rt(n);
}
function fe(n, e) {
  return U = e < at.length ? e : U, rt(n);
}
function rt(n) {
  let e = JSON.parse(JSON.stringify(at[U]));
  return e.videos[0].content = n[0], e.videos[1].content = n[1], e;
}
class jn extends ge {
  getPluginModuleInstance() {
    return Y.Get();
  }
  get name() {
    return super.name || "es.upv.paella.dualVideo";
  }
  get identifier() {
    return "dual-video";
  }
  async load() {
    let e = q("dualVideoLayoutIndex");
    e !== "" && (U = Number(e)), this.player.log.debug("Dual video layout loaded");
  }
  getValidStreams(e) {
    return super.getValidStreams(e).filter((t) => t.length === 2);
  }
  switchContent() {
    const e = this._currentContent[0], t = this._currentContent[1];
    this._currentContent[0] = t, this._currentContent[1] = e, this.player.videoContainer.updateLayout();
  }
  async switchMinimized() {
    Hn(this._currentContent), await this.player.videoContainer.updateLayout();
  }
  async minimizeVideo(e) {
    let t = !0;
    if (e === this._currentContent[0]) {
      const i = this._currentContent[0], s = this._currentContent[1];
      this._currentContent[0] = s, this._currentContent[1] = i, t = !1;
    }
    U === 1 && t ? fe(this._currentContent, 2) : fe(this._currentContent, 1), await this.player.videoContainer.updateLayout();
  }
  async maximizeVideo(e) {
    let t = !0;
    if (e === this._currentContent[1]) {
      const i = this._currentContent[0], s = this._currentContent[1];
      this._currentContent[0] = s, this._currentContent[1] = i, t = !1;
    }
    U === 1 && t ? fe(this._currentContent, 2) : fe(this._currentContent, 1), await this.player.videoContainer.updateLayout();
  }
  async setSideBySide() {
    fe(this._currentContent, 0), await this.player.videoContainer.updateLayout();
  }
  get minimizedContent() {
    return U === 0 ? "" : this._currentContent[1];
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
          icon: this.player.getCustomPluginIcon(this.name, "iconRotate") || ri,
          position: E.LEFT,
          title: this.player.translate("Swap position of the videos"),
          ariaLabel: this.player.translate("Swap position of the videos"),
          name: this.name + ":iconRotate",
          click: async () => {
            await this.switchContent();
          }
        },
        // Minimize
        {
          icon: this.player.getCustomPluginIcon(this.name, "iconMaximize") || Re,
          position: E.LEFT,
          title: this.player.translate("Maximize video"),
          ariaLabel: this.player.translate("Maximize video"),
          name: this.name + ":iconMaximize",
          click: async () => {
            await this.maximizeVideo(t);
          }
        },
        // Close
        {
          icon: this.player.getCustomPluginIcon(this.name, "iconClose") || ve,
          position: E.RIGHT,
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
        icon: this.player.getCustomPluginIcon(this.name, "iconMaximize") || Re,
        position: E.LEFT,
        title: this.player.translate("Maximize video"),
        ariaLabel: this.player.translate("Maximize video"),
        name: this.name + ":iconMaximize",
        click: async () => {
          await this.switchContent();
        }
      }), a.push({
        icon: this.player.getCustomPluginIcon(this.name, "iconSwitchSide") || st,
        position: E.LEFT,
        title: this.player.translate("Place the video on the other side of the screen"),
        ariaLabel: this.player.translate("Place the video on the other side of the screen"),
        name: this.name + ":iconSwitchSide",
        click: async () => {
          await this.minimizeVideo(t);
        }
      }), a.push({
        icon: this.player.getCustomPluginIcon(this.name, "iconClose") || ve,
        position: E.RIGHT,
        title: this.player.translate("Close video"),
        ariaLabel: this.player.translate("Close video"),
        name: this.name + ":iconClose",
        click: async () => {
          await this.closeVideo(t);
        }
      })) : (a.push({
        icon: this.player.getCustomPluginIcon(this.name, "iconMinimize") || zn,
        position: E.LEFT,
        title: this.player.translate("Minimize video"),
        ariaLabel: this.player.translate("Minimize video"),
        name: this.name + ":iconMinimize",
        click: async () => {
          await this.switchContent();
        }
      }), a.push({
        icon: this.player.getCustomPluginIcon(this.name, "iconSideBySide") || Ie,
        position: E.LEFT,
        title: this.player.translate("Put the videos side by side"),
        ariaLabel: this.player.translate("Put the videos side by side"),
        name: this.name + ":iconSideBySide",
        click: async () => {
          await this.setSideBySide();
        }
      }), a.push({
        icon: this.player.getCustomPluginIcon(this.name, "iconClose") || ve,
        position: E.RIGHT,
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
      const r = q("dualVideoLayoutContent0"), o = q("dualVideoLayoutContent1");
      r !== "" && o !== "" && this._currentContent.indexOf(r) !== -1 && this._currentContent.indexOf(o) !== -1 && (this._currentContent[0] = r, this._currentContent[1] = o);
    }
    const i = rt(this._currentContent), s = {
      id: i.id,
      player: this.player,
      name: { es: "Dos streams con posición dinámica" },
      hidden: !1,
      videos: i.videos,
      buttons: []
    };
    return te("dualVideoLayoutIndex", U), te("dualVideoLayoutContent0", this._currentContent[0]), te("dualVideoLayoutContent1", this._currentContent[1]), s;
  }
}
const yt = {
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
}, Wn = {
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
class qn extends ge {
  getPluginModuleInstance() {
    return Y.Get();
  }
  get name() {
    return super.name || "es.upv.paella.dualVideoPiP";
  }
  get identifier() {
    return "dual-video-pip";
  }
  async load() {
    this._currentLayout = yt, this.dualVideoContentIds = this.config.dualVideoContentIds || [];
  }
  getValidStreams(e) {
    return super.getValidStreams(e).filter((t) => t.length === 2);
  }
  getVideoCanvasButtons(e, t, i, s) {
    const a = this.player.getCustomPluginIcon(this.name, "iconClose") || ve, r = this.player.getCustomPluginIcon(this.name, "iconSwitchSide") || st, o = this.player.getCustomPluginIcon(this.name, "iconMaximize") || Re, l = this.player.getCustomPluginIcon(this.name, "iconSideBySide") || Ie, c = [
      {
        icon: a,
        position: E.RIGHT,
        title: this.player.translate("Close video"),
        ariaLabel: this.player.translate("Close video"),
        name: this.name + ":iconClose",
        click: async () => {
          const h = this.player.videoContainer.validContentIds.filter((g) => g.indexOf("-") === -1).find((g) => g !== t);
          await this.player.videoContainer.setLayout(h);
        }
      }
    ];
    return t === this._pipVideo ? (c.push({
      icon: r,
      position: E.LEFT,
      title: this.player.translate("Switch side"),
      ariaLabel: this.player.translate("Switch side"),
      name: this.name + ":iconSwitchSide",
      click: async () => {
        this.switchSide(), await this.player.videoContainer.updateLayout(this._fullVideo);
      }
    }), c.push({
      icon: o,
      position: E.LEFT,
      title: this.player.translate("Maximize video"),
      ariaLabel: this.player.translate("Maximize video"),
      name: this.name + ":iconMaximize",
      click: async () => {
        this.switchSources(), await this.player.videoContainer.updateLayout(this._fullVideo);
      }
    })) : this.dualVideoContentIds.length > 0 && c.push({
      icon: l,
      position: E.LEFT,
      title: this.player.translate("Set side by side"),
      ariaLabel: this.player.translate("Set side by side"),
      name: this.name + ":iconSideBySide",
      click: async () => {
        const f = this.player.videoContainer.validContentIds, h = this.dualVideoContentIds.find((g) => f.indexOf(g) !== -1);
        h && this.player.videoContainer.setLayout(h);
      }
    }), c;
  }
  switchSide() {
    this._currentLayout.id === "pip-left" ? this._currentLayout = Wn : this._currentLayout = yt;
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
class Qn extends ge {
  getPluginModuleInstance() {
    return Y.Get();
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
        position: E.LEFT,
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
class Yn extends ge {
  getPluginModuleInstance() {
    return Y.Get();
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
      position: E.LEFT,
      title: this.player.translate("Dual stream 50%"),
      ariaLabel: this.player.translate("Dual stream 50%"),
      name: this.name + ":iconSideBySide",
      click: async () => {
        const o = this.player.videoContainer.validContentIds, l = this.dualVideoContentIds.find((c) => o.indexOf(c) !== -1);
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
const Zn = {
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
function Kn(n) {
  let e = JSON.parse(JSON.stringify(Zn));
  return e.videos[0].content = n[0], e.videos[1].content = n[1], e.videos[2].content = n[2], e;
}
class Jn extends ge {
  getPluginModuleInstance() {
    return Y.Get();
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
    const i = Kn(this._currentContent);
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
          icon: ri,
          layer: 2,
          ariaLabel: "Swap the position of the videos",
          title: "Swap the position of the videos"
        }
      ]
    };
  }
}
class Xn extends si {
  constructor(e, t) {
    super("div", e, t), this.element.classList.add("image-canvas");
  }
  async loadCanvas(e) {
    e.element.style.width = "100%", e.element.style.height = "100%";
  }
}
class es extends ai {
  get name() {
    return super.name || "es.upv.paella.audioCanvas";
  }
  get canvasType() {
    return "audio";
  }
  getCanvasInstance(e) {
    return new Xn(this.player, e);
  }
}
class ts extends si {
  constructor(e, t) {
    super("div", e, t);
  }
  async loadCanvas(e) {
    e.element.style.width = "100%", e.element.style.height = "100%";
  }
}
class is extends ai {
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
    return new ts(this.player, e);
  }
}
class oi extends de {
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
class ns extends ue {
  constructor(e) {
    super(e), this._dataPlugins = {}, F(this.player, "data", async (t) => {
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
let ze = null;
class Fe extends Ne {
  static Get() {
    return ze || (ze = new Fe()), ze;
  }
  get moduleName() {
    return "paella-core default data plugins";
  }
  get moduleVersion() {
    return Te.version;
  }
}
class ss extends oi {
  getPluginModuleInstance() {
    return Fe.Get();
  }
  get name() {
    return super.name || "es.upv.paella.cookieDataPlugin";
  }
  serializeKey(e, t) {
    return typeof t == "object" && (t = JSON.stringify(t)), `${e}|${t}`;
  }
  async read(e, t) {
    const i = this.serializeKey(e, t);
    let s = q(i);
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
    te(s, i), this.player.log.debug(`CookieDataPlugin.write: ${s}`);
  }
  async remove(e, t) {
    const i = this.serializeKey(e, t);
    te(i, ""), this.player.log.debug(`CookieDataPlugin.remove: ${i}`);
  }
}
class as extends oi {
  getPluginModuleInstance() {
    return Fe.Get();
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
const rs = [
  {
    plugin: tn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: nn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: ln,
    config: {
      enabled: !1
    }
  },
  {
    plugin: un,
    config: {
      enabled: !1
    }
  },
  {
    plugin: pn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: Tn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: An,
    config: {
      enabled: !1
    }
  },
  {
    plugin: Mn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: ft,
    config: {
      enabled: !1
    }
  },
  {
    plugin: jn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: qn,
    config: {
      enabled: !1
    }
  },
  {
    plugin: Qn,
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
    plugin: ft,
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
    plugin: es,
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
      enabled: !1,
      context: ["default"]
    }
  },
  {
    plugin: as,
    config: {
      enable: !0,
      context: ["default"]
    }
  }
];
class os extends nt {
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
const ls = (n) => n ? `<span class="menu-title">${n}</span>` : "", cs = (n) => n ? `<i class="menu-icon">${n}</i>` : "", us = (n) => n ? `aria-label="${n}"` : "", ds = (n) => n ? `<span class="state-text">${n}</span>` : "", hs = (n) => n ? `<i class="state-icon">${n}</i>` : "", ps = (n, e) => n || e ? `<span class="button-state">${ds(n)}${hs(e)}</span>` : "";
function gs(n, e, t, i, s, a, r) {
  const { id: o = 0, title: l = null, icon: c = null, showTitle: f = !0, stateText: h = null, stateIcon: g = null } = n, y = this, p = document.createElement("li"), w = a[o] ?? !1, _ = L(`
		<button class="menu-button-item${w ? " selected" : ""}" ${us(l)} data-id="${o}"" id="${y.name}_menuItem_${o}">
			${cs(c)}
			${f ? ls(l) : ""}
			${h || g ? ps(h, g) : ""}
		</button>
	`);
  return r && (r._button = _), _.addEventListener("keydown", (d) => {
    var D;
    const C = () => {
      d.stopPropagation(), d.preventDefault();
    };
    if (d.key === "ArrowUp") {
      const b = _.dataPrev;
      b == null || b.focus(), C();
    } else if (d.key === "ArrowDown") {
      const b = _.dataNext;
      b == null || b.focus(), C();
    } else if (d.key === "Tab") {
      const b = d.shiftKey ? d.target.dataPrev : d.target.dataNext;
      b == null || b.focus(), C();
    } else d.key === "Escape" && (this.player.playbackBar.popUp.pop() ? (D = y.button) == null || D.focus() : this.focus(), C());
  }), _.addEventListener("click", async (d) => {
    var C;
    if (e === "check") {
      const D = i.find((b) => b.id === o);
      a[o] = !a[o], y.itemSelected(D, i);
    } else if (e === "radio") {
      a[o] = !0;
      let D = null;
      i.forEach((b) => {
        b.id === o ? D = b : a[b.id] = !1;
      }), y.itemSelected(D, i);
    } else {
      const D = i.find((b) => b.id === o);
      y.itemSelected(D, i);
    }
    await y.checkRefreshContent(), d.stopPropagation(), y.closeOnSelect && (y.closeMenu(), (C = y.button) == null || C.focus());
  }), p.appendChild(_), t.appendChild(p), p;
}
class ms extends os {
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
    const s = self.crypto.randomUUID(), a = i.map((l) => gs.apply(this, [l, typeof this.buttonType == "function" ? this.buttonType() : this.buttonType, t, i, s, this._selectedItems, l.plugin]));
    return a.forEach((l, c, f) => {
      const h = l.querySelector("button");
      let g = f[c + 1], y = f[c - 1];
      c === f.length - 1 && (g = f[0]), c === 0 && (y = f[f.length - 1]), h.dataNext = g == null ? void 0 : g.querySelector("button"), h.dataPrev = y == null ? void 0 : y.querySelector("button");
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
class fs extends ms {
  get closeOnSelect() {
    return this.config.closeOnSelect ?? !1;
  }
  async load() {
    this._iconPath && (this.icon = await Lt(this._iconPath));
  }
  async getContent() {
    return this._buttonPlugins || (this._buttonPlugins = [], await F(this.player, "button", async (e) => {
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
const ot = (n, e, t, i = {}) => {
  const s = new n(e, t);
  return t = s.name || t, t ? (e.config.plugins && e.config.plugins[t] && we(i, e.config.plugins[t], !1), s._config = i, s) : (e.log.warn(`The instance of the ${n.name} plugin cannot be created because it is being loaded explicitly and does not have the name property implemented.`), null);
};
function lt(n, e, t, i, s = !1) {
  const a = t.type;
  let r = -1;
  if (n.__pluginData__.pluginInstances[a] && n.__pluginData__.pluginInstances[a].find((l, c) => {
    if (l.name === t.name)
      return r = c, !0;
  }) && !s) {
    n.log.info(`Plugin ${t.name} of type ${a} already registered.`);
    return;
  }
  n.__pluginData__.pluginClasses[e] = i, n.__pluginData__.pluginInstances[a] = n.__pluginData__.pluginInstances[a] || [], r !== -1 && n.__pluginData__.pluginInstances[a].splice(r, 1), n.__pluginData__.pluginInstances[a].push(t), n.__pluginModules = n.__pluginModules || [];
  const o = t.getPluginModuleInstance();
  if (o && (o._player = o._player || n, !n.__pluginModules.find((l) => l.constructor.name === o.constructor.name))) {
    const l = o.moduleName, c = o.moduleVersion;
    n.log.debug(`Plugin module imported: ${l}: v${c}`), n.__pluginModules.push(o);
  }
}
function ys(n, e) {
  let t = null, i = { enabled: !0 };
  if (typeof e == "function" ? t = e : typeof e == "object" && typeof e.plugin == "function" && (t = e.plugin, i = e.config), !t)
    n.log.warn("Error importing plugin with explicit import API. Check the 'plugins' array at init params");
  else {
    const s = ot(t, n, null, i);
    if (!s)
      n.log.warn(`Unable to create an instance of the plugin ${t.name}`);
    else {
      const a = s.constructor.name;
      lt(n, a, s, t, !0);
    }
  }
}
function aa(n, e) {
  const t = n.config;
  e.keys().forEach((i) => {
    const s = e(i), a = i.substring(2, i.length - 3);
    if (t.plugins[a]) {
      const r = s.default, o = ot(r, n, a, {});
      lt(n, i, o, r, !1);
    } else if (/^[a-z0-9]+$/i.test(a)) {
      n.__pluginModules = n.__pluginModules || [];
      const r = s.default, o = new r(n);
      if (!n.__pluginModules.find((l) => l.constructor.name === o.constructor.name)) {
        const l = o.moduleName, c = o.moduleVersion;
        n.log.debug(`Plugin module imported: ${l}: v${c}`), n.__pluginModules.push(o);
      }
    }
  });
}
function _s(n) {
  const e = n.config;
  if (n.__pluginData__ = n.__pluginData__ || {
    pluginClasses: [],
    pluginInstances: {}
  }, n.__pluginData__.pluginClasses.length !== 0) return;
  [
    ...rs,
    ...n.initParams.plugins
  ].forEach((i) => {
    ys(n, i);
  });
  const { buttonGroups: t } = e;
  t && t.forEach((i, s) => {
    const a = `button_group_${s}`, r = ot(fs, n, a, i);
    r._iconPath = $([n.configResourcesUrl, i.icon]), lt(n, r.type, r, `ButtonGroupPlugin${s}`, !1);
  }), n.log.debug("Plugins have been registered:");
}
function vs(n) {
  delete n.__pluginData__;
}
function li(n, e) {
  var t;
  return ((t = n.__pluginData__) == null ? void 0 : t.pluginInstances[e]) || [];
}
async function F(n, e, t = null, i = null) {
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
            const c = o[l];
            n.addDictionary(l, c);
          }
      }
      typeof t == "function" && await t(a), await a.load();
    }
  }
}
async function ci(n, e) {
  var t;
  (t = n.__pluginData__.pluginInstances[e]) == null || t.forEach(async (i) => {
    await i.unload();
  });
}
function ws(n) {
  var t;
  const e = (i, s) => {
    if (!i)
      throw new Error(`Invalid video manifest: ${s}`);
  };
  e(n.streams, "missing 'streams' object."), e(n.streams.length > 0, "the 'streams' array is empty."), e((t = n.metadata) == null ? void 0 : t.preview, "the 'metadata.preview' field is required.");
}
class Cs extends ue {
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
    }), this.player.log.debug("Finding compatible video plugins"), await Fn(this.player);
    for (const i of this._streamData) {
      const s = $n(this.player, i);
      if (!s)
        throw Error(`Canvas plugin not found: ${i.canvas}`);
      const a = i.content === t, r = await Mi(this.player, i);
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
        this.executeAction("pause"), this.executeAction("setCurrentTime", 0), ne(this.player, m.ENDED);
      }), this._players.push(s.player);
    }
    if (this.mainAudioPlayer === null)
      throw this.player.log.error("The video stream containing the audio track could not be identified. The `role` attribute must be specified in the main video stream, or the `defaultAudioStream` attribute must be set correctly in the player configuration."), new Error("The video stream containing the audio track could not be identified.");
  }
  async unload() {
    this.stopStreamSync(), await On(this.player);
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
    ne(this.player, m.TIMEUPDATE, { currentTime: e ? t + s : s });
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
          await this.executeAction("pause"), await this.setCurrentTime(0), this.stopStreamSync(), t = 0, ne(this.player, m.ENDED, {});
          return;
        } else t < this.trimStart && (await this.setCurrentTime(0), t = this.trimStart, s = 0);
        ne(this.player, m.TIMEUPDATE, { currentTime: s }), this._timeupdateTimer = setTimeout(() => {
          this._timeSync && e();
        }, 250);
      } else this._timeSync && (ne(this.player, m.TIMEUPDATE, { currentTime: t }), this._timeupdateTimer = setTimeout(() => {
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
    return ne(this.player, m.TIMEUPDATE, { currentTime: a }), s;
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
        const l = this.streams[o], c = await l.player.getQualities() || [];
        if (this.player.log.debug(c), c.length > 1) {
          const f = Math.round(c.length * r), h = c[f];
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
const V = Object.freeze({
  TOP_LEFT: "topLeft",
  TOP_MIDDLE: "topMiddle",
  TOP_RIGHT: "topRight",
  CENTER_LEFT: "centerLeft",
  CENTER_MIDDLE: "centerMiddle",
  CENTER_RIGHT: "centerRight",
  BOTTOM_LEFT: "bottomLeft",
  BOTTOM_MIDDLE: "bottomMiddle",
  BOTTOM_RIGHT: "bottomRight"
}), O = (n, e, t, i, s) => {
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
class bs extends B {
  constructor(e, t) {
    const i = { class: "video-container-message" };
    super(e, { attributes: i, parent: t }), this._topLeftContainer = L('<div class="container top-left"></div>', this.element), this._topMiddleContainer = L('<div class="container top-middle"></div>', this.element), this._topRightContainer = L('<div class="container top-right"></div>', this.element), this._centerLeftContainer = L('<div class="container center-left"></div>', this.element), this._centerMiddleContainer = L('<div class="container center-middle"></div>', this.element), this._centerRightContainer = L('<div class="container center-right"></div>', this.element), this._bottomLeftContainer = L('<div class="container bottom-left"></div>', this.element), this._bottomMiddleContainer = L('<div class="container bottom-middle"></div>', this.element), this._bottomRightContainer = L('<div class="container bottom-right"></div>', this.element);
  }
  show({ icon: e = null, text: t = "", timeout: i = 1e3, position: s = V.CENTER_MIDDLE, cssClass: a = "" }) {
    switch (s) {
      case V.TOP_LEFT:
        O.apply(this, [e, t, i, a, this._topLeftContainer]);
        break;
      case V.TOP_MIDDLE:
        O.apply(this, [e, t, i, a, this._topMiddleContainer]);
        break;
      case V.TOP_RIGHT:
        O.apply(this, [e, t, i, a, this._topRightContainer]);
        break;
      case V.CENTER_LEFT:
        O.apply(this, [e, t, i, a, this._centerLeftContainer]);
        break;
      case V.CENTER_MIDDLE:
        O.apply(this, [e, t, i, a, this._centerMiddleContainer]);
        break;
      case V.CENTER_RIGHT:
        O.apply(this, [e, t, i, a, this._centerRightContainer]);
        break;
      case V.BOTTOM_LEFT:
        O.apply(this, [e, t, i, a, this._bottomLeftContainer]);
        break;
      case V.BOTTOM_MIDDLE:
        O.apply(this, [e, t, i, a, this._bottomMiddleContainer]);
        break;
      case V.BOTTOM_RIGHT:
        O.apply(this, [e, t, i, a, this._bottomRightContainer]);
        break;
    }
  }
}
const v = Object.freeze({
  UNLOADED: 0,
  LOADING_MANIFEST: 1,
  MANIFEST: 2,
  LOADING_PLAYER: 3,
  LOADED: 4,
  UNLOADING_MANIFEST: 5,
  UNLOADING_PLAYER: 6,
  ERROR: 7
});
function Ls(n, e) {
  return Array.isArray[e] || (e = [e]), Ai(n, e).getManifestData(e);
}
async function Ps(n) {
  return { w: 1280, h: 720 };
}
async function ui(n) {
  var e;
  for (const t in this.streamProvider.streams) {
    const i = ((e = n == null ? void 0 : n.videos) == null ? void 0 : e.find((a) => a.content === t)) != null, s = this.streamProvider.streams[t];
    i && !s.player.isEnabled ? await s.player.enable() : !i && s.player.isEnabled && await s.player.disable();
  }
}
function di() {
  for (const n in this.streamProvider.streams) {
    const e = this.streamProvider.streams[n];
    e.canvas.element.style.display = "none", this._hiddenVideos.appendChild(e.canvas.element);
  }
}
async function Es() {
  var a, r;
  const n = ni(this.player, this.streamProvider.streamData, this._layoutId, this._mainLayoutContent);
  await ui.apply(this, [n]), di.apply(this);
  const e = await Ps(this.player), t = 100 / e.w, i = 100 / e.h;
  if (this.baseVideoRect.classList.remove("dynamic"), this.baseVideoRect.classList.add("static"), (a = n == null ? void 0 : n.videos) != null && a.length) {
    const o = [];
    for (const l of n.videos) {
      const c = this.streamProvider.streams[l.content], { stream: f, player: h, canvas: g } = c, y = await h.getDimensions(), p = y.w / y.h;
      let w = Number.MAX_VALUE, _ = null;
      g.buttonsArea.innerHTML = "", o.push(await Qe(this.player, n, g, l, l.content)), l.rect.forEach((d) => {
        const C = /^(\d+.?\d*)\/(\d+.?\d*)$/.exec(d.aspectRatio), D = C ? Number(C[1]) / Number(C[2]) : 1, b = Math.abs(p - D);
        b < w && (_ = d, w = b);
      }), g.element.style.display = "block", g.element.style.position = "absolute", g.element.style.left = `${(_ == null ? void 0 : _.left) * t}%`, g.element.style.top = `${(_ == null ? void 0 : _.top) * i}%`, g.element.style.width = `${(_ == null ? void 0 : _.width) * t}%`, g.element.style.height = `${(_ == null ? void 0 : _.height) * i}%`, g.element.style.zIndex = l.layer, this.baseVideoRect.appendChild(g.element);
    }
    setTimeout(() => {
      Ye(this.player, n, o.flat());
    }, 100);
  }
  const s = this.baseVideoRect.getElementsByClassName("video-layout-button");
  return Array.from(s).forEach((o) => this.baseVideoRect.removeChild(o)), (r = n == null ? void 0 : n.buttons) == null || r.forEach((o) => {
    const l = Vt({
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
    l.layout = n, l.buttonAction = o.onClick, l.addEventListener("click", async (c) => {
      P(this.player, m.BUTTON_PRESS, {
        plugin: n.plugin,
        layoutStructure: n
      }), await c.target.buttonAction.apply(c.target.layout), c.stopPropagation();
    }), this._layoutButtons.push(l);
  }), !0;
}
async function Ss() {
  var r, o, l, c, f, h;
  const n = ni(this.player, this.streamProvider.streamData, this._layoutId, this._mainLayoutContent);
  await ui.apply(this, [n]), di.apply(this), this.baseVideoRect.classList.add("dynamic"), this.baseVideoRect.classList.remove("static"), this.baseVideoRect.innerHTML = "";
  const e = this.element.clientWidth, t = this.element.clientHeight, i = e > t;
  if (this.baseVideoRect.classList.remove("align-center"), this.baseVideoRect.classList.remove("align-top"), this.baseVideoRect.classList.remove("align-bottom"), this.baseVideoRect.classList.remove("align-left"), this.baseVideoRect.classList.remove("align-right"), i) {
    const g = ((o = (r = this.player.config.videoContainer) == null ? void 0 : r.dynamicLayout) == null ? void 0 : o.landscapeVerticalAlignment) || "align-center";
    this.baseVideoRect.classList.remove("portrait"), this.baseVideoRect.classList.add("landscape"), this.baseVideoRect.classList.add(g);
  } else {
    const g = ((c = (l = this.player.config.videoContainer) == null ? void 0 : l.dynamicLayout) == null ? void 0 : c.portraitHorizontalAlignment) || "align-center";
    this.baseVideoRect.classList.add("portrait"), this.baseVideoRect.classList.remove("landscape"), this.baseVideoRect.classList.add(g);
  }
  const s = this.baseVideoRect.clientWidth, a = this.element.clientHeight;
  if (((f = n == null ? void 0 : n.videos) == null ? void 0 : f.length) === 1) {
    const g = [], y = [], p = n.videos[0], w = this.streamProvider.streams[p.content], { player: _, canvas: d } = w;
    d.buttonsArea.innerHTML = "", y.push(await Qe(this.player, n, d, p, p.content)), d.element.style = {}, d.element.style.display = "block", d.element.style.width = "100%", d.element.style.height = "100%", d.element.style.overflow = "hidden", d.element.style.position = "relative", g.push(d.element), d.element.sortIndex = 0, g.forEach((C) => this.baseVideoRect.appendChild(C)), setTimeout(() => {
      Ye(this.player, n, y.flat());
    }, 100);
  } else if ((h = n == null ? void 0 : n.videos) != null && h.length) {
    let g = 0;
    const y = [], p = [];
    for (const w of n.videos) {
      const _ = this.streamProvider.streams[w.content], { player: d, canvas: C } = _, D = await d.getDimensions(), b = D.w / D.h, me = s, G = a, ie = (i ? me : G) * w.size / 100;
      let z = Math.round(i ? ie : ie * b), Z = Math.round(i ? ie / b : ie);
      z > me && (z = me, Z = Math.round(z / b)), Z > G && (Z = G, z = Math.round(Z * b)), C.buttonsArea.innerHTML = "", p.push(await Qe(this.player, n, C, w, w.content)), C.element.style = {}, C.element.style.display = "block", C.element.style.width = `${z}px`, C.element.style.height = `${Z}px`, C.element.style.overflow = "hidden", C.element.style.position = "relative", C.element.sortIndex = g++, y.push(C.element);
    }
    if (i) {
      const w = L('<div class="landscape-container"></div>', this.baseVideoRect);
      y.forEach((_) => w.appendChild(_));
    } else
      y.forEach((w) => this.baseVideoRect.appendChild(w));
    setTimeout(() => {
      Ye(this.player, n, p.flat());
    }, 100);
  }
  return !0;
}
class Ts extends B {
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
    }), this._ready = !1, this._players = [], this._streamProvider = new Cs(this.player, this.baseVideoRect);
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
      this._layoutId = e, this._mainLayoutContent = t, await this.updateLayout(), r !== e && P(this.player, m.LAYOUT_CHANGED, { prevLayout: r, layoutId: e });
    }
  }
  get validContentIds() {
    return this._validContentIds;
  }
  get validContentSettings() {
    return this._validContentSettings;
  }
  get validLayouts() {
    return Ue(this.player, this.streamData);
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
    this._baseVideoRect.style.display = "none", await F(this.player, "layout"), await ki(this.player);
  }
  async load(e) {
    var o, l, c, f, h, g, y, p, w, _;
    if (this._streamData = e, (l = (o = this.player.config.videoContainer) == null ? void 0 : o.restoreVideoLayout) != null && l.enabled) {
      const d = (f = (c = this.player.config.videoContainer) == null ? void 0 : c.restoreVideoLayout) == null ? void 0 : f.global;
      this._layoutId = await this.player.preferences.get("videoLayout", { global: d }) || this.player.config.defaultLayout, this._mainLayoutContent = await this.player.preferences.get("videoLayoutMainContent", { global: d }) || null;
    } else
      this._layoutId = this.player.config.defaultLayout, this._mainLayoutContent = null;
    await this.streamProvider.load(e), this._validContentIds = ti(this.player, e), this._validContentSettings = Vn(this.player, e), await this.updateLayout(null, !0);
    const t = L(
      '<div class="button-plugins left-side"></div>',
      this.element
    ), i = L(
      '<div class="button-plugins right-side"></div>',
      this.element
    );
    this._buttonPlugins = [t, i], this.player.log.debug("Loading videoContainer button plugins"), await F(this.player, "button", async (d) => {
      this.player.log.debug(` Button plugin: ${d.name}`), d.side === "left" ? await Me(d, t) : d.side === "right" && await Me(d, i);
    }, async (d) => d.parentContainer === "videoContainer" ? await d.isEnabled() : !1), this._baseVideoRect.style.display = "";
    const s = await this.player.preferences.get("volume", { global: !0 }), a = await this.player.preferences.get("playbackRate", { global: !0 }), r = await this.player.preferences.get("lastKnownTime", { global: !1 });
    if ((h = this.player.config.videoContainer) != null && h.restoreVolume && s !== null && s !== void 0 && await this.streamProvider.setVolume(s), (g = this.player.config.videoContainer) != null && g.restorePlaybackRate && a !== null && a !== void 0 && await this.streamProvider.setPlaybackRate(a), this.player.videoManifest.trimming && await this.player.videoContainer.setTrimming(this.player.videoManifest.trimming), (p = (y = this.player.config.videoContainer) == null ? void 0 : y.restoreLastTime) != null && p.enabled && !this.streamProvider.isLiveStream) {
      const d = async () => {
        if (!await this.paused()) {
          const D = await this.currentTime();
          await this.player.preferences.set("lastKnownTime", D, { global: !1 });
        }
        setTimeout(d, 1e3);
      };
      if (r) {
        const C = await this.player.preferences.get("lastKnownTime", { global: !1 }), D = await this.duration(), b = (_ = (w = this.player.config.videoContainer) == null ? void 0 : w.restoreLastTime) == null ? void 0 : _.remainingSeconds;
        D - C > b && await this.setCurrentTime(C);
      }
      d();
    }
    this._messageContainer = new bs(this.player, this.element), this._ready = !0;
  }
  async unload() {
    this.removeFromParent(), await ci(this.player, "layout"), await xi(this.player), await this.streamProvider.unload();
  }
  // Return true if the layout this.layoutId is compatible with the current stream data.
  async updateLayout(e = null) {
    const t = arguments[1];
    if (e && (this._mainLayoutContent = e), !t && this.player.state !== v.LOADED)
      return;
    if (this._updateInProgress)
      return this.player.log.warn("Recursive update layout detected"), !1;
    this._updateInProgress = !0;
    let i = !0;
    this._layoutButtons = [], (!this._layoutId || this._validContentIds.indexOf(this._layoutId) === -1) && (this._layoutId = this.player.config.defaultLayout, this._mainLayoutContent = null, this._validContentIds.indexOf(this._layoutId) === -1 && (this._layoutId = this._validContentIds[0]), i = !1);
    const s = ii(this.player, this.streamProvider.streamData, this._layoutId);
    return s.layoutType === "static" ? i = Es.apply(this) : s.layoutType === "dynamic" && (i = Ss.apply(this)), this._updateInProgress = !1, i;
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
    return P(this.player, m.PLAY), e;
  }
  async pause() {
    const e = await this.streamProvider.pause();
    return P(this.player, m.PAUSE), e;
  }
  async stop() {
    this.streamProvider.stop(), P(this.player, m.STOP);
  }
  async paused() {
    return this.streamProvider.paused();
  }
  async setCurrentTime(e) {
    const t = await this.streamProvider.setCurrentTime(e);
    return P(this.player, m.SEEK, { prevTime: t.prevTime, newTime: t.newTime }), t.result;
  }
  async currentTime() {
    return this.streamProvider.currentTime();
  }
  async volume() {
    return this.streamProvider.volume();
  }
  async setVolume(e) {
    const t = await this.streamProvider.setVolume(e);
    return P(this.player, m.VOLUME_CHANGED, { volume: e }), await this.player.preferences.set("volume", e, { global: !0 }), t;
  }
  async duration() {
    return await this.streamProvider.duration();
  }
  async playbackRate() {
    return await this.streamProvider.playbackRate();
  }
  async setPlaybackRate(e) {
    const t = await this.streamProvider.setPlaybackRate(e);
    return P(this.player, m.PLAYBACK_RATE_CHANGED, { newPlaybackRate: e }), await this.player.preferences.set("playbackRate", e, { global: !0 }), t;
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
    return P(this.player, m.TRIMMING_CHANGED, {
      enabled: e,
      start: t,
      end: i
    }), s;
  }
  getVideoRect(e = null) {
    var i;
    let t = this.baseVideoRect;
    return typeof e == "string" && (t = (i = this.streamProvider.streams[e]) == null ? void 0 : i.canvas.element), {
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
const Is = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
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
`, Ds = `
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
`, He = `
    width: 100%;
`, ks = `
    position: absolute; 
    top: 0px; 
    left: 0px; 
    right: 0px; 
    bottom: 0px; 
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
`, xs = `
    pointer-events: none;
    width: 20%;
    max-width: 400px;
    min-width: 100px;
    opacity: 0.6;
`, As = `
    display: block;
    width: 20%;
    background: none;
    border: none;
    cursor: pointer;
`;
class Ms extends B {
  constructor(e, t, i, s) {
    const a = {
      class: "preview-container",
      style: Ds,
      role: "button",
      "aria-label": "Play video"
    };
    super(e, { attributes: a, parent: t }), this._img = L(`
        <div style="${He}">
            ${i ? `<img style="${He}" src="${i}" class="preview-image-landscape" alt=""/>` : ""}
            ${s ? `<img style="${He}" src="${s}" class="preview-image-portrait" alt=""/>` : ""}
            <div style="${ks}">
                <button style="${As}" role="button" aria-label="Play video">
                    <i class="preview-play-icon" style="${xs}">${Is}</i>
                </button>
            </div>
        </div>
        `, this.element), this.element.setAttribute("id", "playerContainerClickArea"), this.element.addEventListener("click", (l) => {
      e.play();
    });
    const r = i && s, o = () => {
      if (r) {
        const l = this.element.clientWidth / this.element.clientHeight, c = Array.from(this.element.getElementsByClassName("preview-image-landscape")), f = Array.from(this.element.getElementsByClassName("preview-image-portrait"));
        l >= 1 ? (c.forEach((h) => h.style.display = ""), f.forEach((h) => h.style.display = "none")) : (c.forEach((h) => h.style.display = "none"), f.forEach((h) => h.style.display = ""));
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
const Rs = (n) => {
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
let Vs = 0;
function Ns() {
  return ++Vs;
}
var J, I, x, Pe;
class Us {
  constructor(e) {
    S(this, J, null);
    S(this, I, null);
    S(this, x, []);
    S(this, Pe, "");
    T(this, J, e), T(this, I, document.createElement("div")), u(this, I).className = "pop-up-wrapper", e.element.prepend(u(this, I)), u(this, I).classList.add("hidden"), u(this, I).addEventListener("click", (t) => t.stopPropagation()), u(this, J).element.addEventListener("click", (t) => {
      t.stopPropagation(), this.hide();
    });
  }
  get title() {
    return u(this, Pe);
  }
  set title(e) {
    T(this, Pe, e);
  }
  get currentContent() {
    return u(this, x).length && u(this, x)[u(this, x).length - 1];
  }
  get currentContentId() {
    var e;
    return ((e = this.currentContent) == null ? void 0 : e.dataContentId) ?? -1;
  }
  show({ content: e, title: t = "", parent: i = null, attachLeft: s = !1, attachRight: a = !1 }) {
    if (!e)
      throw new Error("PlaybackBarPopUp.show(): No content provided.");
    e.setAttribute("data-pop-up-content-id", Ns()), e.dataContentId = e.getAttribute("data-pop-up-content-id");
    const r = u(this, x).length && u(this, x)[u(this, x).length - 1], o = i && i.getAttribute("data-pop-up-content-id");
    r && r.getAttribute("data-pop-up-content-id") !== o ? (u(this, I).innerHTML = "", T(this, x, [])) : r && r.container.classList.add("out"), u(this, x).push(e), u(this, J).element.classList.add("pop-up-active"), u(this, I).classList.remove("hidden");
    const l = Rs(u(this, I));
    return l.setTitle(t), e.container = l, s === !0 ? u(this, I).classList.add("left") : u(this, I).classList.remove("left"), a === !0 ? u(this, I).classList.add("right") : u(this, I).classList.remove("right"), l.setContent(e), u(this, x).length > 1 ? l.onPopClicked(() => {
      u(this, x).pop(), u(this, x)[u(this, x).length - 1].container.classList.remove("out"), u(this, I).removeChild(l);
    }) : l.hidePopButton(), this.title = t, e.dataContentId;
  }
  pop() {
    if (u(this, I).querySelectorAll(".pop-up").length === 1)
      return this.hide(), !1;
    const e = new Event("click");
    return u(this, I).querySelector(".pop-up:not(.out) .action-back").dispatchEvent(e), !0;
  }
  hide() {
    u(this, J).element.classList.remove("pop-up-active"), u(this, I).classList.add("hidden");
  }
  get isHidden() {
    return u(this, I).classList.contains("hidden");
  }
}
J = new WeakMap(), I = new WeakMap(), x = new WeakMap(), Pe = new WeakMap();
var Ee, ae, re, W, oe, Se, le, M, X, ce;
class Fs extends B {
  constructor(t, i) {
    var f;
    const s = ((f = t.config.progressIndicator) == null ? void 0 : f.inlineMode) ?? !1;
    super(t, { attributes: { class: "playback-bar-container" }, parent: i });
    S(this, Ee, null);
    S(this, ae, null);
    S(this, re, null);
    S(this, W, null);
    S(this, oe, null);
    S(this, Se, null);
    S(this, le, null);
    S(this, M, null);
    S(this, X, !0);
    S(this, ce, []);
    T(this, Ee, new Us(this)), this.element.addEventListener("mouseenter", () => It(t)), this.element.addEventListener("mouseleave", () => Dt(t)), T(this, ae, L('<section class="playback-bar"></section>', this.element)), T(this, re, L("<div></div>")), T(this, W, L("<nav></nav>")), T(this, oe, L("<ul></ul>", u(this, W))), T(this, Se, L("<div></div>", u(this, W))), T(this, le, L("<ul></ul>", u(this, W)));
    const r = t._initParams.getProgressIndicator, o = 1e3, l = 0, c = 100;
    s ? T(this, M, r({ container: u(this, Se), player: t, duration: o, currentTime: l, precision: c })) : (u(this, ae).appendChild(u(this, re)), T(this, M, r({ container: u(this, re), player: t, duration: o, currentTime: l, precision: c }))), u(this, M).onChange(async (h) => {
      await t.videoContainer.setCurrentTime(h);
    }), u(this, ae).appendChild(u(this, W));
  }
  get popUp() {
    return u(this, Ee);
  }
  get enabled() {
    return u(this, X);
  }
  set enabled(t) {
    T(this, X, t), u(this, X) ? this.showUserInterface() : this.hide();
  }
  async load() {
    T(this, ce, []), this.player.log.debug("Loading button plugins"), await F(this.player, "button", async (i) => {
      this.player.log.debug(` Button plugin: ${i.name}`), u(this, ce).push(i), i.side === "left" ? await Me(i, this.buttonPluginsLeft) : i.side === "right" && await Me(i, this.buttonPluginsRight);
    }, async (i) => i.parentContainer === "playbackBar" ? await i.isEnabled() : !1);
    const t = await this.player.videoContainer.duration();
    u(this, M).setDuration(t), this.player.frameList.frames.forEach((i, s, a) => {
      const r = a[s + 1], o = r ? r.time - i.time : t - i.time;
      u(this, M).addMarker({ time: i.time, duration: t, frameDuration: o });
    }), this.player.bindEvent([this.player.Events.TIMEUPDATE, this.player.Events.SEEK], (i) => {
      u(this, M).setCurrentTime(i.newTime ?? i.currentTime);
    }), this.player.bindEvent(this.player.Events.TRIMMING_CHANGED, async (i) => {
      const s = i.end - i.start;
      u(this, M).setDuration(s);
      const a = await this.player.videoContainer.currentTime();
      u(this, M).setCurrentTime(a);
    }), this.onResize();
  }
  async unload() {
    this.removeFromParent(), await ci(this.player, "button"), u(this, oe).innerHTML = "", u(this, le).innerHTML = "";
  }
  hideUserInterface() {
    this.player.log.debug("Hide playback bar user interface"), this.hide();
  }
  showUserInterface() {
    var t;
    if (u(this, X)) {
      const s = ((t = this.player.config.progressIndicator) == null ? void 0 : t.inlineMode) ?? !1 ? "flex" : "block";
      this.show(s), this.onResize();
    }
  }
  get buttonPluginsRight() {
    return u(this, le);
  }
  get buttonPluginsLeft() {
    return u(this, oe);
  }
  get progressIndicator() {
    return u(this, M);
  }
  get containerSize() {
    const t = this.element.clientWidth, i = this.element.clientHeight;
    return { width: t, height: i };
  }
  onResize() {
    const { containerSize: t } = this;
    u(this, ce).forEach((i) => i.onResize(t));
  }
}
Ee = new WeakMap(), ae = new WeakMap(), re = new WeakMap(), W = new WeakMap(), oe = new WeakMap(), Se = new WeakMap(), le = new WeakMap(), M = new WeakMap(), X = new WeakMap(), ce = new WeakMap();
const hi = [
  { maxWidth: 400, className: "size-s" },
  { maxWidth: 600, className: "size-m" },
  { maxWidth: 900, className: "size-l" },
  { maxWidth: 1100, className: "size-xl" },
  { className: "size-xxl" }
], Os = (n) => hi.find((e) => e.maxWidth && e.maxWidth >= n || e.maxWidth === void 0).className;
class $s extends B {
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
        this._captionsContainer.innerHTML = "", l && l.captions.forEach((c) => {
          this._captionsContainer.innerHTML += c, this._captionsContainer.innerHTML += "<br/>";
        }), l ? this._captionsContainer.style.display = null : this._captionsContainer.style.display = "none", this.resize();
      }
    };
    A(this.player, m.TIMEUPDATE, s), A(this.player, m.SEEK, s), A(this.player, m.RESIZE, () => this.resize()), A(this.player, m.SHOW_UI, () => this.element.classList.add("visible-ui")), A(this.player, m.HIDE_UI, () => this.element.classList.remove("visible-ui"));
  }
  async load() {
    await dn(this.player);
  }
  unload() {
  }
  resize() {
    const e = Os(this._captionsContainer.clientWidth);
    hi.forEach((t) => this.element.classList.remove(t.className)), this.element.classList.add(e);
  }
  addCaptions(e) {
    this._captions.push(e), P(this.player, m.CAPTIONS_CHANGED, { captions: this._captions });
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
      P(this.player, m.CAPTIONS_ENABLED, { language: i, label: s });
    }
    this.show();
  }
  disableCaptions() {
    this.currentCaptions && P(this.player, m.CAPTIONS_DISABLED), this._currentCaptions = null, this.hide();
  }
}
async function Bs(n) {
  await F(n, "eventLog", async (e) => {
    e.events.forEach((t) => {
      A(n, t, async (i) => {
        await e.onEvent(t, i);
      });
    });
  });
}
async function Gs(n) {
}
class ra extends de {
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
const pi = (n) => !1, gi = (n) => n.description;
class zs {
  constructor(e, t) {
    this._player = e, this._cookieConsentData = e.config.cookieConsent || [], this._getConsentCallback = t.getConsent || pi, this._getDescriptionCallback = t.getDescription || gi, this._cookieConsentData.forEach((i) => {
      i.description = this._getDescriptionCallback(i);
    }), this.updateConsentData();
  }
  updateConsentData() {
    this._cookieConsentData.forEach((e) => {
      e.value = this._getConsentCallback(e.type) || e.required;
    }), P(this._player, m.COOKIE_CONSENT_CHANGED, { cookieConsent: this });
  }
  getConsentForType(e) {
    const t = this._cookieConsentData.find((i) => i.type === e);
    return (t == null ? void 0 : t.value) || !1;
  }
}
function Hs({ container: n }) {
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
function js({ container: n, player: e, duration: t = 1e3, currentTime: i = 0, precision: s = 100 }) {
  n.classList.add("progress-indicator"), n.innerHTML = `
        <div class="range-container">
            <div class="timeline-preview-container"></div>
            <div class="elapsed"></div>
            <div class="remaining"></div>
            <ul class="markers-container"></ul>
            <input type="range" min="0" max="${t * s}" value="${i * s}" tabindex="0" role="slider" class="slider">
        </div>
    `;
  const a = n.querySelector(".elapsed"), r = n.querySelector(".remaining"), o = n.querySelector(".slider"), l = n.querySelector(".timeline-preview-container"), c = Hs({ container: l });
  let f = !1, h = null;
  const g = {
    player: e,
    elapsed: a,
    remaining: r,
    range: o,
    timeLinePreview: c,
    markersContainer: n.querySelector(".markers-container"),
    addMarker({ time: p, duration: w, frameDuration: _ }) {
      const d = document.createElement("li");
      d.style.left = `${p / w * 100}%`, this.markersContainer.appendChild(d);
    },
    updateRemaining() {
      const p = this.range.value / this.range.max * 100;
      this.elapsed.style.width = `${p}%`, this.remaining.style.width = `${100 - p}%`;
    },
    setDuration(p) {
      f || (this.range.max = p * s, this.updateRemaining());
    },
    setCurrentTime(p) {
      f || (this.range.value = p * s, this.updateRemaining());
    },
    onChange(p) {
      h = p;
    }
  };
  o.addEventListener("pointerdown", () => {
    f = !0;
  }), o.addEventListener("mousemove", async (p) => {
    var _;
    const w = ((_ = e.frameList) == null ? void 0 : _.frames) || [];
    if (w && w.length) {
      const d = await e.videoContainer.duration(), C = p.target.clientWidth, b = p.layerX / C, me = b * d, G = w.filter((Z) => Z.time <= me).pop(), ie = G && (G.thumb || G.url), z = G && ee(d * b);
      c.setImage(ie, z), c.setText(z), c.setPosition(b), c.show();
    }
  }), o.addEventListener("mouseleave", () => {
    c.hide();
  }), o.addEventListener("pointerup", () => {
    f = !1, typeof h == "function" && h(o.value / s);
  }), o.addEventListener("input", () => {
    g.updateRemaining();
  });
  const y = async (p) => {
    const w = await e.videoContainer.currentTime();
    await e.videoContainer.setCurrentTime(w + p);
  };
  return o.addEventListener("keydown", (p) => {
    p.key === "ArrowLeft" ? (y(-10), p.preventDefault(), p.stopPropagation()) : p.key === "ArrowRight" && (y(10), p.preventDefault(), p.stopPropagation());
  }), g.updateRemaining(), g;
}
const k = Object.freeze({
  DISABLED: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5
});
let mi = k.INFO;
const fi = (n, e = null) => {
  const t = typeof n == "string" ? k[n.toUpperCase()] : n;
  if (t < k.DISABLED || t > k.VERBOSE)
    throw Error(`setLogLevel: invalid log level ${t}`);
  e ? (e.__logSettings = e.__logSettings || {}, e.__logSettings.logLevel = t) : mi = t;
}, yi = (n = null) => n ? n.__logSettings.logLevel : mi, ye = ({
  msg: n,
  level: e = k.INFO,
  player: t = null,
  context: i = "paella-core"
}) => {
  t && !t.__logSettings && fi(t, k.INFO);
  const s = yi(t);
  if (e < k.DISABLED)
    throw Error(`printMessage: invalid log level ${e}`);
  if (t && P(t, m.LOG, { severity: e, context: i, message: n, currentLogLevel: s }), e <= s)
    switch (e) {
      case k.ERROR:
        console.error(`${i} - Error: ${n}`);
        break;
      case k.WARN:
        console.warn(`${i} - Warning: ${n}`);
        break;
      case k.INFO:
        console.info(`${i} - Info: ${n}`);
        break;
      case k.DEBUG:
        console.debug(`${i} - Debug: ${n}`);
        break;
      case k.VERBOSE:
        console.log(`${i} - Verbose: ${n}`);
        break;
    }
}, K = {
  setLevel: (n, e = null) => {
    fi(n, e);
  },
  currentLevel: (n = null) => yi(n),
  error: (n, e = null, t = "paella-core") => {
    ye({
      msg: n,
      level: k.ERROR,
      player: e,
      context: t
    });
  },
  warn: (n, e = null, t = "paella-core") => {
    ye({
      msg: n,
      level: k.WARN,
      player: e,
      context: t
    });
  },
  info: (n, e = null, t = "paella-core") => {
    ye({
      msg: n,
      level: k.INFO,
      player: e,
      context: t
    });
  },
  debug: (n, e = null, t = "paella-core") => {
    ye({
      msg: n,
      level: k.DEBUG,
      player: e,
      context: t
    });
  },
  verbose: (n, e = null, t = "paella-core") => {
    ye({
      msg: n,
      level: k.VERBOSE,
      player: e,
      context: t
    });
  }
};
class Ws {
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
    K.setLevel(e, this._player);
  }
  currentLevel() {
    return K.currentLevel(this._player);
  }
  error(e, t = null) {
    K.error(e, this._player, t || this._context);
  }
  warn(e, t = null) {
    K.warn(e, this._player, t || this._context);
  }
  info(e, t = null) {
    K.info(e, this._player, t || this._context);
  }
  debug(e, t = null) {
    K.debug(e, this._player, t || this._context);
  }
  verbose(e, t = null) {
    K.verbose(e, this._player, t || this._context);
  }
}
const _t = {}, je = '{ "global": {}, "videos": {} }';
async function vt() {
  switch (this.source.name) {
    case "cookie":
      try {
        return JSON.parse(q("preferences"));
      } catch {
        return JSON.parse(je);
      }
    case "dataPlugin":
      try {
        return await this.player.data.read(this.source.context, {}) || JSON.parse(je);
      } catch {
        return JSON.parse(je);
      }
  }
}
async function qs(n) {
  switch (this.source.name) {
    case "cookie":
      At(this.player, this.source.consentType, "preferences", JSON.stringify(n));
      break;
    case "dataPlugin":
      await this.player.data.write(this.source.context, {}, n);
      break;
  }
}
class Qs extends ue {
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
    const s = await vt.apply(this);
    i ? s.global[e] = t : (s.videos[this.player.videoId] = s.videos[this.player.videoId] || {}, s.videos[this.player.videoId][e] = t), await qs.apply(this, [s]);
  }
  async get(e, { global: t = !1 } = {}) {
    const i = await vt.apply(this);
    return t ? i.global[e] : i.videos[this.player.videoId] && i.videos[this.player.videoId][e] || void 0;
  }
}
function Ys(n) {
  var e;
  (e = this._skinData) != null && e.configOverrides && we(n, this._skinData.configOverrides);
}
async function Zs() {
  var n;
  if ((n = this._skinData) != null && n.styleSheets) {
    const e = [];
    this._skinData.styleSheets.forEach((t) => {
      if (!/\{.*/.test(t)) if (this._externalResourcesAllowed) {
        const i = $([this._skinUrl, t]);
        e.push(new Promise(async (s) => {
          await Je(i, !1), s();
        }));
      } else
        throw new Error("No external resources allowed loading skin object");
    }), await Promise.allSettled(e);
  }
}
async function Ks() {
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
        const i = $([this._skinUrl, t]);
        e.push(new Promise(async (s) => {
          const a = await Je(i);
          this.player.__skinStyleSheets__.push(a), s();
        }));
      }
    }), await Promise.allSettled(e);
  }
}
function wt() {
  this.player.__skinStyleSheets__ = this.player.__skinStyleSheets__ || [], this.player.__skinStyleSheets__.forEach((n) => {
    Mt(n);
  }), this.player.__skinStyleSheets__ = [];
}
async function Js() {
  var n;
  Array.isArray((n = this._skinData) == null ? void 0 : n.icons) && await Promise.all(this._skinData.icons.map(({ plugin: e, identifier: t, icon: i }) => new Promise(async (s, a) => {
    const r = document.createElement("div");
    if (r.innerHTML = i, r.children[0] && r.children[0].tagName === "svg")
      s();
    else if (this._externalResourcesAllowed) {
      const o = $([this._skinUrl, i]);
      (await fetch(o)).ok ? s() : a(new Error(`Skin icon not found at URL '${o}'`));
    } else
      throw new Error("No external resources allowed loading skin object");
  })));
}
async function Xs() {
  var n;
  Array.isArray((n = this._skinData) == null ? void 0 : n.icons) && await Promise.all(this._skinData.icons.map(({ plugin: e, identifier: t, icon: i }) => new Promise(async (s, a) => {
    const r = document.createElement("div");
    if (r.innerHTML = i, r.children[0] && r.children[0].tagName === "svg")
      this.player.addCustomPluginIcon(e, t, i), s();
    else {
      const o = $([this._skinUrl, i]), l = await fetch(o);
      if (l.ok) {
        const c = await l.text();
        this.player.addCustomPluginIcon(e, t, c), s();
      } else
        a(new Error(`Skin icon not found at URL '${o}'`));
    }
  })));
}
class ea {
  constructor(e) {
    this._player = e;
  }
  get player() {
    return this._player;
  }
  async loadSkin(e) {
    if (typeof e == "string") {
      this._skinUrl = Ze(e), this._externalResourcesAllowed = !0;
      const t = await fetch(e);
      if (!t.ok)
        throw new Error(`Error loading skin from URL ${e}`);
      this._skinData = await t.json();
    } else typeof e == "object" && (this._skinUrl = "", this._externalResourcesAllowed = !1, this._skinData = e);
    try {
      await Zs.apply(this), await Js.apply(this), (this._player.state === v.LOADED || this._player.state === v.MANIFEST) && await this._player.reload();
    } catch (t) {
      throw this._skinUrl = "", this._externalResourcesAllowed = !0, this._skinData = {}, t;
    }
  }
  unloadSkin() {
    var e, t;
    Array.isArray((e = this._skinData) == null ? void 0 : e.icons) && ((t = this._skinData) == null || t.icons.forEach(({ plugin: i, identifier: s }) => {
      this.player.removeCustomPluginIcon(i, s);
    })), this._skinUrl = null, this._skinData = {}, (this._player.state === v.LOADED || this._player.state === v.MANIFEST) && this._player.reload();
  }
}
class ta {
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
      return (r = this._player) != null && r.videoContainer && this._player._videoContainer.isTrimEnabled && !a ? s += this._player.videoContainer.trimStart : !((o = this._player) != null && o._videoContainer) && !a && console.warn("frameList.getImage(): player instance is null. The trimming information will be ignored."), [...this._frameList.frames].sort((l, c) => c.time - l.time).find((l) => l.time < s);
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
const N = Object.freeze([
  "UNLOADED",
  "LOADING_MANIFEST",
  "MANIFEST",
  "LOADING_PLAYER",
  "LOADED",
  "UNLOADING_MANIFEST",
  "UNLOADING_PLAYER",
  "ERROR"
]);
function _i() {
  var t, i, s, a, r, o, l, c;
  const n = ((i = (t = this.videoManifest) == null ? void 0 : t.metadata) == null ? void 0 : i.preview) && Q(this, (a = (s = this.videoManifest) == null ? void 0 : s.metadata) == null ? void 0 : a.preview) || this.defaultVideoPreview, e = ((o = (r = this.videoManifest) == null ? void 0 : r.metadata) == null ? void 0 : o.previewPortrait) && Q(this, (c = (l = this.videoManifest) == null ? void 0 : l.metadata) == null ? void 0 : c.previewPortrait) || this.defaultVideoPreviewPortrait;
  this._previewContainer = new Ms(this, this._containerElement, n, e);
}
async function Ct() {
  this._playerState = v.LOADING_MANIFEST, this._manifestLoaded = !0, this.log.debug("Loading paella player"), this._config = await this.initParams.loadConfig(this.configUrl, this), Ys.apply(this.skin, [this._config]), bn(this), this._defaultVideoPreview = this._config.defaultVideoPreview || this._initParams.defaultVideoPreview || "", this._defaultVideoPreviewPortrait = this._config.defaultVideoPreviewPortrait || this._initParams.defaultVideoPreviewPortrait || "", this._cookieConsent = new zs(this, {
    getConsent: this._initParams.getCookieConsentFunction,
    getDescription: this._initParams.getCookieDescriptionFunction
  }), this._preferences = new Qs(this);
  const n = new URLSearchParams(window.location.search), e = new URLSearchParams();
  for (const [s, a] of n)
    e.append(s.toLowerCase(), a);
  const t = e.get("loglevel"), i = t && Array.from(Object.keys(k)).indexOf(t.toUpperCase()) !== -1 ? t : this._config.logLevel || "INFO";
  this._log.setLevel(i), await this._initParams.loadDictionaries(this), _s(this), await Bs(this), this._videoContainer = new Ts(this, this._containerElement), await this.videoContainer.create();
  for (const s of this.pluginModules) {
    const a = s.getDictionaries && await s.getDictionaries();
    if (a)
      for (const r in a)
        _e(r, a[r]);
  }
}
async function bt() {
  var n, e;
  this.log.debug("Video manifest loaded:"), this.log.debug(this.videoManifest), this._data = new ns(this);
  for (const t in _t) {
    const i = _t[t];
    _e(t, i);
  }
  if (this._playerState = v.MANIFEST, P(this, m.MANIFEST_LOADED), (e = (n = this.videoManifest) == null ? void 0 : n.metadata) != null && e.preview)
    _i.apply(this);
  else
    throw new Error("No preview image found in video manifest, and no default preview image defined.");
  ws(this._videoManifest);
}
class oa {
  constructor(e, t = {}) {
    this._log = new Ws(this), this._packageData = Te, this._log.setLevel(k.VERBOSE), window.__paella_instances__ = window.__paella_instances__ || [], window.__paella_instances__.push(this), this.log.debug("New paella player instance"), typeof e == "string" && (e = document.getElementById(e)), e.classList.add("player-container"), this.log.debug("Loading skin manager"), this._skin = new ea(this), this._containerElement = e, this._initParams = t, this._initParams.manifestFileName = this._initParams.manifestFileName || "data.json", this._initParams.loadConfig = this._initParams.loadConfig || bi, this._initParams.getVideoId = this._initParams.getVideoId || Li, this._initParams.getManifestUrl = this._initParams.getManifestUrl || Pi, this._initParams.getManifestFileUrl = this._initParams.getManifestFileUrl || Ei, this._initParams.loadVideoManifest = this._initParams.loadVideoManifest || Si, this._initParams.customPluginContext = this._initParams.customPluginContext || [], this._initParams.translateFunction = this._initParams.translateFunction || Gt, this._initParams.getLanguageFunction = this._initParams.getLanguageFunction || Ht, this._initParams.setLanguageFunction = this._initParams.setLanguageFunction || zt, this._initParams.addDictionaryFunction = this._initParams.addDictionaryFunction || jt, this._initParams.getDictionariesFunction = this._initParams.getDictionariesFunction || Wt, this._initParams.getDefaultLanguageFunction = this._initParams.getDefaultLanguageFunction || qt, this._initParams.Loader = this._initParams.customLoader || Ii, this._initParams.getCookieConsentFunction = this._initParams.getCookieConsentFunction || pi, this._initParams.getCookieDescriptionFunction = this._initParams.getCookieDescriptionFunction || gi, this._initParams.getProgressIndicator = this._initParams.getProgressIndicator || js, this._initParams.loadDictionaries = this._initParams.loadDictionaries || async function(a) {
      _e("en", {
        Hello: "Hello",
        World: "World"
      }), _e("es", {
        Hello: "Hola",
        World: "Mundo"
      }), ht(navigator.language.substring(0, 2));
    };
    const i = this._initParams.plugins || [];
    this._initParams.plugins = [
      ...i
    ], fn(this._initParams.translateFunction), yn(this._initParams.setLanguageFunction), _n(this._initParams.getLanguageFunction), vn(this._initParams.addDictionaryFunction), wn(this._initParams.getDictionariesFunction), Cn(this._initParams.getDefaultLanguageFunction), this._config = null, this._defaultVideoPreview = "", this._defaultVideoPreviewPortrait = "", this._videoId = null, this._manifestUrl = null, this._manifestFileUrl = null, this._manifestData = null, this._videoManifest = null, this._playerLoaded = !1;
    const s = () => {
      this.resize();
    };
    window.addEventListener("resize", s), this.containerElement.addEventListener("fullscreenchange", () => {
      P(this, m.FULLSCREEN_CHANGED, { status: this.isFullscreen }), this.isFullscreen ? P(this, m.ENTER_FULLSCREEN) : P(this, m.EXIT_FULLSCREEN);
    }), this._playerState = v.UNLOADED, this._customPluginIcons = {};
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
    return this._playerState === v.LOADED;
  }
  get state() {
    return this._playerState;
  }
  get stateText() {
    return N[this.state];
  }
  get Events() {
    return m;
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
    ht(e);
  }
  getLanguage() {
    return gn();
  }
  addDictionary(e, t) {
    _e(e, t);
  }
  getDictionaries() {
    return mn();
  }
  getDefaultLanguage() {
    return ei(this);
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
    return v;
  }
  get PlayerStateNames() {
    return N;
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
      typeof e == "string" && (e = v[e]), (e < 0 || e > Object.values(v).length) && i(Error(`Invalid player state '${e}'`)), s();
    });
  }
  async loadUrl(e, { title: t, duration: i, preview: s, previewPortrait: a } = {}) {
    if (this._playerState !== v.UNLOADED)
      throw new Error(this.translate("loadUrl(): Invalid current player state: $1", [N[this._playerState]]));
    if (this._manifestLoaded)
      throw new Error(this.translate("loadUrl(): Invalid current player state: $1", [N[this._playerState]]));
    if (!e)
      throw new Error(this.translate("loadUrl(): No URL specified."));
    Array.isArray(e) || (e = [e]), t || (t = xe(e[0]), this.log.warn("Paella.loadUrl(): no title specified. Using URL file name as video name."));
    try {
      if (await Ct.apply(this), !s && (this.defaultVideoPreview !== "" || this.defaultVideoPreviewPortrait !== ""))
        s = this.defaultVideoPreview, a = this.defaultVideoPreviewPortrait, this.log.warn("Paella.loadUrl(): no preview image specified. Using default preview image.");
      else if (!s && !a)
        throw new Error("Paella.loadUrl(): no preview image specified and no default preview image configured.");
      this._videoId = Tt(xe(e[0])), this._manifestUrl = Ze(e[0]), this._manifestFileUrl = e[0], this.log.debug(`Loading video with identifier '${this.videoId}' from URL '${this.manifestFileUrl}'`);
      const r = Rn(this, e.length)[0];
      this._videoManifest = {
        metadata: {
          duration: i,
          title: t,
          preview: s,
          previewPortrait: a
        },
        streams: e.map((o, l) => ({
          sources: Ls(this, o),
          content: r[l],
          role: l === 0 ? "mainAudio" : null
        }))
      }, await bt.apply(this);
    } catch (r) {
      throw this._playerState = v.ERROR, this.log.error(r), this._errorContainer = new Oe(this, this.translate(r.message)), r;
    }
  }
  async loadManifest() {
    if (this._playerState !== v.UNLOADED)
      throw new Error(this.translate("loadManifest(): Invalid current player state: $1", [N[this._playerState]]));
    if (!this._manifestLoaded)
      try {
        if (await Ct.apply(this), this._videoId = await this.initParams.getVideoId(this._config, this), this.videoId === null)
          throw new Error("No video identifier specified");
        this._manifestUrl = await this.initParams.getManifestUrl(this.repositoryUrl, this.videoId, this._config, this), this._manifestFileUrl = await this.initParams.getManifestFileUrl(this._manifestUrl, this.manifestFileName, this._config, this), this.log.debug(`Loading video with identifier '${this.videoId}' from URL '${this.manifestFileUrl}'`), this._videoManifest = await this.initParams.loadVideoManifest(this.manifestFileUrl, this._config, this), this._videoManifest.metadata = this._videoManifest.metadata || {}, !this._videoManifest.metadata.preview && (this.defaultVideoPreview !== "" || this.defaultVideoPreviewPortrait !== "") && (this._videoManifest.metadata.preview = this.defaultVideoPreview, this._videoManifest.metadata.previewPortrait = this.defaultVideoPreviewPortrait, this.log.warn("Paella.loadUrl(): no preview image specified. Using default preview image.")), this._manifestParser = new ta(this.videoManifest, this), wt.apply(this.skin), await Xs.apply(this.skin), await Ks.apply(this.skin), await bt.apply(this);
      } catch (e) {
        throw this._playerState = v.ERROR, this.log.error(e), this._errorContainer = new Oe(this, this.translate(e.message)), e;
      }
  }
  async loadPlayer() {
    var e, t, i;
    try {
      if (this._captionsCanvas = new $s(this, this._containerElement), this._playerState !== v.MANIFEST)
        throw new Error(this.translate("loadPlayer(): Invalid current player state: $1", [N[this._playerState]]));
      this._playerState = v.LOADING_PLAYER, (e = this._previewContainer) == null || e.removeFromParent(), this._loader = new this.initParams.Loader(this), await this._loader.create(), await this.videoContainer.load((t = this.videoManifest) == null ? void 0 : t.streams), P(this, m.STREAM_LOADED), this._playbackBar = new Fs(this, this.containerElement), await this._playbackBar.load(), this._hideUiTime = ((i = this.config.ui) == null ? void 0 : i.hideUITimer) ?? 5e3, kt(this), this._captionsCanvas.load(), this._playerState = v.LOADED, await this.videoContainer.updateLayout(), P(this, m.PLAYER_LOADED), !(this.videoManifest.metadata.visibleTimeLine ?? !0) && this.playbackBar.progressIndicator.hideTimeLine(), this._loader.debug || (this._loader.removeFromParent(), this._loader = null);
    } catch (s) {
      throw this._playerState = v.ERROR, this._loader && (this._loader.removeFromParent(), this._loader = null), this._errorContainer = new Oe(this, s.message), s;
    }
  }
  async load() {
    switch (this.state) {
      case v.UNLOADED:
        await this.loadManifest(), await this.loadPlayer();
        break;
      case v.MANIFEST:
        await this.loadPlayer();
        break;
      case v.LOADED:
        break;
      default:
        throw new Error(this.translate("Could not load player: state transition in progress: $1", [N[this.state]]));
    }
  }
  async unload() {
    switch (this.state) {
      case v.UNLOADED:
        break;
      case v.MANIFEST:
        await this.unloadManifest();
        break;
      case v.LOADED:
      case v.ERROR:
        await this.unloadPlayer(), await this.unloadManifest();
        break;
      default:
        throw new Error(this.translate("Could not unload player: state transition in progress: $1", [N[this.state]]));
    }
  }
  async unloadManifest() {
    var e;
    if (this._playerState !== v.MANIFEST && this._playerState !== v.ERROR)
      throw new Error(this.translate("unloadManifest(): Invalid current player state: $1", [N[this._playerState]]));
    this._errorContainer && (this._errorContainer.removeFromParent(), this._errorContainer = null), this._playerState = v.UNLOADING_MANIFEST, this.log.debug("Unloading paella player"), await Gs(), await vs(this), this._manifestLoaded = !1, (e = this._previewContainer) == null || e.removeFromParent(), this._preferences = null, this._playerState = v.UNLOADED, wt.apply(this.skin);
  }
  async unloadPlayer() {
    var e, t, i, s, a;
    if (this._playerState !== v.LOADED && this._playerState !== v.ERROR)
      throw new Error(this.translate("unloadManifest(): Invalid current player state: $1", [N[this._playerState]]));
    this._errorContainer && (this._errorContainer.removeFromParent(), this._errorContainer = null), this._playerState = v.UNLOADING_PLAYER, await ((e = this._videoContainer) == null ? void 0 : e.unload()), this._videoContainer = null, await ((t = this._playbackBar) == null ? void 0 : t.unload()), this._playbackBar = null, (i = this._captionsCanvas) == null || i.unload(), this._captionsCanvas = null, xt(this), P(this, m.PLAYER_UNLOADED), (a = (s = this.videoManifest) == null ? void 0 : s.metadata) != null && a.preview && _i.apply(this), vi(this), this._playerState = v.MANIFEST;
  }
  async reload(e = null) {
    switch (this.state) {
      case v.UNLOADED:
        break;
      case v.MANIFEST:
        await this.unloadManifest();
        break;
      case v.LOADED:
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
      P(this, m.RESIZE, { size: i() }), this._resizeEndTimer && clearTimeout(this._resizeEndTimer), this._resizeEndTimer = setTimeout(() => {
        P(this, m.RESIZE_END, { size: i() });
      }, 1e3);
    }
  }
  async hideUserInterface() {
    var e, t, i;
    await ((e = this.videoContainer) == null ? void 0 : e.paused()) || (this._uiHidden = !0, (t = this.videoContainer) == null || t.hideUserInterface(), (i = this.playbackBar) == null || i.hideUserInterface(), P(this, m.HIDE_UI));
  }
  async showUserInterface() {
    var e, t;
    (e = this.videoContainer) == null || e.showUserInterface(), (t = this.playbackBar) == null || t.showUserInterface(), this._uiHidden && P(this, m.SHOW_UI), this._uiHidden = !1;
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
class la {
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
  en as AudioOnlyVideo,
  la as AudioTrackData,
  tn as AudioVideoPlugin,
  fs as ButtonGroupPlugin,
  nt as ButtonPlugin,
  si as Canvas,
  sa as CanvasButtonPlugin,
  E as CanvasButtonPosition,
  ai as CanvasPlugin,
  $t as Captions,
  Ot as CaptionsPlugin,
  Mn as CurrentTimeLabelPlugin,
  hn as DFXPParser,
  ns as Data,
  oi as DataPlugin,
  pn as DfxpManifestCaptionsPlugin,
  B as DomClass,
  ft as DualVideoDynamicLayoutPlugin,
  jn as DualVideoLayoutPlugin,
  ra as EventLogPlugin,
  m as Events,
  Ut as HtmlVideo,
  nn as HtmlVideoFormatPlugin,
  on as ImageVideo,
  ln as ImageVideoFormatPlugin,
  k as LOG_LEVEL,
  Ii as Loader,
  Ws as Log,
  ta as ManifestParser,
  ms as MenuButtonPlugin,
  cn as Mp4Video,
  un as Mp4VideoFormatPlugin,
  oa as Paella,
  Tn as PlayPauseButtonPlugin,
  ue as PlayerResource,
  v as PlayerState,
  N as PlayerStateNames,
  de as Plugin,
  Ne as PluginModule,
  os as PopUpButtonPlugin,
  Qn as SingleVideoLayoutPlugin,
  Jn as TripleVideoLayoutPlugin,
  tt as UserInterfacePlugin,
  et as Video,
  ts as VideoCanvas,
  is as VideoCanvasPlugin,
  V as VideoContainerMessagePosition,
  ge as VideoLayout,
  Ve as VideoPlugin,
  sn as VideoQualityItem,
  An as VttManifestCaptionsPlugin,
  xn as WebVTTParser,
  _e as addDictionary,
  A as bindEvent,
  ws as checkManifestIntegrity,
  Vt as createElement,
  L as createElementWithHtmlText,
  Hs as createTimeLinePreview,
  jt as defaultAddDictionaryFunction,
  pi as defaultGetCookieConsentCallback,
  gi as defaultGetCookieDescriptionCallback,
  qt as defaultGetDefaultLanguageFunction,
  Wt as defaultGetDictionariesFunction,
  Ht as defaultGetLanguageFunction,
  Ei as defaultGetManifestFileUrlFunction,
  Pi as defaultGetManifestUrlFunction,
  Li as defaultGetVideoIdFunction,
  bi as defaultLoadConfigFunction,
  Si as defaultLoadVideoManifestFunction,
  zt as defaultSetLanguageFunction,
  Gt as defaultTranslateFunction,
  ei as getDefaultLanguage,
  mn as getDictionaries,
  gn as getLanguage,
  li as getPluginsOfType,
  aa as importPlugins,
  Ri as isVolumeApiAvailable,
  F as loadPluginsOfType,
  K as log,
  dt as parseDFXP,
  mt as parseWebVTT,
  rs as plugins,
  ht as setLanguage,
  Ce as translate,
  P as triggerEvent,
  ne as triggerIfReady,
  na as utils
};
