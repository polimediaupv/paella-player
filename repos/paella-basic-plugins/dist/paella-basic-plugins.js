var F = (t) => {
  throw TypeError(t);
};
var z = (t, e, n) => e.has(t) || F("Cannot " + n);
var A = (t, e, n) => (z(t, e, "read from private field"), n ? n.call(t) : e.get(t)), j = (t, e, n) => e.has(t) ? F("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), V = (t, e, n, i) => (z(t, e, "write to private field"), i ? i.call(t, n) : e.set(t, n), n);
var Q = (t) => {
  throw TypeError(t);
}, Y = (t, e, n) => e.has(t) || Q("Cannot " + n), v = (t, e, n) => (Y(t, e, "read from private field"), n ? n.call(t) : e.get(t)), U = (t, e, n) => e.has(t) ? Q("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), O = (t, e, n, i) => (Y(t, e, "write to private field"), e.set(t, n), n);
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
  return t.__eventListeners__ = t.__eventListeners__ || {}, Array.isArray(e) || (e = [e]), e.forEach((s) => {
    t.__eventListeners__[s] = t.__eventListeners__[s] || [], t.__eventListeners__[s].push({
      callback: n,
      unregisterOnUnload: i
    });
  }), n;
}
function ge(t) {
  return new Promise((e, n) => {
    fetch(t).then((i) => i.text()).then((i) => {
      e(i);
    }).catch((i) => n(i));
  });
}
function Ce(t) {
  const e = new URLSearchParams(window.location.search);
  return e.has(t) ? e.get(t) : null;
}
function me(t) {
  const e = window.location.hash.replace("#", "?"), n = new URLSearchParams(e);
  return n.has(t) ? n.get(t) : null;
}
function K(t, e) {
  const n = e || "/";
  return t = t.map((i, s) => (s && (i = i.replace(new RegExp("^" + n), "")), s !== t.length - 1 && (i = i.replace(new RegExp(n + "$"), "")), i)), t.join(n);
}
function J(t) {
  return new RegExp("^([a-z]+://|//)", "i").test(t) || /^\//.test(t);
}
function X(t) {
  try {
    return new URL(t).pathname.split("/").pop();
  } catch {
    return t.split("/").pop();
  }
}
function fe(t) {
  return t.split(".").reduce((e, n, i, s) => i < s.length - 1 ? e !== "" ? `${e}.${n}` : n : e, "");
}
function ye(t) {
  const e = (n) => {
    const i = n.split("/").reduce((s, a, o, r) => o < r.length - 1 ? s !== "" ? `${s}/${a}` : a : s, "");
    return (n[0] === "/" ? `/${i}` : i) + "/";
  };
  try {
    const n = new URL(t);
    return n.origin + e(n.pathname);
  } catch {
    return e(t);
  }
}
function Le(t) {
  return X(t).split(".").pop();
}
function ve(t, e) {
  return J(e) ? e : K([t.manifestUrl, e]);
}
function we(t) {
  t.__hideTimerPaused__ = !0;
}
function be(t) {
  t.__hideTimerPaused__ = !1;
}
function _e(t, e = "hideUiTime") {
  var n;
  t.__hideTimer__ = null;
  const i = async () => t.__hideTimerPaused__ ? (t.log.debug("UI not hidden because the auto hide timer is paused"), !1) : s() ? (t.log.debug("UI not hidden because there is a focused element"), !1) : (await t.hideUserInterface(), !0);
  (n = t.config.ui) != null && n.hideOnMouseLeave && t.containerElement.addEventListener("mouseleave", () => {
    i();
  });
  const s = () => {
    const o = document.activeElement;
    return (t.playbackBar.element.contains(o) || t.videoContainer.element.contains(o)) && [
      "input",
      "textarea",
      "button"
    ].find((r) => o.tagName.toLowerCase(r)) !== -1;
  }, a = async () => {
    t.__hideTimer__ && clearTimeout(t.__hideTimer__), await t.showUserInterface(), t.__hideTimer__ = setTimeout(async () => {
      t.__hideTimer__ = null, i() || a();
    }, t[e]);
  };
  t.containerElement.addEventListener("mousemove", async (o) => {
    a();
  }), b(t, y.PLAY, async () => {
    a();
  }), b(t, y.PAUSE, async () => {
    await t.showUserInterface();
  }), b(t, y.ENDED, async () => {
    await t.showUserInterface();
  }), document.addEventListener("keydown", async () => {
    a();
  });
}
function xe(t) {
  t.__hideTimer__ && (clearTimeout(t.__hideTimer__), delete t.__hideTimer__);
}
function Ee(t) {
  const e = Math.floor(t / 60 / 60), n = Math.floor(t / 60) - e * 60, i = Math.floor(t % 60);
  return (e > 0 ? e.toString().padStart(2, "0") + ":" : "") + n.toString().padStart(2, "0") + ":" + i.toString().padStart(2, "0");
}
function Pe(t) {
  const e = /^(?:(\d+):){0,1}(\d+):(\d+)(\.\d+)?$/.exec(t);
  if (e) {
    const n = e[1] !== void 0 ? Number(e[1]) : 0, i = Number(e[2]), s = Number(e[3]);
    return n * 3600 + i * 60 + s;
  }
  return null;
}
function Ie(t) {
  const e = /^(?:(\d+):){0,1}(\d+):(\d+)\.(\d+)?$/.exec(t);
  if (e) {
    const n = e[1] !== void 0 ? Number(e[1]) : 0, i = Number(e[2]), s = Number(e[3]), a = e[4] && Number(e[4]) || 0;
    return n * 36e5 + i * 6e4 + s * 1e3 + a;
  }
  return null;
}
function ee(t, e, n = 365) {
  let i = /* @__PURE__ */ new Date();
  i.setTime(i.getTime() + n * 24 * 60 * 60 * 1e3);
  let s = `expires=${i.toUTCString()}`;
  document.cookie = `${t}=${e};${s};path=/;SameSite=None;` + (/Apple/.test(navigator.vendor) ? "" : "Secure;");
}
function Se(t, e, n, i, s = 365) {
  t.cookieConsent.getConsentForType(e) && ee(n, i, s);
}
function Z(t) {
  let e = t + "=", n = decodeURIComponent(document.cookie).split(";");
  for (let i = 0; i < n.length; ++i) {
    let s = n[i];
    for (; s.charAt(0) == " "; )
      s = s.substring(1);
    if (s.indexOf(e) == 0)
      return s.substring(e.length, s.length);
  }
  return "";
}
function Te(t) {
  const e = Z(t), n = Number(e);
  return e !== "" && !isNaN(n) ? n : null;
}
function ke(t) {
  try {
    return JSON.parse(Z(t));
  } catch {
    return null;
  }
}
function Ae(t, e = !0) {
  return new Promise((n) => {
    const i = document.createElement("link");
    i.setAttribute("rel", "stylesheet"), i.setAttribute("href", t), i.onload = () => n(i);
    const s = document.getElementsByTagName("head")[0];
    e && s.appendChild(i), n();
  });
}
function Me(t) {
  document.getElementsByTagName("head")[0].removeChild(t);
}
function $(t, e, n = !0) {
  for (const i in e) {
    const s = t[i];
    let a = e[i];
    n && Array.isArray(s) && Array.isArray(a) ? (s.forEach((o) => {
      a = a.filter((r) => typeof o == "object" && typeof r == "object" && o.id === r.id ? ($(o, r, n), !1) : !0);
    }), a.forEach((o) => {
      s.push(o);
    })) : typeof s == "object" && a ? $(s, a, n) : t[i] = e[i];
  }
}
function te(t, { excludedTags: e = null } = {}) {
  const n = document.createElement("div");
  n.innerHTML = t;
  const i = ["script"];
  return e && i.push(...e), i.flatMap((s) => Array.from(n.getElementsByTagName(s))).forEach((s) => {
    s.parentElement.removeChild(s);
  }), n.innerHTML;
}
let M = null;
function Ue(t) {
  if (!t) return !1;
  M || (M = document.createElement("video"));
  let e = M.canPlayType(t);
  if (e === "maybe" || e === "probably")
    return !0;
  if (/video\/mp4/i.test(t))
    return e = M.canPlayType("video/mp4"), e === "maybe" || e === "probably";
}
const G = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clearAutoHideTimer: xe,
  getCookie: Z,
  getFileExtension: Le,
  getHashParameter: me,
  getJSONCookie: ke,
  getNumericCookie: Te,
  getUrlFileName: X,
  getUrlParameter: Ce,
  isAbsoluteUrl: J,
  joinPath: K,
  loadStyle: Ae,
  loadSvgIcon: ge,
  mergeObjects: $,
  pauseAutoHideUiTimer: we,
  removeExtension: fe,
  removeFileName: ye,
  resolveResourcePath: ve,
  resumeAutoHideUiTimer: be,
  sanitizeHTML: te,
  secondsToTime: Ee,
  setCookie: ee,
  setCookieIfAllowed: Se,
  setupAutoHideUiTimer: _e,
  supportsVideoType: Ue,
  timeToMilliseconds: Ie,
  timeToSeconds: Pe,
  unloadStyle: Me
}, Symbol.toStringTag, { value: "Module" }));
var N;
class ne {
  constructor(e) {
    U(this, N, null), O(this, N, e);
  }
  get player() {
    return v(this, N);
  }
}
N = /* @__PURE__ */ new WeakMap();
function C(t, e = null) {
  const n = document.createElement("div");
  n.innerHTML = t;
  const i = n.children[0];
  return e && e.appendChild(i), i;
}
class Ne extends ne {
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
async function Be() {
  return await new Promise((t) => {
    const e = document.createElement("audio"), n = setTimeout(() => t(!1), 100);
    e.addEventListener("volumechange", (i) => {
      clearTimeout(n), t(!0);
    }), e.volume = 0.5;
  });
}
class De extends ne {
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
class Oe extends Ne {
  constructor(e, n, i) {
    super(e, n, i), this.__uiPlugin = !0;
  }
  async getDictionaries() {
    return null;
  }
}
let $e = "en", Ze = "";
const W = {};
function He(t) {
  const e = W[$e] || {}, n = W[Ze] || {};
  return e[t] || n[t] || t;
}
let Re = He;
function Fe(t, e = null) {
  const n = Re(t);
  if (Array.isArray(e)) {
    let i = n;
    return e.forEach((s, a) => {
      const o = `$${a + 1}`;
      i = i.replace(o, s);
    }), i;
  } else
    return n;
}
const q = () => {
  const t = document.createElement("span");
  return t.classList.add("side-container"), t.classList.add("hidden"), t;
};
class ze {
  onIconChanged(e, n, i) {
  }
  onTitleChanged(e, n, i) {
  }
  onStateChanged(e, n, i, s, a) {
  }
}
var x, E, B;
class T extends Oe {
  constructor() {
    super(...arguments), U(this, x, null), U(this, E, null), U(this, B, []);
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
    if (e instanceof ze)
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
    if (typeof e == "string" && (e = te(e)), this._icon = e, e && this._button instanceof HTMLElement) {
      const i = this._button.querySelector("i") || C("<i></i>", this._button);
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
      const i = this._button.querySelector("span") || C(`<span class="button-title-${this.titleSize}"></span>`, this._button);
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
    return v(this, x) || (O(this, x, q()), this.container.appendChild(v(this, x))), v(this, x);
  }
  get leftSideContainerPresent() {
    return v(this, x) !== null;
  }
  get rightSideContainer() {
    return v(this, E) || (O(this, E, q()), this.container.appendChild(v(this, E))), v(this, E);
  }
  get rightSideContainerPresent() {
    return v(this, E) !== null;
  }
  get stateText() {
    return null;
  }
  get stateIcon() {
    return null;
  }
  setState({ text: e = null, icon: n = null } = {}) {
    var i, s;
    const a = this._statusText, o = this._statusIcon;
    this._statusText = e, this._statusIcon = n, v(this, B).forEach((r) => r(this)), this._statusIcon && (this.icon = this._statusIcon), this._statusText && (this.title = this._statusText), (s = (i = this._observer) == null ? void 0 : i.onStateChanged) == null || s.call(i, this, a, e, o, n);
  }
  onStateChange(e) {
    typeof e == "function" ? v(this, B).push(e) : this.player.log.warn("Invalid callback for ButtonPlugin.onStateChange");
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
x = /* @__PURE__ */ new WeakMap(), E = /* @__PURE__ */ new WeakMap(), B = /* @__PURE__ */ new WeakMap();
class H extends T {
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
    const i = ((e = this.config.closeActions) == null ? void 0 : e.clickOutside) ?? !0, s = ((n = this.config.closeActions) == null ? void 0 : n.closeButton) ?? !1;
    return {
      clickOutside: i,
      closeButton: s
    };
  }
  get currentContent() {
    return this._currentContent;
  }
  async getContent() {
    return C("<p>Pop Up Button Plugin Content</p>");
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
const je = (t) => t ? `<span class="menu-title">${t}</span>` : "", Ve = (t) => t ? `<i class="menu-icon">${t}</i>` : "", Ge = (t) => t ? `aria-label="${t}"` : "", We = (t) => t ? `<span class="state-text">${t}</span>` : "", qe = (t) => t ? `<i class="state-icon">${t}</i>` : "", Qe = (t, e) => t || e ? `<span class="button-state">${We(t)}${qe(e)}</span>` : "";
function Ye(t, e, n, i, s, a, o) {
  const { id: r = 0, title: u = null, icon: d = null, showTitle: h = !0, stateText: c = null, stateIcon: p = null } = t, l = this, _ = document.createElement("li"), I = a[r] ?? !1, w = C(`
		<button class="menu-button-item${I ? " selected" : ""}" ${Ge(u)} data-id="${r}"" id="${l.name}_menuItem_${r}">
			${Ve(d)}
			${h ? je(u) : ""}
			${c || p ? Qe(c, p) : ""}
		</button>
	`);
  return o && (o._button = w), w.addEventListener("keydown", (m) => {
    var S;
    const L = () => {
      m.stopPropagation(), m.preventDefault();
    };
    if (m.key === "ArrowUp") {
      const g = w.dataPrev;
      g == null || g.focus(), L();
    } else if (m.key === "ArrowDown") {
      const g = w.dataNext;
      g == null || g.focus(), L();
    } else if (m.key === "Tab") {
      const g = m.shiftKey ? m.target.dataPrev : m.target.dataNext;
      g == null || g.focus(), L();
    } else m.key === "Escape" && (this.player.playbackBar.popUp.pop() ? (S = l.button) == null || S.focus() : this.focus(), L());
  }), w.addEventListener("click", async (m) => {
    var S;
    if (e === "check") {
      const L = i.find((g) => g.id === r);
      a[r] = !a[r], l.itemSelected(L, i);
    } else if (e === "radio") {
      a[r] = !0;
      let L = null;
      i.forEach((g) => {
        g.id === r ? L = g : a[g.id] = !1;
      }), l.itemSelected(L, i);
    } else {
      const L = i.find((g) => g.id === r);
      l.itemSelected(L, i);
    }
    await l.checkRefreshContent(), m.stopPropagation(), l.closeOnSelect && (l.closeMenu(), (S = l.button) == null || S.focus());
  }), _.appendChild(w), n.appendChild(_), _;
}
class k extends H {
  get closeOnSelect() {
    return this.config.closeOnSelect === void 0 && (this.buttonType !== "check" ? this.config.closeOnSelect = !0 : this.config.closeOnSelect = !1), this.config.closeOnSelect;
  }
  setSelected(e, n) {
    this._selectedItems && (this._selectedItems[e] = n);
  }
  async getContent() {
    var e, n;
    const i = (e = document.activeElement) == null ? void 0 : e.id, s = C("<menu></menu>");
    this._content = s;
    const a = await this.getMenu();
    this._menuItems = a, this._selectedItems || (this._selectedItems = {}, this._menuItems.forEach((u) => {
      u.selected !== void 0 && u.selected !== null && (this._selectedItems[u.id] = u.selected);
    }));
    const o = self.crypto.randomUUID(), r = a.map((u) => Ye.apply(this, [u, typeof this.buttonType == "function" ? this.buttonType() : this.buttonType, s, a, o, this._selectedItems, u.plugin]));
    return r.forEach((u, d, h) => {
      const c = u.querySelector("button");
      let p = h[d + 1], l = h[d - 1];
      d === h.length - 1 && (p = h[0]), d === 0 && (l = h[h.length - 1]), c.dataNext = p == null ? void 0 : p.querySelector("button"), c.dataPrev = l == null ? void 0 : l.querySelector("button");
    }), this._firstItem = (n = r[0]) == null ? void 0 : n.querySelector("button"), i && setTimeout(() => {
      var u;
      (u = document.getElementById(i)) == null || u.focus();
    }, 10), s;
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
  itemSelected(e, n) {
    this.player.log.warn(`MenuButtonPlugin (${this.name}): itemSelected() function not implemented.`);
  }
  closeMenu() {
    this.player.playbackBar.popUp.hide();
  }
  async showPopUp() {
    this.refreshContent = !0, await super.showPopUp(), this.player.containsFocus && this._firstItem && this._firstItem.focus();
  }
}
const Ke = Object.freeze({
  DISABLED: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5
});
Ke.INFO;
const Je = "@asicupv/paella-basic-plugins", Xe = "2.0.0", et = { ".": "./dist/paella-basic-plugins.js", "./src/": "./src/", "./paella-basic-plugins.css": "./dist/paella-basic-plugins.css" }, tt = "Basic plugins for Paella Player", nt = "./dist/paella-basic-plugins.js", it = "module", st = "./dist/paella-basic-plugins.js", at = ["dist/paella-basic-plugins.css", "dist/paella-basic-plugins.js", "dist/paella-basic-plugins.js.map", "dist/paella-basic-plugins.umd.cjs", "dist/paella-basic-plugins.umd.cjs.map"], rt = { dev: "vite build --watch", build: "vite build --emptyOutDir" }, ot = { type: "git", url: "git+https://github.com/polimediaupv/paella-basic-plugins.git" }, lt = "Fernando Serrano Carpena <ferserc1@gmail.com>", ut = "SEE LICENSE IN license.txt", ct = { url: "https://github.com/polimediaupv/paella-player" }, dt = "https://github.com/polimediaupv/paella-player#readme", ht = { vite: "^6.0.11" }, pt = { "@asicupv/paella-core": "^2.0.0" }, gt = {
  name: Je,
  version: Xe,
  exports: et,
  description: tt,
  main: nt,
  type: it,
  module: st,
  files: at,
  scripts: rt,
  repository: ot,
  author: lt,
  license: ut,
  bugs: ct,
  homepage: dt,
  devDependencies: ht,
  dependencies: pt
};
let D = null;
class f extends De {
  static Get() {
    return D || (D = new f()), D;
  }
  get moduleName() {
    return "paella-basic-plugins";
  }
  get moduleVersion() {
    return gt.version;
  }
  async getDictionaries() {
    return {};
  }
}
const R = `
<svg width="100%" height="100%" viewBox="0 0 39 32" version="1.1" style="fill:none;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <path style="fill: none; stroke: white; stroke-width: 1.5pt" d="M38.499,6.519C38.499,3.471 36.028,1 32.981,1C32.981,1 23.993,0.001 19.499,0.001C15.005,0.001 6.017,1 6.017,1C2.97,1 0.499,3.471 0.499,6.519C0.499,6.519 -0.001,12.899 -0.001,15.751C-0.001,18.91 0.499,25.482 0.499,25.482C0.499,28.529 2.97,31 6.017,31C6.017,31 15.506,32 20,32C24.337,32 32.981,31 32.981,31C36.028,31 38.499,28.529 38.499,25.482C38.499,25.482 39,19.161 39,16C39,12.839 38.499,6.519 38.499,6.519Z"/>
</svg>
`;
class ie extends k {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.audioSelector";
  }
  getAriaLabel() {
    return "Select the active audio track";
  }
  getDescription() {
    return this.getAriaLabel();
  }
  get dynamicWidth() {
    return this.config.showIcon === !1;
  }
  get titleSize() {
    return this.config.showIcon === !1 ? "large" : "small";
  }
  async isEnabled() {
    if (!await super.isEnabled())
      return !1;
    const e = await this.player.videoContainer.streamProvider.getAudioTracks();
    return (e == null ? void 0 : e.length) > 1;
  }
  async load() {
    this.config.showIcon === !1 || (this.icon = this.player.getCustomPluginIcon(this.name, "screenIcon") || R), this._audioTracks = await this.player.videoContainer.streamProvider.getAudioTracks(), await this.updateAudioLabel();
  }
  async getMenu() {
    const e = this.player.videoContainer.streamProvider.currentAudioTrack;
    return this._audioTracks.map((i) => ({
      id: i.id,
      title: this.player.translate(i.name) || this.player.translate(i.language),
      data: i,
      selected: i === e
    }));
  }
  async updateAudioLabel() {
    const e = this.player.videoContainer.streamProvider.currentAudioTrack;
    this.title = e.language;
  }
  async itemSelected(e) {
    await this.player.videoContainer.streamProvider.setCurrentAudioTrack(e.data), this.updateAudioLabel();
  }
}
const Ct = `<svg width="100%" height="100%" viewBox="0 0 27 31" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <g id="repeat" transform="matrix(1,0,0,1,-132.5,-2)">
        <g transform="matrix(1,0,0,1,132.5,2)">
            <path d="M7.364,6.48C9.179,5.515 11.255,4.967 13.461,4.967C20.569,4.967 26.331,10.651 26.331,17.664C26.331,24.676 20.569,30.36 13.461,30.36C8.436,30.36 4.083,27.518 1.964,23.375L1.973,23.34L3.716,22.554C5.531,26.101 9.257,28.534 13.56,28.534C19.645,28.534 24.579,23.667 24.579,17.664C24.579,11.66 19.645,6.793 13.56,6.793C11.624,6.793 9.804,7.286 8.223,8.151L12.5,12L0,12L6.5,0L7.364,6.48Z" style="stroke:black;stroke-width:0.07px;"/>
        </g>
        <g transform="matrix(1.10748,0,0,1.05518,-14.2059,-1.08359)">
            <g>
                <path d="M132.929,20.884L133.826,20.764C133.929,21.273 134.104,21.639 134.352,21.864C134.6,22.088 134.901,22.2 135.257,22.2C135.679,22.2 136.035,22.054 136.326,21.762C136.617,21.469 136.762,21.107 136.762,20.675C136.762,20.263 136.628,19.923 136.359,19.655C136.089,19.388 135.747,19.254 135.332,19.254C135.162,19.254 134.951,19.287 134.699,19.354L134.798,18.566C134.858,18.573 134.906,18.576 134.943,18.576C135.325,18.576 135.669,18.476 135.975,18.277C136.281,18.077 136.433,17.77 136.433,17.355C136.433,17.025 136.322,16.753 136.099,16.537C135.877,16.321 135.589,16.213 135.237,16.213C134.888,16.213 134.597,16.323 134.364,16.542C134.132,16.761 133.982,17.09 133.916,17.529L133.018,17.369C133.128,16.768 133.377,16.302 133.766,15.971C134.155,15.64 134.639,15.475 135.217,15.475C135.616,15.475 135.983,15.561 136.319,15.732C136.654,15.903 136.911,16.136 137.089,16.432C137.267,16.728 137.356,17.042 137.356,17.374C137.356,17.69 137.271,17.978 137.101,18.237C136.932,18.496 136.681,18.702 136.349,18.855C136.781,18.955 137.116,19.162 137.356,19.476C137.595,19.79 137.715,20.183 137.715,20.655C137.715,21.293 137.482,21.834 137.017,22.277C136.551,22.721 135.963,22.943 135.252,22.943C134.61,22.943 134.078,22.752 133.654,22.37C133.23,21.988 132.989,21.492 132.929,20.884Z" style="fill-rule:nonzero;"/>
                <path d="M138.602,19.209C138.602,18.345 138.691,17.649 138.869,17.123C139.047,16.596 139.311,16.19 139.661,15.904C140.012,15.618 140.453,15.475 140.985,15.475C141.377,15.475 141.721,15.554 142.017,15.712C142.313,15.87 142.557,16.097 142.75,16.395C142.943,16.692 143.094,17.055 143.203,17.482C143.313,17.909 143.368,18.485 143.368,19.209C143.368,20.067 143.28,20.759 143.104,21.285C142.928,21.812 142.664,22.219 142.314,22.507C141.963,22.794 141.52,22.938 140.985,22.938C140.28,22.938 139.727,22.685 139.325,22.18C138.843,21.572 138.602,20.582 138.602,19.209ZM139.524,19.209C139.524,20.409 139.665,21.207 139.946,21.604C140.226,22.002 140.573,22.2 140.985,22.2C141.397,22.2 141.744,22.001 142.024,21.602C142.305,21.203 142.446,20.406 142.446,19.209C142.446,18.006 142.305,17.207 142.024,16.811C141.744,16.416 141.394,16.218 140.975,16.218C140.563,16.218 140.234,16.392 139.988,16.741C139.679,17.187 139.524,18.009 139.524,19.209Z" style="fill-rule:nonzero;"/>
                <path d="M144.171,21.233L145.058,21.093C145.108,21.449 145.247,21.722 145.474,21.911C145.702,22.101 146.02,22.195 146.429,22.195C146.841,22.195 147.147,22.111 147.346,21.943C147.546,21.776 147.645,21.579 147.645,21.353C147.645,21.15 147.557,20.99 147.381,20.874C147.258,20.794 146.952,20.693 146.464,20.57C145.806,20.404 145.35,20.26 145.095,20.139C144.841,20.017 144.648,19.85 144.517,19.635C144.386,19.421 144.32,19.184 144.32,18.925C144.32,18.689 144.374,18.47 144.482,18.269C144.59,18.068 144.737,17.901 144.923,17.768C145.063,17.665 145.253,17.578 145.494,17.507C145.735,17.435 145.993,17.399 146.269,17.399C146.685,17.399 147.05,17.459 147.364,17.579C147.678,17.699 147.91,17.861 148.059,18.065C148.209,18.269 148.312,18.543 148.368,18.885L147.491,19.005C147.451,18.732 147.335,18.519 147.144,18.367C146.953,18.214 146.683,18.137 146.334,18.137C145.922,18.137 145.628,18.205 145.452,18.342C145.276,18.478 145.188,18.637 145.188,18.82C145.188,18.937 145.224,19.041 145.297,19.134C145.37,19.231 145.485,19.31 145.641,19.374C145.731,19.407 145.995,19.483 146.434,19.603C147.069,19.772 147.512,19.911 147.762,20.019C148.013,20.127 148.21,20.284 148.353,20.49C148.496,20.696 148.568,20.952 148.568,21.258C148.568,21.557 148.48,21.839 148.306,22.103C148.131,22.367 147.88,22.572 147.551,22.716C147.222,22.861 146.849,22.933 146.434,22.933C145.746,22.933 145.222,22.79 144.861,22.504C144.5,22.218 144.27,21.795 144.171,21.233Z" style="fill-rule:nonzero;"/>
            </g>
        </g>
    </g>
</svg>`;
let se = class extends T {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.backwardButtonPlugin";
  }
  getAriaLabel() {
    return this.player.translate("Backward $1 seconds", [this.time]);
  }
  getDescription() {
    return this.getAriaLabel();
  }
  async isEnabled() {
    const e = await super.isEnabled();
    return this.time = this.config.time || 30, e;
  }
  async load() {
    const e = this.config.suffix !== void 0 ? this.config.suffix : !0;
    this.suffix = e ? "s" : "", this.icon = this.player.getCustomPluginIcon(this.name, "backwardIcon") || Ct, setTimeout(() => {
      var n;
      Array.from(((n = this.iconElement) == null ? void 0 : n.getElementsByClassName("time-text")) || []).forEach((i) => {
        i.innerHTML = this.time + this.suffix;
      });
    }, 100);
  }
  async action() {
    const e = await this.player.videoContainer.currentTime();
    this.player.videoContainer.setCurrentTime(e - this.time);
  }
};
const mt = `<svg width="100%" height="100%" viewBox="0 0 39 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <path d="M37,9.5C37,5.913 34.087,3 30.5,3L8.5,3C4.913,3 2,5.913 2,9.5L2,22.5C2,26.087 4.913,29 8.5,29L30.5,29C34.087,29 37,26.087 37,22.5L37,9.5ZM18.97,21.884C18.97,21.983 18.891,22.125 18.733,22.308C17.111,24.188 15.102,25.128 12.706,25.128C10.21,25.128 8.214,24.217 6.716,22.395C5.319,20.698 4.62,18.577 4.62,16.031C4.62,13.486 5.331,11.356 6.754,9.642C8.268,7.795 10.269,6.872 12.756,6.872C15.277,6.872 17.227,7.725 18.608,9.43C18.741,9.605 18.808,9.75 18.808,9.867C18.808,10.008 18.587,10.426 18.147,11.121C17.706,11.816 17.439,12.163 17.348,12.163C17.24,12.163 16.986,11.959 16.587,11.551C16.096,11.052 15.634,10.678 15.202,10.428C14.486,10.021 13.696,9.817 12.831,9.817C11.184,9.817 9.902,10.445 8.987,11.701C8.172,12.824 7.765,14.238 7.765,15.944C7.765,17.649 8.168,19.076 8.975,20.224C9.89,21.513 11.167,22.158 12.806,22.158C13.621,22.158 14.407,21.954 15.164,21.547C15.663,21.28 16.171,20.902 16.687,20.411C17.119,20.003 17.356,19.8 17.398,19.8C17.448,19.8 17.722,20.13 18.221,20.792C18.721,21.453 18.97,21.817 18.97,21.884ZM34.38,21.884C34.38,21.983 34.301,22.125 34.143,22.308C32.521,24.188 30.512,25.128 28.116,25.128C25.62,25.128 23.624,24.217 22.126,22.395C20.729,20.698 20.03,18.577 20.03,16.031C20.03,13.486 20.741,11.356 22.164,9.642C23.678,7.795 25.678,6.872 28.166,6.872C30.686,6.872 32.637,7.725 34.018,9.43C34.151,9.605 34.218,9.75 34.218,9.867C34.218,10.008 33.997,10.426 33.556,11.121C33.116,11.816 32.849,12.163 32.758,12.163C32.65,12.163 32.396,11.959 31.997,11.551C31.506,11.052 31.044,10.678 30.612,10.428C29.896,10.021 29.106,9.817 28.241,9.817C26.594,9.817 25.312,10.445 24.397,11.701C23.582,12.824 23.174,14.238 23.174,15.944C23.174,17.649 23.578,19.076 24.385,20.224C25.3,21.513 26.577,22.158 28.216,22.158C29.031,22.158 29.817,21.954 30.574,21.547C31.073,21.28 31.581,20.902 32.096,20.411C32.529,20.003 32.766,19.8 32.808,19.8C32.858,19.8 33.132,20.13 33.631,20.792C34.13,21.453 34.38,21.817 34.38,21.884Z" />
</svg>`;
class ae extends k {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.captionsSelectorPlugin";
  }
  getAriaLabel() {
    return "Select captions";
  }
  getDescription() {
    return this.getAriaLabel();
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "captionsIcon") || mt, this._captionsCanvas = this.player.captionsCanvas, this._selected = null, this._captionsCanvas.captions.length == 0 && this.disable(), b(this.player, y.CAPTIONS_CHANGED, () => {
      this._captionsCanvas.captions.length > 0 && this.enable();
    }), b(this.player, y.CAPTIONS_ENABLED, (e) => {
      this._selected = e.language;
    }), b(this.player, y.CAPTIONS_DISABLED, () => {
      this._selected = null;
    });
  }
  async getMenu() {
    const e = [
      {
        id: -1,
        title: "Disabled",
        index: -1,
        selected: this._selected === null
      }
    ];
    return this._captionsCanvas.captions.forEach((n, i) => {
      e.push({
        id: n.language,
        title: n.label,
        index: i,
        selected: n.language === this._selected
      });
    }), e;
  }
  get buttonType() {
    return "radio";
  }
  itemSelected(e) {
    e.index === -1 ? this._captionsCanvas.disableCaptions() : this._captionsCanvas.enableCaptions({ index: e.index });
  }
}
const ft = `<svg width="100%" height="100%" viewBox="0 0 66 66" version="1.1" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(1,0,0,1,1.5,-3.84252)">
        <path d="M35.5,52.843L41.5,52.843L30.5,64.843L19.5,52.843L25.5,52.843L25.5,27.843L35.5,27.843L35.5,52.843ZM13.285,23.741C15.874,15.594 23.502,9.685 32.5,9.685C39.674,9.685 45.979,13.44 49.549,19.09C56.483,20.701 61.657,26.922 61.657,34.343C61.657,42.951 54.196,49.788 45.601,49.842L41.5,49.843L41.5,44.843L45.567,44.842C51.245,44.806 56.343,40.028 56.343,34.343C56.343,29.141 52.495,24.83 47.492,24.107L46.176,23.917L45.539,22.75C43.021,18.135 38.124,15 32.5,15C25.315,15 19.315,20.115 17.949,26.901L17.484,29.213L15.132,29.025C14.924,29.008 14.713,29 14.5,29C10.172,29 6.657,32.514 6.657,36.843C6.657,41.171 9.672,44.842 14,44.843L18.5,44.843L18.5,49.843L14,49.843C6.738,49.843 1.343,44.104 1.343,36.843C1.343,29.99 6.592,24.354 13.285,23.741Z"/>
    </g>
</svg>`;
class re extends H {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.downloadsPlugin";
  }
  async isEnabled() {
    const e = await super.isEnabled();
    if (this._downloads = {}, e) {
      const { streams: n } = this.player.videoManifest;
      n.forEach((i) => {
        let s = [];
        const { mp4: a } = i.sources;
        a && a.forEach((o) => {
          var r, u;
          s.push({
            id: `${i.content}_${((r = o.res) == null ? void 0 : r.w) || 0}_${((u = o.res) == null ? void 0 : u.h) || 0}`,
            src: o.src,
            res: o.res || { w: 0, h: 0 },
            mimetype: o.mimetype
          });
        }), s.length > 0 && (this._downloads[i.content] = s);
      });
    }
    return Object.keys(this._downloads).length > 0;
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "downloadIcon") || ft;
  }
  async getContent() {
    const e = C(`
          <div class="downloads-plugin">
              <h4>${Fe("Available downloads")}</h4>
          </div>`);
    return Object.keys(this._downloads).forEach((i) => {
      const s = C(`
          <div class="downloadStream">
            <div class="title">${i}</div>
          </div>`, e), a = C("<ul></ul>", s);
      this._downloads[i].forEach((r) => {
        const u = `${r.res.w}x${r.res.h}`;
        C(`
                  <li>
                    <a href="${r.src}" target="_blank">
                      <span class="mimetype">[${r.mimetype}]</span><span class="res">${u}</span>
                    </a>
                  </li>
              `, a);
      });
    }), e;
  }
}
const yt = `<svg width="100%" height="100%" viewBox="0 0 256 256" version="1.1" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(1,0,0,1.12928,7.34742,-36.0026)">
        <path d="M64.881,65.571L65.653,58.011C65.716,51.424 73.835,46.089 83.826,46.089C93.857,46.089 102,51.466 102,58.089L101.5,68.542C96.288,64.856 88.807,62.544 80.5,62.544C74.735,62.544 69.368,63.658 64.881,65.571Z"/>
    </g>
    <g transform="matrix(-1,0,0,1.12928,248.653,-36.0026)">
        <path d="M64.881,65.571L65.653,58.011C65.716,51.424 73.835,46.089 83.826,46.089C93.857,46.089 102,51.466 102,58.089L101.5,68.542C96.288,64.856 88.807,62.544 80.5,62.544C74.735,62.544 69.368,63.658 64.881,65.571Z"/>
    </g>
    <g transform="matrix(1,0,0,1.12928,7.34742,-36.0026)">
        <path d="M129.562,96.719L129.624,95.089C129.624,81.291 143.962,70.089 161.624,70.089C179.216,70.089 193.512,81.204 193.623,94.927L193.624,95.089L196.729,121.276C206.965,127.091 212.239,133.908 214.675,146.41C217.073,158.713 223.305,189.137 223.305,192C223.305,209.661 202.813,224 178.805,224C154.797,224 136.305,209.661 134.305,192C133.646,186.176 133.051,180.984 132.515,176.358C129.05,177.4 124.991,178 120.653,178C116.315,178 112.255,177.4 108.79,176.358C108.255,180.984 107.66,186.176 107,192C105,209.661 86.508,224 62.5,224C38.492,224 18,209.661 18,192C18,189.137 24.233,158.713 26.63,146.41C29.066,133.908 34.34,127.091 44.576,121.276L47.682,95.089L47.682,94.927C47.794,81.204 62.089,70.089 79.682,70.089C97.343,70.089 111.682,81.291 111.682,95.089L111.787,97.893C114.663,96.444 118.24,95.585 122.114,95.585C124.782,95.585 127.309,95.992 129.562,96.719ZM63.5,164C82.541,164 98,175.202 98,189C98,202.798 82.541,214 63.5,214C44.459,214 29,202.798 29,189C29,175.202 44.459,164 63.5,164ZM177.805,164C158.764,164 143.305,175.202 143.305,189C143.305,202.798 158.764,214 177.805,214C196.846,214 212.305,202.798 212.305,189C212.305,175.202 196.846,164 177.805,164ZM121,158C127.623,158 133,160.689 133,164C133,167.311 127.623,170 121,170C114.377,170 109,167.311 109,164C109,160.689 114.377,158 121,158Z"/>
    </g>
</svg>`;
class oe extends H {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.findCaptionsPlugin";
  }
  async getContent() {
    const e = this.player.translate("Search"), n = C('<div class="captions-search-container"></div>');
    this._resultsContainer = C('<div class="search-results"></div>', n);
    const s = C(
      `<div class="search-input-container">
                <input type="search" placeholder="${e}"/>
            </div>`,
      n
    ).querySelector("input");
    s.addEventListener("click", (d) => {
      d.stopPropagation();
    });
    const a = navigator.language.substring(0, 2), o = (d) => this.player.captionsCanvas.currentCaptions ? d === this.player.captionsCanvas.currentCaptions.language : d === a, r = () => {
      let d = null;
      this.captions.some((h) => {
        o(h.language) && (d = h);
      }), d || (d = this.captions[0]), this._cueElements = [], d && d.cues.forEach((h) => {
        const c = C(`<p class="result-item">${h.startString}: ${h.captions[0]}</p>`, this._resultsContainer);
        c._cue = h, c.addEventListener("click", async (p) => {
          const l = p.target._cue.start;
          await this.player.videoContainer.setCurrentTime(l), p.stopPropagation();
        }), this._cueElements.push(c);
      });
    };
    r();
    let u = null;
    return s.addEventListener("keyup", (d) => {
      u && clearTimeout(u), this._resultsContainer.innerHTML = "";
      const h = this.player.getLanguage();
      u = setTimeout(() => {
        const c = {};
        this.captions.forEach((p) => {
          p.cues.forEach((l) => {
            l.captions.find((_) => new RegExp(s.value, "i").test(_)) && (c[l.startString] = c[l.startString] || { cue: l, text: {} }, c[l.startString].text[p.language] = l.captions);
          });
        }), this._cueElements = [];
        for (const p in c) {
          const l = c[p], _ = l.text[h] || l.text[Object.keys(l.text)[0]], I = C(`<p class="result-item">${l.cue.startString}: ${_[0]}</p>`, this._resultsContainer);
          I._cue = l.cue, I.addEventListener("click", async (w) => {
            const m = w.target._cue.start;
            await this.player.videoContainer.setCurrentTime(m), w.stopPropagation();
          }), this._cueElements.push(I);
        }
        Object.keys(c).length === 0 && s.value !== "" ? C(`<p>${this.player.translate("No results found")}</p>`, this._resultsContainer) : s.value === "" && r(), u = null;
      }, 1e3), d.stopPropagation();
    }), this._timeupdateEvent || (this._timeupdateEvent = async (d) => {
      var h;
      s.value === "" && ((h = this._cueElements) != null && h.length) && this._cueElements.forEach((c) => {
        if (c._cue.start <= d.currentTime && c._cue.end >= d.currentTime) {
          c.classList.add("current");
          const p = c.offsetTop - this._resultsContainer.scrollTop;
          (p < 0 || p > this._resultsContainer.clientHeight) && this._resultsContainer.scrollTo({ top: c.offsetTop - 20 });
        } else
          c.classList.remove("current");
      });
    }, this.player.bindEvent(y.TIMEUPDATE, this._timeupdateEvent, !0)), setTimeout(() => this.refreshContent = !0, 10), n;
  }
  get popUpType() {
    return "no-modal";
  }
  get captions() {
    return this.player.captionsCanvas.captions;
  }
  get customPopUpClass() {
    return "find-captions";
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "findCaptionsIcon") || yt, this._captionsCanvas = this.player.captionsCanvas, this.captions.length === 0 && this.disable(), b(this.player, y.CAPTIONS_CHANGED, () => {
      this.captions.length > 0 && this.enable();
    });
  }
}
const Lt = `<svg width="100%" height="100%" viewBox="0 0 27 31" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <g id="repeat" transform="matrix(1,0,0,1,-132.5,-2)">
        <g transform="matrix(-1,0,-0,1,158.831,2)">
            <path d="M7.364,6.48C9.179,5.515 11.255,4.967 13.461,4.967C20.569,4.967 26.331,10.651 26.331,17.664C26.331,24.676 20.569,30.36 13.461,30.36C8.436,30.36 4.083,27.518 1.964,23.375L1.973,23.34L3.716,22.554C5.531,26.101 9.257,28.534 13.56,28.534C19.645,28.534 24.579,23.667 24.579,17.664C24.579,11.66 19.645,6.793 13.56,6.793C11.624,6.793 9.804,7.286 8.223,8.151L12.5,12L0,12L6.5,0L7.364,6.48Z" style="stroke:black;stroke-width:0.07px;"/>
        </g>
        <g transform="matrix(1.10748,0,0,1.05518,-5.70486,-1.08359)">
            <g>
                <path d="M132.929,20.884L133.826,20.764C133.929,21.273 134.104,21.639 134.352,21.864C134.6,22.088 134.901,22.2 135.257,22.2C135.679,22.2 136.035,22.054 136.326,21.762C136.617,21.469 136.762,21.107 136.762,20.675C136.762,20.263 136.628,19.923 136.359,19.655C136.089,19.388 135.747,19.254 135.332,19.254C135.162,19.254 134.951,19.287 134.699,19.354L134.798,18.566C134.858,18.573 134.906,18.576 134.943,18.576C135.325,18.576 135.669,18.476 135.975,18.277C136.281,18.077 136.433,17.77 136.433,17.355C136.433,17.025 136.322,16.753 136.099,16.537C135.877,16.321 135.589,16.213 135.237,16.213C134.888,16.213 134.597,16.323 134.364,16.542C134.132,16.761 133.982,17.09 133.916,17.529L133.018,17.369C133.128,16.768 133.377,16.302 133.766,15.971C134.155,15.64 134.639,15.475 135.217,15.475C135.616,15.475 135.983,15.561 136.319,15.732C136.654,15.903 136.911,16.136 137.089,16.432C137.267,16.728 137.356,17.042 137.356,17.374C137.356,17.69 137.271,17.978 137.101,18.237C136.932,18.496 136.681,18.702 136.349,18.855C136.781,18.955 137.116,19.162 137.356,19.476C137.595,19.79 137.715,20.183 137.715,20.655C137.715,21.293 137.482,21.834 137.017,22.277C136.551,22.721 135.963,22.943 135.252,22.943C134.61,22.943 134.078,22.752 133.654,22.37C133.23,21.988 132.989,21.492 132.929,20.884Z" style="fill-rule:nonzero;"/>
                <path d="M138.602,19.209C138.602,18.345 138.691,17.649 138.869,17.123C139.047,16.596 139.311,16.19 139.661,15.904C140.012,15.618 140.453,15.475 140.985,15.475C141.377,15.475 141.721,15.554 142.017,15.712C142.313,15.87 142.557,16.097 142.75,16.395C142.943,16.692 143.094,17.055 143.203,17.482C143.313,17.909 143.368,18.485 143.368,19.209C143.368,20.067 143.28,20.759 143.104,21.285C142.928,21.812 142.664,22.219 142.314,22.507C141.963,22.794 141.52,22.938 140.985,22.938C140.28,22.938 139.727,22.685 139.325,22.18C138.843,21.572 138.602,20.582 138.602,19.209ZM139.524,19.209C139.524,20.409 139.665,21.207 139.946,21.604C140.226,22.002 140.573,22.2 140.985,22.2C141.397,22.2 141.744,22.001 142.024,21.602C142.305,21.203 142.446,20.406 142.446,19.209C142.446,18.006 142.305,17.207 142.024,16.811C141.744,16.416 141.394,16.218 140.975,16.218C140.563,16.218 140.234,16.392 139.988,16.741C139.679,17.187 139.524,18.009 139.524,19.209Z" style="fill-rule:nonzero;"/>
                <path d="M144.171,21.233L145.058,21.093C145.108,21.449 145.247,21.722 145.474,21.911C145.702,22.101 146.02,22.195 146.429,22.195C146.841,22.195 147.147,22.111 147.346,21.943C147.546,21.776 147.645,21.579 147.645,21.353C147.645,21.15 147.557,20.99 147.381,20.874C147.258,20.794 146.952,20.693 146.464,20.57C145.806,20.404 145.35,20.26 145.095,20.139C144.841,20.017 144.648,19.85 144.517,19.635C144.386,19.421 144.32,19.184 144.32,18.925C144.32,18.689 144.374,18.47 144.482,18.269C144.59,18.068 144.737,17.901 144.923,17.768C145.063,17.665 145.253,17.578 145.494,17.507C145.735,17.435 145.993,17.399 146.269,17.399C146.685,17.399 147.05,17.459 147.364,17.579C147.678,17.699 147.91,17.861 148.059,18.065C148.209,18.269 148.312,18.543 148.368,18.885L147.491,19.005C147.451,18.732 147.335,18.519 147.144,18.367C146.953,18.214 146.683,18.137 146.334,18.137C145.922,18.137 145.628,18.205 145.452,18.342C145.276,18.478 145.188,18.637 145.188,18.82C145.188,18.937 145.224,19.041 145.297,19.134C145.37,19.231 145.485,19.31 145.641,19.374C145.731,19.407 145.995,19.483 146.434,19.603C147.069,19.772 147.512,19.911 147.762,20.019C148.013,20.127 148.21,20.284 148.353,20.49C148.496,20.696 148.568,20.952 148.568,21.258C148.568,21.557 148.48,21.839 148.306,22.103C148.131,22.367 147.88,22.572 147.551,22.716C147.222,22.861 146.849,22.933 146.434,22.933C145.746,22.933 145.222,22.79 144.861,22.504C144.5,22.218 144.27,21.795 144.171,21.233Z" style="fill-rule:nonzero;"/>
            </g>
        </g>
    </g>
</svg>`;
let le = class extends T {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.forwardButtonPlugin";
  }
  getAriaLabel() {
    return this.player.translate("Forward $1 seconds", [this.config.time]);
  }
  getDescription() {
    return this.getAriaLabel();
  }
  async isEnabled() {
    const e = await super.isEnabled();
    return this.time = this.config.time || 30, e;
  }
  async load() {
    const e = this.config.suffix !== void 0 ? this.config.suffix : !0;
    this.suffix = e ? "s" : "", this.icon = this.player.getCustomPluginIcon(this.name, "forwardIcon") || Lt, setTimeout(() => {
      var n;
      Array.from(((n = this.iconElement) == null ? void 0 : n.getElementsByClassName("time-text")) || []).forEach((i) => {
        i.innerHTML = this.time + this.suffix;
      });
    }, 100);
  }
  async action() {
    const e = await this.player.videoContainer.currentTime();
    this.player.videoContainer.setCurrentTime(e + this.time);
  }
};
const vt = `
<svg width="100%" height="100%" viewBox="0 0 34 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <g id="FullScreen" transform="matrix(1,0,0,1,-363,-6)">
        <g>
            <g>
                <g transform="matrix(1,0,0,1,-2,2.84217e-14)">
                    <path d="M368.492,8.078L371.207,10.793L369.793,12.207L367.078,9.492L365,11.57L365.014,7.428L365,7.414L365.014,7.4L365.019,6.019L366.4,6.014L366.414,6L366.428,6.014L370.57,6L368.492,8.078Z"/>
                </g>
                <g transform="matrix(1,0,0,-1,-2,40)">
                    <path d="M368.492,8.078L371.207,10.793L369.793,12.207L367.078,9.492L365,11.57L365.014,7.428L365,7.414L365.014,7.4L365.019,6.019L366.4,6.014L366.414,6L366.428,6.014L370.57,6L368.492,8.078Z"/>
                </g>
                <g transform="matrix(-1,0,0,1,762,2.84217e-14)">
                    <path d="M368.492,8.078L371.207,10.793L369.793,12.207L367.078,9.492L365,11.57L365.014,7.428L365,7.414L365.014,7.4L365.019,6.019L366.4,6.014L366.414,6L366.428,6.014L370.57,6L368.492,8.078Z"/>
                </g>
                <g transform="matrix(-1,0,0,-1,762,40)">
                    <path d="M368.492,8.078L371.207,10.793L369.793,12.207L367.078,9.492L365,11.57L365.014,7.428L365,7.414L365.014,7.4L365.019,6.019L366.4,6.014L366.414,6L366.428,6.014L370.57,6L368.492,8.078Z"/>
                </g>
                <g transform="matrix(1,0,0,0.886475,0,2.17871)">
                    <rect x="369" y="12.207" width="22" height="15.793"/>
                </g>
                <g transform="matrix(1,0,0,1,-0.0588586,-0.780796)">
                </g>
            </g>
        </g>
    </g>
</svg>`, wt = `
<svg width="100%" height="100%" viewBox="0 0 37 29" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <g id="Exit-FullScreen" serif:id="Exit FullScreen" transform="matrix(1,0,0,1,-361.793,-5.79289)">
        <g>
            <g transform="matrix(1,0,0,-1,27,18)">
                <path d="M368.492,8.078L371.207,10.793L369.793,12.207L367.078,9.492L365,11.57L365.014,7.428L365,7.414L365.014,7.4L365.019,6.019L366.4,6.014L366.414,6L366.428,6.014L370.57,6L368.492,8.078Z"/>
            </g>
            <g transform="matrix(-1,0,0,1,733,22)">
                <path d="M368.492,8.078L371.207,10.793L369.793,12.207L367.078,9.492L365,11.57L365.014,7.428L365,7.414L365.014,7.4L365.019,6.019L366.4,6.014L366.414,6L366.428,6.014L370.57,6L368.492,8.078Z"/>
            </g>
            <g transform="matrix(-1,0,0,-1,733,18)">
                <path d="M368.492,8.078L371.207,10.793L369.793,12.207L367.078,9.492L365,11.57L365.014,7.428L365,7.414L365.014,7.4L365.019,6.019L366.4,6.014L366.414,6L366.428,6.014L370.57,6L368.492,8.078Z"/>
            </g>
            <g transform="matrix(1,0,0,1,27,22)">
                <path d="M368.492,8.078L371.207,10.793L369.793,12.207L367.078,9.492L365,11.57L365.014,7.428L365,7.414L365.014,7.4L365.019,6.019L366.4,6.014L366.414,6L366.428,6.014L370.57,6L368.492,8.078Z"/>
            </g>
            <g transform="matrix(1,0,0,0.886475,0,2.17871)">
                <rect x="369" y="12.207" width="22" height="15.793"/>
            </g>
        </g>
    </g>
</svg>`;
class ue extends T {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.fullscreenButton";
  }
  getAriaLabel() {
    return "Toggle fullscreen";
  }
  getDescription() {
    return this.getAriaLabel();
  }
  get isFallbackFSAvailable() {
    const { width: e, height: n } = globalThis.visualViewport, { w: i, h: s } = this.player.containerSize;
    return e !== i || n !== s;
  }
  async isEnabled() {
    return await super.isEnabled() && this.player.isFullScreenSupported() || this.isFallbackFSAvailable;
  }
  async load() {
    const e = this.player.getCustomPluginIcon(this.name, "fullscreenIcon") || vt, n = this.player.getCustomPluginIcon(this.name, "windowedIcon") || wt;
    this.icon = e, b(this.player, y.FULLSCREEN_CHANGED, (i) => {
      i.status ? this.icon = n : this.icon = e;
    });
  }
  async toggleFS() {
    this.player.isFullscreen ? await this.player.exitFullscreen() : await this.player.enterFullscreen();
  }
  toggleFallbackFS() {
    this.player.containerElement.classList.contains("paella-fallback-fullscreen") ? this.player.containerElement.classList.remove("paella-fallback-fullscreen") : this.player.containerElement.classList.add("paella-fallback-fullscreen"), setTimeout(() => {
      this.player.resize();
    }, 100);
  }
  async action() {
    this.player.isFullScreenSupported() ? await this.toggleFS() : this.toggleFallbackFS();
  }
}
const bt = `
<svg width="100%" height="100%" viewBox="0 0 39 33" version="1.1" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <path d="M38.02,33L20.02,33L20.02,16L38.02,16L38.02,33ZM18.1,31.479L17.261,28.744C17.261,28.744 15.373,29.986 14.365,29.504C13.356,29.022 13.141,28.161 13.141,28.161L15.089,26L10.02,26L10.02,31.317L12.04,29.194C12.04,29.194 12.571,31.145 13.809,31.959C15.732,33.224 18.1,31.479 18.1,31.479ZM35.846,31C35.844,30.985 35.419,26.773 34.821,25.622C34.222,24.47 31.242,24.429 31.242,24.429C31.242,24.429 30.557,27.413 30.373,27.982C30.189,28.55 30.15,28.681 30.15,28.681C30.15,28.681 29.686,25.798 29.604,25.505C29.543,25.285 29.143,25.271 29.058,25.271C28.973,25.271 28.573,25.297 28.512,25.516C28.431,25.809 28.097,28.617 28.097,28.617C28.097,28.617 27.995,28.55 27.811,27.982C27.627,27.413 26.874,24.429 26.874,24.429C26.874,24.429 23.894,24.47 23.295,25.622C22.696,26.775 22.27,31 22.27,31L35.846,31ZM30.15,24.429C30.209,24.682 29.406,25.228 29.406,25.228L28.763,25.212C28.763,25.212 27.907,24.682 27.966,24.429C28.02,24.196 28.753,24.222 29.058,24.219C29.365,24.222 30.096,24.196 30.15,24.429ZM25.02,15L22.02,15L22.02,3L23.02,3L23.02,2L2.02,2L2.02,3L3.02,3L3.02,17L11.79,17L8.396,21.381C8.078,21.995 8.205,22.353 8.367,22.49C8.531,22.629 8.944,22.69 9.341,22.282L12.926,18.594L16.429,22.282C16.589,22.542 16.931,22.561 17.322,22.405C17.601,22.293 17.521,21.746 17.374,21.381L13.875,17L19.02,17L19.02,24L0,24L0,0L25.02,0L25.02,15ZM29.058,17.067C30.719,17.067 32.068,18.527 32.068,20.326C32.068,22.125 30.719,23.586 29.058,23.586C27.397,23.586 26.048,22.125 26.048,20.326C26.048,18.527 27.397,17.067 29.058,17.067ZM21.02,15L21.02,3L4.02,3L4.02,16L19.02,16L19.02,15L21.02,15ZM35.1,14L30.032,14L31.98,11.839C31.98,11.839 31.765,10.978 30.756,10.496C29.747,10.014 27.86,11.256 27.86,11.256L27.02,8.521C27.02,8.521 29.389,6.776 31.312,8.041C32.55,8.855 33.081,10.806 33.081,10.806L35.1,8.683L35.1,14ZM10.744,7.462L6.356,13.008L5.922,12.61L10.727,6.537L13.847,9.959L18.147,5.333L18.55,5.767L13.846,10.826L10.744,7.462Z"/>
</svg>`;
class ce extends k {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.layoutSelector";
  }
  getAriaLabel() {
    return "Video layout";
  }
  getDescription() {
    return this.getAriaLabel();
  }
  async isEnabled() {
    return await super.isEnabled() ? this.player.videoContainer.validContentSettings.length > 1 : !1;
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "layoutIcon") || bt, this._showIcons = this.config.showIcons ?? !0;
  }
  async getMenu() {
    const e = this.player.videoContainer.validContentSettings;
    return Promise.all(await e.map(async (n) => {
      const i = G.joinPath([this.player.configResourcesUrl, n.icon]), s = this._showIcons && await G.loadSvgIcon(i) || null;
      return {
        id: n.id,
        title: n.title,
        icon: s,
        selected: this.player.videoContainer.layoutId === n.id
      };
    }));
  }
  get showTitles() {
    return !1;
  }
  get buttonType() {
    return "radio";
  }
  itemSelected(e) {
    this.player.videoContainer.setLayout(e.id);
  }
}
class de extends k {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.playbackRateButton";
  }
  getAriaLabel() {
    return "Playback rate";
  }
  getDescription() {
    return this.getAriaLabel();
  }
  get dynamicWidth() {
    return this.config.showIcon === !1;
  }
  async load() {
    this.config.showIcon === !1 || (this.icon = this.player.getCustomPluginIcon(this.name, "screenIcon") || R);
    const e = await this.player.videoContainer.playbackRate();
    this.title = `${e}x`, this._rates = this.config.rates || [0.5, 0.75, 1, 1.25, 1.5, 2], this.player.bindEvent(y.PLAYBACK_RATE_CHANGED, (n) => {
      this.title = n.newPlaybackRate + "x";
    });
  }
  async getMenu() {
    const e = await this.player.videoContainer.playbackRate(), n = (i) => ({
      id: i,
      title: `${i}x`,
      selected: i == e
    });
    return this._rates.map((i) => n(i));
  }
  get titleSize() {
    return this.config.showIcon === !1 ? "large" : "small";
  }
  async itemSelected(e) {
    await this.player.videoContainer.setPlaybackRate(e.id), this.title = e.title;
  }
  get buttonType() {
    return "radio";
  }
}
class he extends k {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.qualitySelector";
  }
  getAriaLabel() {
    return "Video quality";
  }
  getDescription() {
    return this.getAriaLabel();
  }
  get dynamicWidth() {
    return this.config.showIcon === !1;
  }
  get titleSize() {
    return this.config.showIcon === !1 ? "large" : "small";
  }
  async isEnabled() {
    return await super.isEnabled() ? (this._qualities = await this.player.videoContainer.streamProvider.getQualities(), this._qualities && this._qualities.length > 1) : !1;
  }
  async load() {
    this.config.showIcon === !1 || (this.icon = this.player.getCustomPluginIcon("es.upv.paella.qualitySelector", "screenIcon") || R), await this.updateQualityLabel();
  }
  async getMenu() {
    const e = await this.player.videoContainer.streamProvider.getCurrentQuality();
    return this._qualities.map((i) => {
      const s = i.index === e.index;
      return {
        id: i.index,
        title: i.label,
        width: i.res.w,
        height: i.res.h,
        data: i,
        selected: s
      };
    });
  }
  async updateQualityLabel() {
    const e = async () => {
      const n = await this.player.videoContainer.streamProvider.getCurrentQuality();
      n ? this.title = n.shortLabel : setTimeout(() => e(), 500);
    };
    e();
  }
  async itemSelected(e) {
    await this.player.videoContainer.streamProvider.setQuality(e.data), this.updateQualityLabel();
  }
  get buttonType() {
    return "radio";
  }
}
const _t = `
    <svg width="100%" height="100%" viewBox="0 0 34 30" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
        <g transform="matrix(1,0,0,1,-164.25,-6)">
            <path d="M184.233,14.077C188.981,14.489 191.571,24.435 184.954,27.208C183.497,27.819 181.723,25.826 183.988,24.902C187.22,23.511 187.697,17.939 183.734,16.5C183.734,16.5 181.944,14.012 184.233,14.077Z" style="fill-rule:nonzero;"/>
        </g>
        <g transform="matrix(1.79727,0,0,1.79727,-310.137,-22.5434)">
            <path d="M184.236,14.634C184.819,14.72 184.834,14.837 185.078,14.956C188.213,16.489 189.629,20.834 187.848,23.947C187.088,25.275 185.842,26.312 184.395,26.83C184.395,26.83 184.071,26.925 183.815,26.778C183.217,26.436 183.496,25.849 184.723,25.159C187.985,23.325 187.943,17.417 183.927,15.98C183.927,15.98 182.939,14.544 184.236,14.634Z" style="fill-rule:nonzero;"/>
        </g>
        <g transform="matrix(2.44245,0,0,2.44245,-427.303,-35.9308)">
            <path d="M184.199,14.815C184.625,14.866 186.828,16.03 187.775,17.801C189.443,20.92 187.935,25.329 184.388,26.637C184.388,26.637 183.459,26.646 183.677,26.009C183.808,25.624 184.344,25.578 184.77,25.344C187.184,24.016 188.202,20.604 186.8,18.153C186.181,17.07 185.166,16.228 183.988,15.807C183.988,15.807 183.242,14.787 184.199,14.815Z" style="fill-rule:nonzero;"/>
        </g>
        <g transform="matrix(1,0,0,1,-125,-5)">
            <path d="M131.499,14L139.68,5C140.961,5 142,6.039 142,7.32L142,31.68C142,32.961 140.961,34 139.68,34L131.499,25L127.375,25C126.063,25 125,23.937 125,22.625L125,16.375C125,15.063 126.063,14 127.375,14L131.499,14Z"/>
        </g>
    </svg>`, xt = `
    <svg width="100%" height="100%" viewBox="0 0 29 29" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <g id="volume-mid" serif:id="volume mid" transform="matrix(1,0,0,1,-165,-5)">
        <g>
            <g transform="matrix(1,0,0,1,0.75,-1)">
                <path d="M184.233,14.077C188.981,14.489 191.571,24.435 184.954,27.208C183.497,27.819 181.723,25.826 183.988,24.902C187.22,23.511 187.697,17.939 183.734,16.5C183.734,16.5 181.944,14.012 184.233,14.077Z" style="fill-rule:nonzero;"/>
            </g>
            <g transform="matrix(1.79727,0,0,1.79727,-145.137,-17.5434)">
                <path d="M184.236,14.634C184.819,14.72 184.834,14.837 185.078,14.956C188.213,16.489 189.629,20.834 187.848,23.947C187.088,25.275 185.842,26.312 184.395,26.83C184.395,26.83 184.071,26.925 183.815,26.778C183.217,26.436 183.496,25.849 184.723,25.159C187.985,23.325 187.943,17.417 183.927,15.98C183.927,15.98 182.939,14.544 184.236,14.634Z" style="fill-rule:nonzero;"/>
            </g>
            <g transform="matrix(1,0,0,1,40,0)">
                <path d="M131.499,14L139.68,5C140.961,5 142,6.039 142,7.32L142,31.68C142,32.961 140.961,34 139.68,34L131.499,25L127.375,25C126.063,25 125,23.937 125,22.625L125,16.375C125,15.063 126.063,14 127.375,14L131.499,14Z"/>
            </g>
        </g>
    </g>
    </svg>`, Et = `<svg width="100%" height="100%" viewBox="0 0 25 29" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <g id="volume-low" serif:id="volume low" transform="matrix(1,0,0,1,-165,-5)">
        <g>
            <g transform="matrix(1,0,0,1,0.75,-1)">
                <path d="M184.233,14.077C188.981,14.489 191.571,24.435 184.954,27.208C183.497,27.819 181.723,25.826 183.988,24.902C187.22,23.511 187.697,17.939 183.734,16.5C183.734,16.5 181.944,14.012 184.233,14.077Z" style="fill-rule:nonzero;"/>
            </g>
            <g transform="matrix(1,0,0,1,40,0)">
                <path d="M131.499,14L139.68,5C140.961,5 142,6.039 142,7.32L142,31.68C142,32.961 140.961,34 139.68,34L131.499,25L127.375,25C126.063,25 125,23.937 125,22.625L125,16.375C125,15.063 126.063,14 127.375,14L131.499,14Z"/>
            </g>
        </g>
    </g>
    </svg>`, Pt = `<svg width="100%" height="100%" viewBox="0 0 31 31" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <g id="volume-mute" serif:id="volume mute" transform="matrix(1,0,0,1,-123,-4.71142)">
        <path d="M142,28.522L142,31.68C142,32.961 140.961,34 139.68,34L131.499,25L127.375,25C126.063,25 125,23.937 125,22.625L125,16.375C125,15.063 126.063,14 127.375,14L127.478,14L142,28.522ZM151.228,34.983L123,6.756L125.044,4.711L132.848,12.516L139.68,5C140.961,5 142,6.039 142,7.32L142,21.667L153.272,32.939L151.228,34.983Z"/>
    </g>
    </svg>`;
