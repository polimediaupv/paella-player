const _ = Object.freeze({
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
function x(n, e, t, i = !0) {
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
class S {
  constructor(e) {
    this._player = e;
  }
  get player() {
    return this._player;
  }
}
function ne({ tag: n = "div", attributes: e = {}, children: t = "", innerText: i = "", parent: s = null }) {
  const o = document.createElement(n);
  o.innerText = i;
  for (let p in e)
    o.setAttribute(p, e[p]);
  return o.innerHTML = t, s && s.appendChild(o), o;
}
function C(n, e = null) {
  const t = document.createElement("div");
  t.innerHTML = n;
  const i = t.children[0];
  return e && e.appendChild(i), i;
}
class N extends S {
  constructor(e, { tag: t = "div", attributes: i = [], children: s = "", parent: o = null }) {
    super(e), this._element = ne({ tag: t, attributes: i, children: s, parent: o }), Object.defineProperty(this, t, {
      get: () => this._element
    });
  }
  get element() {
    return this._element;
  }
  get parent() {
    return this._element.parentElement;
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
    this._element.setAttribute(e, t);
  }
  removeFromParent() {
    var e;
    (e = this._element.parentElement) == null || e.removeChild(this._element);
  }
  setParent(e) {
    this.removeFromParent(), e.appendChild(this._element);
  }
}
const se = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
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
`, oe = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(0.707107,0.707107,-0.707107,0.707107,20,-8.28427)">
        <path d="M23,17L23,4.998C23,4.203 22.684,3.44 22.122,2.878C21.56,2.316 20.797,2 20.002,2C20.001,2 19.999,2 19.998,2C19.203,2 18.44,2.316 17.878,2.878C17.316,3.44 17,4.203 17,4.998C17,9.375 17,17 17,17L4.998,17C4.203,17 3.44,17.316 2.878,17.878C2.316,18.44 2,19.203 2,19.998C2,19.999 2,20.001 2,20.002C2,20.797 2.316,21.56 2.878,22.122C3.44,22.684 4.203,23 4.998,23C9.375,23 17,23 17,23L17,35.002C17,35.797 17.316,36.56 17.878,37.122C18.44,37.684 19.203,38 19.998,38C19.999,38 20.001,38 20.002,38C20.797,38 21.56,37.684 22.122,37.122C22.684,36.56 23,35.797 23,35.002C23,30.625 23,23 23,23L35.002,23C35.797,23 36.56,22.684 37.122,22.122C37.684,21.56 38,20.797 38,20.002C38,20.001 38,19.999 38,19.998C38,19.203 37.684,18.44 37.122,17.878C36.56,17.316 35.797,17 35.002,17C30.625,17 23,17 23,17Z"/>
    </g>
</svg>`, w = [];
function M(n, e, t) {
  if (e) {
    e.setAttribute("aria-pressed", !0);
    const { top: i, left: s, right: o, bottom: p, width: h, height: r } = e.getBoundingClientRect(), u = s + h / 2, l = i + r / 2, m = document.body.scrollTop, c = window.innerWidth, v = window.innerHeight, y = window.innerWidth / 2, g = window.innerHeight / 2;
    if (t.style.left = "", t.style.right = "", t.style.bottom = "", t.style.top = "", t.style.width = "", t.style.height = "", t.classList.remove("static-position"), y > u && g <= l) {
      const a = v - (p - r);
      t.style.left = `${s}px`, t.style.bottom = `${a}px`, t.style.maxHeight = `calc(100vh - ${a}px - 10px)`;
    } else if (y > u && g > l)
      t.style.left = `${s}px`, t.style.top = `${i + r + m}px`, t.style.maxHeight = `calc(100vh - ${i + r}px - 10px)`;
    else if (y <= u && g > l)
      t.style.right = `${c - o}px`, t.style.top = `${i + r + m}px`, t.style.maxHeight = `calc(100vh - ${i + r}px - 10px)`;
    else if (y <= u && g <= l) {
      const a = v - (p - r);
      t.style.right = `${c - o}px`, t.style.bottom = `${a}px`, t.style.maxHeight = `calc(100vh - ${a}px - 10px)`;
    }
    setTimeout(() => {
      t.offsetTop < 0 && (t.style.top = "0px");
    }, 100);
  }
}
function re(n) {
  n.__hidePopUpActionContainer || (n.__hidePopUpActionContainer = C('<div class="hide-popup-action-container"></div>'), n.videoContainer.element.appendChild(n.__hidePopUpActionContainer), n.__hidePopUpActionContainer.style.position = "absolute", n.__hidePopUpActionContainer.style.left = "0px", n.__hidePopUpActionContainer.style.top = "0px", n.__hidePopUpActionContainer.style.right = "0px", n.__hidePopUpActionContainer.style.bottom = "0px", n.__hidePopUpActionContainer.style.zIndex = 500, n.__hidePopUpActionContainer.addEventListener("click", (e) => {
    L.HideAllPopUps(!1), e.stopPropagation();
  })), n.__hidePopUpActionContainer.style.display = "block";
}
function le(n) {
  n.__hidePopUpActionContainer && (n.__hidePopUpActionContainer.style.display = "none");
}
function ae(n, e, t, i) {
  const r = e.left - n.x, u = e.top - n.y, l = n.width - r, m = n.height - u;
  switch (!0) {
    case (r <= 10 && u <= 10 && i):
      return "RESIZE_NW";
    case (r <= 10 && m <= 10 && i):
      return "RESIZE_SW";
    case (r <= 10 && i):
      return "RESIZE_W";
    case (l <= 10 && u <= 10 && i):
      return "RESIZE_NE";
    case (l <= 10 && m <= 10 && i):
      return "RESIZE_SE";
    case (l <= 10 && i):
      return "RESIZE_E";
    case (u <= 10 && i):
      return "RESIZE_N";
    case (m <= 10 && i):
      return "RESIZE_S";
    case u <= 10 + t:
      return "MOVE";
    default:
      return "";
  }
}
class L extends N {
  static GetPopUps() {
    return w;
  }
  static IsSomePopUpVisible() {
    return w.some((e) => e.isVisible);
  }
  static GetPopUp(e) {
    return w.find((t) => t.id === e);
  }
  static Contains(e) {
    return w.some((t) => t.element.contains(e));
  }
  static HideAllPopUps(e = !0) {
    w.forEach((t) => {
      (e && t.isModal || !e) && t._closeOnClickOut && t.hide();
    });
  }
  static HideTopPopUp() {
    if (w.length) {
      let e = null;
      if (w.slice().reverse().some((t) => (t.isVisible && (e = t), e !== null)), e && e._closeOnClickOut)
        return e.hide(), !0;
    }
    return !1;
  }
  static Unload() {
    w.forEach((e) => {
      e.removeFromParent();
    });
  }
  static HideNonAncestors(e) {
    w.forEach((t) => {
      e.isParent && !e.isParent(t) && t._closeOnClickOut && t.hide();
    });
  }
  constructor(e, t, i = null, s = null, o = !0, p = !1, h = !1, r = "") {
    const u = {
      class: `${o ? "popup-container" : "popup-container no-modal"} ${r}`
    };
    p = p || h;
    const l = e.getCustomPluginIcon("paella-core", "dock-popup") || se, m = e.getCustomPluginIcon("paella-core", "close-popup") || oe, c = `
		<div class="popup-content${h ? " resizeable" : ""}${p ? " moveable" : " fixed"}">
			<div class="border-top-left"></div><div class="border-top-center"></div><div class="border-top-right"></div>
			<div class="title-bar">
				<div class="title-bar-content"></div>
				<div class="popup-action-buttons">
					<button class="popup-action-button dock-button"><i>${l}</i></button>
					<button class="popup-action-button close-button"><i>${m}</i></button>
				</div>
			</div>
			<div class="center-container"></div>
			<div class="border-bottom-left"></div><div class="border-bottom-center"></div><div class="border-bottom-right"></div>
		</div>
		`;
    super(e, { attributes: u, children: c, parent: t }), this._lastFocusElement = document.activeElement, this._modal = o, this._contextObject = s, this._dragActionData = null, this._moveable = p || h, this._resizeable = h, this._id = Symbol(this), w.push(this), this.element.getElementsByClassName("dock-button")[0].addEventListener("click", (g) => {
      this.dock();
    });
    const y = this.element.getElementsByClassName("close-button")[0];
    y.addEventListener("click", () => this.hide()), y.addEventListener("mousedown", (g) => g.stopPropagation()), this._closeButton = y, this.element.addEventListener("click", () => {
      this._closeOnClickOut && this.hide();
    }), this._contentElement = this.element.getElementsByClassName("popup-content")[0], this._centerContainer = this.element.getElementsByClassName("center-container")[0], this._titleBar = this.element.getElementsByClassName("title-bar")[0], this._centerContainer.addEventListener("mousedown", (g) => {
      g.stopPropagation();
    }), this._contentElement.addEventListener("mousedown", (g) => {
      if (this.moveable || this.resizeable) {
        this._element.style.pointerEvents = "all", this._moved = !0;
        const a = this._contentElement.getBoundingClientRect();
        this._contentElement.classList.add("static-position"), this._contentElement.style.top = a.top + "px", this._contentElement.style.left = a.left + "px", this._contentElement.style.width = a.width + "px", this._contentElement.style.height = a.height + "px", this._contentElement.style.maxHeight = "unset";
        const k = this._titleBar.getBoundingClientRect().height;
        this._centerContainer.style.height = `calc(100% - var(--popup-resizeable-border) * 2 - ${k}px)`;
        const D = {
          left: g.clientX,
          top: g.clientY
        };
        this._dragActionData = {
          popUp: this,
          action: ae(a, D, k, this._resizeable),
          event: g,
          initialPosition: D
        };
      }
      g.stopPropagation();
    }), this.element.addEventListener("mouseup", (g) => {
      this._element.style.pointerEvents = "", (this.moveable || this.resizeable) && (this._dragActionData = null);
    }), this.element.addEventListener("mousemove", (g) => {
      if (this._dragActionData) {
        const a = {
          left: g.clientX - this._dragActionData.initialPosition.left,
          top: g.clientY - this._dragActionData.initialPosition.top
        };
        this._dragActionData.initialPosition = {
          left: g.clientX,
          top: g.clientY
        };
        const d = this._contentElement.getBoundingClientRect();
        this._dragActionData.action === "MOVE" ? (this._contentElement.style.top = `${d.top + a.top}px`, this._contentElement.style.left = `${d.left + a.left}px`, this._contentElement.style.height = `${d.height}px`, this._contentElement.style.width = `${d.width}px`) : this._dragActionData.action === "RESIZE_N" ? (this._contentElement.style.height = `${d.height - a.top}px`, this._contentElement.style.top = `${d.top + a.top}px`) : this._dragActionData.action === "RESIZE_NE" ? (this._contentElement.style.height = `${d.height - a.top}px`, this._contentElement.style.top = `${d.top + a.top}px`, this._contentElement.style.width = `${d.width + a.left}px`, this._contentElement.style.left = `${d.left}px`) : this._dragActionData.action === "RESIZE_E" ? (this._contentElement.style.width = `${d.width + a.left}px`, this._contentElement.style.left = `${d.left}px`) : this._dragActionData.action === "RESIZE_SE" ? (this._contentElement.style.top = `${d.top}px`, this._contentElement.style.left = `${d.left}px`, this._contentElement.style.width = `${d.width + a.left}px`, this._contentElement.style.height = `${d.height + a.top}px`) : this._dragActionData.action === "RESIZE_S" ? (this._contentElement.style.top = `${d.top}px`, this._contentElement.style.height = `${d.height + a.top}px`) : this._dragActionData.action === "RESIZE_SW" ? (this._contentElement.style.top = `${d.top}px`, this._contentElement.style.height = `${d.height + a.top}px`, this._contentElement.style.width = `${d.width - a.left}px`, this._contentElement.style.left = `${d.left + a.left}px`) : this._dragActionData.action === "RESIZE_NW" ? (this._contentElement.style.width = `${d.width - a.left}px`, this._contentElement.style.left = `${d.left + a.left}px`, this._contentElement.style.height = `${d.height - a.top}px`, this._contentElement.style.top = `${d.top + a.top}px`) : this._dragActionData.action === "RESIZE_W" && (this._contentElement.style.width = `${d.width - a.left}px`, this._contentElement.style.left = `${d.left + a.left}px`);
      }
    }), this._contentElement.addEventListener("mouseup", (g) => {
      this._dragActionData = null, this._element.style.pointerEvents = "", g.stopPropagation();
    }), this._contentElement.addEventListener("click", (g) => {
      g.stopPropagation();
    }), this._anchorElement = i, i && M(e, i, this.contentElement), this._parentPopUp = null, this.hide();
  }
  dock() {
    this._moved = !1, this._centerContainer.style.height = "", this.hide(), this.show();
  }
  get lastFocusElement() {
    return this._lastFocusElement;
  }
  get isModal() {
    return this._modal;
  }
  get contextObject() {
    return this._contextObject;
  }
  get id() {
    return this._id;
  }
  // This is the popup window
  get contentElement() {
    return this._contentElement;
  }
  get centerContainer() {
    return this._centerContainer;
  }
  // This is the content element you set with setContent()
  get content() {
    return this._popupContent;
  }
  get parentPopUp() {
    return this._parentPopUp;
  }
  get moveable() {
    return this._moveable;
  }
  get resizeable() {
    return this._resizeable;
  }
  get titleBar() {
    return this._titleBar;
  }
  set title(e) {
    this._title = e, this._titleBar.classList.remove("not-empty");
    const t = this._titleBar.getElementsByClassName("title-bar-content")[0];
    e !== null && e instanceof Element ? (t.innerHTML = "", t.appendChild(e), this._titleBar.classList.add("not-empty")) : e !== null && (t.innerHTML = "", t.innerHTML = this.player.translate(e), this._titleBar.classList.add("not-empty"));
  }
  get title() {
    return this._title;
  }
  setCloseActions({ clickOutside: e = !0, closeButton: t = !1 }) {
    this._closeOnClickOut = e, this._closeOnButton = t, this._closeOnButton ? this._closeButton.style.display = "block" : this._closeButton.style.display = "none";
  }
  isParent(e) {
    return e === this ? !0 : this.parentPopUp === null ? !1 : this.parentPopUp === e ? !0 : this.parentPopUp.isParent(e);
  }
  setContent(e) {
    this.centerContainer.innerHTML = "", typeof e == "string" ? this._popupContent = C(e, this.centerContainer) : (this._popupContent = e, this.centerContainer.appendChild(e));
  }
  show(e = null, t = null) {
    this._anchorElement && !this._moved && M(this.player, this._anchorElement, this.contentElement), e && this.setParent(e), this._parentPopUp = t, t && t.addChild(this), super.show(), L.HideNonAncestors(this), this._closeOnClickOut && re(this.player), E(this.player, _.SHOW_POPUP, {
      popUp: this,
      plugin: this.contextObject
    });
  }
  hide() {
    this.isVisible && (this._children && this._children.forEach((e) => {
      e._closeOnClickOut && e.hide();
    }), this._parentPopUp && this._parentPopUp.removeChild(this), E(this.player, _.HIDE_POPUP, {
      popUp: this,
      plugin: this.contextObject
    }), this._anchorElement && this._anchorElement.setAttribute("aria-pressed", !1), super.hide(), this.lastFocusElement && this.lastFocusElement.focus()), w.some((e) => e.isVisible && e._closeOnClickOut) || le(this.player);
  }
  // Child popUp management
  addChild(e) {
    this._children = this._children || [], this._children.find((t) => t === e) || this._children.push(e);
  }
  removeChild(e) {
    this._children && (this._children = this._children.filter((t) => t !== e));
  }
  destroy() {
    const e = w.indexOf(this);
    e !== -1 && (w.splice(e, 1), this.removeFromParent());
  }
}
function ce(n) {
  return new Promise((e, t) => {
    fetch(n).then((i) => i.text()).then((i) => {
      e(i);
    }).catch((i) => t(i));
  });
}
function ue(n, e) {
  const t = e || "/";
  return n = n.map((i, s) => (s && (i = i.replace(new RegExp("^" + t), "")), s !== n.length - 1 && (i = i.replace(new RegExp(t + "$"), "")), i)), n.join(t);
}
function B(n) {
  const e = Math.floor(n / 60 / 60), t = Math.floor(n / 60) - e * 60, i = Math.floor(n % 60);
  return (e > 0 ? e.toString().padStart(2, "0") + ":" : "") + t.toString().padStart(2, "0") + ":" + i.toString().padStart(2, "0");
}
class V extends S {
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
async function he() {
  return await new Promise((e) => {
    const t = document.createElement("audio"), i = setTimeout(() => e(!1), 100);
    t.addEventListener("volumechange", (s) => {
      clearTimeout(i), e(!0);
    }), t.volume = 0.5;
  });
}
class pe extends S {
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
function T(n) {
  n.__timeLinePopUp || (n.__timeLinePopUp = {
    popUps: [],
    current: null
  });
}
class de extends N {
  static HideUserInterface(e) {
    if (T(e), e.__timeLinePopUp.current) {
      const t = e.__timeLinePopUp.current;
      e.__timeLinePopUp.current.hide(!0), e.__timeLinePopUp.current = t;
    }
  }
  static ShowUserInterface(e) {
    T(e), e.__timeLinePopUp.current && e.__timeLinePopUp.current.show(!0);
  }
  static HideAll(e) {
    var t;
    (t = e == null ? void 0 : e.__timeLinePopUp) == null || t.popUps.forEach((i) => i.hide());
  }
  static Unload(e) {
    e.__timeLinePopUp && (e.__timeLinePopUp.current && e.__timeLinePopUp.current.removeFromParent(), e.__timeLinePopUp.popUps.forEach((t) => {
      t.removeFromParent();
    }), e.__timeLinePopUp.popUps.slice(0), delete e.__timeLinePopUp);
  }
  constructor(e, t = null) {
    T(e);
    const i = {
      class: "timeline-popup-content"
    }, s = e.containerElement;
    super(e, { attributes: i, parent: s }), this._contextObject = t, e.__timeLinePopUp.popUps.forEach((o) => o.hide()), this._id = Symbol(this), e.__timeLinePopUp.popUps.push(this), e.__timeLinePopUp.current = this, E(this.player, _.SHOW_POPUP, {
      popUp: this,
      plugin: this.contextObject
    });
  }
  get contextObject() {
    return this._contextObject;
  }
  show(e = !1) {
    this.isVisible || (this.player.__timeLinePopUp.popUps.forEach((t) => t.hide()), super.show(), this.player.__timeLinePopUp.current = this, e !== !0 && E(this.player, _.SHOW_POPUP, {
      popUp: this,
      plugin: this.contextObject
    }));
  }
  hide(e = !1) {
    this.isVisible && (super.hide(), this.player.__timeLinePopUp.current = null, e !== !0 && E(this.player, _.HIDE_POPUP, {
      popUp: this,
      plugin: this.contextObject
    }));
  }
  setContent(e) {
    e && (this.element.innerHTML = "", this.element.appendChild(e));
  }
}
class ge extends V {
  constructor(e, t, i) {
    super(e, t, i), this.__uiPlugin = !0;
  }
  async getDictionaries() {
    return null;
  }
}
let me = "en", Ce = "";
const O = {};
function fe(n) {
  const e = O[me] || {}, t = O[Ce] || {};
  return e[n] || t[n] || n;
}
let _e = fe;
function we(n, e = null) {
  const t = _e(n);
  if (Array.isArray(e)) {
    let i = t;
    return e.forEach((s, o) => {
      const p = `$${o + 1}`;
      i = i.replace(p, s);
    }), i;
  } else
    return t;
}
function ye(n) {
  return n.__tabIndex = n.__tabIndex || 0, ++n.__tabIndex, n.__tabIndex;
}
class b extends ge {
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
    return ye(this.player);
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
  get icon() {
    return this._icon || (this._icon = ""), this._icon;
  }
  set icon(e) {
    if (this._icon = e, e) {
      const t = this._button.querySelector("i") || C("<i></i>", this._button);
      t.innerHTML = e;
    } else {
      const t = this._button.querySelector("i");
      t && this._button.removeChild(t);
    }
  }
  get title() {
    return this._title || "";
  }
  set title(e) {
    if (this._title = e, e) {
      const t = this._button.querySelector("span") || C(`<span class="button-title-${this.titleSize}"></span>`, this._button);
      t.innerHTML = e;
    } else {
      const t = this._button.querySelector("span");
      t && this._button.removeChild(t);
    }
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
    const { width: e } = this.player.playbackBar.containerSize;
    this._button && (e > this.minContainerSize || this.parentContainer !== "playbackBar") && (this._button.style.display = null);
  }
  async action() {
    this.player.log.warn(`Action not implemented in button plugin ${this.name}`);
  }
  onResize({ width: e, height: t }) {
    e < this.minContainerSize ? this.hide() : this.show();
  }
}
function ve() {
  const n = ["modal", "timeline", "no-modal"], e = () => this.player.log.warn(`Invalid popUpType set in "${this.name}" plugin. Alowed types are "modal", "timeline" and "no-modal"`);
  return n.indexOf(this.config.popUpType) !== -1 ? this.config.popUpType : n.indexOf(this.popUpType) !== -1 ? (this.config.popUpType && e(), this.popUpType) : (e(), "modal");
}
class I extends b {
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
  async action() {
    await this.showPopUp();
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
  async getContent() {
    return C("<p>Pop Up Button Plugin Content</p>");
  }
  get popUpType() {
    return this.config.popUpType || "modal";
  }
  hidePopUp() {
    this.closeParentPopUp ? L.HideAllPopUps(!1) : this._popUp && this._popUp.hide();
  }
  async showPopUp() {
    const e = this.player.isFullscreen ? this.player.containerElement : document.body;
    if (this._popUp)
      if (this.popUpType === "timeline" && this._popUp.isVisible)
        this._popUp.hide();
      else if (this._popUp.isVisible)
        this._popUp.hide();
      else {
        if (this.refreshContent) {
          const t = await this.getContent();
          this._popUp.setContent(t), this.refreshContent = !1;
        }
        this._popUp.show(e, this._parentPopUp);
      }
    else {
      this._popUp = null;
      const t = ve.apply(this);
      if (t === "modal" || t === "no-modal") {
        const { clickOutside: s, closeButton: o } = this.closeActions;
        this._popUp = new L(this.player, e, this.button, this, t === "modal", this.moveable, this.resizeable, this.customPopUpClass), this._popUp.setCloseActions({ clickOutside: s, closeButton: o });
      } else
        t === "timeline" && (this._popUp = new de(this.player, this));
      const i = await this.getContent();
      this._popUp.title = this.menuTitle, this._popUp.setContent(i), this._popUp.show(e, this._parentPopUp), this.refreshContent = !1;
    }
  }
}
const Le = Object.freeze({
  DISABLED: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5
});
Le.INFO;
class P extends I {
  get closeOnSelect() {
    return this.config.closeOnSelect === void 0 && (this.buttonType !== "check" ? this.config.closeOnSelect = !0 : this.config.closeOnSelect = !1), this.config.closeOnSelect;
  }
  async getContent() {
    const e = C('<ul class="menu-button-content"></ul>');
    this.menuTitle;
    const t = await this.getMenu();
    this._menuItems = t;
    let i = !1, s = null;
    return t.forEach((o) => {
      const p = C('<li class="menu-button-item"></li>', e);
      let h = "";
      this.buttonType === "button" ? h = "menu-item-type-button" : this.buttonType === "check" ? h = "menu-item-type-button" + (o.selected ? " selected" : "") : this.buttonType === "radio" && (h = "menu-item-type-button", !i && o.selected && (h += " selected", i = !0));
      let r = "";
      const u = o.title instanceof Element ? o.title : null;
      o.icon && o.title && this.showTitles && !u && (r = `
				<i class="menu-icon">${o.icon}</i>
				<span class="menu-title">${o.title}</span>
				`), o.icon && u && this.showTitles ? r = `
				<i class="menu-icon">${o.icon}</i>
				<span class="menu-title"></span>
				` : o.icon ? r = `
				<i class="menu-icon">${o.icon}</i>
				` : o.title && !u ? r = `
				<span class="menu-title">${o.title}</span>
				` : u && (r = `
				<span class="menu-title"></span>
				`);
      const l = C(
        `
				<button class="${h}" aria-label="${o.title}" title="${o.title}">${r}</button>`,
        p
      );
      u && l.getElementsByClassName("menu-title")[0].appendChild(u), s || (s = l), o.buttonElement = l, l._itemData = o, l.addEventListener("click", (c) => {
        this.buttonType === "check" ? (c.target._itemData.selected = !c.target._itemData.selected, c.target._itemData.selected ? c.target.classList.add("selected") : c.target.classList.remove("selected")) : this.buttonType === "radio" && (this.menuItems.forEach((v) => {
          v.selected = !1, v.buttonElement.classList.remove("selected");
        }), c.target._itemData.selected = !c.target._itemData.selected, c.target._itemData.selected ? c.target.classList.add("selected") : c.target.classList.remove("selected")), this.itemSelected(c.target._itemData, this._menuItems), c.stopPropagation(), this.closeOnSelect && this.closeMenu();
      });
      const m = l.getElementsByTagName("svg");
      m.length > 0 && (/%$/.test(m[0].getAttribute("width")) && m[0].removeAttribute("width"), /%$/.test(m[0].getAttribute("height")) && m[0].removeAttribute("height"));
    }), setTimeout(() => {
      s.focus();
    }, 50), e;
  }
  //get menuTitle() {
  //	return this.config.menuTitle || null;
  //}
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
  buttonType() {
    return "button";
  }
  itemSelected(e, t) {
    this.player.log.warn(`MenuButtonPlugin (${this.name}): itemSelected() function not implemented.`);
  }
  closeMenu() {
    this.config.closeParentPopUp ? L.HideAllPopUps(!1) : this._popUp.hide();
  }
  async showPopUp() {
    this.refreshContent = !0, await super.showPopUp();
  }
}
class xe extends V {
  get type() {
    return "progressIndicator";
  }
  get minHeight() {
    return 0;
  }
  get minHeightHover() {
    return 0;
  }
  drawForeground(e, t, i, s) {
  }
  drawBackground(e, t, i, s) {
  }
  requestUpdate() {
    this.player.playbackBar.progressIndicator.requestUpdateCanvas();
  }
}
const be = "paella-basic-plugins", Pe = "2.0.0", Ee = {
  ".": "./src/index.js",
  "./*": "./src/*",
  "./paella-basic-plugins.css": "./dist/paella-basic-plugins.css"
}, Ie = "Basic plugins for Paella Player", Te = "dist/paella-basic-plugins.js", Ue = "module", Se = "dist/paella-basic-plugins.js", Ae = [
  "dist/paella-basic-plugins.css",
  "dist/paella-basic-plugins.js"
], ke = {
  dev: "vite",
  build: "vite build --emptyOutDir"
}, De = {
  type: "git",
  url: "git+https://github.com/polimediaupv/paella-player.git"
}, Me = "Fernando Serrano Carpena <ferserc1@gmail.com>", Be = "SEE LICENSE IN license.txt", Oe = {
  url: "https://github.com/polimediaupv/paella-player"
}, He = "https://github.com/polimediaupv/paella-player#readme", $e = {
  vite: "^5.0.8"
}, Ne = {
  "paella-core": "../paella-core"
}, Ve = {
  name: be,
  version: Pe,
  exports: Ee,
  description: Ie,
  main: Te,
  type: Ue,
  module: Se,
  files: Ae,
  scripts: ke,
  repository: De,
  author: Me,
  license: Be,
  bugs: Oe,
  homepage: He,
  devDependencies: $e,
  dependencies: Ne
};
let U = null;
class f extends pe {
  static Get() {
    return U || (U = new f()), U;
  }
  get moduleName() {
    return "paella-basic-plugins";
  }
  get moduleVersion() {
    return Ve.version;
  }
  async getDictionaries() {
    return {};
  }
}
const A = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2039%2032'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20xml:space='preserve'%20xmlns:serif='http://www.serif.com/'%20style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;'%3e%3cg%20transform='matrix(1.43396,0,0,1.57895,-350.104,-74)'%3e%3cpath%20d='M271,50.995C271,49.065%20269.277,47.5%20267.152,47.5C267.152,47.5%20260.884,46.867%20257.75,46.867C254.616,46.867%20248.348,47.5%20248.348,47.5C246.223,47.5%20244.5,49.065%20244.5,50.995C244.5,50.995%20244.151,55.036%20244.151,56.842C244.151,58.843%20244.5,63.005%20244.5,63.005C244.5,64.935%20246.223,66.5%20248.348,66.5C248.348,66.5%20254.965,67.133%20258.099,67.133C261.124,67.133%20267.152,66.5%20267.152,66.5C269.277,66.5%20271,64.935%20271,63.005C271,63.005%20271.349,59.002%20271.349,57C271.349,54.998%20271,50.995%20271,50.995Z'/%3e%3c/g%3e%3c/svg%3e";
class G extends P {
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
    this.config.showIcon === !1 || (this.icon = this.player.getCustomPluginIcon(this.name, "screenIcon") || A), this._audioTracks = await this.player.videoContainer.streamProvider.getAudioTracks(), await this.updateAudioLabel();
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
const Ge = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2027%2031'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20xml:space='preserve'%20xmlns:serif='http://www.serif.com/'%20style='fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.41421;'%3e%3cg%20id='repeat'%20transform='matrix(1,0,0,1,-132.5,-2)'%3e%3cg%20transform='matrix(1,0,0,1,132.5,2)'%3e%3cpath%20d='M7.364,6.48C9.179,5.515%2011.255,4.967%2013.461,4.967C20.569,4.967%2026.331,10.651%2026.331,17.664C26.331,24.676%2020.569,30.36%2013.461,30.36C8.436,30.36%204.083,27.518%201.964,23.375L1.973,23.34L3.716,22.554C5.531,26.101%209.257,28.534%2013.56,28.534C19.645,28.534%2024.579,23.667%2024.579,17.664C24.579,11.66%2019.645,6.793%2013.56,6.793C11.624,6.793%209.804,7.286%208.223,8.151L12.5,12L0,12L6.5,0L7.364,6.48Z'%20style='stroke:black;stroke-width:0.07px;'/%3e%3c/g%3e%3cg%20transform='matrix(1.10748,0,0,1.05518,-14.2059,-1.08359)'%3e%3cg%3e%3cpath%20d='M132.929,20.884L133.826,20.764C133.929,21.273%20134.104,21.639%20134.352,21.864C134.6,22.088%20134.901,22.2%20135.257,22.2C135.679,22.2%20136.035,22.054%20136.326,21.762C136.617,21.469%20136.762,21.107%20136.762,20.675C136.762,20.263%20136.628,19.923%20136.359,19.655C136.089,19.388%20135.747,19.254%20135.332,19.254C135.162,19.254%20134.951,19.287%20134.699,19.354L134.798,18.566C134.858,18.573%20134.906,18.576%20134.943,18.576C135.325,18.576%20135.669,18.476%20135.975,18.277C136.281,18.077%20136.433,17.77%20136.433,17.355C136.433,17.025%20136.322,16.753%20136.099,16.537C135.877,16.321%20135.589,16.213%20135.237,16.213C134.888,16.213%20134.597,16.323%20134.364,16.542C134.132,16.761%20133.982,17.09%20133.916,17.529L133.018,17.369C133.128,16.768%20133.377,16.302%20133.766,15.971C134.155,15.64%20134.639,15.475%20135.217,15.475C135.616,15.475%20135.983,15.561%20136.319,15.732C136.654,15.903%20136.911,16.136%20137.089,16.432C137.267,16.728%20137.356,17.042%20137.356,17.374C137.356,17.69%20137.271,17.978%20137.101,18.237C136.932,18.496%20136.681,18.702%20136.349,18.855C136.781,18.955%20137.116,19.162%20137.356,19.476C137.595,19.79%20137.715,20.183%20137.715,20.655C137.715,21.293%20137.482,21.834%20137.017,22.277C136.551,22.721%20135.963,22.943%20135.252,22.943C134.61,22.943%20134.078,22.752%20133.654,22.37C133.23,21.988%20132.989,21.492%20132.929,20.884Z'%20style='fill-rule:nonzero;'/%3e%3cpath%20d='M138.602,19.209C138.602,18.345%20138.691,17.649%20138.869,17.123C139.047,16.596%20139.311,16.19%20139.661,15.904C140.012,15.618%20140.453,15.475%20140.985,15.475C141.377,15.475%20141.721,15.554%20142.017,15.712C142.313,15.87%20142.557,16.097%20142.75,16.395C142.943,16.692%20143.094,17.055%20143.203,17.482C143.313,17.909%20143.368,18.485%20143.368,19.209C143.368,20.067%20143.28,20.759%20143.104,21.285C142.928,21.812%20142.664,22.219%20142.314,22.507C141.963,22.794%20141.52,22.938%20140.985,22.938C140.28,22.938%20139.727,22.685%20139.325,22.18C138.843,21.572%20138.602,20.582%20138.602,19.209ZM139.524,19.209C139.524,20.409%20139.665,21.207%20139.946,21.604C140.226,22.002%20140.573,22.2%20140.985,22.2C141.397,22.2%20141.744,22.001%20142.024,21.602C142.305,21.203%20142.446,20.406%20142.446,19.209C142.446,18.006%20142.305,17.207%20142.024,16.811C141.744,16.416%20141.394,16.218%20140.975,16.218C140.563,16.218%20140.234,16.392%20139.988,16.741C139.679,17.187%20139.524,18.009%20139.524,19.209Z'%20style='fill-rule:nonzero;'/%3e%3cpath%20d='M144.171,21.233L145.058,21.093C145.108,21.449%20145.247,21.722%20145.474,21.911C145.702,22.101%20146.02,22.195%20146.429,22.195C146.841,22.195%20147.147,22.111%20147.346,21.943C147.546,21.776%20147.645,21.579%20147.645,21.353C147.645,21.15%20147.557,20.99%20147.381,20.874C147.258,20.794%20146.952,20.693%20146.464,20.57C145.806,20.404%20145.35,20.26%20145.095,20.139C144.841,20.017%20144.648,19.85%20144.517,19.635C144.386,19.421%20144.32,19.184%20144.32,18.925C144.32,18.689%20144.374,18.47%20144.482,18.269C144.59,18.068%20144.737,17.901%20144.923,17.768C145.063,17.665%20145.253,17.578%20145.494,17.507C145.735,17.435%20145.993,17.399%20146.269,17.399C146.685,17.399%20147.05,17.459%20147.364,17.579C147.678,17.699%20147.91,17.861%20148.059,18.065C148.209,18.269%20148.312,18.543%20148.368,18.885L147.491,19.005C147.451,18.732%20147.335,18.519%20147.144,18.367C146.953,18.214%20146.683,18.137%20146.334,18.137C145.922,18.137%20145.628,18.205%20145.452,18.342C145.276,18.478%20145.188,18.637%20145.188,18.82C145.188,18.937%20145.224,19.041%20145.297,19.134C145.37,19.231%20145.485,19.31%20145.641,19.374C145.731,19.407%20145.995,19.483%20146.434,19.603C147.069,19.772%20147.512,19.911%20147.762,20.019C148.013,20.127%20148.21,20.284%20148.353,20.49C148.496,20.696%20148.568,20.952%20148.568,21.258C148.568,21.557%20148.48,21.839%20148.306,22.103C148.131,22.367%20147.88,22.572%20147.551,22.716C147.222,22.861%20146.849,22.933%20146.434,22.933C145.746,22.933%20145.222,22.79%20144.861,22.504C144.5,22.218%20144.27,21.795%20144.171,21.233Z'%20style='fill-rule:nonzero;'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
let Z = class extends b {
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
    this.suffix = e ? "s" : "", this.icon = this.player.getCustomPluginIcon(this.name, "backwardIcon") || Ge, setTimeout(() => {
      Array.from(this.iconElement.getElementsByClassName("time-text")).forEach((t) => {
        t.innerHTML = this.time + this.suffix;
      });
    }, 100);
  }
  async action() {
    const e = await this.player.videoContainer.currentTime();
    this.player.videoContainer.setCurrentTime(e - this.time);
  }
};
const R = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2039%2032'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20xml:space='preserve'%20xmlns:serif='http://www.serif.com/'%20style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;'%3e%3cpath%20d='M37,9.5C37,5.913%2034.087,3%2030.5,3L8.5,3C4.913,3%202,5.913%202,9.5L2,22.5C2,26.087%204.913,29%208.5,29L30.5,29C34.087,29%2037,26.087%2037,22.5L37,9.5ZM18.97,21.884C18.97,21.983%2018.891,22.125%2018.733,22.308C17.111,24.188%2015.102,25.128%2012.706,25.128C10.21,25.128%208.214,24.217%206.716,22.395C5.319,20.698%204.62,18.577%204.62,16.031C4.62,13.486%205.331,11.356%206.754,9.642C8.268,7.795%2010.269,6.872%2012.756,6.872C15.277,6.872%2017.227,7.725%2018.608,9.43C18.741,9.605%2018.808,9.75%2018.808,9.867C18.808,10.008%2018.587,10.426%2018.147,11.121C17.706,11.816%2017.439,12.163%2017.348,12.163C17.24,12.163%2016.986,11.959%2016.587,11.551C16.096,11.052%2015.634,10.678%2015.202,10.428C14.486,10.021%2013.696,9.817%2012.831,9.817C11.184,9.817%209.902,10.445%208.987,11.701C8.172,12.824%207.765,14.238%207.765,15.944C7.765,17.649%208.168,19.076%208.975,20.224C9.89,21.513%2011.167,22.158%2012.806,22.158C13.621,22.158%2014.407,21.954%2015.164,21.547C15.663,21.28%2016.171,20.902%2016.687,20.411C17.119,20.003%2017.356,19.8%2017.398,19.8C17.448,19.8%2017.722,20.13%2018.221,20.792C18.721,21.453%2018.97,21.817%2018.97,21.884ZM34.38,21.884C34.38,21.983%2034.301,22.125%2034.143,22.308C32.521,24.188%2030.512,25.128%2028.116,25.128C25.62,25.128%2023.624,24.217%2022.126,22.395C20.729,20.698%2020.03,18.577%2020.03,16.031C20.03,13.486%2020.741,11.356%2022.164,9.642C23.678,7.795%2025.678,6.872%2028.166,6.872C30.686,6.872%2032.637,7.725%2034.018,9.43C34.151,9.605%2034.218,9.75%2034.218,9.867C34.218,10.008%2033.997,10.426%2033.556,11.121C33.116,11.816%2032.849,12.163%2032.758,12.163C32.65,12.163%2032.396,11.959%2031.997,11.551C31.506,11.052%2031.044,10.678%2030.612,10.428C29.896,10.021%2029.106,9.817%2028.241,9.817C26.594,9.817%2025.312,10.445%2024.397,11.701C23.582,12.824%2023.174,14.238%2023.174,15.944C23.174,17.649%2023.578,19.076%2024.385,20.224C25.3,21.513%2026.577,22.158%2028.216,22.158C29.031,22.158%2029.817,21.954%2030.574,21.547C31.073,21.28%2031.581,20.902%2032.096,20.411C32.529,20.003%2032.766,19.8%2032.808,19.8C32.858,19.8%2033.132,20.13%2033.631,20.792C34.13,21.453%2034.38,21.817%2034.38,21.884Z'%20/%3e%3c/svg%3e";
class F extends P {
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
    this.icon = this.player.getCustomPluginIcon(this.name, "captionsIcon") || R, this._captionsCanvas = this.player.captionsCanvas, this._selected = null, this._captionsCanvas.captions.length == 0 && this.disable(), x(this.player, _.CAPTIONS_CHANGED, () => {
      this._captionsCanvas.captions.length > 0 && this.enable();
    }), x(this.player, _.CAPTIONS_ENABLED, (e) => {
      this._selected = e.language;
    }), x(this.player, _.CAPTIONS_DISABLED, () => {
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
    return this._captionsCanvas.captions.forEach((t, i) => {
      e.push({
        id: t.language,
        title: t.label,
        index: i,
        selected: t.language === this._selected
      });
    }), e;
  }
  get buttonType() {
    return "radio";
  }
  itemSelected(e) {
    e.index === -1 ? this._captionsCanvas.disableCaptions() : this._captionsCanvas.enableCaptions({ index: e.index }), L.HideAllPopUps(!1);
  }
}
const Ze = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2066%2066'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20xml:space='preserve'%20xmlns:serif='http://www.serif.com/'%20style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;'%3e%3cg%20transform='matrix(1,0,0,1,1.5,-3.84252)'%3e%3cpath%20d='M35.5,52.843L41.5,52.843L30.5,64.843L19.5,52.843L25.5,52.843L25.5,27.843L35.5,27.843L35.5,52.843ZM13.285,23.741C15.874,15.594%2023.502,9.685%2032.5,9.685C39.674,9.685%2045.979,13.44%2049.549,19.09C56.483,20.701%2061.657,26.922%2061.657,34.343C61.657,42.951%2054.196,49.788%2045.601,49.842L41.5,49.843L41.5,44.843L45.567,44.842C51.245,44.806%2056.343,40.028%2056.343,34.343C56.343,29.141%2052.495,24.83%2047.492,24.107L46.176,23.917L45.539,22.75C43.021,18.135%2038.124,15%2032.5,15C25.315,15%2019.315,20.115%2017.949,26.901L17.484,29.213L15.132,29.025C14.924,29.008%2014.713,29%2014.5,29C10.172,29%206.657,32.514%206.657,36.843C6.657,41.171%209.672,44.842%2014,44.843L18.5,44.843L18.5,49.843L14,49.843C6.738,49.843%201.343,44.104%201.343,36.843C1.343,29.99%206.592,24.354%2013.285,23.741Z'/%3e%3c/g%3e%3c/svg%3e";
class j extends I {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.downloadsPlugin";
  }
  async isEnabled() {
    const e = await super.isEnabled();
    if (this._downloads = {}, e) {
      const { streams: t } = this.player.videoManifest;
      t.forEach((i) => {
        let s = [];
        const { mp4: o } = i.sources;
        o && o.forEach((p) => {
          var h, r;
          s.push({
            id: `${i.content}_${((h = p.res) == null ? void 0 : h.w) || 0}_${((r = p.res) == null ? void 0 : r.h) || 0}`,
            src: p.src,
            res: p.res || { w: 0, h: 0 },
            mimetype: p.mimetype
          });
        }), s.length > 0 && (this._downloads[i.content] = s);
      });
    }
    return Object.keys(this._downloads).length > 0;
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "downloadIcon") || Ze;
  }
  async getContent() {
    const e = C(`
          <div class="downloads-plugin">
              <h4>${we("Available downloads")}</h4>
          </div>`);
    return Object.keys(this._downloads).forEach((i) => {
      const s = C(`
          <div class="downloadStream">
            <div class="title">${i}</div>
          </div>`, e), o = C("<ul></ul>", s);
      this._downloads[i].forEach((h) => {
        const r = `${h.res.w}x${h.res.h}`;
        C(`
                  <li>
                    <a href="${h.src}" target="_blank">
                      <span class="mimetype">[${h.mimetype}]</span><span class="res">${r}</span>
                    </a>
                  </li>
              `, o);
      });
    }), e;
  }
}
const Re = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%20256%20256'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20xml:space='preserve'%20xmlns:serif='http://www.serif.com/'%20style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;'%3e%3cg%20transform='matrix(1,0,0,1.12928,7.34742,-36.0026)'%3e%3cpath%20d='M64.881,65.571L65.653,58.011C65.716,51.424%2073.835,46.089%2083.826,46.089C93.857,46.089%20102,51.466%20102,58.089L101.5,68.542C96.288,64.856%2088.807,62.544%2080.5,62.544C74.735,62.544%2069.368,63.658%2064.881,65.571Z'/%3e%3c/g%3e%3cg%20transform='matrix(-1,0,0,1.12928,248.653,-36.0026)'%3e%3cpath%20d='M64.881,65.571L65.653,58.011C65.716,51.424%2073.835,46.089%2083.826,46.089C93.857,46.089%20102,51.466%20102,58.089L101.5,68.542C96.288,64.856%2088.807,62.544%2080.5,62.544C74.735,62.544%2069.368,63.658%2064.881,65.571Z'/%3e%3c/g%3e%3cg%20transform='matrix(1,0,0,1.12928,7.34742,-36.0026)'%3e%3cpath%20d='M129.562,96.719L129.624,95.089C129.624,81.291%20143.962,70.089%20161.624,70.089C179.216,70.089%20193.512,81.204%20193.623,94.927L193.624,95.089L196.729,121.276C206.965,127.091%20212.239,133.908%20214.675,146.41C217.073,158.713%20223.305,189.137%20223.305,192C223.305,209.661%20202.813,224%20178.805,224C154.797,224%20136.305,209.661%20134.305,192C133.646,186.176%20133.051,180.984%20132.515,176.358C129.05,177.4%20124.991,178%20120.653,178C116.315,178%20112.255,177.4%20108.79,176.358C108.255,180.984%20107.66,186.176%20107,192C105,209.661%2086.508,224%2062.5,224C38.492,224%2018,209.661%2018,192C18,189.137%2024.233,158.713%2026.63,146.41C29.066,133.908%2034.34,127.091%2044.576,121.276L47.682,95.089L47.682,94.927C47.794,81.204%2062.089,70.089%2079.682,70.089C97.343,70.089%20111.682,81.291%20111.682,95.089L111.787,97.893C114.663,96.444%20118.24,95.585%20122.114,95.585C124.782,95.585%20127.309,95.992%20129.562,96.719ZM63.5,164C82.541,164%2098,175.202%2098,189C98,202.798%2082.541,214%2063.5,214C44.459,214%2029,202.798%2029,189C29,175.202%2044.459,164%2063.5,164ZM177.805,164C158.764,164%20143.305,175.202%20143.305,189C143.305,202.798%20158.764,214%20177.805,214C196.846,214%20212.305,202.798%20212.305,189C212.305,175.202%20196.846,164%20177.805,164ZM121,158C127.623,158%20133,160.689%20133,164C133,167.311%20127.623,170%20121,170C114.377,170%20109,167.311%20109,164C109,160.689%20114.377,158%20121,158Z'/%3e%3c/g%3e%3c/svg%3e";
class z extends I {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.findCaptionsPlugin";
  }
  async getContent() {
    const e = this.player.translate("Search"), t = C('<div class="captions-search-container"></div>');
    this._resultsContainer = C('<div class="search-results"></div>', t);
    const i = C(`<input type="text" placeholder="${e}"/>`, t);
    i.addEventListener("click", (r) => {
      r.stopPropagation();
    });
    const s = navigator.language.substring(0, 2), o = (r) => this.player.captionsCanvas.currentCaptions ? r === this.player.captionsCanvas.currentCaptions.language : r === s, p = () => {
      let r = null;
      this.captions.some((u) => {
        o(u.language) && (r = u);
      }), r || (r = this.captions[0]), this._cueElements = [], r && r.cues.forEach((u) => {
        const l = C(`<p class="result-item">${u.startString}: ${u.captions[0]}</p>`, this._resultsContainer);
        l._cue = u, l.addEventListener("click", async (m) => {
          const c = m.target._cue.start;
          await this.player.videoContainer.setCurrentTime(c), m.stopPropagation();
        }), this._cueElements.push(l);
      });
    };
    p();
    let h = null;
    return i.addEventListener("keyup", (r) => {
      h && clearTimeout(h), this._resultsContainer.innerHTML = "";
      const u = this.player.getLanguage();
      h = setTimeout(() => {
        const l = {};
        this.captions.forEach((m) => {
          m.cues.forEach((c) => {
            c.captions.find((v) => new RegExp(i.value, "i").test(v)) && (l[c.startString] = l[c.startString] || { cue: c, text: {} }, l[c.startString].text[m.language] = c.captions);
          });
        }), this._cueElements = [];
        for (const m in l) {
          const c = l[m], v = c.text[u] || c.text[Object.keys(c.text)[0]], y = C(`<p class="result-item">${c.cue.startString}: ${v[0]}</p>`, this._resultsContainer);
          y._cue = c.cue, y.addEventListener("click", async (g) => {
            const a = g.target._cue.start;
            await this.player.videoContainer.setCurrentTime(a), g.stopPropagation();
          }), this._cueElements.push(y);
        }
        Object.keys(l).length === 0 && i.value !== "" ? C(`<p>${this.player.translate("No results found")}</p>`, this._resultsContainer) : i.value === "" && p(), h = null;
      }, 1e3), r.stopPropagation();
    }), this._timeupdateEvent || (this._timeupdateEvent = async (r) => {
      var u;
      i.value === "" && ((u = this._cueElements) != null && u.length) && this._cueElements.forEach((l) => {
        if (l._cue.start <= r.currentTime && l._cue.end >= r.currentTime) {
          l.classList.add("current");
          const m = l.offsetTop - this._resultsContainer.scrollTop;
          (m < 0 || m > this._resultsContainer.clientHeight) && this._resultsContainer.scrollTo({ top: l.offsetTop - 20 });
        } else
          l.classList.remove("current");
      });
    }, this.player.bindEvent(_.TIMEUPDATE, this._timeupdateEvent, !0)), setTimeout(() => this.refreshContent = !0, 10), t;
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
    this.icon = this.player.getCustomPluginIcon(this.name, "findCaptionsIcon") || Re, this._captionsCanvas = this.player.captionsCanvas, this.captions.length === 0 && this.disable(), x(this.player, _.CAPTIONS_CHANGED, () => {
      this.captions.length > 0 && this.enable();
    });
  }
}
const Fe = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2027%2031'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20xml:space='preserve'%20xmlns:serif='http://www.serif.com/'%20style='fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.41421;'%3e%3cg%20id='repeat'%20transform='matrix(1,0,0,1,-132.5,-2)'%3e%3cg%20transform='matrix(-1,0,-0,1,158.831,2)'%3e%3cpath%20d='M7.364,6.48C9.179,5.515%2011.255,4.967%2013.461,4.967C20.569,4.967%2026.331,10.651%2026.331,17.664C26.331,24.676%2020.569,30.36%2013.461,30.36C8.436,30.36%204.083,27.518%201.964,23.375L1.973,23.34L3.716,22.554C5.531,26.101%209.257,28.534%2013.56,28.534C19.645,28.534%2024.579,23.667%2024.579,17.664C24.579,11.66%2019.645,6.793%2013.56,6.793C11.624,6.793%209.804,7.286%208.223,8.151L12.5,12L0,12L6.5,0L7.364,6.48Z'%20style='stroke:black;stroke-width:0.07px;'/%3e%3c/g%3e%3cg%20transform='matrix(1.10748,0,0,1.05518,-5.70486,-1.08359)'%3e%3cg%3e%3cpath%20d='M132.929,20.884L133.826,20.764C133.929,21.273%20134.104,21.639%20134.352,21.864C134.6,22.088%20134.901,22.2%20135.257,22.2C135.679,22.2%20136.035,22.054%20136.326,21.762C136.617,21.469%20136.762,21.107%20136.762,20.675C136.762,20.263%20136.628,19.923%20136.359,19.655C136.089,19.388%20135.747,19.254%20135.332,19.254C135.162,19.254%20134.951,19.287%20134.699,19.354L134.798,18.566C134.858,18.573%20134.906,18.576%20134.943,18.576C135.325,18.576%20135.669,18.476%20135.975,18.277C136.281,18.077%20136.433,17.77%20136.433,17.355C136.433,17.025%20136.322,16.753%20136.099,16.537C135.877,16.321%20135.589,16.213%20135.237,16.213C134.888,16.213%20134.597,16.323%20134.364,16.542C134.132,16.761%20133.982,17.09%20133.916,17.529L133.018,17.369C133.128,16.768%20133.377,16.302%20133.766,15.971C134.155,15.64%20134.639,15.475%20135.217,15.475C135.616,15.475%20135.983,15.561%20136.319,15.732C136.654,15.903%20136.911,16.136%20137.089,16.432C137.267,16.728%20137.356,17.042%20137.356,17.374C137.356,17.69%20137.271,17.978%20137.101,18.237C136.932,18.496%20136.681,18.702%20136.349,18.855C136.781,18.955%20137.116,19.162%20137.356,19.476C137.595,19.79%20137.715,20.183%20137.715,20.655C137.715,21.293%20137.482,21.834%20137.017,22.277C136.551,22.721%20135.963,22.943%20135.252,22.943C134.61,22.943%20134.078,22.752%20133.654,22.37C133.23,21.988%20132.989,21.492%20132.929,20.884Z'%20style='fill-rule:nonzero;'/%3e%3cpath%20d='M138.602,19.209C138.602,18.345%20138.691,17.649%20138.869,17.123C139.047,16.596%20139.311,16.19%20139.661,15.904C140.012,15.618%20140.453,15.475%20140.985,15.475C141.377,15.475%20141.721,15.554%20142.017,15.712C142.313,15.87%20142.557,16.097%20142.75,16.395C142.943,16.692%20143.094,17.055%20143.203,17.482C143.313,17.909%20143.368,18.485%20143.368,19.209C143.368,20.067%20143.28,20.759%20143.104,21.285C142.928,21.812%20142.664,22.219%20142.314,22.507C141.963,22.794%20141.52,22.938%20140.985,22.938C140.28,22.938%20139.727,22.685%20139.325,22.18C138.843,21.572%20138.602,20.582%20138.602,19.209ZM139.524,19.209C139.524,20.409%20139.665,21.207%20139.946,21.604C140.226,22.002%20140.573,22.2%20140.985,22.2C141.397,22.2%20141.744,22.001%20142.024,21.602C142.305,21.203%20142.446,20.406%20142.446,19.209C142.446,18.006%20142.305,17.207%20142.024,16.811C141.744,16.416%20141.394,16.218%20140.975,16.218C140.563,16.218%20140.234,16.392%20139.988,16.741C139.679,17.187%20139.524,18.009%20139.524,19.209Z'%20style='fill-rule:nonzero;'/%3e%3cpath%20d='M144.171,21.233L145.058,21.093C145.108,21.449%20145.247,21.722%20145.474,21.911C145.702,22.101%20146.02,22.195%20146.429,22.195C146.841,22.195%20147.147,22.111%20147.346,21.943C147.546,21.776%20147.645,21.579%20147.645,21.353C147.645,21.15%20147.557,20.99%20147.381,20.874C147.258,20.794%20146.952,20.693%20146.464,20.57C145.806,20.404%20145.35,20.26%20145.095,20.139C144.841,20.017%20144.648,19.85%20144.517,19.635C144.386,19.421%20144.32,19.184%20144.32,18.925C144.32,18.689%20144.374,18.47%20144.482,18.269C144.59,18.068%20144.737,17.901%20144.923,17.768C145.063,17.665%20145.253,17.578%20145.494,17.507C145.735,17.435%20145.993,17.399%20146.269,17.399C146.685,17.399%20147.05,17.459%20147.364,17.579C147.678,17.699%20147.91,17.861%20148.059,18.065C148.209,18.269%20148.312,18.543%20148.368,18.885L147.491,19.005C147.451,18.732%20147.335,18.519%20147.144,18.367C146.953,18.214%20146.683,18.137%20146.334,18.137C145.922,18.137%20145.628,18.205%20145.452,18.342C145.276,18.478%20145.188,18.637%20145.188,18.82C145.188,18.937%20145.224,19.041%20145.297,19.134C145.37,19.231%20145.485,19.31%20145.641,19.374C145.731,19.407%20145.995,19.483%20146.434,19.603C147.069,19.772%20147.512,19.911%20147.762,20.019C148.013,20.127%20148.21,20.284%20148.353,20.49C148.496,20.696%20148.568,20.952%20148.568,21.258C148.568,21.557%20148.48,21.839%20148.306,22.103C148.131,22.367%20147.88,22.572%20147.551,22.716C147.222,22.861%20146.849,22.933%20146.434,22.933C145.746,22.933%20145.222,22.79%20144.861,22.504C144.5,22.218%20144.27,21.795%20144.171,21.233Z'%20style='fill-rule:nonzero;'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
let W = class extends b {
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
    this.suffix = e ? "s" : "", this.icon = this.player.getCustomPluginIcon(this.name, "forwardIcon") || Fe, setTimeout(() => {
      Array.from(this.iconElement.getElementsByClassName("time-text")).forEach((t) => {
        t.innerHTML = this.time + this.suffix;
      });
    }, 100);
  }
  async action() {
    const e = await this.player.videoContainer.currentTime();
    this.player.videoContainer.setCurrentTime(e + this.time);
  }
};
const H = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2034%2028'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20xml:space='preserve'%20xmlns:serif='http://www.serif.com/'%20style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;'%3e%3cg%20id='FullScreen'%20transform='matrix(1,0,0,1,-363,-6)'%3e%3cg%3e%3cg%3e%3cg%20transform='matrix(1,0,0,1,-2,2.84217e-14)'%3e%3cpath%20d='M368.492,8.078L371.207,10.793L369.793,12.207L367.078,9.492L365,11.57L365.014,7.428L365,7.414L365.014,7.4L365.019,6.019L366.4,6.014L366.414,6L366.428,6.014L370.57,6L368.492,8.078Z'/%3e%3c/g%3e%3cg%20transform='matrix(1,0,0,-1,-2,40)'%3e%3cpath%20d='M368.492,8.078L371.207,10.793L369.793,12.207L367.078,9.492L365,11.57L365.014,7.428L365,7.414L365.014,7.4L365.019,6.019L366.4,6.014L366.414,6L366.428,6.014L370.57,6L368.492,8.078Z'/%3e%3c/g%3e%3cg%20transform='matrix(-1,0,0,1,762,2.84217e-14)'%3e%3cpath%20d='M368.492,8.078L371.207,10.793L369.793,12.207L367.078,9.492L365,11.57L365.014,7.428L365,7.414L365.014,7.4L365.019,6.019L366.4,6.014L366.414,6L366.428,6.014L370.57,6L368.492,8.078Z'/%3e%3c/g%3e%3cg%20transform='matrix(-1,0,0,-1,762,40)'%3e%3cpath%20d='M368.492,8.078L371.207,10.793L369.793,12.207L367.078,9.492L365,11.57L365.014,7.428L365,7.414L365.014,7.4L365.019,6.019L366.4,6.014L366.414,6L366.428,6.014L370.57,6L368.492,8.078Z'/%3e%3c/g%3e%3cg%20transform='matrix(1,0,0,0.886475,0,2.17871)'%3e%3crect%20x='369'%20y='12.207'%20width='22'%20height='15.793'/%3e%3c/g%3e%3cg%20transform='matrix(1,0,0,1,-0.0588586,-0.780796)'%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
class Y extends b {
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
  async isEnabled() {
    return await super.isEnabled() && this.player.isFullScreenSupported();
  }
  async load() {
    const e = this.player.getCustomPluginIcon(this.name, "fullscreenIcon") || H, t = this.player.getCustomPluginIcon(this.name, "windowedIcon") || H;
    this.icon = e, x(this.player, _.FULLSCREEN_CHANGED, (i) => {
      i.status ? this.icon = t : this.icon = e;
    });
  }
  async action() {
    this.player.isFullscreen ? await this.player.exitFullscreen() : await this.player.enterFullscreen();
  }
}
const je = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20version='1.1'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%3e%3cpath%20d='M19,10H17V8H19M19,13H17V11H19M16,10H14V8H16M16,13H14V11H16M16,17H8V15H16M7,10H5V8H7M7,13H5V11H7M8,11H10V13H8M8,8H10V10H8M11,11H13V13H11M11,8H13V10H11M20,5H4C2.89,5%202,5.89%202,7V17A2,2%200%200,0%204,19H20A2,2%200%200,0%2022,17V7C22,5.89%2021.1,5%2020,5Z'%20/%3e%3c/svg%3e";
class K extends I {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.keyboardShortcutsHelp";
  }
  async isEnabled() {
    return await super.isEnabled() && this.player.getShortcuts().length > 0;
  }
  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, "keyboardIcon") || je;
  }
  get popUpType() {
    return "no-modal";
  }
  getKeyText(e) {
    let t = this.player.translate(e.keyCode);
    return e.keyModifiers.altKey && (t += " + Alt"), e.keyModifiers.ctrlKey && (t += " + Ctrl"), e.keyModifiers.shiftKey && (t += " + Shift"), t;
  }
  get menuTitle() {
    return this.config.menuTitle || "Keyboard shortcuts";
  }
  async getContent() {
    const e = C(`
          <div class="keyboardshortcutshelp-plugin"></div>
        `), t = {};
    this.player.getShortcuts().forEach((i) => {
      const s = this.player.translate(i.description);
      t[s] ? t[s].push(i) : t[s] = [i];
    });
    for (const i in t) {
      const s = t[i];
      let o = "";
      s.forEach((h) => {
        o !== "" && (o += " / "), o += this.player.translate(this.getKeyText(h));
      });
      const p = C(`
			<div class="row">
				<div class="description"> ${i} </div>
				<div class="key"> ${o}</div>
            </div>
			`);
      e.appendChild(p);
    }
    return e;
  }
}
const ze = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%2039%2033'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20xml:space='preserve'%20xmlns:serif='http://www.serif.com/'%20style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;'%3e%3cpath%20d='M38.02,33L20.02,33L20.02,16L38.02,16L38.02,33ZM18.1,31.479L17.261,28.744C17.261,28.744%2015.373,29.986%2014.365,29.504C13.356,29.022%2013.141,28.161%2013.141,28.161L15.089,26L10.02,26L10.02,31.317L12.04,29.194C12.04,29.194%2012.571,31.145%2013.809,31.959C15.732,33.224%2018.1,31.479%2018.1,31.479ZM35.846,31C35.844,30.985%2035.419,26.773%2034.821,25.622C34.222,24.47%2031.242,24.429%2031.242,24.429C31.242,24.429%2030.557,27.413%2030.373,27.982C30.189,28.55%2030.15,28.681%2030.15,28.681C30.15,28.681%2029.686,25.798%2029.604,25.505C29.543,25.285%2029.143,25.271%2029.058,25.271C28.973,25.271%2028.573,25.297%2028.512,25.516C28.431,25.809%2028.097,28.617%2028.097,28.617C28.097,28.617%2027.995,28.55%2027.811,27.982C27.627,27.413%2026.874,24.429%2026.874,24.429C26.874,24.429%2023.894,24.47%2023.295,25.622C22.696,26.775%2022.27,31%2022.27,31L35.846,31ZM30.15,24.429C30.209,24.682%2029.406,25.228%2029.406,25.228L28.763,25.212C28.763,25.212%2027.907,24.682%2027.966,24.429C28.02,24.196%2028.753,24.222%2029.058,24.219C29.365,24.222%2030.096,24.196%2030.15,24.429ZM25.02,15L22.02,15L22.02,3L23.02,3L23.02,2L2.02,2L2.02,3L3.02,3L3.02,17L11.79,17L8.396,21.381C8.078,21.995%208.205,22.353%208.367,22.49C8.531,22.629%208.944,22.69%209.341,22.282L12.926,18.594L16.429,22.282C16.589,22.542%2016.931,22.561%2017.322,22.405C17.601,22.293%2017.521,21.746%2017.374,21.381L13.875,17L19.02,17L19.02,24L0,24L0,0L25.02,0L25.02,15ZM29.058,17.067C30.719,17.067%2032.068,18.527%2032.068,20.326C32.068,22.125%2030.719,23.586%2029.058,23.586C27.397,23.586%2026.048,22.125%2026.048,20.326C26.048,18.527%2027.397,17.067%2029.058,17.067ZM21.02,15L21.02,3L4.02,3L4.02,16L19.02,16L19.02,15L21.02,15ZM35.1,14L30.032,14L31.98,11.839C31.98,11.839%2031.765,10.978%2030.756,10.496C29.747,10.014%2027.86,11.256%2027.86,11.256L27.02,8.521C27.02,8.521%2029.389,6.776%2031.312,8.041C32.55,8.855%2033.081,10.806%2033.081,10.806L35.1,8.683L35.1,14ZM10.744,7.462L6.356,13.008L5.922,12.61L10.727,6.537L13.847,9.959L18.147,5.333L18.55,5.767L13.846,10.826L10.744,7.462Z'/%3e%3c/svg%3e";
class Q extends P {
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
    this.icon = this.player.getCustomPluginIcon(this.name, "layoutIcon") || ze, this._showIcons = this.config.showIcons ?? !0;
  }
  async getMenu() {
    const e = this.player.videoContainer.validContentSettings;
    return Promise.all(await e.map(async (t) => {
      const i = ue([this.player.configResourcesUrl, t.icon]), s = this._showIcons && await ce(i) || null;
      return {
        id: t.id,
        title: t.title,
        icon: s,
        selected: this.player.videoContainer.layoutId === t.id
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
class q extends P {
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
    this.config.showIcon === !1 || (this.icon = this.player.getCustomPluginIcon(this.name, "screenIcon") || A);
    const e = await this.player.videoContainer.playbackRate();
    this.title = `${e}x`, this._rates = this.config.rates || [0.5, 0.75, 1, 1.25, 1.5, 2], this.player.bindEvent(_.PLAYBACK_RATE_CHANGED, (t) => {
      this.title = t.newPlaybackRate + "x";
    });
  }
  async getMenu() {
    const e = await this.player.videoContainer.playbackRate(), t = (i) => ({
      id: i,
      title: `${i}x`,
      selected: i == e
    });
    return this._rates.map((i) => t(i));
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
class X extends P {
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
    this.config.showIcon === !1 || (this.icon = this.player.getCustomPluginIcon("es.upv.paella.qualitySelector", "screenIcon") || A), await this.updateQualityLabel();
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
      const t = await this.player.videoContainer.streamProvider.getCurrentQuality();
      t ? this.title = t.shortLabel : setTimeout(() => e(), 500);
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
const We = `
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
    </svg>`, Ye = `
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
    </svg>`, Ke = `<svg width="100%" height="100%" viewBox="0 0 25 29" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
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
    </svg>`, Qe = `<svg width="100%" height="100%" viewBox="0 0 31 31" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
    <g id="volume-mute" serif:id="volume mute" transform="matrix(1,0,0,1,-123,-4.71142)">
        <path d="M142,28.522L142,31.68C142,32.961 140.961,34 139.68,34L131.499,25L127.375,25C126.063,25 125,23.937 125,22.625L125,16.375C125,15.063 126.063,14 127.375,14L127.478,14L142,28.522ZM151.228,34.983L123,6.756L125.044,4.711L132.848,12.516L139.68,5C140.961,5 142,6.039 142,7.32L142,21.667L153.272,32.939L151.228,34.983Z"/>
    </g>
    </svg>`;
class J extends b {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.volumeButtonPlugin";
  }
  async isEnabled() {
    return await super.isEnabled() && await he();
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
  async updateIcon(e) {
    const t = this.player.getCustomPluginIcon(this.name, "volumeHighIcon") || We, i = this.player.getCustomPluginIcon(this.name, "volumeMidIcon") || Ye, s = this.player.getCustomPluginIcon(this.name, "volumeLowIcon") || Ke, o = this.player.getCustomPluginIcon(this.name, "volumeMuteIcon") || Qe;
    switch (!0) {
      case e === 0:
        this.icon = o;
        break;
      case (e > 0 && e <= 0.3):
        this.icon = s;
        break;
      case (e > 0.3 && e <= 0.6):
        this.icon = i;
        break;
      case e > 0.6:
        this.icon = t;
        break;
      default:
        this.icon = t;
    }
  }
  get sliderContainer() {
    return this.config.side === "left" ? this.rightArea : this.leftArea;
  }
  async load() {
    this.showContainerOnFocus = this.config.showVolumeOnFocus ?? !0, this.volumeAlwaysVisible = this.config.volumeAlwaysVisible ?? !1, this._prevVolume = await this.player.videoContainer.volume(), x(this.player, _.VOLUME_CHANGED, ({ volume: t }) => {
      this.updateIcon(t);
    }), this.updateIcon(this._prevVolume);
    const e = document.createElement("span");
    e.classList.add("side-container-hidden"), e.innerHTML = `
            <input type="range" class="isu" min="0" max="100" value="50" class="slider" />
        `, this.container.appendChild(e);
  }
  showSideContainer() {
    this.volumeAlwaysVisible;
  }
  hideSideContainer() {
    this.volumeAlwaysVisible;
  }
  async mouseOver(e) {
    e === this.container && this.showSideContainer();
  }
  async mouseOut(e) {
    e === this.container && this.hideSideContainer();
  }
  async focusIn() {
    this.showContainerOnFocus;
  }
  async focusOut() {
    this.showContainerOnFocus;
  }
  async action() {
    const e = await this.player.videoContainer.volume();
    console.log("VolumePlugin.action(): ", e);
    let t = 0;
    e === 0 && this._prevVolume === 0 ? t = 1 : e === 0 && this._prevVolume > 0 ? t = this._prevVolume : t = 0, await this.player.videoContainer.setVolume(t), this._prevVolume = e;
  }
}
class ee extends b {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.customTimeProgressIndicator";
  }
  async isEnabled() {
    var t;
    return await super.isEnabled() && (((t = this.player.videoManifest.metadata) == null ? void 0 : t.visibleTimeLine) ?? !0);
  }
  async load() {
    const e = await this.player.videoContainer.duration(), t = this.config.showTotal === void 0 ? !0 : this.config.showTotal, i = (s) => {
      const o = B(s);
      this.title = t ? `${o} / ${B(e)}` : o;
    };
    i(0), this.player.bindEvent(_.TIMEUPDATE, ({ currentTime: s }) => {
      i(s);
    });
  }
  get interactive() {
    return !1;
  }
  get dynamicWidth() {
    return !0;
  }
  get titleSize() {
    return this.config.textSize || "medium";
  }
}
function $(n, e, t, i) {
  const s = this._side === "left" ? this._margin : this._side === "center" ? e / 2 : e - this._margin, o = 8, p = this._side === "left" ? o + 4 : this._side === "center" ? 0 : -(o + 4), h = this._side === "center" ? -40 : 0;
  n.fillStyle = this._textColor, n.font = "11px Arial", n.textAlign = this._side, n.fillText("Live stream", s + p, t / 2 + 3), n.beginPath(), n.fillStyle = this._circleColor, n.arc(s + h, t / 2, o / 2, 0, 2 * Math.PI, !1), n.fill();
}
let te = class extends xe {
  getPluginModuleInstance() {
    return f.Get();
  }
  get name() {
    return super.name || "es.upv.paella.liveStreamingProgressIndicator";
  }
  get minHeight() {
    return 20;
  }
  get minHeightHover() {
    return 20;
  }
  async isEnabled() {
    return await super.isEnabled() && this.player.videoContainer.isLiveStream;
  }
  async load() {
    if (this._layer = this.config.layer ?? "foreground", this._side = this.config.side ?? "right", this._margin = this.config.margin ?? 50, this._textColor = this.config.textColor ?? "white", this._circleColor = this.config.circleColor ?? "red", ["foreground", "background"].indexOf(this._layer) === -1)
      throw new Error("Invalid layer set in plugin 'es.upv.paella.liveStreamingPlugin'. Valid values are 'foreground' or 'background'");
    if (["left", "center", "right"].indexOf(this._side) === -1)
      throw new Error("Invalid side set in plugin 'es.upv.paella.liveStreamingPlugin'. Valid values are 'left', 'center' or 'right'");
  }
  drawForeground(e, t, i, s) {
    this._layer === "foreground" && $.apply(this, [e, t, i, s]);
  }
  drawBackground(e, t, i, s) {
    this._layer === "background" && $.apply(this, [e, t, i, s]);
  }
};
class ie extends P {
  getPluginModuleInstance() {
    return f.Get();
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
    this.icon = this.player.getCustomPluginIcon(this.name, "captionsIcon") || R;
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
    this._hls.subtitleTrack = e.index, this._selected = (t = this._tracks.find((i) => i.index === e.index)) == null ? void 0 : t.language, L.HideAllPopUps(!1);
  }
}
const et = [
  {
    plugin: G,
    config: {
      enabled: !1
    }
  },
  {
    plugin: Z,
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
    plugin: ie,
    config: {
      enabled: !1
    }
  },
  {
    plugin: j,
    config: {
      enabled: !1
    }
  },
  {
    plugin: z,
    config: {
      enabled: !1
    }
  },
  {
    plugin: W,
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
  },
  {
    plugin: Q,
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
    plugin: X,
    config: {
      enabled: !1
    }
  },
  {
    plugin: J,
    config: {
      enabled: !1
    }
  },
  {
    plugin: ee,
    config: {
      enabled: !1
    }
  },
  {
    plugin: te,
    config: {
      enabled: !1
    }
  }
], tt = G, it = Z, nt = F, st = j, ot = z, rt = W, lt = Y, at = K, ct = Q, ut = q, ht = X, pt = J, dt = ee, gt = te, mt = ie;
export {
  tt as AudioSelectorButtonPlugin,
  it as BackwardButtonPlugin,
  nt as CaptionsSelectorButtonPlugin,
  dt as CustomTimeProgressIndicatorPlugin,
  st as DownloadsButtonPlugin,
  ot as FindCaptionsButtonPlugin,
  rt as ForwardButtonPlugin,
  lt as FullscreenButtonPlugin,
  mt as HlsCaptionsSelectorButtonPlugin,
  at as KeyboardHelpButtonPlugin,
  ct as LayoutSelectorButtonPlugin,
  gt as LiveStreamingProgressIndicatorPlugin,
  ut as PlaybackRateButtonPlugin,
  ht as QualitySelectorButtonPlugin,
  pt as VolumeButtonPlugin,
  et as basicPlugins
};
