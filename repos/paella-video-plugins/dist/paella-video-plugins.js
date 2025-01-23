var $ = (s) => {
  throw TypeError(s);
}, W = (s, e, t) => e.has(s) || $("Cannot " + t), p = (s, e, t) => (W(s, e, "read from private field"), t ? t.call(s) : e.get(s)), P = (s, e, t) => e.has(s) ? $("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(s) : e.set(s, t), D = (s, e, t, i) => (W(s, e, "write to private field"), e.set(s, t), t);
const q = Object.freeze({
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
function G(s, e, t = {}) {
  s.__eventListeners__ && s.__eventListeners__[e] && s.__eventListeners__[e].forEach((i) => i.callback(t));
}
function Z(s, e) {
  const t = e || "/";
  return s = s.map((i, a) => (a && (i = i.replace(new RegExp("^" + t), "")), a !== s.length - 1 && (i = i.replace(new RegExp(t + "$"), "")), i)), s.join(t);
}
function J(s) {
  return new RegExp("^([a-z]+://|//)", "i").test(s) || /^\//.test(s);
}
function ee(s, e) {
  return J(e) ? e : Z([s.manifestUrl, e]);
}
function te(s, { excludedTags: e = null } = {}) {
  const t = document.createElement("div");
  t.innerHTML = s;
  const i = ["script"];
  return e && i.push(...e), i.flatMap((a) => Array.from(t.getElementsByTagName(a))).forEach((a) => {
    a.parentElement.removeChild(a);
  }), t.innerHTML;
}
var N;
class O {
  constructor(e) {
    P(this, N, null), D(this, N, e);
  }
  get player() {
    return p(this, N);
  }
}
N = /* @__PURE__ */ new WeakMap();
function ie({ tag: s = "div", attributes: e = {}, children: t = "", innerText: i = "", parent: a = null }) {
  const n = document.createElement(s);
  n.innerText = i;
  for (let r in e)
    n.setAttribute(r, e[r]);
  return n.innerHTML = t, a && a.appendChild(n), n;
}
function k(s, e = null) {
  const t = document.createElement("div");
  t.innerHTML = s;
  const i = t.children[0];
  return e && e.appendChild(i), i;
}
var E;
class se extends O {
  constructor(e, { tag: t = "div", attributes: i = [], children: a = "", parent: n = null }) {
    super(e), P(this, E, null), D(this, E, ie({ tag: t, attributes: i, children: a, parent: n })), Object.defineProperty(this, t, {
      get: () => p(this, E)
    });
  }
  get element() {
    return p(this, E);
  }
  get parent() {
    return p(this, E).parentElement;
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
    p(this, E).setAttribute(e, t);
  }
  removeFromParent() {
    var e;
    (e = p(this, E).parentElement) == null || e.removeChild(p(this, E));
  }
  setParent(e) {
    this.removeFromParent(), e.appendChild(p(this, E));
  }
}
E = /* @__PURE__ */ new WeakMap();
class z extends O {
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
class j extends z {
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
async function ne() {
  return await new Promise((s) => {
    const e = document.createElement("audio"), t = setTimeout(() => s(!1), 100);
    e.addEventListener("volumechange", (i) => {
      clearTimeout(t), s(!0);
    }), e.volume = 0.5;
  });
}
class ae extends se {
  constructor(e, t, i) {
    const a = {
      class: "video-player"
    };
    super(t, { tag: e, attributes: a, parent: i }), this._streamProvider = null, this._streamData = null, this._ready = !1;
  }
  async isVolumeApiAvailable() {
    return await ne();
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
class re extends O {
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
class oe extends ae {
  constructor(e, t, i, a) {
    super("video", e, t), this._config = a || {};
    const n = this._config.crossOrigin ?? "";
    this.element.setAttribute("playsinline", ""), n !== !1 && this.element.setAttribute("crossorigin", n), this.isMainAudio = i, this.element.setAttribute("autoplay", ""), this.element.autoplay = !0, i || (this.element.muted = !0), this._videoEnabled = !0;
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
      t = ee(this.player, t);
      const a = document.createElement("source");
      a.src = t, a.type = i, this.video.appendChild(a);
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
class A {
  constructor({ label: e, shortLabel: t, isAuto: i = !1, index: a = 0, src: n = "", width: r = -1, height: o = -1, bitrate: l = -1 }) {
    this._label = e, this._shortLabel = t, this._index = a, this._src = n, this._res = {
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
class le extends z {
  constructor(e, t, i) {
    super(e, t, i), this.__uiPlugin = !0;
  }
  async getDictionaries() {
    return null;
  }
}
const V = () => {
  const s = document.createElement("span");
  return s.classList.add("side-container"), s.classList.add("hidden"), s;
};
class de {
  onIconChanged(e, t, i) {
  }
  onTitleChanged(e, t, i) {
  }
  onStateChanged(e, t, i, a, n) {
  }
}
var w, L, R;
class ue extends le {
  constructor() {
    super(...arguments), P(this, w, null), P(this, L, null), P(this, R, []);
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
    if (e instanceof de)
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
    if (typeof e == "string" && (e = te(e)), this._icon = e, e && this._button instanceof HTMLElement) {
      const i = this._button.querySelector("i") || k("<i></i>", this._button);
      i.innerHTML = e;
    } else if (this._button instanceof HTMLElement) {
      const i = this._button.querySelector("i");
      i && this._button.removeChild(i);
    }
    (t = this._observer) != null && t.onIconChanged && this._observer.onIconChanged(this, this._icon, e);
  }
  get title() {
    return this._title || "";
  }
  set title(e) {
    var t;
    if (this._title = e, e && this._button instanceof HTMLElement) {
      const i = this._button.querySelector("span") || k(`<span class="button-title-${this.titleSize}"></span>`, this._button);
      i.innerHTML = e;
    } else if (this._button instanceof HTMLElement) {
      const i = this._button.querySelector("span");
      i && this._button.removeChild(i);
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
    return p(this, w) || (D(this, w, V()), this.container.appendChild(p(this, w))), p(this, w);
  }
  get leftSideContainerPresent() {
    return p(this, w) !== null;
  }
  get rightSideContainer() {
    return p(this, L) || (D(this, L, V()), this.container.appendChild(p(this, L))), p(this, L);
  }
  get rightSideContainerPresent() {
    return p(this, L) !== null;
  }
  get stateText() {
    return null;
  }
  get stateIcon() {
    return null;
  }
  setState({ text: e = null, icon: t = null } = {}) {
    var i, a;
    const n = this._statusText, r = this._statusIcon;
    this._statusText = e, this._statusIcon = t, p(this, R).forEach((o) => o(this)), this._statusIcon && (this.icon = this._statusIcon), this._statusText && (this.title = this._statusText), (a = (i = this._observer) == null ? void 0 : i.onStateChanged) == null || a.call(i, this, n, e, r, t);
  }
  onStateChange(e) {
    typeof e == "function" ? p(this, R).push(e) : this.player.log.warn("Invalid callback for ButtonPlugin.onStateChange");
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
w = /* @__PURE__ */ new WeakMap(), L = /* @__PURE__ */ new WeakMap(), R = /* @__PURE__ */ new WeakMap();
class ce extends ue {
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
    const i = ((e = this.config.closeActions) == null ? void 0 : e.clickOutside) ?? !0, a = ((t = this.config.closeActions) == null ? void 0 : t.closeButton) ?? !1;
    return {
      clickOutside: i,
      closeButton: a
    };
  }
  get currentContent() {
    return this._currentContent;
  }
  async getContent() {
    return k("<p>Pop Up Button Plugin Content</p>");
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
const he = (s) => s ? `<span class="menu-title">${s}</span>` : "", pe = (s) => s ? `<i class="menu-icon">${s}</i>` : "", ge = (s) => s ? `aria-label="${s}"` : "", _e = (s) => s ? `<span class="state-text">${s}</span>` : "", me = (s) => s ? `<i class="state-icon">${s}</i>` : "", ve = (s, e) => s || e ? `<span class="button-state">${_e(s)}${me(e)}</span>` : "";
function ye(s, e, t, i, a, n, r) {
  const { id: o = 0, title: l = null, icon: m = null, showTitle: u = !0, stateText: y = null, stateIcon: c = null } = s, d = this, C = document.createElement("li"), T = n[o] ?? !1, v = k(`
		<button class="menu-button-item${T ? " selected" : ""}" ${ge(l)} data-id="${o}"" id="${d.name}_menuItem_${o}">
			${pe(m)}
			${u ? he(l) : ""}
			${y || c ? ve(y, c) : ""}
		</button>
	`);
  return r && (r._button = v), v.addEventListener("keydown", (h) => {
    var S;
    const b = () => {
      h.stopPropagation(), h.preventDefault();
    };
    if (h.key === "ArrowUp") {
      const g = v.dataPrev;
      g == null || g.focus(), b();
    } else if (h.key === "ArrowDown") {
      const g = v.dataNext;
      g == null || g.focus(), b();
    } else if (h.key === "Tab") {
      const g = h.shiftKey ? h.target.dataPrev : h.target.dataNext;
      g == null || g.focus(), b();
    } else h.key === "Escape" && (this.player.playbackBar.popUp.pop() ? (S = d.button) == null || S.focus() : this.focus(), b());
  }), v.addEventListener("click", async (h) => {
    var S;
    if (e === "check") {
      const b = i.find((g) => g.id === o);
      n[o] = !n[o], d.itemSelected(b, i);
    } else if (e === "radio") {
      n[o] = !0;
      let b = null;
      i.forEach((g) => {
        g.id === o ? b = g : n[g.id] = !1;
      }), d.itemSelected(b, i);
    } else {
      const b = i.find((g) => g.id === o);
      d.itemSelected(b, i);
    }
    await d.checkRefreshContent(), h.stopPropagation(), d.closeOnSelect && (d.closeMenu(), (S = d.button) == null || S.focus());
  }), C.appendChild(v), t.appendChild(C), C;
}
class be extends ce {
  get closeOnSelect() {
    return this.config.closeOnSelect === void 0 && (this.buttonType !== "check" ? this.config.closeOnSelect = !0 : this.config.closeOnSelect = !1), this.config.closeOnSelect;
  }
  setSelected(e, t) {
    this._selectedItems && (this._selectedItems[e] = t);
  }
  async getContent() {
    var e, t;
    const i = (e = document.activeElement) == null ? void 0 : e.id, a = k("<menu></menu>");
    this._content = a;
    const n = await this.getMenu();
    this._menuItems = n, this._selectedItems || (this._selectedItems = {}, this._menuItems.forEach((l) => {
      l.selected !== void 0 && l.selected !== null && (this._selectedItems[l.id] = l.selected);
    }));
    const r = self.crypto.randomUUID(), o = n.map((l) => ye.apply(this, [l, typeof this.buttonType == "function" ? this.buttonType() : this.buttonType, a, n, r, this._selectedItems, l.plugin]));
    return o.forEach((l, m, u) => {
      const y = l.querySelector("button");
      let c = u[m + 1], d = u[m - 1];
      m === u.length - 1 && (c = u[0]), m === 0 && (d = u[u.length - 1]), y.dataNext = c == null ? void 0 : c.querySelector("button"), y.dataPrev = d == null ? void 0 : d.querySelector("button");
    }), this._firstItem = (t = o[0]) == null ? void 0 : t.querySelector("button"), i && setTimeout(() => {
      var l;
      (l = document.getElementById(i)) == null || l.focus();
    }, 10), a;
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
const fe = Object.freeze({
  DISABLED: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5
});
fe.INFO;
class B {
  constructor({
    id: e,
    name: t,
    groupId: i = "",
    language: a = "",
    selected: n = !1
  }) {
    this._id = e, this._name = t, this._groupId = i, this._lang = a, this._selected = n;
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
const Ee = "@asicupv/paella-video-plugins", Ce = "2.0.0", we = { ".": "./dist/paella-video-plugins.js", "./paella-video-plugins.css": "./dist/paella-video-plugins.css" }, Le = "More video formats for Paella Player", Te = "./dist/paella-video-plugins.js", Se = "module", Ae = "./dist/paella-video-plugins.js", Pe = ["dist/paella-video-plugins.css", "dist/paella-video-plugins.js", "dist/paella-video-plugins.umd.cjs", "dist/hls-C0_oYVSH.js"], ke = { dev: "vite", build: "vite build --emptyOutDir" }, Ie = { type: "git", url: "git+https://github.com/polimediaupv/paella-video-plugins.git" }, Ne = ["paella", "player", "zoom", "slide", "presentation", "blackboard", "whiteboard", "hls"], Re = "Fernando Serrano Carpena <ferserc1@gmail.com>", De = "SEE LICENSE IN license.txt", xe = { url: "https://github.com/polimediaupv/paella-video-plugins/issues" }, Me = "https://github.com/polimediaupv/paella-video-plugins#readme", He = { vite: "^6.0.11" }, Oe = { "hls.js": "^1.5.20", "@asicupv/paella-core": "^2.0.0-beta.4" }, Ue = {
  name: Ee,
  version: Ce,
  exports: we,
  description: Le,
  main: Te,
  type: Se,
  module: Ae,
  files: Pe,
  scripts: ke,
  repository: Ie,
  keywords: Ne,
  author: Re,
  license: De,
  bugs: xe,
  homepage: Me,
  devDependencies: He,
  dependencies: Oe
};
let x = null;
class I extends re {
  static Get() {
    return x || (x = new I()), x;
  }
  get moduleName() {
    return "paella-video-plugins";
  }
  get moduleVersion() {
    return Ue.version;
  }
}
const H = {
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
}, Q = {
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
let M = null;
async function U() {
  return M || (console.debug("Loading HLS.js"), M = (await import("./hls-C0_oYVSH.js")).default), M;
}
async function f(s = !1) {
  const e = await U(), t = document.createElement("video");
  return t.canPlayType("application/vnd.apple.mpegurl") && s ? _.NATIVE : e.isSupported() ? _.MEDIA_SOURCE_EXTENSIONS : t.canPlayType("application/vnd.apple.mpegurl") ? _.NATIVE : _.UNSUPPORTED;
}
const Fe = async (s, e, t, i, a) => {
  var l, m;
  const n = await U();
  a.withCredentials && (i.xhrSetup = function(u, y) {
    u.withCredentials = a.withCredentials;
    for (const c in a.requestHeaders) {
      const d = a.requestHeaders[c];
      u.setRequestHeader(c, d);
    }
  }), i.autoStartLoad = !0;
  const r = new n(i), o = ((m = (l = e == null ? void 0 : e.sources) == null ? void 0 : l.hls) == null ? void 0 : m.length) > 0 && e.sources.hls[0];
  return [r, new Promise((u, y) => {
    let c = !1;
    r.on(n.Events.LEVEL_SWITCHED, (v, h) => {
      s.log.debug(`HLS: quality level switched to ${h.level}`), c || (r.currentLevel = -1, c = !0), G(s, q.VIDEO_QUALITY_CHANGED, {});
    }), r.on(n.Events.ERROR, (v, h) => {
      if (h.fatal)
        switch (h.type) {
          case n.ErrorTypes.NETWORK_ERROR:
            h.details === n.ErrorDetails.MANIFEST_LOAD_ERROR ? y(Error("hlsVideoFormatPlugin: unrecoverable error in HLS player. The video is not available")) : (s.log.warn("hlsVideoFormatPlugin: Fatal network error. Try to recover"), r.startLoad());
            break;
          case n.ErrorTypes.MEDIA_ERROR:
            s.log.warn("hlsVideoFormatPlugin: Fatal media error encountered. Try to recover"), r.recoverMediaError();
            break;
          default:
            r.destroy(), y(Error("hlsVideoFormat: Fatal error. Can not recover"));
        }
      else
        s.log.warn("HLS: error"), s.log.warn(h.details);
    }), r.on(n.Events.LEVEL_SWITCHING, () => {
      s.log.debug("HLS media attached");
    }), r.on(n.Events.MEDIA_ATTACHED, () => {
      s.log.debug("HLS media attached");
    }), r.on(n.Events.MEDIA_DETACHING, () => {
      s.log.debug("HLS media detaching");
    }), r.on(n.Events.MEDIA_DETACHED, () => {
      s.log.debug("HLS media detached");
    }), r.on(n.Events.MANIFEST_PARSED, () => {
      s.log.debug("HLS manifest parsed"), r.startLoad(-1);
    });
    const d = Math.floor(Math.random() * 1e11), C = o.src + (i.enableCache ? /\?/.test(o.src) ? `&cache=${d}` : `?cache=${d}` : "");
    r.loadSource(C), r.attachMedia(t);
    let T = !1;
    r._videoEventListener = () => {
      T = !0, u();
    }, t.addEventListener("canplay", r._videoEventListener), setTimeout(() => {
      T || t.play();
    }, 1e3);
  })];
};
class F extends oe {
  constructor(e, t, i, a) {
    super(e, t, a, i), this._config = this._config || {
      audioTrackLabel: i.audioTrackLabel || "name",
      enableCache: i.enableCache || !1
    };
    for (const n in H)
      this._config[n] = H[n];
    for (const n in i.hlsConfig)
      this._config[n] = i.hlsConfig[n];
    this._cors = {};
    for (const n in Q)
      this._cors[n] = Q[n];
    for (const n in i.corsConfig)
      this._cors[n] = i.corsConfig[n];
    this._ready = !1, this._autoQuality = !0, this._forceNative = i.forceNative || !1;
  }
  get autoQuality() {
    return this._autoQuality;
  }
  get forceNative() {
    return this._forceNative;
  }
  async loadStreamData(e) {
    var i, a;
    if (await f(this.forceNative) === _.NATIVE) {
      e.sources.mp4 = e.sources.hls;
      const n = await super.loadStreamData(e), r = await this.getAudioTracks();
      return this._currentAudioTrack = r.find((o) => o.selected), this._autoQuality = new A({
        label: "auto",
        shortLabel: "auto",
        index: -1,
        width: 1,
        height: 1,
        isAuto: !0
      }), this._currentQuality = this._autoQuality, this.saveDisabledProperties(this.video), this._endedCallback = this._endedCallback || (() => {
        typeof this._videoEndedCallback == "function" && this._videoEndedCallback();
      }), this.video.addEventListener("ended", this._endedCallback), n;
    } else {
      this.player.log.debug("Loading HLS stream");
      const n = ((a = (i = e == null ? void 0 : e.sources) == null ? void 0 : i.hls) == null ? void 0 : a.length) && e.sources.hls[0];
      this._config.audioTrackLabel = (n == null ? void 0 : n.audioLabel) || this._config.audioTrackLabel;
      const [r, o] = await Fe(this.player, e, this.video, this._config, this._cors);
      this._hls = r, await o, this.video.pause(), this._autoQuality = new A({
        label: "auto",
        shortLabel: "auto",
        index: -1,
        width: 1,
        height: 1,
        isAuto: !0
      }), this._currentQuality = this._autoQuality;
      const l = await this.getAudioTracks();
      this._currentAudioTrack = l.find((m) => m.selected), this.saveDisabledProperties(this.video), this._endedCallback = this._endedCallback || (() => {
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
    if (await f(this.forceNative) === _.NATIVE)
      return super.waitForLoaded();
    await new Promise((t, i) => {
      const a = () => {
        this._ready && t(), this.video.readyState >= 2 ? (this._ready = !0, t()) : setTimeout(() => a(), 200);
      };
      a();
    });
  }
  async getQualities() {
    const e = [];
    return e.push(this._autoQuality), await f(this.forceNative) === _.MEDIA_SOURCE_EXTENSIONS && (this._hls.levels.forEach((i, a) => {
      e.push(new A({
        index: a,
        // TODO: should be level.id??
        label: `${i.width}x${i.height}`,
        shortLabel: `${i.height}p`,
        width: i.width,
        height: i.height
      }));
    }), e.sort((i, a) => i.res.h - a.res.h)), e;
  }
  async setQuality(e) {
    const t = await f(this.forceNative);
    if (this._videoEnabled) {
      if (!(e instanceof A))
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
    const e = await f(this.forceNative);
    return e === _.MEDIA_SOURCE_EXTENSIONS ? this._hls.audioTracks.length > 1 : e === _.NATIVE ? ((t = this.video.audioTracks) == null ? void 0 : t.length) > 1 : !1;
  }
  async getAudioTracks() {
    await this.waitForLoaded();
    const e = this._config.audioTrackLabel || "name", t = await f(this.forceNative);
    return t === _.MEDIA_SOURCE_EXTENSIONS ? this._hls.audioTracks.map((a) => new B({
      id: a.id,
      name: a[e],
      language: a.lang,
      selected: this._hls.audioTrack === a.id
    })) : t === _.NATIVE ? Array.from(this.video.audioTracks).map((a) => new B({
      id: a.id,
      name: a.label,
      language: a.language,
      selected: a.enabled
    })) : null;
  }
  async setCurrentAudioTrack(e) {
    await this.waitForLoaded();
    const i = (await this.getAudioTracks()).find((n) => n.id === e.id), a = await f(this.forceNative);
    return a === _.MEDIA_SOURCE_EXTENSIONS && i ? this._hls.audioTrack = i.id : a === _.NATIVE && i && Array.from(this.video.audioTracks).forEach((n) => {
      n.id === i.id ? n.enabled = !0 : n.enabled = !1;
    }), this._currentAudioTrack = i, i;
  }
  get currentAudioTrack() {
    return this._currentAudioTrack;
  }
  async clearStreamData() {
    this.video.removeEventListener("canplay", this._hls._videoEventListener), this.video.src = "", this._hls.destroy(), this._ready = !1;
  }
}
class X extends j {
  getPluginModuleInstance() {
    return I.Get();
  }
  get name() {
    return super.name || "es.upv.paella.hlsVideoFormat";
  }
  get streamType() {
    return "hls";
  }
  async isCompatible(e) {
    const { hls: t } = e.sources;
    return t && await f();
  }
  async getVideoInstance(e, t) {
    return new F(this.player, e, this.config, t);
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
const Ve = async (s, e, t, i, a) => {
  var l, m;
  const n = await U();
  a.withCredentials && (i.xhrSetup = function(u, y) {
    u.withCredentials = a.withCredentials;
    for (const c in a.requestHeaders) {
      const d = a.requestHeaders[c];
      u.setRequestHeader(c, d);
    }
  });
  const r = new n(i), o = ((m = (l = e == null ? void 0 : e.sources) == null ? void 0 : l.hlsLive) == null ? void 0 : m.length) > 0 && e.sources.hlsLive[0];
  return i.initialQualityLevel !== void 0 && i.initialQualityLevel, [r, new Promise((u, y) => {
    let c = !1;
    r.on(n.Events.LEVEL_SWITCHED, (T, v) => {
      (void 0).player.log.debug(`HLS: quality level switched to ${v.level}`), c || (r.currentLevel = -1, c = !0), G(s, q.VIDEO_QUALITY_CHANGED, {});
    }), r.on(n.Events.ERROR, (T, v) => {
      if (v.fatal)
        switch (v.type) {
          case n.ErrorTypes.NETWORK_ERROR:
            v.details === n.ErrorDetails.MANIFEST_LOAD_ERROR ? y(Error("hlsVideoFormatPlugin: unrecoverable error in HLS player. The video is not available")) : (s.log.warn("hlsVideoFormatPlugin: Fatal network error. Try to recover"), r.startLoad());
            break;
          case n.ErrorTypes.MEDIA_ERROR:
            s.log.warn("hlsVideoFormatPlugin: Fatal media error encountered. Try to recover"), r.recoverMediaError();
            break;
          default:
            r.destroy(), y(Error("hlsVideoFormat: Fatal error. Can not recover"));
        }
    }), r.on(n.Events.MANIFEST_PARSED, () => {
      i.autoStartLoad || r.autoStartLoad();
    });
    const d = Math.floor(Math.random() * 1e11), C = o.src + (i.enableCache ? /\?/.test(o.src) ? `&cache=${d}` : `?cache=${d}` : "");
    r.loadSource(C), r.attachMedia(t), r._videoEventListener = () => {
      u();
    }, t.addEventListener("canplay", r._videoEventListener);
  })];
};
class Be extends F {
  async loadStreamData(e) {
    if (await f() === _.NATIVE)
      return e.sources.hls = e.sources.hlsLive, super.loadStreamData(e);
    {
      this.player.log.debug("Loading HLS stream");
      const [i, a] = await Ve(this.player, e, this.video, this._config, this._cors);
      this._hls = i, await a, this._autoQuality = new A({
        label: "auto",
        shortLabel: "auto",
        index: -1,
        width: 1,
        height: 1,
        isAuto: !0
      }), this._currentQuality = this._autoQuality;
      const n = await this.getAudioTracks();
      this._currentAudioTrack = n.find((r) => r.selected), this.saveDisabledProperties(this.video);
    }
  }
}
class Y extends j {
  getPluginModuleInstance() {
    return I.Get();
  }
  get name() {
    return super.name || "es.upv.paella.hlsLiveVideoFormat";
  }
  get streamType() {
    return "hlsLive";
  }
  async isCompatible(e) {
    const t = await f(), { hlsLive: i } = e.sources;
    return i && t;
  }
  async getVideoInstance(e, t) {
    return new Be(this.player, e, this.config, t);
  }
}
const Qe = `<svg width="100%" height="100%" viewBox="0 0 39 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <path d="M37,9.5C37,5.913 34.087,3 30.5,3L8.5,3C4.913,3 2,5.913 2,9.5L2,22.5C2,26.087 4.913,29 8.5,29L30.5,29C34.087,29 37,26.087 37,22.5L37,9.5ZM18.97,21.884C18.97,21.983 18.891,22.125 18.733,22.308C17.111,24.188 15.102,25.128 12.706,25.128C10.21,25.128 8.214,24.217 6.716,22.395C5.319,20.698 4.62,18.577 4.62,16.031C4.62,13.486 5.331,11.356 6.754,9.642C8.268,7.795 10.269,6.872 12.756,6.872C15.277,6.872 17.227,7.725 18.608,9.43C18.741,9.605 18.808,9.75 18.808,9.867C18.808,10.008 18.587,10.426 18.147,11.121C17.706,11.816 17.439,12.163 17.348,12.163C17.24,12.163 16.986,11.959 16.587,11.551C16.096,11.052 15.634,10.678 15.202,10.428C14.486,10.021 13.696,9.817 12.831,9.817C11.184,9.817 9.902,10.445 8.987,11.701C8.172,12.824 7.765,14.238 7.765,15.944C7.765,17.649 8.168,19.076 8.975,20.224C9.89,21.513 11.167,22.158 12.806,22.158C13.621,22.158 14.407,21.954 15.164,21.547C15.663,21.28 16.171,20.902 16.687,20.411C17.119,20.003 17.356,19.8 17.398,19.8C17.448,19.8 17.722,20.13 18.221,20.792C18.721,21.453 18.97,21.817 18.97,21.884ZM34.38,21.884C34.38,21.983 34.301,22.125 34.143,22.308C32.521,24.188 30.512,25.128 28.116,25.128C25.62,25.128 23.624,24.217 22.126,22.395C20.729,20.698 20.03,18.577 20.03,16.031C20.03,13.486 20.741,11.356 22.164,9.642C23.678,7.795 25.678,6.872 28.166,6.872C30.686,6.872 32.637,7.725 34.018,9.43C34.151,9.605 34.218,9.75 34.218,9.867C34.218,10.008 33.997,10.426 33.556,11.121C33.116,11.816 32.849,12.163 32.758,12.163C32.65,12.163 32.396,11.959 31.997,11.551C31.506,11.052 31.044,10.678 30.612,10.428C29.896,10.021 29.106,9.817 28.241,9.817C26.594,9.817 25.312,10.445 24.397,11.701C23.582,12.824 23.174,14.238 23.174,15.944C23.174,17.649 23.578,19.076 24.385,20.224C25.3,21.513 26.577,22.158 28.216,22.158C29.031,22.158 29.817,21.954 30.574,21.547C31.073,21.28 31.581,20.902 32.096,20.411C32.529,20.003 32.766,19.8 32.808,19.8C32.858,19.8 33.132,20.13 33.631,20.792C34.13,21.453 34.38,21.817 34.38,21.884Z" />
</svg>`;
class K extends be {
  getPluginModuleInstance() {
    return I.Get();
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
    this.icon = this.player.getCustomPluginIcon(this.name, "captionsIcon") || Qe;
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
    return this._tracks.forEach((t, i) => {
      e.push({
        id: t.attrs.LANGUAGE || t.attrs.NAME,
        title: t.attrs.NAME || t.attrs.LANGUAGE,
        index: i,
        selected: t.language === this._selected
      });
    }), e;
  }
  get buttonType() {
    return "radio";
  }
  itemSelected(e) {
    var t;
    this._hls.subtitleTrack = e.index, this._selected = (t = this._tracks.find((i) => i.index === e.index)) == null ? void 0 : t.language;
  }
}
function We() {
  return require.context("./plugins", !0, /\.js/);
}
const $e = [
  {
    plugin: X,
    config: {
      enabled: !1
    }
  },
  {
    plugin: Y,
    config: {
      enabled: !1
    }
  },
  {
    plugin: K,
    config: {
      enabled: !1
    }
  }
], qe = $e, Ge = X, ze = Y, je = K, Xe = {
  HlsVideo: F,
  getHlsSupport: f,
  defaultHlsConfig: H,
  HlsSupport: _
};
export {
  je as HlsCaptionsSelectorButtonPlugin,
  ze as HlsLiveVideoFormatPlugin,
  Ge as HlsVideoFormatPlugin,
  qe as allPlugins,
  We as default,
  Xe as hlsTools,
  $e as videoPlugins
};
