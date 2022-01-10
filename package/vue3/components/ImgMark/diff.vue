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

<script>
import { defineComponent } from '@vue/runtime-core'
import { cloneDeep } from 'lodash'
const CancasSafeArea = 100000
const DPI = window.devicePixelRatio || 1
const debug = true
const defaultWH = {
	width: undefined,
	height: undefined,
}
const defaultPoint = {
	x: undefined,
	y: undefined,
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
function clearCanvas(ctx) {
	ctx.clearRect(-CancasSafeArea / 2, -CancasSafeArea / 2, CancasSafeArea, CancasSafeArea)
}
function loadImage(src) {
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
function drawImage(ctx, img, left, top, width, height) {
	ctx.drawImage(img, left, top, width, height)
}
function drawLayerBg(ctx) {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
	ctx.fillRect(-CancasSafeArea / 2, -CancasSafeArea / 2, CancasSafeArea, CancasSafeArea)
}
function drawLayerImageData(ctx, left, top, width, height) {
	ctx.clearRect(left, top, width, height)
}
function drawLayerBorder(ctx, left, top, width, height) {
	ctx.setLineDash([])
	ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
	ctx.lineWidth = 2
	ctx.strokeRect(left, top, width, height)
}
function getElementWH(ele) {
	// return ele.getClientRects()[0]
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
function initCanvasWH(ctx, info) {
	ctx.canvas.width = info.width
	ctx.canvas.height = info.height
}
function initScale(canvasWH, imgWH) {
	let widthRate = canvasWH.width / imgWH.width
	let heightRate = canvasWH.height / imgWH.height
	let scale = widthRate < heightRate ? widthRate : heightRate
	return {
		scale,
		fit: widthRate < heightRate ? 'height' : 'width',
	}
}

function getVariableType(value) {
	let valueObjectString = Object.prototype.toString.call(value)
	return valueObjectString.slice(8, valueObjectString.length - 1)
}
function amendDpi(val, propers = ['width', 'height']) {
	try {
		let valType = getVariableType(val)
		if (valType === 'Number') return val * DPI
		propers.forEach(properName => {
			val[properName] *= DPI
		})
	} catch (error) {
		console.log('ERROR', val, error)
	}
	return val
}
function amendMobileTouchEventDpi(touchEvent) {
	return Array.from(touchEvent.touches || []).map(touchRecord => {
		let cloneRecord = {
			clientX: touchRecord.clientX,
			clientY: touchRecord.clientY,
		}
		return amendDpi(cloneRecord, ['clientX', 'clientY'])
	})
}
function drawCropRect(ctx, left, top, width, height) {
	clearCanvas(ctx)
	drawLayerBg(ctx)
	drawLayerImageData(ctx, left, top, width, height)
	drawLayerBorder(ctx, left, top, width, height)
}
function pointIsInRect(point, rect) {
	let rectPositionInfo = {
		startX: rect[0],
		endX: rect[0] + rect[2],
		startY: rect[1],
		endY: rect[1] + rect[3],
	}
	if (point.x > rectPositionInfo.startX && point.x < rectPositionInfo.endX && point.y > rectPositionInfo.startY && point.y < rectPositionInfo.endY) {
		// console.log('PointInRect', point, rectPositionInfo)
		return true
	}
	return false
}
function transfromTwoPointsToLtwh(pointStart, pointEnd) {
	let width = Math.abs(pointEnd.x - pointStart.x)
	let height = Math.abs(pointEnd.y - pointStart.y)
	let left = Math.min(pointStart.x, pointEnd.x)
	let top = Math.min(pointStart.y, pointEnd.y)
	return [left, top, width, height]
}
/*
startX endX  负数相反不对的部分给修正
*/
function fixRectInfo(info) {
	let newInfo = cloneDeep(info)
	let { startX, startY, endX, endY } = newInfo
	let width = Math.abs(startX - endX)
	let height = Math.abs(startY - endY)
	startX = Math.min(startX, endX)
	startY = Math.min(startY, endY)
	newInfo.startX = startX
	newInfo.startY = startY
	newInfo.endX = startX + width
	newInfo.endY = startY + height
	return {
		info: newInfo,
		position: [startX, startY, width, height],
	}
}
function getTwoRectIntersectPart(rect1, rect2) {
	let fixInfo1 = fixRectInfo(rect1)
	let fixInfo2 = fixRectInfo(rect2)
	let minStartY = Math.min(fixInfo1.info.startY, fixInfo2.info.startY)
	let maxEndY = Math.max(fixInfo1.info.endY, fixInfo2.info.endY)
	let lengthY = Math.abs(maxEndY - minStartY)
	let superpositionHeight = fixInfo1.position[3] + fixInfo2.position[3]
	let intersectY = undefined
	if (lengthY < superpositionHeight) {
		intersectY = {
			startY: Math.max(fixInfo1.info.startY, fixInfo2.info.startY),
			endY: Math.min(fixInfo1.info.endY, fixInfo2.info.endY),
		}
	}
	let minStartX = Math.min(fixInfo1.info.startX, fixInfo2.info.startX)
	let maxEndX = Math.max(fixInfo1.info.endX, fixInfo2.info.endX)
	let lengthX = Math.abs(maxEndX - minStartX)
	let superpositionWidth = fixInfo1.position[2] + fixInfo2.position[2]
	let intersectX = undefined
	if (lengthX < superpositionWidth) {
		intersectX = {
			startX: Math.max(fixInfo1.info.startX, fixInfo2.info.startX),
			endX: Math.min(fixInfo1.info.endX, fixInfo2.info.endX),
		}
	}
	if (intersectX !== undefined && intersectY !== undefined) {
		return Object.assign(intersectY, intersectX)
	}
	return undefined
}
function transfromBoundingBoxToLtwh(
	position,
	scale = 1,
	zoomScale = 1,
	currentPosition = {
		x: 0,
		y: 0,
	}
) {
	let fixResult = fixRectInfo(position)
	let { startX, startY } = fixResult.info
	let width = fixResult.position[2]
	let height = fixResult.position[3]
	return [startX * scale * zoomScale + currentPosition.x, startY * scale * zoomScale + currentPosition.y, width * scale * zoomScale, height * scale * zoomScale]
}
function isRectValidity(rect) {
	let position = transfromBoundingBoxToLtwh(rect, 1, 1)
	if (position[2] >= 5 && position[3] >= 5) {
		return true
	}
	return false
}
function drawTagRect(ctx, left, top, width, height, index, touchPoint, isShow, showOutLine) {
	// if (debug) console.log(`DRAW ITEM${index}`, touchPoint, [left, top, width, height], isShow)
	if (!touchPoint && !isShow) return
	if (isShow && (!touchPoint || touchPoint.type !== 'move')) {
		ctx.fillStyle = 'rgba(242, 88, 85, 0.5)'
		ctx.fillRect(left, top, width, height)
		if (index) {
			let fontsize = parseFloat(ctx.font.split(' ')[0].replace('px', ''))
			let measure = ctx.measureText('index')
			let indexRectWitdh = measure.width
			let indexRectHeight = height
			ctx.fillStyle = 'rgba(242, 88, 85, 0.5)'
			ctx.fillRect(left, top, indexRectWitdh, indexRectHeight)
			ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
			ctx.fillText(index, left + (indexRectWitdh - fontsize) / 2, top + indexRectHeight / 2 + fontsize / 2)
		}
	}
	if (showOutLine) {
		ctx.strokeStyle = 'yellow'
		ctx.lineWidth = 2
		ctx.setLineDash([5])
		ctx.strokeRect(left, top, width, height)
	}
	let isCrash = false
	if (touchPoint) {
		if (pointIsInRect(touchPoint, [left, top, width, height])) {
			if (touchPoint.type === 'click') {
				console.log('Point In Rect', touchPoint, [left, top, width, height], index)
				isShow = !isShow
				isCrash = true
				return {
					isShow,
					isCrash,
				}
			}
			if (touchPoint.type === 'move' && !isShow) {
				ctx.strokeStyle = '#F25856'
				ctx.lineWidth = 1
				ctx.setLineDash([5])
				ctx.strokeRect(left, top, width, height)
			}
		}
	}
	return undefined
}
// origin只有在进行缩放的时候需要传递，其他时候不需要，因为在保存tag的时候已经处理过
function drawTagList(ctx, list, zoomScale, currentPosition, offsetInfo, origin, touchPoint) {
	if (!offsetInfo) {
		offsetInfo = {
			offsetX: 0,
			offsetY: 0,
		}
	}
	if (!origin) {
		origin = {
			x: 0,
			y: 0,
		}
	}
	let isReDraw = false
	let redrawList = []
	list.forEach((tagInfo, index) => {
		let positions = transfromBoundingBoxToLtwh(tagInfo, tagInfo.scale, zoomScale, currentPosition)
		positions[0] += offsetInfo.offsetX - origin.x
		positions[1] += offsetInfo.offsetY - origin.y
		// if (debug) console.log(`DRAW ITEM${index}`, tagInfo, positions)
		let drawTagInfo = drawTagRect(ctx, ...positions, index + 1, touchPoint, tagInfo.isShow, tagInfo.showOutLine)
		if (drawTagInfo !== undefined) {
			tagInfo.isShow = drawTagInfo.isShow
			if (drawTagInfo.isCrash) {
				isReDraw = true
				redrawList.push(tagInfo)
			}
		}
	})
	return {
		isReDraw,
		redrawList,
	}
}
function fixMoveRectPosition(position, zoomScale, origin) {
	position[0] = position[0] / zoomScale + origin.x * 2
	position[1] = position[1] / zoomScale + origin.y * 2
	position[2] /= zoomScale
	position[3] /= zoomScale
	return position
}
function moveDrawCropRect(ctx, startPoint, endPoint, zoomScale = 1, origin) {
	if (startPoint.x !== undefined && endPoint.x !== undefined) {
		let position = fixMoveRectPosition(transfromTwoPointsToLtwh(startPoint, endPoint), zoomScale, origin)
		if (position[2] > 5 || position[3] > 5) {
			// if (debug) console.log('DRAW', position)
			drawCropRect(ctx, ...position)
			return position
		}
	}
	return null
}
function moveDrawTagRect(ctx, startPoint, endPoint, zoomScale = 1, origin, tagArr, currentPosition) {
	if (startPoint.x !== undefined && endPoint.x !== undefined) {
		let position = fixMoveRectPosition(transfromTwoPointsToLtwh(startPoint, endPoint), zoomScale, origin)
		if (position[2] > 5 || position[3] > 5) {
			// if (debug) console.log('DRAW Tag', position)
			drawTagList(ctx, tagArr, zoomScale, currentPosition)
			drawTagRect(ctx, ...position, tagArr.length + 1, undefined, true)
			return position
		}
	}
	return null
}
function twoPointsGetOffsetInfo(startPoint, endPoint, zoomScale) {
	let position = transfromTwoPointsToLtwh(startPoint, endPoint)
	let offsetX = (endPoint.x - startPoint.x) / zoomScale
	let offsetY = (endPoint.y - startPoint.y) / zoomScale
	let isStartMove = false
	const MIN_MOVE = 5
	if (position[2] > MIN_MOVE || position[3] > MIN_MOVE) {
		isStartMove = true
	}
	return {
		isStartMove,
		offsetInfo: {
			offsetX,
			offsetY,
		},
	}
}
function moveCanvas(ctx, ctx2, img, imgWH, scale, currentPosition, startPoint, endPoint, cropInfo, cropScale, zoomScale, tagArr) {
	if (startPoint.x !== undefined && endPoint.x !== undefined) {
		let offsetResult = twoPointsGetOffsetInfo(startPoint, endPoint, zoomScale)
		if (offsetResult.isStartMove) {
			let { offsetX, offsetY } = offsetResult.offsetInfo
			clearCanvas(ctx)
			let newPosition = {
				x: currentPosition.x + offsetX,
				y: currentPosition.y + offsetY,
			}
			drawImage(ctx, img, newPosition.x, newPosition.y, imgWH.width * scale * zoomScale, imgWH.height * scale * zoomScale)
			let boundingBoxPosition = transfromBoundingBoxToLtwh(cropInfo, cropScale, zoomScale, currentPosition)
			boundingBoxPosition[0] += offsetX
			boundingBoxPosition[1] += offsetY
			drawCropRect(ctx2, ...boundingBoxPosition)
			drawTagList(ctx2, tagArr, zoomScale, currentPosition, {
				offsetX,
				offsetY,
			})
			return {
				offsetX,
				offsetY,
			}
		}
	}
	return null
}
function getTouchPoint(event, zoomScale, origin, type) {
	let startPoint = {
		x: event.layerX,
		y: event.layerY,
	}
	let endPoint = {
		x: event.layerX + 1,
		y: event.layerY + 1,
	}
	let calcTouchPoint = transfromTwoPointsToLtwh(startPoint, endPoint)
	calcTouchPoint[0] = calcTouchPoint[0] / zoomScale + origin.x * 2
	calcTouchPoint[1] = calcTouchPoint[1] / zoomScale + origin.y * 2
	calcTouchPoint[2] /= zoomScale
	calcTouchPoint[3] /= zoomScale
	return {
		x: calcTouchPoint[0],
		y: calcTouchPoint[1],
		type,
	}
}
function moveDrawUnshowTagDashRect(ctx, mode, tagArr, zoomScale, currentPosition, origin, e, cropInfo, cropScale) {
	/*
  判断tagArr里边unShow的tag在坐标点，就绘制，不在页绘制为空
  */
	if (mode === 'tag' && !isWheeling) {
		let unShowArr = tagArr.filter(i => !i.isShow)
		let isHasTouchPointInArr = false
		let touchPoint = getTouchPoint(e, zoomScale, origin, 'move')
		let dashArr = []
		unShowArr.forEach(tag => {
			let positions = transfromBoundingBoxToLtwh(tag, tag.scale, zoomScale, currentPosition)
			if (pointIsInRect(touchPoint, positions)) {
				// console.log('DETECT hasTouchPointInArr', positions, touchPoint, [positions[0] + origin.x, positions[1] + origin.y], this, origin, zoomScale)
				dashArr.push(tag)
				isHasTouchPointInArr = true
			}
		})
		if (isHasTouchPointInArr) {
			hasHoverRectInCanvas = true
			drawTagList(ctx, dashArr, zoomScale, currentPosition, undefined, undefined, touchPoint)
		} else {
			if (hasHoverRectInCanvas) {
				console.log('CLEAN HOVER Rect')
				let positions = transfromBoundingBoxToLtwh(cropInfo, cropScale, zoomScale, currentPosition)
				drawCropRect(ctx, ...positions)
				drawTagList(ctx, tagArr, zoomScale, currentPosition, undefined, undefined)
				hasHoverRectInCanvas = false
			}
		}
	}
}
function getCropFourBorderRect(cropInfo, cropScale, zoomScale, currentPosition) {
	let positions = transfromBoundingBoxToLtwh(cropInfo, cropScale, zoomScale, currentPosition)
	const BorderWidth = 6
	let HalfBorder = BorderWidth / 2
	let list = [
		{
			name: 'left-top',
			type: 'vertex',
			positions: [positions[0] - HalfBorder, positions[1] - HalfBorder, BorderWidth, BorderWidth],
		},
		{
			name: 'right-top',
			type: 'vertex',
			positions: [positions[0] + positions[2] - HalfBorder, positions[1] - HalfBorder, BorderWidth, BorderWidth],
		},
		{
			name: 'left-bottom',
			type: 'vertex',
			positions: [positions[0] - HalfBorder, positions[1] + positions[3] - HalfBorder, BorderWidth, BorderWidth],
		},
		{
			name: 'right-bottom',
			type: 'vertex',
			positions: [positions[0] + positions[2] - HalfBorder, positions[1] + positions[3] - HalfBorder, BorderWidth, BorderWidth],
		},
		{
			name: 'left',
			type: 'border',
			positions: [positions[0] - HalfBorder, positions[1] + HalfBorder, BorderWidth, positions[3] - HalfBorder],
		},
		{
			name: 'top',
			type: 'border',
			positions: [positions[0] + HalfBorder, positions[1] - HalfBorder, positions[2] - HalfBorder, BorderWidth],
		},
		{
			name: 'right',
			type: 'border',
			positions: [positions[0] + positions[2] - HalfBorder, positions[1] + HalfBorder, BorderWidth, positions[3] - HalfBorder],
		},
		{
			name: 'bottom',
			type: 'border',
			positions: [positions[0] + HalfBorder, positions[1] + positions[3] - HalfBorder, positions[2] - HalfBorder, BorderWidth],
		},
	]
	// console.log('setCropFourBorderRect', list)
	return list
}
function pointIsInRectList(point, list) {
	let hasIn = false
	let coverList = []
	let coverIndexList = []
	list.forEach((rect, index) => {
		if (pointIsInRect(point, rect)) {
			hasIn = true
			coverList.push(rect)
			coverIndexList.push(index)
		}
	})
	return {
		hasIn,
		coverList,
		coverIndexList,
	}
}
function detectEventIsTriggerOnCropBorderOrVertex(event, cropInfo, cropScale, zoomScale, currentPosition, origin) {
	let touchPoint = getTouchPoint(event, zoomScale, origin, 'move')
	let borderList = getCropFourBorderRect(cropInfo, cropScale, zoomScale, currentPosition)
	let detectResult = pointIsInRectList(
		touchPoint,
		borderList.map(i => i.positions)
	)
	return {
		hasIn: detectResult.hasIn,
		list: detectResult.coverIndexList.map(index => borderList[index]),
	}
}
function findOneBorderOrVertex(list) {
	let find = list.find(i => i.type === 'vertex') || list[0]
	if (!find) throw new Error('findOneBorderOrVertex list may be empty.')
	return find
}
function moveDetectCropBorderSetCursor(ele, event, mode, cropInfo, cropScale, zoomScale, currentPosition, origin) {
	//判断鼠标是否在裁剪框的4个边加四个顶点，在的话更改container鼠标手势  nwse-resize nesw-resize
	if (mode === 'crop' && !isWheeling) {
		let detectResult = detectEventIsTriggerOnCropBorderOrVertex(event, cropInfo, cropScale, zoomScale, currentPosition, origin)
		if (!detectResult.hasIn) {
			ele.style.cursor = 'auto'
		} else {
			let find = findOneBorderOrVertex(detectResult.list)
			let name = find.name
			if (name === 'left-top' || name === 'right-bottom') {
				ele.style.cursor = 'nwse-resize'
			}
			if (name === 'right-top' || name === 'left-bottom') {
				ele.style.cursor = 'nesw-resize'
			}
			if (name === 'left' || name === 'right') {
				ele.style.cursor = 'col-resize'
			}
			if (name === 'top' || name === 'bottom') {
				ele.style.cursor = 'row-resize'
			}
		}
	}
}
function getResizeCropInfo(cropInfo, offsetInfo, borderOrVertexInfo) {
	let newCropInfo = cloneDeep(cropInfo)
	let name = borderOrVertexInfo.name
	let { offsetX, offsetY } = offsetInfo
	if (name.includes('left')) {
		newCropInfo.startX += offsetX
	}
	if (name.includes('top')) {
		newCropInfo.startY += offsetY
	}
	if (name.includes('right')) {
		newCropInfo.endX += offsetX
	}
	if (name.includes('bottom')) {
		newCropInfo.endY += offsetY
	}
	return newCropInfo
}
function moveResizeCrop(ctx, startPoint, endPoint, cropInfo, cropScale, zoomScale, currentPosition, tagArr) {
	if (startPoint && startPoint.x !== undefined && endPoint && endPoint.x !== undefined) {
		let offsetResult = twoPointsGetOffsetInfo(startPoint, endPoint, zoomScale)
		if (offsetResult.isStartMove) {
			let borderOrVertex = mouseDownOnCropBorderOrVertex
			let { offsetX, offsetY } = offsetResult.offsetInfo
			let newCropInfo = getResizeCropInfo(
				cropInfo,
				{
					offsetX: offsetX / zoomScale / cropScale,
					offsetY: offsetY / zoomScale / cropScale,
				},
				borderOrVertex
			)
			let position = transfromBoundingBoxToLtwh(newCropInfo, cropScale, zoomScale, currentPosition)
			drawCropRect(ctx, ...position)
			drawTagList(ctx, tagArr, zoomScale, currentPosition, undefined, undefined, undefined)
			// let realPosition = cloneDeep(position)
			// realPosition[2] /= zoomScale
			// realPosition[3] /= zoomScale
			return position
		}
	}
	return null
}
function getHypotenuseValue(width, height) {
	return Math.sqrt(
		// 保存双指开始距离
		Math.pow(width, 2) + Math.pow(height, 2)
	)
}
function getDotDistence(start, end) {
	return Math.abs(start - end)
}
function getTwoFingerTouchListDistence(touchList) {
	return {
		width: getDotDistence(touchList[0].clientX, touchList[1].clientX),
		height: getDotDistence(touchList[0].clientY, touchList[1].clientY),
	}
}
function getRectInfoByPosition(position, zoomScale, currentPosition, scale = 1) {
	let zoom = zoomScale * scale
	let rectInfo = {
		startX: (position[0] - currentPosition.x) / zoom,
		startY: (position[1] - currentPosition.y) / zoom,
		endX: (position[0] + position[2] - currentPosition.x) / zoom,
		endY: (position[1] + position[3] - currentPosition.y) / zoom,
	}
	return fixRectInfo(rectInfo).info
}
function initTagArrScale(tagArr, scale) {
	return tagArr.map(tag => {
		if (tag.scale !== 1) {
			tag.scale = scale
		}
		return tag
	})
}
async function initComponent(isFirst) {
	//处理文件变量
	initFileScopeVar()
	//初始化Vue data变量
	this.initDataVar()
	await this.$nextTick()
	//初始化prop到data
	this.cropInfo = this.cropBounding
	this.tagArr = this.tagList
	let containerRectInfo = this.$refs.container.getBoundingClientRect()
	this.containerInfo = {
		top: containerRectInfo.top,
		right: containerRectInfo.right,
		bottom: containerRectInfo.bottom,
		left: containerRectInfo.left,
		width: containerRectInfo.width,
		height: containerRectInfo.height,
		x: containerRectInfo.x,
		y: containerRectInfo.y,
	}
	if (isFirst === true) {
		this.addListenerKeyUpDown()
	}
	let ctx = (this.ctx = this.$refs.canvas.getContext('2d'))
	let ctx2 = (this.ctx2 = this.$refs.canvas2.getContext('2d'))
	let canvasWH = (this.canvasWH = amendDpi(getElementWH(ctx.canvas)))
	initCanvasWH(ctx, canvasWH)
	initCanvasWH(ctx2, canvasWH)
	return loadImage(this.src).then(img => {
		this.img = img
		this.imgWH = {
			width: img.width,
			height: img.height,
		}
		if (debug) console.log('Image WH', this.imgWH, canvasWH)
		let initScaleInfo = initScale(canvasWH, img)
		let scale = (this.scale = this.cropScale = initScaleInfo.scale)
		if (debug) console.log('Scale', scale)
		if (debug) console.log('Image Current', this.currentPosition.x, this.currentPosition.y, this.imgWH.width * scale, this.imgWH.height * scale)
		if (isFirst === true) {
			//处理没有cropInfo的情况
			if (!this.cropInfo) {
				if (initScaleInfo.fit === 'width') {
					this.currentPosition.x = (canvasWH.width - this.imgWH.width * scale) / 2
				} else {
					this.currentPosition.y = (canvasWH.height - this.imgWH.height * scale) / 2
				}
				this.cropInfo = {
					startX: 0,
					startY: 0,
					endX: 0 + this.imgWH.width,
					endY: 0 + this.imgWH.height,
				}
			}
			//处理有CropInfo的情况，放大裁剪区域之全屏
			else {
				if (debug) console.log(this.cropInfo)
				let cropBoxInfo = transfromBoundingBoxToLtwh(this.cropInfo, this.cropScale, this.zoomScale, this.currentPosition)
				let commonOffset = 50
				let widthRate = canvasWH.width / (cropBoxInfo[2] + commonOffset)
				let heightRate = canvasWH.height / (cropBoxInfo[3] + commonOffset)
				if (debug) console.log('RATE', widthRate, heightRate)
				// let boxStretchScale = cropBoxInfo[2] * widthRate <= canvasWH.width ? widthRate : heightRate  //宽度放大
				let boxStretchScale = cropBoxInfo[2] >= cropBoxInfo[3] ? widthRate : heightRate // 长边尽量展示出来
				let canvasZoom = Math.sqrt(boxStretchScale)
				if (debug) console.log('currentPosition before', this.currentPosition)
				this.currentPosition.x = this.currentPosition.x - this.cropInfo.startX * scale * canvasZoom + commonOffset / 2
				this.currentPosition.y = this.currentPosition.y - this.cropInfo.startY * scale * canvasZoom + commonOffset / 2
				if (debug) console.log('currentPosition after', this.currentPosition)
				if (debug)
					console.log('Fix Full', canvasWH, cropBoxInfo, cropBoxInfo[2] * boxStretchScale, cropBoxInfo[3] * boxStretchScale, boxStretchScale, canvasZoom)
				this.onMouseWheel(
					{
						deltaY: 1,
						clientX: 0,
						clientY: 0,
						preventDefault() {
							if (debug) console.log('preventDefault')
						},
						__zoom: canvasZoom,
					},
					true
				)
			}
		}
		drawImage(ctx, img, this.currentPosition.x, this.currentPosition.y, img.width * scale * this.zoomScale, img.height * scale * this.zoomScale)
		let initPosition = transfromBoundingBoxToLtwh(this.cropInfo, this.cropScale, this.zoomScale, this.currentPosition)
		if (debug) console.log('Crop Current', initPosition)
		drawCropRect(ctx2, ...initPosition)
		this.tagArr = initTagArrScale(this.tagArr, this.scale)
		drawTagList(ctx2, this.tagArr, this.zoomScale, this.currentPosition)
		return true
	})
}
export default defineComponent({
	name: 'OcrImage',
	props: {
		//是否允许crop画到图片外
		enableDrawCropOutOfImg: {
			type: Boolean,
			default: true,
		},
		//是否允许Tag画到crop外
		enableDrawTagOutOfCrop: {
			type: Boolean,
			default: true,
		},
		//是否允许Tag画到img外
		enableDrawTagOutOfImg: {
			type: Boolean,
			default: true,
		},
		cropBounding: {
			type: Object,
			default: null,
		},
		tagList: {
			type: Array,
			default: () => [],
		},
		mode: {
			type: String,
			default: 'crop', // [crop,tag]
		},
		src: {
			require: true,
			type: String,
		},
	},
	emits: ['update:tagList', 'update:cropBounding', 'update:mode', 'tagsStatusChange', 'cropChange', 'tagListChange'],
	data() {
		return {
			inited: false,
			isWheeled: false,
			ctx: null,
			ctx2: null,
			img: null,
			canvasWH: cloneDeep(defaultWH),
			imgWH: cloneDeep(defaultWH),
			startMousePoint: cloneDeep(defaultPoint),
			endMousePoint: cloneDeep(defaultPoint),
			twoFingerCenterPoint: {
				x: 0,
				y: 0,
			},
			hypotenuse: 0,
			currentPosition: {
				x: 0,
				y: 0,
			},
			origin: {
				x: 0,
				y: 0,
			},
			scale: 1,
			cropInfo: null,
			tmpCurrentPosition: null,
			cropScale: 1,
			containerInfo: {
				left: undefined,
				top: undefined,
			},
			zoomScale: 1,
			tmpCropPositionInfo: null,
			tmpTagPositionInfo: null,
			tagArr: [],
		}
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.onWindowResize)
		this.removeListenerKeyUpDown()
		initFileScopeVar()
	},
	mounted() {
		this.init(true)
		window.addEventListener('resize', this.onWindowResize)
	},
	watch: {
		//修正鼠标cursor
		mode: function (mode) {
			if (mode === 'tag') {
				this.$refs.container.style.cursor = 'auto'
			}
		},
		src: function (src) {
			if (!src) return
			this.init(true)
		},
		cropBounding: function (info) {
			this.resetWheelStatus(true)
			this.cropInfo = info || {
				startX: 0,
				startY: 0,
				endX: this.imgWH.width,
				endY: this.imgWH.height,
			}
			//cropBounding改变，相当于需要重新改变cropScale
			this.cropScale = this.scale
			let initPosition = transfromBoundingBoxToLtwh(this.cropInfo, this.cropScale, this.zoomScale, this.currentPosition)
			drawCropRect(this.ctx2, ...initPosition)
			drawTagList(this.ctx2, this.tagArr, this.zoomScale, this.currentPosition, undefined, undefined, undefined)
		},
		tagList: function (list) {
			this.resetWheelStatus(true)
			this.tagArr = initTagArrScale(list, this.scale)
			drawCropRect(this.ctx2, ...transfromBoundingBoxToLtwh(this.cropInfo, this.cropScale, this.zoomScale, this.currentPosition))
			drawTagList(this.ctx2, this.tagArr, this.zoomScale, this.currentPosition, undefined, undefined, undefined)
		},
	},
	methods: {
		onWindowResize() {
			requestAnimationFrame(this.init)
		},
		initDataVar() {
			this.inited = false
			this.isWheeled = false
			this.ctx = null
			this.ctx2 = null
			this.img = null
			this.canvasWH = cloneDeep(defaultWH)
			this.imgWH = cloneDeep(defaultWH)
			this.startMousePoint = cloneDeep(defaultPoint)
			this.endMousePoint = cloneDeep(defaultPoint)
			this.currentPosition = {
				x: 0,
				y: 0,
			}
			this.origin = {
				x: 0,
				y: 0,
			}
			this.scale = 1
			this.cropInfo = null
			this.tmpCurrentPosition = null
			this.cropScale = 1
			this.containerInfo = {
				left: undefined,
				top: undefined,
			}
			this.zoomScale = 1
			this.tmpCropPositionInfo = null
			this.tmpTagPositionInfo = null
			this.tagArr = []
		},
		init(isFirst) {
			initComponent
				.bind(this)(isFirst)
				.then(() => {
					this.inited = true
				})
		},
		onMouseDown(e) {
			if (!this.inited) return
			mouseDownTime = new Date().getTime()
			if (this.isWheeled) {
				this.ctx.translate(-this.origin.x, -this.origin.y)
				this.ctx2.translate(-this.origin.x, -this.origin.y)
				this.isWheeled = false
			}
			this.startMousePoint = {
				x: e.layerX,
				y: e.layerY,
			}
			//检测是否点在了crop的border或者vertex上边
			if (this.mode === 'crop') {
				let detectResult = detectEventIsTriggerOnCropBorderOrVertex(e, this.cropInfo, this.cropScale, this.zoomScale, this.currentPosition, this.origin)
				if (detectResult.hasIn) {
					mouseDownOnCropBorderOrVertex = findOneBorderOrVertex(detectResult.list)
				}
			}
		},
		onMouseMove(e) {
			if (!this.inited) return
			mouseUpTime = new Date().getTime()
			if (this.startMousePoint.x === undefined) {
				//画虚线部分
				moveDrawUnshowTagDashRect(this.ctx2, this.mode, this.tagArr, this.zoomScale, this.currentPosition, this.origin, e, this.cropInfo, this.cropScale)
				//检测鼠标是否在裁剪框四边上
				moveDetectCropBorderSetCursor(this.$refs.container, e, this.mode, this.cropInfo, this.cropScale, this.zoomScale, this.currentPosition, this.origin)
				return
			}
			this.endMousePoint = {
				x: e.layerX,
				y: e.layerY,
			}
			if (!spaceKeyDown) {
				//在crop模式的时候 检测是否在crop的边或者顶点上， 是的话执行放大缩小crop的逻辑，否的话拖动画布
				let move = () => {
					let offsetInfo = moveCanvas(
						this.ctx,
						this.ctx2,
						this.img,
						this.imgWH,
						this.scale,
						this.currentPosition,
						this.startMousePoint,
						this.endMousePoint,
						this.cropInfo,
						this.cropScale,
						this.zoomScale,
						this.tagArr
					)
					if (offsetInfo) {
						this.tmpCurrentPosition = cloneDeep(this.currentPosition)
						this.tmpCurrentPosition.x += offsetInfo.offsetX
						this.tmpCurrentPosition.y += offsetInfo.offsetY
					}
				}
				if (this.mode === 'tag') {
					move()
				}
				if (this.mode === 'crop') {
					if (mouseDownOnCropBorderOrVertex) {
						// console.log('AT RESIZE CROP.')
						this.tmpCropPositionInfo = moveResizeCrop(
							this.ctx2,
							this.startMousePoint,
							this.endMousePoint,
							this.cropInfo,
							this.cropScale,
							this.zoomScale,
							this.currentPosition,
							this.tagArr
						)
					} else {
						move()
					}
				}
			} else {
				if (this.mode === 'crop') {
					this.tmpCropPositionInfo = moveDrawCropRect(this.ctx2, this.startMousePoint, this.endMousePoint, this.zoomScale, this.origin)
					drawTagList(this.ctx2, this.tagArr, this.zoomScale, this.currentPosition)
				} else {
					drawCropRect(this.ctx2, ...transfromBoundingBoxToLtwh(this.cropInfo, this.cropScale, this.zoomScale, this.currentPosition))
					this.tmpTagPositionInfo = moveDrawTagRect(
						this.ctx2,
						this.startMousePoint,
						this.endMousePoint,
						this.zoomScale,
						this.origin,
						this.tagArr,
						this.currentPosition
					)
				}
			}
		},
		onMouseUp() {
			if (!this.inited) return
			this.cleartMousePoints()
		},
		onClick(event) {
			if (!this.inited) return
			let touchPoint = amendDpi(getTouchPoint(event, this.zoomScale, this.origin, 'click'), ['x', 'y'])
			console.log('click Touch Point', touchPoint)
			if (this.mode !== 'tag') return
			let clickInterval = mouseUpTime - mouseDownTime
			mouseDownTime = undefined
			mouseUpTime = undefined
			if (clickInterval > 100) {
				return
			}
			let positions = transfromBoundingBoxToLtwh(this.cropInfo, this.cropScale, this.zoomScale, this.currentPosition)
			drawCropRect(this.ctx2, ...positions)
			if (debug) console.log('touchPoint', touchPoint, this.tagArr)
			let { isReDraw, redrawList } = drawTagList(this.ctx2, this.tagArr, this.zoomScale, this.currentPosition, undefined, undefined, touchPoint)
			if (isReDraw) {
				console.log('CHANGE ITEM IS SHOW.')
				if (debug) console.log('tagArr', this.tagArr)
				drawCropRect(this.ctx2, ...positions)
				drawTagList(this.ctx2, this.tagArr, this.zoomScale, this.currentPosition)
				this.triggerTagListChange()
				this.$emit('tagsStatusChange', this.getTagList(redrawList))
			}
		},
		onMouseOut() {
			if (!this.inited) return
			this.resetWheelStatus(true)
			this.$refs.container.style.cursor = 'auto'
			this.cleartMousePoints()
		},
		resetWheelStatus(immediately = false) {
			let commonDeal = () => {
				wheelSetTimeout = undefined
				isWheeling = false
				if (this.isWheeled) {
					this.ctx.translate(-this.origin.x, -this.origin.y)
					this.ctx2.translate(-this.origin.x, -this.origin.y)
					this.isWheeled = false
				}
			}
			if (immediately) {
				if (wheelSetTimeout) {
					clearTimeout(wheelSetTimeout)
					commonDeal()
				}
			} else {
				if (wheelSetTimeout) {
					clearTimeout(wheelSetTimeout)
					wheelSetTimeout = undefined
				}
				wheelSetTimeout = setTimeout(() => {
					commonDeal()
				}, 700)
			}
		},
		onMouseWheel(event, privateCall) {
			if (!this.inited && !privateCall) return
			event.preventDefault()
			if (spaceKeyDown) return
			if ((this.startMousePoint.x !== undefined || this.endMousePoint.x !== undefined) && !event.onTouchMove) return
			if (!this.isWheeled) {
				this.ctx.translate(this.origin.x, this.origin.y)
				this.ctx2.translate(this.origin.x, this.origin.y)
			}
			let mousex = privateCall ? 0 : event.clientX - this.containerInfo.left
			let mousey = privateCall ? 0 : event.clientY - this.containerInfo.top
			// if (debug) console.log('Mouse Position', mousex, mousey)
			let wheel = event.deltaY < 0 ? 1 : -1
			let zoom = privateCall ? event.__zoom : Math.exp(wheel * zoomIntensity)
			if (this.zoomScale * zoom < 0.2) return
			isWheeling = true
			this.ctx.translate(this.origin.x, this.origin.y)
			this.ctx2.translate(this.origin.x, this.origin.y)
			this.origin = {
				x: this.origin.x - (mousex / (this.zoomScale * zoom) - mousex / this.zoomScale),
				y: this.origin.y - (mousey / (this.zoomScale * zoom) - mousey / this.zoomScale),
			}
			// if (debug) console.log('new Origin', this.origin)
			this.ctx.scale(zoom, zoom)
			this.ctx2.scale(zoom, zoom)
			this.ctx.translate(-this.origin.x, -this.origin.y)
			this.ctx2.translate(-this.origin.x, -this.origin.y)
			this.zoomScale *= zoom
			//动态设置字体大小
			this.ctx2.font = `${8 * this.zoomScale}px serif`
			clearCanvas(this.ctx, this.zoomScale)
			clearCanvas(this.ctx2, this.zoomScale)
			drawImage(
				this.ctx,
				this.img,
				-this.origin.x + this.currentPosition.x,
				-this.origin.y + this.currentPosition.y,
				this.imgWH.width * this.scale * this.zoomScale,
				this.imgWH.height * this.scale * this.zoomScale
			)
			let positions = transfromBoundingBoxToLtwh(this.cropInfo, this.cropScale, this.zoomScale, this.currentPosition, this.origin)
			positions[0] += -this.origin.x
			positions[1] += -this.origin.y
			drawCropRect(this.ctx2, ...positions)
			drawTagList(this.ctx2, this.tagArr, this.zoomScale, this.currentPosition, undefined, this.origin)
			this.isWheeled = true
			hasHoverRectInCanvas = false
			this.resetWheelStatus()
		},
		onTouchStart(event) {
			mouseDownTime = new Date().getTime()
			console.log('onTouchStart', event.touches)
			let touchList = amendMobileTouchEventDpi(event)
			if (event.touches.length === 1) {
				this.onMouseDown({
					layerX: touchList[0].clientX,
					layerY: touchList[0].clientY,
				})
			}
			if (event.touches.length == 2) {
				let { width, height } = getTwoFingerTouchListDistence(touchList)
				let hypotenuse = getHypotenuseValue(width, height) // 移动中的双指距离
				console.log('TouchStart', event.touches, width, height, hypotenuse)
				this.hypotenuse = hypotenuse
				this.twoFingerCenterPoint = {
					x: (touchList[0].clientX + touchList[1].clientX) / 2,
					y: (touchList[0].clientY + touchList[1].clientY) / 2,
				}
			}
		},
		async onTouchMove(event) {
			// console.log('onTouchMove', event.touches)
			mouseUpTime = new Date().getTime()
			let touchList = amendMobileTouchEventDpi(event)
			if (event.touches.length === 1) {
				this.onMouseMove({
					layerX: touchList[0].clientX,
					layerY: touchList[0].clientY,
				})
			}
			if (event.touches.length == 2) {
				let { width, height } = getTwoFingerTouchListDistence(touchList)
				let hypotenuse = getHypotenuseValue(width, height) // 移动中的双指距离
				let distance = hypotenuse - this.hypotenuse // 双指距离变化
				let zoom = -distance
				// console.log('Touch Zoom', zoom, hypotenuse, this.hypotenuse)
				this.hypotenuse = hypotenuse
				await this.$nextTick()
				this.onMouseWheel({
					onTouchMove: true,
					deltaY: zoom,
					preventDefault() {
						console.log('none')
					},
					clientX: this.twoFingerCenterPoint.x,
					clientY: this.twoFingerCenterPoint.y,
				})
			}
		},
		onTouchEnd(event) {
			console.log('onTouchEnd', event.touches, event.touches.length)
			this.onMouseUp()
			if (event.touches.length === 1) {
				111
			}
			if (event.touches.length == 2) {
				111
			}
		},
		cleartMousePoints() {
			if (!this.inited) return
			if (!spaceKeyDown) {
				if (this.tmpCurrentPosition) this.currentPosition = cloneDeep(this.tmpCurrentPosition)
				this.tmpCurrentPosition = null
				if (debug) console.log('CurrentPosition', this.currentPosition)
				if (debug) console.log('cropInfo', this.cropInfo, transfromBoundingBoxToLtwh(this.cropInfo, this.cropScale, this.zoomScale, this.currentPosition))
				if (this.tmpCropPositionInfo) {
					console.log('Before CROP INFO', this.cropInfo)
					this.cropInfo = getRectInfoByPosition(this.tmpCropPositionInfo, this.zoomScale, this.currentPosition, this.cropScale)
					console.log('SET CROP INFO', this.cropInfo, this.zoomScale, this.currentPosition)
					this.triggerCropInfoChange()
					this.tmpCropPositionInfo = null
				}
			} else {
				if (this.startMousePoint.x !== undefined && this.endMousePoint.x !== undefined) {
					if (this.mode === 'crop') {
						this.cropScale = 1
						if (this.tmpCropPositionInfo) {
							this.cropInfo = getRectInfoByPosition(this.tmpCropPositionInfo, this.zoomScale, this.currentPosition)
							if (debug) console.log('SET CROP INFO', this.cropInfo)
							this.triggerCropInfoChange()
							this.tmpCropPositionInfo = null
						}
					} else {
						if (this.tmpTagPositionInfo) {
							let tagInfo = Object.assign(getRectInfoByPosition(this.tmpTagPositionInfo, this.zoomScale, this.currentPosition), {
								scale: 1,
								isShow: true,
							})
							console.log('push Tag', this.tmpTagPositionInfo, tagInfo)
							this.tagArr.push(tagInfo)
							this.triggerTagListChange()
							this.tmpTagPositionInfo = null
						}
					}
				}
			}
			mouseDownOnCropBorderOrVertex = undefined
			this.startMousePoint = cloneDeep(defaultPoint)
			this.endMousePoint = cloneDeep(defaultPoint)
		},
		onKeyDownListener(e) {
			if (e.code === 'Space') {
				e.preventDefault()
				if (this.startMousePoint.x === undefined) {
					spaceKeyDown = true
				}
			}
		},
		onKeyUpListener(e) {
			if (e.code === 'KeyB' && e.ctrlKey) {
				if (this.mode === 'tag') {
					this.$emit('update:mode', 'crop')
				} else {
					this.$emit('update:mode', 'tag')
				}
			}
			if (e.code === 'Space') {
				//处理画到一半松开空格
				this.cleartMousePoints()
				this.$nextTick().then(() => {
					spaceKeyDown = false
				})
			}
		},
		addListenerKeyUpDown() {
			document.addEventListener('keydown', this.onKeyDownListener)
			document.addEventListener('keyup', this.onKeyUpListener)
		},
		removeListenerKeyUpDown() {
			document.removeEventListener('keydown', this.onKeyDownListener)
			document.removeEventListener('keyup', this.onKeyUpListener)
		},
		// add remove update all call this func.
		triggerTagListChange() {
			let list = this.getTagList()
			this.$nextTick(() => {
				this.$emit('update:tagList', list)
				this.$emit('tagListChange', list)
			})
		},
		// redraw resize all call this func.
		triggerCropInfoChange() {
			this.$nextTick(() => {
				this.$emit('update:cropBounding', this.getCropBounding())
				this.$emit('cropChange')
			})
		},
		getCropBounding(cropInfo, cropScale, initScale, imageWH) {
			let info = cropInfo || this.cropInfo
			let scale = (cropScale || this.cropScale) === 1 ? initScale || this.scale : 1
			let result = {
				startX: info.startX / scale,
				startY: info.startY / scale,
				endX: info.endX / scale,
				endY: info.endY / scale,
			}
			if (!this.enableDrawCropOutOfImg) {
				let whObj = imageWH || this.imgWH
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
		},
		getTagList(tagList, cropInfo, initScale, imageWH) {
			let list = tagList || this.tagArr
			let info = cropInfo || this.getCropBounding()
			let resultList = list.map(tag => {
				let newTagInfo = cloneDeep(tag)
				let scale = tag.scale === 1 ? initScale || this.scale : 1
				Object.assign(newTagInfo, {
					startX: tag.startX / scale,
					startY: tag.startY / scale,
					endX: tag.endX / scale,
					endY: tag.endY / scale,
				})
				if (newTagInfo.scale === 1) {
					delete newTagInfo.scale
				}
				if (!this.enableDrawTagOutOfCrop) {
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
				if (this.enableDrawTagOutOfCrop && !this.enableDrawTagOutOfImg) {
					let whObj = imageWH || this.imgWH
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
		},
		/* API */
		refreshDrawTags() {
			this.resetWheelStatus(true)
			this.tagArr = initTagArrScale(this.tagList, this.scale)
			drawCropRect(this.ctx2, ...transfromBoundingBoxToLtwh(this.cropInfo, this.cropScale, this.zoomScale, this.currentPosition))
			drawTagList(this.ctx2, this.tagArr, this.zoomScale, this.currentPosition, undefined, undefined, undefined, 1 / this.scale)
		},
		/* API */
		removeTagItems(...restArgs) {
			this.resetWheelStatus(true)
			let firstArg = restArgs[0]
			let removeList = firstArg ? (firstArg instanceof Array ? firstArg : restArgs) : []
			console.log('removeList', removeList)
			let newTagArr = []
			if (removeList.length !== 0) {
				let currentList = this.getTagList()
				currentList.forEach(tag => {
					if (!removeList.find(i => i.startX === tag.startX && i.endX === tag.endX && i.startY === tag.startY && i.endY === tag.endY)) {
						newTagArr.push(tag)
					}
				})
			}
			console.log('newList', newTagArr)
			this.tagArr = initTagArrScale(newTagArr, this.scale)
			this.$nextTick().then(() => {
				drawCropRect(this.ctx2, ...transfromBoundingBoxToLtwh(this.cropInfo, this.cropScale, this.zoomScale, this.currentPosition))
				drawTagList(this.ctx2, this.tagArr, this.zoomScale, this.currentPosition, undefined, undefined, undefined, 1 / this.scale)
				this.triggerTagListChange()
			})
		},
	},
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
