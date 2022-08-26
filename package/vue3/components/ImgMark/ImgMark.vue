<!--
Known issues
1. 组件的爷爷节点flex布局，且组件的父节点flex-shrink不为0，当被resize时候，鼠标hover样式位置不准


User Options
1. Down Sapce Key and Drag Mouse Move to Draw
2. Double Click Crop del crop
3. Click Tag to Hide Or Show Tag

Bugs


 -->
<template>
	<div
		class="comp-ocr-img"
		ref="containerRef"
		@mousedown="onMouseDown"
		@mouseenter="getContainerInfo"
		@click="onClick"
		@mouseup="onMouseUp"
		@mousemove="onMouseMove"
		@mouseout="onMouseOut"
		@mousewheel="onMouseWheel"
		@touchmove.stop.prevent="onTouchMove"
		@touchstart.stop="onTouchStart"
		@touchend.stop="onTouchEnd"
	>
		<canvas class="canvas" ref="canvasRef"></canvas>
		<canvas class="canvas2" ref="canvas2Ref"></canvas>
		<div class="mode-panel" v-if="props.isShowTip">
			<div class="status">
				<div class="circle" :class="{ crop: mode === 'crop', tag: mode === 'tag' }"></div>
				<div class="text">{{ mode === 'crop' ? '裁剪模式' : '标记错误行' }}</div>
			</div>
			<div class="tip">
				<slot name="tip">
					<kbd>Ctrl</kbd> +
					<kbd>B</kbd>
					<span style="font-size: 14px; margin-left: 10px">切换模式</span>
				</slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
export type CropConfig = {
	lineDash?: number[]
	strokeStyle?: string
	lineWidth?: number
}

export type Props = {
	cropConfig?: CropConfig
	layerConfig?: LayerConfig
	tagConfig?: TagConfig
	drawingText?: string
	isShowTip?: boolean
	enableScale?: boolean
	enableMove?: boolean
	enableDrawCrop?: boolean
	enableDrawTag?: boolean
	enableInteractiveTagChangeStatus?: boolean
	enableCropCross?: boolean
	handleResizeCropCross?: 'delete' | 'reset'
	enableInteractiveCropDelete?: boolean
	enableCropResize?: boolean
	//是否允许crop画到图片外
	enableDrawCropOutOfImg?: boolean
	//是否允许Tag画到crop外
	enableDrawTagOutOfCrop?: boolean
	//是否允许Tag画到img外
	enableDrawTagOutOfImg?: boolean
	//是否在无crop的时候以全图为crop
	isImgCrop?: boolean
	//是否crop为数量维持一个，新画crop的时候会自动清空之前的
	isCropSingle?: boolean
	cropList?: BoundingBox[]
	tagList?: BoundingBox[]
	mode?: Mode
	mobileOperation?: MobileOperation
	src: string
	precision?: number
}

export type Config = {
	cropConfig: Required<CropConfig>
	layerConfig: Required<LayerConfig>
	tagConfig: Required<TagConfig>
} & Pick<Props, 'drawingText'>

export type MobileOperation = 'draw' | 'move'

export type LayerConfig = {
	fillStyle?: string
}

export type TagConfig = {
	fontSize?: number //px单位，默认20
	showText?: boolean
	fillStyle?: string
	textFillStyle?: string
	hoverStrokeStyle?: string
	hoverLineWidth?: number
	hoverLineDash?: number[]
	highlightStrokeStyle?: string
	highlightLineWidth?: number
	highlightLineDash?: number[]
}

export type ResizeEmitType = {
	index: number
	box: BoundingBox
}

export type TagListChangeEmitRetunType = {
	type: TagListChangeType
	list: BoundingBox[]
	parentCrop?: BoundingBox
}

export type MouseOverInfoEmitType = {
	canvas: Point | null
	img: Point | null
}

export type TagListChangeType = 'add' | 'delete' | 'statusChange'
export type CropListChangeType = 'add' | 'delete' | 'resize'
// console.log('Init Component.')
import { nextTick, onBeforeUnmount, onMounted, unref, watch } from 'vue'
import device from 'current-device'
import { cloneDeep, groupBy, throttle } from 'lodash'
import {
	BoundingBox,
	ResizeItem,
	Mode,
	defaultWH,
	WH,
	Point,
	defaultPoint,
	Rect,
	amendDpi,
	getElementWH,
	initCanvasWH,
	loadImage,
	debug,
	initScale,
	transfromBoxToRect,
	drawImage,
	drawTagList,
	clearCanvas,
	transfromRect2Box,
	isBoxValidity,
	getTwoBoxIntersectPart,
	detectEventIsTriggerOnCropBorderOrVertex,
	findOneBorderOrVertex,
	LayerTouchEvent,
	moveDrawUnshowTagDashRect,
	moveDetectCropBorderSetCursor,
	moveCanvas,
	moveResizeCrop,
	moveDrawCropRect,
	moveDrawTagRect,
	getTouchPoint,
	amendMobileTouchEventDpi,
	getTwoFingerTouchListDistence,
	getHypotenuseValue,
	drawCropList,
	initBoundingArrScale,
	TypePoint,
	DPI,
	fixBoxInfo,
	pointIsInBoxList,
	DEFAULT_CONFIG,
	getVertexPositionByTwoPoints,
	getPointByBoxAndVertexPosition,
	VertexPosition,
	getBoxIsIntersectWithBoxList,
	boxAllInBoxList,
	transformBoxPrecision,
} from './util'

let spaceKeyDown = false

let mouseDownTime: number | undefined = undefined
let mouseUpTime: number | undefined = undefined

let clickedCrop: BoundingBox | null = null

