var y = (a) => {
  throw TypeError(a);
}, v = (a, e, t) => e.has(a) || y("Cannot " + t), I = (a, e, t) => (v(a, e, "read from private field"), t ? t.call(a) : e.get(a)), A = (a, e, t) => e.has(a) ? y("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(a) : e.set(a, t), N = (a, e, t, n) => (v(a, e, "write to private field"), e.set(a, t), t);
const s = Object.freeze({
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
function E(a, e, t, n = !0) {
  return a.__eventListeners__ = a.__eventListeners__ || {}, Array.isArray(e) || (e = [e]), e.forEach((i) => {
    a.__eventListeners__[i] = a.__eventListeners__[i] || [], a.__eventListeners__[i].push({
      callback: t,
      unregisterOnUnload: n
    });
  }), t;
}
var p;
class _ {
  constructor(e) {
    A(this, p, null), N(this, p, e);
  }
  get player() {
    return I(this, p);
  }
}
p = /* @__PURE__ */ new WeakMap();
class f extends _ {
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
class C extends _ {
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
class m extends f {
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
class O extends f {
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
const D = Object.freeze({
  DISABLED: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5
});
D.INFO;
const w = "@asicupv/paella-user-tracking", L = "2.0.0-beta.0", U = { ".": "./dist/paella-user-tracking.js" }, S = "User analytics and tracking plugins for Paella Player", G = "./dist/paella-user-tracking.js", M = "module", R = "dist/paella-user-tracking.js", H = ["dist/paella-user-tracking.js", "dist/paella-user-tracking.umd.cjs"], x = { dev: "vite", build: "vite build --emptyOutDir" }, $ = { type: "git", url: "git+https://github.com/polimediaupv/paella-player.git" }, B = "Fernando Serrano Carpena <ferserc1@gmail.com>", V = "SEE LICENSE IN license.txt", j = { url: "https://github.com/polimediaupv/paella-user-tracking" }, q = "https://paellaplayer.upv.es", F = { vite: "^6.0.11" }, Y = { "@asicupv/paella-core": "^2.0.0-beta.4" }, z = {
  name: w,
  version: L,
  exports: U,
  description: S,
  main: G,
  type: M,
  module: R,
  files: H,
  scripts: x,
  repository: $,
  author: B,
  license: V,
  bugs: j,
  homepage: q,
  devDependencies: F,
  dependencies: Y
};
let d = null;
class g extends C {
  static Get() {
    return d || (d = new g()), d;
  }
  get moduleName() {
    return "paella-user-tracking";
  }
  get moduleVersion() {
    return z.version;
  }
}
class P extends m {
  getPluginModuleInstance() {
    return g.Get();
  }
  get name() {
    return super.name || "es.upv.paella.analytics.userTrackingDataPlugin";
  }
  async load() {
    const e = this.config.trackingId, t = this.config.domain || "auto";
    e ? (this.player.log.debug("Google Analytics Enabled"), function(n, i, r, c, l, o, u) {
      n.GoogleAnalyticsObject = l, n[l] = n[l] || function() {
        (n[l].q = n[l].q || []).push(arguments);
      }, n[l].l = 1 * /* @__PURE__ */ new Date(), o = i.createElement(r), u = i.getElementsByTagName(r)[0], o.async = 1, o.src = c, u.parentNode.insertBefore(o, u);
    }(window, document, "script", "//www.google-analytics.com/analytics.js", "__gaTracker"), __gaTracker("create", e, t), __gaTracker("send", "pageview")) : this.player.log.debug("No Google Tracking ID found in config file. Disabling Google Analytics");
  }
  async write(e, { id: t }, n) {
    if (this.config.category === void 0 || this.config.category === !0) {
      const i = this.config.category || "PaellaPlayer", r = n.event, c = {
        videoId: t,
        plugin: n.plugin
      };
      try {
        JSON.stringify(n.params), c.params = n.params;
      } catch {
      }
      const l = JSON.stringify(c);
      __gaTracker(" send", "event", i, r, l);
    }
  }
}
let T = class extends m {
  getPluginModuleInstance() {
    return g.Get();
  }
  get name() {
    return super.name || "es.upv.paella.matomo.userTrackingDataPlugin";
  }
  async isEnabled() {
    return await super.isEnabled() ? (this.matomoGlobalLoaded = this.config.matomoGlobalLoaded ?? !1, this.server = this.config.server, this.siteId = this.config.siteId, this.events = this.config.events, !this.matomoGlobalLoaded && !(this.server && this.siteId) ? (this.player.log.warn("Matomo plugin: Plugin is enabled, but is not configured correctly. Please configue `matomoGlobalLoaded`, `server`and `siteId` parameters."), !1) : !0) : !1;
  }
  async getCurrentUserId() {
    return null;
  }
  async trackCustomDimensions() {
    const e = await this.getTemplateVars(), t = this.config.customDimensions ?? {};
    try {
      Object.entries(t).forEach(([n, i]) => {
        const r = this.applyTemplate(i, e);
        _paq.push(["setCustomDimension", n, r]), this.player.log.debug(`Matomo plugin: setting custom dimension id=${n} to '${r}'`);
      });
    } catch {
    }
  }
  async getTemplateVars(e) {
    let t = this.getEventData(e);
    return {
      videoId: this.player._videoId,
      metadata: this.player.videoManifest.metadata,
      event: (e == null ? void 0 : e.event) || "",
      eventData: t
    };
  }
  getEventData(e) {
    switch (e == null ? void 0 : e.event) {
      case s.SEEK:
        return Math.round(e.params.newTime);
      case s.VOLUME_CHANGED:
        return e.params.volume * 100;
      case s.BUTTON_PRESS:
        return e.params.plugin.name;
      case s.SHOW_POPUP:
        return e.params.plugin.name;
      case s.HIDE_POPUP:
        return e.params.plugin.name;
      case s.RESIZE_END:
        return `${e.params.size.w}x${e.params.size.h}`;
      case s.LAYOUT_CHANGED:
        return e.params.layoutId;
      case s.PLAYBACK_RATE_CHANGED:
        return e.params.newPlaybackRate;
      case s.CAPTIONS_ENABLED:
        return e.params.language;
    }
    return "";
  }
  async load() {
    const e = this.config.heartBeatTime || 15;
    var t = window._paq = window._paq || [];
    if (t.push(["requireCookieConsent"]), E(this.player, s.COOKIE_CONSENT_CHANGED, () => {
      this.player.log.debug("Matomo: Cookie consent changed."), this.player.cookieConsent.getConsentForType(this.config.cookieType) ? t.push(["rememberCookieConsentGiven"]) : t.push(["forgetCookieConsentGiven"]);
    }), this.matomoGlobalLoaded) {
      var t = window._paq = window._paq || [];
      this.player.log.debug("Assuming Matomo analytics is initialized globaly."), this.config.server && this.player.log.warn("Matomo plugin: `server` parameter is defined, but never used because Matomo is loaded globaly in the page. Is it an error? Please check it."), this.config.siteId && this.player.log.warn("Matomo plugin: `siteId` parameter is defined, but never used because Matomo is loaded globaly in the page. Is it an error? Please check it.");
    } else {
      const n = this.server, i = this.siteId;
      this.player.log.debug("Matomo analytics plugin enabled."), this.trackCustomDimensions();
      const r = await this.getCurrentUserId();
      r && t.push(["setUserId", r]), t.push(["trackPageView"]), t.push(["enableLinkTracking"]), function() {
        var c = n;
        t.push(["setTrackerUrl", c + "matomo.php"]), t.push(["setSiteId", i]);
        var l = document, o = l.createElement("script"), u = l.getElementsByTagName("script")[0];
        o.type = "text/javascript", o.async = !0, o.src = c + "matomo.js", u.parentNode.insertBefore(o, u);
      }();
    }
    t.push(["enableHeartBeatTimer", e]), this.trackCustomDimensions(), E(this.player, s.STREAM_LOADED, () => {
      t.push(["MediaAnalytics::scanForMedia"]);
    });
  }
  applyTemplate(e, t) {
    return e.replace(/\${[^{]*}/g, (n) => n.substring(2, n.length - 1).split(".").reduce((i, r) => i[r], t));
  }
  async write(e, { id: t }, n) {
    if (this.events) {
      const i = this.events.category || "PaellaPlayer", r = this.events.action || "${event}", c = this.events.name || "${eventData}", l = await this.getTemplateVars(n), o = this.applyTemplate(i, l), u = this.applyTemplate(r, l), h = this.applyTemplate(c, l);
      _paq.push(["trackEvent", o, u, h]), this.player.log.debug(`Matomo plugin: track event category='${o}', action='${u}', name='${h}'`);
    }
  }
}, b = class extends m {
  getPluginModuleInstance() {
    return g.Get();
  }
  get name() {
    return super.name || "es.upv.paella.debug.userTrackingDataPlugin";
  }
  async write(e, { id: t }, n) {
    console.log(`id: ${t}`, e, n);
  }
};
const K = (a) => a.map((e) => s[e]);
let k = class extends O {
  getPluginModuleInstance() {
    return g.Get();
  }
  get name() {
    return super.name || "es.upv.paella.userEventTracker";
  }
  get events() {
    return this.config.events ? K(this.config.events) : [
      s.PLAY,
      s.PAUSE,
      s.SEEK,
      s.STOP,
      s.ENDED,
      s.FULLSCREEN_CHANGED,
      s.VOLUME_CHANGED,
      s.BUTTON_PRESS,
      s.RESIZE_END
    ];
  }
  async onEvent(e, t) {
    var r;
    const n = this.config.context || "userTracking", i = this.player.videoId;
    if (e === s.LOG && t.severity <= D[this.config.logLevel])
      this.player.data && await this.player.data.write(
        n,
        { id: i },
        {
          event: e,
          params: t
        }
      );
    else if (e !== s.LOG && this.player.data) {
      if (t.plugin) {
        const { name: l, config: o } = t.plugin;
        t.plugin = { name: l, config: o };
      }
      const c = { event: e, params: t };
      switch (e) {
        case s.SHOW_POPUP:
        case s.HIDE_POPUP:
        case s.BUTTON_PRESS:
          c.plugin = ((r = t.plugin) == null ? void 0 : r.name) || null;
      }
      await this.player.data.write(
        n,
        { id: i },
        c
      );
    }
  }
};
const W = [
  {
    plugin: P,
    config: {
      enabled: !0
    }
  },
  {
    plugin: T,
    config: {
      enabled: !0
    }
  },
  {
    plugin: b,
    config: {
      enabled: !0
    }
  },
  {
    plugin: k,
    config: {
      enabled: !0
    }
  }
], X = W, ee = P, te = T, ae = b, ne = k;
export {
  ae as DebugUserTrackingDataPlugin,
  ee as GoogleAnalyticsUserTrackingDataPlugin,
  te as MatomoUserTrackingDataPlugin,
  ne as UserEventTrackerPlugin,
  X as allPlugins,
  W as userTrackingPlugins
};
