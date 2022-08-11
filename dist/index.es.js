var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
import { defineComponent, computed, ref, onBeforeUnmount, onMounted, watch, openBlock, createElementBlock, withModifiers, createElementVNode, unref, normalizeClass, toDisplayString, renderSlot, createCommentVNode, pushScopeId, popScopeId, createTextVNode, nextTick } from "vue";
var _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
  return typeof t;
} : function(t) {
  return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, previousDevice = window.device, device = {}, changeOrientationList = [], documentElement = (window.device = device, window.document.documentElement), userAgent = window.navigator.userAgent.toLowerCase(), television = ["googletv", "viera", "smarttv", "internet.tv", "netcast", "nettv", "appletv", "boxee", "kylo", "roku", "dlnadoc", "pov_tv", "hbbtv", "ce-html"];
function includes(t, e) {
  return t.indexOf(e) !== -1;
}
function find(t) {
  return includes(userAgent, t);
}
function hasClass(t) {
  return documentElement.className.match(new RegExp(t, "i"));
}
function addClass(t) {
  var e;
  hasClass(t) || (e = documentElement.className.replace(/^\s+|\s+$/g, ""), documentElement.className = e + " " + t);
}
function removeClass(t) {
  hasClass(t) && (documentElement.className = documentElement.className.replace(" " + t, ""));
}
function handleOrientation() {
  device.landscape() ? (removeClass("portrait"), addClass("landscape"), walkOnChangeOrientationList("landscape")) : (removeClass("landscape"), addClass("portrait"), walkOnChangeOrientationList("portrait")), setOrientationCache();
}
function walkOnChangeOrientationList(t) {
  for (var e = 0; e < changeOrientationList.length; e++)
    changeOrientationList[e](t);
}
device.macos = function() {
  return find("mac");
}, device.ios = function() {
  return device.iphone() || device.ipod() || device.ipad();
}, device.iphone = function() {
  return !device.windows() && find("iphone");
}, device.ipod = function() {
  return find("ipod");
}, device.ipad = function() {
  var t = navigator.platform === "MacIntel" && 1 < navigator.maxTouchPoints;
  return find("ipad") || t;
}, device.android = function() {
  return !device.windows() && find("android");
}, device.androidPhone = function() {
  return device.android() && find("mobile");
}, device.androidTablet = function() {
  return device.android() && !find("mobile");
}, device.blackberry = function() {
  return find("blackberry") || find("bb10");
}, device.blackberryPhone = function() {
  return device.blackberry() && !find("tablet");
}, device.blackberryTablet = function() {
  return device.blackberry() && find("tablet");
}, device.windows = function() {
  return find("windows");
}, device.windowsPhone = function() {
  return device.windows() && find("phone");
}, device.windowsTablet = function() {
  return device.windows() && find("touch") && !device.windowsPhone();
}, device.fxos = function() {
  return (find("(mobile") || find("(tablet")) && find(" rv:");
}, device.fxosPhone = function() {
  return device.fxos() && find("mobile");
}, device.fxosTablet = function() {
  return device.fxos() && find("tablet");
}, device.meego = function() {
  return find("meego");
}, device.cordova = function() {
  return window.cordova && location.protocol === "file:";
}, device.nodeWebkit = function() {
  return _typeof(window.process) === "object";
}, device.mobile = function() {
  return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego();
}, device.tablet = function() {
  return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
}, device.desktop = function() {
  return !device.tablet() && !device.mobile();
}, device.television = function() {
  for (var t = 0; t < television.length; ) {
    if (find(television[t]))
      return true;
    t++;
  }
  return false;
}, device.portrait = function() {
  return screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? includes(screen.orientation.type, "portrait") : device.ios() && Object.prototype.hasOwnProperty.call(window, "orientation") ? Math.abs(window.orientation) !== 90 : 1 < window.innerHeight / window.innerWidth;
}, device.landscape = function() {
  return screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? includes(screen.orientation.type, "landscape") : device.ios() && Object.prototype.hasOwnProperty.call(window, "orientation") ? Math.abs(window.orientation) === 90 : window.innerHeight / window.innerWidth < 1;
}, device.noConflict = function() {
  return window.device = previousDevice, this;
}, device.ios() ? device.ipad() ? addClass("ios ipad tablet") : device.iphone() ? addClass("ios iphone mobile") : device.ipod() && addClass("ios ipod mobile") : device.macos() ? addClass("macos desktop") : device.android() ? device.androidTablet() ? addClass("android tablet") : addClass("android mobile") : device.blackberry() ? device.blackberryTablet() ? addClass("blackberry tablet") : addClass("blackberry mobile") : device.windows() ? device.windowsTablet() ? addClass("windows tablet") : device.windowsPhone() ? addClass("windows mobile") : addClass("windows desktop") : device.fxos() ? device.fxosTablet() ? addClass("fxos tablet") : addClass("fxos mobile") : device.meego() ? addClass("meego mobile") : device.nodeWebkit() ? addClass("node-webkit") : device.television() ? addClass("television") : device.desktop() && addClass("desktop"), device.cordova() && addClass("cordova"), device.onChangeOrientation = function(t) {
  typeof t == "function" && changeOrientationList.push(t);
};
var orientationEvent = "resize";
function findMatch(t) {
  for (var e = 0; e < t.length; e++)
    if (device[t[e]]())
      return t[e];
  return "unknown";
}
function setOrientationCache() {
  device.orientation = findMatch(["portrait", "landscape"]);
}
Object.prototype.hasOwnProperty.call(window, "onorientationchange") && (orientationEvent = "orientationchange"), window.addEventListener ? window.addEventListener(orientationEvent, handleOrientation, false) : window.attachEvent ? window.attachEvent(orientationEvent, handleOrientation) : window[orientationEvent] = handleOrientation, handleOrientation(), device.type = findMatch(["mobile", "tablet", "desktop"]), device.os = findMatch(["ios", "iphone", "ipad", "ipod", "android", "blackberry", "macos", "windows", "fxos", "meego", "television"]), setOrientationCache();
var commonjsGlobal = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : {}, lodash = { exports: {} };
!function(S, L) {
  !function() {
    var Wi, Ui = "Expected a function", ya = "__lodash_hash_undefined__", wa = "__lodash_placeholder__", ma = 16, Fi = 32, Vi = 64, Ni = 128, xa = 256, Hi = 1 / 0, $i = 9007199254740991, ba = NaN, qi = 4294967295, Ca = [["ary", Ni], ["bind", 1], ["bindKey", 2], ["curry", 8], ["curryRight", ma], ["flip", 512], ["partial", Fi], ["partialRight", Vi], ["rearg", xa]], Gi = "[object Arguments]", Ia = "[object Array]", Ki = "[object Boolean]", Zi = "[object Date]", Ta = "[object Error]", Ba = "[object Function]", Da = "[object GeneratorFunction]", Ji = "[object Map]", Qi = "[object Number]", ta = "[object Object]", Ra = "[object Promise]", Sa = "[object RegExp]", ea = "[object Set]", La = "[object String]", Oa = "[object Symbol]", ka = "[object WeakMap]", Ea = "[object ArrayBuffer]", na = "[object DataView]", Aa = "[object Float32Array]", Ya = "[object Float64Array]", za = "[object Int8Array]", ja = "[object Int16Array]", Xa = "[object Int32Array]", Pa = "[object Uint8Array]", Ma = "[object Uint8ClampedArray]", Wa = "[object Uint16Array]", Ua = "[object Uint32Array]", Fa = /\b__p \+= '';/g, Va = /\b(__p \+=) '' \+/g, Na = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Ha = /&(?:amp|lt|gt|quot|#39);/g, $a = /[&<>"']/g, qa = RegExp(Ha.source), Ga = RegExp($a.source), Ka = /<%-([\s\S]+?)%>/g, Za = /<%([\s\S]+?)%>/g, Ja = /<%=([\s\S]+?)%>/g, Qa = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, tu = /^\w*$/, eu = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, nu = /[\\^$.*+?()[\]{}|]/g, ru = RegExp(nu.source), ou = /^\s+/, i = /\s/, iu = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, au = /\{\n\/\* \[wrapped with (.+)\] \*/, uu = /,? & /, cu = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, fu = /[()=,{}\[\]\/\s]/, lu = /\\(\\)?/g, su = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, du = /\w*$/, pu = /^[-+]0x[0-9a-f]+$/i, hu = /^0b[01]+$/i, vu = /^\[object .+?Constructor\]$/, gu = /^0o[0-7]+$/i, _u = /^(?:0|[1-9]\d*)$/, yu = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, wu = /($^)/, mu = /['\n\r\u2028\u2029\\]/g, a = "\\ud800-\\udfff", u = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff", c = "\\u2700-\\u27bf", t = "a-z\\xdf-\\xf6\\xf8-\\xff", e = "A-Z\\xc0-\\xd6\\xd8-\\xde", f = "\\ufe0e\\ufe0f", l = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", s = "['\u2019]", n = "[" + a + "]", d = "[" + l + "]", p = "[" + u + "]", h = "[" + c + "]", v = "[" + t + "]", l = "[^" + a + l + "\\d+" + c + t + e + "]", c = "\\ud83c[\\udffb-\\udfff]", t = "[^" + a + "]", g = "(?:\\ud83c[\\udde6-\\uddff]){2}", r = "[\\ud800-\\udbff][\\udc00-\\udfff]", e = "[" + e + "]", _ = "\\u200d", y = "(?:" + v + "|" + l + ")", l = "(?:" + e + "|" + l + ")", w = "(?:['\u2019](?:d|ll|m|re|s|t|ve))?", m = "(?:['\u2019](?:D|LL|M|RE|S|T|VE))?", x = "(?:" + p + "|" + c + ")?", b = "[" + f + "]?", b = b + x + ("(?:" + _ + "(?:" + [t, g, r].join("|") + ")" + b + x + ")*"), x = "(?:" + [h, g, r].join("|") + ")" + b, h = "(?:" + [t + p + "?", p, g, r, n].join("|") + ")", xu = RegExp(s, "g"), bu = RegExp(p, "g"), C = RegExp(c + "(?=" + c + ")|" + h + b, "g"), Cu = RegExp([e + "?" + v + "+" + w + "(?=" + [d, e, "$"].join("|") + ")", l + "+" + m + "(?=" + [d, e + y, "$"].join("|") + ")", e + "?" + y + "+" + w, e + "+" + m, "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", "\\d+", x].join("|"), "g"), I = RegExp("[" + _ + a + u + f + "]"), Iu = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, Tu = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"], Bu = -1, ra = {}, oa = (ra[Aa] = ra[Ya] = ra[za] = ra[ja] = ra[Xa] = ra[Pa] = ra[Ma] = ra[Wa] = ra[Ua] = true, ra[Gi] = ra[Ia] = ra[Ea] = ra[Ki] = ra[na] = ra[Zi] = ra[Ta] = ra[Ba] = ra[Ji] = ra[Qi] = ra[ta] = ra[Sa] = ra[ea] = ra[La] = ra[ka] = false, {}), T = (oa[Gi] = oa[Ia] = oa[Ea] = oa[na] = oa[Ki] = oa[Zi] = oa[Aa] = oa[Ya] = oa[za] = oa[ja] = oa[Xa] = oa[Ji] = oa[Qi] = oa[ta] = oa[Sa] = oa[ea] = oa[La] = oa[Oa] = oa[Pa] = oa[Ma] = oa[Wa] = oa[Ua] = true, oa[Ta] = oa[Ba] = oa[ka] = false, { "\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029" }), Du = parseFloat, Ru = parseInt, t = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal, g = typeof self == "object" && self && self.Object === Object && self, ia = t || g || Function("return this")(), r = L && !L.nodeType && L, o = r && S && !S.nodeType && S, Su = o && o.exports === r, B = Su && t.process, n = function() {
      try {
        var t2 = o && o.require && o.require("util").types;
        return t2 ? t2 : B && B.binding && B.binding("util");
      } catch (t3) {
      }
    }(), Lu = n && n.isArrayBuffer, Ou = n && n.isDate, ku = n && n.isMap, Eu = n && n.isRegExp, Au = n && n.isSet, Yu = n && n.isTypedArray;
    function aa(t2, e2, n2) {
      switch (n2.length) {
        case 0:
          return t2.call(e2);
        case 1:
          return t2.call(e2, n2[0]);
        case 2:
          return t2.call(e2, n2[0], n2[1]);
        case 3:
          return t2.call(e2, n2[0], n2[1], n2[2]);
      }
      return t2.apply(e2, n2);
    }
    function zu(t2, e2, n2, r2) {
      for (var o2 = -1, i2 = t2 == null ? 0 : t2.length; ++o2 < i2; ) {
        var a2 = t2[o2];
        e2(r2, a2, n2(a2), t2);
      }
      return r2;
    }
    function ua(t2, e2) {
      for (var n2 = -1, r2 = t2 == null ? 0 : t2.length; ++n2 < r2 && e2(t2[n2], n2, t2) !== false; )
        ;
      return t2;
    }
    function ju(t2, e2) {
      for (var n2 = t2 == null ? 0 : t2.length; n2-- && e2(t2[n2], n2, t2) !== false; )
        ;
      return t2;
    }
    function Xu(t2, e2) {
      for (var n2 = -1, r2 = t2 == null ? 0 : t2.length; ++n2 < r2; )
        if (!e2(t2[n2], n2, t2))
          return false;
      return true;
    }
    function ca(t2, e2) {
      for (var n2 = -1, r2 = t2 == null ? 0 : t2.length, o2 = 0, i2 = []; ++n2 < r2; ) {
        var a2 = t2[n2];
        e2(a2, n2, t2) && (i2[o2++] = a2);
      }
      return i2;
    }
    function Pu(t2, e2) {
      return !!(t2 == null ? 0 : t2.length) && -1 < sa(t2, e2, 0);
    }
    function Mu(t2, e2, n2) {
      for (var r2 = -1, o2 = t2 == null ? 0 : t2.length; ++r2 < o2; )
        if (n2(e2, t2[r2]))
          return true;
      return false;
    }
    function fa(t2, e2) {
      for (var n2 = -1, r2 = t2 == null ? 0 : t2.length, o2 = Array(r2); ++n2 < r2; )
        o2[n2] = e2(t2[n2], n2, t2);
      return o2;
    }
    function la(t2, e2) {
      for (var n2 = -1, r2 = e2.length, o2 = t2.length; ++n2 < r2; )
        t2[o2 + n2] = e2[n2];
      return t2;
    }
    function Wu(t2, e2, n2, r2) {
      var o2 = -1, i2 = t2 == null ? 0 : t2.length;
      for (r2 && i2 && (n2 = t2[++o2]); ++o2 < i2; )
        n2 = e2(n2, t2[o2], o2, t2);
      return n2;
    }
    function Uu(t2, e2, n2, r2) {
      var o2 = t2 == null ? 0 : t2.length;
      for (r2 && o2 && (n2 = t2[--o2]); o2--; )
        n2 = e2(n2, t2[o2], o2, t2);
      return n2;
    }
    function Fu(t2, e2) {
      for (var n2 = -1, r2 = t2 == null ? 0 : t2.length; ++n2 < r2; )
        if (e2(t2[n2], n2, t2))
          return true;
      return false;
    }
    var D = Gu("length");
    function Vu(t2, r2, e2) {
      var o2;
      return e2(t2, function(t3, e3, n2) {
        if (r2(t3, e3, n2))
          return o2 = e3, false;
      }), o2;
    }
    function Nu(t2, e2, n2, r2) {
      for (var o2 = t2.length, i2 = n2 + (r2 ? 1 : -1); r2 ? i2-- : ++i2 < o2; )
        if (e2(t2[i2], i2, t2))
          return i2;
      return -1;
    }
    function sa(t2, e2, n2) {
      if (e2 != e2)
        return Nu(t2, $u, n2);
      for (var r2 = t2, o2 = e2, i2 = n2 - 1, a2 = r2.length; ++i2 < a2; )
        if (r2[i2] === o2)
          return i2;
      return -1;
    }
    function Hu(t2, e2, n2, r2) {
      for (var o2 = n2 - 1, i2 = t2.length; ++o2 < i2; )
        if (r2(t2[o2], e2))
          return o2;
      return -1;
    }
    function $u(t2) {
      return t2 != t2;
    }
    function qu(t2, e2) {
      var n2 = t2 == null ? 0 : t2.length;
      return n2 ? Zu(t2, e2) / n2 : ba;
    }
    function Gu(e2) {
      return function(t2) {
        return t2 == null ? Wi : t2[e2];
      };
    }
    function R(e2) {
      return function(t2) {
        return e2 == null ? Wi : e2[t2];
      };
    }
    function Ku(t2, r2, o2, i2, e2) {
      return e2(t2, function(t3, e3, n2) {
        o2 = i2 ? (i2 = false, t3) : r2(o2, t3, e3, n2);
      }), o2;
    }
    function Zu(t2, e2) {
      for (var n2, r2 = -1, o2 = t2.length; ++r2 < o2; ) {
        var i2 = e2(t2[r2]);
        i2 !== Wi && (n2 = n2 === Wi ? i2 : n2 + i2);
      }
      return n2;
    }
    function Ju(t2, e2) {
      for (var n2 = -1, r2 = Array(t2); ++n2 < t2; )
        r2[n2] = e2(n2);
      return r2;
    }
    function Qu(t2) {
      return t2 && t2.slice(0, lc(t2) + 1).replace(ou, "");
    }
    function da(e2) {
      return function(t2) {
        return e2(t2);
      };
    }
    function tc(e2, t2) {
      return fa(t2, function(t3) {
        return e2[t3];
      });
    }
    function ec(t2, e2) {
      return t2.has(e2);
    }
    function nc(t2, e2) {
      for (var n2 = -1, r2 = t2.length; ++n2 < r2 && -1 < sa(e2, t2[n2], 0); )
        ;
      return n2;
    }
    function rc(t2, e2) {
      for (var n2 = t2.length; n2-- && -1 < sa(e2, t2[n2], 0); )
        ;
      return n2;
    }
    var oc = R({ "\xC0": "A", "\xC1": "A", "\xC2": "A", "\xC3": "A", "\xC4": "A", "\xC5": "A", "\xE0": "a", "\xE1": "a", "\xE2": "a", "\xE3": "a", "\xE4": "a", "\xE5": "a", "\xC7": "C", "\xE7": "c", "\xD0": "D", "\xF0": "d", "\xC8": "E", "\xC9": "E", "\xCA": "E", "\xCB": "E", "\xE8": "e", "\xE9": "e", "\xEA": "e", "\xEB": "e", "\xCC": "I", "\xCD": "I", "\xCE": "I", "\xCF": "I", "\xEC": "i", "\xED": "i", "\xEE": "i", "\xEF": "i", "\xD1": "N", "\xF1": "n", "\xD2": "O", "\xD3": "O", "\xD4": "O", "\xD5": "O", "\xD6": "O", "\xD8": "O", "\xF2": "o", "\xF3": "o", "\xF4": "o", "\xF5": "o", "\xF6": "o", "\xF8": "o", "\xD9": "U", "\xDA": "U", "\xDB": "U", "\xDC": "U", "\xF9": "u", "\xFA": "u", "\xFB": "u", "\xFC": "u", "\xDD": "Y", "\xFD": "y", "\xFF": "y", "\xC6": "Ae", "\xE6": "ae", "\xDE": "Th", "\xFE": "th", "\xDF": "ss", "\u0100": "A", "\u0102": "A", "\u0104": "A", "\u0101": "a", "\u0103": "a", "\u0105": "a", "\u0106": "C", "\u0108": "C", "\u010A": "C", "\u010C": "C", "\u0107": "c", "\u0109": "c", "\u010B": "c", "\u010D": "c", "\u010E": "D", "\u0110": "D", "\u010F": "d", "\u0111": "d", "\u0112": "E", "\u0114": "E", "\u0116": "E", "\u0118": "E", "\u011A": "E", "\u0113": "e", "\u0115": "e", "\u0117": "e", "\u0119": "e", "\u011B": "e", "\u011C": "G", "\u011E": "G", "\u0120": "G", "\u0122": "G", "\u011D": "g", "\u011F": "g", "\u0121": "g", "\u0123": "g", "\u0124": "H", "\u0126": "H", "\u0125": "h", "\u0127": "h", "\u0128": "I", "\u012A": "I", "\u012C": "I", "\u012E": "I", "\u0130": "I", "\u0129": "i", "\u012B": "i", "\u012D": "i", "\u012F": "i", "\u0131": "i", "\u0134": "J", "\u0135": "j", "\u0136": "K", "\u0137": "k", "\u0138": "k", "\u0139": "L", "\u013B": "L", "\u013D": "L", "\u013F": "L", "\u0141": "L", "\u013A": "l", "\u013C": "l", "\u013E": "l", "\u0140": "l", "\u0142": "l", "\u0143": "N", "\u0145": "N", "\u0147": "N", "\u014A": "N", "\u0144": "n", "\u0146": "n", "\u0148": "n", "\u014B": "n", "\u014C": "O", "\u014E": "O", "\u0150": "O", "\u014D": "o", "\u014F": "o", "\u0151": "o", "\u0154": "R", "\u0156": "R", "\u0158": "R", "\u0155": "r", "\u0157": "r", "\u0159": "r", "\u015A": "S", "\u015C": "S", "\u015E": "S", "\u0160": "S", "\u015B": "s", "\u015D": "s", "\u015F": "s", "\u0161": "s", "\u0162": "T", "\u0164": "T", "\u0166": "T", "\u0163": "t", "\u0165": "t", "\u0167": "t", "\u0168": "U", "\u016A": "U", "\u016C": "U", "\u016E": "U", "\u0170": "U", "\u0172": "U", "\u0169": "u", "\u016B": "u", "\u016D": "u", "\u016F": "u", "\u0171": "u", "\u0173": "u", "\u0174": "W", "\u0175": "w", "\u0176": "Y", "\u0177": "y", "\u0178": "Y", "\u0179": "Z", "\u017B": "Z", "\u017D": "Z", "\u017A": "z", "\u017C": "z", "\u017E": "z", "\u0132": "IJ", "\u0133": "ij", "\u0152": "Oe", "\u0153": "oe", "\u0149": "'n", "\u017F": "s" }), ic = R({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" });
    function ac(t2) {
      return "\\" + T[t2];
    }
    function pa(t2) {
      return I.test(t2);
    }
    function uc(t2) {
      var n2 = -1, r2 = Array(t2.size);
      return t2.forEach(function(t3, e2) {
        r2[++n2] = [e2, t3];
      }), r2;
    }
    function cc(e2, n2) {
      return function(t2) {
        return e2(n2(t2));
      };
    }
    function ha(t2, e2) {
      for (var n2 = -1, r2 = t2.length, o2 = 0, i2 = []; ++n2 < r2; ) {
        var a2 = t2[n2];
        a2 !== e2 && a2 !== wa || (t2[n2] = wa, i2[o2++] = n2);
      }
      return i2;
    }
    function fc(t2) {
      var e2 = -1, n2 = Array(t2.size);
      return t2.forEach(function(t3) {
        n2[++e2] = t3;
      }), n2;
    }
    function va(t2) {
      return (pa(t2) ? function(t3) {
        var e2 = C.lastIndex = 0;
        for (; C.test(t3); )
          ++e2;
        return e2;
      } : D)(t2);
    }
    function ga(t2) {
      return pa(t2) ? t2.match(C) || [] : t2.split("");
    }
    function lc(t2) {
      for (var e2 = t2.length; e2-- && i.test(t2.charAt(e2)); )
        ;
      return e2;
    }
    var sc = R({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" });
    var _a = function o2(t2) {
      var b2 = (t2 = t2 == null ? ia : _a.defaults(ia.Object(), t2, _a.pick(ia, Tu))).Array, i2 = t2.Date, k = t2.Error, E = t2.Function, A = t2.Math, v2 = t2.Object, Y = t2.RegExp, U = t2.String, y2 = t2.TypeError, F = b2.prototype, V = E.prototype, N = v2.prototype, H = t2["__core-js_shared__"], $ = V.toString, z = N.hasOwnProperty, q = 0, G = (V = /[^.]+$/.exec(H && H.keys && H.keys.IE_PROTO || "")) ? "Symbol(src)_1." + V : "", K = N.toString, Z = $.call(v2), J = ia._, Q = Y("^" + $.call(z).replace(nu, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), V = Su ? t2.Buffer : Wi, e2 = t2.Symbol, tt = t2.Uint8Array, et = V ? V.allocUnsafe : Wi, nt = cc(v2.getPrototypeOf, v2), rt = v2.create, ot = N.propertyIsEnumerable, it = F.splice, at = e2 ? e2.isConcatSpreadable : Wi, ut = e2 ? e2.iterator : Wi, ct = e2 ? e2.toStringTag : Wi, ft = function() {
        try {
          var t3 = Jn(v2, "defineProperty");
          return t3({}, "", {}), t3;
        } catch (t4) {
        }
      }(), lt = t2.clearTimeout !== ia.clearTimeout && t2.clearTimeout, st = i2 && i2.now !== ia.Date.now && i2.now, dt = t2.setTimeout !== ia.setTimeout && t2.setTimeout, pt = A.ceil, ht = A.floor, vt = v2.getOwnPropertySymbols, V = V ? V.isBuffer : Wi, gt = t2.isFinite, _t = F.join, yt = cc(v2.keys, v2), w2 = A.max, C2 = A.min, wt = i2.now, mt = t2.parseInt, xt = A.random, bt = F.reverse, i2 = Jn(t2, "DataView"), Ct = Jn(t2, "Map"), It = Jn(t2, "Promise"), Tt = Jn(t2, "Set"), t2 = Jn(t2, "WeakMap"), Bt = Jn(v2, "create"), Dt = t2 && new t2(), Rt = {}, St = Cr(i2), Lt = Cr(Ct), Ot = Cr(It), kt = Cr(Tt), Et = Cr(t2), e2 = e2 ? e2.prototype : Wi, At = e2 ? e2.valueOf : Wi, Yt = e2 ? e2.toString : Wi;
      function h2(t3) {
        if (W(t3) && !M(t3) && !(t3 instanceof _2)) {
          if (t3 instanceof g2)
            return t3;
          if (z.call(t3, "__wrapped__"))
            return Ir(t3);
        }
        return new g2(t3);
      }
      var zt = function(t3) {
        if (!T2(t3))
          return {};
        if (rt)
          return rt(t3);
        jt.prototype = t3;
        t3 = new jt();
        return jt.prototype = Wi, t3;
      };
      function jt() {
      }
      function Xt() {
      }
      function g2(t3, e3) {
        this.__wrapped__ = t3, this.__actions__ = [], this.__chain__ = !!e3, this.__index__ = 0, this.__values__ = Wi;
      }
      function _2(t3) {
        this.__wrapped__ = t3, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = false, this.__iteratees__ = [], this.__takeCount__ = qi, this.__views__ = [];
      }
      function Pt(t3) {
        var e3 = -1, n3 = t3 == null ? 0 : t3.length;
        for (this.clear(); ++e3 < n3; ) {
          var r3 = t3[e3];
          this.set(r3[0], r3[1]);
        }
      }
      function Mt(t3) {
        var e3 = -1, n3 = t3 == null ? 0 : t3.length;
        for (this.clear(); ++e3 < n3; ) {
          var r3 = t3[e3];
          this.set(r3[0], r3[1]);
        }
      }
      function Wt(t3) {
        var e3 = -1, n3 = t3 == null ? 0 : t3.length;
        for (this.clear(); ++e3 < n3; ) {
          var r3 = t3[e3];
          this.set(r3[0], r3[1]);
        }
      }
      function Ut(t3) {
        var e3 = -1, n3 = t3 == null ? 0 : t3.length;
        for (this.__data__ = new Wt(); ++e3 < n3; )
          this.add(t3[e3]);
      }
      function j(t3) {
        t3 = this.__data__ = new Mt(t3);
        this.size = t3.size;
      }
      function Ft(t3, e3) {
        var n3, r3 = M(t3), o3 = !r3 && yo(t3), i3 = !r3 && !o3 && mo(t3), a3 = !r3 && !o3 && !i3 && Oo(t3), u3 = r3 || o3 || i3 || a3, c3 = u3 ? Ju(t3.length, U) : [], f3 = c3.length;
        for (n3 in t3)
          !e3 && !z.call(t3, n3) || u3 && (n3 == "length" || i3 && (n3 == "offset" || n3 == "parent") || a3 && (n3 == "buffer" || n3 == "byteLength" || n3 == "byteOffset") || or(n3, f3)) || c3.push(n3);
        return c3;
      }
      function Vt(t3) {
        var e3 = t3.length;
        return e3 ? t3[Xe(0, e3 - 1)] : Wi;
      }
      function Nt(t3, e3) {
        return wr(I2(t3), te(e3, 0, t3.length));
      }
      function Ht(t3) {
        return wr(I2(t3));
      }
      function $t(t3, e3, n3) {
        (n3 === Wi || P(t3[e3], n3)) && (n3 !== Wi || e3 in t3) || Jt(t3, e3, n3);
      }
      function qt(t3, e3, n3) {
        var r3 = t3[e3];
        z.call(t3, e3) && P(r3, n3) && (n3 !== Wi || e3 in t3) || Jt(t3, e3, n3);
      }
      function Gt(t3, e3) {
        for (var n3 = t3.length; n3--; )
          if (P(t3[n3][0], e3))
            return n3;
        return -1;
      }
      function Kt(t3, r3, o3, i3) {
        return oe(t3, function(t4, e3, n3) {
          r3(i3, t4, o3(t4), n3);
        }), i3;
      }
      function Zt(t3, e3) {
        return t3 && gn(e3, S2(e3), t3);
      }
      function Jt(t3, e3, n3) {
        e3 == "__proto__" && ft ? ft(t3, e3, { configurable: true, enumerable: true, value: n3, writable: true }) : t3[e3] = n3;
      }
      function Qt(t3, e3) {
        for (var n3 = -1, r3 = e3.length, o3 = b2(r3), i3 = t3 == null; ++n3 < r3; )
          o3[n3] = i3 ? Wi : No(t3, e3[n3]);
        return o3;
      }
      function te(t3, e3, n3) {
        return t3 == t3 && (n3 !== Wi && (t3 = t3 <= n3 ? t3 : n3), e3 !== Wi && (t3 = e3 <= t3 ? t3 : e3)), t3;
      }
      function m2(n3, r3, o3, t3, e3, i3) {
        var a3, u3 = 1 & r3, c3 = 2 & r3, f3 = 4 & r3;
        if ((a3 = o3 ? e3 ? o3(n3, t3, e3, i3) : o3(n3) : a3) !== Wi)
          return a3;
        if (!T2(n3))
          return n3;
        var l3, t3 = M(n3);
        if (t3) {
          if (a3 = function(t4) {
            var e4 = t4.length, n4 = new t4.constructor(e4);
            e4 && typeof t4[0] == "string" && z.call(t4, "index") && (n4.index = t4.index, n4.input = t4.input);
            return n4;
          }(n3), !u3)
            return I2(n3, a3);
        } else {
          var s3 = X(n3), d3 = s3 == Ba || s3 == Da;
          if (mo(n3))
            return ln(n3, u3);
          if (s3 == ta || s3 == Gi || d3 && !e3) {
            if (a3 = c3 || d3 ? {} : nr(n3), !u3)
              return c3 ? (p3 = d3 = n3, p3 = (l3 = a3) && gn(p3, L2(p3), l3), gn(d3, tr(d3), p3)) : (d3 = Zt(a3, l3 = n3), gn(l3, Qn(l3), d3));
          } else {
            if (!oa[s3])
              return e3 ? n3 : {};
            a3 = function(t4, e4, n4) {
              var r4 = t4.constructor;
              switch (e4) {
                case Ea:
                  return sn(t4);
                case Ki:
                case Zi:
                  return new r4(+t4);
                case na:
                  return function(t5, e5) {
                    e5 = e5 ? sn(t5.buffer) : t5.buffer;
                    return new t5.constructor(e5, t5.byteOffset, t5.byteLength);
                  }(t4, n4);
                case Aa:
                case Ya:
                case za:
                case ja:
                case Xa:
                case Pa:
                case Ma:
                case Wa:
                case Ua:
                  return dn(t4, n4);
                case Ji:
                  return new r4();
                case Qi:
                case La:
                  return new r4(t4);
                case Sa:
                  return function(t5) {
                    var e5 = new t5.constructor(t5.source, du.exec(t5));
                    return e5.lastIndex = t5.lastIndex, e5;
                  }(t4);
                case ea:
                  return new r4();
                case Oa:
                  return function(t5) {
                    return At ? v2(At.call(t5)) : {};
                  }(t4);
              }
            }(n3, s3, u3);
          }
        }
        var p3 = (i3 = i3 || new j()).get(n3);
        if (p3)
          return p3;
        i3.set(n3, a3), So(n3) ? n3.forEach(function(t4) {
          a3.add(m2(t4, r3, o3, t4, n3, i3));
        }) : To(n3) && n3.forEach(function(t4, e4) {
          a3.set(e4, m2(t4, r3, o3, e4, n3, i3));
        });
        var h3 = t3 ? Wi : (f3 ? c3 ? Hn : Nn : c3 ? L2 : S2)(n3);
        return ua(h3 || n3, function(t4, e4) {
          h3 && (t4 = n3[e4 = t4]), qt(a3, e4, m2(t4, r3, o3, e4, n3, i3));
        }), a3;
      }
      function ee(t3, e3, n3) {
        var r3 = n3.length;
        if (t3 == null)
          return !r3;
        for (t3 = v2(t3); r3--; ) {
          var o3 = n3[r3], i3 = e3[o3], a3 = t3[o3];
          if (a3 === Wi && !(o3 in t3) || !i3(a3))
            return false;
        }
        return true;
      }
      function ne(t3, e3, n3) {
        if (typeof t3 != "function")
          throw new y2(Ui);
        return vr(function() {
          t3.apply(Wi, n3);
        }, e3);
      }
      function re(t3, e3, n3, r3) {
        var o3 = -1, i3 = Pu, a3 = true, u3 = t3.length, c3 = [], f3 = e3.length;
        if (!u3)
          return c3;
        n3 && (e3 = fa(e3, da(n3))), r3 ? (i3 = Mu, a3 = false) : 200 <= e3.length && (i3 = ec, a3 = false, e3 = new Ut(e3));
        t:
          for (; ++o3 < u3; ) {
            var l3 = t3[o3], s3 = n3 == null ? l3 : n3(l3), l3 = r3 || l3 !== 0 ? l3 : 0;
            if (a3 && s3 == s3) {
              for (var d3 = f3; d3--; )
                if (e3[d3] === s3)
                  continue t;
              c3.push(l3);
            } else
              i3(e3, s3, r3) || c3.push(l3);
          }
        return c3;
      }
      h2.templateSettings = { escape: Ka, evaluate: Za, interpolate: Ja, variable: "", imports: { _: h2 } }, (h2.prototype = Xt.prototype).constructor = h2, (g2.prototype = zt(Xt.prototype)).constructor = g2, (_2.prototype = zt(Xt.prototype)).constructor = _2, Pt.prototype.clear = function() {
        this.__data__ = Bt ? Bt(null) : {}, this.size = 0;
      }, Pt.prototype.delete = function(t3) {
        return t3 = this.has(t3) && delete this.__data__[t3], this.size -= t3 ? 1 : 0, t3;
      }, Pt.prototype.get = function(t3) {
        var e3, n3 = this.__data__;
        return Bt ? (e3 = n3[t3]) === ya ? Wi : e3 : z.call(n3, t3) ? n3[t3] : Wi;
      }, Pt.prototype.has = function(t3) {
        var e3 = this.__data__;
        return Bt ? e3[t3] !== Wi : z.call(e3, t3);
      }, Pt.prototype.set = function(t3, e3) {
        var n3 = this.__data__;
        return this.size += this.has(t3) ? 0 : 1, n3[t3] = Bt && e3 === Wi ? ya : e3, this;
      }, Mt.prototype.clear = function() {
        this.__data__ = [], this.size = 0;
      }, Mt.prototype.delete = function(t3) {
        var e3 = this.__data__;
        return !((t3 = Gt(e3, t3)) < 0) && (t3 == e3.length - 1 ? e3.pop() : it.call(e3, t3, 1), --this.size, true);
      }, Mt.prototype.get = function(t3) {
        var e3 = this.__data__;
        return (t3 = Gt(e3, t3)) < 0 ? Wi : e3[t3][1];
      }, Mt.prototype.has = function(t3) {
        return -1 < Gt(this.__data__, t3);
      }, Mt.prototype.set = function(t3, e3) {
        var n3 = this.__data__, r3 = Gt(n3, t3);
        return r3 < 0 ? (++this.size, n3.push([t3, e3])) : n3[r3][1] = e3, this;
      }, Wt.prototype.clear = function() {
        this.size = 0, this.__data__ = { hash: new Pt(), map: new (Ct || Mt)(), string: new Pt() };
      }, Wt.prototype.delete = function(t3) {
        return t3 = Kn(this, t3).delete(t3), this.size -= t3 ? 1 : 0, t3;
      }, Wt.prototype.get = function(t3) {
        return Kn(this, t3).get(t3);
      }, Wt.prototype.has = function(t3) {
        return Kn(this, t3).has(t3);
      }, Wt.prototype.set = function(t3, e3) {
        var n3 = Kn(this, t3), r3 = n3.size;
        return n3.set(t3, e3), this.size += n3.size == r3 ? 0 : 1, this;
      }, Ut.prototype.add = Ut.prototype.push = function(t3) {
        return this.__data__.set(t3, ya), this;
      }, Ut.prototype.has = function(t3) {
        return this.__data__.has(t3);
      }, j.prototype.clear = function() {
        this.__data__ = new Mt(), this.size = 0;
      }, j.prototype.delete = function(t3) {
        var e3 = this.__data__, t3 = e3.delete(t3);
        return this.size = e3.size, t3;
      }, j.prototype.get = function(t3) {
        return this.__data__.get(t3);
      }, j.prototype.has = function(t3) {
        return this.__data__.has(t3);
      }, j.prototype.set = function(t3, e3) {
        var n3 = this.__data__;
        if (n3 instanceof Mt) {
          var r3 = n3.__data__;
          if (!Ct || r3.length < 199)
            return r3.push([t3, e3]), this.size = ++n3.size, this;
          n3 = this.__data__ = new Wt(r3);
        }
        return n3.set(t3, e3), this.size = n3.size, this;
      };
      var oe = wn(se), ie = wn(de, true);
      function ae(t3, r3) {
        var o3 = true;
        return oe(t3, function(t4, e3, n3) {
          return o3 = !!r3(t4, e3, n3);
        }), o3;
      }
      function ue(t3, e3, n3) {
        for (var r3 = -1, o3 = t3.length; ++r3 < o3; ) {
          var i3, a3, u3 = t3[r3], c3 = e3(u3);
          c3 != null && (i3 === Wi ? c3 == c3 && !B2(c3) : n3(c3, i3)) && (i3 = c3, a3 = u3);
        }
        return a3;
      }
      function ce(t3, r3) {
        var o3 = [];
        return oe(t3, function(t4, e3, n3) {
          r3(t4, e3, n3) && o3.push(t4);
        }), o3;
      }
      function c2(t3, e3, n3, r3, o3) {
        var i3 = -1, a3 = t3.length;
        for (n3 = n3 || rr, o3 = o3 || []; ++i3 < a3; ) {
          var u3 = t3[i3];
          0 < e3 && n3(u3) ? 1 < e3 ? c2(u3, e3 - 1, n3, r3, o3) : la(o3, u3) : r3 || (o3[o3.length] = u3);
        }
        return o3;
      }
      var fe = mn(), le = mn(true);
      function se(t3, e3) {
        return t3 && fe(t3, e3, S2);
      }
      function de(t3, e3) {
        return t3 && le(t3, e3, S2);
      }
      function pe(e3, t3) {
        return ca(t3, function(t4) {
          return bo(e3[t4]);
        });
      }
      function he(t3, e3) {
        for (var n3 = 0, r3 = (e3 = an(e3, t3)).length; t3 != null && n3 < r3; )
          t3 = t3[br(e3[n3++])];
        return n3 && n3 == r3 ? t3 : Wi;
      }
      function ve(t3, e3, n3) {
        e3 = e3(t3);
        return M(t3) ? e3 : la(e3, n3(t3));
      }
      function n2(t3) {
        {
          if (t3 == null)
            return t3 === Wi ? "[object Undefined]" : "[object Null]";
          if (ct && ct in v2(t3)) {
            var e3 = t3, n3 = z.call(e3, ct), r3 = e3[ct];
            try {
              e3[ct] = Wi;
              var o3 = true;
            } catch (t4) {
            }
            var i3 = K.call(e3);
            return o3 && (n3 ? e3[ct] = r3 : delete e3[ct]), i3;
          }
          return K.call(t3);
        }
      }
      function ge(t3, e3) {
        return e3 < t3;
      }
      function _e(t3, e3) {
        return t3 != null && z.call(t3, e3);
      }
      function ye(t3, e3) {
        return t3 != null && e3 in v2(t3);
      }
      function we(t3, e3, n3) {
        for (var r3 = n3 ? Mu : Pu, o3 = t3[0].length, i3 = t3.length, a3 = i3, u3 = b2(i3), c3 = 1 / 0, f3 = []; a3--; ) {
          var l3 = t3[a3];
          a3 && e3 && (l3 = fa(l3, da(e3))), c3 = C2(l3.length, c3), u3[a3] = !n3 && (e3 || 120 <= o3 && 120 <= l3.length) ? new Ut(a3 && l3) : Wi;
        }
        var l3 = t3[0], s3 = -1, d3 = u3[0];
        t:
          for (; ++s3 < o3 && f3.length < c3; ) {
            var p3 = l3[s3], h3 = e3 ? e3(p3) : p3, p3 = n3 || p3 !== 0 ? p3 : 0;
            if (!(d3 ? ec(d3, h3) : r3(f3, h3, n3))) {
              for (a3 = i3; --a3; ) {
                var v3 = u3[a3];
                if (!(v3 ? ec(v3, h3) : r3(t3[a3], h3, n3)))
                  continue t;
              }
              d3 && d3.push(h3), f3.push(p3);
            }
          }
        return f3;
      }
      function me(t3, e3, n3) {
        e3 = (t3 = dr(t3, e3 = an(e3, t3))) == null ? t3 : t3[br(r2(e3))];
        return e3 == null ? Wi : aa(e3, t3, n3);
      }
      function xe(t3) {
        return W(t3) && n2(t3) == Gi;
      }
      function be(t3, e3, n3, r3, o3) {
        {
          if (t3 === e3)
            return true;
          if (t3 == null || e3 == null || !W(t3) && !W(e3))
            return t3 != t3 && e3 != e3;
          var i3 = be, a3 = M(t3), u3 = M(e3), c3 = a3 ? Ia : X(t3), u3 = u3 ? Ia : X(e3), f3 = (c3 = c3 == Gi ? ta : c3) == ta, l3 = (u3 = u3 == Gi ? ta : u3) == ta, u3;
          if ((u3 = c3 == u3) && mo(t3)) {
            if (!mo(e3))
              return false;
            f3 = !(a3 = true);
          }
          if (u3 && !f3) {
            o3 = o3 || new j();
            if (a3 || Oo(t3))
              return Fn(t3, e3, n3, r3, i3, o3);
            else {
              var s3 = t3;
              var d3 = e3;
              var p3 = c3;
              var h3 = n3;
              var v3 = r3;
              var g3 = i3;
              var _3 = o3;
              switch (p3) {
                case na:
                  if (s3.byteLength != d3.byteLength || s3.byteOffset != d3.byteOffset)
                    return false;
                  s3 = s3.buffer, d3 = d3.buffer;
                case Ea:
                  return s3.byteLength == d3.byteLength && g3(new tt(s3), new tt(d3)) ? true : false;
                case Ki:
                case Zi:
                case Qi:
                  return P(+s3, +d3);
                case Ta:
                  return s3.name == d3.name && s3.message == d3.message;
                case Sa:
                case La:
                  return s3 == d3 + "";
                case Ji:
                  var y3 = uc;
                case ea:
                  var w3 = 1 & h3;
                  if (y3 = y3 || fc, s3.size != d3.size && !w3)
                    return false;
                  w3 = _3.get(s3);
                  if (w3)
                    return w3 == d3;
                  h3 |= 2, _3.set(s3, d3);
                  w3 = Fn(y3(s3), y3(d3), h3, v3, g3, _3);
                  return _3.delete(s3), w3;
                case Oa:
                  if (At)
                    return At.call(s3) == At.call(d3);
              }
              return false;
              return;
            }
          }
          if (!(1 & n3)) {
            a3 = f3 && z.call(t3, "__wrapped__"), c3 = l3 && z.call(e3, "__wrapped__");
            if (a3 || c3)
              return f3 = a3 ? t3.value() : t3, l3 = c3 ? e3.value() : e3, o3 = o3 || new j(), i3(f3, l3, n3, r3, o3);
          }
          if (u3) {
            o3 = o3 || new j();
            var m3 = t3, x3 = e3, b3 = n3, C3 = r3, I3 = i3, T3 = o3, B3 = 1 & b3, D3 = Nn(m3), R3 = D3.length, a3 = Nn(x3).length;
            if (R3 != a3 && !B3)
              return false;
            for (var S3 = R3; S3--; ) {
              var L3 = D3[S3];
              if (!(B3 ? L3 in x3 : z.call(x3, L3)))
                return false;
            }
            a3 = T3.get(m3), c3 = T3.get(x3);
            if (a3 && c3)
              return a3 == x3 && c3 == m3;
            for (var O2 = true, k2 = (T3.set(m3, x3), T3.set(x3, m3), B3); ++S3 < R3; ) {
              L3 = D3[S3];
              var E2, A2 = m3[L3], Y2 = x3[L3];
              if (!((E2 = C3 ? B3 ? C3(Y2, A2, L3, x3, m3, T3) : C3(A2, Y2, L3, m3, x3, T3) : E2) === Wi ? A2 === Y2 || I3(A2, Y2, b3, C3, T3) : E2)) {
                O2 = false;
                break;
              }
              k2 = k2 || L3 == "constructor";
            }
            return O2 && !k2 && (a3 = m3.constructor, c3 = x3.constructor, a3 != c3 && "constructor" in m3 && "constructor" in x3 && !(typeof a3 == "function" && a3 instanceof a3 && typeof c3 == "function" && c3 instanceof c3) && (O2 = false)), T3.delete(m3), T3.delete(x3), O2;
          }
          return false;
        }
      }
      function Ce(t3, e3, n3, r3) {
        var o3 = n3.length, i3 = o3, a3 = !r3;
        if (t3 == null)
          return !i3;
        for (t3 = v2(t3); o3--; ) {
          var u3 = n3[o3];
          if (a3 && u3[2] ? u3[1] !== t3[u3[0]] : !(u3[0] in t3))
            return false;
        }
        for (; ++o3 < i3; ) {
          var c3 = (u3 = n3[o3])[0], f3 = t3[c3], l3 = u3[1];
          if (a3 && u3[2]) {
            if (f3 === Wi && !(c3 in t3))
              return false;
          } else {
            var s3, d3 = new j();
            if (!((s3 = r3 ? r3(f3, l3, c3, t3, e3, d3) : s3) === Wi ? be(l3, f3, 3, r3, d3) : s3))
              return false;
          }
        }
        return true;
      }
      function Ie(t3) {
        return !(!T2(t3) || (e3 = t3, G && G in e3)) && (bo(t3) ? Q : vu).test(Cr(t3));
        var e3;
      }
      function Te(t3) {
        return typeof t3 == "function" ? t3 : t3 == null ? O : typeof t3 == "object" ? M(t3) ? Oe(t3[0], t3[1]) : Le(t3) : Ri(t3);
      }
      function Be(t3) {
        if (!cr(t3))
          return yt(t3);
        var e3, n3 = [];
        for (e3 in v2(t3))
          z.call(t3, e3) && e3 != "constructor" && n3.push(e3);
        return n3;
      }
      function De(t3) {
        if (!T2(t3)) {
          var e3 = t3, n3 = [];
          if (e3 != null)
            for (var r3 in v2(e3))
              n3.push(r3);
          return n3;
        }
        var o3, i3 = cr(t3), a3 = [];
        for (o3 in t3)
          (o3 != "constructor" || !i3 && z.call(t3, o3)) && a3.push(o3);
        return a3;
      }
      function Re(t3, e3) {
        return t3 < e3;
      }
      function Se(t3, r3) {
        var o3 = -1, i3 = l2(t3) ? b2(t3.length) : [];
        return oe(t3, function(t4, e3, n3) {
          i3[++o3] = r3(t4, e3, n3);
        }), i3;
      }
      function Le(e3) {
        var n3 = Zn(e3);
        return n3.length == 1 && n3[0][2] ? lr(n3[0][0], n3[0][1]) : function(t3) {
          return t3 === e3 || Ce(t3, e3, n3);
        };
      }
      function Oe(n3, r3) {
        return ir(n3) && fr(r3) ? lr(br(n3), r3) : function(t3) {
          var e3 = No(t3, n3);
          return e3 === Wi && e3 === r3 ? Ho(t3, n3) : be(r3, e3, 3);
        };
      }
      function ke(v3, g3, _3, y3, w3) {
        v3 !== g3 && fe(g3, function(t3, e3) {
          var n3, r3, o3, i3, a3, u3, c3, f3, l3, s3, d3, p3, h3;
          w3 = w3 || new j(), T2(t3) ? (r3 = g3, i3 = _3, a3 = ke, u3 = y3, c3 = w3, d3 = pr(n3 = v3, o3 = e3), p3 = pr(r3, o3), (h3 = c3.get(p3)) ? $t(n3, o3, h3) : (h3 = u3 ? u3(d3, p3, o3 + "", n3, r3, c3) : Wi, (r3 = h3 === Wi) && (f3 = M(p3), l3 = !f3 && mo(p3), s3 = !f3 && !l3 && Oo(p3), h3 = p3, f3 || l3 || s3 ? h3 = M(d3) ? d3 : x2(d3) ? I2(d3) : l3 ? ln(p3, !(r3 = false)) : s3 ? dn(p3, !(r3 = false)) : [] : Do(p3) || yo(p3) ? yo(h3 = d3) ? h3 = jo(d3) : T2(d3) && !bo(d3) || (h3 = nr(p3)) : r3 = false), r3 && (c3.set(p3, h3), a3(h3, p3, i3, u3, c3), c3.delete(p3)), $t(n3, o3, h3))) : (f3 = y3 ? y3(pr(v3, e3), t3, e3 + "", v3, g3, w3) : Wi, $t(v3, e3, f3 = f3 === Wi ? t3 : f3));
        }, L2);
      }
      function Ee(t3, e3) {
        var n3 = t3.length;
        if (n3)
          return or(e3 += e3 < 0 ? n3 : 0, n3) ? t3[e3] : Wi;
      }
      function Ae(t3, r3, l3) {
        r3 = r3.length ? fa(r3, function(e4) {
          return M(e4) ? function(t4) {
            return he(t4, e4.length === 1 ? e4[0] : e4);
          } : e4;
        }) : [O];
        var o3 = -1;
        r3 = fa(r3, da(s2()));
        var e3 = Se(t3, function(e4, t4, n4) {
          return { criteria: fa(r3, function(t5) {
            return t5(e4);
          }), index: ++o3, value: e4 };
        }), t3 = function(t4, e4) {
          for (var n4 = l3, r4 = -1, o4 = t4.criteria, i3 = e4.criteria, a3 = o4.length, u3 = n4.length; ++r4 < a3; ) {
            var c3 = pn(o4[r4], i3[r4]);
            if (c3) {
              if (u3 <= r4)
                return c3;
              var f3 = n4[r4];
              return c3 * (f3 == "desc" ? -1 : 1);
            }
          }
          return t4.index - e4.index;
        }, n3 = e3.length;
        for (e3.sort(t3); n3--; )
          e3[n3] = e3[n3].value;
        return e3;
      }
      function Ye(t3, e3, n3) {
        for (var r3 = -1, o3 = e3.length, i3 = {}; ++r3 < o3; ) {
          var a3 = e3[r3], u3 = he(t3, a3);
          n3(u3, a3) && Ue(i3, an(a3, t3), u3);
        }
        return i3;
      }
      function ze(t3, e3, n3, r3) {
        var o3 = r3 ? Hu : sa, i3 = -1, a3 = e3.length, u3 = t3;
        for (t3 === e3 && (e3 = I2(e3)), n3 && (u3 = fa(t3, da(n3))); ++i3 < a3; )
          for (var c3 = 0, f3 = e3[i3], l3 = n3 ? n3(f3) : f3; -1 < (c3 = o3(u3, l3, c3, r3)); )
            u3 !== t3 && it.call(u3, c3, 1), it.call(t3, c3, 1);
        return t3;
      }
      function je(t3, e3) {
        for (var n3 = t3 ? e3.length : 0, r3 = n3 - 1; n3--; ) {
          var o3, i3 = e3[n3];
          n3 != r3 && i3 === o3 || (or(o3 = i3) ? it.call(t3, i3, 1) : Ze(t3, i3));
        }
      }
      function Xe(t3, e3) {
        return t3 + ht(xt() * (e3 - t3 + 1));
      }
      function Pe(t3, e3) {
        var n3 = "";
        if (!t3 || e3 < 1 || $i < e3)
          return n3;
        for (; e3 % 2 && (n3 += t3), (e3 = ht(e3 / 2)) && (t3 += t3), e3; )
          ;
        return n3;
      }
      function a2(t3, e3) {
        return gr(sr(t3, e3, O), t3 + "");
      }
      function Me(t3) {
        return Vt(ri(t3));
      }
      function We(t3, e3) {
        t3 = ri(t3);
        return wr(t3, te(e3, 0, t3.length));
      }
      function Ue(t3, e3, n3, r3) {
        if (!T2(t3))
          return t3;
        for (var o3 = -1, i3 = (e3 = an(e3, t3)).length, a3 = i3 - 1, u3 = t3; u3 != null && ++o3 < i3; ) {
          var c3, f3 = br(e3[o3]), l3 = n3;
          if (f3 === "__proto__" || f3 === "constructor" || f3 === "prototype")
            return t3;
          o3 != a3 && (c3 = u3[f3], (l3 = r3 ? r3(c3, f3, u3) : Wi) === Wi && (l3 = T2(c3) ? c3 : or(e3[o3 + 1]) ? [] : {})), qt(u3, f3, l3), u3 = u3[f3];
        }
        return t3;
      }
      var Fe = Dt ? function(t3, e3) {
        return Dt.set(t3, e3), t3;
      } : O, e2 = ft ? function(t3, e3) {
        return ft(t3, "toString", { configurable: true, enumerable: false, value: _i(e3), writable: true });
      } : O;
      function Ve(t3) {
        return wr(ri(t3));
      }
      function u2(t3, e3, n3) {
        for (var r3 = -1, o3 = t3.length, i3 = ((n3 = o3 < n3 ? o3 : n3) < 0 && (n3 += o3), o3 = n3 < (e3 = e3 < 0 ? o3 < -e3 ? 0 : o3 + e3 : e3) ? 0 : n3 - e3 >>> 0, e3 >>>= 0, b2(o3)); ++r3 < o3; )
          i3[r3] = t3[r3 + e3];
        return i3;
      }
      function Ne(t3, r3) {
        var o3;
        return oe(t3, function(t4, e3, n3) {
          return !(o3 = r3(t4, e3, n3));
        }), !!o3;
      }
      function He(t3, e3, n3) {
        var r3 = 0, o3 = t3 == null ? r3 : t3.length;
        if (typeof e3 == "number" && e3 == e3 && o3 <= 2147483647) {
          for (; r3 < o3; ) {
            var i3 = r3 + o3 >>> 1, a3 = t3[i3];
            a3 !== null && !B2(a3) && (n3 ? a3 <= e3 : a3 < e3) ? r3 = 1 + i3 : o3 = i3;
          }
          return o3;
        }
        return $e(t3, e3, O, n3);
      }
      function $e(t3, e3, n3, r3) {
        var o3 = 0, i3 = t3 == null ? 0 : t3.length;
        if (i3 === 0)
          return 0;
        for (var a3 = (e3 = n3(e3)) != e3, u3 = e3 === null, c3 = B2(e3), f3 = e3 === Wi; o3 < i3; ) {
          var l3 = ht((o3 + i3) / 2), s3 = n3(t3[l3]), d3 = s3 !== Wi, p3 = s3 === null, h3 = s3 == s3, v3 = B2(s3), h3 = a3 ? r3 || h3 : f3 ? h3 && (r3 || d3) : u3 ? h3 && d3 && (r3 || !p3) : c3 ? h3 && d3 && !p3 && (r3 || !v3) : !p3 && !v3 && (r3 ? s3 <= e3 : s3 < e3);
          h3 ? o3 = l3 + 1 : i3 = l3;
        }
        return C2(i3, 4294967294);
      }
      function qe(t3, e3) {
        for (var n3 = -1, r3 = t3.length, o3 = 0, i3 = []; ++n3 < r3; ) {
          var a3, u3 = t3[n3], c3 = e3 ? e3(u3) : u3;
          n3 && P(c3, a3) || (a3 = c3, i3[o3++] = u3 === 0 ? 0 : u3);
        }
        return i3;
      }
      function Ge(t3) {
        return typeof t3 == "number" ? t3 : B2(t3) ? ba : +t3;
      }
      function f2(t3) {
        if (typeof t3 == "string")
          return t3;
        if (M(t3))
          return fa(t3, f2) + "";
        if (B2(t3))
          return Yt ? Yt.call(t3) : "";
        var e3 = t3 + "";
        return e3 == "0" && 1 / t3 == -Hi ? "-0" : e3;
      }
      function Ke(t3, e3, n3) {
        var r3 = -1, o3 = Pu, i3 = t3.length, a3 = true, u3 = [], c3 = u3;
        if (n3)
          a3 = false, o3 = Mu;
        else if (200 <= i3) {
          var f3 = e3 ? null : jn(t3);
          if (f3)
            return fc(f3);
          a3 = false, o3 = ec, c3 = new Ut();
        } else
          c3 = e3 ? [] : u3;
        t:
          for (; ++r3 < i3; ) {
            var l3 = t3[r3], s3 = e3 ? e3(l3) : l3, l3 = n3 || l3 !== 0 ? l3 : 0;
            if (a3 && s3 == s3) {
              for (var d3 = c3.length; d3--; )
                if (c3[d3] === s3)
                  continue t;
              e3 && c3.push(s3), u3.push(l3);
            } else
              o3(c3, s3, n3) || (c3 !== u3 && c3.push(s3), u3.push(l3));
          }
        return u3;
      }
      function Ze(t3, e3) {
        return (t3 = dr(t3, e3 = an(e3, t3))) == null || delete t3[br(r2(e3))];
      }
      function Je(t3, e3, n3, r3) {
        return Ue(t3, e3, n3(he(t3, e3)), r3);
      }
      function Qe(t3, e3, n3, r3) {
        for (var o3 = t3.length, i3 = r3 ? o3 : -1; (r3 ? i3-- : ++i3 < o3) && e3(t3[i3], i3, t3); )
          ;
        return n3 ? u2(t3, r3 ? 0 : i3, r3 ? i3 + 1 : o3) : u2(t3, r3 ? i3 + 1 : 0, r3 ? o3 : i3);
      }
      function tn(t3, e3) {
        var n3 = t3;
        return Wu(e3, function(t4, e4) {
          return e4.func.apply(e4.thisArg, la([t4], e4.args));
        }, n3 = t3 instanceof _2 ? t3.value() : n3);
      }
      function en(t3, e3, n3) {
        var r3 = t3.length;
        if (r3 < 2)
          return r3 ? Ke(t3[0]) : [];
        for (var o3 = -1, i3 = b2(r3); ++o3 < r3; )
          for (var a3 = t3[o3], u3 = -1; ++u3 < r3; )
            u3 != o3 && (i3[o3] = re(i3[o3] || a3, t3[u3], e3, n3));
        return Ke(c2(i3, 1), e3, n3);
      }
      function nn(t3, e3, n3) {
        for (var r3 = -1, o3 = t3.length, i3 = e3.length, a3 = {}; ++r3 < o3; ) {
          var u3 = r3 < i3 ? e3[r3] : Wi;
          n3(a3, t3[r3], u3);
        }
        return a3;
      }
      function rn(t3) {
        return x2(t3) ? t3 : [];
      }
      function on(t3) {
        return typeof t3 == "function" ? t3 : O;
      }
      function an(t3, e3) {
        return M(t3) ? t3 : ir(t3, e3) ? [t3] : xr(p2(t3));
      }
      var un = a2;
      function cn(t3, e3, n3) {
        var r3 = t3.length;
        return n3 = n3 === Wi ? r3 : n3, !e3 && r3 <= n3 ? t3 : u2(t3, e3, n3);
      }
      var fn = lt || function(t3) {
        return ia.clearTimeout(t3);
      };
      function ln(t3, e3) {
        if (e3)
          return t3.slice();
        e3 = t3.length, e3 = et ? et(e3) : new t3.constructor(e3);
        return t3.copy(e3), e3;
      }
      function sn(t3) {
        var e3 = new t3.constructor(t3.byteLength);
        return new tt(e3).set(new tt(t3)), e3;
      }
      function dn(t3, e3) {
        e3 = e3 ? sn(t3.buffer) : t3.buffer;
        return new t3.constructor(e3, t3.byteOffset, t3.length);
      }
      function pn(t3, e3) {
        if (t3 !== e3) {
          var n3 = t3 !== Wi, r3 = t3 === null, o3 = t3 == t3, i3 = B2(t3), a3 = e3 !== Wi, u3 = e3 === null, c3 = e3 == e3, f3 = B2(e3);
          if (!u3 && !f3 && !i3 && e3 < t3 || i3 && a3 && c3 && !u3 && !f3 || r3 && a3 && c3 || !n3 && c3 || !o3)
            return 1;
          if (!r3 && !i3 && !f3 && t3 < e3 || f3 && n3 && o3 && !r3 && !i3 || u3 && n3 && o3 || !a3 && o3 || !c3)
            return -1;
        }
        return 0;
      }
      function hn(t3, e3, n3, r3) {
        for (var o3 = -1, i3 = t3.length, a3 = n3.length, u3 = -1, c3 = e3.length, f3 = w2(i3 - a3, 0), l3 = b2(c3 + f3), s3 = !r3; ++u3 < c3; )
          l3[u3] = e3[u3];
        for (; ++o3 < a3; )
          (s3 || o3 < i3) && (l3[n3[o3]] = t3[o3]);
        for (; f3--; )
          l3[u3++] = t3[o3++];
        return l3;
      }
      function vn(t3, e3, n3, r3) {
        for (var o3 = -1, i3 = t3.length, a3 = -1, u3 = n3.length, c3 = -1, f3 = e3.length, l3 = w2(i3 - u3, 0), s3 = b2(l3 + f3), d3 = !r3; ++o3 < l3; )
          s3[o3] = t3[o3];
        for (var p3 = o3; ++c3 < f3; )
          s3[p3 + c3] = e3[c3];
        for (; ++a3 < u3; )
          (d3 || o3 < i3) && (s3[p3 + n3[a3]] = t3[o3++]);
        return s3;
      }
      function I2(t3, e3) {
        var n3 = -1, r3 = t3.length;
        for (e3 = e3 || b2(r3); ++n3 < r3; )
          e3[n3] = t3[n3];
        return e3;
      }
      function gn(t3, e3, n3, r3) {
        for (var o3 = !n3, i3 = (n3 = n3 || {}, -1), a3 = e3.length; ++i3 < a3; ) {
          var u3 = e3[i3], c3 = r3 ? r3(n3[u3], t3[u3], u3, n3, t3) : Wi;
          (o3 ? Jt : qt)(n3, u3, c3 = c3 === Wi ? t3[u3] : c3);
        }
        return n3;
      }
      function _n(o3, i3) {
        return function(t3, e3) {
          var n3 = M(t3) ? zu : Kt, r3 = i3 ? i3() : {};
          return n3(t3, o3, s2(e3, 2), r3);
        };
      }
      function yn(u3) {
        return a2(function(t3, e3) {
          var n3 = -1, r3 = e3.length, o3 = 1 < r3 ? e3[r3 - 1] : Wi, i3 = 2 < r3 ? e3[2] : Wi, o3 = 3 < u3.length && typeof o3 == "function" ? (r3--, o3) : Wi;
          for (i3 && d2(e3[0], e3[1], i3) && (o3 = r3 < 3 ? Wi : o3, r3 = 1), t3 = v2(t3); ++n3 < r3; ) {
            var a3 = e3[n3];
            a3 && u3(t3, a3, n3, o3);
          }
          return t3;
        });
      }
      function wn(i3, a3) {
        return function(t3, e3) {
          if (t3 == null)
            return t3;
          if (!l2(t3))
            return i3(t3, e3);
          for (var n3 = t3.length, r3 = a3 ? n3 : -1, o3 = v2(t3); (a3 ? r3-- : ++r3 < n3) && e3(o3[r3], r3, o3) !== false; )
            ;
          return t3;
        };
      }
      function mn(c3) {
        return function(t3, e3, n3) {
          for (var r3 = -1, o3 = v2(t3), i3 = n3(t3), a3 = i3.length; a3--; ) {
            var u3 = i3[c3 ? a3 : ++r3];
            if (e3(o3[u3], u3, o3) === false)
              break;
          }
          return t3;
        };
      }
      function xn(r3) {
        return function(t3) {
          var e3 = pa(t3 = p2(t3)) ? ga(t3) : Wi, n3 = e3 ? e3[0] : t3.charAt(0), e3 = e3 ? cn(e3, 1).join("") : t3.slice(1);
          return n3[r3]() + e3;
        };
      }
      function bn(e3) {
        return function(t3) {
          return Wu(hi(ai(t3).replace(xu, "")), e3, "");
        };
      }
      function Cn(r3) {
        return function() {
          var t3 = arguments;
          switch (t3.length) {
            case 0:
              return new r3();
            case 1:
              return new r3(t3[0]);
            case 2:
              return new r3(t3[0], t3[1]);
            case 3:
              return new r3(t3[0], t3[1], t3[2]);
            case 4:
              return new r3(t3[0], t3[1], t3[2], t3[3]);
            case 5:
              return new r3(t3[0], t3[1], t3[2], t3[3], t3[4]);
            case 6:
              return new r3(t3[0], t3[1], t3[2], t3[3], t3[4], t3[5]);
            case 7:
              return new r3(t3[0], t3[1], t3[2], t3[3], t3[4], t3[5], t3[6]);
          }
          var e3 = zt(r3.prototype), n3 = r3.apply(e3, t3);
          return T2(n3) ? n3 : e3;
        };
      }
      function In(i3, a3, u3) {
        var c3 = Cn(i3);
        return function t3() {
          for (var e3 = arguments.length, n3 = b2(e3), r3 = e3, o3 = Gn(t3); r3--; )
            n3[r3] = arguments[r3];
          o3 = e3 < 3 && n3[0] !== o3 && n3[e3 - 1] !== o3 ? [] : ha(n3, o3);
          return (e3 -= o3.length) < u3 ? Yn(i3, a3, Dn, t3.placeholder, Wi, n3, o3, Wi, Wi, u3 - e3) : aa(this && this !== ia && this instanceof t3 ? c3 : i3, this, n3);
        };
      }
      function Tn(i3) {
        return function(t3, e3, n3) {
          var r3, o3 = v2(t3), e3 = (l2(t3) || (r3 = s2(e3, 3), t3 = S2(t3), e3 = function(t4) {
            return r3(o3[t4], t4, o3);
          }), i3(t3, e3, n3));
          return -1 < e3 ? o3[r3 ? t3[e3] : e3] : Wi;
        };
      }
      function Bn(c3) {
        return Vn(function(o3) {
          var i3 = o3.length, t3 = i3, e3 = g2.prototype.thru;
          for (c3 && o3.reverse(); t3--; ) {
            var n3 = o3[t3];
            if (typeof n3 != "function")
              throw new y2(Ui);
            e3 && !u3 && qn(n3) == "wrapper" && (u3 = new g2([], true));
          }
          for (t3 = u3 ? t3 : i3; ++t3 < i3; )
            var r3 = qn(n3 = o3[t3]), a3 = r3 == "wrapper" ? $n(n3) : Wi, u3 = a3 && ar(a3[0]) && a3[1] == 424 && !a3[4].length && a3[9] == 1 ? u3[qn(a3[0])].apply(u3, a3[3]) : n3.length == 1 && ar(n3) ? u3[r3]() : u3.thru(n3);
          return function() {
            var t4 = arguments, e4 = t4[0];
            if (u3 && t4.length == 1 && M(e4))
              return u3.plant(e4).value();
            for (var n4 = 0, r4 = i3 ? o3[n4].apply(this, t4) : e4; ++n4 < i3; )
              r4 = o3[n4].call(this, r4);
            return r4;
          };
        });
      }
      function Dn(a3, u3, c3, f3, l3, s3, d3, p3, h3, v3) {
        var g3 = u3 & Ni, _3 = 1 & u3, y3 = 2 & u3, w3 = 24 & u3, m3 = 512 & u3, x3 = y3 ? Wi : Cn(a3);
        return function t3() {
          for (var e3 = b2(i3 = arguments.length), n3 = i3; n3--; )
            e3[n3] = arguments[n3];
          if (w3 && (o3 = function(t4, e4) {
            for (var n4 = t4.length, r4 = 0; n4--; )
              t4[n4] === e4 && ++r4;
            return r4;
          }(e3, r3 = Gn(t3))), f3 && (e3 = hn(e3, f3, l3, w3)), s3 && (e3 = vn(e3, s3, d3, w3)), i3 -= o3, w3 && i3 < v3)
            return o3 = ha(e3, r3), Yn(a3, u3, Dn, t3.placeholder, c3, e3, o3, p3, h3, v3 - i3);
          var r3 = _3 ? c3 : this, o3 = y3 ? r3[a3] : a3, i3 = e3.length;
          return p3 ? e3 = function(t4, e4) {
            for (var n4 = t4.length, r4 = C2(e4.length, n4), o4 = I2(t4); r4--; ) {
              var i4 = e4[r4];
              t4[r4] = or(i4, n4) ? o4[i4] : Wi;
            }
            return t4;
          }(e3, p3) : m3 && 1 < i3 && e3.reverse(), g3 && h3 < i3 && (e3.length = h3), (o3 = this && this !== ia && this instanceof t3 ? x3 || Cn(o3) : o3).apply(r3, e3);
        };
      }
      function Rn(n3, a3) {
        return function(t3, e3) {
          return t3 = t3, r3 = n3, o3 = a3(e3), i3 = {}, se(t3, function(t4, e4, n4) {
            r3(i3, o3(t4), e4, n4);
          }), i3;
          var r3, o3, i3;
        };
      }
      function Sn(r3, o3) {
        return function(t3, e3) {
          var n3;
          if (t3 === Wi && e3 === Wi)
            return o3;
          if (t3 !== Wi && (n3 = t3), e3 !== Wi) {
            if (n3 === Wi)
              return e3;
            e3 = typeof t3 == "string" || typeof e3 == "string" ? (t3 = f2(t3), f2(e3)) : (t3 = Ge(t3), Ge(e3)), n3 = r3(t3, e3);
          }
          return n3;
        };
      }
      function Ln(r3) {
        return Vn(function(t3) {
          return t3 = fa(t3, da(s2())), a2(function(e3) {
            var n3 = this;
            return r3(t3, function(t4) {
              return aa(t4, n3, e3);
            });
          });
        });
      }
      function On(t3, e3) {
        var n3 = (e3 = e3 === Wi ? " " : f2(e3)).length;
        if (n3 < 2)
          return n3 ? Pe(e3, t3) : e3;
        n3 = Pe(e3, pt(t3 / va(e3)));
        return pa(e3) ? cn(ga(n3), 0, t3).join("") : n3.slice(0, t3);
      }
      function kn(u3, t3, c3, f3) {
        var l3 = 1 & t3, s3 = Cn(u3);
        return function t4() {
          for (var e3 = -1, n3 = arguments.length, r3 = -1, o3 = f3.length, i3 = b2(o3 + n3), a3 = this && this !== ia && this instanceof t4 ? s3 : u3; ++r3 < o3; )
            i3[r3] = f3[r3];
          for (; n3--; )
            i3[r3++] = arguments[++e3];
          return aa(a3, l3 ? c3 : this, i3);
        };
      }
      function En(f3) {
        return function(t3, e3, n3) {
          n3 && typeof n3 != "number" && d2(t3, e3, n3) && (e3 = n3 = Wi), t3 = Yo(t3), e3 === Wi ? (e3 = t3, t3 = 0) : e3 = Yo(e3), n3 = n3 === Wi ? t3 < e3 ? 1 : -1 : Yo(n3);
          for (var r3 = t3, o3 = n3, i3 = f3, a3 = -1, u3 = w2(pt((e3 - r3) / (o3 || 1)), 0), c3 = b2(u3); u3--; )
            c3[i3 ? u3 : ++a3] = r3, r3 += o3;
          return c3;
        };
      }
      function An(n3) {
        return function(t3, e3) {
          return typeof t3 == "string" && typeof e3 == "string" || (t3 = R2(t3), e3 = R2(e3)), n3(t3, e3);
        };
      }
      function Yn(t3, e3, n3, r3, o3, i3, a3, u3, c3, f3) {
        var l3 = 8 & e3, o3 = (4 & (e3 = (e3 | (l3 ? Fi : Vi)) & ~(l3 ? Vi : Fi)) || (e3 &= -4), [t3, e3, o3, l3 ? i3 : Wi, l3 ? a3 : Wi, l3 ? Wi : i3, l3 ? Wi : a3, u3, c3, f3]), i3 = n3.apply(Wi, o3);
        return ar(t3) && hr(i3, o3), i3.placeholder = r3, _r(i3, t3, e3);
      }
      function zn(t3) {
        var r3 = A[t3];
        return function(t4, e3) {
          var n3;
          return t4 = R2(t4), (e3 = e3 == null ? 0 : C2(D2(e3), 292)) && gt(t4) ? (n3 = (p2(t4) + "e").split("e"), +((n3 = (p2(r3(n3[0] + "e" + (+n3[1] + e3))) + "e").split("e"))[0] + "e" + (+n3[1] - e3))) : r3(t4);
        };
      }
      var jn = Tt && 1 / fc(new Tt([, -0]))[1] == Hi ? function(t3) {
        return new Tt(t3);
      } : Ii;
      function Xn(i3) {
        return function(t3) {
          var e3, n3, r3, o3 = X(t3);
          return o3 == Ji ? uc(t3) : o3 == ea ? (o3 = t3, e3 = -1, n3 = Array(o3.size), o3.forEach(function(t4) {
            n3[++e3] = [t4, t4];
          }), n3) : fa(i3(r3 = t3), function(t4) {
            return [t4, r3[t4]];
          });
        };
      }
      function Pn(t3, e3, n3, r3, o3, i3, a3, u3) {
        var c3 = 2 & e3;
        if (!c3 && typeof t3 != "function")
          throw new y2(Ui);
        var f3, l3, s3, d3, p3, h3 = r3 ? r3.length : 0, v3 = (h3 || (e3 &= -97, r3 = o3 = Wi), a3 = a3 === Wi ? a3 : w2(D2(a3), 0), u3 = u3 === Wi ? u3 : D2(u3), h3 -= o3 ? o3.length : 0, e3 & Vi && (g3 = r3, f3 = o3, r3 = o3 = Wi), c3 ? Wi : $n(t3)), g3 = [t3, e3, n3, r3, o3, g3, f3, i3, a3, u3];
        return v3 && function(t4, e4) {
          var n4 = t4[1], r4 = e4[1], o4 = n4 | r4, i4 = o4 < 131, a4 = r4 == Ni && n4 == 8 || r4 == Ni && n4 == xa && t4[7].length <= e4[8] || r4 == 384 && e4[7].length <= e4[8] && n4 == 8;
          if (!i4 && !a4)
            return;
          1 & r4 && (t4[2] = e4[2], o4 |= 1 & n4 ? 0 : 4);
          i4 = e4[3];
          {
            var u4;
            i4 && (u4 = t4[3], t4[3] = u4 ? hn(u4, i4, e4[4]) : i4, t4[4] = u4 ? ha(t4[3], wa) : e4[4]);
          }
          (i4 = e4[5]) && (u4 = t4[5], t4[5] = u4 ? vn(u4, i4, e4[6]) : i4, t4[6] = u4 ? ha(t4[5], wa) : e4[6]);
          (i4 = e4[7]) && (t4[7] = i4);
          r4 & Ni && (t4[8] = t4[8] == null ? e4[8] : C2(t4[8], e4[8]));
          t4[9] == null && (t4[9] = e4[9]);
          t4[0] = e4[0], t4[1] = o4;
        }(g3, v3), t3 = g3[0], e3 = g3[1], n3 = g3[2], r3 = g3[3], o3 = g3[4], !(u3 = g3[9] = g3[9] === Wi ? c3 ? 0 : t3.length : w2(g3[9] - h3, 0)) && 24 & e3 && (e3 &= -25), f3 = e3 && e3 != 1 ? e3 == 8 || e3 == ma ? In(t3, e3, u3) : e3 != Fi && e3 != 33 || o3.length ? Dn.apply(Wi, g3) : kn(t3, e3, n3, r3) : (s3 = n3, d3 = 1 & e3, p3 = Cn(l3 = t3), function t4() {
          return (this && this !== ia && this instanceof t4 ? p3 : l3).apply(d3 ? s3 : this, arguments);
        }), _r((v3 ? Fe : hr)(f3, g3), t3, e3);
      }
      function Mn(t3, e3, n3, r3) {
        return t3 === Wi || P(t3, N[n3]) && !z.call(r3, n3) ? e3 : t3;
      }
      function Wn(t3, e3, n3, r3, o3, i3) {
        return T2(t3) && T2(e3) && (i3.set(e3, t3), ke(t3, e3, Wi, Wn, i3), i3.delete(e3)), t3;
      }
      function Un(t3) {
        return Do(t3) ? Wi : t3;
      }
      function Fn(t3, e3, n3, r3, o3, i3) {
        var a3 = 1 & n3, u3 = t3.length, c3 = e3.length;
        if (u3 != c3 && !(a3 && u3 < c3))
          return false;
        var c3 = i3.get(t3), f3 = i3.get(e3);
        if (c3 && f3)
          return c3 == e3 && f3 == t3;
        var l3 = -1, s3 = true, d3 = 2 & n3 ? new Ut() : Wi;
        for (i3.set(t3, e3), i3.set(e3, t3); ++l3 < u3; ) {
          var p3, h3 = t3[l3], v3 = e3[l3];
          if ((p3 = r3 ? a3 ? r3(v3, h3, l3, e3, t3, i3) : r3(h3, v3, l3, t3, e3, i3) : p3) !== Wi) {
            if (p3)
              continue;
            s3 = false;
            break;
          }
          if (d3) {
            if (!Fu(e3, function(t4, e4) {
              return !ec(d3, e4) && (h3 === t4 || o3(h3, t4, n3, r3, i3)) && d3.push(e4);
            })) {
              s3 = false;
              break;
            }
          } else if (h3 !== v3 && !o3(h3, v3, n3, r3, i3)) {
            s3 = false;
            break;
          }
        }
        return i3.delete(t3), i3.delete(e3), s3;
      }
      function Vn(t3) {
        return gr(sr(t3, Wi, Dr), t3 + "");
      }
      function Nn(t3) {
        return ve(t3, S2, Qn);
      }
      function Hn(t3) {
        return ve(t3, L2, tr);
      }
      var $n = Dt ? function(t3) {
        return Dt.get(t3);
      } : Ii;
      function qn(t3) {
        for (var e3 = t3.name + "", n3 = Rt[e3], r3 = z.call(Rt, e3) ? n3.length : 0; r3--; ) {
          var o3 = n3[r3], i3 = o3.func;
          if (i3 == null || i3 == t3)
            return o3.name;
        }
        return e3;
      }
      function Gn(t3) {
        return (z.call(h2, "placeholder") ? h2 : t3).placeholder;
      }
      function s2() {
        var t3 = (t3 = h2.iteratee || mi) === mi ? Te : t3;
        return arguments.length ? t3(arguments[0], arguments[1]) : t3;
      }
      function Kn(t3, e3) {
        var n3, r3, t3 = t3.__data__;
        return ((r3 = typeof (n3 = e3)) == "string" || r3 == "number" || r3 == "symbol" || r3 == "boolean" ? n3 !== "__proto__" : n3 === null) ? t3[typeof e3 == "string" ? "string" : "hash"] : t3.map;
      }
      function Zn(t3) {
        for (var e3 = S2(t3), n3 = e3.length; n3--; ) {
          var r3 = e3[n3], o3 = t3[r3];
          e3[n3] = [r3, o3, fr(o3)];
        }
        return e3;
      }
      function Jn(t3, e3) {
        e3 = e3;
        t3 = (t3 = t3) == null ? Wi : t3[e3];
        return Ie(t3) ? t3 : Wi;
      }
      var Qn = vt ? function(e3) {
        return e3 == null ? [] : (e3 = v2(e3), ca(vt(e3), function(t3) {
          return ot.call(e3, t3);
        }));
      } : Oi, tr = vt ? function(t3) {
        for (var e3 = []; t3; )
          la(e3, Qn(t3)), t3 = nt(t3);
        return e3;
      } : Oi, X = n2;
      function er(t3, e3, n3) {
        for (var r3 = -1, o3 = (e3 = an(e3, t3)).length, i3 = false; ++r3 < o3; ) {
          var a3 = br(e3[r3]);
          if (!(i3 = t3 != null && n3(t3, a3)))
            break;
          t3 = t3[a3];
        }
        return i3 || ++r3 != o3 ? i3 : !!(o3 = t3 == null ? 0 : t3.length) && Io(o3) && or(a3, o3) && (M(t3) || yo(t3));
      }
      function nr(t3) {
        return typeof t3.constructor != "function" || cr(t3) ? {} : zt(nt(t3));
      }
      function rr(t3) {
        return M(t3) || yo(t3) || !!(at && t3 && t3[at]);
      }
      function or(t3, e3) {
        var n3 = typeof t3;
        return !!(e3 = e3 == null ? $i : e3) && (n3 == "number" || n3 != "symbol" && _u.test(t3)) && -1 < t3 && t3 % 1 == 0 && t3 < e3;
      }
      function d2(t3, e3, n3) {
        var r3;
        if (T2(n3))
          return r3 = typeof e3, (r3 == "number" ? l2(n3) && or(e3, n3.length) : r3 == "string" && e3 in n3) && P(n3[e3], t3);
      }
      function ir(t3, e3) {
        var n3;
        if (!M(t3))
          return n3 = typeof t3, n3 == "number" || n3 == "symbol" || n3 == "boolean" || t3 == null || B2(t3) || (tu.test(t3) || !Qa.test(t3) || e3 != null && t3 in v2(e3));
      }
      function ar(t3) {
        var e3 = qn(t3), n3 = h2[e3];
        if (typeof n3 == "function" && e3 in _2.prototype) {
          if (t3 === n3)
            return 1;
          e3 = $n(n3);
          return e3 && t3 === e3[0];
        }
      }
      (i2 && X(new i2(new ArrayBuffer(1))) != na || Ct && X(new Ct()) != Ji || It && X(It.resolve()) != Ra || Tt && X(new Tt()) != ea || t2 && X(new t2()) != ka) && (X = function(t3) {
        var e3 = n2(t3), t3 = e3 == ta ? t3.constructor : Wi, t3 = t3 ? Cr(t3) : "";
        if (t3)
          switch (t3) {
            case St:
              return na;
            case Lt:
              return Ji;
            case Ot:
              return Ra;
            case kt:
              return ea;
            case Et:
              return ka;
          }
        return e3;
      });
      var ur = H ? bo : ki;
      function cr(t3) {
        var e3 = t3 && t3.constructor;
        return t3 === (typeof e3 == "function" && e3.prototype || N);
      }
      function fr(t3) {
        return t3 == t3 && !T2(t3);
      }
      function lr(e3, n3) {
        return function(t3) {
          return t3 != null && (t3[e3] === n3 && (n3 !== Wi || e3 in v2(t3)));
        };
      }
      function sr(i3, a3, u3) {
        return a3 = w2(a3 === Wi ? i3.length - 1 : a3, 0), function() {
          for (var t3 = arguments, e3 = -1, n3 = w2(t3.length - a3, 0), r3 = b2(n3); ++e3 < n3; )
            r3[e3] = t3[a3 + e3];
          for (var e3 = -1, o3 = b2(a3 + 1); ++e3 < a3; )
            o3[e3] = t3[e3];
          return o3[a3] = u3(r3), aa(i3, this, o3);
        };
      }
      function dr(t3, e3) {
        return e3.length < 2 ? t3 : he(t3, u2(e3, 0, -1));
      }
      function pr(t3, e3) {
        if ((e3 !== "constructor" || typeof t3[e3] != "function") && e3 != "__proto__")
          return t3[e3];
      }
      var hr = yr(Fe), vr = dt || function(t3, e3) {
        return ia.setTimeout(t3, e3);
      }, gr = yr(e2);
      function _r(t3, e3, n3) {
        var r3, o3, e3 = e3 + "";
        return gr(t3, function(t4, e4) {
          var n4 = e4.length;
          if (!n4)
            return t4;
          var r4 = n4 - 1;
          return e4[r4] = (1 < n4 ? "& " : "") + e4[r4], e4 = e4.join(2 < n4 ? ", " : " "), t4.replace(iu, "{\n/* [wrapped with " + e4 + "] */\n");
        }(e3, (r3 = (t3 = (t3 = e3).match(au)) ? t3[1].split(uu) : [], o3 = n3, ua(Ca, function(t4) {
          var e4 = "_." + t4[0];
          o3 & t4[1] && !Pu(r3, e4) && r3.push(e4);
        }), r3.sort())));
      }
      function yr(n3) {
        var r3 = 0, o3 = 0;
        return function() {
          var t3 = wt(), e3 = 16 - (t3 - o3);
          if (o3 = t3, 0 < e3) {
            if (800 <= ++r3)
              return arguments[0];
          } else
            r3 = 0;
          return n3.apply(Wi, arguments);
        };
      }
      function wr(t3, e3) {
        var n3 = -1, r3 = t3.length, o3 = r3 - 1;
        for (e3 = e3 === Wi ? r3 : e3; ++n3 < e3; ) {
          var i3 = Xe(n3, o3), a3 = t3[i3];
          t3[i3] = t3[n3], t3[n3] = a3;
        }
        return t3.length = e3, t3;
      }
      mr = (lt = lo(lt = function(t3) {
        var o3 = [];
        return t3.charCodeAt(0) === 46 && o3.push(""), t3.replace(eu, function(t4, e3, n3, r3) {
          o3.push(n3 ? r3.replace(lu, "$1") : e3 || t4);
        }), o3;
      }, function(t3) {
        return mr.size === 500 && mr.clear(), t3;
      })).cache;
      var mr, xr = lt;
      function br(t3) {
        if (typeof t3 == "string" || B2(t3))
          return t3;
        var e3 = t3 + "";
        return e3 == "0" && 1 / t3 == -Hi ? "-0" : e3;
      }
      function Cr(t3) {
        if (t3 != null) {
          try {
            return $.call(t3);
          } catch (t4) {
          }
          try {
            return t3 + "";
          } catch (t4) {
          }
        }
        return "";
      }
      function Ir(t3) {
        if (t3 instanceof _2)
          return t3.clone();
        var e3 = new g2(t3.__wrapped__, t3.__chain__);
        return e3.__actions__ = I2(t3.__actions__), e3.__index__ = t3.__index__, e3.__values__ = t3.__values__, e3;
      }
      i2 = a2(function(t3, e3) {
        return x2(t3) ? re(t3, c2(e3, 1, x2, true)) : [];
      }), It = a2(function(t3, e3) {
        var n3 = r2(e3);
        return x2(n3) && (n3 = Wi), x2(t3) ? re(t3, c2(e3, 1, x2, true), s2(n3, 2)) : [];
      }), t2 = a2(function(t3, e3) {
        var n3 = r2(e3);
        return x2(n3) && (n3 = Wi), x2(t3) ? re(t3, c2(e3, 1, x2, true), Wi, n3) : [];
      });
      function Tr(t3, e3, n3) {
        var r3 = t3 == null ? 0 : t3.length;
        if (!r3)
          return -1;
        n3 = n3 == null ? 0 : D2(n3);
        return n3 < 0 && (n3 = w2(r3 + n3, 0)), Nu(t3, s2(e3, 3), n3);
      }
      function Br(t3, e3, n3) {
        var r3 = t3 == null ? 0 : t3.length;
        if (!r3)
          return -1;
        var o3 = r3 - 1;
        return n3 !== Wi && (o3 = D2(n3), o3 = n3 < 0 ? w2(r3 + o3, 0) : C2(o3, r3 - 1)), Nu(t3, s2(e3, 3), o3, true);
      }
      function Dr(t3) {
        return (t3 == null ? 0 : t3.length) ? c2(t3, 1) : [];
      }
      function Rr(t3) {
        return t3 && t3.length ? t3[0] : Wi;
      }
      H = a2(function(t3) {
        var e3 = fa(t3, rn);
        return e3.length && e3[0] === t3[0] ? we(e3) : [];
      }), dt = a2(function(t3) {
        var e3 = r2(t3), n3 = fa(t3, rn);
        return e3 === r2(n3) ? e3 = Wi : n3.pop(), n3.length && n3[0] === t3[0] ? we(n3, s2(e3, 2)) : [];
      }), e2 = a2(function(t3) {
        var e3 = r2(t3), n3 = fa(t3, rn);
        return (e3 = typeof e3 == "function" ? e3 : Wi) && n3.pop(), n3.length && n3[0] === t3[0] ? we(n3, Wi, e3) : [];
      });
      function r2(t3) {
        var e3 = t3 == null ? 0 : t3.length;
        return e3 ? t3[e3 - 1] : Wi;
      }
      lt = a2(Sr);
      function Sr(t3, e3) {
        return t3 && t3.length && e3 && e3.length ? ze(t3, e3) : t3;
      }
      var Lr = Vn(function(t3, e3) {
        var n3 = t3 == null ? 0 : t3.length, r3 = Qt(t3, e3);
        return je(t3, fa(e3, function(t4) {
          return or(t4, n3) ? +t4 : t4;
        }).sort(pn)), r3;
      });
      function Or(t3) {
        return t3 == null ? t3 : bt.call(t3);
      }
      var kr = a2(function(t3) {
        return Ke(c2(t3, 1, x2, true));
      }), Er = a2(function(t3) {
        var e3 = r2(t3);
        return x2(e3) && (e3 = Wi), Ke(c2(t3, 1, x2, true), s2(e3, 2));
      }), Ar = a2(function(t3) {
        var e3 = typeof (e3 = r2(t3)) == "function" ? e3 : Wi;
        return Ke(c2(t3, 1, x2, true), Wi, e3);
      });
      function Yr(e3) {
        if (!e3 || !e3.length)
          return [];
        var n3 = 0;
        return e3 = ca(e3, function(t3) {
          return x2(t3) && (n3 = w2(t3.length, n3), 1);
        }), Ju(n3, function(t3) {
          return fa(e3, Gu(t3));
        });
      }
      function zr(t3, e3) {
        if (!t3 || !t3.length)
          return [];
        t3 = Yr(t3);
        return e3 == null ? t3 : fa(t3, function(t4) {
          return aa(e3, Wi, t4);
        });
      }
      var jr = a2(function(t3, e3) {
        return x2(t3) ? re(t3, e3) : [];
      }), Xr = a2(function(t3) {
        return en(ca(t3, x2));
      }), Pr = a2(function(t3) {
        var e3 = r2(t3);
        return x2(e3) && (e3 = Wi), en(ca(t3, x2), s2(e3, 2));
      }), Mr = a2(function(t3) {
        var e3 = typeof (e3 = r2(t3)) == "function" ? e3 : Wi;
        return en(ca(t3, x2), Wi, e3);
      }), Wr = a2(Yr);
      var Ur = a2(function(t3) {
        var e3 = t3.length, e3 = typeof (e3 = 1 < e3 ? t3[e3 - 1] : Wi) == "function" ? (t3.pop(), e3) : Wi;
        return zr(t3, e3);
      });
      function Fr(t3) {
        t3 = h2(t3);
        return t3.__chain__ = true, t3;
      }
      function Vr(t3, e3) {
        return e3(t3);
      }
      var Nr = Vn(function(e3) {
        function t3(t4) {
          return Qt(t4, e3);
        }
        var n3 = e3.length, r3 = n3 ? e3[0] : 0, o3 = this.__wrapped__;
        return !(1 < n3 || this.__actions__.length) && o3 instanceof _2 && or(r3) ? ((o3 = o3.slice(r3, +r3 + (n3 ? 1 : 0))).__actions__.push({ func: Vr, args: [t3], thisArg: Wi }), new g2(o3, this.__chain__).thru(function(t4) {
          return n3 && !t4.length && t4.push(Wi), t4;
        })) : this.thru(t3);
      });
      var Hr = _n(function(t3, e3, n3) {
        z.call(t3, n3) ? ++t3[n3] : Jt(t3, n3, 1);
      });
      var $r = Tn(Tr), qr = Tn(Br);
      function Gr(t3, e3) {
        return (M(t3) ? ua : oe)(t3, s2(e3, 3));
      }
      function Kr(t3, e3) {
        return (M(t3) ? ju : ie)(t3, s2(e3, 3));
      }
      var Zr = _n(function(t3, e3, n3) {
        z.call(t3, n3) ? t3[n3].push(e3) : Jt(t3, n3, [e3]);
      });
      var Jr = a2(function(t3, e3, n3) {
        var r3 = -1, o3 = typeof e3 == "function", i3 = l2(t3) ? b2(t3.length) : [];
        return oe(t3, function(t4) {
          i3[++r3] = o3 ? aa(e3, t4, n3) : me(t4, e3, n3);
        }), i3;
      }), Qr = _n(function(t3, e3, n3) {
        Jt(t3, n3, e3);
      });
      function to(t3, e3) {
        return (M(t3) ? fa : Se)(t3, s2(e3, 3));
      }
      var eo = _n(function(t3, e3, n3) {
        t3[n3 ? 0 : 1].push(e3);
      }, function() {
        return [[], []];
      });
      var no = a2(function(t3, e3) {
        if (t3 == null)
          return [];
        var n3 = e3.length;
        return 1 < n3 && d2(t3, e3[0], e3[1]) ? e3 = [] : 2 < n3 && d2(e3[0], e3[1], e3[2]) && (e3 = [e3[0]]), Ae(t3, c2(e3, 1), []);
      }), ro = st || function() {
        return ia.Date.now();
      };
      function oo(t3, e3, n3) {
        return e3 = n3 ? Wi : e3, e3 = t3 && e3 == null ? t3.length : e3, Pn(t3, Ni, Wi, Wi, Wi, Wi, e3);
      }
      function io(t3, e3) {
        var n3;
        if (typeof e3 != "function")
          throw new y2(Ui);
        return t3 = D2(t3), function() {
          return 0 < --t3 && (n3 = e3.apply(this, arguments)), t3 <= 1 && (e3 = Wi), n3;
        };
      }
      var ao = a2(function(t3, e3, n3) {
        var r3, o3 = 1;
        return n3.length && (r3 = ha(n3, Gn(ao)), o3 |= Fi), Pn(t3, o3, e3, n3, r3);
      }), uo = a2(function(t3, e3, n3) {
        var r3, o3 = 3;
        return n3.length && (r3 = ha(n3, Gn(uo)), o3 |= Fi), Pn(e3, o3, t3, n3, r3);
      });
      function co(r3, n3, t3) {
        var o3, i3, a3, u3, c3, f3, l3 = 0, s3 = false, d3 = false, e3 = true;
        if (typeof r3 != "function")
          throw new y2(Ui);
        function p3(t4) {
          var e4 = o3, n4 = i3;
          return o3 = i3 = Wi, l3 = t4, u3 = r3.apply(n4, e4);
        }
        function h3(t4) {
          var e4 = t4 - f3;
          return f3 === Wi || n3 <= e4 || e4 < 0 || d3 && a3 <= t4 - l3;
        }
        function v3() {
          var t4, e4 = ro();
          if (h3(e4))
            return g3(e4);
          c3 = vr(v3, (t4 = n3 - ((e4 = e4) - f3), d3 ? C2(t4, a3 - (e4 - l3)) : t4));
        }
        function g3(t4) {
          return c3 = Wi, e3 && o3 ? p3(t4) : (o3 = i3 = Wi, u3);
        }
        function _3() {
          var t4 = ro(), e4 = h3(t4);
          if (o3 = arguments, i3 = this, f3 = t4, e4) {
            if (c3 === Wi)
              return l3 = t4 = f3, c3 = vr(v3, n3), s3 ? p3(t4) : u3;
            if (d3)
              return fn(c3), c3 = vr(v3, n3), p3(f3);
          }
          return c3 === Wi && (c3 = vr(v3, n3)), u3;
        }
        return n3 = R2(n3) || 0, T2(t3) && (s3 = !!t3.leading, d3 = "maxWait" in t3, a3 = d3 ? w2(R2(t3.maxWait) || 0, n3) : a3, e3 = "trailing" in t3 ? !!t3.trailing : e3), _3.cancel = function() {
          c3 !== Wi && fn(c3), l3 = 0, o3 = f3 = i3 = c3 = Wi;
        }, _3.flush = function() {
          return c3 === Wi ? u3 : g3(ro());
        }, _3;
      }
      var st = a2(function(t3, e3) {
        return ne(t3, 1, e3);
      }), fo = a2(function(t3, e3, n3) {
        return ne(t3, R2(e3) || 0, n3);
      });
      function lo(r3, o3) {
        if (typeof r3 != "function" || o3 != null && typeof o3 != "function")
          throw new y2(Ui);
        function i3() {
          var t3 = arguments, e3 = o3 ? o3.apply(this, t3) : t3[0], n3 = i3.cache;
          return n3.has(e3) ? n3.get(e3) : (t3 = r3.apply(this, t3), i3.cache = n3.set(e3, t3) || n3, t3);
        }
        return i3.cache = new (lo.Cache || Wt)(), i3;
      }
      function so(e3) {
        if (typeof e3 != "function")
          throw new y2(Ui);
        return function() {
          var t3 = arguments;
          switch (t3.length) {
            case 0:
              return !e3.call(this);
            case 1:
              return !e3.call(this, t3[0]);
            case 2:
              return !e3.call(this, t3[0], t3[1]);
            case 3:
              return !e3.call(this, t3[0], t3[1], t3[2]);
          }
          return !e3.apply(this, t3);
        };
      }
      lo.Cache = Wt;
      var un = un(function(r3, o3) {
        var i3 = (o3 = o3.length == 1 && M(o3[0]) ? fa(o3[0], da(s2())) : fa(c2(o3, 1), da(s2()))).length;
        return a2(function(t3) {
          for (var e3 = -1, n3 = C2(t3.length, i3); ++e3 < n3; )
            t3[e3] = o3[e3].call(this, t3[e3]);
          return aa(r3, this, t3);
        });
      }), po = a2(function(t3, e3) {
        var n3 = ha(e3, Gn(po));
        return Pn(t3, Fi, Wi, e3, n3);
      }), ho = a2(function(t3, e3) {
        var n3 = ha(e3, Gn(ho));
        return Pn(t3, Vi, Wi, e3, n3);
      }), vo = Vn(function(t3, e3) {
        return Pn(t3, xa, Wi, Wi, Wi, e3);
      });
      function P(t3, e3) {
        return t3 === e3 || t3 != t3 && e3 != e3;
      }
      var go = An(ge), _o = An(function(t3, e3) {
        return e3 <= t3;
      }), yo = xe(function() {
        return arguments;
      }()) ? xe : function(t3) {
        return W(t3) && z.call(t3, "callee") && !ot.call(t3, "callee");
      }, M = b2.isArray, wo = Lu ? da(Lu) : function(t3) {
        return W(t3) && n2(t3) == Ea;
      };
      function l2(t3) {
        return t3 != null && Io(t3.length) && !bo(t3);
      }
      function x2(t3) {
        return W(t3) && l2(t3);
      }
      var mo = V || ki, V = Ou ? da(Ou) : function(t3) {
        return W(t3) && n2(t3) == Zi;
      };
      function xo(t3) {
        if (!W(t3))
          return false;
        var e3 = n2(t3);
        return e3 == Ta || e3 == "[object DOMException]" || typeof t3.message == "string" && typeof t3.name == "string" && !Do(t3);
      }
      function bo(t3) {
        if (!T2(t3))
          return false;
        t3 = n2(t3);
        return t3 == Ba || t3 == Da || t3 == "[object AsyncFunction]" || t3 == "[object Proxy]";
      }
      function Co(t3) {
        return typeof t3 == "number" && t3 == D2(t3);
      }
      function Io(t3) {
        return typeof t3 == "number" && -1 < t3 && t3 % 1 == 0 && t3 <= $i;
      }
      function T2(t3) {
        var e3 = typeof t3;
        return t3 != null && (e3 == "object" || e3 == "function");
      }
      function W(t3) {
        return t3 != null && typeof t3 == "object";
      }
      var To = ku ? da(ku) : function(t3) {
        return W(t3) && X(t3) == Ji;
      };
      function Bo(t3) {
        return typeof t3 == "number" || W(t3) && n2(t3) == Qi;
      }
      function Do(t3) {
        if (!W(t3) || n2(t3) != ta)
          return false;
        t3 = nt(t3);
        if (t3 === null)
          return true;
        t3 = z.call(t3, "constructor") && t3.constructor;
        return typeof t3 == "function" && t3 instanceof t3 && $.call(t3) == Z;
      }
      var Ro = Eu ? da(Eu) : function(t3) {
        return W(t3) && n2(t3) == Sa;
      };
      var So = Au ? da(Au) : function(t3) {
        return W(t3) && X(t3) == ea;
      };
      function Lo(t3) {
        return typeof t3 == "string" || !M(t3) && W(t3) && n2(t3) == La;
      }
      function B2(t3) {
        return typeof t3 == "symbol" || W(t3) && n2(t3) == Oa;
      }
      var Oo = Yu ? da(Yu) : function(t3) {
        return W(t3) && Io(t3.length) && !!ra[n2(t3)];
      };
      var ko = An(Re), Eo = An(function(t3, e3) {
        return t3 <= e3;
      });
      function Ao(t3) {
        if (!t3)
          return [];
        if (l2(t3))
          return (Lo(t3) ? ga : I2)(t3);
        if (ut && t3[ut]) {
          for (var e3, n3 = t3[ut](), r3 = []; !(e3 = n3.next()).done; )
            r3.push(e3.value);
          return r3;
        }
        var o3 = X(t3);
        return (o3 == Ji ? uc : o3 == ea ? fc : ri)(t3);
      }
      function Yo(t3) {
        return t3 ? (t3 = R2(t3)) === Hi || t3 === -Hi ? 17976931348623157e292 * (t3 < 0 ? -1 : 1) : t3 == t3 ? t3 : 0 : t3 === 0 ? t3 : 0;
      }
      function D2(t3) {
        var t3 = Yo(t3), e3 = t3 % 1;
        return t3 == t3 ? e3 ? t3 - e3 : t3 : 0;
      }
      function zo(t3) {
        return t3 ? te(D2(t3), 0, qi) : 0;
      }
      function R2(t3) {
        if (typeof t3 == "number")
          return t3;
        if (B2(t3))
          return ba;
        if (typeof (t3 = T2(t3) ? T2(e3 = typeof t3.valueOf == "function" ? t3.valueOf() : t3) ? e3 + "" : e3 : t3) != "string")
          return t3 === 0 ? t3 : +t3;
        t3 = Qu(t3);
        var e3 = hu.test(t3);
        return e3 || gu.test(t3) ? Ru(t3.slice(2), e3 ? 2 : 8) : pu.test(t3) ? ba : +t3;
      }
      function jo(t3) {
        return gn(t3, L2(t3));
      }
      function p2(t3) {
        return t3 == null ? "" : f2(t3);
      }
      var Xo = yn(function(t3, e3) {
        if (cr(e3) || l2(e3))
          gn(e3, S2(e3), t3);
        else
          for (var n3 in e3)
            z.call(e3, n3) && qt(t3, n3, e3[n3]);
      }), Po = yn(function(t3, e3) {
        gn(e3, L2(e3), t3);
      }), Mo = yn(function(t3, e3, n3, r3) {
        gn(e3, L2(e3), t3, r3);
      }), Wo = yn(function(t3, e3, n3, r3) {
        gn(e3, S2(e3), t3, r3);
      }), Uo = Vn(Qt);
      var Fo = a2(function(t3, e3) {
        t3 = v2(t3);
        var n3 = -1, r3 = e3.length, o3 = 2 < r3 ? e3[2] : Wi;
        for (o3 && d2(e3[0], e3[1], o3) && (r3 = 1); ++n3 < r3; )
          for (var i3 = e3[n3], a3 = L2(i3), u3 = -1, c3 = a3.length; ++u3 < c3; ) {
            var f3 = a3[u3], l3 = t3[f3];
            (l3 === Wi || P(l3, N[f3]) && !z.call(t3, f3)) && (t3[f3] = i3[f3]);
          }
        return t3;
      }), Vo = a2(function(t3) {
        return t3.push(Wi, Wn), aa(Zo, Wi, t3);
      });
      function No(t3, e3, n3) {
        t3 = t3 == null ? Wi : he(t3, e3);
        return t3 === Wi ? n3 : t3;
      }
      function Ho(t3, e3) {
        return t3 != null && er(t3, e3, ye);
      }
      var $o = Rn(function(t3, e3, n3) {
        t3[e3 = e3 != null && typeof e3.toString != "function" ? K.call(e3) : e3] = n3;
      }, _i(O)), qo = Rn(function(t3, e3, n3) {
        e3 != null && typeof e3.toString != "function" && (e3 = K.call(e3)), z.call(t3, e3) ? t3[e3].push(n3) : t3[e3] = [n3];
      }, s2), Go = a2(me);
      function S2(t3) {
        return (l2(t3) ? Ft : Be)(t3);
      }
      function L2(t3) {
        return l2(t3) ? Ft(t3, true) : De(t3);
      }
      var Ko = yn(function(t3, e3, n3) {
        ke(t3, e3, n3);
      }), Zo = yn(function(t3, e3, n3, r3) {
        ke(t3, e3, n3, r3);
      }), Jo = Vn(function(e3, t3) {
        var n3 = {};
        if (e3 == null)
          return n3;
        for (var r3 = false, o3 = (t3 = fa(t3, function(t4) {
          return t4 = an(t4, e3), r3 = r3 || 1 < t4.length, t4;
        }), gn(e3, Hn(e3), n3), r3 && (n3 = m2(n3, 7, Un)), t3.length); o3--; )
          Ze(n3, t3[o3]);
        return n3;
      });
      var Qo = Vn(function(t3, e3) {
        return t3 == null ? {} : Ye(n3 = t3, e3, function(t4, e4) {
          return Ho(n3, e4);
        });
        var n3;
      });
      function ti(t3, n3) {
        if (t3 == null)
          return {};
        var e3 = fa(Hn(t3), function(t4) {
          return [t4];
        });
        return n3 = s2(n3), Ye(t3, e3, function(t4, e4) {
          return n3(t4, e4[0]);
        });
      }
      var ei = Xn(S2), ni = Xn(L2);
      function ri(t3) {
        return t3 == null ? [] : tc(t3, S2(t3));
      }
      var oi = bn(function(t3, e3, n3) {
        return e3 = e3.toLowerCase(), t3 + (n3 ? ii(e3) : e3);
      });
      function ii(t3) {
        return pi(p2(t3).toLowerCase());
      }
      function ai(t3) {
        return (t3 = p2(t3)) && t3.replace(yu, oc).replace(bu, "");
      }
      var ui = bn(function(t3, e3, n3) {
        return t3 + (n3 ? "-" : "") + e3.toLowerCase();
      }), ci = bn(function(t3, e3, n3) {
        return t3 + (n3 ? " " : "") + e3.toLowerCase();
      }), fi = xn("toLowerCase");
      var li = bn(function(t3, e3, n3) {
        return t3 + (n3 ? "_" : "") + e3.toLowerCase();
      });
      var si = bn(function(t3, e3, n3) {
        return t3 + (n3 ? " " : "") + pi(e3);
      });
      var di = bn(function(t3, e3, n3) {
        return t3 + (n3 ? " " : "") + e3.toUpperCase();
      }), pi = xn("toUpperCase");
      function hi(t3, e3, n3) {
        return t3 = p2(t3), (e3 = n3 ? Wi : e3) === Wi ? (n3 = t3, Iu.test(n3) ? t3.match(Cu) || [] : t3.match(cu) || []) : t3.match(e3) || [];
      }
      var vi = a2(function(t3, e3) {
        try {
          return aa(t3, Wi, e3);
        } catch (t4) {
          return xo(t4) ? t4 : new k(t4);
        }
      }), gi = Vn(function(e3, t3) {
        return ua(t3, function(t4) {
          t4 = br(t4), Jt(e3, t4, ao(e3[t4], e3));
        }), e3;
      });
      function _i(t3) {
        return function() {
          return t3;
        };
      }
      var yi = Bn(), wi = Bn(true);
      function O(t3) {
        return t3;
      }
      function mi(t3) {
        return Te(typeof t3 == "function" ? t3 : m2(t3, 1));
      }
      var xi = a2(function(e3, n3) {
        return function(t3) {
          return me(t3, e3, n3);
        };
      }), bi = a2(function(e3, n3) {
        return function(t3) {
          return me(e3, t3, n3);
        };
      });
      function Ci(r3, e3, t3) {
        var n3 = S2(e3), o3 = pe(e3, n3), i3 = (t3 != null || T2(e3) && (o3.length || !n3.length) || (t3 = e3, e3 = r3, r3 = this, o3 = pe(e3, S2(e3))), !(T2(t3) && "chain" in t3 && !t3.chain)), a3 = bo(r3);
        return ua(o3, function(t4) {
          var n4 = e3[t4];
          r3[t4] = n4, a3 && (r3.prototype[t4] = function() {
            var t5, e4 = this.__chain__;
            return i3 || e4 ? (((t5 = r3(this.__wrapped__)).__actions__ = I2(this.__actions__)).push({ func: n4, args: arguments, thisArg: r3 }), t5.__chain__ = e4, t5) : n4.apply(r3, la([this.value()], arguments));
          });
        }), r3;
      }
      function Ii() {
      }
      var Ti = Ln(fa), Bi = Ln(Xu), Di = Ln(Fu);
      function Ri(t3) {
        return ir(t3) ? Gu(br(t3)) : (e3 = t3, function(t4) {
          return he(t4, e3);
        });
        var e3;
      }
      var Si = En(), Li = En(true);
      function Oi() {
        return [];
      }
      function ki() {
        return false;
      }
      var Ei = Sn(function(t3, e3) {
        return t3 + e3;
      }, 0), Ai = zn("ceil"), Yi = Sn(function(t3, e3) {
        return t3 / e3;
      }, 1), zi = zn("floor");
      var ji, Xi = Sn(function(t3, e3) {
        return t3 * e3;
      }, 1), Pi = zn("round"), Mi = Sn(function(t3, e3) {
        return t3 - e3;
      }, 0);
      return h2.after = function(t3, e3) {
        if (typeof e3 != "function")
          throw new y2(Ui);
        return t3 = D2(t3), function() {
          if (--t3 < 1)
            return e3.apply(this, arguments);
        };
      }, h2.ary = oo, h2.assign = Xo, h2.assignIn = Po, h2.assignInWith = Mo, h2.assignWith = Wo, h2.at = Uo, h2.before = io, h2.bind = ao, h2.bindAll = gi, h2.bindKey = uo, h2.castArray = function() {
        if (!arguments.length)
          return [];
        var t3 = arguments[0];
        return M(t3) ? t3 : [t3];
      }, h2.chain = Fr, h2.chunk = function(t3, e3, n3) {
        e3 = (n3 ? d2(t3, e3, n3) : e3 === Wi) ? 1 : w2(D2(e3), 0);
        var r3 = t3 == null ? 0 : t3.length;
        if (!r3 || e3 < 1)
          return [];
        for (var o3 = 0, i3 = 0, a3 = b2(pt(r3 / e3)); o3 < r3; )
          a3[i3++] = u2(t3, o3, o3 += e3);
        return a3;
      }, h2.compact = function(t3) {
        for (var e3 = -1, n3 = t3 == null ? 0 : t3.length, r3 = 0, o3 = []; ++e3 < n3; ) {
          var i3 = t3[e3];
          i3 && (o3[r3++] = i3);
        }
        return o3;
      }, h2.concat = function() {
        var t3 = arguments.length;
        if (!t3)
          return [];
        for (var e3 = b2(t3 - 1), n3 = arguments[0], r3 = t3; r3--; )
          e3[r3 - 1] = arguments[r3];
        return la(M(n3) ? I2(n3) : [n3], c2(e3, 1));
      }, h2.cond = function(r3) {
        var o3 = r3 == null ? 0 : r3.length, e3 = s2();
        return r3 = o3 ? fa(r3, function(t3) {
          if (typeof t3[1] != "function")
            throw new y2(Ui);
          return [e3(t3[0]), t3[1]];
        }) : [], a2(function(t3) {
          for (var e4 = -1; ++e4 < o3; ) {
            var n3 = r3[e4];
            if (aa(n3[0], this, t3))
              return aa(n3[1], this, t3);
          }
        });
      }, h2.conforms = function(t3) {
        return e3 = m2(t3, 1), n3 = S2(e3), function(t4) {
          return ee(t4, e3, n3);
        };
        var e3, n3;
      }, h2.constant = _i, h2.countBy = Hr, h2.create = function(t3, e3) {
        return t3 = zt(t3), e3 == null ? t3 : Zt(t3, e3);
      }, h2.curry = function t3(e3, n3, r3) {
        e3 = Pn(e3, 8, Wi, Wi, Wi, Wi, Wi, n3 = r3 ? Wi : n3);
        return e3.placeholder = t3.placeholder, e3;
      }, h2.curryRight = function t3(e3, n3, r3) {
        e3 = Pn(e3, ma, Wi, Wi, Wi, Wi, Wi, n3 = r3 ? Wi : n3);
        return e3.placeholder = t3.placeholder, e3;
      }, h2.debounce = co, h2.defaults = Fo, h2.defaultsDeep = Vo, h2.defer = st, h2.delay = fo, h2.difference = i2, h2.differenceBy = It, h2.differenceWith = t2, h2.drop = function(t3, e3, n3) {
        var r3 = t3 == null ? 0 : t3.length;
        return r3 ? u2(t3, (e3 = n3 || e3 === Wi ? 1 : D2(e3)) < 0 ? 0 : e3, r3) : [];
      }, h2.dropRight = function(t3, e3, n3) {
        var r3 = t3 == null ? 0 : t3.length;
        return r3 ? u2(t3, 0, (e3 = r3 - (e3 = n3 || e3 === Wi ? 1 : D2(e3))) < 0 ? 0 : e3) : [];
      }, h2.dropRightWhile = function(t3, e3) {
        return t3 && t3.length ? Qe(t3, s2(e3, 3), true, true) : [];
      }, h2.dropWhile = function(t3, e3) {
        return t3 && t3.length ? Qe(t3, s2(e3, 3), true) : [];
      }, h2.fill = function(t3, e3, n3, r3) {
        if (!(c3 = t3 == null ? 0 : t3.length))
          return [];
        n3 && typeof n3 != "number" && d2(t3, e3, n3) && (n3 = 0, r3 = c3);
        var o3 = t3, i3 = e3, a3 = n3, u3 = r3, c3 = o3.length;
        for ((a3 = D2(a3)) < 0 && (a3 = c3 < -a3 ? 0 : c3 + a3), (u3 = u3 === Wi || c3 < u3 ? c3 : D2(u3)) < 0 && (u3 += c3), u3 = u3 < a3 ? 0 : zo(u3); a3 < u3; )
          o3[a3++] = i3;
        return o3;
      }, h2.filter = function(t3, e3) {
        return (M(t3) ? ca : ce)(t3, s2(e3, 3));
      }, h2.flatMap = function(t3, e3) {
        return c2(to(t3, e3), 1);
      }, h2.flatMapDeep = function(t3, e3) {
        return c2(to(t3, e3), Hi);
      }, h2.flatMapDepth = function(t3, e3, n3) {
        return n3 = n3 === Wi ? 1 : D2(n3), c2(to(t3, e3), n3);
      }, h2.flatten = Dr, h2.flattenDeep = function(t3) {
        return (t3 == null ? 0 : t3.length) ? c2(t3, Hi) : [];
      }, h2.flattenDepth = function(t3, e3) {
        return (t3 == null ? 0 : t3.length) ? c2(t3, e3 = e3 === Wi ? 1 : D2(e3)) : [];
      }, h2.flip = function(t3) {
        return Pn(t3, 512);
      }, h2.flow = yi, h2.flowRight = wi, h2.fromPairs = function(t3) {
        for (var e3 = -1, n3 = t3 == null ? 0 : t3.length, r3 = {}; ++e3 < n3; ) {
          var o3 = t3[e3];
          r3[o3[0]] = o3[1];
        }
        return r3;
      }, h2.functions = function(t3) {
        return t3 == null ? [] : pe(t3, S2(t3));
      }, h2.functionsIn = function(t3) {
        return t3 == null ? [] : pe(t3, L2(t3));
      }, h2.groupBy = Zr, h2.initial = function(t3) {
        return (t3 == null ? 0 : t3.length) ? u2(t3, 0, -1) : [];
      }, h2.intersection = H, h2.intersectionBy = dt, h2.intersectionWith = e2, h2.invert = $o, h2.invertBy = qo, h2.invokeMap = Jr, h2.iteratee = mi, h2.keyBy = Qr, h2.keys = S2, h2.keysIn = L2, h2.map = to, h2.mapKeys = function(t3, r3) {
        var o3 = {};
        return r3 = s2(r3, 3), se(t3, function(t4, e3, n3) {
          Jt(o3, r3(t4, e3, n3), t4);
        }), o3;
      }, h2.mapValues = function(t3, r3) {
        var o3 = {};
        return r3 = s2(r3, 3), se(t3, function(t4, e3, n3) {
          Jt(o3, e3, r3(t4, e3, n3));
        }), o3;
      }, h2.matches = function(t3) {
        return Le(m2(t3, 1));
      }, h2.matchesProperty = function(t3, e3) {
        return Oe(t3, m2(e3, 1));
      }, h2.memoize = lo, h2.merge = Ko, h2.mergeWith = Zo, h2.method = xi, h2.methodOf = bi, h2.mixin = Ci, h2.negate = so, h2.nthArg = function(e3) {
        return e3 = D2(e3), a2(function(t3) {
          return Ee(t3, e3);
        });
      }, h2.omit = Jo, h2.omitBy = function(t3, e3) {
        return ti(t3, so(s2(e3)));
      }, h2.once = function(t3) {
        return io(2, t3);
      }, h2.orderBy = function(t3, e3, n3, r3) {
        return t3 == null ? [] : Ae(t3, e3 = M(e3) ? e3 : e3 == null ? [] : [e3], n3 = M(n3 = r3 ? Wi : n3) ? n3 : n3 == null ? [] : [n3]);
      }, h2.over = Ti, h2.overArgs = un, h2.overEvery = Bi, h2.overSome = Di, h2.partial = po, h2.partialRight = ho, h2.partition = eo, h2.pick = Qo, h2.pickBy = ti, h2.property = Ri, h2.propertyOf = function(e3) {
        return function(t3) {
          return e3 == null ? Wi : he(e3, t3);
        };
      }, h2.pull = lt, h2.pullAll = Sr, h2.pullAllBy = function(t3, e3, n3) {
        return t3 && t3.length && e3 && e3.length ? ze(t3, e3, s2(n3, 2)) : t3;
      }, h2.pullAllWith = function(t3, e3, n3) {
        return t3 && t3.length && e3 && e3.length ? ze(t3, e3, Wi, n3) : t3;
      }, h2.pullAt = Lr, h2.range = Si, h2.rangeRight = Li, h2.rearg = vo, h2.reject = function(t3, e3) {
        return (M(t3) ? ca : ce)(t3, so(s2(e3, 3)));
      }, h2.remove = function(t3, e3) {
        var n3 = [];
        if (!t3 || !t3.length)
          return n3;
        var r3 = -1, o3 = [], i3 = t3.length;
        for (e3 = s2(e3, 3); ++r3 < i3; ) {
          var a3 = t3[r3];
          e3(a3, r3, t3) && (n3.push(a3), o3.push(r3));
        }
        return je(t3, o3), n3;
      }, h2.rest = function(t3, e3) {
        if (typeof t3 != "function")
          throw new y2(Ui);
        return a2(t3, e3 = e3 === Wi ? e3 : D2(e3));
      }, h2.reverse = Or, h2.sampleSize = function(t3, e3, n3) {
        return e3 = (n3 ? d2(t3, e3, n3) : e3 === Wi) ? 1 : D2(e3), (M(t3) ? Nt : We)(t3, e3);
      }, h2.set = function(t3, e3, n3) {
        return t3 == null ? t3 : Ue(t3, e3, n3);
      }, h2.setWith = function(t3, e3, n3, r3) {
        return r3 = typeof r3 == "function" ? r3 : Wi, t3 == null ? t3 : Ue(t3, e3, n3, r3);
      }, h2.shuffle = function(t3) {
        return (M(t3) ? Ht : Ve)(t3);
      }, h2.slice = function(t3, e3, n3) {
        var r3 = t3 == null ? 0 : t3.length;
        return r3 ? (n3 = n3 && typeof n3 != "number" && d2(t3, e3, n3) ? (e3 = 0, r3) : (e3 = e3 == null ? 0 : D2(e3), n3 === Wi ? r3 : D2(n3)), u2(t3, e3, n3)) : [];
      }, h2.sortBy = no, h2.sortedUniq = function(t3) {
        return t3 && t3.length ? qe(t3) : [];
      }, h2.sortedUniqBy = function(t3, e3) {
        return t3 && t3.length ? qe(t3, s2(e3, 2)) : [];
      }, h2.split = function(t3, e3, n3) {
        return n3 && typeof n3 != "number" && d2(t3, e3, n3) && (e3 = n3 = Wi), (n3 = n3 === Wi ? qi : n3 >>> 0) ? (t3 = p2(t3)) && (typeof e3 == "string" || e3 != null && !Ro(e3)) && !(e3 = f2(e3)) && pa(t3) ? cn(ga(t3), 0, n3) : t3.split(e3, n3) : [];
      }, h2.spread = function(n3, r3) {
        if (typeof n3 != "function")
          throw new y2(Ui);
        return r3 = r3 == null ? 0 : w2(D2(r3), 0), a2(function(t3) {
          var e3 = t3[r3], t3 = cn(t3, 0, r3);
          return e3 && la(t3, e3), aa(n3, this, t3);
        });
      }, h2.tail = function(t3) {
        var e3 = t3 == null ? 0 : t3.length;
        return e3 ? u2(t3, 1, e3) : [];
      }, h2.take = function(t3, e3, n3) {
        return t3 && t3.length ? u2(t3, 0, (e3 = n3 || e3 === Wi ? 1 : D2(e3)) < 0 ? 0 : e3) : [];
      }, h2.takeRight = function(t3, e3, n3) {
        var r3 = t3 == null ? 0 : t3.length;
        return r3 ? u2(t3, (e3 = r3 - (e3 = n3 || e3 === Wi ? 1 : D2(e3))) < 0 ? 0 : e3, r3) : [];
      }, h2.takeRightWhile = function(t3, e3) {
        return t3 && t3.length ? Qe(t3, s2(e3, 3), false, true) : [];
      }, h2.takeWhile = function(t3, e3) {
        return t3 && t3.length ? Qe(t3, s2(e3, 3)) : [];
      }, h2.tap = function(t3, e3) {
        return e3(t3), t3;
      }, h2.throttle = function(t3, e3, n3) {
        var r3 = true, o3 = true;
        if (typeof t3 != "function")
          throw new y2(Ui);
        return T2(n3) && (r3 = "leading" in n3 ? !!n3.leading : r3, o3 = "trailing" in n3 ? !!n3.trailing : o3), co(t3, e3, { leading: r3, maxWait: e3, trailing: o3 });
      }, h2.thru = Vr, h2.toArray = Ao, h2.toPairs = ei, h2.toPairsIn = ni, h2.toPath = function(t3) {
        return M(t3) ? fa(t3, br) : B2(t3) ? [t3] : I2(xr(p2(t3)));
      }, h2.toPlainObject = jo, h2.transform = function(t3, r3, o3) {
        var e3, n3 = M(t3), i3 = n3 || mo(t3) || Oo(t3);
        return r3 = s2(r3, 4), o3 == null && (e3 = t3 && t3.constructor, o3 = i3 ? n3 ? new e3() : [] : T2(t3) && bo(e3) ? zt(nt(t3)) : {}), (i3 ? ua : se)(t3, function(t4, e4, n4) {
          return r3(o3, t4, e4, n4);
        }), o3;
      }, h2.unary = function(t3) {
        return oo(t3, 1);
      }, h2.union = kr, h2.unionBy = Er, h2.unionWith = Ar, h2.uniq = function(t3) {
        return t3 && t3.length ? Ke(t3) : [];
      }, h2.uniqBy = function(t3, e3) {
        return t3 && t3.length ? Ke(t3, s2(e3, 2)) : [];
      }, h2.uniqWith = function(t3, e3) {
        return e3 = typeof e3 == "function" ? e3 : Wi, t3 && t3.length ? Ke(t3, Wi, e3) : [];
      }, h2.unset = function(t3, e3) {
        return t3 == null || Ze(t3, e3);
      }, h2.unzip = Yr, h2.unzipWith = zr, h2.update = function(t3, e3, n3) {
        return t3 == null ? t3 : Je(t3, e3, on(n3));
      }, h2.updateWith = function(t3, e3, n3, r3) {
        return r3 = typeof r3 == "function" ? r3 : Wi, t3 == null ? t3 : Je(t3, e3, on(n3), r3);
      }, h2.values = ri, h2.valuesIn = function(t3) {
        return t3 == null ? [] : tc(t3, L2(t3));
      }, h2.without = jr, h2.words = hi, h2.wrap = function(t3, e3) {
        return po(on(e3), t3);
      }, h2.xor = Xr, h2.xorBy = Pr, h2.xorWith = Mr, h2.zip = Wr, h2.zipObject = function(t3, e3) {
        return nn(t3 || [], e3 || [], qt);
      }, h2.zipObjectDeep = function(t3, e3) {
        return nn(t3 || [], e3 || [], Ue);
      }, h2.zipWith = Ur, h2.entries = ei, h2.entriesIn = ni, h2.extend = Po, h2.extendWith = Mo, Ci(h2, h2), h2.add = Ei, h2.attempt = vi, h2.camelCase = oi, h2.capitalize = ii, h2.ceil = Ai, h2.clamp = function(t3, e3, n3) {
        return n3 === Wi && (n3 = e3, e3 = Wi), n3 !== Wi && (n3 = (n3 = R2(n3)) == n3 ? n3 : 0), e3 !== Wi && (e3 = (e3 = R2(e3)) == e3 ? e3 : 0), te(R2(t3), e3, n3);
      }, h2.clone = function(t3) {
        return m2(t3, 4);
      }, h2.cloneDeep = function(t3) {
        return m2(t3, 5);
      }, h2.cloneDeepWith = function(t3, e3) {
        return m2(t3, 5, e3 = typeof e3 == "function" ? e3 : Wi);
      }, h2.cloneWith = function(t3, e3) {
        return m2(t3, 4, e3 = typeof e3 == "function" ? e3 : Wi);
      }, h2.conformsTo = function(t3, e3) {
        return e3 == null || ee(t3, e3, S2(e3));
      }, h2.deburr = ai, h2.defaultTo = function(t3, e3) {
        return t3 == null || t3 != t3 ? e3 : t3;
      }, h2.divide = Yi, h2.endsWith = function(t3, e3, n3) {
        t3 = p2(t3), e3 = f2(e3);
        var r3 = t3.length, r3 = n3 = n3 === Wi ? r3 : te(D2(n3), 0, r3);
        return 0 <= (n3 -= e3.length) && t3.slice(n3, r3) == e3;
      }, h2.eq = P, h2.escape = function(t3) {
        return (t3 = p2(t3)) && Ga.test(t3) ? t3.replace($a, ic) : t3;
      }, h2.escapeRegExp = function(t3) {
        return (t3 = p2(t3)) && ru.test(t3) ? t3.replace(nu, "\\$&") : t3;
      }, h2.every = function(t3, e3, n3) {
        return (M(t3) ? Xu : ae)(t3, s2(e3 = n3 && d2(t3, e3, n3) ? Wi : e3, 3));
      }, h2.find = $r, h2.findIndex = Tr, h2.findKey = function(t3, e3) {
        return Vu(t3, s2(e3, 3), se);
      }, h2.findLast = qr, h2.findLastIndex = Br, h2.findLastKey = function(t3, e3) {
        return Vu(t3, s2(e3, 3), de);
      }, h2.floor = zi, h2.forEach = Gr, h2.forEachRight = Kr, h2.forIn = function(t3, e3) {
        return t3 == null ? t3 : fe(t3, s2(e3, 3), L2);
      }, h2.forInRight = function(t3, e3) {
        return t3 == null ? t3 : le(t3, s2(e3, 3), L2);
      }, h2.forOwn = function(t3, e3) {
        return t3 && se(t3, s2(e3, 3));
      }, h2.forOwnRight = function(t3, e3) {
        return t3 && de(t3, s2(e3, 3));
      }, h2.get = No, h2.gt = go, h2.gte = _o, h2.has = function(t3, e3) {
        return t3 != null && er(t3, e3, _e);
      }, h2.hasIn = Ho, h2.head = Rr, h2.identity = O, h2.includes = function(t3, e3, n3, r3) {
        return t3 = l2(t3) ? t3 : ri(t3), n3 = n3 && !r3 ? D2(n3) : 0, r3 = t3.length, n3 < 0 && (n3 = w2(r3 + n3, 0)), Lo(t3) ? n3 <= r3 && -1 < t3.indexOf(e3, n3) : !!r3 && -1 < sa(t3, e3, n3);
      }, h2.indexOf = function(t3, e3, n3) {
        var r3 = t3 == null ? 0 : t3.length;
        return r3 ? (n3 = n3 == null ? 0 : D2(n3), sa(t3, e3, n3 = n3 < 0 ? w2(r3 + n3, 0) : n3)) : -1;
      }, h2.inRange = function(t3, e3, n3) {
        return e3 = Yo(e3), n3 === Wi ? (n3 = e3, e3 = 0) : n3 = Yo(n3), (t3 = t3 = R2(t3)) >= C2(e3 = e3, n3 = n3) && t3 < w2(e3, n3);
      }, h2.invoke = Go, h2.isArguments = yo, h2.isArray = M, h2.isArrayBuffer = wo, h2.isArrayLike = l2, h2.isArrayLikeObject = x2, h2.isBoolean = function(t3) {
        return t3 === true || t3 === false || W(t3) && n2(t3) == Ki;
      }, h2.isBuffer = mo, h2.isDate = V, h2.isElement = function(t3) {
        return W(t3) && t3.nodeType === 1 && !Do(t3);
      }, h2.isEmpty = function(t3) {
        if (t3 == null)
          return true;
        if (l2(t3) && (M(t3) || typeof t3 == "string" || typeof t3.splice == "function" || mo(t3) || Oo(t3) || yo(t3)))
          return !t3.length;
        var e3, n3 = X(t3);
        if (n3 == Ji || n3 == ea)
          return !t3.size;
        if (cr(t3))
          return !Be(t3).length;
        for (e3 in t3)
          if (z.call(t3, e3))
            return false;
        return true;
      }, h2.isEqual = function(t3, e3) {
        return be(t3, e3);
      }, h2.isEqualWith = function(t3, e3, n3) {
        var r3 = (n3 = typeof n3 == "function" ? n3 : Wi) ? n3(t3, e3) : Wi;
        return r3 === Wi ? be(t3, e3, Wi, n3) : !!r3;
      }, h2.isError = xo, h2.isFinite = function(t3) {
        return typeof t3 == "number" && gt(t3);
      }, h2.isFunction = bo, h2.isInteger = Co, h2.isLength = Io, h2.isMap = To, h2.isMatch = function(t3, e3) {
        return t3 === e3 || Ce(t3, e3, Zn(e3));
      }, h2.isMatchWith = function(t3, e3, n3) {
        return n3 = typeof n3 == "function" ? n3 : Wi, Ce(t3, e3, Zn(e3), n3);
      }, h2.isNaN = function(t3) {
        return Bo(t3) && t3 != +t3;
      }, h2.isNative = function(t3) {
        if (ur(t3))
          throw new k("Unsupported core-js use. Try https://npms.io/search?q=ponyfill.");
        return Ie(t3);
      }, h2.isNil = function(t3) {
        return t3 == null;
      }, h2.isNull = function(t3) {
        return t3 === null;
      }, h2.isNumber = Bo, h2.isObject = T2, h2.isObjectLike = W, h2.isPlainObject = Do, h2.isRegExp = Ro, h2.isSafeInteger = function(t3) {
        return Co(t3) && -$i <= t3 && t3 <= $i;
      }, h2.isSet = So, h2.isString = Lo, h2.isSymbol = B2, h2.isTypedArray = Oo, h2.isUndefined = function(t3) {
        return t3 === Wi;
      }, h2.isWeakMap = function(t3) {
        return W(t3) && X(t3) == ka;
      }, h2.isWeakSet = function(t3) {
        return W(t3) && n2(t3) == "[object WeakSet]";
      }, h2.join = function(t3, e3) {
        return t3 == null ? "" : _t.call(t3, e3);
      }, h2.kebabCase = ui, h2.last = r2, h2.lastIndexOf = function(t3, e3, n3) {
        var r3 = t3 == null ? 0 : t3.length;
        if (!r3)
          return -1;
        var o3 = r3;
        if (n3 !== Wi && (o3 = (o3 = D2(n3)) < 0 ? w2(r3 + o3, 0) : C2(o3, r3 - 1)), e3 != e3)
          return Nu(t3, $u, o3, true);
        for (var i3 = t3, a3 = e3, u3 = o3 + 1; u3--; )
          if (i3[u3] === a3)
            return u3;
        return u3;
      }, h2.lowerCase = ci, h2.lowerFirst = fi, h2.lt = ko, h2.lte = Eo, h2.max = function(t3) {
        return t3 && t3.length ? ue(t3, O, ge) : Wi;
      }, h2.maxBy = function(t3, e3) {
        return t3 && t3.length ? ue(t3, s2(e3, 2), ge) : Wi;
      }, h2.mean = function(t3) {
        return qu(t3, O);
      }, h2.meanBy = function(t3, e3) {
        return qu(t3, s2(e3, 2));
      }, h2.min = function(t3) {
        return t3 && t3.length ? ue(t3, O, Re) : Wi;
      }, h2.minBy = function(t3, e3) {
        return t3 && t3.length ? ue(t3, s2(e3, 2), Re) : Wi;
      }, h2.stubArray = Oi, h2.stubFalse = ki, h2.stubObject = function() {
        return {};
      }, h2.stubString = function() {
        return "";
      }, h2.stubTrue = function() {
        return true;
      }, h2.multiply = Xi, h2.nth = function(t3, e3) {
        return t3 && t3.length ? Ee(t3, D2(e3)) : Wi;
      }, h2.noConflict = function() {
        return ia._ === this && (ia._ = J), this;
      }, h2.noop = Ii, h2.now = ro, h2.pad = function(t3, e3, n3) {
        t3 = p2(t3);
        var r3 = (e3 = D2(e3)) ? va(t3) : 0;
        return !e3 || e3 <= r3 ? t3 : On(ht(e3 = (e3 - r3) / 2), n3) + t3 + On(pt(e3), n3);
      }, h2.padEnd = function(t3, e3, n3) {
        t3 = p2(t3);
        var r3 = (e3 = D2(e3)) ? va(t3) : 0;
        return e3 && r3 < e3 ? t3 + On(e3 - r3, n3) : t3;
      }, h2.padStart = function(t3, e3, n3) {
        t3 = p2(t3);
        var r3 = (e3 = D2(e3)) ? va(t3) : 0;
        return e3 && r3 < e3 ? On(e3 - r3, n3) + t3 : t3;
      }, h2.parseInt = function(t3, e3, n3) {
        return e3 = n3 || e3 == null ? 0 : e3 && +e3, mt(p2(t3).replace(ou, ""), e3 || 0);
      }, h2.random = function(t3, e3, n3) {
        var r3;
        return n3 && typeof n3 != "boolean" && d2(t3, e3, n3) && (e3 = n3 = Wi), n3 === Wi && (typeof e3 == "boolean" ? (n3 = e3, e3 = Wi) : typeof t3 == "boolean" && (n3 = t3, t3 = Wi)), t3 === Wi && e3 === Wi ? (t3 = 0, e3 = 1) : (t3 = Yo(t3), e3 === Wi ? (e3 = t3, t3 = 0) : e3 = Yo(e3)), e3 < t3 && (r3 = t3, t3 = e3, e3 = r3), n3 || t3 % 1 || e3 % 1 ? (r3 = xt(), C2(t3 + r3 * (e3 - t3 + Du("1e-" + ((r3 + "").length - 1))), e3)) : Xe(t3, e3);
      }, h2.reduce = function(t3, e3, n3) {
        var r3 = M(t3) ? Wu : Ku, o3 = arguments.length < 3;
        return r3(t3, s2(e3, 4), n3, o3, oe);
      }, h2.reduceRight = function(t3, e3, n3) {
        var r3 = M(t3) ? Uu : Ku, o3 = arguments.length < 3;
        return r3(t3, s2(e3, 4), n3, o3, ie);
      }, h2.repeat = function(t3, e3, n3) {
        return e3 = (n3 ? d2(t3, e3, n3) : e3 === Wi) ? 1 : D2(e3), Pe(p2(t3), e3);
      }, h2.replace = function() {
        var t3 = arguments, e3 = p2(t3[0]);
        return t3.length < 3 ? e3 : e3.replace(t3[1], t3[2]);
      }, h2.result = function(t3, e3, n3) {
        var r3 = -1, o3 = (e3 = an(e3, t3)).length;
        for (o3 || (o3 = 1, t3 = Wi); ++r3 < o3; ) {
          var i3 = t3 == null ? Wi : t3[br(e3[r3])];
          i3 === Wi && (r3 = o3, i3 = n3), t3 = bo(i3) ? i3.call(t3) : i3;
        }
        return t3;
      }, h2.round = Pi, h2.runInContext = o2, h2.sample = function(t3) {
        return (M(t3) ? Vt : Me)(t3);
      }, h2.size = function(t3) {
        if (t3 == null)
          return 0;
        if (l2(t3))
          return Lo(t3) ? va(t3) : t3.length;
        var e3 = X(t3);
        return e3 == Ji || e3 == ea ? t3.size : Be(t3).length;
      }, h2.snakeCase = li, h2.some = function(t3, e3, n3) {
        return (M(t3) ? Fu : Ne)(t3, s2(e3 = n3 && d2(t3, e3, n3) ? Wi : e3, 3));
      }, h2.sortedIndex = function(t3, e3) {
        return He(t3, e3);
      }, h2.sortedIndexBy = function(t3, e3, n3) {
        return $e(t3, e3, s2(n3, 2));
      }, h2.sortedIndexOf = function(t3, e3) {
        var n3 = t3 == null ? 0 : t3.length;
        if (n3) {
          var r3 = He(t3, e3);
          if (r3 < n3 && P(t3[r3], e3))
            return r3;
        }
        return -1;
      }, h2.sortedLastIndex = function(t3, e3) {
        return He(t3, e3, true);
      }, h2.sortedLastIndexBy = function(t3, e3, n3) {
        return $e(t3, e3, s2(n3, 2), true);
      }, h2.sortedLastIndexOf = function(t3, e3) {
        if (t3 == null ? 0 : t3.length) {
          var n3 = He(t3, e3, true) - 1;
          if (P(t3[n3], e3))
            return n3;
        }
        return -1;
      }, h2.startCase = si, h2.startsWith = function(t3, e3, n3) {
        return t3 = p2(t3), n3 = n3 == null ? 0 : te(D2(n3), 0, t3.length), e3 = f2(e3), t3.slice(n3, n3 + e3.length) == e3;
      }, h2.subtract = Mi, h2.sum = function(t3) {
        return t3 && t3.length ? Zu(t3, O) : 0;
      }, h2.sumBy = function(t3, e3) {
        return t3 && t3.length ? Zu(t3, s2(e3, 2)) : 0;
      }, h2.template = function(a3, t3, e3) {
        var u3, c3, n3 = h2.templateSettings;
        e3 && d2(a3, t3, e3) && (t3 = Wi), a3 = p2(a3), t3 = Mo({}, t3, n3, Mn);
        var r3 = S2(e3 = Mo({}, t3.imports, n3.imports, Mn)), o3 = tc(e3, r3), f3 = 0, n3 = t3.interpolate || wu, l3 = "__p += '", e3 = Y((t3.escape || wu).source + "|" + n3.source + "|" + (n3 === Ja ? su : wu).source + "|" + (t3.evaluate || wu).source + "|$", "g"), i3 = "//# sourceURL=" + (z.call(t3, "sourceURL") ? (t3.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++Bu + "]") + "\n";
        if (a3.replace(e3, function(t4, e4, n4, r4, o4, i4) {
          return n4 = n4 || r4, l3 += a3.slice(f3, i4).replace(mu, ac), e4 && (u3 = true, l3 += "' +\n__e(" + e4 + ") +\n'"), o4 && (c3 = true, l3 += "';\n" + o4 + ";\n__p += '"), n4 && (l3 += "' +\n((__t = (" + n4 + ")) == null ? '' : __t) +\n'"), f3 = i4 + t4.length, t4;
        }), l3 += "';\n", n3 = z.call(t3, "variable") && t3.variable) {
          if (fu.test(n3))
            throw new k("Invalid `variable` option passed into `_.template`");
        } else
          l3 = "with (obj) {\n" + l3 + "\n}\n";
        if (l3 = (c3 ? l3.replace(Fa, "") : l3).replace(Va, "$1").replace(Na, "$1;"), l3 = "function(" + (n3 || "obj") + ") {\n" + (n3 ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (u3 ? ", __e = _.escape" : "") + (c3 ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + l3 + "return __p\n}", (e3 = vi(function() {
          return E(r3, i3 + "return " + l3).apply(Wi, o3);
        })).source = l3, xo(e3))
          throw e3;
        return e3;
      }, h2.times = function(t3, e3) {
        if ((t3 = D2(t3)) < 1 || $i < t3)
          return [];
        for (var n3 = qi, r3 = C2(t3, qi), r3 = (e3 = s2(e3), t3 -= qi, Ju(r3, e3)); ++n3 < t3; )
          e3(n3);
        return r3;
      }, h2.toFinite = Yo, h2.toInteger = D2, h2.toLength = zo, h2.toLower = function(t3) {
        return p2(t3).toLowerCase();
      }, h2.toNumber = R2, h2.toSafeInteger = function(t3) {
        return t3 ? te(D2(t3), -$i, $i) : t3 === 0 ? t3 : 0;
      }, h2.toString = p2, h2.toUpper = function(t3) {
        return p2(t3).toUpperCase();
      }, h2.trim = function(t3, e3, n3) {
        return (t3 = p2(t3)) && (n3 || e3 === Wi) ? Qu(t3) : t3 && (e3 = f2(e3)) ? (n3 = ga(t3), t3 = ga(e3), cn(n3, nc(n3, t3), rc(n3, t3) + 1).join("")) : t3;
      }, h2.trimEnd = function(t3, e3, n3) {
        return (t3 = p2(t3)) && (n3 || e3 === Wi) ? t3.slice(0, lc(t3) + 1) : t3 && (e3 = f2(e3)) ? cn(n3 = ga(t3), 0, rc(n3, ga(e3)) + 1).join("") : t3;
      }, h2.trimStart = function(t3, e3, n3) {
        return (t3 = p2(t3)) && (n3 || e3 === Wi) ? t3.replace(ou, "") : t3 && (e3 = f2(e3)) ? cn(n3 = ga(t3), nc(n3, ga(e3))).join("") : t3;
      }, h2.truncate = function(t3, e3) {
        var n3, r3 = 30, o3 = "...", e3 = (T2(e3) && (n3 = "separator" in e3 ? e3.separator : n3, r3 = "length" in e3 ? D2(e3.length) : r3, o3 = "omission" in e3 ? f2(e3.omission) : o3), (t3 = p2(t3)).length);
        if ((e3 = pa(t3) ? (i3 = ga(t3)).length : e3) <= r3)
          return t3;
        if ((e3 = r3 - va(o3)) < 1)
          return o3;
        var i3, r3 = i3 ? cn(i3, 0, e3).join("") : t3.slice(0, e3);
        if (n3 === Wi)
          return r3 + o3;
        if (i3 && (e3 += r3.length - e3), Ro(n3)) {
          if (t3.slice(e3).search(n3)) {
            var a3, u3 = r3;
            for ((n3 = n3.global ? n3 : Y(n3.source, p2(du.exec(n3)) + "g")).lastIndex = 0; a3 = n3.exec(u3); )
              var c3 = a3.index;
            r3 = r3.slice(0, c3 === Wi ? e3 : c3);
          }
        } else
          t3.indexOf(f2(n3), e3) == e3 || -1 < (i3 = r3.lastIndexOf(n3)) && (r3 = r3.slice(0, i3));
        return r3 + o3;
      }, h2.unescape = function(t3) {
        return (t3 = p2(t3)) && qa.test(t3) ? t3.replace(Ha, sc) : t3;
      }, h2.uniqueId = function(t3) {
        var e3 = ++q;
        return p2(t3) + e3;
      }, h2.upperCase = di, h2.upperFirst = pi, h2.each = Gr, h2.eachRight = Kr, h2.first = Rr, Ci(h2, (ji = {}, se(h2, function(t3, e3) {
        z.call(h2.prototype, e3) || (ji[e3] = t3);
      }), ji), { chain: false }), h2.VERSION = "4.17.21", ua(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(t3) {
        h2[t3].placeholder = h2;
      }), ua(["drop", "take"], function(n3, r3) {
        _2.prototype[n3] = function(t3) {
          t3 = t3 === Wi ? 1 : w2(D2(t3), 0);
          var e3 = this.__filtered__ && !r3 ? new _2(this) : this.clone();
          return e3.__filtered__ ? e3.__takeCount__ = C2(t3, e3.__takeCount__) : e3.__views__.push({ size: C2(t3, qi), type: n3 + (e3.__dir__ < 0 ? "Right" : "") }), e3;
        }, _2.prototype[n3 + "Right"] = function(t3) {
          return this.reverse()[n3](t3).reverse();
        };
      }), ua(["filter", "map", "takeWhile"], function(t3, e3) {
        var n3 = e3 + 1, r3 = n3 == 1 || n3 == 3;
        _2.prototype[t3] = function(t4) {
          var e4 = this.clone();
          return e4.__iteratees__.push({ iteratee: s2(t4, 3), type: n3 }), e4.__filtered__ = e4.__filtered__ || r3, e4;
        };
      }), ua(["head", "last"], function(t3, e3) {
        var n3 = "take" + (e3 ? "Right" : "");
        _2.prototype[t3] = function() {
          return this[n3](1).value()[0];
        };
      }), ua(["initial", "tail"], function(t3, e3) {
        var n3 = "drop" + (e3 ? "" : "Right");
        _2.prototype[t3] = function() {
          return this.__filtered__ ? new _2(this) : this[n3](1);
        };
      }), _2.prototype.compact = function() {
        return this.filter(O);
      }, _2.prototype.find = function(t3) {
        return this.filter(t3).head();
      }, _2.prototype.findLast = function(t3) {
        return this.reverse().find(t3);
      }, _2.prototype.invokeMap = a2(function(e3, n3) {
        return typeof e3 == "function" ? new _2(this) : this.map(function(t3) {
          return me(t3, e3, n3);
        });
      }), _2.prototype.reject = function(t3) {
        return this.filter(so(s2(t3)));
      }, _2.prototype.slice = function(t3, e3) {
        t3 = D2(t3);
        var n3 = this;
        return n3.__filtered__ && (0 < t3 || e3 < 0) ? new _2(n3) : (t3 < 0 ? n3 = n3.takeRight(-t3) : t3 && (n3 = n3.drop(t3)), e3 !== Wi ? (e3 = D2(e3)) < 0 ? n3.dropRight(-e3) : n3.take(e3 - t3) : n3);
      }, _2.prototype.takeRightWhile = function(t3) {
        return this.reverse().takeWhile(t3).reverse();
      }, _2.prototype.toArray = function() {
        return this.take(qi);
      }, se(_2.prototype, function(f3, t3) {
        var l3 = /^(?:filter|find|map|reject)|While$/.test(t3), s3 = /^(?:head|last)$/.test(t3), d3 = h2[s3 ? "take" + (t3 == "last" ? "Right" : "") : t3], p3 = s3 || /^find/.test(t3);
        d3 && (h2.prototype[t3] = function() {
          function t4(t5) {
            return t5 = d3.apply(h2, la([t5], r3)), s3 && u3 ? t5[0] : t5;
          }
          var e3, n3 = this.__wrapped__, r3 = s3 ? [1] : arguments, o3 = n3 instanceof _2, i3 = r3[0], a3 = o3 || M(n3), u3 = (a3 && l3 && typeof i3 == "function" && i3.length != 1 && (o3 = a3 = false), this.__chain__), i3 = !!this.__actions__.length, c3 = p3 && !u3, o3 = o3 && !i3;
          return !p3 && a3 ? (n3 = o3 ? n3 : new _2(this), (e3 = f3.apply(n3, r3)).__actions__.push({ func: Vr, args: [t4], thisArg: Wi }), new g2(e3, u3)) : c3 && o3 ? f3.apply(this, r3) : (e3 = this.thru(t4), c3 ? s3 ? e3.value()[0] : e3.value() : e3);
        });
      }), ua(["pop", "push", "shift", "sort", "splice", "unshift"], function(t3) {
        var n3 = F[t3], r3 = /^(?:push|sort|unshift)$/.test(t3) ? "tap" : "thru", o3 = /^(?:pop|shift)$/.test(t3);
        h2.prototype[t3] = function() {
          var t4, e3 = arguments;
          return o3 && !this.__chain__ ? (t4 = this.value(), n3.apply(M(t4) ? t4 : [], e3)) : this[r3](function(t5) {
            return n3.apply(M(t5) ? t5 : [], e3);
          });
        };
      }), se(_2.prototype, function(t3, e3) {
        var n3, r3 = h2[e3];
        r3 && (n3 = r3.name + "", z.call(Rt, n3) || (Rt[n3] = []), Rt[n3].push({ name: e3, func: r3 }));
      }), Rt[Dn(Wi, 2).name] = [{ name: "wrapper", func: Wi }], _2.prototype.clone = function() {
        var t3 = new _2(this.__wrapped__);
        return t3.__actions__ = I2(this.__actions__), t3.__dir__ = this.__dir__, t3.__filtered__ = this.__filtered__, t3.__iteratees__ = I2(this.__iteratees__), t3.__takeCount__ = this.__takeCount__, t3.__views__ = I2(this.__views__), t3;
      }, _2.prototype.reverse = function() {
        var t3;
        return this.__filtered__ ? ((t3 = new _2(this)).__dir__ = -1, t3.__filtered__ = true) : (t3 = this.clone()).__dir__ *= -1, t3;
      }, _2.prototype.value = function() {
        var t3 = this.__wrapped__.value(), e3 = this.__dir__, n3 = M(t3), r3 = e3 < 0, o3 = n3 ? t3.length : 0, i3 = function(t4, e4, n4) {
          var r4 = -1, o4 = n4.length;
          for (; ++r4 < o4; ) {
            var i4 = n4[r4], a4 = i4.size;
            switch (i4.type) {
              case "drop":
                t4 += a4;
                break;
              case "dropRight":
                e4 -= a4;
                break;
              case "take":
                e4 = C2(e4, t4 + a4);
                break;
              case "takeRight":
                t4 = w2(t4, e4 - a4);
            }
          }
          return { start: t4, end: e4 };
        }(0, o3, this.__views__), a3 = i3.start, u3 = (i3 = i3.end) - a3, c3 = r3 ? i3 : a3 - 1, f3 = this.__iteratees__, l3 = f3.length, s3 = 0, d3 = C2(u3, this.__takeCount__);
        if (!n3 || !r3 && o3 == u3 && d3 == u3)
          return tn(t3, this.__actions__);
        var p3 = [];
        t:
          for (; u3-- && s3 < d3; ) {
            for (var h3 = -1, v3 = t3[c3 += e3]; ++h3 < l3; ) {
              var g3 = f3[h3], _3 = g3.iteratee, g3 = g3.type, _3 = _3(v3);
              if (g3 == 2)
                v3 = _3;
              else if (!_3) {
                if (g3 == 1)
                  continue t;
                break t;
              }
            }
            p3[s3++] = v3;
          }
        return p3;
      }, h2.prototype.at = Nr, h2.prototype.chain = function() {
        return Fr(this);
      }, h2.prototype.commit = function() {
        return new g2(this.value(), this.__chain__);
      }, h2.prototype.next = function() {
        this.__values__ === Wi && (this.__values__ = Ao(this.value()));
        var t3 = this.__index__ >= this.__values__.length;
        return { done: t3, value: t3 ? Wi : this.__values__[this.__index__++] };
      }, h2.prototype.plant = function(t3) {
        for (var e3, n3 = this; n3 instanceof Xt; )
          var r3 = Ir(n3), o3 = (r3.__index__ = 0, r3.__values__ = Wi, e3 ? o3.__wrapped__ = r3 : e3 = r3, r3), n3 = n3.__wrapped__;
        return o3.__wrapped__ = t3, e3;
      }, h2.prototype.reverse = function() {
        var t3 = this.__wrapped__;
        return t3 instanceof _2 ? (t3 = t3, (t3 = (t3 = this.__actions__.length ? new _2(this) : t3).reverse()).__actions__.push({ func: Vr, args: [Or], thisArg: Wi }), new g2(t3, this.__chain__)) : this.thru(Or);
      }, h2.prototype.toJSON = h2.prototype.valueOf = h2.prototype.value = function() {
        return tn(this.__wrapped__, this.__actions__);
      }, h2.prototype.first = h2.prototype.head, ut && (h2.prototype[ut] = function() {
        return this;
      }), h2;
    }();
    o ? ((o.exports = _a)._ = _a, r._ = _a) : ia._ = _a;
  }.call(commonjsGlobal);
}(lodash, lodash.exports);
const CancasSafeArea = 1e5, DPI = window.devicePixelRatio || 1, DEFAULT_CONFIG = { tagConfig: { fontSize: 20, showText: true, fillStyle: "rgba(242, 88, 85, 0.5)", textFillStyle: "rgba(255, 255, 255, 0.6)", hoverStrokeStyle: "#F25856", hoverLineWidth: 1, hoverLineDash: [5], highlightStrokeStyle: "yellow", highlightLineWidth: 2, highlightLineDash: [5] }, layerConfig: { fillStyle: "rgba(0, 0, 0, 0.6)" }, cropConfig: { lineDash: [], strokeStyle: "rgba(255, 255, 255, 1)", lineWidth: 2 } }, defaultWH = { width: 0, height: 0 }, defaultPoint = { x: void 0, y: void 0 };
function clearCanvas(t) {
  t.clearRect(-CancasSafeArea / 2, -CancasSafeArea / 2, CancasSafeArea, CancasSafeArea);
}
function loadImage(t) {
  let n = new Image();
  return n.src = t, new Promise((t2, e) => {
    n.complete ? t2(n) : (n.onload = function() {
      t2(n);
    }, n.onerror = function() {
      e("\u56FE\u7247\u52A0\u8F7D\u5931\u8D25:" + n.src);
    });
  });
}
function drawImage(t, e, n, r, o, i) {
  t.drawImage(e, n, r, o, i);
}
function drawLayerBg(t, e) {
  t.fillStyle = e.layerConfig.fillStyle, t.fillRect(-CancasSafeArea / 2, -CancasSafeArea / 2, CancasSafeArea, CancasSafeArea);
}
function drawLayerImageData(t, e, n, r, o) {
  t.clearRect(e, n, r, o);
}
function drawLayerBorder(t, e, n, r, o, i) {
  t.setLineDash(i.cropConfig.lineDash), t.strokeStyle = i.cropConfig.strokeStyle, t.lineWidth = i.cropConfig.lineWidth, t.strokeRect(e, n, r, o);
}
function getElementWH(t) {
  t = t.getClientRects()[0];
  return t ? { top: t.top, right: t.right, bottom: t.bottom, left: t.left, width: t.width, height: t.height, x: t.x, y: t.y } : void 0;
}
function initCanvasWH(t, e) {
  t.canvas.width = e.width, t.canvas.height = e.height;
}
function initScale(t, e) {
  var n = t.width / e.width, t = t.height / e.height;
  return { scale: n < t ? n : t, fit: n < t ? "height" : "width" };
}
function getVariableType(t) {
  let e = Object.prototype.toString.call(t);
  return e.slice(8, e.length - 1);
}
function amendDpi(n, t = ["width", "height"], r = false) {
  try {
    var o = getVariableType(n);
    let e = r ? 1 / DPI : DPI;
    if (o === "Number")
      return n * e;
    t.forEach((t2) => {
      n[t2] *= e;
    });
  } catch (t2) {
    console.error("ERROR", n, getVariableType(n), t2);
  }
  return n;
}
function amendMobileTouchEventDpi(t) {
  return Array.from(t.touches || []).map((t2) => {
    return amendDpi({ clientX: t2.clientX, clientY: t2.clientY }, ["clientX", "clientY"]);
  });
}
function drawCropRect(t, e, n, r, o, i, a) {
  a || (clearCanvas(t), drawLayerBg(t, i)), drawLayerImageData(t, e, n, r, o), drawLayerBorder(t, e, n, r, o, i);
}
function drawCropList(n, t, r, o, i, e) {
  e || (clearCanvas(n), drawLayerBg(n, o)), t.forEach((t2) => {
    let e2 = transfromBoxToRect(t2, t2.scale, r);
    i && (e2[0] += i.offsetX, e2[1] += i.offsetY), drawLayerImageData(n, ...e2), drawLayerBorder(n, ...e2, o);
  });
}
function pointIsInBoxList(n, r, e = 1, o = { x: 0, y: 0 }) {
  let i = [], a = [], t = r.map((t2) => transfromBoxSize2Visual(t2, e, o));
  return t.forEach((t2, e2) => {
    pointIsInBox(n, t2) && (i.push(r[e2]), a.push(e2));
  }), { boxList: i, indexList: a };
}
function transfromBoxSize2Visual(t, e, n) {
  let r = lodash.exports.cloneDeep(t);
  return r.startX = r.startX * e + n.x, r.endX = r.endX * e + n.x, r.startY = r.startY * e + n.y, r.endY = r.endY * e + n.y, r;
}
function pointIsInBox(t, e) {
  return t.x >= e.startX && t.x <= e.endX && t.y >= e.startY && t.y <= e.endY;
}
function pointIsInRect(t, e) {
  let n = e[0], r = e[0] + e[2], o = e[1], i = e[1] + e[3];
  return t.x >= n && t.x <= r && t.y >= o && t.y <= i;
}
function transfromTwoPoints2Rect(t, e) {
  var n = Math.abs(e.x - t.x), r = Math.abs(e.y - t.y);
  return [Math.min(t.x, e.x), Math.min(t.y, e.y), n, r];
}
function fixBoxInfo(t) {
  let e = t;
  var { startX: t, startY: n, endX: r, endY: o } = e, i = Math.abs(t - r), a = Math.abs(n - o), t = Math.min(t, r), n = Math.min(n, o);
  return e.startX = t, e.startY = n, e.endX = t + i, e.endY = n + a, { info: e, position: [t, n, i, a] };
}
function getTwoBoxIntersectPart(t, e) {
  var t = fixBoxInfo(t), e = fixBoxInfo(e), n = Math.min(t.info.startY, e.info.startY), r = Math.max(t.info.endY, e.info.endY);
  let o;
  Math.abs(r - n) < t.position[3] + e.position[3] && (o = { startY: Math.max(t.info.startY, e.info.startY), endY: Math.min(t.info.endY, e.info.endY) });
  r = Math.min(t.info.startX, e.info.startX), n = Math.max(t.info.endX, e.info.endX), n = Math.abs(n - r), r = t.position[2] + e.position[2];
  let i;
  if ((i = n < r ? { startX: Math.max(t.info.startX, e.info.startX), endX: Math.min(t.info.endX, e.info.endX) } : i) !== void 0 && o !== void 0)
    return Object.assign(o, i);
}
function transfromBoxToRect(t, e = 1, n = { x: 0, y: 0 }) {
  var t = fixBoxInfo(t), { startX: r, startY: o } = t.info, i = t.position[2], t = t.position[3];
  return [r * e + n.x, o * e + n.y, i * e, t * e];
}
function isBoxValidity(t) {
  t = transfromBoxToRect(t);
  return 5 <= t[2] && 5 <= t[3];
}
function drawTagRect(t, e, n, r, o, i, a, u, c, f, l, s) {
  i = lodash.exports.cloneDeep(i.tagConfig);
  if (s && Object.assign(i, s), t.font = i.fontSize + "px sans-serif", u || c) {
    !c || u && u.type === "move" || (t.fillStyle = i.fillStyle, t.fillRect(e, n, r, o), a && i.showText && (s = parseFloat(t.font.split(" ")[0]), t.fillStyle = i.textFillStyle, t.fillText(l || a + "", e + 4, n + o / 2 + s / 2))), f && (t.strokeStyle = i.highlightStrokeStyle, t.lineWidth = i.highlightLineWidth, t.setLineDash(i.highlightLineDash), t.strokeRect(e, n, r, o));
    if (u && pointIsInRect(u, [e, n, r, o])) {
      if (u.type === "click")
        return { isShow: c = !c, isCrash: true };
      u.type !== "move" || c || (t.strokeStyle = i.hoverStrokeStyle, t.lineWidth = i.hoverLineWidth, t.setLineDash(i.hoverLineDash), t.strokeRect(e, n, r, o));
    }
  }
}
function drawTagList(r, t, o, i, a = { offsetX: 0, offsetY: 0 }, u) {
  let c = false, f = [];
  return t.forEach((t2, e) => {
    let n = transfromBoxToRect(t2, t2.scale, o);
    n[0] += a.offsetX, n[1] += a.offsetY;
    e = drawTagRect(r, ...n, i, e + 1, u, t2.isShow, t2.showOutLine, t2.labelText, t2.tagConfig);
    e !== void 0 && (t2.isShow = e.isShow, e.isCrash && (c = true, f.push(t2)));
  }), { isReDraw: c, redrawList: f };
}
function fixMoveRectPosition(t, e, n) {
  n = fixPoint({ x: t[0], y: t[1] }, e, n);
  return t[0] = n.x, t[1] = n.y, t[2] /= e / DPI, t[3] /= e / DPI, t;
}
function moveDrawCropRect(e, n, r, o, i, a, u, c) {
  if (n.x !== void 0 && r.x !== void 0) {
    let t = fixMoveRectPosition(transfromTwoPoints2Rect(n, r), o, i);
    if (t[2] = amendDpi(t[2], void 0, true), t[3] = amendDpi(t[3], void 0, true), 5 < t[2] || 5 < t[3])
      return drawCropList(e, a, u, c), drawCropRect(e, ...t, c, true), t;
  }
}
function getVertexPositionByTwoPoints(t, e) {
  return (t.x <= e.x ? "left" : "right") + "-" + (t.y <= e.y ? "top" : "bottom");
}
function getPointByBoxAndVertexPosition(t, e) {
  e = e.split("-");
  return { x: e[0] === "left" ? t.startX : t.endX, y: e[1] === "top" ? t.startY : t.endY };
}
function moveDrawTagRect(e, n, r, o, i, a, u, c) {
  if (n.x !== void 0 && r.x !== void 0) {
    let t = fixMoveRectPosition(transfromTwoPoints2Rect(n, r), o, i);
    if (t[2] = amendDpi(t[2], void 0, true), t[3] = amendDpi(t[3], void 0, true), 5 < t[2] || 5 < t[3])
      return drawTagList(e, a, u, c), drawTagRect(e, ...t, c, a.length + 1, void 0, true), t;
  }
}
function getTwoPointsOffsetInfo(t, e, n) {
  var r = transfromTwoPoints2Rect(t, e), o = (e.x - t.x) / n, e = (e.y - t.y) / n;
  let i = false;
  return { isStartMove: i = 5 < r[2] || 5 < r[3] ? true : i, offsetInfo: { offsetX: o, offsetY: e } };
}
function moveCanvas(t, e, n, r, o, i, a, u, c, f, l, s) {
  if (a.x !== void 0 && u.x !== void 0) {
    a = getTwoPointsOffsetInfo(a, u, f);
    if (a.isStartMove)
      return { offsetX: u, offsetY: f } = a.offsetInfo, clearCanvas(t), drawImage(t, n, (t = { x: i.x + u, y: i.y + f }).x, t.y, r.width * o, r.height * o), drawCropList(e, c, i, s, a.offsetInfo), drawTagList(e, l, i, s, { offsetX: u, offsetY: f }), { offsetX: u, offsetY: f };
  }
}
function fixPoint(t, e, n) {
  return { x: t.x / e + n.x, y: t.y / e + n.y };
}
function getTouchPoint(t, e, n, r) {
  t = fixPoint({ x: t.layerX, y: t.layerY }, e, n);
  return { x: t.x, y: t.y, type: r };
}
function moveDrawUnshowTagDashRect(e, t, i, a, u, c, f, l, n, s, d) {
  if (t === "tag" && !n) {
    let t2 = i.filter((t3) => !t3.isShow), n2 = false, r = getTouchPoint(f, a, c, "move"), o = [];
    t2.forEach((t3) => {
      var e2 = transfromBoxToRect(t3, t3.scale, u);
      pointIsInRect(r, e2) && (o.push(t3), n2 = true);
    }), n2 ? (s = true, drawTagList(e, o, u, d, void 0, r)) : s && (drawCropList(e, l, u, d), drawTagList(e, i, u, d), s = false);
  }
  return s;
}
function getCropFourBorderRect(t, e, n) {
  var t = transfromBoxToRect(t, t.scale, e), e = device.mobile() ? 6 * DPI : 6, r = e / 2;
  return [{ index: n, name: "left-top", type: "vertex", positions: [t[0] - r, t[1] - r, e, e] }, { index: n, name: "right-top", type: "vertex", positions: [t[0] + t[2] - r, t[1] - r, e, e] }, { index: n, name: "left-bottom", type: "vertex", positions: [t[0] - r, t[1] + t[3] - r, e, e] }, { index: n, name: "right-bottom", type: "vertex", positions: [t[0] + t[2] - r, t[1] + t[3] - r, e, e] }, { index: n, name: "left", type: "border", positions: [t[0] - r, t[1] + r, e, t[3] - r] }, { index: n, name: "top", type: "border", positions: [t[0] + r, t[1] - r, t[2] - r, e] }, { index: n, name: "right", type: "border", positions: [t[0] + t[2] - r, t[1] + r, e, t[3] - r] }, { index: n, name: "bottom", type: "border", positions: [t[0] + r, t[1] + t[3] - r, t[2] - r, e] }];
}
function pointIsInRectList(n, t) {
  let r = false, o = [], i = [];
  return t.forEach((t2, e) => {
    pointIsInRect(n, t2) && (r = true, o.push(t2), i.push(e));
  }), { hasIn: r, coverList: o, coverIndexList: i };
}
function detectEventIsTriggerOnCropBorderOrVertex(t, e, n, r, o) {
  t = getTouchPoint(t, n, o, "move");
  let i = e.map((t2, e2) => getCropFourBorderRect(t2, r, e2)).flat(), a = pointIsInRectList(t, i.map((t2) => t2.positions));
  return { hasIn: a.hasIn, list: a.coverIndexList.map((t2) => i[t2]) };
}
function findOneBorderOrVertex(t) {
  t = t.find((t2) => t2.type === "vertex") || t[0];
  if (t)
    return t;
  throw new Error("findOneBorderOrVertex list may be empty.");
}
function moveDetectCropBorderSetCursor(t, e, n, r, o, i, a, u) {
  n !== "crop" || u || ((n = detectEventIsTriggerOnCropBorderOrVertex(e, r, o, i, a)).hasIn ? ((u = findOneBorderOrVertex(n.list).name) !== "left-top" && u !== "right-bottom" || (t.style.cursor = "nwse-resize"), u !== "right-top" && u !== "left-bottom" || (t.style.cursor = "nesw-resize"), u !== "left" && u !== "right" || (t.style.cursor = "col-resize"), u !== "top" && u !== "bottom" || (t.style.cursor = "row-resize")) : t.style.cursor = "auto");
}
function getResizeCropInfo(t, e, n) {
  if (!n)
    return t;
  let r = lodash.exports.cloneDeep(t), o = n.name;
  var { offsetX: t, offsetY: n } = e;
  return o.includes("left") && (r.startX += t), o.includes("top") && (r.startY += n), o.includes("right") && (r.endX += t), o.includes("bottom") && (r.endY += n), r;
}
function moveResizeCrop(t, e, n, r, o, i, a, u, c, f, l) {
  if (e && e.x !== void 0 && n && n.x !== void 0) {
    var e = getTwoPointsOffsetInfo(e, n, i);
    if (e.isStartMove)
      return { offsetX: n, offsetY: i } = e.offsetInfo, e = transfromBoxToRect(getResizeCropInfo(r, { offsetX: n / o, offsetY: i / o }, c), o, a), drawCropList(t, f, a, l), drawCropRect(t, ...e, l, true), drawTagList(t, u, a, l), e;
  }
}
function getHypotenuseValue(t, e) {
  return Math.sqrt(Math.pow(t, 2) + Math.pow(e, 2));
}
function getDotDistence(t, e) {
  return Math.abs(t - e);
}
function getTwoFingerTouchListDistence(t) {
  return { width: getDotDistence(t[0].clientX, t[1].clientX), height: getDotDistence(t[0].clientY, t[1].clientY) };
}
function transfromRect2Box(t, e, n = 1) {
  return fixBoxInfo({ startX: (t[0] - e.x) / n, startY: (t[1] - e.y) / n, endX: (t[0] + t[2] - e.x) / n, endY: (t[1] + t[3] - e.y) / n }).info;
}
function initBoundingArrScale(t, e, n) {
  return t.map((t2) => (t2.scale = e, fixBoxInfo(transformBoxPrecision(t2, n)).info));
}
function getBoxIsIntersectWithBoxList(t, e) {
  for (const n of e)
    if (getTwoBoxIntersectPart(t, n))
      return true;
  return false;
}
function boxIsAllInOtherBox(t, e) {
  e = getTwoBoxIntersectPart(t, e);
  return !(!e || e.startX !== t.startX || e.endX !== t.endX || e.startY !== t.startY || e.endY !== t.endY);
}
function boxAllInBoxList(n, t) {
  let r = [], o = [];
  return t.forEach((t2, e) => {
    boxIsAllInOtherBox(n, t2) && (o.push(t2), r.push(e));
  }), { boxList: o, indexList: r };
}
function transformTagListBoxRelativeTo(e, n, t) {
  return t.map((t2) => transformTagBoxRelativeTo(e, n, t2));
}
function transformTagBoxRelativeTo(t, e, n) {
  let r = lodash.exports.cloneDeep(n);
  return t === "img" && (r.startX = r.startX + e.startX, r.startY = r.startY + e.startY, r.endX = r.endX + e.startX, r.endY = r.endY + e.startY), t === "crop" && (r.startX = r.startX - e.startX, r.startY = r.startY - e.startY, r.endX = r.endX - e.startX, r.endY = r.endY - e.startY), r;
}
function transformBoxPrecision(t, e) {
  return t.startX = parseFloat(t.startX.toFixed(e)), t.endX = parseFloat(t.endX.toFixed(e)), t.startY = parseFloat(t.startY.toFixed(e)), t.endY = parseFloat(t.endY.toFixed(e)), t;
}
var ImgMark_vue_vue_type_style_index_0_scoped_true_lang = "", _export_sfc = (t, e) => {
  const n = t.__vccOpts || t;
  for (var [r, o] of e)
    n[r] = o;
  return n;
};
const _withScopeId = (t) => (pushScopeId("data-v-f0d1cdfc"), t = t(), popScopeId(), t), _hoisted_1 = ["onMousewheel", "onTouchmove", "onTouchstart", "onTouchend"], _hoisted_2 = { key: 0, class: "mode-panel" }, _hoisted_3 = { class: "status" }, _hoisted_4 = { class: "text" }, _hoisted_5 = { class: "tip" }, _hoisted_6 = _withScopeId(() => createElementVNode("kbd", null, "Ctrl", -1)), _hoisted_7 = createTextVNode(" + "), _hoisted_8 = _withScopeId(() => createElementVNode("kbd", null, "B", -1)), _hoisted_9 = _withScopeId(() => createElementVNode("span", { style: { "font-size": "14px", "margin-left": "10px" } }, "\u5207\u6362\u6A21\u5F0F", -1)), _sfc_main = defineComponent({ props: { cropConfig: { default: () => DEFAULT_CONFIG.cropConfig }, layerConfig: { default: () => DEFAULT_CONFIG.layerConfig }, tagConfig: { default: () => DEFAULT_CONFIG.tagConfig }, isShowTip: { type: Boolean, default: false }, enableScale: { type: Boolean, default: true }, enableMove: { type: Boolean, default: true }, enableDrawCrop: { type: Boolean, default: true }, enableDrawTag: { type: Boolean, default: true }, enableInteractiveTagChangeStatus: { type: Boolean, default: true }, enableCropCross: { type: Boolean, default: false }, handleResizeCropCross: { default: "reset" }, enableInteractiveCropDelete: { type: Boolean, default: true }, enableCropResize: { type: Boolean, default: true }, enableDrawCropOutOfImg: { type: Boolean, default: true }, enableDrawTagOutOfCrop: { type: Boolean, default: true }, enableDrawTagOutOfImg: { type: Boolean, default: true }, isImgCrop: { type: Boolean, default: false }, isCropSingle: { type: Boolean, default: false }, cropList: { default: () => Array() }, tagList: { default: () => Array() }, mode: { default: "crop" }, mobileOperation: { default: "move" }, src: null, precision: { default: 0 } }, emits: ["update:cropList", "cropListChange", "update:tagList", "tagListChange", "update:mode", "update:mobileOperation", "resizeStart", "resizeEnd", "delCrop", "drawCropStart", "drawTagStart", "mouseOverInfo"], setup(n, { expose: t, emit: o }) {
  const a = n;
  let r = false, i = void 0, u = void 0, c = null, f = { last: { down: void 0, up: void 0 }, prev: { down: void 0, up: void 0 } };
  const e = device.mobile() ? 0.1 / DPI * 1.5 : 0.1;
  let X = e, P = false;
  function M() {
    c = null, P = false, X = e, O.resizeCropHovering = void 0;
  }
  let l = false, s = null, d = null, p, h = lodash.exports.cloneDeep(defaultWH), v = lodash.exports.cloneDeep(defaultWH), g = lodash.exports.cloneDeep(defaultPoint), _ = lodash.exports.cloneDeep(defaultPoint), W = { x: 0, y: 0 }, U = 0, y = { x: 0, y: 0 }, w = { x: 0, y: 0 }, m = 1, x, b, F = 1, C, I = 1, T, B, D = [], R = [], S = computed(() => {
    var t2 = lodash.exports.cloneDeep(DEFAULT_CONFIG);
    return Object.assign(t2.cropConfig, a.cropConfig), Object.assign(t2.tagConfig, a.tagConfig), Object.assign(t2.layerConfig, a.layerConfig), t2;
  });
  let L = ref(), V = ref(), N = ref(), O = { isScaleing: false, isDrawRecting: false, isMoving: false, resizeCropHovering: void 0, isMouseDown: () => g.x !== void 0, isMouseUpDownPoints: () => g.x !== void 0 && _.x !== void 0 }, k = { dragCreatRectInterrupt() {
    Q();
  }, dragCreatOrResizeRect(t2) {
    d && (t2 == "drawCrop" && (a.isCropSingle && !O.isDrawRecting && (R = []), O.isDrawRecting || o("drawCropStart"), O.isDrawRecting = true, T = moveDrawCropRect(d, g, _, I, w, R, y, S.value), drawTagList(d, D, y, S.value)), t2 == "drawTag" && (O.isDrawRecting || o("drawTagStart"), O.isDrawRecting = true, drawCropList(d, R, y, S.value), B = moveDrawTagRect(d, g, _, I, w, D, y, S.value)), t2 == "resizeCrop" && (a.enableCropResize && O.resizeCropHovering ? (c = R[O.resizeCropHovering.index || 0], O.resizeCropHovering && c && (O.isDrawRecting = true, T = moveResizeCrop(d, g, _, c, c.scale || 1, I, y, D, O.resizeCropHovering, R.filter((t3, e2) => {
      var _a;
      return e2 !== ((_a = O.resizeCropHovering) == null ? void 0 : _a.index);
    }), S.value))) : k.move()));
  }, changeMode() {
    a.mode === "tag" ? o("update:mode", "crop") : o("update:mode", "tag");
  }, scale(t2, e2) {
    if (!p || !s || !d)
      throw new Error("can't find canvas ctx or img");
    O.isScaleing = true, s.translate(w.x, w.y), d.translate(w.x, w.y), w = { x: w.x - (e2.x / (I * t2) - e2.x / I), y: w.y - (e2.y / (I * t2) - e2.y / I) }, s.scale(t2, t2), d.scale(t2, t2), s.translate(-w.x, -w.y), d.translate(-w.x, -w.y), I *= t2, clearCanvas(s), clearCanvas(d), drawImage(s, p, y.x, y.y, v.width * m, v.height * m), Y(), P = false, O.isScaleing = false;
  }, move() {
    var t2;
    a.enableMove && s && d && p && !O.isScaleing && (O.isMoving = true, (t2 = moveCanvas(s, d, p, v, m, y, g, _, R, I, D, S.value)) && (b = lodash.exports.cloneDeep(y)) && (b.x += t2.offsetX, b.y += t2.offsetY));
  }, hoverRect(t2) {
    d && (P = moveDrawUnshowTagDashRect(d, a.mode, D, I, y, w, t2, R, O.isScaleing, P, S.value), a.enableCropResize && !r && moveDetectCropBorderSetCursor(L.value, t2, a.mode, R, I, y, w, O.isScaleing));
  } }, E = { onKeyUpCtrlB() {
    k.changeMode();
  }, onKeyUpSpace() {
    O.isMoving || O.resizeCropHovering || k.dragCreatRectInterrupt(), r = false;
  }, onKeyDownSpace() {
    (a.enableDrawCrop && a.mode === "crop" || a.enableDrawTag && a.mode === "tag") && (L.value.style.cursor = "crosshair"), O.isMouseDown() || (r = true);
  }, onMouseOverMove(t2) {
    device.mobile() || O.isMouseDown() || device.mobile() ? this.onHoldMouseLeftBtnMove(t2) : k.hoverRect(t2);
  }, onSpaceMove() {
    a.mode === "crop" ? a.enableDrawCrop && k.dragCreatOrResizeRect("drawCrop") : a.enableDrawTag && k.dragCreatOrResizeRect("drawTag");
  }, onHoldMouseLeftBtnMove(t2) {
    _ = { x: t2.layerX, y: t2.layerY }, r ? this.onSpaceMove() : (a.mode === "tag" && k.move(), a.mode === "crop" && (O.resizeCropHovering ? k.dragCreatOrResizeRect("resizeCrop") : k.move()));
  }, onDoubleClick(e2) {
    if (a.mode === "crop" && a.enableInteractiveCropDelete && st(pointIsInBoxList(e2, R, m, y).boxList), a.mode === "tag") {
      let t2 = pointIsInBoxList(e2, D, m, y)["boxList"];
      t2.forEach((t3) => {
        var _a;
        (_a = t3 == null ? void 0 : t3.onDoubleClick) == null ? void 0 : _a.call(t3, "", t3);
      });
    }
  }, onCick(e2) {
    if (a.mode === "tag" && d) {
      let t2 = pointIsInBoxList(e2, D, m, y)["boxList"];
      var n2;
      t2.forEach((t3) => {
        var _a;
        (_a = t3 == null ? void 0 : t3.onClick) == null ? void 0 : _a.call(t3, "", t3);
      }), a.enableInteractiveTagChangeStatus && (drawCropList(d, R, y, S.value), { isReDraw: e2, redrawList: n2 } = drawTagList(d, D, y, S.value, void 0, e2), e2 && (Y(), et("statusChange", z(n2))));
    }
  }, onWheel(t2, e2, n2) {
    (a.enableScale || n2) && k.scale(t2, e2);
  }, init() {
    !async function() {
      if (M(), l = false, s = null, d = null, p = void 0, h = lodash.exports.cloneDeep(defaultWH), v = lodash.exports.cloneDeep(defaultWH), g = lodash.exports.cloneDeep(defaultPoint), _ = lodash.exports.cloneDeep(defaultPoint), y = { x: 0, y: 0 }, w = { x: 0, y: 0 }, m = 1, x = void 0, b = void 0, F = 1, C = void 0, I = 1, T = void 0, B = void 0, D = [], R = [], await nextTick(), 1 < a.cropList.length) {
        let e2 = { startX: 1 / 0, startY: 1 / 0, endX: -1 / 0, endY: -1 / 0 };
        a.cropList.forEach((t2) => {
          t2 = fixBoxInfo(t2);
          t2.info.startX < e2.startX && (e2.startX = t2.info.startX), t2.info.startY < e2.startY && (e2.startY = t2.info.startY), t2.info.endX > e2.endX && (e2.endX = t2.info.endX), t2.info.endY > e2.endY && (e2.endY = t2.info.endY);
        }), x = e2;
      }
      return a.cropList.length == 1 && (x = a.cropList[0]), D = lodash.exports.cloneDeep(a.tagList), R = lodash.exports.cloneDeep(a.cropList), A(), device.mobile() || (document.addEventListener("keydown", H), document.addEventListener("keyup", $)), G(), s = V.value.getContext("2d"), d = N.value.getContext("2d"), s && d ? (h = amendDpi(getElementWH(s.canvas))) ? (initCanvasWH(s, h), initCanvasWH(d, h), loadImage(a.src).then((t2) => {
        if (!h || !s || !d)
          return Promise.reject("canvasWH or canvas var not has valid values.");
        p = t2, v = { width: p.width, height: p.height };
        var e2, n2, r2, o2, i2, t2 = initScale(h, p);
        return m = F = t2.scale, x ? (e2 = transfromBoxToRect(x, F, y), n2 = (h.width - 0.05 * h.width) / e2[2], r2 = (h.height - 0.05 * h.height) / e2[3], r2 = h.width / h.height > e2[2] / e2[3] ? r2 : n2, o2 = e2[0] + e2[2], i2 = e2[1] + e2[3], (r2 = r2) == n2 ? (y.x = (h.width - o2 * r2 - 0.05 * h.width / 2) / r2, y.y = ((h.height - e2[3] * r2) / 2 - e2[1] * r2) / r2) : (y.x = ((h.width - e2[2] * r2) / 2 - e2[0] * r2) / r2, y.y = (h.height - i2 * r2 - 0.05 * h.height / 2) / r2), Z({ deltaY: 1, clientX: 0, clientY: 0, preventDefault() {
        }, __zoom: r2 }, true)) : (t2.fit === "width" ? y.x = (h.width - v.width * m) / 2 : y.y = (h.height - v.height * m) / 2, x = { startX: 0, startY: 0, endX: 0 + v.width, endY: 0 + v.height }, a.isImgCrop && tt("add", R = [x])), drawImage(s, p, y.x, y.y, p.width * m, p.height * m), R = initBoundingArrScale(R, m, a.precision), D = initBoundingArrScale(D, m, a.precision), Y(), true;
      })) : Promise.reject("Error: can't get canvas height and width.") : Promise.reject("Error: can't find canvas element.");
    }().then(() => {
      l = true;
    });
  }, resize() {
    requestAnimationFrame(() => {
      console.log("resized"), async function() {
        if (q(), await nextTick(), A(), s && d && p) {
          if (!(h = amendDpi(getElementWH(s.canvas))))
            return Promise.reject("Error: can't get canvas height and width.");
          initCanvasWH(s, h), initCanvasWH(d, h), s.scale(I, I), d.scale(I, I), s.translate(-w.x, -w.y), d.translate(-w.x, -w.y), drawImage(s, p, y.x, y.y, p.width * m, p.height * m), R = initBoundingArrScale(R, m, a.precision), D = initBoundingArrScale(D, m, a.precision), Y(), l = true;
        } else
          console.error("ctx or ctx2 or img can't find on resize.");
      }();
    });
  } };
  function H(t2) {
    t2.code === "Space" && (t2.preventDefault(), E.onKeyDownSpace());
  }
  function $(t2) {
    t2.code === "KeyB" && t2.ctrlKey && E.onKeyUpCtrlB(), t2.code === "Space" && E.onKeyUpSpace();
  }
  function A() {
    var t2 = L.value.getBoundingClientRect();
    C = { top: t2.top, right: t2.right, bottom: t2.bottom, left: t2.left, width: t2.width, height: t2.height, x: t2.x, y: t2.y };
  }
  function q() {
    c = null, l = false, h = lodash.exports.cloneDeep(defaultWH), g = lodash.exports.cloneDeep(defaultPoint), _ = lodash.exports.cloneDeep(defaultPoint), C = void 0;
  }
  function Y() {
    d && (drawCropList(d, R, y, S.value), drawTagList(d, D, y, S.value));
  }
  function G() {
    device.mobile() && (a.mobileOperation === "draw" && E.onKeyDownSpace(), a.mobileOperation === "move" && E.onKeyUpSpace());
  }
  function K() {
    E.resize();
  }
  function Z(t2, e2) {
    let n2 = t2;
    if (!C)
      throw new Error("can't find  containerInfo.");
    var r2, o2;
    (l || n2.__zoom) && (n2.preventDefault(), O.isDrawRecting || O.isMoving || (t2 = n2.onTouchMove ? 1 : DPI, r2 = e2 ? 0 : (n2.clientX - C.left) * t2, t2 = e2 ? 0 : (n2.clientY - C.top) * t2, o2 = n2.deltaY < 0 ? 1 : -1, o2 = e2 ? n2.__zoom : Math.exp(o2 * X), I * o2 < 0.2 || E.onWheel(o2, { x: r2, y: t2 }, e2)));
  }
  function J(t2) {
    O.resizeCropHovering && (R[O.resizeCropHovering.index] = t2, o("resizeEnd", { index: O.resizeCropHovering.index, box: t2 }), tt("resize", j([t2])));
  }
  function Q() {
    if (l) {
      var t2, e2;
      if (O.isMoving = false, b && (y = lodash.exports.cloneDeep(b)), b = void 0, O.isMouseUpDownPoints())
        if (a.mode === "crop") {
          if (T) {
            let t3 = __spreadValues(__spreadValues({}, c), transfromRect2Box(T, y, m));
            c = null, O.resizeCropHovering ? !a.enableCropCross && getBoxIsIntersectWithBoxList(t3, R.filter((t4, e3) => {
              var _a;
              return e3 !== ((_a = O.resizeCropHovering) == null ? void 0 : _a.index);
            })) ? (a.handleResizeCropCross === "reset" && Y(), a.handleResizeCropCross === "delete" && st([R[O.resizeCropHovering.index]])) : J(t3) : (t3 = initBoundingArrScale([t3], m, a.precision)[0], !a.enableCropCross && getBoxIsIntersectWithBoxList(t3, R) ? Y() : (R.push(t3), tt("add", j([t3])))), T = void 0;
          }
        } else
          B && (t2 = getVertexPositionByTwoPoints(g, _), e2 = initBoundingArrScale([e2 = transfromRect2Box(B, y, m)], m, a.precision)[0], Object.assign(e2, { isShow: true, __newAdd: true, __vertexPosition: t2 }), D.push(e2), et("add", z([e2])), B = void 0);
      O.resizeCropHovering = void 0, O.isDrawRecting = false, g = lodash.exports.cloneDeep(defaultPoint), _ = lodash.exports.cloneDeep(defaultPoint), L.value.style.cursor = "auto";
    }
  }
  function tt(t2, e2) {
    var n2 = j(R);
    o("update:cropList", n2), o("cropListChange", { type: t2, list: e2 });
  }
  function et(t2, e2) {
    let n2 = { type: t2, list: e2 };
    if (t2 === "add") {
      let t3 = e2.filter((t4) => Reflect.get(t4, "__parentCrop"))[0];
      t3 && (n2.parentCrop = j([Reflect.get(t3, "__parentCrop")])[0], delete t3.__parentCrop);
    }
    o("tagListChange", n2);
    t2 = z(D);
    o("update:tagList", t2);
  }
  function z(t2) {
    let e2 = t2 || D, r2 = R, o2 = [];
    return e2.forEach((t3) => {
      let e3 = t3;
      if (!a.enableDrawTagOutOfCrop && e3.__newAdd && e3.__vertexPosition) {
        t3 = pointIsInBoxList(getPointByBoxAndVertexPosition(e3, e3.__vertexPosition), r2).boxList[0];
        if (!t3)
          return;
        var n2 = getTwoBoxIntersectPart(e3, t3);
        n2 && isBoxValidity(n2) ? (Object.assign(e3, n2), e3.__parentCrop = t3) : e3.__isValidity = false;
      }
      delete e3.__newAdd, Reflect.deleteProperty(e3, "__vertexPosition"), a.enableDrawTagOutOfCrop && !a.enableDrawTagOutOfImg && (t3 = { startX: 0, startY: 0, endX: (n2 = v).width, endY: n2.height }, (n2 = getTwoBoxIntersectPart(e3, t3)) && isBoxValidity(n2) ? Object.assign(e3, n2) : e3.__isValidity = false);
      t3 = fixBoxInfo(e3);
      o2.push(transformBoxPrecision(t3.info, a.precision));
    }), o2.filter((t3) => t3.__isValidity !== false);
  }
  function j(t2) {
    let e2 = t2 || R, n2 = e2.map((t3) => {
      let e3 = t3;
      a.enableDrawCropOutOfImg || (n3 = { startX: 0, startY: 0, endX: (n3 = v).width, endY: n3.height }, (n3 = getTwoBoxIntersectPart(e3, n3)) && isBoxValidity(n3) ? e3 = __spreadValues(__spreadValues({}, t3), n3) : e3._del = true), Reflect.deleteProperty(e3, "__vertexPosition");
      var n3, t3 = fixBoxInfo(e3);
      return transformBoxPrecision(t3.info, a.precision);
    });
    return n2.filter((t3) => !t3._del);
  }
  function nt(t2) {
    var e2;
    l && s && d && (e2 = new Date().getTime(), i = e2, f.prev.down ? f.last.down = e2 : f.prev.down = e2, e2 = amendDpi(e2 = { layerX: Reflect.get(t2, "layerX"), layerY: Reflect.get(t2, "layerY") }, ["layerX", "layerY"]), g = { x: e2.layerX, y: e2.layerY }, a.mode === "crop" && !r && a.enableCropResize && (t2 = detectEventIsTriggerOnCropBorderOrVertex(e2, R, I, y, w)).hasIn && (O.resizeCropHovering = findOneBorderOrVertex(t2.list), o("resizeStart", { index: O.resizeCropHovering.index, box: R[O.resizeCropHovering.index] })));
  }
  onBeforeUnmount(() => {
    window.removeEventListener("resize", K), device.mobile() || (document.removeEventListener("keydown", H), document.removeEventListener("keyup", $)), M();
  }), onMounted(() => {
    E.init(), window.addEventListener("resize", K);
  }), watch(() => a.mode, (t2) => {
    t2 === "tag" && (L.value.style.cursor = "auto");
  }), watch(() => a.src, (t2) => {
    t2 && E.init();
  }), watch(() => a.mobileOperation, (t2) => {
    l && G();
  }), watch(() => a.tagList, (t2) => {
    l && (D = initBoundingArrScale(t2, m, a.precision), Y());
  }, { deep: true }), watch(() => a.cropList, (t2) => {
    l && (R = initBoundingArrScale(t2, m, a.precision), Y());
  });
  let rt = lodash.exports.throttle(function(e2) {
    if (e2) {
      e2 = getTouchPoint(e2, I, w, "over");
      let t2 = lodash.exports.cloneDeep(e2);
      t2.x -= y.x, t2.y -= y.y, t2.x /= m, t2.y /= m, o("mouseOverInfo", { canvas: e2, img: t2 });
    } else
      o("mouseOverInfo", { canvas: null, img: null });
  }, 100, { leading: false, trailing: true });
  function ot(t2) {
    l && (t2 = amendDpi(t2 = { layerX: Reflect.get(t2, "layerX"), layerY: Reflect.get(t2, "layerY") }, ["layerX", "layerY"]), u = new Date().getTime(), E.onMouseOverMove(t2), rt(t2));
  }
  function it() {
    var t2;
    l && (t2 = new Date().getTime(), f.prev.up ? f.last.up = t2 : f.prev.up = t2, Q());
  }
  function at() {
    l && (L.value.style.cursor = "auto", Q(), rt());
  }
  function ut(t2) {
    var e2;
    A(), l && (t2 = getTouchPoint(amendDpi({ layerX: Reflect.get(t2, "layerX"), layerY: Reflect.get(t2, "layerY") }, ["layerX", "layerY"]), I, w, "click"), e2 = u && i ? u - i : 0, i = void 0, u = void 0, 100 < e2 || (E.onCick(t2), f.prev.up && f.prev.down && f.last.up && f.last.down && (f.last.up - f.prev.down < 360 && E.onDoubleClick(t2), f.prev.down = f.last.down, f.prev.up = f.last.up, f.last.down = void 0, f.last.up = void 0)));
  }
  function ct(t2) {
    A(), i = new Date().getTime();
    var e2 = t2.touches;
    if (t2.touches.length === 1 && nt({ layerX: e2[0].clientX, layerY: e2[0].clientY }), t2.touches.length == 2) {
      if (!C)
        throw new Error("can't find  containerInfo.");
      e2 = amendMobileTouchEventDpi(t2);
      getTwoFingerTouchListDistence(e2), W = { x: (e2[0].clientX + e2[1].clientX) / 2 - C.left, y: (e2[0].clientY + e2[1].clientY) / 2 - C.top };
    }
  }
  function ft(t2) {
    u = new Date().getTime();
    var e2 = t2.touches;
    if (t2.touches.length === 1 && ot({ layerX: e2[0].clientX, layerY: e2[0].clientY }), t2.touches.length == 2) {
      if (!C)
        throw new Error("can't find  containerInfo.");
      var { width: e2, height: t2 } = getTwoFingerTouchListDistence(amendMobileTouchEventDpi(t2)), e2 = getHypotenuseValue(e2, t2), t2 = -(e2 - U);
      U = e2, Z({ onTouchMove: true, deltaY: t2, preventDefault() {
        console.log("none");
      }, clientX: W.x, clientY: W.y });
    }
  }
  function lt(t2) {
    it();
  }
  function st(r2) {
    if (r2.length !== 0) {
      let t2 = [], n2 = [], e2 = j();
      e2.forEach((e3) => {
        (r2.find((t3) => {
          t3 = fixBoxInfo(t3).info;
          return t3.startX === e3.startX && t3.endX === e3.endX && t3.startY === e3.startY && t3.endY === e3.endY;
        }) ? n2 : t2).push(e3);
      }), R = initBoundingArrScale(t2, m, a.precision), o("delCrop", n2), Y(), tt("delete", j(n2));
    }
  }
  return t({ removeTagItems: function(n2) {
    let r2 = [], o2 = [];
    if (n2.length !== 0) {
      let t2 = z();
      t2.forEach((e2) => {
        (n2.find((t3) => {
          t3 = fixBoxInfo(t3).info;
          return t3.startX === e2.startX && t3.endX === e2.endX && t3.startY === e2.startY && t3.endY === e2.endY;
        }) ? o2 : r2).push(e2);
      });
    }
    D = initBoundingArrScale(r2, m, a.precision), Y(), et("delete", o2);
  }, getTagListGroupByCropIndex: function(n2 = "startPoint") {
    let t2 = z(), r2 = j();
    return t2.forEach((t3) => {
      var e2;
      n2 === "startPoint" && (e2 = pointIsInBoxList({ x: t3.startX, y: t3.startY }, r2), t3.__groupIndex = e2.indexList[0]), n2 === "allIn" && (e2 = boxAllInBoxList(t3, r2), t3.__groupIndex = e2.indexList[0]);
    }), lodash.exports.groupBy(t2, "__groupIndex");
  } }), (t2, e2) => (openBlock(), createElementBlock("div", { class: "comp-ocr-img", ref_key: "containerRef", ref: L, onMousedown: nt, onMouseenter: A, onClick: ut, onMouseup: it, onMousemove: ot, onMouseout: at, onMousewheel: withModifiers(Z, ["stop"]), onTouchmove: withModifiers(ft, ["stop", "prevent"]), onTouchstart: withModifiers(ct, ["stop"]), onTouchend: withModifiers(lt, ["stop"]) }, [createElementVNode("canvas", { class: "canvas", ref_key: "canvasRef", ref: V }, null, 512), createElementVNode("canvas", { class: "canvas2", ref_key: "canvas2Ref", ref: N }, null, 512), unref(a).isShowTip ? (openBlock(), createElementBlock("div", _hoisted_2, [createElementVNode("div", _hoisted_3, [createElementVNode("div", { class: normalizeClass(["circle", { crop: n.mode === "crop", tag: n.mode === "tag" }]) }, null, 2), createElementVNode("div", _hoisted_4, toDisplayString(n.mode === "crop" ? "\u88C1\u526A\u6A21\u5F0F" : "\u6807\u8BB0\u9519\u8BEF\u884C"), 1)]), createElementVNode("div", _hoisted_5, [renderSlot(t2.$slots, "tip", {}, () => [_hoisted_6, _hoisted_7, _hoisted_8, _hoisted_9], true)])])) : createCommentVNode("", true)], 40, _hoisted_1));
} });
var ImgMark = _export_sfc(_sfc_main, [["__scopeId", "data-v-f0d1cdfc"]]);
export { ImgMark, boxIsAllInOtherBox, transformTagBoxRelativeTo, transformTagListBoxRelativeTo };