let mouseQuickDoubleTapTime: {
	last: {
		down: number | undefined
		up: number | undefined
	}
	prev: {
		down: number | undefined
		up: number | undefined
	}
} = {
	last: {
		down: undefined,
		up: undefined,
	},
	prev: {
		down: undefined,
		up: undefined,
	},
}
const __zoomIntensity = device.mobile() ? (0.1 / DPI) * 1.5 : 0.1
let zoomIntensity = __zoomIntensity
let hasHoverRectInTagItem = false

function initVar() {
	clickedCrop = null
	hasHoverRectInTagItem = false
	zoomIntensity = __zoomIntensity
	status.resizeCropHovering = undefined
}

let props = withDefaults(defineProps<Props>(), {
	tagConfig: () => DEFAULT_CONFIG.tagConfig,
	layerConfig: () => DEFAULT_CONFIG.layerConfig,
	cropConfig: () => DEFAULT_CONFIG.cropConfig,
	isShowTip: false,
	enableMove: true,
	enableScale: true,
	enableDrawCrop: true,
	enableDrawTag: true,
	enableCropCross: false,
	enableInteractiveTagChangeStatus: true,
	handleResizeCropCross: 'reset',
	enableCropResize: true,
	enableInteractiveCropDelete: true,
	enableDrawCropOutOfImg: true,
	enableDrawTagOutOfCrop: true,
	enableDrawTagOutOfImg: true,
	isCropSingle: false,
	isImgCrop: false,
	mode: 'crop',
	mobileOperation: 'move',
	precision: 0,
	tagList: () => Array(),
	cropList: () => Array(),
})

let emits = defineEmits<{
	(e: 'update:cropList', list: BoundingBox[]): void
	(
		e: 'cropListChange',
		data: {
			type: CropListChangeType
			list: BoundingBox[]
		}
	): void
	(e: 'update:tagList', list: BoundingBox[]): void
	(e: 'tagListChange', data: TagListChangeEmitRetunType): void
	(e: 'update:mode', mode: Mode): void
	(e: 'update:mobileOperation', mode: MobileOperation): void
	(e: 'resizeStart', data: ResizeEmitType): void
	(e: 'resizeEnd', data: ResizeEmitType): void
	(e: 'delCrop', list: BoundingBox[]): void
	(e: 'drawCropStart'): void
	(e: 'drawTagStart'): void
	(e: 'mouseOverInfo', info: MouseOverInfoEmitType): void
}>()

type RectDom = Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left' | 'width' | 'height' | 'x' | 'y'>

let inited = false
let ctx: CanvasRenderingContext2D | null = null
let ctx2: CanvasRenderingContext2D | null = null
let img: HTMLImageElement | undefined
let canvasWH: RectDom | undefined = cloneDeep(defaultWH) as RectDom
let imgWH: WH = cloneDeep(defaultWH)
let startMousePoint: Point = cloneDeep(defaultPoint) as Point
let endMousePoint: Point = cloneDeep(defaultPoint) as Point
let twoFingerCenterPoint: Point = {
	x: 0,
	y: 0,
}
let hypotenuse = 0
let currentPosition: Point = {
	x: 0,
	y: 0,
}
let origin: Point = {
	x: 0,
	y: 0,
}
let scale = 1
let cropInfo: BoundingBox | undefined
let tmpCurrentPosition: Point | undefined
let cropScale = 1
let containerInfo: RectDom | undefined
let zoomScale = 1
let tmpCropPositionInfo: Rect | undefined
let tmpTagPositionInfo: Rect | undefined
let tagArr: BoundingBox[] = []
let cropArr: BoundingBox[] = []

let config = $computed<Config>(() => {
	let obj = cloneDeep(DEFAULT_CONFIG)
	Object.assign(obj.cropConfig, props.cropConfig)
	Object.assign(obj.tagConfig, props.tagConfig)
	Object.assign(obj.layerConfig, props.layerConfig)
	obj.drawingText = props.drawingText
	return obj
})

function initDataVar() {
	inited = false
	ctx = null
	ctx2 = null
	img = undefined
	canvasWH = cloneDeep(defaultWH) as RectDom
	imgWH = cloneDeep(defaultWH) as WH
	startMousePoint = cloneDeep(defaultPoint) as Point
	endMousePoint = cloneDeep(defaultPoint) as Point
	currentPosition = {
		x: 0,
		y: 0,
	}
	origin = {
		x: 0,
		y: 0,
	}
	scale = 1
	cropInfo = undefined
	tmpCurrentPosition = undefined
	cropScale = 1
	containerInfo = undefined
	zoomScale = 1
	tmpCropPositionInfo = undefined
	tmpTagPositionInfo = undefined
	tagArr = []
	cropArr = []
}

let containerRef = $ref<HTMLDivElement>()
let canvasRef = $ref<HTMLCanvasElement>()
let canvas2Ref = $ref<HTMLCanvasElement>()

/* 抽象动作状态相关 */
let status = {
	isScaleing: false,
	isDrawRecting: false,
	isMoving: false,
	resizeCropHovering: undefined as unknown as ResizeItem | undefined,
	isMouseDown: () => (startMousePoint.x === undefined ? false : true),
	isMouseUpDownPoints: () => startMousePoint.x !== undefined && endMousePoint.x !== undefined,
}

