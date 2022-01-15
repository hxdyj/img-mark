<!--
Known issues
1. 组件的爷爷节点flex布局，且组件的父节点flex-shrink不为0，当被resize时候，鼠标hover样式位置不准

TODO
2. custom color and fontsize
3. prop isShowTip
4. prop enableCropResize
5. README.md API

User Options
1. Down Sapce Key and Drag Mouse Move to Draw
2. Double Click Crop del crop
3. Click Tag to Hide Or Show Tag
 -->
<template>
	<div
		class="comp-ocr-img"
		ref="containerRef"
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
		<canvas class="canvas" ref="canvasRef"></canvas>
		<canvas class="canvas2" ref="canvas2Ref"></canvas>
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
// console.log('Init Component.')
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { cloneDeep } from 'lodash'
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
	transfromBoundingBoxToLtwh,
	drawImage,
	drawTagList,
	clearCanvas,
	getRectInfoByPosition,
	isRectValidity,
	getTwoRectIntersectPart,
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
	fixRectInfo,
	pointIsInRect,
	pointIsInBoxList,
	fixPoint,
} from './util'

let spaceKeyDown = false

let mouseDownTime: number | undefined = undefined
let mouseUpTime: number | undefined = undefined

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

let zoomIntensity = 0.1
let hasHoverRectInTagItem = false

function initVar() {
	hasHoverRectInTagItem = false
	zoomIntensity = 0.1
	status.resizeCropHovering = undefined
}
let props = withDefaults(
	defineProps<{
		//是否允许crop画到图片外
		enableDrawCropOutOfImg?: boolean
		//是否允许Tag画到crop外
		enableDrawTagOutOfCrop?: boolean
		//是否允许Tag画到img外
		enableDrawTagOutOfImg?: boolean
		cropList?: BoundingBox[]
		tagList?: BoundingBox[]
		mode: Mode
		src: string
	}>(),
	{
		enableDrawCropOutOfImg: true,
		enableDrawTagOutOfCrop: true,
		enableDrawTagOutOfImg: true,
		mode: 'crop',
		tagList: () => Array(),
		cropList: () => Array(),
	}
)
let emits = defineEmits<{
	(e: 'update:cropList', list: BoundingBox[]): void
	(e: 'cropListChange', list: BoundingBox[]): void
	(e: 'update:tagList', list: BoundingBox[]): void
	(e: 'tagListChange', list: BoundingBox[]): void
	(e: 'update:mode', mode: Mode): void
	(e: 'tagsStatusChange', list: BoundingBox[]): void
	(e: 'cropChange'): void
}>()

type RectDom = Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left' | 'width' | 'height' | 'x' | 'y'>

let inited = false
let ctx: CanvasRenderingContext2D | null = null
let ctx2: CanvasRenderingContext2D | null = null
let img: HTMLImageElement | undefined
let canvasWH: RectDom | undefined = cloneDeep(defaultWH)
let imgWH: WH = cloneDeep(defaultWH)
let startMousePoint: Point = cloneDeep(defaultPoint)
let endMousePoint: Point = cloneDeep(defaultPoint)
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

