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
!function(L, O) {
  !function() {
    var Wi, Fi = "Expected a function", ya = "__lodash_hash_undefined__", wa = "__lodash_placeholder__", xa = 16, Hi = 32, Vi = 64, Ni = 128, ma = 256, Ui = 1 / 0, $i = 9007199254740991, ba = NaN, Gi = 4294967295, Ca = [["ary", Ni], ["bind", 1], ["bindKey", 2], ["curry", 8], ["curryRight", xa], ["flip", 512], ["partial", Hi], ["partialRight", Vi], ["rearg", ma]], qi = "[object Arguments]", Da = "[object Array]", Zi = "[object Boolean]", Ki = "[object Date]", Ia = "[object Error]", Sa = "[object Function]", Ba = "[object GeneratorFunction]", Ji = "[object Map]", Qi = "[object Number]", ta = "[object Object]", Ta = "[object Promise]", La = "[object RegExp]", ea = "[object Set]", Oa = "[object String]", Ra = "[object Symbol]", ka = "[object WeakMap]", Ea = "[object ArrayBuffer]", na = "[object DataView]", Aa = "[object Float32Array]", Pa = "[object Float64Array]", za = "[object Int8Array]", Ya = "[object Int16Array]", ja = "[object Int32Array]", Xa = "[object Uint8Array]", Ma = "[object Uint8ClampedArray]", Wa = "[object Uint16Array]", Fa = "[object Uint32Array]", Ha = /\b__p \+= '';/g, Va = /\b(__p \+=) '' \+/g, Na = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Ua = /&(?:amp|lt|gt|quot|#39);/g, $a = /[&<>"']/g, Ga = RegExp(Ua.source), qa = RegExp($a.source), Za = /<%-([\s\S]+?)%>/g, Ka = /<%([\s\S]+?)%>/g, Ja = /<%=([\s\S]+?)%>/g, Qa = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, tu = /^\w*$/, eu = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, nu = /[\\^$.*+?()[\]{}|]/g, ru = RegExp(nu.source), ou = /^\s+/, i = /\s/, iu = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, au = /\{\n\/\* \[wrapped with (.+)\] \*/, uu = /,? & /, cu = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, su = /[()=,{}\[\]\/\s]/, lu = /\\(\\)?/g, fu = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, du = /\w*$/, hu = /^[-+]0x[0-9a-f]+$/i, pu = /^0b[01]+$/i, vu = /^\[object .+?Constructor\]$/, gu = /^0o[0-7]+$/i, _u = /^(?:0|[1-9]\d*)$/, yu = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, wu = /($^)/, xu = /['\n\r\u2028\u2029\\]/g, a = "\\ud800-\\udfff", u = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff", c = "\\u2700-\\u27bf", t = "a-z\\xdf-\\xf6\\xf8-\\xff", e = "A-Z\\xc0-\\xd6\\xd8-\\xde", s = "\\ufe0e\\ufe0f", l = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", f = "['\u2019]", n = "[" + a + "]", d = "[" + l + "]", h = "[" + u + "]", p = "[" + c + "]", v = "[" + t + "]", l = "[^" + a + l + "\\d+" + c + t + e + "]", c = "\\ud83c[\\udffb-\\udfff]", t = "[^" + a + "]", g = "(?:\\ud83c[\\udde6-\\uddff]){2}", r = "[\\ud800-\\udbff][\\udc00-\\udfff]", e = "[" + e + "]", _ = "\\u200d", y = "(?:" + v + "|" + l + ")", l = "(?:" + e + "|" + l + ")", w = "(?:['\u2019](?:d|ll|m|re|s|t|ve))?", x = "(?:['\u2019](?:D|LL|M|RE|S|T|VE))?", m = "(?:" + h + "|" + c + ")?", b = "[" + s + "]?", b = b + m + ("(?:" + _ + "(?:" + [t, g, r].join("|") + ")" + b + m + ")*"), m = "(?:" + [p, g, r].join("|") + ")" + b, p = "(?:" + [t + h + "?", h, g, r, n].join("|") + ")", mu = RegExp(f, "g"), bu = RegExp(h, "g"), C = RegExp(c + "(?=" + c + ")|" + p + b, "g"), Cu = RegExp([e + "?" + v + "+" + w + "(?=" + [d, e, "$"].join("|") + ")", l + "+" + x + "(?=" + [d, e + y, "$"].join("|") + ")", e + "?" + y + "+" + w, e + "+" + x, "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", "\\d+", m].join("|"), "g"), D = RegExp("[" + _ + a + u + s + "]"), Du = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, Iu = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"], Su = -1, ra = {}, oa = (ra[Aa] = ra[Pa] = ra[za] = ra[Ya] = ra[ja] = ra[Xa] = ra[Ma] = ra[Wa] = ra[Fa] = true, ra[qi] = ra[Da] = ra[Ea] = ra[Zi] = ra[na] = ra[Ki] = ra[Ia] = ra[Sa] = ra[Ji] = ra[Qi] = ra[ta] = ra[La] = ra[ea] = ra[Oa] = ra[ka] = false, {}), I = (oa[qi] = oa[Da] = oa[Ea] = oa[na] = oa[Zi] = oa[Ki] = oa[Aa] = oa[Pa] = oa[za] = oa[Ya] = oa[ja] = oa[Ji] = oa[Qi] = oa[ta] = oa[La] = oa[ea] = oa[Oa] = oa[Ra] = oa[Xa] = oa[Ma] = oa[Wa] = oa[Fa] = true, oa[Ia] = oa[Sa] = oa[ka] = false, { "\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029" }), Bu = parseFloat, Tu = parseInt, t = "object" == typeof commonjsGlobal && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal, g = "object" == typeof self && self && self.Object === Object && self, ia = t || g || Function("return this")(), r = O && !O.nodeType && O, o = r && L && !L.nodeType && L, Lu = o && o.exports === r, S = Lu && t.process, n = function() {
      try {
        var t2 = o && o.require && o.require("util").types;
        return t2 ? t2 : S && S.binding && S.binding("util");
      } catch (t3) {
      }
    }(), Ou = n && n.isArrayBuffer, Ru = n && n.isDate, ku = n && n.isMap, Eu = n && n.isRegExp, Au = n && n.isSet, Pu = n && n.isTypedArray;
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
      for (var o2 = -1, i2 = null == t2 ? 0 : t2.length; ++o2 < i2; ) {
        var a2 = t2[o2];
        e2(r2, a2, n2(a2), t2);
      }
      return r2;
    }
    function ua(t2, e2) {
      for (var n2 = -1, r2 = null == t2 ? 0 : t2.length; ++n2 < r2 && false !== e2(t2[n2], n2, t2); )
        ;
      return t2;
    }
    function Yu(t2, e2) {
      for (var n2 = null == t2 ? 0 : t2.length; n2-- && false !== e2(t2[n2], n2, t2); )
        ;
      return t2;
    }
    function ju(t2, e2) {
      for (var n2 = -1, r2 = null == t2 ? 0 : t2.length; ++n2 < r2; )
        if (!e2(t2[n2], n2, t2))
          return false;
      return true;
    }
    function ca(t2, e2) {
      for (var n2 = -1, r2 = null == t2 ? 0 : t2.length, o2 = 0, i2 = []; ++n2 < r2; ) {
        var a2 = t2[n2];
        e2(a2, n2, t2) && (i2[o2++] = a2);
      }
      return i2;
    }
    function Xu(t2, e2) {
      return !!(null == t2 ? 0 : t2.length) && -1 < fa(t2, e2, 0);
    }
    function Mu(t2, e2, n2) {
      for (var r2 = -1, o2 = null == t2 ? 0 : t2.length; ++r2 < o2; )
        if (n2(e2, t2[r2]))
          return true;
      return false;
    }
    function sa(t2, e2) {
      for (var n2 = -1, r2 = null == t2 ? 0 : t2.length, o2 = Array(r2); ++n2 < r2; )
        o2[n2] = e2(t2[n2], n2, t2);
      return o2;
    }
    function la(t2, e2) {
      for (var n2 = -1, r2 = e2.length, o2 = t2.length; ++n2 < r2; )
        t2[o2 + n2] = e2[n2];
      return t2;
    }
    function Wu(t2, e2, n2, r2) {
      var o2 = -1, i2 = null == t2 ? 0 : t2.length;
      for (r2 && i2 && (n2 = t2[++o2]); ++o2 < i2; )
        n2 = e2(n2, t2[o2], o2, t2);
      return n2;
    }
    function Fu(t2, e2, n2, r2) {
      var o2 = null == t2 ? 0 : t2.length;
      for (r2 && o2 && (n2 = t2[--o2]); o2--; )
        n2 = e2(n2, t2[o2], o2, t2);
      return n2;
    }
    function Hu(t2, e2) {
      for (var n2 = -1, r2 = null == t2 ? 0 : t2.length; ++n2 < r2; )
        if (e2(t2[n2], n2, t2))
          return true;
      return false;
    }
    var B = qu("length");
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
    function fa(t2, e2, n2) {
      if (e2 != e2)
        return Nu(t2, $u, n2);
      for (var r2 = t2, o2 = e2, i2 = n2 - 1, a2 = r2.length; ++i2 < a2; )
        if (r2[i2] === o2)
          return i2;
      return -1;
    }
    function Uu(t2, e2, n2, r2) {
      for (var o2 = n2 - 1, i2 = t2.length; ++o2 < i2; )
        if (r2(t2[o2], e2))
          return o2;
      return -1;
    }
    function $u(t2) {
      return t2 != t2;
    }
    function Gu(t2, e2) {
      var n2 = null == t2 ? 0 : t2.length;
      return n2 ? Ku(t2, e2) / n2 : ba;
    }
    function qu(e2) {
      return function(t2) {
        return null == t2 ? Wi : t2[e2];
      };
    }
    function T(e2) {
      return function(t2) {
        return null == e2 ? Wi : e2[t2];
      };
    }
    function Zu(t2, r2, o2, i2, e2) {
      return e2(t2, function(t3, e3, n2) {
        o2 = i2 ? (i2 = false, t3) : r2(o2, t3, e3, n2);
      }), o2;
    }
    function Ku(t2, e2) {
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
      return sa(t2, function(t3) {
        return e2[t3];
      });
    }
    function ec(t2, e2) {
      return t2.has(e2);
    }
    function nc(t2, e2) {
      for (var n2 = -1, r2 = t2.length; ++n2 < r2 && -1 < fa(e2, t2[n2], 0); )
        ;
      return n2;
    }
    function rc(t2, e2) {
      for (var n2 = t2.length; n2-- && -1 < fa(e2, t2[n2], 0); )
        ;
      return n2;
    }
    var oc = T({ "\xC0": "A", "\xC1": "A", "\xC2": "A", "\xC3": "A", "\xC4": "A", "\xC5": "A", "\xE0": "a", "\xE1": "a", "\xE2": "a", "\xE3": "a", "\xE4": "a", "\xE5": "a", "\xC7": "C", "\xE7": "c", "\xD0": "D", "\xF0": "d", "\xC8": "E", "\xC9": "E", "\xCA": "E", "\xCB": "E", "\xE8": "e", "\xE9": "e", "\xEA": "e", "\xEB": "e", "\xCC": "I", "\xCD": "I", "\xCE": "I", "\xCF": "I", "\xEC": "i", "\xED": "i", "\xEE": "i", "\xEF": "i", "\xD1": "N", "\xF1": "n", "\xD2": "O", "\xD3": "O", "\xD4": "O", "\xD5": "O", "\xD6": "O", "\xD8": "O", "\xF2": "o", "\xF3": "o", "\xF4": "o", "\xF5": "o", "\xF6": "o", "\xF8": "o", "\xD9": "U", "\xDA": "U", "\xDB": "U", "\xDC": "U", "\xF9": "u", "\xFA": "u", "\xFB": "u", "\xFC": "u", "\xDD": "Y", "\xFD": "y", "\xFF": "y", "\xC6": "Ae", "\xE6": "ae", "\xDE": "Th", "\xFE": "th", "\xDF": "ss", "\u0100": "A", "\u0102": "A", "\u0104": "A", "\u0101": "a", "\u0103": "a", "\u0105": "a", "\u0106": "C", "\u0108": "C", "\u010A": "C", "\u010C": "C", "\u0107": "c", "\u0109": "c", "\u010B": "c", "\u010D": "c", "\u010E": "D", "\u0110": "D", "\u010F": "d", "\u0111": "d", "\u0112": "E", "\u0114": "E", "\u0116": "E", "\u0118": "E", "\u011A": "E", "\u0113": "e", "\u0115": "e", "\u0117": "e", "\u0119": "e", "\u011B": "e", "\u011C": "G", "\u011E": "G", "\u0120": "G", "\u0122": "G", "\u011D": "g", "\u011F": "g", "\u0121": "g", "\u0123": "g", "\u0124": "H", "\u0126": "H", "\u0125": "h", "\u0127": "h", "\u0128": "I", "\u012A": "I", "\u012C": "I", "\u012E": "I", "\u0130": "I", "\u0129": "i", "\u012B": "i", "\u012D": "i", "\u012F": "i", "\u0131": "i", "\u0134": "J", "\u0135": "j", "\u0136": "K", "\u0137": "k", "\u0138": "k", "\u0139": "L", "\u013B": "L", "\u013D": "L", "\u013F": "L", "\u0141": "L", "\u013A": "l", "\u013C": "l", "\u013E": "l", "\u0140": "l", "\u0142": "l", "\u0143": "N", "\u0145": "N", "\u0147": "N", "\u014A": "N", "\u0144": "n", "\u0146": "n", "\u0148": "n", "\u014B": "n", "\u014C": "O", "\u014E": "O", "\u0150": "O", "\u014D": "o", "\u014F": "o", "\u0151": "o", "\u0154": "R", "\u0156": "R", "\u0158": "R", "\u0155": "r", "\u0157": "r", "\u0159": "r", "\u015A": "S", "\u015C": "S", "\u015E": "S", "\u0160": "S", "\u015B": "s", "\u015D": "s", "\u015F": "s", "\u0161": "s", "\u0162": "T", "\u0164": "T", "\u0166": "T", "\u0163": "t", "\u0165": "t", "\u0167": "t", "\u0168": "U", "\u016A": "U", "\u016C": "U", "\u016E": "U", "\u0170": "U", "\u0172": "U", "\u0169": "u", "\u016B": "u", "\u016D": "u", "\u016F": "u", "\u0171": "u", "\u0173": "u", "\u0174": "W", "\u0175": "w", "\u0176": "Y", "\u0177": "y", "\u0178": "Y", "\u0179": "Z", "\u017B": "Z", "\u017D": "Z", "\u017A": "z", "\u017C": "z", "\u017E": "z", "\u0132": "IJ", "\u0133": "ij", "\u0152": "Oe", "\u0153": "oe", "\u0149": "'n", "\u017F": "s" }), ic = T({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" });
    function ac(t2) {
      return "\\" + I[t2];
    }
    function ha(t2) {
      return D.test(t2);
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
      for (var n2 = -1, r2 = t2.length, o2 = 0, i2 = []; ++n2 < r2; ) {
        var a2 = t2[n2];
        a2 !== e2 && a2 !== wa || (t2[n2] = wa, i2[o2++] = n2);
      }
      return i2;
    }
    function sc(t2) {
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
      } : B)(t2);
    }
    function ga(t2) {
      return ha(t2) ? t2.match(C) || [] : t2.split("");
    }
    function lc(t2) {
      for (var e2 = t2.length; e2-- && i.test(t2.charAt(e2)); )
        ;
      return e2;
    }
    var fc = T({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" });
    var _a = function o2(t2) {
      var b2 = (t2 = null == t2 ? ia : _a.defaults(ia.Object(), t2, _a.pick(ia, Iu))).Array, i2 = t2.Date, k = t2.Error, E = t2.Function, A = t2.Math, v2 = t2.Object, P = t2.RegExp, F = t2.String, y2 = t2.TypeError, H = b2.prototype, V = E.prototype, N = v2.prototype, U = t2["__core-js_shared__"], $ = V.toString, z = N.hasOwnProperty, G = 0, q = (V = /[^.]+$/.exec(U && U.keys && U.keys.IE_PROTO || "")) ? "Symbol(src)_1." + V : "", Z = N.toString, K = $.call(v2), J = ia._, Q = P("^" + $.call(z).replace(nu, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), V = Lu ? t2.Buffer : Wi, e2 = t2.Symbol, tt = t2.Uint8Array, et = V ? V.allocUnsafe : Wi, nt = cc(v2.getPrototypeOf, v2), rt = v2.create, ot = N.propertyIsEnumerable, it = H.splice, at = e2 ? e2.isConcatSpreadable : Wi, ut = e2 ? e2.iterator : Wi, ct = e2 ? e2.toStringTag : Wi, st = function() {
        try {
          var t3 = Jn(v2, "defineProperty");
          return t3({}, "", {}), t3;
        } catch (t4) {
        }
      }(), lt = t2.clearTimeout !== ia.clearTimeout && t2.clearTimeout, ft = i2 && i2.now !== ia.Date.now && i2.now, dt = t2.setTimeout !== ia.setTimeout && t2.setTimeout, ht = A.ceil, pt = A.floor, vt = v2.getOwnPropertySymbols, V = V ? V.isBuffer : Wi, gt = t2.isFinite, _t = H.join, yt = cc(v2.keys, v2), w2 = A.max, C2 = A.min, wt = i2.now, xt = t2.parseInt, mt = A.random, bt = H.reverse, i2 = Jn(t2, "DataView"), Ct = Jn(t2, "Map"), Dt = Jn(t2, "Promise"), It = Jn(t2, "Set"), t2 = Jn(t2, "WeakMap"), St = Jn(v2, "create"), Bt = t2 && new t2(), Tt = {}, Lt = Cr(i2), Ot = Cr(Ct), Rt = Cr(Dt), kt = Cr(It), Et = Cr(t2), e2 = e2 ? e2.prototype : Wi, At = e2 ? e2.valueOf : Wi, Pt = e2 ? e2.toString : Wi;
      function p2(t3) {
        if (W(t3) && !M(t3) && !(t3 instanceof _2)) {
          if (t3 instanceof g2)
            return t3;
          if (z.call(t3, "__wrapped__"))
            return Dr(t3);
        }
        return new g2(t3);
      }
      var zt = function(t3) {
        if (!I2(t3))
          return {};
        if (rt)
          return rt(t3);
        Yt.prototype = t3;
        t3 = new Yt();
        return Yt.prototype = Wi, t3;
      };
      function Yt() {
      }
      function jt() {
      }
      function g2(t3, e3) {
        this.__wrapped__ = t3, this.__actions__ = [], this.__chain__ = !!e3, this.__index__ = 0, this.__values__ = Wi;
      }
      function _2(t3) {
        this.__wrapped__ = t3, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = false, this.__iteratees__ = [], this.__takeCount__ = Gi, this.__views__ = [];
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
      function Ft(t3) {
        var e3 = -1, n3 = null == t3 ? 0 : t3.length;
        for (this.__data__ = new Wt(); ++e3 < n3; )
          this.add(t3[e3]);
      }
      function Y(t3) {
        t3 = this.__data__ = new Mt(t3);
        this.size = t3.size;
      }
      function Ht(t3, e3) {
        var n3, r3 = M(t3), o3 = !r3 && yo(t3), i3 = !r3 && !o3 && xo(t3), a3 = !r3 && !o3 && !i3 && Ro(t3), u3 = r3 || o3 || i3 || a3, c3 = u3 ? Ju(t3.length, F) : [], s3 = c3.length;
        for (n3 in t3)
          !e3 && !z.call(t3, n3) || u3 && ("length" == n3 || i3 && ("offset" == n3 || "parent" == n3) || a3 && ("buffer" == n3 || "byteLength" == n3 || "byteOffset" == n3) || or(n3, s3)) || c3.push(n3);
        return c3;
      }
      function Vt(t3) {
        var e3 = t3.length;
        return e3 ? t3[je(0, e3 - 1)] : Wi;
      }
      function Nt(t3, e3) {
        return wr(D2(t3), te(e3, 0, t3.length));
      }
      function Ut(t3) {
        return wr(D2(t3));
      }
      function $t(t3, e3, n3) {
        (n3 === Wi || X(t3[e3], n3)) && (n3 !== Wi || e3 in t3) || Jt(t3, e3, n3);
      }
      function Gt(t3, e3, n3) {
        var r3 = t3[e3];
        z.call(t3, e3) && X(r3, n3) && (n3 !== Wi || e3 in t3) || Jt(t3, e3, n3);
      }
      function qt(t3, e3) {
        for (var n3 = t3.length; n3--; )
          if (X(t3[n3][0], e3))
            return n3;
        return -1;
      }
      function Zt(t3, r3, o3, i3) {
        return oe(t3, function(t4, e3, n3) {
          r3(i3, t4, o3(t4), n3);
        }), i3;
      }
      function Kt(t3, e3) {
        return t3 && gn(e3, L2(e3), t3);
      }
      function Jt(t3, e3, n3) {
        "__proto__" == e3 && st ? st(t3, e3, { configurable: true, enumerable: true, value: n3, writable: true }) : t3[e3] = n3;
      }
      function Qt(t3, e3) {
        for (var n3 = -1, r3 = e3.length, o3 = b2(r3), i3 = null == t3; ++n3 < r3; )
          o3[n3] = i3 ? Wi : No(t3, e3[n3]);
        return o3;
      }
      function te(t3, e3, n3) {
        return t3 == t3 && (n3 !== Wi && (t3 = t3 <= n3 ? t3 : n3), e3 !== Wi && (t3 = e3 <= t3 ? t3 : e3)), t3;
      }
      function x2(n3, r3, o3, t3, e3, i3) {
        var a3, u3 = 1 & r3, c3 = 2 & r3, s3 = 4 & r3;
        if ((a3 = o3 ? e3 ? o3(n3, t3, e3, i3) : o3(n3) : a3) !== Wi)
          return a3;
        if (!I2(n3))
          return n3;
        var l3, t3 = M(n3);
        if (t3) {
          if (a3 = function(t4) {
            var e4 = t4.length, n4 = new t4.constructor(e4);
            e4 && "string" == typeof t4[0] && z.call(t4, "index") && (n4.index = t4.index, n4.input = t4.input);
            return n4;
          }(n3), !u3)
            return D2(n3, a3);
        } else {
          var f3 = j(n3), d3 = f3 == Sa || f3 == Ba;
          if (xo(n3))
            return ln(n3, u3);
          if (f3 == ta || f3 == qi || d3 && !e3) {
            if (a3 = c3 || d3 ? {} : nr(n3), !u3)
              return c3 ? (h3 = d3 = n3, h3 = (l3 = a3) && gn(h3, O2(h3), l3), gn(d3, tr(d3), h3)) : (d3 = Kt(a3, l3 = n3), gn(l3, Qn(l3), d3));
          } else {
            if (!oa[f3])
              return e3 ? n3 : {};
            a3 = function(t4, e4, n4) {
              var r4 = t4.constructor;
              switch (e4) {
                case Ea:
                  return fn(t4);
                case Zi:
                case Ki:
                  return new r4(+t4);
                case na:
                  return function(t5, e5) {
                    e5 = e5 ? fn(t5.buffer) : t5.buffer;
                    return new t5.constructor(e5, t5.byteOffset, t5.byteLength);
                  }(t4, n4);
                case Aa:
                case Pa:
                case za:
                case Ya:
                case ja:
                case Xa:
                case Ma:
                case Wa:
                case Fa:
                  return dn(t4, n4);
                case Ji:
                  return new r4();
                case Qi:
                case Oa:
                  return new r4(t4);
                case La:
                  return function(t5) {
                    var e5 = new t5.constructor(t5.source, du.exec(t5));
                    return e5.lastIndex = t5.lastIndex, e5;
                  }(t4);
                case ea:
                  return new r4();
                case Ra:
                  return function(t5) {
                    return At ? v2(At.call(t5)) : {};
                  }(t4);
              }
            }(n3, f3, u3);
          }
        }
        var h3 = (i3 = i3 || new Y()).get(n3);
        if (h3)
          return h3;
        i3.set(n3, a3), Lo(n3) ? n3.forEach(function(t4) {
          a3.add(x2(t4, r3, o3, t4, n3, i3));
        }) : Io(n3) && n3.forEach(function(t4, e4) {
          a3.set(e4, x2(t4, r3, o3, e4, n3, i3));
        });
        var p3 = t3 ? Wi : (s3 ? c3 ? Un : Nn : c3 ? O2 : L2)(n3);
        return ua(p3 || n3, function(t4, e4) {
          p3 && (t4 = n3[e4 = t4]), Gt(a3, e4, x2(t4, r3, o3, e4, n3, i3));
        }), a3;
      }
      function ee(t3, e3, n3) {
        var r3 = n3.length;
        if (null == t3)
          return !r3;
        for (t3 = v2(t3); r3--; ) {
          var o3 = n3[r3], i3 = e3[o3], a3 = t3[o3];
          if (a3 === Wi && !(o3 in t3) || !i3(a3))
            return false;
        }
        return true;
      }
      function ne(t3, e3, n3) {
        if ("function" != typeof t3)
          throw new y2(Fi);
        return vr(function() {
          t3.apply(Wi, n3);
        }, e3);
      }
      function re(t3, e3, n3, r3) {
        var o3 = -1, i3 = Xu, a3 = true, u3 = t3.length, c3 = [], s3 = e3.length;
        if (!u3)
          return c3;
        n3 && (e3 = sa(e3, da(n3))), r3 ? (i3 = Mu, a3 = false) : 200 <= e3.length && (i3 = ec, a3 = false, e3 = new Ft(e3));
        t:
          for (; ++o3 < u3; ) {
            var l3 = t3[o3], f3 = null == n3 ? l3 : n3(l3), l3 = r3 || 0 !== l3 ? l3 : 0;
            if (a3 && f3 == f3) {
              for (var d3 = s3; d3--; )
                if (e3[d3] === f3)
                  continue t;
              c3.push(l3);
            } else
              i3(e3, f3, r3) || c3.push(l3);
          }
        return c3;
      }
      p2.templateSettings = { escape: Za, evaluate: Ka, interpolate: Ja, variable: "", imports: { _: p2 } }, (p2.prototype = jt.prototype).constructor = p2, (g2.prototype = zt(jt.prototype)).constructor = g2, (_2.prototype = zt(jt.prototype)).constructor = _2, Xt.prototype.clear = function() {
        this.__data__ = St ? St(null) : {}, this.size = 0;
      }, Xt.prototype.delete = function(t3) {
        return t3 = this.has(t3) && delete this.__data__[t3], this.size -= t3 ? 1 : 0, t3;
      }, Xt.prototype.get = function(t3) {
        var e3, n3 = this.__data__;
        return St ? (e3 = n3[t3]) === ya ? Wi : e3 : z.call(n3, t3) ? n3[t3] : Wi;
      }, Xt.prototype.has = function(t3) {
        var e3 = this.__data__;
        return St ? e3[t3] !== Wi : z.call(e3, t3);
      }, Xt.prototype.set = function(t3, e3) {
        var n3 = this.__data__;
        return this.size += this.has(t3) ? 0 : 1, n3[t3] = St && e3 === Wi ? ya : e3, this;
      }, Mt.prototype.clear = function() {
        this.__data__ = [], this.size = 0;
      }, Mt.prototype.delete = function(t3) {
        var e3 = this.__data__;
        return !((t3 = qt(e3, t3)) < 0) && (t3 == e3.length - 1 ? e3.pop() : it.call(e3, t3, 1), --this.size, true);
      }, Mt.prototype.get = function(t3) {
        var e3 = this.__data__;
        return (t3 = qt(e3, t3)) < 0 ? Wi : e3[t3][1];
      }, Mt.prototype.has = function(t3) {
        return -1 < qt(this.__data__, t3);
      }, Mt.prototype.set = function(t3, e3) {
        var n3 = this.__data__, r3 = qt(n3, t3);
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
      }, Ft.prototype.add = Ft.prototype.push = function(t3) {
        return this.__data__.set(t3, ya), this;
      }, Ft.prototype.has = function(t3) {
        return this.__data__.has(t3);
      }, Y.prototype.clear = function() {
        this.__data__ = new Mt(), this.size = 0;
      }, Y.prototype.delete = function(t3) {
        var e3 = this.__data__, t3 = e3.delete(t3);
        return this.size = e3.size, t3;
      }, Y.prototype.get = function(t3) {
        return this.__data__.get(t3);
      }, Y.prototype.has = function(t3) {
        return this.__data__.has(t3);
      }, Y.prototype.set = function(t3, e3) {
        var n3 = this.__data__;
        if (n3 instanceof Mt) {
          var r3 = n3.__data__;
          if (!Ct || r3.length < 199)
            return r3.push([t3, e3]), this.size = ++n3.size, this;
          n3 = this.__data__ = new Wt(r3);
        }
        return n3.set(t3, e3), this.size = n3.size, this;
      };
      var oe = wn(fe), ie = wn(de, true);
      function ae(t3, r3) {
        var o3 = true;
        return oe(t3, function(t4, e3, n3) {
          return o3 = !!r3(t4, e3, n3);
        }), o3;
      }
      function ue(t3, e3, n3) {
        for (var r3 = -1, o3 = t3.length; ++r3 < o3; ) {
          var i3, a3, u3 = t3[r3], c3 = e3(u3);
          null != c3 && (i3 === Wi ? c3 == c3 && !S2(c3) : n3(c3, i3)) && (i3 = c3, a3 = u3);
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
      var se = xn(), le = xn(true);
      function fe(t3, e3) {
        return t3 && se(t3, e3, L2);
      }
      function de(t3, e3) {
        return t3 && le(t3, e3, L2);
      }
      function he(e3, t3) {
        return ca(t3, function(t4) {
          return bo(e3[t4]);
        });
      }
      function pe(t3, e3) {
        for (var n3 = 0, r3 = (e3 = an(e3, t3)).length; null != t3 && n3 < r3; )
          t3 = t3[br(e3[n3++])];
        return n3 && n3 == r3 ? t3 : Wi;
      }
      function ve(t3, e3, n3) {
        e3 = e3(t3);
        return M(t3) ? e3 : la(e3, n3(t3));
      }
      function n2(t3) {
        {
          if (null == t3)
            return t3 === Wi ? "[object Undefined]" : "[object Null]";
          if (ct && ct in v2(t3)) {
            var e3 = t3, n3 = z.call(e3, ct), r3 = e3[ct];
            try {
              e3[ct] = Wi;
              var o3 = true;
            } catch (t4) {
            }
            var i3 = Z.call(e3);
            return o3 && (n3 ? e3[ct] = r3 : delete e3[ct]), i3;
          }
          return Z.call(t3);
        }
      }
      function ge(t3, e3) {
        return e3 < t3;
      }
      function _e(t3, e3) {
        return null != t3 && z.call(t3, e3);
      }
      function ye(t3, e3) {
        return null != t3 && e3 in v2(t3);
      }
      function we(t3, e3, n3) {
        for (var r3 = n3 ? Mu : Xu, o3 = t3[0].length, i3 = t3.length, a3 = i3, u3 = b2(i3), c3 = 1 / 0, s3 = []; a3--; ) {
          var l3 = t3[a3];
          a3 && e3 && (l3 = sa(l3, da(e3))), c3 = C2(l3.length, c3), u3[a3] = !n3 && (e3 || 120 <= o3 && 120 <= l3.length) ? new Ft(a3 && l3) : Wi;
        }
        var l3 = t3[0], f3 = -1, d3 = u3[0];
        t:
          for (; ++f3 < o3 && s3.length < c3; ) {
            var h3 = l3[f3], p3 = e3 ? e3(h3) : h3, h3 = n3 || 0 !== h3 ? h3 : 0;
            if (!(d3 ? ec(d3, p3) : r3(s3, p3, n3))) {
              for (a3 = i3; --a3; ) {
                var v3 = u3[a3];
                if (!(v3 ? ec(v3, p3) : r3(t3[a3], p3, n3)))
                  continue t;
              }
              d3 && d3.push(p3), s3.push(h3);
            }
          }
        return s3;
      }
      function xe(t3, e3, n3) {
        e3 = null == (t3 = dr(t3, e3 = an(e3, t3))) ? t3 : t3[br(r2(e3))];
        return null == e3 ? Wi : aa(e3, t3, n3);
      }
      function me(t3) {
        return W(t3) && n2(t3) == qi;
      }
      function be(t3, e3, n3, r3, o3) {
        {
          if (t3 === e3)
            return true;
          if (null == t3 || null == e3 || !W(t3) && !W(e3))
            return t3 != t3 && e3 != e3;
          var i3 = be, a3 = M(t3), u3 = M(e3), c3 = a3 ? Da : j(t3), u3 = u3 ? Da : j(e3), s3 = (c3 = c3 == qi ? ta : c3) == ta, l3 = (u3 = u3 == qi ? ta : u3) == ta, u3;
          if ((u3 = c3 == u3) && xo(t3)) {
            if (!xo(e3))
              return false;
            s3 = !(a3 = true);
          }
          if (u3 && !s3) {
            o3 = o3 || new Y();
            if (a3 || Ro(t3))
              return Hn(t3, e3, n3, r3, i3, o3);
            else {
              var f3 = t3;
              var d3 = e3;
              var h3 = c3;
              var p3 = n3;
              var v3 = r3;
              var g3 = i3;
              var _3 = o3;
              switch (h3) {
                case na:
                  if (f3.byteLength != d3.byteLength || f3.byteOffset != d3.byteOffset)
                    return false;
                  f3 = f3.buffer, d3 = d3.buffer;
                case Ea:
                  return f3.byteLength == d3.byteLength && g3(new tt(f3), new tt(d3)) ? true : false;
                case Zi:
                case Ki:
                case Qi:
                  return X(+f3, +d3);
                case Ia:
                  return f3.name == d3.name && f3.message == d3.message;
                case La:
                case Oa:
                  return f3 == d3 + "";
                case Ji:
                  var y3 = uc;
                case ea:
                  var w3 = 1 & p3;
                  if (y3 = y3 || sc, f3.size != d3.size && !w3)
                    return false;
                  w3 = _3.get(f3);
                  if (w3)
                    return w3 == d3;
                  p3 |= 2, _3.set(f3, d3);
                  w3 = Hn(y3(f3), y3(d3), p3, v3, g3, _3);
                  return _3.delete(f3), w3;
                case Ra:
                  if (At)
                    return At.call(f3) == At.call(d3);
              }
              return false;
              return;
            }
          }
          if (!(1 & n3)) {
            a3 = s3 && z.call(t3, "__wrapped__"), c3 = l3 && z.call(e3, "__wrapped__");
            if (a3 || c3)
              return s3 = a3 ? t3.value() : t3, l3 = c3 ? e3.value() : e3, o3 = o3 || new Y(), i3(s3, l3, n3, r3, o3);
          }
          if (u3) {
            o3 = o3 || new Y();
            var x3 = t3, m3 = e3, b3 = n3, C3 = r3, D3 = i3, I3 = o3, S3 = 1 & b3, B3 = Nn(x3), T3 = B3.length, a3 = Nn(m3).length;
            if (T3 != a3 && !S3)
              return false;
            for (var L3 = T3; L3--; ) {
              var O3 = B3[L3];
              if (!(S3 ? O3 in m3 : z.call(m3, O3)))
                return false;
            }
            a3 = I3.get(x3), c3 = I3.get(m3);
            if (a3 && c3)
              return a3 == m3 && c3 == x3;
            for (var R2 = true, k2 = (I3.set(x3, m3), I3.set(m3, x3), S3); ++L3 < T3; ) {
              O3 = B3[L3];
              var E2, A2 = x3[O3], P2 = m3[O3];
              if (!((E2 = C3 ? S3 ? C3(P2, A2, O3, m3, x3, I3) : C3(A2, P2, O3, x3, m3, I3) : E2) === Wi ? A2 === P2 || D3(A2, P2, b3, C3, I3) : E2)) {
                R2 = false;
                break;
              }
              k2 = k2 || "constructor" == O3;
            }
            return R2 && !k2 && (a3 = x3.constructor, c3 = m3.constructor, a3 != c3 && "constructor" in x3 && "constructor" in m3 && !("function" == typeof a3 && a3 instanceof a3 && "function" == typeof c3 && c3 instanceof c3) && (R2 = false)), I3.delete(x3), I3.delete(m3), R2;
          }
          return false;
        }
      }
      function Ce(t3, e3, n3, r3) {
        var o3 = n3.length, i3 = o3, a3 = !r3;
        if (null == t3)
          return !i3;
        for (t3 = v2(t3); o3--; ) {
          var u3 = n3[o3];
          if (a3 && u3[2] ? u3[1] !== t3[u3[0]] : !(u3[0] in t3))
            return false;
        }
        for (; ++o3 < i3; ) {
          var c3 = (u3 = n3[o3])[0], s3 = t3[c3], l3 = u3[1];
          if (a3 && u3[2]) {
            if (s3 === Wi && !(c3 in t3))
              return false;
          } else {
            var f3, d3 = new Y();
            if (!((f3 = r3 ? r3(s3, l3, c3, t3, e3, d3) : f3) === Wi ? be(l3, s3, 3, r3, d3) : f3))
              return false;
          }
        }
        return true;
      }
      function De(t3) {
        return !(!I2(t3) || (e3 = t3, q && q in e3)) && (bo(t3) ? Q : vu).test(Cr(t3));
        var e3;
      }
      function Ie(t3) {
        return "function" == typeof t3 ? t3 : null == t3 ? R : "object" == typeof t3 ? M(t3) ? Re(t3[0], t3[1]) : Oe(t3) : Ti(t3);
      }
      function Se(t3) {
        if (!cr(t3))
          return yt(t3);
        var e3, n3 = [];
        for (e3 in v2(t3))
          z.call(t3, e3) && "constructor" != e3 && n3.push(e3);
        return n3;
      }
      function Be(t3) {
        if (!I2(t3)) {
          var e3 = t3, n3 = [];
          if (null != e3)
            for (var r3 in v2(e3))
              n3.push(r3);
          return n3;
        }
        var o3, i3 = cr(t3), a3 = [];
        for (o3 in t3)
          ("constructor" != o3 || !i3 && z.call(t3, o3)) && a3.push(o3);
        return a3;
      }
      function Te(t3, e3) {
        return t3 < e3;
      }
      function Le(t3, r3) {
        var o3 = -1, i3 = l2(t3) ? b2(t3.length) : [];
        return oe(t3, function(t4, e3, n3) {
          i3[++o3] = r3(t4, e3, n3);
        }), i3;
      }
      function Oe(e3) {
        var n3 = Kn(e3);
        return 1 == n3.length && n3[0][2] ? lr(n3[0][0], n3[0][1]) : function(t3) {
          return t3 === e3 || Ce(t3, e3, n3);
        };
      }
      function Re(n3, r3) {
        return ir(n3) && sr(r3) ? lr(br(n3), r3) : function(t3) {
          var e3 = No(t3, n3);
          return e3 === Wi && e3 === r3 ? Uo(t3, n3) : be(r3, e3, 3);
        };
      }
      function ke(v3, g3, _3, y3, w3) {
        v3 !== g3 && se(g3, function(t3, e3) {
          var n3, r3, o3, i3, a3, u3, c3, s3, l3, f3, d3, h3, p3;
          w3 = w3 || new Y(), I2(t3) ? (r3 = g3, i3 = _3, a3 = ke, u3 = y3, c3 = w3, d3 = hr(n3 = v3, o3 = e3), h3 = hr(r3, o3), (p3 = c3.get(h3)) ? $t(n3, o3, p3) : (p3 = u3 ? u3(d3, h3, o3 + "", n3, r3, c3) : Wi, (r3 = p3 === Wi) && (s3 = M(h3), l3 = !s3 && xo(h3), f3 = !s3 && !l3 && Ro(h3), p3 = h3, s3 || l3 || f3 ? p3 = M(d3) ? d3 : m2(d3) ? D2(d3) : l3 ? ln(h3, !(r3 = false)) : f3 ? dn(h3, !(r3 = false)) : [] : Bo(h3) || yo(h3) ? yo(p3 = d3) ? p3 = Yo(d3) : I2(d3) && !bo(d3) || (p3 = nr(h3)) : r3 = false), r3 && (c3.set(h3, p3), a3(p3, h3, i3, u3, c3), c3.delete(h3)), $t(n3, o3, p3))) : (s3 = y3 ? y3(hr(v3, e3), t3, e3 + "", v3, g3, w3) : Wi, $t(v3, e3, s3 = s3 === Wi ? t3 : s3));
        }, O2);
      }
      function Ee(t3, e3) {
        var n3 = t3.length;
        if (n3)
          return or(e3 += e3 < 0 ? n3 : 0, n3) ? t3[e3] : Wi;
      }
      function Ae(t3, r3, l3) {
        r3 = r3.length ? sa(r3, function(e4) {
          return M(e4) ? function(t4) {
            return pe(t4, 1 === e4.length ? e4[0] : e4);
          } : e4;
        }) : [R];
        var o3 = -1;
        r3 = sa(r3, da(f2()));
        var e3 = Le(t3, function(e4, t4, n4) {
          return { criteria: sa(r3, function(t5) {
            return t5(e4);
          }), index: ++o3, value: e4 };
        }), t3 = function(t4, e4) {
          for (var n4 = l3, r4 = -1, o4 = t4.criteria, i3 = e4.criteria, a3 = o4.length, u3 = n4.length; ++r4 < a3; ) {
            var c3 = hn(o4[r4], i3[r4]);
            if (c3) {
              if (u3 <= r4)
                return c3;
              var s3 = n4[r4];
              return c3 * ("desc" == s3 ? -1 : 1);
            }
          }
          return t4.index - e4.index;
        }, n3 = e3.length;
        for (e3.sort(t3); n3--; )
          e3[n3] = e3[n3].value;
        return e3;
      }
      function Pe(t3, e3, n3) {
        for (var r3 = -1, o3 = e3.length, i3 = {}; ++r3 < o3; ) {
          var a3 = e3[r3], u3 = pe(t3, a3);
          n3(u3, a3) && Fe(i3, an(a3, t3), u3);
        }
        return i3;
      }
      function ze(t3, e3, n3, r3) {
        var o3 = r3 ? Uu : fa, i3 = -1, a3 = e3.length, u3 = t3;
        for (t3 === e3 && (e3 = D2(e3)), n3 && (u3 = sa(t3, da(n3))); ++i3 < a3; )
          for (var c3 = 0, s3 = e3[i3], l3 = n3 ? n3(s3) : s3; -1 < (c3 = o3(u3, l3, c3, r3)); )
            u3 !== t3 && it.call(u3, c3, 1), it.call(t3, c3, 1);
        return t3;
      }
      function Ye(t3, e3) {
        for (var n3 = t3 ? e3.length : 0, r3 = n3 - 1; n3--; ) {
          var o3, i3 = e3[n3];
          n3 != r3 && i3 === o3 || (or(o3 = i3) ? it.call(t3, i3, 1) : Ke(t3, i3));
        }
      }
      function je(t3, e3) {
        return t3 + pt(mt() * (e3 - t3 + 1));
      }
      function Xe(t3, e3) {
        var n3 = "";
        if (!t3 || e3 < 1 || $i < e3)
          return n3;
        for (; e3 % 2 && (n3 += t3), (e3 = pt(e3 / 2)) && (t3 += t3), e3; )
          ;
        return n3;
      }
      function a2(t3, e3) {
        return gr(fr(t3, e3, R), t3 + "");
      }
      function Me(t3) {
        return Vt(ri(t3));
      }
      function We(t3, e3) {
        t3 = ri(t3);
        return wr(t3, te(e3, 0, t3.length));
      }
      function Fe(t3, e3, n3, r3) {
        if (!I2(t3))
          return t3;
        for (var o3 = -1, i3 = (e3 = an(e3, t3)).length, a3 = i3 - 1, u3 = t3; null != u3 && ++o3 < i3; ) {
          var c3, s3 = br(e3[o3]), l3 = n3;
          if ("__proto__" === s3 || "constructor" === s3 || "prototype" === s3)
            return t3;
          o3 != a3 && (c3 = u3[s3], (l3 = r3 ? r3(c3, s3, u3) : Wi) === Wi && (l3 = I2(c3) ? c3 : or(e3[o3 + 1]) ? [] : {})), Gt(u3, s3, l3), u3 = u3[s3];
        }
        return t3;
      }
      var He = Bt ? function(t3, e3) {
        return Bt.set(t3, e3), t3;
      } : R, e2 = st ? function(t3, e3) {
        return st(t3, "toString", { configurable: true, enumerable: false, value: _i(e3), writable: true });
      } : R;
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
      function Ue(t3, e3, n3) {
        var r3 = 0, o3 = null == t3 ? r3 : t3.length;
        if ("number" == typeof e3 && e3 == e3 && o3 <= 2147483647) {
          for (; r3 < o3; ) {
            var i3 = r3 + o3 >>> 1, a3 = t3[i3];
            null !== a3 && !S2(a3) && (n3 ? a3 <= e3 : a3 < e3) ? r3 = 1 + i3 : o3 = i3;
          }
          return o3;
        }
        return $e(t3, e3, R, n3);
      }
      function $e(t3, e3, n3, r3) {
        var o3 = 0, i3 = null == t3 ? 0 : t3.length;
        if (0 === i3)
          return 0;
        for (var a3 = (e3 = n3(e3)) != e3, u3 = null === e3, c3 = S2(e3), s3 = e3 === Wi; o3 < i3; ) {
          var l3 = pt((o3 + i3) / 2), f3 = n3(t3[l3]), d3 = f3 !== Wi, h3 = null === f3, p3 = f3 == f3, v3 = S2(f3), p3 = a3 ? r3 || p3 : s3 ? p3 && (r3 || d3) : u3 ? p3 && d3 && (r3 || !h3) : c3 ? p3 && d3 && !h3 && (r3 || !v3) : !h3 && !v3 && (r3 ? f3 <= e3 : f3 < e3);
          p3 ? o3 = l3 + 1 : i3 = l3;
        }
        return C2(i3, 4294967294);
      }
      function Ge(t3, e3) {
        for (var n3 = -1, r3 = t3.length, o3 = 0, i3 = []; ++n3 < r3; ) {
          var a3, u3 = t3[n3], c3 = e3 ? e3(u3) : u3;
          n3 && X(c3, a3) || (a3 = c3, i3[o3++] = 0 === u3 ? 0 : u3);
        }
        return i3;
      }
      function qe(t3) {
        return "number" == typeof t3 ? t3 : S2(t3) ? ba : +t3;
      }
      function s2(t3) {
        if ("string" == typeof t3)
          return t3;
        if (M(t3))
          return sa(t3, s2) + "";
        if (S2(t3))
          return Pt ? Pt.call(t3) : "";
        var e3 = t3 + "";
        return "0" == e3 && 1 / t3 == -Ui ? "-0" : e3;
      }
      function Ze(t3, e3, n3) {
        var r3 = -1, o3 = Xu, i3 = t3.length, a3 = true, u3 = [], c3 = u3;
        if (n3)
          a3 = false, o3 = Mu;
        else if (200 <= i3) {
          var s3 = e3 ? null : Yn(t3);
          if (s3)
            return sc(s3);
          a3 = false, o3 = ec, c3 = new Ft();
        } else
          c3 = e3 ? [] : u3;
        t:
          for (; ++r3 < i3; ) {
            var l3 = t3[r3], f3 = e3 ? e3(l3) : l3, l3 = n3 || 0 !== l3 ? l3 : 0;
            if (a3 && f3 == f3) {
              for (var d3 = c3.length; d3--; )
                if (c3[d3] === f3)
                  continue t;
              e3 && c3.push(f3), u3.push(l3);
            } else
              o3(c3, f3, n3) || (c3 !== u3 && c3.push(f3), u3.push(l3));
          }
        return u3;
      }
      function Ke(t3, e3) {
        return null == (t3 = dr(t3, e3 = an(e3, t3))) || delete t3[br(r2(e3))];
      }
      function Je(t3, e3, n3, r3) {
        return Fe(t3, e3, n3(pe(t3, e3)), r3);
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
          return r3 ? Ze(t3[0]) : [];
        for (var o3 = -1, i3 = b2(r3); ++o3 < r3; )
          for (var a3 = t3[o3], u3 = -1; ++u3 < r3; )
            u3 != o3 && (i3[o3] = re(i3[o3] || a3, t3[u3], e3, n3));
        return Ze(c2(i3, 1), e3, n3);
      }
      function nn(t3, e3, n3) {
        for (var r3 = -1, o3 = t3.length, i3 = e3.length, a3 = {}; ++r3 < o3; ) {
          var u3 = r3 < i3 ? e3[r3] : Wi;
          n3(a3, t3[r3], u3);
        }
        return a3;
      }
      function rn(t3) {
        return m2(t3) ? t3 : [];
      }
      function on(t3) {
        return "function" == typeof t3 ? t3 : R;
      }
      function an(t3, e3) {
        return M(t3) ? t3 : ir(t3, e3) ? [t3] : mr(h2(t3));
      }
      var un = a2;
      function cn(t3, e3, n3) {
        var r3 = t3.length;
        return n3 = n3 === Wi ? r3 : n3, !e3 && r3 <= n3 ? t3 : u2(t3, e3, n3);
      }
      var sn = lt || function(t3) {
        return ia.clearTimeout(t3);
      };
      function ln(t3, e3) {
        if (e3)
          return t3.slice();
        e3 = t3.length, e3 = et ? et(e3) : new t3.constructor(e3);
        return t3.copy(e3), e3;
      }
      function fn(t3) {
        var e3 = new t3.constructor(t3.byteLength);
        return new tt(e3).set(new tt(t3)), e3;
      }
      function dn(t3, e3) {
        e3 = e3 ? fn(t3.buffer) : t3.buffer;
        return new t3.constructor(e3, t3.byteOffset, t3.length);
      }
      function hn(t3, e3) {
        if (t3 !== e3) {
          var n3 = t3 !== Wi, r3 = null === t3, o3 = t3 == t3, i3 = S2(t3), a3 = e3 !== Wi, u3 = null === e3, c3 = e3 == e3, s3 = S2(e3);
          if (!u3 && !s3 && !i3 && e3 < t3 || i3 && a3 && c3 && !u3 && !s3 || r3 && a3 && c3 || !n3 && c3 || !o3)
            return 1;
          if (!r3 && !i3 && !s3 && t3 < e3 || s3 && n3 && o3 && !r3 && !i3 || u3 && n3 && o3 || !a3 && o3 || !c3)
            return -1;
        }
        return 0;
      }
      function pn(t3, e3, n3, r3) {
        for (var o3 = -1, i3 = t3.length, a3 = n3.length, u3 = -1, c3 = e3.length, s3 = w2(i3 - a3, 0), l3 = b2(c3 + s3), f3 = !r3; ++u3 < c3; )
          l3[u3] = e3[u3];
        for (; ++o3 < a3; )
          (f3 || o3 < i3) && (l3[n3[o3]] = t3[o3]);
        for (; s3--; )
          l3[u3++] = t3[o3++];
        return l3;
      }
      function vn(t3, e3, n3, r3) {
        for (var o3 = -1, i3 = t3.length, a3 = -1, u3 = n3.length, c3 = -1, s3 = e3.length, l3 = w2(i3 - u3, 0), f3 = b2(l3 + s3), d3 = !r3; ++o3 < l3; )
          f3[o3] = t3[o3];
        for (var h3 = o3; ++c3 < s3; )
          f3[h3 + c3] = e3[c3];
        for (; ++a3 < u3; )
          (d3 || o3 < i3) && (f3[h3 + n3[a3]] = t3[o3++]);
        return f3;
      }
      function D2(t3, e3) {
        var n3 = -1, r3 = t3.length;
        for (e3 = e3 || b2(r3); ++n3 < r3; )
          e3[n3] = t3[n3];
        return e3;
      }
      function gn(t3, e3, n3, r3) {
        for (var o3 = !n3, i3 = (n3 = n3 || {}, -1), a3 = e3.length; ++i3 < a3; ) {
          var u3 = e3[i3], c3 = r3 ? r3(n3[u3], t3[u3], u3, n3, t3) : Wi;
          (o3 ? Jt : Gt)(n3, u3, c3 = c3 === Wi ? t3[u3] : c3);
        }
        return n3;
      }
      function _n(o3, i3) {
        return function(t3, e3) {
          var n3 = M(t3) ? zu : Zt, r3 = i3 ? i3() : {};
          return n3(t3, o3, f2(e3, 2), r3);
        };
      }
      function yn(u3) {
        return a2(function(t3, e3) {
          var n3 = -1, r3 = e3.length, o3 = 1 < r3 ? e3[r3 - 1] : Wi, i3 = 2 < r3 ? e3[2] : Wi, o3 = 3 < u3.length && "function" == typeof o3 ? (r3--, o3) : Wi;
          for (i3 && d2(e3[0], e3[1], i3) && (o3 = r3 < 3 ? Wi : o3, r3 = 1), t3 = v2(t3); ++n3 < r3; ) {
            var a3 = e3[n3];
            a3 && u3(t3, a3, n3, o3);
          }
          return t3;
        });
      }
      function wn(i3, a3) {
        return function(t3, e3) {
          if (null == t3)
            return t3;
          if (!l2(t3))
            return i3(t3, e3);
          for (var n3 = t3.length, r3 = a3 ? n3 : -1, o3 = v2(t3); (a3 ? r3-- : ++r3 < n3) && false !== e3(o3[r3], r3, o3); )
            ;
          return t3;
        };
      }
      function xn(c3) {
        return function(t3, e3, n3) {
          for (var r3 = -1, o3 = v2(t3), i3 = n3(t3), a3 = i3.length; a3--; ) {
            var u3 = i3[c3 ? a3 : ++r3];
            if (false === e3(o3[u3], u3, o3))
              break;
          }
          return t3;
        };
      }
      function mn(r3) {
        return function(t3) {
          var e3 = ha(t3 = h2(t3)) ? ga(t3) : Wi, n3 = e3 ? e3[0] : t3.charAt(0), e3 = e3 ? cn(e3, 1).join("") : t3.slice(1);
          return n3[r3]() + e3;
        };
      }
      function bn(e3) {
        return function(t3) {
          return Wu(pi(ai(t3).replace(mu, "")), e3, "");
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
          return I2(n3) ? n3 : e3;
        };
      }
      function Dn(i3, a3, u3) {
        var c3 = Cn(i3);
        return function t3() {
          for (var e3 = arguments.length, n3 = b2(e3), r3 = e3, o3 = qn(t3); r3--; )
            n3[r3] = arguments[r3];
          o3 = e3 < 3 && n3[0] !== o3 && n3[e3 - 1] !== o3 ? [] : pa(n3, o3);
          return (e3 -= o3.length) < u3 ? Pn(i3, a3, Bn, t3.placeholder, Wi, n3, o3, Wi, Wi, u3 - e3) : aa(this && this !== ia && this instanceof t3 ? c3 : i3, this, n3);
        };
      }
      function In(i3) {
        return function(t3, e3, n3) {
          var r3, o3 = v2(t3), e3 = (l2(t3) || (r3 = f2(e3, 3), t3 = L2(t3), e3 = function(t4) {
            return r3(o3[t4], t4, o3);
          }), i3(t3, e3, n3));
          return -1 < e3 ? o3[r3 ? t3[e3] : e3] : Wi;
        };
      }
      function Sn(c3) {
        return Vn(function(o3) {
          var i3 = o3.length, t3 = i3, e3 = g2.prototype.thru;
          for (c3 && o3.reverse(); t3--; ) {
            var n3 = o3[t3];
            if ("function" != typeof n3)
              throw new y2(Fi);
            e3 && !u3 && "wrapper" == Gn(n3) && (u3 = new g2([], true));
          }
          for (t3 = u3 ? t3 : i3; ++t3 < i3; )
            var r3 = Gn(n3 = o3[t3]), a3 = "wrapper" == r3 ? $n(n3) : Wi, u3 = a3 && ar(a3[0]) && 424 == a3[1] && !a3[4].length && 1 == a3[9] ? u3[Gn(a3[0])].apply(u3, a3[3]) : 1 == n3.length && ar(n3) ? u3[r3]() : u3.thru(n3);
          return function() {
            var t4 = arguments, e4 = t4[0];
            if (u3 && 1 == t4.length && M(e4))
              return u3.plant(e4).value();
            for (var n4 = 0, r4 = i3 ? o3[n4].apply(this, t4) : e4; ++n4 < i3; )
              r4 = o3[n4].call(this, r4);
            return r4;
          };
        });
      }
      function Bn(a3, u3, c3, s3, l3, f3, d3, h3, p3, v3) {
        var g3 = u3 & Ni, _3 = 1 & u3, y3 = 2 & u3, w3 = 24 & u3, x3 = 512 & u3, m3 = y3 ? Wi : Cn(a3);
        return function t3() {
          for (var e3 = b2(i3 = arguments.length), n3 = i3; n3--; )
            e3[n3] = arguments[n3];
          if (w3 && (o3 = function(t4, e4) {
            for (var n4 = t4.length, r4 = 0; n4--; )
              t4[n4] === e4 && ++r4;
            return r4;
          }(e3, r3 = qn(t3))), s3 && (e3 = pn(e3, s3, l3, w3)), f3 && (e3 = vn(e3, f3, d3, w3)), i3 -= o3, w3 && i3 < v3)
            return o3 = pa(e3, r3), Pn(a3, u3, Bn, t3.placeholder, c3, e3, o3, h3, p3, v3 - i3);
          var r3 = _3 ? c3 : this, o3 = y3 ? r3[a3] : a3, i3 = e3.length;
          return h3 ? e3 = function(t4, e4) {
            for (var n4 = t4.length, r4 = C2(e4.length, n4), o4 = D2(t4); r4--; ) {
              var i4 = e4[r4];
              t4[r4] = or(i4, n4) ? o4[i4] : Wi;
            }
            return t4;
          }(e3, h3) : x3 && 1 < i3 && e3.reverse(), g3 && p3 < i3 && (e3.length = p3), (o3 = this && this !== ia && this instanceof t3 ? m3 || Cn(o3) : o3).apply(r3, e3);
        };
      }
      function Tn(n3, a3) {
        return function(t3, e3) {
          return t3 = t3, r3 = n3, o3 = a3(e3), i3 = {}, fe(t3, function(t4, e4, n4) {
            r3(i3, o3(t4), e4, n4);
          }), i3;
          var r3, o3, i3;
        };
      }
      function Ln(r3, o3) {
        return function(t3, e3) {
          var n3;
          if (t3 === Wi && e3 === Wi)
            return o3;
          if (t3 !== Wi && (n3 = t3), e3 !== Wi) {
            if (n3 === Wi)
              return e3;
            e3 = "string" == typeof t3 || "string" == typeof e3 ? (t3 = s2(t3), s2(e3)) : (t3 = qe(t3), qe(e3)), n3 = r3(t3, e3);
          }
          return n3;
        };
      }
      function On(r3) {
        return Vn(function(t3) {
          return t3 = sa(t3, da(f2())), a2(function(e3) {
            var n3 = this;
            return r3(t3, function(t4) {
              return aa(t4, n3, e3);
            });
          });
        });
      }
      function Rn(t3, e3) {
        var n3 = (e3 = e3 === Wi ? " " : s2(e3)).length;
        if (n3 < 2)
          return n3 ? Xe(e3, t3) : e3;
        n3 = Xe(e3, ht(t3 / va(e3)));
        return ha(e3) ? cn(ga(n3), 0, t3).join("") : n3.slice(0, t3);
      }
      function kn(u3, t3, c3, s3) {
        var l3 = 1 & t3, f3 = Cn(u3);
        return function t4() {
          for (var e3 = -1, n3 = arguments.length, r3 = -1, o3 = s3.length, i3 = b2(o3 + n3), a3 = this && this !== ia && this instanceof t4 ? f3 : u3; ++r3 < o3; )
            i3[r3] = s3[r3];
          for (; n3--; )
            i3[r3++] = arguments[++e3];
          return aa(a3, l3 ? c3 : this, i3);
        };
      }
      function En(s3) {
        return function(t3, e3, n3) {
          n3 && "number" != typeof n3 && d2(t3, e3, n3) && (e3 = n3 = Wi), t3 = Po(t3), e3 === Wi ? (e3 = t3, t3 = 0) : e3 = Po(e3), n3 = n3 === Wi ? t3 < e3 ? 1 : -1 : Po(n3);
          for (var r3 = t3, o3 = n3, i3 = s3, a3 = -1, u3 = w2(ht((e3 - r3) / (o3 || 1)), 0), c3 = b2(u3); u3--; )
            c3[i3 ? u3 : ++a3] = r3, r3 += o3;
          return c3;
        };
      }
      function An(n3) {
        return function(t3, e3) {
          return "string" == typeof t3 && "string" == typeof e3 || (t3 = T2(t3), e3 = T2(e3)), n3(t3, e3);
        };
      }
      function Pn(t3, e3, n3, r3, o3, i3, a3, u3, c3, s3) {
        var l3 = 8 & e3, o3 = (4 & (e3 = (e3 | (l3 ? Hi : Vi)) & ~(l3 ? Vi : Hi)) || (e3 &= -4), [t3, e3, o3, l3 ? i3 : Wi, l3 ? a3 : Wi, l3 ? Wi : i3, l3 ? Wi : a3, u3, c3, s3]), i3 = n3.apply(Wi, o3);
        return ar(t3) && pr(i3, o3), i3.placeholder = r3, _r(i3, t3, e3);
      }
      function zn(t3) {
        var r3 = A[t3];
        return function(t4, e3) {
          var n3;
          return t4 = T2(t4), (e3 = null == e3 ? 0 : C2(B2(e3), 292)) && gt(t4) ? (n3 = (h2(t4) + "e").split("e"), +((n3 = (h2(r3(n3[0] + "e" + (+n3[1] + e3))) + "e").split("e"))[0] + "e" + (+n3[1] - e3))) : r3(t4);
        };
      }
      var Yn = It && 1 / sc(new It([, -0]))[1] == Ui ? function(t3) {
        return new It(t3);
      } : Di;
      function jn(i3) {
        return function(t3) {
          var e3, n3, r3, o3 = j(t3);
          return o3 == Ji ? uc(t3) : o3 == ea ? (o3 = t3, e3 = -1, n3 = Array(o3.size), o3.forEach(function(t4) {
            n3[++e3] = [t4, t4];
          }), n3) : sa(i3(r3 = t3), function(t4) {
            return [t4, r3[t4]];
          });
        };
      }
      function Xn(t3, e3, n3, r3, o3, i3, a3, u3) {
        var c3 = 2 & e3;
        if (!c3 && "function" != typeof t3)
          throw new y2(Fi);
        var s3, l3, f3, d3, h3, p3 = r3 ? r3.length : 0, v3 = (p3 || (e3 &= -97, r3 = o3 = Wi), a3 = a3 === Wi ? a3 : w2(B2(a3), 0), u3 = u3 === Wi ? u3 : B2(u3), p3 -= o3 ? o3.length : 0, e3 & Vi && (g3 = r3, s3 = o3, r3 = o3 = Wi), c3 ? Wi : $n(t3)), g3 = [t3, e3, n3, r3, o3, g3, s3, i3, a3, u3];
        return v3 && function(t4, e4) {
          var n4 = t4[1], r4 = e4[1], o4 = n4 | r4, i4 = o4 < 131, a4 = r4 == Ni && 8 == n4 || r4 == Ni && n4 == ma && t4[7].length <= e4[8] || 384 == r4 && e4[7].length <= e4[8] && 8 == n4;
          if (!i4 && !a4)
            return;
          1 & r4 && (t4[2] = e4[2], o4 |= 1 & n4 ? 0 : 4);
          i4 = e4[3];
          {
            var u4;
            i4 && (u4 = t4[3], t4[3] = u4 ? pn(u4, i4, e4[4]) : i4, t4[4] = u4 ? pa(t4[3], wa) : e4[4]);
          }
          (i4 = e4[5]) && (u4 = t4[5], t4[5] = u4 ? vn(u4, i4, e4[6]) : i4, t4[6] = u4 ? pa(t4[5], wa) : e4[6]);
          (i4 = e4[7]) && (t4[7] = i4);
          r4 & Ni && (t4[8] = null == t4[8] ? e4[8] : C2(t4[8], e4[8]));
          null == t4[9] && (t4[9] = e4[9]);
          t4[0] = e4[0], t4[1] = o4;
        }(g3, v3), t3 = g3[0], e3 = g3[1], n3 = g3[2], r3 = g3[3], o3 = g3[4], !(u3 = g3[9] = g3[9] === Wi ? c3 ? 0 : t3.length : w2(g3[9] - p3, 0)) && 24 & e3 && (e3 &= -25), s3 = e3 && 1 != e3 ? 8 == e3 || e3 == xa ? Dn(t3, e3, u3) : e3 != Hi && 33 != e3 || o3.length ? Bn.apply(Wi, g3) : kn(t3, e3, n3, r3) : (f3 = n3, d3 = 1 & e3, h3 = Cn(l3 = t3), function t4() {
          return (this && this !== ia && this instanceof t4 ? h3 : l3).apply(d3 ? f3 : this, arguments);
        }), _r((v3 ? He : pr)(s3, g3), t3, e3);
      }
      function Mn(t3, e3, n3, r3) {
        return t3 === Wi || X(t3, N[n3]) && !z.call(r3, n3) ? e3 : t3;
      }
      function Wn(t3, e3, n3, r3, o3, i3) {
        return I2(t3) && I2(e3) && (i3.set(e3, t3), ke(t3, e3, Wi, Wn, i3), i3.delete(e3)), t3;
      }
      function Fn(t3) {
        return Bo(t3) ? Wi : t3;
      }
      function Hn(t3, e3, n3, r3, o3, i3) {
        var a3 = 1 & n3, u3 = t3.length, c3 = e3.length;
        if (u3 != c3 && !(a3 && u3 < c3))
          return false;
        var c3 = i3.get(t3), s3 = i3.get(e3);
        if (c3 && s3)
          return c3 == e3 && s3 == t3;
        var l3 = -1, f3 = true, d3 = 2 & n3 ? new Ft() : Wi;
        for (i3.set(t3, e3), i3.set(e3, t3); ++l3 < u3; ) {
          var h3, p3 = t3[l3], v3 = e3[l3];
          if ((h3 = r3 ? a3 ? r3(v3, p3, l3, e3, t3, i3) : r3(p3, v3, l3, t3, e3, i3) : h3) !== Wi) {
            if (h3)
              continue;
            f3 = false;
            break;
          }
          if (d3) {
            if (!Hu(e3, function(t4, e4) {
              return !ec(d3, e4) && (p3 === t4 || o3(p3, t4, n3, r3, i3)) && d3.push(e4);
            })) {
              f3 = false;
              break;
            }
          } else if (p3 !== v3 && !o3(p3, v3, n3, r3, i3)) {
            f3 = false;
            break;
          }
        }
        return i3.delete(t3), i3.delete(e3), f3;
      }
      function Vn(t3) {
        return gr(fr(t3, Wi, Br), t3 + "");
      }
      function Nn(t3) {
        return ve(t3, L2, Qn);
      }
      function Un(t3) {
        return ve(t3, O2, tr);
      }
      var $n = Bt ? function(t3) {
        return Bt.get(t3);
      } : Di;
      function Gn(t3) {
        for (var e3 = t3.name + "", n3 = Tt[e3], r3 = z.call(Tt, e3) ? n3.length : 0; r3--; ) {
          var o3 = n3[r3], i3 = o3.func;
          if (null == i3 || i3 == t3)
            return o3.name;
        }
        return e3;
      }
      function qn(t3) {
        return (z.call(p2, "placeholder") ? p2 : t3).placeholder;
      }
      function f2() {
        var t3 = (t3 = p2.iteratee || xi) === xi ? Ie : t3;
        return arguments.length ? t3(arguments[0], arguments[1]) : t3;
      }
      function Zn(t3, e3) {
        var n3, r3, t3 = t3.__data__;
        return ("string" == (r3 = typeof (n3 = e3)) || "number" == r3 || "symbol" == r3 || "boolean" == r3 ? "__proto__" !== n3 : null === n3) ? t3["string" == typeof e3 ? "string" : "hash"] : t3.map;
      }
      function Kn(t3) {
        for (var e3 = L2(t3), n3 = e3.length; n3--; ) {
          var r3 = e3[n3], o3 = t3[r3];
          e3[n3] = [r3, o3, sr(o3)];
        }
        return e3;
      }
      function Jn(t3, e3) {
        e3 = e3;
        t3 = null == (t3 = t3) ? Wi : t3[e3];
        return De(t3) ? t3 : Wi;
      }
      var Qn = vt ? function(e3) {
        return null == e3 ? [] : (e3 = v2(e3), ca(vt(e3), function(t3) {
          return ot.call(e3, t3);
        }));
      } : Ri, tr = vt ? function(t3) {
        for (var e3 = []; t3; )
          la(e3, Qn(t3)), t3 = nt(t3);
        return e3;
      } : Ri, j = n2;
      function er(t3, e3, n3) {
        for (var r3 = -1, o3 = (e3 = an(e3, t3)).length, i3 = false; ++r3 < o3; ) {
          var a3 = br(e3[r3]);
          if (!(i3 = null != t3 && n3(t3, a3)))
            break;
          t3 = t3[a3];
        }
        return i3 || ++r3 != o3 ? i3 : !!(o3 = null == t3 ? 0 : t3.length) && Do(o3) && or(a3, o3) && (M(t3) || yo(t3));
      }
      function nr(t3) {
        return "function" != typeof t3.constructor || cr(t3) ? {} : zt(nt(t3));
      }
      function rr(t3) {
        return M(t3) || yo(t3) || !!(at && t3 && t3[at]);
      }
      function or(t3, e3) {
        var n3 = typeof t3;
        return !!(e3 = null == e3 ? $i : e3) && ("number" == n3 || "symbol" != n3 && _u.test(t3)) && -1 < t3 && t3 % 1 == 0 && t3 < e3;
      }
      function d2(t3, e3, n3) {
        var r3;
        if (I2(n3))
          return r3 = typeof e3, ("number" == r3 ? l2(n3) && or(e3, n3.length) : "string" == r3 && e3 in n3) && X(n3[e3], t3);
      }
      function ir(t3, e3) {
        var n3;
        if (!M(t3))
          return n3 = typeof t3, "number" == n3 || "symbol" == n3 || "boolean" == n3 || null == t3 || S2(t3) || (tu.test(t3) || !Qa.test(t3) || null != e3 && t3 in v2(e3));
      }
      function ar(t3) {
        var e3 = Gn(t3), n3 = p2[e3];
        if ("function" == typeof n3 && e3 in _2.prototype) {
          if (t3 === n3)
            return 1;
          e3 = $n(n3);
          return e3 && t3 === e3[0];
        }
      }
      (i2 && j(new i2(new ArrayBuffer(1))) != na || Ct && j(new Ct()) != Ji || Dt && j(Dt.resolve()) != Ta || It && j(new It()) != ea || t2 && j(new t2()) != ka) && (j = function(t3) {
        var e3 = n2(t3), t3 = e3 == ta ? t3.constructor : Wi, t3 = t3 ? Cr(t3) : "";
        if (t3)
          switch (t3) {
            case Lt:
              return na;
            case Ot:
              return Ji;
            case Rt:
              return Ta;
            case kt:
              return ea;
            case Et:
              return ka;
          }
        return e3;
      });
      var ur = U ? bo : ki;
      function cr(t3) {
        var e3 = t3 && t3.constructor;
        return t3 === ("function" == typeof e3 && e3.prototype || N);
      }
      function sr(t3) {
        return t3 == t3 && !I2(t3);
      }
      function lr(e3, n3) {
        return function(t3) {
          return null != t3 && (t3[e3] === n3 && (n3 !== Wi || e3 in v2(t3)));
        };
      }
      function fr(i3, a3, u3) {
        return a3 = w2(a3 === Wi ? i3.length - 1 : a3, 0), function() {
          for (var t3 = arguments, e3 = -1, n3 = w2(t3.length - a3, 0), r3 = b2(n3); ++e3 < n3; )
            r3[e3] = t3[a3 + e3];
          for (var e3 = -1, o3 = b2(a3 + 1); ++e3 < a3; )
            o3[e3] = t3[e3];
          return o3[a3] = u3(r3), aa(i3, this, o3);
        };
      }
      function dr(t3, e3) {
        return e3.length < 2 ? t3 : pe(t3, u2(e3, 0, -1));
      }
      function hr(t3, e3) {
        if (("constructor" !== e3 || "function" != typeof t3[e3]) && "__proto__" != e3)
          return t3[e3];
      }
      var pr = yr(He), vr = dt || function(t3, e3) {
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
          o3 & t4[1] && !Xu(r3, e4) && r3.push(e4);
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
          var i3 = je(n3, o3), a3 = t3[i3];
          t3[i3] = t3[n3], t3[n3] = a3;
        }
        return t3.length = e3, t3;
      }
      xr = (lt = lo(lt = function(t3) {
        var o3 = [];
        return 46 === t3.charCodeAt(0) && o3.push(""), t3.replace(eu, function(t4, e3, n3, r3) {
          o3.push(n3 ? r3.replace(lu, "$1") : e3 || t4);
        }), o3;
      }, function(t3) {
        return 500 === xr.size && xr.clear(), t3;
      })).cache;
      var xr, mr = lt;
      function br(t3) {
        if ("string" == typeof t3 || S2(t3))
          return t3;
        var e3 = t3 + "";
        return "0" == e3 && 1 / t3 == -Ui ? "-0" : e3;
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
      function Dr(t3) {
        if (t3 instanceof _2)
          return t3.clone();
        var e3 = new g2(t3.__wrapped__, t3.__chain__);
        return e3.__actions__ = D2(t3.__actions__), e3.__index__ = t3.__index__, e3.__values__ = t3.__values__, e3;
      }
      i2 = a2(function(t3, e3) {
        return m2(t3) ? re(t3, c2(e3, 1, m2, true)) : [];
      }), Dt = a2(function(t3, e3) {
        var n3 = r2(e3);
        return m2(n3) && (n3 = Wi), m2(t3) ? re(t3, c2(e3, 1, m2, true), f2(n3, 2)) : [];
      }), t2 = a2(function(t3, e3) {
        var n3 = r2(e3);
        return m2(n3) && (n3 = Wi), m2(t3) ? re(t3, c2(e3, 1, m2, true), Wi, n3) : [];
      });
      function Ir(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        if (!r3)
          return -1;
        n3 = null == n3 ? 0 : B2(n3);
        return n3 < 0 && (n3 = w2(r3 + n3, 0)), Nu(t3, f2(e3, 3), n3);
      }
      function Sr(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        if (!r3)
          return -1;
        var o3 = r3 - 1;
        return n3 !== Wi && (o3 = B2(n3), o3 = n3 < 0 ? w2(r3 + o3, 0) : C2(o3, r3 - 1)), Nu(t3, f2(e3, 3), o3, true);
      }
      function Br(t3) {
        return (null == t3 ? 0 : t3.length) ? c2(t3, 1) : [];
      }
      function Tr(t3) {
        return t3 && t3.length ? t3[0] : Wi;
      }
      U = a2(function(t3) {
        var e3 = sa(t3, rn);
        return e3.length && e3[0] === t3[0] ? we(e3) : [];
      }), dt = a2(function(t3) {
        var e3 = r2(t3), n3 = sa(t3, rn);
        return e3 === r2(n3) ? e3 = Wi : n3.pop(), n3.length && n3[0] === t3[0] ? we(n3, f2(e3, 2)) : [];
      }), e2 = a2(function(t3) {
        var e3 = r2(t3), n3 = sa(t3, rn);
        return (e3 = "function" == typeof e3 ? e3 : Wi) && n3.pop(), n3.length && n3[0] === t3[0] ? we(n3, Wi, e3) : [];
      });
      function r2(t3) {
        var e3 = null == t3 ? 0 : t3.length;
        return e3 ? t3[e3 - 1] : Wi;
      }
      lt = a2(Lr);
      function Lr(t3, e3) {
        return t3 && t3.length && e3 && e3.length ? ze(t3, e3) : t3;
      }
      var Or = Vn(function(t3, e3) {
        var n3 = null == t3 ? 0 : t3.length, r3 = Qt(t3, e3);
        return Ye(t3, sa(e3, function(t4) {
          return or(t4, n3) ? +t4 : t4;
        }).sort(hn)), r3;
      });
      function Rr(t3) {
        return null == t3 ? t3 : bt.call(t3);
      }
      var kr = a2(function(t3) {
        return Ze(c2(t3, 1, m2, true));
      }), Er = a2(function(t3) {
        var e3 = r2(t3);
        return m2(e3) && (e3 = Wi), Ze(c2(t3, 1, m2, true), f2(e3, 2));
      }), Ar = a2(function(t3) {
        var e3 = "function" == typeof (e3 = r2(t3)) ? e3 : Wi;
        return Ze(c2(t3, 1, m2, true), Wi, e3);
      });
      function Pr(e3) {
        if (!e3 || !e3.length)
          return [];
        var n3 = 0;
        return e3 = ca(e3, function(t3) {
          return m2(t3) && (n3 = w2(t3.length, n3), 1);
        }), Ju(n3, function(t3) {
          return sa(e3, qu(t3));
        });
      }
      function zr(t3, e3) {
        if (!t3 || !t3.length)
          return [];
        t3 = Pr(t3);
        return null == e3 ? t3 : sa(t3, function(t4) {
          return aa(e3, Wi, t4);
        });
      }
      var Yr = a2(function(t3, e3) {
        return m2(t3) ? re(t3, e3) : [];
      }), jr = a2(function(t3) {
        return en(ca(t3, m2));
      }), Xr = a2(function(t3) {
        var e3 = r2(t3);
        return m2(e3) && (e3 = Wi), en(ca(t3, m2), f2(e3, 2));
      }), Mr = a2(function(t3) {
        var e3 = "function" == typeof (e3 = r2(t3)) ? e3 : Wi;
        return en(ca(t3, m2), Wi, e3);
      }), Wr = a2(Pr);
      var Fr = a2(function(t3) {
        var e3 = t3.length, e3 = "function" == typeof (e3 = 1 < e3 ? t3[e3 - 1] : Wi) ? (t3.pop(), e3) : Wi;
        return zr(t3, e3);
      });
      function Hr(t3) {
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
        var n3 = e3.length, r3 = n3 ? e3[0] : 0, o3 = this.__wrapped__;
        return !(1 < n3 || this.__actions__.length) && o3 instanceof _2 && or(r3) ? ((o3 = o3.slice(r3, +r3 + (n3 ? 1 : 0))).__actions__.push({ func: Vr, args: [t3], thisArg: Wi }), new g2(o3, this.__chain__).thru(function(t4) {
          return n3 && !t4.length && t4.push(Wi), t4;
        })) : this.thru(t3);
      });
      var Ur = _n(function(t3, e3, n3) {
        z.call(t3, n3) ? ++t3[n3] : Jt(t3, n3, 1);
      });
      var $r = In(Ir), Gr = In(Sr);
      function qr(t3, e3) {
        return (M(t3) ? ua : oe)(t3, f2(e3, 3));
      }
      function Zr(t3, e3) {
        return (M(t3) ? Yu : ie)(t3, f2(e3, 3));
      }
      var Kr = _n(function(t3, e3, n3) {
        z.call(t3, n3) ? t3[n3].push(e3) : Jt(t3, n3, [e3]);
      });
      var Jr = a2(function(t3, e3, n3) {
        var r3 = -1, o3 = "function" == typeof e3, i3 = l2(t3) ? b2(t3.length) : [];
        return oe(t3, function(t4) {
          i3[++r3] = o3 ? aa(e3, t4, n3) : xe(t4, e3, n3);
        }), i3;
      }), Qr = _n(function(t3, e3, n3) {
        Jt(t3, n3, e3);
      });
      function to(t3, e3) {
        return (M(t3) ? sa : Le)(t3, f2(e3, 3));
      }
      var eo = _n(function(t3, e3, n3) {
        t3[n3 ? 0 : 1].push(e3);
      }, function() {
        return [[], []];
      });
      var no = a2(function(t3, e3) {
        if (null == t3)
          return [];
        var n3 = e3.length;
        return 1 < n3 && d2(t3, e3[0], e3[1]) ? e3 = [] : 2 < n3 && d2(e3[0], e3[1], e3[2]) && (e3 = [e3[0]]), Ae(t3, c2(e3, 1), []);
      }), ro = ft || function() {
        return ia.Date.now();
      };
      function oo(t3, e3, n3) {
        return e3 = n3 ? Wi : e3, e3 = t3 && null == e3 ? t3.length : e3, Xn(t3, Ni, Wi, Wi, Wi, Wi, e3);
      }
      function io(t3, e3) {
        var n3;
        if ("function" != typeof e3)
          throw new y2(Fi);
        return t3 = B2(t3), function() {
          return 0 < --t3 && (n3 = e3.apply(this, arguments)), t3 <= 1 && (e3 = Wi), n3;
        };
      }
      var ao = a2(function(t3, e3, n3) {
        var r3, o3 = 1;
        return n3.length && (r3 = pa(n3, qn(ao)), o3 |= Hi), Xn(t3, o3, e3, n3, r3);
      }), uo = a2(function(t3, e3, n3) {
        var r3, o3 = 3;
        return n3.length && (r3 = pa(n3, qn(uo)), o3 |= Hi), Xn(e3, o3, t3, n3, r3);
      });
      function co(r3, n3, t3) {
        var o3, i3, a3, u3, c3, s3, l3 = 0, f3 = false, d3 = false, e3 = true;
        if ("function" != typeof r3)
          throw new y2(Fi);
        function h3(t4) {
          var e4 = o3, n4 = i3;
          return o3 = i3 = Wi, l3 = t4, u3 = r3.apply(n4, e4);
        }
        function p3(t4) {
          var e4 = t4 - s3;
          return s3 === Wi || n3 <= e4 || e4 < 0 || d3 && a3 <= t4 - l3;
        }
        function v3() {
          var t4, e4 = ro();
          if (p3(e4))
            return g3(e4);
          c3 = vr(v3, (t4 = n3 - ((e4 = e4) - s3), d3 ? C2(t4, a3 - (e4 - l3)) : t4));
        }
        function g3(t4) {
          return c3 = Wi, e3 && o3 ? h3(t4) : (o3 = i3 = Wi, u3);
        }
        function _3() {
          var t4 = ro(), e4 = p3(t4);
          if (o3 = arguments, i3 = this, s3 = t4, e4) {
            if (c3 === Wi)
              return l3 = t4 = s3, c3 = vr(v3, n3), f3 ? h3(t4) : u3;
            if (d3)
              return sn(c3), c3 = vr(v3, n3), h3(s3);
          }
          return c3 === Wi && (c3 = vr(v3, n3)), u3;
        }
        return n3 = T2(n3) || 0, I2(t3) && (f3 = !!t3.leading, d3 = "maxWait" in t3, a3 = d3 ? w2(T2(t3.maxWait) || 0, n3) : a3, e3 = "trailing" in t3 ? !!t3.trailing : e3), _3.cancel = function() {
          c3 !== Wi && sn(c3), l3 = 0, o3 = s3 = i3 = c3 = Wi;
        }, _3.flush = function() {
          return c3 === Wi ? u3 : g3(ro());
        }, _3;
      }
      var ft = a2(function(t3, e3) {
        return ne(t3, 1, e3);
      }), so = a2(function(t3, e3, n3) {
        return ne(t3, T2(e3) || 0, n3);
      });
      function lo(r3, o3) {
        if ("function" != typeof r3 || null != o3 && "function" != typeof o3)
          throw new y2(Fi);
        function i3() {
          var t3 = arguments, e3 = o3 ? o3.apply(this, t3) : t3[0], n3 = i3.cache;
          return n3.has(e3) ? n3.get(e3) : (t3 = r3.apply(this, t3), i3.cache = n3.set(e3, t3) || n3, t3);
        }
        return i3.cache = new (lo.Cache || Wt)(), i3;
      }
      function fo(e3) {
        if ("function" != typeof e3)
          throw new y2(Fi);
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
        var i3 = (o3 = 1 == o3.length && M(o3[0]) ? sa(o3[0], da(f2())) : sa(c2(o3, 1), da(f2()))).length;
        return a2(function(t3) {
          for (var e3 = -1, n3 = C2(t3.length, i3); ++e3 < n3; )
            t3[e3] = o3[e3].call(this, t3[e3]);
          return aa(r3, this, t3);
        });
      }), ho = a2(function(t3, e3) {
        var n3 = pa(e3, qn(ho));
        return Xn(t3, Hi, Wi, e3, n3);
      }), po = a2(function(t3, e3) {
        var n3 = pa(e3, qn(po));
        return Xn(t3, Vi, Wi, e3, n3);
      }), vo = Vn(function(t3, e3) {
        return Xn(t3, ma, Wi, Wi, Wi, e3);
      });
      function X(t3, e3) {
        return t3 === e3 || t3 != t3 && e3 != e3;
      }
      var go = An(ge), _o = An(function(t3, e3) {
        return e3 <= t3;
      }), yo = me(function() {
        return arguments;
      }()) ? me : function(t3) {
        return W(t3) && z.call(t3, "callee") && !ot.call(t3, "callee");
      }, M = b2.isArray, wo = Ou ? da(Ou) : function(t3) {
        return W(t3) && n2(t3) == Ea;
      };
      function l2(t3) {
        return null != t3 && Do(t3.length) && !bo(t3);
      }
      function m2(t3) {
        return W(t3) && l2(t3);
      }
      var xo = V || ki, V = Ru ? da(Ru) : function(t3) {
        return W(t3) && n2(t3) == Ki;
      };
      function mo(t3) {
        if (!W(t3))
          return false;
        var e3 = n2(t3);
        return e3 == Ia || "[object DOMException]" == e3 || "string" == typeof t3.message && "string" == typeof t3.name && !Bo(t3);
      }
      function bo(t3) {
        if (!I2(t3))
          return false;
        t3 = n2(t3);
        return t3 == Sa || t3 == Ba || "[object AsyncFunction]" == t3 || "[object Proxy]" == t3;
      }
      function Co(t3) {
        return "number" == typeof t3 && t3 == B2(t3);
      }
      function Do(t3) {
        return "number" == typeof t3 && -1 < t3 && t3 % 1 == 0 && t3 <= $i;
      }
      function I2(t3) {
        var e3 = typeof t3;
        return null != t3 && ("object" == e3 || "function" == e3);
      }
      function W(t3) {
        return null != t3 && "object" == typeof t3;
      }
      var Io = ku ? da(ku) : function(t3) {
        return W(t3) && j(t3) == Ji;
      };
      function So(t3) {
        return "number" == typeof t3 || W(t3) && n2(t3) == Qi;
      }
      function Bo(t3) {
        if (!W(t3) || n2(t3) != ta)
          return false;
        t3 = nt(t3);
        if (null === t3)
          return true;
        t3 = z.call(t3, "constructor") && t3.constructor;
        return "function" == typeof t3 && t3 instanceof t3 && $.call(t3) == K;
      }
      var To = Eu ? da(Eu) : function(t3) {
        return W(t3) && n2(t3) == La;
      };
      var Lo = Au ? da(Au) : function(t3) {
        return W(t3) && j(t3) == ea;
      };
      function Oo(t3) {
        return "string" == typeof t3 || !M(t3) && W(t3) && n2(t3) == Oa;
      }
      function S2(t3) {
        return "symbol" == typeof t3 || W(t3) && n2(t3) == Ra;
      }
      var Ro = Pu ? da(Pu) : function(t3) {
        return W(t3) && Do(t3.length) && !!ra[n2(t3)];
      };
      var ko = An(Te), Eo = An(function(t3, e3) {
        return t3 <= e3;
      });
      function Ao(t3) {
        if (!t3)
          return [];
        if (l2(t3))
          return (Oo(t3) ? ga : D2)(t3);
        if (ut && t3[ut]) {
          for (var e3, n3 = t3[ut](), r3 = []; !(e3 = n3.next()).done; )
            r3.push(e3.value);
          return r3;
        }
        var o3 = j(t3);
        return (o3 == Ji ? uc : o3 == ea ? sc : ri)(t3);
      }
      function Po(t3) {
        return t3 ? (t3 = T2(t3)) === Ui || t3 === -Ui ? 17976931348623157e292 * (t3 < 0 ? -1 : 1) : t3 == t3 ? t3 : 0 : 0 === t3 ? t3 : 0;
      }
      function B2(t3) {
        var t3 = Po(t3), e3 = t3 % 1;
        return t3 == t3 ? e3 ? t3 - e3 : t3 : 0;
      }
      function zo(t3) {
        return t3 ? te(B2(t3), 0, Gi) : 0;
      }
      function T2(t3) {
        if ("number" == typeof t3)
          return t3;
        if (S2(t3))
          return ba;
        if ("string" != typeof (t3 = I2(t3) ? I2(e3 = "function" == typeof t3.valueOf ? t3.valueOf() : t3) ? e3 + "" : e3 : t3))
          return 0 === t3 ? t3 : +t3;
        t3 = Qu(t3);
        var e3 = pu.test(t3);
        return e3 || gu.test(t3) ? Tu(t3.slice(2), e3 ? 2 : 8) : hu.test(t3) ? ba : +t3;
      }
      function Yo(t3) {
        return gn(t3, O2(t3));
      }
      function h2(t3) {
        return null == t3 ? "" : s2(t3);
      }
      var jo = yn(function(t3, e3) {
        if (cr(e3) || l2(e3))
          gn(e3, L2(e3), t3);
        else
          for (var n3 in e3)
            z.call(e3, n3) && Gt(t3, n3, e3[n3]);
      }), Xo = yn(function(t3, e3) {
        gn(e3, O2(e3), t3);
      }), Mo = yn(function(t3, e3, n3, r3) {
        gn(e3, O2(e3), t3, r3);
      }), Wo = yn(function(t3, e3, n3, r3) {
        gn(e3, L2(e3), t3, r3);
      }), Fo = Vn(Qt);
      var Ho = a2(function(t3, e3) {
        t3 = v2(t3);
        var n3 = -1, r3 = e3.length, o3 = 2 < r3 ? e3[2] : Wi;
        for (o3 && d2(e3[0], e3[1], o3) && (r3 = 1); ++n3 < r3; )
          for (var i3 = e3[n3], a3 = O2(i3), u3 = -1, c3 = a3.length; ++u3 < c3; ) {
            var s3 = a3[u3], l3 = t3[s3];
            (l3 === Wi || X(l3, N[s3]) && !z.call(t3, s3)) && (t3[s3] = i3[s3]);
          }
        return t3;
      }), Vo = a2(function(t3) {
        return t3.push(Wi, Wn), aa(Ko, Wi, t3);
      });
      function No(t3, e3, n3) {
        t3 = null == t3 ? Wi : pe(t3, e3);
        return t3 === Wi ? n3 : t3;
      }
      function Uo(t3, e3) {
        return null != t3 && er(t3, e3, ye);
      }
      var $o = Tn(function(t3, e3, n3) {
        t3[e3 = null != e3 && "function" != typeof e3.toString ? Z.call(e3) : e3] = n3;
      }, _i(R)), Go = Tn(function(t3, e3, n3) {
        null != e3 && "function" != typeof e3.toString && (e3 = Z.call(e3)), z.call(t3, e3) ? t3[e3].push(n3) : t3[e3] = [n3];
      }, f2), qo = a2(xe);
      function L2(t3) {
        return (l2(t3) ? Ht : Se)(t3);
      }
      function O2(t3) {
        return l2(t3) ? Ht(t3, true) : Be(t3);
      }
      var Zo = yn(function(t3, e3, n3) {
        ke(t3, e3, n3);
      }), Ko = yn(function(t3, e3, n3, r3) {
        ke(t3, e3, n3, r3);
      }), Jo = Vn(function(e3, t3) {
        var n3 = {};
        if (null == e3)
          return n3;
        for (var r3 = false, o3 = (t3 = sa(t3, function(t4) {
          return t4 = an(t4, e3), r3 = r3 || 1 < t4.length, t4;
        }), gn(e3, Un(e3), n3), r3 && (n3 = x2(n3, 7, Fn)), t3.length); o3--; )
          Ke(n3, t3[o3]);
        return n3;
      });
      var Qo = Vn(function(t3, e3) {
        return null == t3 ? {} : Pe(n3 = t3, e3, function(t4, e4) {
          return Uo(n3, e4);
        });
        var n3;
      });
      function ti(t3, n3) {
        if (null == t3)
          return {};
        var e3 = sa(Un(t3), function(t4) {
          return [t4];
        });
        return n3 = f2(n3), Pe(t3, e3, function(t4, e4) {
          return n3(t4, e4[0]);
        });
      }
      var ei = jn(L2), ni = jn(O2);
      function ri(t3) {
        return null == t3 ? [] : tc(t3, L2(t3));
      }
      var oi = bn(function(t3, e3, n3) {
        return e3 = e3.toLowerCase(), t3 + (n3 ? ii(e3) : e3);
      });
      function ii(t3) {
        return hi(h2(t3).toLowerCase());
      }
      function ai(t3) {
        return (t3 = h2(t3)) && t3.replace(yu, oc).replace(bu, "");
      }
      var ui = bn(function(t3, e3, n3) {
        return t3 + (n3 ? "-" : "") + e3.toLowerCase();
      }), ci = bn(function(t3, e3, n3) {
        return t3 + (n3 ? " " : "") + e3.toLowerCase();
      }), si = mn("toLowerCase");
      var li = bn(function(t3, e3, n3) {
        return t3 + (n3 ? "_" : "") + e3.toLowerCase();
      });
      var fi = bn(function(t3, e3, n3) {
        return t3 + (n3 ? " " : "") + hi(e3);
      });
      var di = bn(function(t3, e3, n3) {
        return t3 + (n3 ? " " : "") + e3.toUpperCase();
      }), hi = mn("toUpperCase");
      function pi(t3, e3, n3) {
        return t3 = h2(t3), (e3 = n3 ? Wi : e3) === Wi ? (n3 = t3, Du.test(n3) ? t3.match(Cu) || [] : t3.match(cu) || []) : t3.match(e3) || [];
      }
      var vi = a2(function(t3, e3) {
        try {
          return aa(t3, Wi, e3);
        } catch (t4) {
          return mo(t4) ? t4 : new k(t4);
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
      var yi = Sn(), wi = Sn(true);
      function R(t3) {
        return t3;
      }
      function xi(t3) {
        return Ie("function" == typeof t3 ? t3 : x2(t3, 1));
      }
      var mi = a2(function(e3, n3) {
        return function(t3) {
          return xe(t3, e3, n3);
        };
      }), bi = a2(function(e3, n3) {
        return function(t3) {
          return xe(e3, t3, n3);
        };
      });
      function Ci(r3, e3, t3) {
        var n3 = L2(e3), o3 = he(e3, n3), i3 = (null != t3 || I2(e3) && (o3.length || !n3.length) || (t3 = e3, e3 = r3, r3 = this, o3 = he(e3, L2(e3))), !(I2(t3) && "chain" in t3 && !t3.chain)), a3 = bo(r3);
        return ua(o3, function(t4) {
          var n4 = e3[t4];
          r3[t4] = n4, a3 && (r3.prototype[t4] = function() {
            var t5, e4 = this.__chain__;
            return i3 || e4 ? (((t5 = r3(this.__wrapped__)).__actions__ = D2(this.__actions__)).push({ func: n4, args: arguments, thisArg: r3 }), t5.__chain__ = e4, t5) : n4.apply(r3, la([this.value()], arguments));
          });
        }), r3;
      }
      function Di() {
      }
      var Ii = On(sa), Si = On(ju), Bi = On(Hu);
      function Ti(t3) {
        return ir(t3) ? qu(br(t3)) : (e3 = t3, function(t4) {
          return pe(t4, e3);
        });
        var e3;
      }
      var Li = En(), Oi = En(true);
      function Ri() {
        return [];
      }
      function ki() {
        return false;
      }
      var Ei = Ln(function(t3, e3) {
        return t3 + e3;
      }, 0), Ai = zn("ceil"), Pi = Ln(function(t3, e3) {
        return t3 / e3;
      }, 1), zi = zn("floor");
      var Yi, ji = Ln(function(t3, e3) {
        return t3 * e3;
      }, 1), Xi = zn("round"), Mi = Ln(function(t3, e3) {
        return t3 - e3;
      }, 0);
      return p2.after = function(t3, e3) {
        if ("function" != typeof e3)
          throw new y2(Fi);
        return t3 = B2(t3), function() {
          if (--t3 < 1)
            return e3.apply(this, arguments);
        };
      }, p2.ary = oo, p2.assign = jo, p2.assignIn = Xo, p2.assignInWith = Mo, p2.assignWith = Wo, p2.at = Fo, p2.before = io, p2.bind = ao, p2.bindAll = gi, p2.bindKey = uo, p2.castArray = function() {
        if (!arguments.length)
          return [];
        var t3 = arguments[0];
        return M(t3) ? t3 : [t3];
      }, p2.chain = Hr, p2.chunk = function(t3, e3, n3) {
        e3 = (n3 ? d2(t3, e3, n3) : e3 === Wi) ? 1 : w2(B2(e3), 0);
        var r3 = null == t3 ? 0 : t3.length;
        if (!r3 || e3 < 1)
          return [];
        for (var o3 = 0, i3 = 0, a3 = b2(ht(r3 / e3)); o3 < r3; )
          a3[i3++] = u2(t3, o3, o3 += e3);
        return a3;
      }, p2.compact = function(t3) {
        for (var e3 = -1, n3 = null == t3 ? 0 : t3.length, r3 = 0, o3 = []; ++e3 < n3; ) {
          var i3 = t3[e3];
          i3 && (o3[r3++] = i3);
        }
        return o3;
      }, p2.concat = function() {
        var t3 = arguments.length;
        if (!t3)
          return [];
        for (var e3 = b2(t3 - 1), n3 = arguments[0], r3 = t3; r3--; )
          e3[r3 - 1] = arguments[r3];
        return la(M(n3) ? D2(n3) : [n3], c2(e3, 1));
      }, p2.cond = function(r3) {
        var o3 = null == r3 ? 0 : r3.length, e3 = f2();
        return r3 = o3 ? sa(r3, function(t3) {
          if ("function" != typeof t3[1])
            throw new y2(Fi);
          return [e3(t3[0]), t3[1]];
        }) : [], a2(function(t3) {
          for (var e4 = -1; ++e4 < o3; ) {
            var n3 = r3[e4];
            if (aa(n3[0], this, t3))
              return aa(n3[1], this, t3);
          }
        });
      }, p2.conforms = function(t3) {
        return e3 = x2(t3, 1), n3 = L2(e3), function(t4) {
          return ee(t4, e3, n3);
        };
        var e3, n3;
      }, p2.constant = _i, p2.countBy = Ur, p2.create = function(t3, e3) {
        return t3 = zt(t3), null == e3 ? t3 : Kt(t3, e3);
      }, p2.curry = function t3(e3, n3, r3) {
        e3 = Xn(e3, 8, Wi, Wi, Wi, Wi, Wi, n3 = r3 ? Wi : n3);
        return e3.placeholder = t3.placeholder, e3;
      }, p2.curryRight = function t3(e3, n3, r3) {
        e3 = Xn(e3, xa, Wi, Wi, Wi, Wi, Wi, n3 = r3 ? Wi : n3);
        return e3.placeholder = t3.placeholder, e3;
      }, p2.debounce = co, p2.defaults = Ho, p2.defaultsDeep = Vo, p2.defer = ft, p2.delay = so, p2.difference = i2, p2.differenceBy = Dt, p2.differenceWith = t2, p2.drop = function(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        return r3 ? u2(t3, (e3 = n3 || e3 === Wi ? 1 : B2(e3)) < 0 ? 0 : e3, r3) : [];
      }, p2.dropRight = function(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        return r3 ? u2(t3, 0, (e3 = r3 - (e3 = n3 || e3 === Wi ? 1 : B2(e3))) < 0 ? 0 : e3) : [];
      }, p2.dropRightWhile = function(t3, e3) {
        return t3 && t3.length ? Qe(t3, f2(e3, 3), true, true) : [];
      }, p2.dropWhile = function(t3, e3) {
        return t3 && t3.length ? Qe(t3, f2(e3, 3), true) : [];
      }, p2.fill = function(t3, e3, n3, r3) {
        if (!(c3 = null == t3 ? 0 : t3.length))
          return [];
        n3 && "number" != typeof n3 && d2(t3, e3, n3) && (n3 = 0, r3 = c3);
        var o3 = t3, i3 = e3, a3 = n3, u3 = r3, c3 = o3.length;
        for ((a3 = B2(a3)) < 0 && (a3 = c3 < -a3 ? 0 : c3 + a3), (u3 = u3 === Wi || c3 < u3 ? c3 : B2(u3)) < 0 && (u3 += c3), u3 = u3 < a3 ? 0 : zo(u3); a3 < u3; )
          o3[a3++] = i3;
        return o3;
      }, p2.filter = function(t3, e3) {
        return (M(t3) ? ca : ce)(t3, f2(e3, 3));
      }, p2.flatMap = function(t3, e3) {
        return c2(to(t3, e3), 1);
      }, p2.flatMapDeep = function(t3, e3) {
        return c2(to(t3, e3), Ui);
      }, p2.flatMapDepth = function(t3, e3, n3) {
        return n3 = n3 === Wi ? 1 : B2(n3), c2(to(t3, e3), n3);
      }, p2.flatten = Br, p2.flattenDeep = function(t3) {
        return (null == t3 ? 0 : t3.length) ? c2(t3, Ui) : [];
      }, p2.flattenDepth = function(t3, e3) {
        return (null == t3 ? 0 : t3.length) ? c2(t3, e3 = e3 === Wi ? 1 : B2(e3)) : [];
      }, p2.flip = function(t3) {
        return Xn(t3, 512);
      }, p2.flow = yi, p2.flowRight = wi, p2.fromPairs = function(t3) {
        for (var e3 = -1, n3 = null == t3 ? 0 : t3.length, r3 = {}; ++e3 < n3; ) {
          var o3 = t3[e3];
          r3[o3[0]] = o3[1];
        }
        return r3;
      }, p2.functions = function(t3) {
        return null == t3 ? [] : he(t3, L2(t3));
      }, p2.functionsIn = function(t3) {
        return null == t3 ? [] : he(t3, O2(t3));
      }, p2.groupBy = Kr, p2.initial = function(t3) {
        return (null == t3 ? 0 : t3.length) ? u2(t3, 0, -1) : [];
      }, p2.intersection = U, p2.intersectionBy = dt, p2.intersectionWith = e2, p2.invert = $o, p2.invertBy = Go, p2.invokeMap = Jr, p2.iteratee = xi, p2.keyBy = Qr, p2.keys = L2, p2.keysIn = O2, p2.map = to, p2.mapKeys = function(t3, r3) {
        var o3 = {};
        return r3 = f2(r3, 3), fe(t3, function(t4, e3, n3) {
          Jt(o3, r3(t4, e3, n3), t4);
        }), o3;
      }, p2.mapValues = function(t3, r3) {
        var o3 = {};
        return r3 = f2(r3, 3), fe(t3, function(t4, e3, n3) {
          Jt(o3, e3, r3(t4, e3, n3));
        }), o3;
      }, p2.matches = function(t3) {
        return Oe(x2(t3, 1));
      }, p2.matchesProperty = function(t3, e3) {
        return Re(t3, x2(e3, 1));
      }, p2.memoize = lo, p2.merge = Zo, p2.mergeWith = Ko, p2.method = mi, p2.methodOf = bi, p2.mixin = Ci, p2.negate = fo, p2.nthArg = function(e3) {
        return e3 = B2(e3), a2(function(t3) {
          return Ee(t3, e3);
        });
      }, p2.omit = Jo, p2.omitBy = function(t3, e3) {
        return ti(t3, fo(f2(e3)));
      }, p2.once = function(t3) {
        return io(2, t3);
      }, p2.orderBy = function(t3, e3, n3, r3) {
        return null == t3 ? [] : Ae(t3, e3 = M(e3) ? e3 : null == e3 ? [] : [e3], n3 = M(n3 = r3 ? Wi : n3) ? n3 : null == n3 ? [] : [n3]);
      }, p2.over = Ii, p2.overArgs = un, p2.overEvery = Si, p2.overSome = Bi, p2.partial = ho, p2.partialRight = po, p2.partition = eo, p2.pick = Qo, p2.pickBy = ti, p2.property = Ti, p2.propertyOf = function(e3) {
        return function(t3) {
          return null == e3 ? Wi : pe(e3, t3);
        };
      }, p2.pull = lt, p2.pullAll = Lr, p2.pullAllBy = function(t3, e3, n3) {
        return t3 && t3.length && e3 && e3.length ? ze(t3, e3, f2(n3, 2)) : t3;
      }, p2.pullAllWith = function(t3, e3, n3) {
        return t3 && t3.length && e3 && e3.length ? ze(t3, e3, Wi, n3) : t3;
      }, p2.pullAt = Or, p2.range = Li, p2.rangeRight = Oi, p2.rearg = vo, p2.reject = function(t3, e3) {
        return (M(t3) ? ca : ce)(t3, fo(f2(e3, 3)));
      }, p2.remove = function(t3, e3) {
        var n3 = [];
        if (!t3 || !t3.length)
          return n3;
        var r3 = -1, o3 = [], i3 = t3.length;
        for (e3 = f2(e3, 3); ++r3 < i3; ) {
          var a3 = t3[r3];
          e3(a3, r3, t3) && (n3.push(a3), o3.push(r3));
        }
        return Ye(t3, o3), n3;
      }, p2.rest = function(t3, e3) {
        if ("function" != typeof t3)
          throw new y2(Fi);
        return a2(t3, e3 = e3 === Wi ? e3 : B2(e3));
      }, p2.reverse = Rr, p2.sampleSize = function(t3, e3, n3) {
        return e3 = (n3 ? d2(t3, e3, n3) : e3 === Wi) ? 1 : B2(e3), (M(t3) ? Nt : We)(t3, e3);
      }, p2.set = function(t3, e3, n3) {
        return null == t3 ? t3 : Fe(t3, e3, n3);
      }, p2.setWith = function(t3, e3, n3, r3) {
        return r3 = "function" == typeof r3 ? r3 : Wi, null == t3 ? t3 : Fe(t3, e3, n3, r3);
      }, p2.shuffle = function(t3) {
        return (M(t3) ? Ut : Ve)(t3);
      }, p2.slice = function(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        return r3 ? (n3 = n3 && "number" != typeof n3 && d2(t3, e3, n3) ? (e3 = 0, r3) : (e3 = null == e3 ? 0 : B2(e3), n3 === Wi ? r3 : B2(n3)), u2(t3, e3, n3)) : [];
      }, p2.sortBy = no, p2.sortedUniq = function(t3) {
        return t3 && t3.length ? Ge(t3) : [];
      }, p2.sortedUniqBy = function(t3, e3) {
        return t3 && t3.length ? Ge(t3, f2(e3, 2)) : [];
      }, p2.split = function(t3, e3, n3) {
        return n3 && "number" != typeof n3 && d2(t3, e3, n3) && (e3 = n3 = Wi), (n3 = n3 === Wi ? Gi : n3 >>> 0) ? (t3 = h2(t3)) && ("string" == typeof e3 || null != e3 && !To(e3)) && !(e3 = s2(e3)) && ha(t3) ? cn(ga(t3), 0, n3) : t3.split(e3, n3) : [];
      }, p2.spread = function(n3, r3) {
        if ("function" != typeof n3)
          throw new y2(Fi);
        return r3 = null == r3 ? 0 : w2(B2(r3), 0), a2(function(t3) {
          var e3 = t3[r3], t3 = cn(t3, 0, r3);
          return e3 && la(t3, e3), aa(n3, this, t3);
        });
      }, p2.tail = function(t3) {
        var e3 = null == t3 ? 0 : t3.length;
        return e3 ? u2(t3, 1, e3) : [];
      }, p2.take = function(t3, e3, n3) {
        return t3 && t3.length ? u2(t3, 0, (e3 = n3 || e3 === Wi ? 1 : B2(e3)) < 0 ? 0 : e3) : [];
      }, p2.takeRight = function(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        return r3 ? u2(t3, (e3 = r3 - (e3 = n3 || e3 === Wi ? 1 : B2(e3))) < 0 ? 0 : e3, r3) : [];
      }, p2.takeRightWhile = function(t3, e3) {
        return t3 && t3.length ? Qe(t3, f2(e3, 3), false, true) : [];
      }, p2.takeWhile = function(t3, e3) {
        return t3 && t3.length ? Qe(t3, f2(e3, 3)) : [];
      }, p2.tap = function(t3, e3) {
        return e3(t3), t3;
      }, p2.throttle = function(t3, e3, n3) {
        var r3 = true, o3 = true;
        if ("function" != typeof t3)
          throw new y2(Fi);
        return I2(n3) && (r3 = "leading" in n3 ? !!n3.leading : r3, o3 = "trailing" in n3 ? !!n3.trailing : o3), co(t3, e3, { leading: r3, maxWait: e3, trailing: o3 });
      }, p2.thru = Vr, p2.toArray = Ao, p2.toPairs = ei, p2.toPairsIn = ni, p2.toPath = function(t3) {
        return M(t3) ? sa(t3, br) : S2(t3) ? [t3] : D2(mr(h2(t3)));
      }, p2.toPlainObject = Yo, p2.transform = function(t3, r3, o3) {
        var e3, n3 = M(t3), i3 = n3 || xo(t3) || Ro(t3);
        return r3 = f2(r3, 4), null == o3 && (e3 = t3 && t3.constructor, o3 = i3 ? n3 ? new e3() : [] : I2(t3) && bo(e3) ? zt(nt(t3)) : {}), (i3 ? ua : fe)(t3, function(t4, e4, n4) {
          return r3(o3, t4, e4, n4);
        }), o3;
      }, p2.unary = function(t3) {
        return oo(t3, 1);
      }, p2.union = kr, p2.unionBy = Er, p2.unionWith = Ar, p2.uniq = function(t3) {
        return t3 && t3.length ? Ze(t3) : [];
      }, p2.uniqBy = function(t3, e3) {
        return t3 && t3.length ? Ze(t3, f2(e3, 2)) : [];
      }, p2.uniqWith = function(t3, e3) {
        return e3 = "function" == typeof e3 ? e3 : Wi, t3 && t3.length ? Ze(t3, Wi, e3) : [];
      }, p2.unset = function(t3, e3) {
        return null == t3 || Ke(t3, e3);
      }, p2.unzip = Pr, p2.unzipWith = zr, p2.update = function(t3, e3, n3) {
        return null == t3 ? t3 : Je(t3, e3, on(n3));
      }, p2.updateWith = function(t3, e3, n3, r3) {
        return r3 = "function" == typeof r3 ? r3 : Wi, null == t3 ? t3 : Je(t3, e3, on(n3), r3);
      }, p2.values = ri, p2.valuesIn = function(t3) {
        return null == t3 ? [] : tc(t3, O2(t3));
      }, p2.without = Yr, p2.words = pi, p2.wrap = function(t3, e3) {
        return ho(on(e3), t3);
      }, p2.xor = jr, p2.xorBy = Xr, p2.xorWith = Mr, p2.zip = Wr, p2.zipObject = function(t3, e3) {
        return nn(t3 || [], e3 || [], Gt);
      }, p2.zipObjectDeep = function(t3, e3) {
        return nn(t3 || [], e3 || [], Fe);
      }, p2.zipWith = Fr, p2.entries = ei, p2.entriesIn = ni, p2.extend = Xo, p2.extendWith = Mo, Ci(p2, p2), p2.add = Ei, p2.attempt = vi, p2.camelCase = oi, p2.capitalize = ii, p2.ceil = Ai, p2.clamp = function(t3, e3, n3) {
        return n3 === Wi && (n3 = e3, e3 = Wi), n3 !== Wi && (n3 = (n3 = T2(n3)) == n3 ? n3 : 0), e3 !== Wi && (e3 = (e3 = T2(e3)) == e3 ? e3 : 0), te(T2(t3), e3, n3);
      }, p2.clone = function(t3) {
        return x2(t3, 4);
      }, p2.cloneDeep = function(t3) {
        return x2(t3, 5);
      }, p2.cloneDeepWith = function(t3, e3) {
        return x2(t3, 5, e3 = "function" == typeof e3 ? e3 : Wi);
      }, p2.cloneWith = function(t3, e3) {
        return x2(t3, 4, e3 = "function" == typeof e3 ? e3 : Wi);
      }, p2.conformsTo = function(t3, e3) {
        return null == e3 || ee(t3, e3, L2(e3));
      }, p2.deburr = ai, p2.defaultTo = function(t3, e3) {
        return null == t3 || t3 != t3 ? e3 : t3;
      }, p2.divide = Pi, p2.endsWith = function(t3, e3, n3) {
        t3 = h2(t3), e3 = s2(e3);
        var r3 = t3.length, r3 = n3 = n3 === Wi ? r3 : te(B2(n3), 0, r3);
        return 0 <= (n3 -= e3.length) && t3.slice(n3, r3) == e3;
      }, p2.eq = X, p2.escape = function(t3) {
        return (t3 = h2(t3)) && qa.test(t3) ? t3.replace($a, ic) : t3;
      }, p2.escapeRegExp = function(t3) {
        return (t3 = h2(t3)) && ru.test(t3) ? t3.replace(nu, "\\$&") : t3;
      }, p2.every = function(t3, e3, n3) {
        return (M(t3) ? ju : ae)(t3, f2(e3 = n3 && d2(t3, e3, n3) ? Wi : e3, 3));
      }, p2.find = $r, p2.findIndex = Ir, p2.findKey = function(t3, e3) {
        return Vu(t3, f2(e3, 3), fe);
      }, p2.findLast = Gr, p2.findLastIndex = Sr, p2.findLastKey = function(t3, e3) {
        return Vu(t3, f2(e3, 3), de);
      }, p2.floor = zi, p2.forEach = qr, p2.forEachRight = Zr, p2.forIn = function(t3, e3) {
        return null == t3 ? t3 : se(t3, f2(e3, 3), O2);
      }, p2.forInRight = function(t3, e3) {
        return null == t3 ? t3 : le(t3, f2(e3, 3), O2);
      }, p2.forOwn = function(t3, e3) {
        return t3 && fe(t3, f2(e3, 3));
      }, p2.forOwnRight = function(t3, e3) {
        return t3 && de(t3, f2(e3, 3));
      }, p2.get = No, p2.gt = go, p2.gte = _o, p2.has = function(t3, e3) {
        return null != t3 && er(t3, e3, _e);
      }, p2.hasIn = Uo, p2.head = Tr, p2.identity = R, p2.includes = function(t3, e3, n3, r3) {
        return t3 = l2(t3) ? t3 : ri(t3), n3 = n3 && !r3 ? B2(n3) : 0, r3 = t3.length, n3 < 0 && (n3 = w2(r3 + n3, 0)), Oo(t3) ? n3 <= r3 && -1 < t3.indexOf(e3, n3) : !!r3 && -1 < fa(t3, e3, n3);
      }, p2.indexOf = function(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        return r3 ? (n3 = null == n3 ? 0 : B2(n3), fa(t3, e3, n3 = n3 < 0 ? w2(r3 + n3, 0) : n3)) : -1;
      }, p2.inRange = function(t3, e3, n3) {
        return e3 = Po(e3), n3 === Wi ? (n3 = e3, e3 = 0) : n3 = Po(n3), (t3 = t3 = T2(t3)) >= C2(e3 = e3, n3 = n3) && t3 < w2(e3, n3);
      }, p2.invoke = qo, p2.isArguments = yo, p2.isArray = M, p2.isArrayBuffer = wo, p2.isArrayLike = l2, p2.isArrayLikeObject = m2, p2.isBoolean = function(t3) {
        return true === t3 || false === t3 || W(t3) && n2(t3) == Zi;
      }, p2.isBuffer = xo, p2.isDate = V, p2.isElement = function(t3) {
        return W(t3) && 1 === t3.nodeType && !Bo(t3);
      }, p2.isEmpty = function(t3) {
        if (null == t3)
          return true;
        if (l2(t3) && (M(t3) || "string" == typeof t3 || "function" == typeof t3.splice || xo(t3) || Ro(t3) || yo(t3)))
          return !t3.length;
        var e3, n3 = j(t3);
        if (n3 == Ji || n3 == ea)
          return !t3.size;
        if (cr(t3))
          return !Se(t3).length;
        for (e3 in t3)
          if (z.call(t3, e3))
            return false;
        return true;
      }, p2.isEqual = function(t3, e3) {
        return be(t3, e3);
      }, p2.isEqualWith = function(t3, e3, n3) {
        var r3 = (n3 = "function" == typeof n3 ? n3 : Wi) ? n3(t3, e3) : Wi;
        return r3 === Wi ? be(t3, e3, Wi, n3) : !!r3;
      }, p2.isError = mo, p2.isFinite = function(t3) {
        return "number" == typeof t3 && gt(t3);
      }, p2.isFunction = bo, p2.isInteger = Co, p2.isLength = Do, p2.isMap = Io, p2.isMatch = function(t3, e3) {
        return t3 === e3 || Ce(t3, e3, Kn(e3));
      }, p2.isMatchWith = function(t3, e3, n3) {
        return n3 = "function" == typeof n3 ? n3 : Wi, Ce(t3, e3, Kn(e3), n3);
      }, p2.isNaN = function(t3) {
        return So(t3) && t3 != +t3;
      }, p2.isNative = function(t3) {
        if (ur(t3))
          throw new k("Unsupported core-js use. Try https://npms.io/search?q=ponyfill.");
        return De(t3);
      }, p2.isNil = function(t3) {
        return null == t3;
      }, p2.isNull = function(t3) {
        return null === t3;
      }, p2.isNumber = So, p2.isObject = I2, p2.isObjectLike = W, p2.isPlainObject = Bo, p2.isRegExp = To, p2.isSafeInteger = function(t3) {
        return Co(t3) && -$i <= t3 && t3 <= $i;
      }, p2.isSet = Lo, p2.isString = Oo, p2.isSymbol = S2, p2.isTypedArray = Ro, p2.isUndefined = function(t3) {
        return t3 === Wi;
      }, p2.isWeakMap = function(t3) {
        return W(t3) && j(t3) == ka;
      }, p2.isWeakSet = function(t3) {
        return W(t3) && "[object WeakSet]" == n2(t3);
      }, p2.join = function(t3, e3) {
        return null == t3 ? "" : _t.call(t3, e3);
      }, p2.kebabCase = ui, p2.last = r2, p2.lastIndexOf = function(t3, e3, n3) {
        var r3 = null == t3 ? 0 : t3.length;
        if (!r3)
          return -1;
        var o3 = r3;
        if (n3 !== Wi && (o3 = (o3 = B2(n3)) < 0 ? w2(r3 + o3, 0) : C2(o3, r3 - 1)), e3 != e3)
          return Nu(t3, $u, o3, true);
        for (var i3 = t3, a3 = e3, u3 = o3 + 1; u3--; )
          if (i3[u3] === a3)
            return u3;
        return u3;
      }, p2.lowerCase = ci, p2.lowerFirst = si, p2.lt = ko, p2.lte = Eo, p2.max = function(t3) {
        return t3 && t3.length ? ue(t3, R, ge) : Wi;
      }, p2.maxBy = function(t3, e3) {
        return t3 && t3.length ? ue(t3, f2(e3, 2), ge) : Wi;
      }, p2.mean = function(t3) {
        return Gu(t3, R);
      }, p2.meanBy = function(t3, e3) {
        return Gu(t3, f2(e3, 2));
      }, p2.min = function(t3) {
        return t3 && t3.length ? ue(t3, R, Te) : Wi;
      }, p2.minBy = function(t3, e3) {
        return t3 && t3.length ? ue(t3, f2(e3, 2), Te) : Wi;
      }, p2.stubArray = Ri, p2.stubFalse = ki, p2.stubObject = function() {
        return {};
      }, p2.stubString = function() {
        return "";
      }, p2.stubTrue = function() {
        return true;
      }, p2.multiply = ji, p2.nth = function(t3, e3) {
        return t3 && t3.length ? Ee(t3, B2(e3)) : Wi;
      }, p2.noConflict = function() {
        return ia._ === this && (ia._ = J), this;
      }, p2.noop = Di, p2.now = ro, p2.pad = function(t3, e3, n3) {
        t3 = h2(t3);
        var r3 = (e3 = B2(e3)) ? va(t3) : 0;
        return !e3 || e3 <= r3 ? t3 : Rn(pt(e3 = (e3 - r3) / 2), n3) + t3 + Rn(ht(e3), n3);
      }, p2.padEnd = function(t3, e3, n3) {
        t3 = h2(t3);
        var r3 = (e3 = B2(e3)) ? va(t3) : 0;
        return e3 && r3 < e3 ? t3 + Rn(e3 - r3, n3) : t3;
      }, p2.padStart = function(t3, e3, n3) {
        t3 = h2(t3);
        var r3 = (e3 = B2(e3)) ? va(t3) : 0;
        return e3 && r3 < e3 ? Rn(e3 - r3, n3) + t3 : t3;
      }, p2.parseInt = function(t3, e3, n3) {
        return e3 = n3 || null == e3 ? 0 : e3 && +e3, xt(h2(t3).replace(ou, ""), e3 || 0);
      }, p2.random = function(t3, e3, n3) {
        var r3;
        return n3 && "boolean" != typeof n3 && d2(t3, e3, n3) && (e3 = n3 = Wi), n3 === Wi && ("boolean" == typeof e3 ? (n3 = e3, e3 = Wi) : "boolean" == typeof t3 && (n3 = t3, t3 = Wi)), t3 === Wi && e3 === Wi ? (t3 = 0, e3 = 1) : (t3 = Po(t3), e3 === Wi ? (e3 = t3, t3 = 0) : e3 = Po(e3)), e3 < t3 && (r3 = t3, t3 = e3, e3 = r3), n3 || t3 % 1 || e3 % 1 ? (r3 = mt(), C2(t3 + r3 * (e3 - t3 + Bu("1e-" + ((r3 + "").length - 1))), e3)) : je(t3, e3);
      }, p2.reduce = function(t3, e3, n3) {
        var r3 = M(t3) ? Wu : Zu, o3 = arguments.length < 3;
        return r3(t3, f2(e3, 4), n3, o3, oe);
      }, p2.reduceRight = function(t3, e3, n3) {
        var r3 = M(t3) ? Fu : Zu, o3 = arguments.length < 3;
        return r3(t3, f2(e3, 4), n3, o3, ie);
      }, p2.repeat = function(t3, e3, n3) {
        return e3 = (n3 ? d2(t3, e3, n3) : e3 === Wi) ? 1 : B2(e3), Xe(h2(t3), e3);
      }, p2.replace = function() {
        var t3 = arguments, e3 = h2(t3[0]);
        return t3.length < 3 ? e3 : e3.replace(t3[1], t3[2]);
      }, p2.result = function(t3, e3, n3) {
        var r3 = -1, o3 = (e3 = an(e3, t3)).length;
        for (o3 || (o3 = 1, t3 = Wi); ++r3 < o3; ) {
          var i3 = null == t3 ? Wi : t3[br(e3[r3])];
          i3 === Wi && (r3 = o3, i3 = n3), t3 = bo(i3) ? i3.call(t3) : i3;
        }
        return t3;
      }, p2.round = Xi, p2.runInContext = o2, p2.sample = function(t3) {
        return (M(t3) ? Vt : Me)(t3);
      }, p2.size = function(t3) {
        if (null == t3)
          return 0;
        if (l2(t3))
          return Oo(t3) ? va(t3) : t3.length;
        var e3 = j(t3);
        return e3 == Ji || e3 == ea ? t3.size : Se(t3).length;
      }, p2.snakeCase = li, p2.some = function(t3, e3, n3) {
        return (M(t3) ? Hu : Ne)(t3, f2(e3 = n3 && d2(t3, e3, n3) ? Wi : e3, 3));
      }, p2.sortedIndex = function(t3, e3) {
        return Ue(t3, e3);
      }, p2.sortedIndexBy = function(t3, e3, n3) {
        return $e(t3, e3, f2(n3, 2));
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
        return $e(t3, e3, f2(n3, 2), true);
      }, p2.sortedLastIndexOf = function(t3, e3) {
        if (null == t3 ? 0 : t3.length) {
          var n3 = Ue(t3, e3, true) - 1;
          if (X(t3[n3], e3))
            return n3;
        }
        return -1;
      }, p2.startCase = fi, p2.startsWith = function(t3, e3, n3) {
        return t3 = h2(t3), n3 = null == n3 ? 0 : te(B2(n3), 0, t3.length), e3 = s2(e3), t3.slice(n3, n3 + e3.length) == e3;
      }, p2.subtract = Mi, p2.sum = function(t3) {
        return t3 && t3.length ? Ku(t3, R) : 0;
      }, p2.sumBy = function(t3, e3) {
        return t3 && t3.length ? Ku(t3, f2(e3, 2)) : 0;
      }, p2.template = function(a3, t3, e3) {
        var u3, c3, n3 = p2.templateSettings;
        e3 && d2(a3, t3, e3) && (t3 = Wi), a3 = h2(a3), t3 = Mo({}, t3, n3, Mn);
        var r3 = L2(e3 = Mo({}, t3.imports, n3.imports, Mn)), o3 = tc(e3, r3), s3 = 0, n3 = t3.interpolate || wu, l3 = "__p += '", e3 = P((t3.escape || wu).source + "|" + n3.source + "|" + (n3 === Ja ? fu : wu).source + "|" + (t3.evaluate || wu).source + "|$", "g"), i3 = "//# sourceURL=" + (z.call(t3, "sourceURL") ? (t3.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++Su + "]") + "\n";
        if (a3.replace(e3, function(t4, e4, n4, r4, o4, i4) {
          return n4 = n4 || r4, l3 += a3.slice(s3, i4).replace(xu, ac), e4 && (u3 = true, l3 += "' +\n__e(" + e4 + ") +\n'"), o4 && (c3 = true, l3 += "';\n" + o4 + ";\n__p += '"), n4 && (l3 += "' +\n((__t = (" + n4 + ")) == null ? '' : __t) +\n'"), s3 = i4 + t4.length, t4;
        }), l3 += "';\n", n3 = z.call(t3, "variable") && t3.variable) {
          if (su.test(n3))
            throw new k("Invalid `variable` option passed into `_.template`");
        } else
          l3 = "with (obj) {\n" + l3 + "\n}\n";
        if (l3 = (c3 ? l3.replace(Ha, "") : l3).replace(Va, "$1").replace(Na, "$1;"), l3 = "function(" + (n3 || "obj") + ") {\n" + (n3 ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (u3 ? ", __e = _.escape" : "") + (c3 ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + l3 + "return __p\n}", (e3 = vi(function() {
          return E(r3, i3 + "return " + l3).apply(Wi, o3);
        })).source = l3, mo(e3))
          throw e3;
        return e3;
      }, p2.times = function(t3, e3) {
        if ((t3 = B2(t3)) < 1 || $i < t3)
          return [];
        for (var n3 = Gi, r3 = C2(t3, Gi), r3 = (e3 = f2(e3), t3 -= Gi, Ju(r3, e3)); ++n3 < t3; )
          e3(n3);
        return r3;
      }, p2.toFinite = Po, p2.toInteger = B2, p2.toLength = zo, p2.toLower = function(t3) {
        return h2(t3).toLowerCase();
      }, p2.toNumber = T2, p2.toSafeInteger = function(t3) {
        return t3 ? te(B2(t3), -$i, $i) : 0 === t3 ? t3 : 0;
      }, p2.toString = h2, p2.toUpper = function(t3) {
        return h2(t3).toUpperCase();
      }, p2.trim = function(t3, e3, n3) {
        return (t3 = h2(t3)) && (n3 || e3 === Wi) ? Qu(t3) : t3 && (e3 = s2(e3)) ? (n3 = ga(t3), t3 = ga(e3), cn(n3, nc(n3, t3), rc(n3, t3) + 1).join("")) : t3;
      }, p2.trimEnd = function(t3, e3, n3) {
        return (t3 = h2(t3)) && (n3 || e3 === Wi) ? t3.slice(0, lc(t3) + 1) : t3 && (e3 = s2(e3)) ? cn(n3 = ga(t3), 0, rc(n3, ga(e3)) + 1).join("") : t3;
      }, p2.trimStart = function(t3, e3, n3) {
        return (t3 = h2(t3)) && (n3 || e3 === Wi) ? t3.replace(ou, "") : t3 && (e3 = s2(e3)) ? cn(n3 = ga(t3), nc(n3, ga(e3))).join("") : t3;
      }, p2.truncate = function(t3, e3) {
        var n3, r3 = 30, o3 = "...", e3 = (I2(e3) && (n3 = "separator" in e3 ? e3.separator : n3, r3 = "length" in e3 ? B2(e3.length) : r3, o3 = "omission" in e3 ? s2(e3.omission) : o3), (t3 = h2(t3)).length);
        if ((e3 = ha(t3) ? (i3 = ga(t3)).length : e3) <= r3)
          return t3;
        if ((e3 = r3 - va(o3)) < 1)
          return o3;
        var i3, r3 = i3 ? cn(i3, 0, e3).join("") : t3.slice(0, e3);
        if (n3 === Wi)
          return r3 + o3;
        if (i3 && (e3 += r3.length - e3), To(n3)) {
          if (t3.slice(e3).search(n3)) {
            var a3, u3 = r3;
            for ((n3 = n3.global ? n3 : P(n3.source, h2(du.exec(n3)) + "g")).lastIndex = 0; a3 = n3.exec(u3); )
              var c3 = a3.index;
            r3 = r3.slice(0, c3 === Wi ? e3 : c3);
          }
        } else
          t3.indexOf(s2(n3), e3) == e3 || -1 < (i3 = r3.lastIndexOf(n3)) && (r3 = r3.slice(0, i3));
        return r3 + o3;
      }, p2.unescape = function(t3) {
        return (t3 = h2(t3)) && Ga.test(t3) ? t3.replace(Ua, fc) : t3;
      }, p2.uniqueId = function(t3) {
        var e3 = ++G;
        return h2(t3) + e3;
      }, p2.upperCase = di, p2.upperFirst = hi, p2.each = qr, p2.eachRight = Zr, p2.first = Tr, Ci(p2, (Yi = {}, fe(p2, function(t3, e3) {
        z.call(p2.prototype, e3) || (Yi[e3] = t3);
      }), Yi), { chain: false }), p2.VERSION = "4.17.21", ua(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(t3) {
        p2[t3].placeholder = p2;
      }), ua(["drop", "take"], function(n3, r3) {
        _2.prototype[n3] = function(t3) {
          t3 = t3 === Wi ? 1 : w2(B2(t3), 0);
          var e3 = this.__filtered__ && !r3 ? new _2(this) : this.clone();
          return e3.__filtered__ ? e3.__takeCount__ = C2(t3, e3.__takeCount__) : e3.__views__.push({ size: C2(t3, Gi), type: n3 + (e3.__dir__ < 0 ? "Right" : "") }), e3;
        }, _2.prototype[n3 + "Right"] = function(t3) {
          return this.reverse()[n3](t3).reverse();
        };
      }), ua(["filter", "map", "takeWhile"], function(t3, e3) {
        var n3 = e3 + 1, r3 = 1 == n3 || 3 == n3;
        _2.prototype[t3] = function(t4) {
          var e4 = this.clone();
          return e4.__iteratees__.push({ iteratee: f2(t4, 3), type: n3 }), e4.__filtered__ = e4.__filtered__ || r3, e4;
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
        return this.filter(R);
      }, _2.prototype.find = function(t3) {
        return this.filter(t3).head();
      }, _2.prototype.findLast = function(t3) {
        return this.reverse().find(t3);
      }, _2.prototype.invokeMap = a2(function(e3, n3) {
        return "function" == typeof e3 ? new _2(this) : this.map(function(t3) {
          return xe(t3, e3, n3);
        });
      }), _2.prototype.reject = function(t3) {
        return this.filter(fo(f2(t3)));
      }, _2.prototype.slice = function(t3, e3) {
        t3 = B2(t3);
        var n3 = this;
        return n3.__filtered__ && (0 < t3 || e3 < 0) ? new _2(n3) : (t3 < 0 ? n3 = n3.takeRight(-t3) : t3 && (n3 = n3.drop(t3)), e3 !== Wi ? (e3 = B2(e3)) < 0 ? n3.dropRight(-e3) : n3.take(e3 - t3) : n3);
      }, _2.prototype.takeRightWhile = function(t3) {
        return this.reverse().takeWhile(t3).reverse();
      }, _2.prototype.toArray = function() {
        return this.take(Gi);
      }, fe(_2.prototype, function(s3, t3) {
        var l3 = /^(?:filter|find|map|reject)|While$/.test(t3), f3 = /^(?:head|last)$/.test(t3), d3 = p2[f3 ? "take" + ("last" == t3 ? "Right" : "") : t3], h3 = f3 || /^find/.test(t3);
        d3 && (p2.prototype[t3] = function() {
          function t4(t5) {
            return t5 = d3.apply(p2, la([t5], r3)), f3 && u3 ? t5[0] : t5;
          }
          var e3, n3 = this.__wrapped__, r3 = f3 ? [1] : arguments, o3 = n3 instanceof _2, i3 = r3[0], a3 = o3 || M(n3), u3 = (a3 && l3 && "function" == typeof i3 && 1 != i3.length && (o3 = a3 = false), this.__chain__), i3 = !!this.__actions__.length, c3 = h3 && !u3, o3 = o3 && !i3;
          return !h3 && a3 ? (n3 = o3 ? n3 : new _2(this), (e3 = s3.apply(n3, r3)).__actions__.push({ func: Vr, args: [t4], thisArg: Wi }), new g2(e3, u3)) : c3 && o3 ? s3.apply(this, r3) : (e3 = this.thru(t4), c3 ? f3 ? e3.value()[0] : e3.value() : e3);
        });
      }), ua(["pop", "push", "shift", "sort", "splice", "unshift"], function(t3) {
        var n3 = H[t3], r3 = /^(?:push|sort|unshift)$/.test(t3) ? "tap" : "thru", o3 = /^(?:pop|shift)$/.test(t3);
        p2.prototype[t3] = function() {
          var t4, e3 = arguments;
          return o3 && !this.__chain__ ? (t4 = this.value(), n3.apply(M(t4) ? t4 : [], e3)) : this[r3](function(t5) {
            return n3.apply(M(t5) ? t5 : [], e3);
          });
        };
      }), fe(_2.prototype, function(t3, e3) {
        var n3, r3 = p2[e3];
        r3 && (n3 = r3.name + "", z.call(Tt, n3) || (Tt[n3] = []), Tt[n3].push({ name: e3, func: r3 }));
      }), Tt[Bn(Wi, 2).name] = [{ name: "wrapper", func: Wi }], _2.prototype.clone = function() {
        var t3 = new _2(this.__wrapped__);
        return t3.__actions__ = D2(this.__actions__), t3.__dir__ = this.__dir__, t3.__filtered__ = this.__filtered__, t3.__iteratees__ = D2(this.__iteratees__), t3.__takeCount__ = this.__takeCount__, t3.__views__ = D2(this.__views__), t3;
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
        }(0, o3, this.__views__), a3 = i3.start, u3 = (i3 = i3.end) - a3, c3 = r3 ? i3 : a3 - 1, s3 = this.__iteratees__, l3 = s3.length, f3 = 0, d3 = C2(u3, this.__takeCount__);
        if (!n3 || !r3 && o3 == u3 && d3 == u3)
          return tn(t3, this.__actions__);
        var h3 = [];
        t:
          for (; u3-- && f3 < d3; ) {
            for (var p3 = -1, v3 = t3[c3 += e3]; ++p3 < l3; ) {
              var g3 = s3[p3], _3 = g3.iteratee, g3 = g3.type, _3 = _3(v3);
              if (2 == g3)
                v3 = _3;
              else if (!_3) {
                if (1 == g3)
                  continue t;
                break t;
              }
            }
            h3[f3++] = v3;
          }
        return h3;
      }, p2.prototype.at = Nr, p2.prototype.chain = function() {
        return Hr(this);
      }, p2.prototype.commit = function() {
        return new g2(this.value(), this.__chain__);
      }, p2.prototype.next = function() {
        this.__values__ === Wi && (this.__values__ = Ao(this.value()));
        var t3 = this.__index__ >= this.__values__.length;
        return { done: t3, value: t3 ? Wi : this.__values__[this.__index__++] };
      }, p2.prototype.plant = function(t3) {
        for (var e3, n3 = this; n3 instanceof jt; )
          var r3 = Dr(n3), o3 = (r3.__index__ = 0, r3.__values__ = Wi, e3 ? o3.__wrapped__ = r3 : e3 = r3, r3), n3 = n3.__wrapped__;
        return o3.__wrapped__ = t3, e3;
      }, p2.prototype.reverse = function() {
        var t3 = this.__wrapped__;
        return t3 instanceof _2 ? (t3 = t3, (t3 = (t3 = this.__actions__.length ? new _2(this) : t3).reverse()).__actions__.push({ func: Vr, args: [Rr], thisArg: Wi }), new g2(t3, this.__chain__)) : this.thru(Rr);
      }, p2.prototype.toJSON = p2.prototype.valueOf = p2.prototype.value = function() {
        return tn(this.__wrapped__, this.__actions__);
      }, p2.prototype.first = p2.prototype.head, ut && (p2.prototype[ut] = function() {
        return this;
      }), p2;
    }();
    o ? ((o.exports = _a)._ = _a, r._ = _a) : ia._ = _a;
  }.call(commonjsGlobal);
}(lodash, lodash.exports);
const CancasSafeArea = 1e5, DPI = window.devicePixelRatio || 1, DEFAULT_CONFIG = { daubConfig: { lineWidth: 20, strokeStyle: "white" }, tagConfig: { fontSize: 20, showText: true, fillStyle: "rgba(242, 88, 85, 0.5)", textFillStyle: "rgba(255, 255, 255, 0.6)", hoverStrokeStyle: "#F25856", hoverLineWidth: 1, hoverLineDash: [5], highlightStrokeStyle: "yellow", highlightLineWidth: 2, highlightLineDash: [5], customDraw() {
} }, layerConfig: { fillStyle: "rgba(0, 0, 0, 0.6)" }, cropConfig: { lineDash: [], strokeStyle: "rgba(255, 255, 255, 1)", lineWidth: 2, customDraw() {
} }, dotConfig: { lineDash: [], lineWidth: 2, strokeStyle: "transparent", hoverFillStyle: "#69B1FF", fillStyle: "#24FF6E", radius: 50 } }, defaultWH = { width: 0, height: 0 }, defaultPoint = { x: void 0, y: void 0 };
function clearCanvas(t) {
  t.clearRect(-CancasSafeArea / 2, -CancasSafeArea / 2, CancasSafeArea, CancasSafeArea);
}
function loadImage(t, e) {
  let n = new Image();
  return e && (n.crossOrigin = "anonymous"), n.src = t, new Promise((t2, e2) => {
    n.complete ? t2(n) : (n.onload = function() {
      t2(n);
    }, n.onerror = function() {
      e2("\u56FE\u7247\u52A0\u8F7D\u5931\u8D25:" + n.src);
    });
  });
}
function drawImage(t, e, n, r, o, i) {
  t.imageSmoothingEnabled = true, t.imageSmoothingQuality = "high", t.drawImage(e, n, r, o, i);
}
function drawLayerBg(t, e) {
  t.fillStyle = e.layerConfig.fillStyle, t.fillRect(-CancasSafeArea / 2, -CancasSafeArea / 2, CancasSafeArea, CancasSafeArea);
}
function drawLayerImageData(t, e, n, r, o) {
  t.clearRect(e, n, r, o);
}
function drawLayerBorder(t, e, n, r, o, i, a) {
  i = lodash.exports.cloneDeep(i.cropConfig);
  a && a.cropConfig && Object.assign(i, a.cropConfig), t.setLineDash(i.lineDash), t.strokeStyle = i.strokeStyle, t.lineWidth = i.lineWidth, t.strokeRect(e, n, r, o);
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
    if ("Number" === o)
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
function drawCropRect(t, e, n, r, o, i, a) {
  a || (clearCanvas(t), drawLayerBg(t, i)), drawLayerImageData(t, e, n, r, o), drawLayerBorder(t, e, n, r, o, i);
}
function drawDuabPointList(n, r, t, o) {
  let i, a;
  r.forEach((t2, e) => {
    n && (i = r[e - 1] || t2, a = t2, n.beginPath(), n.lineJoin = "round", n.lineCap = "round", n.lineWidth = t2.lineWidth || o.daubConfig.lineWidth, n.strokeStyle = t2.strokeStyle || o.daubConfig.strokeStyle, n.moveTo(i._x || i.x, i._y || i.y), n.lineTo(a._x || a.x, a._y || a.y), n.stroke());
  });
}
function drawCropList(r, t, o, i, a, e) {
  e || (clearCanvas(r), drawLayerBg(r, i)), t.forEach((t2) => {
    var _a;
    let e2 = transfromBoxToRect(t2, t2.__scale, o), n = (a && (e2[0] += a.offsetX, e2[1] += a.offsetY), drawLayerImageData(r, ...e2), drawLayerBorder(r, ...e2, i, t2), lodash.exports.cloneDeep(i.cropConfig));
    t2 && t2.cropConfig && Object.assign(n, t2.cropConfig), (_a = n.customDraw) == null ? void 0 : _a.call(n, r, { target: t2, positions: e2 });
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
  if (void 0 !== (i = n < r ? { startX: Math.max(t.info.startX, e.info.startX), endX: Math.min(t.info.endX, e.info.endX) } : i) && void 0 !== o)
    return Object.assign(o, i);
}
function transfromDotToArc(t, e = 1, n = { x: 0, y: 0 }, r, o) {
  return [t.x * e + n.x + ((o == null ? void 0 : o.offsetX) || 0), t.y * e + n.y + ((o == null ? void 0 : o.offsetY) || 0), r * e, 0, 2 * Math.PI];
}
function transfromBoxToRect(t, e = 1, n = { x: 0, y: 0 }) {
  var t = fixBoxInfo(t), { startX: r, startY: o } = t.info, i = t.position[2], t = t.position[3];
  return [r * e + n.x, o * e + n.y, i * e, t * e];
}
function isBoxValidity(t) {
  t = transfromBoxToRect(t);
  return 5 <= t[2] && 5 <= t[3];
}
function drawTagRect(t, e, n, r, o, i, a, u, c, s, l, f, d) {
  let h = lodash.exports.cloneDeep(i.tagConfig);
  if (f && Object.assign(h, f), t.font = h.fontSize + "px sans-serif", u || c) {
    !c || u && "move" === u.type || (t.fillStyle = h.fillStyle, t.fillRect(e, n, r, o), a && h.showText && (i = parseFloat(t.font.split(" ")[0]), t.fillStyle = h.textFillStyle, t.fillText(l || a + "", e + 4, n + o / 2 + i / 2))), s && (t.strokeStyle = h.highlightStrokeStyle, t.lineWidth = h.highlightLineWidth, t.setLineDash(h.highlightLineDash), t.strokeRect(e, n, r, o));
    if (u && pointIsInRect(u, [e, n, r, o])) {
      if ("click" === u.type)
        return { isShow: c = !c, isCrash: true };
      "move" !== u.type || c || (t.strokeStyle = h.hoverStrokeStyle, t.lineWidth = h.hoverLineWidth, t.setLineDash(h.hoverLineDash), t.strokeRect(e, n, r, o));
    }
    h.customDraw(t, { target: d, positions: [e, n, r, o] });
  }
}
function drawTagList(r, t, o, i, a = { offsetX: 0, offsetY: 0 }, u) {
  let c = false, s = [];
  return t.forEach((t2) => {
    let e = transfromBoxToRect(t2, t2.__scale, o);
    e[0] += a.offsetX, e[1] += a.offsetY;
    var n = drawTagRect(r, ...e, i, (t2.__index || 0) + 1, u, t2.isShow, t2.showOutLine, t2.labelText, t2.tagConfig, t2);
    void 0 !== n && (t2.isShow = n.isShow, n.isCrash && (c = true, s.push(t2)));
  }), { isReDraw: c, redrawList: s };
}
function fixMoveRectPosition(t, e, n) {
  n = fixPoint({ x: t[0], y: t[1] }, e, n);
  return t[0] = n.x, t[1] = n.y, t[2] /= e / DPI, t[3] /= e / DPI, t;
}
function moveDrawCropRect(e, n, r, o, i, a, u, c) {
  if (void 0 !== n.x && void 0 !== r.x) {
    let t = fixMoveRectPosition(transfromTwoPoints2Rect(n, r), o, i);
    if (t[2] = amendDpi(t[2], void 0, true), t[3] = amendDpi(t[3], void 0, true), 5 < t[2] || 5 < t[3])
      return drawCropList(e, a, u, c), drawCropRect(e, ...t, c, true), t;
  }
}
function drawDotList(n, t, r, o, i, e) {
  t.forEach((t2) => {
    n.beginPath();
    var e2 = lodash.exports.cloneDeep(o.dotConfig), t2 = (t2.dotConfig && Object.assign(e2, t2.dotConfig), n.fillStyle = t2.__isHover ? e2.hoverFillStyle : e2.fillStyle, n.strokeStyle = e2.strokeStyle, n.lineWidth = e2.lineWidth, n.setLineDash(e2.lineDash), transfromDotToArc(t2, t2.__scale, r, e2.radius, i));
    n.arc(...t2), n.fill(), n.stroke();
  });
}
function getVertexPositionByTwoPoints(t, e) {
  return (t.x <= e.x ? "left" : "right") + "-" + (t.y <= e.y ? "top" : "bottom");
}
function getPointByBoxAndVertexPosition(t, e) {
  e = e.split("-");
  return { x: "left" === e[0] ? t.startX : t.endX, y: "top" === e[1] ? t.startY : t.endY };
}
function moveDrawTagRect(e, n, r, o, i, a, u, c) {
  if (void 0 !== n.x && void 0 !== r.x) {
    let t = fixMoveRectPosition(transfromTwoPoints2Rect(n, r), o, i);
    if (t[2] = amendDpi(t[2], void 0, true), t[3] = amendDpi(t[3], void 0, true), 5 < t[2] || 5 < t[3])
      return drawTagList(e, a, u, c), drawTagRect(e, ...t, c, a.length + 1, void 0, true, void 0, c.drawingText, void 0, void 0), t;
  }
}
function getTwoPointsOffsetInfo(t, e, n) {
  var r = transfromTwoPoints2Rect(t, e), o = (e.x - t.x) / n, e = (e.y - t.y) / n;
  let i = false;
  return { isStartMove: i = 5 < r[2] || 5 < r[3] ? true : i, offsetInfo: { offsetX: o, offsetY: e } };
}
function moveCanvas(t, e, n, r, o, i, a, u, c, s, l, f, d) {
  if (void 0 !== a.x && void 0 !== u.x) {
    a = getTwoPointsOffsetInfo(a, u, s);
    if (a.isStartMove)
      return { offsetX: u, offsetY: s } = a.offsetInfo, clearCanvas(t), drawImage(t, n, (t = { x: i.x + u, y: i.y + s }).x, t.y, r.width * o, r.height * o), drawCropList(e, c, i, d, a.offsetInfo), drawTagList(e, l, i, d, { offsetX: u, offsetY: s }), drawDotList(e, f, i, d, a.offsetInfo), { offsetX: u, offsetY: s };
  }
}
function fixPoint(t, e, n) {
  return { x: t.x / e + n.x, y: t.y / e + n.y };
}
function getTouchPoint(t, e, n, r) {
  t = fixPoint({ x: t.layerX, y: t.layerY }, e, n);
  return { x: t.x, y: t.y, type: r };
}
function moveDrawUnshowTagDashRect(e, t, i, a, u, c, s, l, n, f, d) {
  if ("tag" === t && !n) {
    let t2 = i.filter((t3) => !t3.isShow), n2 = false, r = getTouchPoint(s, a, c, "move"), o = [];
    t2.forEach((t3) => {
      var e2 = transfromBoxToRect(t3, t3.__scale, u);
      pointIsInRect(r, e2) && (o.push(t3), n2 = true);
    }), n2 ? (f = true, drawTagList(e, o, u, d, void 0, r)) : f && (drawCropList(e, l, u, d), drawTagList(e, i, u, d), f = false);
  }
  return f;
}
function getBoxFourBorderRect(t, e, n = -1, r) {
  t = transfromBoxToRect(t, t.__scale, e), e = null != r ? r : device.mobile() ? 6 * DPI : 6, r = e / 2;
  return [{ index: n, name: "left-top", type: "vertex", positions: [t[0] - r, t[1] - r, e, e] }, { index: n, name: "right-top", type: "vertex", positions: [t[0] + t[2] - r, t[1] - r, e, e] }, { index: n, name: "left-bottom", type: "vertex", positions: [t[0] - r, t[1] + t[3] - r, e, e] }, { index: n, name: "right-bottom", type: "vertex", positions: [t[0] + t[2] - r, t[1] + t[3] - r, e, e] }, { index: n, name: "left", type: "border", positions: [t[0] - r, t[1] + r, e, t[3] - r] }, { index: n, name: "top", type: "border", positions: [t[0] + r, t[1] - r, t[2] - r, e] }, { index: n, name: "right", type: "border", positions: [t[0] + t[2] - r, t[1] + r, e, t[3] - r] }, { index: n, name: "bottom", type: "border", positions: [t[0] + r, t[1] + t[3] - r, t[2] - r, e] }];
}
function pointIsInRectList(n, t) {
  let r = false, o = [], i = [];
  return t.forEach((t2, e) => {
    pointIsInRect(n, t2) && (r = true, o.push(t2), i.push(e));
  }), { hasIn: r, coverList: o, coverIndexList: i };
}
function detectEventIsTriggerOnBoxBorderOrVertex(t, e, n, r, o) {
  t = getTouchPoint(t, n, o, "move");
  let i = e.map((t2, e2) => getBoxFourBorderRect(t2, r, e2)).flat(), a = pointIsInRectList(t, i.map((t2) => t2.positions));
  return { hasIn: a.hasIn, list: a.coverIndexList.map((t2) => i[t2]) };
}
function findOneBorderOrVertex(t) {
  t = t.find((t2) => "vertex" === t2.type) || t[0];
  if (t)
    return t;
  throw new Error("findOneBorderOrVertex list may be empty.");
}
function moveDetectBoxBorderSetCursor(t, e, n, r, o, i, a) {
  a || ((a = detectEventIsTriggerOnBoxBorderOrVertex(e, n, r, o, i)).hasIn ? ("left-top" !== (e = findOneBorderOrVertex(a.list).name) && "right-bottom" !== e || (t.style.cursor = "nwse-resize"), "right-top" !== e && "left-bottom" !== e || (t.style.cursor = "nesw-resize"), "left" !== e && "right" !== e || (t.style.cursor = "col-resize"), "top" !== e && "bottom" !== e || (t.style.cursor = "row-resize")) : t.style.cursor = "auto");
}
function getResizeBoundingBoxInfo(t, e, n) {
  if (!n)
    return t;
  let r = lodash.exports.cloneDeep(t), o = n.name;
  var { offsetX: t, offsetY: n } = e;
  return o.includes("left") && (r.startX += t), o.includes("top") && (r.startY += n), o.includes("right") && (r.endX += t), o.includes("bottom") && (r.endY += n), r;
}
function moveResizeBox(t, e, n, r, o, i, a, u, c, s, l) {
  if (e && void 0 !== e.x && n && void 0 !== n.x) {
    var e = getTwoPointsOffsetInfo(e, n, i);
    if (e.isStartMove)
      return { offsetX: n, offsetY: i } = e.offsetInfo, e = transfromBoxToRect(getResizeBoundingBoxInfo(r, { offsetX: n / o, offsetY: i / o }, c), o, a), drawCropList(t, s, a, l), "crop" == l.mode && drawCropRect(t, ...e, l, true), drawTagList(t, u, a, l), "tag" == l.mode && drawTagRect(t, ...e, l, (r.__index || 0) + 1, void 0, r.isShow, r.showOutLine, r.labelText, r.tagConfig, void 0), e;
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
function initDotArrScale(t, n, r) {
  return t.map((t2, e) => (t2.__scale = n, t2.__index = e, transformDotPrecision(t2, r)));
}
function initDaubStackList(t, e, n) {
  return t.map((t2) => t2.map((t3) => ({ ...t3, _x: t3.x * n + e.x, _y: t3.y * n + e.y })));
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
  return "img" === t && (r.startX = r.startX + e.startX, r.startY = r.startY + e.startY, r.endX = r.endX + e.startX, r.endY = r.endY + e.startY), "crop" === t && (r.startX = r.startX - e.startX, r.startY = r.startY - e.startY, r.endX = r.endX - e.startX, r.endY = r.endY - e.startY), r;
}
function transformBoxPrecision(t, e) {
  return t.startX = numFixPrecision(t.startX, e), t.endX = numFixPrecision(t.endX, e), t.startY = numFixPrecision(t.startY, e), t.endY = numFixPrecision(t.endY, e), t;
}
function transformDotPrecision(t, e) {
  return t.x = numFixPrecision(t.x, e), t.y = numFixPrecision(t.y, e), t.raduis = numFixPrecision(t.raduis || 0, e), t;
}
function numFixPrecision(t, e) {
  return parseFloat(t.toFixed(e));
}
function pointInDot(t, e, n) {
  n = lodash.exports.cloneDeep(n.dotConfig), e.dotConfig && Object.assign(n, e.dotConfig), t = (t.x - e.x) ** 2 + (t.y - e.y) ** 2;
  return t <= n.radius ** 2;
}
var ImgMark_vue_vue_type_style_index_0_scoped_true_lang = "", _export_sfc = (t, e) => {
  const n = t.__vccOpts || t;
  for (var [r, o] of e)
    n[r] = o;
  return n;
};
const _withScopeId = (t) => (pushScopeId("data-v-2de84109"), t = t(), popScopeId(), t), _hoisted_1 = ["onTouchmove", "onTouchstart", "onTouchend"], _hoisted_2 = { key: 0, class: "mode-panel" }, _hoisted_3 = { class: "status" }, _hoisted_4 = { class: "text" }, _hoisted_5 = { class: "tip" }, _hoisted_6 = _withScopeId(() => createElementVNode("kbd", null, "Ctrl", -1)), _hoisted_7 = createTextVNode(" + "), _hoisted_8 = _withScopeId(() => createElementVNode("kbd", null, "B", -1)), _hoisted_9 = _withScopeId(() => createElementVNode("span", { style: { "font-size": "14px", "margin-left": "10px" } }, "\u5207\u6362\u6A21\u5F0F", -1)), _sfc_main = defineComponent({ props: { cropConfig: { default: () => DEFAULT_CONFIG.cropConfig }, daubConfig: { default: () => DEFAULT_CONFIG.daubConfig }, layerConfig: { default: () => DEFAULT_CONFIG.layerConfig }, tagConfig: { default: () => DEFAULT_CONFIG.tagConfig }, dotConfig: { default: () => DEFAULT_CONFIG.dotConfig }, drawingText: null, isShowTip: { type: Boolean, default: false }, enableScale: { type: Boolean, default: true }, enableMove: { type: Boolean, default: true }, enableDrawCrop: { type: Boolean, default: true }, enableDrawTag: { type: Boolean, default: true }, initScale: { type: Boolean, default: true }, enableInteractiveTagChangeStatus: { type: Boolean, default: true }, enableCropCross: { type: Boolean, default: false }, handleResizeCropCross: { default: "reset" }, enableInteractiveCropDelete: { type: Boolean, default: true }, enableCropResize: { type: Boolean, default: true }, enableTagResize: { type: Boolean, default: false }, enableDrawCropOutOfImg: { type: Boolean, default: true }, enableDrawTagOutOfCrop: { type: Boolean, default: true }, enableDrawTagOutOfImg: { type: Boolean, default: true }, isImgCrop: { type: Boolean, default: false }, isCropSingle: { type: Boolean, default: false }, cropList: { default: () => Array() }, tagList: { default: () => Array() }, daubStack: { default: () => Array() }, dotList: { default: () => Array() }, mode: { default: "crop" }, mobileOperation: { default: "move" }, src: null, precision: { default: 0 }, splitClickAndDoubleClickEvent: { type: Boolean, default: false }, disableDefaultShortcuts: { default: () => Array() }, customDrawTopCtx: null }, emits: ["update:cropList", "update:daubStack", "cropListChange", "update:tagList", "update:dotList", "tagListChange", "update:mode", "update:mobileOperation", "resizeStart", "resizeEnd", "delCrop", "drawCropStart", "drawTagStart", "mouseOverInfo", "onLoadImage"], setup(z, { expose: Y, emit: a }) {
  const u = z;
  let r = false, n = void 0, j = void 0, X = null, o = null, i = { last: { down: void 0, up: void 0 }, prev: { down: void 0, up: void 0 } };
  const M = device.mobile() ? 0.1 / DPI * 1.5 : 0.1;
  let W = M, F = false;
  function H() {
    o = null, F = false, W = M, O.resizeHovering = void 0;
  }
  let c = false, s = null, l = null, f, d = lodash.exports.cloneDeep(defaultWH), h = lodash.exports.cloneDeep(defaultWH), p = lodash.exports.cloneDeep(defaultPoint), v = lodash.exports.cloneDeep(defaultPoint), g = lodash.exports.cloneDeep(defaultPoint), V = { x: 0, y: 0 }, N = 0, _ = { x: 0, y: 0 }, y = { x: 0, y: 0 }, w = 1, x, t, U = 1, m, b = 1, C, D = [], I = [], S = [], B = [], T = computed(() => {
    let t2 = lodash.exports.cloneDeep(DEFAULT_CONFIG);
    return Object.assign(t2.cropConfig, u.cropConfig), Object.assign(t2.tagConfig, u.tagConfig), Object.assign(t2.layerConfig, u.layerConfig), Object.assign(t2.daubConfig, u.daubConfig), Object.assign(t2.dotConfig, u.dotConfig), t2.drawingText = u.drawingText, t2.mode = u.mode, t2;
  });
  let L = ref(), $ = ref(), G = ref(), O = { isScaleing: false, isDrawRecting: false, isMoving: false, resizeHovering: void 0, isMouseDown: () => void 0 !== p.x, isMouseUpDownPoints: () => void 0 !== p.x && void 0 !== v.x };
  const R = { dragCreatRectInterrupt() {
    ot();
  }, dragCreatOrResizeRect(t2) {
    var _a, _b;
    if (l && ("drawDot" == t2 && drawDotList(l, S, _, T.value), "drawCrop" == t2 && (u.isCropSingle && !O.isDrawRecting && (I = []), O.isDrawRecting || a("drawCropStart"), O.isDrawRecting = true, C = moveDrawCropRect(l, p, v, b, y, I, _, T.value), drawTagList(l, D, _, T.value), (_a = u.customDrawTopCtx) == null ? void 0 : _a.call(u, l, k)), "drawTag" == t2 && (O.isDrawRecting || a("drawTagStart"), O.isDrawRecting = true, drawCropList(l, I, _, T.value), C = moveDrawTagRect(l, p, v, b, y, D, _, T.value), (_b = u.customDrawTopCtx) == null ? void 0 : _b.call(u, l, k)), "resize" == t2)) {
      let t3 = { crop() {
        var _a2;
        u.enableCropResize && O.resizeHovering && l ? (o = I[O.resizeHovering.index || 0], O.resizeHovering && o && (O.isDrawRecting = true, C = moveResizeBox(l, p, v, o, o.__scale || 1, b, _, D, O.resizeHovering, I.filter((t4, e2) => {
          var _a3;
          return e2 !== ((_a3 = O.resizeHovering) == null ? void 0 : _a3.index);
        }), T.value), (_a2 = u.customDrawTopCtx) == null ? void 0 : _a2.call(u, l, k))) : R.move();
      }, tag() {
        var _a2;
        u.enableTagResize && O.resizeHovering && l ? (o = D[O.resizeHovering.index || 0], O.resizeHovering && o && (O.isDrawRecting = true, C = moveResizeBox(l, p, v, o, o.__scale || 1, b, _, D.filter((t4, e2) => {
          var _a3;
          return e2 !== ((_a3 = O.resizeHovering) == null ? void 0 : _a3.index);
        }), O.resizeHovering, I, T.value), (_a2 = u.customDrawTopCtx) == null ? void 0 : _a2.call(u, l, k))) : R.move();
      }, daub() {
      }, dot() {
      } };
      t3[u.mode]();
    }
  }, changeMode() {
    "tag" === u.mode ? a("update:mode", "crop") : a("update:mode", "tag");
  }, scale(t2, e2) {
    if (!f || !s || !l)
      throw new Error("can't find canvas ctx or img");
    O.isScaleing = true, s.translate(y.x, y.y), l.translate(y.x, y.y), y = { x: y.x - (e2.x / (b * t2) - e2.x / b), y: y.y - (e2.y / (b * t2) - e2.y / b) }, s.scale(t2, t2), l.scale(t2, t2), s.translate(-y.x, -y.y), l.translate(-y.x, -y.y), b *= t2, clearCanvas(s), clearCanvas(l), drawImage(s, f, _.x, _.y, h.width * w, h.height * w), E(), F = false, O.isScaleing = false;
  }, move() {
    var _a;
    if (u.enableMove && s && l && f && !O.isScaleing) {
      O.isMoving = true;
      let e2 = moveCanvas(s, l, f, h, w, _, p, v, I, b, D, S, T.value);
      (_a = u.customDrawTopCtx) == null ? void 0 : _a.call(u, l, (t2) => k(t2).map((t3) => (e2 && (t3[0] += e2.offsetX, t3[1] += e2.offsetY), t3))), e2 && (t = lodash.exports.cloneDeep(_)) && (t.x += e2.offsetX, t.y += e2.offsetY);
    }
  }, scrollIntoView(n2) {
    if (s && l && f) {
      var r2 = transfromBoxToRect(n2, w, _);
      n2.__scale = w;
      let t2 = lodash.exports.take(getBoxFourBorderRect(n2, _, void 0, 0), 4).map((t3) => {
        return { x: t3.positions[0] - y.x, y: t3.positions[1] - y.y };
      }), e2 = [0, 0, ((d == null ? void 0 : d.width) || 0) / b, ((d == null ? void 0 : d.height) || 0) / b];
      t2.every((t3) => !pointIsInRect(t3, e2)) && (_ = { x: _.x - r2[0] + y.x + (e2[2] - r2[2]) / 2, y: _.y - r2[1] + y.y + (e2[3] - r2[3]) / 2 }, clearCanvas(s), clearCanvas(l), drawImage(s, f, _.x, _.y, f.width * w, f.height * w), E());
    }
  }, hoverRect(t2) {
    if (l && (F = moveDrawUnshowTagDashRect(l, u.mode, D, b, _, y, t2, I, O.isScaleing, F, T.value), !r && (u.enableCropResize && "crop" === u.mode && moveDetectBoxBorderSetCursor(L.value, t2, I, b, _, y, O.isScaleing), u.enableTagResize && "tag" === u.mode && moveDetectBoxBorderSetCursor(L.value, t2, D, b, _, y, O.isScaleing), "dot" == u.mode))) {
      t2 = getTouchPoint(t2, b, y, "move");
      let e2 = { x: (t2.x - _.x) / w, y: (t2.y - _.y) / w, raduis: 0 };
      initDotArrScale([e2], w, u.precision), S.forEach((t3) => {
        pointInDot(e2, t3, T.value) ? (t3.__isHover = true, L.value.style.cursor = "pointer") : (t3.__isHover = false, L.value.style.cursor = "auto");
      }), drawDotList(l, S, _, T.value);
    }
  } }, q = { onMouseOverMove(t2) {
    device.mobile() ? this.onHoldMouseLeftBtnMove(t2) : O.isMouseDown() || device.mobile() ? "dot" === u.mode && !r || this.onHoldMouseLeftBtnMove(t2) : R.hoverRect(t2);
  }, onHoldMouseLeftBtnMove(t2) {
    var e2, n2;
    v = { x: t2.layerX, y: t2.layerY }, r ? this.onDrawSwitchOnStartDraw() : "daub" === u.mode ? O.isScaleing || (t2 = fixPoint(g, b, y), n2 = { x: (e2 = fixPoint(v, b, y)).x, y: e2.y, lineWidth: u.daubConfig.lineWidth, strokeStyle: u.daubConfig.strokeStyle }, l && (drawDuabPointList(l, [t2, e2], _, T.value), g = lodash.exports.cloneDeep(v), B[B.length - 1].push(n2))) : O.resizeHovering ? R.dragCreatOrResizeRect("resize") : R.move();
  }, onDoubleClick(e2) {
    if ("crop" === u.mode && u.enableInteractiveCropDelete && _t(pointIsInBoxList(e2, I, w, _).boxList), "tag" === u.mode) {
      let t2 = pointIsInBoxList(e2, D, w, _)["boxList"];
      t2.forEach((t3) => {
        var _a;
        (_a = t3 == null ? void 0 : t3.onDoubleClick) == null ? void 0 : _a.call(t3, "", t3);
      });
    }
  }, onCick(n2) {
    if ("dot" == u.mode) {
      var r2 = n2;
      let e2 = { x: (r2.x - _.x) / w, y: (r2.y - _.y) / w, raduis: 0 };
      initDotArrScale([e2], w, u.precision);
      r2 = S.filter((t2) => !pointInDot(e2, t2, T.value));
      return r2.length !== S.length ? (S = r2, void E()) : (S.push(e2), void R.dragCreatOrResizeRect("drawDot"));
    }
    if ("tag" === u.mode && l) {
      let t2 = pointIsInBoxList(n2, D, w, _)["boxList"];
      t2.forEach((t3) => {
        var _a;
        (_a = t3 == null ? void 0 : t3.onClick) == null ? void 0 : _a.call(t3, "", t3);
      }), u.enableInteractiveTagChangeStatus && (drawCropList(l, I, _, T.value), { isReDraw: r2, redrawList: n2 } = drawTagList(l, D, _, T.value, void 0, n2), r2 && (E(), at("statusChange", A(n2))));
    }
  }, onWheel(t2, e2, n2) {
    (u.enableScale || n2) && R.scale(t2, e2);
  }, onDrawSwitchOnStartDraw() {
    "dot" === u.mode ? R.move() : "crop" === u.mode ? u.enableDrawCrop && R.dragCreatOrResizeRect("drawCrop") : u.enableDrawTag && R.dragCreatOrResizeRect("drawTag");
  } }, e = { shiftMode() {
    R.changeMode();
  }, shiftDrawSwitch(t2) {
    nextTick(() => {
      "on" === t2 && ((u.enableDrawCrop && "crop" === u.mode || u.enableDrawTag && "tag" === u.mode) && (L.value.style.cursor = "crosshair"), O.isMouseDown() || (r = true)), "off" === t2 && (O.isMoving || O.resizeHovering || R.dragCreatRectInterrupt(), r = false);
    });
  }, init() {
    !async function() {
      if (H(), c = false, s = null, l = null, f = void 0, d = lodash.exports.cloneDeep(defaultWH), h = lodash.exports.cloneDeep(defaultWH), p = lodash.exports.cloneDeep(defaultPoint), v = lodash.exports.cloneDeep(defaultPoint), g = lodash.exports.cloneDeep(defaultPoint), _ = { x: 0, y: 0 }, y = { x: 0, y: 0 }, w = 1, x = void 0, t = void 0, U = 1, m = void 0, b = 1, C = void 0, D = [], I = [], await nextTick(), 1 < u.cropList.length) {
        let e2 = { startX: 1 / 0, startY: 1 / 0, endX: -1 / 0, endY: -1 / 0 };
        u.cropList.forEach((t2) => {
          t2 = fixBoxInfo(t2);
          t2.info.startX < e2.startX && (e2.startX = t2.info.startX), t2.info.startY < e2.startY && (e2.startY = t2.info.startY), t2.info.endX > e2.endX && (e2.endX = t2.info.endX), t2.info.endY > e2.endY && (e2.endY = t2.info.endY);
        }), x = e2;
      }
      return 1 == u.cropList.length && (x = u.cropList[0]), D = lodash.exports.cloneDeep(u.tagList), I = lodash.exports.cloneDeep(u.cropList), S = lodash.exports.cloneDeep(u.dotList), B = lodash.exports.cloneDeep(u.daubStack), J(), device.mobile() || (window.addEventListener("keydown", Z), window.addEventListener("keyup", K)), tt(), s = $.value.getContext("2d"), l = G.value.getContext("2d"), s && l ? (d = amendDpi(getElementWH(s.canvas))) ? (initCanvasWH(s, d), initCanvasWH(l, d), a("onLoadImage", { status: "loading" }), loadImage(u.src).then((t2) => {
        if (a("onLoadImage", { status: "success" }), !d || !s || !l)
          return Promise.reject("canvasWH or canvas var not has valid values.");
        if (f = t2, h = { width: f.width, height: f.height }, u.initScale) {
          var e2, n2, r2, o2, i2, t2 = initScale(d, f);
          if (w = U = t2.scale, x)
            return e2 = transfromBoxToRect(x, U, _), n2 = (d.width - 0.05 * d.width) / e2[2], r2 = (d.height - 0.05 * d.height) / e2[3], r2 = d.width / d.height > e2[2] / e2[3] ? r2 : n2, o2 = e2[0] + e2[2], i2 = e2[1] + e2[3], (r2 = r2) == n2 ? (_.x = (d.width - o2 * r2 - 0.05 * d.width / 2) / r2, _.y = ((d.height - e2[3] * r2) / 2 - e2[1] * r2) / r2) : (_.x = ((d.width - e2[2] * r2) / 2 - e2[0] * r2) / r2, _.y = (d.height - i2 * r2 - 0.05 * d.height / 2) / r2), I = initBoundingArrScale(I, w, u.precision), D = initBoundingArrScale(D, w, u.precision), S = initDotArrScale(S, w, u.precision), B = initDaubStackList(B, _, w), nt({ deltaY: 1, clientX: 0, clientY: 0, preventDefault() {
            }, stopPropagation() {
            }, __zoom: r2 }, true), true;
          "width" === t2.fit ? _.x = (d.width - h.width * w) / 2 : _.y = (d.height - h.height * w) / 2, x = { startX: 0, startY: 0, endX: 0 + h.width, endY: 0 + h.height }, u.isImgCrop && it("add", I = [x]);
        }
        return I = initBoundingArrScale(I, w, u.precision), D = initBoundingArrScale(D, w, u.precision), S = initDotArrScale(S, w, u.precision), B = initDaubStackList(B, _, w), drawImage(s, f, _.x, _.y, f.width * w, f.height * w), E(), true;
      }).catch((t2) => {
        a("onLoadImage", { status: "error", msg: JSON.stringify(t2) });
      })) : Promise.reject("Error: can't get canvas height and width.") : Promise.reject("Error: can't find canvas element.");
    }().then(() => {
      c = true;
    });
  }, resize() {
    requestAnimationFrame(() => {
      !async function() {
        if (Q(), await nextTick(), J(), s && l && f) {
          if (!(d = amendDpi(getElementWH(s.canvas))))
            return Promise.reject("Error: can't get canvas height and width.");
          initCanvasWH(s, d), initCanvasWH(l, d), s.scale(b, b), l.scale(b, b), s.translate(-y.x, -y.y), l.translate(-y.x, -y.y), drawImage(s, f, _.x, _.y, f.width * w, f.height * w), I = initBoundingArrScale(I, w, u.precision), D = initBoundingArrScale(D, w, u.precision), S = initDotArrScale(S, w, u.precision), E(), c = true;
        }
      }();
    });
  } };
  function Z(t2) {
    "Space" !== t2.code || u.disableDefaultShortcuts.includes("space") || (t2.target === document.body && t2.preventDefault(), e.shiftDrawSwitch("on"));
  }
  function K(t2) {
    if ("KeyB" === t2.code && t2.ctrlKey) {
      if (u.disableDefaultShortcuts.includes("ctrl+b"))
        return;
      e.shiftMode();
    }
    "Space" !== t2.code || u.disableDefaultShortcuts.includes("space") || e.shiftDrawSwitch("off");
  }
  function J() {
    var t2 = L.value.getBoundingClientRect();
    m = { top: t2.top, right: t2.right, bottom: t2.bottom, left: t2.left, width: t2.width, height: t2.height, x: t2.x, y: t2.y };
  }
  function Q() {
    o = null, c = false, d = lodash.exports.cloneDeep(defaultWH), p = lodash.exports.cloneDeep(defaultPoint), v = lodash.exports.cloneDeep(defaultPoint), g = lodash.exports.cloneDeep(defaultPoint), m = void 0;
  }
  function k(t2) {
    let e2 = initBoundingArrScale(t2, w, u.precision);
    return e2.map((t3) => transfromBoxToRect(t3, w, _));
  }
  function E() {
    var _a;
    l && (drawCropList(l, I, _, T.value), drawTagList(l, D, _, T.value), drawDotList(l, S, _, T.value), B.forEach((t2) => {
      l && drawDuabPointList(l, t2, _, T.value);
    }), (_a = u.customDrawTopCtx) == null ? void 0 : _a.call(u, l, k));
  }
  function tt() {
    device.mobile() && ("draw" === u.mobileOperation && e.shiftDrawSwitch("on"), "move" === u.mobileOperation && e.shiftDrawSwitch("off"));
  }
  function et() {
    e.resize();
  }
  function nt(t2, e2) {
    u.enableScale && (t2.stopPropagation(), t2.preventDefault());
    var n2, r2, o2;
    if (!m)
      throw new Error("can't find  containerInfo.");
    !c && !t2.__zoom || O.isDrawRecting || O.isMoving || (n2 = e2 ? 0 : (t2.clientX - m.left) * DPI, r2 = e2 ? 0 : (t2.clientY - m.top) * DPI, o2 = t2.deltaY < 0 ? 1 : -1, t2 = e2 ? t2.__zoom : Math.exp(o2 * W), b * t2 < 0.2 || q.onWheel(t2, { x: n2, y: r2 }, e2));
  }
  function rt(e2) {
    if (O.resizeHovering) {
      var n2;
      let t2 = { crop: { boxList: I, trigger: it, getBoxFunc: P }, tag: { boxList: D, trigger: at, getBoxFunc: A }, daub: { boxList: [], trigger: () => {
      }, getBoxFunc: () => [] }, dot: { boxList: [], trigger: () => {
      }, getBoxFunc: () => [] } }[u.mode];
      t2.boxList[O.resizeHovering.index] = e2, a("resizeEnd", { index: O.resizeHovering.index, box: e2 }), "tag" === u.mode && (n2 = getVertexPositionByTwoPoints(p, v), Object.assign(e2, { __oprateType: "resize", __vertexPosition: n2 })), t2.trigger("resize", t2.getBoxFunc([e2]));
    }
  }
  function ot() {
    if (c) {
      if (O.isMoving = false, t && (_ = lodash.exports.cloneDeep(t)), t = void 0, O.isMouseUpDownPoints() || "dot" === u.mode) {
        let t2 = { crop() {
          if (C) {
            let t3 = { ...o, ...transfromRect2Box(C, _, w) };
            o = null, O.resizeHovering ? !u.enableCropCross && getBoxIsIntersectWithBoxList(t3, I.filter((t4, e2) => {
              var _a;
              return e2 !== ((_a = O.resizeHovering) == null ? void 0 : _a.index);
            })) ? ("reset" === u.handleResizeCropCross && E(), "delete" === u.handleResizeCropCross && _t([I[O.resizeHovering.index]])) : rt(t3) : (t3 = initBoundingArrScale([t3], w, u.precision)[0], !u.enableCropCross && getBoxIsIntersectWithBoxList(t3, I) ? E() : (I.push(t3), it("add", P([t3])))), C = void 0;
          }
        }, tag() {
          var t3, e2;
          C && (t3 = { ...o, ...transfromRect2Box(C, _, w) }, o = null, O.resizeHovering ? rt(t3) : (t3 = getVertexPositionByTwoPoints(p, v), e2 = initBoundingArrScale([e2 = transfromRect2Box(C, _, w)], w, u.precision)[0], Object.assign(e2, { isShow: true, __oprateType: "add", __vertexPosition: t3 }), D.push(e2), at("add", A([e2]))), C = void 0);
        }, daub() {
          C = C && void 0;
          let t3 = lodash.exports.cloneDeep(B);
          a("update:daubStack", t3.map((t4) => t4.map((t5) => (null != t5._x && null != t5._y ? (delete t5._x, delete t5._y) : (t5.x = (t5.x - _.x) / w, t5.y = (t5.y - _.y) / w), t5))));
        }, dot() {
          setTimeout(() => {
            nextTick(() => {
              let t3 = lodash.exports.cloneDeep(S);
              a("update:dotList", t3.map((t4) => t4));
            });
          }, 300);
        } };
        t2[u.mode]();
      }
      O.resizeHovering = void 0, O.isDrawRecting = false, p = lodash.exports.cloneDeep(defaultPoint), v = lodash.exports.cloneDeep(defaultPoint), g = lodash.exports.cloneDeep(defaultPoint), L.value.style.cursor = "auto";
    }
  }
  function it(t2, e2) {
    var n2 = P(I);
    a("update:cropList", n2), a("cropListChange", { type: t2, list: e2 });
  }
  function at(t2, e2) {
    let n2 = { type: t2, list: e2 };
    if ("add" === t2) {
      let t3 = e2.filter((t4) => Reflect.get(t4, "__parentCrop"))[0];
      t3 && (n2.parentCrop = P([Reflect.get(t3, "__parentCrop")])[0], delete t3.__parentCrop);
    }
    a("tagListChange", n2);
    t2 = A(D);
    a("update:tagList", t2);
  }
  function A(t2) {
    let e2 = t2 || D, r2 = I, o2 = [];
    return e2.forEach((t3) => {
      let e3 = t3;
      if (!u.enableDrawTagOutOfCrop && e3.__oprateType && e3.__vertexPosition) {
        t3 = pointIsInBoxList(getPointByBoxAndVertexPosition(e3, e3.__vertexPosition), r2).boxList[0];
        if (!t3)
          return;
        var n2 = getTwoBoxIntersectPart(e3, t3);
        n2 && isBoxValidity(n2) ? (Object.assign(e3, n2), e3.__parentCrop = t3) : e3.__isValidity = false;
      }
      delete e3.__oprateType, Reflect.deleteProperty(e3, "__vertexPosition"), u.enableDrawTagOutOfCrop && !u.enableDrawTagOutOfImg && (t3 = { startX: 0, startY: 0, endX: (n2 = h).width, endY: n2.height }, (n2 = getTwoBoxIntersectPart(e3, t3)) && isBoxValidity(n2) ? Object.assign(e3, n2) : e3.__isValidity = false);
      t3 = fixBoxInfo(e3);
      o2.push(transformBoxPrecision(t3.info, u.precision));
    }), o2.filter((t3) => false !== t3.__isValidity);
  }
  function P(t2) {
    let e2 = t2 || I, n2 = e2.map((t3) => {
      let e3 = t3;
      u.enableDrawCropOutOfImg || (n3 = { startX: 0, startY: 0, endX: (n3 = h).width, endY: n3.height }, (n3 = getTwoBoxIntersectPart(e3, n3)) && isBoxValidity(n3) ? e3 = { ...t3, ...n3 } : e3._del = true), Reflect.deleteProperty(e3, "__vertexPosition");
      var n3, t3 = fixBoxInfo(e3);
      return transformBoxPrecision(t3.info, u.precision);
    });
    return n2.filter((t3) => !t3._del);
  }
  function ut(t2) {
    var e2;
    c && s && l && (e2 = new Date().getTime(), n = e2, i.prev.down ? i.last.down = e2 : i.prev.down = e2, e2 = amendDpi(e2 = { layerX: Reflect.get(t2, "layerX"), layerY: Reflect.get(t2, "layerY") }, ["layerX", "layerY"]), p = { x: e2.layerX, y: e2.layerY }, g = lodash.exports.cloneDeep(p), "daub" == u.mode && B.push([]), "crop" === u.mode && !r && u.enableCropResize && (t2 = detectEventIsTriggerOnBoxBorderOrVertex(e2, I, b, _, y)).hasIn && (O.resizeHovering = findOneBorderOrVertex(t2.list), a("resizeStart", { index: O.resizeHovering.index, box: I[O.resizeHovering.index] })), "tag" === u.mode && !r && u.enableTagResize && (t2 = detectEventIsTriggerOnBoxBorderOrVertex(e2, D, b, _, y)).hasIn && (O.resizeHovering = findOneBorderOrVertex(t2.list), a("resizeStart", { index: O.resizeHovering.index, box: D[O.resizeHovering.index] })));
  }
  onBeforeUnmount(() => {
    window.removeEventListener("resize", et), device.mobile() || (window.removeEventListener("keydown", Z), window.removeEventListener("keyup", K)), H();
  }), onMounted(() => {
    e.init(), window.addEventListener("resize", et);
  }), watch(() => u.mode, (t2) => {
    "tag" === t2 && (L.value.style.cursor = "auto");
  }), watch(() => u.src, (t2) => {
    t2 && e.init();
  }), watch(() => u.mobileOperation, (t2) => {
    c && tt();
  }), watch(() => u.tagList, (t2) => {
    c && (D = initBoundingArrScale(t2, w, u.precision), E());
  }, { deep: true }), watch(() => u.dotList, (t2) => {
    c && (S = initDotArrScale(t2, w, u.precision), E());
  }, { deep: true }), watch(() => u.daubStack, (t2) => {
    c && (B = initDaubStackList(lodash.exports.cloneDeep(u.daubStack), _, w), E());
  }, { deep: true }), watch(() => u.cropList, (t2) => {
    c && (I = initBoundingArrScale(t2, w, u.precision), E());
  });
  let ct = lodash.exports.throttle(function(e2) {
    if (e2) {
      e2 = getTouchPoint(e2, b, y, "over");
      let t2 = lodash.exports.cloneDeep(e2);
      t2.x -= _.x, t2.y -= _.y, t2.x /= w, t2.y /= w, a("mouseOverInfo", { canvas: e2, img: t2 });
    } else
      a("mouseOverInfo", { canvas: null, img: null });
  }, 100, { leading: false, trailing: true });
  function st(t2) {
    c && (t2 = amendDpi(t2 = { layerX: Reflect.get(t2, "layerX"), layerY: Reflect.get(t2, "layerY") }, ["layerX", "layerY"]), j = new Date().getTime(), q.onMouseOverMove(t2), ct(t2));
  }
  function lt() {
    var t2;
    c && (t2 = new Date().getTime(), i.prev.up ? i.last.up = t2 : i.prev.up = t2, ot());
  }
  function ft() {
    c && (L.value.style.cursor = "auto", ot(), ct());
  }
  function dt() {
    X && clearTimeout(X), X = null;
  }
  function ht(e2) {
    if (J(), c) {
      let t2 = getTouchPoint(amendDpi({ layerX: Reflect.get(e2, "layerX"), layerY: Reflect.get(e2, "layerY") }, ["layerX", "layerY"]), b, y, "click");
      var e2 = j && n ? j - n : 0;
      n = void 0, j = void 0, 100 < e2 || (u.splitClickAndDoubleClickEvent ? (dt(), X = setTimeout(() => {
        q.onCick(t2), X = null;
      }, 230)) : q.onCick(t2), e2 = u.splitClickAndDoubleClickEvent ? 320 : 360, i.prev.up && i.prev.down && i.last.up && i.last.down && (i.last.up - i.prev.down < e2 ? (u.splitClickAndDoubleClickEvent && dt(), q.onDoubleClick(t2), i.prev.down = void 0, i.prev.up = void 0) : (i.prev.down = i.last.down, i.prev.up = i.last.up), i.last.down = void 0, i.last.up = void 0));
    }
  }
  function pt(t2) {
    J(), n = new Date().getTime();
    var e2 = t2.touches;
    if (1 === t2.touches.length && ut({ layerX: e2[0].clientX - ((m == null ? void 0 : m.left) || 0), layerY: e2[0].clientY - ((m == null ? void 0 : m.top) || 0) }), 2 == t2.touches.length) {
      if (!m)
        throw new Error("can't find  containerInfo.");
      getTwoFingerTouchListDistence(amendMobileTouchEventDpi(t2)), V = { x: (e2[0].clientX + e2[1].clientX) / 2, y: (e2[0].clientY + e2[1].clientY) / 2 };
    }
  }
  function vt(t2) {
    j = new Date().getTime();
    var e2 = t2.touches;
    if (1 === t2.touches.length && st({ layerX: e2[0].clientX - ((m == null ? void 0 : m.left) || 0), layerY: e2[0].clientY - ((m == null ? void 0 : m.top) || 0) }), 2 == t2.touches.length) {
      if (!m)
        throw new Error("can't find  containerInfo.");
      var { width: e2, height: t2 } = getTwoFingerTouchListDistence(amendMobileTouchEventDpi(t2)), e2 = getHypotenuseValue(e2, t2), t2 = -(e2 - N);
      N = e2, nt({ onTouchMove: true, deltaY: t2, preventDefault() {
      }, stopPropagation() {
      }, clientX: V.x, clientY: V.y });
    }
  }
  function gt(t2) {
    lt();
  }
  function _t(r2) {
    if (0 !== r2.length) {
      let t2 = [], n2 = [], e2 = P();
      e2.forEach((e3) => {
        (r2.find((t3) => {
          t3 = fixBoxInfo(t3).info;
          return t3.startX === e3.startX && t3.endX === e3.endX && t3.startY === e3.startY && t3.endY === e3.endY;
        }) ? n2 : t2).push(e3);
      }), I = initBoundingArrScale(t2, w, u.precision), a("delCrop", n2), E(), it("delete", P(n2));
    }
  }
  return Y({ render: E, removeTagItems: function(n2) {
    let r2 = [], o2 = [];
    if (0 !== n2.length) {
      let t2 = A();
      t2.forEach((e2) => {
        (n2.find((t3) => {
          t3 = fixBoxInfo(t3).info;
          return t3.startX === e2.startX && t3.endX === e2.endX && t3.startY === e2.startY && t3.endY === e2.endY;
        }) ? o2 : r2).push(e2);
      });
    }
    D = initBoundingArrScale(r2, w, u.precision), E(), at("delete", o2);
  }, getTagListGroupByCropIndex: function(n2 = "startPoint") {
    let t2 = A(), r2 = P();
    return t2.forEach((t3) => {
      var e2;
      "startPoint" === n2 && (e2 = pointIsInBoxList({ x: t3.startX, y: t3.startY }, r2), t3.__groupIndex = e2.indexList[0]), "allIn" === n2 && (e2 = boxAllInBoxList(t3, r2), t3.__groupIndex = e2.indexList[0]);
    }), lodash.exports.groupBy(t2, "__groupIndex");
  }, getBase64ImageData: async function(t2) {
    const n2 = document.createElement("canvas");
    n2.style.width = h.width + "px", n2.style.height = h.height + "px", n2.width = h.width, n2.height = h.height;
    let r2 = n2.getContext("2d");
    return loadImage(u.src, t2).then((t3) => {
      if (r2) {
        let e2 = { x: 0, y: 0 };
        return drawImage(r2, t3, 0, 0, t3.width, t3.height), drawCropList(r2, u.cropList, e2, T.value, void 0, true), drawTagList(r2, u.tagList, e2, T.value), u.daubStack.forEach((t4) => {
          r2 && drawDuabPointList(r2, t4, e2, T.value);
        }), n2.toDataURL("image/png");
      }
      throw new Error("ctx not exist");
    });
  }, hooks: e, scrollIntoView: R.scrollIntoView }), (t2, e2) => (openBlock(), createElementBlock("div", { class: "comp-ocr-img", ref_key: "containerRef", ref: L, onMousedown: ut, onMouseenter: J, onClick: ht, onMouseup: lt, onMousemove: st, onMouseout: ft, onMousewheel: nt, onTouchmove: withModifiers(vt, ["stop", "prevent"]), onTouchstart: withModifiers(pt, ["stop"]), onTouchend: withModifiers(gt, ["stop"]) }, [createElementVNode("canvas", { class: "canvas", ref_key: "canvasRef", ref: $ }, null, 512), createElementVNode("canvas", { class: "canvas2", ref_key: "canvas2Ref", ref: G }, null, 512), unref(u).isShowTip ? (openBlock(), createElementBlock("div", _hoisted_2, [createElementVNode("div", _hoisted_3, [createElementVNode("div", { class: normalizeClass(["circle", { crop: "crop" === z.mode, tag: "tag" === z.mode }]) }, null, 2), createElementVNode("div", _hoisted_4, toDisplayString("crop" === z.mode ? "\u88C1\u526A\u6A21\u5F0F" : "\u6807\u8BB0\u9519\u8BEF\u884C"), 1)]), createElementVNode("div", _hoisted_5, [renderSlot(t2.$slots, "tip", {}, () => [_hoisted_6, _hoisted_7, _hoisted_8, _hoisted_9], true)])])) : createCommentVNode("", true)], 40, _hoisted_1));
} });
var ImgMark = _export_sfc(_sfc_main, [["__scopeId", "data-v-2de84109"]]);
export { ImgMark, boxIsAllInOtherBox, transformTagBoxRelativeTo, transformTagListBoxRelativeTo };