/* 抽象动作相关 */
let actions = {
	//画方块一半被打断
	dragCreatRectInterrupt() {
		cleartMousePoints()
	},
	dragCreatOrResizeRect(type: 'drawCrop' | 'drawTag' | 'resizeCrop') {
		if (!ctx2) return
		if (type == 'drawCrop') {
			if (props.isCropSingle && !status.isDrawRecting) {
				cropArr = []
			}
			if (!status.isDrawRecting) {
				emits('drawCropStart')
			}
			status.isDrawRecting = true

			tmpCropPositionInfo = moveDrawCropRect(ctx2, startMousePoint, endMousePoint, zoomScale, origin, cropArr, currentPosition, config)
			drawTagList(ctx2, tagArr, currentPosition, config)
		}

		if (type == 'drawTag') {
			if (!status.isDrawRecting) {
				emits('drawTagStart')
			}
			status.isDrawRecting = true
			drawCropList(ctx2, cropArr, currentPosition, config)
			tmpTagPositionInfo = moveDrawTagRect(ctx2, startMousePoint, endMousePoint, zoomScale, origin, tagArr, currentPosition, config)
		}

		if (type == 'resizeCrop') {
			if (props.enableCropResize && status.resizeCropHovering) {
				clickedCrop = cropArr[status.resizeCropHovering.index || 0]
				if (!status.resizeCropHovering || !clickedCrop) return

				status.isDrawRecting = true

				tmpCropPositionInfo = moveResizeCrop(
					ctx2,
					startMousePoint,
					endMousePoint,
					clickedCrop,
					clickedCrop.scale || 1,
					zoomScale,
					currentPosition,
					tagArr,
					status.resizeCropHovering,
					cropArr.filter((item, i) => i !== status.resizeCropHovering?.index),
					config
				)
			} else {
				actions.move()
			}
		}
	},
	changeMode() {
		if (props.mode === 'tag') {
			emits('update:mode', 'crop')
		} else {
			emits('update:mode', 'tag')
		}
	},
	scale(zoom: number, mouse: Point) {
		if (!img || !ctx || !ctx2) {
			throw new Error(`can't find canvas ctx or img`)
		}
		status.isScaleing = true
		ctx.translate(origin.x, origin.y)
		ctx2.translate(origin.x, origin.y)
		origin = {
			x: origin.x - (mouse.x / (zoomScale * zoom) - mouse.x / zoomScale),
			y: origin.y - (mouse.y / (zoomScale * zoom) - mouse.y / zoomScale),
		}
		ctx.scale(zoom, zoom)
		ctx2.scale(zoom, zoom)
		ctx.translate(-origin.x, -origin.y)
		ctx2.translate(-origin.x, -origin.y)

		zoomScale *= zoom
		//动态设置字体大小
		// ctx2.font = `${8 * zoomScale}px serif`
		// ctx2.font = `20px serif`
		clearCanvas(ctx)
		clearCanvas(ctx2)
		drawImage(ctx, img, currentPosition.x, currentPosition.y, imgWH.width * scale, imgWH.height * scale)
		renderCtx2()
		hasHoverRectInTagItem = false
		status.isScaleing = false
	},
	move() {
		if (!props.enableMove || !ctx || !ctx2 || !img || status.isScaleing) return
		status.isMoving = true
		let offsetInfo = moveCanvas(ctx, ctx2, img, imgWH, scale, currentPosition, startMousePoint, endMousePoint, cropArr, zoomScale, tagArr, config)
		if (offsetInfo) {
			tmpCurrentPosition = cloneDeep(currentPosition)
			if (!tmpCurrentPosition) return
			tmpCurrentPosition.x += offsetInfo.offsetX
			tmpCurrentPosition.y += offsetInfo.offsetY
		}
	},
	hoverRect(event: LayerTouchEvent) {
		if (!ctx2) return
		//画Tag虚线部分
		hasHoverRectInTagItem = moveDrawUnshowTagDashRect(
			ctx2,
			props.mode,
			tagArr,
			zoomScale,
			currentPosition,
			origin,
			event,
			cropArr,
			status.isScaleing,
			hasHoverRectInTagItem,
			config
		)
		if (props.enableCropResize && !spaceKeyDown) {
			//检测鼠标是否在裁剪框四边上
			moveDetectCropBorderSetCursor(containerRef, event, props.mode, cropArr, zoomScale, currentPosition, origin, status.isScaleing)
		}
	},
}

/* 抽象组件hooks */
let hooks = {
	/* Ctrl+B 弹起 */
	onKeyUpCtrlB() {
		actions.changeMode()
	},
	/* Space 弹起 */
	onKeyUpSpace() {
		if (!status.isMoving && !status.resizeCropHovering) {
			actions.dragCreatRectInterrupt()
		}
		spaceKeyDown = false
	},
	onKeyDownSpace() {
		if ((props.enableDrawCrop && props.mode === 'crop') || (props.enableDrawTag && props.mode === 'tag')) {
			containerRef.style.cursor = 'crosshair'
		}
		if (!status.isMouseDown()) {
			spaceKeyDown = true
		}
	},
	onMouseOverMove(event: LayerTouchEvent) {
		//当没有鼠标按下的时候
		if (device.mobile()) {
			this.onHoldMouseLeftBtnMove(event)
		} else {
			if (!status.isMouseDown() && !device.mobile()) {
				actions.hoverRect(event)
				return
			}
			this.onHoldMouseLeftBtnMove(event)
		}
	},
	/* 按着空格移动 */
	onSpaceMove() {
		if (props.mode === 'crop') {
			if (props.enableDrawCrop) {
				actions.dragCreatOrResizeRect('drawCrop')
			}
		} else {
			if (props.enableDrawTag) {
				actions.dragCreatOrResizeRect('drawTag')
			}
		}
	},
	onHoldMouseLeftBtnMove(event: LayerTouchEvent) {
		endMousePoint = {
			x: event.layerX,
			y: event.layerY,
		}

		if (!spaceKeyDown) {
			//在crop模式的时候 检测是否在crop的边或者顶点上， 是的话执行放大缩小crop的逻辑，否的话拖动画布
			if (props.mode === 'tag') {
				actions.move()
			}
			if (props.mode === 'crop') {
				if (status.resizeCropHovering) {
					// console.log('AT RESIZE CROP.')
					actions.dragCreatOrResizeRect('resizeCrop')
				} else {
					actions.move()
				}
			}
		} else {
			this.onSpaceMove()
		}
	},
	onDoubleClick(touchPoint: TypePoint) {
		if (props.mode === 'crop' && props.enableInteractiveCropDelete) {
			let removeCropInfo = pointIsInBoxList(touchPoint, cropArr, scale, currentPosition)
			removeCropItems(removeCropInfo.boxList)
		}

		if (props.mode === 'tag') {
			let { boxList } = pointIsInBoxList(touchPoint, tagArr, scale, currentPosition)
			boxList.forEach(item => {
				item?.onDoubleClick?.('', item)
			})
		}
	},
	onCick(touchPoint: TypePoint) {
		if (props.mode !== 'tag') return
		if (!ctx2) return

		let { boxList } = pointIsInBoxList(touchPoint, tagArr, scale, currentPosition)
		boxList.forEach(item => {
			item?.onClick?.('', item)
		})

		if (props.enableInteractiveTagChangeStatus) {
			drawCropList(ctx2, cropArr, currentPosition, config)
			let { isReDraw, redrawList } = drawTagList(ctx2, tagArr, currentPosition, config, undefined, touchPoint)
			if (isReDraw) {
				renderCtx2()
				triggerTagListChange('statusChange', getTagList(redrawList))
			}
		}
	},
	onWheel(zoom: number, mouse: Point, privateCall?: boolean) {
		if (props.enableScale || privateCall) {
			actions.scale(zoom, mouse)
		}
	},
	/* 初始化 */
	init() {
		initComponent().then(() => {
			inited = true
		})
	},

	/* window resize */
	resize() {
		requestAnimationFrame(() => {
			console.log('resized')
			resizeRender()
		})
	},
}

