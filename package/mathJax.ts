import transformat from './util/thansformer'

export const loader = {
	load: [
		'output/chtml',
		'input/tex',
		'[tex]/enclose',
		'[tex]/ams',
		'[tex]/noerrors',
		'[tex]/configmacros',
		'[tex]/mathtools',
		'[tex]/mhchem',
		'[tex]/unicode',
		'[tex]/textmacros',
		'[tex]/textcomp',
		'[tex]/cancel',
		'[tex]/extpfeil',
	],
}

export const texPackages = {
	'[+]': ['noerrors', 'enclose', 'ams', 'mathtools', 'mhchem', 'unicode', 'textcomp', 'cancel', 'extpfeil', 'textmacros'],
}

export const texMacros = {
	'[': '[',
	']': ']',
	'(': '(',
	')': ')',
	'【': '【',
	'】': '】',
	NEarrow: '\\unicode{x21d7}',
	NWarrow: '\\unicode{x21d6}',
	SEarrow: '\\unicode{x21d8}',
	SWarrow: '\\unicode{x21d9}',
	textcircled: '\\enclose{circle}',
	romannumeral: '\\enclose{()}',
	arccot: 'arccot',
	arccsc: 'arccsc',
	arcsec: 'arcsec',
	blackdiamond: '\\blacklozenge',
	blackheart: '\\unicode{x2665}',
	blackrectangle: '\\unicode{x220e}',
	blackstar: '\\unicode{x2605}',
	heart: '\\heartsuit',
	female: '\\unicode{x2640}',
	male: '\\unicode{x2642}',
	napprox: '\\unicode{x2249}',
	nequiv: '\\unicode{x2262}',
	notni: '\\unicode{x220c}',
	nsubset: '\\unicode{x2284}',
	nsupset: 'TODO',
	oiiint: '\\unicode{x2230}',
	oiint: '\\unicode{x222f}',
	parallelequal: 'TODO',
	rectangle: '\\unicode{x25ad}',
	smiley: '\\unicode{x263a}',
	wideparen: '\\overparen',
	textperthousand: '\\unicode{x2030}',
	textregistered: '\\unicode{xae}',
	textsection: '\\unicode{xa7}',
	texttrademark: '\\unicode{x2122}',
	textreferencemark: '\\unicode{x203b}\\text{ }',
	parallelogram: '\\unicode{x25b1}\\text{ }',
	deletion: '\\text{ }',
	d: '\\underset{\\cdot}',
	v: '\\check',
	omitted: '\\tripledash',
	xmark: '\\times\\text{ }',
	cmark: '\\unicode{x2714}\\text{ }',
	replace: '\\xcancel',
	handtextcircled: '\\enclose{circle}',
	handsquare: '\\fbox',
	Alpha: 'A',
	Beta: 'B',
	Omicron: 'O',
	Epsilon: 'E',
	Zeta: 'Z',
	Eta: 'H',
	Iota: 'I',
	Kappa: 'K',
	Mu: 'M',
	Nu: 'N',
	Rho: 'P',
	Tau: 'T',
	Chi: 'X',
	lg: '\\log',
	nl: '\\nless',
	ng: '\\ngtr',
}

export const texInlineMath = [
	['$', '$'],
	['\\(', '\\)'],
]
export const texDisplayMath = [
	['$$', '$$'],
	['\\[', '\\]'],
]

export const tex = {
	inlineMath: texInlineMath,
	displayMath: texDisplayMath,
	packages: texPackages,
	macros: texMacros,
}

const mathJaxConfig = {
	loader,
	tex,
}
export { transformat as transformer, mathJaxConfig }