function initDataVar() {
	inited = false
	ctx = null
	ctx2 = null
	img = undefined
	canvasWH = cloneDeep(defaultWH)
	imgWH = cloneDeep(defaultWH)
	startMousePoint = cloneDeep(defaultPoint)
	endMousePoint = cloneDeep(defaultPoint)
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
		status.isDrawRecting = true
		if (type == 'drawCrop') {
			tmpCropPositionInfo = moveDrawCropRect(ctx2, startMousePoint, endMousePoint, zoomScale, origin, cropArr, currentPosition)
			drawTagList(ctx2, tagArr, currentPosition)
		}

		if (type == 'drawTag') {
			drawCropList(ctx2, cropArr, currentPosition)
			tmpTagPositionInfo = moveDrawTagRect(ctx2, startMousePoint, endMousePoint, zoomScale, origin, tagArr, currentPosition)
		}

		if (type == 'resizeCrop') {
			let clickedCrop = cropArr[status.resizeCropHovering?.index || 0]
			if (!status.resizeCropHovering || !clickedCrop) return

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
				cropArr.filter((item, i) => i !== status.resizeCropHovering?.index)
			)
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
		ctx2.font = `${8 * zoomScale}px serif`
		clearCanvas(ctx)
		clearCanvas(ctx2)
		drawImage(ctx, img, currentPosition.x, currentPosition.y, imgWH.width * scale, imgWH.height * scale)
		drawCropList(ctx2, cropArr, currentPosition)
		drawTagList(ctx2, tagArr, currentPosition, undefined)
		hasHoverRectInTagItem = false
		status.isScaleing = false
	},
	move() {
		if (!ctx || !ctx2 || !img) return
		status.isMoving = true
		let offsetInfo = moveCanvas(ctx, ctx2, img, imgWH, scale, currentPosition, startMousePoint, endMousePoint, cropArr, zoomScale, tagArr)
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
			hasHoverRectInTagItem
		)

		//检测鼠标是否在裁剪框四边上
		moveDetectCropBorderSetCursor(containerRef, event, props.mode, cropArr, zoomScale, currentPosition, origin, status.isScaleing)
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
		if (!status.isMoving) {
			actions.dragCreatRectInterrupt()
		}
		nextTick().then(() => {
			spaceKeyDown = false
		})
	},
	onMouseOverMove(event: LayerTouchEvent) {
		//当没有鼠标按下的时候
		if (!status.isMouseDown()) {
			actions.hoverRect(event)
			return
		}

		this.onHoldMouseLeftBtnMove(event)
	},
	/* 按着空格移动 */
	onSpaceMove() {
		if (props.mode === 'crop') {
			actions.dragCreatOrResizeRect('drawCrop')
		} else {
			actions.dragCreatOrResizeRect('drawTag')
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
		if (props.mode === 'crop') {
			let point = {
				x: (touchPoint.x - currentPosition.x) * DPI,
				y: (touchPoint.y - currentPosition.y) * DPI,
			}
			let removeCropList = pointIsInBoxList(point, cropArr)
			removeCropItems(removeCropList)
		}
	},
	onCick(touchPoint: TypePoint) {
		if (props.mode !== 'tag') return
		if (!ctx2) return
		drawCropList(ctx2, cropArr, currentPosition)
		let { isReDraw, redrawList } = drawTagList(ctx2, tagArr, currentPosition, undefined, touchPoint)
		if (isReDraw) {
			drawCropList(ctx2, cropArr, currentPosition)
			drawTagList(ctx2, tagArr, currentPosition)
			triggerTagListChange()
			emits('tagsStatusChange', getTagList(redrawList))
		}
	},
	onWheel(zoom: number, mouse: Point) {
		actions.scale(zoom, mouse)
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
		if (!status.isMouseDown()) {
			spaceKeyDown = true
		}
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
	document.addEventListener('keydown', onKeyDownListener)
	document.addEventListener('keyup', onKeyUpListener)
}

function removeListenerKeyUpDown() {
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
			let rectInfo = fixRectInfo(cropInfo)
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

async function initComponent() {
	//处理文件变量
	initVar()
	//初始化Vue data变量
	initDataVar()
	await nextTick()
	//初始化prop到data
	initCropInfo()
	tagArr = props.tagList
	cropArr = props.cropList
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
	addListenerKeyUpDown()
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
		}
		//处理有CropInfo的情况，放大裁剪区域至全屏中间
		else {
			// if (debug) console.log(cropInfo)
			let cropBoxInfo = transfromBoundingBoxToLtwh(cropInfo, cropScale, currentPosition)
			let whiteRate = 0.05
			let widthRate = (canvasWH.width - canvasWH.width * whiteRate) / cropBoxInfo[2]
			let heightRate = (canvasWH.height - canvasWH.height * whiteRate) / cropBoxInfo[3]

			// if (debug) console.log('RATE', widthRate, heightRate)
			// let boxStretchScale = cropBoxInfo[2] * widthRate <= canvasWH.width ? widthRate : heightRate  //宽度放大
			let boxStretchScale = cropBoxInfo[2] >= cropBoxInfo[3] ? widthRate : heightRate // 长边尽量展示出来
			let canvasZoom = boxStretchScale

			if (boxStretchScale === widthRate) {
				currentPosition.x = (canvasWH.width * whiteRate) / 2 / canvasZoom
				currentPosition.y = (canvasWH.height - cropBoxInfo[3] * canvasZoom * DPI) / 2
			} else {
				currentPosition.x = (canvasWH.width - cropBoxInfo[2] * canvasZoom * DPI) / 2
				currentPosition.y = (canvasWH.height * whiteRate) / 2 / canvasZoom
			}
			onMouseWheel(
				{
					deltaY: 1,
					clientX: 0,
					clientY: 0,
					preventDefault() {
						if (debug) console.log('preventDefault')
					},
					__zoom: canvasZoom,
				} as unknown as MouseEvent,
				true
			)
		}
		drawImage(ctx, img, currentPosition.x, currentPosition.y, img.width * scale, img.height * scale)
		// let initPosition = transfromBoundingBoxToLtwh(cropInfo, cropScale, currentPosition)
		// if (debug) console.log('Crop Current', initPosition)
		// drawCropRect(ctx2, ...initPosition)
		cropArr = initBoundingArrScale(cropArr, scale)
		drawCropList(ctx2, cropArr, currentPosition)
		tagArr = initBoundingArrScale(tagArr, scale)
		drawTagList(ctx2, tagArr, currentPosition)
		return true
	})
}

