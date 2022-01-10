import { mathJaxConfig } from '../../../mathJax'
import { MathJaxObject } from './mathjax'
const mathJaxScriptId = 'MathJax-script'
const mathJaxScriptSrc = 'https://homework-webfront.oss-cn-beijing.aliyuncs.com/complete_math_v1/mathjax-3.2.0/es5/tex-mml-chtml.js'

let isAddScript = false
let isReady = false
window.MathJax = {
	...mathJaxConfig,
	startup: {
		pageReady: () => {
			isReady = true
		},
	},
} as unknown as MathJaxObject
function addMathJaxScript() {
	return new Promise((resolve, reject) => {
		if (isReady) {
			return resolve('')
		} else {
			if (!isAddScript) {
				let ele = document.createElement('script')
				ele.src = mathJaxScriptSrc
				ele.id = mathJaxScriptId
				ele.onerror = err => {
					reject(err)
				}
				document.body.appendChild(ele)
				isAddScript = true
			}
			let interval = setInterval(() => {
				if (isReady) {
					clearInterval(interval)
					return resolve('')
				}
			}, 1000)
		}
	})
}

export function renderLatex(ele: HTMLElement) {
	return addMathJaxScript().then(() => {
		return MathJax.typesetPromise([ele])
	})
}
