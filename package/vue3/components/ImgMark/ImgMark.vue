<template>
	<div
		class="comp-ocr-img"
		ref="container"
		@mousedown.stop="onMouseDown"
		@click.stop="onClick"
		@mouseup.stop="onMouseUp"
		@mousemove.stop="onMouseMove"
		@mouseout.stop="onMouseOut"
		@mousewheel.stop="onMouseWheel"
		@touchmove.stop.prevent="onTouchMove"
		@touchstart.stop="onTouchStart"
		@touchend.stop="onTouchEnd"
	>
		<canvas class="canvas" ref="canvas"></canvas>
		<canvas class="canvas2" ref="canvas2"></canvas>
		<div class="mode-panel">
			<div class="status">
				<div class="circle" :class="{ crop: mode === 'crop', tag: mode === 'tag' }"></div>
				<div class="text">{{ mode === 'crop' ? '裁剪模式' : '标记错误行' }}</div>
			</div>
			<div class="tip">
				<kbd>Ctrl</kbd> +
				<kbd>B</kbd>
				<span style="font-size: 14px">切换模式</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
const CancasSafeArea = 100000
const DPI = window.devicePixelRatio || 1
const debug = true

type Rect = {
	width: number
	height: number
}
type Point = {
	x: number
	y: number
}
// __changed
const defaultWH: Rect = {
	width: 0,
	height: 0,
}

// __changed
const defaultPoint: Point = {
	x: 0,
	y: 0,
}
const zoomIntensity = 0.02
let mouseDownOnCropBorderOrVertex = undefined
let hasHoverRectInCanvas = false
let isWheeling = false
let wheelSetTimeout = undefined
let spaceKeyDown = false
let mouseDownTime = undefined
let mouseUpTime = undefined

function initFileScopeVar() {
	mouseDownOnCropBorderOrVertex = undefined
	hasHoverRectInCanvas = false
	isWheeling = false
	wheelSetTimeout = undefined
	spaceKeyDown = false
	mouseDownTime = undefined
	mouseUpTime = undefined
}

function clearCanvas(ctx: CanvasRenderingContext2D) {
	ctx.clearRect(-CancasSafeArea / 2, -CancasSafeArea / 2, CancasSafeArea, CancasSafeArea)
}

function loadImage(src: string): Promise<HTMLImageElement> {
	let img = new Image()
	// img.crossOrigin = 'anonymous'
	img.src = src
	return new Promise((resolve, reject) => {
		if (img.complete) {
			resolve(img)
		} else {
			img.onload = function () {
				resolve(img)
			}
			img.onerror = function () {
				reject('图片加载失败:' + img.src)
			}
		}
	})
}

function drawImage(ctx: CanvasRenderingContext2D, img: CanvasImageSource, left: number, top: number, width: number, height: number) {
	ctx.drawImage(img, left, top, width, height)
}

function drawLayerBg(ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
	ctx.fillRect(-CancasSafeArea / 2, -CancasSafeArea / 2, CancasSafeArea, CancasSafeArea)
}

function drawLayerImageData(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number) {
	ctx.clearRect(left, top, width, height)
}

function drawLayerBorder(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number) {
	ctx.setLineDash([])
	ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
	ctx.lineWidth = 2
	ctx.strokeRect(left, top, width, height)
}

function getElementWH(ele: HTMLElement) {
	let rect = ele.getClientRects()[0]
	return rect
		? {
				top: rect.top,
				right: rect.right,
				bottom: rect.bottom,
				left: rect.left,
				width: rect.width,
				height: rect.height,
				x: rect.x,
				y: rect.y,
		  }
		: undefined
}

function initCanvasWH(ctx: CanvasRenderingContext2D, info: Rect) {
	ctx.canvas.width = info.width
	ctx.canvas.height = info.height
}

type ScaleReturn = {
	scale: number
	fit: 'height' | 'width'
}
function initScale(canvasWH: Rect, imgWH: HTMLImageElement): ScaleReturn {
	let widthRate = canvasWH.width / imgWH.width
	let heightRate = canvasWH.height / imgWH.height
	let scale = widthRate < heightRate ? widthRate : heightRate
	return {
		scale,
		fit: widthRate < heightRate ? 'height' : 'width',
	}
}
type ObjectToString = 'Number' | 'String' | 'Symbol' | 'Object' | 'Function' | 'Null'
function getVariableType(value) {
	let valueObjectString = Object.prototype.toString.call(value)
	return valueObjectString.slice(8, valueObjectString.length - 1) as ObjectToString
}

function amendDpi<T>(val: T, propers: Array<string | number> = ['width', 'height']): T | (T & Rect) {
	try {
		let valType = getVariableType(val)
		if (valType === 'Number') return ((val as unknown as number) * DPI) as unknown as T
		propers.forEach(properName => {
			val[properName] *= DPI
		})
	} catch (error) {
		console.error('ERROR', val, getVariableType(val), error)
	}
	return val as T & Rect
}
</script>

<style lang="scss" scoped>
.comp-ocr-img {
	position: relative;
	canvas {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}
	.canvas {
		z-index: 1;
	}
	.canvas2 {
		z-index: 2;
	}
	.status {
		position: absolute;
		bottom: 10px;
		left: 10px;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		.circle {
			width: 6px;
			height: 6px;
			border-radius: 100%;
			&.crop {
				background: cornflowerblue;
			}
			&.tag {
				background: coral;
			}
		}
		.text {
			margin-left: 10px;
			font-size: 14px;
			color: white;
		}
	}
	.tip {
		position: absolute;
		bottom: 10px;
		right: 10px;
		z-index: 3;
		color: white;
	}
}
kbd {
	background-color: #eee;
	border-radius: 3px;
	border: 1px solid #b4b4b4;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
	color: #333;
	display: inline-block;
	font-size: 0.85em;
	font-weight: 700;
	line-height: 1;
	padding: 2px 4px;
	white-space: nowrap;
}
</style>
