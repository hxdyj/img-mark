import { defineComponent, computed, ref, onBeforeUnmount, onMounted, watch, openBlock, createElementBlock, withModifiers, createElementVNode, unref, normalizeClass, toDisplayString, renderSlot, createCommentVNode, createTextVNode, nextTick, pushScopeId, popScopeId } from "vue";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
  return typeof t;
} : function(t) {
  return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, previousDevice = window.device, device = {}, changeOrientationList = [], documentElement = (window.device = device, window.document.documentElement), userAgent = window.navigator.userAgent.toLowerCase(), television = ["googletv", "viera", "smarttv", "internet.tv", "netcast", "nettv", "appletv", "boxee", "kylo", "roku", "dlnadoc", "pov_tv", "hbbtv", "ce-html"];
function includes(t, e) {
  return -1 !== t.indexOf(e);
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
  var t = "MacIntel" === navigator.platform && 1 < navigator.maxTouchPoints;
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
  return window.cordova && "file:" === location.protocol;
}, device.nodeWebkit = function() {
  return "object" === _typeof(window.process);
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
  return screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? includes(screen.orientation.type, "portrait") : device.ios() && Object.prototype.hasOwnProperty.call(window, "orientation") ? 90 !== Math.abs(window.orientation) : 1 < window.innerHeight / window.innerWidth;
}, device.landscape = function() {
  return screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? includes(screen.orientation.type, "landscape") : device.ios() && Object.prototype.hasOwnProperty.call(window, "orientation") ? 90 === Math.abs(window.orientation) : window.innerHeight / window.innerWidth < 1;
}, device.noConflict = function() {
  return window.device = previousDevice, this;
}, device.ios() ? device.ipad() ? addClass("ios ipad tablet") : device.iphone() ? addClass("ios iphone mobile") : device.ipod() && addClass("ios ipod mobile") : device.macos() ? addClass("macos desktop") : device.android() ? device.androidTablet() ? addClass("android tablet") : addClass("android mobile") : device.blackberry() ? device.blackberryTablet() ? addClass("blackberry tablet") : addClass("blackberry mobile") : device.windows() ? device.windowsTablet() ? addClass("windows tablet") : device.windowsPhone() ? addClass("windows mobile") : addClass("windows desktop") : device.fxos() ? device.fxosTablet() ? addClass("fxos tablet") : addClass("fxos mobile") : device.meego() ? addClass("meego mobile") : device.nodeWebkit() ? addClass("node-webkit") : device.television() ? addClass("television") : device.desktop() && addClass("desktop"), device.cordova() && addClass("cordova"), device.onChangeOrientation = function(t) {
  "function" == typeof t && changeOrientationList.push(t);
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
var commonjsGlobal = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, lodash = { exports: {} };
!function(R, L) {
  !function() {
    var Wo, Ho = "Expected a function", ya = "__lodash_hash_undefined__", wa = "__lodash_placeholder__", ma = 16, Fo = 32, Vo = 64, No = 128, xa = 256, Uo = 1 / 0, $o = 9007199254740991, ba = NaN, qo = 4294967295, Ca = [["ary", No], ["bind", 1], ["bindKey", 2], ["curry", 8], ["curryRight", ma], ["flip", 512], ["partial", Fo], ["partialRight", Vo], ["rearg", xa]], Go = "[object Arguments]", Ia = "[object Array]", Zo = "[object Boolean]", Ko = "[object Date]", Ba = "[object Error]", Ta = "[object Function]", Da = "[object GeneratorFunction]", Jo = "[object Map]", Qo = "[object Number]", ta = "[object Object]", Sa = "[object Promise]", Ra = "[object RegExp]", ea = "[object Set]", La = "[object String]", Oa = "[object Symbol]", ka = "[object WeakMap]", Ea = "[object ArrayBuffer]", na = "[object DataView]", za = "[object Float32Array]", Aa = "[object Float64Array]", Ya = "[object Int8Array]", ja = "[object Int16Array]", Pa = "[object Int32Array]", Xa = "[object Uint8Array]", Ma = "[object Uint8ClampedArray]", Wa = "[object Uint16Array]", Ha = "[object Uint32Array]", Fa = /\b__p \+= '';/g, Va = /\b(__p \+=) '' \+/g, Na = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Ua = /&(?:amp|lt|gt|quot|#39);/g, $a = /[&<>"']/g, qa = RegExp(Ua.source), Ga = RegExp($a.source), Za = /<%-([\s\S]+?)%>/g, Ka = /<%([\s\S]+?)%>/g, Ja = /<%=([\s\S]+?)%>/g, Qa = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, tu = /^\w*$/, eu = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, nu = /[\\^$.*+?()[\]{}|]/g, ru = RegExp(nu.source), iu = /^\s+/, o = /\s/, ou = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, au = /\{\n\/\* \[wrapped with (.+)\] \*/, uu = /,? & /, cu = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, fu = /[()=,{}\[\]\/\s]/, lu = /\\(\\)?/g, su = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, du = /\w*$/, hu = /^[-+]0x[0-9a-f]+$/i, pu = /^0b[01]+$/i, vu = /^\[object .+?Constructor\]$/, gu = /^0o[0-7]+$/i, _u = /^(?:0|[1-9]\d*)$/, yu = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, wu = /($^)/, mu = /['\n\r\u2028\u2029\\]/g, a = "\\ud800-\\udfff", u = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff", c = "\\u2700-\\u27bf", t = "a-z\\xdf-\\xf6\\xf8-\\xff", e = "A-Z\\xc0-\\xd6\\xd8-\\xde", f = "\\ufe0e\\ufe0f", l = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", s = "['\u2019]", n = "[" + a + "]", d = "[" + l + "]", h = "[" + u + "]", p = "[" + c + "]", v = "[" + t + "]", l = "[^" + a + l + "\\d+" + c + t + e + "]", c = "\\ud83c[\\udffb-\\udfff]", t = "[^" + a + "]", g = "(?:\\ud83c[\\udde6-\\uddff]){2}", r = "[\\ud800-\\udbff][\\udc00-\\udfff]", e = "[" + e + "]", _ = "\\u200d", y = "(?:" + v + "|" + l + ")", l = "(?:" + e + "|" + l + ")", w = "(?:['\u2019](?:d|ll|m|re|s|t|ve))?", m = "(?:['\u2019](?:D|LL|M|RE|S|T|VE))?", x = "(?:" + h + "|" + c + ")?", b = "[" + f + "]?", b = b + x + ("(?:" + _ + "(?:" + [t, g, r].join("|") + ")" + b + x + ")*"), x = "(?:" + [p, g, r].join("|") + ")" + b, p = "(?:" + [t + h + "?", h, g, r, n].join("|") + ")", xu = RegExp(s, "g"), bu = RegExp(h, "g"), C = RegExp(c + "(?=" + c + ")|" + p + b, "g"), Cu = RegExp([e + "?" + v + "+" + w + "(?=" + [d, e, "$"].join("|") + ")", l + "+" + m + "(?=" + [d, e + y, "$"].join("|") + ")", e + "?" + y + "+" + w, e + "+" + m, "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", "\\d+", x].join("|"), "g"), I = RegExp("[" + _ + a + u + f + "]"), Iu = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, Bu = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"], Tu = -1, ra = {}, ia = (ra[za] = ra[Aa] = ra[Ya] = ra[ja] = ra[Pa] = ra[Xa] = ra[Ma] = ra[Wa] = ra[Ha] = true, ra[Go] = ra[Ia] = ra[Ea] = ra[Zo] = ra[na] = ra[Ko] = ra[Ba] = ra[Ta] = ra[Jo] = ra[Qo] = ra[ta] = ra[Ra] = ra[ea] = ra[La] = ra[ka] = false, {}), B = (ia[Go] = ia[Ia] = ia[Ea] = ia[na] = ia[Zo] = ia[Ko] = ia[za] = ia[Aa] = ia[Ya] = ia[ja] = ia[Pa] = ia[Jo] = ia[Qo] = ia[ta] = ia[Ra] = ia[ea] = ia[La] = ia[Oa] = ia[Xa] = ia[Ma] = ia[Wa] = ia[Ha] = true, ia[Ba] = ia[Ta] = ia[ka] = false, { "\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029" }), Du = parseFloat, Su = parseInt, t = "object" == typeof commonjsGlobal && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal, g = "object" == typeof self && self && self.Object === Object && self, oa = t || g || Function("return this")(), r = L && !L.nodeType && L, i = r && R && !R.nodeType && R, Ru = i && i.exports === r, T = Ru && t.process, n = function() {
      try {
        var t2 = i && i.require && i.require("util").types;
        return t2 ? t2 : T && T.binding && T.binding("util");
      } catch (t3) {
      }
    }(), Lu = n && n.isArrayBuffer, Ou = n && n.isDate, ku = n && n.isMap, Eu = n && n.isRegExp, zu = n && n.isSet, Au = n && n.isTypedArray;
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
    function Yu(t2, e2, n2, r2) {
      for (var i2 = -1, o2 = null == t2 ? 0 : t2.length; ++i2 < o2; ) {
        var a2 = t2[i2];
        e2(r2, a2, n2(a2), t2);
      }
      return r2;
    }
    function ua(t2, e2) {
      for (var n2 = -1, r2 = null == t2 ? 0 : t2.length; ++n2 < r2 && false !== e2(t2[n2], n2, t2); )
        ;
      return t2;
    }
    function ju(t2, e2) {
      for (var n2 = null == t2 ? 0 : t2.length; n2-- && false !== e2(t2[n2], n2, t2); )
        ;
      return t2;
    }
    function Pu(t2, e2) {
      for (var n2 = -1, r2 = null == t2 ? 0 : t2.length; ++n2 < r2; )
        if (!e2(t2[n2], n2, t2))
          return false;
      return true;
    }
    function ca(t2, e2) {
      for (var n2 = -1, r2 = null == t2 ? 0 : t2.length, i2 = 0, o2 = []; ++n2 < r2; ) {
        var a2 = t2[n2];
        e2(a2, n2, t2) && (o2[i2++] = a2);
      }
      return o2;
    }
    function Xu(t2, e2) {
      return !!(null == t2 ? 0 : t2.length) && -1 < sa(t2, e2, 0);
    }
    function Mu(t2, e2, n2) {
      for (var r2 = -1, i2 = null == t2 ? 0 : t2.length; ++r2 < i2; )
        if (n2(e2, t2[r2]))
          return true;
      return false;
    }
    function fa(t2, e2) {
      for (var n2 = -1, r2 = null == t2 ? 0 : t2.length, i2 = Array(r2); ++n2 < r2; )
        i2[n2] = e2(t2[n2], n2, t2);
      return i2;
    }
    function la(t2, e2) {
      for (var n2 = -1, r2 = e2.length, i2 = t2.length; ++n2 < r2; )
        t2[i2 + n2] = e2[n2];
      return t2;
    }
    function Wu(t2, e2, n2, r2) {
      var i2 = -1, o2 = null == t2 ? 0 : t2.length;
      for (r2 && o2 && (n2 = t2[++i2]); ++i2 < o2; )
        n2 = e2(n2, t2[i2], i2, t2);
      return n2;
    }
    function Hu(t2, e2, n2, r2) {
      var i2 = null == t2 ? 0 : t2.length;
      for (r2 && i2 && (n2 = t2[--i2]); i2--; )
        n2 = e2(n2, t2[i2], i2, t2);
      return n2;
    }
    function Fu(t2, e2) {
      for (var n2 = -1, r2 = null == t2 ? 0 : t2.length; ++n2 < r2; )
        if (e2(t2[n2], n2, t2))
          return true;
      return false;
    }
    var D = Gu("length");
    function Vu(t2, r2, e2) {
      var i2;
      return e2(t2, function(t3, e3, n2) {
        if (r2(t3, e3, n2))
          return i2 = e3, false;
      }), i2;
    }
    function Nu(t2, e2, n2, r2) {
      for (var i2 = t2.length, o2 = n2 + (r2 ? 1 : -1); r2 ? o2-- : ++o2 < i2; )
        if (e2(t2[o2], o2, t2))
          return o2;
      return -1;
    }
    function sa(t2, e2, n2) {
      if (e2 != e2)
        return Nu(t2, $u, n2);
      for (var r2 = t2, i2 = e2, o2 = n2 - 1, a2 = r2.length; ++o2 < a2; )
        if (r2[o2] === i2)
          return o2;
      return -1;
    }
    function Uu(t2, e2, n2, r2) {
      for (var i2 = n2 - 1, o2 = t2.length; ++i2 < o2; )
        if (r2(t2[i2], e2))
          return i2;
      return -1;
    }
    function $u(t2) {
      return t2 != t2;
    }
    function qu(t2, e2) {
      var n2 = null == t2 ? 0 : t2.length;
      return n2 ? Ku(t2, e2) / n2 : ba;
    }
    function Gu(e2) {
      return function(t2) {
        return null == t2 ? Wo : t2[e2];
      };
    }
    function S(e2) {
      return function(t2) {
        return null == e2 ? Wo : e2[t2];
      };
    }
    function Zu(t2, r2, i2, o2, e2) {
      return e2(t2, function(t3, e3, n2) {
        i2 = o2 ? (o2 = false, t3) : r2(i2, t3, e3, n2);
      }), i2;
    }
    function Ku(t2, e2) {
      for (var n2, r2 = -1, i2 = t2.length; ++r2 < i2; ) {
        var o2 = e2(t2[r2]);
        o2 !== Wo && (n2 = n2 === Wo ? o2 : n2 + o2);
      }
      return n2;
    }
    function Ju(t2, e2) {
      for (var n2 = -1, r2 = Array(t2); ++n2 < t2; )
        r2[n2] = e2(n2);
      return r2;
    }
    function Qu(t2) {
      return t2 && t2.slice(0, lc(t2) + 1).replace(iu, "");
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
    var ic = S({ "\xC0": "A", "\xC1": "A", "\xC2": "A", "\xC3": "A", "\xC4": "A", "\xC5": "A", "\xE0": "a", "\xE1": "a", "\xE2": "a", "\xE3": "a", "\xE4": "a", "\xE5": "a", "\xC7": "C", "\xE7": "c", "\xD0": "D", "\xF0": "d", "\xC8": "E", "\xC9": "E", "\xCA": "E", "\xCB": "E", "\xE8": "e", "\xE9": "e", "\xEA": "e", "\xEB": "e", "\xCC": "I", "\xCD": "I", "\xCE": "I", "\xCF": "I", "\xEC": "i", "\xED": "i", "\xEE": "i", "\xEF": "i", "\xD1": "N", "\xF1": "n", "\xD2": "O", "\xD3": "O", "\xD4": "O", "\xD5": "O", "\xD6": "O", "\xD8": "O", "\xF2": "o", "\xF3": "o", "\xF4": "o", "\xF5": "o", "\xF6": "o", "\xF8": "o", "\xD9": "U", "\xDA": "U", "\xDB": "U", "\xDC": "U", "\xF9": "u", "\xFA": "u", "\xFB": "u", "\xFC": "u", "\xDD": "Y", "\xFD": "y", "\xFF": "y", "\xC6": "Ae", "\xE6": "ae", "\xDE": "Th", "\xFE": "th", "\xDF": "ss", "\u0100": "A", "\u0102": "A", "\u0104": "A", "\u0101": "a", "\u0103": "a", "\u0105": "a", "\u0106": "C", "\u0108": "C", "\u010A": "C", "\u010C": "C", "\u0107": "c", "\u0109": "c", "\u010B": "c", "\u010D": "c", "\u010E": "D", "\u0110": "D", "\u010F": "d", "\u0111": "d", "\u0112": "E", "\u0114": "E", "\u0116": "E", "\u0118": "E", "\u011A": "E", "\u0113": "e", "\u0115": "e", "\u0117": "e", "\u0119": "e", "\u011B": "e", "\u011C": "G", "\u011E": "G", "\u0120": "G", "\u0122": "G", "\u011D": "g", "\u011F": "g", "\u0121": "g", "\u0123": "g", "\u0124": "H", "\u0126": "H", "\u0125": "h", "\u0127": "h", "\u0128": "I", "\u012A": "I", "\u012C": "I", "\u012E": "I", "\u0130": "I", "\u0129": "i", "\u012B": "i", "\u012D": "i", "\u012F": "i", "\u0131": "i", "\u0134": "J", "\u0135": "j", "\u0136": "K", "\u0137": "k", "\u0138": "k", "\u0139": "L", "\u013B": "L", "\u013D": "L", "\u013F": "L", "\u0141": "L", "\u013A": "l", "\u013C": "l", "\u013E": "l", "\u0140": "l", "\u0142": "l", "\u0143": "N", "\u0145": "N", "\u0147": "N", "\u014A": "N", "\u0144": "n", "\u0146": "n", "\u0148": "n", "\u014B": "n", "\u014C": "O", "\u014E": "O", "\u0150": "O", "\u014D": "o", "\u014F": "o", "\u0151": "o", "\u0154": "R", "\u0156": "R", "\u0158": "R", "\u0155": "r", "\u0157": "r", "\u0159": "r", "\u015A": "S", "\u015C": "S", "\u015E": "S", "\u0160": "S", "\u015B": "s", "\u015D": "s", "\u015F": "s", "\u0161": "s", "\u0162": "T", "\u0164": "T", "\u0166": "T", "\u0163": "t", "\u0165": "t", "\u0167": "t", "\u0168": "U", "\u016A": "U", "\u016C": "U", "\u016E": "U", "\u0170": "U", "\u0172": "U", "\u0169": "u", "\u016B": "u", "\u016D": "u", "\u016F": "u", "\u0171": "u", "\u0173": "u", "\u0174": "W", "\u0175": "w", "\u0176": "Y", "\u0177": "y", "\u0178": "Y", "\u0179": "Z", "\u017B": "Z", "\u017D": "Z", "\u017A": "z", "\u017C": "z", "\u017E": "z", "\u0132": "IJ", "\u0133": "ij", "\u0152": "Oe", "\u0153": "oe", "\u0149": "'n", "\u017F": "s" }), oc = S({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" });
    function ac(t2) {
      return "\\" + B[t2];
    }
    function ha(t2) {
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
    function pa(t2, e2) {
      for (var n2 = -1, r2 = t2.length, i2 = 0, o2 = []; ++n2 < r2; ) {
        var a2 = t2[n2];
        a2 !== e2 && a2 !== wa || (t2[n2] = wa, o2[i2++] = n2);
      }
      return o2;
    }
    function fc(t2) {
      var e2 = -1, n2 = Array(t2.size);
      return t2.forEach(function(t3) {
        n2[++e2] = t3;
      }), n2;
    }
    function va(t2) {
      return (ha(t2) ? function(t3) {
        var e2 = C.lastIndex = 0;
        for (; C.test(t3); )
          ++e2;
        return e2;
      } : D)(t2);
    }
    function ga(t2) {
      return ha(t2) ? t2.match(C) || [] : t2.split("");
    }
    function lc(t2) {
      for (var e2 = t2.length; e2-- && o.test(t2.charAt(e2)); )
        ;
      return e2;
    }
    var sc = S({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" });
    var _a = function i2(t2) {
      var b2 = (t2 = null == t2 ? oa : _a.defaults(oa.Object(), t2, _a.pick(oa, Bu))).Array, o2 = t2.Date, k = t2.Error, E = t2.Function, z = t2.Math, v2 = t2.Object, A = t2.RegExp, H = t2.String, y2 = t2.TypeError, F = b2.prototype, V = E.prototype, N = v2.prototype, U = t2["__core-js_shared__"], $ = V.toString, Y = N.hasOwnProperty, q = 0, G = (V = /[^.]+$/.exec(U && U.keys && U.keys.IE_PROTO || "")) ? "Symbol(src)_1." + V : "", Z = N.toString, K = $.call(v2), J = oa._, Q = A("^" + $.call(Y).replace(nu, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), V = Ru ? t2.Buffer : Wo, e2 = t2.Symbol, tt = t2.Uint8Array, et = V ? V.allocUnsafe : Wo, nt = cc(v2.getPrototypeOf, v2), rt = v2.create, it = N.propertyIsEnumerable, ot = F.splice, at = e2 ? e2.isConcatSpreadable : Wo, ut = e2 ? e2.iterator : Wo, ct = e2 ? e2.toStringTag : Wo, ft = function() {
        try {
          var t3 = Jn(v2, "defineProperty");
          return t3({}, "", {}), t3;
        } catch (t4) {
        }
      }(), lt = t2.clearTimeout !== oa.clearTimeout && t2.clearTimeout, st = o2 && o2.now !== oa.Date.now && o2.now, dt = t2.setTimeout !== oa.setTimeout && t2.setTimeout, ht = z.ceil, pt = z.floor, vt = v2.getOwnPropertySymbols, V = V ? V.isBuffer : Wo, gt = t2.isFinite, _t = F.join, yt = cc(v2.keys, v2), w2 = z.max, C2 = z.min, wt = o2.now, mt = t2.parseInt, xt = z.random, bt = F.reverse, o2 = Jn(t2, "DataView"), Ct = Jn(t2, "Map"), It = Jn(t2, "Promise"), Bt = Jn(t2, "Set"), t2 = Jn(t2, "WeakMap"), Tt = Jn(v2, "create"), Dt = t2 && new t2(), St = {}, Rt = Cr(o2), Lt = Cr(Ct), Ot = Cr(It), kt = Cr(Bt), Et = Cr(t2), e2 = e2 ? e2.prototype : Wo, zt = e2 ? e2.valueOf : Wo, At = e2 ? e2.toString : Wo;
      function p2(t3) {
        if (W(t3) && !M(t3) && !(t3 instanceof _2)) {
          if (t3 instanceof g2)
            return t3;
          if (Y.call(t3, "__wrapped__"))
            return Ir(t3);
        }
        return new g2(t3);
      }
      var Yt = function(t3) {
        if (!B2(t3))
          return {};
        if (rt)
          return rt(t3);
        jt.prototype = t3;
        t3 = new jt();
        return jt.prototype = Wo, t3;
      };
      function jt() {
      }
      function Pt() {
      }
      function g2(t3, e3) {
        this.__wrapped__ = t3, this.__actions__ = [], this.__chain__ = !!e3, this.__index__ = 0, this.__values__ = Wo;
      }
      function _2(t3) {
        this.__wrapped__ = t3, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = false, this.__iteratees__ = [], this.__takeCount__ = qo, this.__views__ = [];
      }
      function Xt(t3) {
        var e3 = -1, n3 = null == t3 ? 0 : t3.length;
        for (this.clear(); ++e3 < n3; ) {
          var r3 = t3[e3];
          this.set(r3[0], r3[1]);
        }
      }
      function Mt(t3) {
        var e3 = -1, n3 = null == t3 ? 0 : t3.length;
        for (this.clear(); ++e3 < n3; ) {
          var r3 = t3[e3];
          this.set(r3[0], r3[1]);
        }
      }
      function Wt(t3) {
        var e3 = -1, n3 = null == t3 ? 0 : t3.length;
        for (this.clear(); ++e3 < n3; ) {
          var r3 = t3[e3];
          this.set(r3[0], r3[1]);
        }
      }
      function Ht(t3) {
        var e3 = -1, n3 = null == t3 ? 0 : t3.length;
        for (this.__data__ = new Wt(); ++e3 < n3; )
          this.add(t3[e3]);
      }
      function j(t3) {
        t3 = this.__data__ = new Mt(t3);
        this.size = t3.size;
      }
      function Ft(t3, e3) {
        var n3, r3 = M(t3), i3 = !r3 && _i(t3), o3 = !r3 && !i3 && wi(t3), a3 = !r3 && !i3 && !o3 && Li(t3), u3 = r3 || i3 || o3 || a3, c3 = u3 ? Ju(t3.length, H) : [], f3 = c3.length;
        for (n3 in t3)
          !e3 && !Y.call(t3, n3) || u3 && ("length" == n3 || o3 && ("offset" == n3 || "parent" == n3) || a3 && ("buffer" == n3 || "byteLength" == n3 || "byteOffset" == n3) || ir(n3, f3)) || c3.push(n3);
        return c3;
      }
      function Vt(t3) {
        var e3 = t3.length;
        return e3 ? t3[Pe(0, e3 - 1)] : Wo;
      }
      function Nt(t3, e3) {
        return wr(I2(t3), te(e3, 0, t3.length));
      }
      function Ut(t3) {
        return wr(I2(t3));
      }
      function $t(t3, e3, n3) {
        (n3 === Wo || X(t3[e3], n3)) && (n3 !== Wo || e3 in t3) || Jt(t3, e3, n3);
      }
      function qt(t3, e3, n3) {
        var r3 = t3[e3];
        Y.call(t3, e3) && X(r3, n3) && (n3 !== Wo || e3 in t3) || Jt(t3, e3, n3);
      }
      function Gt(t3, e3) {
        for (var n3 = t3.length; n3--; )
          if (X(t3[n3][0], e3))
            return n3;
        return -1;
      }
      function Zt(t3, r3, i3, o3) {
        return ie(t3, function(t4, e3, n3) {
          r3(o3, t4, i3(t4), n3);
        }), o3;
      }
      function Kt(t3, e3) {
        return t3 && gn(e3, R2(e3), t3);
      }
      function Jt(t3, e3, n3) {
        "__proto__" == e3 && ft ? ft(t3, e3, { configurable: true, enumerable: true, value: n3, writable: true }) : t3[e3] = n3;
      }
      function Qt(t3, e3) {
        for (var n3 = -1, r3 = e3.length, i3 = b2(r3), o3 = null == t3; ++n3 < r3; )
          i3[n3] = o3 ? Wo : Vi(t3, e3[n3]);
        return i3;
      }
      function te(t3, e3, n3) {
        return t3 == t3 && (n3 !== Wo && (t3 = t3 <= n3 ? t3 : n3), e3 !== Wo && (t3 = e3 <= t3 ? t3 : e3)), t3;
      }
      function m2(n3, r3, i3, t3, e3, o3) {
        var a3, u3 = 1 & r3, c3 = 2 & r3, f3 = 4 & r3;
        if ((a3 = i3 ? e3 ? i3(n3, t3, e3, o3) : i3(n3) : a3) !== Wo)
          return a3;
        if (!B2(n3))
          return n3;
        var l3, t3 = M(n3);
        if (t3) {
          if (a3 = function(t4) {
            var e4 = t4.length, n4 = new t4.constructor(e4);
            e4 && "string" == typeof t4[0] && Y.call(t4, "index") && (n4.index = t4.index, n4.input = t4.input);
            return n4;
          }(n3), !u3)
            return I2(n3, a3);
        } else {
          var s3 = P(n3), d3 = s3 == Ta || s3 == Da;
          if (wi(n3))
            return ln(n3, u3);
          if (s3 == ta || s3 == Go || d3 && !e3) {
            if (a3 = c3 || d3 ? {} : nr(n3), !u3)
              return c3 ? (h3 = d3 = n3, h3 = (l3 = a3) && gn(h3, L2(h3), l3), gn(d3, tr(d3), h3)) : (d3 = Kt(a3, l3 = n3), gn(l3, Qn(l3), d3));
          } else {
            if (!ia[s3])
              return e3 ? n3 : {};
            a3 = function(t4, e4, n4) {
              var r4 = t4.constructor;
              switch (e4) {
                case Ea:
                  return sn(t4);
                case Zo:
                case Ko:
                  return new r4(+t4);
                case na:
                  return function(t5, e5) {
                    e5 = e5 ? sn(t5.buffer) : t5.buffer;
                    return new t5.constructor(e5, t5.byteOffset, t5.byteLength);
                  }(t4, n4);
                case za:
                case Aa:
                case Ya:
                case ja:
                case Pa:
                case Xa:
                case Ma:
                case Wa:
                case Ha:
                  return dn(t4, n4);
                case Jo:
                  return new r4();
                case Qo:
                case La:
                  return new r4(t4);
                case Ra:
                  return function(t5) {
                    var e5 = new t5.constructor(t5.source, du.exec(t5));
                    return e5.lastIndex = t5.lastIndex, e5;
                  }(t4);
                case ea:
                  return new r4();
                case Oa:
                  return function(t5) {
                    return zt ? v2(zt.call(t5)) : {};
                  }(t4);
              }
            }(n3, s3, u3);
          }
        }
        var h3 = (o3 = o3 || new j()).get(n3);
        if (h3)
          return h3;
        o3.set(n3, a3), Si(n3) ? n3.forEach(function(t4) {
          a3.add(m2(t4, r3, i3, t4, n3, o3));
        }) : Ii(n3) && n3.forEach(function(t4, e4) {
          a3.set(e4, m2(t4, r3, i3, e4, n3, o3));
        });
        var p3 = t3 ? Wo : (f3 ? c3 ? Un : Nn : c3 ? L2 : R2)(n3);
        return ua(p3 || n3, function(t4, e4) {
          p3 && (t4 = n3[e4 = t4]), qt(a3, e4, m2(t4, r3, i3, e4, n3, o3));
        }), a3;
      }
      function ee(t3, e3, n3) {
        var r3 = n3.length;
        if (null == t3)
          return !r3;
        for (t3 = v2(t3); r3--; ) {
          var i3 = n3[r3], o3 = e3[i3], a3 = t3[i3];
          if (a3 === Wo && !(i3 in t3) || !o3(a3))
            return false;
        }
        return true;
      }
      function ne(t3, e3, n3) {
        if ("function" != typeof t3)
          throw new y2(Ho);
        return vr(function() {
          t3.apply(Wo, n3);
        }, e3);
      }
      function re(t3, e3, n3, r3) {
        var i3 = -1, o3 = Xu, a3 = true, u3 = t3.length, c3 = [], f3 = e3.length;
        if (!u3)
          return c3;
        n3 && (e3 = fa(e3, da(n3))), r3 ? (o3 = Mu, a3 = false) : 200 <= e3.length && (o3 = ec, a3 = false, e3 = new Ht(e3));
        t:
          for (; ++i3 < u3; ) {
            var l3 = t3[i3], s3 = null == n3 ? l3 : n3(l3), l3 = r3 || 0 !== l3 ? l3 : 0;
            if (a3 && s3 == s3) {
              for (var d3 = f3; d3--; )
                if (e3[d3] === s3)
                  continue t;
              c3.push(l3);
            } else
              o3(e3, s3, r3) || c3.push(l3);
          }
        return c3;
      }
      p2.templateSettings = { escape: Za, evaluate: Ka, interpolate: Ja, variable: "", imports: { _: p2 } }, (p2.prototype = Pt.prototype).constructor = p2, (g2.prototype = Yt(Pt.prototype)).constructor = g2, (_2.prototype = Yt(Pt.prototype)).constructor = _2, Xt.prototype.clear = function() {
        this.__data__ = Tt ? Tt(null) : {}, this.size = 0;
      }, Xt.prototype.delete = function(t3) {
        return t3 = this.has(t3) && delete this.__data__[t3], this.size -= t3 ? 1 : 0, t3;
      }, Xt.prototype.get = function(t3) {
        var e3, n3 = this.__data__;
        return Tt ? (e3 = n3[t3]) === ya ? Wo : e3 : Y.call(n3, t3) ? n3[t3] : Wo;
      }, Xt.prototype.has = function(t3) {
        var e3 = this.__data__;
        return Tt ? e3[t3] !== Wo : Y.call(e3, t3);
      }, Xt.prototype.set = function(t3, e3) {
        var n3 = this.__data__;
        return this.size += this.has(t3) ? 0 : 1, n3[t3] = Tt && e3 === Wo ? ya : e3, this;
      }, Mt.prototype.clear = function() {
        this.__data__ = [], this.size = 0;
      }, Mt.prototype.delete = function(t3) {
        var e3 = this.__data__;
        return !((t3 = Gt(e3, t3)) < 0) && (t3 == e3.length - 1 ? e3.pop() : ot.call(e3, t3, 1), --this.size, true);
      }, Mt.prototype.get = function(t3) {
        var e3 = this.__data__;
        return (t3 = Gt(e3, t3)) < 0 ? Wo : e3[t3][1];
      }, Mt.prototype.has = function(t3) {
        return -1 < Gt(this.__data__, t3);
      }, Mt.prototype.set = function(t3, e3) {
        var n3 = this.__data__, r3 = Gt(n3, t3);
        return r3 < 0 ? (++this.size, n3.push([t3, e3])) : n3[r3][1] = e3, this;
      }, Wt.prototype.clear = function() {
        this.size = 0, this.__data__ = { hash: new Xt(), map: new (Ct || Mt)(), string: new Xt() };
      }, Wt.prototype.delete = function(t3) {
        return t3 = Zn(this, t3).delete(t3), this.size -= t3 ? 1 : 0, t3;
      }, Wt.prototype.get = function(t3) {
        return Zn(this, t3).get(t3);
      }, Wt.prototype.has = function(t3) {
        return Zn(this, t3).has(t3);
      }, Wt.prototype.set = function(t3, e3) {
        var n3 = Zn(this, t3), r3 = n3.size;
        return n3.set(t3, e3), this.size += n3.size == r3 ? 0 : 1, this;
      }, Ht.prototype.add = Ht.prototype.push = function(t3) {
        return this.__data__.set(t3, ya), this;
      }, Ht.prototype.has = function(t3) {
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
      var ie = wn(se), oe = wn(de, true);
      function ae(t3, r3) {
        var i3 = true;
        return ie(t3, function(t4, e3, n3) {
          return i3 = !!r3(t4, e3, n3);
        }), i3;
      }
      function ue(t3, e3, n3) {
        for (var r3 = -1, i3 = t3.length; ++r3 < i3; ) {
          var o3, a3, u3 = t3[r3], c3 = e3(u3);
          null != c3 && (o3 === Wo ? c3 == c3 && !T2(c3) : n3(c3, o3)) && (o3 = c3, a3 = u3);
        }
        return a3;
      }
      function ce(t3, r3) {
        var i3 = [];
        return ie(t3, function(t4, e3, n3) {
          r3(t4, e3, n3) && i3.push(t4);
        }), i3;
      }
      function c2(t3, e3, n3, r3, i3) {
        var o3 = -1, a3 = t3.length;
        for (n3 = n3 || rr, i3 = i3 || []; ++o3 < a3; ) {
          var u3 = t3[o3];
          0 < e3 && n3(u3) ? 1 < e3 ? c2(u3, e3 - 1, n3, r3, i3) : la(i3, u3) : r3 || (i3[i3.length] = u3);
        }
        return i3;
      }
      var fe = mn(), le = mn(true);
      function se(t3, e3) {
        return t3 && fe(t3, e3, R2);
      }
      function de(t3, e3) {
        return t3 && le(t3, e3, R2);
      }
      function he(e3, t3) {
        return ca(t3, function(t4) {
          return xi(e3[t4]);
        });
      }
      function pe(t3, e3) {
        for (var n3 = 0, r3 = (e3 = an(e3, t3)).length; null != t3 && n3 < r3; )
          t3 = t3[br(e3[n3++])];
        return n3 && n3 == r3 ? t3 : Wo;
      }
      function ve(t3, e3, n3) {
        e3 = e3(t3);
        return M(t3) ? e3 : la(e3, n3(t3));
      }
      function n2(t3) {
        {
          if (null == t3)
            return t3 === Wo ? "[object Undefined]" : "[object Null]";
          if (ct && ct in v2(t3)) {
            var e3 = t3, n3 = Y.call(e3, ct), r3 = e3[ct];
            try {
              e3[ct] = Wo;
              var i3 = true;
            } catch (t4) {
            }
            var o3 = Z.call(e3);
            return i3 && (n3 ? e3[ct] = r3 : delete e3[ct]), o3;
          }
          return Z.call(t3);
        }
      }
      function ge(t3, e3) {
        return e3 < t3;
      }
      function _e(t3, e3) {
        return null != t3 && Y.call(t3, e3);
      }
      function ye(t3, e3) {
        return null != t3 && e3 in v2(t3);
      }
      function we(t3, e3, n3) {
        for (var r3 = n3 ? Mu : Xu, i3 = t3[0].length, o3 = t3.length, a3 = o3, u3 = b2(o3), c3 = 1 / 0, f3 = []; a3--; ) {
          var l3 = t3[a3];
          a3 && e3 && (l3 = fa(l3, da(e3))), c3 = C2(l3.length, c3), u3[a3] = !n3 && (e3 || 120 <= i3 && 120 <= l3.length) ? new Ht(a3 && l3) : Wo;
        }
        var l3 = t3[0], s3 = -1, d3 = u3[0];
        t:
          for (; ++s3 < i3 && f3.length < c3; ) {
            var h3 = l3[s3], p3 = e3 ? e3(h3) : h3, h3 = n3 || 0 !== h3 ? h3 : 0;
            if (!(d3 ? ec(d3, p3) : r3(f3, p3, n3))) {
              for (a3 = o3; --a3; ) {
                var v3 = u3[a3];
                if (!(v3 ? ec(v3, p3) : r3(t3[a3], p3, n3)))
                  continue t;
              }
              d3 && d3.push(p3), f3.push(h3);
            }
          }
        return f3;
      }
      function me(t3, e3, n3) {
        e3 = null == (t3 = dr(t3, e3 = an(e3, t3))) ? t3 : t3[br(r2(e3))];
        return null == e3 ? Wo : aa(e3, t3, n3);
      }
      function xe(t3) {
        return W(t3) && n2(t3) == Go;
      }
      function be(t3, e3, n3, r3, i3) {
        {
          if (t3 === e3)
            return true;
          if (null == t3 || null == e3 || !W(t3) && !W(e3))
            return t3 != t3 && e3 != e3;
          var o3 = be, a3 = M(t3), u3 = M(e3), c3 = a3 ? Ia : P(t3), u3 = u3 ? Ia : P(e3), f3 = (c3 = c3 == Go ? ta : c3) == ta, l3 = (u3 = u3 == Go ? ta : u3) == ta, u3;
          if ((u3 = c3 == u3) && wi(t3)) {
            if (!wi(e3))
              return false;
            f3 = !(a3 = true);
          }
          if (u3 && !f3) {
            i3 = i3 || new j();
            if (a3 || Li(t3))
              return Fn(t3, e3, n3, r3, o3, i3);
            else {
              var s3 = t3;
              var d3 = e3;
              var h3 = c3;
              var p3 = n3;
              var v3 = r3;
              var g3 = o3;
              var _3 = i3;
              switch (h3) {
                case na:
                  if (s3.byteLength != d3.byteLength || s3.byteOffset != d3.byteOffset)
                    return false;
                  s3 = s3.buffer, d3 = d3.buffer;
                case Ea:
                  return s3.byteLength == d3.byteLength && g3(new tt(s3), new tt(d3)) ? true : false;
                case Zo:
                case Ko:
                case Qo:
                  return X(+s3, +d3);
                case Ba:
                  return s3.name == d3.name && s3.message == d3.message;
                case Ra:
                case La:
                  return s3 == d3 + "";
                case Jo:
                  var y3 = uc;
                case ea:
                  var w3 = 1 & p3;
                  if (y3 = y3 || fc, s3.size != d3.size && !w3)
                    return false;
                  w3 = _3.get(s3);
                  if (w3)
                    return w3 == d3;
                  p3 |= 2, _3.set(s3, d3);
                  w3 = Fn(y3(s3), y3(d3), p3, v3, g3, _3);
                  return _3.delete(s3), w3;
                case Oa:
                  if (zt)
                    return zt.call(s3) == zt.call(d3);
              }
              return false;
              return;
            }
          }
          if (!(1 & n3)) {
            a3 = f3 && Y.call(t3, "__wrapped__"), c3 = l3 && Y.call(e3, "__wrapped__");
            if (a3 || c3)
              return f3 = a3 ? t3.value() : t3, l3 = c3 ? e3.value() : e3, i3 = i3 || new j(), o3(f3, l3, n3, r3, i3);
          }
          if (u3) {
            i3 = i3 || new j();
            var m3 = t3, x3 = e3, b3 = n3, C3 = r3, I3 = o3, B3 = i3, T3 = 1 & b3, D3 = Nn(m3), S3 = D3.length, a3 = Nn(x3).length;
            if (S3 != a3 && !T3)
              return false;
            for (var R3 = S3; R3--; ) {
              var L3 = D3[R3];
              if (!(T3 ? L3 in x3 : Y.call(x3, L3)))
                return false;
            }
            a3 = B3.get(m3), c3 = B3.get(x3);
            if (a3 && c3)
              return a3 == x3 && c3 == m3;
            for (var O2 = true, k2 = (B3.set(m3, x3), B3.set(x3, m3), T3); ++R3 < S3; ) {
              L3 = D3[R3];
              var E2, z2 = m3[L3], A2 = x3[L3];
              if (!((E2 = C3 ? T3 ? C3(A2, z2, L3, x3, m3, B3) : C3(z2, A2, L3, m3, x3, B3) : E2) === Wo ? z2 === A2 || I3(z2, A2, b3, C3, B3) : E2)) {
                O2 = false;
                break;
              }
              k2 = k2 || "constructor" == L3;
            }
            return O2 && !k2 && (a3 = m3.constructor, c3 = x3.constructor, a3 != c3 && "constructor" in m3 && "constructor" in x3 && !("function" == typeof a3 && a3 instanceof a3 && "function" == typeof c3 && c3 instanceof c3) && (O2 = false)), B3.delete(m3), B3.delete(x3), O2;
          }
          return false;
        }
      }
      function Ce(t3, e3, n3, r3) {
        var i3 = n3.length, o3 = i3, a3 = !r3;
        if (null == t3)
          return !o3;
        for (t3 = v2(t3); i3--; ) {
          var u3 = n3[i3];
          if (a3 && u3[2] ? u3[1] !== t3[u3[0]] : !(u3[0] in t3))
            return false;
        }
        for (; ++i3 < o3; ) {
          var c3 = (u3 = n3[i3])[0], f3 = t3[c3], l3 = u3[1];
          if (a3 && u3[2]) {
            if (f3 === Wo && !(c3 in t3))
              return false;
          } else {
            var s3, d3 = new j();
            if (!((s3 = r3 ? r3(f3, l3, c3, t3, e3, d3) : s3) === Wo ? be(l3, f3, 3, r3, d3) : s3))
              return false;
          }
        }
        return true;
      }
      function Ie(t3) {
        return !(!B2(t3) || (e3 = t3, G && G in e3)) && (xi(t3) ? Q : vu).test(Cr(t3));
        var e3;
      }
      function Be(t3) {
        return "function" == typeof t3 ? t3 : null == t3 ? O : "object" == typeof t3 ? M(t3) ? Oe(t3[0], t3[1]) : Le(t3) : So(t3);
      }
      function Te(t3) {
        if (!cr(t3))
          return yt(t3);
        var e3, n3 = [];
        for (e3 in v2(t3))
          Y.call(t3, e3) && "constructor" != e3 && n3.push(e3);
        return n3;
      }
      function De(t3) {
        if (!B2(t3)) {
          var e3 = t3, n3 = [];
          if (null != e3)
            for (var r3 in v2(e3))
              n3.push(r3);
          return n3;
        }
        var i3, o3 = cr(t3), a3 = [];
        for (i3 in t3)
          ("constructor" != i3 || !o3 && Y.call(t3, i3)) && a3.push(i3);
        return a3;
      }
      function Se(t3, e3) {
        return t3 < e3;
      }
      function Re(t3, r3) {
        var i3 = -1, o3 = l2(t3) ? b2(t3.length) : [];
        return ie(t3, function(t4, e3, n3) {
          o3[++i3] = r3(t4, e3, n3);
        }), o3;
      }
      function Le(e3) {
        var n3 = Kn(e3);
        return 1 == n3.length && n3[0][2] ? lr(n3[0][0], n3[0][1]) : function(t3) {
          return t3 === e3 || Ce(t3, e3, n3);
        };
      }
      function Oe(n3, r3) {
        return or(n3) && fr(r3) ? lr(br(n3), r3) : function(t3) {
          var e3 = Vi(t3, n3);
          return e3 === Wo && e3 === r3 ? Ni(t3, n3) : be(r3, e3, 3);
        };
      }
      function ke(v3, g3, _3, y3, w3) {
        v3 !== g3 && fe(g3, function(t3, e3) {
          var n3, r3, i3, o3, a3, u3, c3, f3, l3, s3, d3, h3, p3;
          w3 = w3 || new j(), B2(t3) ? (r3 = g3, o3 = _3, a3 = ke, u3 = y3, c3 = w3, d3 = hr(n3 = v3, i3 = e3), h3 = hr(r3, i3), (p3 = c3.get(h3)) ? $t(n3, i3, p3) : (p3 = u3 ? u3(d3, h3, i3 + "", n3, r3, c3) : Wo, (r3 = p3 === Wo) && (f3 = M(h3), l3 = !f3 && wi(h3), s3 = !f3 && !l3 && Li(h3), p3 = h3, f3 || l3 || s3 ? p3 = M(d3) ? d3 : x2(d3) ? I2(d3) : l3 ? ln(h3, !(r3 = false)) : s3 ? dn(h3, !(r3 = false)) : [] : Ti(h3) || _i(h3) ? _i(p3 = d3) ? p3 = Yi(d3) : B2(d3) && !xi(d3) || (p3 = nr(h3)) : r3 = false), r3 && (c3.set(h3, p3), a3(p3, h3, o3, u3, c3), c3.delete(h3)), $t(n3, i3, p3))) : (f3 = y3 ? y3(hr(v3, e3), t3, e3 + "", v3, g3, w3) : Wo, $t(v3, e3, f3 = f3 === Wo ? t3 : f3));
        }, L2);
      }
      function Ee(t3, e3) {
        var n3 = t3.length;
        if (n3)
          return ir(e3 += e3 < 0 ? n3 : 0, n3) ? t3[e3] : Wo;
      }
      function ze(t3, r3, l3) {
        r3 = r3.length ? fa(r3, function(e4) {
          return M(e4) ? function(t4) {
            return pe(t4, 1 === e4.length ? e4[0] : e4);
          } : e4;
        }) : [O];
        var i3 = -1;
        r3 = fa(r3, da(s2()));
        var e3 = Re(t3, function(e4, t4, n4) {
          return { criteria: fa(r3, function(t5) {
            return t5(e4);
          }), index: ++i3, value: e4 };
        }), t3 = function(t4, e4) {
          for (var n4 = l3, r4 = -1, i4 = t4.criteria, o3 = e4.criteria, a3 = i4.length, u3 = n4.length; ++r4 < a3; ) {
            var c3 = hn(i4[r4], o3[r4]);
            if (c3) {
              if (u3 <= r4)
                return c3;
              var f3 = n4[r4];
              return c3 * ("desc" == f3 ? -1 : 1);
            }
          }
          return t4.index - e4.index;
        }, n3 = e3.length;
        for (e3.sort(t3); n3--; )
          e3[n3] = e3[n3].value;
        return e3;
      }
      function Ae(t3, e3, n3) {
        for (var r3 = -1, i3 = e3.length, o3 = {}; ++r3 < i3; ) {
          var a3 = e3[r3], u3 = pe(t3, a3);
          n3(u3, a3) && He(o3, an(a3, t3), u3);
        }
        return o3;
      }
      function Ye(t3, e3, n3, r3) {
        var i3 = r3 ? Uu : sa, o3 = -1, a3 = e3.length, u3 = t3;
        for (t3 === e3 && (e3 = I2(e3)), n3 && (u3 = fa(t3, da(n3))); ++o3 < a3; )
          for (var c3 = 0, f3 = e3[o3], l3 = n3 ? n3(f3) : f3; -1 < (c3 = i3(u3, l3, c3, r3)); )
            u3 !== t3 && ot.call(u3, c3, 1), ot.call(t3, c3, 1);
        return t3;
      }
      function je(t3, e3) {
        for (var n3 = t3 ? e3.length : 0, r3 = n3 - 1; n3--; ) {
          var i3, o3 = e3[n3];
          n3 != r3 && o3 === i3 || (ir(i3 = o3) ? ot.call(t3, o3, 1) : Ke(t3, o3));
        }
      }
      function Pe(t3, e3) {
        return t3 + pt(xt() * (e3 - t3 + 1));
      }
      function Xe(t3, e3) {
        var n3 = "";
        if (!t3 || e3 < 1 || $o < e3)
          return n3;
        for (; e3 % 2 && (n3 += t3), (e3 = pt(e3 / 2)) && (t3 += t3), e3; )
          ;
        return n3;
      }
      function a2(t3, e3) {
        return gr(sr(t3, e3, O), t3 + "");
      }
      function Me(t3) {
        return Vt(no(t3));
      }
      function We(t3, e3) {
        t3 = no(t3);
        return wr(t3, te(e3, 0, t3.length));
      }
      function He(t3, e3, n3, r3) {
        if (!B2(t3))
          return t3;
        for (var i3 = -1, o3 = (e3 = an(e3, t3)).length, a3 = o3 - 1, u3 = t3; null != u3 && ++i3 < o3; ) {
          var c3, f3 = br(e3[i3]), l3 = n3;
          if ("__proto__" === f3 || "constructor" === f3 || "prototype" === f3)
            return t3;
          i3 != a3 && (c3 = u3[f3], (l3 = r3 ? r3(c3, f3, u3) : Wo) === Wo && (l3 = B2(c3) ? c3 : ir(e3[i3 + 1]) ? [] : {})), qt(u3, f3, l3), u3 = u3[f3];
        }
        return t3;
      }
      var Fe = Dt ? function(t3, e3) {
        return Dt.set(t3, e3), t3;
      } : O, e2 = ft ? function(t3, e3) {
        return ft(t3, "toString", { configurable: true, enumerable: false, value: _o(e3), writable: true });
      } : O;
      function Ve(t3) {
        return wr(no(t3));
      }
      function u2(t3, e3, n3) {
        for (var r3 = -1, i3 = t3.length, o3 = ((n3 = i3 < n3 ? i3 : n3) < 0 && (n3 += i3), i3 = n3 < (e3 = e3 < 0 ? i3 < -e3 ? 0 : i3 + e3 : e3) ? 0 : n3 - e3 >>> 0, e3 >>>= 0, b2(i3)); ++r3 < i3; )
          o3[r3] = t3[r3 + e3];
        return o3;
      }
      function Ne(t3, r3) {
        var i3;
        return ie(t3, function(t4, e3, n3) {
          return !(i3 = r3(t4, e3, n3));
        }), !!i3;
      }
      function Ue(t3, e3, n3) {
        var r3 = 0, i3 = null == t3 ? r3 : t3.length;
        if ("number" == typeof e3 && e3 == e3 && i3 <= 2147483647) {
          for (; r3 < i3; ) {
            var o3 = r3 + i3 >>> 1, a3 = t3[o3];
            null !== a3 && !T2(a3) && (n3 ? a3 <= e3 : a3 < e3) ? r3 = 1 + o3 : i3 = o3;
          }
          return i3;
        }
        return $e(t3, e3, O, n3);
      }
      function $e(t3, e3, n3, r3) {
        var i3 = 0, o3 = null == t3 ? 0 : t3.length;
        if (0 === o3)
          return 0;
        for (var a3 = (e3 = n3(e3)) != e3, u3 = null === e3, c3 = T2(e3), f3 = e3 === Wo; i3 < o3; ) {
          var l3 = pt((i3 + o3) / 2), s3 = n3(t3[l3]), d3 = s3 !== Wo, h3 = null === s3, p3 = s3 == s3, v3 = T2(s3), p3 = a3 ? r3 || p3 : f3 ? p3 && (r3 || d3) : u3 ? p3 && d3 && (r3 || !h3) : c3 ? p3 && d3 && !h3 && (r3 || !v3) : !h3 && !v3 && (r3 ? s3 <= e3 : s3 < e3);
          p3 ? i3 = l3 + 1 : o3 = l3;
        }
        return C2(o3, 4294967294);
      }
      function qe(t3, e3) {
        for (var n3 = -1, r3 = t3.length, i3 = 0, o3 = []; ++n3 < r3; ) {
          var a3, u3 = t3[n3], c3 = e3 ? e3(u3) : u3;
          n3 && X(c3, a3) || (a3 = c3, o3[i3++] = 0 === u3 ? 0 : u3);
        }
        return o3;
      }
      function Ge(t3) {
        return "number" == typeof t3 ? t3 : T2(t3) ? ba : +t3;
      }
      function f2(t3) {
        if ("string" == typeof t3)
          return t3;
        if (M(t3))
          return fa(t3, f2) + "";
        if (T2(t3))
          return At ? At.call(t3) : "";
        var e3 = t3 + "";
        return "0" == e3 && 1 / t3 == -Uo ? "-0" : e3;
      }
      function Ze(t3, e3, n3) {
        var r3 = -1, i3 = Xu, o3 = t3.length, a3 = true, u3 = [], c3 = u3;
        if (n3)
          a3 = false, i3 = Mu;
        else if (200 <= o3) {
          var f3 = e3 ? null : jn(t3);
          if (f3)
            return fc(f3);
          a3 = false, i3 = ec, c3 = new Ht();
        } else
          c3 = e3 ? [] : u3;
        t:
          for (; ++r3 < o3; ) {
            var l3 = t3[r3], s3 = e3 ? e3(l3) : l3, l3 = n3 || 0 !== l3 ? l3 : 0;
            if (a3 && s3 == s3) {
              for (var d3 = c3.length; d3--; )
                if (c3[d3] === s3)
                  continue t;
              e3 && c3.push(s3), u3.push(l3);
            } else
              i3(c3, s3, n3) || (c3 !== u3 && c3.push(s3), u3.push(l3));
          }
        return u3;
      }
      function Ke(t3, e3) {
        return null == (t3 = dr(t3, e3 = an(e3, t3))) || delete t3[br(r2(e3))];
      }
      function Je(t3, e3, n3, r3) {
        return He(t3, e3, n3(pe(t3, e3)), r3);
      }
      function Qe(t3, e3, n3, r3) {
        for (var i3 = t3.length, o3 = r3 ? i3 : -1; (r3 ? o3-- : ++o3 < i3) && e3(t3[o3], o3, t3); )
          ;
        return n3 ? u2(t3, r3 ? 0 : o3, r3 ? o3 + 1 : i3) : u2(t3, r3 ? o3 + 1 : 0, r3 ? i3 : o3);
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
          return r3 ? Ze(t3[0]) : [];
        for (var i3 = -1, o3 = b2(r3); ++i3 < r3; )
          for (var a3 = t3[i3], u3 = -1; ++u3 < r3; )
            u3 != i3 && (o3[i3] = re(o3[i3] || a3, t3[u3], e3, n3));
        return Ze(c2(o3, 1), e3, n3);
      }
      function nn(t3, e3, n3) {
        for (var r3 = -1, i3 = t3.length, o3 = e3.length, a3 = {}; ++r3 < i3; ) {
          var u3 = r3 < o3 ? e3[r3] : Wo;
          n3(a3, t3[r3], u3);
        }
        return a3;
      }
      function rn(t3) {
        return x2(t3) ? t3 : [];
      }
      function on(t3) {
        return "function" == typeof t3 ? t3 : O;
      }
      function an(t3, e3) {
        return M(t3) ? t3 : or(t3, e3) ? [t3] : xr(h2(t3));
      }
      var un = a2;
      function cn(t3, e3, n3) {
        var r3 = t3.length;
        return n3 = n3 === Wo ? r3 : n3, !e3 && r3 <= n3 ? t3 : u2(t3, e3, n3);
      }
      var fn = lt || function(t3) {
        return oa.clearTimeout(t3);
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
      function hn(t3, e3) {
        if (t3 !== e3) {
          var n3 = t3 !== Wo, r3 = null === t3, i3 = t3 == t3, o3 = T2(t3), a3 = e3 !== Wo, u3 = null === e3, c3 = e3 == e3, f3 = T2(e3);
          if (!u3 && !f3 && !o3 && e3 < t3 || o3 && a3 && c3 && !u3 && !f3 || r3 && a3 && c3 || !n3 && c3 || !i3)
            return 1;
          if (!r3 && !o3 && !f3 && t3 < e3 || f3 && n3 && i3 && !r3 && !o3 || u3 && n3 && i3 || !a3 && i3 || !c3)
            return -1;
        }
        return 0;
      }
      function pn(t3, e3, n3, r3) {
        for (var i3 = -1, o3 = t3.length, a3 = n3.length, u3 = -1, c3 = e3.length, f3 = w2(o3 - a3, 0), l3 = b2(c3 + f3), s3 = !r3; ++u3 < c3; )
          l3[u3] = e3[u3];
        for (; ++i3 < a3; )
          (s3 || i3 < o3) && (l3[n3[i3]] = t3[i3]);
        for (; f3--; )
          l3[u3++] = t3[i3++];
        return l3;
      }
      function vn(t3, e3, n3, r3) {
        for (var i3 = -1, o3 = t3.length, a3 = -1, u3 = n3.length, c3 = -1, f3 = e3.length, l3 = w2(o3 - u3, 0), s3 = b2(l3 + f3), d3 = !r3; ++i3 < l3; )
          s3[i3] = t3[i3];
        for (var h3 = i3; ++c3 < f3; )
          s3[h3 + c3] = e3[c3];
        for (; ++a3 < u3; )
          (d3 || i3 < o3) && (s3[h3 + n3[a3]] = t3[i3++]);
        return s3;
      }
      function I2(t3, e3) {
        var n3 = -1, r3 = t3.length;
        for (e3 = e3 || b2(r3); ++n3 < r3; )
          e3[n3] = t3[n3];
        return e3;
      }
      function gn(t3, e3, n3, r3) {
        for (var i3 = !n3, o3 = (n3 = n3 || {}, -1), a3 = e3.length; ++o3 < a3; ) {
          var u3 = e3[o3], c3 = r3 ? r3(n3[u3], t3[u3], u3, n3, t3) : Wo;
          (i3 ? Jt : qt)(n3, u3, c3 = c3 === Wo ? t3[u3] : c3);
        }
        return n3;
      }
      function _n(i3, o3) {
        return function(t3, e3) {
          var n3 = M(t3) ? Yu : Zt, r3 = o3 ? o3() : {};
          return n3(t3, i3, s2(e3, 2), r3);
        };
      }
      function yn(u3) {
        return a2(function(t3, e3) {
          var n3 = -1, r3 = e3.length, i3 = 1 < r3 ? e3[r3 - 1] : Wo, o3 = 2 < r3 ? e3[2] : Wo, i3 = 3 < u3.length && "function" == typeof i3 ? (r3--, i3) : Wo;
          for (o3 && d2(e3[0], e3[1], o3) && (i3 = r3 < 3 ? Wo : i3, r3 = 1), t3 = v2(t3); ++n3 < r3; ) {
            var a3 = e3[n3];
            a3 && u3(t3, a3, n3, i3);
          }
          return t3;
        });
      }
      function wn(o3, a3) {
        return function(t3, e3) {
          if (null == t3)
            return t3;
          if (!l2(t3))
            return o3(t3, e3);
          for (var n3 = t3.length, r3 = a3 ? n3 : -1, i3 = v2(t3); (a3 ? r3-- : ++r3 < n3) && false !== e3(i3[r3], r3, i3); )
            ;
          return t3;
        };
      }
      function mn(c3) {
        return function(t3, e3, n3) {
          for (var r3 = -1, i3 = v2(t3), o3 = n3(t3), a3 = o3.length; a3--; ) {
            var u3 = o3[c3 ? a3 : ++r3];
            if (false === e3(i3[u3], u3, i3))
              break;
          }
          return t3;
        };
      }
      function xn(r3) {
        return function(t3) {
          var e3 = ha(t3 = h2(t3)) ? ga(t3) : Wo, n3 = e3 ? e3[0] : t3.charAt(0), e3 = e3 ? cn(e3, 1).join("") : t3.slice(1);
          return n3[r3]() + e3;
        };
      }
      function bn(e3) {
        return function(t3) {
          return Wu(po(oo(t3).replace(xu, "")), e3, "");
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
          var e3 = Yt(r3.prototype), n3 = r3.apply(e3, t3);
          return B2(n3) ? n3 : e3;
        };
      }
      function In(o3, a3, u3) {
        var c3 = Cn(o3);
        return function t3() {
          for (var e3 = arguments.length, n3 = b2(e3), r3 = e3, i3 = Gn(t3); r3--; )
            n3[r3] = arguments[r3];
          i3 = e3 < 3 && n3[0] !== i3 && n3[e3 - 1] !== i3 ? [] : pa(n3, i3);
          return (e3 -= i3.length) < u3 ? An(o3, a3, Dn, t3.placeholder, Wo, n3, i3, Wo, Wo, u3 - e3) : aa(this && this !== oa && this instanceof t3 ? c3 : o3, this, n3);
        };
      }
      function Bn(o3) {
        return function(t3, e3, n3) {
          var r3, i3 = v2(t3), e3 = (l2(t3) || (r3 = s2(e3, 3), t3 = R2(t3), e3 = function(t4) {
            return r3(i3[t4], t4, i3);
          }), o3(t3, e3, n3));
          return -1 < e3 ? i3[r3 ? t3[e3] : e3] : Wo;
        };
      }
      function Tn(c3) {
        return Vn(function(i3) {
          var o3 = i3.length, t3 = o3, e3 = g2.prototype.thru;
          for (c3 && i3.reverse(); t3--; ) {
            var n3 = i3[t3];
            if ("function" != typeof n3)
              throw new y2(Ho);
            e3 && !u3 && "wrapper" == qn(n3) && (u3 = new g2([], true));
          }
          for (t3 = u3 ? t3 : o3; ++t3 < o3; )
            var r3 = qn(n3 = i3[t3]), a3 = "wrapper" == r3 ? $n(n3) : Wo, u3 = a3 && ar(a3[0]) && 424 == a3[1] && !a3[4].length && 1 == a3[9] ? u3[qn(a3[0])].apply(u3, a3[3]) : 1 == n3.length && ar(n3) ? u3[r3]() : u3.thru(n3);
          return function() {
            var t4 = arguments, e4 = t4[0];
            if (u3 && 1 == t4.length && M(e4))
              return u3.plant(e4).value();
            for (var n4 = 0, r4 = o3 ? i3[n4].apply(this, t4) : e4; ++n4 < o3; )
              r4 = i3[n4].call(this, r4);
            return r4;
          };
        });
      }
      function Dn(a3, u3, c3, f3, l3, s3, d3, h3, p3, v3) {
        var g3 = u3 & No, _3 = 1 & u3, y3 = 2 & u3, w3 = 24 & u3, m3 = 512 & u3, x3 = y3 ? Wo : Cn(a3);
        return function t3() {
          for (var e3 = b2(o3 = arguments.length), n3 = o3; n3--; )
            e3[n3] = arguments[n3];
          if (w3 && (i3 = function(t4, e4) {
            for (var n4 = t4.length, r4 = 0; n4--; )
              t4[n4] === e4 && ++r4;
            return r4;
          }(e3, r3 = Gn(t3))), f3 && (e3 = pn(e3, f3, l3, w3)), s3 && (e3 = vn(e3, s3, d3, w3)), o3 -= i3, w3 && o3 < v3)
            return i3 = pa(e3, r3), An(a3, u3, Dn, t3.placeholder, c3, e3, i3, h3, p3, v3 - o3);
          var r3 = _3 ? c3 : this, i3 = y3 ? r3[a3] : a3, o3 = e3.length;
          return h3 ? e3 = function(t4, e4) {
            for (var n4 = t4.length, r4 = C2(e4.length, n4), i4 = I2(t4); r4--; ) {
              var o4 = e4[r4];
              t4[r4] = ir(o4, n4) ? i4[o4] : Wo;
            }
            return t4;
          }(e3, h3) : m3 && 1 < o3 && e3.reverse(), g3 && p3 < o3 && (e3.length = p3), (i3 = this && this !== oa && this instanceof t3 ? x3 || Cn(i3) : i3).apply(r3, e3);
        };
      }
      function Sn(n3, a3) {
        return function(t3, e3) {
          return t3 = t3, r3 = n3, i3 = a3(e3), o3 = {}, se(t3, function(t4, e4, n4) {
            r3(o3, i3(t4), e4, n4);
          }), o3;
          var r3, i3, o3;
        };
      }
      function Rn(r3, i3) {
        return function(t3, e3) {
          var n3;
          if (t3 === Wo && e3 === Wo)
            return i3;
          if (t3 !== Wo && (n3 = t3), e3 !== Wo) {
            if (n3 === Wo)
              return e3;
            e3 = "string" == typeof t3 || "string" == typeof e3 ? (t3 = f2(t3), f2(e3)) : (t3 = Ge(t3), Ge(e3)), n3 = r3(t3, e3);
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
        var n3 = (e3 = e3 === Wo ? " " : f2(e3)).length;
        if (n3 < 2)
          return n3 ? Xe(e3, t3) : e3;
        n3 = Xe(e3, ht(t3 / va(e3)));
        return ha(e3) ? cn(ga(n3), 0, t3).join("") : n3.slice(0, t3);
      }
      function kn(u3, t3, c3, f3) {
        var l3 = 1 & t3, s3 = Cn(u3);
        return function t4() {
          for (var e3 = -1, n3 = arguments.length, r3 = -1, i3 = f3.length, o3 = b2(i3 + n3), a3 = this && this !== oa && this instanceof t4 ? s3 : u3; ++r3 < i3; )
            o3[r3] = f3[r3];
          for (; n3--; )
            o3[r3++] = arguments[++e3];
          return aa(a3, l3 ? c3 : this, o3);
        };
      }
      function En(f3) {
        return function(t3, e3, n3) {
          n3 && "number" != typeof n3 && d2(t3, e3, n3) && (e3 = n3 = Wo), t3 = zi(t3), e3 === Wo ? (e3 = t3, t3 = 0) : e3 = zi(e3), n3 = n3 === Wo ? t3 < e3 ? 1 : -1 : zi(n3);
          for (var r3 = t3, i3 = n3, o3 = f3, a3 = -1, u3 = w2(ht((e3 - r3) / (i3 || 1)), 0), c3 = b2(u3); u3--; )
            c3[o3 ? u3 : ++a3] = r3, r3 += i3;
          return c3;
        };
      }
      function zn(n3) {
        return function(t3, e3) {
          return "string" == typeof t3 && "string" == typeof e3 || (t3 = S2(t3), e3 = S2(e3)), n3(t3, e3);
        };
      }
      function An(t3, e3, n3, r3, i3, o3, a3, u3, c3, f3) {
        var l3 = 8 & e3, i3 = (4 & (e3 = (e3 | (l3 ? Fo : Vo)) & ~(l3 ? Vo : Fo)) || (e3 &= -4), [t3, e3, i3, l3 ? o3 : Wo, l3 ? a3 : Wo, l3 ? Wo : o3, l3 ? Wo : a3, u3, c3, f3]), o3 = n3.apply(Wo, i3);
        return ar(t3) && pr(o3, i3), o3.placeholder = r3, _r(o3, t3, e3);
      }
      function Yn(t3) {
        var r3 = z[t3];
        return function(t4, e3) {
          var n3;
          return t4 = S2(t4), (e3 = null == e3 ? 0 : C2(D2(e3), 292)) && gt(t4) ? (n3 = (h2(t4) + "e").split("e"), +((n3 = (h2(r3(n3[0] + "e" + (+n3[1] + e3))) + "e").split("e"))[0] + "e" + (+n3[1] - e3))) : r3(t4);
        };
      }
      var jn = Bt && 1 / fc(new Bt([, -0]))[1] == Uo ? function(t3) {
        return new Bt(t3);
      } : Io;
      function Pn(o3) {
        return function(t3) {
          var e3, n3, r3, i3 = P(t3);
          return i3 == Jo ? uc(t3) : i3 == ea ? (i3 = t3, e3 = -1, n3 = Array(i3.size), i3.forEach(function(t4) {
            n3[++e3] = [t4, t4];
          }), n3) : fa(o3(r3 = t3), function(t4) {
            return [t4, r3[t4]];
          });
        };
      }
      function Xn(t3, e3, n3, r3, i3, o3, a3, u3) {
        var c3 = 2 & e3;
        if (!c3 && "function" != typeof t3)
          throw new y2(Ho);
        var f3, l3, s3, d3, h3, p3 = r3 ? r3.length : 0, v3 = (p3 || (e3 &= -97, r3 = i3 = Wo), a3 = a3 === Wo ? a3 : w2(D2(a3), 0), u3 = u3 === Wo ? u3 : D2(u3), p3 -= i3 ? i3.length : 0, e3 & Vo && (g3 = r3, f3 = i3, r3 = i3 = Wo), c3 ? Wo : $n(t3)), g3 = [t3, e3, n3, r3, i3, g3, f3, o3, a3, u3];
        return v3 && function(t4, e4) {
          var n4 = t4[1], r4 = e4[1], i4 = n4 | r4, o4 = i4 < 131, a4 = r4 == No && 8 == n4 || r4 == No && n4 == xa && t4[7].length <= e4[8] || 384 == r4 && e4[7].length <= e4[8] && 8 == n4;
          if (!o4 && !a4)
            return;
          1 & r4 && (t4[2] = e4[2], i4 |= 1 & n4 ? 0 : 4);
          o4 = e4[3];
          {
            var u4;
            o4 && (u4 = t4[3], t4[3] = u4 ? pn(u4, o4, e4[4]) : o4, t4[4] = u4 ? pa(t4[3], wa) : e4[4]);
          }
          (o4 = e4[5]) && (u4 = t4[5], t4[5] = u4 ? vn(u4, o4, e4[6]) : o4, t4[6] = u4 ? pa(t4[5], wa) : e4[6]);
          (o4 = e4[7]) && (t4[7] = o4);
          r4 & No && (t4[8] = null == t4[8] ? e4[8] : C2(t4[8], e4[8]));
          null == t4[9] && (t4[9] = e4[9]);
          t4[0] = e4[0], t4[1] = i4;
        }(g3, v3), t3 = g3[0], e3 = g3[1], n3 = g3[2], r3 = g3[3], i3 = g3[4], !(u3 = g3[9] = g3[9] === Wo ? c3 ? 0 : t3.length : w2(g3[9] - p3, 0)) && 24 & e3 && (e3 &= -25), f3 = e3 && 1 != e3 ? 8 == e3 || e3 == ma ? In(t3, e3, u3) : e3 != Fo && 33 != e3 || i3.length ? Dn.apply(Wo, g3) : kn(t3, e3, n3, r3) : (s3 = n3, d3 = 1 & e3, h3 = Cn(l3 = t3), function t4() {
          return (this && this !== oa && this instanceof t4 ? h3 : l3).apply(d3 ? s3 : this, arguments);
        }), _r((v3 ? Fe : pr)(f3, g3), t3, e3);
      }
      function Mn(t3, e3, n3, r3) {
        return t3 === Wo || X(t3, N[n3]) && !Y.call(r3, n3) ? e3 : t3;
      }
      function Wn(t3, e3, n3, r3, i3, o3) {
        return B2(t3) && B2(e3) && (o3.set(e3, t3), ke(t3, e3, Wo, Wn, o3), o3.delete(e3)), t3;
      }
      function Hn(t3) {
        return Ti(t3) ? Wo : t3;
      }
      function Fn(t3, e3, n3, r3, i3, o3) {
        var a3 = 1 & n3, u3 = t3.length, c3 = e3.length;
        if (u3 != c3 && !(a3 && u3 < c3))
          return false;
        var c3 = o3.get(t3), f3 = o3.get(e3);
        if (c3 && f3)
          return c3 == e3 && f3 == t3;
        var l3 = -1, s3 = true, d3 = 2 & n3 ? new Ht() : Wo;
        for (o3.set(t3, e3), o3.set(e3, t3); ++l3 < u3; ) {
          var h3, p3 = t3[l3], v3 = e3[l3];
          if ((h3 = r3 ? a3 ? r3(v3, p3, l3, e3, t3, o3) : r3(p3, v3, l3, t3, e3, o3) : h3) !== Wo) {
            if (h3)
              continue;
            s3 = false;
            break;
          }
          if (d3) {
            if (!Fu(e3, function(t4, e4) {
              return !ec(d3, e4) && (p3 === t4 || i3(p3, t4, n3, r3, o3)) && d3.push(e4);
            })) {
              s3 = false;
              break;
            }
          } else if (p3 !== v3 && !i3(p3, v3, n3, r3, o3)) {
            s3 = false;
            break;
          }
        }
        return o3.delete(t3), o3.delete(e3), s3;
      }
      function Vn(t3) {
        return gr(sr(t3, Wo, Dr), t3 + "");
      }
      function Nn(t3) {
        return ve(t3, R2, Qn);
      }
      function Un(t3) {
        return ve(t3, L2, tr);
      }
      var $n = Dt ? function(t3) {
        return Dt.get(t3);
      } : Io;
      function qn(t3) {
        for (var e3 = t3.name + "", n3 = St[e3], r3 = Y.call(St, e3) ? n3.length : 0; r3--; ) {
          var i3 = n3[r3], o3 = i3.func;
          if (null == o3 || o3 == t3)
            return i3.name;
        }
        return e3;
      }
      function Gn(t3) {
        return (Y.call(p2, "placeholder") ? p2 : t3).placeholder;
      }
      function s2() {
        var t3 = (t3 = p2.iteratee || mo) === mo ? Be : t3;
        return arguments.length ? t3(arguments[0], arguments[1]) : t3;
      }
      function Zn(t3, e3) {
        var n3, r3, t3 = t3.__data__;
        return ("string" == (r3 = typeof (n3 = e3)) || "number" == r3 || "symbol" == r3 || "boolean" == r3 ? "__proto__" !== n3 : null === n3) ? t3["string" == typeof e3 ? "string" : "hash"] : t3.map;
      }
      function Kn(t3) {
        for (var e3 = R2(t3), n3 = e3.length; n3--; ) {
          var r3 = e3[n3], i3 = t3[r3];
          e3[n3] = [r3, i3, fr(i3)];
        }
        return e3;
      }
      function Jn(t3, e3) {
        e3 = e3;
        t3 = null == (t3 = t3) ? Wo : t3[e3];
        return Ie(t3) ? t3 : Wo;
      }
      var Qn = vt ? function(e3) {
        return null == e3 ? [] : (e3 = v2(e3), ca(vt(e3), function(t3) {
          return it.call(e3, t3);
        }));
      } : Oo, tr = vt ? function(t3) {
        for (var e3 = []; t3; )
          la(e3, Qn(t3)), t3 = nt(t3);
        return e3;
      } : Oo, P = n2;
      function er(t3, e3, n3) {
        for (var r3 = -1, i3 = (e3 = an(e3, t3)).length, o3 = false; ++r3 < i3; ) {
          var a3 = br(e3[r3]);
          if (!(o3 = null != t3 && n3(t3, a3)))
            break;
          t3 = t3[a3];
        }
        return o3 || ++r3 != i3 ? o3 : !!(i3 = null == t3 ? 0 : t3.length) && Ci(i3) && ir(a3, i3) && (M(t3) || _i(t3));
      }
      function nr(t3) {
        return "function" != typeof t3.constructor || cr(t3) ? {} : Yt(nt(t3));
      }
      function rr(t3) {
        return M(t3) || _i(t3) || !!(at && t3 && t3[at]);
      }
      function ir(t3, e3) {
        var n3 = typeof t3;
        return !!(e3 = null == e3 ? $o : e3) && ("number" == n3 || "symbol" != n3 && _u.test(t3)) && -1 < t3 && t3 % 1 == 0 && t3 < e3;
      }
      function d2(t3, e3, n3) {
        var r3;
        if (B2(n3))
          return r3 = typeof e3, ("number" == r3 ? l2(n3) && ir(e3, n3.length) : "string" == r3 && e3 in n3) && X(n3[e3], t3);
      }
      function or(t3, e3) {
        var n3;
        if (!M(t3))
          return n3 = typeof t3, "number" == n3 || "symbol" == n3 || "boolean" == n3 || null == t3 || T2(t3) || (tu.test(t3) || !Qa.test(t3) || null != e3 && t3 in v2(e3));
      }
      function ar(t3) {
        var e3 = qn(t3), n3 = p2[e3];
        if ("function" == typeof n3 && e3 in _2.prototype) {
          if (t3 === n3)
            return 1;
          e3 = $n(n3);
          return e3 && t3 === e3[0];
        }
      }
      (o2 && P(new o2(new ArrayBuffer(1))) != na || Ct && P(new Ct()) != Jo || It && P(It.resolve()) != Sa || Bt && P(new Bt()) != ea || t2 && P(new t2()) != ka) && (P = function(t3) {
        var e3 = n2(t3), t3 = e3 == ta ? t3.constructor : Wo, t3 = t3 ? Cr(t3) : "";
        if (t3)
          switch (t3) {
            case Rt:
              return na;
            case Lt:
              return Jo;
            case Ot:
              return Sa;
            case kt:
              return ea;
            case Et:
              return ka;
          }
        return e3;
      });
      var ur = U ? xi : ko;
      function cr(t3) {
        var e3 = t3 && t3.constructor;
        return t3 === ("function" == typeof e3 && e3.prototype || N);
      }
      function fr(t3) {
        return t3 == t3 && !B2(t3);
      }
      function lr(e3, n3) {
        return function(t3) {
          return null != t3 && (t3[e3] === n3 && (n3 !== Wo || e3 in v2(t3)));
        };
      }
      function sr(o3, a3, u3) {
        return a3 = w2(a3 === Wo ? o3.length - 1 : a3, 0), function() {
          for (var t3 = arguments, e3 = -1, n3 = w2(t3.length - a3, 0), r3 = b2(n3); ++e3 < n3; )
            r3[e3] = t3[a3 + e3];
          for (var e3 = -1, i3 = b2(a3 + 1); ++e3 < a3; )
            i3[e3] = t3[e3];
          return i3[a3] = u3(r3), aa(o3, this, i3);
        };
      }
      function dr(t3, e3) {
        return e3.length < 2 ? t3 : pe(t3, u2(e3, 0, -1));
      }
      function hr(t3, e3) {
        if (("constructor" !== e3 || "function" != typeof t3[e3]) && "__proto__" != e3)
          return t3[e3];
      }
      var pr = yr(Fe), vr = dt || function(t3, e3) {
        return oa.setTimeout(t3, e3);
      }, gr = yr(e2);
      function _r(t3, e3, n3) {
        var r3, i3, e3 = e3 + "";
        return gr(t3, function(t4, e4) {
          var n4 = e4.length;
          if (!n4)
            return t4;
          var r4 = n4 - 1;
          return e4[r4] = (1 < n4 ? "& " : "") + e4[r4], e4 = e4.join(2 < n4 ? ", " : " "), t4.replace(ou, "{\n/* [wrapped with " + e4 + "] */\n");
        }(e3, (r3 = (t3 = (t3 = e3).match(au)) ? t3[1].split(uu) : [], i3 = n3, ua(Ca, function(t4) {
          var e4 = "_." + t4[0];
          i3 & t4[1] && !Xu(r3, e4) && r3.push(e4);
        }), r3.sort())));
      }
      function yr(n3) {
        var r3 = 0, i3 = 0;
        return function() {
          var t3 = wt(), e3 = 16 - (t3 - i3);
          if (i3 = t3, 0 < e3) {
            if (800 <= ++r3)
              return arguments[0];
          } else
            r3 = 0;
          return n3.apply(Wo, arguments);
        };
      }
      function wr(t3, e3) {
        var n3 = -1, r3 = t3.length, i3 = r3 - 1;
        for (e3 = e3 === Wo ? r3 : e3; ++n3 < e3; ) {
          var o3 = Pe(n3, i3), a3 = t3[o3];
          t3[o3] = t3[n3], t3[n3] = a3;
        }
        return t3.length = e3, t3;
      }
      mr = (lt = li(lt = function(t3) {
        var i3 = [];
        return 46 === t3.charCodeAt(0) && i3.push(""), t3.replace(eu, function(t4, e3, n3, r3) {
          i3.push(n3 ? r3.replace(lu, "$1") : e3 || t4);
        }), i3;
      }, function(t3) {
        return 500 === mr.size && mr.clear(), t3;
      })).cache;
      var mr, xr = lt;
      function br(t3) {
        if ("string" == typeof t3 || T2(t3))
          return t3;
        var e3 = t3 + "";
        return "0" == e3 && 1 / t3 == -Uo ? "-0" : e3;
      }
      function Cr(t3) {
        if (null != t3) {
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
      o2 = a2(function(t3, e3) {
        return x2(t3) ? re(t3, c2(e3, 1, x2, true)) : [];
      }), It = a2(function(t3, e3) {
        var n3 = r2(e3);
        return x2(n3) && (n3 = Wo), x2(t3) ? re(t3, c2(e3, 1, x2, true), s2(n3, 2)) : [];
      }), t2 = a2(function(t3, e3) {
        var n3 = r2(e3);
        return x2(n3) && (n3 = Wo), x2(t3) ? re(t3, c2(e3, 1, x2, true), Wo, n3) : [];
      });
      function Br(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        if (!r3)
          return -1;
        n3 = null == n3 ? 0 : D2(n3);
        return n3 < 0 && (n3 = w2(r3 + n3, 0)), Nu(t3, s2(e3, 3), n3);
      }
      function Tr(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        if (!r3)
          return -1;
        var i3 = r3 - 1;
        return n3 !== Wo && (i3 = D2(n3), i3 = n3 < 0 ? w2(r3 + i3, 0) : C2(i3, r3 - 1)), Nu(t3, s2(e3, 3), i3, true);
      }
      function Dr(t3) {
        return (null == t3 ? 0 : t3.length) ? c2(t3, 1) : [];
      }
      function Sr(t3) {
        return t3 && t3.length ? t3[0] : Wo;
      }
      U = a2(function(t3) {
        var e3 = fa(t3, rn);
        return e3.length && e3[0] === t3[0] ? we(e3) : [];
      }), dt = a2(function(t3) {
        var e3 = r2(t3), n3 = fa(t3, rn);
        return e3 === r2(n3) ? e3 = Wo : n3.pop(), n3.length && n3[0] === t3[0] ? we(n3, s2(e3, 2)) : [];
      }), e2 = a2(function(t3) {
        var e3 = r2(t3), n3 = fa(t3, rn);
        return (e3 = "function" == typeof e3 ? e3 : Wo) && n3.pop(), n3.length && n3[0] === t3[0] ? we(n3, Wo, e3) : [];
      });
      function r2(t3) {
        var e3 = null == t3 ? 0 : t3.length;
        return e3 ? t3[e3 - 1] : Wo;
      }
      lt = a2(Rr);
      function Rr(t3, e3) {
        return t3 && t3.length && e3 && e3.length ? Ye(t3, e3) : t3;
      }
      var Lr = Vn(function(t3, e3) {
        var n3 = null == t3 ? 0 : t3.length, r3 = Qt(t3, e3);
        return je(t3, fa(e3, function(t4) {
          return ir(t4, n3) ? +t4 : t4;
        }).sort(hn)), r3;
      });
      function Or(t3) {
        return null == t3 ? t3 : bt.call(t3);
      }
      var kr = a2(function(t3) {
        return Ze(c2(t3, 1, x2, true));
      }), Er = a2(function(t3) {
        var e3 = r2(t3);
        return x2(e3) && (e3 = Wo), Ze(c2(t3, 1, x2, true), s2(e3, 2));
      }), zr = a2(function(t3) {
        var e3 = "function" == typeof (e3 = r2(t3)) ? e3 : Wo;
        return Ze(c2(t3, 1, x2, true), Wo, e3);
      });
      function Ar(e3) {
        if (!e3 || !e3.length)
          return [];
        var n3 = 0;
        return e3 = ca(e3, function(t3) {
          return x2(t3) && (n3 = w2(t3.length, n3), 1);
        }), Ju(n3, function(t3) {
          return fa(e3, Gu(t3));
        });
      }
      function Yr(t3, e3) {
        if (!t3 || !t3.length)
          return [];
        t3 = Ar(t3);
        return null == e3 ? t3 : fa(t3, function(t4) {
          return aa(e3, Wo, t4);
        });
      }
      var jr = a2(function(t3, e3) {
        return x2(t3) ? re(t3, e3) : [];
      }), Pr = a2(function(t3) {
        return en(ca(t3, x2));
      }), Xr = a2(function(t3) {
        var e3 = r2(t3);
        return x2(e3) && (e3 = Wo), en(ca(t3, x2), s2(e3, 2));
      }), Mr = a2(function(t3) {
        var e3 = "function" == typeof (e3 = r2(t3)) ? e3 : Wo;
        return en(ca(t3, x2), Wo, e3);
      }), Wr = a2(Ar);
      var Hr = a2(function(t3) {
        var e3 = t3.length, e3 = "function" == typeof (e3 = 1 < e3 ? t3[e3 - 1] : Wo) ? (t3.pop(), e3) : Wo;
        return Yr(t3, e3);
      });
      function Fr(t3) {
        t3 = p2(t3);
        return t3.__chain__ = true, t3;
      }
      function Vr(t3, e3) {
        return e3(t3);
      }
      var Nr = Vn(function(e3) {
        function t3(t4) {
          return Qt(t4, e3);
        }
        var n3 = e3.length, r3 = n3 ? e3[0] : 0, i3 = this.__wrapped__;
        return !(1 < n3 || this.__actions__.length) && i3 instanceof _2 && ir(r3) ? ((i3 = i3.slice(r3, +r3 + (n3 ? 1 : 0))).__actions__.push({ func: Vr, args: [t3], thisArg: Wo }), new g2(i3, this.__chain__).thru(function(t4) {
          return n3 && !t4.length && t4.push(Wo), t4;
        })) : this.thru(t3);
      });
      var Ur = _n(function(t3, e3, n3) {
        Y.call(t3, n3) ? ++t3[n3] : Jt(t3, n3, 1);
      });
      var $r = Bn(Br), qr = Bn(Tr);
      function Gr(t3, e3) {
        return (M(t3) ? ua : ie)(t3, s2(e3, 3));
      }
      function Zr(t3, e3) {
        return (M(t3) ? ju : oe)(t3, s2(e3, 3));
      }
      var Kr = _n(function(t3, e3, n3) {
        Y.call(t3, n3) ? t3[n3].push(e3) : Jt(t3, n3, [e3]);
      });
      var Jr = a2(function(t3, e3, n3) {
        var r3 = -1, i3 = "function" == typeof e3, o3 = l2(t3) ? b2(t3.length) : [];
        return ie(t3, function(t4) {
          o3[++r3] = i3 ? aa(e3, t4, n3) : me(t4, e3, n3);
        }), o3;
      }), Qr = _n(function(t3, e3, n3) {
        Jt(t3, n3, e3);
      });
      function ti(t3, e3) {
        return (M(t3) ? fa : Re)(t3, s2(e3, 3));
      }
      var ei = _n(function(t3, e3, n3) {
        t3[n3 ? 0 : 1].push(e3);
      }, function() {
        return [[], []];
      });
      var ni = a2(function(t3, e3) {
        if (null == t3)
          return [];
        var n3 = e3.length;
        return 1 < n3 && d2(t3, e3[0], e3[1]) ? e3 = [] : 2 < n3 && d2(e3[0], e3[1], e3[2]) && (e3 = [e3[0]]), ze(t3, c2(e3, 1), []);
      }), ri = st || function() {
        return oa.Date.now();
      };
      function ii(t3, e3, n3) {
        return e3 = n3 ? Wo : e3, e3 = t3 && null == e3 ? t3.length : e3, Xn(t3, No, Wo, Wo, Wo, Wo, e3);
      }
      function oi(t3, e3) {
        var n3;
        if ("function" != typeof e3)
          throw new y2(Ho);
        return t3 = D2(t3), function() {
          return 0 < --t3 && (n3 = e3.apply(this, arguments)), t3 <= 1 && (e3 = Wo), n3;
        };
      }
      var ai = a2(function(t3, e3, n3) {
        var r3, i3 = 1;
        return n3.length && (r3 = pa(n3, Gn(ai)), i3 |= Fo), Xn(t3, i3, e3, n3, r3);
      }), ui = a2(function(t3, e3, n3) {
        var r3, i3 = 3;
        return n3.length && (r3 = pa(n3, Gn(ui)), i3 |= Fo), Xn(e3, i3, t3, n3, r3);
      });
      function ci(r3, n3, t3) {
        var i3, o3, a3, u3, c3, f3, l3 = 0, s3 = false, d3 = false, e3 = true;
        if ("function" != typeof r3)
          throw new y2(Ho);
        function h3(t4) {
          var e4 = i3, n4 = o3;
          return i3 = o3 = Wo, l3 = t4, u3 = r3.apply(n4, e4);
        }
        function p3(t4) {
          var e4 = t4 - f3;
          return f3 === Wo || n3 <= e4 || e4 < 0 || d3 && a3 <= t4 - l3;
        }
        function v3() {
          var t4, e4 = ri();
          if (p3(e4))
            return g3(e4);
          c3 = vr(v3, (t4 = n3 - ((e4 = e4) - f3), d3 ? C2(t4, a3 - (e4 - l3)) : t4));
        }
        function g3(t4) {
          return c3 = Wo, e3 && i3 ? h3(t4) : (i3 = o3 = Wo, u3);
        }
        function _3() {
          var t4 = ri(), e4 = p3(t4);
          if (i3 = arguments, o3 = this, f3 = t4, e4) {
            if (c3 === Wo)
              return l3 = t4 = f3, c3 = vr(v3, n3), s3 ? h3(t4) : u3;
            if (d3)
              return fn(c3), c3 = vr(v3, n3), h3(f3);
          }
          return c3 === Wo && (c3 = vr(v3, n3)), u3;
        }
        return n3 = S2(n3) || 0, B2(t3) && (s3 = !!t3.leading, d3 = "maxWait" in t3, a3 = d3 ? w2(S2(t3.maxWait) || 0, n3) : a3, e3 = "trailing" in t3 ? !!t3.trailing : e3), _3.cancel = function() {
          c3 !== Wo && fn(c3), l3 = 0, i3 = f3 = o3 = c3 = Wo;
        }, _3.flush = function() {
          return c3 === Wo ? u3 : g3(ri());
        }, _3;
      }
      var st = a2(function(t3, e3) {
        return ne(t3, 1, e3);
      }), fi = a2(function(t3, e3, n3) {
        return ne(t3, S2(e3) || 0, n3);
      });
      function li(r3, i3) {
        if ("function" != typeof r3 || null != i3 && "function" != typeof i3)
          throw new y2(Ho);
        function o3() {
          var t3 = arguments, e3 = i3 ? i3.apply(this, t3) : t3[0], n3 = o3.cache;
          return n3.has(e3) ? n3.get(e3) : (t3 = r3.apply(this, t3), o3.cache = n3.set(e3, t3) || n3, t3);
        }
        return o3.cache = new (li.Cache || Wt)(), o3;
      }
      function si(e3) {
        if ("function" != typeof e3)
          throw new y2(Ho);
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
      li.Cache = Wt;
      var un = un(function(r3, i3) {
        var o3 = (i3 = 1 == i3.length && M(i3[0]) ? fa(i3[0], da(s2())) : fa(c2(i3, 1), da(s2()))).length;
        return a2(function(t3) {
          for (var e3 = -1, n3 = C2(t3.length, o3); ++e3 < n3; )
            t3[e3] = i3[e3].call(this, t3[e3]);
          return aa(r3, this, t3);
        });
      }), di = a2(function(t3, e3) {
        var n3 = pa(e3, Gn(di));
        return Xn(t3, Fo, Wo, e3, n3);
      }), hi = a2(function(t3, e3) {
        var n3 = pa(e3, Gn(hi));
        return Xn(t3, Vo, Wo, e3, n3);
      }), pi = Vn(function(t3, e3) {
        return Xn(t3, xa, Wo, Wo, Wo, e3);
      });
      function X(t3, e3) {
        return t3 === e3 || t3 != t3 && e3 != e3;
      }
      var vi = zn(ge), gi = zn(function(t3, e3) {
        return e3 <= t3;
      }), _i = xe(function() {
        return arguments;
      }()) ? xe : function(t3) {
        return W(t3) && Y.call(t3, "callee") && !it.call(t3, "callee");
      }, M = b2.isArray, yi = Lu ? da(Lu) : function(t3) {
        return W(t3) && n2(t3) == Ea;
      };
      function l2(t3) {
        return null != t3 && Ci(t3.length) && !xi(t3);
      }
      function x2(t3) {
        return W(t3) && l2(t3);
      }
      var wi = V || ko, V = Ou ? da(Ou) : function(t3) {
        return W(t3) && n2(t3) == Ko;
      };
      function mi(t3) {
        if (!W(t3))
          return false;
        var e3 = n2(t3);
        return e3 == Ba || "[object DOMException]" == e3 || "string" == typeof t3.message && "string" == typeof t3.name && !Ti(t3);
      }
      function xi(t3) {
        if (!B2(t3))
          return false;
        t3 = n2(t3);
        return t3 == Ta || t3 == Da || "[object AsyncFunction]" == t3 || "[object Proxy]" == t3;
      }
      function bi(t3) {
        return "number" == typeof t3 && t3 == D2(t3);
      }
      function Ci(t3) {
        return "number" == typeof t3 && -1 < t3 && t3 % 1 == 0 && t3 <= $o;
      }
      function B2(t3) {
        var e3 = typeof t3;
        return null != t3 && ("object" == e3 || "function" == e3);
      }
      function W(t3) {
        return null != t3 && "object" == typeof t3;
      }
      var Ii = ku ? da(ku) : function(t3) {
        return W(t3) && P(t3) == Jo;
      };
      function Bi(t3) {
        return "number" == typeof t3 || W(t3) && n2(t3) == Qo;
      }
      function Ti(t3) {
        if (!W(t3) || n2(t3) != ta)
          return false;
        t3 = nt(t3);
        if (null === t3)
          return true;
        t3 = Y.call(t3, "constructor") && t3.constructor;
        return "function" == typeof t3 && t3 instanceof t3 && $.call(t3) == K;
      }
      var Di = Eu ? da(Eu) : function(t3) {
        return W(t3) && n2(t3) == Ra;
      };
      var Si = zu ? da(zu) : function(t3) {
        return W(t3) && P(t3) == ea;
      };
      function Ri(t3) {
        return "string" == typeof t3 || !M(t3) && W(t3) && n2(t3) == La;
      }
      function T2(t3) {
        return "symbol" == typeof t3 || W(t3) && n2(t3) == Oa;
      }
      var Li = Au ? da(Au) : function(t3) {
        return W(t3) && Ci(t3.length) && !!ra[n2(t3)];
      };
      var Oi = zn(Se), ki = zn(function(t3, e3) {
        return t3 <= e3;
      });
      function Ei(t3) {
        if (!t3)
          return [];
        if (l2(t3))
          return (Ri(t3) ? ga : I2)(t3);
        if (ut && t3[ut]) {
          for (var e3, n3 = t3[ut](), r3 = []; !(e3 = n3.next()).done; )
            r3.push(e3.value);
          return r3;
        }
        var i3 = P(t3);
        return (i3 == Jo ? uc : i3 == ea ? fc : no)(t3);
      }
      function zi(t3) {
        return t3 ? (t3 = S2(t3)) === Uo || t3 === -Uo ? 17976931348623157e292 * (t3 < 0 ? -1 : 1) : t3 == t3 ? t3 : 0 : 0 === t3 ? t3 : 0;
      }
      function D2(t3) {
        var t3 = zi(t3), e3 = t3 % 1;
        return t3 == t3 ? e3 ? t3 - e3 : t3 : 0;
      }
      function Ai(t3) {
        return t3 ? te(D2(t3), 0, qo) : 0;
      }
      function S2(t3) {
        if ("number" == typeof t3)
          return t3;
        if (T2(t3))
          return ba;
        if ("string" != typeof (t3 = B2(t3) ? B2(e3 = "function" == typeof t3.valueOf ? t3.valueOf() : t3) ? e3 + "" : e3 : t3))
          return 0 === t3 ? t3 : +t3;
        t3 = Qu(t3);
        var e3 = pu.test(t3);
        return e3 || gu.test(t3) ? Su(t3.slice(2), e3 ? 2 : 8) : hu.test(t3) ? ba : +t3;
      }
      function Yi(t3) {
        return gn(t3, L2(t3));
      }
      function h2(t3) {
        return null == t3 ? "" : f2(t3);
      }
      var ji = yn(function(t3, e3) {
        if (cr(e3) || l2(e3))
          gn(e3, R2(e3), t3);
        else
          for (var n3 in e3)
            Y.call(e3, n3) && qt(t3, n3, e3[n3]);
      }), Pi = yn(function(t3, e3) {
        gn(e3, L2(e3), t3);
      }), Xi = yn(function(t3, e3, n3, r3) {
        gn(e3, L2(e3), t3, r3);
      }), Mi = yn(function(t3, e3, n3, r3) {
        gn(e3, R2(e3), t3, r3);
      }), Wi = Vn(Qt);
      var Hi = a2(function(t3, e3) {
        t3 = v2(t3);
        var n3 = -1, r3 = e3.length, i3 = 2 < r3 ? e3[2] : Wo;
        for (i3 && d2(e3[0], e3[1], i3) && (r3 = 1); ++n3 < r3; )
          for (var o3 = e3[n3], a3 = L2(o3), u3 = -1, c3 = a3.length; ++u3 < c3; ) {
            var f3 = a3[u3], l3 = t3[f3];
            (l3 === Wo || X(l3, N[f3]) && !Y.call(t3, f3)) && (t3[f3] = o3[f3]);
          }
        return t3;
      }), Fi = a2(function(t3) {
        return t3.push(Wo, Wn), aa(Zi, Wo, t3);
      });
      function Vi(t3, e3, n3) {
        t3 = null == t3 ? Wo : pe(t3, e3);
        return t3 === Wo ? n3 : t3;
      }
      function Ni(t3, e3) {
        return null != t3 && er(t3, e3, ye);
      }
      var Ui = Sn(function(t3, e3, n3) {
        t3[e3 = null != e3 && "function" != typeof e3.toString ? Z.call(e3) : e3] = n3;
      }, _o(O)), $i = Sn(function(t3, e3, n3) {
        null != e3 && "function" != typeof e3.toString && (e3 = Z.call(e3)), Y.call(t3, e3) ? t3[e3].push(n3) : t3[e3] = [n3];
      }, s2), qi = a2(me);
      function R2(t3) {
        return (l2(t3) ? Ft : Te)(t3);
      }
      function L2(t3) {
        return l2(t3) ? Ft(t3, true) : De(t3);
      }
      var Gi = yn(function(t3, e3, n3) {
        ke(t3, e3, n3);
      }), Zi = yn(function(t3, e3, n3, r3) {
        ke(t3, e3, n3, r3);
      }), Ki = Vn(function(e3, t3) {
        var n3 = {};
        if (null == e3)
          return n3;
        for (var r3 = false, i3 = (t3 = fa(t3, function(t4) {
          return t4 = an(t4, e3), r3 = r3 || 1 < t4.length, t4;
        }), gn(e3, Un(e3), n3), r3 && (n3 = m2(n3, 7, Hn)), t3.length); i3--; )
          Ke(n3, t3[i3]);
        return n3;
      });
      var Ji = Vn(function(t3, e3) {
        return null == t3 ? {} : Ae(n3 = t3, e3, function(t4, e4) {
          return Ni(n3, e4);
        });
        var n3;
      });
      function Qi(t3, n3) {
        if (null == t3)
          return {};
        var e3 = fa(Un(t3), function(t4) {
          return [t4];
        });
        return n3 = s2(n3), Ae(t3, e3, function(t4, e4) {
          return n3(t4, e4[0]);
        });
      }
      var to = Pn(R2), eo = Pn(L2);
      function no(t3) {
        return null == t3 ? [] : tc(t3, R2(t3));
      }
      var ro = bn(function(t3, e3, n3) {
        return e3 = e3.toLowerCase(), t3 + (n3 ? io(e3) : e3);
      });
      function io(t3) {
        return ho(h2(t3).toLowerCase());
      }
      function oo(t3) {
        return (t3 = h2(t3)) && t3.replace(yu, ic).replace(bu, "");
      }
      var ao = bn(function(t3, e3, n3) {
        return t3 + (n3 ? "-" : "") + e3.toLowerCase();
      }), uo = bn(function(t3, e3, n3) {
        return t3 + (n3 ? " " : "") + e3.toLowerCase();
      }), co = xn("toLowerCase");
      var fo = bn(function(t3, e3, n3) {
        return t3 + (n3 ? "_" : "") + e3.toLowerCase();
      });
      var lo = bn(function(t3, e3, n3) {
        return t3 + (n3 ? " " : "") + ho(e3);
      });
      var so = bn(function(t3, e3, n3) {
        return t3 + (n3 ? " " : "") + e3.toUpperCase();
      }), ho = xn("toUpperCase");
      function po(t3, e3, n3) {
        return t3 = h2(t3), (e3 = n3 ? Wo : e3) === Wo ? (n3 = t3, Iu.test(n3) ? t3.match(Cu) || [] : t3.match(cu) || []) : t3.match(e3) || [];
      }
      var vo = a2(function(t3, e3) {
        try {
          return aa(t3, Wo, e3);
        } catch (t4) {
          return mi(t4) ? t4 : new k(t4);
        }
      }), go = Vn(function(e3, t3) {
        return ua(t3, function(t4) {
          t4 = br(t4), Jt(e3, t4, ai(e3[t4], e3));
        }), e3;
      });
      function _o(t3) {
        return function() {
          return t3;
        };
      }
      var yo = Tn(), wo = Tn(true);
      function O(t3) {
        return t3;
      }
      function mo(t3) {
        return Be("function" == typeof t3 ? t3 : m2(t3, 1));
      }
      var xo = a2(function(e3, n3) {
        return function(t3) {
          return me(t3, e3, n3);
        };
      }), bo = a2(function(e3, n3) {
        return function(t3) {
          return me(e3, t3, n3);
        };
      });
      function Co(r3, e3, t3) {
        var n3 = R2(e3), i3 = he(e3, n3), o3 = (null != t3 || B2(e3) && (i3.length || !n3.length) || (t3 = e3, e3 = r3, r3 = this, i3 = he(e3, R2(e3))), !(B2(t3) && "chain" in t3 && !t3.chain)), a3 = xi(r3);
        return ua(i3, function(t4) {
          var n4 = e3[t4];
          r3[t4] = n4, a3 && (r3.prototype[t4] = function() {
            var t5, e4 = this.__chain__;
            return o3 || e4 ? (((t5 = r3(this.__wrapped__)).__actions__ = I2(this.__actions__)).push({ func: n4, args: arguments, thisArg: r3 }), t5.__chain__ = e4, t5) : n4.apply(r3, la([this.value()], arguments));
          });
        }), r3;
      }
      function Io() {
      }
      var Bo = Ln(fa), To = Ln(Pu), Do = Ln(Fu);
      function So(t3) {
        return or(t3) ? Gu(br(t3)) : (e3 = t3, function(t4) {
          return pe(t4, e3);
        });
        var e3;
      }
      var Ro = En(), Lo = En(true);
      function Oo() {
        return [];
      }
      function ko() {
        return false;
      }
      var Eo = Rn(function(t3, e3) {
        return t3 + e3;
      }, 0), zo = Yn("ceil"), Ao = Rn(function(t3, e3) {
        return t3 / e3;
      }, 1), Yo = Yn("floor");
      var jo, Po = Rn(function(t3, e3) {
        return t3 * e3;
      }, 1), Xo = Yn("round"), Mo = Rn(function(t3, e3) {
        return t3 - e3;
      }, 0);
      return p2.after = function(t3, e3) {
        if ("function" != typeof e3)
          throw new y2(Ho);
        return t3 = D2(t3), function() {
          if (--t3 < 1)
            return e3.apply(this, arguments);
        };
      }, p2.ary = ii, p2.assign = ji, p2.assignIn = Pi, p2.assignInWith = Xi, p2.assignWith = Mi, p2.at = Wi, p2.before = oi, p2.bind = ai, p2.bindAll = go, p2.bindKey = ui, p2.castArray = function() {
        if (!arguments.length)
          return [];
        var t3 = arguments[0];
        return M(t3) ? t3 : [t3];
      }, p2.chain = Fr, p2.chunk = function(t3, e3, n3) {
        e3 = (n3 ? d2(t3, e3, n3) : e3 === Wo) ? 1 : w2(D2(e3), 0);
        var r3 = null == t3 ? 0 : t3.length;
        if (!r3 || e3 < 1)
          return [];
        for (var i3 = 0, o3 = 0, a3 = b2(ht(r3 / e3)); i3 < r3; )
          a3[o3++] = u2(t3, i3, i3 += e3);
        return a3;
      }, p2.compact = function(t3) {
        for (var e3 = -1, n3 = null == t3 ? 0 : t3.length, r3 = 0, i3 = []; ++e3 < n3; ) {
          var o3 = t3[e3];
          o3 && (i3[r3++] = o3);
        }
        return i3;
      }, p2.concat = function() {
        var t3 = arguments.length;
        if (!t3)
          return [];
        for (var e3 = b2(t3 - 1), n3 = arguments[0], r3 = t3; r3--; )
          e3[r3 - 1] = arguments[r3];
        return la(M(n3) ? I2(n3) : [n3], c2(e3, 1));
      }, p2.cond = function(r3) {
        var i3 = null == r3 ? 0 : r3.length, e3 = s2();
        return r3 = i3 ? fa(r3, function(t3) {
          if ("function" != typeof t3[1])
            throw new y2(Ho);
          return [e3(t3[0]), t3[1]];
        }) : [], a2(function(t3) {
          for (var e4 = -1; ++e4 < i3; ) {
            var n3 = r3[e4];
            if (aa(n3[0], this, t3))
              return aa(n3[1], this, t3);
          }
        });
      }, p2.conforms = function(t3) {
        return e3 = m2(t3, 1), n3 = R2(e3), function(t4) {
          return ee(t4, e3, n3);
        };
        var e3, n3;
      }, p2.constant = _o, p2.countBy = Ur, p2.create = function(t3, e3) {
        return t3 = Yt(t3), null == e3 ? t3 : Kt(t3, e3);
      }, p2.curry = function t3(e3, n3, r3) {
        e3 = Xn(e3, 8, Wo, Wo, Wo, Wo, Wo, n3 = r3 ? Wo : n3);
        return e3.placeholder = t3.placeholder, e3;
      }, p2.curryRight = function t3(e3, n3, r3) {
        e3 = Xn(e3, ma, Wo, Wo, Wo, Wo, Wo, n3 = r3 ? Wo : n3);
        return e3.placeholder = t3.placeholder, e3;
      }, p2.debounce = ci, p2.defaults = Hi, p2.defaultsDeep = Fi, p2.defer = st, p2.delay = fi, p2.difference = o2, p2.differenceBy = It, p2.differenceWith = t2, p2.drop = function(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        return r3 ? u2(t3, (e3 = n3 || e3 === Wo ? 1 : D2(e3)) < 0 ? 0 : e3, r3) : [];
      }, p2.dropRight = function(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        return r3 ? u2(t3, 0, (e3 = r3 - (e3 = n3 || e3 === Wo ? 1 : D2(e3))) < 0 ? 0 : e3) : [];
      }, p2.dropRightWhile = function(t3, e3) {
        return t3 && t3.length ? Qe(t3, s2(e3, 3), true, true) : [];
      }, p2.dropWhile = function(t3, e3) {
        return t3 && t3.length ? Qe(t3, s2(e3, 3), true) : [];
      }, p2.fill = function(t3, e3, n3, r3) {
        if (!(c3 = null == t3 ? 0 : t3.length))
          return [];
        n3 && "number" != typeof n3 && d2(t3, e3, n3) && (n3 = 0, r3 = c3);
        var i3 = t3, o3 = e3, a3 = n3, u3 = r3, c3 = i3.length;
        for ((a3 = D2(a3)) < 0 && (a3 = c3 < -a3 ? 0 : c3 + a3), (u3 = u3 === Wo || c3 < u3 ? c3 : D2(u3)) < 0 && (u3 += c3), u3 = u3 < a3 ? 0 : Ai(u3); a3 < u3; )
          i3[a3++] = o3;
        return i3;
      }, p2.filter = function(t3, e3) {
        return (M(t3) ? ca : ce)(t3, s2(e3, 3));
      }, p2.flatMap = function(t3, e3) {
        return c2(ti(t3, e3), 1);
      }, p2.flatMapDeep = function(t3, e3) {
        return c2(ti(t3, e3), Uo);
      }, p2.flatMapDepth = function(t3, e3, n3) {
        return n3 = n3 === Wo ? 1 : D2(n3), c2(ti(t3, e3), n3);
      }, p2.flatten = Dr, p2.flattenDeep = function(t3) {
        return (null == t3 ? 0 : t3.length) ? c2(t3, Uo) : [];
      }, p2.flattenDepth = function(t3, e3) {
        return (null == t3 ? 0 : t3.length) ? c2(t3, e3 = e3 === Wo ? 1 : D2(e3)) : [];
      }, p2.flip = function(t3) {
        return Xn(t3, 512);
      }, p2.flow = yo, p2.flowRight = wo, p2.fromPairs = function(t3) {
        for (var e3 = -1, n3 = null == t3 ? 0 : t3.length, r3 = {}; ++e3 < n3; ) {
          var i3 = t3[e3];
          r3[i3[0]] = i3[1];
        }
        return r3;
      }, p2.functions = function(t3) {
        return null == t3 ? [] : he(t3, R2(t3));
      }, p2.functionsIn = function(t3) {
        return null == t3 ? [] : he(t3, L2(t3));
      }, p2.groupBy = Kr, p2.initial = function(t3) {
        return (null == t3 ? 0 : t3.length) ? u2(t3, 0, -1) : [];
      }, p2.intersection = U, p2.intersectionBy = dt, p2.intersectionWith = e2, p2.invert = Ui, p2.invertBy = $i, p2.invokeMap = Jr, p2.iteratee = mo, p2.keyBy = Qr, p2.keys = R2, p2.keysIn = L2, p2.map = ti, p2.mapKeys = function(t3, r3) {
        var i3 = {};
        return r3 = s2(r3, 3), se(t3, function(t4, e3, n3) {
          Jt(i3, r3(t4, e3, n3), t4);
        }), i3;
      }, p2.mapValues = function(t3, r3) {
        var i3 = {};
        return r3 = s2(r3, 3), se(t3, function(t4, e3, n3) {
          Jt(i3, e3, r3(t4, e3, n3));
        }), i3;
      }, p2.matches = function(t3) {
        return Le(m2(t3, 1));
      }, p2.matchesProperty = function(t3, e3) {
        return Oe(t3, m2(e3, 1));
      }, p2.memoize = li, p2.merge = Gi, p2.mergeWith = Zi, p2.method = xo, p2.methodOf = bo, p2.mixin = Co, p2.negate = si, p2.nthArg = function(e3) {
        return e3 = D2(e3), a2(function(t3) {
          return Ee(t3, e3);
        });
      }, p2.omit = Ki, p2.omitBy = function(t3, e3) {
        return Qi(t3, si(s2(e3)));
      }, p2.once = function(t3) {
        return oi(2, t3);
      }, p2.orderBy = function(t3, e3, n3, r3) {
        return null == t3 ? [] : ze(t3, e3 = M(e3) ? e3 : null == e3 ? [] : [e3], n3 = M(n3 = r3 ? Wo : n3) ? n3 : null == n3 ? [] : [n3]);
      }, p2.over = Bo, p2.overArgs = un, p2.overEvery = To, p2.overSome = Do, p2.partial = di, p2.partialRight = hi, p2.partition = ei, p2.pick = Ji, p2.pickBy = Qi, p2.property = So, p2.propertyOf = function(e3) {
        return function(t3) {
          return null == e3 ? Wo : pe(e3, t3);
        };
      }, p2.pull = lt, p2.pullAll = Rr, p2.pullAllBy = function(t3, e3, n3) {
        return t3 && t3.length && e3 && e3.length ? Ye(t3, e3, s2(n3, 2)) : t3;
      }, p2.pullAllWith = function(t3, e3, n3) {
        return t3 && t3.length && e3 && e3.length ? Ye(t3, e3, Wo, n3) : t3;
      }, p2.pullAt = Lr, p2.range = Ro, p2.rangeRight = Lo, p2.rearg = pi, p2.reject = function(t3, e3) {
        return (M(t3) ? ca : ce)(t3, si(s2(e3, 3)));
      }, p2.remove = function(t3, e3) {
        var n3 = [];
        if (!t3 || !t3.length)
          return n3;
        var r3 = -1, i3 = [], o3 = t3.length;
        for (e3 = s2(e3, 3); ++r3 < o3; ) {
          var a3 = t3[r3];
          e3(a3, r3, t3) && (n3.push(a3), i3.push(r3));
        }
        return je(t3, i3), n3;
      }, p2.rest = function(t3, e3) {
        if ("function" != typeof t3)
          throw new y2(Ho);
        return a2(t3, e3 = e3 === Wo ? e3 : D2(e3));
      }, p2.reverse = Or, p2.sampleSize = function(t3, e3, n3) {
        return e3 = (n3 ? d2(t3, e3, n3) : e3 === Wo) ? 1 : D2(e3), (M(t3) ? Nt : We)(t3, e3);
      }, p2.set = function(t3, e3, n3) {
        return null == t3 ? t3 : He(t3, e3, n3);
      }, p2.setWith = function(t3, e3, n3, r3) {
        return r3 = "function" == typeof r3 ? r3 : Wo, null == t3 ? t3 : He(t3, e3, n3, r3);
      }, p2.shuffle = function(t3) {
        return (M(t3) ? Ut : Ve)(t3);
      }, p2.slice = function(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        return r3 ? (n3 = n3 && "number" != typeof n3 && d2(t3, e3, n3) ? (e3 = 0, r3) : (e3 = null == e3 ? 0 : D2(e3), n3 === Wo ? r3 : D2(n3)), u2(t3, e3, n3)) : [];
      }, p2.sortBy = ni, p2.sortedUniq = function(t3) {
        return t3 && t3.length ? qe(t3) : [];
      }, p2.sortedUniqBy = function(t3, e3) {
        return t3 && t3.length ? qe(t3, s2(e3, 2)) : [];
      }, p2.split = function(t3, e3, n3) {
        return n3 && "number" != typeof n3 && d2(t3, e3, n3) && (e3 = n3 = Wo), (n3 = n3 === Wo ? qo : n3 >>> 0) ? (t3 = h2(t3)) && ("string" == typeof e3 || null != e3 && !Di(e3)) && !(e3 = f2(e3)) && ha(t3) ? cn(ga(t3), 0, n3) : t3.split(e3, n3) : [];
      }, p2.spread = function(n3, r3) {
        if ("function" != typeof n3)
          throw new y2(Ho);
        return r3 = null == r3 ? 0 : w2(D2(r3), 0), a2(function(t3) {
          var e3 = t3[r3], t3 = cn(t3, 0, r3);
          return e3 && la(t3, e3), aa(n3, this, t3);
        });
      }, p2.tail = function(t3) {
        var e3 = null == t3 ? 0 : t3.length;
        return e3 ? u2(t3, 1, e3) : [];
      }, p2.take = function(t3, e3, n3) {
        return t3 && t3.length ? u2(t3, 0, (e3 = n3 || e3 === Wo ? 1 : D2(e3)) < 0 ? 0 : e3) : [];
      }, p2.takeRight = function(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        return r3 ? u2(t3, (e3 = r3 - (e3 = n3 || e3 === Wo ? 1 : D2(e3))) < 0 ? 0 : e3, r3) : [];
      }, p2.takeRightWhile = function(t3, e3) {
        return t3 && t3.length ? Qe(t3, s2(e3, 3), false, true) : [];
      }, p2.takeWhile = function(t3, e3) {
        return t3 && t3.length ? Qe(t3, s2(e3, 3)) : [];
      }, p2.tap = function(t3, e3) {
        return e3(t3), t3;
      }, p2.throttle = function(t3, e3, n3) {
        var r3 = true, i3 = true;
        if ("function" != typeof t3)
          throw new y2(Ho);
        return B2(n3) && (r3 = "leading" in n3 ? !!n3.leading : r3, i3 = "trailing" in n3 ? !!n3.trailing : i3), ci(t3, e3, { leading: r3, maxWait: e3, trailing: i3 });
      }, p2.thru = Vr, p2.toArray = Ei, p2.toPairs = to, p2.toPairsIn = eo, p2.toPath = function(t3) {
        return M(t3) ? fa(t3, br) : T2(t3) ? [t3] : I2(xr(h2(t3)));
      }, p2.toPlainObject = Yi, p2.transform = function(t3, r3, i3) {
        var e3, n3 = M(t3), o3 = n3 || wi(t3) || Li(t3);
        return r3 = s2(r3, 4), null == i3 && (e3 = t3 && t3.constructor, i3 = o3 ? n3 ? new e3() : [] : B2(t3) && xi(e3) ? Yt(nt(t3)) : {}), (o3 ? ua : se)(t3, function(t4, e4, n4) {
          return r3(i3, t4, e4, n4);
        }), i3;
      }, p2.unary = function(t3) {
        return ii(t3, 1);
      }, p2.union = kr, p2.unionBy = Er, p2.unionWith = zr, p2.uniq = function(t3) {
        return t3 && t3.length ? Ze(t3) : [];
      }, p2.uniqBy = function(t3, e3) {
        return t3 && t3.length ? Ze(t3, s2(e3, 2)) : [];
      }, p2.uniqWith = function(t3, e3) {
        return e3 = "function" == typeof e3 ? e3 : Wo, t3 && t3.length ? Ze(t3, Wo, e3) : [];
      }, p2.unset = function(t3, e3) {
        return null == t3 || Ke(t3, e3);
      }, p2.unzip = Ar, p2.unzipWith = Yr, p2.update = function(t3, e3, n3) {
        return null == t3 ? t3 : Je(t3, e3, on(n3));
      }, p2.updateWith = function(t3, e3, n3, r3) {
        return r3 = "function" == typeof r3 ? r3 : Wo, null == t3 ? t3 : Je(t3, e3, on(n3), r3);
      }, p2.values = no, p2.valuesIn = function(t3) {
        return null == t3 ? [] : tc(t3, L2(t3));
      }, p2.without = jr, p2.words = po, p2.wrap = function(t3, e3) {
        return di(on(e3), t3);
      }, p2.xor = Pr, p2.xorBy = Xr, p2.xorWith = Mr, p2.zip = Wr, p2.zipObject = function(t3, e3) {
        return nn(t3 || [], e3 || [], qt);
      }, p2.zipObjectDeep = function(t3, e3) {
        return nn(t3 || [], e3 || [], He);
      }, p2.zipWith = Hr, p2.entries = to, p2.entriesIn = eo, p2.extend = Pi, p2.extendWith = Xi, Co(p2, p2), p2.add = Eo, p2.attempt = vo, p2.camelCase = ro, p2.capitalize = io, p2.ceil = zo, p2.clamp = function(t3, e3, n3) {
        return n3 === Wo && (n3 = e3, e3 = Wo), n3 !== Wo && (n3 = (n3 = S2(n3)) == n3 ? n3 : 0), e3 !== Wo && (e3 = (e3 = S2(e3)) == e3 ? e3 : 0), te(S2(t3), e3, n3);
      }, p2.clone = function(t3) {
        return m2(t3, 4);
      }, p2.cloneDeep = function(t3) {
        return m2(t3, 5);
      }, p2.cloneDeepWith = function(t3, e3) {
        return m2(t3, 5, e3 = "function" == typeof e3 ? e3 : Wo);
      }, p2.cloneWith = function(t3, e3) {
        return m2(t3, 4, e3 = "function" == typeof e3 ? e3 : Wo);
      }, p2.conformsTo = function(t3, e3) {
        return null == e3 || ee(t3, e3, R2(e3));
      }, p2.deburr = oo, p2.defaultTo = function(t3, e3) {
        return null == t3 || t3 != t3 ? e3 : t3;
      }, p2.divide = Ao, p2.endsWith = function(t3, e3, n3) {
        t3 = h2(t3), e3 = f2(e3);
        var r3 = t3.length, r3 = n3 = n3 === Wo ? r3 : te(D2(n3), 0, r3);
        return 0 <= (n3 -= e3.length) && t3.slice(n3, r3) == e3;
      }, p2.eq = X, p2.escape = function(t3) {
        return (t3 = h2(t3)) && Ga.test(t3) ? t3.replace($a, oc) : t3;
      }, p2.escapeRegExp = function(t3) {
        return (t3 = h2(t3)) && ru.test(t3) ? t3.replace(nu, "\\$&") : t3;
      }, p2.every = function(t3, e3, n3) {
        return (M(t3) ? Pu : ae)(t3, s2(e3 = n3 && d2(t3, e3, n3) ? Wo : e3, 3));
      }, p2.find = $r, p2.findIndex = Br, p2.findKey = function(t3, e3) {
        return Vu(t3, s2(e3, 3), se);
      }, p2.findLast = qr, p2.findLastIndex = Tr, p2.findLastKey = function(t3, e3) {
        return Vu(t3, s2(e3, 3), de);
      }, p2.floor = Yo, p2.forEach = Gr, p2.forEachRight = Zr, p2.forIn = function(t3, e3) {
        return null == t3 ? t3 : fe(t3, s2(e3, 3), L2);
      }, p2.forInRight = function(t3, e3) {
        return null == t3 ? t3 : le(t3, s2(e3, 3), L2);
      }, p2.forOwn = function(t3, e3) {
        return t3 && se(t3, s2(e3, 3));
      }, p2.forOwnRight = function(t3, e3) {
        return t3 && de(t3, s2(e3, 3));
      }, p2.get = Vi, p2.gt = vi, p2.gte = gi, p2.has = function(t3, e3) {
        return null != t3 && er(t3, e3, _e);
      }, p2.hasIn = Ni, p2.head = Sr, p2.identity = O, p2.includes = function(t3, e3, n3, r3) {
        return t3 = l2(t3) ? t3 : no(t3), n3 = n3 && !r3 ? D2(n3) : 0, r3 = t3.length, n3 < 0 && (n3 = w2(r3 + n3, 0)), Ri(t3) ? n3 <= r3 && -1 < t3.indexOf(e3, n3) : !!r3 && -1 < sa(t3, e3, n3);
      }, p2.indexOf = function(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        return r3 ? (n3 = null == n3 ? 0 : D2(n3), sa(t3, e3, n3 = n3 < 0 ? w2(r3 + n3, 0) : n3)) : -1;
      }, p2.inRange = function(t3, e3, n3) {
        return e3 = zi(e3), n3 === Wo ? (n3 = e3, e3 = 0) : n3 = zi(n3), (t3 = t3 = S2(t3)) >= C2(e3 = e3, n3 = n3) && t3 < w2(e3, n3);
      }, p2.invoke = qi, p2.isArguments = _i, p2.isArray = M, p2.isArrayBuffer = yi, p2.isArrayLike = l2, p2.isArrayLikeObject = x2, p2.isBoolean = function(t3) {
        return true === t3 || false === t3 || W(t3) && n2(t3) == Zo;
      }, p2.isBuffer = wi, p2.isDate = V, p2.isElement = function(t3) {
        return W(t3) && 1 === t3.nodeType && !Ti(t3);
      }, p2.isEmpty = function(t3) {
        if (null == t3)
          return true;
        if (l2(t3) && (M(t3) || "string" == typeof t3 || "function" == typeof t3.splice || wi(t3) || Li(t3) || _i(t3)))
          return !t3.length;
        var e3, n3 = P(t3);
        if (n3 == Jo || n3 == ea)
          return !t3.size;
        if (cr(t3))
          return !Te(t3).length;
        for (e3 in t3)
          if (Y.call(t3, e3))
            return false;
        return true;
      }, p2.isEqual = function(t3, e3) {
        return be(t3, e3);
      }, p2.isEqualWith = function(t3, e3, n3) {
        var r3 = (n3 = "function" == typeof n3 ? n3 : Wo) ? n3(t3, e3) : Wo;
        return r3 === Wo ? be(t3, e3, Wo, n3) : !!r3;
      }, p2.isError = mi, p2.isFinite = function(t3) {
        return "number" == typeof t3 && gt(t3);
      }, p2.isFunction = xi, p2.isInteger = bi, p2.isLength = Ci, p2.isMap = Ii, p2.isMatch = function(t3, e3) {
        return t3 === e3 || Ce(t3, e3, Kn(e3));
      }, p2.isMatchWith = function(t3, e3, n3) {
        return n3 = "function" == typeof n3 ? n3 : Wo, Ce(t3, e3, Kn(e3), n3);
      }, p2.isNaN = function(t3) {
        return Bi(t3) && t3 != +t3;
      }, p2.isNative = function(t3) {
        if (ur(t3))
          throw new k("Unsupported core-js use. Try https://npms.io/search?q=ponyfill.");
        return Ie(t3);
      }, p2.isNil = function(t3) {
        return null == t3;
      }, p2.isNull = function(t3) {
        return null === t3;
      }, p2.isNumber = Bi, p2.isObject = B2, p2.isObjectLike = W, p2.isPlainObject = Ti, p2.isRegExp = Di, p2.isSafeInteger = function(t3) {
        return bi(t3) && -$o <= t3 && t3 <= $o;
      }, p2.isSet = Si, p2.isString = Ri, p2.isSymbol = T2, p2.isTypedArray = Li, p2.isUndefined = function(t3) {
        return t3 === Wo;
      }, p2.isWeakMap = function(t3) {
        return W(t3) && P(t3) == ka;
      }, p2.isWeakSet = function(t3) {
        return W(t3) && "[object WeakSet]" == n2(t3);
      }, p2.join = function(t3, e3) {
        return null == t3 ? "" : _t.call(t3, e3);
      }, p2.kebabCase = ao, p2.last = r2, p2.lastIndexOf = function(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        if (!r3)
          return -1;
        var i3 = r3;
        if (n3 !== Wo && (i3 = (i3 = D2(n3)) < 0 ? w2(r3 + i3, 0) : C2(i3, r3 - 1)), e3 != e3)
          return Nu(t3, $u, i3, true);
        for (var o3 = t3, a3 = e3, u3 = i3 + 1; u3--; )
          if (o3[u3] === a3)
            return u3;
        return u3;
      }, p2.lowerCase = uo, p2.lowerFirst = co, p2.lt = Oi, p2.lte = ki, p2.max = function(t3) {
        return t3 && t3.length ? ue(t3, O, ge) : Wo;
      }, p2.maxBy = function(t3, e3) {
        return t3 && t3.length ? ue(t3, s2(e3, 2), ge) : Wo;
      }, p2.mean = function(t3) {
        return qu(t3, O);
      }, p2.meanBy = function(t3, e3) {
        return qu(t3, s2(e3, 2));
      }, p2.min = function(t3) {
        return t3 && t3.length ? ue(t3, O, Se) : Wo;
      }, p2.minBy = function(t3, e3) {
        return t3 && t3.length ? ue(t3, s2(e3, 2), Se) : Wo;
      }, p2.stubArray = Oo, p2.stubFalse = ko, p2.stubObject = function() {
        return {};
      }, p2.stubString = function() {
        return "";
      }, p2.stubTrue = function() {
        return true;
      }, p2.multiply = Po, p2.nth = function(t3, e3) {
        return t3 && t3.length ? Ee(t3, D2(e3)) : Wo;
      }, p2.noConflict = function() {
        return oa._ === this && (oa._ = J), this;
      }, p2.noop = Io, p2.now = ri, p2.pad = function(t3, e3, n3) {
        t3 = h2(t3);
        var r3 = (e3 = D2(e3)) ? va(t3) : 0;
        return !e3 || e3 <= r3 ? t3 : On(pt(e3 = (e3 - r3) / 2), n3) + t3 + On(ht(e3), n3);
      }, p2.padEnd = function(t3, e3, n3) {
        t3 = h2(t3);
        var r3 = (e3 = D2(e3)) ? va(t3) : 0;
        return e3 && r3 < e3 ? t3 + On(e3 - r3, n3) : t3;
      }, p2.padStart = function(t3, e3, n3) {
        t3 = h2(t3);
        var r3 = (e3 = D2(e3)) ? va(t3) : 0;
        return e3 && r3 < e3 ? On(e3 - r3, n3) + t3 : t3;
      }, p2.parseInt = function(t3, e3, n3) {
        return e3 = n3 || null == e3 ? 0 : e3 && +e3, mt(h2(t3).replace(iu, ""), e3 || 0);
      }, p2.random = function(t3, e3, n3) {
        var r3;
        return n3 && "boolean" != typeof n3 && d2(t3, e3, n3) && (e3 = n3 = Wo), n3 === Wo && ("boolean" == typeof e3 ? (n3 = e3, e3 = Wo) : "boolean" == typeof t3 && (n3 = t3, t3 = Wo)), t3 === Wo && e3 === Wo ? (t3 = 0, e3 = 1) : (t3 = zi(t3), e3 === Wo ? (e3 = t3, t3 = 0) : e3 = zi(e3)), e3 < t3 && (r3 = t3, t3 = e3, e3 = r3), n3 || t3 % 1 || e3 % 1 ? (r3 = xt(), C2(t3 + r3 * (e3 - t3 + Du("1e-" + ((r3 + "").length - 1))), e3)) : Pe(t3, e3);
      }, p2.reduce = function(t3, e3, n3) {
        var r3 = M(t3) ? Wu : Zu, i3 = arguments.length < 3;
        return r3(t3, s2(e3, 4), n3, i3, ie);
      }, p2.reduceRight = function(t3, e3, n3) {
        var r3 = M(t3) ? Hu : Zu, i3 = arguments.length < 3;
        return r3(t3, s2(e3, 4), n3, i3, oe);
      }, p2.repeat = function(t3, e3, n3) {
        return e3 = (n3 ? d2(t3, e3, n3) : e3 === Wo) ? 1 : D2(e3), Xe(h2(t3), e3);
      }, p2.replace = function() {
        var t3 = arguments, e3 = h2(t3[0]);
        return t3.length < 3 ? e3 : e3.replace(t3[1], t3[2]);
      }, p2.result = function(t3, e3, n3) {
        var r3 = -1, i3 = (e3 = an(e3, t3)).length;
        for (i3 || (i3 = 1, t3 = Wo); ++r3 < i3; ) {
          var o3 = null == t3 ? Wo : t3[br(e3[r3])];
          o3 === Wo && (r3 = i3, o3 = n3), t3 = xi(o3) ? o3.call(t3) : o3;
        }
        return t3;
      }, p2.round = Xo, p2.runInContext = i2, p2.sample = function(t3) {
        return (M(t3) ? Vt : Me)(t3);
      }, p2.size = function(t3) {
        if (null == t3)
          return 0;
        if (l2(t3))
          return Ri(t3) ? va(t3) : t3.length;
        var e3 = P(t3);
        return e3 == Jo || e3 == ea ? t3.size : Te(t3).length;
      }, p2.snakeCase = fo, p2.some = function(t3, e3, n3) {
        return (M(t3) ? Fu : Ne)(t3, s2(e3 = n3 && d2(t3, e3, n3) ? Wo : e3, 3));
      }, p2.sortedIndex = function(t3, e3) {
        return Ue(t3, e3);
      }, p2.sortedIndexBy = function(t3, e3, n3) {
        return $e(t3, e3, s2(n3, 2));
      }, p2.sortedIndexOf = function(t3, e3) {
        var n3 = null == t3 ? 0 : t3.length;
        if (n3) {
          var r3 = Ue(t3, e3);
          if (r3 < n3 && X(t3[r3], e3))
            return r3;
        }
        return -1;
      }, p2.sortedLastIndex = function(t3, e3) {
        return Ue(t3, e3, true);
      }, p2.sortedLastIndexBy = function(t3, e3, n3) {
        return $e(t3, e3, s2(n3, 2), true);
      }, p2.sortedLastIndexOf = function(t3, e3) {
        if (null == t3 ? 0 : t3.length) {
          var n3 = Ue(t3, e3, true) - 1;
          if (X(t3[n3], e3))
            return n3;
        }
        return -1;
      }, p2.startCase = lo, p2.startsWith = function(t3, e3, n3) {
        return t3 = h2(t3), n3 = null == n3 ? 0 : te(D2(n3), 0, t3.length), e3 = f2(e3), t3.slice(n3, n3 + e3.length) == e3;
      }, p2.subtract = Mo, p2.sum = function(t3) {
        return t3 && t3.length ? Ku(t3, O) : 0;
      }, p2.sumBy = function(t3, e3) {
        return t3 && t3.length ? Ku(t3, s2(e3, 2)) : 0;
      }, p2.template = function(a3, t3, e3) {
        var u3, c3, n3 = p2.templateSettings;
        e3 && d2(a3, t3, e3) && (t3 = Wo), a3 = h2(a3), t3 = Xi({}, t3, n3, Mn);
        var r3 = R2(e3 = Xi({}, t3.imports, n3.imports, Mn)), i3 = tc(e3, r3), f3 = 0, n3 = t3.interpolate || wu, l3 = "__p += '", e3 = A((t3.escape || wu).source + "|" + n3.source + "|" + (n3 === Ja ? su : wu).source + "|" + (t3.evaluate || wu).source + "|$", "g"), o3 = "//# sourceURL=" + (Y.call(t3, "sourceURL") ? (t3.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++Tu + "]") + "\n";
        if (a3.replace(e3, function(t4, e4, n4, r4, i4, o4) {
          return n4 = n4 || r4, l3 += a3.slice(f3, o4).replace(mu, ac), e4 && (u3 = true, l3 += "' +\n__e(" + e4 + ") +\n'"), i4 && (c3 = true, l3 += "';\n" + i4 + ";\n__p += '"), n4 && (l3 += "' +\n((__t = (" + n4 + ")) == null ? '' : __t) +\n'"), f3 = o4 + t4.length, t4;
        }), l3 += "';\n", n3 = Y.call(t3, "variable") && t3.variable) {
          if (fu.test(n3))
            throw new k("Invalid `variable` option passed into `_.template`");
        } else
          l3 = "with (obj) {\n" + l3 + "\n}\n";
        if (l3 = (c3 ? l3.replace(Fa, "") : l3).replace(Va, "$1").replace(Na, "$1;"), l3 = "function(" + (n3 || "obj") + ") {\n" + (n3 ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (u3 ? ", __e = _.escape" : "") + (c3 ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + l3 + "return __p\n}", (e3 = vo(function() {
          return E(r3, o3 + "return " + l3).apply(Wo, i3);
        })).source = l3, mi(e3))
          throw e3;
        return e3;
      }, p2.times = function(t3, e3) {
        if ((t3 = D2(t3)) < 1 || $o < t3)
          return [];
        for (var n3 = qo, r3 = C2(t3, qo), r3 = (e3 = s2(e3), t3 -= qo, Ju(r3, e3)); ++n3 < t3; )
          e3(n3);
        return r3;
      }, p2.toFinite = zi, p2.toInteger = D2, p2.toLength = Ai, p2.toLower = function(t3) {
        return h2(t3).toLowerCase();
      }, p2.toNumber = S2, p2.toSafeInteger = function(t3) {
        return t3 ? te(D2(t3), -$o, $o) : 0 === t3 ? t3 : 0;
      }, p2.toString = h2, p2.toUpper = function(t3) {
        return h2(t3).toUpperCase();
      }, p2.trim = function(t3, e3, n3) {
        return (t3 = h2(t3)) && (n3 || e3 === Wo) ? Qu(t3) : t3 && (e3 = f2(e3)) ? (n3 = ga(t3), t3 = ga(e3), cn(n3, nc(n3, t3), rc(n3, t3) + 1).join("")) : t3;
      }, p2.trimEnd = function(t3, e3, n3) {
        return (t3 = h2(t3)) && (n3 || e3 === Wo) ? t3.slice(0, lc(t3) + 1) : t3 && (e3 = f2(e3)) ? cn(n3 = ga(t3), 0, rc(n3, ga(e3)) + 1).join("") : t3;
      }, p2.trimStart = function(t3, e3, n3) {
        return (t3 = h2(t3)) && (n3 || e3 === Wo) ? t3.replace(iu, "") : t3 && (e3 = f2(e3)) ? cn(n3 = ga(t3), nc(n3, ga(e3))).join("") : t3;
      }, p2.truncate = function(t3, e3) {
        var n3, r3 = 30, i3 = "...", e3 = (B2(e3) && (n3 = "separator" in e3 ? e3.separator : n3, r3 = "length" in e3 ? D2(e3.length) : r3, i3 = "omission" in e3 ? f2(e3.omission) : i3), (t3 = h2(t3)).length);
        if ((e3 = ha(t3) ? (o3 = ga(t3)).length : e3) <= r3)
          return t3;
        if ((e3 = r3 - va(i3)) < 1)
          return i3;
        var o3, r3 = o3 ? cn(o3, 0, e3).join("") : t3.slice(0, e3);
        if (n3 === Wo)
          return r3 + i3;
        if (o3 && (e3 += r3.length - e3), Di(n3)) {
          if (t3.slice(e3).search(n3)) {
            var a3, u3 = r3;
            for ((n3 = n3.global ? n3 : A(n3.source, h2(du.exec(n3)) + "g")).lastIndex = 0; a3 = n3.exec(u3); )
              var c3 = a3.index;
            r3 = r3.slice(0, c3 === Wo ? e3 : c3);
          }
        } else
          t3.indexOf(f2(n3), e3) == e3 || -1 < (o3 = r3.lastIndexOf(n3)) && (r3 = r3.slice(0, o3));
        return r3 + i3;
      }, p2.unescape = function(t3) {
        return (t3 = h2(t3)) && qa.test(t3) ? t3.replace(Ua, sc) : t3;
      }, p2.uniqueId = function(t3) {
        var e3 = ++q;
        return h2(t3) + e3;
      }, p2.upperCase = so, p2.upperFirst = ho, p2.each = Gr, p2.eachRight = Zr, p2.first = Sr, Co(p2, (jo = {}, se(p2, function(t3, e3) {
        Y.call(p2.prototype, e3) || (jo[e3] = t3);
      }), jo), { chain: false }), p2.VERSION = "4.17.21", ua(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(t3) {
        p2[t3].placeholder = p2;
      }), ua(["drop", "take"], function(n3, r3) {
        _2.prototype[n3] = function(t3) {
          t3 = t3 === Wo ? 1 : w2(D2(t3), 0);
          var e3 = this.__filtered__ && !r3 ? new _2(this) : this.clone();
          return e3.__filtered__ ? e3.__takeCount__ = C2(t3, e3.__takeCount__) : e3.__views__.push({ size: C2(t3, qo), type: n3 + (e3.__dir__ < 0 ? "Right" : "") }), e3;
        }, _2.prototype[n3 + "Right"] = function(t3) {
          return this.reverse()[n3](t3).reverse();
        };
      }), ua(["filter", "map", "takeWhile"], function(t3, e3) {
        var n3 = e3 + 1, r3 = 1 == n3 || 3 == n3;
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
        return "function" == typeof e3 ? new _2(this) : this.map(function(t3) {
          return me(t3, e3, n3);
        });
      }), _2.prototype.reject = function(t3) {
        return this.filter(si(s2(t3)));
      }, _2.prototype.slice = function(t3, e3) {
        t3 = D2(t3);
        var n3 = this;
        return n3.__filtered__ && (0 < t3 || e3 < 0) ? new _2(n3) : (t3 < 0 ? n3 = n3.takeRight(-t3) : t3 && (n3 = n3.drop(t3)), e3 !== Wo ? (e3 = D2(e3)) < 0 ? n3.dropRight(-e3) : n3.take(e3 - t3) : n3);
      }, _2.prototype.takeRightWhile = function(t3) {
        return this.reverse().takeWhile(t3).reverse();
      }, _2.prototype.toArray = function() {
        return this.take(qo);
      }, se(_2.prototype, function(f3, t3) {
        var l3 = /^(?:filter|find|map|reject)|While$/.test(t3), s3 = /^(?:head|last)$/.test(t3), d3 = p2[s3 ? "take" + ("last" == t3 ? "Right" : "") : t3], h3 = s3 || /^find/.test(t3);
        d3 && (p2.prototype[t3] = function() {
          function t4(t5) {
            return t5 = d3.apply(p2, la([t5], r3)), s3 && u3 ? t5[0] : t5;
          }
          var e3, n3 = this.__wrapped__, r3 = s3 ? [1] : arguments, i3 = n3 instanceof _2, o3 = r3[0], a3 = i3 || M(n3), u3 = (a3 && l3 && "function" == typeof o3 && 1 != o3.length && (i3 = a3 = false), this.__chain__), o3 = !!this.__actions__.length, c3 = h3 && !u3, i3 = i3 && !o3;
          return !h3 && a3 ? (n3 = i3 ? n3 : new _2(this), (e3 = f3.apply(n3, r3)).__actions__.push({ func: Vr, args: [t4], thisArg: Wo }), new g2(e3, u3)) : c3 && i3 ? f3.apply(this, r3) : (e3 = this.thru(t4), c3 ? s3 ? e3.value()[0] : e3.value() : e3);
        });
      }), ua(["pop", "push", "shift", "sort", "splice", "unshift"], function(t3) {
        var n3 = F[t3], r3 = /^(?:push|sort|unshift)$/.test(t3) ? "tap" : "thru", i3 = /^(?:pop|shift)$/.test(t3);
        p2.prototype[t3] = function() {
          var t4, e3 = arguments;
          return i3 && !this.__chain__ ? (t4 = this.value(), n3.apply(M(t4) ? t4 : [], e3)) : this[r3](function(t5) {
            return n3.apply(M(t5) ? t5 : [], e3);
          });
        };
      }), se(_2.prototype, function(t3, e3) {
        var n3, r3 = p2[e3];
        r3 && (n3 = r3.name + "", Y.call(St, n3) || (St[n3] = []), St[n3].push({ name: e3, func: r3 }));
      }), St[Dn(Wo, 2).name] = [{ name: "wrapper", func: Wo }], _2.prototype.clone = function() {
        var t3 = new _2(this.__wrapped__);
        return t3.__actions__ = I2(this.__actions__), t3.__dir__ = this.__dir__, t3.__filtered__ = this.__filtered__, t3.__iteratees__ = I2(this.__iteratees__), t3.__takeCount__ = this.__takeCount__, t3.__views__ = I2(this.__views__), t3;
      }, _2.prototype.reverse = function() {
        var t3;
        return this.__filtered__ ? ((t3 = new _2(this)).__dir__ = -1, t3.__filtered__ = true) : (t3 = this.clone()).__dir__ *= -1, t3;
      }, _2.prototype.value = function() {
        var t3 = this.__wrapped__.value(), e3 = this.__dir__, n3 = M(t3), r3 = e3 < 0, i3 = n3 ? t3.length : 0, o3 = function(t4, e4, n4) {
          var r4 = -1, i4 = n4.length;
          for (; ++r4 < i4; ) {
            var o4 = n4[r4], a4 = o4.size;
            switch (o4.type) {
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
        }(0, i3, this.__views__), a3 = o3.start, u3 = (o3 = o3.end) - a3, c3 = r3 ? o3 : a3 - 1, f3 = this.__iteratees__, l3 = f3.length, s3 = 0, d3 = C2(u3, this.__takeCount__);
        if (!n3 || !r3 && i3 == u3 && d3 == u3)
          return tn(t3, this.__actions__);
        var h3 = [];
        t:
          for (; u3-- && s3 < d3; ) {
            for (var p3 = -1, v3 = t3[c3 += e3]; ++p3 < l3; ) {
              var g3 = f3[p3], _3 = g3.iteratee, g3 = g3.type, _3 = _3(v3);
              if (2 == g3)
                v3 = _3;
              else if (!_3) {
                if (1 == g3)
                  continue t;
                break t;
              }
            }
            h3[s3++] = v3;
          }
        return h3;
      }, p2.prototype.at = Nr, p2.prototype.chain = function() {
        return Fr(this);
      }, p2.prototype.commit = function() {
        return new g2(this.value(), this.__chain__);
      }, p2.prototype.next = function() {
        this.__values__ === Wo && (this.__values__ = Ei(this.value()));
        var t3 = this.__index__ >= this.__values__.length;
        return { done: t3, value: t3 ? Wo : this.__values__[this.__index__++] };
      }, p2.prototype.plant = function(t3) {
        for (var e3, n3 = this; n3 instanceof Pt; )
          var r3 = Ir(n3), i3 = (r3.__index__ = 0, r3.__values__ = Wo, e3 ? i3.__wrapped__ = r3 : e3 = r3, r3), n3 = n3.__wrapped__;
        return i3.__wrapped__ = t3, e3;
      }, p2.prototype.reverse = function() {
        var t3 = this.__wrapped__;
        return t3 instanceof _2 ? (t3 = t3, (t3 = (t3 = this.__actions__.length ? new _2(this) : t3).reverse()).__actions__.push({ func: Vr, args: [Or], thisArg: Wo }), new g2(t3, this.__chain__)) : this.thru(Or);
      }, p2.prototype.toJSON = p2.prototype.valueOf = p2.prototype.value = function() {
        return tn(this.__wrapped__, this.__actions__);
      }, p2.prototype.first = p2.prototype.head, ut && (p2.prototype[ut] = function() {
        return this;
      }), p2;
    }();
    i ? ((i.exports = _a)._ = _a, r._ = _a) : oa._ = _a;
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
function drawImage(t, e, n, r, i, o) {
  t.imageSmoothingEnabled = true, t.imageSmoothingQuality = "high", t.drawImage(e, n, r, i, o);
}
function drawLayerBg(t, e) {
  t.fillStyle = e.layerConfig.fillStyle, t.fillRect(-CancasSafeArea / 2, -CancasSafeArea / 2, CancasSafeArea, CancasSafeArea);
}
function drawLayerImageData(t, e, n, r, i) {
  t.clearRect(e, n, r, i);
}
function drawLayerBorder(t, e, n, r, i, o) {
  t.setLineDash(o.cropConfig.lineDash), t.strokeStyle = o.cropConfig.strokeStyle, t.lineWidth = o.cropConfig.lineWidth, t.strokeRect(e, n, r, i);
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
    var i = getVariableType(n);
    let e = r ? 1 / DPI : DPI;
    if ("Number" === i)
      return n * e;
    t.forEach((t2) => {
      n[t2] *= e;
    });
  } catch (t2) {
  }
  return n;
}
function amendMobileTouchEventDpi(t) {
  return Array.from(t.touches || []).map((t2) => {
    return amendDpi({ clientX: t2.clientX, clientY: t2.clientY }, ["clientX", "clientY"]);
  });
}
function drawCropRect(t, e, n, r, i, o, a) {
  a || (clearCanvas(t), drawLayerBg(t, o)), drawLayerImageData(t, e, n, r, i), drawLayerBorder(t, e, n, r, i, o);
}
function drawCropList(n, t, r, i, o, e) {
  e || (clearCanvas(n), drawLayerBg(n, i)), t.forEach((t2) => {
    let e2 = transfromBoxToRect(t2, t2.__scale, r);
    o && (e2[0] += o.offsetX, e2[1] += o.offsetY), drawLayerImageData(n, ...e2), drawLayerBorder(n, ...e2, i);
  });
}
function pointIsInBoxList(n, r, e = 1, i = { x: 0, y: 0 }) {
  let o = [], a = [], t = r.map((t2) => transfromBoxSize2Visual(t2, e, i));
  return t.forEach((t2, e2) => {
    pointIsInBox(n, t2) && (o.push(r[e2]), a.push(e2));
  }), { boxList: o, indexList: a };
}
function transfromBoxSize2Visual(t, e, n) {
  let r = lodash.exports.cloneDeep(t);
  return r.startX = r.startX * e + n.x, r.endX = r.endX * e + n.x, r.startY = r.startY * e + n.y, r.endY = r.endY * e + n.y, r;
}
function pointIsInBox(t, e) {
  return t.x >= e.startX && t.x <= e.endX && t.y >= e.startY && t.y <= e.endY;
}
function pointIsInRect(t, e) {
  let n = e[0], r = e[0] + e[2], i = e[1], o = e[1] + e[3];
  return t.x >= n && t.x <= r && t.y >= i && t.y <= o;
}
function transfromTwoPoints2Rect(t, e) {
  var n = Math.abs(e.x - t.x), r = Math.abs(e.y - t.y);
  return [Math.min(t.x, e.x), Math.min(t.y, e.y), n, r];
}
function fixBoxInfo(t) {
  let e = t;
  var { startX: t, startY: n, endX: r, endY: i } = e, o = Math.abs(t - r), a = Math.abs(n - i), t = Math.min(t, r), n = Math.min(n, i);
  return e.startX = t, e.startY = n, e.endX = t + o, e.endY = n + a, { info: e, position: [t, n, o, a] };
}
function getTwoBoxIntersectPart(t, e) {
  var t = fixBoxInfo(t), e = fixBoxInfo(e), n = Math.min(t.info.startY, e.info.startY), r = Math.max(t.info.endY, e.info.endY);
  let i;
  Math.abs(r - n) < t.position[3] + e.position[3] && (i = { startY: Math.max(t.info.startY, e.info.startY), endY: Math.min(t.info.endY, e.info.endY) });
  r = Math.min(t.info.startX, e.info.startX), n = Math.max(t.info.endX, e.info.endX), n = Math.abs(n - r), r = t.position[2] + e.position[2];
  let o;
  if (void 0 !== (o = n < r ? { startX: Math.max(t.info.startX, e.info.startX), endX: Math.min(t.info.endX, e.info.endX) } : o) && void 0 !== i)
    return Object.assign(i, o);
}
function transfromBoxToRect(t, e = 1, n = { x: 0, y: 0 }) {
  var t = fixBoxInfo(t), { startX: r, startY: i } = t.info, o = t.position[2], t = t.position[3];
  return [r * e + n.x, i * e + n.y, o * e, t * e];
}
function isBoxValidity(t) {
  t = transfromBoxToRect(t);
  return 5 <= t[2] && 5 <= t[3];
}
function drawTagRect(t, e, n, r, i, o, a, u, c, f, l, s) {
  o = lodash.exports.cloneDeep(o.tagConfig);
  if (s && Object.assign(o, s), t.font = o.fontSize + "px sans-serif", u || c) {
    !c || u && "move" === u.type || (t.fillStyle = o.fillStyle, t.fillRect(e, n, r, i), a && o.showText && (s = parseFloat(t.font.split(" ")[0]), t.fillStyle = o.textFillStyle, t.fillText(l || a + "", e + 4, n + i / 2 + s / 2))), f && (t.strokeStyle = o.highlightStrokeStyle, t.lineWidth = o.highlightLineWidth, t.setLineDash(o.highlightLineDash), t.strokeRect(e, n, r, i));
    if (u && pointIsInRect(u, [e, n, r, i])) {
      if ("click" === u.type)
        return { isShow: c = !c, isCrash: true };
      "move" !== u.type || c || (t.strokeStyle = o.hoverStrokeStyle, t.lineWidth = o.hoverLineWidth, t.setLineDash(o.hoverLineDash), t.strokeRect(e, n, r, i));
    }
  }
}
function drawTagList(r, t, i, o, a = { offsetX: 0, offsetY: 0 }, u) {
  let c = false, f = [];
  return t.forEach((t2) => {
    let e = transfromBoxToRect(t2, t2.__scale, i);
    e[0] += a.offsetX, e[1] += a.offsetY;
    var n = drawTagRect(r, ...e, o, (t2.__index || 0) + 1, u, t2.isShow, t2.showOutLine, t2.labelText, t2.tagConfig);
    void 0 !== n && (t2.isShow = n.isShow, n.isCrash && (c = true, f.push(t2)));
  }), { isReDraw: c, redrawList: f };
}
function fixMoveRectPosition(t, e, n) {
  n = fixPoint({ x: t[0], y: t[1] }, e, n);
  return t[0] = n.x, t[1] = n.y, t[2] /= e / DPI, t[3] /= e / DPI, t;
}
function moveDrawCropRect(e, n, r, i, o, a, u, c) {
  if (void 0 !== n.x && void 0 !== r.x) {
    let t = fixMoveRectPosition(transfromTwoPoints2Rect(n, r), i, o);
    if (t[2] = amendDpi(t[2], void 0, true), t[3] = amendDpi(t[3], void 0, true), 5 < t[2] || 5 < t[3])
      return drawCropList(e, a, u, c), drawCropRect(e, ...t, c, true), t;
  }
}
function getVertexPositionByTwoPoints(t, e) {
  return (t.x <= e.x ? "left" : "right") + "-" + (t.y <= e.y ? "top" : "bottom");
}
function getPointByBoxAndVertexPosition(t, e) {
  e = e.split("-");
  return { x: "left" === e[0] ? t.startX : t.endX, y: "top" === e[1] ? t.startY : t.endY };
}
function moveDrawTagRect(e, n, r, i, o, a, u, c) {
  if (void 0 !== n.x && void 0 !== r.x) {
    let t = fixMoveRectPosition(transfromTwoPoints2Rect(n, r), i, o);
    if (t[2] = amendDpi(t[2], void 0, true), t[3] = amendDpi(t[3], void 0, true), 5 < t[2] || 5 < t[3])
      return drawTagList(e, a, u, c), drawTagRect(e, ...t, c, a.length + 1, void 0, true, void 0, c.drawingText), t;
  }
}
function getTwoPointsOffsetInfo(t, e, n) {
  var r = transfromTwoPoints2Rect(t, e), i = (e.x - t.x) / n, e = (e.y - t.y) / n;
  let o = false;
  return { isStartMove: o = 5 < r[2] || 5 < r[3] ? true : o, offsetInfo: { offsetX: i, offsetY: e } };
}
function moveCanvas(t, e, n, r, i, o, a, u, c, f, l, s) {
  if (void 0 !== a.x && void 0 !== u.x) {
    a = getTwoPointsOffsetInfo(a, u, f);
    if (a.isStartMove)
      return { offsetX: u, offsetY: f } = a.offsetInfo, clearCanvas(t), drawImage(t, n, (t = { x: o.x + u, y: o.y + f }).x, t.y, r.width * i, r.height * i), drawCropList(e, c, o, s, a.offsetInfo), drawTagList(e, l, o, s, { offsetX: u, offsetY: f }), { offsetX: u, offsetY: f };
  }
}
function fixPoint(t, e, n) {
  return { x: t.x / e + n.x, y: t.y / e + n.y };
}
function getTouchPoint(t, e, n, r) {
  t = fixPoint({ x: t.layerX, y: t.layerY }, e, n);
  return { x: t.x, y: t.y, type: r };
}
function moveDrawUnshowTagDashRect(e, t, o, a, u, c, f, l, n, s, d) {
  if ("tag" === t && !n) {
    let t2 = o.filter((t3) => !t3.isShow), n2 = false, r = getTouchPoint(f, a, c, "move"), i = [];
    t2.forEach((t3) => {
      var e2 = transfromBoxToRect(t3, t3.__scale, u);
      pointIsInRect(r, e2) && (i.push(t3), n2 = true);
    }), n2 ? (s = true, drawTagList(e, i, u, d, void 0, r)) : s && (drawCropList(e, l, u, d), drawTagList(e, o, u, d), s = false);
  }
  return s;
}
function getBoxFourBorderRect(t, e, n = -1) {
  var t = transfromBoxToRect(t, t.__scale, e), e = device.mobile() ? 6 * DPI : 6, r = e / 2;
  return [{ index: n, name: "left-top", type: "vertex", positions: [t[0] - r, t[1] - r, e, e] }, { index: n, name: "right-top", type: "vertex", positions: [t[0] + t[2] - r, t[1] - r, e, e] }, { index: n, name: "left-bottom", type: "vertex", positions: [t[0] - r, t[1] + t[3] - r, e, e] }, { index: n, name: "right-bottom", type: "vertex", positions: [t[0] + t[2] - r, t[1] + t[3] - r, e, e] }, { index: n, name: "left", type: "border", positions: [t[0] - r, t[1] + r, e, t[3] - r] }, { index: n, name: "top", type: "border", positions: [t[0] + r, t[1] - r, t[2] - r, e] }, { index: n, name: "right", type: "border", positions: [t[0] + t[2] - r, t[1] + r, e, t[3] - r] }, { index: n, name: "bottom", type: "border", positions: [t[0] + r, t[1] + t[3] - r, t[2] - r, e] }];
}
function pointIsInRectList(n, t) {
  let r = false, i = [], o = [];
  return t.forEach((t2, e) => {
    pointIsInRect(n, t2) && (r = true, i.push(t2), o.push(e));
  }), { hasIn: r, coverList: i, coverIndexList: o };
}
function detectEventIsTriggerOnBoxBorderOrVertex(t, e, n, r, i) {
  t = getTouchPoint(t, n, i, "move");
  let o = e.map((t2, e2) => getBoxFourBorderRect(t2, r, e2)).flat(), a = pointIsInRectList(t, o.map((t2) => t2.positions));
  return { hasIn: a.hasIn, list: a.coverIndexList.map((t2) => o[t2]) };
}
function findOneBorderOrVertex(t) {
  t = t.find((t2) => "vertex" === t2.type) || t[0];
  if (t)
    return t;
  throw new Error("findOneBorderOrVertex list may be empty.");
}
function moveDetectBoxBorderSetCursor(t, e, n, r, i, o, a) {
  a || ((a = detectEventIsTriggerOnBoxBorderOrVertex(e, n, r, i, o)).hasIn ? ("left-top" !== (e = findOneBorderOrVertex(a.list).name) && "right-bottom" !== e || (t.style.cursor = "nwse-resize"), "right-top" !== e && "left-bottom" !== e || (t.style.cursor = "nesw-resize"), "left" !== e && "right" !== e || (t.style.cursor = "col-resize"), "top" !== e && "bottom" !== e || (t.style.cursor = "row-resize")) : t.style.cursor = "auto");
}
function getResizeBoundingBoxInfo(t, e, n) {
  if (!n)
    return t;
  let r = lodash.exports.cloneDeep(t), i = n.name;
  var { offsetX: t, offsetY: n } = e;
  return i.includes("left") && (r.startX += t), i.includes("top") && (r.startY += n), i.includes("right") && (r.endX += t), i.includes("bottom") && (r.endY += n), r;
}
function moveResizeBox(t, e, n, r, i, o, a, u, c, f, l) {
  if (e && void 0 !== e.x && n && void 0 !== n.x) {
    var e = getTwoPointsOffsetInfo(e, n, o);
    if (e.isStartMove)
      return { offsetX: n, offsetY: o } = e.offsetInfo, e = transfromBoxToRect(getResizeBoundingBoxInfo(r, { offsetX: n / i, offsetY: o / i }, c), i, a), drawCropList(t, f, a, l), "crop" == l.mode && drawCropRect(t, ...e, l, true), drawTagList(t, u, a, l), "tag" == l.mode && drawTagRect(t, ...e, l, (r.__index || 0) + 1, void 0, r.isShow, r.showOutLine, r.labelText, r.tagConfig), e;
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
function initBoundingArrScale(t, n, r) {
  return t.map((t2, e) => (t2.__scale = n, t2.__index = e, fixBoxInfo(transformBoxPrecision(t2, r)).info));
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
  let r = [], i = [];
  return t.forEach((t2, e) => {
    boxIsAllInOtherBox(n, t2) && (i.push(t2), r.push(e));
  }), { boxList: i, indexList: r };
}
function transformTagListBoxRelativeTo(e, n, t) {
  return t.map((t2) => transformTagBoxRelativeTo(e, n, t2));
}
function transformTagBoxRelativeTo(t, e, n) {
  let r = lodash.exports.cloneDeep(n);
  return "img" === t && (r.startX = r.startX + e.startX, r.startY = r.startY + e.startY, r.endX = r.endX + e.startX, r.endY = r.endY + e.startY), "crop" === t && (r.startX = r.startX - e.startX, r.startY = r.startY - e.startY, r.endX = r.endX - e.startX, r.endY = r.endY - e.startY), r;
}
function transformBoxPrecision(t, e) {
  return t.startX = parseFloat(t.startX.toFixed(e)), t.endX = parseFloat(t.endX.toFixed(e)), t.startY = parseFloat(t.startY.toFixed(e)), t.endY = parseFloat(t.endY.toFixed(e)), t;
}
var ImgMark_vue_vue_type_style_index_0_scoped_true_lang = "", _export_sfc = (t, e) => {
  const n = t.__vccOpts || t;
  for (var [r, i] of e)
    n[r] = i;
  return n;
};
const _withScopeId = (t) => (pushScopeId("data-v-0f41609c"), t = t(), popScopeId(), t), _hoisted_1 = ["onTouchmove", "onTouchstart", "onTouchend"], _hoisted_2 = { key: 0, class: "mode-panel" }, _hoisted_3 = { class: "status" }, _hoisted_4 = { class: "text" }, _hoisted_5 = { class: "tip" }, _hoisted_6 = _withScopeId(() => createElementVNode("kbd", null, "Ctrl", -1)), _hoisted_7 = createTextVNode(" + "), _hoisted_8 = _withScopeId(() => createElementVNode("kbd", null, "B", -1)), _hoisted_9 = _withScopeId(() => createElementVNode("span", { style: { "font-size": "14px", "margin-left": "10px" } }, "\u5207\u6362\u6A21\u5F0F", -1)), _sfc_main = defineComponent({ props: { cropConfig: { default: () => DEFAULT_CONFIG.cropConfig }, layerConfig: { default: () => DEFAULT_CONFIG.layerConfig }, tagConfig: { default: () => DEFAULT_CONFIG.tagConfig }, drawingText: null, isShowTip: { type: Boolean, default: false }, enableScale: { type: Boolean, default: true }, enableMove: { type: Boolean, default: true }, enableDrawCrop: { type: Boolean, default: true }, enableDrawTag: { type: Boolean, default: true }, initScale: { type: Boolean, default: true }, enableInteractiveTagChangeStatus: { type: Boolean, default: true }, enableCropCross: { type: Boolean, default: false }, handleResizeCropCross: { default: "reset" }, enableInteractiveCropDelete: { type: Boolean, default: true }, enableCropResize: { type: Boolean, default: true }, enableTagResize: { type: Boolean, default: false }, enableDrawCropOutOfImg: { type: Boolean, default: true }, enableDrawTagOutOfCrop: { type: Boolean, default: true }, enableDrawTagOutOfImg: { type: Boolean, default: true }, isImgCrop: { type: Boolean, default: false }, isCropSingle: { type: Boolean, default: false }, cropList: { default: () => Array() }, tagList: { default: () => Array() }, mode: { default: "crop" }, mobileOperation: { default: "move" }, src: null, precision: { default: 0 }, splitClickAndDoubleClickEvent: { type: Boolean, default: false }, disableDefaultShortcuts: { default: () => Array() } }, emits: ["update:cropList", "cropListChange", "update:tagList", "tagListChange", "update:mode", "update:mobileOperation", "resizeStart", "resizeEnd", "delCrop", "drawCropStart", "drawTagStart", "mouseOverInfo", "onLoadImage"], setup(j, { expose: t, emit: a }) {
  const u = j;
  let n = false, r = void 0, i = void 0, o = null, c = null, f = { last: { down: void 0, up: void 0 }, prev: { down: void 0, up: void 0 } };
  const P = device.mobile() ? 0.1 / DPI * 1.5 : 0.1;
  let X = P, M = false;
  function W() {
    c = null, M = false, X = P, L.resizeHovering = void 0;
  }
  let l = false, s = null, d = null, h, p = lodash.exports.cloneDeep(defaultWH), v = lodash.exports.cloneDeep(defaultWH), g = lodash.exports.cloneDeep(defaultPoint), _ = lodash.exports.cloneDeep(defaultPoint), H = { x: 0, y: 0 }, F = 0, y = { x: 0, y: 0 }, w = { x: 0, y: 0 }, m = 1, x, b, V = 1, C, I = 1, B, T = [], D = [], S = computed(() => {
    let t2 = lodash.exports.cloneDeep(DEFAULT_CONFIG);
    return Object.assign(t2.cropConfig, u.cropConfig), Object.assign(t2.tagConfig, u.tagConfig), Object.assign(t2.layerConfig, u.layerConfig), t2.drawingText = u.drawingText, t2.mode = u.mode, t2;
  });
  let R = ref(), N = ref(), U = ref(), L = { isScaleing: false, isDrawRecting: false, isMoving: false, resizeHovering: void 0, isMouseDown: () => void 0 !== g.x, isMouseUpDownPoints: () => void 0 !== g.x && void 0 !== _.x };
  const O = { dragCreatRectInterrupt() {
    tt();
  }, dragCreatOrResizeRect(t2) {
    if (d && ("drawCrop" == t2 && (u.isCropSingle && !L.isDrawRecting && (D = []), L.isDrawRecting || a("drawCropStart"), L.isDrawRecting = true, B = moveDrawCropRect(d, g, _, I, w, D, y, S.value), drawTagList(d, T, y, S.value)), "drawTag" == t2 && (L.isDrawRecting || a("drawTagStart"), L.isDrawRecting = true, drawCropList(d, D, y, S.value), B = moveDrawTagRect(d, g, _, I, w, T, y, S.value)), "resize" == t2)) {
      let t3 = { crop() {
        u.enableCropResize && L.resizeHovering && d ? (c = D[L.resizeHovering.index || 0], L.resizeHovering && c && (L.isDrawRecting = true, B = moveResizeBox(d, g, _, c, c.__scale || 1, I, y, T, L.resizeHovering, D.filter((t4, e2) => {
          var _a;
          return e2 !== ((_a = L.resizeHovering) == null ? void 0 : _a.index);
        }), S.value))) : O.move();
      }, tag() {
        u.enableTagResize && L.resizeHovering && d ? (c = T[L.resizeHovering.index || 0], L.resizeHovering && c && (L.isDrawRecting = true, B = moveResizeBox(d, g, _, c, c.__scale || 1, I, y, T.filter((t4, e2) => {
          var _a;
          return e2 !== ((_a = L.resizeHovering) == null ? void 0 : _a.index);
        }), L.resizeHovering, D, S.value))) : O.move();
      } };
      t3[u.mode]();
    }
  }, changeMode() {
    "tag" === u.mode ? a("update:mode", "crop") : a("update:mode", "tag");
  }, scale(t2, e2) {
    if (!h || !s || !d)
      throw new Error("can't find canvas ctx or img");
    L.isScaleing = true, s.translate(w.x, w.y), d.translate(w.x, w.y), w = { x: w.x - (e2.x / (I * t2) - e2.x / I), y: w.y - (e2.y / (I * t2) - e2.y / I) }, s.scale(t2, t2), d.scale(t2, t2), s.translate(-w.x, -w.y), d.translate(-w.x, -w.y), I *= t2, clearCanvas(s), clearCanvas(d), drawImage(s, h, y.x, y.y, v.width * m, v.height * m), z(), M = false, L.isScaleing = false;
  }, move() {
    var t2;
    u.enableMove && s && d && h && !L.isScaleing && (L.isMoving = true, (t2 = moveCanvas(s, d, h, v, m, y, g, _, D, I, T, S.value)) && (b = lodash.exports.cloneDeep(y)) && (b.x += t2.offsetX, b.y += t2.offsetY));
  }, hoverRect(t2) {
    d && (M = moveDrawUnshowTagDashRect(d, u.mode, T, I, y, w, t2, D, L.isScaleing, M, S.value), n || (u.enableCropResize && "crop" === u.mode && moveDetectBoxBorderSetCursor(R.value, t2, D, I, y, w, L.isScaleing), u.enableTagResize && "tag" === u.mode && moveDetectBoxBorderSetCursor(R.value, t2, T, I, y, w, L.isScaleing)));
  } }, k = { onMouseOverMove(t2) {
    device.mobile() || L.isMouseDown() || device.mobile() ? this.onHoldMouseLeftBtnMove(t2) : O.hoverRect(t2);
  }, onHoldMouseLeftBtnMove(t2) {
    _ = { x: t2.layerX, y: t2.layerY }, n ? this.onDrawSwitchOnStartDraw() : L.resizeHovering ? O.dragCreatOrResizeRect("resize") : O.move();
  }, onDoubleClick(e2) {
    if ("crop" === u.mode && u.enableInteractiveCropDelete && ht(pointIsInBoxList(e2, D, m, y).boxList), "tag" === u.mode) {
      let t2 = pointIsInBoxList(e2, T, m, y)["boxList"];
      t2.forEach((t3) => {
        var _a;
        (_a = t3 == null ? void 0 : t3.onDoubleClick) == null ? void 0 : _a.call(t3, "", t3);
      });
    }
  }, onCick(e2) {
    if ("tag" === u.mode && d) {
      let t2 = pointIsInBoxList(e2, T, m, y)["boxList"];
      var n2;
      t2.forEach((t3) => {
        var _a;
        (_a = t3 == null ? void 0 : t3.onClick) == null ? void 0 : _a.call(t3, "", t3);
      }), u.enableInteractiveTagChangeStatus && (drawCropList(d, D, y, S.value), { isReDraw: e2, redrawList: n2 } = drawTagList(d, T, y, S.value, void 0, e2), e2 && (z(), nt("statusChange", A(n2))));
    }
  }, onWheel(t2, e2, n2) {
    (u.enableScale || n2) && O.scale(t2, e2);
  }, onDrawSwitchOnStartDraw() {
    "crop" === u.mode ? u.enableDrawCrop && O.dragCreatOrResizeRect("drawCrop") : u.enableDrawTag && O.dragCreatOrResizeRect("drawTag");
  } }, e = { shiftMode() {
    O.changeMode();
  }, shiftDrawSwitch(t2) {
    nextTick(() => {
      "on" === t2 && ((u.enableDrawCrop && "crop" === u.mode || u.enableDrawTag && "tag" === u.mode) && (R.value.style.cursor = "crosshair"), L.isMouseDown() || (n = true)), "off" === t2 && (L.isMoving || L.resizeHovering || O.dragCreatRectInterrupt(), n = false);
    });
  }, init() {
    !async function() {
      if (W(), l = false, s = null, d = null, h = void 0, p = lodash.exports.cloneDeep(defaultWH), v = lodash.exports.cloneDeep(defaultWH), g = lodash.exports.cloneDeep(defaultPoint), _ = lodash.exports.cloneDeep(defaultPoint), y = { x: 0, y: 0 }, w = { x: 0, y: 0 }, m = 1, x = void 0, b = void 0, V = 1, C = void 0, I = 1, B = void 0, T = [], D = [], await nextTick(), 1 < u.cropList.length) {
        let e2 = { startX: 1 / 0, startY: 1 / 0, endX: -1 / 0, endY: -1 / 0 };
        u.cropList.forEach((t2) => {
          t2 = fixBoxInfo(t2);
          t2.info.startX < e2.startX && (e2.startX = t2.info.startX), t2.info.startY < e2.startY && (e2.startY = t2.info.startY), t2.info.endX > e2.endX && (e2.endX = t2.info.endX), t2.info.endY > e2.endY && (e2.endY = t2.info.endY);
        }), x = e2;
      }
      return 1 == u.cropList.length && (x = u.cropList[0]), T = lodash.exports.cloneDeep(u.tagList), D = lodash.exports.cloneDeep(u.cropList), E(), device.mobile() || (window.addEventListener("keydown", $), window.addEventListener("keyup", q)), Z(), s = N.value.getContext("2d"), d = U.value.getContext("2d"), s && d ? (p = amendDpi(getElementWH(s.canvas))) ? (initCanvasWH(s, p), initCanvasWH(d, p), a("onLoadImage", { status: "loading" }), loadImage(u.src).then((t2) => {
        return a("onLoadImage", { status: "success" }), p && s && d ? (h = t2, v = { width: h.width, height: h.height }, u.initScale && (t2 = initScale(p, h), m = V = t2.scale, x ? (e2 = transfromBoxToRect(x, V, y), n2 = (p.width - 0.05 * p.width) / e2[2], r2 = (p.height - 0.05 * p.height) / e2[3], r2 = p.width / p.height > e2[2] / e2[3] ? r2 : n2, i2 = e2[0] + e2[2], o2 = e2[1] + e2[3], (r2 = r2) == n2 ? (y.x = (p.width - i2 * r2 - 0.05 * p.width / 2) / r2, y.y = ((p.height - e2[3] * r2) / 2 - e2[1] * r2) / r2) : (y.x = ((p.width - e2[2] * r2) / 2 - e2[0] * r2) / r2, y.y = (p.height - o2 * r2 - 0.05 * p.height / 2) / r2), J({ deltaY: 1, clientX: 0, clientY: 0, preventDefault() {
        }, stopPropagation() {
        }, __zoom: r2 }, true)) : ("width" === t2.fit ? y.x = (p.width - v.width * m) / 2 : y.y = (p.height - v.height * m) / 2, x = { startX: 0, startY: 0, endX: 0 + v.width, endY: 0 + v.height }, u.isImgCrop && et("add", D = [x]))), drawImage(s, h, y.x, y.y, h.width * m, h.height * m), D = initBoundingArrScale(D, m, u.precision), T = initBoundingArrScale(T, m, u.precision), z(), true) : Promise.reject("canvasWH or canvas var not has valid values.");
        var e2, n2, r2, i2, o2;
      }).catch((t2) => {
        a("onLoadImage", { status: "error", msg: JSON.stringify(t2) });
      })) : Promise.reject("Error: can't get canvas height and width.") : Promise.reject("Error: can't find canvas element.");
    }().then(() => {
      l = true;
    });
  }, resize() {
    requestAnimationFrame(() => {
      !async function() {
        if (G(), await nextTick(), E(), s && d && h) {
          if (!(p = amendDpi(getElementWH(s.canvas))))
            return Promise.reject("Error: can't get canvas height and width.");
          initCanvasWH(s, p), initCanvasWH(d, p), s.scale(I, I), d.scale(I, I), s.translate(-w.x, -w.y), d.translate(-w.x, -w.y), drawImage(s, h, y.x, y.y, h.width * m, h.height * m), D = initBoundingArrScale(D, m, u.precision), T = initBoundingArrScale(T, m, u.precision), z(), l = true;
        }
      }();
    });
  } };
  function $(t2) {
    "Space" !== t2.code || u.disableDefaultShortcuts.includes("space") || (t2.target === document.body && t2.preventDefault(), e.shiftDrawSwitch("on"));
  }
  function q(t2) {
    if ("KeyB" === t2.code && t2.ctrlKey) {
      if (u.disableDefaultShortcuts.includes("ctrl+b"))
        return;
      e.shiftMode();
    }
    "Space" !== t2.code || u.disableDefaultShortcuts.includes("space") || e.shiftDrawSwitch("off");
  }
  function E() {
    var t2 = R.value.getBoundingClientRect();
    C = { top: t2.top, right: t2.right, bottom: t2.bottom, left: t2.left, width: t2.width, height: t2.height, x: t2.x, y: t2.y };
  }
  function G() {
    c = null, l = false, p = lodash.exports.cloneDeep(defaultWH), g = lodash.exports.cloneDeep(defaultPoint), _ = lodash.exports.cloneDeep(defaultPoint), C = void 0;
  }
  function z() {
    d && (drawCropList(d, D, y, S.value), drawTagList(d, T, y, S.value));
  }
  function Z() {
    device.mobile() && ("draw" === u.mobileOperation && e.shiftDrawSwitch("on"), "move" === u.mobileOperation && e.shiftDrawSwitch("off"));
  }
  function K() {
    e.resize();
  }
  function J(t2, e2) {
    u.enableScale && (t2.stopPropagation(), t2.preventDefault());
    var n2, r2, i2;
    if (!C)
      throw new Error("can't find  containerInfo.");
    !l && !t2.__zoom || L.isDrawRecting || L.isMoving || (r2 = t2.onTouchMove ? 1 : DPI, n2 = e2 ? 0 : (t2.clientX - C.left) * r2, r2 = e2 ? 0 : (t2.clientY - C.top) * r2, i2 = t2.deltaY < 0 ? 1 : -1, t2 = e2 ? t2.__zoom : Math.exp(i2 * X), I * t2 < 0.2 || k.onWheel(t2, { x: n2, y: r2 }, e2));
  }
  function Q(e2) {
    if (L.resizeHovering) {
      var n2;
      let t2 = { crop: { boxList: D, trigger: et, getBoxFunc: Y }, tag: { boxList: T, trigger: nt, getBoxFunc: A } }[u.mode];
      t2.boxList[L.resizeHovering.index] = e2, a("resizeEnd", { index: L.resizeHovering.index, box: e2 }), "tag" === u.mode && (n2 = getVertexPositionByTwoPoints(g, _), Object.assign(e2, { __oprateType: "resize", __vertexPosition: n2 })), t2.trigger("resize", t2.getBoxFunc([e2]));
    }
  }
  function tt() {
    if (l) {
      var t2, e2;
      if (L.isMoving = false, b && (y = lodash.exports.cloneDeep(b)), b = void 0, L.isMouseUpDownPoints())
        if ("crop" === u.mode) {
          if (B) {
            let t3 = { ...c, ...transfromRect2Box(B, y, m) };
            c = null, L.resizeHovering ? !u.enableCropCross && getBoxIsIntersectWithBoxList(t3, D.filter((t4, e3) => {
              var _a;
              return e3 !== ((_a = L.resizeHovering) == null ? void 0 : _a.index);
            })) ? ("reset" === u.handleResizeCropCross && z(), "delete" === u.handleResizeCropCross && ht([D[L.resizeHovering.index]])) : Q(t3) : (t3 = initBoundingArrScale([t3], m, u.precision)[0], !u.enableCropCross && getBoxIsIntersectWithBoxList(t3, D) ? z() : (D.push(t3), et("add", Y([t3])))), B = void 0;
          }
        } else
          B && (t2 = { ...c, ...transfromRect2Box(B, y, m) }, c = null, L.resizeHovering ? Q(t2) : (t2 = getVertexPositionByTwoPoints(g, _), e2 = initBoundingArrScale([e2 = transfromRect2Box(B, y, m)], m, u.precision)[0], Object.assign(e2, { isShow: true, __oprateType: "add", __vertexPosition: t2 }), T.push(e2), nt("add", A([e2]))), B = void 0);
      L.resizeHovering = void 0, L.isDrawRecting = false, g = lodash.exports.cloneDeep(defaultPoint), _ = lodash.exports.cloneDeep(defaultPoint), R.value.style.cursor = "auto";
    }
  }
  function et(t2, e2) {
    var n2 = Y(D);
    a("update:cropList", n2), a("cropListChange", { type: t2, list: e2 });
  }
  function nt(t2, e2) {
    let n2 = { type: t2, list: e2 };
    if ("add" === t2) {
      let t3 = e2.filter((t4) => Reflect.get(t4, "__parentCrop"))[0];
      t3 && (n2.parentCrop = Y([Reflect.get(t3, "__parentCrop")])[0], delete t3.__parentCrop);
    }
    a("tagListChange", n2);
    t2 = A(T);
    a("update:tagList", t2);
  }
  function A(t2) {
    let e2 = t2 || T, r2 = D, i2 = [];
    return e2.forEach((t3) => {
      let e3 = t3;
      if (!u.enableDrawTagOutOfCrop && e3.__oprateType && e3.__vertexPosition) {
        t3 = pointIsInBoxList(getPointByBoxAndVertexPosition(e3, e3.__vertexPosition), r2).boxList[0];
        if (!t3)
          return;
        var n2 = getTwoBoxIntersectPart(e3, t3);
        n2 && isBoxValidity(n2) ? (Object.assign(e3, n2), e3.__parentCrop = t3) : e3.__isValidity = false;
      }
      delete e3.__oprateType, Reflect.deleteProperty(e3, "__vertexPosition"), u.enableDrawTagOutOfCrop && !u.enableDrawTagOutOfImg && (t3 = { startX: 0, startY: 0, endX: (n2 = v).width, endY: n2.height }, (n2 = getTwoBoxIntersectPart(e3, t3)) && isBoxValidity(n2) ? Object.assign(e3, n2) : e3.__isValidity = false);
      t3 = fixBoxInfo(e3);
      i2.push(transformBoxPrecision(t3.info, u.precision));
    }), i2.filter((t3) => false !== t3.__isValidity);
  }
  function Y(t2) {
    let e2 = t2 || D, n2 = e2.map((t3) => {
      let e3 = t3;
      u.enableDrawCropOutOfImg || (n3 = { startX: 0, startY: 0, endX: (n3 = v).width, endY: n3.height }, (n3 = getTwoBoxIntersectPart(e3, n3)) && isBoxValidity(n3) ? e3 = { ...t3, ...n3 } : e3._del = true), Reflect.deleteProperty(e3, "__vertexPosition");
      var n3, t3 = fixBoxInfo(e3);
      return transformBoxPrecision(t3.info, u.precision);
    });
    return n2.filter((t3) => !t3._del);
  }
  function rt(t2) {
    var e2;
    l && s && d && (e2 = new Date().getTime(), r = e2, f.prev.down ? f.last.down = e2 : f.prev.down = e2, e2 = amendDpi(e2 = { layerX: Reflect.get(t2, "layerX"), layerY: Reflect.get(t2, "layerY") }, ["layerX", "layerY"]), g = { x: e2.layerX, y: e2.layerY }, "crop" === u.mode && !n && u.enableCropResize && (t2 = detectEventIsTriggerOnBoxBorderOrVertex(e2, D, I, y, w)).hasIn && (L.resizeHovering = findOneBorderOrVertex(t2.list), a("resizeStart", { index: L.resizeHovering.index, box: D[L.resizeHovering.index] })), "tag" === u.mode && !n && u.enableTagResize && (t2 = detectEventIsTriggerOnBoxBorderOrVertex(e2, T, I, y, w)).hasIn && (L.resizeHovering = findOneBorderOrVertex(t2.list), a("resizeStart", { index: L.resizeHovering.index, box: T[L.resizeHovering.index] })));
  }
  onBeforeUnmount(() => {
    window.removeEventListener("resize", K), device.mobile() || (window.removeEventListener("keydown", $), window.removeEventListener("keyup", q)), W();
  }), onMounted(() => {
    e.init(), window.addEventListener("resize", K);
  }), watch(() => u.mode, (t2) => {
    "tag" === t2 && (R.value.style.cursor = "auto");
  }), watch(() => u.src, (t2) => {
    t2 && e.init();
  }), watch(() => u.mobileOperation, (t2) => {
    l && Z();
  }), watch(() => u.tagList, (t2) => {
    l && (T = initBoundingArrScale(t2, m, u.precision), z());
  }, { deep: true }), watch(() => u.cropList, (t2) => {
    l && (D = initBoundingArrScale(t2, m, u.precision), z());
  });
  let it = lodash.exports.throttle(function(e2) {
    if (e2) {
      e2 = getTouchPoint(e2, I, w, "over");
      let t2 = lodash.exports.cloneDeep(e2);
      t2.x -= y.x, t2.y -= y.y, t2.x /= m, t2.y /= m, a("mouseOverInfo", { canvas: e2, img: t2 });
    } else
      a("mouseOverInfo", { canvas: null, img: null });
  }, 100, { leading: false, trailing: true });
  function ot(t2) {
    l && (t2 = amendDpi(t2 = { layerX: Reflect.get(t2, "layerX"), layerY: Reflect.get(t2, "layerY") }, ["layerX", "layerY"]), i = new Date().getTime(), k.onMouseOverMove(t2), it(t2));
  }
  function at() {
    var t2;
    l && (t2 = new Date().getTime(), f.prev.up ? f.last.up = t2 : f.prev.up = t2, tt());
  }
  function ut() {
    l && (R.value.style.cursor = "auto", tt(), it());
  }
  function ct() {
    o && clearTimeout(o), o = null;
  }
  function ft(e2) {
    if (E(), l) {
      let t2 = getTouchPoint(amendDpi({ layerX: Reflect.get(e2, "layerX"), layerY: Reflect.get(e2, "layerY") }, ["layerX", "layerY"]), I, w, "click");
      var e2 = i && r ? i - r : 0;
      r = void 0, i = void 0, 100 < e2 || (u.splitClickAndDoubleClickEvent ? (ct(), o = setTimeout(() => {
        k.onCick(t2), o = null;
      }, 230)) : k.onCick(t2), e2 = u.splitClickAndDoubleClickEvent ? 320 : 360, f.prev.up && f.prev.down && f.last.up && f.last.down && (f.last.up - f.prev.down < e2 ? (u.splitClickAndDoubleClickEvent && ct(), k.onDoubleClick(t2), f.prev.down = void 0, f.prev.up = void 0) : (f.prev.down = f.last.down, f.prev.up = f.last.up), f.last.down = void 0, f.last.up = void 0));
    }
  }
  function lt(t2) {
    E(), r = new Date().getTime();
    var e2 = t2.touches;
    if (1 === t2.touches.length && rt({ layerX: e2[0].clientX, layerY: e2[0].clientY }), 2 == t2.touches.length) {
      if (!C)
        throw new Error("can't find  containerInfo.");
      e2 = amendMobileTouchEventDpi(t2);
      getTwoFingerTouchListDistence(e2), H = { x: (e2[0].clientX + e2[1].clientX) / 2 - C.left, y: (e2[0].clientY + e2[1].clientY) / 2 - C.top };
    }
  }
  function st(t2) {
    i = new Date().getTime();
    var e2 = t2.touches;
    if (1 === t2.touches.length && ot({ layerX: e2[0].clientX, layerY: e2[0].clientY }), 2 == t2.touches.length) {
      if (!C)
        throw new Error("can't find  containerInfo.");
      var { width: e2, height: t2 } = getTwoFingerTouchListDistence(amendMobileTouchEventDpi(t2)), e2 = getHypotenuseValue(e2, t2), t2 = -(e2 - F);
      F = e2, J({ onTouchMove: true, deltaY: t2, preventDefault() {
      }, stopPropagation() {
      }, clientX: H.x, clientY: H.y });
    }
  }
  function dt(t2) {
    at();
  }
  function ht(r2) {
    if (0 !== r2.length) {
      let t2 = [], n2 = [], e2 = Y();
      e2.forEach((e3) => {
        (r2.find((t3) => {
          t3 = fixBoxInfo(t3).info;
          return t3.startX === e3.startX && t3.endX === e3.endX && t3.startY === e3.startY && t3.endY === e3.endY;
        }) ? n2 : t2).push(e3);
      }), D = initBoundingArrScale(t2, m, u.precision), a("delCrop", n2), z(), et("delete", Y(n2));
    }
  }
  return t({ render: z, removeTagItems: function(n2) {
    let r2 = [], i2 = [];
    if (0 !== n2.length) {
      let t2 = A();
      t2.forEach((e2) => {
        (n2.find((t3) => {
          t3 = fixBoxInfo(t3).info;
          return t3.startX === e2.startX && t3.endX === e2.endX && t3.startY === e2.startY && t3.endY === e2.endY;
        }) ? i2 : r2).push(e2);
      });
    }
    T = initBoundingArrScale(r2, m, u.precision), z(), nt("delete", i2);
  }, getTagListGroupByCropIndex: function(n2 = "startPoint") {
    let t2 = A(), r2 = Y();
    return t2.forEach((t3) => {
      var e2;
      "startPoint" === n2 && (e2 = pointIsInBoxList({ x: t3.startX, y: t3.startY }, r2), t3.__groupIndex = e2.indexList[0]), "allIn" === n2 && (e2 = boxAllInBoxList(t3, r2), t3.__groupIndex = e2.indexList[0]);
    }), lodash.exports.groupBy(t2, "__groupIndex");
  }, hooks: e }), (t2, e2) => (openBlock(), createElementBlock("div", { class: "comp-ocr-img", ref_key: "containerRef", ref: R, onMousedown: rt, onMouseenter: E, onClick: ft, onMouseup: at, onMousemove: ot, onMouseout: ut, onMousewheel: J, onTouchmove: withModifiers(st, ["stop", "prevent"]), onTouchstart: withModifiers(lt, ["stop"]), onTouchend: withModifiers(dt, ["stop"]) }, [createElementVNode("canvas", { class: "canvas", ref_key: "canvasRef", ref: N }, null, 512), createElementVNode("canvas", { class: "canvas2", ref_key: "canvas2Ref", ref: U }, null, 512), unref(u).isShowTip ? (openBlock(), createElementBlock("div", _hoisted_2, [createElementVNode("div", _hoisted_3, [createElementVNode("div", { class: normalizeClass(["circle", { crop: "crop" === j.mode, tag: "tag" === j.mode }]) }, null, 2), createElementVNode("div", _hoisted_4, toDisplayString("crop" === j.mode ? "\u88C1\u526A\u6A21\u5F0F" : "\u6807\u8BB0\u9519\u8BEF\u884C"), 1)]), createElementVNode("div", _hoisted_5, [renderSlot(t2.$slots, "tip", {}, () => [_hoisted_6, _hoisted_7, _hoisted_8, _hoisted_9], true)])])) : createCommentVNode("", true)], 40, _hoisted_1));
} });
var ImgMark = _export_sfc(_sfc_main, [["__scopeId", "data-v-0f41609c"]]);
export { ImgMark, boxIsAllInOtherBox, transformTagBoxRelativeTo, transformTagListBoxRelativeTo };