var P;
class pe extends T {
  constructor() {
    super(...arguments);
    j(this, P, null);
  }
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.volumeButtonPlugin";
  }
  async isEnabled() {
    return await super.isEnabled() && await Be();
  }
  getAriaLabel() {
    return "Volume";
  }
  getDescription() {
    return this.getAriaLabel();
  }
  get className() {
    return "volume-button";
  }
  async updateIcon(n) {
    const i = this.player.getCustomPluginIcon(this.name, "volumeHighIcon") || _t, s = this.player.getCustomPluginIcon(this.name, "volumeMidIcon") || xt, a = this.player.getCustomPluginIcon(this.name, "volumeLowIcon") || Et, o = this.player.getCustomPluginIcon(this.name, "volumeMuteIcon") || Pt;
    switch (!0) {
      case n === 0:
        this.icon = o;
        break;
      case (n > 0 && n <= 0.3):
        this.icon = a;
        break;
      case (n > 0.3 && n <= 0.6):
        this.icon = s;
        break;
      case n > 0.6:
        this.icon = i;
        break;
      default:
        this.icon = i;
    }
  }
  get sliderContainer() {
    return this.config.side === "left" ? this.rightArea : this.leftArea;
  }
  async load() {
    this.showContainerOnFocus = this.config.showVolumeOnFocus ?? !0, this.volumeAlwaysVisible = this.config.volumeAlwaysVisible ?? !1, this._prevVolume = await this.player.videoContainer.volume(), b(this.player, y.VOLUME_CHANGED, ({ volume: s }) => {
      this.updateIcon(s);
    }), this.updateIcon(this._prevVolume);
    const n = await this.player.videoContainer.volume(), i = this.rightSideContainer;
    i.innerHTML = `
            <input type="range" class="isu" min="0" max="100" value="${n * 100}" class="slider" />
        `, V(this, P, i.getElementsByTagName("input")[0]), this.player.bindEvent(y.VOLUME_CHANGED, (s) => {
      A(this, P).value = s.volume * 100;
    }), A(this, P).addEventListener("change", async (s) => {
      this.player.videoContainer.setVolume(s.target.value / 100);
    }), A(this, P).addEventListener("keydown", async (s) => {
      if (s.key === "ArrowLeft" || s.key === "ArrowDown") {
        const a = await this.player.videoContainer.volume();
        this.player.videoContainer.setVolume(Math.max(0, a - 0.1)), s.preventDefault(), s.stopPropagation();
      } else if (s.key === "ArrowRight" || s.key === "ArrowUp") {
        const a = await this.player.videoContainer.volume();
        this.player.videoContainer.setVolume(Math.min(a + 0.1, 1)), s.preventDefault(), s.stopPropagation();
      }
    });
  }
  showSideContainer() {
    this.volumeAlwaysVisible;
  }
  hideSideContainer() {
    this.volumeAlwaysVisible;
  }
  async mouseOver(n) {
    n === this.container && this.showSideContainer();
  }
  async mouseOut(n) {
    n === this.container && this.hideSideContainer();
  }
  async focusIn() {
    this.showContainerOnFocus;
  }
  async focusOut() {
    this.showContainerOnFocus;
  }
  async action() {
    const n = await this.player.videoContainer.volume();
    console.log("VolumePlugin.action(): ", n);
    let i = 0;
    n === 0 && this._prevVolume === 0 ? i = 1 : n === 0 && this._prevVolume > 0 ? i = this._prevVolume : i = 0, await this.player.videoContainer.setVolume(i), this._prevVolume = n;
  }
}
P = new WeakMap();
const kt = [
  {
    plugin: ie,
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
    plugin: ae,
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
  },
  {
    plugin: ce,
    config: {
      enabled: !1
    }
  },
  {
    plugin: de,
    config: {
      enabled: !1
    }
  },
  {
    plugin: he,
    config: {
      enabled: !1
    }
  },
  {
    plugin: pe,
    config: {
      enabled: !1
    }
  }
], At = ie, Mt = se, Ut = ae, Nt = re, Bt = oe, Dt = le, Ot = ue, $t = ce, Zt = de, Ht = he, Rt = pe;
export {
  At as AudioSelectorButtonPlugin,
  Mt as BackwardButtonPlugin,
  Ut as CaptionsSelectorButtonPlugin,
  Nt as DownloadsButtonPlugin,
  Bt as FindCaptionsButtonPlugin,
  Dt as ForwardButtonPlugin,
  Ot as FullscreenButtonPlugin,
  $t as LayoutSelectorButtonPlugin,
  Zt as PlaybackRateButtonPlugin,
  Ht as QualitySelectorButtonPlugin,
  Rt as VolumeButtonPlugin,
  kt as basicPlugins
};
//# sourceMappingURL=paella-basic-plugins.js.map
