var W = (t) => {
  throw TypeError(t);
}, Z = (t, e, n) => e.has(t) || W("Cannot " + n), c = (t, e, n) => (Z(t, e, "read from private field"), n ? n.call(t) : e.get(t)), S = (t, e, n) => e.has(t) ? W("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), x = (t, e, n, i) => (Z(t, e, "write to private field"), e.set(t, n), n);
const v = Object.freeze({
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
function b(t, e, n, i = !0) {
  return t.__eventListeners__ = t.__eventListeners__ || {}, Array.isArray(e) || (e = [e]), e.forEach((r) => {
    t.__eventListeners__[r] = t.__eventListeners__[r] || [], t.__eventListeners__[r].push({
      callback: n,
      unregisterOnUnload: i
    });
  }), n;
}
function le(t) {
  return new Promise((e, n) => {
    fetch(t).then((i) => i.text()).then((i) => {
      e(i);
    }).catch((i) => n(i));
  });
}
function ce(t) {
  const e = new URLSearchParams(window.location.search);
  return e.has(t) ? e.get(t) : null;
}
function ue(t) {
  const e = window.location.hash.replace("#", "?"), n = new URLSearchParams(e);
  return n.has(t) ? n.get(t) : null;
}
function V(t, e) {
  const n = e || "/";
  return t = t.map((i, r) => (r && (i = i.replace(new RegExp("^" + n), "")), r !== t.length - 1 && (i = i.replace(new RegExp(n + "$"), "")), i)), t.join(n);
}
function Y(t) {
  return new RegExp("^([a-z]+://|//)", "i").test(t) || /^\//.test(t);
}
function q(t) {
  try {
    return new URL(t).pathname.split("/").pop();
  } catch {
    return t.split("/").pop();
  }
}
function de(t) {
  return t.split(".").reduce((e, n, i, r) => i < r.length - 1 ? e !== "" ? `${e}.${n}` : n : e, "");
}
function he(t) {
  const e = (n) => {
    const i = n.split("/").reduce((r, s, o, l) => o < l.length - 1 ? r !== "" ? `${r}/${s}` : s : r, "");
    return (n[0] === "/" ? `/${i}` : i) + "/";
  };
  try {
    const n = new URL(t);
    return n.origin + e(n.pathname);
  } catch {
    return e(t);
  }
}
function pe(t) {
  return q(t).split(".").pop();
}
function ge(t, e) {
  return Y(e) ? e : V([t.manifestUrl, e]);
}
function me(t) {
  t.__hideTimerPaused__ = !0;
}
function fe(t) {
  t.__hideTimerPaused__ = !1;
}
function ve(t, e = "hideUiTime") {
  var n;
  t.__hideTimer__ = null;
  const i = async () => t.__hideTimerPaused__ ? (t.log.debug("UI not hidden because the auto hide timer is paused"), !1) : r() ? (t.log.debug("UI not hidden because there is a focused element"), !1) : (await t.hideUserInterface(), !0);
  (n = t.config.ui) != null && n.hideOnMouseLeave && t.containerElement.addEventListener("mouseleave", () => {
    i();
  });
  const r = () => {
    const o = document.activeElement;
    return (t.playbackBar.element.contains(o) || t.videoContainer.element.contains(o)) && [
      "input",
      "textarea",
      "button"
    ].find((l) => o.tagName.toLowerCase(l)) !== -1;
  }, s = async () => {
    t.__hideTimer__ && clearTimeout(t.__hideTimer__), await t.showUserInterface(), t.__hideTimer__ = setTimeout(async () => {
      t.__hideTimer__ = null, i() || s();
    }, t[e]);
  };
  t.containerElement.addEventListener("mousemove", async (o) => {
    s();
  }), b(t, v.PLAY, async () => {
    s();
  }), b(t, v.PAUSE, async () => {
    await t.showUserInterface();
  }), b(t, v.ENDED, async () => {
    await t.showUserInterface();
  }), document.addEventListener("keydown", async () => {
    s();
  });
}
function _e(t) {
  t.__hideTimer__ && (clearTimeout(t.__hideTimer__), delete t.__hideTimer__);
}
function ye(t) {
  const e = Math.floor(t / 60 / 60), n = Math.floor(t / 60) - e * 60, i = Math.floor(t % 60);
  return (e > 0 ? e.toString().padStart(2, "0") + ":" : "") + n.toString().padStart(2, "0") + ":" + i.toString().padStart(2, "0");
}
function be(t) {
  const e = /^(?:(\d+):){0,1}(\d+):(\d+)(\.\d+)?$/.exec(t);
  if (e) {
    const n = e[1] !== void 0 ? Number(e[1]) : 0, i = Number(e[2]), r = Number(e[3]);
    return n * 3600 + i * 60 + r;
  }
  return null;
}
function Ce(t) {
  const e = /^(?:(\d+):){0,1}(\d+):(\d+)\.(\d+)?$/.exec(t);
  if (e) {
    const n = e[1] !== void 0 ? Number(e[1]) : 0, i = Number(e[2]), r = Number(e[3]), s = e[4] && Number(e[4]) || 0;
    return n * 36e5 + i * 6e4 + r * 1e3 + s;
  }
  return null;
}
function K(t, e, n = 365) {
  let i = /* @__PURE__ */ new Date();
  i.setTime(i.getTime() + n * 24 * 60 * 60 * 1e3);
  let r = `expires=${i.toUTCString()}`;
  document.cookie = `${t}=${e};${r};path=/;SameSite=None;` + (/Apple/.test(navigator.vendor) ? "" : "Secure;");
}
function Ee(t, e, n, i, r = 365) {
  t.cookieConsent.getConsentForType(e) && K(n, i, r);
}
function D(t) {
  let e = t + "=", n = decodeURIComponent(document.cookie).split(";");
  for (let i = 0; i < n.length; ++i) {
    let r = n[i];
    for (; r.charAt(0) == " "; )
      r = r.substring(1);
    if (r.indexOf(e) == 0)
      return r.substring(e.length, r.length);
  }
  return "";
}
function Le(t) {
  const e = D(t), n = Number(e);
  return e !== "" && !isNaN(n) ? n : null;
}
function Te(t) {
  try {
    return JSON.parse(D(t));
  } catch {
    return null;
  }
}
function we(t, e = !0) {
  return new Promise((n) => {
    const i = document.createElement("link");
    i.setAttribute("rel", "stylesheet"), i.setAttribute("href", t), i.onload = () => n(i);
    const r = document.getElementsByTagName("head")[0];
    e && r.appendChild(i), n();
  });
}
function Pe(t) {
  document.getElementsByTagName("head")[0].removeChild(t);
}
function M(t, e, n = !0) {
  for (const i in e) {
    const r = t[i];
    let s = e[i];
    n && Array.isArray(r) && Array.isArray(s) ? (r.forEach((o) => {
      s = s.filter((l) => typeof o == "object" && typeof l == "object" && o.id === l.id ? (M(o, l, n), !1) : !0);
    }), s.forEach((o) => {
      r.push(o);
    })) : typeof r == "object" && s ? M(r, s, n) : t[i] = e[i];
  }
}
function J(t, { excludedTags: e = null } = {}) {
  const n = document.createElement("div");
  n.innerHTML = t;
  const i = ["script"];
  return e && i.push(...e), i.flatMap((r) => Array.from(n.getElementsByTagName(r))).forEach((r) => {
    r.parentElement.removeChild(r);
  }), n.innerHTML;
}
let P = null;
function Se(t) {
  if (!t) return !1;
  P || (P = document.createElement("video"));
  let e = P.canPlayType(t);
  if (e === "maybe" || e === "probably")
    return !0;
  if (/video\/mp4/i.test(t))
    return e = P.canPlayType("video/mp4"), e === "maybe" || e === "probably";
}
const Ie = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clearAutoHideTimer: _e,
  getCookie: D,
  getFileExtension: pe,
  getHashParameter: ue,
  getJSONCookie: Te,
  getNumericCookie: Le,
  getUrlFileName: q,
  getUrlParameter: ce,
  isAbsoluteUrl: Y,
  joinPath: V,
  loadStyle: we,
  loadSvgIcon: le,
  mergeObjects: M,
  pauseAutoHideUiTimer: me,
  removeExtension: de,
  removeFileName: he,
  resolveResourcePath: ge,
  resumeAutoHideUiTimer: fe,
  sanitizeHTML: J,
  secondsToTime: ye,
  setCookie: K,
  setCookieIfAllowed: Ee,
  setupAutoHideUiTimer: ve,
  supportsVideoType: Se,
  timeToMilliseconds: Ce,
  timeToSeconds: be,
  unloadStyle: Pe
}, Symbol.toStringTag, { value: "Module" }));
var I;
class Q {
  constructor(e) {
    S(this, I, null), x(this, I, e);
  }
  get player() {
    return c(this, I);
  }
}
I = /* @__PURE__ */ new WeakMap();
function u(t, e = null) {
  const n = document.createElement("div");
  n.innerHTML = t;
  const i = n.children[0];
  return e && e.appendChild(i), i;
}
let X = class extends Q {
  constructor(e, n) {
    super(e), this._name = n;
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
};
class Ae extends Q {
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
class ee extends X {
  constructor(e, n, i) {
    super(e, n, i), this.__uiPlugin = !0;
  }
  async getDictionaries() {
    return null;
  }
}
const z = () => {
  const t = document.createElement("span");
  return t.classList.add("side-container"), t.classList.add("hidden"), t;
};
class Ne {
  onIconChanged(e, n, i) {
  }
  onTitleChanged(e, n, i) {
  }
  onStateChanged(e, n, i, r, s) {
  }
}
var p, g, A;
class Ue extends ee {
  constructor() {
    super(...arguments), S(this, p, null), S(this, g, null), S(this, A, []);
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
    if (e instanceof Ne)
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
    var n;
    if (typeof e == "string" && (e = J(e)), this._icon = e, e && this._button instanceof HTMLElement) {
      const i = this._button.querySelector("i") || u("<i></i>", this._button);
      i.innerHTML = e;
    } else if (this._button instanceof HTMLElement) {
      const i = this._button.querySelector("i");
      i && this._button.removeChild(i);
    }
    (n = this._observer) != null && n.onIconChanged && this._observer.onIconChanged(this, this._icon, e);
  }
  get title() {
    return this._title || "";
  }
  set title(e) {
    var n;
    if (this._title = e, e && this._button instanceof HTMLElement) {
      const i = this._button.querySelector("span") || u(`<span class="button-title-${this.titleSize}"></span>`, this._button);
      i.innerHTML = e;
    } else if (this._button instanceof HTMLElement) {
      const i = this._button.querySelector("span");
      i && this._button.removeChild(i);
    }
    (n = this._observer) != null && n.onTitleChanged && this._observer.onTitleChanged(this, this._title, e);
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
    return c(this, p) || (x(this, p, z()), this.container.appendChild(c(this, p))), c(this, p);
  }
  get leftSideContainerPresent() {
    return c(this, p) !== null;
  }
  get rightSideContainer() {
    return c(this, g) || (x(this, g, z()), this.container.appendChild(c(this, g))), c(this, g);
  }
  get rightSideContainerPresent() {
    return c(this, g) !== null;
  }
  get stateText() {
    return null;
  }
  get stateIcon() {
    return null;
  }
  setState({ text: e = null, icon: n = null } = {}) {
    var i, r;
    const s = this._statusText, o = this._statusIcon;
    this._statusText = e, this._statusIcon = n, c(this, A).forEach((l) => l(this)), this._statusIcon && (this.icon = this._statusIcon), this._statusText && (this.title = this._statusText), (r = (i = this._observer) == null ? void 0 : i.onStateChanged) == null || r.call(i, this, s, e, o, n);
  }
  onStateChange(e) {
    typeof e == "function" ? c(this, A).push(e) : this.player.log.warn("Invalid callback for ButtonPlugin.onStateChange");
  }
  async action(e, n = null) {
  }
  onResize({ width: e, height: n }) {
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
p = /* @__PURE__ */ new WeakMap(), g = /* @__PURE__ */ new WeakMap(), A = /* @__PURE__ */ new WeakMap();
class te extends ee {
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
        return U.LEFT;
      case "center":
        return U.CENTER;
      case "right":
        return U.RIGHT;
      default:
        throw new Error(`Invalid CanvasButtonPlugin side set: ${this.side}`);
    }
  }
  async action(e) {
    this.player.log.warn(`Action not implemented in canvas button plugin ${this.name}`);
  }
}
const U = Object.freeze({
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right"
});
class ke extends Ue {
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
  async action(e, n) {
    super.action(e, n), this.parentPopUp = n, await this.showPopUp();
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
    var e, n;
    const i = ((e = this.config.closeActions) == null ? void 0 : e.clickOutside) ?? !0, r = ((n = this.config.closeActions) == null ? void 0 : n.closeButton) ?? !1;
    return {
      clickOutside: i,
      closeButton: r
    };
  }
  get currentContent() {
    return this._currentContent;
  }
  async getContent() {
    return u("<p>Pop Up Button Plugin Content</p>");
  }
  async checkRefreshContent() {
    if (this.refreshContent) {
      const e = await this.getContent();
      this._currentContent.innerHTML = "", Array.from(e.children).forEach((n) => this._currentContent.appendChild(n));
    }
  }
  get popUpType() {
    return this.config.popUpType || "modal";
  }
  hidePopUp() {
    this.player.playbackBar.popUp.isHidden || this.player.playbackBar.popUp.hide();
  }
  async showPopUp() {
    this._keyEventHandler || (this._keyEventHandler = (n) => {
      n.key === "Escape" && this.hidePopUp();
    }, this.button.addEventListener("keydown", this._keyEventHandler));
    const e = this.player.playbackBar.popUp;
    if (e.isHidden || this._contentId !== e.currentContentId) {
      const n = await this.getContent();
      this._currentContent = n, this._contentId = e.show({
        title: this.menuTitle || this.description,
        content: n,
        attachRight: this.popUpType === "timeline" || this.side === "right",
        attachLeft: this.popUpType === "timeline" || this.side === "left",
        parent: this.parentPopUp
      });
    } else
      e.hide();
  }
}
class xe extends X {
  get type() {
    return "eventLog";
  }
  get events() {
    return [];
  }
  async onEvent(e, n) {
    this.player.log.warn(`${this.name}: onEvent() function is not overwritten.`);
  }
}
const Me = Object.freeze({
  DISABLED: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5
});
Me.INFO;
function B(t) {
  return C(t).length > 0;
}
function C(t) {
  var n;
  const e = ((n = t.frameList) == null ? void 0 : n.frames) || [];
  return e.sort((i, r) => i.time - r.time), e;
}
async function R(t) {
  const e = C(t), { videoContainer: n } = t, i = n.isTrimEnabled ? n.trimStart : 0, r = i + Math.trunc(await n.duration()), s = i + Math.trunc(await n.currentTime());
  let o = null;
  e.some((l) => (l.time > s && l.time < r && (o = l), o !== null)), o && await t.videoContainer.setCurrentTime(o.time - i);
}
async function O(t) {
  const e = C(t), { videoContainer: n } = t, i = n.isTrimEnabled ? n.trimStart : 0, r = Math.trunc(await n.currentTime()) + i;
  let s = null;
  if (e.some((o) => (o.time < r && (s = o), o.time >= r)), s) {
    const o = s.time < i ? i : s.time;
    await t.videoContainer.setCurrentTime(o - i);
  }
}
const De = "@asicupv/paella-slide-plugins", Be = "2.0.0-beta.0", Re = { ".": "./dist/paella-slide-plugins.js", "./paella-slide-plugins.css": "./dist/paella-slide-plugins.css" }, Oe = "Slide plugins for Paella Player", He = "./dist/paella-slide-plugins.js", $e = "module", Fe = "./dist/paella-slide-plugins.js", ze = ["dist/paella-slide-plugins.css", "dist/paella-slide-plugins.js", "dist/paella-slide-plugins.umd.cjs"], Ge = { dev: "vite", build: "vite build --emptyOutDir" }, je = { type: "git", url: "git+https://github.com/polimediaupv/paella-slide-plugins.git" }, We = "Fernando Serrano Carpena <ferserc1@gmail.com>", Ze = "SEE LICENSE IN license.txt", Ve = { url: "https://github.com/polimediaupv/paella-player" }, Ye = "https://github.com/polimediaupv/paella-player#readme", qe = { vite: "^6.0.7" }, Ke = { "@asicupv/paella-core": "^2.0.0-beta.4" }, G = {
  name: De,
  version: Be,
  exports: Re,
  description: Oe,
  main: He,
  type: $e,
  module: Fe,
  files: ze,
  scripts: Ge,
  repository: je,
  author: We,
  license: Ze,
  bugs: Ve,
  homepage: Ye,
  devDependencies: qe,
  dependencies: Ke
}, Je = {
  "Show slides": "Mostrar diapositivas del vídeo",
  "go to": "ir a",
  "Seek video to the next slide": "Ir a la siguiente diapositiva",
  "Seek video to the previous slide": "Ir a la diapositiva anterior"
}, Qe = {
  "Show slides": "Show slides",
  "go to": "go to",
  "Seek video to the next slide": "Go to the next slide",
  "Seek video to the previous slide": "Go to the previous slide"
}, Xe = {
  "Show slides": "Folien anzeigen",
  "go to": "gehe zu",
  "Seek video to the next slide": "nächste Folie",
  "Seek video to the previous slide": "vorherige Folie"
}, et = {
  es: Je,
  en: Qe,
  de: Xe
};
let k = null;
class _ extends Ae {
  static Get() {
    return k || (k = new _()), k;
  }
  get moduleName() {
    return G.name;
  }
  get moduleVersion() {
    return G.version;
  }
  async getDictionaries() {
    return et;
  }
}
const H = `<svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(4.38063e-16,11.4236,8.46191,-3.24491e-16,68.8773,-7740.5)">
        <g id="arrow-right" serif:id="arrow right">
            <path d="M698.36,2.82C698.726,2.08 699.341,1.636 700,1.636C700.659,1.636 701.274,2.08 701.64,2.82C705.27,10.172 713.981,27.811 717.958,35.864C718.361,36.68 718.398,37.73 718.055,38.595C717.712,39.46 717.045,40 716.318,40L683.682,40C682.955,40 682.288,39.46 681.945,38.595C681.602,37.73 681.639,36.68 682.042,35.864C686.019,27.811 694.73,10.172 698.36,2.82Z"/>
        </g>
    </g>
</svg>`, $ = `<svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(-1.83705e-15,-11.4236,-8.46191,1.36078e-15,452.158,8252.5)">
        <g id="arrow-right" serif:id="arrow right">
            <path d="M698.36,2.82C698.726,2.08 699.341,1.636 700,1.636C700.659,1.636 701.274,2.08 701.64,2.82C705.27,10.172 713.981,27.811 717.958,35.864C718.361,36.68 718.398,37.73 718.055,38.595C717.712,39.46 717.045,40 716.318,40L683.682,40C682.955,40 682.288,39.46 681.945,38.595C681.602,37.73 681.639,36.68 682.042,35.864C686.019,27.811 694.73,10.172 698.36,2.82Z"/>
        </g>
    </g>
</svg>`;
class ne extends xe {
  getPluginModuleInstance() {
    return _.Get();
  }
  get name() {
    return super.name || "es.upv.paella.arrowSlidesNavigator";
  }
  get events() {
    return [
      v.PLAYER_LOADED
    ];
  }
  async onEvent(e) {
    var h;
    const n = this.player.getCustomPluginIcon(this.name, "arrowLeftIcon") || H, i = this.player.getCustomPluginIcon(this.name, "arrowRightIcon") || $;
    console.debug("Loading arrow slides navigation plugin");
    const r = Array.isArray(this.config.target) ? this.config.target : [this.config.target], s = this.player.videoContainer.streamProvider.streams, o = r.find((m) => s[m] !== null), l = s[o];
    if (this.frames = C(this.player), l && ((h = this.frames) != null && h.length)) {
      const m = u('<div class="arrow-slides-navigator"></div>', l.canvas.userArea);
      u(`
            <button class="button-prev"><i>${n}</i></button>
            `, m).addEventListener("click", async (y) => {
        y.stopPropagation(), await O(this.player);
      }), u(`
            <button class="button-next"><i>${i}</i></button>
            `, m).addEventListener("click", async (y) => {
        y.stopPropagation(), await R(this.player);
      });
    } else
      console.warn("No matching stream content or frames found for arrow slides navigator plugin");
  }
}
const tt = `<svg width="100%" height="100%" viewBox="0 0 33 30" version="1.1" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <path d="M23,29.888L0,29.888L0,7.888L23,7.888L23,29.888ZM11,6.888L8.903,6.888L10.5,0L33,5.817L27,27.888L24,27.388L23.994,20.288L27,20.888L30.519,7.199L11.933,2.394L11,6.888ZM21,9.888L1.969,9.888L1.969,23.888L21,23.888L21,9.888ZM7.912,19.349L10.236,15.813L12.561,18.017L15.757,13.49L19,21.888L3.939,21.888L6.169,17.726L7.912,19.349ZM6.473,15.608C5.647,15.608 4.977,14.966 4.977,14.173C4.977,13.381 5.647,12.739 6.473,12.739C7.299,12.739 7.969,13.381 7.969,14.173C7.969,14.966 7.299,15.608 6.473,15.608Z"/>
</svg>`;
function j(t, e) {
  if (e == null || e.forEach((s) => s.classList.remove("selected")), t.classList.add("selected"), this._autoScrollPaused)
    return;
  const n = t.parentElement, i = n.getBoundingClientRect(), r = t.getBoundingClientRect();
  r.left < i.left ? n.scrollLeft -= i.left - r.left : r.right > i.right && (n.scrollLeft += r.right - i.right);
}
let ie = class extends ke {
  getPluginModuleInstance() {
    return _.Get();
  }
  get name() {
    return super.name || "es.upv.paella.frameControlButtonPlugin";
  }
  getAriaLabel() {
    return "Show slides";
  }
  getDescription() {
    return this.getAriaLabel();
  }
  get popUpType() {
    return "timeline";
  }
  async isEnabled() {
    var n, i, r;
    const e = await super.isEnabled();
    return this.frames = (n = this.player.frameList) == null ? void 0 : n.frames, (i = this.frames) == null || i.sort((s, o) => s.time - o.time), e && ((r = this.frames) == null ? void 0 : r.length);
  }
  async action() {
    await super.action();
    const e = await this.player.videoContainer.currentTime();
    let n = null;
    this.frameElements.some((i) => (n = i, i.__data.time > e)), n && n.focus();
  }
  async getContent() {
    const e = this.player.getCustomPluginIcon(this.name, "arrowLeftIcon") || H, n = this.player.getCustomPluginIcon(this.name, "arrowRightIcon") || $, i = this.player.frameList.targetContent || this.config.targetContent || "presentation", r = u('<div class="frame-control-plugin-container"></div>'), s = u(`<button class="btn-left"><i class="button-icon">${e}</i></button>`, r), o = u('<div class="image-list"></div>', r), l = u(`<button class="btn-right"><i class="button-icon">${n}</i></button>`, r), { videoContainer: h } = this.player, m = await h.duration();
    let E = null;
    o.addEventListener("scroll", async (a) => {
      this._autoScrollPaused = !0, E && clearTimeout(E), E = setTimeout(() => {
        this._autoScrollPaused = !1;
      }, 2e3);
    });
    const L = h.isTrimEnabled ? h.trimStart : 0, y = h.isTrimEnabled ? h.trimEnd : m, oe = (a) => (a = this.player.videoContainer.isTrimEnabled ? a - this.player.videoContainer.trimStart : a, Ie.secondsToTime(a < 0 ? 0 : a)), N = (a) => {
      a.key === "Escape" && (a.preventDefault(), a.stopPropagation(), this.hidePopUp(), this.button.focus());
    };
    this.frameElements = this.frames.filter((a, T) => {
      const d = this.frames[T + 1];
      return ((d == null ? void 0 : d.time) >= L || a.time >= L) && a.time <= y;
    }).map((a) => {
      const T = `${this.player.translate("go to")} ${oe(a.time)}`, d = u(`
                <button id="frame_${a.id}" aria-label="${T}" title="${T}"><img src="${a.thumb}" alt="${a.id}"/></button>
                `, o);
      return d.__data = a, d.addEventListener("click", async (w) => {
        const f = w.currentTarget.__data.time - L;
        await this.player.videoContainer.setCurrentTime(f >= 0 ? f : 0), j.apply(this, [w.currentTarget, this.frameElements]);
      }), d.addEventListener("keydown", N), d.addEventListener("mouseover", async (w) => {
        this._currentFrame && this.player.videoContainer.removeChild(this._currentFrame);
        const f = document.createElement("img");
        f.className = "frame-control-preview", f.src = a.url;
        const ae = this.player.videoContainer.getVideoRect(i);
        this._currentFrame = this.player.videoContainer.appendChild(f, ae);
      }), d.addEventListener("mouseout", async (w) => {
        this._currentFrame && (this.player.videoContainer.removeChild(this._currentFrame), this._currentFrame = null);
      }), d;
    });
    const F = () => this.frameElements && this.frameElements[0] ? this.frameElements[0].offsetWidth : 0;
    return s.addEventListener("click", () => {
      o.scrollLeft -= F();
    }), l.addEventListener("click", () => {
      o.scrollLeft += F();
    }), s.addEventListener("keydown", N), l.addEventListener("keydown", N), setTimeout(() => this.frameElements[0] && this.frameElements[0].focus(), 50), r;
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "photoIcon") || tt;
    const e = 3;
    b(this.player, v.TIMEUPDATE, async (n) => {
      var s;
      const i = this.player.videoContainer.isTrimEnabled ? this.player.videoContainer.trimStart : 0;
      let r = this.frameElements && this.frameElements[0];
      (s = this.frameElements) == null || s.some((o) => {
        if (o.__data.time > Math.floor(n.currentTime + i + e))
          return !0;
        r = o;
      }), r && j.apply(this, [r, this.frameElements]);
    }), b(this.player, v.TRIMMING_CHANGED, (n) => {
      this.refreshContent = !0;
    });
  }
};
class re extends te {
  getPluginModuleInstance() {
    return _.Get();
  }
  get name() {
    return super.name || "es.upv.paella.nextSlideNavigatorButton";
  }
  getAriaLabel() {
    return this.getDescription();
  }
  getDescription() {
    return this.player.translate("Seek video to the next slide");
  }
  async isEnabled() {
    return await super.isEnabled() && B(this.player);
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "arrowRightIcon") || $;
  }
  async action() {
    await R(this.player);
  }
}
class se extends te {
  getPluginModuleInstance() {
    return _.Get();
  }
  get name() {
    return super.name || "es.upv.paella.prevSlideNavigatorButton";
  }
  getAriaLabel() {
    return this.getDescription();
  }
  getDescription() {
    return this.player.translate("Seek video to the previous slide");
  }
  async isEnabled() {
    return await super.isEnabled() && B(this.player);
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "arrowLeftIcon") || H;
  }
  async action() {
    await O(this.player);
  }
}
const nt = [
  {
    plugin: ne,
    config: {
      enabled: !1
    }
  },
  {
    plugin: ie,
    config: {
      enabled: !1
    }
  },
  {
    plugin: re,
    config: {
      enabled: !1
    }
  },
  {
    plugin: se,
    config: {
      enabled: !1
    }
  }
], st = nt, ot = ne, at = ie, lt = re, ct = se, ut = {
  nextSlide: R,
  previousSlide: O,
  checkSlides: B,
  getFrames: C
};
export {
  ot as ArrowSlidesPlugin,
  at as FrameControlButtonPlugin,
  lt as NextSlideNavigatorButtonPlugin,
  ct as PrevSlideNavigatorButtonPlugin,
  st as allPlugins,
  nt as slidePlugins,
  ut as utils
};
