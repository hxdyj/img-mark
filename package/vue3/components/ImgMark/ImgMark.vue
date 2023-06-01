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
export interface Props {
	cropConfig?: CropConfig
	daubConfig?: DaubConfig
	layerConfig?: LayerConfig
	tagConfig?: TagConfig
	drawingText?: string
	isShowTip?: boolean
	enableScale?: boolean
	enableMove?: boolean
	enableDrawCrop?: boolean
	enableDrawTag?: boolean
	initScale?: boolean
	enableInteractiveTagChangeStatus?: boolean
	enableCropCross?: boolean
	handleResizeCropCross?: 'delete' | 'reset'
	enableInteractiveCropDelete?: boolean
	enableCropResize?: boolean
	enableTagResize?: boolean
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
	daubStack?: Array<Array<DaubPoint>>
	mode?: Mode
	mobileOperation?: MobileOperation
	src: string
	precision?: number
	splitClickAndDoubleClickEvent?: boolean
	disableDefaultShortcuts?: ShortCutItem[]
	customDrawTopCtx?: CustomDrawTopCtx
}
// console.log('Init Component.')
import { nextTick, onBeforeUnmount, onMounted, unref, watch } from 'vue'
import device from 'current-device'
import { cloneDeep, groupBy, throttle } from 'lodash'
import {
	defaultWH,
	defaultPoint,
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
	findOneBorderOrVertex,
	moveDrawUnshowTagDashRect,
	moveDetectBoxBorderSetCursor,
	moveCanvas,
	moveResizeBox,
	moveDrawCropRect,
	moveDrawTagRect,
	getTouchPoint,
	amendMobileTouchEventDpi,
	getTwoFingerTouchListDistence,
	getHypotenuseValue,
	drawCropList,
	initBoundingArrScale,
	DPI,
	fixBoxInfo,
	pointIsInBoxList,
	DEFAULT_CONFIG,
	getVertexPositionByTwoPoints,
	getPointByBoxAndVertexPosition,
	getBoxIsIntersectWithBoxList,
	boxAllInBoxList,
	transformBoxPrecision,
	detectEventIsTriggerOnBoxBorderOrVertex,
	getBoxFourBorderRect,
	fixPoint,
	drawDuabPointList,
	initDaubStackList,
} from './util'
import {
	BoundingBox,
	Config,
	CropConfig,
	CropListChangeEmitType,
	CropListChangeType,
	CustomDrawTopCtx,
	DaubPoint,
	DaubConfig,
	LayerConfig,
	LayerTouchEvent,
	MobileOperation,
	Mode,
	MouseOverInfoEmitType,
	OnLoadImageEmitType,
	Point,
	Rect,
	ResizeEmitType,
	ResizeItem,
	ShortCutItem,
	TagConfig,
	TagListChangeEmitRetunType,
	TagListChangeType,
	TypePoint,
	VertexPosition,
	WH,
} from './ImgMarkType'

//是否开始画模式
let drawSwitch = false

let mouseDownTime: number | undefined = undefined
let mouseUpTime: number | undefined = undefined
let clickTimeout: null | ReturnType<typeof setTimeout> = null
let clickedBox: BoundingBox | null = null

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
	clickedBox = null
	hasHoverRectInTagItem = false
	zoomIntensity = __zoomIntensity
	status.resizeHovering = undefined
}

