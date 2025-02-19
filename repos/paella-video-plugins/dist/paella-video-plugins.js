var Y = (i) => {
  throw TypeError(i);
}, K = (i, e, t) => e.has(i) || Y("Cannot " + t), g = (i, e, t) => (K(i, e, "read from private field"), t ? t.call(i) : e.get(i)), k = (i, e, t) => e.has(i) ? Y("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(i) : e.set(i, t), D = (i, e, t, s) => (K(i, e, "write to private field"), e.set(i, t), t);
const I = Object.freeze({
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
function U(i, e, t, s = !0) {
  return i.__eventListeners__ = i.__eventListeners__ || {}, Array.isArray(e) || (e = [e]), e.forEach((n) => {
    i.__eventListeners__[n] = i.__eventListeners__[n] || [], i.__eventListeners__[n].push({
      callback: t,
      unregisterOnUnload: s
    });
  }), t;
}
function Z(i, e, t = {}) {
  i.__eventListeners__ && i.__eventListeners__[e] && i.__eventListeners__[e].forEach((s) => s.callback(t));
}
function de(i) {
  return new Promise((e, t) => {
    fetch(i).then((s) => s.text()).then((s) => {
      e(s);
    }).catch((s) => t(s));
  });
}
function ce(i) {
  const e = new URLSearchParams(window.location.search);
  return e.has(i) ? e.get(i) : null;
}
function he(i) {
  const e = window.location.hash.replace("#", "?"), t = new URLSearchParams(e);
  return t.has(i) ? t.get(i) : null;
}
function J(i, e) {
  const t = e || "/";
  return i = i.map((s, n) => (n && (s = s.replace(new RegExp("^" + t), "")), n !== i.length - 1 && (s = s.replace(new RegExp(t + "$"), "")), s)), i.join(t);
}
function ee(i) {
  return new RegExp("^([a-z]+://|//)", "i").test(i) || /^\//.test(i);
}
function te(i) {
  try {
    return new URL(i).pathname.split("/").pop();
  } catch {
    return i.split("/").pop();
  }
}
function pe(i) {
  return i.split(".").reduce((e, t, s, n) => s < n.length - 1 ? e !== "" ? `${e}.${t}` : t : e, "");
}
function ge(i) {
  const e = (t) => {
    const s = t.split("/").reduce((n, a, r, o) => r < o.length - 1 ? n !== "" ? `${n}/${a}` : a : n, "");
    return (t[0] === "/" ? `/${s}` : s) + "/";
  };
  try {
    const t = new URL(i);
    return t.origin + e(t.pathname);
  } catch {
    return e(i);
  }
}
function me(i) {
  return te(i).split(".").pop();
}
function Q(i, e) {
  return ee(e) ? e : J([i.manifestUrl, e]);
}
function _e(i) {
  i.__hideTimerPaused__ = !0;
}
function fe(i) {
  i.__hideTimerPaused__ = !1;
}
function ye(i, e = "hideUiTime") {
  var t;
  i.__hideTimer__ = null;
  const s = async () => i.__hideTimerPaused__ ? (i.log.debug("UI not hidden because the auto hide timer is paused"), !1) : n() ? (i.log.debug("UI not hidden because there is a focused element"), !1) : (await i.hideUserInterface(), !0);
  (t = i.config.ui) != null && t.hideOnMouseLeave && i.containerElement.addEventListener("mouseleave", () => {
    s();
  });
  const n = () => {
    const r = document.activeElement;
    return (i.playbackBar.element.contains(r) || i.videoContainer.element.contains(r)) && [
      "input",
      "textarea",
      "button"
    ].find((o) => r.tagName.toLowerCase(o)) !== -1;
  }, a = async () => {
    i.__hideTimer__ && clearTimeout(i.__hideTimer__), await i.showUserInterface(), i.__hideTimer__ = setTimeout(async () => {
      i.__hideTimer__ = null, s() || a();
    }, i[e]);
  };
  i.containerElement.addEventListener("mousemove", async (r) => {
    a();
  }), U(i, I.PLAY, async () => {
    a();
  }), U(i, I.PAUSE, async () => {
    await i.showUserInterface();
  }), U(i, I.ENDED, async () => {
    await i.showUserInterface();
  }), document.addEventListener("keydown", async () => {
    a();
  });
}
function ve(i) {
  i.__hideTimer__ && (clearTimeout(i.__hideTimer__), delete i.__hideTimer__);
}
function be(i) {
  const e = Math.floor(i / 60 / 60), t = Math.floor(i / 60) - e * 60, s = Math.floor(i % 60);
  return (e > 0 ? e.toString().padStart(2, "0") + ":" : "") + t.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
}
function Ee(i) {
  const e = /^(?:(\d+):){0,1}(\d+):(\d+)(\.\d+)?$/.exec(i);
  if (e) {
    const t = e[1] !== void 0 ? Number(e[1]) : 0, s = Number(e[2]), n = Number(e[3]);
    return t * 3600 + s * 60 + n;
  }
  return null;
}
function Ce(i) {
  const e = /^(?:(\d+):){0,1}(\d+):(\d+)\.(\d+)?$/.exec(i);
  if (e) {
    const t = e[1] !== void 0 ? Number(e[1]) : 0, s = Number(e[2]), n = Number(e[3]), a = e[4] && Number(e[4]) || 0;
    return t * 36e5 + s * 6e4 + n * 1e3 + a;
  }
  return null;
}
function ie(i, e, t = 365) {
  let s = /* @__PURE__ */ new Date();
  s.setTime(s.getTime() + t * 24 * 60 * 60 * 1e3);
  let n = `expires=${s.toUTCString()}`;
  document.cookie = `${i}=${e};${n};path=/;SameSite=None;` + (/Apple/.test(navigator.vendor) ? "" : "Secure;");
}
function we(i, e, t, s, n = 365) {
  i.cookieConsent.getConsentForType(e) && ie(t, s, n);
}
function $(i) {
  let e = i + "=", t = decodeURIComponent(document.cookie).split(";");
  for (let s = 0; s < t.length; ++s) {
    let n = t[s];
    for (; n.charAt(0) == " "; )
      n = n.substring(1);
    if (n.indexOf(e) == 0)
      return n.substring(e.length, n.length);
  }
  return "";
}
function Te(i) {
  const e = $(i), t = Number(e);
  return e !== "" && !isNaN(t) ? t : null;
}
function Le(i) {
  try {
    return JSON.parse($(i));
  } catch {
    return null;
  }
}
function Se(i, e = !0) {
  return new Promise((t) => {
    const s = document.createElement("link");
    s.setAttribute("rel", "stylesheet"), s.setAttribute("href", i), s.onload = () => t(s);
    const n = document.getElementsByTagName("head")[0];
    e && n.appendChild(s), t();
  });
}
function Pe(i) {
  document.getElementsByTagName("head")[0].removeChild(i);
}
function F(i, e, t = !0) {
  for (const s in e) {
    const n = i[s];
    let a = e[s];
    t && Array.isArray(n) && Array.isArray(a) ? (n.forEach((r) => {
      a = a.filter((o) => typeof r == "object" && typeof o == "object" && r.id === o.id ? (F(r, o, t), !1) : !0);
    }), a.forEach((r) => {
      n.push(r);
    })) : typeof n == "object" && a ? F(n, a, t) : i[s] = e[s];
  }
}
function se(i, { excludedTags: e = null } = {}) {
  const t = document.createElement("div");
  t.innerHTML = i;
  const s = ["script"];
  return e && s.push(...e), s.flatMap((n) => Array.from(t.getElementsByTagName(n))).forEach((n) => {
    n.parentElement.removeChild(n);
  }), t.innerHTML;
}
let N = null;
function Ae(i) {
  if (!i) return !1;
  N || (N = document.createElement("video"));
  let e = N.canPlayType(i);
  if (e === "maybe" || e === "probably")
    return !0;
  if (/video\/mp4/i.test(i))
    return e = N.canPlayType("video/mp4"), e === "maybe" || e === "probably";
}
const ke = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clearAutoHideTimer: ve,
  getCookie: $,
  getFileExtension: me,
  getHashParameter: he,
  getJSONCookie: Le,
  getNumericCookie: Te,
  getUrlFileName: te,
  getUrlParameter: ce,
  isAbsoluteUrl: ee,
  joinPath: J,
  loadStyle: Se,
  loadSvgIcon: de,
  mergeObjects: F,
  pauseAutoHideUiTimer: _e,
  removeExtension: pe,
  removeFileName: ge,
  resolveResourcePath: Q,
  resumeAutoHideUiTimer: fe,
  sanitizeHTML: se,
  secondsToTime: be,
  setCookie: ie,
  setCookieIfAllowed: we,
  setupAutoHideUiTimer: ye,
  supportsVideoType: Ae,
  timeToMilliseconds: Ce,
  timeToSeconds: Ee,
  unloadStyle: Pe
}, Symbol.toStringTag, { value: "Module" }));
var x;
class B {
  constructor(e) {
    k(this, x, null), D(this, x, e);
  }
  get player() {
    return g(this, x);
  }
}
x = /* @__PURE__ */ new WeakMap();
function Ie({ tag: i = "div", attributes: e = {}, children: t = "", innerText: s = "", parent: n = null }) {
  const a = document.createElement(i);
  a.innerText = s;
  for (let r in e)
    a.setAttribute(r, e[r]);
  return a.innerHTML = t, n && n.appendChild(a), a;
}
function M(i, e = null) {
  const t = document.createElement("div");
  t.innerHTML = i;
  const s = t.children[0];
  return e && e.appendChild(s), s;
}
var E;
class Me extends B {
  constructor(e, { tag: t = "div", attributes: s = [], children: n = "", parent: a = null }) {
    super(e), k(this, E, null), D(this, E, Ie({ tag: t, attributes: s, children: n, parent: a })), Object.defineProperty(this, t, {
      get: () => g(this, E)
    });
  }
  get element() {
    return g(this, E);
  }
  get parent() {
    return g(this, E).parentElement;
  }
  hide() {
    this.element.style.display = "none";
  }
  show(e = "block") {
    this.element.style.display = null;
  }
  get isVisible() {
    const e = window.getComputedStyle(this.element);
    return e.display !== "none" && e.display !== "";
  }
  setAttribute(e, t) {
    g(this, E).setAttribute(e, t);
  }
  removeFromParent() {
    var e;
    (e = g(this, E).parentElement) == null || e.removeChild(g(this, E));
  }
  setParent(e) {
    this.removeFromParent(), e.appendChild(g(this, E));
  }
}
E = /* @__PURE__ */ new WeakMap();
class ne extends B {
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
class q extends ne {
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
async function Ne() {
  return await new Promise((i) => {
    const e = document.createElement("audio"), t = setTimeout(() => i(!1), 100);
    e.addEventListener("volumechange", (s) => {
      clearTimeout(t), i(!0);
    }), e.volume = 0.5;
  });
}
class xe extends Me {
  constructor(e, t, s) {
    const n = {
      class: "video-player"
    };
    super(t, { tag: e, attributes: n, parent: s }), this._streamProvider = null, this._streamData = null, this._ready = !1;
  }
  async isVolumeApiAvailable() {
    return await Ne();
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
class Re extends B {
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
class ae extends xe {
  constructor(e, t, s, n) {
    super("video", e, t), this._config = n || {};
    const a = this._config.crossOrigin ?? "";
    this.element.setAttribute("playsinline", ""), a !== !1 && this.element.setAttribute("crossorigin", a), this.isMainAudio = s, this.element.setAttribute("autoplay", ""), this.element.autoplay = !0, s || (this.element.muted = !0), this._videoEnabled = !0;
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
    this._streamData = this._streamData || e, this.player.log.debug("es.upv.paella.htmlVideoFormat: loadStreamData"), this._sources = e.sources.html, this._currentQuality = 0, this.isMainAudioPlayer || (this.video.muted = !0), this._sources.forEach(({ src: t, mimetype: s }) => {
      t = Q(this.player, t);
      const n = document.createElement("source");
      n.src = t, n.type = s, this.video.appendChild(n);
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
      this.video.readyState >= 2 && (this._ready = !0), this.ready ? e() : (this._handleLoadedCallback = (s) => {
        this.video.readyState >= 2 && (this.video.pause(), this._ready = !0, e());
      }, this.video.addEventListener("loadeddata", this._handleLoadedCallback));
    });
  }
}
class L {
  constructor({ label: e, shortLabel: t, isAuto: s = !1, index: n = 0, src: a = "", width: r = -1, height: o = -1, bitrate: l = -1 }) {
    this._label = e, this._shortLabel = t, this._index = n, this._src = a, this._res = {
      w: r,
      h: o
    }, this._bitrate = l, this._isAuto = s;
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
class De extends ae {
  constructor(e, t, s, n) {
    super(e, t, s, n);
  }
  // This function is called when the player loads, and it should
  // make everything ready for video playback to begin.
  async loadStreamData(e = null) {
    this._streamData = this._streamData || e, this.player.log.debug("es.upv.paella.mp4VideoFormat: loadStreamData"), this._currentSource || (this._sources = null, this._currentQuality = 0, this._sources = e.sources.mp4, this._sources.sort((t, s) => Number(t.res.w) - Number(s.res.w)), this._currentQuality = this._sources.length - 1, this._currentSource = this._sources[this._currentQuality]), this.isMainAudioPlayer || (this.video.muted = !0), this._initialVolume && (this.video.volume = this._initialVolume, this._initialVolume === 0 && (this.video.muted = !0)), this.video.src = Q(this.player, this._currentSource.src), this._endedCallback = this._endedCallback || (() => {
      typeof this._videoEndedCallback == "function" && this._videoEndedCallback();
    }), this.video.addEventListener("ended", this._endedCallback);
    try {
      await this.video.play();
    } catch {
    }
    await this.waitForLoaded(), this.player.log.debug(`es.upv.paella.mp4VideoFormat (${this.streamData.content}): video loaded and ready.`), this.saveDisabledProperties(this.video);
  }
}
class Ue extends ne {
  constructor(e, t, s) {
    super(e, t, s), this.__uiPlugin = !0;
  }
  async getDictionaries() {
    return null;
  }
}
const z = () => {
  const i = document.createElement("span");
  return i.classList.add("side-container"), i.classList.add("hidden"), i;
};
class Oe {
  onIconChanged(e, t, s) {
  }
  onTitleChanged(e, t, s) {
  }
  onStateChanged(e, t, s, n, a) {
  }
}
var w, T, R;
class He extends Ue {
  constructor() {
    super(...arguments), k(this, w, null), k(this, T, null), k(this, R, []);
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
  setObserver(e) {
    if (e instanceof Oe)
      this._observer = e;
    else if (typeof e.onIconChanged == "function" || typeof e.onTitleChanged == "function" || typeof e.onStateChanged == "function")
      this._observer = e;
    else
      throw new Error("Invalid observer for ButtonPlugin");
  }
  get icon() {
    return this._icon || (this._icon = ""), this._icon;
  }
  set icon(e) {
    var t;
    if (typeof e == "string" && (e = se(e)), this._icon = e, e && this._button instanceof HTMLElement) {
      const s = this._button.querySelector("i") || M("<i></i>", this._button);
      s.innerHTML = e;
    } else if (this._button instanceof HTMLElement) {
      const s = this._button.querySelector("i");
      s && this._button.removeChild(s);
    }
    (t = this._observer) != null && t.onIconChanged && this._observer.onIconChanged(this, this._icon, e);
  }
  get title() {
    return this._title || "";
  }
  set title(e) {
    var t;
    if (this._title = e, e && this._button instanceof HTMLElement) {
      const s = this._button.querySelector("span") || M(`<span class="button-title-${this.titleSize}"></span>`, this._button);
      s.innerHTML = e;
    } else if (this._button instanceof HTMLElement) {
      const s = this._button.querySelector("span");
      s && this._button.removeChild(s);
    }
    (t = this._observer) != null && t.onTitleChanged && this._observer.onTitleChanged(this, this._title, e);
  }
  // "small", "medium", "large"
  get titleSize() {
    return "medium";
  }
  // "left" or "right"
  get side() {
    var e;
    return ((e = this.config) == null ? void 0 : e.side) || "left";
  }
  get closePopUps() {
    return this.config.closePopUps || this.getClosePopUps();
  }
  getClosePopUps() {
    return !0;
  }
  // "playbackBar" or "videoContainer"
  get parentContainer() {
    var e;
    return ((e = this.config) == null ? void 0 : e.parentContainer) || "playbackBar";
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
    const { width: e } = this.player.playbackBar.containerSize;
    this._button && (e > this.minContainerSize || this.parentContainer !== "playbackBar") && (this._button.style.display = null);
  }
  get leftSideContainer() {
    return g(this, w) || (D(this, w, z()), this.container.appendChild(g(this, w))), g(this, w);
  }
  get leftSideContainerPresent() {
    return g(this, w) !== null;
  }
  get rightSideContainer() {
    return g(this, T) || (D(this, T, z()), this.container.appendChild(g(this, T))), g(this, T);
  }
  get rightSideContainerPresent() {
    return g(this, T) !== null;
  }
  get stateText() {
    return null;
  }
  get stateIcon() {
    return null;
  }
  setState({ text: e = null, icon: t = null } = {}) {
    var s, n;
    const a = this._statusText, r = this._statusIcon;
    this._statusText = e, this._statusIcon = t, g(this, R).forEach((o) => o(this)), this._statusIcon && (this.icon = this._statusIcon), this._statusText && (this.title = this._statusText), (n = (s = this._observer) == null ? void 0 : s.onStateChanged) == null || n.call(s, this, a, e, r, t);
  }
  onStateChange(e) {
    typeof e == "function" ? g(this, R).push(e) : this.player.log.warn("Invalid callback for ButtonPlugin.onStateChange");
  }
  async action(e, t = null) {
  }
  onResize({ width: e, height: t }) {
    e < this.minContainerSize ? this.hide() : this.show();
  }
  focus() {
    var e;
    (e = this.button) == null || e.focus();
  }
  blur() {
    var e;
    (e = this.button) == null || e.blur();
  }
  isFocus() {
    return this.button === document.activeElement;
  }
}
w = /* @__PURE__ */ new WeakMap(), T = /* @__PURE__ */ new WeakMap(), R = /* @__PURE__ */ new WeakMap();
class Fe extends He {
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
    var e, t;
    const s = ((e = this.config.closeActions) == null ? void 0 : e.clickOutside) ?? !0, n = ((t = this.config.closeActions) == null ? void 0 : t.closeButton) ?? !1;
    return {
      clickOutside: s,
      closeButton: n
    };
  }
  get currentContent() {
    return this._currentContent;
  }
  async getContent() {
    return M("<p>Pop Up Button Plugin Content</p>");
  }
  async checkRefreshContent() {
    if (this.refreshContent) {
      const e = await this.getContent();
      this._currentContent.innerHTML = "", Array.from(e.children).forEach((t) => this._currentContent.appendChild(t));
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
const Ve = (i) => i ? `<span class="menu-title">${i}</span>` : "", Qe = (i) => i ? `<i class="menu-icon">${i}</i>` : "", $e = (i) => i ? `aria-label="${i}"` : "", Be = (i) => i ? `<span class="state-text">${i}</span>` : "", qe = (i) => i ? `<i class="state-icon">${i}</i>` : "", We = (i, e) => i || e ? `<span class="button-state">${Be(i)}${qe(e)}</span>` : "";
function Ge(i, e, t, s, n, a, r) {
  const { id: o = 0, title: l = null, icon: c = null, showTitle: d = !0, stateText: f = null, stateIcon: h = null } = i, u = this, C = document.createElement("li"), S = a[o] ?? !1, y = M(`
		<button class="menu-button-item${S ? " selected" : ""}" ${$e(l)} data-id="${o}"" id="${u.name}_menuItem_${o}">
			${Qe(c)}
			${d ? Ve(l) : ""}
			${f || h ? We(f, h) : ""}
		</button>
	`);
  return r && (r._button = y), y.addEventListener("keydown", (p) => {
    var A;
    const v = () => {
      p.stopPropagation(), p.preventDefault();
    };
    if (p.key === "ArrowUp") {
      const m = y.dataPrev;
      m == null || m.focus(), v();
    } else if (p.key === "ArrowDown") {
      const m = y.dataNext;
      m == null || m.focus(), v();
    } else if (p.key === "Tab") {
      const m = p.shiftKey ? p.target.dataPrev : p.target.dataNext;
      m == null || m.focus(), v();
    } else p.key === "Escape" && (this.player.playbackBar.popUp.pop() ? (A = u.button) == null || A.focus() : this.focus(), v());
  }), y.addEventListener("click", async (p) => {
    var A;
    if (e === "check") {
      const v = s.find((m) => m.id === o);
      a[o] = !a[o], u.itemSelected(v, s);
    } else if (e === "radio") {
      a[o] = !0;
      let v = null;
      s.forEach((m) => {
        m.id === o ? v = m : a[m.id] = !1;
      }), u.itemSelected(v, s);
    } else {
      const v = s.find((m) => m.id === o);
      u.itemSelected(v, s);
    }
    await u.checkRefreshContent(), p.stopPropagation(), u.closeOnSelect && (u.closeMenu(), (A = u.button) == null || A.focus());
  }), C.appendChild(y), t.appendChild(C), C;
}
class ze extends Fe {
  get closeOnSelect() {
    return this.config.closeOnSelect === void 0 && (this.buttonType !== "check" ? this.config.closeOnSelect = !0 : this.config.closeOnSelect = !1), this.config.closeOnSelect;
  }
  setSelected(e, t) {
    this._selectedItems && (this._selectedItems[e] = t);
  }
  async getContent() {
    var e, t;
    const s = (e = document.activeElement) == null ? void 0 : e.id, n = M("<menu></menu>");
    this._content = n;
    const a = await this.getMenu();
    this._menuItems = a, this._selectedItems || (this._selectedItems = {}, this._menuItems.forEach((l) => {
      l.selected !== void 0 && l.selected !== null && (this._selectedItems[l.id] = l.selected);
    }));
    const r = self.crypto.randomUUID(), o = a.map((l) => Ge.apply(this, [l, typeof this.buttonType == "function" ? this.buttonType() : this.buttonType, n, a, r, this._selectedItems, l.plugin]));
    return o.forEach((l, c, d) => {
      const f = l.querySelector("button");
      let h = d[c + 1], u = d[c - 1];
      c === d.length - 1 && (h = d[0]), c === 0 && (u = d[d.length - 1]), f.dataNext = h == null ? void 0 : h.querySelector("button"), f.dataPrev = u == null ? void 0 : u.querySelector("button");
    }), this._firstItem = (t = o[0]) == null ? void 0 : t.querySelector("button"), s && setTimeout(() => {
      var l;
      (l = document.getElementById(s)) == null || l.focus();
    }, 10), n;
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
const je = Object.freeze({
  DISABLED: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5
});
je.INFO;
class j {
  constructor({
    id: e,
    name: t,
    groupId: s = "",
    language: n = "",
    selected: a = !1
  }) {
    this._id = e, this._name = t, this._groupId = s, this._lang = n, this._selected = a;
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
const Xe = "@asicupv/paella-video-plugins", Ye = "2.0.2", Ke = { ".": "./dist/paella-video-plugins.js", "./paella-video-plugins.css": "./dist/paella-video-plugins.css", "./src/": "./src/" }, Ze = "More video formats for Paella Player", Je = "./dist/paella-video-plugins.js", et = "module", tt = "./dist/paella-video-plugins.js", it = ["dist/paella-video-plugins.css", "dist/paella-video-plugins.js", "dist/paella-video-plugins.js.map", "dist/paella-video-plugins.umd.cjs", "dist/paella-video-plugins.umd.cjs.map", "dist/hls*"], st = { dev: "vite build --watch", build: "vite build --emptyOutDir" }, nt = { type: "git", url: "git+https://github.com/polimediaupv/paella-player.git" }, at = ["paella", "player", "zoom", "slide", "presentation", "blackboard", "whiteboard", "hls"], rt = "Fernando Serrano Carpena <ferserc1@gmail.com>", ot = "SEE LICENSE IN license.txt", lt = { url: "https://github.com/polimediaupv/paella-video-plugins/issues" }, ut = "https://github.com/polimediaupv/paella-video-plugins#readme", dt = { vite: "^6.0.11" }, ct = { "hls.js": "^1.5.20", "@asicupv/paella-core": "^2.0.3" }, ht = {
  name: Xe,
  version: Ye,
  exports: Ke,
  description: Ze,
  main: Je,
  type: et,
  module: tt,
  files: it,
  scripts: st,
  repository: nt,
  keywords: at,
  author: rt,
  license: ot,
  bugs: lt,
  homepage: ut,
  devDependencies: dt,
  dependencies: ct
};
let O = null;
class P extends Re {
  static Get() {
    return O || (O = new P()), O;
  }
  get moduleName() {
    return "paella-video-plugins";
  }
  get moduleVersion() {
    return ht.version;
  }
}
const V = {
  autoStartLoad: !0,
  startPosition: -1,
  capLevelToPlayerSize: !0,
  debug: !1,
  defaultAudioCodec: void 0,
  initialLiveManifestSize: 1,
  maxBufferLength: 6,
  maxMaxBufferLength: 6,
  maxBufferSize: 600 * 1e3 * 1e3,
  maxBufferHole: 0.5,
  lowBufferWatchdogPeriod: 0.5,
  highBufferWatchdogPeriod: 3,
  nudgeOffset: 0.1,
  nudgeMaxRetry: 3,
  maxFragLookUpTolerance: 0.2,
  enableWorker: !0,
  enableSoftwareAES: !0,
  manifestLoadingTimeOut: 1e4,
  manifestLoadingMaxRetry: 1,
  manifestLoadingRetryDelay: 500,
  manifestLoadingMaxRetryTimeout: 64e3,
  startLevel: void 0,
  levelLoadingTimeOut: 1e4,
  levelLoadingMaxRetry: 4,
  levelLoadingRetryDelay: 500,
  levelLoadingMaxRetryTimeout: 64e3,
  fragLoadingTimeOut: 2e4,
  fragLoadingMaxRetry: 6,
  fragLoadingRetryDelay: 500,
  fragLoadingMaxRetryTimeout: 64e3,
  startFragPrefetch: !1,
  appendErrorMaxRetry: 3,
  enableWebVTT: !0,
  enableCEA708Captions: !0,
  stretchShortVideoTrack: !1,
  maxAudioFramesDrift: 1,
  forceKeyFrameOnDiscontinuity: !0,
  abrEwmaFastLive: 5,
  abrEwmaSlowLive: 9,
  abrEwmaFastVoD: 4,
  abrEwmaSlowVoD: 15,
  abrEwmaDefaultEstimate: 5e5,
  abrBandWidthFactor: 0.95,
  abrBandWidthUpFactor: 0.7,
  minAutoBitrate: 0
}, X = {
  withCredentials: !0,
  requestHeaders: {
    "Access-Control-Allow-Headers": "Content-Type, Accept, X-Requested-With",
    "Access-Control-Allow-Origin": "http://localhost:8000",
    "Access-Control-Allow-Credentials": "true"
  }
}, _ = {
  UNSUPPORTED: 0,
  MEDIA_SOURCE_EXTENSIONS: 1,
  NATIVE: 2
};
let H = null;
async function W() {
  return H || (console.debug("Loading HLS.js"), H = (await import("./hls.js")).default), H;
}
async function b(i = !1) {
  const e = await W(), t = document.createElement("video");
  return t.canPlayType("application/vnd.apple.mpegurl") && i ? _.NATIVE : e.isSupported() ? _.MEDIA_SOURCE_EXTENSIONS : t.canPlayType("application/vnd.apple.mpegurl") ? _.NATIVE : _.UNSUPPORTED;
}
const pt = async (i, e, t, s, n) => {
  var l, c;
  const a = await W();
  n.withCredentials && (s.xhrSetup = function(d, f) {
    d.withCredentials = n.withCredentials;
    for (const h in n.requestHeaders) {
      const u = n.requestHeaders[h];
      d.setRequestHeader(h, u);
    }
  }), s.autoStartLoad = !0;
  const r = new a(s), o = ((c = (l = e == null ? void 0 : e.sources) == null ? void 0 : l.hls) == null ? void 0 : c.length) > 0 && e.sources.hls[0];
  return [r, new Promise((d, f) => {
    let h = !1;
    r.on(a.Events.LEVEL_SWITCHED, (y, p) => {
      i.log.debug(`HLS: quality level switched to ${p.level}`), h || (r.currentLevel = -1, h = !0), Z(i, I.VIDEO_QUALITY_CHANGED, {});
    }), r.on(a.Events.ERROR, (y, p) => {
      if (p.fatal)
        switch (p.type) {
          case a.ErrorTypes.NETWORK_ERROR:
            p.details === a.ErrorDetails.MANIFEST_LOAD_ERROR ? f(Error("hlsVideoFormatPlugin: unrecoverable error in HLS player. The video is not available")) : (i.log.warn("hlsVideoFormatPlugin: Fatal network error. Try to recover"), r.startLoad());
            break;
          case a.ErrorTypes.MEDIA_ERROR:
            i.log.warn("hlsVideoFormatPlugin: Fatal media error encountered. Try to recover"), r.recoverMediaError();
            break;
          default:
            r.destroy(), f(Error("hlsVideoFormat: Fatal error. Can not recover"));
        }
      else
        i.log.warn("HLS: error"), i.log.warn(p.details);
    }), r.on(a.Events.LEVEL_SWITCHING, () => {
      i.log.debug("HLS media attached");
    }), r.on(a.Events.MEDIA_ATTACHED, () => {
      i.log.debug("HLS media attached");
    }), r.on(a.Events.MEDIA_DETACHING, () => {
      i.log.debug("HLS media detaching");
    }), r.on(a.Events.MEDIA_DETACHED, () => {
      i.log.debug("HLS media detached");
    }), r.on(a.Events.MANIFEST_PARSED, () => {
      i.log.debug("HLS manifest parsed"), r.startLoad(-1);
    });
    const u = Math.floor(Math.random() * 1e11), C = o.src + (s.enableCache ? /\?/.test(o.src) ? `&cache=${u}` : `?cache=${u}` : "");
    r.loadSource(C), r.attachMedia(t);
    let S = !1;
    r._videoEventListener = () => {
      S = !0, d();
    }, t.addEventListener("canplay", r._videoEventListener), setTimeout(() => {
      S || t.play();
    }, 1e3);
  })];
};
class G extends ae {
  constructor(e, t, s, n) {
    super(e, t, n, s), this._config = this._config || {
      audioTrackLabel: s.audioTrackLabel || "name",
      enableCache: s.enableCache || !1
    };
    for (const a in V)
      this._config[a] = V[a];
    for (const a in s.hlsConfig)
      this._config[a] = s.hlsConfig[a];
    this._cors = {};
    for (const a in X)
      this._cors[a] = X[a];
    for (const a in s.corsConfig)
      this._cors[a] = s.corsConfig[a];
    this._ready = !1, this._autoQuality = !0, this._forceNative = s.forceNative || !1;
  }
  get autoQuality() {
    return this._autoQuality;
  }
  get forceNative() {
    return this._forceNative;
  }
  async loadStreamData(e) {
    var s, n;
    if (await b(this.forceNative) === _.NATIVE) {
      e.sources.mp4 = e.sources.hls;
      const a = await super.loadStreamData(e), r = await this.getAudioTracks();
      return this._currentAudioTrack = r.find((o) => o.selected), this._autoQuality = new L({
        label: "auto",
        shortLabel: "auto",
        index: -1,
        width: 1,
        height: 1,
        isAuto: !0
      }), this._currentQuality = this._autoQuality, this.saveDisabledProperties(this.video), this._endedCallback = this._endedCallback || (() => {
        typeof this._videoEndedCallback == "function" && this._videoEndedCallback();
      }), this.video.addEventListener("ended", this._endedCallback), a;
    } else {
      this.player.log.debug("Loading HLS stream");
      const a = ((n = (s = e == null ? void 0 : e.sources) == null ? void 0 : s.hls) == null ? void 0 : n.length) && e.sources.hls[0];
      this._config.audioTrackLabel = (a == null ? void 0 : a.audioLabel) || this._config.audioTrackLabel;
      const [r, o] = await pt(this.player, e, this.video, this._config, this._cors);
      this._hls = r, await o, this.video.pause(), this._autoQuality = new L({
        label: "auto",
        shortLabel: "auto",
        index: -1,
        width: 1,
        height: 1,
        isAuto: !0
      }), this._currentQuality = this._autoQuality;
      const l = await this.getAudioTracks();
      this._currentAudioTrack = l.find((c) => c.selected), this.saveDisabledProperties(this.video), this._endedCallback = this._endedCallback || (() => {
        typeof this._videoEndedCallback == "function" && this._videoEndedCallback();
      }), this.video.addEventListener("ended", this._endedCallback);
    }
  }
  async duration() {
    var e;
    if (this._videoEnabled) {
      await this.waitForLoaded();
      let t = this.video.duration;
      return t === 1 / 0 && (t = ((e = this._hls) == null ? void 0 : e.liveSyncPosition) || 0), t;
    } else
      return this._disabledProperties.duration;
  }
  async waitForLoaded() {
    if (await b(this.forceNative) === _.NATIVE)
      return super.waitForLoaded();
    await new Promise((t, s) => {
      const n = () => {
        this._ready && t(), this.video.readyState >= 2 ? (this._ready = !0, t()) : setTimeout(() => n(), 200);
      };
      n();
    });
  }
  async getQualities() {
    const e = [];
    return e.push(this._autoQuality), await b(this.forceNative) === _.MEDIA_SOURCE_EXTENSIONS && (this._hls.levels.forEach((s, n) => {
      e.push(new L({
        index: n,
        // TODO: should be level.id??
        label: `${s.width}x${s.height}`,
        shortLabel: `${s.height}p`,
        width: s.width,
        height: s.height
      }));
    }), e.sort((s, n) => s.res.h - n.res.h)), e;
  }
  async setQuality(e) {
    const t = await b(this.forceNative);
    if (this._videoEnabled) {
      if (!(e instanceof L))
        throw Error("Invalid parameter setting video quality. VideoQualityItem object expected.");
      t === _.MEDIA_SOURCE_EXTENSIONS ? (this._currentQuality = e, this._hls.currentLevel = e.index) : this.player.log.warn("Could not set video quality of HLS stream, because the HLS support of this browser is native.");
    }
  }
  get currentQuality() {
    return this._currentQuality;
  }
  async supportsMultiaudio() {
    var t;
    await this.waitForLoaded();
    const e = await b(this.forceNative);
    return e === _.MEDIA_SOURCE_EXTENSIONS ? this._hls.audioTracks.length > 1 : e === _.NATIVE ? ((t = this.video.audioTracks) == null ? void 0 : t.length) > 1 : !1;
  }
  async getAudioTracks() {
    await this.waitForLoaded();
    const e = this._config.audioTrackLabel || "name", t = await b(this.forceNative);
    return t === _.MEDIA_SOURCE_EXTENSIONS ? this._hls.audioTracks.map((n) => new j({
      id: n.id,
      name: n[e],
      language: n.lang,
      selected: this._hls.audioTrack === n.id
    })) : t === _.NATIVE ? Array.from(this.video.audioTracks).map((n) => new j({
      id: n.id,
      name: n.label,
      language: n.language,
      selected: n.enabled
    })) : null;
  }
  async setCurrentAudioTrack(e) {
    await this.waitForLoaded();
    const s = (await this.getAudioTracks()).find((a) => a.id === e.id), n = await b(this.forceNative);
    return n === _.MEDIA_SOURCE_EXTENSIONS && s ? this._hls.audioTrack = s.id : n === _.NATIVE && s && Array.from(this.video.audioTracks).forEach((a) => {
      a.id === s.id ? a.enabled = !0 : a.enabled = !1;
    }), this._currentAudioTrack = s, s;
  }
  get currentAudioTrack() {
    return this._currentAudioTrack;
  }
  async clearStreamData() {
    this.video.removeEventListener("canplay", this._hls._videoEventListener), this.video.src = "", this._hls.destroy(), this._ready = !1;
  }
}
class re extends q {
  getPluginModuleInstance() {
    return P.Get();
  }
  get name() {
    return super.name || "es.upv.paella.hlsVideoFormat";
  }
  get streamType() {
    return "hls";
  }
  async isCompatible(e) {
    const { hls: t } = e.sources;
    return t && await b();
  }
  async getVideoInstance(e, t) {
    return new G(this.player, e, this.config, t);
  }
  getCompatibleFileExtensions() {
    return ["m3u8"];
  }
  getManifestData(e) {
    return {
      hls: e.map((t) => ({
        src: t,
        mimetype: "video/mp4"
      }))
    };
  }
}
const gt = async (i, e, t, s, n) => {
  var l, c;
  const a = await W();
  n.withCredentials && (s.xhrSetup = function(d, f) {
    d.withCredentials = n.withCredentials;
    for (const h in n.requestHeaders) {
      const u = n.requestHeaders[h];
      d.setRequestHeader(h, u);
    }
  });
  const r = new a(s), o = ((c = (l = e == null ? void 0 : e.sources) == null ? void 0 : l.hlsLive) == null ? void 0 : c.length) > 0 && e.sources.hlsLive[0];
  return s.initialQualityLevel !== void 0 && s.initialQualityLevel, [r, new Promise((d, f) => {
    let h = !1;
    r.on(a.Events.LEVEL_SWITCHED, (S, y) => {
      (void 0).player.log.debug(`HLS: quality level switched to ${y.level}`), h || (r.currentLevel = -1, h = !0), Z(i, I.VIDEO_QUALITY_CHANGED, {});
    }), r.on(a.Events.ERROR, (S, y) => {
      if (y.fatal)
        switch (y.type) {
          case a.ErrorTypes.NETWORK_ERROR:
            y.details === a.ErrorDetails.MANIFEST_LOAD_ERROR ? f(Error("hlsVideoFormatPlugin: unrecoverable error in HLS player. The video is not available")) : (i.log.warn("hlsVideoFormatPlugin: Fatal network error. Try to recover"), r.startLoad());
            break;
          case a.ErrorTypes.MEDIA_ERROR:
            i.log.warn("hlsVideoFormatPlugin: Fatal media error encountered. Try to recover"), r.recoverMediaError();
            break;
          default:
            r.destroy(), f(Error("hlsVideoFormat: Fatal error. Can not recover"));
        }
    }), r.on(a.Events.MANIFEST_PARSED, () => {
      s.autoStartLoad || r.autoStartLoad();
    });
    const u = Math.floor(Math.random() * 1e11), C = o.src + (s.enableCache ? /\?/.test(o.src) ? `&cache=${u}` : `?cache=${u}` : "");
    r.loadSource(C), r.attachMedia(t), r._videoEventListener = () => {
      d();
    }, t.addEventListener("canplay", r._videoEventListener);
  })];
};
class mt extends G {
  async loadStreamData(e) {
    if (await b() === _.NATIVE)
      return e.sources.hls = e.sources.hlsLive, super.loadStreamData(e);
    {
      this.player.log.debug("Loading HLS stream");
      const [s, n] = await gt(this.player, e, this.video, this._config, this._cors);
      this._hls = s, await n, this._autoQuality = new L({
        label: "auto",
        shortLabel: "auto",
        index: -1,
        width: 1,
        height: 1,
        isAuto: !0
      }), this._currentQuality = this._autoQuality;
      const a = await this.getAudioTracks();
      this._currentAudioTrack = a.find((r) => r.selected), this.saveDisabledProperties(this.video);
    }
  }
}
class oe extends q {
  getPluginModuleInstance() {
    return P.Get();
  }
  get name() {
    return super.name || "es.upv.paella.hlsLiveVideoFormat";
  }
  get streamType() {
    return "hlsLive";
  }
  async isCompatible(e) {
    const t = await b(), { hlsLive: s } = e.sources;
    return s && t;
  }
  async getVideoInstance(e, t) {
    return new mt(this.player, e, this.config, t);
  }
}
const _t = `<svg width="100%" height="100%" viewBox="0 0 39 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <path d="M37,9.5C37,5.913 34.087,3 30.5,3L8.5,3C4.913,3 2,5.913 2,9.5L2,22.5C2,26.087 4.913,29 8.5,29L30.5,29C34.087,29 37,26.087 37,22.5L37,9.5ZM18.97,21.884C18.97,21.983 18.891,22.125 18.733,22.308C17.111,24.188 15.102,25.128 12.706,25.128C10.21,25.128 8.214,24.217 6.716,22.395C5.319,20.698 4.62,18.577 4.62,16.031C4.62,13.486 5.331,11.356 6.754,9.642C8.268,7.795 10.269,6.872 12.756,6.872C15.277,6.872 17.227,7.725 18.608,9.43C18.741,9.605 18.808,9.75 18.808,9.867C18.808,10.008 18.587,10.426 18.147,11.121C17.706,11.816 17.439,12.163 17.348,12.163C17.24,12.163 16.986,11.959 16.587,11.551C16.096,11.052 15.634,10.678 15.202,10.428C14.486,10.021 13.696,9.817 12.831,9.817C11.184,9.817 9.902,10.445 8.987,11.701C8.172,12.824 7.765,14.238 7.765,15.944C7.765,17.649 8.168,19.076 8.975,20.224C9.89,21.513 11.167,22.158 12.806,22.158C13.621,22.158 14.407,21.954 15.164,21.547C15.663,21.28 16.171,20.902 16.687,20.411C17.119,20.003 17.356,19.8 17.398,19.8C17.448,19.8 17.722,20.13 18.221,20.792C18.721,21.453 18.97,21.817 18.97,21.884ZM34.38,21.884C34.38,21.983 34.301,22.125 34.143,22.308C32.521,24.188 30.512,25.128 28.116,25.128C25.62,25.128 23.624,24.217 22.126,22.395C20.729,20.698 20.03,18.577 20.03,16.031C20.03,13.486 20.741,11.356 22.164,9.642C23.678,7.795 25.678,6.872 28.166,6.872C30.686,6.872 32.637,7.725 34.018,9.43C34.151,9.605 34.218,9.75 34.218,9.867C34.218,10.008 33.997,10.426 33.556,11.121C33.116,11.816 32.849,12.163 32.758,12.163C32.65,12.163 32.396,11.959 31.997,11.551C31.506,11.052 31.044,10.678 30.612,10.428C29.896,10.021 29.106,9.817 28.241,9.817C26.594,9.817 25.312,10.445 24.397,11.701C23.582,12.824 23.174,14.238 23.174,15.944C23.174,17.649 23.578,19.076 24.385,20.224C25.3,21.513 26.577,22.158 28.216,22.158C29.031,22.158 29.817,21.954 30.574,21.547C31.073,21.28 31.581,20.902 32.096,20.411C32.529,20.003 32.766,19.8 32.808,19.8C32.858,19.8 33.132,20.13 33.631,20.792C34.13,21.453 34.38,21.817 34.38,21.884Z" />
</svg>`;
class le extends ze {
  getPluginModuleInstance() {
    return P.Get();
  }
  get name() {
    return super.name || "es.upv.paella.hlsCaptionsSelectorPlugin";
  }
  getAriaLabel() {
    return "Select captions";
  }
  getDescription() {
    return this.getAriaLabel();
  }
  async isEnabled() {
    const e = await super.isEnabled();
    return this._hls = this.player.videoContainer.streamProvider.mainAudioPlayer._hls, this._hls && e;
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "captionsIcon") || _t;
    const e = this._hls.subtitleTracks || [];
    this._tracks = e, this._hls.subtitleTrack, this._disabledTrack = {
      id: -1,
      title: "Disabled",
      index: -1,
      selected: !0
    }, this._selected = null, e.length == 0 && this.disable();
  }
  async getMenu() {
    const e = [{
      id: -1,
      title: "Disabled",
      index: -1,
      selected: this._selected === null
    }];
    return this._tracks.forEach((t, s) => {
      e.push({
        id: t.attrs.LANGUAGE || t.attrs.NAME,
        title: t.attrs.NAME || t.attrs.LANGUAGE,
        index: s,
        selected: t.language === this._selected
      });
    }), e;
  }
  get buttonType() {
    return "radio";
  }
  itemSelected(e) {
    var t;
    this._hls.subtitleTrack = e.index, this._selected = (t = this._tracks.find((s) => s.index === e.index)) == null ? void 0 : t.language;
  }
}
class ft extends De {
  async getQualities() {
    return this._qualities || (this._qualities = this._sources.map((e, t) => new L({
      index: t,
      label: `${e.res.w}x${e.res.h}`,
      shortLabel: `${e.res.h}p`,
      width: e.res.w,
      height: e.res.h,
      src: e.src
    }))), this._qualities;
  }
  async setQuality(e) {
    if (!(e instanceof L))
      throw new Error("Invalid parameter setting video quality");
    this.player.log.debug(`org.opencast.paella.mp4MultiQualityVideoFormat: Change video quality to ${e.shortLabel}`), this._currentQuality = e;
    const t = this.video.currentTime, s = this.video.playbackRate;
    this.clearStreamData(), this.video.src = e.src, this.video.currentTime = t, this.video.playbackRate = s, this.video.addEventListener("ended", this._endedCallback), await new Promise((n) => {
      const a = () => {
        this._ready = !0, this.video.pause(), this.video.removeEventListener("canplay", a), n(null);
      };
      this.video.addEventListener("canplay", a);
    });
  }
  get currentQuality() {
    return this._currentQuality;
  }
  async loadStreamData(e = null) {
    if (this._sources = null, this._sources = e.sources.mp4, this._sources.sort((t, s) => Number(t.res.w) - Number(s.res.w)), !this._qualities) {
      const t = await this.getQualities(), s = [window.screen.width, window.screen.height].map((l) => l * window.devicePixelRatio);
      let n = Math.min(s[0], s[1]), a = Math.max(s[0], s[1]);
      /Mobi/i.test(window.navigator.userAgent) && (n = Math.max(n, 900), a = Math.max(n, 1600));
      let o = 0;
      for (let l = 1; l < this._sources.length; l += 1) {
        const c = this._sources[l], d = Math.min(c.res.w, c.res.h), f = Math.max(c.res.w, c.res.h);
        d <= n && f <= a && (o = l);
      }
      this._currentQuality = t[o];
    }
    this._currentSource = this._sources[this._currentQuality.index], await super.loadStreamData(e);
  }
}
let ue = class extends q {
  getPluginModuleInstance() {
    return P.Get();
  }
  get streamType() {
    return "mp4";
  }
  get name() {
    return "es.upv.paella.mp4MultiQualityVideoFormat";
  }
  isCompatible(e) {
    var s;
    const { mp4: t } = e.sources;
    return t && ke.supportsVideoType((s = t[0]) == null ? void 0 : s.mimetype);
  }
  async getVideoInstance(e, t) {
    return new ft(this.player, e, t, this.config);
  }
};
function bt() {
  return require.context("./plugins", !0, /\.js/);
}
const yt = [
  {
    plugin: re,
    config: {
      enabled: !1
    }
  },
  {
    plugin: oe,
    config: {
      enabled: !1
    }
  },
  {
    plugin: le,
    config: {
      enabled: !1
    }
  },
  {
    plugin: ue,
    config: {
      enabled: !1
    }
  }
], Et = yt, Ct = re, wt = oe, Tt = le, Lt = ue, St = {
  HlsVideo: G,
  getHlsSupport: b,
  defaultHlsConfig: V,
  HlsSupport: _
};
export {
  Tt as HlsCaptionsSelectorButtonPlugin,
  wt as HlsLiveVideoFormatPlugin,
  Ct as HlsVideoFormatPlugin,
  Lt as Mp4MultiQualityVideoFormatPlugin,
  Et as allPlugins,
  bt as default,
  St as hlsTools,
  yt as videoPlugins
};
//# sourceMappingURL=paella-video-plugins.js.map