function initResizeVar() {
	inited = false
	canvasWH = cloneDeep(defaultWH)
	startMousePoint = cloneDeep(defaultPoint)
	endMousePoint = cloneDeep(defaultPoint)
	containerInfo = undefined
}

async function resizeRender() {
	initResizeVar()
	await nextTick()
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
	cropArr = initBoundingArrScale(cropArr, scale)
	drawCropList(ctx2, cropArr, currentPosition)
	tagArr = initBoundingArrScale(tagArr, scale)
	drawTagList(ctx2, tagArr, currentPosition)
	inited = true
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
	() => props.tagList,
	list => {
		if (!ctx2) return
		drawCropList(ctx2, cropArr, currentPosition)
		tagArr = initBoundingArrScale(list, scale)
		drawTagList(ctx2, tagArr, currentPosition)
	}
)

watch(
	() => props.cropList,
	list => {
		cropArr = initBoundingArrScale(list, scale)
		if (!ctx2) return
		drawCropList(ctx2, cropArr, currentPosition)
		drawTagList(ctx2, tagArr, currentPosition)
	}
)
function onMouseWheel(e: MouseEvent, privateCall?: boolean) {
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
	event.preventDefault()
	//空格键按下的时候不能缩放
	if (status.isDrawRecting) return
	//有startMousePoint的时候也不能缩放
	// if ((startMousePoint.x !== undefined || endMousePoint.x !== undefined) && !event.onTouchMove) return

	let mousex = privateCall ? 0 : (event.clientX - containerInfo.left) * DPI
	let mousey = privateCall ? 0 : (event.clientY - containerInfo.top) * DPI
	let wheel = event.deltaY < 0 ? 1 : -1
	let zoom = privateCall ? event.__zoom : Math.exp(wheel * zoomIntensity)

	//缩放系数过小，不能缩放
	if (zoomScale * zoom < 0.2) return
	hooks.onWheel(zoom, {
		x: mousex,
		y: mousey,
	})
}

function cleartMousePoints() {
	if (!inited) return
	status.isMoving = false
	if (tmpCurrentPosition) currentPosition = cloneDeep(tmpCurrentPosition)
	tmpCurrentPosition = undefined

	if (status.isMouseUpDownPoints()) {
		if (props.mode === 'crop') {
			if (tmpCropPositionInfo) {
				let newCropInfo = getRectInfoByPosition(tmpCropPositionInfo, currentPosition, scale)
				if (status.resizeCropHovering) {
					cropArr[status.resizeCropHovering.index] = newCropInfo
				} else {
					newCropInfo.scale = 1
					cropArr.push(newCropInfo)
				}
				triggerCropListChange()
				tmpCropPositionInfo = undefined
			}
		} else {
			if (tmpTagPositionInfo) {
				let tagInfo = Object.assign(getRectInfoByPosition(tmpTagPositionInfo, currentPosition), {
					scale: 1,
					isShow: true,
					__newAdd: true,
				})
				tagArr.push(tagInfo)
				triggerTagListChange()
				tmpTagPositionInfo = undefined
			}
		}
	}

	status.resizeCropHovering = undefined
	status.isDrawRecting = false
	startMousePoint = cloneDeep(defaultPoint)
	endMousePoint = cloneDeep(defaultPoint)
}