function onKeyDownListener(e) {
	if (e.code === 'Space') {
		e.preventDefault()
		hooks.onKeyDownSpace()
	}
}

function onKeyUpListener(e) {
	if (e.code === 'KeyB' && e.ctrlKey) {
		hooks.onKeyUpCtrlB()
	}
	if (e.code === 'Space') {
		hooks.onKeyUpSpace()
	}
}
function addListenerKeyUpDown() {
	if (device.mobile()) return
	document.addEventListener('keydown', onKeyDownListener)
	document.addEventListener('keyup', onKeyUpListener)
}

function removeListenerKeyUpDown() {
	if (device.mobile()) return
	document.removeEventListener('keydown', onKeyDownListener)
	document.removeEventListener('keyup', onKeyUpListener)
}

function initCropInfo() {
	if (props.cropList.length > 1) {
		let cropRect = {
			startX: Infinity,
			startY: Infinity,
			endX: -Infinity,
			endY: -Infinity,
		}
		props.cropList.forEach(cropInfo => {
			let rectInfo = fixBoxInfo(cropInfo)
			if (rectInfo.info.startX < cropRect.startX) {
				cropRect.startX = rectInfo.info.startX
			}
			if (rectInfo.info.startY < cropRect.startY) {
				cropRect.startY = rectInfo.info.startY
			}
			if (rectInfo.info.endX > cropRect.endX) {
				cropRect.endX = rectInfo.info.endX
			}
			if (rectInfo.info.endY > cropRect.endY) {
				cropRect.endY = rectInfo.info.endY
			}
		})
		cropInfo = cropRect
	}
	if (props.cropList.length == 1) {
		cropInfo = props.cropList[0]
	}
}

function getContainerInfo() {
	let containerRectInfo = containerRef.getBoundingClientRect()
	containerInfo = {
		top: containerRectInfo.top,
		right: containerRectInfo.right,
		bottom: containerRectInfo.bottom,
		left: containerRectInfo.left,
		width: containerRectInfo.width,
		height: containerRectInfo.height,
		x: containerRectInfo.x,
		y: containerRectInfo.y,
	}
}

