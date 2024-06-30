import { defineComponent, ref, watch, computed, onBeforeUnmount, onMounted, openBlock, createElementBlock, withModifiers, createElementVNode, unref, normalizeClass, toDisplayString, renderSlot, createCommentVNode, createTextVNode, nextTick, pushScopeId, popScopeId } from "vue";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
  return typeof e;
} : function(e) {
  return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
}, previousDevice = window.device, device = {}, changeOrientationList = [], documentElement = (window.device = device, window.document.documentElement), userAgent = window.navigator.userAgent.toLowerCase(), television = ["googletv", "viera", "smarttv", "internet.tv", "netcast", "nettv", "appletv", "boxee", "kylo", "roku", "dlnadoc", "pov_tv", "hbbtv", "ce-html"];
function includes(e, t) {
  return -1 !== e.indexOf(t);
}
function find(e) {
  return includes(userAgent, e);
}
function hasClass(e) {
  return documentElement.className.match(new RegExp(e, "i"));
}
function addClass(e) {
  var t;
  hasClass(e) || (t = documentElement.className.replace(/^\s+|\s+$/g, ""), documentElement.className = t + " " + e);
}
function removeClass(e) {
  hasClass(e) && (documentElement.className = documentElement.className.replace(" " + e, ""));
}
function handleOrientation() {
  device.landscape() ? (removeClass("portrait"), addClass("landscape"), walkOnChangeOrientationList("landscape")) : (removeClass("landscape"), addClass("portrait"), walkOnChangeOrientationList("portrait")), setOrientationCache();
}
function walkOnChangeOrientationList(e) {
  for (var t = 0; t < changeOrientationList.length; t++)
    changeOrientationList[t](e);
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
  var e = "MacIntel" === navigator.platform && 1 < navigator.maxTouchPoints;
  return find("ipad") || e;
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
  for (var e = 0; e < television.length; ) {
    if (find(television[e]))
      return true;
    e++;
  }
  return false;
}, device.portrait = function() {
  return screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? includes(screen.orientation.type, "portrait") : device.ios() && Object.prototype.hasOwnProperty.call(window, "orientation") ? 90 !== Math.abs(window.orientation) : 1 < window.innerHeight / window.innerWidth;
}, device.landscape = function() {
  return screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? includes(screen.orientation.type, "landscape") : device.ios() && Object.prototype.hasOwnProperty.call(window, "orientation") ? 90 === Math.abs(window.orientation) : window.innerHeight / window.innerWidth < 1;
}, device.noConflict = function() {
  return window.device = previousDevice, this;
}, device.ios() ? device.ipad() ? addClass("ios ipad tablet") : device.iphone() ? addClass("ios iphone mobile") : device.ipod() && addClass("ios ipod mobile") : device.macos() ? addClass("macos desktop") : device.android() ? device.androidTablet() ? addClass("android tablet") : addClass("android mobile") : device.blackberry() ? device.blackberryTablet() ? addClass("blackberry tablet") : addClass("blackberry mobile") : device.windows() ? device.windowsTablet() ? addClass("windows tablet") : device.windowsPhone() ? addClass("windows mobile") : addClass("windows desktop") : device.fxos() ? device.fxosTablet() ? addClass("fxos tablet") : addClass("fxos mobile") : device.meego() ? addClass("meego mobile") : device.nodeWebkit() ? addClass("node-webkit") : device.television() ? addClass("television") : device.desktop() && addClass("desktop"), device.cordova() && addClass("cordova"), device.onChangeOrientation = function(e) {
  "function" == typeof e && changeOrientationList.push(e);
};
var orientationEvent = "resize";
function findMatch(e) {
  for (var t = 0; t < e.length; t++)
    if (device[e[t]]())
      return e[t];
  return "unknown";
}
function setOrientationCache() {
  device.orientation = findMatch(["portrait", "landscape"]);
}
Object.prototype.hasOwnProperty.call(window, "onorientationchange") && (orientationEvent = "orientationchange"), window.addEventListener ? window.addEventListener(orientationEvent, handleOrientation, false) : window.attachEvent ? window.attachEvent(orientationEvent, handleOrientation) : window[orientationEvent] = handleOrientation, handleOrientation(), device.type = findMatch(["mobile", "tablet", "desktop"]), device.os = findMatch(["ios", "iphone", "ipad", "ipod", "android", "blackberry", "macos", "windows", "fxos", "meego", "television"]), setOrientationCache();
var commonjsGlobal = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, lodash = { exports: {} };
!function(L, O) {
  !function() {
    var Wi, Fi = "Expected a function", ya = "__lodash_hash_undefined__", wa = "__lodash_placeholder__", xa = 16, Hi = 32, Vi = 64, Ni = 128, ma = 256, Ui = 1 / 0, $i = 9007199254740991, ba = NaN, Gi = 4294967295, Ca = [["ary", Ni], ["bind", 1], ["bindKey", 2], ["curry", 8], ["curryRight", xa], ["flip", 512], ["partial", Hi], ["partialRight", Vi], ["rearg", ma]], qi = "[object Arguments]", Da = "[object Array]", Zi = "[object Boolean]", Ki = "[object Date]", Ia = "[object Error]", Sa = "[object Function]", Ba = "[object GeneratorFunction]", Ji = "[object Map]", Qi = "[object Number]", ea = "[object Object]", Ta = "[object Promise]", La = "[object RegExp]", ta = "[object Set]", Oa = "[object String]", Ra = "[object Symbol]", ka = "[object WeakMap]", Ea = "[object ArrayBuffer]", na = "[object DataView]", Aa = "[object Float32Array]", Pa = "[object Float64Array]", za = "[object Int8Array]", Ya = "[object Int16Array]", ja = "[object Int32Array]", Xa = "[object Uint8Array]", Ma = "[object Uint8ClampedArray]", Wa = "[object Uint16Array]", Fa = "[object Uint32Array]", Ha = /\b__p \+= '';/g, Va = /\b(__p \+=) '' \+/g, Na = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Ua = /&(?:amp|lt|gt|quot|#39);/g, $a = /[&<>"']/g, Ga = RegExp(Ua.source), qa = RegExp($a.source), Za = /<%-([\s\S]+?)%>/g, Ka = /<%([\s\S]+?)%>/g, Ja = /<%=([\s\S]+?)%>/g, Qa = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, eu = /^\w*$/, tu = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, nu = /[\\^$.*+?()[\]{}|]/g, ru = RegExp(nu.source), ou = /^\s+/, i = /\s/, iu = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, au = /\{\n\/\* \[wrapped with (.+)\] \*/, uu = /,? & /, cu = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, lu = /[()=,{}\[\]\/\s]/, su = /\\(\\)?/g, fu = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, du = /\w*$/, hu = /^[-+]0x[0-9a-f]+$/i, pu = /^0b[01]+$/i, vu = /^\[object .+?Constructor\]$/, gu = /^0o[0-7]+$/i, _u = /^(?:0|[1-9]\d*)$/, yu = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, wu = /($^)/, xu = /['\n\r\u2028\u2029\\]/g, a = "\\ud800-\\udfff", u = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff", c = "\\u2700-\\u27bf", e = "a-z\\xdf-\\xf6\\xf8-\\xff", t = "A-Z\\xc0-\\xd6\\xd8-\\xde", l = "\\ufe0e\\ufe0f", s = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", f = "['\u2019]", n = "[" + a + "]", d = "[" + s + "]", h = "[" + u + "]", p = "[" + c + "]", v = "[" + e + "]", s = "[^" + a + s + "\\d+" + c + e + t + "]", c = "\\ud83c[\\udffb-\\udfff]", e = "[^" + a + "]", g = "(?:\\ud83c[\\udde6-\\uddff]){2}", r = "[\\ud800-\\udbff][\\udc00-\\udfff]", t = "[" + t + "]", _ = "\\u200d", y = "(?:" + v + "|" + s + ")", s = "(?:" + t + "|" + s + ")", w = "(?:['\u2019](?:d|ll|m|re|s|t|ve))?", x = "(?:['\u2019](?:D|LL|M|RE|S|T|VE))?", m = "(?:" + h + "|" + c + ")?", b = "[" + l + "]?", b = b + m + ("(?:" + _ + "(?:" + [e, g, r].join("|") + ")" + b + m + ")*"), m = "(?:" + [p, g, r].join("|") + ")" + b, p = "(?:" + [e + h + "?", h, g, r, n].join("|") + ")", mu = RegExp(f, "g"), bu = RegExp(h, "g"), C = RegExp(c + "(?=" + c + ")|" + p + b, "g"), Cu = RegExp([t + "?" + v + "+" + w + "(?=" + [d, t, "$"].join("|") + ")", s + "+" + x + "(?=" + [d, t + y, "$"].join("|") + ")", t + "?" + y + "+" + w, t + "+" + x, "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", "\\d+", m].join("|"), "g"), D = RegExp("[" + _ + a + u + l + "]"), Du = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, Iu = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"], Su = -1, ra = {}, oa = (ra[Aa] = ra[Pa] = ra[za] = ra[Ya] = ra[ja] = ra[Xa] = ra[Ma] = ra[Wa] = ra[Fa] = true, ra[qi] = ra[Da] = ra[Ea] = ra[Zi] = ra[na] = ra[Ki] = ra[Ia] = ra[Sa] = ra[Ji] = ra[Qi] = ra[ea] = ra[La] = ra[ta] = ra[Oa] = ra[ka] = false, {}), I = (oa[qi] = oa[Da] = oa[Ea] = oa[na] = oa[Zi] = oa[Ki] = oa[Aa] = oa[Pa] = oa[za] = oa[Ya] = oa[ja] = oa[Ji] = oa[Qi] = oa[ea] = oa[La] = oa[ta] = oa[Oa] = oa[Ra] = oa[Xa] = oa[Ma] = oa[Wa] = oa[Fa] = true, oa[Ia] = oa[Sa] = oa[ka] = false, { "\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029" }), Bu = parseFloat, Tu = parseInt, e = "object" == typeof commonjsGlobal && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal, g = "object" == typeof self && self && self.Object === Object && self, ia = e || g || Function("return this")(), r = O && !O.nodeType && O, o = r && L && !L.nodeType && L, Lu = o && o.exports === r, S = Lu && e.process, n = function() {
      try {
        var e2 = o && o.require && o.require("util").types;
        return e2 ? e2 : S && S.binding && S.binding("util");
      } catch (e3) {
      }
    }(), Ou = n && n.isArrayBuffer, Ru = n && n.isDate, ku = n && n.isMap, Eu = n && n.isRegExp, Au = n && n.isSet, Pu = n && n.isTypedArray;
    function aa(e2, t2, n2) {
      switch (n2.length) {
        case 0:
          return e2.call(t2);
        case 1:
          return e2.call(t2, n2[0]);
        case 2:
          return e2.call(t2, n2[0], n2[1]);
        case 3:
          return e2.call(t2, n2[0], n2[1], n2[2]);
      }
      return e2.apply(t2, n2);
    }
    function zu(e2, t2, n2, r2) {
      for (var o2 = -1, i2 = null == e2 ? 0 : e2.length; ++o2 < i2; ) {
        var a2 = e2[o2];
        t2(r2, a2, n2(a2), e2);
      }
      return r2;
    }
    function ua(e2, t2) {
      for (var n2 = -1, r2 = null == e2 ? 0 : e2.length; ++n2 < r2 && false !== t2(e2[n2], n2, e2); )
        ;
      return e2;
    }
    function Yu(e2, t2) {
      for (var n2 = null == e2 ? 0 : e2.length; n2-- && false !== t2(e2[n2], n2, e2); )
        ;
      return e2;
    }
    function ju(e2, t2) {
      for (var n2 = -1, r2 = null == e2 ? 0 : e2.length; ++n2 < r2; )
        if (!t2(e2[n2], n2, e2))
          return false;
      return true;
    }
    function ca(e2, t2) {
      for (var n2 = -1, r2 = null == e2 ? 0 : e2.length, o2 = 0, i2 = []; ++n2 < r2; ) {
        var a2 = e2[n2];
        t2(a2, n2, e2) && (i2[o2++] = a2);
      }
      return i2;
    }
    function Xu(e2, t2) {
      return !!(null == e2 ? 0 : e2.length) && -1 < fa(e2, t2, 0);
    }
    function Mu(e2, t2, n2) {
      for (var r2 = -1, o2 = null == e2 ? 0 : e2.length; ++r2 < o2; )
        if (n2(t2, e2[r2]))
          return true;
      return false;
    }
    function la(e2, t2) {
      for (var n2 = -1, r2 = null == e2 ? 0 : e2.length, o2 = Array(r2); ++n2 < r2; )
        o2[n2] = t2(e2[n2], n2, e2);
      return o2;
    }
    function sa(e2, t2) {
      for (var n2 = -1, r2 = t2.length, o2 = e2.length; ++n2 < r2; )
        e2[o2 + n2] = t2[n2];
      return e2;
    }
    function Wu(e2, t2, n2, r2) {
      var o2 = -1, i2 = null == e2 ? 0 : e2.length;
      for (r2 && i2 && (n2 = e2[++o2]); ++o2 < i2; )
        n2 = t2(n2, e2[o2], o2, e2);
      return n2;
    }
    function Fu(e2, t2, n2, r2) {
      var o2 = null == e2 ? 0 : e2.length;
      for (r2 && o2 && (n2 = e2[--o2]); o2--; )
        n2 = t2(n2, e2[o2], o2, e2);
      return n2;
    }
    function Hu(e2, t2) {
      for (var n2 = -1, r2 = null == e2 ? 0 : e2.length; ++n2 < r2; )
        if (t2(e2[n2], n2, e2))
          return true;
      return false;
    }
    var B = qu("length");
    function Vu(e2, r2, t2) {
      var o2;
      return t2(e2, function(e3, t3, n2) {
        if (r2(e3, t3, n2))
          return o2 = t3, false;
      }), o2;
    }
    function Nu(e2, t2, n2, r2) {
      for (var o2 = e2.length, i2 = n2 + (r2 ? 1 : -1); r2 ? i2-- : ++i2 < o2; )
        if (t2(e2[i2], i2, e2))
          return i2;
      return -1;
    }
    function fa(e2, t2, n2) {
      if (t2 != t2)
        return Nu(e2, $u, n2);
      for (var r2 = e2, o2 = t2, i2 = n2 - 1, a2 = r2.length; ++i2 < a2; )
        if (r2[i2] === o2)
          return i2;
      return -1;
    }
    function Uu(e2, t2, n2, r2) {
      for (var o2 = n2 - 1, i2 = e2.length; ++o2 < i2; )
        if (r2(e2[o2], t2))
          return o2;
      return -1;
    }
    function $u(e2) {
      return e2 != e2;
    }
    function Gu(e2, t2) {
      var n2 = null == e2 ? 0 : e2.length;
      return n2 ? Ku(e2, t2) / n2 : ba;
    }
    function qu(t2) {
      return function(e2) {
        return null == e2 ? Wi : e2[t2];
      };
    }
    function T(t2) {
      return function(e2) {
        return null == t2 ? Wi : t2[e2];
      };
    }
    function Zu(e2, r2, o2, i2, t2) {
      return t2(e2, function(e3, t3, n2) {
        o2 = i2 ? (i2 = false, e3) : r2(o2, e3, t3, n2);
      }), o2;
    }
    function Ku(e2, t2) {
      for (var n2, r2 = -1, o2 = e2.length; ++r2 < o2; ) {
        var i2 = t2(e2[r2]);
        i2 !== Wi && (n2 = n2 === Wi ? i2 : n2 + i2);
      }
      return n2;
    }
    function Ju(e2, t2) {
      for (var n2 = -1, r2 = Array(e2); ++n2 < e2; )
        r2[n2] = t2(n2);
      return r2;
    }
    function Qu(e2) {
      return e2 && e2.slice(0, sc(e2) + 1).replace(ou, "");
    }
    function da(t2) {
      return function(e2) {
        return t2(e2);
      };
    }
    function ec(t2, e2) {
      return la(e2, function(e3) {
        return t2[e3];
      });
    }
    function tc(e2, t2) {
      return e2.has(t2);
    }
    function nc(e2, t2) {
      for (var n2 = -1, r2 = e2.length; ++n2 < r2 && -1 < fa(t2, e2[n2], 0); )
        ;
      return n2;
    }
    function rc(e2, t2) {
      for (var n2 = e2.length; n2-- && -1 < fa(t2, e2[n2], 0); )
        ;
      return n2;
    }
    var oc = T({ "\xC0": "A", "\xC1": "A", "\xC2": "A", "\xC3": "A", "\xC4": "A", "\xC5": "A", "\xE0": "a", "\xE1": "a", "\xE2": "a", "\xE3": "a", "\xE4": "a", "\xE5": "a", "\xC7": "C", "\xE7": "c", "\xD0": "D", "\xF0": "d", "\xC8": "E", "\xC9": "E", "\xCA": "E", "\xCB": "E", "\xE8": "e", "\xE9": "e", "\xEA": "e", "\xEB": "e", "\xCC": "I", "\xCD": "I", "\xCE": "I", "\xCF": "I", "\xEC": "i", "\xED": "i", "\xEE": "i", "\xEF": "i", "\xD1": "N", "\xF1": "n", "\xD2": "O", "\xD3": "O", "\xD4": "O", "\xD5": "O", "\xD6": "O", "\xD8": "O", "\xF2": "o", "\xF3": "o", "\xF4": "o", "\xF5": "o", "\xF6": "o", "\xF8": "o", "\xD9": "U", "\xDA": "U", "\xDB": "U", "\xDC": "U", "\xF9": "u", "\xFA": "u", "\xFB": "u", "\xFC": "u", "\xDD": "Y", "\xFD": "y", "\xFF": "y", "\xC6": "Ae", "\xE6": "ae", "\xDE": "Th", "\xFE": "th", "\xDF": "ss", "\u0100": "A", "\u0102": "A", "\u0104": "A", "\u0101": "a", "\u0103": "a", "\u0105": "a", "\u0106": "C", "\u0108": "C", "\u010A": "C", "\u010C": "C", "\u0107": "c", "\u0109": "c", "\u010B": "c", "\u010D": "c", "\u010E": "D", "\u0110": "D", "\u010F": "d", "\u0111": "d", "\u0112": "E", "\u0114": "E", "\u0116": "E", "\u0118": "E", "\u011A": "E", "\u0113": "e", "\u0115": "e", "\u0117": "e", "\u0119": "e", "\u011B": "e", "\u011C": "G", "\u011E": "G", "\u0120": "G", "\u0122": "G", "\u011D": "g", "\u011F": "g", "\u0121": "g", "\u0123": "g", "\u0124": "H", "\u0126": "H", "\u0125": "h", "\u0127": "h", "\u0128": "I", "\u012A": "I", "\u012C": "I", "\u012E": "I", "\u0130": "I", "\u0129": "i", "\u012B": "i", "\u012D": "i", "\u012F": "i", "\u0131": "i", "\u0134": "J", "\u0135": "j", "\u0136": "K", "\u0137": "k", "\u0138": "k", "\u0139": "L", "\u013B": "L", "\u013D": "L", "\u013F": "L", "\u0141": "L", "\u013A": "l", "\u013C": "l", "\u013E": "l", "\u0140": "l", "\u0142": "l", "\u0143": "N", "\u0145": "N", "\u0147": "N", "\u014A": "N", "\u0144": "n", "\u0146": "n", "\u0148": "n", "\u014B": "n", "\u014C": "O", "\u014E": "O", "\u0150": "O", "\u014D": "o", "\u014F": "o", "\u0151": "o", "\u0154": "R", "\u0156": "R", "\u0158": "R", "\u0155": "r", "\u0157": "r", "\u0159": "r", "\u015A": "S", "\u015C": "S", "\u015E": "S", "\u0160": "S", "\u015B": "s", "\u015D": "s", "\u015F": "s", "\u0161": "s", "\u0162": "T", "\u0164": "T", "\u0166": "T", "\u0163": "t", "\u0165": "t", "\u0167": "t", "\u0168": "U", "\u016A": "U", "\u016C": "U", "\u016E": "U", "\u0170": "U", "\u0172": "U", "\u0169": "u", "\u016B": "u", "\u016D": "u", "\u016F": "u", "\u0171": "u", "\u0173": "u", "\u0174": "W", "\u0175": "w", "\u0176": "Y", "\u0177": "y", "\u0178": "Y", "\u0179": "Z", "\u017B": "Z", "\u017D": "Z", "\u017A": "z", "\u017C": "z", "\u017E": "z", "\u0132": "IJ", "\u0133": "ij", "\u0152": "Oe", "\u0153": "oe", "\u0149": "'n", "\u017F": "s" }), ic = T({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" });
    function ac(e2) {
      return "\\" + I[e2];
    }
    function ha(e2) {
      return D.test(e2);
    }
    function uc(e2) {
      var n2 = -1, r2 = Array(e2.size);
      return e2.forEach(function(e3, t2) {
        r2[++n2] = [t2, e3];
      }), r2;
    }
    function cc(t2, n2) {
      return function(e2) {
        return t2(n2(e2));
      };
    }
    function pa(e2, t2) {
      for (var n2 = -1, r2 = e2.length, o2 = 0, i2 = []; ++n2 < r2; ) {
        var a2 = e2[n2];
        a2 !== t2 && a2 !== wa || (e2[n2] = wa, i2[o2++] = n2);
      }
      return i2;
    }
    function lc(e2) {
      var t2 = -1, n2 = Array(e2.size);
      return e2.forEach(function(e3) {
        n2[++t2] = e3;
      }), n2;
    }
    function va(e2) {
      return (ha(e2) ? function(e3) {
        var t2 = C.lastIndex = 0;
        for (; C.test(e3); )
          ++t2;
        return t2;
      } : B)(e2);
    }
    function ga(e2) {
      return ha(e2) ? e2.match(C) || [] : e2.split("");
    }
    function sc(e2) {
      for (var t2 = e2.length; t2-- && i.test(e2.charAt(t2)); )
        ;
      return t2;
    }
    var fc = T({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" });
    var _a = function o2(e2) {
      var b2 = (e2 = null == e2 ? ia : _a.defaults(ia.Object(), e2, _a.pick(ia, Iu))).Array, i2 = e2.Date, k = e2.Error, E = e2.Function, A = e2.Math, v2 = e2.Object, P = e2.RegExp, F = e2.String, y2 = e2.TypeError, H = b2.prototype, V = E.prototype, N = v2.prototype, U = e2["__core-js_shared__"], $ = V.toString, z = N.hasOwnProperty, G = 0, q = (V = /[^.]+$/.exec(U && U.keys && U.keys.IE_PROTO || "")) ? "Symbol(src)_1." + V : "", Z = N.toString, K = $.call(v2), J = ia._, Q = P("^" + $.call(z).replace(nu, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), V = Lu ? e2.Buffer : Wi, t2 = e2.Symbol, ee = e2.Uint8Array, te = V ? V.allocUnsafe : Wi, ne = cc(v2.getPrototypeOf, v2), re = v2.create, oe = N.propertyIsEnumerable, ie = H.splice, ae = t2 ? t2.isConcatSpreadable : Wi, ue = t2 ? t2.iterator : Wi, ce = t2 ? t2.toStringTag : Wi, le = function() {
        try {
          var e3 = Jn(v2, "defineProperty");
          return e3({}, "", {}), e3;
        } catch (e4) {
        }
      }(), se = e2.clearTimeout !== ia.clearTimeout && e2.clearTimeout, fe = i2 && i2.now !== ia.Date.now && i2.now, de = e2.setTimeout !== ia.setTimeout && e2.setTimeout, he = A.ceil, pe = A.floor, ve = v2.getOwnPropertySymbols, V = V ? V.isBuffer : Wi, ge = e2.isFinite, _e = H.join, ye = cc(v2.keys, v2), w2 = A.max, C2 = A.min, we = i2.now, xe = e2.parseInt, me = A.random, be = H.reverse, i2 = Jn(e2, "DataView"), Ce = Jn(e2, "Map"), De = Jn(e2, "Promise"), Ie = Jn(e2, "Set"), e2 = Jn(e2, "WeakMap"), Se = Jn(v2, "create"), Be = e2 && new e2(), Te = {}, Le = Cr(i2), Oe = Cr(Ce), Re = Cr(De), ke = Cr(Ie), Ee = Cr(e2), t2 = t2 ? t2.prototype : Wi, Ae = t2 ? t2.valueOf : Wi, Pe = t2 ? t2.toString : Wi;
      function p2(e3) {
        if (W(e3) && !M(e3) && !(e3 instanceof _2)) {
          if (e3 instanceof g2)
            return e3;
          if (z.call(e3, "__wrapped__"))
            return Dr(e3);
        }
        return new g2(e3);
      }
      var ze = function(e3) {
        if (!I2(e3))
          return {};
        if (re)
          return re(e3);
        Ye.prototype = e3;
        e3 = new Ye();
        return Ye.prototype = Wi, e3;
      };
      function Ye() {
      }
      function je() {
      }
      function g2(e3, t3) {
        this.__wrapped__ = e3, this.__actions__ = [], this.__chain__ = !!t3, this.__index__ = 0, this.__values__ = Wi;
      }
      function _2(e3) {
        this.__wrapped__ = e3, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = false, this.__iteratees__ = [], this.__takeCount__ = Gi, this.__views__ = [];
      }
      function Xe(e3) {
        var t3 = -1, n3 = null == e3 ? 0 : e3.length;
        for (this.clear(); ++t3 < n3; ) {
          var r3 = e3[t3];
          this.set(r3[0], r3[1]);
        }
      }
      function Me(e3) {
        var t3 = -1, n3 = null == e3 ? 0 : e3.length;
        for (this.clear(); ++t3 < n3; ) {
          var r3 = e3[t3];
          this.set(r3[0], r3[1]);
        }
      }
      function We(e3) {
        var t3 = -1, n3 = null == e3 ? 0 : e3.length;
        for (this.clear(); ++t3 < n3; ) {
          var r3 = e3[t3];
          this.set(r3[0], r3[1]);
        }
      }
      function Fe(e3) {
        var t3 = -1, n3 = null == e3 ? 0 : e3.length;
        for (this.__data__ = new We(); ++t3 < n3; )
          this.add(e3[t3]);
      }
      function Y(e3) {
        e3 = this.__data__ = new Me(e3);
        this.size = e3.size;
      }
      function He(e3, t3) {
        var n3, r3 = M(e3), o3 = !r3 && yo(e3), i3 = !r3 && !o3 && xo(e3), a3 = !r3 && !o3 && !i3 && Ro(e3), u3 = r3 || o3 || i3 || a3, c3 = u3 ? Ju(e3.length, F) : [], l3 = c3.length;
        for (n3 in e3)
          !t3 && !z.call(e3, n3) || u3 && ("length" == n3 || i3 && ("offset" == n3 || "parent" == n3) || a3 && ("buffer" == n3 || "byteLength" == n3 || "byteOffset" == n3) || or(n3, l3)) || c3.push(n3);
        return c3;
      }
      function Ve(e3) {
        var t3 = e3.length;
        return t3 ? e3[jt(0, t3 - 1)] : Wi;
      }
      function Ne(e3, t3) {
        return wr(D2(e3), et(t3, 0, e3.length));
      }
      function Ue(e3) {
        return wr(D2(e3));
      }
      function $e(e3, t3, n3) {
        (n3 === Wi || X(e3[t3], n3)) && (n3 !== Wi || t3 in e3) || Je(e3, t3, n3);
      }
      function Ge(e3, t3, n3) {
        var r3 = e3[t3];
        z.call(e3, t3) && X(r3, n3) && (n3 !== Wi || t3 in e3) || Je(e3, t3, n3);
      }
      function qe(e3, t3) {
        for (var n3 = e3.length; n3--; )
          if (X(e3[n3][0], t3))
            return n3;
        return -1;
      }
      function Ze(e3, r3, o3, i3) {
        return ot(e3, function(e4, t3, n3) {
          r3(i3, e4, o3(e4), n3);
        }), i3;
      }
      function Ke(e3, t3) {
        return e3 && gn(t3, L2(t3), e3);
      }
      function Je(e3, t3, n3) {
        "__proto__" == t3 && le ? le(e3, t3, { configurable: true, enumerable: true, value: n3, writable: true }) : e3[t3] = n3;
      }
      function Qe(e3, t3) {
        for (var n3 = -1, r3 = t3.length, o3 = b2(r3), i3 = null == e3; ++n3 < r3; )
          o3[n3] = i3 ? Wi : No(e3, t3[n3]);
        return o3;
      }
      function et(e3, t3, n3) {
        return e3 == e3 && (n3 !== Wi && (e3 = e3 <= n3 ? e3 : n3), t3 !== Wi && (e3 = t3 <= e3 ? e3 : t3)), e3;
      }
      function x2(n3, r3, o3, e3, t3, i3) {
        var a3, u3 = 1 & r3, c3 = 2 & r3, l3 = 4 & r3;
        if ((a3 = o3 ? t3 ? o3(n3, e3, t3, i3) : o3(n3) : a3) !== Wi)
          return a3;
        if (!I2(n3))
          return n3;
        var s3, e3 = M(n3);
        if (e3) {
          if (a3 = function(e4) {
            var t4 = e4.length, n4 = new e4.constructor(t4);
            t4 && "string" == typeof e4[0] && z.call(e4, "index") && (n4.index = e4.index, n4.input = e4.input);
            return n4;
          }(n3), !u3)
            return D2(n3, a3);
        } else {
          var f3 = j(n3), d3 = f3 == Sa || f3 == Ba;
          if (xo(n3))
            return sn(n3, u3);
          if (f3 == ea || f3 == qi || d3 && !t3) {
            if (a3 = c3 || d3 ? {} : nr(n3), !u3)
              return c3 ? (h3 = d3 = n3, h3 = (s3 = a3) && gn(h3, O2(h3), s3), gn(d3, er(d3), h3)) : (d3 = Ke(a3, s3 = n3), gn(s3, Qn(s3), d3));
          } else {
            if (!oa[f3])
              return t3 ? n3 : {};
            a3 = function(e4, t4, n4) {
              var r4 = e4.constructor;
              switch (t4) {
                case Ea:
                  return fn(e4);
                case Zi:
                case Ki:
                  return new r4(+e4);
                case na:
                  return function(e5, t5) {
                    t5 = t5 ? fn(e5.buffer) : e5.buffer;
                    return new e5.constructor(t5, e5.byteOffset, e5.byteLength);
                  }(e4, n4);
                case Aa:
                case Pa:
                case za:
                case Ya:
                case ja:
                case Xa:
                case Ma:
                case Wa:
                case Fa:
                  return dn(e4, n4);
                case Ji:
                  return new r4();
                case Qi:
                case Oa:
                  return new r4(e4);
                case La:
                  return function(e5) {
                    var t5 = new e5.constructor(e5.source, du.exec(e5));
                    return t5.lastIndex = e5.lastIndex, t5;
                  }(e4);
                case ta:
                  return new r4();
                case Ra:
                  return function(e5) {
                    return Ae ? v2(Ae.call(e5)) : {};
                  }(e4);
              }
            }(n3, f3, u3);
          }
        }
        var h3 = (i3 = i3 || new Y()).get(n3);
        if (h3)
          return h3;
        i3.set(n3, a3), Lo(n3) ? n3.forEach(function(e4) {
          a3.add(x2(e4, r3, o3, e4, n3, i3));
        }) : Io(n3) && n3.forEach(function(e4, t4) {
          a3.set(t4, x2(e4, r3, o3, t4, n3, i3));
        });
        var p3 = e3 ? Wi : (l3 ? c3 ? Un : Nn : c3 ? O2 : L2)(n3);
        return ua(p3 || n3, function(e4, t4) {
          p3 && (e4 = n3[t4 = e4]), Ge(a3, t4, x2(e4, r3, o3, t4, n3, i3));
        }), a3;
      }
      function tt(e3, t3, n3) {
        var r3 = n3.length;
        if (null == e3)
          return !r3;
        for (e3 = v2(e3); r3--; ) {
          var o3 = n3[r3], i3 = t3[o3], a3 = e3[o3];
          if (a3 === Wi && !(o3 in e3) || !i3(a3))
            return false;
        }
        return true;
      }
      function nt(e3, t3, n3) {
        if ("function" != typeof e3)
          throw new y2(Fi);
        return vr(function() {
          e3.apply(Wi, n3);
        }, t3);
      }
      function rt(e3, t3, n3, r3) {
        var o3 = -1, i3 = Xu, a3 = true, u3 = e3.length, c3 = [], l3 = t3.length;
        if (!u3)
          return c3;
        n3 && (t3 = la(t3, da(n3))), r3 ? (i3 = Mu, a3 = false) : 200 <= t3.length && (i3 = tc, a3 = false, t3 = new Fe(t3));
        e:
          for (; ++o3 < u3; ) {
            var s3 = e3[o3], f3 = null == n3 ? s3 : n3(s3), s3 = r3 || 0 !== s3 ? s3 : 0;
            if (a3 && f3 == f3) {
              for (var d3 = l3; d3--; )
                if (t3[d3] === f3)
                  continue e;
              c3.push(s3);
            } else
              i3(t3, f3, r3) || c3.push(s3);
          }
        return c3;
      }
      p2.templateSettings = { escape: Za, evaluate: Ka, interpolate: Ja, variable: "", imports: { _: p2 } }, (p2.prototype = je.prototype).constructor = p2, (g2.prototype = ze(je.prototype)).constructor = g2, (_2.prototype = ze(je.prototype)).constructor = _2, Xe.prototype.clear = function() {
        this.__data__ = Se ? Se(null) : {}, this.size = 0;
      }, Xe.prototype.delete = function(e3) {
        return e3 = this.has(e3) && delete this.__data__[e3], this.size -= e3 ? 1 : 0, e3;
      }, Xe.prototype.get = function(e3) {
        var t3, n3 = this.__data__;
        return Se ? (t3 = n3[e3]) === ya ? Wi : t3 : z.call(n3, e3) ? n3[e3] : Wi;
      }, Xe.prototype.has = function(e3) {
        var t3 = this.__data__;
        return Se ? t3[e3] !== Wi : z.call(t3, e3);
      }, Xe.prototype.set = function(e3, t3) {
        var n3 = this.__data__;
        return this.size += this.has(e3) ? 0 : 1, n3[e3] = Se && t3 === Wi ? ya : t3, this;
      }, Me.prototype.clear = function() {
        this.__data__ = [], this.size = 0;
      }, Me.prototype.delete = function(e3) {
        var t3 = this.__data__;
        return !((e3 = qe(t3, e3)) < 0) && (e3 == t3.length - 1 ? t3.pop() : ie.call(t3, e3, 1), --this.size, true);
      }, Me.prototype.get = function(e3) {
        var t3 = this.__data__;
        return (e3 = qe(t3, e3)) < 0 ? Wi : t3[e3][1];
      }, Me.prototype.has = function(e3) {
        return -1 < qe(this.__data__, e3);
      }, Me.prototype.set = function(e3, t3) {
        var n3 = this.__data__, r3 = qe(n3, e3);
        return r3 < 0 ? (++this.size, n3.push([e3, t3])) : n3[r3][1] = t3, this;
      }, We.prototype.clear = function() {
        this.size = 0, this.__data__ = { hash: new Xe(), map: new (Ce || Me)(), string: new Xe() };
      }, We.prototype.delete = function(e3) {
        return e3 = Zn(this, e3).delete(e3), this.size -= e3 ? 1 : 0, e3;
      }, We.prototype.get = function(e3) {
        return Zn(this, e3).get(e3);
      }, We.prototype.has = function(e3) {
        return Zn(this, e3).has(e3);
      }, We.prototype.set = function(e3, t3) {
        var n3 = Zn(this, e3), r3 = n3.size;
        return n3.set(e3, t3), this.size += n3.size == r3 ? 0 : 1, this;
      }, Fe.prototype.add = Fe.prototype.push = function(e3) {
        return this.__data__.set(e3, ya), this;
      }, Fe.prototype.has = function(e3) {
        return this.__data__.has(e3);
      }, Y.prototype.clear = function() {
        this.__data__ = new Me(), this.size = 0;
      }, Y.prototype.delete = function(e3) {
        var t3 = this.__data__, e3 = t3.delete(e3);
        return this.size = t3.size, e3;
      }, Y.prototype.get = function(e3) {
        return this.__data__.get(e3);
      }, Y.prototype.has = function(e3) {
        return this.__data__.has(e3);
      }, Y.prototype.set = function(e3, t3) {
        var n3 = this.__data__;
        if (n3 instanceof Me) {
          var r3 = n3.__data__;
          if (!Ce || r3.length < 199)
            return r3.push([e3, t3]), this.size = ++n3.size, this;
          n3 = this.__data__ = new We(r3);
        }
        return n3.set(e3, t3), this.size = n3.size, this;
      };
      var ot = wn(ft), it = wn(dt, true);
      function at(e3, r3) {
        var o3 = true;
        return ot(e3, function(e4, t3, n3) {
          return o3 = !!r3(e4, t3, n3);
        }), o3;
      }
      function ut(e3, t3, n3) {
        for (var r3 = -1, o3 = e3.length; ++r3 < o3; ) {
          var i3, a3, u3 = e3[r3], c3 = t3(u3);
          null != c3 && (i3 === Wi ? c3 == c3 && !S2(c3) : n3(c3, i3)) && (i3 = c3, a3 = u3);
        }
        return a3;
      }
      function ct(e3, r3) {
        var o3 = [];
        return ot(e3, function(e4, t3, n3) {
          r3(e4, t3, n3) && o3.push(e4);
        }), o3;
      }
      function c2(e3, t3, n3, r3, o3) {
        var i3 = -1, a3 = e3.length;
        for (n3 = n3 || rr, o3 = o3 || []; ++i3 < a3; ) {
          var u3 = e3[i3];
          0 < t3 && n3(u3) ? 1 < t3 ? c2(u3, t3 - 1, n3, r3, o3) : sa(o3, u3) : r3 || (o3[o3.length] = u3);
        }
        return o3;
      }
      var lt = xn(), st = xn(true);
      function ft(e3, t3) {
        return e3 && lt(e3, t3, L2);
      }
      function dt(e3, t3) {
        return e3 && st(e3, t3, L2);
      }
      function ht(t3, e3) {
        return ca(e3, function(e4) {
          return bo(t3[e4]);
        });
      }
      function pt(e3, t3) {
        for (var n3 = 0, r3 = (t3 = an(t3, e3)).length; null != e3 && n3 < r3; )
          e3 = e3[br(t3[n3++])];
        return n3 && n3 == r3 ? e3 : Wi;
      }
      function vt(e3, t3, n3) {
        t3 = t3(e3);
        return M(e3) ? t3 : sa(t3, n3(e3));
      }
      function n2(e3) {
        {
          if (null == e3)
            return e3 === Wi ? "[object Undefined]" : "[object Null]";
          if (ce && ce in v2(e3)) {
            var t3 = e3, n3 = z.call(t3, ce), r3 = t3[ce];
            try {
              t3[ce] = Wi;
              var o3 = true;
            } catch (e4) {
            }
            var i3 = Z.call(t3);
            return o3 && (n3 ? t3[ce] = r3 : delete t3[ce]), i3;
          }
          return Z.call(e3);
        }
      }
      function gt(e3, t3) {
        return t3 < e3;
      }
      function _t(e3, t3) {
        return null != e3 && z.call(e3, t3);
      }
      function yt(e3, t3) {
        return null != e3 && t3 in v2(e3);
      }
      function wt(e3, t3, n3) {
        for (var r3 = n3 ? Mu : Xu, o3 = e3[0].length, i3 = e3.length, a3 = i3, u3 = b2(i3), c3 = 1 / 0, l3 = []; a3--; ) {
          var s3 = e3[a3];
          a3 && t3 && (s3 = la(s3, da(t3))), c3 = C2(s3.length, c3), u3[a3] = !n3 && (t3 || 120 <= o3 && 120 <= s3.length) ? new Fe(a3 && s3) : Wi;
        }
        var s3 = e3[0], f3 = -1, d3 = u3[0];
        e:
          for (; ++f3 < o3 && l3.length < c3; ) {
            var h3 = s3[f3], p3 = t3 ? t3(h3) : h3, h3 = n3 || 0 !== h3 ? h3 : 0;
            if (!(d3 ? tc(d3, p3) : r3(l3, p3, n3))) {
              for (a3 = i3; --a3; ) {
                var v3 = u3[a3];
                if (!(v3 ? tc(v3, p3) : r3(e3[a3], p3, n3)))
                  continue e;
              }
              d3 && d3.push(p3), l3.push(h3);
            }
          }
        return l3;
      }
      function xt(e3, t3, n3) {
        t3 = null == (e3 = dr(e3, t3 = an(t3, e3))) ? e3 : e3[br(r2(t3))];
        return null == t3 ? Wi : aa(t3, e3, n3);
      }
      function mt(e3) {
        return W(e3) && n2(e3) == qi;
      }
      function bt(e3, t3, n3, r3, o3) {
        {
          if (e3 === t3)
            return true;
          if (null == e3 || null == t3 || !W(e3) && !W(t3))
            return e3 != e3 && t3 != t3;
          var i3 = bt, a3 = M(e3), u3 = M(t3), c3 = a3 ? Da : j(e3), u3 = u3 ? Da : j(t3), l3 = (c3 = c3 == qi ? ea : c3) == ea, s3 = (u3 = u3 == qi ? ea : u3) == ea, u3;
          if ((u3 = c3 == u3) && xo(e3)) {
            if (!xo(t3))
              return false;
            l3 = !(a3 = true);
          }
          if (u3 && !l3) {
            o3 = o3 || new Y();
            if (a3 || Ro(e3))
              return Hn(e3, t3, n3, r3, i3, o3);
            else {
              var f3 = e3;
              var d3 = t3;
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
                  return f3.byteLength == d3.byteLength && g3(new ee(f3), new ee(d3)) ? true : false;
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
                case ta:
                  var w3 = 1 & p3;
                  if (y3 = y3 || lc, f3.size != d3.size && !w3)
                    return false;
                  w3 = _3.get(f3);
                  if (w3)
                    return w3 == d3;
                  p3 |= 2, _3.set(f3, d3);
                  w3 = Hn(y3(f3), y3(d3), p3, v3, g3, _3);
                  return _3.delete(f3), w3;
                case Ra:
                  if (Ae)
                    return Ae.call(f3) == Ae.call(d3);
              }
              return false;
              return;
            }
          }
          if (!(1 & n3)) {
            a3 = l3 && z.call(e3, "__wrapped__"), c3 = s3 && z.call(t3, "__wrapped__");
            if (a3 || c3)
              return l3 = a3 ? e3.value() : e3, s3 = c3 ? t3.value() : t3, o3 = o3 || new Y(), i3(l3, s3, n3, r3, o3);
          }
          if (u3) {
            o3 = o3 || new Y();
            var x3 = e3, m3 = t3, b3 = n3, C3 = r3, D3 = i3, I3 = o3, S3 = 1 & b3, B3 = Nn(x3), T3 = B3.length, a3 = Nn(m3).length;
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
      function Ct(e3, t3, n3, r3) {
        var o3 = n3.length, i3 = o3, a3 = !r3;
        if (null == e3)
          return !i3;
        for (e3 = v2(e3); o3--; ) {
          var u3 = n3[o3];
          if (a3 && u3[2] ? u3[1] !== e3[u3[0]] : !(u3[0] in e3))
            return false;
        }
        for (; ++o3 < i3; ) {
          var c3 = (u3 = n3[o3])[0], l3 = e3[c3], s3 = u3[1];
          if (a3 && u3[2]) {
            if (l3 === Wi && !(c3 in e3))
              return false;
          } else {
            var f3, d3 = new Y();
            if (!((f3 = r3 ? r3(l3, s3, c3, e3, t3, d3) : f3) === Wi ? bt(s3, l3, 3, r3, d3) : f3))
              return false;
          }
        }
        return true;
      }
      function Dt(e3) {
        return !(!I2(e3) || (t3 = e3, q && q in t3)) && (bo(e3) ? Q : vu).test(Cr(e3));
        var t3;
      }
      function It(e3) {
        return "function" == typeof e3 ? e3 : null == e3 ? R : "object" == typeof e3 ? M(e3) ? Rt(e3[0], e3[1]) : Ot(e3) : Ti(e3);
      }
      function St(e3) {
        if (!cr(e3))
          return ye(e3);
        var t3, n3 = [];
        for (t3 in v2(e3))
          z.call(e3, t3) && "constructor" != t3 && n3.push(t3);
        return n3;
      }
      function Bt(e3) {
        if (!I2(e3)) {
          var t3 = e3, n3 = [];
          if (null != t3)
            for (var r3 in v2(t3))
              n3.push(r3);
          return n3;
        }
        var o3, i3 = cr(e3), a3 = [];
        for (o3 in e3)
          ("constructor" != o3 || !i3 && z.call(e3, o3)) && a3.push(o3);
        return a3;
      }
      function Tt(e3, t3) {
        return e3 < t3;
      }
      function Lt(e3, r3) {
        var o3 = -1, i3 = s2(e3) ? b2(e3.length) : [];
        return ot(e3, function(e4, t3, n3) {
          i3[++o3] = r3(e4, t3, n3);
        }), i3;
      }
      function Ot(t3) {
        var n3 = Kn(t3);
        return 1 == n3.length && n3[0][2] ? sr(n3[0][0], n3[0][1]) : function(e3) {
          return e3 === t3 || Ct(e3, t3, n3);
        };
      }
      function Rt(n3, r3) {
        return ir(n3) && lr(r3) ? sr(br(n3), r3) : function(e3) {
          var t3 = No(e3, n3);
          return t3 === Wi && t3 === r3 ? Uo(e3, n3) : bt(r3, t3, 3);
        };
      }
      function kt(v3, g3, _3, y3, w3) {
        v3 !== g3 && lt(g3, function(e3, t3) {
          var n3, r3, o3, i3, a3, u3, c3, l3, s3, f3, d3, h3, p3;
          w3 = w3 || new Y(), I2(e3) ? (r3 = g3, i3 = _3, a3 = kt, u3 = y3, c3 = w3, d3 = hr(n3 = v3, o3 = t3), h3 = hr(r3, o3), (p3 = c3.get(h3)) ? $e(n3, o3, p3) : (p3 = u3 ? u3(d3, h3, o3 + "", n3, r3, c3) : Wi, (r3 = p3 === Wi) && (l3 = M(h3), s3 = !l3 && xo(h3), f3 = !l3 && !s3 && Ro(h3), p3 = h3, l3 || s3 || f3 ? p3 = M(d3) ? d3 : m2(d3) ? D2(d3) : s3 ? sn(h3, !(r3 = false)) : f3 ? dn(h3, !(r3 = false)) : [] : Bo(h3) || yo(h3) ? yo(p3 = d3) ? p3 = Yo(d3) : I2(d3) && !bo(d3) || (p3 = nr(h3)) : r3 = false), r3 && (c3.set(h3, p3), a3(p3, h3, i3, u3, c3), c3.delete(h3)), $e(n3, o3, p3))) : (l3 = y3 ? y3(hr(v3, t3), e3, t3 + "", v3, g3, w3) : Wi, $e(v3, t3, l3 = l3 === Wi ? e3 : l3));
        }, O2);
      }
      function Et(e3, t3) {
        var n3 = e3.length;
        if (n3)
          return or(t3 += t3 < 0 ? n3 : 0, n3) ? e3[t3] : Wi;
      }
      function At(e3, r3, s3) {
        r3 = r3.length ? la(r3, function(t4) {
          return M(t4) ? function(e4) {
            return pt(e4, 1 === t4.length ? t4[0] : t4);
          } : t4;
        }) : [R];
        var o3 = -1;
        r3 = la(r3, da(f2()));
        var t3 = Lt(e3, function(t4, e4, n4) {
          return { criteria: la(r3, function(e5) {
            return e5(t4);
          }), index: ++o3, value: t4 };
        }), e3 = function(e4, t4) {
          for (var n4 = s3, r4 = -1, o4 = e4.criteria, i3 = t4.criteria, a3 = o4.length, u3 = n4.length; ++r4 < a3; ) {
            var c3 = hn(o4[r4], i3[r4]);
            if (c3) {
              if (u3 <= r4)
                return c3;
              var l3 = n4[r4];
              return c3 * ("desc" == l3 ? -1 : 1);
            }
          }
          return e4.index - t4.index;
        }, n3 = t3.length;
        for (t3.sort(e3); n3--; )
          t3[n3] = t3[n3].value;
        return t3;
      }
      function Pt(e3, t3, n3) {
        for (var r3 = -1, o3 = t3.length, i3 = {}; ++r3 < o3; ) {
          var a3 = t3[r3], u3 = pt(e3, a3);
          n3(u3, a3) && Ft(i3, an(a3, e3), u3);
        }
        return i3;
      }
      function zt(e3, t3, n3, r3) {
        var o3 = r3 ? Uu : fa, i3 = -1, a3 = t3.length, u3 = e3;
        for (e3 === t3 && (t3 = D2(t3)), n3 && (u3 = la(e3, da(n3))); ++i3 < a3; )
          for (var c3 = 0, l3 = t3[i3], s3 = n3 ? n3(l3) : l3; -1 < (c3 = o3(u3, s3, c3, r3)); )
            u3 !== e3 && ie.call(u3, c3, 1), ie.call(e3, c3, 1);
        return e3;
      }
      function Yt(e3, t3) {
        for (var n3 = e3 ? t3.length : 0, r3 = n3 - 1; n3--; ) {
          var o3, i3 = t3[n3];
          n3 != r3 && i3 === o3 || (or(o3 = i3) ? ie.call(e3, i3, 1) : Kt(e3, i3));
        }
      }
      function jt(e3, t3) {
        return e3 + pe(me() * (t3 - e3 + 1));
      }
      function Xt(e3, t3) {
        var n3 = "";
        if (!e3 || t3 < 1 || $i < t3)
          return n3;
        for (; t3 % 2 && (n3 += e3), (t3 = pe(t3 / 2)) && (e3 += e3), t3; )
          ;
        return n3;
      }
      function a2(e3, t3) {
        return gr(fr(e3, t3, R), e3 + "");
      }
      function Mt(e3) {
        return Ve(ri(e3));
      }
      function Wt(e3, t3) {
        e3 = ri(e3);
        return wr(e3, et(t3, 0, e3.length));
      }
      function Ft(e3, t3, n3, r3) {
        if (!I2(e3))
          return e3;
        for (var o3 = -1, i3 = (t3 = an(t3, e3)).length, a3 = i3 - 1, u3 = e3; null != u3 && ++o3 < i3; ) {
          var c3, l3 = br(t3[o3]), s3 = n3;
          if ("__proto__" === l3 || "constructor" === l3 || "prototype" === l3)
            return e3;
          o3 != a3 && (c3 = u3[l3], (s3 = r3 ? r3(c3, l3, u3) : Wi) === Wi && (s3 = I2(c3) ? c3 : or(t3[o3 + 1]) ? [] : {})), Ge(u3, l3, s3), u3 = u3[l3];
        }
        return e3;
      }
      var Ht = Be ? function(e3, t3) {
        return Be.set(e3, t3), e3;
      } : R, t2 = le ? function(e3, t3) {
        return le(e3, "toString", { configurable: true, enumerable: false, value: _i(t3), writable: true });
      } : R;
      function Vt(e3) {
        return wr(ri(e3));
      }
      function u2(e3, t3, n3) {
        for (var r3 = -1, o3 = e3.length, i3 = ((n3 = o3 < n3 ? o3 : n3) < 0 && (n3 += o3), o3 = n3 < (t3 = t3 < 0 ? o3 < -t3 ? 0 : o3 + t3 : t3) ? 0 : n3 - t3 >>> 0, t3 >>>= 0, b2(o3)); ++r3 < o3; )
          i3[r3] = e3[r3 + t3];
        return i3;
      }
      function Nt(e3, r3) {
        var o3;
        return ot(e3, function(e4, t3, n3) {
          return !(o3 = r3(e4, t3, n3));
        }), !!o3;
      }
      function Ut(e3, t3, n3) {
        var r3 = 0, o3 = null == e3 ? r3 : e3.length;
        if ("number" == typeof t3 && t3 == t3 && o3 <= 2147483647) {
          for (; r3 < o3; ) {
            var i3 = r3 + o3 >>> 1, a3 = e3[i3];
            null !== a3 && !S2(a3) && (n3 ? a3 <= t3 : a3 < t3) ? r3 = 1 + i3 : o3 = i3;
          }
          return o3;
        }
        return $t(e3, t3, R, n3);
      }
      function $t(e3, t3, n3, r3) {
        var o3 = 0, i3 = null == e3 ? 0 : e3.length;
        if (0 === i3)
          return 0;
        for (var a3 = (t3 = n3(t3)) != t3, u3 = null === t3, c3 = S2(t3), l3 = t3 === Wi; o3 < i3; ) {
          var s3 = pe((o3 + i3) / 2), f3 = n3(e3[s3]), d3 = f3 !== Wi, h3 = null === f3, p3 = f3 == f3, v3 = S2(f3), p3 = a3 ? r3 || p3 : l3 ? p3 && (r3 || d3) : u3 ? p3 && d3 && (r3 || !h3) : c3 ? p3 && d3 && !h3 && (r3 || !v3) : !h3 && !v3 && (r3 ? f3 <= t3 : f3 < t3);
          p3 ? o3 = s3 + 1 : i3 = s3;
        }
        return C2(i3, 4294967294);
      }
      function Gt(e3, t3) {
        for (var n3 = -1, r3 = e3.length, o3 = 0, i3 = []; ++n3 < r3; ) {
          var a3, u3 = e3[n3], c3 = t3 ? t3(u3) : u3;
          n3 && X(c3, a3) || (a3 = c3, i3[o3++] = 0 === u3 ? 0 : u3);
        }
        return i3;
      }
      function qt(e3) {
        return "number" == typeof e3 ? e3 : S2(e3) ? ba : +e3;
      }
      function l2(e3) {
        if ("string" == typeof e3)
          return e3;
        if (M(e3))
          return la(e3, l2) + "";
        if (S2(e3))
          return Pe ? Pe.call(e3) : "";
        var t3 = e3 + "";
        return "0" == t3 && 1 / e3 == -Ui ? "-0" : t3;
      }
      function Zt(e3, t3, n3) {
        var r3 = -1, o3 = Xu, i3 = e3.length, a3 = true, u3 = [], c3 = u3;
        if (n3)
          a3 = false, o3 = Mu;
        else if (200 <= i3) {
          var l3 = t3 ? null : Yn(e3);
          if (l3)
            return lc(l3);
          a3 = false, o3 = tc, c3 = new Fe();
        } else
          c3 = t3 ? [] : u3;
        e:
          for (; ++r3 < i3; ) {
            var s3 = e3[r3], f3 = t3 ? t3(s3) : s3, s3 = n3 || 0 !== s3 ? s3 : 0;
            if (a3 && f3 == f3) {
              for (var d3 = c3.length; d3--; )
                if (c3[d3] === f3)
                  continue e;
              t3 && c3.push(f3), u3.push(s3);
            } else
              o3(c3, f3, n3) || (c3 !== u3 && c3.push(f3), u3.push(s3));
          }
        return u3;
      }
      function Kt(e3, t3) {
        return null == (e3 = dr(e3, t3 = an(t3, e3))) || delete e3[br(r2(t3))];
      }
      function Jt(e3, t3, n3, r3) {
        return Ft(e3, t3, n3(pt(e3, t3)), r3);
      }
      function Qt(e3, t3, n3, r3) {
        for (var o3 = e3.length, i3 = r3 ? o3 : -1; (r3 ? i3-- : ++i3 < o3) && t3(e3[i3], i3, e3); )
          ;
        return n3 ? u2(e3, r3 ? 0 : i3, r3 ? i3 + 1 : o3) : u2(e3, r3 ? i3 + 1 : 0, r3 ? o3 : i3);
      }
      function en(e3, t3) {
        var n3 = e3;
        return Wu(t3, function(e4, t4) {
          return t4.func.apply(t4.thisArg, sa([e4], t4.args));
        }, n3 = e3 instanceof _2 ? e3.value() : n3);
      }
      function tn(e3, t3, n3) {
        var r3 = e3.length;
        if (r3 < 2)
          return r3 ? Zt(e3[0]) : [];
        for (var o3 = -1, i3 = b2(r3); ++o3 < r3; )
          for (var a3 = e3[o3], u3 = -1; ++u3 < r3; )
            u3 != o3 && (i3[o3] = rt(i3[o3] || a3, e3[u3], t3, n3));
        return Zt(c2(i3, 1), t3, n3);
      }
      function nn(e3, t3, n3) {
        for (var r3 = -1, o3 = e3.length, i3 = t3.length, a3 = {}; ++r3 < o3; ) {
          var u3 = r3 < i3 ? t3[r3] : Wi;
          n3(a3, e3[r3], u3);
        }
        return a3;
      }
      function rn(e3) {
        return m2(e3) ? e3 : [];
      }
      function on(e3) {
        return "function" == typeof e3 ? e3 : R;
      }
      function an(e3, t3) {
        return M(e3) ? e3 : ir(e3, t3) ? [e3] : mr(h2(e3));
      }
      var un = a2;
      function cn(e3, t3, n3) {
        var r3 = e3.length;
        return n3 = n3 === Wi ? r3 : n3, !t3 && r3 <= n3 ? e3 : u2(e3, t3, n3);
      }
      var ln = se || function(e3) {
        return ia.clearTimeout(e3);
      };
      function sn(e3, t3) {
        if (t3)
          return e3.slice();
        t3 = e3.length, t3 = te ? te(t3) : new e3.constructor(t3);
        return e3.copy(t3), t3;
      }
      function fn(e3) {
        var t3 = new e3.constructor(e3.byteLength);
        return new ee(t3).set(new ee(e3)), t3;
      }
      function dn(e3, t3) {
        t3 = t3 ? fn(e3.buffer) : e3.buffer;
        return new e3.constructor(t3, e3.byteOffset, e3.length);
      }
      function hn(e3, t3) {
        if (e3 !== t3) {
          var n3 = e3 !== Wi, r3 = null === e3, o3 = e3 == e3, i3 = S2(e3), a3 = t3 !== Wi, u3 = null === t3, c3 = t3 == t3, l3 = S2(t3);
          if (!u3 && !l3 && !i3 && t3 < e3 || i3 && a3 && c3 && !u3 && !l3 || r3 && a3 && c3 || !n3 && c3 || !o3)
            return 1;
          if (!r3 && !i3 && !l3 && e3 < t3 || l3 && n3 && o3 && !r3 && !i3 || u3 && n3 && o3 || !a3 && o3 || !c3)
            return -1;
        }
        return 0;
      }
      function pn(e3, t3, n3, r3) {
        for (var o3 = -1, i3 = e3.length, a3 = n3.length, u3 = -1, c3 = t3.length, l3 = w2(i3 - a3, 0), s3 = b2(c3 + l3), f3 = !r3; ++u3 < c3; )
          s3[u3] = t3[u3];
        for (; ++o3 < a3; )
          (f3 || o3 < i3) && (s3[n3[o3]] = e3[o3]);
        for (; l3--; )
          s3[u3++] = e3[o3++];
        return s3;
      }
      function vn(e3, t3, n3, r3) {
        for (var o3 = -1, i3 = e3.length, a3 = -1, u3 = n3.length, c3 = -1, l3 = t3.length, s3 = w2(i3 - u3, 0), f3 = b2(s3 + l3), d3 = !r3; ++o3 < s3; )
          f3[o3] = e3[o3];
        for (var h3 = o3; ++c3 < l3; )
          f3[h3 + c3] = t3[c3];
        for (; ++a3 < u3; )
          (d3 || o3 < i3) && (f3[h3 + n3[a3]] = e3[o3++]);
        return f3;
      }
      function D2(e3, t3) {
        var n3 = -1, r3 = e3.length;
        for (t3 = t3 || b2(r3); ++n3 < r3; )
          t3[n3] = e3[n3];
        return t3;
      }
      function gn(e3, t3, n3, r3) {
        for (var o3 = !n3, i3 = (n3 = n3 || {}, -1), a3 = t3.length; ++i3 < a3; ) {
          var u3 = t3[i3], c3 = r3 ? r3(n3[u3], e3[u3], u3, n3, e3) : Wi;
          (o3 ? Je : Ge)(n3, u3, c3 = c3 === Wi ? e3[u3] : c3);
        }
        return n3;
      }
      function _n(o3, i3) {
        return function(e3, t3) {
          var n3 = M(e3) ? zu : Ze, r3 = i3 ? i3() : {};
          return n3(e3, o3, f2(t3, 2), r3);
        };
      }
      function yn(u3) {
        return a2(function(e3, t3) {
          var n3 = -1, r3 = t3.length, o3 = 1 < r3 ? t3[r3 - 1] : Wi, i3 = 2 < r3 ? t3[2] : Wi, o3 = 3 < u3.length && "function" == typeof o3 ? (r3--, o3) : Wi;
          for (i3 && d2(t3[0], t3[1], i3) && (o3 = r3 < 3 ? Wi : o3, r3 = 1), e3 = v2(e3); ++n3 < r3; ) {
            var a3 = t3[n3];
            a3 && u3(e3, a3, n3, o3);
          }
          return e3;
        });
      }
      function wn(i3, a3) {
        return function(e3, t3) {
          if (null == e3)
            return e3;
          if (!s2(e3))
            return i3(e3, t3);
          for (var n3 = e3.length, r3 = a3 ? n3 : -1, o3 = v2(e3); (a3 ? r3-- : ++r3 < n3) && false !== t3(o3[r3], r3, o3); )
            ;
          return e3;
        };
      }
      function xn(c3) {
        return function(e3, t3, n3) {
          for (var r3 = -1, o3 = v2(e3), i3 = n3(e3), a3 = i3.length; a3--; ) {
            var u3 = i3[c3 ? a3 : ++r3];
            if (false === t3(o3[u3], u3, o3))
              break;
          }
          return e3;
        };
      }
      function mn(r3) {
        return function(e3) {
          var t3 = ha(e3 = h2(e3)) ? ga(e3) : Wi, n3 = t3 ? t3[0] : e3.charAt(0), t3 = t3 ? cn(t3, 1).join("") : e3.slice(1);
          return n3[r3]() + t3;
        };
      }
      function bn(t3) {
        return function(e3) {
          return Wu(pi(ai(e3).replace(mu, "")), t3, "");
        };
      }
      function Cn(r3) {
        return function() {
          var e3 = arguments;
          switch (e3.length) {
            case 0:
              return new r3();
            case 1:
              return new r3(e3[0]);
            case 2:
              return new r3(e3[0], e3[1]);
            case 3:
              return new r3(e3[0], e3[1], e3[2]);
            case 4:
              return new r3(e3[0], e3[1], e3[2], e3[3]);
            case 5:
              return new r3(e3[0], e3[1], e3[2], e3[3], e3[4]);
            case 6:
              return new r3(e3[0], e3[1], e3[2], e3[3], e3[4], e3[5]);
            case 7:
              return new r3(e3[0], e3[1], e3[2], e3[3], e3[4], e3[5], e3[6]);
          }
          var t3 = ze(r3.prototype), n3 = r3.apply(t3, e3);
          return I2(n3) ? n3 : t3;
        };
      }
      function Dn(i3, a3, u3) {
        var c3 = Cn(i3);
        return function e3() {
          for (var t3 = arguments.length, n3 = b2(t3), r3 = t3, o3 = qn(e3); r3--; )
            n3[r3] = arguments[r3];
          o3 = t3 < 3 && n3[0] !== o3 && n3[t3 - 1] !== o3 ? [] : pa(n3, o3);
          return (t3 -= o3.length) < u3 ? Pn(i3, a3, Bn, e3.placeholder, Wi, n3, o3, Wi, Wi, u3 - t3) : aa(this && this !== ia && this instanceof e3 ? c3 : i3, this, n3);
        };
      }
      function In(i3) {
        return function(e3, t3, n3) {
          var r3, o3 = v2(e3), t3 = (s2(e3) || (r3 = f2(t3, 3), e3 = L2(e3), t3 = function(e4) {
            return r3(o3[e4], e4, o3);
          }), i3(e3, t3, n3));
          return -1 < t3 ? o3[r3 ? e3[t3] : t3] : Wi;
        };
      }
      function Sn(c3) {
        return Vn(function(o3) {
          var i3 = o3.length, e3 = i3, t3 = g2.prototype.thru;
          for (c3 && o3.reverse(); e3--; ) {
            var n3 = o3[e3];
            if ("function" != typeof n3)
              throw new y2(Fi);
            t3 && !u3 && "wrapper" == Gn(n3) && (u3 = new g2([], true));
          }
          for (e3 = u3 ? e3 : i3; ++e3 < i3; )
            var r3 = Gn(n3 = o3[e3]), a3 = "wrapper" == r3 ? $n(n3) : Wi, u3 = a3 && ar(a3[0]) && 424 == a3[1] && !a3[4].length && 1 == a3[9] ? u3[Gn(a3[0])].apply(u3, a3[3]) : 1 == n3.length && ar(n3) ? u3[r3]() : u3.thru(n3);
          return function() {
            var e4 = arguments, t4 = e4[0];
            if (u3 && 1 == e4.length && M(t4))
              return u3.plant(t4).value();
            for (var n4 = 0, r4 = i3 ? o3[n4].apply(this, e4) : t4; ++n4 < i3; )
              r4 = o3[n4].call(this, r4);
            return r4;
          };
        });
      }
      function Bn(a3, u3, c3, l3, s3, f3, d3, h3, p3, v3) {
        var g3 = u3 & Ni, _3 = 1 & u3, y3 = 2 & u3, w3 = 24 & u3, x3 = 512 & u3, m3 = y3 ? Wi : Cn(a3);
        return function e3() {
          for (var t3 = b2(i3 = arguments.length), n3 = i3; n3--; )
            t3[n3] = arguments[n3];
          if (w3 && (o3 = function(e4, t4) {
            for (var n4 = e4.length, r4 = 0; n4--; )
              e4[n4] === t4 && ++r4;
            return r4;
          }(t3, r3 = qn(e3))), l3 && (t3 = pn(t3, l3, s3, w3)), f3 && (t3 = vn(t3, f3, d3, w3)), i3 -= o3, w3 && i3 < v3)
            return o3 = pa(t3, r3), Pn(a3, u3, Bn, e3.placeholder, c3, t3, o3, h3, p3, v3 - i3);
          var r3 = _3 ? c3 : this, o3 = y3 ? r3[a3] : a3, i3 = t3.length;
          return h3 ? t3 = function(e4, t4) {
            for (var n4 = e4.length, r4 = C2(t4.length, n4), o4 = D2(e4); r4--; ) {
              var i4 = t4[r4];
              e4[r4] = or(i4, n4) ? o4[i4] : Wi;
            }
            return e4;
          }(t3, h3) : x3 && 1 < i3 && t3.reverse(), g3 && p3 < i3 && (t3.length = p3), (o3 = this && this !== ia && this instanceof e3 ? m3 || Cn(o3) : o3).apply(r3, t3);
        };
      }
      function Tn(n3, a3) {
        return function(e3, t3) {
          return e3 = e3, r3 = n3, o3 = a3(t3), i3 = {}, ft(e3, function(e4, t4, n4) {
            r3(i3, o3(e4), t4, n4);
          }), i3;
          var r3, o3, i3;
        };
      }
      function Ln(r3, o3) {
        return function(e3, t3) {
          var n3;
          if (e3 === Wi && t3 === Wi)
            return o3;
          if (e3 !== Wi && (n3 = e3), t3 !== Wi) {
            if (n3 === Wi)
              return t3;
            t3 = "string" == typeof e3 || "string" == typeof t3 ? (e3 = l2(e3), l2(t3)) : (e3 = qt(e3), qt(t3)), n3 = r3(e3, t3);
          }
          return n3;
        };
      }
      function On(r3) {
        return Vn(function(e3) {
          return e3 = la(e3, da(f2())), a2(function(t3) {
            var n3 = this;
            return r3(e3, function(e4) {
              return aa(e4, n3, t3);
            });
          });
        });
      }
      function Rn(e3, t3) {
        var n3 = (t3 = t3 === Wi ? " " : l2(t3)).length;
        if (n3 < 2)
          return n3 ? Xt(t3, e3) : t3;
        n3 = Xt(t3, he(e3 / va(t3)));
        return ha(t3) ? cn(ga(n3), 0, e3).join("") : n3.slice(0, e3);
      }
      function kn(u3, e3, c3, l3) {
        var s3 = 1 & e3, f3 = Cn(u3);
        return function e4() {
          for (var t3 = -1, n3 = arguments.length, r3 = -1, o3 = l3.length, i3 = b2(o3 + n3), a3 = this && this !== ia && this instanceof e4 ? f3 : u3; ++r3 < o3; )
            i3[r3] = l3[r3];
          for (; n3--; )
            i3[r3++] = arguments[++t3];
          return aa(a3, s3 ? c3 : this, i3);
        };
      }
      function En(l3) {
        return function(e3, t3, n3) {
          n3 && "number" != typeof n3 && d2(e3, t3, n3) && (t3 = n3 = Wi), e3 = Po(e3), t3 === Wi ? (t3 = e3, e3 = 0) : t3 = Po(t3), n3 = n3 === Wi ? e3 < t3 ? 1 : -1 : Po(n3);
          for (var r3 = e3, o3 = n3, i3 = l3, a3 = -1, u3 = w2(he((t3 - r3) / (o3 || 1)), 0), c3 = b2(u3); u3--; )
            c3[i3 ? u3 : ++a3] = r3, r3 += o3;
          return c3;
        };
      }
      function An(n3) {
        return function(e3, t3) {
          return "string" == typeof e3 && "string" == typeof t3 || (e3 = T2(e3), t3 = T2(t3)), n3(e3, t3);
        };
      }
      function Pn(e3, t3, n3, r3, o3, i3, a3, u3, c3, l3) {
        var s3 = 8 & t3, o3 = (4 & (t3 = (t3 | (s3 ? Hi : Vi)) & ~(s3 ? Vi : Hi)) || (t3 &= -4), [e3, t3, o3, s3 ? i3 : Wi, s3 ? a3 : Wi, s3 ? Wi : i3, s3 ? Wi : a3, u3, c3, l3]), i3 = n3.apply(Wi, o3);
        return ar(e3) && pr(i3, o3), i3.placeholder = r3, _r(i3, e3, t3);
      }
      function zn(e3) {
        var r3 = A[e3];
        return function(e4, t3) {
          var n3;
          return e4 = T2(e4), (t3 = null == t3 ? 0 : C2(B2(t3), 292)) && ge(e4) ? (n3 = (h2(e4) + "e").split("e"), +((n3 = (h2(r3(n3[0] + "e" + (+n3[1] + t3))) + "e").split("e"))[0] + "e" + (+n3[1] - t3))) : r3(e4);
        };
      }
      var Yn = Ie && 1 / lc(new Ie([, -0]))[1] == Ui ? function(e3) {
        return new Ie(e3);
      } : Di;
      function jn(i3) {
        return function(e3) {
          var t3, n3, r3, o3 = j(e3);
          return o3 == Ji ? uc(e3) : o3 == ta ? (o3 = e3, t3 = -1, n3 = Array(o3.size), o3.forEach(function(e4) {
            n3[++t3] = [e4, e4];
          }), n3) : la(i3(r3 = e3), function(e4) {
            return [e4, r3[e4]];
          });
        };
      }
      function Xn(e3, t3, n3, r3, o3, i3, a3, u3) {
        var c3 = 2 & t3;
        if (!c3 && "function" != typeof e3)
          throw new y2(Fi);
        var l3, s3, f3, d3, h3, p3 = r3 ? r3.length : 0, v3 = (p3 || (t3 &= -97, r3 = o3 = Wi), a3 = a3 === Wi ? a3 : w2(B2(a3), 0), u3 = u3 === Wi ? u3 : B2(u3), p3 -= o3 ? o3.length : 0, t3 & Vi && (g3 = r3, l3 = o3, r3 = o3 = Wi), c3 ? Wi : $n(e3)), g3 = [e3, t3, n3, r3, o3, g3, l3, i3, a3, u3];
        return v3 && function(e4, t4) {
          var n4 = e4[1], r4 = t4[1], o4 = n4 | r4, i4 = o4 < 131, a4 = r4 == Ni && 8 == n4 || r4 == Ni && n4 == ma && e4[7].length <= t4[8] || 384 == r4 && t4[7].length <= t4[8] && 8 == n4;
          if (!i4 && !a4)
            return;
          1 & r4 && (e4[2] = t4[2], o4 |= 1 & n4 ? 0 : 4);
          i4 = t4[3];
          {
            var u4;
            i4 && (u4 = e4[3], e4[3] = u4 ? pn(u4, i4, t4[4]) : i4, e4[4] = u4 ? pa(e4[3], wa) : t4[4]);
          }
          (i4 = t4[5]) && (u4 = e4[5], e4[5] = u4 ? vn(u4, i4, t4[6]) : i4, e4[6] = u4 ? pa(e4[5], wa) : t4[6]);
          (i4 = t4[7]) && (e4[7] = i4);
          r4 & Ni && (e4[8] = null == e4[8] ? t4[8] : C2(e4[8], t4[8]));
          null == e4[9] && (e4[9] = t4[9]);
          e4[0] = t4[0], e4[1] = o4;
        }(g3, v3), e3 = g3[0], t3 = g3[1], n3 = g3[2], r3 = g3[3], o3 = g3[4], !(u3 = g3[9] = g3[9] === Wi ? c3 ? 0 : e3.length : w2(g3[9] - p3, 0)) && 24 & t3 && (t3 &= -25), l3 = t3 && 1 != t3 ? 8 == t3 || t3 == xa ? Dn(e3, t3, u3) : t3 != Hi && 33 != t3 || o3.length ? Bn.apply(Wi, g3) : kn(e3, t3, n3, r3) : (f3 = n3, d3 = 1 & t3, h3 = Cn(s3 = e3), function e4() {
          return (this && this !== ia && this instanceof e4 ? h3 : s3).apply(d3 ? f3 : this, arguments);
        }), _r((v3 ? Ht : pr)(l3, g3), e3, t3);
      }
      function Mn(e3, t3, n3, r3) {
        return e3 === Wi || X(e3, N[n3]) && !z.call(r3, n3) ? t3 : e3;
      }
      function Wn(e3, t3, n3, r3, o3, i3) {
        return I2(e3) && I2(t3) && (i3.set(t3, e3), kt(e3, t3, Wi, Wn, i3), i3.delete(t3)), e3;
      }
      function Fn(e3) {
        return Bo(e3) ? Wi : e3;
      }
      function Hn(e3, t3, n3, r3, o3, i3) {
        var a3 = 1 & n3, u3 = e3.length, c3 = t3.length;
        if (u3 != c3 && !(a3 && u3 < c3))
          return false;
        var c3 = i3.get(e3), l3 = i3.get(t3);
        if (c3 && l3)
          return c3 == t3 && l3 == e3;
        var s3 = -1, f3 = true, d3 = 2 & n3 ? new Fe() : Wi;
        for (i3.set(e3, t3), i3.set(t3, e3); ++s3 < u3; ) {
          var h3, p3 = e3[s3], v3 = t3[s3];
          if ((h3 = r3 ? a3 ? r3(v3, p3, s3, t3, e3, i3) : r3(p3, v3, s3, e3, t3, i3) : h3) !== Wi) {
            if (h3)
              continue;
            f3 = false;
            break;
          }
          if (d3) {
            if (!Hu(t3, function(e4, t4) {
              return !tc(d3, t4) && (p3 === e4 || o3(p3, e4, n3, r3, i3)) && d3.push(t4);
            })) {
              f3 = false;
              break;
            }
          } else if (p3 !== v3 && !o3(p3, v3, n3, r3, i3)) {
            f3 = false;
            break;
          }
        }
        return i3.delete(e3), i3.delete(t3), f3;
      }
      function Vn(e3) {
        return gr(fr(e3, Wi, Br), e3 + "");
      }
      function Nn(e3) {
        return vt(e3, L2, Qn);
      }
      function Un(e3) {
        return vt(e3, O2, er);
      }
      var $n = Be ? function(e3) {
        return Be.get(e3);
      } : Di;
      function Gn(e3) {
        for (var t3 = e3.name + "", n3 = Te[t3], r3 = z.call(Te, t3) ? n3.length : 0; r3--; ) {
          var o3 = n3[r3], i3 = o3.func;
          if (null == i3 || i3 == e3)
            return o3.name;
        }
        return t3;
      }
      function qn(e3) {
        return (z.call(p2, "placeholder") ? p2 : e3).placeholder;
      }
      function f2() {
        var e3 = (e3 = p2.iteratee || xi) === xi ? It : e3;
        return arguments.length ? e3(arguments[0], arguments[1]) : e3;
      }
      function Zn(e3, t3) {
        var n3, r3, e3 = e3.__data__;
        return ("string" == (r3 = typeof (n3 = t3)) || "number" == r3 || "symbol" == r3 || "boolean" == r3 ? "__proto__" !== n3 : null === n3) ? e3["string" == typeof t3 ? "string" : "hash"] : e3.map;
      }
      function Kn(e3) {
        for (var t3 = L2(e3), n3 = t3.length; n3--; ) {
          var r3 = t3[n3], o3 = e3[r3];
          t3[n3] = [r3, o3, lr(o3)];
        }
        return t3;
      }
      function Jn(e3, t3) {
        t3 = t3;
        e3 = null == (e3 = e3) ? Wi : e3[t3];
        return Dt(e3) ? e3 : Wi;
      }
      var Qn = ve ? function(t3) {
        return null == t3 ? [] : (t3 = v2(t3), ca(ve(t3), function(e3) {
          return oe.call(t3, e3);
        }));
      } : Ri, er = ve ? function(e3) {
        for (var t3 = []; e3; )
          sa(t3, Qn(e3)), e3 = ne(e3);
        return t3;
      } : Ri, j = n2;
      function tr(e3, t3, n3) {
        for (var r3 = -1, o3 = (t3 = an(t3, e3)).length, i3 = false; ++r3 < o3; ) {
          var a3 = br(t3[r3]);
          if (!(i3 = null != e3 && n3(e3, a3)))
            break;
          e3 = e3[a3];
        }
        return i3 || ++r3 != o3 ? i3 : !!(o3 = null == e3 ? 0 : e3.length) && Do(o3) && or(a3, o3) && (M(e3) || yo(e3));
      }
      function nr(e3) {
        return "function" != typeof e3.constructor || cr(e3) ? {} : ze(ne(e3));
      }
      function rr(e3) {
        return M(e3) || yo(e3) || !!(ae && e3 && e3[ae]);
      }
      function or(e3, t3) {
        var n3 = typeof e3;
        return !!(t3 = null == t3 ? $i : t3) && ("number" == n3 || "symbol" != n3 && _u.test(e3)) && -1 < e3 && e3 % 1 == 0 && e3 < t3;
      }
      function d2(e3, t3, n3) {
        var r3;
        if (I2(n3))
          return r3 = typeof t3, ("number" == r3 ? s2(n3) && or(t3, n3.length) : "string" == r3 && t3 in n3) && X(n3[t3], e3);
      }
      function ir(e3, t3) {
        var n3;
        if (!M(e3))
          return n3 = typeof e3, "number" == n3 || "symbol" == n3 || "boolean" == n3 || null == e3 || S2(e3) || (eu.test(e3) || !Qa.test(e3) || null != t3 && e3 in v2(t3));
      }
      function ar(e3) {
        var t3 = Gn(e3), n3 = p2[t3];
        if ("function" == typeof n3 && t3 in _2.prototype) {
          if (e3 === n3)
            return 1;
          t3 = $n(n3);
          return t3 && e3 === t3[0];
        }
      }
      (i2 && j(new i2(new ArrayBuffer(1))) != na || Ce && j(new Ce()) != Ji || De && j(De.resolve()) != Ta || Ie && j(new Ie()) != ta || e2 && j(new e2()) != ka) && (j = function(e3) {
        var t3 = n2(e3), e3 = t3 == ea ? e3.constructor : Wi, e3 = e3 ? Cr(e3) : "";
        if (e3)
          switch (e3) {
            case Le:
              return na;
            case Oe:
              return Ji;
            case Re:
              return Ta;
            case ke:
              return ta;
            case Ee:
              return ka;
          }
        return t3;
      });
      var ur = U ? bo : ki;
      function cr(e3) {
        var t3 = e3 && e3.constructor;
        return e3 === ("function" == typeof t3 && t3.prototype || N);
      }
      function lr(e3) {
        return e3 == e3 && !I2(e3);
      }
      function sr(t3, n3) {
        return function(e3) {
          return null != e3 && (e3[t3] === n3 && (n3 !== Wi || t3 in v2(e3)));
        };
      }
      function fr(i3, a3, u3) {
        return a3 = w2(a3 === Wi ? i3.length - 1 : a3, 0), function() {
          for (var e3 = arguments, t3 = -1, n3 = w2(e3.length - a3, 0), r3 = b2(n3); ++t3 < n3; )
            r3[t3] = e3[a3 + t3];
          for (var t3 = -1, o3 = b2(a3 + 1); ++t3 < a3; )
            o3[t3] = e3[t3];
          return o3[a3] = u3(r3), aa(i3, this, o3);
        };
      }
      function dr(e3, t3) {
        return t3.length < 2 ? e3 : pt(e3, u2(t3, 0, -1));
      }
      function hr(e3, t3) {
        if (("constructor" !== t3 || "function" != typeof e3[t3]) && "__proto__" != t3)
          return e3[t3];
      }
      var pr = yr(Ht), vr = de || function(e3, t3) {
        return ia.setTimeout(e3, t3);
      }, gr = yr(t2);
      function _r(e3, t3, n3) {
        var r3, o3, t3 = t3 + "";
        return gr(e3, function(e4, t4) {
          var n4 = t4.length;
          if (!n4)
            return e4;
          var r4 = n4 - 1;
          return t4[r4] = (1 < n4 ? "& " : "") + t4[r4], t4 = t4.join(2 < n4 ? ", " : " "), e4.replace(iu, "{\n/* [wrapped with " + t4 + "] */\n");
        }(t3, (r3 = (e3 = (e3 = t3).match(au)) ? e3[1].split(uu) : [], o3 = n3, ua(Ca, function(e4) {
          var t4 = "_." + e4[0];
          o3 & e4[1] && !Xu(r3, t4) && r3.push(t4);
        }), r3.sort())));
      }
      function yr(n3) {
        var r3 = 0, o3 = 0;
        return function() {
          var e3 = we(), t3 = 16 - (e3 - o3);
          if (o3 = e3, 0 < t3) {
            if (800 <= ++r3)
              return arguments[0];
          } else
            r3 = 0;
          return n3.apply(Wi, arguments);
        };
      }
      function wr(e3, t3) {
        var n3 = -1, r3 = e3.length, o3 = r3 - 1;
        for (t3 = t3 === Wi ? r3 : t3; ++n3 < t3; ) {
          var i3 = jt(n3, o3), a3 = e3[i3];
          e3[i3] = e3[n3], e3[n3] = a3;
        }
        return e3.length = t3, e3;
      }
      xr = (se = so(se = function(e3) {
        var o3 = [];
        return 46 === e3.charCodeAt(0) && o3.push(""), e3.replace(tu, function(e4, t3, n3, r3) {
          o3.push(n3 ? r3.replace(su, "$1") : t3 || e4);
        }), o3;
      }, function(e3) {
        return 500 === xr.size && xr.clear(), e3;
      })).cache;
      var xr, mr = se;
      function br(e3) {
        if ("string" == typeof e3 || S2(e3))
          return e3;
        var t3 = e3 + "";
        return "0" == t3 && 1 / e3 == -Ui ? "-0" : t3;
      }
      function Cr(e3) {
        if (null != e3) {
          try {
            return $.call(e3);
          } catch (e4) {
          }
          try {
            return e3 + "";
          } catch (e4) {
          }
        }
        return "";
      }
      function Dr(e3) {
        if (e3 instanceof _2)
          return e3.clone();
        var t3 = new g2(e3.__wrapped__, e3.__chain__);
        return t3.__actions__ = D2(e3.__actions__), t3.__index__ = e3.__index__, t3.__values__ = e3.__values__, t3;
      }
      i2 = a2(function(e3, t3) {
        return m2(e3) ? rt(e3, c2(t3, 1, m2, true)) : [];
      }), De = a2(function(e3, t3) {
        var n3 = r2(t3);
        return m2(n3) && (n3 = Wi), m2(e3) ? rt(e3, c2(t3, 1, m2, true), f2(n3, 2)) : [];
      }), e2 = a2(function(e3, t3) {
        var n3 = r2(t3);
        return m2(n3) && (n3 = Wi), m2(e3) ? rt(e3, c2(t3, 1, m2, true), Wi, n3) : [];
      });
      function Ir(e3, t3, n3) {
        var r3 = null == e3 ? 0 : e3.length;
        if (!r3)
          return -1;
        n3 = null == n3 ? 0 : B2(n3);
        return n3 < 0 && (n3 = w2(r3 + n3, 0)), Nu(e3, f2(t3, 3), n3);
      }
      function Sr(e3, t3, n3) {
        var r3 = null == e3 ? 0 : e3.length;
        if (!r3)
          return -1;
        var o3 = r3 - 1;
        return n3 !== Wi && (o3 = B2(n3), o3 = n3 < 0 ? w2(r3 + o3, 0) : C2(o3, r3 - 1)), Nu(e3, f2(t3, 3), o3, true);
      }
      function Br(e3) {
        return (null == e3 ? 0 : e3.length) ? c2(e3, 1) : [];
      }
      function Tr(e3) {
        return e3 && e3.length ? e3[0] : Wi;
      }
      U = a2(function(e3) {
        var t3 = la(e3, rn);
        return t3.length && t3[0] === e3[0] ? wt(t3) : [];
      }), de = a2(function(e3) {
        var t3 = r2(e3), n3 = la(e3, rn);
        return t3 === r2(n3) ? t3 = Wi : n3.pop(), n3.length && n3[0] === e3[0] ? wt(n3, f2(t3, 2)) : [];
      }), t2 = a2(function(e3) {
        var t3 = r2(e3), n3 = la(e3, rn);
        return (t3 = "function" == typeof t3 ? t3 : Wi) && n3.pop(), n3.length && n3[0] === e3[0] ? wt(n3, Wi, t3) : [];
      });
      function r2(e3) {
        var t3 = null == e3 ? 0 : e3.length;
        return t3 ? e3[t3 - 1] : Wi;
      }
      se = a2(Lr);
      function Lr(e3, t3) {
        return e3 && e3.length && t3 && t3.length ? zt(e3, t3) : e3;
      }
      var Or = Vn(function(e3, t3) {
        var n3 = null == e3 ? 0 : e3.length, r3 = Qe(e3, t3);
        return Yt(e3, la(t3, function(e4) {
          return or(e4, n3) ? +e4 : e4;
        }).sort(hn)), r3;
      });
      function Rr(e3) {
        return null == e3 ? e3 : be.call(e3);
      }
      var kr = a2(function(e3) {
        return Zt(c2(e3, 1, m2, true));
      }), Er = a2(function(e3) {
        var t3 = r2(e3);
        return m2(t3) && (t3 = Wi), Zt(c2(e3, 1, m2, true), f2(t3, 2));
      }), Ar = a2(function(e3) {
        var t3 = "function" == typeof (t3 = r2(e3)) ? t3 : Wi;
        return Zt(c2(e3, 1, m2, true), Wi, t3);
      });
      function Pr(t3) {
        if (!t3 || !t3.length)
          return [];
        var n3 = 0;
        return t3 = ca(t3, function(e3) {
          return m2(e3) && (n3 = w2(e3.length, n3), 1);
        }), Ju(n3, function(e3) {
          return la(t3, qu(e3));
        });
      }
      function zr(e3, t3) {
        if (!e3 || !e3.length)
          return [];
        e3 = Pr(e3);
        return null == t3 ? e3 : la(e3, function(e4) {
          return aa(t3, Wi, e4);
        });
      }
      var Yr = a2(function(e3, t3) {
        return m2(e3) ? rt(e3, t3) : [];
      }), jr = a2(function(e3) {
        return tn(ca(e3, m2));
      }), Xr = a2(function(e3) {
        var t3 = r2(e3);
        return m2(t3) && (t3 = Wi), tn(ca(e3, m2), f2(t3, 2));
      }), Mr = a2(function(e3) {
        var t3 = "function" == typeof (t3 = r2(e3)) ? t3 : Wi;
        return tn(ca(e3, m2), Wi, t3);
      }), Wr = a2(Pr);
      var Fr = a2(function(e3) {
        var t3 = e3.length, t3 = "function" == typeof (t3 = 1 < t3 ? e3[t3 - 1] : Wi) ? (e3.pop(), t3) : Wi;
        return zr(e3, t3);
      });
      function Hr(e3) {
        e3 = p2(e3);
        return e3.__chain__ = true, e3;
      }
      function Vr(e3, t3) {
        return t3(e3);
      }
      var Nr = Vn(function(t3) {
        function e3(e4) {
          return Qe(e4, t3);
        }
        var n3 = t3.length, r3 = n3 ? t3[0] : 0, o3 = this.__wrapped__;
        return !(1 < n3 || this.__actions__.length) && o3 instanceof _2 && or(r3) ? ((o3 = o3.slice(r3, +r3 + (n3 ? 1 : 0))).__actions__.push({ func: Vr, args: [e3], thisArg: Wi }), new g2(o3, this.__chain__).thru(function(e4) {
          return n3 && !e4.length && e4.push(Wi), e4;
        })) : this.thru(e3);
      });
      var Ur = _n(function(e3, t3, n3) {
        z.call(e3, n3) ? ++e3[n3] : Je(e3, n3, 1);
      });
      var $r = In(Ir), Gr = In(Sr);
      function qr(e3, t3) {
        return (M(e3) ? ua : ot)(e3, f2(t3, 3));
      }
      function Zr(e3, t3) {
        return (M(e3) ? Yu : it)(e3, f2(t3, 3));
      }
      var Kr = _n(function(e3, t3, n3) {
        z.call(e3, n3) ? e3[n3].push(t3) : Je(e3, n3, [t3]);
      });
      var Jr = a2(function(e3, t3, n3) {
        var r3 = -1, o3 = "function" == typeof t3, i3 = s2(e3) ? b2(e3.length) : [];
        return ot(e3, function(e4) {
          i3[++r3] = o3 ? aa(t3, e4, n3) : xt(e4, t3, n3);
        }), i3;
      }), Qr = _n(function(e3, t3, n3) {
        Je(e3, n3, t3);
      });
      function eo(e3, t3) {
        return (M(e3) ? la : Lt)(e3, f2(t3, 3));
      }
      var to = _n(function(e3, t3, n3) {
        e3[n3 ? 0 : 1].push(t3);
      }, function() {
        return [[], []];
      });
      var no = a2(function(e3, t3) {
        if (null == e3)
          return [];
        var n3 = t3.length;
        return 1 < n3 && d2(e3, t3[0], t3[1]) ? t3 = [] : 2 < n3 && d2(t3[0], t3[1], t3[2]) && (t3 = [t3[0]]), At(e3, c2(t3, 1), []);
      }), ro = fe || function() {
        return ia.Date.now();
      };
      function oo(e3, t3, n3) {
        return t3 = n3 ? Wi : t3, t3 = e3 && null == t3 ? e3.length : t3, Xn(e3, Ni, Wi, Wi, Wi, Wi, t3);
      }
      function io(e3, t3) {
        var n3;
        if ("function" != typeof t3)
          throw new y2(Fi);
        return e3 = B2(e3), function() {
          return 0 < --e3 && (n3 = t3.apply(this, arguments)), e3 <= 1 && (t3 = Wi), n3;
        };
      }
      var ao = a2(function(e3, t3, n3) {
        var r3, o3 = 1;
        return n3.length && (r3 = pa(n3, qn(ao)), o3 |= Hi), Xn(e3, o3, t3, n3, r3);
      }), uo = a2(function(e3, t3, n3) {
        var r3, o3 = 3;
        return n3.length && (r3 = pa(n3, qn(uo)), o3 |= Hi), Xn(t3, o3, e3, n3, r3);
      });
      function co(r3, n3, e3) {
        var o3, i3, a3, u3, c3, l3, s3 = 0, f3 = false, d3 = false, t3 = true;
        if ("function" != typeof r3)
          throw new y2(Fi);
        function h3(e4) {
          var t4 = o3, n4 = i3;
          return o3 = i3 = Wi, s3 = e4, u3 = r3.apply(n4, t4);
        }
        function p3(e4) {
          var t4 = e4 - l3;
          return l3 === Wi || n3 <= t4 || t4 < 0 || d3 && a3 <= e4 - s3;
        }
        function v3() {
          var e4, t4 = ro();
          if (p3(t4))
            return g3(t4);
          c3 = vr(v3, (e4 = n3 - ((t4 = t4) - l3), d3 ? C2(e4, a3 - (t4 - s3)) : e4));
        }
        function g3(e4) {
          return c3 = Wi, t3 && o3 ? h3(e4) : (o3 = i3 = Wi, u3);
        }
        function _3() {
          var e4 = ro(), t4 = p3(e4);
          if (o3 = arguments, i3 = this, l3 = e4, t4) {
            if (c3 === Wi)
              return s3 = e4 = l3, c3 = vr(v3, n3), f3 ? h3(e4) : u3;
            if (d3)
              return ln(c3), c3 = vr(v3, n3), h3(l3);
          }
          return c3 === Wi && (c3 = vr(v3, n3)), u3;
        }
        return n3 = T2(n3) || 0, I2(e3) && (f3 = !!e3.leading, d3 = "maxWait" in e3, a3 = d3 ? w2(T2(e3.maxWait) || 0, n3) : a3, t3 = "trailing" in e3 ? !!e3.trailing : t3), _3.cancel = function() {
          c3 !== Wi && ln(c3), s3 = 0, o3 = l3 = i3 = c3 = Wi;
        }, _3.flush = function() {
          return c3 === Wi ? u3 : g3(ro());
        }, _3;
      }
      var fe = a2(function(e3, t3) {
        return nt(e3, 1, t3);
      }), lo = a2(function(e3, t3, n3) {
        return nt(e3, T2(t3) || 0, n3);
      });
      function so(r3, o3) {
        if ("function" != typeof r3 || null != o3 && "function" != typeof o3)
          throw new y2(Fi);
        function i3() {
          var e3 = arguments, t3 = o3 ? o3.apply(this, e3) : e3[0], n3 = i3.cache;
          return n3.has(t3) ? n3.get(t3) : (e3 = r3.apply(this, e3), i3.cache = n3.set(t3, e3) || n3, e3);
        }
        return i3.cache = new (so.Cache || We)(), i3;
      }
      function fo(t3) {
        if ("function" != typeof t3)
          throw new y2(Fi);
        return function() {
          var e3 = arguments;
          switch (e3.length) {
            case 0:
              return !t3.call(this);
            case 1:
              return !t3.call(this, e3[0]);
            case 2:
              return !t3.call(this, e3[0], e3[1]);
            case 3:
              return !t3.call(this, e3[0], e3[1], e3[2]);
          }
          return !t3.apply(this, e3);
        };
      }
      so.Cache = We;
      var un = un(function(r3, o3) {
        var i3 = (o3 = 1 == o3.length && M(o3[0]) ? la(o3[0], da(f2())) : la(c2(o3, 1), da(f2()))).length;
        return a2(function(e3) {
          for (var t3 = -1, n3 = C2(e3.length, i3); ++t3 < n3; )
            e3[t3] = o3[t3].call(this, e3[t3]);
          return aa(r3, this, e3);
        });
      }), ho = a2(function(e3, t3) {
        var n3 = pa(t3, qn(ho));
        return Xn(e3, Hi, Wi, t3, n3);
      }), po = a2(function(e3, t3) {
        var n3 = pa(t3, qn(po));
        return Xn(e3, Vi, Wi, t3, n3);
      }), vo = Vn(function(e3, t3) {
        return Xn(e3, ma, Wi, Wi, Wi, t3);
      });
      function X(e3, t3) {
        return e3 === t3 || e3 != e3 && t3 != t3;
      }
      var go = An(gt), _o = An(function(e3, t3) {
        return t3 <= e3;
      }), yo = mt(function() {
        return arguments;
      }()) ? mt : function(e3) {
        return W(e3) && z.call(e3, "callee") && !oe.call(e3, "callee");
      }, M = b2.isArray, wo = Ou ? da(Ou) : function(e3) {
        return W(e3) && n2(e3) == Ea;
      };
      function s2(e3) {
        return null != e3 && Do(e3.length) && !bo(e3);
      }
      function m2(e3) {
        return W(e3) && s2(e3);
      }
      var xo = V || ki, V = Ru ? da(Ru) : function(e3) {
        return W(e3) && n2(e3) == Ki;
      };
      function mo(e3) {
        if (!W(e3))
          return false;
        var t3 = n2(e3);
        return t3 == Ia || "[object DOMException]" == t3 || "string" == typeof e3.message && "string" == typeof e3.name && !Bo(e3);
      }
      function bo(e3) {
        if (!I2(e3))
          return false;
        e3 = n2(e3);
        return e3 == Sa || e3 == Ba || "[object AsyncFunction]" == e3 || "[object Proxy]" == e3;
      }
      function Co(e3) {
        return "number" == typeof e3 && e3 == B2(e3);
      }
      function Do(e3) {
        return "number" == typeof e3 && -1 < e3 && e3 % 1 == 0 && e3 <= $i;
      }
      function I2(e3) {
        var t3 = typeof e3;
        return null != e3 && ("object" == t3 || "function" == t3);
      }
      function W(e3) {
        return null != e3 && "object" == typeof e3;
      }
      var Io = ku ? da(ku) : function(e3) {
        return W(e3) && j(e3) == Ji;
      };
      function So(e3) {
        return "number" == typeof e3 || W(e3) && n2(e3) == Qi;
      }
      function Bo(e3) {
        if (!W(e3) || n2(e3) != ea)
          return false;
        e3 = ne(e3);
        if (null === e3)
          return true;
        e3 = z.call(e3, "constructor") && e3.constructor;
        return "function" == typeof e3 && e3 instanceof e3 && $.call(e3) == K;
      }
      var To = Eu ? da(Eu) : function(e3) {
        return W(e3) && n2(e3) == La;
      };
      var Lo = Au ? da(Au) : function(e3) {
        return W(e3) && j(e3) == ta;
      };
      function Oo(e3) {
        return "string" == typeof e3 || !M(e3) && W(e3) && n2(e3) == Oa;
      }
      function S2(e3) {
        return "symbol" == typeof e3 || W(e3) && n2(e3) == Ra;
      }
      var Ro = Pu ? da(Pu) : function(e3) {
        return W(e3) && Do(e3.length) && !!ra[n2(e3)];
      };
      var ko = An(Tt), Eo = An(function(e3, t3) {
        return e3 <= t3;
      });
      function Ao(e3) {
        if (!e3)
          return [];
        if (s2(e3))
          return (Oo(e3) ? ga : D2)(e3);
        if (ue && e3[ue]) {
          for (var t3, n3 = e3[ue](), r3 = []; !(t3 = n3.next()).done; )
            r3.push(t3.value);
          return r3;
        }
        var o3 = j(e3);
        return (o3 == Ji ? uc : o3 == ta ? lc : ri)(e3);
      }
      function Po(e3) {
        return e3 ? (e3 = T2(e3)) === Ui || e3 === -Ui ? 17976931348623157e292 * (e3 < 0 ? -1 : 1) : e3 == e3 ? e3 : 0 : 0 === e3 ? e3 : 0;
      }
      function B2(e3) {
        var e3 = Po(e3), t3 = e3 % 1;
        return e3 == e3 ? t3 ? e3 - t3 : e3 : 0;
      }
      function zo(e3) {
        return e3 ? et(B2(e3), 0, Gi) : 0;
      }
      function T2(e3) {
        if ("number" == typeof e3)
          return e3;
        if (S2(e3))
          return ba;
        if ("string" != typeof (e3 = I2(e3) ? I2(t3 = "function" == typeof e3.valueOf ? e3.valueOf() : e3) ? t3 + "" : t3 : e3))
          return 0 === e3 ? e3 : +e3;
        e3 = Qu(e3);
        var t3 = pu.test(e3);
        return t3 || gu.test(e3) ? Tu(e3.slice(2), t3 ? 2 : 8) : hu.test(e3) ? ba : +e3;
      }
      function Yo(e3) {
        return gn(e3, O2(e3));
      }
      function h2(e3) {
        return null == e3 ? "" : l2(e3);
      }
      var jo = yn(function(e3, t3) {
        if (cr(t3) || s2(t3))
          gn(t3, L2(t3), e3);
        else
          for (var n3 in t3)
            z.call(t3, n3) && Ge(e3, n3, t3[n3]);
      }), Xo = yn(function(e3, t3) {
        gn(t3, O2(t3), e3);
      }), Mo = yn(function(e3, t3, n3, r3) {
        gn(t3, O2(t3), e3, r3);
      }), Wo = yn(function(e3, t3, n3, r3) {
        gn(t3, L2(t3), e3, r3);
      }), Fo = Vn(Qe);
      var Ho = a2(function(e3, t3) {
        e3 = v2(e3);
        var n3 = -1, r3 = t3.length, o3 = 2 < r3 ? t3[2] : Wi;
        for (o3 && d2(t3[0], t3[1], o3) && (r3 = 1); ++n3 < r3; )
          for (var i3 = t3[n3], a3 = O2(i3), u3 = -1, c3 = a3.length; ++u3 < c3; ) {
            var l3 = a3[u3], s3 = e3[l3];
            (s3 === Wi || X(s3, N[l3]) && !z.call(e3, l3)) && (e3[l3] = i3[l3]);
          }
        return e3;
      }), Vo = a2(function(e3) {
        return e3.push(Wi, Wn), aa(Ko, Wi, e3);
      });
      function No(e3, t3, n3) {
        e3 = null == e3 ? Wi : pt(e3, t3);
        return e3 === Wi ? n3 : e3;
      }
      function Uo(e3, t3) {
        return null != e3 && tr(e3, t3, yt);
      }
      var $o = Tn(function(e3, t3, n3) {
        e3[t3 = null != t3 && "function" != typeof t3.toString ? Z.call(t3) : t3] = n3;
      }, _i(R)), Go = Tn(function(e3, t3, n3) {
        null != t3 && "function" != typeof t3.toString && (t3 = Z.call(t3)), z.call(e3, t3) ? e3[t3].push(n3) : e3[t3] = [n3];
      }, f2), qo = a2(xt);
      function L2(e3) {
        return (s2(e3) ? He : St)(e3);
      }
      function O2(e3) {
        return s2(e3) ? He(e3, true) : Bt(e3);
      }
      var Zo = yn(function(e3, t3, n3) {
        kt(e3, t3, n3);
      }), Ko = yn(function(e3, t3, n3, r3) {
        kt(e3, t3, n3, r3);
      }), Jo = Vn(function(t3, e3) {
        var n3 = {};
        if (null == t3)
          return n3;
        for (var r3 = false, o3 = (e3 = la(e3, function(e4) {
          return e4 = an(e4, t3), r3 = r3 || 1 < e4.length, e4;
        }), gn(t3, Un(t3), n3), r3 && (n3 = x2(n3, 7, Fn)), e3.length); o3--; )
          Kt(n3, e3[o3]);
        return n3;
      });
      var Qo = Vn(function(e3, t3) {
        return null == e3 ? {} : Pt(n3 = e3, t3, function(e4, t4) {
          return Uo(n3, t4);
        });
        var n3;
      });
      function ei(e3, n3) {
        if (null == e3)
          return {};
        var t3 = la(Un(e3), function(e4) {
          return [e4];
        });
        return n3 = f2(n3), Pt(e3, t3, function(e4, t4) {
          return n3(e4, t4[0]);
        });
      }
      var ti = jn(L2), ni = jn(O2);
      function ri(e3) {
        return null == e3 ? [] : ec(e3, L2(e3));
      }
      var oi = bn(function(e3, t3, n3) {
        return t3 = t3.toLowerCase(), e3 + (n3 ? ii(t3) : t3);
      });
      function ii(e3) {
        return hi(h2(e3).toLowerCase());
      }
      function ai(e3) {
        return (e3 = h2(e3)) && e3.replace(yu, oc).replace(bu, "");
      }
      var ui = bn(function(e3, t3, n3) {
        return e3 + (n3 ? "-" : "") + t3.toLowerCase();
      }), ci = bn(function(e3, t3, n3) {
        return e3 + (n3 ? " " : "") + t3.toLowerCase();
      }), li = mn("toLowerCase");
      var si = bn(function(e3, t3, n3) {
        return e3 + (n3 ? "_" : "") + t3.toLowerCase();
      });
      var fi = bn(function(e3, t3, n3) {
        return e3 + (n3 ? " " : "") + hi(t3);
      });
      var di = bn(function(e3, t3, n3) {
        return e3 + (n3 ? " " : "") + t3.toUpperCase();
      }), hi = mn("toUpperCase");
      function pi(e3, t3, n3) {
        return e3 = h2(e3), (t3 = n3 ? Wi : t3) === Wi ? (n3 = e3, Du.test(n3) ? e3.match(Cu) || [] : e3.match(cu) || []) : e3.match(t3) || [];
      }
      var vi = a2(function(e3, t3) {
        try {
          return aa(e3, Wi, t3);
        } catch (e4) {
          return mo(e4) ? e4 : new k(e4);
        }
      }), gi = Vn(function(t3, e3) {
        return ua(e3, function(e4) {
          e4 = br(e4), Je(t3, e4, ao(t3[e4], t3));
        }), t3;
      });
      function _i(e3) {
        return function() {
          return e3;
        };
      }
      var yi = Sn(), wi = Sn(true);
      function R(e3) {
        return e3;
      }
      function xi(e3) {
        return It("function" == typeof e3 ? e3 : x2(e3, 1));
      }
      var mi = a2(function(t3, n3) {
        return function(e3) {
          return xt(e3, t3, n3);
        };
      }), bi = a2(function(t3, n3) {
        return function(e3) {
          return xt(t3, e3, n3);
        };
      });
      function Ci(r3, t3, e3) {
        var n3 = L2(t3), o3 = ht(t3, n3), i3 = (null != e3 || I2(t3) && (o3.length || !n3.length) || (e3 = t3, t3 = r3, r3 = this, o3 = ht(t3, L2(t3))), !(I2(e3) && "chain" in e3 && !e3.chain)), a3 = bo(r3);
        return ua(o3, function(e4) {
          var n4 = t3[e4];
          r3[e4] = n4, a3 && (r3.prototype[e4] = function() {
            var e5, t4 = this.__chain__;
            return i3 || t4 ? (((e5 = r3(this.__wrapped__)).__actions__ = D2(this.__actions__)).push({ func: n4, args: arguments, thisArg: r3 }), e5.__chain__ = t4, e5) : n4.apply(r3, sa([this.value()], arguments));
          });
        }), r3;
      }
      function Di() {
      }
      var Ii = On(la), Si = On(ju), Bi = On(Hu);
      function Ti(e3) {
        return ir(e3) ? qu(br(e3)) : (t3 = e3, function(e4) {
          return pt(e4, t3);
        });
        var t3;
      }
      var Li = En(), Oi = En(true);
      function Ri() {
        return [];
      }
      function ki() {
        return false;
      }
      var Ei = Ln(function(e3, t3) {
        return e3 + t3;
      }, 0), Ai = zn("ceil"), Pi = Ln(function(e3, t3) {
        return e3 / t3;
      }, 1), zi = zn("floor");
      var Yi, ji = Ln(function(e3, t3) {
        return e3 * t3;
      }, 1), Xi = zn("round"), Mi = Ln(function(e3, t3) {
        return e3 - t3;
      }, 0);
      return p2.after = function(e3, t3) {
        if ("function" != typeof t3)
          throw new y2(Fi);
        return e3 = B2(e3), function() {
          if (--e3 < 1)
            return t3.apply(this, arguments);
        };
      }, p2.ary = oo, p2.assign = jo, p2.assignIn = Xo, p2.assignInWith = Mo, p2.assignWith = Wo, p2.at = Fo, p2.before = io, p2.bind = ao, p2.bindAll = gi, p2.bindKey = uo, p2.castArray = function() {
        if (!arguments.length)
          return [];
        var e3 = arguments[0];
        return M(e3) ? e3 : [e3];
      }, p2.chain = Hr, p2.chunk = function(e3, t3, n3) {
        t3 = (n3 ? d2(e3, t3, n3) : t3 === Wi) ? 1 : w2(B2(t3), 0);
        var r3 = null == e3 ? 0 : e3.length;
        if (!r3 || t3 < 1)
          return [];
        for (var o3 = 0, i3 = 0, a3 = b2(he(r3 / t3)); o3 < r3; )
          a3[i3++] = u2(e3, o3, o3 += t3);
        return a3;
      }, p2.compact = function(e3) {
        for (var t3 = -1, n3 = null == e3 ? 0 : e3.length, r3 = 0, o3 = []; ++t3 < n3; ) {
          var i3 = e3[t3];
          i3 && (o3[r3++] = i3);
        }
        return o3;
      }, p2.concat = function() {
        var e3 = arguments.length;
        if (!e3)
          return [];
        for (var t3 = b2(e3 - 1), n3 = arguments[0], r3 = e3; r3--; )
          t3[r3 - 1] = arguments[r3];
        return sa(M(n3) ? D2(n3) : [n3], c2(t3, 1));
      }, p2.cond = function(r3) {
        var o3 = null == r3 ? 0 : r3.length, t3 = f2();
        return r3 = o3 ? la(r3, function(e3) {
          if ("function" != typeof e3[1])
            throw new y2(Fi);
          return [t3(e3[0]), e3[1]];
        }) : [], a2(function(e3) {
          for (var t4 = -1; ++t4 < o3; ) {
            var n3 = r3[t4];
            if (aa(n3[0], this, e3))
              return aa(n3[1], this, e3);
          }
        });
      }, p2.conforms = function(e3) {
        return t3 = x2(e3, 1), n3 = L2(t3), function(e4) {
          return tt(e4, t3, n3);
        };
        var t3, n3;
      }, p2.constant = _i, p2.countBy = Ur, p2.create = function(e3, t3) {
        return e3 = ze(e3), null == t3 ? e3 : Ke(e3, t3);
      }, p2.curry = function e3(t3, n3, r3) {
        t3 = Xn(t3, 8, Wi, Wi, Wi, Wi, Wi, n3 = r3 ? Wi : n3);
        return t3.placeholder = e3.placeholder, t3;
      }, p2.curryRight = function e3(t3, n3, r3) {
        t3 = Xn(t3, xa, Wi, Wi, Wi, Wi, Wi, n3 = r3 ? Wi : n3);
        return t3.placeholder = e3.placeholder, t3;
      }, p2.debounce = co, p2.defaults = Ho, p2.defaultsDeep = Vo, p2.defer = fe, p2.delay = lo, p2.difference = i2, p2.differenceBy = De, p2.differenceWith = e2, p2.drop = function(e3, t3, n3) {
        var r3 = null == e3 ? 0 : e3.length;
        return r3 ? u2(e3, (t3 = n3 || t3 === Wi ? 1 : B2(t3)) < 0 ? 0 : t3, r3) : [];
      }, p2.dropRight = function(e3, t3, n3) {
        var r3 = null == e3 ? 0 : e3.length;
        return r3 ? u2(e3, 0, (t3 = r3 - (t3 = n3 || t3 === Wi ? 1 : B2(t3))) < 0 ? 0 : t3) : [];
      }, p2.dropRightWhile = function(e3, t3) {
        return e3 && e3.length ? Qt(e3, f2(t3, 3), true, true) : [];
      }, p2.dropWhile = function(e3, t3) {
        return e3 && e3.length ? Qt(e3, f2(t3, 3), true) : [];
      }, p2.fill = function(e3, t3, n3, r3) {
        if (!(c3 = null == e3 ? 0 : e3.length))
          return [];
        n3 && "number" != typeof n3 && d2(e3, t3, n3) && (n3 = 0, r3 = c3);
        var o3 = e3, i3 = t3, a3 = n3, u3 = r3, c3 = o3.length;
        for ((a3 = B2(a3)) < 0 && (a3 = c3 < -a3 ? 0 : c3 + a3), (u3 = u3 === Wi || c3 < u3 ? c3 : B2(u3)) < 0 && (u3 += c3), u3 = u3 < a3 ? 0 : zo(u3); a3 < u3; )
          o3[a3++] = i3;
        return o3;
      }, p2.filter = function(e3, t3) {
        return (M(e3) ? ca : ct)(e3, f2(t3, 3));
      }, p2.flatMap = function(e3, t3) {
        return c2(eo(e3, t3), 1);
      }, p2.flatMapDeep = function(e3, t3) {
        return c2(eo(e3, t3), Ui);
      }, p2.flatMapDepth = function(e3, t3, n3) {
        return n3 = n3 === Wi ? 1 : B2(n3), c2(eo(e3, t3), n3);
      }, p2.flatten = Br, p2.flattenDeep = function(e3) {
        return (null == e3 ? 0 : e3.length) ? c2(e3, Ui) : [];
      }, p2.flattenDepth = function(e3, t3) {
        return (null == e3 ? 0 : e3.length) ? c2(e3, t3 = t3 === Wi ? 1 : B2(t3)) : [];
      }, p2.flip = function(e3) {
        return Xn(e3, 512);
      }, p2.flow = yi, p2.flowRight = wi, p2.fromPairs = function(e3) {
        for (var t3 = -1, n3 = null == e3 ? 0 : e3.length, r3 = {}; ++t3 < n3; ) {
          var o3 = e3[t3];
          r3[o3[0]] = o3[1];
        }
        return r3;
      }, p2.functions = function(e3) {
        return null == e3 ? [] : ht(e3, L2(e3));
      }, p2.functionsIn = function(e3) {
        return null == e3 ? [] : ht(e3, O2(e3));
      }, p2.groupBy = Kr, p2.initial = function(e3) {
        return (null == e3 ? 0 : e3.length) ? u2(e3, 0, -1) : [];
      }, p2.intersection = U, p2.intersectionBy = de, p2.intersectionWith = t2, p2.invert = $o, p2.invertBy = Go, p2.invokeMap = Jr, p2.iteratee = xi, p2.keyBy = Qr, p2.keys = L2, p2.keysIn = O2, p2.map = eo, p2.mapKeys = function(e3, r3) {
        var o3 = {};
        return r3 = f2(r3, 3), ft(e3, function(e4, t3, n3) {
          Je(o3, r3(e4, t3, n3), e4);
        }), o3;
      }, p2.mapValues = function(e3, r3) {
        var o3 = {};
        return r3 = f2(r3, 3), ft(e3, function(e4, t3, n3) {
          Je(o3, t3, r3(e4, t3, n3));
        }), o3;
      }, p2.matches = function(e3) {
        return Ot(x2(e3, 1));
      }, p2.matchesProperty = function(e3, t3) {
        return Rt(e3, x2(t3, 1));
      }, p2.memoize = so, p2.merge = Zo, p2.mergeWith = Ko, p2.method = mi, p2.methodOf = bi, p2.mixin = Ci, p2.negate = fo, p2.nthArg = function(t3) {
        return t3 = B2(t3), a2(function(e3) {
          return Et(e3, t3);
        });
      }, p2.omit = Jo, p2.omitBy = function(e3, t3) {
        return ei(e3, fo(f2(t3)));
      }, p2.once = function(e3) {
        return io(2, e3);
      }, p2.orderBy = function(e3, t3, n3, r3) {
        return null == e3 ? [] : At(e3, t3 = M(t3) ? t3 : null == t3 ? [] : [t3], n3 = M(n3 = r3 ? Wi : n3) ? n3 : null == n3 ? [] : [n3]);
      }, p2.over = Ii, p2.overArgs = un, p2.overEvery = Si, p2.overSome = Bi, p2.partial = ho, p2.partialRight = po, p2.partition = to, p2.pick = Qo, p2.pickBy = ei, p2.property = Ti, p2.propertyOf = function(t3) {
        return function(e3) {
          return null == t3 ? Wi : pt(t3, e3);
        };
      }, p2.pull = se, p2.pullAll = Lr, p2.pullAllBy = function(e3, t3, n3) {
        return e3 && e3.length && t3 && t3.length ? zt(e3, t3, f2(n3, 2)) : e3;
      }, p2.pullAllWith = function(e3, t3, n3) {
        return e3 && e3.length && t3 && t3.length ? zt(e3, t3, Wi, n3) : e3;
      }, p2.pullAt = Or, p2.range = Li, p2.rangeRight = Oi, p2.rearg = vo, p2.reject = function(e3, t3) {
        return (M(e3) ? ca : ct)(e3, fo(f2(t3, 3)));
      }, p2.remove = function(e3, t3) {
        var n3 = [];
        if (!e3 || !e3.length)
          return n3;
        var r3 = -1, o3 = [], i3 = e3.length;
        for (t3 = f2(t3, 3); ++r3 < i3; ) {
          var a3 = e3[r3];
          t3(a3, r3, e3) && (n3.push(a3), o3.push(r3));
        }
        return Yt(e3, o3), n3;
      }, p2.rest = function(e3, t3) {
        if ("function" != typeof e3)
          throw new y2(Fi);
        return a2(e3, t3 = t3 === Wi ? t3 : B2(t3));
      }, p2.reverse = Rr, p2.sampleSize = function(e3, t3, n3) {
        return t3 = (n3 ? d2(e3, t3, n3) : t3 === Wi) ? 1 : B2(t3), (M(e3) ? Ne : Wt)(e3, t3);
      }, p2.set = function(e3, t3, n3) {
        return null == e3 ? e3 : Ft(e3, t3, n3);
      }, p2.setWith = function(e3, t3, n3, r3) {
        return r3 = "function" == typeof r3 ? r3 : Wi, null == e3 ? e3 : Ft(e3, t3, n3, r3);
      }, p2.shuffle = function(e3) {
        return (M(e3) ? Ue : Vt)(e3);
      }, p2.slice = function(e3, t3, n3) {
        var r3 = null == e3 ? 0 : e3.length;
        return r3 ? (n3 = n3 && "number" != typeof n3 && d2(e3, t3, n3) ? (t3 = 0, r3) : (t3 = null == t3 ? 0 : B2(t3), n3 === Wi ? r3 : B2(n3)), u2(e3, t3, n3)) : [];
      }, p2.sortBy = no, p2.sortedUniq = function(e3) {
        return e3 && e3.length ? Gt(e3) : [];
      }, p2.sortedUniqBy = function(e3, t3) {
        return e3 && e3.length ? Gt(e3, f2(t3, 2)) : [];
      }, p2.split = function(e3, t3, n3) {
        return n3 && "number" != typeof n3 && d2(e3, t3, n3) && (t3 = n3 = Wi), (n3 = n3 === Wi ? Gi : n3 >>> 0) ? (e3 = h2(e3)) && ("string" == typeof t3 || null != t3 && !To(t3)) && !(t3 = l2(t3)) && ha(e3) ? cn(ga(e3), 0, n3) : e3.split(t3, n3) : [];
      }, p2.spread = function(n3, r3) {
        if ("function" != typeof n3)
          throw new y2(Fi);
        return r3 = null == r3 ? 0 : w2(B2(r3), 0), a2(function(e3) {
          var t3 = e3[r3], e3 = cn(e3, 0, r3);
          return t3 && sa(e3, t3), aa(n3, this, e3);
        });
      }, p2.tail = function(e3) {
        var t3 = null == e3 ? 0 : e3.length;
        return t3 ? u2(e3, 1, t3) : [];
      }, p2.take = function(e3, t3, n3) {
        return e3 && e3.length ? u2(e3, 0, (t3 = n3 || t3 === Wi ? 1 : B2(t3)) < 0 ? 0 : t3) : [];
      }, p2.takeRight = function(e3, t3, n3) {
        var r3 = null == e3 ? 0 : e3.length;
        return r3 ? u2(e3, (t3 = r3 - (t3 = n3 || t3 === Wi ? 1 : B2(t3))) < 0 ? 0 : t3, r3) : [];
      }, p2.takeRightWhile = function(e3, t3) {
        return e3 && e3.length ? Qt(e3, f2(t3, 3), false, true) : [];
      }, p2.takeWhile = function(e3, t3) {
        return e3 && e3.length ? Qt(e3, f2(t3, 3)) : [];
      }, p2.tap = function(e3, t3) {
        return t3(e3), e3;
      }, p2.throttle = function(e3, t3, n3) {
        var r3 = true, o3 = true;
        if ("function" != typeof e3)
          throw new y2(Fi);
        return I2(n3) && (r3 = "leading" in n3 ? !!n3.leading : r3, o3 = "trailing" in n3 ? !!n3.trailing : o3), co(e3, t3, { leading: r3, maxWait: t3, trailing: o3 });
      }, p2.thru = Vr, p2.toArray = Ao, p2.toPairs = ti, p2.toPairsIn = ni, p2.toPath = function(e3) {
        return M(e3) ? la(e3, br) : S2(e3) ? [e3] : D2(mr(h2(e3)));
      }, p2.toPlainObject = Yo, p2.transform = function(e3, r3, o3) {
        var t3, n3 = M(e3), i3 = n3 || xo(e3) || Ro(e3);
        return r3 = f2(r3, 4), null == o3 && (t3 = e3 && e3.constructor, o3 = i3 ? n3 ? new t3() : [] : I2(e3) && bo(t3) ? ze(ne(e3)) : {}), (i3 ? ua : ft)(e3, function(e4, t4, n4) {
          return r3(o3, e4, t4, n4);
        }), o3;
      }, p2.unary = function(e3) {
        return oo(e3, 1);
      }, p2.union = kr, p2.unionBy = Er, p2.unionWith = Ar, p2.uniq = function(e3) {
        return e3 && e3.length ? Zt(e3) : [];
      }, p2.uniqBy = function(e3, t3) {
        return e3 && e3.length ? Zt(e3, f2(t3, 2)) : [];
      }, p2.uniqWith = function(e3, t3) {
        return t3 = "function" == typeof t3 ? t3 : Wi, e3 && e3.length ? Zt(e3, Wi, t3) : [];
      }, p2.unset = function(e3, t3) {
        return null == e3 || Kt(e3, t3);
      }, p2.unzip = Pr, p2.unzipWith = zr, p2.update = function(e3, t3, n3) {
        return null == e3 ? e3 : Jt(e3, t3, on(n3));
      }, p2.updateWith = function(e3, t3, n3, r3) {
        return r3 = "function" == typeof r3 ? r3 : Wi, null == e3 ? e3 : Jt(e3, t3, on(n3), r3);
      }, p2.values = ri, p2.valuesIn = function(e3) {
        return null == e3 ? [] : ec(e3, O2(e3));
      }, p2.without = Yr, p2.words = pi, p2.wrap = function(e3, t3) {
        return ho(on(t3), e3);
      }, p2.xor = jr, p2.xorBy = Xr, p2.xorWith = Mr, p2.zip = Wr, p2.zipObject = function(e3, t3) {
        return nn(e3 || [], t3 || [], Ge);
      }, p2.zipObjectDeep = function(e3, t3) {
        return nn(e3 || [], t3 || [], Ft);
      }, p2.zipWith = Fr, p2.entries = ti, p2.entriesIn = ni, p2.extend = Xo, p2.extendWith = Mo, Ci(p2, p2), p2.add = Ei, p2.attempt = vi, p2.camelCase = oi, p2.capitalize = ii, p2.ceil = Ai, p2.clamp = function(e3, t3, n3) {
        return n3 === Wi && (n3 = t3, t3 = Wi), n3 !== Wi && (n3 = (n3 = T2(n3)) == n3 ? n3 : 0), t3 !== Wi && (t3 = (t3 = T2(t3)) == t3 ? t3 : 0), et(T2(e3), t3, n3);
      }, p2.clone = function(e3) {
        return x2(e3, 4);
      }, p2.cloneDeep = function(e3) {
        return x2(e3, 5);
      }, p2.cloneDeepWith = function(e3, t3) {
        return x2(e3, 5, t3 = "function" == typeof t3 ? t3 : Wi);
      }, p2.cloneWith = function(e3, t3) {
        return x2(e3, 4, t3 = "function" == typeof t3 ? t3 : Wi);
      }, p2.conformsTo = function(e3, t3) {
        return null == t3 || tt(e3, t3, L2(t3));
      }, p2.deburr = ai, p2.defaultTo = function(e3, t3) {
        return null == e3 || e3 != e3 ? t3 : e3;
      }, p2.divide = Pi, p2.endsWith = function(e3, t3, n3) {
        e3 = h2(e3), t3 = l2(t3);
        var r3 = e3.length, r3 = n3 = n3 === Wi ? r3 : et(B2(n3), 0, r3);
        return 0 <= (n3 -= t3.length) && e3.slice(n3, r3) == t3;
      }, p2.eq = X, p2.escape = function(e3) {
        return (e3 = h2(e3)) && qa.test(e3) ? e3.replace($a, ic) : e3;
      }, p2.escapeRegExp = function(e3) {
        return (e3 = h2(e3)) && ru.test(e3) ? e3.replace(nu, "\\$&") : e3;
      }, p2.every = function(e3, t3, n3) {
        return (M(e3) ? ju : at)(e3, f2(t3 = n3 && d2(e3, t3, n3) ? Wi : t3, 3));
      }, p2.find = $r, p2.findIndex = Ir, p2.findKey = function(e3, t3) {
        return Vu(e3, f2(t3, 3), ft);
      }, p2.findLast = Gr, p2.findLastIndex = Sr, p2.findLastKey = function(e3, t3) {
        return Vu(e3, f2(t3, 3), dt);
      }, p2.floor = zi, p2.forEach = qr, p2.forEachRight = Zr, p2.forIn = function(e3, t3) {
        return null == e3 ? e3 : lt(e3, f2(t3, 3), O2);
      }, p2.forInRight = function(e3, t3) {
        return null == e3 ? e3 : st(e3, f2(t3, 3), O2);
      }, p2.forOwn = function(e3, t3) {
        return e3 && ft(e3, f2(t3, 3));
      }, p2.forOwnRight = function(e3, t3) {
        return e3 && dt(e3, f2(t3, 3));
      }, p2.get = No, p2.gt = go, p2.gte = _o, p2.has = function(e3, t3) {
        return null != e3 && tr(e3, t3, _t);
      }, p2.hasIn = Uo, p2.head = Tr, p2.identity = R, p2.includes = function(e3, t3, n3, r3) {
        return e3 = s2(e3) ? e3 : ri(e3), n3 = n3 && !r3 ? B2(n3) : 0, r3 = e3.length, n3 < 0 && (n3 = w2(r3 + n3, 0)), Oo(e3) ? n3 <= r3 && -1 < e3.indexOf(t3, n3) : !!r3 && -1 < fa(e3, t3, n3);
      }, p2.indexOf = function(e3, t3, n3) {
        var r3 = null == e3 ? 0 : e3.length;
        return r3 ? (n3 = null == n3 ? 0 : B2(n3), fa(e3, t3, n3 = n3 < 0 ? w2(r3 + n3, 0) : n3)) : -1;
      }, p2.inRange = function(e3, t3, n3) {
        return t3 = Po(t3), n3 === Wi ? (n3 = t3, t3 = 0) : n3 = Po(n3), (e3 = e3 = T2(e3)) >= C2(t3 = t3, n3 = n3) && e3 < w2(t3, n3);
      }, p2.invoke = qo, p2.isArguments = yo, p2.isArray = M, p2.isArrayBuffer = wo, p2.isArrayLike = s2, p2.isArrayLikeObject = m2, p2.isBoolean = function(e3) {
        return true === e3 || false === e3 || W(e3) && n2(e3) == Zi;
      }, p2.isBuffer = xo, p2.isDate = V, p2.isElement = function(e3) {
        return W(e3) && 1 === e3.nodeType && !Bo(e3);
      }, p2.isEmpty = function(e3) {
        if (null == e3)
          return true;
        if (s2(e3) && (M(e3) || "string" == typeof e3 || "function" == typeof e3.splice || xo(e3) || Ro(e3) || yo(e3)))
          return !e3.length;
        var t3, n3 = j(e3);
        if (n3 == Ji || n3 == ta)
          return !e3.size;
        if (cr(e3))
          return !St(e3).length;
        for (t3 in e3)
          if (z.call(e3, t3))
            return false;
        return true;
      }, p2.isEqual = function(e3, t3) {
        return bt(e3, t3);
      }, p2.isEqualWith = function(e3, t3, n3) {
        var r3 = (n3 = "function" == typeof n3 ? n3 : Wi) ? n3(e3, t3) : Wi;
        return r3 === Wi ? bt(e3, t3, Wi, n3) : !!r3;
      }, p2.isError = mo, p2.isFinite = function(e3) {
        return "number" == typeof e3 && ge(e3);
      }, p2.isFunction = bo, p2.isInteger = Co, p2.isLength = Do, p2.isMap = Io, p2.isMatch = function(e3, t3) {
        return e3 === t3 || Ct(e3, t3, Kn(t3));
      }, p2.isMatchWith = function(e3, t3, n3) {
        return n3 = "function" == typeof n3 ? n3 : Wi, Ct(e3, t3, Kn(t3), n3);
      }, p2.isNaN = function(e3) {
        return So(e3) && e3 != +e3;
      }, p2.isNative = function(e3) {
        if (ur(e3))
          throw new k("Unsupported core-js use. Try https://npms.io/search?q=ponyfill.");
        return Dt(e3);
      }, p2.isNil = function(e3) {
        return null == e3;
      }, p2.isNull = function(e3) {
        return null === e3;
      }, p2.isNumber = So, p2.isObject = I2, p2.isObjectLike = W, p2.isPlainObject = Bo, p2.isRegExp = To, p2.isSafeInteger = function(e3) {
        return Co(e3) && -$i <= e3 && e3 <= $i;
      }, p2.isSet = Lo, p2.isString = Oo, p2.isSymbol = S2, p2.isTypedArray = Ro, p2.isUndefined = function(e3) {
        return e3 === Wi;
      }, p2.isWeakMap = function(e3) {
        return W(e3) && j(e3) == ka;
      }, p2.isWeakSet = function(e3) {
        return W(e3) && "[object WeakSet]" == n2(e3);
      }, p2.join = function(e3, t3) {
        return null == e3 ? "" : _e.call(e3, t3);
      }, p2.kebabCase = ui, p2.last = r2, p2.lastIndexOf = function(e3, t3, n3) {
        var r3 = null == e3 ? 0 : e3.length;
        if (!r3)
          return -1;
        var o3 = r3;
        if (n3 !== Wi && (o3 = (o3 = B2(n3)) < 0 ? w2(r3 + o3, 0) : C2(o3, r3 - 1)), t3 != t3)
          return Nu(e3, $u, o3, true);
        for (var i3 = e3, a3 = t3, u3 = o3 + 1; u3--; )
          if (i3[u3] === a3)
            return u3;
        return u3;
      }, p2.lowerCase = ci, p2.lowerFirst = li, p2.lt = ko, p2.lte = Eo, p2.max = function(e3) {
        return e3 && e3.length ? ut(e3, R, gt) : Wi;
      }, p2.maxBy = function(e3, t3) {
        return e3 && e3.length ? ut(e3, f2(t3, 2), gt) : Wi;
      }, p2.mean = function(e3) {
        return Gu(e3, R);
      }, p2.meanBy = function(e3, t3) {
        return Gu(e3, f2(t3, 2));
      }, p2.min = function(e3) {
        return e3 && e3.length ? ut(e3, R, Tt) : Wi;
      }, p2.minBy = function(e3, t3) {
        return e3 && e3.length ? ut(e3, f2(t3, 2), Tt) : Wi;
      }, p2.stubArray = Ri, p2.stubFalse = ki, p2.stubObject = function() {
        return {};
      }, p2.stubString = function() {
        return "";
      }, p2.stubTrue = function() {
        return true;
      }, p2.multiply = ji, p2.nth = function(e3, t3) {
        return e3 && e3.length ? Et(e3, B2(t3)) : Wi;
      }, p2.noConflict = function() {
        return ia._ === this && (ia._ = J), this;
      }, p2.noop = Di, p2.now = ro, p2.pad = function(e3, t3, n3) {
        e3 = h2(e3);
        var r3 = (t3 = B2(t3)) ? va(e3) : 0;
        return !t3 || t3 <= r3 ? e3 : Rn(pe(t3 = (t3 - r3) / 2), n3) + e3 + Rn(he(t3), n3);
      }, p2.padEnd = function(e3, t3, n3) {
        e3 = h2(e3);
        var r3 = (t3 = B2(t3)) ? va(e3) : 0;
        return t3 && r3 < t3 ? e3 + Rn(t3 - r3, n3) : e3;
      }, p2.padStart = function(e3, t3, n3) {
        e3 = h2(e3);
        var r3 = (t3 = B2(t3)) ? va(e3) : 0;
        return t3 && r3 < t3 ? Rn(t3 - r3, n3) + e3 : e3;
      }, p2.parseInt = function(e3, t3, n3) {
        return t3 = n3 || null == t3 ? 0 : t3 && +t3, xe(h2(e3).replace(ou, ""), t3 || 0);
      }, p2.random = function(e3, t3, n3) {
        var r3;
        return n3 && "boolean" != typeof n3 && d2(e3, t3, n3) && (t3 = n3 = Wi), n3 === Wi && ("boolean" == typeof t3 ? (n3 = t3, t3 = Wi) : "boolean" == typeof e3 && (n3 = e3, e3 = Wi)), e3 === Wi && t3 === Wi ? (e3 = 0, t3 = 1) : (e3 = Po(e3), t3 === Wi ? (t3 = e3, e3 = 0) : t3 = Po(t3)), t3 < e3 && (r3 = e3, e3 = t3, t3 = r3), n3 || e3 % 1 || t3 % 1 ? (r3 = me(), C2(e3 + r3 * (t3 - e3 + Bu("1e-" + ((r3 + "").length - 1))), t3)) : jt(e3, t3);
      }, p2.reduce = function(e3, t3, n3) {
        var r3 = M(e3) ? Wu : Zu, o3 = arguments.length < 3;
        return r3(e3, f2(t3, 4), n3, o3, ot);
      }, p2.reduceRight = function(e3, t3, n3) {
        var r3 = M(e3) ? Fu : Zu, o3 = arguments.length < 3;
        return r3(e3, f2(t3, 4), n3, o3, it);
      }, p2.repeat = function(e3, t3, n3) {
        return t3 = (n3 ? d2(e3, t3, n3) : t3 === Wi) ? 1 : B2(t3), Xt(h2(e3), t3);
      }, p2.replace = function() {
        var e3 = arguments, t3 = h2(e3[0]);
        return e3.length < 3 ? t3 : t3.replace(e3[1], e3[2]);
      }, p2.result = function(e3, t3, n3) {
        var r3 = -1, o3 = (t3 = an(t3, e3)).length;
        for (o3 || (o3 = 1, e3 = Wi); ++r3 < o3; ) {
          var i3 = null == e3 ? Wi : e3[br(t3[r3])];
          i3 === Wi && (r3 = o3, i3 = n3), e3 = bo(i3) ? i3.call(e3) : i3;
        }
        return e3;
      }, p2.round = Xi, p2.runInContext = o2, p2.sample = function(e3) {
        return (M(e3) ? Ve : Mt)(e3);
      }, p2.size = function(e3) {
        if (null == e3)
          return 0;
        if (s2(e3))
          return Oo(e3) ? va(e3) : e3.length;
        var t3 = j(e3);
        return t3 == Ji || t3 == ta ? e3.size : St(e3).length;
      }, p2.snakeCase = si, p2.some = function(e3, t3, n3) {
        return (M(e3) ? Hu : Nt)(e3, f2(t3 = n3 && d2(e3, t3, n3) ? Wi : t3, 3));
      }, p2.sortedIndex = function(e3, t3) {
        return Ut(e3, t3);
      }, p2.sortedIndexBy = function(e3, t3, n3) {
        return $t(e3, t3, f2(n3, 2));
      }, p2.sortedIndexOf = function(e3, t3) {
        var n3 = null == e3 ? 0 : e3.length;
        if (n3) {
          var r3 = Ut(e3, t3);
          if (r3 < n3 && X(e3[r3], t3))
            return r3;
        }
        return -1;
      }, p2.sortedLastIndex = function(e3, t3) {
        return Ut(e3, t3, true);
      }, p2.sortedLastIndexBy = function(e3, t3, n3) {
        return $t(e3, t3, f2(n3, 2), true);
      }, p2.sortedLastIndexOf = function(e3, t3) {
        if (null == e3 ? 0 : e3.length) {
          var n3 = Ut(e3, t3, true) - 1;
          if (X(e3[n3], t3))
            return n3;
        }
        return -1;
      }, p2.startCase = fi, p2.startsWith = function(e3, t3, n3) {
        return e3 = h2(e3), n3 = null == n3 ? 0 : et(B2(n3), 0, e3.length), t3 = l2(t3), e3.slice(n3, n3 + t3.length) == t3;
      }, p2.subtract = Mi, p2.sum = function(e3) {
        return e3 && e3.length ? Ku(e3, R) : 0;
      }, p2.sumBy = function(e3, t3) {
        return e3 && e3.length ? Ku(e3, f2(t3, 2)) : 0;
      }, p2.template = function(a3, e3, t3) {
        var u3, c3, n3 = p2.templateSettings;
        t3 && d2(a3, e3, t3) && (e3 = Wi), a3 = h2(a3), e3 = Mo({}, e3, n3, Mn);
        var r3 = L2(t3 = Mo({}, e3.imports, n3.imports, Mn)), o3 = ec(t3, r3), l3 = 0, n3 = e3.interpolate || wu, s3 = "__p += '", t3 = P((e3.escape || wu).source + "|" + n3.source + "|" + (n3 === Ja ? fu : wu).source + "|" + (e3.evaluate || wu).source + "|$", "g"), i3 = "//# sourceURL=" + (z.call(e3, "sourceURL") ? (e3.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++Su + "]") + "\n";
        if (a3.replace(t3, function(e4, t4, n4, r4, o4, i4) {
          return n4 = n4 || r4, s3 += a3.slice(l3, i4).replace(xu, ac), t4 && (u3 = true, s3 += "' +\n__e(" + t4 + ") +\n'"), o4 && (c3 = true, s3 += "';\n" + o4 + ";\n__p += '"), n4 && (s3 += "' +\n((__t = (" + n4 + ")) == null ? '' : __t) +\n'"), l3 = i4 + e4.length, e4;
        }), s3 += "';\n", n3 = z.call(e3, "variable") && e3.variable) {
          if (lu.test(n3))
            throw new k("Invalid `variable` option passed into `_.template`");
        } else
          s3 = "with (obj) {\n" + s3 + "\n}\n";
        if (s3 = (c3 ? s3.replace(Ha, "") : s3).replace(Va, "$1").replace(Na, "$1;"), s3 = "function(" + (n3 || "obj") + ") {\n" + (n3 ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (u3 ? ", __e = _.escape" : "") + (c3 ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + s3 + "return __p\n}", (t3 = vi(function() {
          return E(r3, i3 + "return " + s3).apply(Wi, o3);
        })).source = s3, mo(t3))
          throw t3;
        return t3;
      }, p2.times = function(e3, t3) {
        if ((e3 = B2(e3)) < 1 || $i < e3)
          return [];
        for (var n3 = Gi, r3 = C2(e3, Gi), r3 = (t3 = f2(t3), e3 -= Gi, Ju(r3, t3)); ++n3 < e3; )
          t3(n3);
        return r3;
      }, p2.toFinite = Po, p2.toInteger = B2, p2.toLength = zo, p2.toLower = function(e3) {
        return h2(e3).toLowerCase();
      }, p2.toNumber = T2, p2.toSafeInteger = function(e3) {
        return e3 ? et(B2(e3), -$i, $i) : 0 === e3 ? e3 : 0;
      }, p2.toString = h2, p2.toUpper = function(e3) {
        return h2(e3).toUpperCase();
      }, p2.trim = function(e3, t3, n3) {
        return (e3 = h2(e3)) && (n3 || t3 === Wi) ? Qu(e3) : e3 && (t3 = l2(t3)) ? (n3 = ga(e3), e3 = ga(t3), cn(n3, nc(n3, e3), rc(n3, e3) + 1).join("")) : e3;
      }, p2.trimEnd = function(e3, t3, n3) {
        return (e3 = h2(e3)) && (n3 || t3 === Wi) ? e3.slice(0, sc(e3) + 1) : e3 && (t3 = l2(t3)) ? cn(n3 = ga(e3), 0, rc(n3, ga(t3)) + 1).join("") : e3;
      }, p2.trimStart = function(e3, t3, n3) {
        return (e3 = h2(e3)) && (n3 || t3 === Wi) ? e3.replace(ou, "") : e3 && (t3 = l2(t3)) ? cn(n3 = ga(e3), nc(n3, ga(t3))).join("") : e3;
      }, p2.truncate = function(e3, t3) {
        var n3, r3 = 30, o3 = "...", t3 = (I2(t3) && (n3 = "separator" in t3 ? t3.separator : n3, r3 = "length" in t3 ? B2(t3.length) : r3, o3 = "omission" in t3 ? l2(t3.omission) : o3), (e3 = h2(e3)).length);
        if ((t3 = ha(e3) ? (i3 = ga(e3)).length : t3) <= r3)
          return e3;
        if ((t3 = r3 - va(o3)) < 1)
          return o3;
        var i3, r3 = i3 ? cn(i3, 0, t3).join("") : e3.slice(0, t3);
        if (n3 === Wi)
          return r3 + o3;
        if (i3 && (t3 += r3.length - t3), To(n3)) {
          if (e3.slice(t3).search(n3)) {
            var a3, u3 = r3;
            for ((n3 = n3.global ? n3 : P(n3.source, h2(du.exec(n3)) + "g")).lastIndex = 0; a3 = n3.exec(u3); )
              var c3 = a3.index;
            r3 = r3.slice(0, c3 === Wi ? t3 : c3);
          }
        } else
          e3.indexOf(l2(n3), t3) == t3 || -1 < (i3 = r3.lastIndexOf(n3)) && (r3 = r3.slice(0, i3));
        return r3 + o3;
      }, p2.unescape = function(e3) {
        return (e3 = h2(e3)) && Ga.test(e3) ? e3.replace(Ua, fc) : e3;
      }, p2.uniqueId = function(e3) {
        var t3 = ++G;
        return h2(e3) + t3;
      }, p2.upperCase = di, p2.upperFirst = hi, p2.each = qr, p2.eachRight = Zr, p2.first = Tr, Ci(p2, (Yi = {}, ft(p2, function(e3, t3) {
        z.call(p2.prototype, t3) || (Yi[t3] = e3);
      }), Yi), { chain: false }), p2.VERSION = "4.17.21", ua(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(e3) {
        p2[e3].placeholder = p2;
      }), ua(["drop", "take"], function(n3, r3) {
        _2.prototype[n3] = function(e3) {
          e3 = e3 === Wi ? 1 : w2(B2(e3), 0);
          var t3 = this.__filtered__ && !r3 ? new _2(this) : this.clone();
          return t3.__filtered__ ? t3.__takeCount__ = C2(e3, t3.__takeCount__) : t3.__views__.push({ size: C2(e3, Gi), type: n3 + (t3.__dir__ < 0 ? "Right" : "") }), t3;
        }, _2.prototype[n3 + "Right"] = function(e3) {
          return this.reverse()[n3](e3).reverse();
        };
      }), ua(["filter", "map", "takeWhile"], function(e3, t3) {
        var n3 = t3 + 1, r3 = 1 == n3 || 3 == n3;
        _2.prototype[e3] = function(e4) {
          var t4 = this.clone();
          return t4.__iteratees__.push({ iteratee: f2(e4, 3), type: n3 }), t4.__filtered__ = t4.__filtered__ || r3, t4;
        };
      }), ua(["head", "last"], function(e3, t3) {
        var n3 = "take" + (t3 ? "Right" : "");
        _2.prototype[e3] = function() {
          return this[n3](1).value()[0];
        };
      }), ua(["initial", "tail"], function(e3, t3) {
        var n3 = "drop" + (t3 ? "" : "Right");
        _2.prototype[e3] = function() {
          return this.__filtered__ ? new _2(this) : this[n3](1);
        };
      }), _2.prototype.compact = function() {
        return this.filter(R);
      }, _2.prototype.find = function(e3) {
        return this.filter(e3).head();
      }, _2.prototype.findLast = function(e3) {
        return this.reverse().find(e3);
      }, _2.prototype.invokeMap = a2(function(t3, n3) {
        return "function" == typeof t3 ? new _2(this) : this.map(function(e3) {
          return xt(e3, t3, n3);
        });
      }), _2.prototype.reject = function(e3) {
        return this.filter(fo(f2(e3)));
      }, _2.prototype.slice = function(e3, t3) {
        e3 = B2(e3);
        var n3 = this;
        return n3.__filtered__ && (0 < e3 || t3 < 0) ? new _2(n3) : (e3 < 0 ? n3 = n3.takeRight(-e3) : e3 && (n3 = n3.drop(e3)), t3 !== Wi ? (t3 = B2(t3)) < 0 ? n3.dropRight(-t3) : n3.take(t3 - e3) : n3);
      }, _2.prototype.takeRightWhile = function(e3) {
        return this.reverse().takeWhile(e3).reverse();
      }, _2.prototype.toArray = function() {
        return this.take(Gi);
      }, ft(_2.prototype, function(l3, e3) {
        var s3 = /^(?:filter|find|map|reject)|While$/.test(e3), f3 = /^(?:head|last)$/.test(e3), d3 = p2[f3 ? "take" + ("last" == e3 ? "Right" : "") : e3], h3 = f3 || /^find/.test(e3);
        d3 && (p2.prototype[e3] = function() {
          function e4(e5) {
            return e5 = d3.apply(p2, sa([e5], r3)), f3 && u3 ? e5[0] : e5;
          }
          var t3, n3 = this.__wrapped__, r3 = f3 ? [1] : arguments, o3 = n3 instanceof _2, i3 = r3[0], a3 = o3 || M(n3), u3 = (a3 && s3 && "function" == typeof i3 && 1 != i3.length && (o3 = a3 = false), this.__chain__), i3 = !!this.__actions__.length, c3 = h3 && !u3, o3 = o3 && !i3;
          return !h3 && a3 ? (n3 = o3 ? n3 : new _2(this), (t3 = l3.apply(n3, r3)).__actions__.push({ func: Vr, args: [e4], thisArg: Wi }), new g2(t3, u3)) : c3 && o3 ? l3.apply(this, r3) : (t3 = this.thru(e4), c3 ? f3 ? t3.value()[0] : t3.value() : t3);
        });
      }), ua(["pop", "push", "shift", "sort", "splice", "unshift"], function(e3) {
        var n3 = H[e3], r3 = /^(?:push|sort|unshift)$/.test(e3) ? "tap" : "thru", o3 = /^(?:pop|shift)$/.test(e3);
        p2.prototype[e3] = function() {
          var e4, t3 = arguments;
          return o3 && !this.__chain__ ? (e4 = this.value(), n3.apply(M(e4) ? e4 : [], t3)) : this[r3](function(e5) {
            return n3.apply(M(e5) ? e5 : [], t3);
          });
        };
      }), ft(_2.prototype, function(e3, t3) {
        var n3, r3 = p2[t3];
        r3 && (n3 = r3.name + "", z.call(Te, n3) || (Te[n3] = []), Te[n3].push({ name: t3, func: r3 }));
      }), Te[Bn(Wi, 2).name] = [{ name: "wrapper", func: Wi }], _2.prototype.clone = function() {
        var e3 = new _2(this.__wrapped__);
        return e3.__actions__ = D2(this.__actions__), e3.__dir__ = this.__dir__, e3.__filtered__ = this.__filtered__, e3.__iteratees__ = D2(this.__iteratees__), e3.__takeCount__ = this.__takeCount__, e3.__views__ = D2(this.__views__), e3;
      }, _2.prototype.reverse = function() {
        var e3;
        return this.__filtered__ ? ((e3 = new _2(this)).__dir__ = -1, e3.__filtered__ = true) : (e3 = this.clone()).__dir__ *= -1, e3;
      }, _2.prototype.value = function() {
        var e3 = this.__wrapped__.value(), t3 = this.__dir__, n3 = M(e3), r3 = t3 < 0, o3 = n3 ? e3.length : 0, i3 = function(e4, t4, n4) {
          var r4 = -1, o4 = n4.length;
          for (; ++r4 < o4; ) {
            var i4 = n4[r4], a4 = i4.size;
            switch (i4.type) {
              case "drop":
                e4 += a4;
                break;
              case "dropRight":
                t4 -= a4;
                break;
              case "take":
                t4 = C2(t4, e4 + a4);
                break;
              case "takeRight":
                e4 = w2(e4, t4 - a4);
            }
          }
          return { start: e4, end: t4 };
        }(0, o3, this.__views__), a3 = i3.start, u3 = (i3 = i3.end) - a3, c3 = r3 ? i3 : a3 - 1, l3 = this.__iteratees__, s3 = l3.length, f3 = 0, d3 = C2(u3, this.__takeCount__);
        if (!n3 || !r3 && o3 == u3 && d3 == u3)
          return en(e3, this.__actions__);
        var h3 = [];
        e:
          for (; u3-- && f3 < d3; ) {
            for (var p3 = -1, v3 = e3[c3 += t3]; ++p3 < s3; ) {
              var g3 = l3[p3], _3 = g3.iteratee, g3 = g3.type, _3 = _3(v3);
              if (2 == g3)
                v3 = _3;
              else if (!_3) {
                if (1 == g3)
                  continue e;
                break e;
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
        var e3 = this.__index__ >= this.__values__.length;
        return { done: e3, value: e3 ? Wi : this.__values__[this.__index__++] };
      }, p2.prototype.plant = function(e3) {
        for (var t3, n3 = this; n3 instanceof je; )
          var r3 = Dr(n3), o3 = (r3.__index__ = 0, r3.__values__ = Wi, t3 ? o3.__wrapped__ = r3 : t3 = r3, r3), n3 = n3.__wrapped__;
        return o3.__wrapped__ = e3, t3;
      }, p2.prototype.reverse = function() {
        var e3 = this.__wrapped__;
        return e3 instanceof _2 ? (e3 = e3, (e3 = (e3 = this.__actions__.length ? new _2(this) : e3).reverse()).__actions__.push({ func: Vr, args: [Rr], thisArg: Wi }), new g2(e3, this.__chain__)) : this.thru(Rr);
      }, p2.prototype.toJSON = p2.prototype.valueOf = p2.prototype.value = function() {
        return en(this.__wrapped__, this.__actions__);
      }, p2.prototype.first = p2.prototype.head, ue && (p2.prototype[ue] = function() {
        return this;
      }), p2;
    }();
    o ? ((o.exports = _a)._ = _a, r._ = _a) : ia._ = _a;
  }.call(commonjsGlobal);
}(lodash, lodash.exports);
const CancasSafeArea = 1e5, DPI = window.devicePixelRatio || 1, DEFAULT_CONFIG = { daubConfig: { lineWidth: 20, strokeStyle: "white" }, tagConfig: { fontSize: 20, showText: true, fillStyle: "rgba(242, 88, 85, 0.5)", textFillStyle: "rgba(255, 255, 255, 0.6)", hoverStrokeStyle: "#F25856", hoverLineWidth: 1, hoverLineDash: [5], highlightStrokeStyle: "yellow", highlightLineWidth: 2, highlightLineDash: [5], customDraw() {
} }, layerConfig: { fillStyle: "rgba(0, 0, 0, 0.6)" }, cropConfig: { lineDash: [], strokeStyle: "rgba(255, 255, 255, 1)", lineWidth: 2, customDraw() {
} }, dotConfig: { lineDash: [], lineWidth: 2, strokeStyle: "transparent", hoverFillStyle: "#69B1FF", fillStyle: "#24FF6E", radius: 50 } }, defaultWH = { width: 0, height: 0 }, defaultPoint = { x: void 0, y: void 0 };
function clearCanvas(e) {
  e.clearRect(-CancasSafeArea / 2, -CancasSafeArea / 2, CancasSafeArea, CancasSafeArea);
}
function loadImage(e, t) {
  let n = new Image();
  return t && (n.crossOrigin = "anonymous"), n.src = e, new Promise((e2, t2) => {
    n.complete ? e2(n) : (n.onload = function() {
      e2(n);
    }, n.onerror = function() {
      t2("\u56FE\u7247\u52A0\u8F7D\u5931\u8D25:" + n.src);
    });
  });
}
function drawImage(e, t, n, r, o, i) {
  e.imageSmoothingEnabled = true, e.imageSmoothingQuality = "high", e.drawImage(t, n, r, o, i);
}
function drawLayerBg(e, t) {
  e.fillStyle = t.layerConfig.fillStyle, e.fillRect(-CancasSafeArea / 2, -CancasSafeArea / 2, CancasSafeArea, CancasSafeArea);
}
function drawLayerImageData(e, t, n, r, o) {
  e.clearRect(t, n, r, o);
}
function drawLayerBorder(e, t, n, r, o, i, a) {
  i = lodash.exports.cloneDeep(i.cropConfig);
  a && a.cropConfig && Object.assign(i, a.cropConfig), e.setLineDash(i.lineDash), e.strokeStyle = i.strokeStyle, e.lineWidth = i.lineWidth, e.strokeRect(t, n, r, o);
}
function getElementWH(e) {
  e = e.getClientRects()[0];
  return e ? { top: e.top, right: e.right, bottom: e.bottom, left: e.left, width: e.width, height: e.height, x: e.x, y: e.y } : void 0;
}
function initCanvasWH(e, t) {
  e.canvas.width = t.width, e.canvas.height = t.height;
}
function initScale(e, t) {
  var n = e.width / t.width, e = e.height / t.height;
  return { scale: n < e ? n : e, fit: n < e ? "height" : "width" };
}
function getVariableType(e) {
  let t = Object.prototype.toString.call(e);
  return t.slice(8, t.length - 1);
}
function amendDpi(n, e = ["width", "height"], r = false) {
  try {
    var o = getVariableType(n);
    let t = r ? 1 / DPI : DPI;
    if ("Number" === o)
      return n * t;
    e.forEach((e2) => {
      n[e2] *= t;
    });
  } catch (e2) {
  }
  return n;
}
function amendMobileTouchEventDpi(e) {
  return Array.from(e.touches || []).map((e2) => {
    return amendDpi({ clientX: e2.clientX, clientY: e2.clientY }, ["clientX", "clientY"]);
  });
}
function drawCropRect(e, t, n, r, o, i, a) {
  a || (clearCanvas(e), drawLayerBg(e, i)), drawLayerImageData(e, t, n, r, o), drawLayerBorder(e, t, n, r, o, i);
}
function drawDuabPointList(n, r, e, o) {
  let i, a;
  r.forEach((e2, t) => {
    n && (i = r[t - 1] || e2, a = e2, n.beginPath(), n.lineJoin = "round", n.lineCap = "round", n.lineWidth = e2.lineWidth || o.daubConfig.lineWidth, n.strokeStyle = e2.strokeStyle || o.daubConfig.strokeStyle, n.moveTo(i._x || i.x, i._y || i.y), n.lineTo(a._x || a.x, a._y || a.y), n.stroke());
  });
}
function drawCropList(r, e, o, i, a, t) {
  t || (clearCanvas(r), drawLayerBg(r, i)), e.forEach((e2) => {
    var _a;
    let t2 = transfromBoxToRect(e2, e2.__scale, o), n = (a && (t2[0] += a.offsetX, t2[1] += a.offsetY), drawLayerImageData(r, ...t2), drawLayerBorder(r, ...t2, i, e2), lodash.exports.cloneDeep(i.cropConfig));
    e2 && e2.cropConfig && Object.assign(n, e2.cropConfig), (_a = n.customDraw) == null ? void 0 : _a.call(n, r, { target: e2, positions: t2 });
  });
}
function pointIsInBoxList(n, r, t = 1, o = { x: 0, y: 0 }) {
  let i = [], a = [], e = r.map((e2) => transfromBoxSize2Visual(e2, t, o));
  return e.forEach((e2, t2) => {
    pointIsInBox(n, e2) && (i.push(r[t2]), a.push(t2));
  }), { boxList: i, indexList: a };
}
function transfromBoxSize2Visual(e, t, n) {
  let r = lodash.exports.cloneDeep(e);
  return r.startX = r.startX * t + n.x, r.endX = r.endX * t + n.x, r.startY = r.startY * t + n.y, r.endY = r.endY * t + n.y, r;
}
function pointIsInBox(e, t) {
  return e.x >= t.startX && e.x <= t.endX && e.y >= t.startY && e.y <= t.endY;
}
function pointIsInRect(e, t) {
  let n = t[0], r = t[0] + t[2], o = t[1], i = t[1] + t[3];
  return e.x >= n && e.x <= r && e.y >= o && e.y <= i;
}
function transfromTwoPoints2Rect(e, t) {
  var n = Math.abs(t.x - e.x), r = Math.abs(t.y - e.y);
  return [Math.min(e.x, t.x), Math.min(e.y, t.y), n, r];
}
function fixBoxInfo(e) {
  let t = e;
  var { startX: e, startY: n, endX: r, endY: o } = t, i = Math.abs(e - r), a = Math.abs(n - o), e = Math.min(e, r), n = Math.min(n, o);
  return t.startX = e, t.startY = n, t.endX = e + i, t.endY = n + a, { info: t, position: [e, n, i, a] };
}
function getTwoBoxIntersectPart(e, t) {
  var e = fixBoxInfo(e), t = fixBoxInfo(t), n = Math.min(e.info.startY, t.info.startY), r = Math.max(e.info.endY, t.info.endY);
  let o;
  Math.abs(r - n) < e.position[3] + t.position[3] && (o = { startY: Math.max(e.info.startY, t.info.startY), endY: Math.min(e.info.endY, t.info.endY) });
  r = Math.min(e.info.startX, t.info.startX), n = Math.max(e.info.endX, t.info.endX), n = Math.abs(n - r), r = e.position[2] + t.position[2];
  let i;
  if (void 0 !== (i = n < r ? { startX: Math.max(e.info.startX, t.info.startX), endX: Math.min(e.info.endX, t.info.endX) } : i) && void 0 !== o)
    return Object.assign(o, i);
}
function transfromDotToArc(e, t = 1, n = { x: 0, y: 0 }, r, o) {
  return [e.x * t + n.x + ((o == null ? void 0 : o.offsetX) || 0), e.y * t + n.y + ((o == null ? void 0 : o.offsetY) || 0), r * t, 0, 2 * Math.PI];
}
function transfromBoxToRect(e, t = 1, n = { x: 0, y: 0 }) {
  var e = fixBoxInfo(e), { startX: r, startY: o } = e.info, i = e.position[2], e = e.position[3];
  return [r * t + n.x, o * t + n.y, i * t, e * t];
}
function isBoxValidity(e) {
  e = transfromBoxToRect(e);
  return 5 <= e[2] && 5 <= e[3];
}
function drawTagRect(e, t, n, r, o, i, a, u, c, l, s, f, d) {
  let h = lodash.exports.cloneDeep(i.tagConfig);
  if (f && Object.assign(h, f), e.font = h.fontSize + "px sans-serif", u || c) {
    !c || u && "move" === u.type || (e.fillStyle = h.fillStyle, e.fillRect(t, n, r, o), a && h.showText && (i = parseFloat(e.font.split(" ")[0]), e.fillStyle = h.textFillStyle, e.fillText(s || a + "", t + 4, n + o / 2 + i / 2))), l && (e.strokeStyle = h.highlightStrokeStyle, e.lineWidth = h.highlightLineWidth, e.setLineDash(h.highlightLineDash), e.strokeRect(t, n, r, o));
    if (u && pointIsInRect(u, [t, n, r, o])) {
      if ("click" === u.type)
        return { isShow: c = !c, isCrash: true };
      "move" !== u.type || c || (e.strokeStyle = h.hoverStrokeStyle, e.lineWidth = h.hoverLineWidth, e.setLineDash(h.hoverLineDash), e.strokeRect(t, n, r, o));
    }
    h.customDraw(e, { target: d, positions: [t, n, r, o] });
  }
}
function drawTagList(r, e, o, i, a = { offsetX: 0, offsetY: 0 }, u) {
  let c = false, l = [];
  return e.forEach((e2) => {
    let t = transfromBoxToRect(e2, e2.__scale, o);
    t[0] += a.offsetX, t[1] += a.offsetY;
    var n = drawTagRect(r, ...t, i, (e2.__index || 0) + 1, u, e2.isShow, e2.showOutLine, e2.labelText, e2.tagConfig, e2);
    void 0 !== n && (e2.isShow = n.isShow, n.isCrash && (c = true, l.push(e2)));
  }), { isReDraw: c, redrawList: l };
}
function fixMoveRectPosition(e, t, n) {
  n = fixPoint({ x: e[0], y: e[1] }, t, n);
  return e[0] = n.x, e[1] = n.y, e[2] /= t / DPI, e[3] /= t / DPI, e;
}
function moveDrawCropRect(t, n, r, o, i, a, u, c) {
  if (void 0 !== n.x && void 0 !== r.x) {
    let e = fixMoveRectPosition(transfromTwoPoints2Rect(n, r), o, i);
    if (e[2] = amendDpi(e[2], void 0, true), e[3] = amendDpi(e[3], void 0, true), 5 < e[2] || 5 < e[3])
      return drawCropList(t, a, u, c), drawCropRect(t, ...e, c, true), e;
  }
}
function drawDotList(n, e, r, o, i, t) {
  e.forEach((e2) => {
    n.beginPath();
    var t2 = lodash.exports.cloneDeep(o.dotConfig), e2 = (e2.dotConfig && Object.assign(t2, e2.dotConfig), n.fillStyle = e2.__isHover ? t2.hoverFillStyle : t2.fillStyle, n.strokeStyle = t2.strokeStyle, n.lineWidth = t2.lineWidth, n.setLineDash(t2.lineDash), transfromDotToArc(e2, e2.__scale, r, t2.radius, i));
    n.arc(...e2), n.fill(), n.stroke();
  });
}
function getVertexPositionByTwoPoints(e, t) {
  return (e.x <= t.x ? "left" : "right") + "-" + (e.y <= t.y ? "top" : "bottom");
}
function getPointByBoxAndVertexPosition(e, t) {
  t = t.split("-");
  return { x: "left" === t[0] ? e.startX : e.endX, y: "top" === t[1] ? e.startY : e.endY };
}
function moveDrawTagRect(t, n, r, o, i, a, u, c) {
  if (void 0 !== n.x && void 0 !== r.x) {
    let e = fixMoveRectPosition(transfromTwoPoints2Rect(n, r), o, i);
    if (e[2] = amendDpi(e[2], void 0, true), e[3] = amendDpi(e[3], void 0, true), 5 < e[2] || 5 < e[3])
      return drawTagList(t, a, u, c), drawTagRect(t, ...e, c, a.length + 1, void 0, true, void 0, c.drawingText, void 0, void 0), e;
  }
}
function getTwoPointsOffsetInfo(e, t, n) {
  var r = transfromTwoPoints2Rect(e, t), o = (t.x - e.x) / n, t = (t.y - e.y) / n;
  let i = false;
  return { isStartMove: i = 5 < r[2] || 5 < r[3] ? true : i, offsetInfo: { offsetX: o, offsetY: t } };
}
function moveCanvas(e, t, n, r, o, i, a, u, c, l, s, f, d) {
  if (void 0 !== a.x && void 0 !== u.x) {
    a = getTwoPointsOffsetInfo(a, u, l);
    if (a.isStartMove)
      return { offsetX: u, offsetY: l } = a.offsetInfo, clearCanvas(e), drawImage(e, n, (e = { x: i.x + u, y: i.y + l }).x, e.y, r.width * o, r.height * o), drawCropList(t, c, i, d, a.offsetInfo), drawTagList(t, s, i, d, { offsetX: u, offsetY: l }), drawDotList(t, f, i, d, a.offsetInfo), { offsetX: u, offsetY: l };
  }
}
function fixPoint(e, t, n) {
  return { x: e.x / t + n.x, y: e.y / t + n.y };
}
function getTouchPoint(e, t, n, r) {
  e = fixPoint({ x: e.layerX, y: e.layerY }, t, n);
  return { x: e.x, y: e.y, type: r };
}
function moveDrawUnshowTagDashRect(t, e, i, a, u, c, l, s, n, f, d) {
  if ("tag" === e && !n) {
    let e2 = i.filter((e3) => !e3.isShow), n2 = false, r = getTouchPoint(l, a, c, "move"), o = [];
    e2.forEach((e3) => {
      var t2 = transfromBoxToRect(e3, e3.__scale, u);
      pointIsInRect(r, t2) && (o.push(e3), n2 = true);
    }), n2 ? (f = true, drawTagList(t, o, u, d, void 0, r)) : f && (drawCropList(t, s, u, d), drawTagList(t, i, u, d), f = false);
  }
  return f;
}
function getBoxFourBorderRect(e, t, n = -1, r) {
  e = transfromBoxToRect(e, e.__scale, t), t = null != r ? r : device.mobile() ? 6 * DPI : 6, r = t / 2;
  return [{ index: n, name: "left-top", type: "vertex", positions: [e[0] - r, e[1] - r, t, t] }, { index: n, name: "right-top", type: "vertex", positions: [e[0] + e[2] - r, e[1] - r, t, t] }, { index: n, name: "left-bottom", type: "vertex", positions: [e[0] - r, e[1] + e[3] - r, t, t] }, { index: n, name: "right-bottom", type: "vertex", positions: [e[0] + e[2] - r, e[1] + e[3] - r, t, t] }, { index: n, name: "left", type: "border", positions: [e[0] - r, e[1] + r, t, e[3] - r] }, { index: n, name: "top", type: "border", positions: [e[0] + r, e[1] - r, e[2] - r, t] }, { index: n, name: "right", type: "border", positions: [e[0] + e[2] - r, e[1] + r, t, e[3] - r] }, { index: n, name: "bottom", type: "border", positions: [e[0] + r, e[1] + e[3] - r, e[2] - r, t] }];
}
function pointIsInRectList(n, e) {
  let r = false, o = [], i = [];
  return e.forEach((e2, t) => {
    pointIsInRect(n, e2) && (r = true, o.push(e2), i.push(t));
  }), { hasIn: r, coverList: o, coverIndexList: i };
}
function detectEventIsTriggerOnBoxBorderOrVertex(e, t, n, r, o) {
  e = getTouchPoint(e, n, o, "move");
  let i = t.map((e2, t2) => getBoxFourBorderRect(e2, r, t2)).flat(), a = pointIsInRectList(e, i.map((e2) => e2.positions));
  return { hasIn: a.hasIn, list: a.coverIndexList.map((e2) => i[e2]) };
}
function findOneBorderOrVertex(e) {
  e = e.find((e2) => "vertex" === e2.type) || e[0];
  if (e)
    return e;
  throw new Error("findOneBorderOrVertex list may be empty.");
}
function moveDetectBoxBorderSetCursor(e, t, n, r, o, i, a) {
  a || ((a = detectEventIsTriggerOnBoxBorderOrVertex(t, n, r, o, i)).hasIn ? ("left-top" !== (t = findOneBorderOrVertex(a.list).name) && "right-bottom" !== t || (e.style.cursor = "nwse-resize"), "right-top" !== t && "left-bottom" !== t || (e.style.cursor = "nesw-resize"), "left" !== t && "right" !== t || (e.style.cursor = "col-resize"), "top" !== t && "bottom" !== t || (e.style.cursor = "row-resize")) : e.style.cursor = "auto");
}
function getResizeBoundingBoxInfo(e, t, n) {
  if (!n)
    return e;
  let r = lodash.exports.cloneDeep(e), o = n.name;
  var { offsetX: e, offsetY: n } = t;
  return o.includes("left") && (r.startX += e), o.includes("top") && (r.startY += n), o.includes("right") && (r.endX += e), o.includes("bottom") && (r.endY += n), r;
}
function moveResizeBox(e, t, n, r, o, i, a, u, c, l, s) {
  if (t && void 0 !== t.x && n && void 0 !== n.x) {
    var t = getTwoPointsOffsetInfo(t, n, i);
    if (t.isStartMove)
      return { offsetX: n, offsetY: i } = t.offsetInfo, t = transfromBoxToRect(getResizeBoundingBoxInfo(r, { offsetX: n / o, offsetY: i / o }, c), o, a), drawCropList(e, l, a, s), "crop" == s.mode && drawCropRect(e, ...t, s, true), drawTagList(e, u, a, s), "tag" == s.mode && drawTagRect(e, ...t, s, (r.__index || 0) + 1, void 0, r.isShow, r.showOutLine, r.labelText, r.tagConfig, void 0), t;
  }
}
function getHypotenuseValue(e, t) {
  return Math.sqrt(Math.pow(e, 2) + Math.pow(t, 2));
}
function getDotDistence(e, t) {
  return Math.abs(e - t);
}
function getTwoFingerTouchListDistence(e) {
  return { width: getDotDistence(e[0].clientX, e[1].clientX), height: getDotDistence(e[0].clientY, e[1].clientY) };
}
function transfromRect2Box(e, t, n = 1) {
  return fixBoxInfo({ startX: (e[0] - t.x) / n, startY: (e[1] - t.y) / n, endX: (e[0] + e[2] - t.x) / n, endY: (e[1] + e[3] - t.y) / n }).info;
}
function initBoundingArrScale(e, n, r) {
  return e.map((e2, t) => (e2.__scale = n, e2.__index = t, fixBoxInfo(transformBoxPrecision(e2, r)).info));
}
function initDotArrScale(e, n, r) {
  return e.map((e2, t) => (e2.__scale = n, e2.__index = t, transformDotPrecision(e2, r)));
}
function initDaubStackList(e, t, n) {
  return e.map((e2) => e2.map((e3) => ({ ...e3, _x: e3.x * n + t.x, _y: e3.y * n + t.y })));
}
function getBoxIsIntersectWithBoxList(e, t) {
  for (const n of t)
    if (getTwoBoxIntersectPart(e, n))
      return true;
  return false;
}
function boxIsAllInOtherBox(e, t) {
  t = getTwoBoxIntersectPart(e, t);
  return !(!t || t.startX !== e.startX || t.endX !== e.endX || t.startY !== e.startY || t.endY !== e.endY);
}
function boxAllInBoxList(n, e) {
  let r = [], o = [];
  return e.forEach((e2, t) => {
    boxIsAllInOtherBox(n, e2) && (o.push(e2), r.push(t));
  }), { boxList: o, indexList: r };
}
function transformTagListBoxRelativeTo(t, n, e) {
  return e.map((e2) => transformTagBoxRelativeTo(t, n, e2));
}
function transformTagBoxRelativeTo(e, t, n) {
  let r = lodash.exports.cloneDeep(n);
  return "img" === e && (r.startX = r.startX + t.startX, r.startY = r.startY + t.startY, r.endX = r.endX + t.startX, r.endY = r.endY + t.startY), "crop" === e && (r.startX = r.startX - t.startX, r.startY = r.startY - t.startY, r.endX = r.endX - t.startX, r.endY = r.endY - t.startY), r;
}
function transformBoxPrecision(e, t) {
  return e.startX = numFixPrecision(e.startX, t), e.endX = numFixPrecision(e.endX, t), e.startY = numFixPrecision(e.startY, t), e.endY = numFixPrecision(e.endY, t), e;
}
function transformDotPrecision(e, t) {
  return e.x = numFixPrecision(e.x, t), e.y = numFixPrecision(e.y, t), e.raduis = numFixPrecision(e.raduis || 0, t), e;
}
function numFixPrecision(e, t) {
  return parseFloat(e.toFixed(t));
}
function pointInDot(e, t, n) {
  n = lodash.exports.cloneDeep(n.dotConfig), t.dotConfig && Object.assign(n, t.dotConfig), e = (e.x - t.x) ** 2 + (e.y - t.y) ** 2;
  return e <= n.radius ** 2;
}
var ImgMark_vue_vue_type_style_index_0_scoped_true_lang = "", _export_sfc = (e, t) => {
  const n = e.__vccOpts || e;
  for (var [r, o] of t)
    n[r] = o;
  return n;
};
const _withScopeId = (e) => (pushScopeId("data-v-079c1b1a"), e = e(), popScopeId(), e), _hoisted_1 = ["onTouchmove", "onTouchstart", "onTouchend"], _hoisted_2 = { key: 0, class: "mode-panel" }, _hoisted_3 = { class: "status" }, _hoisted_4 = { class: "text" }, _hoisted_5 = { class: "tip" }, _hoisted_6 = _withScopeId(() => createElementVNode("kbd", null, "Ctrl", -1)), _hoisted_7 = createTextVNode(" + "), _hoisted_8 = _withScopeId(() => createElementVNode("kbd", null, "B", -1)), _hoisted_9 = _withScopeId(() => createElementVNode("span", { style: { "font-size": "14px", "margin-left": "10px" } }, "\u5207\u6362\u6A21\u5F0F", -1)), _sfc_main = defineComponent({ props: { cropConfig: { default: () => DEFAULT_CONFIG.cropConfig }, daubConfig: { default: () => DEFAULT_CONFIG.daubConfig }, layerConfig: { default: () => DEFAULT_CONFIG.layerConfig }, tagConfig: { default: () => DEFAULT_CONFIG.tagConfig }, dotConfig: { default: () => DEFAULT_CONFIG.dotConfig }, drawingText: null, isShowTip: { type: Boolean, default: false }, enableScale: { type: Boolean, default: true }, enableMove: { type: Boolean, default: true }, enableDrawCrop: { type: Boolean, default: true }, enableDrawTag: { type: Boolean, default: true }, initScale: { type: Boolean, default: true }, enableInteractiveTagChangeStatus: { type: Boolean, default: true }, enableCropCross: { type: Boolean, default: false }, handleResizeCropCross: { default: "reset" }, enableInteractiveCropDelete: { type: Boolean, default: true }, enableCropResize: { type: Boolean, default: true }, enableTagResize: { type: Boolean, default: false }, enableDrawCropOutOfImg: { type: Boolean, default: true }, enableDrawTagOutOfCrop: { type: Boolean, default: true }, enableDrawTagOutOfImg: { type: Boolean, default: true }, isImgCrop: { type: Boolean, default: false }, isCropSingle: { type: Boolean, default: false }, cropList: { default: () => Array() }, tagList: { default: () => Array() }, daubStack: { default: () => Array() }, dotList: { default: () => Array() }, mode: { default: "crop" }, mobileOperation: { default: "move" }, src: null, precision: { default: 0 }, splitClickAndDoubleClickEvent: { type: Boolean, default: false }, disableDefaultShortcuts: { default: () => Array() }, customDrawTopCtx: null }, emits: ["update:cropList", "update:daubStack", "cropListChange", "update:tagList", "update:dotList", "tagListChange", "update:mode", "update:mobileOperation", "resizeStart", "resizeEnd", "delCrop", "drawCropStart", "drawTagStart", "mouseOverInfo", "onLoadImage"], setup(z, { expose: Y, emit: a }) {
  const u = z;
  let r = false, n = void 0, j = void 0, X = null, o = null, i = { last: { down: void 0, up: void 0 }, prev: { down: void 0, up: void 0 } };
  const M = device.mobile() ? 0.1 / DPI * 1.5 : 0.1;
  let W = M, F = false;
  function H() {
    o = null, F = false, W = M, O.resizeHovering = void 0;
  }
  let c = false, l = null, s = null, f, d = lodash.exports.cloneDeep(defaultWH), h = lodash.exports.cloneDeep(defaultWH), p = lodash.exports.cloneDeep(defaultPoint), v = lodash.exports.cloneDeep(defaultPoint), g = lodash.exports.cloneDeep(defaultPoint), V = { x: 0, y: 0 }, N = 0, _ = { x: 0, y: 0 }, y = { x: 0, y: 0 }, w = ref(1), x, e, U = 1, m, b = ref(1), C, D = [], I = [], S = [], B = [], $ = ref({ scale: 1, zoomScale: 1 }), T = (watch(() => [w.value, b.value, U], () => {
    $.value.scale = w.value, $.value.zoomScale = b.value;
  }), computed(() => {
    let e2 = lodash.exports.cloneDeep(DEFAULT_CONFIG);
    return Object.assign(e2.cropConfig, u.cropConfig), Object.assign(e2.tagConfig, u.tagConfig), Object.assign(e2.layerConfig, u.layerConfig), Object.assign(e2.daubConfig, u.daubConfig), Object.assign(e2.dotConfig, u.dotConfig), e2.drawingText = u.drawingText, e2.mode = u.mode, e2;
  }));
  let L = ref(), G = ref(), q = ref(), O = { isScaleing: false, isDrawRecting: false, isMoving: false, resizeHovering: void 0, isMouseDown: () => void 0 !== p.x, isMouseUpDownPoints: () => void 0 !== p.x && void 0 !== v.x };
  const R = { dragCreatRectInterrupt() {
    ie();
  }, dragCreatOrResizeRect(e2) {
    var _a, _b;
    if (s && ("drawDot" == e2 && drawDotList(s, S, _, T.value), "drawCrop" == e2 && (u.isCropSingle && !O.isDrawRecting && (I = []), O.isDrawRecting || a("drawCropStart"), O.isDrawRecting = true, C = moveDrawCropRect(s, p, v, b.value, y, I, _, T.value), drawTagList(s, D, _, T.value), (_a = u.customDrawTopCtx) == null ? void 0 : _a.call(u, s, k)), "drawTag" == e2 && (O.isDrawRecting || a("drawTagStart"), O.isDrawRecting = true, drawCropList(s, I, _, T.value), C = moveDrawTagRect(s, p, v, b.value, y, D, _, T.value), (_b = u.customDrawTopCtx) == null ? void 0 : _b.call(u, s, k)), "resize" == e2)) {
      let e3 = { crop() {
        var _a2;
        u.enableCropResize && O.resizeHovering && s ? (o = I[O.resizeHovering.index || 0], O.resizeHovering && o && (O.isDrawRecting = true, C = moveResizeBox(s, p, v, o, o.__scale || 1, b.value, _, D, O.resizeHovering, I.filter((e4, t2) => {
          var _a3;
          return t2 !== ((_a3 = O.resizeHovering) == null ? void 0 : _a3.index);
        }), T.value), (_a2 = u.customDrawTopCtx) == null ? void 0 : _a2.call(u, s, k))) : R.move();
      }, tag() {
        var _a2;
        u.enableTagResize && O.resizeHovering && s ? (o = D[O.resizeHovering.index || 0], O.resizeHovering && o && (O.isDrawRecting = true, C = moveResizeBox(s, p, v, o, o.__scale || 1, b.value, _, D.filter((e4, t2) => {
          var _a3;
          return t2 !== ((_a3 = O.resizeHovering) == null ? void 0 : _a3.index);
        }), O.resizeHovering, I, T.value), (_a2 = u.customDrawTopCtx) == null ? void 0 : _a2.call(u, s, k))) : R.move();
      }, daub() {
      }, dot() {
      } };
      e3[u.mode]();
    }
  }, changeMode() {
    "tag" === u.mode ? a("update:mode", "crop") : a("update:mode", "tag");
  }, scale(e2, t2) {
    if (!f || !l || !s)
      throw new Error("can't find canvas ctx or img");
    O.isScaleing = true, l.translate(y.x, y.y), s.translate(y.x, y.y), y = { x: y.x - (t2.x / (b.value * e2) - t2.x / b.value), y: y.y - (t2.y / (b.value * e2) - t2.y / b.value) }, l.scale(e2, e2), s.scale(e2, e2), l.translate(-y.x, -y.y), s.translate(-y.x, -y.y), b.value *= e2, clearCanvas(l), clearCanvas(s), drawImage(l, f, _.x, _.y, h.width * w.value, h.height * w.value), E(), F = false, O.isScaleing = false;
  }, move() {
    var _a;
    if (u.enableMove && l && s && f && !O.isScaleing) {
      O.isMoving = true;
      let t2 = moveCanvas(l, s, f, h, w.value, _, p, v, I, b.value, D, S, T.value);
      (_a = u.customDrawTopCtx) == null ? void 0 : _a.call(u, s, (e2) => k(e2).map((e3) => (t2 && (e3[0] += t2.offsetX, e3[1] += t2.offsetY), e3))), t2 && (e = lodash.exports.cloneDeep(_)) && (e.x += t2.offsetX, e.y += t2.offsetY);
    }
  }, scrollIntoView(n2) {
    if (l && s && f) {
      var r2 = transfromBoxToRect(n2, w.value, _);
      n2.__scale = w.value;
      let e2 = lodash.exports.take(getBoxFourBorderRect(n2, _, void 0, 0), 4).map((e3) => {
        return { x: e3.positions[0] - y.x, y: e3.positions[1] - y.y };
      }), t2 = [0, 0, ((d == null ? void 0 : d.width) || 0) / b.value, ((d == null ? void 0 : d.height) || 0) / b.value];
      e2.every((e3) => !pointIsInRect(e3, t2)) && (_ = { x: _.x - r2[0] + y.x + (t2[2] - r2[2]) / 2, y: _.y - r2[1] + y.y + (t2[3] - r2[3]) / 2 }, clearCanvas(l), clearCanvas(s), drawImage(l, f, _.x, _.y, f.width * w.value, f.height * w.value), E());
    }
  }, hoverRect(n2) {
    if (s && (F = moveDrawUnshowTagDashRect(s, u.mode, D, b.value, _, y, n2, I, O.isScaleing, F, T.value), !r && (u.enableCropResize && "crop" === u.mode && moveDetectBoxBorderSetCursor(L.value, n2, I, b.value, _, y, O.isScaleing), u.enableTagResize && "tag" === u.mode && moveDetectBoxBorderSetCursor(L.value, n2, D, b.value, _, y, O.isScaleing), "dot" == u.mode))) {
      n2 = getTouchPoint(n2, b.value, y, "move");
      let t2 = { x: (n2.x - _.x) / w.value, y: (n2.y - _.y) / w.value, raduis: 0 }, e2 = (initDotArrScale([t2], w.value, u.precision), lodash.exports.cloneDeep(S));
      e2.forEach((e3) => {
        pointInDot(t2, e3, T.value) ? (e3.__isHover = true, L.value.style.cursor = "pointer") : (e3.__isHover = false, L.value.style.cursor = "auto");
      }), S = e2, drawDotList(s, S, _, T.value);
    }
  } }, Z = { onMouseOverMove(e2) {
    device.mobile() ? this.onHoldMouseLeftBtnMove(e2) : O.isMouseDown() || device.mobile() ? "dot" === u.mode && !r || this.onHoldMouseLeftBtnMove(e2) : R.hoverRect(e2);
  }, onHoldMouseLeftBtnMove(e2) {
    var t2, n2;
    v = { x: e2.layerX, y: e2.layerY }, r ? this.onDrawSwitchOnStartDraw() : "daub" === u.mode ? O.isScaleing || (e2 = fixPoint(g, b.value, y), n2 = { x: (t2 = fixPoint(v, b.value, y)).x, y: t2.y, lineWidth: u.daubConfig.lineWidth, strokeStyle: u.daubConfig.strokeStyle }, s && (drawDuabPointList(s, [e2, t2], _, T.value), g = lodash.exports.cloneDeep(v), B[B.length - 1].push(n2))) : O.resizeHovering ? R.dragCreatOrResizeRect("resize") : R.move();
  }, onDoubleClick(t2) {
    if ("crop" === u.mode && u.enableInteractiveCropDelete && ye(pointIsInBoxList(t2, I, w.value, _).boxList), "tag" === u.mode) {
      let e2 = pointIsInBoxList(t2, D, w.value, _)["boxList"];
      e2.forEach((e3) => {
        var _a;
        (_a = e3 == null ? void 0 : e3.onDoubleClick) == null ? void 0 : _a.call(e3, "", e3);
      });
    }
  }, onCick(n2) {
    if ("dot" == u.mode) {
      var r2 = n2;
      let t2 = { x: (r2.x - _.x) / w.value, y: (r2.y - _.y) / w.value, raduis: 0 };
      initDotArrScale([t2], w.value, u.precision);
      r2 = S.filter((e2) => !pointInDot(t2, e2, T.value));
      return r2.length !== S.length ? (S = r2, void E()) : (S.push(t2), void R.dragCreatOrResizeRect("drawDot"));
    }
    if ("tag" === u.mode && s) {
      let e2 = pointIsInBoxList(n2, D, w.value, _)["boxList"];
      e2.forEach((e3) => {
        var _a;
        (_a = e3 == null ? void 0 : e3.onClick) == null ? void 0 : _a.call(e3, "", e3);
      }), u.enableInteractiveTagChangeStatus && (drawCropList(s, I, _, T.value), { isReDraw: r2, redrawList: n2 } = drawTagList(s, D, _, T.value, void 0, n2), r2 && (E(), ue("statusChange", A(n2))));
    }
  }, onWheel(e2, t2, n2) {
    (u.enableScale || n2) && R.scale(e2, t2);
  }, onDrawSwitchOnStartDraw() {
    "dot" === u.mode ? R.move() : "crop" === u.mode ? u.enableDrawCrop && R.dragCreatOrResizeRect("drawCrop") : u.enableDrawTag && R.dragCreatOrResizeRect("drawTag");
  } }, t = { shiftMode() {
    R.changeMode();
  }, shiftDrawSwitch(e2) {
    nextTick(() => {
      "on" === e2 && ((u.enableDrawCrop && "crop" === u.mode || u.enableDrawTag && "tag" === u.mode) && (L.value.style.cursor = "crosshair"), O.isMouseDown() || (r = true)), "off" === e2 && (O.isMoving || O.resizeHovering || R.dragCreatRectInterrupt(), r = false);
    });
  }, init() {
    !async function() {
      if (H(), c = false, l = null, s = null, f = void 0, d = lodash.exports.cloneDeep(defaultWH), h = lodash.exports.cloneDeep(defaultWH), p = lodash.exports.cloneDeep(defaultPoint), v = lodash.exports.cloneDeep(defaultPoint), g = lodash.exports.cloneDeep(defaultPoint), _ = { x: 0, y: 0 }, y = { x: 0, y: 0 }, w.value = 1, x = void 0, e = void 0, U = 1, m = void 0, b.value = 1, C = void 0, D = [], I = [], await nextTick(), 1 < u.cropList.length) {
        let t2 = { startX: 1 / 0, startY: 1 / 0, endX: -1 / 0, endY: -1 / 0 };
        u.cropList.forEach((e2) => {
          e2 = fixBoxInfo(e2);
          e2.info.startX < t2.startX && (t2.startX = e2.info.startX), e2.info.startY < t2.startY && (t2.startY = e2.info.startY), e2.info.endX > t2.endX && (t2.endX = e2.info.endX), e2.info.endY > t2.endY && (t2.endY = e2.info.endY);
        }), x = t2;
      }
      return 1 == u.cropList.length && (x = u.cropList[0]), D = lodash.exports.cloneDeep(u.tagList), I = lodash.exports.cloneDeep(u.cropList), S = lodash.exports.cloneDeep(u.dotList), B = lodash.exports.cloneDeep(u.daubStack), Q(), device.mobile() || (window.addEventListener("keydown", K), window.addEventListener("keyup", J)), te(), l = G.value.getContext("2d"), s = q.value.getContext("2d"), l && s ? (d = amendDpi(getElementWH(l.canvas))) ? (initCanvasWH(l, d), initCanvasWH(s, d), a("onLoadImage", { status: "loading" }), loadImage(u.src).then((e2) => {
        if (a("onLoadImage", { status: "success" }), !d || !l || !s)
          return Promise.reject("canvasWH or canvas var not has valid values.");
        if (f = e2, h = { width: f.width, height: f.height }, u.initScale) {
          var t2, n2, r2, o2, i2, e2 = initScale(d, f);
          if (w.value = U = e2.scale, x)
            return t2 = transfromBoxToRect(x, U, _), n2 = (d.width - 0.05 * d.width) / t2[2], r2 = (d.height - 0.05 * d.height) / t2[3], r2 = d.width / d.height > t2[2] / t2[3] ? r2 : n2, o2 = t2[0] + t2[2], i2 = t2[1] + t2[3], (r2 = r2) == n2 ? (_.x = (d.width - o2 * r2 - 0.05 * d.width / 2) / r2, _.y = ((d.height - t2[3] * r2) / 2 - t2[1] * r2) / r2) : (_.x = ((d.width - t2[2] * r2) / 2 - t2[0] * r2) / r2, _.y = (d.height - i2 * r2 - 0.05 * d.height / 2) / r2), I = initBoundingArrScale(I, w.value, u.precision), D = initBoundingArrScale(D, w.value, u.precision), S = initDotArrScale(S, w.value, u.precision), B = initDaubStackList(B, _, w.value), re({ deltaY: 1, clientX: 0, clientY: 0, preventDefault() {
            }, stopPropagation() {
            }, __zoom: r2 }, true), true;
          "width" === e2.fit ? _.x = (d.width - h.width * w.value) / 2 : _.y = (d.height - h.height * w.value) / 2, x = { startX: 0, startY: 0, endX: 0 + h.width, endY: 0 + h.height }, u.isImgCrop && ae("add", I = [x]);
        }
        return I = initBoundingArrScale(I, w.value, u.precision), D = initBoundingArrScale(D, w.value, u.precision), S = initDotArrScale(S, w.value, u.precision), B = initDaubStackList(B, _, w.value), drawImage(l, f, _.x, _.y, f.width * w.value, f.height * w.value), E(), true;
      }).catch((e2) => {
        a("onLoadImage", { status: "error", msg: JSON.stringify(e2) });
      })) : Promise.reject("Error: can't get canvas height and width.") : Promise.reject("Error: can't find canvas element.");
    }().then(() => {
      c = true;
    });
  }, resize() {
    requestAnimationFrame(() => {
      !async function() {
        if (ee(), await nextTick(), Q(), l && s && f) {
          if (!(d = amendDpi(getElementWH(l.canvas))))
            return Promise.reject("Error: can't get canvas height and width.");
          initCanvasWH(l, d), initCanvasWH(s, d), l.scale(b.value, b.value), s.scale(b.value, b.value), l.translate(-y.x, -y.y), s.translate(-y.x, -y.y), drawImage(l, f, _.x, _.y, f.width * w.value, f.height * w.value), I = initBoundingArrScale(I, w.value, u.precision), D = initBoundingArrScale(D, w.value, u.precision), S = initDotArrScale(S, w.value, u.precision), E(), c = true;
        }
      }();
    });
  } };
  function K(e2) {
    "Space" !== e2.code || u.disableDefaultShortcuts.includes("space") || (e2.target === document.body && e2.preventDefault(), t.shiftDrawSwitch("on"));
  }
  function J(e2) {
    if ("KeyB" === e2.code && e2.ctrlKey) {
      if (u.disableDefaultShortcuts.includes("ctrl+b"))
        return;
      t.shiftMode();
    }
    "Space" !== e2.code || u.disableDefaultShortcuts.includes("space") || t.shiftDrawSwitch("off");
  }
  function Q() {
    var e2 = L.value.getBoundingClientRect();
    m = { top: e2.top, right: e2.right, bottom: e2.bottom, left: e2.left, width: e2.width, height: e2.height, x: e2.x, y: e2.y };
  }
  function ee() {
    o = null, c = false, d = lodash.exports.cloneDeep(defaultWH), p = lodash.exports.cloneDeep(defaultPoint), v = lodash.exports.cloneDeep(defaultPoint), g = lodash.exports.cloneDeep(defaultPoint), m = void 0;
  }
  function k(e2) {
    let t2 = initBoundingArrScale(e2, w.value, u.precision);
    return t2.map((e3) => transfromBoxToRect(e3, w.value, _));
  }
  function E() {
    var _a;
    s && (drawCropList(s, I, _, T.value), drawTagList(s, D, _, T.value), drawDotList(s, S, _, T.value), B.forEach((e2) => {
      s && drawDuabPointList(s, e2, _, T.value);
    }), (_a = u.customDrawTopCtx) == null ? void 0 : _a.call(u, s, k));
  }
  function te() {
    device.mobile() && ("draw" === u.mobileOperation && t.shiftDrawSwitch("on"), "move" === u.mobileOperation && t.shiftDrawSwitch("off"));
  }
  function ne() {
    t.resize();
  }
  function re(e2, t2) {
    u.enableScale && (e2.stopPropagation(), e2.preventDefault());
    var n2, r2, o2;
    if (!m)
      throw new Error("can't find  containerInfo.");
    !c && !e2.__zoom || O.isDrawRecting || O.isMoving || (n2 = t2 ? 0 : (e2.clientX - m.left) * DPI, r2 = t2 ? 0 : (e2.clientY - m.top) * DPI, o2 = e2.deltaY < 0 ? 1 : -1, e2 = t2 ? e2.__zoom : Math.exp(o2 * W), b.value * e2 < 0.2 || Z.onWheel(e2, { x: n2, y: r2 }, t2));
  }
  function oe(t2) {
    if (O.resizeHovering) {
      var n2;
      let e2 = { crop: { boxList: I, trigger: ae, getBoxFunc: P }, tag: { boxList: D, trigger: ue, getBoxFunc: A }, daub: { boxList: [], trigger: () => {
      }, getBoxFunc: () => [] }, dot: { boxList: [], trigger: () => {
      }, getBoxFunc: () => [] } }[u.mode];
      e2.boxList[O.resizeHovering.index] = t2, a("resizeEnd", { index: O.resizeHovering.index, box: t2 }), "tag" === u.mode && (n2 = getVertexPositionByTwoPoints(p, v), Object.assign(t2, { __oprateType: "resize", __vertexPosition: n2 })), e2.trigger("resize", e2.getBoxFunc([t2]));
    }
  }
  function ie() {
    if (c) {
      if (O.isMoving = false, e && (_ = lodash.exports.cloneDeep(e)), e = void 0, O.isMouseUpDownPoints() || "dot" === u.mode) {
        let e2 = { crop() {
          if (C) {
            let e3 = { ...o, ...transfromRect2Box(C, _, w.value) };
            o = null, O.resizeHovering ? !u.enableCropCross && getBoxIsIntersectWithBoxList(e3, I.filter((e4, t2) => {
              var _a;
              return t2 !== ((_a = O.resizeHovering) == null ? void 0 : _a.index);
            })) ? ("reset" === u.handleResizeCropCross && E(), "delete" === u.handleResizeCropCross && ye([I[O.resizeHovering.index]])) : oe(e3) : (e3 = initBoundingArrScale([e3], w.value, u.precision)[0], !u.enableCropCross && getBoxIsIntersectWithBoxList(e3, I) ? E() : (I.push(e3), ae("add", P([e3])))), C = void 0;
          }
        }, tag() {
          var e3, t2;
          C && (e3 = { ...o, ...transfromRect2Box(C, _, w.value) }, o = null, O.resizeHovering ? oe(e3) : (e3 = getVertexPositionByTwoPoints(p, v), t2 = initBoundingArrScale([t2 = transfromRect2Box(C, _, w.value)], w.value, u.precision)[0], Object.assign(t2, { isShow: true, __oprateType: "add", __vertexPosition: e3 }), D.push(t2), ue("add", A([t2]))), C = void 0);
        }, daub() {
          C = C && void 0;
          let e3 = lodash.exports.cloneDeep(B);
          a("update:daubStack", e3.map((e4) => e4.map((e5) => (null != e5._x && null != e5._y ? (delete e5._x, delete e5._y) : (e5.x = (e5.x - _.x) / w.value, e5.y = (e5.y - _.y) / w.value), e5))));
        }, dot() {
          let e3 = lodash.exports.cloneDeep(S);
          a("update:dotList", e3.map((e4) => e4));
        } };
        e2[u.mode]();
      }
      O.resizeHovering = void 0, O.isDrawRecting = false, p = lodash.exports.cloneDeep(defaultPoint), v = lodash.exports.cloneDeep(defaultPoint), g = lodash.exports.cloneDeep(defaultPoint), L.value.style.cursor = "auto";
    }
  }
  function ae(e2, t2) {
    var n2 = P(I);
    a("update:cropList", n2), a("cropListChange", { type: e2, list: t2 });
  }
  function ue(e2, t2) {
    let n2 = { type: e2, list: t2 };
    if ("add" === e2) {
      let e3 = t2.filter((e4) => Reflect.get(e4, "__parentCrop"))[0];
      e3 && (n2.parentCrop = P([Reflect.get(e3, "__parentCrop")])[0], delete e3.__parentCrop);
    }
    a("tagListChange", n2);
    e2 = A(D);
    a("update:tagList", e2);
  }
  function A(e2) {
    let t2 = e2 || D, r2 = I, o2 = [];
    return t2.forEach((e3) => {
      let t3 = e3;
      if (!u.enableDrawTagOutOfCrop && t3.__oprateType && t3.__vertexPosition) {
        e3 = pointIsInBoxList(getPointByBoxAndVertexPosition(t3, t3.__vertexPosition), r2).boxList[0];
        if (!e3)
          return;
        var n2 = getTwoBoxIntersectPart(t3, e3);
        n2 && isBoxValidity(n2) ? (Object.assign(t3, n2), t3.__parentCrop = e3) : t3.__isValidity = false;
      }
      delete t3.__oprateType, Reflect.deleteProperty(t3, "__vertexPosition"), u.enableDrawTagOutOfCrop && !u.enableDrawTagOutOfImg && (e3 = { startX: 0, startY: 0, endX: (n2 = h).width, endY: n2.height }, (n2 = getTwoBoxIntersectPart(t3, e3)) && isBoxValidity(n2) ? Object.assign(t3, n2) : t3.__isValidity = false);
      e3 = fixBoxInfo(t3);
      o2.push(transformBoxPrecision(e3.info, u.precision));
    }), o2.filter((e3) => false !== e3.__isValidity);
  }
  function P(e2) {
    let t2 = e2 || I, n2 = t2.map((e3) => {
      let t3 = e3;
      u.enableDrawCropOutOfImg || (n3 = { startX: 0, startY: 0, endX: (n3 = h).width, endY: n3.height }, (n3 = getTwoBoxIntersectPart(t3, n3)) && isBoxValidity(n3) ? t3 = { ...e3, ...n3 } : t3._del = true), Reflect.deleteProperty(t3, "__vertexPosition");
      var n3, e3 = fixBoxInfo(t3);
      return transformBoxPrecision(e3.info, u.precision);
    });
    return n2.filter((e3) => !e3._del);
  }
  function ce(e2) {
    var t2;
    c && l && s && (t2 = new Date().getTime(), n = t2, i.prev.down ? i.last.down = t2 : i.prev.down = t2, t2 = amendDpi(t2 = { layerX: Reflect.get(e2, "layerX"), layerY: Reflect.get(e2, "layerY") }, ["layerX", "layerY"]), p = { x: t2.layerX, y: t2.layerY }, g = lodash.exports.cloneDeep(p), "daub" == u.mode && B.push([]), "crop" === u.mode && !r && u.enableCropResize && (e2 = detectEventIsTriggerOnBoxBorderOrVertex(t2, I, b.value, _, y)).hasIn && (O.resizeHovering = findOneBorderOrVertex(e2.list), a("resizeStart", { index: O.resizeHovering.index, box: I[O.resizeHovering.index] })), "tag" === u.mode && !r && u.enableTagResize && (e2 = detectEventIsTriggerOnBoxBorderOrVertex(t2, D, b.value, _, y)).hasIn && (O.resizeHovering = findOneBorderOrVertex(e2.list), a("resizeStart", { index: O.resizeHovering.index, box: D[O.resizeHovering.index] })));
  }
  onBeforeUnmount(() => {
    window.removeEventListener("resize", ne), device.mobile() || (window.removeEventListener("keydown", K), window.removeEventListener("keyup", J)), H();
  }), onMounted(() => {
    t.init(), window.addEventListener("resize", ne);
  }), watch(() => u.mode, (e2) => {
    "tag" === e2 && (L.value.style.cursor = "auto");
  }), watch(() => u.src, (e2) => {
    e2 && t.init();
  }), watch(() => u.mobileOperation, (e2) => {
    c && te();
  }), watch(() => u.tagList, (e2) => {
    c && (D = initBoundingArrScale(e2, w.value, u.precision), E());
  }, { deep: true }), watch(() => u.dotList, (e2) => {
    c && (S = initDotArrScale(e2, w.value, u.precision), E());
  }, { deep: true }), watch(() => u.daubStack, (e2) => {
    c && (B = initDaubStackList(lodash.exports.cloneDeep(u.daubStack), _, w.value), E());
  }, { deep: true }), watch(() => u.cropList, (e2) => {
    c && (I = initBoundingArrScale(e2, w.value, u.precision), E());
  });
  let le = lodash.exports.throttle(function(t2) {
    if (t2) {
      t2 = getTouchPoint(t2, b.value, y, "over");
      let e2 = lodash.exports.cloneDeep(t2);
      e2.x -= _.x, e2.y -= _.y, e2.x /= w.value, e2.y /= w.value, a("mouseOverInfo", { canvas: t2, img: e2 });
    } else
      a("mouseOverInfo", { canvas: null, img: null });
  }, 100, { leading: false, trailing: true });
  function se(e2) {
    c && (e2 = amendDpi(e2 = { layerX: Reflect.get(e2, "layerX"), layerY: Reflect.get(e2, "layerY") }, ["layerX", "layerY"]), j = new Date().getTime(), Z.onMouseOverMove(e2), le(e2));
  }
  function fe() {
    var e2;
    c && (e2 = new Date().getTime(), i.prev.up ? i.last.up = e2 : i.prev.up = e2, ie());
  }
  function de() {
    c && (L.value.style.cursor = "auto", ie(), le());
  }
  function he() {
    X && clearTimeout(X), X = null;
  }
  function pe(t2) {
    if (Q(), c) {
      let e2 = getTouchPoint(amendDpi({ layerX: Reflect.get(t2, "layerX"), layerY: Reflect.get(t2, "layerY") }, ["layerX", "layerY"]), b.value, y, "click");
      var t2 = j && n ? j - n : 0;
      n = void 0, j = void 0, 100 < t2 || (u.splitClickAndDoubleClickEvent ? (he(), X = setTimeout(() => {
        Z.onCick(e2), X = null;
      }, 230)) : Z.onCick(e2), t2 = u.splitClickAndDoubleClickEvent ? 320 : 360, i.prev.up && i.prev.down && i.last.up && i.last.down && (i.last.up - i.prev.down < t2 ? (u.splitClickAndDoubleClickEvent && he(), Z.onDoubleClick(e2), i.prev.down = void 0, i.prev.up = void 0) : (i.prev.down = i.last.down, i.prev.up = i.last.up), i.last.down = void 0, i.last.up = void 0));
    }
  }
  function ve(e2) {
    Q(), n = new Date().getTime();
    var t2 = e2.touches;
    if (1 === e2.touches.length && ce({ layerX: t2[0].clientX - ((m == null ? void 0 : m.left) || 0), layerY: t2[0].clientY - ((m == null ? void 0 : m.top) || 0) }), 2 == e2.touches.length) {
      if (!m)
        throw new Error("can't find  containerInfo.");
      getTwoFingerTouchListDistence(amendMobileTouchEventDpi(e2)), V = { x: (t2[0].clientX + t2[1].clientX) / 2, y: (t2[0].clientY + t2[1].clientY) / 2 };
    }
  }
  function ge(e2) {
    j = new Date().getTime();
    var t2 = e2.touches;
    if (1 === e2.touches.length && se({ layerX: t2[0].clientX - ((m == null ? void 0 : m.left) || 0), layerY: t2[0].clientY - ((m == null ? void 0 : m.top) || 0) }), 2 == e2.touches.length) {
      if (!m)
        throw new Error("can't find  containerInfo.");
      var { width: t2, height: e2 } = getTwoFingerTouchListDistence(amendMobileTouchEventDpi(e2)), t2 = getHypotenuseValue(t2, e2), e2 = -(t2 - N);
      N = t2, re({ onTouchMove: true, deltaY: e2, preventDefault() {
      }, stopPropagation() {
      }, clientX: V.x, clientY: V.y });
    }
  }
  function _e(e2) {
    fe();
  }
  function ye(r2) {
    if (0 !== r2.length) {
      let e2 = [], n2 = [], t2 = P();
      t2.forEach((t3) => {
        (r2.find((e3) => {
          e3 = fixBoxInfo(e3).info;
          return e3.startX === t3.startX && e3.endX === t3.endX && e3.startY === t3.startY && e3.endY === t3.endY;
        }) ? n2 : e2).push(t3);
      }), I = initBoundingArrScale(e2, w.value, u.precision), a("delCrop", n2), E(), ae("delete", P(n2));
    }
  }
  return Y({ render: E, removeTagItems: function(n2) {
    let r2 = [], o2 = [];
    if (0 !== n2.length) {
      let e2 = A();
      e2.forEach((t2) => {
        (n2.find((e3) => {
          e3 = fixBoxInfo(e3).info;
          return e3.startX === t2.startX && e3.endX === t2.endX && e3.startY === t2.startY && e3.endY === t2.endY;
        }) ? o2 : r2).push(t2);
      });
    }
    D = initBoundingArrScale(r2, w.value, u.precision), E(), ue("delete", o2);
  }, getTagListGroupByCropIndex: function(n2 = "startPoint") {
    let e2 = A(), r2 = P();
    return e2.forEach((e3) => {
      var t2;
      "startPoint" === n2 && (t2 = pointIsInBoxList({ x: e3.startX, y: e3.startY }, r2), e3.__groupIndex = t2.indexList[0]), "allIn" === n2 && (t2 = boxAllInBoxList(e3, r2), e3.__groupIndex = t2.indexList[0]);
    }), lodash.exports.groupBy(e2, "__groupIndex");
  }, getBase64ImageData: async function(e2) {
    const n2 = document.createElement("canvas");
    n2.style.width = h.width + "px", n2.style.height = h.height + "px", n2.width = h.width, n2.height = h.height;
    let r2 = n2.getContext("2d");
    return loadImage(u.src, e2).then((e3) => {
      if (r2) {
        let t2 = { x: 0, y: 0 };
        return drawImage(r2, e3, 0, 0, e3.width, e3.height), drawCropList(r2, u.cropList, t2, T.value, void 0, true), drawTagList(r2, u.tagList, t2, T.value), u.daubStack.forEach((e4) => {
          r2 && drawDuabPointList(r2, e4, t2, T.value);
        }), n2.toDataURL("image/png");
      }
      throw new Error("ctx not exist");
    });
  }, hooks: t, scrollIntoView: R.scrollIntoView, scaleInfo: $ }), (e2, t2) => (openBlock(), createElementBlock("div", { class: "comp-ocr-img", ref_key: "containerRef", ref: L, onMousedown: ce, onMouseenter: Q, onClick: pe, onMouseup: fe, onMousemove: se, onMouseout: de, onMousewheel: re, onTouchmove: withModifiers(ge, ["stop", "prevent"]), onTouchstart: withModifiers(ve, ["stop"]), onTouchend: withModifiers(_e, ["stop"]) }, [createElementVNode("canvas", { class: "canvas", ref_key: "canvasRef", ref: G }, null, 512), createElementVNode("canvas", { class: "canvas2", ref_key: "canvas2Ref", ref: q }, null, 512), unref(u).isShowTip ? (openBlock(), createElementBlock("div", _hoisted_2, [createElementVNode("div", _hoisted_3, [createElementVNode("div", { class: normalizeClass(["circle", { crop: "crop" === z.mode, tag: "tag" === z.mode }]) }, null, 2), createElementVNode("div", _hoisted_4, toDisplayString("crop" === z.mode ? "\u88C1\u526A\u6A21\u5F0F" : "\u6807\u8BB0\u9519\u8BEF\u884C"), 1)]), createElementVNode("div", _hoisted_5, [renderSlot(e2.$slots, "tip", {}, () => [_hoisted_6, _hoisted_7, _hoisted_8, _hoisted_9], true)])])) : createCommentVNode("", true)], 40, _hoisted_1));
} });
var ImgMark = _export_sfc(_sfc_main, [["__scopeId", "data-v-079c1b1a"]]);
export { ImgMark, boxIsAllInOtherBox, transformTagBoxRelativeTo, transformTagListBoxRelativeTo };
