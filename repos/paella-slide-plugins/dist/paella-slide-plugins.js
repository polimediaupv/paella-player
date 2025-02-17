var W = (t) => {
  throw TypeError(t);
}, Z = (t, e, n) => e.has(t) || W("Cannot " + n), c = (t, e, n) => (Z(t, e, "read from private field"), n ? n.call(t) : e.get(t)), P = (t, e, n) => e.has(t) ? W("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), x = (t, e, n, i) => (Z(t, e, "write to private field"), e.set(t, n), n);
const y = Object.freeze({
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
function ue(t) {
  return new Promise((e, n) => {
    fetch(t).then((i) => i.text()).then((i) => {
      e(i);
    }).catch((i) => n(i));
  });
}
function de(t) {
  const e = new URLSearchParams(window.location.search);
  return e.has(t) ? e.get(t) : null;
}
function he(t) {
  const e = window.location.hash.replace("#", "?"), n = new URLSearchParams(e);
  return n.has(t) ? n.get(t) : null;
}
function Y(t, e) {
  const n = e || "/";
  return t = t.map((i, r) => (r && (i = i.replace(new RegExp("^" + n), "")), r !== t.length - 1 && (i = i.replace(new RegExp(n + "$"), "")), i)), t.join(n);
}
function q(t) {
  return new RegExp("^([a-z]+://|//)", "i").test(t) || /^\//.test(t);
}
function K(t) {
  try {
    return new URL(t).pathname.split("/").pop();
  } catch {
    return t.split("/").pop();
  }
}
function pe(t) {
  return t.split(".").reduce((e, n, i, r) => i < r.length - 1 ? e !== "" ? `${e}.${n}` : n : e, "");
}
function ge(t) {
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
function me(t) {
  return K(t).split(".").pop();
}
function fe(t, e) {
  return q(e) ? e : Y([t.manifestUrl, e]);
}
function ve(t) {
  t.__hideTimerPaused__ = !0;
}
function _e(t) {
  t.__hideTimerPaused__ = !1;
}
function ye(t, e = "hideUiTime") {
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
  }), b(t, y.PLAY, async () => {
    s();
  }), b(t, y.PAUSE, async () => {
    await t.showUserInterface();
  }), b(t, y.ENDED, async () => {
    await t.showUserInterface();
  }), document.addEventListener("keydown", async () => {
    s();
  });
}
function Ce(t) {
  t.__hideTimer__ && (clearTimeout(t.__hideTimer__), delete t.__hideTimer__);
}
function be(t) {
  const e = Math.floor(t / 60 / 60), n = Math.floor(t / 60) - e * 60, i = Math.floor(t % 60);
  return (e > 0 ? e.toString().padStart(2, "0") + ":" : "") + n.toString().padStart(2, "0") + ":" + i.toString().padStart(2, "0");
}
function Ee(t) {
  const e = /^(?:(\d+):){0,1}(\d+):(\d+)(\.\d+)?$/.exec(t);
  if (e) {
    const n = e[1] !== void 0 ? Number(e[1]) : 0, i = Number(e[2]), r = Number(e[3]);
    return n * 3600 + i * 60 + r;
  }
  return null;
}
function Le(t) {
  const e = /^(?:(\d+):){0,1}(\d+):(\d+)\.(\d+)?$/.exec(t);
  if (e) {
    const n = e[1] !== void 0 ? Number(e[1]) : 0, i = Number(e[2]), r = Number(e[3]), s = e[4] && Number(e[4]) || 0;
    return n * 36e5 + i * 6e4 + r * 1e3 + s;
  }
  return null;
}
function J(t, e, n = 365) {
  let i = /* @__PURE__ */ new Date();
  i.setTime(i.getTime() + n * 24 * 60 * 60 * 1e3);
  let r = `expires=${i.toUTCString()}`;
  document.cookie = `${t}=${e};${r};path=/;SameSite=None;` + (/Apple/.test(navigator.vendor) ? "" : "Secure;");
}
function Te(t, e, n, i, r = 365) {
  t.cookieConsent.getConsentForType(e) && J(n, i, r);
}
function R(t) {
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
function we(t) {
  const e = R(t), n = Number(e);
  return e !== "" && !isNaN(n) ? n : null;
}
function Pe(t) {
  try {
    return JSON.parse(R(t));
  } catch {
    return null;
  }
}
function Se(t, e = !0) {
  return new Promise((n) => {
    const i = document.createElement("link");
    i.setAttribute("rel", "stylesheet"), i.setAttribute("href", t), i.onload = () => n(i);
    const r = document.getElementsByTagName("head")[0];
    e && r.appendChild(i), n();
  });
}
function Ie(t) {
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
function Q(t, { excludedTags: e = null } = {}) {
  const n = document.createElement("div");
  n.innerHTML = t;
  const i = ["script"];
  return e && i.push(...e), i.flatMap((r) => Array.from(n.getElementsByTagName(r))).forEach((r) => {
    r.parentElement.removeChild(r);
  }), n.innerHTML;
}
let w = null;
function Ae(t) {
  if (!t) return !1;
  w || (w = document.createElement("video"));
  let e = w.canPlayType(t);
  if (e === "maybe" || e === "probably")
    return !0;
  if (/video\/mp4/i.test(t))
    return e = w.canPlayType("video/mp4"), e === "maybe" || e === "probably";
}
const Ue = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clearAutoHideTimer: Ce,
  getCookie: R,
  getFileExtension: me,
  getHashParameter: he,
  getJSONCookie: Pe,
  getNumericCookie: we,
  getUrlFileName: K,
  getUrlParameter: de,
  isAbsoluteUrl: q,
  joinPath: Y,
  loadStyle: Se,
  loadSvgIcon: ue,
  mergeObjects: M,
  pauseAutoHideUiTimer: ve,
  removeExtension: pe,
  removeFileName: ge,
  resolveResourcePath: fe,
  resumeAutoHideUiTimer: _e,
  sanitizeHTML: Q,
  secondsToTime: be,
  setCookie: J,
  setCookieIfAllowed: Te,
  setupAutoHideUiTimer: ye,
  supportsVideoType: Ae,
  timeToMilliseconds: Le,
  timeToSeconds: Ee,
  unloadStyle: Ie
}, Symbol.toStringTag, { value: "Module" }));
var S;
let X = class {
  constructor(e) {
    P(this, S, null), x(this, S, e);
  }
  get player() {
    return c(this, S);
  }
};
S = /* @__PURE__ */ new WeakMap();
function u(t, e = null) {
  const n = document.createElement("div");
  n.innerHTML = t;
  const i = n.children[0];
  return e && e.appendChild(i), i;
}
class ee extends X {
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
}
class Ne extends X {
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
class te extends ee {
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
class ke {
  onIconChanged(e, n, i) {
  }
  onTitleChanged(e, n, i) {
  }
  onStateChanged(e, n, i, r, s) {
  }
}
var m, f, I;
class xe extends te {
  constructor() {
    super(...arguments), P(this, m, null), P(this, f, null), P(this, I, []);
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
    if (e instanceof ke)
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
    if (typeof e == "string" && (e = Q(e)), this._icon = e, e && this._button instanceof HTMLElement) {
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
    return c(this, m) || (x(this, m, z()), this.container.appendChild(c(this, m))), c(this, m);
  }
  get leftSideContainerPresent() {
    return c(this, m) !== null;
  }
  get rightSideContainer() {
    return c(this, f) || (x(this, f, z()), this.container.appendChild(c(this, f))), c(this, f);
  }
  get rightSideContainerPresent() {
    return c(this, f) !== null;
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
    this._statusText = e, this._statusIcon = n, c(this, I).forEach((l) => l(this)), this._statusIcon && (this.icon = this._statusIcon), this._statusText && (this.title = this._statusText), (r = (i = this._observer) == null ? void 0 : i.onStateChanged) == null || r.call(i, this, s, e, o, n);
  }
  onStateChange(e) {
    typeof e == "function" ? c(this, I).push(e) : this.player.log.warn("Invalid callback for ButtonPlugin.onStateChange");
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
m = /* @__PURE__ */ new WeakMap(), f = /* @__PURE__ */ new WeakMap(), I = /* @__PURE__ */ new WeakMap();
class ne extends te {
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
        return N.LEFT;
      case "center":
        return N.CENTER;
      case "right":
        return N.RIGHT;
      default:
        throw new Error(`Invalid CanvasButtonPlugin side set: ${this.side}`);
    }
  }
  async action(e) {
    this.player.log.warn(`Action not implemented in canvas button plugin ${this.name}`);
  }
}
const N = Object.freeze({
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right"
});
class Me extends xe {
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
class Re extends ee {
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
const De = Object.freeze({
  DISABLED: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5
});
De.INFO;
function D(t) {
  return E(t).length > 0;
}
function E(t) {
  var n;
  const e = ((n = t.frameList) == null ? void 0 : n.frames) || [];
  return e.sort((i, r) => i.time - r.time), e;
}
async function B(t) {
  const e = E(t), { videoContainer: n } = t, i = n.isTrimEnabled ? n.trimStart : 0, r = i + Math.trunc(await n.duration()), s = i + Math.trunc(await n.currentTime());
  let o = null;
  e.some((l) => (l.time > s && l.time < r && (o = l), o !== null)), o && await t.videoContainer.setCurrentTime(o.time - i);
}
async function O(t) {
  const e = E(t), { videoContainer: n } = t, i = n.isTrimEnabled ? n.trimStart : 0, r = Math.trunc(await n.currentTime()) + i;
  let s = null;
  if (e.some((o) => (o.time < r && (s = o), o.time >= r)), s) {
    const o = s.time < i ? i : s.time;
    await t.videoContainer.setCurrentTime(o - i);
  }
}
const Be = "@asicupv/paella-slide-plugins", Oe = "2.0.1", He = { ".": "./dist/paella-slide-plugins.js", "./paella-slide-plugins.css": "./dist/paella-slide-plugins.css", "./src/": "./src/" }, $e = "Slide plugins for Paella Player", Fe = "./dist/paella-slide-plugins.js", Ge = "module", ze = "./dist/paella-slide-plugins.js", je = ["dist/paella-slide-plugins.css", "dist/paella-slide-plugins.js", "dist/paella-slide-plugins.js.map", "dist/paella-slide-plugins.umd.cjs", "dist/paella-slide-plugins.umd.cjs.map"], Ve = { dev: "vite build --watch", build: "vite build --emptyOutDir" }, We = { type: "git", url: "git+https://github.com/polimediaupv/paella-slide-plugins.git" }, Ze = "Fernando Serrano Carpena <ferserc1@gmail.com>", Ye = "SEE LICENSE IN license.txt", qe = { url: "https://github.com/polimediaupv/paella-player" }, Ke = "https://github.com/polimediaupv/paella-player#readme", Je = { vite: "^6.0.11" }, Qe = { "@asicupv/paella-core": "^2.0.3" }, j = {
  name: Be,
  version: Oe,
  exports: He,
  description: $e,
  main: Fe,
  type: Ge,
  module: ze,
  files: je,
  scripts: Ve,
  repository: We,
  author: Ze,
  license: Ye,
  bugs: qe,
  homepage: Ke,
  devDependencies: Je,
  dependencies: Qe
}, Xe = {
  "Show slides": "Mostrar diapositivas del vídeo",
  "go to": "ir a",
  "Seek video to the next slide": "Ir a la siguiente diapositiva",
  "Seek video to the previous slide": "Ir a la diapositiva anterior"
}, et = {
  "Show slides": "Show slides",
  "go to": "go to",
  "Seek video to the next slide": "Go to the next slide",
  "Seek video to the previous slide": "Go to the previous slide"
}, tt = {
  "Show slides": "Folien anzeigen",
  "go to": "gehe zu",
  "Seek video to the next slide": "nächste Folie",
  "Seek video to the previous slide": "vorherige Folie"
}, nt = {
  es: Xe,
  en: et,
  de: tt
};
let k = null;
class C extends Ne {
  static Get() {
    return k || (k = new C()), k;
  }
  get moduleName() {
    return j.name;
  }
  get moduleVersion() {
    return j.version;
  }
  async getDictionaries() {
    return nt;
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
class ie extends Re {
  getPluginModuleInstance() {
    return C.Get();
  }
  get name() {
    return super.name || "es.upv.paella.arrowSlidesNavigator";
  }
  get events() {
    return [
      y.PLAYER_LOADED
    ];
  }
  async onEvent(e) {
    var h;
    const n = this.player.getCustomPluginIcon(this.name, "arrowLeftIcon") || H, i = this.player.getCustomPluginIcon(this.name, "arrowRightIcon") || $;
    console.debug("Loading arrow slides navigation plugin");
    const r = Array.isArray(this.config.target) ? this.config.target : [this.config.target], s = this.player.videoContainer.streamProvider.streams, o = r.find((p) => s[p] !== null), l = s[o];
    if (this.frames = E(this.player), l && ((h = this.frames) != null && h.length)) {
      const p = u('<div class="arrow-slides-navigator"></div>', l.canvas.userArea);
      u(`
            <button class="button-prev"><i>${n}</i></button>
            `, p).addEventListener("click", async (g) => {
        g.stopPropagation(), await O(this.player);
      }), u(`
            <button class="button-next"><i>${i}</i></button>
            `, p).addEventListener("click", async (g) => {
        g.stopPropagation(), await B(this.player);
      });
    } else
      console.warn("No matching stream content or frames found for arrow slides navigator plugin");
  }
}
const it = `<svg width="100%" height="100%" viewBox="0 0 33 30" version="1.1" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <path d="M23,29.888L0,29.888L0,7.888L23,7.888L23,29.888ZM11,6.888L8.903,6.888L10.5,0L33,5.817L27,27.888L24,27.388L23.994,20.288L27,20.888L30.519,7.199L11.933,2.394L11,6.888ZM21,9.888L1.969,9.888L1.969,23.888L21,23.888L21,9.888ZM7.912,19.349L10.236,15.813L12.561,18.017L15.757,13.49L19,21.888L3.939,21.888L6.169,17.726L7.912,19.349ZM6.473,15.608C5.647,15.608 4.977,14.966 4.977,14.173C4.977,13.381 5.647,12.739 6.473,12.739C7.299,12.739 7.969,13.381 7.969,14.173C7.969,14.966 7.299,15.608 6.473,15.608Z"/>
</svg>`;
function V(t, e) {
  if (e == null || e.forEach((s) => s.classList.remove("selected")), t.classList.add("selected"), this._autoScrollPaused)
    return;
  const n = t.parentElement, i = n.getBoundingClientRect(), r = t.getBoundingClientRect();
  r.left < i.left ? n.scrollLeft -= i.left - r.left : r.right > i.right && (n.scrollLeft += r.right - i.right);
}
let re = class extends Me {
  getPluginModuleInstance() {
    return C.Get();
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
    const e = this.player.getCustomPluginIcon(this.name, "arrowLeftIcon") || H, n = this.player.getCustomPluginIcon(this.name, "arrowRightIcon") || $, i = "presentation", r = this.player.frameList.targetContent || this.config.targetContent || i, s = this.config.targetContent || i, o = u('<div class="frame-control-plugin-container"></div>'), l = u(`<button class="btn-left"><i class="button-icon">${e}</i></button>`, o), h = u('<div class="image-list"></div>', o), p = u(`<button class="btn-right"><i class="button-icon">${n}</i></button>`, o), { videoContainer: v } = this.player, F = await v.duration();
    let g = null;
    h.addEventListener("scroll", async (a) => {
      this._autoScrollPaused = !0, g && clearTimeout(g), g = setTimeout(() => {
        this._autoScrollPaused = !1;
      }, 2e3);
    });
    const A = v.isTrimEnabled ? v.trimStart : 0, ae = v.isTrimEnabled ? v.trimEnd : F, le = (a) => (a = this.player.videoContainer.isTrimEnabled ? a - this.player.videoContainer.trimStart : a, Ue.secondsToTime(a < 0 ? 0 : a)), U = (a) => {
      a.key === "Escape" && (a.preventDefault(), a.stopPropagation(), this.hidePopUp(), this.button.focus());
    };
    this.frameElements = this.frames.filter((a, L) => {
      const d = this.frames[L + 1];
      return ((d == null ? void 0 : d.time) >= A || a.time >= A) && a.time <= ae;
    }).map((a) => {
      const L = `${this.player.translate("go to")} ${le(a.time)}`, d = u(`
                <button id="frame_${a.id}" aria-label="${L}" title="${L}"><img src="${a.thumb}" alt="${a.id}"/></button>
                `, h);
      return d.__data = a, d.addEventListener("click", async (T) => {
        const _ = T.currentTarget.__data.time - A;
        await this.player.videoContainer.setCurrentTime(_ >= 0 ? _ : 0), V.apply(this, [T.currentTarget, this.frameElements]);
      }), d.addEventListener("keydown", U), d.addEventListener("mouseover", async (T) => {
        this._currentFrame && this.player.videoContainer.removeChild(this._currentFrame);
        const _ = document.createElement("img");
        _.className = "frame-control-preview", _.src = a.url;
        const ce = this.player.videoContainer.getVideoRect(r) || this.player.videoContainer.getVideoRect(s) || this.player.videoContainer.getVideoRect(i) || this.player.videoContainer.getVideoRect(0);
        this._currentFrame = this.player.videoContainer.appendChild(_, ce);
      }), d.addEventListener("mouseout", async (T) => {
        this._currentFrame && (this.player.videoContainer.removeChild(this._currentFrame), this._currentFrame = null);
      }), d;
    });
    const G = () => this.frameElements && this.frameElements[0] ? this.frameElements[0].offsetWidth : 0;
    return l.addEventListener("click", () => {
      h.scrollLeft -= G();
    }), p.addEventListener("click", () => {
      h.scrollLeft += G();
    }), l.addEventListener("keydown", U), p.addEventListener("keydown", U), setTimeout(() => this.frameElements[0] && this.frameElements[0].focus(), 50), o;
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "photoIcon") || it;
    const e = 3;
    b(this.player, y.TIMEUPDATE, async (n) => {
      var s;
      const i = this.player.videoContainer.isTrimEnabled ? this.player.videoContainer.trimStart : 0;
      let r = this.frameElements && this.frameElements[0];
      (s = this.frameElements) == null || s.some((o) => {
        if (o.__data.time > Math.floor(n.currentTime + i + e))
          return !0;
        r = o;
      }), r && V.apply(this, [r, this.frameElements]);
    }), b(this.player, y.TRIMMING_CHANGED, (n) => {
      this.refreshContent = !0;
    });
  }
};
class se extends ne {
  getPluginModuleInstance() {
    return C.Get();
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
    return await super.isEnabled() && D(this.player);
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "arrowRightIcon") || $;
  }
  async action() {
    await B(this.player);
  }
}
class oe extends ne {
  getPluginModuleInstance() {
    return C.Get();
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
    return await super.isEnabled() && D(this.player);
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "arrowLeftIcon") || H;
  }
  async action() {
    await O(this.player);
  }
}
const rt = [
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
  },
  {
    plugin: oe,
    config: {
      enabled: !1
    }
  }
], at = rt, lt = ie, ct = re, ut = se, dt = oe, ht = {
  nextSlide: B,
  previousSlide: O,
  checkSlides: D,
  getFrames: E
};
export {
  lt as ArrowSlidesPlugin,
  ct as FrameControlButtonPlugin,
  ut as NextSlideNavigatorButtonPlugin,
  dt as PrevSlideNavigatorButtonPlugin,
  at as allPlugins,
  rt as slidePlugins,
  ht as utils
};
//# sourceMappingURL=paella-slide-plugins.js.map
