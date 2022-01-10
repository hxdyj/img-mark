var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { defineComponent, ref, computed, watch, onMounted, openBlock, createElementBlock, toDisplayString } from "vue";
function transFormatRomanNum(content, type = "romannumeral") {
  const number = Number(content.split(`${type}{`)[1].split("}")[0]);
  const ls = number / 10;
  const shang = Math.floor(ls);
  const yushu = Number((ls + "").split(".")[1]);
  let prefix = "";
  if (shang > 0) {
    for (let i = 0; i < shang; i++) {
      prefix += "x";
    }
  }
  if (yushu < 4) {
    for (let i = 0; i < yushu; i++) {
      prefix += "i";
    }
  }
  if (yushu === 4) {
    prefix += "iv";
  }
  if (yushu === 5) {
    prefix += "v";
  }
  if (yushu > 5 && yushu < 9) {
    prefix += "v";
    for (let i = 5; i < yushu; i++) {
      prefix += "i";
    }
  }
  if (yushu === 9) {
    prefix += "ix";
  }
  if (yushu === 10) {
    prefix += "x";
  }
  if (type === "RomanNumeralCaps") {
    prefix = prefix.replace(/i/g, "I");
    prefix = prefix.replace(/v/g, "V");
    prefix = prefix.replace(/x/g, "X");
  }
  return prefix;
}
function transFormatLimits(content, queNum) {
  const arrowMap = {
    "\\rightarrow": "->",
    "\\leftarrow": "<-",
    "\\rightleftarrow": "<=>",
    "\\leftrightarrow": "<->"
  };
  const arr = content.split("\\limits^");
  if (queNum === 2) {
    const arrow = arr[0];
    const over = arr[1].split("}_{")[0].slice(1);
    const under = arr[1].split("}_{")[1].slice(0, arr[1].split("}_{")[1].length - 1);
    if (arrow === "=") {
      return `\\ce{\\xlongequal[{${under}}]{${under}}}`;
    }
    return `\\ce{${arrowMap[arrow]}[{${over}}][{${under}}]}`;
  }
  if (queNum === 3) {
    const arrow = arr[0];
    const over = arr[1].split("{")[1].split("}")[0];
    if (arrow === "=") {
      return `\\ce{\\xlongequal{${over}}}`;
    }
    return `\\ce{${arrowMap[arrow]}[{${over}}]}`;
  }
  return "";
}
const englishMap = {
  "\\^(?!{)": "\u028C",
  "@": "\xE6",
  "u\\.\\.\\(r\\)": "{\u028A\u0259}^{r}",
  "\\.\\.": "\u0259",
  oi: "\u0254\u026A",
  ai: "a\u026A",
  ei: "e\u026A",
  "e(?!:)": "e",
  "e:": "\u025C\u02D0",
  "\\(r\\)": "^{r}",
  "(?!pr)i(?![:|me])": "\u026A",
  "i:": "i\u02D0",
  "o(?!:)": "\u0252",
  "o:": "\u0254\u02D0",
  au: "a\u028A",
  Ou: "\u0259\u028A",
  "u(?!:)": "\u028A",
  "u:": "u\u02D0",
  ":": "\u02D0",
  N: "\u014B",
  tS: "t\u0283",
  S: "\u0283",
  th: "\u03B8",
  TH: "\xF0",
  dZ: "d\u0292",
  Z: "\u0292",
  prime: "prime "
};
function getStringWidth(val) {
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    if (/[^\x00-\xff]/.test(val.substr(i, 1))) {
      len += 2.2;
    } else {
      len += 1.3;
    }
  }
  return len;
}
function transformat(content, isSpace = false, isLongLine = false) {
  if (isSpace) {
    content = content.replace(/[^\S\r\n]+/g, "\\;\\;");
  }
  content = content.replace(/(\\hand(?![a-zA-Z]))|(\\mix)|(\\deletion)|(\\insert)|(\\wrong)|(\\chnfield)|(\\engfield)|(<s>)|(<\/s>)|(<unk>)/g, (match) => {
    return " ";
  }).replace(/\\tab/g, (match) => {
    return "\\;\\;";
  }).replace(/(\\prime)|(\\alpha)|(\\Alpha)|(\\beta)|(\\Beta)|(\\gamma)|(\\Gamma)|(\\delta)|(\\Delta)|(\\epsilon)|(\\Epsilon)|(\\zeta)|(\\Zeta)|(\\eta)|(\\Eta)|(\\theta)|(\\Theta)|(\\iota)|(\\Iota)|(\\kappa)|(\\Kappa)|(\\lambda)|(\\Lambda)|(\\mu)|(\\Mu)|(\\nu)|(\\Nu)|(\\xi)|(\\Xi)|(\\omicron)|(\\Omicron)|(\\pi)|(\\Pi)|(\\rho)|(\\Rho)|(\\sigma)|(\\Sigma)|(\\tau)|(\\Tau)|(\\upsilon)|(\\Upsilon)|(\\phi)|(\\Phi)|(\\chi)|(\\Chi)|(\\psi)|(\\Psi)|(\\omega)|(\\Omega)|(\\pm(?!od))|(\\mp)|(\\times)|(\\div)|(\\mid)|(\\prod)|(\\sum)|(\\approx(?!eq))|(\\leq)|(\\geq)|(\\neq(?!uiv))|(\\equiv)|(\\propto)|(\\napprox)|(\\nleq)|(\\ngeq)|(\\nequiv)|(\\angle)|(\\cong)|(\\sim)|(\\parallel(?!ogram)(?!equal))|(\\parallelogram)|(\\parallelequal)|(\\perp)|(\\nparallel)|(\\cdots)|(\\ddots)|(\\vdots)|(\\lor)|(\\land)|(\\lnot)|(\\forall)|(\\exists)|(\\top)|(\\bot)|(\\cup)|(\\cap)|(\\subset(?!(neq|eq)))|(\\supset(?!neq|eq))|(\\notin)|(\\ni)|(\\notni)|(\\emptyset)|(\\complement)|(\\subseteq)|(\\supseteq(?!eq))|(\\nsubset(?!eq))|(\\nsupset(?!eq))|(\\subsetneq)|(\\supsetneq)|(\\nsubseteq)|(\\nsupseteq)|(\\infty)|(\\partial)|(\\Re)|(\\lg)|(\\lim(?!its))|(\\ln)|(\\max)|(\\min)|(\\sin)|(\\cos)|(\\tan)|(\\sec)|(\\cot)|(\\csc)|(\\arcsin)|(\\arccos)|(\\arctan)|(\\arccot(?!angent))|(\\arcsec)|(\\arccsc)|(\\Leftarrow(?!\\limits))|(\\leftarrow(?!\\limits))|(\\Rightarrow(?!\\limits))|(\\rightarrow(?!\\limits))|(\\Uparrow)|(\\uparrow)|(\\Downarrow)|(\\downarrow)|(\\Leftrightarrow(?!\\limits))|(\\leftrightarrow(?!\\limits))|(\\Updownarrow)|(\\updownarrow)|(\\NEarrow)|(\\nearrow)|(\\NWarrow)|(\\nwarrow)|(\\SEarrow)|(\\searrow)|(\\SWarrow)|(\\swarrow)|(\\hookleftarrow)|(\\odot)|(\\ominus)|(\\oplus)|(\\otimes)|(\\oiiint)|(\\oiint)|(\\oint)|(\\diamond)|(\\square)|(\\rectangle)|(\\star)|(\\triangle(?!down))|(\\triangledown)|(\\heart(?!suit))|(\\bullet)|(\\female)|(\\male)|(\\smiley)|(\\spadesuit)|(\\clubsuit)|(\\blackdiamond)|(\\blacksquare)|(\\blackrectangle)|(\\blackstar)|(\\blacktriangle(?!down))|(\\blacktriangledown)|(\\blackheart)|(\\textperthousand)|(\\textreferencemark)|(\\textregistered)|(\\textsection)|(\\texttrademark)|(\\cdot)|(\\because)|(\\therefore)|(\\chi)|(\\circ)|(\\xmark)|(\\cmark)|(\\in(?!(t|sert)))|(\\omitted)/g, (match) => {
    return match + " ";
  }).replace(/\\romannumeral\{\d+\}/g, (match) => {
    return `\\mathsf{${transFormatRomanNum(match)}}`;
  }).replace(/\\RomanNumeralCaps\{\d+\}/g, (match) => {
    return `\\mathsf{${transFormatRomanNum(match, "RomanNumeralCaps")}}`;
  }).replace(/((\\rightleftarrow)|(\\leftrightarrow)|(\\rightarrow)|(\\leftarrow)|(\=))\\limits\^\{[^}]+\}_\{[^}]+\}/g, (match) => {
    return transFormatLimits(match, 2);
  }).replace(/((\\rightleftarrow)|(\\leftrightarrow)|(\\rightarrow)|(\\leftarrow)|(\=))\\limits\^\{[^}]+\}/g, (match) => {
    return transFormatLimits(match, 3);
  }).replace(/[\n\r]/g, "\\\\").replace(/\\left\\{/g, (match) => {
    const arr = match.split("\\left\\{");
    return "\\left\\{\\begin{array}\\{" + arr[1];
  }).replace(/\\right\\}/g, (match) => {
    const arr = match.split("\\right\\}");
    return arr[0] + "\\end{array}\\right.";
  }).replace(/\\\[\\phonetic\{.*?\}\\\]/g, (match) => {
    let str = match.split("\\phonetic").join("");
    for (let key in englishMap) {
      str = str.replace(new RegExp(key, "g"), (m) => {
        return englishMap[key];
      });
    }
    return str;
  }).replace(/\'/g, "\\textasciiacute{}").replace(/\"/g, "\\textacutedbl{}").replace(/\\uwave\{.*?\}/g, (match) => {
    const str = match.split("\\uwave{")[1].split("}")[0];
    let waves = [];
    const length = Math.floor(getStringWidth(str));
    for (let i = 0; i < length; i++) {
      waves.push("\\sim");
    }
    return `\\underset{${waves.join("\\!")}}{${str}}`;
  }).replace(/\\reverse\{.*?\}\{.*?\}/g, (match) => {
    const str1 = match.split("}{")[0].split("\\reverse{")[1];
    const str2 = match.split("}{")[1].split("}")[0];
    return `${str2}${str1}`;
  });
  if (isLongLine) {
    content = content.replace(/(\\_){1,}/g, (match) => {
      const length = match.split("\\_").length - 1;
      let str = "\\;";
      for (let i = 0; i < length; i++) {
        str += "\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_";
      }
      return str + "\\;";
    });
  }
  return `\\mathrm{${content}}`;
}
const loader = {
  load: [
    "output/chtml",
    "input/tex",
    "[tex]/enclose",
    "[tex]/ams",
    "[tex]/noerrors",
    "[tex]/configmacros",
    "[tex]/mathtools",
    "[tex]/mhchem",
    "[tex]/unicode",
    "[tex]/textmacros",
    "[tex]/textcomp",
    "[tex]/cancel",
    "[tex]/extpfeil"
  ]
};
const texPackages = {
  "[+]": ["noerrors", "enclose", "ams", "mathtools", "mhchem", "unicode", "textcomp", "cancel", "extpfeil", "textmacros"]
};
const texMacros = {
  "[": "[",
  "]": "]",
  "(": "(",
  ")": ")",
  "\u3010": "\u3010",
  "\u3011": "\u3011",
  NEarrow: "\\unicode{x21d7}",
  NWarrow: "\\unicode{x21d6}",
  SEarrow: "\\unicode{x21d8}",
  SWarrow: "\\unicode{x21d9}",
  textcircled: "\\enclose{circle}",
  romannumeral: "\\enclose{()}",
  arccot: "arccot",
  arccsc: "arccsc",
  arcsec: "arcsec",
  blackdiamond: "\\blacklozenge",
  blackheart: "\\unicode{x2665}",
  blackrectangle: "\\unicode{x220e}",
  blackstar: "\\unicode{x2605}",
  heart: "\\heartsuit",
  female: "\\unicode{x2640}",
  male: "\\unicode{x2642}",
  napprox: "\\unicode{x2249}",
  nequiv: "\\unicode{x2262}",
  notni: "\\unicode{x220c}",
  nsubset: "\\unicode{x2284}",
  nsupset: "TODO",
  oiiint: "\\unicode{x2230}",
  oiint: "\\unicode{x222f}",
  parallelequal: "TODO",
  rectangle: "\\unicode{x25ad}",
  smiley: "\\unicode{x263a}",
  wideparen: "\\overparen",
  textperthousand: "\\unicode{x2030}",
  textregistered: "\\unicode{xae}",
  textsection: "\\unicode{xa7}",
  texttrademark: "\\unicode{x2122}",
  textreferencemark: "\\unicode{x203b}\\text{ }",
  parallelogram: "\\unicode{x25b1}\\text{ }",
  deletion: "\\text{ }",
  d: "\\underset{\\cdot}",
  v: "\\check",
  omitted: "\\tripledash",
  xmark: "\\times\\text{ }",
  cmark: "\\unicode{x2714}\\text{ }",
  replace: "\\xcancel",
  handtextcircled: "\\enclose{circle}",
  handsquare: "\\fbox",
  Alpha: "A",
  Beta: "B",
  Omicron: "O",
  Epsilon: "E",
  Zeta: "Z",
  Eta: "H",
  Iota: "I",
  Kappa: "K",
  Mu: "M",
  Nu: "N",
  Rho: "P",
  Tau: "T",
  Chi: "X",
  lg: "\\log",
  nl: "\\nless",
  ng: "\\ngtr"
};
const texInlineMath = [
  ["$", "$"],
  ["\\(", "\\)"]
];
const texDisplayMath = [
  ["$$", "$$"],
  ["\\[", "\\]"]
];
const tex = {
  inlineMath: texInlineMath,
  displayMath: texDisplayMath,
  packages: texPackages,
  macros: texMacros
};
const mathJaxConfig = {
  loader,
  tex
};
const mathJaxScriptId = "MathJax-script";
const mathJaxScriptSrc = "https://homework-webfront.oss-cn-beijing.aliyuncs.com/complete_math_v1/mathjax-3.2.0/es5/tex-mml-chtml.js";
let isAddScript = false;
let isReady = false;
window.MathJax = __spreadProps(__spreadValues({}, mathJaxConfig), {
  startup: {
    pageReady: () => {
      isReady = true;
    }
  }
});
function addMathJaxScript() {
  return new Promise((resolve, reject) => {
    if (isReady) {
      return resolve("");
    } else {
      if (!isAddScript) {
        let ele = document.createElement("script");
        ele.src = mathJaxScriptSrc;
        ele.id = mathJaxScriptId;
        ele.onerror = (err) => {
          reject(err);
        };
        document.body.appendChild(ele);
        isAddScript = true;
      }
      let interval = setInterval(() => {
        if (isReady) {
          clearInterval(interval);
          return resolve("");
        }
      }, 1e3);
    }
  });
}
function renderLatex(ele) {
  return addMathJaxScript().then(() => {
    return MathJax.typesetPromise([ele]);
  });
}
var MathJax_vue_vue_type_style_index_0_lang = "";
const _sfc_main = /* @__PURE__ */ defineComponent({
  props: {
    content: null
  },
  setup(__props) {
    const props = __props;
    let mathJaxRef = ref();
    let renderText = computed(() => {
      return transformat(props.content || "");
    });
    watch(() => props.content, () => {
      renderLatex(mathJaxRef.value);
    });
    onMounted(() => {
      renderLatex(mathJaxRef.value);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "ke-comp-math-jax",
        ref_key: "mathJaxRef",
        ref: mathJaxRef
      }, "$$" + toDisplayString(renderText.value) + "$$", 513);
    };
  }
});
export { _sfc_main as KeMathJax, loader, mathJaxConfig, tex, texDisplayMath, texInlineMath, texMacros, texPackages, transformat as transformer };