async function initComponent() {
	//处理文件变量
	initVar()
	//初始化Vue data变量
	initDataVar()
	await nextTick()
	//初始化prop到data
	initCropInfo()
	tagArr = cloneDeep(props.tagList)
	cropArr = cloneDeep(props.cropList)
	getContainerInfo()
	addListenerKeyUpDown()
	initMobileOperation()
	ctx = canvasRef.getContext('2d')
	ctx2 = canvas2Ref.getContext('2d')

	if (!ctx || !ctx2) return Promise.reject(`Error: can't find canvas element.`)
	canvasWH = amendDpi(getElementWH(ctx.canvas))
	if (!canvasWH) return Promise.reject(`Error: can't get canvas height and width.`)
	initCanvasWH(ctx, canvasWH)
	initCanvasWH(ctx2, canvasWH)
	return loadImage(props.src).then(_img => {
		if (!canvasWH || !ctx || !ctx2) return Promise.reject(`canvasWH or canvas var not has valid values.`)
		img = _img
		imgWH = {
			width: img.width,
			height: img.height,
		}
		// console.log('WH', canvasWH, imgWH)
		// if (debug) console.log('Image WH', imgWH, canvasWH)
		let initScaleInfo = initScale(canvasWH, img)
		scale = cropScale = initScaleInfo.scale
		// if (debug) console.log('Scale', scale)
		// if (debug) console.log('Image Current', currentPosition.x, currentPosition.y, imgWH.width * scale, imgWH.height * scale)
		//处理没有cropInfo的情况
		if (!cropInfo) {
			if (initScaleInfo.fit === 'width') {
				currentPosition.x = (canvasWH.width - imgWH.width * scale) / 2
			} else {
				currentPosition.y = (canvasWH.height - imgWH.height * scale) / 2
			}
			cropInfo = {
				startX: 0,
				startY: 0,
				endX: 0 + imgWH.width,
				endY: 0 + imgWH.height,
			}

			if (props.isImgCrop) {
				cropArr = [cropInfo]
				triggerCropListChange('add', cropArr)
			}
		}
		//处理有CropInfo的情况，放大裁剪区域至全屏中间
		else {
			// if (debug) console.log(cropInfo)
			let cropBoxInfo = transfromBoxToRect(cropInfo, cropScale, currentPosition)
			let whiteRate = 0.05
			let widthRate = (canvasWH.width - canvasWH.width * whiteRate) / cropBoxInfo[2]
			let heightRate = (canvasWH.height - canvasWH.height * whiteRate) / cropBoxInfo[3]

			// if (debug) console.log('RATE', widthRate, heightRate)
			// let boxStretchScale = cropBoxInfo[2] * widthRate <= canvasWH.width ? widthRate : heightRate  //宽度放大
			/* tips
			box
			innerBox

			boxAspectRatio<innerBoxAspectRatio  width fix
			boxAspectRatio>innerBoxAspectRatio  height fix
			*/
			let boxStretchScale = canvasWH.width / canvasWH.height > cropBoxInfo[2] / cropBoxInfo[3] ? heightRate : widthRate // 长边尽量展示出来
			let canvasZoom = boxStretchScale

			let cropX = cropBoxInfo[0] + cropBoxInfo[2]
			let cropY = cropBoxInfo[1] + cropBoxInfo[3]

			if (boxStretchScale === widthRate) {
				currentPosition.x = (canvasWH.width - cropX * canvasZoom - (canvasWH.width * whiteRate) / 2) / canvasZoom
				currentPosition.y = ((canvasWH.height - cropBoxInfo[3] * canvasZoom) / 2 - cropBoxInfo[1] * canvasZoom) / canvasZoom
			} else {
				currentPosition.x = ((canvasWH.width - cropBoxInfo[2] * canvasZoom) / 2 - cropBoxInfo[0] * canvasZoom) / canvasZoom
				currentPosition.y = (canvasWH.height - cropY * canvasZoom - (canvasWH.height * whiteRate) / 2) / canvasZoom
			}

			onMouseWheel(
				{
					deltaY: 1,
					clientX: 0,
					clientY: 0,
					preventDefault() {
						if (debug) console.log('preventDefault')
					},
					stopPropagation() {
						if (debug) console.log('preventDefault')
					},
					__zoom: canvasZoom,
				} as unknown as MouseEvent,
				true
			)
		}
		drawImage(ctx, img, currentPosition.x, currentPosition.y, img.width * scale, img.height * scale)
		// let initPosition = transfromBoxToRect(cropInfo, cropScale, currentPosition)
		// if (debug) console.log('Crop Current', initPosition)
		// drawCropRect(ctx2, ...initPosition)
		cropArr = initBoundingArrScale(cropArr, scale, props.precision)
		tagArr = initBoundingArrScale(tagArr, scale, props.precision)
		renderCtx2()
		return true
	})
}

function initResizeVar() {
	clickedCrop = null
	inited = false
	canvasWH = cloneDeep(defaultWH) as RectDom
	startMousePoint = cloneDeep(defaultPoint) as Point
	endMousePoint = cloneDeep(defaultPoint) as Point
	containerInfo = undefined
}

function renderCtx2() {
	if (!ctx2) return
	drawCropList(ctx2, cropArr, currentPosition, config)
	drawTagList(ctx2, tagArr, currentPosition, config)
}

async function resizeRender() {
	initResizeVar()
	await nextTick()
	getContainerInfo()

	if (!ctx || !ctx2 || !img) {
		console.error(`ctx or ctx2 or img can't find on resize.`)
		return
	}
	canvasWH = amendDpi(getElementWH(ctx.canvas))
	if (!canvasWH) return Promise.reject(`Error: can't get canvas height and width.`)
	initCanvasWH(ctx, canvasWH)
	initCanvasWH(ctx2, canvasWH)
	ctx.scale(zoomScale, zoomScale)
	ctx2.scale(zoomScale, zoomScale)
	ctx.translate(-origin.x, -origin.y)
	ctx2.translate(-origin.x, -origin.y)
	drawImage(ctx, img, currentPosition.x, currentPosition.y, img.width * scale, img.height * scale)
	cropArr = initBoundingArrScale(cropArr, scale, props.precision)
	tagArr = initBoundingArrScale(tagArr, scale, props.precision)
	renderCtx2()
	inited = true
}

function initMobileOperation() {
	if (!device.mobile()) return
	if (props.mobileOperation === 'draw') {
		hooks.onKeyDownSpace()
	}

	if (props.mobileOperation === 'move') {
		hooks.onKeyUpSpace()
	}
}

function onWindowResize() {
	hooks.resize()
}
onBeforeUnmount(() => {
	window.removeEventListener('resize', onWindowResize)
	removeListenerKeyUpDown()
	initVar()
})

onMounted(() => {
	hooks.init()
	window.addEventListener('resize', onWindowResize)
})
//修正鼠标cursor
watch(
	() => props.mode,
	mode => {
		if (mode === 'tag') {
			containerRef.style.cursor = 'auto'
		}
	}
)
watch(
	() => props.src,
	src => {
		if (!src) return
		hooks.init()
	}
)

watch(
	() => props.mobileOperation,
	mobileOperation => {
		if (!inited) return
		initMobileOperation()
	}
)

watch(
	() => props.tagList,
	list => {
		if (!inited) return
		tagArr = initBoundingArrScale(list, scale, props.precision)
		renderCtx2()
	},
	{
		deep: true,
	}
)

watch(
	() => props.cropList,
	list => {
		if (!inited) return
		cropArr = initBoundingArrScale(list, scale, props.precision)
		renderCtx2()
	}
)

