import { cloneDeep } from 'lodash'
const CancasSafeArea = 100000
const DPI = window.devicePixelRatio || 1
export const debug = true

export type WH = {
	width: number
	height: number
}
export type Point = {
	x: number
	y: number
}
// __changed
export const defaultWH: WH = {
	width: 0,
	height: 0,
}

// __changed
export const defaultPoint: Partial<Point> = {
	x: undefined,
	y: undefined,
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
	ctx.clearRect(-CancasSafeArea / 2, -CancasSafeArea / 2, CancasSafeArea, CancasSafeArea)
}

export function loadImage(src: string): Promise<HTMLImageElement> {
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

export function drawImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, left: number, top: number, width: number, height: number) {
	ctx.drawImage(img, left, top, width, height)
}

export function drawLayerBg(ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
	ctx.fillRect(-CancasSafeArea / 2, -CancasSafeArea / 2, CancasSafeArea, CancasSafeArea)
}

export function drawLayerImageData(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number) {
	ctx.clearRect(left, top, width, height)
}

export function drawLayerBorder(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number) {
	ctx.setLineDash([])
	ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
	ctx.lineWidth = 2
	ctx.strokeRect(left, top, width, height)
}

export function getElementWH(ele: HTMLElement) {
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

export function initCanvasWH(ctx: CanvasRenderingContext2D, info: WH) {
	ctx.canvas.width = info.width
	ctx.canvas.height = info.height
}

type ScaleReturn = {
	scale: number
	fit: 'height' | 'width'
}
export function initScale(canvasWH: WH, imgWH: HTMLImageElement): ScaleReturn {
	let widthRate = canvasWH.width / imgWH.width
	let heightRate = canvasWH.height / imgWH.height
	let scale = widthRate < heightRate ? widthRate : heightRate
	return {
		scale,
		fit: widthRate < heightRate ? 'height' : 'width',
	}
}
type ObjectToString = 'Number' | 'String' | 'Symbol' | 'Object' | 'Function' | 'Null'
export function getVariableType(value) {
	let valueObjectString = Object.prototype.toString.call(value)
	return valueObjectString.slice(8, valueObjectString.length - 1) as ObjectToString
}

export function amendDpi<T>(val: T, propers: Array<keyof T> = ['width', 'height'] as Array<keyof T>): T | (T & WH) {
	try {
		let valType = getVariableType(val)
		if (valType === 'Number') return ((val as unknown as number) * DPI) as unknown as T
		propers.forEach(properName => {
			val[properName as any] *= DPI
		})
	} catch (error) {
		console.error('ERROR', val, getVariableType(val), error)
	}
	return val as T & WH
}

export function amendMobileTouchEventDpi(touchEvent: TouchEvent) {
	return Array.from(touchEvent.touches || []).map(touchRecord => {
		let cloneRecord = {
			clientX: touchRecord.clientX,
			clientY: touchRecord.clientY,
		}
		return amendDpi(cloneRecord, ['clientX', 'clientY'])
	})
}

export function drawCropRect(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number) {
	clearCanvas(ctx)
	drawLayerBg(ctx)
	drawLayerImageData(ctx, left, top, width, height)
	drawLayerBorder(ctx, left, top, width, height)
}

export type Rect = [left: number, top: number, width: number, height: number]

export function pointIsInRect(point: Point, rect: Rect) {
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

export function transfromTwoPointsToLtwh(pointStart: Point, pointEnd: Point): Rect {
	let width = Math.abs(pointEnd.x - pointStart.x)
	let height = Math.abs(pointEnd.y - pointStart.y)
	let left = Math.min(pointStart.x, pointEnd.x)
	let top = Math.min(pointStart.y, pointEnd.y)
	return [left, top, width, height]
}

export type BoundingBox = {
	startX: number
	startY: number
	endX: number
	endY: number
	scale?: number
	isShow?: boolean
	showOutLine?: boolean
}

type FixRectInfoReturn = {
	info: BoundingBox
	position: Rect
}
/*
startX endX  负数相反不对的部分给修正
*/
export function fixRectInfo(boundingBox: BoundingBox): FixRectInfoReturn {
	let newInfo = cloneDeep(boundingBox)
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

export function getTwoRectIntersectPart(rect1: BoundingBox, rect2: BoundingBox): BoundingBox | undefined {
	let fixInfo1 = fixRectInfo(rect1)
	let fixInfo2 = fixRectInfo(rect2)
	let minStartY = Math.min(fixInfo1.info.startY, fixInfo2.info.startY)
	let maxEndY = Math.max(fixInfo1.info.endY, fixInfo2.info.endY)
	let lengthY = Math.abs(maxEndY - minStartY)
	let superpositionHeight = fixInfo1.position[3] + fixInfo2.position[3]
	let intersectY:
		| {
				startY: number
				endY: number
		  }
		| undefined
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
	let intersectX:
		| {
				startX: number
				endX: number
		  }
		| undefined
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

export function transfromBoundingBoxToLtwh(
	position: BoundingBox,
	scale = 1,
	zoomScale = 1,
	currentPosition: Point = {
		x: 0,
		y: 0,
	}
): Rect {
	let fixResult = fixRectInfo(position)
	let { startX, startY } = fixResult.info
	let width = fixResult.position[2]
	let height = fixResult.position[3]
	return [startX * scale * zoomScale + currentPosition.x, startY * scale * zoomScale + currentPosition.y, width * scale * zoomScale, height * scale * zoomScale]
}

export function isRectValidity(rect: BoundingBox) {
	let position = transfromBoundingBoxToLtwh(rect, 1, 1)
	if (position[2] >= 5 && position[3] >= 5) {
		return true
	}
	return false
}

type TouchType = 'move' | 'click'
type TypePoint = Point & {
	type: TouchType
}
export function drawTagRect(
	ctx: CanvasRenderingContext2D,
	left: number,
	top: number,
	width: number,
	height: number,
	index?: number,
	touchPoint?: TypePoint,
	isShow?: boolean,
	showOutLine?: boolean
):
	| {
			isShow: boolean
			isCrash: boolean
	  }
	| undefined {
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
			ctx.fillText(index + '', left + (indexRectWitdh - fontsize) / 2, top + indexRectHeight / 2 + fontsize / 2)
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
type Offset = {
	offsetX: number
	offsetY: number
}
// origin只有在进行缩放的时候需要传递，其他时候不需要，因为在保存tag的时候已经处理过
export function drawTagList(
	ctx: CanvasRenderingContext2D,
	list: BoundingBox[],
	zoomScale: number,
	currentPosition: Point,
	offsetInfo: Offset = {
		offsetX: 0,
		offsetY: 0,
	},
	origin: Point = {
		x: 0,
		y: 0,
	},
	touchPoint?: TypePoint
) {
	let isReDraw = false
	let redrawList: BoundingBox[] = []
	list.forEach((tagInfo, index) => {
		let positions = transfromBoundingBoxToLtwh(tagInfo, tagInfo.scale, zoomScale, currentPosition)
		positions[0] += offsetInfo!.offsetX - origin!.x
		positions[1] += offsetInfo!.offsetY - origin!.y
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

export function fixMoveRectPosition(position: Rect, zoomScale: number, origin: Point) {
	position[0] = position[0] / zoomScale + origin.x * 2
	position[1] = position[1] / zoomScale + origin.y * 2
	position[2] /= zoomScale
	position[3] /= zoomScale
	return position
}

export function moveDrawCropRect(ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point, zoomScale = 1, origin: Point) {
	if (startPoint.x !== undefined && endPoint.x !== undefined) {
		let position = fixMoveRectPosition(transfromTwoPointsToLtwh(startPoint, endPoint), zoomScale, origin)
		if (position[2] > 5 || position[3] > 5) {
			// if (debug) console.log('DRAW', position)
			drawCropRect(ctx, ...position)
			return position
		}
	}
	return undefined
}

export function moveDrawTagRect(ctx, startPoint, endPoint, zoomScale = 1, origin, tagArr, currentPosition) {
	if (startPoint.x !== undefined && endPoint.x !== undefined) {
		let position = fixMoveRectPosition(transfromTwoPointsToLtwh(startPoint, endPoint), zoomScale, origin)
		if (position[2] > 5 || position[3] > 5) {
			// if (debug) console.log('DRAW Tag', position)
			drawTagList(ctx, tagArr, zoomScale, currentPosition)
			drawTagRect(ctx, ...position, tagArr.length + 1, undefined, true)
			return position
		}
	}
	return undefined
}

export function twoPointsGetOffsetInfo(
	startPoint: Point,
	endPoint: Point,
	zoomScale: number
): {
	isStartMove: boolean
	offsetInfo: Offset
} {
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

export function moveCanvas(
	ctx: CanvasRenderingContext2D,
	ctx2: CanvasRenderingContext2D,
	img: HTMLImageElement,
	imgWH: WH,
	scale: number,
	currentPosition: Point,
	startPoint: Point,
	endPoint: Point,
	cropInfo: BoundingBox,
	cropScale: number,
	zoomScale: number,
	tagArr: BoundingBox[]
): Offset | undefined {
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
	return undefined
}

export type LayerTouchEvent = (MouseEvent | TouchEvent) & {
	layerX: number
	layerY: number
}

export function getTouchPoint(event: LayerTouchEvent, zoomScale, origin, type: TouchType): TypePoint {
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

export type Mode = 'tag' | 'crop'
export function moveDrawUnshowTagDashRect(
	ctx: CanvasRenderingContext2D,
	mode: Mode,
	tagArr: BoundingBox[],
	zoomScale: number,
	currentPosition: Point,
	origin: Point,
	e: LayerTouchEvent,
	cropInfo: BoundingBox,
	cropScale: number,
	isWheeling: boolean,
	hasHoverRectInCanvas: boolean
) {
	/*
  判断tagArr里边unShow的tag在坐标点，就绘制，不在页绘制为空
  */
	if (mode === 'tag' && !isWheeling) {
		let unShowArr = tagArr.filter(i => !i.isShow)
		let isHasTouchPointInArr = false
		let touchPoint = getTouchPoint(e, zoomScale, origin, 'move')
		let dashArr: BoundingBox[] = []
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

	return hasHoverRectInCanvas
}

type ResizeType = {
	vertex: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom'
	border: 'left' | 'top' | 'right' | 'bottom'
}
export type ResizeItem = {
	type: keyof ResizeType
	name: ResizeType[keyof ResizeType]
	positions: Rect
}

export function getCropFourBorderRect(cropInfo: BoundingBox, cropScale: number, zoomScale: number, currentPosition: Point) {
	let positions = transfromBoundingBoxToLtwh(cropInfo, cropScale, zoomScale, currentPosition)
	const BorderWidth = 6
	let HalfBorder = BorderWidth / 2
	let list: ResizeItem[] = [
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

export function pointIsInRectList(point: Point, list: Rect[]) {
	let hasIn = false
	let coverList: Rect[] = []
	let coverIndexList: number[] = []
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

export function detectEventIsTriggerOnCropBorderOrVertex(
	event: LayerTouchEvent,
	cropInfo: BoundingBox,
	cropScale: number,
	zoomScale: number,
	currentPosition: Point,
	origin: Point
) {
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

export function findOneBorderOrVertex(list: ResizeItem[]) {
	let find = list.find(i => i.type === 'vertex') || list[0]
	if (!find) throw new Error('findOneBorderOrVertex list may be empty.')
	return find
}

export function moveDetectCropBorderSetCursor(
	ele: HTMLElement,
	event: LayerTouchEvent,
	mode: Mode,
	cropInfo: BoundingBox,
	cropScale: number,
	zoomScale: number,
	currentPosition: Point,
	origin: Point,
	isWheeling: boolean
) {
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

export function getResizeCropInfo(cropInfo: BoundingBox, offsetInfo: Offset, borderOrVertexInfo?: ResizeItem) {
	if (!borderOrVertexInfo) return cropInfo
	let newCropInfo: BoundingBox = cloneDeep(cropInfo)
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

export function moveResizeCrop(
	ctx: CanvasRenderingContext2D,
	startPoint: Point,
	endPoint: Point,
	cropInfo: BoundingBox,
	cropScale: number,
	zoomScale: number,
	currentPosition: Point,
	tagArr: BoundingBox[],
	mouseDownOnCropBorderOrVertex: ResizeItem
) {
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
	return undefined
}

export function getHypotenuseValue(width: number, height: number) {
	return Math.sqrt(
		// 保存双指开始距离
		Math.pow(width, 2) + Math.pow(height, 2)
	)
}

export function getDotDistence(start: number, end: number) {
	return Math.abs(start - end)
}

export function getTwoFingerTouchListDistence(
	touchList: Array<{
		clientX: number
		clientY: number
	}>
) {
	return {
		width: getDotDistence(touchList[0].clientX, touchList[1].clientX),
		height: getDotDistence(touchList[0].clientY, touchList[1].clientY),
	}
}

export function getRectInfoByPosition(position: Rect, zoomScale: number, currentPosition: Point, scale = 1) {
	let zoom = zoomScale * scale
	let rectInfo = {
		startX: (position[0] - currentPosition.x) / zoom,
		startY: (position[1] - currentPosition.y) / zoom,
		endX: (position[0] + position[2] - currentPosition.x) / zoom,
		endY: (position[1] + position[3] - currentPosition.y) / zoom,
	}
	return fixRectInfo(rectInfo).info
}

export function initTagArrScale(tagArr: BoundingBox[], scale: number) {
	return tagArr.map(tag => {
		if (tag.scale !== 1) {
			tag.scale = scale
		}
		return tag
	})
}