function triggerCropListChange() {
	nextTick().then(() => {
		let list = getCropListBounding()
		emits('update:cropList', list)
		emits('cropListChange', list)
	})
}

function triggerTagListChange() {
	let list = getTagList()
	nextTick().then(() => {
		emits('update:tagList', list)
		emits('tagListChange', list)
	})
}

type TagItemTmp = BoundingBox & {
	scale?: number
	__isValidity?: boolean
	__newAdd?: boolean
}

function getTagList(tagList?: BoundingBox[], _cropList?: BoundingBox[], initScale?: number, imageWH?: WH) {
	let list = tagList || tagArr
	let cropList = _cropList || cropArr
	let resultList: TagItemTmp[] = []
	list.forEach(tag => {
		let newTagInfo: TagItemTmp = cloneDeep(tag)
		let _scale = tag.scale === 1 ? initScale || scale : 1
		Object.assign(newTagInfo, {
			startX: tag.startX / _scale,
			startY: tag.startY / _scale,
			endX: tag.endX / _scale,
			endY: tag.endY / _scale,
		})
		if (newTagInfo.scale === 1) {
			delete newTagInfo.scale
		}
		if (!props.enableDrawTagOutOfCrop && newTagInfo.__newAdd) {
			let tagStartXYinCropList = pointIsInBoxList(
				{
					x: newTagInfo.startX,
					y: newTagInfo.startY,
				},
				cropList
			)
			let mousePointCropInfo = tagStartXYinCropList[0]
			if (!mousePointCropInfo) return
			let intersectPart = getTwoRectIntersectPart(newTagInfo, mousePointCropInfo)
			if (!intersectPart) {
				newTagInfo.__isValidity = false
			} else {
				if (!isRectValidity(intersectPart)) {
					newTagInfo.__isValidity = false
				} else {
					Object.assign(newTagInfo, intersectPart)
				}
			}
		}
		delete newTagInfo.__newAdd
		if (props.enableDrawTagOutOfCrop && !props.enableDrawTagOutOfImg) {
			let whObj = imageWH || imgWH
			const imgRect = {
				startX: 0,
				startY: 0,
				endX: whObj.width,
				endY: whObj.height,
			}
			let intersectPart = getTwoRectIntersectPart(newTagInfo, imgRect)
			if (!intersectPart) {
				newTagInfo.__isValidity = false
			} else {
				if (!isRectValidity(intersectPart)) {
					newTagInfo.__isValidity = false
				} else {
					Object.assign(newTagInfo, intersectPart)
				}
			}
		}
		resultList.push(newTagInfo)
	})
	return resultList.filter(i => i.__isValidity !== false)
}