function onMouseWheel(e: MouseEvent, privateCall?: boolean) {
	if (props.enableScale) {
		e.stopPropagation()
		e.preventDefault()
	}
	let event = e as unknown as LayerTouchEvent &
		MouseEvent & {
			deltaY: number
			__zoom: number
			onTouchMove: boolean
		}
	if (!containerInfo) {
		throw new Error(`can't find  containerInfo.`)
	}

	if (!inited && !event.__zoom) return

	//空格键按下的时候不能缩放
	if (status.isDrawRecting || status.isMoving) return
	//有startMousePoint的时候也不能缩放
	// if ((startMousePoint.x !== undefined || endMousePoint.x !== undefined) && !event.onTouchMove) return
	let dpi = event.onTouchMove ? 1 : DPI
	let mousex = privateCall ? 0 : (event.clientX - containerInfo.left) * dpi
	let mousey = privateCall ? 0 : (event.clientY - containerInfo.top) * dpi
	let wheel = event.deltaY < 0 ? 1 : -1
	let zoom = privateCall ? event.__zoom : Math.exp(wheel * zoomIntensity)

	//缩放系数过小，不能缩放
	if (zoomScale * zoom < 0.2) return
	hooks.onWheel(
		zoom,
		{
			x: mousex,
			y: mousey,
		},
		privateCall
	)
}

function setResizeCrop(newCropInfo: BoundingBox) {
	if (status.resizeCropHovering) {
		cropArr[status.resizeCropHovering.index] = newCropInfo
		emits('resizeEnd', {
			index: status.resizeCropHovering.index,
			box: newCropInfo,
		})
		triggerCropListChange('resize', getCropList([newCropInfo]))
	}
}

function cleartMousePoints() {
	if (!inited) return
	status.isMoving = false
	if (tmpCurrentPosition) currentPosition = cloneDeep(tmpCurrentPosition)
	tmpCurrentPosition = undefined

	if (status.isMouseUpDownPoints()) {
		if (props.mode === 'crop') {
			if (tmpCropPositionInfo) {
				let newCropInfo = {
					...clickedCrop,
					...transfromRect2Box(tmpCropPositionInfo, currentPosition, scale),
				}
				clickedCrop = null
				if (status.resizeCropHovering) {
					if (!props.enableCropCross) {
						let intersectFlag = getBoxIsIntersectWithBoxList(
							newCropInfo,
							cropArr.filter((item, index) => index !== status.resizeCropHovering?.index)
						)
						if (intersectFlag) {
							if (props.handleResizeCropCross === 'reset') {
								renderCtx2()
							}
							if (props.handleResizeCropCross === 'delete') {
								let removeItem = cropArr[status.resizeCropHovering.index]
								removeCropItems([removeItem])
							}
						} else {
							setResizeCrop(newCropInfo)
						}
					} else {
						setResizeCrop(newCropInfo)
					}
				} else {
					newCropInfo = initBoundingArrScale([newCropInfo], scale, props.precision)[0]
					if (props.enableCropCross) {
						cropArr.push(newCropInfo)
						triggerCropListChange('add', getCropList([newCropInfo]))
					} else {
						//判断crop是否和其他box相交，相交就不保存
						let intersectFlag = getBoxIsIntersectWithBoxList(newCropInfo, cropArr)
						if (!intersectFlag) {
							cropArr.push(newCropInfo)
							triggerCropListChange('add', getCropList([newCropInfo]))
						} else {
							renderCtx2()
						}
					}
				}
				tmpCropPositionInfo = undefined
			}
		} else {
			if (tmpTagPositionInfo) {
				let vertexPosition = getVertexPositionByTwoPoints(startMousePoint, endMousePoint)
				let tagInfo = transfromRect2Box(tmpTagPositionInfo, currentPosition, scale)
				tagInfo = initBoundingArrScale([tagInfo], scale, props.precision)[0]
				Object.assign(tagInfo, {
					isShow: true,
					__newAdd: true,
					__vertexPosition: vertexPosition,
				})
				tagArr.push(tagInfo)
				triggerTagListChange('add', getTagList([tagInfo]))
				tmpTagPositionInfo = undefined
			}
		}
	}

	status.resizeCropHovering = undefined
	status.isDrawRecting = false
	startMousePoint = cloneDeep(defaultPoint) as Point
	endMousePoint = cloneDeep(defaultPoint) as Point
	containerRef.style.cursor = 'auto'
}

function triggerCropListChange(type: CropListChangeType, changedList: BoundingBox[]) {
	let list = getCropList(cropArr)
	emits('update:cropList', list)
	emits('cropListChange', {
		type,
		list: changedList,
	})
}

function triggerTagListChange(type: TagListChangeType, changedList: BoundingBox[]) {
	let changeParam: TagListChangeEmitRetunType = {
		type,
		list: changedList,
	}
	if (type === 'add') {
		let tag = changedList.filter(i => Reflect.get(i, '__parentCrop'))[0]
		if (tag) {
			changeParam.parentCrop = getCropList([Reflect.get(tag, '__parentCrop')])[0]
			delete tag['__parentCrop']
		}
	}
	emits('tagListChange', changeParam)

	let list = getTagList(tagArr)
	emits('update:tagList', list)
}

type TagItemTmp = BoundingBox & {
	scale?: number
	__isValidity?: boolean
	__newAdd?: boolean
	__vertexPosition?: VertexPosition
	__groupIndex?: number
	__parentCrop?: BoundingBox
}