let props = withDefaults(defineProps<Props>(), {
	daubConfig: () => DEFAULT_CONFIG.daubConfig,
	tagConfig: () => DEFAULT_CONFIG.tagConfig,
	layerConfig: () => DEFAULT_CONFIG.layerConfig,
	cropConfig: () => DEFAULT_CONFIG.cropConfig,
	initScale: true,
	isShowTip: false,
	enableMove: true,
	enableScale: true,
	enableDrawCrop: true,
	enableDrawTag: true,
	enableCropCross: false,
	enableInteractiveTagChangeStatus: true,
	handleResizeCropCross: 'reset',
	enableCropResize: true,
	enableTagResize: false,
	enableInteractiveCropDelete: true,
	enableDrawCropOutOfImg: true,
	enableDrawTagOutOfCrop: true,
	enableDrawTagOutOfImg: true,
	isCropSingle: false,
	isImgCrop: false,
	mode: 'crop',
	mobileOperation: 'move',
	precision: 0,
	splitClickAndDoubleClickEvent: false,
	tagList: () => Array(),
	cropList: () => Array(),
	daubStack: () => Array(),
	disableDefaultShortcuts: () => Array(),
})

let emits = defineEmits<{
	(e: 'update:cropList', list: BoundingBox[]): void
	(e: 'update:daubStack', list: Array<Array<DaubPoint>>): void
	(e: 'cropListChange', data: CropListChangeEmitType): void
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
	(e: 'onLoadImage', data: OnLoadImageEmitType): void
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
let lastMousePoint: Point = cloneDeep(defaultPoint) as Point
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
let tmpBoxPositionInfo: Rect | undefined
let tagArr: BoundingBox[] = []
let cropArr: BoundingBox[] = []
let daubStackList: Array<Array<DaubPoint>> = []

let config = $computed<Config>(() => {
	let obj: Config = cloneDeep(DEFAULT_CONFIG)
	Object.assign(obj.cropConfig, props.cropConfig)
	Object.assign(obj.tagConfig, props.tagConfig)
	Object.assign(obj.layerConfig, props.layerConfig)
	Object.assign(obj.daubConfig, props.daubConfig)
	obj.drawingText = props.drawingText
	obj.mode = props.mode
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
	lastMousePoint = cloneDeep(defaultPoint) as Point
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
	tmpBoxPositionInfo = undefined
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
	resizeHovering: undefined as unknown as ResizeItem | undefined,
	isMouseDown: () => (startMousePoint.x === undefined ? false : true),
	isMouseUpDownPoints: () => startMousePoint.x !== undefined && endMousePoint.x !== undefined,
}

/* 抽象动作相关 */
const actions = {
	//画方块一半被打断
	dragCreatRectInterrupt() {
		cleartMousePoints()
	},
	dragCreatOrResizeRect(type: 'drawCrop' | 'drawTag' | 'resize') {
		if (!ctx2) return
		if (type == 'drawCrop') {
			if (props.isCropSingle && !status.isDrawRecting) {
				cropArr = []
			}
			if (!status.isDrawRecting) {
				emits('drawCropStart')
			}
			status.isDrawRecting = true

			tmpBoxPositionInfo = moveDrawCropRect(ctx2, startMousePoint, endMousePoint, zoomScale, origin, cropArr, currentPosition, config)
			drawTagList(ctx2, tagArr, currentPosition, config)
			props.customDrawTopCtx?.(ctx2, initAndTransfromBoxToRect)
		}

		if (type == 'drawTag') {
			if (!status.isDrawRecting) {
				emits('drawTagStart')
			}
			status.isDrawRecting = true
			drawCropList(ctx2, cropArr, currentPosition, config)
			tmpBoxPositionInfo = moveDrawTagRect(ctx2, startMousePoint, endMousePoint, zoomScale, origin, tagArr, currentPosition, config)
			props.customDrawTopCtx?.(ctx2, initAndTransfromBoxToRect)
		}

		if (type == 'resize') {
			let resizeStratagem: {
				[key in Mode]: () => void
			} = {
				crop() {
					if (props.enableCropResize && status.resizeHovering && ctx2) {
						clickedBox = cropArr[status.resizeHovering.index || 0]
						if (!status.resizeHovering || !clickedBox) return
						status.isDrawRecting = true
						tmpBoxPositionInfo = moveResizeBox(
							ctx2,
							startMousePoint,
							endMousePoint,
							clickedBox,
							clickedBox.__scale || 1,
							zoomScale,
							currentPosition,
							tagArr,
							status.resizeHovering,
							cropArr.filter((item, i) => i !== status.resizeHovering?.index),
							config
						)
						props.customDrawTopCtx?.(ctx2, initAndTransfromBoxToRect)
					} else {
						actions.move()
					}
				},
				tag() {
					if (props.enableTagResize && status.resizeHovering && ctx2) {
						clickedBox = tagArr[status.resizeHovering.index || 0]
						if (!status.resizeHovering || !clickedBox) return
						status.isDrawRecting = true
						tmpBoxPositionInfo = moveResizeBox(
							ctx2,
							startMousePoint,
							endMousePoint,
							clickedBox,
							clickedBox.__scale || 1,
							zoomScale,
							currentPosition,
							tagArr.filter((item, i) => i !== status.resizeHovering?.index),
							status.resizeHovering,
							cropArr,
							config
						)
						props.customDrawTopCtx?.(ctx2, initAndTransfromBoxToRect)
					} else {
						actions.move()
					}
				},
				daub() {},
			}
			resizeStratagem[props.mode]()
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
		props.customDrawTopCtx?.(ctx2, (data: BoundingBox[]) => {
			return initAndTransfromBoxToRect(data).map(positions => {
				if (offsetInfo) {
					positions[0] += offsetInfo!.offsetX
					positions[1] += offsetInfo!.offsetY
				}
				return positions
			})
		})
		if (offsetInfo) {
			tmpCurrentPosition = cloneDeep(currentPosition)
			if (!tmpCurrentPosition) return
			tmpCurrentPosition.x += offsetInfo.offsetX
			tmpCurrentPosition.y += offsetInfo.offsetY
		}
	},
	scrollIntoView(box: BoundingBox) {
		if (!ctx || !ctx2 || !img) return
		let positions = transfromBoxToRect(box, scale, currentPosition)
		currentPosition = {
			x: currentPosition.x - positions[0],
			y: currentPosition.y - positions[1],
		}
		clearCanvas(ctx)
		clearCanvas(ctx2)
		drawImage(ctx, img, currentPosition.x, currentPosition.y, img.width * scale, img.height * scale)
		renderCtx2()
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
		if (!drawSwitch) {
			//检测鼠标是否在裁剪框四边上
			if (props.enableCropResize && props.mode === 'crop') {
				console.log('---------------MAMAMA-----------------')
				moveDetectBoxBorderSetCursor(containerRef, event, cropArr, zoomScale, currentPosition, origin, status.isScaleing)
			}
			if (props.enableTagResize && props.mode === 'tag') {
				moveDetectBoxBorderSetCursor(containerRef, event, tagArr, zoomScale, currentPosition, origin, status.isScaleing)
			}
		}
	},
}

const events = {
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
	onHoldMouseLeftBtnMove(event: LayerTouchEvent) {
		endMousePoint = {
			x: event.layerX,
			y: event.layerY,
		}
		if (!drawSwitch) {
			if (props.mode === 'daub') {
				if (status.isScaleing) return
				let last = fixPoint(lastMousePoint, zoomScale, origin)
				let end = fixPoint(endMousePoint, zoomScale, origin)
				let realEnd: DaubPoint = {
					x: end.x,
					y: end.y,
					lineWidth: props.daubConfig.lineWidth,
					strokeStyle: props.daubConfig.strokeStyle,
				}
				if (ctx2) {
					drawDuabPointList(ctx2, [last, end], currentPosition, config)
					lastMousePoint = cloneDeep(endMousePoint)
					daubStackList[daubStackList.length - 1].push(realEnd)
				}
			} else {
				//在crop模式的时候 检测是否在crop的边或者顶点上， 是的话执行放大缩小crop的逻辑，否的话拖动画布
				if (status.resizeHovering) {
					actions.dragCreatOrResizeRect('resize')
				} else {
					actions.move()
				}
			}
		} else {
			this.onDrawSwitchOnStartDraw()
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
	/* 画模式打开后开始画 */
	onDrawSwitchOnStartDraw() {
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
}

/* 抽象组件hooks */
const hooks = {
	shiftMode() {
		actions.changeMode()
	},
	shiftDrawSwitch(onOrOff: 'on' | 'off') {
		nextTick(() => {
			if (onOrOff === 'on') {
				if ((props.enableDrawCrop && props.mode === 'crop') || (props.enableDrawTag && props.mode === 'tag')) {
					containerRef.style.cursor = 'crosshair'
				}
				if (!status.isMouseDown()) {
					drawSwitch = true
				}
			}
			if (onOrOff === 'off') {
				if (!status.isMoving && !status.resizeHovering) {
					actions.dragCreatRectInterrupt()
				}
				drawSwitch = false
			}
		})
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

function onKeyDownListener(e: KeyboardEvent) {
	if (e.code === 'Space') {
		if (props.disableDefaultShortcuts.includes('space')) return
		if (e.target === document.body) {
			e.preventDefault()
		}
		hooks.shiftDrawSwitch('on')
	}
}

function onKeyUpListener(e) {
	if (e.code === 'KeyB' && e.ctrlKey) {
		if (props.disableDefaultShortcuts.includes('ctrl+b')) return
		hooks.shiftMode()
	}
	if (e.code === 'Space') {
		if (props.disableDefaultShortcuts.includes('space')) return
		hooks.shiftDrawSwitch('off')
	}
}
function addListenerKeyUpDown() {
	if (device.mobile()) return
	window.addEventListener('keydown', onKeyDownListener)
	window.addEventListener('keyup', onKeyUpListener)
}

function removeListenerKeyUpDown() {
	if (device.mobile()) return
	window.removeEventListener('keydown', onKeyDownListener)
	window.removeEventListener('keyup', onKeyUpListener)
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
	daubStackList = cloneDeep(props.daubStack)
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
	emits('onLoadImage', {
		status: 'loading',
	})
	return loadImage(props.src)
		.then(_img => {
			emits('onLoadImage', {
				status: 'success',
			})
			if (!canvasWH || !ctx || !ctx2) return Promise.reject(`canvasWH or canvas var not has valid values.`)
			img = _img
			imgWH = {
				width: img.width,
				height: img.height,
			}
			// console.log('WH', canvasWH, imgWH)
			// if (debug) console.log('Image WH', imgWH, canvasWH)
			if (props.initScale) {
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
				} //处理有CropInfo的情况，放大裁剪区域至全屏中间
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
					cropArr = initBoundingArrScale(cropArr, scale, props.precision)
					tagArr = initBoundingArrScale(tagArr, scale, props.precision)
					daubStackList = initDaubStackList(daubStackList, currentPosition, scale)
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
					//调用mouseWheel会重新绘制，所以直接return，让组件初始化完成
					return true
				}
			}
			cropArr = initBoundingArrScale(cropArr, scale, props.precision)
			tagArr = initBoundingArrScale(tagArr, scale, props.precision)
			daubStackList = initDaubStackList(daubStackList, currentPosition, scale)
			drawImage(ctx, img, currentPosition.x, currentPosition.y, img.width * scale, img.height * scale)
			renderCtx2()
			return true
		})
		.catch(err => {
			emits('onLoadImage', {
				status: 'error',
				msg: JSON.stringify(err),
			})
		})
}

function initResizeVar() {
	clickedBox = null
	inited = false
	canvasWH = cloneDeep(defaultWH) as RectDom
	startMousePoint = cloneDeep(defaultPoint) as Point
	endMousePoint = cloneDeep(defaultPoint) as Point
	lastMousePoint = cloneDeep(defaultPoint) as Point
	containerInfo = undefined
}

function initAndTransfromBoxToRect(boundingBoxList: BoundingBox[]) {
	let list = initBoundingArrScale(boundingBoxList, scale, props.precision)
	return list.map(item => {
		return transfromBoxToRect(item, scale, currentPosition)
	})
}

function renderCtx2() {
	if (!ctx2) return
	drawCropList(ctx2, cropArr, currentPosition, config)
	drawTagList(ctx2, tagArr, currentPosition, config)
	daubStackList.forEach(list => {
		if (ctx2) {
			drawDuabPointList(ctx2, list, currentPosition, config)
		}
	})

	props.customDrawTopCtx?.(ctx2, initAndTransfromBoxToRect)
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
		hooks.shiftDrawSwitch('on')
	}

	if (props.mobileOperation === 'move') {
		hooks.shiftDrawSwitch('off')
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
	() => props.daubStack,
	list => {
		if (!inited) return
		daubStackList = initDaubStackList(cloneDeep(props.daubStack), currentPosition, scale)
		debugger
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
	let mousex = privateCall ? 0 : (event.clientX - containerInfo.left) * DPI
	let mousey = privateCall ? 0 : (event.clientY - containerInfo.top) * DPI
	let wheel = event.deltaY < 0 ? 1 : -1
	let zoom = privateCall ? event.__zoom : Math.exp(wheel * zoomIntensity)

	//缩放系数过小，不能缩放
	if (zoomScale * zoom < 0.2) return
	events.onWheel(
		zoom,
		{
			x: mousex,
			y: mousey,
		},
		privateCall
	)
}

function setBoxResize(newBoxInfo: BoundingBox) {
	if (status.resizeHovering) {
		let resizeStratagem: {
			[key in Mode]: {
				boxList: BoundingBox[]
				trigger: typeof triggerCropListChange | typeof triggerTagListChange
				getBoxFunc: typeof getCropList | typeof getTagList
			}
		} = {
			crop: {
				boxList: cropArr,
				trigger: triggerCropListChange,
				getBoxFunc: getCropList,
			},
			tag: {
				boxList: tagArr,
				trigger: triggerTagListChange,
				getBoxFunc: getTagList,
			},
			daub: {
				boxList: [],
				trigger: () => {},
				getBoxFunc: () => [],
			},
		}
		let resizeInfo = resizeStratagem[props.mode]
		resizeInfo.boxList[status.resizeHovering.index] = newBoxInfo
		emits('resizeEnd', {
			index: status.resizeHovering.index,
			box: newBoxInfo,
		})
		if (props.mode === 'tag') {
			let vertexPosition = getVertexPositionByTwoPoints(startMousePoint, endMousePoint)
			Object.assign(newBoxInfo, {
				__oprateType: 'resize',
				__vertexPosition: vertexPosition,
			})
		}
		resizeInfo.trigger('resize', resizeInfo.getBoxFunc([newBoxInfo]))
	}
}

function cleartMousePoints() {
	if (!inited) return
	status.isMoving = false
	if (tmpCurrentPosition) currentPosition = cloneDeep(tmpCurrentPosition)
	tmpCurrentPosition = undefined

	if (status.isMouseUpDownPoints()) {
		let upStratagem: {
			[key in Mode]: () => void
		} = {
			crop() {
				if (tmpBoxPositionInfo) {
					let newCropInfo = {
						...clickedBox,
						...transfromRect2Box(tmpBoxPositionInfo, currentPosition, scale),
					}
					clickedBox = null
					if (status.resizeHovering) {
						if (!props.enableCropCross) {
							let intersectFlag = getBoxIsIntersectWithBoxList(
								newCropInfo,
								cropArr.filter((item, index) => index !== status.resizeHovering?.index)
							)
							if (intersectFlag) {
								if (props.handleResizeCropCross === 'reset') {
									renderCtx2()
								}
								if (props.handleResizeCropCross === 'delete') {
									let removeItem = cropArr[status.resizeHovering.index]
									removeCropItems([removeItem])
								}
							} else {
								setBoxResize(newCropInfo)
							}
						} else {
							setBoxResize(newCropInfo)
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
					tmpBoxPositionInfo = undefined
				}
			},
			tag() {
				if (tmpBoxPositionInfo) {
					let newCropInfo = {
						...clickedBox,
						...transfromRect2Box(tmpBoxPositionInfo, currentPosition, scale),
					}
					clickedBox = null
					if (status.resizeHovering) {
						setBoxResize(newCropInfo)
					} else {
						let vertexPosition = getVertexPositionByTwoPoints(startMousePoint, endMousePoint)
						let tagInfo = transfromRect2Box(tmpBoxPositionInfo, currentPosition, scale)
						tagInfo = initBoundingArrScale([tagInfo], scale, props.precision)[0]
						Object.assign(tagInfo, {
							isShow: true,
							__oprateType: 'add',
							__vertexPosition: vertexPosition,
						})
						tagArr.push(tagInfo)
						triggerTagListChange('add', getTagList([tagInfo]))
					}
					tmpBoxPositionInfo = undefined
				}
			},
			daub() {
				if (tmpBoxPositionInfo) {
					tmpBoxPositionInfo = undefined
				}
				let result = cloneDeep(daubStackList)
				emits(
					'update:daubStack',
					result.map(list => {
						return list.map(point => {
							if (point._x != undefined && point._y != undefined) {
								delete point._x
								delete point._y
							} else {
								point.x = (point.x - currentPosition.x) / scale
								point.y = (point.y - currentPosition.y) / scale
							}

							return point
						})
					})
				)
			},
		}
		upStratagem[props.mode]()
	}

	status.resizeHovering = undefined
	status.isDrawRecting = false
	startMousePoint = cloneDeep(defaultPoint) as Point
	endMousePoint = cloneDeep(defaultPoint) as Point
	lastMousePoint = cloneDeep(defaultPoint) as Point
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
// const OPRATE_TYPE_LIST = ['add', 'resize'] as const
type TagItemTmp = BoundingBox & {
	scale?: number
	__isValidity?: boolean
	__oprateType?: 'add' | 'resize'
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
		if (!props.enableDrawTagOutOfCrop) {
			if (newTagInfo.__oprateType && newTagInfo.__vertexPosition) {
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
		}
		delete newTagInfo.__oprateType
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
	lastMousePoint = cloneDeep(startMousePoint)
	if (props.mode == 'daub') {
		daubStackList.push([])
	}

	//检测是否点在了crop的border或者vertex上边
	if (props.mode === 'crop' && !drawSwitch && props.enableCropResize) {
		let detectResult = detectEventIsTriggerOnBoxBorderOrVertex(event, cropArr, zoomScale, currentPosition, origin)
		if (detectResult.hasIn) {
			status.resizeHovering = findOneBorderOrVertex(detectResult.list)
			emits('resizeStart', {
				index: status.resizeHovering.index,
				box: cropArr[status.resizeHovering.index],
			})
		}
	}

	//检测是否点在了tag的border或者vertex上边
	if (props.mode === 'tag' && !drawSwitch && props.enableTagResize) {
		let detectResult = detectEventIsTriggerOnBoxBorderOrVertex(event, tagArr, zoomScale, currentPosition, origin)
		if (detectResult.hasIn) {
			status.resizeHovering = findOneBorderOrVertex(detectResult.list)
			console.log('over tag resize:', status.resizeHovering)
			emits('resizeStart', {
				index: status.resizeHovering.index,
				box: tagArr[status.resizeHovering.index],
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
			// console.log('mouse over')
			// console.log(canvasPosition, imgPosition)
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
	events.onMouseOverMove(event)
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

function clearClickTimeout() {
	if (clickTimeout) {
		clearTimeout(clickTimeout)
	}
	clickTimeout = null
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

	if (props.splitClickAndDoubleClickEvent) {
		clearClickTimeout()
		clickTimeout = setTimeout(() => {
			events.onCick(touchPoint)
			clickTimeout = null
		}, 230)
	} else {
		events.onCick(touchPoint)
	}

	const minInterval = props.splitClickAndDoubleClickEvent ? 320 : 360
	if (mouseQuickDoubleTapTime.prev.up && mouseQuickDoubleTapTime.prev.down && mouseQuickDoubleTapTime.last.up && mouseQuickDoubleTapTime.last.down) {
		if (mouseQuickDoubleTapTime.last.up - mouseQuickDoubleTapTime.prev.down < minInterval) {
			if (props.splitClickAndDoubleClickEvent) {
				clearClickTimeout()
			}
			events.onDoubleClick(touchPoint)
			mouseQuickDoubleTapTime.prev.down = undefined
			mouseQuickDoubleTapTime.prev.up = undefined
			mouseQuickDoubleTapTime.last.down = undefined
			mouseQuickDoubleTapTime.last.up = undefined
		} else {
			//将last值设置为prev，last设置为空
			mouseQuickDoubleTapTime.prev.down = mouseQuickDoubleTapTime.last.down
			mouseQuickDoubleTapTime.prev.up = mouseQuickDoubleTapTime.last.up
			mouseQuickDoubleTapTime.last.down = undefined
			mouseQuickDoubleTapTime.last.up = undefined
		}
	}
}

function onTouchStart(event: TouchEvent) {
	getContainerInfo()
	mouseDownTime = new Date().getTime()
	let touchList = event.touches
	if (event.touches.length === 1) {
		let fakeEvent = {
			layerX: touchList[0].clientX - (containerInfo?.left || 0),
			layerY: touchList[0].clientY - (containerInfo?.top || 0),
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
		//twoFingerCenterPoint 算的时候不用 amendTouchList 而用 touchList 是因为 onMouseWheel 的时候就是用原始的clientXY进行计算的，而上方 hypotenuse 用 amendTouchList 是因为要计算实际距离
		twoFingerCenterPoint = {
			x: (touchList[0].clientX + touchList[1].clientX) / 2,
			y: (touchList[0].clientY + touchList[1].clientY) / 2,
		}
	}
}

function onTouchMove(event: TouchEvent) {
	mouseUpTime = new Date().getTime()
	let touchList = event.touches
	// let touchList = amendMobileTouchEventDpi(event)
	if (event.touches.length === 1) {
		onMouseMove({
			layerX: touchList[0].clientX - (containerInfo?.left || 0),
			layerY: touchList[0].clientY - (containerInfo?.top || 0),
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
async function getBase64ImageData(crossOrigin?: boolean) {
	const canvas = document.createElement('canvas')
	canvas.style.width = imgWH.width + 'px'
	canvas.style.height = imgWH.height + 'px'
	canvas.width = imgWH.width
	canvas.height = imgWH.height
	let ctx = canvas.getContext('2d')
	return loadImage(props.src, crossOrigin).then(img => {
		if (ctx) {
			let cPosition = { x: 0, y: 0 }
			drawImage(ctx, img, 0, 0, img.width, img.height)
			drawCropList(ctx, props.cropList, cPosition, config, undefined, true)
			drawTagList(ctx, props.tagList, cPosition, config)
			props.daubStack.forEach(list => {
				if (ctx) {
					drawDuabPointList(ctx, list, cPosition, config)
				}
			})
			return canvas.toDataURL('image/png')
		}
		throw new Error('ctx not exist')
	})
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
const render = renderCtx2
defineExpose({
	render,
	removeTagItems,
	getTagListGroupByCropIndex,
	getBase64ImageData,
	hooks,
	scrollIntoView: actions.scrollIntoView,
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
