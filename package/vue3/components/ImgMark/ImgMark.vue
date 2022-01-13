<!--
TODO
1. multi crop (how to del crop)
2. custom color and fontsize
3. prop isShowTip
4. prop enableCropResize

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
console.log('Init Component.')
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
	drawCropRect,
	initTagArrScale,
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
} from './util'

type SetTimeout = ReturnType<typeof setTimeout>

let spaceKeyDown = false
let isWheeling: boolean
let mouseDownTime: number | undefined = undefined
let mouseUpTime: number | undefined = undefined

let zoomIntensity = 0.1
let mouseDownOnCropBorderOrVertex: ResizeItem | undefined
let hasHoverRectInCanvas = false

function initVar() {
	hasHoverRectInCanvas = false
	zoomIntensity = 0.1
	mouseDownOnCropBorderOrVertex = undefined
}
let props = withDefaults(
	defineProps<{
		//是否允许crop画到图片外
		enableDrawCropOutOfImg?: boolean
		//是否允许Tag画到crop外
		enableDrawTagOutOfCrop?: boolean
		//是否允许Tag画到img外
		enableDrawTagOutOfImg?: boolean
		cropBounding?: BoundingBox
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
	}
)
//['update:tagList', 'update:cropBounding', 'update:mode', 'tagsStatusChange', 'cropChange', 'tagListChange']
let emits = defineEmits<{
	(e: 'update:tagList', list: BoundingBox[]): void
	(e: 'tagListChange', list: BoundingBox[]): void
	(e: 'update:mode', mode: Mode): void
	(e: 'update:cropBounding', cropInfo: BoundingBox): void
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
}

let containerRef = $ref<HTMLDivElement>()
let canvasRef = $ref<HTMLCanvasElement>()
let canvas2Ref = $ref<HTMLCanvasElement>()

function onKeyDownListener(e) {
	if (e.code === 'Space') {
		e.preventDefault()
		if (startMousePoint.x === undefined) {
			spaceKeyDown = true
		}
	}
}