function getTagList(tagList?: BoundingBox[]) {
	let list = tagList || tagArr
	let cropList = cropArr
	let resultList: TagItemTmp[] = []
	list.forEach(tag => {
		let newTagInfo: TagItemTmp = tag
		if (!props.enableDrawTagOutOfCrop && newTagInfo.__newAdd && newTagInfo.__vertexPosition) {
			let tagStartXYinCropList = pointIsInBoxList(getPointByBoxAndVertexPosition(newTagInfo, newTagInfo.__vertexPosition), cropList)
			let mousePointCropInfo = tagStartXYinCropList.boxList[0]
			if (!mousePointCropInfo) return
			let intersectPart = getTwoBoxIntersectPart(newTagInfo, mousePointCropInfo)
			if (!intersectPart) {
				newTagInfo.__isValidity = false
			} else {
				if (!isBoxValidity(intersectPart)) {
					newTagInfo.__isValidity = false
				} else {
					Object.assign(newTagInfo, intersectPart)
					newTagInfo.__parentCrop = mousePointCropInfo
				}
			}
		}
		delete newTagInfo.__newAdd
		Reflect.deleteProperty(newTagInfo, '__vertexPosition')
		if (props.enableDrawTagOutOfCrop && !props.enableDrawTagOutOfImg) {
			let whObj = imgWH
			const imgRect = {
				startX: 0,
				startY: 0,
				endX: whObj.width,
				endY: whObj.height,
			}
			let intersectPart = getTwoBoxIntersectPart(newTagInfo, imgRect)
			if (!intersectPart) {
				newTagInfo.__isValidity = false
			} else {
				if (!isBoxValidity(intersectPart)) {
					newTagInfo.__isValidity = false
				} else {
					Object.assign(newTagInfo, intersectPart)
				}
			}
		}
		let fixBox = fixBoxInfo(newTagInfo)
		resultList.push(transformBoxPrecision(fixBox.info, props.precision))
	})
	return resultList.filter(i => i.__isValidity !== false)
}

function getCropList(cropList?: BoundingBox[]): BoundingBox[] {
	let arr = cropList || cropArr
	let list = arr.map(crop => {
		let result = crop as BoundingBox & { _del?: boolean }

		if (!props.enableDrawCropOutOfImg) {
			let whObj = imgWH
			const imgRect = {
				startX: 0,
				startY: 0,
				endX: whObj.width,
				endY: whObj.height,
			}
			let intersectPart = getTwoBoxIntersectPart(result, imgRect)
			if (!intersectPart) {
				result._del = true
			} else {
				if (isBoxValidity(intersectPart)) {
					result = {
						...crop,
						...intersectPart,
					}
				} else {
					result._del = true
				}
			}
		}
		Reflect.deleteProperty(result, '__vertexPosition')
		let fixBox = fixBoxInfo(result)

		return transformBoxPrecision(fixBox.info, props.precision) as BoundingBox & { _del?: boolean }
	})
	return list.filter(i => !i._del)
}

function onMouseDown(e: MouseEvent) {
	if (!inited || !ctx || !ctx2) return
	let time = new Date().getTime()
	mouseDownTime = time
	if (mouseQuickDoubleTapTime.prev.down) {
		mouseQuickDoubleTapTime.last.down = time
	} else {
		mouseQuickDoubleTapTime.prev.down = time
	}

	let event = {
		layerX: Reflect.get(e, 'layerX'),
		layerY: Reflect.get(e, 'layerY'),
	} as LayerTouchEvent
	event = amendDpi(event, ['layerX', 'layerY'])
	startMousePoint = {
		x: event.layerX,
		y: event.layerY,
	}

	//检测是否点在了crop的border或者vertex上边
	if (props.mode === 'crop' && !spaceKeyDown && props.enableCropResize) {
		let detectResult = detectEventIsTriggerOnCropBorderOrVertex(event, cropArr, zoomScale, currentPosition, origin)
		if (detectResult.hasIn) {
			status.resizeCropHovering = findOneBorderOrVertex(detectResult.list)
			emits('resizeStart', {
				index: status.resizeCropHovering.index,
				box: cropArr[status.resizeCropHovering.index],
			})
		}
	}
}
let triggerMouseOverInfo = throttle(
	function (event?: LayerTouchEvent) {
		if (event) {
			let canvasPosition = getTouchPoint(event, zoomScale, origin, 'over')
			let imgPosition = cloneDeep(canvasPosition)
			imgPosition.x -= currentPosition.x
			imgPosition.y -= currentPosition.y
			imgPosition.x /= scale
			imgPosition.y /= scale
			emits('mouseOverInfo', {
				canvas: canvasPosition,
				img: imgPosition,
			})
		} else {
			emits('mouseOverInfo', {
				canvas: null,
				img: null,
			})
		}
	},
	100,
	{
		leading: false,
		trailing: true,
	}
)

function onMouseMove(e: MouseEvent) {
	if (!inited) return
	let event = {
		layerX: Reflect.get(e, 'layerX'),
		layerY: Reflect.get(e, 'layerY'),
	} as LayerTouchEvent
	event = amendDpi(event, ['layerX', 'layerY'])
	mouseUpTime = new Date().getTime()
	hooks.onMouseOverMove(event)
	triggerMouseOverInfo(event)
}

function onMouseUp() {
	if (!inited) return
	let time = new Date().getTime()
	if (mouseQuickDoubleTapTime.prev.up) {
		mouseQuickDoubleTapTime.last.up = time
	} else {
		mouseQuickDoubleTapTime.prev.up = time
	}

	cleartMousePoints()
}

function onMouseOut() {
	if (!inited) return
	containerRef.style.cursor = 'auto'
	cleartMousePoints()
	triggerMouseOverInfo()
}

function onClick(e) {
	getContainerInfo()
	if (!inited) return
	let event = {
		layerX: Reflect.get(e, 'layerX'),
		layerY: Reflect.get(e, 'layerY'),
	} as LayerTouchEvent

	event = amendDpi(event, ['layerX', 'layerY'])
	let touchPoint = getTouchPoint(event, zoomScale, origin, 'click')
	let clickInterval = mouseUpTime && mouseDownTime ? mouseUpTime - mouseDownTime : 0
	mouseDownTime = undefined
	mouseUpTime = undefined
	if (clickInterval > 100) {
		return
	}
	hooks.onCick(touchPoint)

	const minInterval = 360
	if (mouseQuickDoubleTapTime.prev.up && mouseQuickDoubleTapTime.prev.down && mouseQuickDoubleTapTime.last.up && mouseQuickDoubleTapTime.last.down) {
		if (mouseQuickDoubleTapTime.last.up - mouseQuickDoubleTapTime.prev.down < minInterval) {
			hooks.onDoubleClick(touchPoint)
		}
		//将last值设置为prev，last设置为空
		mouseQuickDoubleTapTime.prev.down = mouseQuickDoubleTapTime.last.down
		mouseQuickDoubleTapTime.prev.up = mouseQuickDoubleTapTime.last.up
		mouseQuickDoubleTapTime.last.down = undefined
		mouseQuickDoubleTapTime.last.up = undefined
	}
}

