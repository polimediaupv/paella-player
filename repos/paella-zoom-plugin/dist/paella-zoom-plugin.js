var H = (n) => {
  throw TypeError(n);
}, N = (n, t, e) => t.has(n) || H("Cannot " + e), u = (n, t, e) => (N(n, t, "read from private field"), e ? e.call(n) : t.get(n)), z = (n, t, e) => t.has(n) ? H("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(n) : t.set(n, e), S = (n, t, e, s) => (N(n, t, "write to private field"), t.set(n, e), e);
function J(n, { excludedTags: t = null } = {}) {
  const e = document.createElement("div");
  e.innerHTML = n;
  const s = ["script"];
  return t && s.push(...t), s.flatMap((i) => Array.from(e.getElementsByTagName(i))).forEach((i) => {
    i.parentElement.removeChild(i);
  }), e.innerHTML;
}
var E;
class k {
  constructor(t) {
    z(this, E, null), S(this, E, t);
  }
  get player() {
    return u(this, E);
  }
}
E = /* @__PURE__ */ new WeakMap();
function Q({ tag: n = "div", attributes: t = {}, children: e = "", innerText: s = "", parent: i = null }) {
  const o = document.createElement(n);
  o.innerText = s;
  for (let h in t)
    o.setAttribute(h, t[h]);
  return o.innerHTML = e, i && i.appendChild(o), o;
}
function I(n, t = null) {
  const e = document.createElement("div");
  e.innerHTML = n;
  const s = e.children[0];
  return t && t.appendChild(s), s;
}
var f;
class tt extends k {
  constructor(t, { tag: e = "div", attributes: s = [], children: i = "", parent: o = null }) {
    super(t), z(this, f, null), S(this, f, Q({ tag: e, attributes: s, children: i, parent: o })), Object.defineProperty(this, e, {
      get: () => u(this, f)
    });
  }
  get element() {
    return u(this, f);
  }
  get parent() {
    return u(this, f).parentElement;
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
    u(this, f).setAttribute(t, e);
  }
  removeFromParent() {
    var t;
    (t = u(this, f).parentElement) == null || t.removeChild(u(this, f));
  }
  setParent(t) {
    this.removeFromParent(), t.appendChild(u(this, f));
  }
}
f = /* @__PURE__ */ new WeakMap();
let R = class extends k {
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
};
class et extends k {
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
class W extends R {
  constructor(t, e, s) {
    super(t, e, s), this.__uiPlugin = !0;
  }
  async getDictionaries() {
    return null;
  }
}
const $ = () => {
  const n = document.createElement("span");
  return n.classList.add("side-container"), n.classList.add("hidden"), n;
};
class nt {
  onIconChanged(t, e, s) {
  }
  onTitleChanged(t, e, s) {
  }
  onStateChanged(t, e, s, i, o) {
  }
}
var C, P, Z;
class U extends W {
  constructor() {
    super(...arguments), z(this, C, null), z(this, P, null), z(this, Z, []);
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
    if (t instanceof nt)
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
    var e;
    if (typeof t == "string" && (t = J(t)), this._icon = t, t && this._button instanceof HTMLElement) {
      const s = this._button.querySelector("i") || I("<i></i>", this._button);
      s.innerHTML = t;
    } else if (this._button instanceof HTMLElement) {
      const s = this._button.querySelector("i");
      s && this._button.removeChild(s);
    }
    (e = this._observer) != null && e.onIconChanged && this._observer.onIconChanged(this, this._icon, t);
  }
  get title() {
    return this._title || "";
  }
  set title(t) {
    var e;
    if (this._title = t, t && this._button instanceof HTMLElement) {
      const s = this._button.querySelector("span") || I(`<span class="button-title-${this.titleSize}"></span>`, this._button);
      s.innerHTML = t;
    } else if (this._button instanceof HTMLElement) {
      const s = this._button.querySelector("span");
      s && this._button.removeChild(s);
    }
    (e = this._observer) != null && e.onTitleChanged && this._observer.onTitleChanged(this, this._title, t);
  }
  // "small", "medium", "large"
  get titleSize() {
    return "medium";
  }
  // "left" or "right"
  get side() {
    var t;
    return ((t = this.config) == null ? void 0 : t.side) || "left";
  }
  get closePopUps() {
    return this.config.closePopUps || this.getClosePopUps();
  }
  getClosePopUps() {
    return !0;
  }
  // "playbackBar" or "videoContainer"
  get parentContainer() {
    var t;
    return ((t = this.config) == null ? void 0 : t.parentContainer) || "playbackBar";
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
    return u(this, C) || (S(this, C, $()), this.container.appendChild(u(this, C))), u(this, C);
  }
  get leftSideContainerPresent() {
    return u(this, C) !== null;
  }
  get rightSideContainer() {
    return u(this, P) || (S(this, P, $()), this.container.appendChild(u(this, P))), u(this, P);
  }
  get rightSideContainerPresent() {
    return u(this, P) !== null;
  }
  get stateText() {
    return null;
  }
  get stateIcon() {
    return null;
  }
  setState({ text: t = null, icon: e = null } = {}) {
    var s, i;
    const o = this._statusText, h = this._statusIcon;
    this._statusText = t, this._statusIcon = e, u(this, Z).forEach((r) => r(this)), this._statusIcon && (this.icon = this._statusIcon), this._statusText && (this.title = this._statusText), (i = (s = this._observer) == null ? void 0 : s.onStateChanged) == null || i.call(s, this, o, t, h, e);
  }
  onStateChange(t) {
    typeof t == "function" ? u(this, Z).push(t) : this.player.log.warn("Invalid callback for ButtonPlugin.onStateChange");
  }
  async action(t, e = null) {
  }
  onResize({ width: t, height: e }) {
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
C = /* @__PURE__ */ new WeakMap(), P = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakMap();
class j extends W {
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
  set icon(t) {
    this._icon = t;
  }
  get side() {
    var t;
    return ((t = this.config) == null ? void 0 : t.side) || "left";
  }
  get buttonName() {
    return this.name;
  }
  get position() {
    switch (this.side) {
      case "left":
        return A.LEFT;
      case "center":
        return A.CENTER;
      case "right":
        return A.RIGHT;
      default:
        throw new Error(`Invalid CanvasButtonPlugin side set: ${this.side}`);
    }
  }
  async action(t) {
    this.player.log.warn(`Action not implemented in canvas button plugin ${this.name}`);
  }
}
const A = Object.freeze({
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right"
});
class st extends tt {
  constructor(t, e, s) {
    super(e, { tag: t, parent: s }), this.element.className = "video-canvas", this._userArea = null, this._buttonsArea = I(`
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
class it extends R {
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
class ot extends U {
  constructor() {
    super(...arguments), this._refreshContent = !0;
  }
  set refreshContent(t) {
    this._refreshContent = t;
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
  async action(t, e) {
    super.action(t, e), this.parentPopUp = e, await this.showPopUp();
  }
  get parentPopUp() {
    return this._parentPopUp;
  }
  set parentPopUp(t) {
    this._parentPopUp = t;
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
    var t, e;
    const s = ((t = this.config.closeActions) == null ? void 0 : t.clickOutside) ?? !0, i = ((e = this.config.closeActions) == null ? void 0 : e.closeButton) ?? !1;
    return {
      clickOutside: s,
      closeButton: i
    };
  }
  get currentContent() {
    return this._currentContent;
  }
  async getContent() {
    return I("<p>Pop Up Button Plugin Content</p>");
  }
  async checkRefreshContent() {
    if (this.refreshContent) {
      const t = await this.getContent();
      this._currentContent.innerHTML = "", Array.from(t.children).forEach((e) => this._currentContent.appendChild(e));
    }
  }
  get popUpType() {
    return this.config.popUpType || "modal";
  }
  hidePopUp() {
    this.player.playbackBar.popUp.isHidden || this.player.playbackBar.popUp.hide();
  }
  async showPopUp() {
    this._keyEventHandler || (this._keyEventHandler = (e) => {
      e.key === "Escape" && this.hidePopUp();
    }, this.button.addEventListener("keydown", this._keyEventHandler));
    const t = this.player.playbackBar.popUp;
    if (t.isHidden || this._contentId !== t.currentContentId) {
      const e = await this.getContent();
      this._currentContent = e, this._contentId = t.show({
        title: this.menuTitle || this.description,
        content: e,
        attachRight: this.popUpType === "timeline" || this.side === "right",
        attachLeft: this.popUpType === "timeline" || this.side === "left",
        parent: this.parentPopUp
      });
    } else
      t.hide();
  }
}
const at = (n) => n ? `<span class="menu-title">${n}</span>` : "", rt = (n) => n ? `<i class="menu-icon">${n}</i>` : "", lt = (n) => n ? `aria-label="${n}"` : "", ut = (n) => n ? `<span class="state-text">${n}</span>` : "", ct = (n) => n ? `<i class="state-icon">${n}</i>` : "", ht = (n, t) => n || t ? `<span class="button-state">${ut(n)}${ct(t)}</span>` : "";
function dt(n, t, e, s, i, o, h) {
  const { id: r = 0, title: l = null, icon: y = null, showTitle: a = !0, stateText: v = null, stateIcon: p = null } = n, d = this, x = document.createElement("li"), X = o[r] ?? !1, w = I(`
		<button class="menu-button-item${X ? " selected" : ""}" ${lt(l)} data-id="${r}"" id="${d.name}_menuItem_${r}">
			${rt(y)}
			${a ? at(l) : ""}
			${v || p ? ht(v, p) : ""}
		</button>
	`);
  return h && (h._button = w), w.addEventListener("keydown", (m) => {
    var L;
    const g = () => {
      m.stopPropagation(), m.preventDefault();
    };
    if (m.key === "ArrowUp") {
      const c = w.dataPrev;
      c == null || c.focus(), g();
    } else if (m.key === "ArrowDown") {
      const c = w.dataNext;
      c == null || c.focus(), g();
    } else if (m.key === "Tab") {
      const c = m.shiftKey ? m.target.dataPrev : m.target.dataNext;
      c == null || c.focus(), g();
    } else m.key === "Escape" && (this.player.playbackBar.popUp.pop() ? (L = d.button) == null || L.focus() : this.focus(), g());
  }), w.addEventListener("click", async (m) => {
    var L;
    if (t === "check") {
      const g = s.find((c) => c.id === r);
      o[r] = !o[r], d.itemSelected(g, s);
    } else if (t === "radio") {
      o[r] = !0;
      let g = null;
      s.forEach((c) => {
        c.id === r ? g = c : o[c.id] = !1;
      }), d.itemSelected(g, s);
    } else {
      const g = s.find((c) => c.id === r);
      d.itemSelected(g, s);
    }
    await d.checkRefreshContent(), m.stopPropagation(), d.closeOnSelect && (d.closeMenu(), (L = d.button) == null || L.focus());
  }), x.appendChild(w), e.appendChild(x), x;
}
class pt extends ot {
  get closeOnSelect() {
    return this.config.closeOnSelect === void 0 && (this.buttonType !== "check" ? this.config.closeOnSelect = !0 : this.config.closeOnSelect = !1), this.config.closeOnSelect;
  }
  setSelected(t, e) {
    this._selectedItems && (this._selectedItems[t] = e);
  }
  async getContent() {
    var t, e;
    const s = (t = document.activeElement) == null ? void 0 : t.id, i = I("<menu></menu>");
    this._content = i;
    const o = await this.getMenu();
    this._menuItems = o, this._selectedItems || (this._selectedItems = {}, this._menuItems.forEach((l) => {
      l.selected !== void 0 && l.selected !== null && (this._selectedItems[l.id] = l.selected);
    }));
    const h = self.crypto.randomUUID(), r = o.map((l) => dt.apply(this, [l, typeof this.buttonType == "function" ? this.buttonType() : this.buttonType, i, o, h, this._selectedItems, l.plugin]));
    return r.forEach((l, y, a) => {
      const v = l.querySelector("button");
      let p = a[y + 1], d = a[y - 1];
      y === a.length - 1 && (p = a[0]), y === 0 && (d = a[a.length - 1]), v.dataNext = p == null ? void 0 : p.querySelector("button"), v.dataPrev = d == null ? void 0 : d.querySelector("button");
    }), this._firstItem = (e = r[0]) == null ? void 0 : e.querySelector("button"), s && setTimeout(() => {
      var l;
      (l = document.getElementById(s)) == null || l.focus();
    }, 10), i;
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
  itemSelected(t, e) {
    this.player.log.warn(`MenuButtonPlugin (${this.name}): itemSelected() function not implemented.`);
  }
  closeMenu() {
    this.player.playbackBar.popUp.hide();
  }
  async showPopUp() {
    this.refreshContent = !0, await super.showPopUp(), this.player.containsFocus && this._firstItem && this._firstItem.focus();
  }
}
const mt = Object.freeze({
  DISABLED: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5
});
mt.INFO;
const gt = "@asicupv/paella-zoom-plugin", ft = "2.0.0-beta.0", vt = "A plugin to zoom videos for Paella Player", yt = { ".": "./dist/paella-zoom-plugin.js" }, bt = "./dist/paella-zoom-plugin.js", _t = "module", Ct = "./dist/paella-zoom-plugin.js", Pt = ["dist/paella-zoom-plugin.js"], It = { dev: "vite", build: "vite build --emptyOutDir" }, wt = { type: "git", url: "git+https://github.com/polimediaupv/paella-zoom-plugin.git" }, Lt = ["paella", "player", "zoom", "slide", "presentation", "blackboard", "whiteboard"], zt = "Fernando Serrano Carpena <ferserc1@gmail.com>", Tt = "SEE LICENSE IN license.txt", Et = { url: "https://github.com/polimediaupv/paella-zoom-plugin/issues" }, Zt = "https://github.com/polimediaupv/paella-zoom-plugin#readme", St = { vite: "^6.0.11" }, Mt = { "@asicupv/paella-core": "^2.0.0-beta.4" }, D = {
  name: gt,
  version: ft,
  description: vt,
  exports: yt,
  main: bt,
  type: _t,
  module: Ct,
  files: Pt,
  scripts: It,
  repository: wt,
  keywords: Lt,
  author: zt,
  license: Tt,
  bugs: Et,
  homepage: Zt,
  devDependencies: St,
  dependencies: Mt
}, xt = {
  "Zoom in": "Zoom in",
  "Zoom out": "Zoom out",
  "Show video zoom options": "Zoom-Optionen anzeigen",
  "Use Alt+Scroll to zoom": "Zum Zoomen Alt+Rollen drücken"
}, At = {
  "Zoom in": "Zoom in",
  "Zoom out": "Zoom out",
  "Show video zoom options": "Show video zoom options",
  "Use Alt+Scroll to zoom": "Use Alt+Scroll to zoom"
}, Bt = {
  "Zoom in": "Ampliar zoom del vídeo",
  "Zoom out": "Reducir zoom de vídeo",
  "Show video zoom options": "Mostrar opciones de zoom de vídeo",
  "Use Alt+Scroll to zoom": "Usar Alt+Desplazamiento para hacer zoom"
}, kt = {
  de: xt,
  en: At,
  es: Bt
};
let B = null;
class _ extends et {
  static Get() {
    return B || (B = new _()), B;
  }
  get moduleName() {
    return D.name;
  }
  get moduleVersion() {
    return D.version;
  }
  async getDictionaries() {
    return kt;
  }
}
function T(n, t, e) {
  const s = {
    w: n.offsetWidth,
    h: n.offsetHeight
  }, i = {
    left: s.w / 2,
    top: s.h / 2
  };
  t.style.width = `${e * 100}%`, t.style.height = `${e * 100}%`;
  const o = {
    left: t.offsetLeft,
    top: t.offsetTop,
    w: t.offsetWidth,
    h: t.offsetHeight
  }, h = {
    left: o.w / 2,
    top: o.h / 2
  }, r = {
    left: h.left - i.left,
    top: h.top - i.top
  };
  return e == 1 ? (t.style.left = "0px", t.style.top = "0px", r.left = i.left, r.top = i.top) : (t.style.left = `-${r.left}px`, t.style.top = `-${r.top}px`), r;
}
function Ut(n, t, e) {
  const s = {
    left: t.left + e.left,
    top: t.top + e.top
  }, i = n.parentElement;
  return n.style.top = `-${s.top}px`, n.offsetHeight + n.offsetTop - i.offsetHeight < 0 && (s.top = t.top), n.style.left = `-${s.left}px`, n.offsetWidth + n.offsetLeft - i.offsetWidth < 0 && (s.left = t.left), s;
}
class b extends st {
  constructor(t, e, s) {
    super("div", t, e), this.config = s, this._maxZoom = this.config.maxZoom || 4, this._showButtons = this.config.showButtons !== void 0 ? this.config.showButtons : !0;
  }
  async loadCanvas(t) {
    this.currentZoom = 1, this._videoPlayer = t, t.element.style.width = "100%", t.element.style.height = "100%", t.element.style.position = "absolute", t.element.style.top = "0", t.element.style.left = "0", this.element.style.overflow = "hidden", this.element.style.position = "relative";
    const e = (a) => {
      if (a.stopPropagation(), !a.altKey) {
        this.showAltKeyMessage();
        return;
      }
      this.hideAltKeyMessage();
      const v = a.deltaY !== void 0 ? a.deltaY * 0.1 : a.detail * 4, p = this.currentZoom + v * -0.01;
      p > 1 && p <= this._maxZoom ? (this.currentZoom = p, this._playerCenter = T(this.element, this._videoPlayer.element, this.currentZoom)) : p <= 1 && (this.currentZoom = 1, this._playerCenter = T(this.element, this._videoPlayer.element, this.currentZoom)), a.preventDefault();
    };
    this.element.addEventListener("DOMMouseScroll", e), this.element.addEventListener("mousewheel", e);
    let s = !1, i = !1, o = null;
    const h = () => s = !0, r = () => s = !1, l = (a) => {
      i && (a.stopPropagation(), a.preventDefault());
    };
    this.element.addEventListener("mousedown", h), this.element.addEventListener("mouseleave", r), this.element.addEventListener("mouseup", r), this.element.addEventListener("click", l), this.element.addEventListener("mouseup", l), this.element.addEventListener("mousemove", (a) => {
      if (s && this._playerCenter) {
        o === null && (o = { left: a.clientX, top: a.clientY }), i = !0;
        const v = {
          left: o.left - a.clientX,
          top: o.top - a.clientY
        };
        this.currentZoom == 1 ? this._playerCenter = { left: 0, top: 0 } : this._playerCenter = Ut(this._videoPlayer.element, this._playerCenter, v), o = { left: a.clientX, top: a.clientY };
      } else
        i = !1, o = null;
    });
    const y = this.player.translate("Use Alt+Scroll to zoom");
    this._zoomMessage = I(`
            <div class="zoom-message">${y}</div>
        `, this.element), this._zoomMessage.style.display = "none";
  }
  showAltKeyMessage() {
    this._hideTimeout && clearTimeout(this._hideTimeout), this._zoomMessage.style.display = "", this._hideTimeout = setTimeout(() => {
      this.hideAltKeyMessage();
    }, 2e3);
  }
  hideAltKeyMessage() {
    this._zoomMessage.style.display = "none", this._hideTimeout = null;
  }
  zoomIn() {
    const t = this.currentZoom * 1.1;
    t < this._maxZoom && (this.currentZoom = t, this._playerCenter = T(this.element, this._videoPlayer.element, this.currentZoom));
  }
  zoomOut() {
    const t = this.currentZoom * 0.9;
    t >= 1 && (this.currentZoom = t, this._playerCenter = T(this.element, this._videoPlayer.element, this.currentZoom));
  }
}
let G = class extends it {
  getPluginModuleInstance() {
    return _.Get();
  }
  get name() {
    return super.name || "es.upv.paella.zoomPlugin";
  }
  get canvasType() {
    return "video";
  }
  isCompatible(t) {
    return !Array.isArray(t.canvas) || t.canvas.length === 0 ? !0 : super.isCompatible(t);
  }
  getCanvasInstance(t) {
    return new b(this.player, t, this.config);
  }
};
const M = `<svg width="100%" height="100%" viewBox="0 0 32 32" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <path d="M17.094,18.048C15.976,18.956 14.551,19.5 13,19.5C9.413,19.5 6.5,16.587 6.5,13C6.5,9.413 9.413,6.5 13,6.5C16.587,6.5 19.5,9.413 19.5,13C19.5,14.522 18.976,15.923 18.098,17.031L19.553,18.487C20.094,17.958 20.962,17.962 21.498,18.498L25.522,22.522C26.062,23.062 26.062,23.938 25.522,24.478L24.519,25.481C23.98,26.02 23.103,26.02 22.563,25.481L18.539,21.457C18,20.917 18,20.041 18.539,19.501L18.543,19.497L17.094,18.048ZM13,8C15.76,8 18,10.24 18,13C18,15.76 15.76,18 13,18C10.24,18 8,15.76 8,13C8,10.24 10.24,8 13,8ZM13.927,11.886L15.927,11.886L15.927,13.886L13.927,13.886L13.927,15.886L11.927,15.886L11.927,13.886L9.927,13.886L9.927,11.886L11.927,11.886L11.927,9.886L13.927,9.886L13.927,11.886Z"/>
</svg>`;
let F = class extends U {
  getPluginModuleInstance() {
    return _.Get();
  }
  get name() {
    return super.name || "es.upv.paella.zoomInButtonPlugin";
  }
  getAriaLabel() {
    return "Zoom in";
  }
  getDescription() {
    return this.getAriaLabel();
  }
  async isEnabled() {
    return await super.isEnabled() ? (this.target = this.config.target, this._canvas = this.player.videoContainer.streamProvider.streams[this.target].canvas, this._canvas instanceof b) : !1;
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "zoomInIcon") || M;
  }
  async action() {
    this._canvas.zoomIn();
  }
};
const O = `<svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <path d="M17.094,18.048C15.976,18.956 14.551,19.5 13,19.5C9.413,19.5 6.5,16.587 6.5,13C6.5,9.413 9.413,6.5 13,6.5C16.587,6.5 19.5,9.413 19.5,13C19.5,14.522 18.976,15.923 18.098,17.031L19.553,18.487C20.094,17.958 20.962,17.962 21.498,18.498L25.522,22.522C26.062,23.062 26.062,23.938 25.522,24.478L24.519,25.481C23.98,26.02 23.103,26.02 22.563,25.481L18.539,21.457C18,20.917 18,20.041 18.539,19.501L18.543,19.497L17.094,18.048ZM13,8C15.76,8 18,10.24 18,13C18,15.76 15.76,18 13,18C10.24,18 8,15.76 8,13C8,10.24 10.24,8 13,8ZM9.927,11.886L15.927,11.886L15.927,13.886L9.927,13.886L9.927,11.886Z"/>
</svg>`;
let q = class extends U {
  getPluginModuleInstance() {
    return _.Get();
  }
  get name() {
    return super.name || "es.upv.paella.zoomOutButtonPlugin";
  }
  getAriaLabel() {
    return "Zoom out";
  }
  getDescription() {
    return this.getAriaLabel();
  }
  async isEnabled() {
    return await super.isEnabled() ? (this.target = this.config.target, this._canvas = this.player.videoContainer.streamProvider.streams[this.target].canvas, this._canvas instanceof b) : !1;
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "zoomOutIcon") || O;
  }
  async action() {
    this._canvas.zoomOut();
  }
}, K = class extends pt {
  getPluginModuleInstance() {
    return _.Get();
  }
  get name() {
    return super.name || "es.upv.paella.zoomMenuButtonPlugin";
  }
  getAriaLabel() {
    return "Show video zoom options";
  }
  getDescription() {
    return this.getAriaLabel();
  }
  async isEnabled() {
    return await super.isEnabled() ? (this._target = this.config.target || "presenter", this._canvas = this.player.videoContainer.streamProvider.streams[this._target].canvas, this._canvas instanceof b) : !1;
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "zoomInIcon") || M;
  }
  async getMenu() {
    return [
      {
        id: "in",
        title: "Zoom in",
        icon: this.player.getCustomPluginIcon(this.name, "zoomInIcon") || M
      },
      {
        id: "out",
        title: "Zoom out",
        icon: this.player.getCustomPluginIcon(this.name, "zoomOutIcon") || O
      }
    ];
  }
  get buttonType() {
    return "button";
  }
  get showTitles() {
    return !1;
  }
  itemSelected(t) {
    switch (t.id) {
      case "in":
        this._canvas.zoomIn();
        break;
      case "out":
        this._canvas.zoomOut();
        break;
    }
  }
}, V = class extends j {
  getPluginModuleInstance() {
    return _.Get();
  }
  get name() {
    return super.name || "es.upv.paella.canvasZoomInButtonPlugin";
  }
  async isEnabled() {
    if (!await super.isEnabled())
      return !1;
    let t = !1;
    this._streams = this.player.videoContainer.streamProvider.streams;
    for (const e in this._streams)
      t || (t = this._streams[e].canvas instanceof b);
    return t;
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "zoomInIcon") || M;
  }
  async action(t, e, s, i) {
    s instanceof b && s.zoomIn();
  }
}, Y = class extends j {
  getPluginModuleInstance() {
    return _.Get();
  }
  get name() {
    return super.name || "es.upv.paella.canvasZoomOutButtonPlugin";
  }
  async isEnabled() {
    if (!await super.isEnabled())
      return !1;
    let t = !1;
    this._streams = this.player.videoContainer.streamProvider.streams;
    for (const e in this._streams)
      t || (t = this._streams[e].canvas instanceof b);
    return t;
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "zoomOutIcon") || O;
  }
  async action(t, e, s, i) {
    s instanceof b && s.zoomOut();
  }
};
const Ot = [
  {
    plugin: G,
    config: {
      enabled: !1
    }
  },
  {
    plugin: F,
    config: {
      enabled: !1
    }
  },
  {
    plugin: q,
    config: {
      enabled: !1
    }
  },
  {
    plugin: K,
    config: {
      enabled: !1
    }
  },
  {
    plugin: V,
    config: {
      enabled: !1
    }
  },
  {
    plugin: Y,
    config: {
      enabled: !1
    }
  }
], Gt = Ot, Ft = G, qt = F, Kt = q, Vt = K, Yt = V, Xt = Y;
export {
  Yt as CanvasZoomInButtonPlugin,
  Xt as CanvasZoomOutButtonPlugin,
  Ft as ZoomCanvasPlugin,
  qt as ZoomInButtonPlugin,
  Vt as ZoomMenuButtonPlugin,
  Kt as ZoomOutButtonPlugin,
  Gt as allPlugins,
  Ot as zoomPlugins
};
