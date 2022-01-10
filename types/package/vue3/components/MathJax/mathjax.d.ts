export type MathJaxObject = {
	[x: string]: any
	tex2chtmlPromise: (input: string) => Promise<HTMLElement>
}
// export declare namespace global {
// 	var MathJax: MathJaxObject
// }
declare global {
	const MathJax: MathJaxObject
	interface Window {
		MathJax: MathJaxObject
	}
}