function onTouchStart(event: TouchEvent) {
	getContainerInfo()
	mouseDownTime = new Date().getTime()
	let touchList = event.touches
	if (event.touches.length === 1) {
		let fakeEvent = {
			layerX: touchList[0].clientX,
			layerY: touchList[0].clientY,
		} as unknown as MouseEvent
		onMouseDown(fakeEvent)
	}
	if (event.touches.length == 2) {
		if (!containerInfo) {
			throw new Error(`can't find  containerInfo.`)
		}
		let amendTouchList = amendMobileTouchEventDpi(event)
		let { width, height } = getTwoFingerTouchListDistence(amendTouchList)
		let hypotenuse = getHypotenuseValue(width, height) // 移动中的双指距离
		hypotenuse = hypotenuse

		twoFingerCenterPoint = {
			x: (amendTouchList[0].clientX + amendTouchList[1].clientX) / 2 - containerInfo.left,
			y: (amendTouchList[0].clientY + amendTouchList[1].clientY) / 2 - containerInfo.top,
		}
	}
}

function onTouchMove(event: TouchEvent) {
	mouseUpTime = new Date().getTime()
	let touchList = event.touches
	// let touchList = amendMobileTouchEventDpi(event)
	if (event.touches.length === 1) {
		onMouseMove({
			layerX: touchList[0].clientX,
			layerY: touchList[0].clientY,
		} as unknown as MouseEvent)
	}
	if (event.touches.length == 2) {
		if (!containerInfo) {
			throw new Error(`can't find  containerInfo.`)
		}
		let amendTouchList = amendMobileTouchEventDpi(event)
		let { width, height } = getTwoFingerTouchListDistence(amendTouchList)
		let _hypotenuse = getHypotenuseValue(width, height) // 移动中的双指距离
		let distance = _hypotenuse - hypotenuse // 双指距离变化
		let zoom = -distance
		hypotenuse = _hypotenuse
		onMouseWheel({
			onTouchMove: true,
			deltaY: zoom,
			preventDefault() {
				console.log('none')
			},
			stopPropagation() {
				console.log('none')
			},
			clientX: twoFingerCenterPoint.x,
			clientY: twoFingerCenterPoint.y,
		} as unknown as MouseEvent)
	}
}

function onTouchEnd(event) {
	// console.log('onTouchEnd', event.touches, event.touches.length)
	onMouseUp()
	// if (event.touches.length === 1) {
	// 	111
	// }
	// if (event.touches.length == 2) {
	// 	111
	// }
}

/* API */
function refreshDrawTags() {
	cropArr = initBoundingArrScale(props.cropList, scale, props.precision)
	tagArr = initBoundingArrScale(props.tagList, scale, props.precision)
	renderCtx2()
}
/* API */
function removeTagItems(removeList: BoundingBox[]) {
	let newTagArr: BoundingBox[] = []
	let delTagArr: BoundingBox[] = []
	if (removeList.length !== 0) {
		let currentList = getTagList()
		currentList.forEach(tag => {
			if (
				!removeList.find(item => {
					let i = fixBoxInfo(item).info
					return i.startX === tag.startX && i.endX === tag.endX && i.startY === tag.startY && i.endY === tag.endY
				})
			) {
				newTagArr.push(tag)
			} else {
				delTagArr.push(tag)
			}
		})
	}
	tagArr = initBoundingArrScale(newTagArr, scale, props.precision)

	renderCtx2()
	triggerTagListChange('delete', delTagArr)
}

function removeCropItems(removeList: BoundingBox[]) {
	if (removeList.length === 0) return
	let newCropArr: BoundingBox[] = []
	let removeCropArr: BoundingBox[] = []
	let currentList = getCropList()
	currentList.forEach(tag => {
		if (
			removeList.find(item => {
				let i = fixBoxInfo(item).info
				return i.startX === tag.startX && i.endX === tag.endX && i.startY === tag.startY && i.endY === tag.endY
			})
		) {
			removeCropArr.push(tag)
		} else {
			newCropArr.push(tag)
		}
	})

	cropArr = initBoundingArrScale(newCropArr, scale, props.precision)
	emits('delCrop', removeCropArr)
	renderCtx2()
	triggerCropListChange('delete', getCropList(removeCropArr))
}

function getTagListGroupByCropIndex(type: 'startPoint' | 'allIn' = 'startPoint'): {
	[index: number]: BoundingBox[]
} {
	let tags = getTagList()
	let crops = getCropList()
	tags.forEach(tag => {
		if (type === 'startPoint') {
			let result = pointIsInBoxList(
				{
					x: tag.startX,
					y: tag.startY,
				},
				crops
			)

			//只取了第0个
			tag.__groupIndex = result.indexList[0]
		}

		if (type === 'allIn') {
			let result = boxAllInBoxList(tag, crops)
			//只取了第0个
			tag.__groupIndex = result.indexList[0]
		}
	})
	return groupBy(tags, '__groupIndex')
}

defineExpose({
	removeTagItems,
	getTagListGroupByCropIndex,
})
</script>

<style lang="scss" scoped>
.comp-ocr-img {
	flex-shrink: 0;
	flex-grow: 0;
	width: 100%;
	height: 100%;
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
	.mode-panel {
		user-select: none;
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