function getCropListBounding(): BoundingBox[] {
	let list = cropArr.map(crop => {
		let result: BoundingBox & { _del?: boolean } = {
			startX: crop.startX,
			startY: crop.startY,
			endX: crop.endX,
			endY: crop.endY,
			_del: false,
		}

		if (!props.enableDrawCropOutOfImg) {
			let whObj = imgWH
			const imgRect = {
				startX: 0,
				startY: 0,
				endX: whObj.width,
				endY: whObj.height,
			}
			let intersectPart = getTwoRectIntersectPart(result, imgRect)
			if (!intersectPart) {
				result._del = true
			} else {
				if (isRectValidity(intersectPart)) {
					result = intersectPart
				} else {
					result._del = true
				}
			}
		}
		return result
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

	let event = e as LayerTouchEvent

	startMousePoint = {
		x: event.layerX,
		y: event.layerY,
	}
	//检测是否点在了crop的border或者vertex上边
	if (props.mode === 'crop') {
		let detectResult = detectEventIsTriggerOnCropBorderOrVertex(event, cropArr, zoomScale, currentPosition, origin)
		if (detectResult.hasIn) {
			status.resizeCropHovering = findOneBorderOrVertex(detectResult.list)
		}
	}
}

function onMouseMove(e: MouseEvent) {
	if (!inited) return
	let event = e as LayerTouchEvent
	mouseUpTime = new Date().getTime()
	hooks.onMouseOverMove(event)
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
}

function onClick(event) {
	if (!inited) return
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
	mouseDownTime = new Date().getTime()
	// console.log('onTouchStart', event.touches)
	let touchList = amendMobileTouchEventDpi(event)
	if (event.touches.length === 1) {
		onMouseDown({
			layerX: touchList[0].clientX,
			layerY: touchList[0].clientY,
		} as unknown as MouseEvent)
	}
	if (event.touches.length == 2) {
		let { width, height } = getTwoFingerTouchListDistence(touchList)
		let hypotenuse = getHypotenuseValue(width, height) // 移动中的双指距离
		console.log('TouchStart', event.touches, width, height, hypotenuse)
		hypotenuse = hypotenuse
		twoFingerCenterPoint = {
			x: (touchList[0].clientX + touchList[1].clientX) / 2,
			y: (touchList[0].clientY + touchList[1].clientY) / 2,
		}
	}
}

async function onTouchMove(event: TouchEvent) {
	// console.log('onTouchMove', event.touches)
	mouseUpTime = new Date().getTime()
	let touchList = amendMobileTouchEventDpi(event)
	if (event.touches.length === 1) {
		onMouseMove({
			layerX: touchList[0].clientX,
			layerY: touchList[0].clientY,
		} as unknown as MouseEvent)
	}
	if (event.touches.length == 2) {
		let { width, height } = getTwoFingerTouchListDistence(touchList)
		let _hypotenuse = getHypotenuseValue(width, height) // 移动中的双指距离
		let distance = _hypotenuse - hypotenuse // 双指距离变化
		let zoom = -distance
		// console.log('Touch Zoom', zoom, hypotenuse, this.hypotenuse)
		hypotenuse = _hypotenuse
		await nextTick()
		onMouseWheel({
			onTouchMove: true,
			deltaY: zoom,
			preventDefault() {
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
	if (!ctx2) return
	cropArr = initBoundingArrScale(props.cropList, scale)
	drawCropList(ctx2, cropArr, currentPosition)
	tagArr = initBoundingArrScale(props.tagList, scale)
	drawTagList(ctx2, tagArr, currentPosition)
}
/* API */
function removeTagItems(removeList: BoundingBox[]) {
	let newTagArr: BoundingBox[] = []
	if (removeList.length !== 0) {
		let currentList = getTagList()
		currentList.forEach(tag => {
			if (!removeList.find(i => i.startX === tag.startX && i.endX === tag.endX && i.startY === tag.startY && i.endY === tag.endY)) {
				newTagArr.push(tag)
			}
		})
	}
	tagArr = initBoundingArrScale(newTagArr, scale)
	nextTick(() => {
		if (!ctx2) {
			throw new Error(`ctx2  can't find on removeItem.`)
		}
		drawCropList(ctx2, cropArr, currentPosition)
		drawTagList(ctx2, tagArr, currentPosition)
		triggerTagListChange()
	})
}

function removeCropItems(removeList: BoundingBox[]) {
	if (removeList.length === 0) return
	console.log('remove', cloneDeep(removeList))
	let newCropArr: BoundingBox[] = []
	if (removeList.length !== 0) {
		let currentList = getCropListBounding()
		currentList.forEach(tag => {
			if (!removeList.find(i => i.startX === tag.startX && i.endX === tag.endX && i.startY === tag.startY && i.endY === tag.endY)) {
				newCropArr.push(tag)
			}
		})
	}
	cropArr = initBoundingArrScale(newCropArr, scale)
	nextTick(() => {
		if (!ctx2) {
			throw new Error(`ctx2  can't find on removeItem.`)
		}
		drawCropList(ctx2, cropArr, currentPosition)
		drawTagList(ctx2, tagArr, currentPosition)
		triggerCropListChange()
	})
}

defineExpose({
	removeTagItems,
	refreshDrawTags,
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