function onKeyUpListener(e) {
	if (e.code === 'KeyB' && e.ctrlKey) {
		if (props.mode === 'tag') {
			emits('update:mode', 'crop')
		} else {
			emits('update:mode', 'tag')
		}
	}
	if (e.code === 'Space') {
		//处理画到一半松开空格
		cleartMousePoints()
		nextTick().then(() => {
			spaceKeyDown = false
		})
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

async function initComponent() {
	//处理文件变量
	initVar()
	//初始化Vue data变量
	initDataVar()
	await nextTick()
	//初始化prop到data
	cropInfo = props.cropBounding

	tagArr = props.tagList
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
		if (debug) console.log('Image WH', imgWH, canvasWH)
		let initScaleInfo = initScale(canvasWH, img)
		scale = cropScale = initScaleInfo.scale
		if (debug) console.log('Scale', scale)
		if (debug) console.log('Image Current', currentPosition.x, currentPosition.y, imgWH.width * scale, imgWH.height * scale)
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
		//处理有CropInfo的情况，放大裁剪区域之全屏
		else {
			if (debug) console.log(cropInfo)
			let cropBoxInfo = transfromBoundingBoxToLtwh(cropInfo, cropScale, currentPosition)
			let commonOffset = 50
			let widthRate = canvasWH.width / (cropBoxInfo[2] + commonOffset)
			let heightRate = canvasWH.height / (cropBoxInfo[3] + commonOffset)
			if (debug) console.log('RATE', widthRate, heightRate)
			// let boxStretchScale = cropBoxInfo[2] * widthRate <= canvasWH.width ? widthRate : heightRate  //宽度放大
			let boxStretchScale = cropBoxInfo[2] >= cropBoxInfo[3] ? widthRate : heightRate // 长边尽量展示出来
			let canvasZoom = Math.sqrt(boxStretchScale)
			if (debug) console.log('currentPosition before', currentPosition)
			currentPosition.x = currentPosition.x - cropInfo.startX * scale * canvasZoom + commonOffset / 2
			currentPosition.y = currentPosition.y - cropInfo.startY * scale * canvasZoom + commonOffset / 2
			if (debug) console.log('currentPosition after', currentPosition)
			if (debug) console.log('Fix Full', canvasWH, cropBoxInfo, cropBoxInfo[2] * boxStretchScale, cropBoxInfo[3] * boxStretchScale, boxStretchScale, canvasZoom)
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
		if (!cropInfo) throw new Error(`init Component can't fint cropInfo`)
		let initPosition = transfromBoundingBoxToLtwh(cropInfo, cropScale, currentPosition)
		if (debug) console.log('Crop Current', initPosition)
		drawCropRect(ctx2, ...initPosition)
		tagArr = initTagArrScale(tagArr, scale)
		drawTagList(ctx2, tagArr, currentPosition)
		return true
	})
}
function init() {
	initComponent().then(() => {
		inited = true
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
	if (!cropInfo) throw new Error(`init Component can't fint cropInfo`)
	let initPosition = transfromBoundingBoxToLtwh(cropInfo, cropScale, currentPosition)
	if (debug) console.log('Crop Current', initPosition)
	drawCropRect(ctx2, ...initPosition)
	tagArr = initTagArrScale(tagArr, scale)
	drawTagList(ctx2, tagArr, currentPosition)
	inited = true
}

function onWindowResize() {
	requestAnimationFrame(() => {
		resizeRender()
	})
}
onBeforeUnmount(() => {
	window.removeEventListener('resize', onWindowResize)
	removeListenerKeyUpDown()
	initVar()
})

onMounted(() => {
	init()
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
		init()
	}
)
watch(
	() => props.cropBounding,
	info => {
		cropInfo = info || {
			startX: 0,
			startY: 0,
			endX: imgWH.width,
			endY: imgWH.height,
		}
		//cropBounding改变，相当于需要重新改变cropScale
		cropScale = scale
		let initPosition = transfromBoundingBoxToLtwh(cropInfo, cropScale, currentPosition)
		if (!ctx2) return
		drawCropRect(ctx2, ...initPosition)
		drawTagList(ctx2, tagArr, currentPosition)
	}
)

watch(
	() => props.tagList,
	list => {
		tagArr = initTagArrScale(list, scale)
		if (!ctx2 || !cropInfo) return
		drawCropRect(ctx2, ...transfromBoundingBoxToLtwh(cropInfo, cropScale, currentPosition))
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
	if (!ctx || !ctx2 || !containerInfo || !img || !cropInfo) {
		throw new Error(`can't find canvas ctx or containerInfo or img or cropInfo`)
	}

	if (!inited) return
	event.preventDefault()
	if (spaceKeyDown) return
	if ((startMousePoint.x !== undefined || endMousePoint.x !== undefined) && !event.onTouchMove) return

	let mousex = privateCall ? 0 : event.clientX - containerInfo.left
	let mousey = privateCall ? 0 : event.clientY - containerInfo.top
	// if (debug) console.log('Mouse Position', mousex, mousey)
	let wheel = event.deltaY < 0 ? 1 : -1
	let zoom = privateCall ? event.__zoom : Math.exp(wheel * zoomIntensity)
	if (zoomScale * zoom < 0.2) return
	isWheeling = true
	// console.log('Origin 1', origin)
	ctx.translate(origin.x, origin.y)
	ctx2.translate(origin.x, origin.y)
	origin = {
		x: origin.x - (mousex / (zoomScale * zoom) - mousex / zoomScale),
		y: origin.y - (mousey / (zoomScale * zoom) - mousey / zoomScale),
	}
	// if (debug) console.log('new Origin', origin)
	ctx.scale(zoom, zoom)
	ctx2.scale(zoom, zoom)
	ctx.translate(-origin.x, -origin.y)
	ctx2.translate(-origin.x, -origin.y)
	// console.log('Origin 2', {
	// 	x: -origin.x,
	// 	y: -origin.y,
	// })

	zoomScale *= zoom
	//动态设置字体大小
	ctx2.font = `${8 * zoomScale}px serif`
	clearCanvas(ctx)
	clearCanvas(ctx2)
	drawImage(ctx, img, currentPosition.x, currentPosition.y, imgWH.width * scale, imgWH.height * scale)
	let positions = transfromBoundingBoxToLtwh(cropInfo, cropScale, currentPosition)
	drawCropRect(ctx2, ...positions)
	drawTagList(ctx2, tagArr, currentPosition, undefined)
	hasHoverRectInCanvas = false
	isWheeling = false
}

function cleartMousePoints() {
	if (!inited || !cropInfo) return
	if (!spaceKeyDown) {
		if (tmpCurrentPosition) currentPosition = cloneDeep(tmpCurrentPosition)
		tmpCurrentPosition = undefined
		if (debug) console.log('CurrentPosition', currentPosition)
		if (debug) console.log('cropInfo', cropInfo, transfromBoundingBoxToLtwh(cropInfo, cropScale, currentPosition))
		if (tmpCropPositionInfo) {
			console.log('Before CROP INFO', cropInfo)
			cropInfo = getRectInfoByPosition(tmpCropPositionInfo, currentPosition, cropScale)
			console.log('SET CROP INFO 1', cropInfo, zoomScale, currentPosition)
			triggerCropInfoChange()
			tmpCropPositionInfo = undefined
		}
	} else {
		if (startMousePoint.x !== undefined && endMousePoint.x !== undefined) {
			if (props.mode === 'crop') {
				cropScale = 1
				if (tmpCropPositionInfo) {
					cropInfo = getRectInfoByPosition(tmpCropPositionInfo, currentPosition)
					if (debug) console.log('SET CROP INFO 2', cropInfo)
					triggerCropInfoChange()
					tmpCropPositionInfo = undefined
				}
			} else {
				if (tmpTagPositionInfo) {
					let tagInfo = Object.assign(getRectInfoByPosition(tmpTagPositionInfo, currentPosition), {
						scale: 1,
						isShow: true,
					})
					console.log('push Tag', tmpTagPositionInfo, tagInfo)
					tagArr.push(tagInfo)
					triggerTagListChange()
					tmpTagPositionInfo = undefined
				}
			}
		}
	}
	mouseDownOnCropBorderOrVertex = undefined
	startMousePoint = cloneDeep(defaultPoint)
	endMousePoint = cloneDeep(defaultPoint)
}

function triggerCropInfoChange() {
	nextTick().then(() => {
		emits('update:cropBounding', getCropBounding())
		emits('cropChange')
	})
}

function triggerTagListChange() {
	let list = getTagList()
	nextTick().then(() => {
		emits('update:tagList', list)
		emits('tagListChange', list)
	})
}

function getTagList(tagList?: BoundingBox[], _cropInfo?: BoundingBox, initScale?: number, imageWH?: WH) {
	let list = tagList || tagArr
	let info = cropInfo || getCropBounding()
	let resultList = list.map(tag => {
		let newTagInfo: BoundingBox & {
			scale?: number
			__isValidity?: boolean
		} = cloneDeep(tag)
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
		if (!props.enableDrawTagOutOfCrop) {
			let intersectPart = getTwoRectIntersectPart(newTagInfo, info)
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
		return newTagInfo
	})
	return resultList.filter(i => i.__isValidity !== false)
}

function getCropBounding(_cropInfo?: BoundingBox, _cropScale?: number, initScale?: number, imageWH?: WH): BoundingBox {
	let info = _cropInfo || cropInfo
	if (!info) {
		throw new Error(`none cropInfo`)
	}
	let _scale = (_cropScale || cropScale) === 1 ? initScale || scale : 1
	let result = {
		startX: info.startX / _scale,
		startY: info.startY / _scale,
		endX: info.endX / _scale,
		endY: info.endY / _scale,
	}
	if (!props.enableDrawCropOutOfImg) {
		let whObj = imageWH || imgWH
		const imgRect = {
			startX: 0,
			startY: 0,
			endX: whObj.width,
			endY: whObj.height,
		}
		let intersectPart = getTwoRectIntersectPart(result, imgRect)
		if (!intersectPart) {
			result = imgRect
		} else {
			if (isRectValidity(intersectPart)) {
				result = intersectPart
			} else {
				result = imgRect
			}
		}
	}
	return result
}

function onMouseDown(e: MouseEvent) {
	if (!inited || !ctx || !ctx2 || !cropInfo) return
	mouseDownTime = new Date().getTime()

	let event = e as LayerTouchEvent

	startMousePoint = {
		x: event.layerX,
		y: event.layerY,
	}
	//检测是否点在了crop的border或者vertex上边
	if (props.mode === 'crop') {
		let detectResult = detectEventIsTriggerOnCropBorderOrVertex(event, cropInfo, cropScale, zoomScale, currentPosition, origin)
		if (detectResult.hasIn) {
			mouseDownOnCropBorderOrVertex = findOneBorderOrVertex(detectResult.list)
		}
	}
}

function onMouseMove(e: MouseEvent) {
	if (!inited || !ctx2 || !cropInfo) return
	let event = e as LayerTouchEvent
	mouseUpTime = new Date().getTime()
	if (startMousePoint.x === undefined) {
		//画虚线部分
		hasHoverRectInCanvas = moveDrawUnshowTagDashRect(
			ctx2,
			props.mode,
			tagArr,
			zoomScale,
			currentPosition,
			origin,
			event,
			cropInfo,
			cropScale,
			isWheeling,
			hasHoverRectInCanvas
		)
		//检测鼠标是否在裁剪框四边上
		moveDetectCropBorderSetCursor(containerRef, event, props.mode, cropInfo, cropScale, zoomScale, currentPosition, origin, isWheeling)
		return
	}
	endMousePoint = {
		x: event.layerX,
		y: event.layerY,
	}
	if (!spaceKeyDown) {
		//在crop模式的时候 检测是否在crop的边或者顶点上， 是的话执行放大缩小crop的逻辑，否的话拖动画布
		let move = () => {
			if (!ctx || !ctx2 || !img || !cropInfo) return
			let offsetInfo = moveCanvas(ctx, ctx2, img, imgWH, scale, currentPosition, startMousePoint, endMousePoint, cropInfo, cropScale, zoomScale, tagArr)
			if (offsetInfo) {
				tmpCurrentPosition = cloneDeep(currentPosition)
				if (!tmpCurrentPosition) return
				tmpCurrentPosition.x += offsetInfo.offsetX
				tmpCurrentPosition.y += offsetInfo.offsetY
			}
		}
		if (props.mode === 'tag') {
			move()
		}
		if (props.mode === 'crop') {
			if (mouseDownOnCropBorderOrVertex) {
				// console.log('AT RESIZE CROP.')
				tmpCropPositionInfo = moveResizeCrop(
					ctx2,
					startMousePoint,
					endMousePoint,
					cropInfo,
					cropScale,
					zoomScale,
					currentPosition,
					tagArr,
					mouseDownOnCropBorderOrVertex
				)
			} else {
				move()
			}
		}
	} else {
		if (props.mode === 'crop') {
			tmpCropPositionInfo = moveDrawCropRect(ctx2, startMousePoint, endMousePoint, zoomScale, origin)
			drawTagList(ctx2, tagArr, currentPosition)
		} else {
			drawCropRect(ctx2, ...transfromBoundingBoxToLtwh(cropInfo, cropScale, currentPosition))
			tmpTagPositionInfo = moveDrawTagRect(ctx2, startMousePoint, endMousePoint, zoomScale, origin, tagArr, currentPosition)
		}
	}
}

function onMouseUp() {
	if (!inited) return
	cleartMousePoints()
}

function onMouseOut() {
	if (!inited) return
	containerRef.style.cursor = 'auto'
	cleartMousePoints()
}

function onClick(event) {
	if (!inited || !cropInfo || !ctx2) return
	let touchPoint = amendDpi(getTouchPoint(event, zoomScale, origin, 'click'), ['x', 'y'])
	console.log('click Touch Point', touchPoint)
	if (props.mode !== 'tag') return
	let clickInterval = mouseUpTime && mouseDownTime ? mouseUpTime - mouseDownTime : 0
	mouseDownTime = undefined
	mouseUpTime = undefined
	if (clickInterval > 100) {
		return
	}
	let positions = transfromBoundingBoxToLtwh(cropInfo, cropScale, currentPosition)
	drawCropRect(ctx2, ...positions)
	if (debug) console.log('touchPoint', touchPoint, tagArr)
	let { isReDraw, redrawList } = drawTagList(ctx2, tagArr, currentPosition, undefined, touchPoint)
	if (isReDraw) {
		console.log('CHANGE ITEM IS SHOW.')
		if (debug) console.log('tagArr', tagArr)
		drawCropRect(ctx2, ...positions)
		drawTagList(ctx2, tagArr, currentPosition)
		triggerTagListChange()
		emits('tagsStatusChange', getTagList(redrawList))
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
	if (!ctx2 || !cropInfo) return
	tagArr = initTagArrScale(props.tagList, scale)
	drawCropRect(ctx2, ...transfromBoundingBoxToLtwh(cropInfo, cropScale, currentPosition))
	drawTagList(ctx2, tagArr, currentPosition)
}
/* API */
function removeTagItems(removeList: BoundingBox[]) {
	console.log('removeList', removeList)
	let newTagArr: BoundingBox[] = []
	if (removeList.length !== 0) {
		let currentList = getTagList()
		currentList.forEach(tag => {
			if (!removeList.find(i => i.startX === tag.startX && i.endX === tag.endX && i.startY === tag.startY && i.endY === tag.endY)) {
				newTagArr.push(tag)
			}
		})
	}
	console.log('newList', newTagArr)
	tagArr = initTagArrScale(newTagArr, scale)
	nextTick(() => {
		if (!ctx2 || !cropInfo) {
			throw new Error(`ctx2 or cropInfo can't find on removeItem.`)
		}
		drawCropRect(ctx2, ...transfromBoundingBoxToLtwh(cropInfo, cropScale, currentPosition))
		drawTagList(ctx2, tagArr, currentPosition)
		triggerTagListChange()
	})
}

defineExpose({
	removeTagItems,
	refreshDrawTags,
})
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
