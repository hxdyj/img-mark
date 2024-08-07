import { cloneDeep } from 'lodash'
import device from 'current-device'
import {
	BoundingBox,
	Config,
	LayerTouchEvent,
	Mode,
	Point,
	Rect,
	ResizeItem,
	TagConfig,
	TypePoint,
	VertexPosition,
	WH,
	TouchType,
	DaubPoint,
	CropConfig,
	Dot,
	DotConfig,
} from './ImgMarkType'
const CancasSafeArea = 100000
export const DPI = window.devicePixelRatio || 1
export const debug = false

export const DEFAULT_CONFIG: Config = {
	daubConfig: {
		lineWidth: 20,
		strokeStyle: 'white',
	},
	tagConfig: {
		fontSize: 20,
		showText: true,
		fillStyle: 'rgba(242, 88, 85, 0.5)',
		textFillStyle: 'rgba(255, 255, 255, 0.6)',
		hoverStrokeStyle: '#F25856',
		hoverLineWidth: 1,
		hoverLineDash: [5],
		highlightStrokeStyle: 'yellow',
		highlightLineWidth: 2,
		highlightLineDash: [5],
		customDraw() {},
	},
	layerConfig: {
		fillStyle: 'rgba(0, 0, 0, 0.6)',
	},
	cropConfig: {
		lineDash: [],
		strokeStyle: 'rgba(255, 255, 255, 1)',
		lineWidth: 2,
		customDraw() {},
	},
	dotConfig: {
		lineDash: [],
		lineWidth: 2,
		strokeStyle: 'transparent',
		hoverFillStyle: '#69B1FF',
		fillStyle: '#24FF6E',
		radius: 50,
	},
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

export function loadImage(src: string, crossOrigin?: boolean): Promise<HTMLImageElement> {
	let img = new Image()
	if (crossOrigin) {
		img.crossOrigin = 'anonymous'
	}
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
	ctx.imageSmoothingEnabled = true
	ctx.imageSmoothingQuality = 'high'
	ctx.drawImage(img, left, top, width, height)
}

export function drawLayerBg(ctx: CanvasRenderingContext2D, config: Config) {
	ctx.fillStyle = config.layerConfig.fillStyle
	ctx.fillRect(-CancasSafeArea / 2, -CancasSafeArea / 2, CancasSafeArea, CancasSafeArea)
}

export function drawLayerImageData(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number) {
	ctx.clearRect(left, top, width, height)
}

export function drawLayerBorder(
	ctx: CanvasRenderingContext2D,
	left: number,
	top: number,
	width: number,
	height: number,
	config: Config,
	cropInfo?: BoundingBox
) {
	let finalCropConfig: Required<CropConfig> = cloneDeep(config.cropConfig)
	if (cropInfo && cropInfo.cropConfig) {
		Object.assign(finalCropConfig, cropInfo.cropConfig)
	}
	ctx.setLineDash(finalCropConfig.lineDash)
	ctx.strokeStyle = finalCropConfig.strokeStyle
	ctx.lineWidth = finalCropConfig.lineWidth
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
export function getVariableType(value: unknown) {
	let valueObjectString = Object.prototype.toString.call(value)
	return valueObjectString.slice(8, valueObjectString.length - 1) as ObjectToString
}

export function amendDpi<T>(val: T, propers: Array<keyof T> = ['width', 'height'] as Array<keyof T>, reverse: boolean = false): T | (T & WH) {
	try {
		let valType = getVariableType(val)
		let dpi = reverse ? 1 / DPI : DPI
		if (valType === 'Number') return ((val as unknown as number) * dpi) as unknown as T
		propers.forEach(properName => {
			val[properName as any] *= dpi
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

export function drawCropRect(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number, config: Config, unClearCanvas?: boolean) {
	if (!unClearCanvas) {
		clearCanvas(ctx)
		drawLayerBg(ctx, config)
	}
	drawLayerImageData(ctx, left, top, width, height)
	drawLayerBorder(ctx, left, top, width, height, config)
}

export function drawDuabPointList(ctx: CanvasRenderingContext2D, pointList: DaubPoint[], currentPosition: Point, config: Config) {
	let movePoint: null | DaubPoint = null
	let linePoint: null | DaubPoint = null

	pointList.forEach((point, index) => {
		if (!ctx) return
		movePoint = pointList[index - 1] || point
		linePoint = point

		ctx.beginPath()

		ctx.lineJoin = 'round'
		ctx.lineCap = 'round'
		ctx.lineWidth = point.lineWidth || config.daubConfig.lineWidth
		ctx.strokeStyle = point.strokeStyle || config.daubConfig.strokeStyle

		ctx.moveTo(movePoint._x || movePoint.x, movePoint._y || movePoint.y)
		ctx.lineTo(linePoint._x || linePoint.x, linePoint._y || linePoint.y)

		ctx.stroke()
	})
}

export function drawCropList(
	ctx: CanvasRenderingContext2D,
	cropList: BoundingBox[],
	currentPosition: Point,
	config: Config,
	offset?: Offset,
	unClearCanvas?: boolean
) {
	if (!unClearCanvas) {
		clearCanvas(ctx)
		drawLayerBg(ctx, config)
	}
	cropList.forEach(crop => {
		let position = transfromBoxToRect(crop, crop.__scale, currentPosition)
		if (offset) {
			position[0] += offset.offsetX
			position[1] += offset.offsetY
		}
		drawLayerImageData(ctx, ...position)
		drawLayerBorder(ctx, ...position, config, crop)

		let finalCropConfig: Required<CropConfig> = cloneDeep(config.cropConfig)
		if (crop && crop.cropConfig) {
			Object.assign(finalCropConfig, crop.cropConfig)
		}

		finalCropConfig.customDraw?.(ctx, {
			target: crop,
			positions: position,
		})
	})
}

export function pointIsInBoxList(
	point: Point,
	boxList: BoundingBox[],
	scale: number = 1,
	currentPosition: Point = {
		x: 0,
		y: 0,
	}
): {
	boxList: BoundingBox[]
	indexList: number[]
} {
	let boxListPointIn: BoundingBox[] = []
	let indexList: number[] = []
	let arr = boxList.map(box => transfromBoxSize2Visual(box, scale, currentPosition))
	arr.forEach((rect, index) => {
		if (pointIsInBox(point, rect)) {
			boxListPointIn.push(boxList[index])
			indexList.push(index)
		}
	})
	return {
		boxList: boxListPointIn,
		indexList,
	}
}

export function transfromBoxSize2Visual(box: BoundingBox, scale: number, currentPosition: Point): BoundingBox {
	let obj: BoundingBox = cloneDeep(box)
	obj.startX = obj.startX * scale + currentPosition.x
	obj.endX = obj.endX * scale + currentPosition.x
	obj.startY = obj.startY * scale + currentPosition.y
	obj.endY = obj.endY * scale + currentPosition.y
	return obj
}

export function pointIsInBox(point: Point, box: BoundingBox) {
	if (point.x >= box.startX && point.x <= box.endX && point.y >= box.startY && point.y <= box.endY) {
		return true
	}
	return false
}

export function pointIsInRect(point: Point, rect: Rect) {
	let rectPositionInfo = {
		startX: rect[0],
		endX: rect[0] + rect[2],
		startY: rect[1],
		endY: rect[1] + rect[3],
	}
	if (point.x >= rectPositionInfo.startX && point.x <= rectPositionInfo.endX && point.y >= rectPositionInfo.startY && point.y <= rectPositionInfo.endY) {
		return true
	}
	return false
}

//transfromTwoPoints2Rect
export function transfromTwoPoints2Rect(pointStart: Point, pointEnd: Point): Rect {
	let width = Math.abs(pointEnd.x - pointStart.x)
	let height = Math.abs(pointEnd.y - pointStart.y)
	let left = Math.min(pointStart.x, pointEnd.x)
	let top = Math.min(pointStart.y, pointEnd.y)
	return [left, top, width, height]
}

type FixBoxInfoReturn = {
	info: BoundingBox
	position: Rect
}
/*
startX endX  负数相反不对的部分给修正
*/
export function fixBoxInfo(boundingBox: BoundingBox): FixBoxInfoReturn {
	let newInfo = boundingBox
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
export function getTwoBoxIntersectPart(box1: BoundingBox, box2: BoundingBox): BoundingBox | undefined {
	let fixInfo1 = fixBoxInfo(box1)
	let fixInfo2 = fixBoxInfo(box2)
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

export function transfromDotToArc(
	dot: Dot,
	scale = 1,
	currentPosition: Point = {
		x: 0,
		y: 0,
	},
	raduis: number,
	offset?: Offset
): [number, number, number, number, number] {
	return [
		dot.x * scale + currentPosition.x + (offset?.offsetX || 0),
		dot.y * scale + currentPosition.y + (offset?.offsetY || 0),
		raduis * scale,
		0,
		2 * Math.PI,
	]
}

export function transfromBoxToRect(
	position: BoundingBox,
	scale = 1,
	currentPosition: Point = {
		x: 0,
		y: 0,
	}
): Rect {
	let fixResult = fixBoxInfo(position)
	let { startX, startY } = fixResult.info
	let width = fixResult.position[2]
	let height = fixResult.position[3]
	return [startX * scale + currentPosition.x, startY * scale + currentPosition.y, width * scale, height * scale]
}
export function isBoxValidity(box: BoundingBox) {
	let position = transfromBoxToRect(box)
	if (position[2] >= 5 && position[3] >= 5) {
		return true
	}
	return false
}

export function drawTagRect(
	ctx: CanvasRenderingContext2D,
	left: number,
	top: number,
	width: number,
	height: number,
	config: Config,
	index: number,
	touchPoint: TypePoint | undefined,
	isShow: boolean | undefined,
	showOutLine: boolean | undefined,
	tagLabel: string | undefined,
	tagConfig: TagConfig | undefined,
	tagInfo: BoundingBox | undefined
):
	| {
			isShow: boolean
			isCrash: boolean
	  }
	| undefined {
	// if (debug) console.log(`DRAW ITEM${index}`, touchPoint, [left, top, width, height], isShow)
	let finalTagConfig: Required<TagConfig> = cloneDeep(config.tagConfig)
	if (tagConfig) {
		Object.assign(finalTagConfig, tagConfig)
	}
	ctx.font = `${finalTagConfig.fontSize}px sans-serif`
	if (!touchPoint && !isShow) return
	if (isShow && (!touchPoint || touchPoint.type !== 'move')) {
		ctx.fillStyle = finalTagConfig.fillStyle
		ctx.fillRect(left, top, width, height)
		if (index && finalTagConfig.showText) {
			let fontsize = parseFloat(ctx.font.split(' ')[0])
			ctx.fillStyle = finalTagConfig.textFillStyle
			ctx.fillText(tagLabel || index + '', left + 4, top + height / 2 + fontsize / 2)
		}
	}
	if (showOutLine) {
		ctx.strokeStyle = finalTagConfig.highlightStrokeStyle
		ctx.lineWidth = finalTagConfig.highlightLineWidth
		ctx.setLineDash(finalTagConfig.highlightLineDash)
		ctx.strokeRect(left, top, width, height)
	}
	let isCrash = false
	if (touchPoint) {
		if (pointIsInRect(touchPoint, [left, top, width, height])) {
			if (touchPoint.type === 'click') {
				// console.log('Point In Rect', touchPoint, [left, top, width, height], index)
				isShow = !isShow
				isCrash = true
				return {
					isShow,
					isCrash,
				}
			}
			if (touchPoint.type === 'move' && !isShow) {
				ctx.strokeStyle = finalTagConfig.hoverStrokeStyle
				ctx.lineWidth = finalTagConfig.hoverLineWidth
				ctx.setLineDash(finalTagConfig.hoverLineDash)
				ctx.strokeRect(left, top, width, height)
			}
		}
	}
	finalTagConfig.customDraw(ctx, {
		target: tagInfo,
		positions: [left, top, width, height],
	})
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
	currentPosition: Point,
	config: Config,
	offsetInfo: Offset = {
		offsetX: 0,
		offsetY: 0,
	},
	touchPoint?: TypePoint
) {
	let isReDraw = false
	let redrawList: BoundingBox[] = []
	list.forEach(tagInfo => {
		let positions = transfromBoxToRect(tagInfo, tagInfo.__scale, currentPosition)
		positions[0] += offsetInfo!.offsetX
		positions[1] += offsetInfo!.offsetY
		// if (debug) console.log(`DRAW ITEM${index}`, tagInfo, positions)
		let drawTagInfo = drawTagRect(
			ctx,
			...positions,
			config,
			(tagInfo.__index || 0) + 1,
			touchPoint,
			tagInfo.isShow,
			tagInfo.showOutLine,
			tagInfo.labelText,
			tagInfo.tagConfig,
			tagInfo
		)
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
	let point = fixPoint(
		{
			x: position[0],
			y: position[1],
		},
		zoomScale,
		origin
	)
	position[0] = point.x
	position[1] = point.y
	position[2] /= zoomScale / DPI
	position[3] /= zoomScale / DPI
	return position
}

export function moveDrawCropRect(
	ctx: CanvasRenderingContext2D,
	startPoint: Point,
	endPoint: Point,
	zoomScale,
	origin: Point,
	cropList: BoundingBox[],
	currentPosition: Point,
	config: Config
) {
	if (startPoint.x !== undefined && endPoint.x !== undefined) {
		let position = fixMoveRectPosition(transfromTwoPoints2Rect(startPoint, endPoint), zoomScale, origin)
		position[2] = amendDpi(position[2], undefined, true)
		position[3] = amendDpi(position[3], undefined, true)
		if (position[2] > 5 || position[3] > 5) {
			drawCropList(ctx, cropList, currentPosition, config)
			drawCropRect(ctx, ...position, config, true)
			return position
		}
	}
	return undefined
}

export function drawDotList(ctx: CanvasRenderingContext2D, dotList: Dot[], currentPosition: Point, config: Config, offset?: Offset, unClearCanvas?: boolean) {
	dotList.forEach(dot => {
		ctx.beginPath()
		let finalDotConfig: Required<DotConfig> = cloneDeep(config.dotConfig)
		if (dot.dotConfig) {
			Object.assign(finalDotConfig, dot.dotConfig)
		}
		ctx.fillStyle = dot.__isHover ? finalDotConfig.hoverFillStyle : finalDotConfig.fillStyle
		ctx.strokeStyle = finalDotConfig.strokeStyle
		ctx.lineWidth = finalDotConfig.lineWidth
		ctx.setLineDash(finalDotConfig.lineDash)
		let position = transfromDotToArc(dot, dot.__scale, currentPosition, finalDotConfig.radius, offset)
		ctx.arc(...position)
		ctx.fill()
		ctx.stroke()
	})
}

export function getVertexPositionByTwoPoints(startPoint: Point, endPoint: Point): VertexPosition {
	let lr: 'left' | 'right' = startPoint.x <= endPoint.x ? 'left' : 'right'
	let tb: 'bottom' | 'top' = startPoint.y <= endPoint.y ? 'top' : 'bottom'

	return (lr + '-' + tb) as VertexPosition
}

export function getPointByBoxAndVertexPosition(box: BoundingBox, vertex: VertexPosition): Point {
	let position = vertex.split('-') as ['left' | 'right', 'bottom' | 'top']
	let x = position[0] === 'left' ? box.startX : box.endX
	let y = position[1] === 'top' ? box.startY : box.endY
	return {
		x,
		y,
	}
}
export function moveDrawTagRect(
	ctx: CanvasRenderingContext2D,
	startPoint: Point,
	endPoint: Point,
	zoomScale: number,
	origin: Point,
	tagArr: BoundingBox[],
	currentPosition: Point,
	config: Config
) {
	if (startPoint.x !== undefined && endPoint.x !== undefined) {
		let position = fixMoveRectPosition(transfromTwoPoints2Rect(startPoint, endPoint), zoomScale, origin)
		position[2] = amendDpi(position[2], undefined, true)
		position[3] = amendDpi(position[3], undefined, true)
		if (position[2] > 5 || position[3] > 5) {
			// if (debug) console.log('DRAW Tag', position)
			drawTagList(ctx, tagArr, currentPosition, config)
			drawTagRect(ctx, ...position, config, tagArr.length + 1, undefined, true, undefined, config.drawingText, undefined, undefined)
			return position
		}
	}
	return undefined
}
//getTwoPointsOffsetInfo
export function getTwoPointsOffsetInfo(
	startPoint: Point,
	endPoint: Point,
	zoomScale: number
): {
	isStartMove: boolean
	offsetInfo: Offset
} {
	let position = transfromTwoPoints2Rect(startPoint, endPoint)
	//手机端已经在开始初始化过DPI了
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
	cropList: BoundingBox[],
	zoomScale: number,
	tagArr: BoundingBox[],
	dotArr: Dot[],
	config: Config
): Offset | undefined {
	if (startPoint.x !== undefined && endPoint.x !== undefined) {
		let offsetResult = getTwoPointsOffsetInfo(startPoint, endPoint, zoomScale)
		if (offsetResult.isStartMove) {
			let { offsetX, offsetY } = offsetResult.offsetInfo
			clearCanvas(ctx)
			let newPosition = {
				x: currentPosition.x + offsetX,
				y: currentPosition.y + offsetY,
			}

			drawImage(ctx, img, newPosition.x, newPosition.y, imgWH.width * scale, imgWH.height * scale)
			// let boundingBoxPosition = transfromBoxToRect(cropInfo, cropScale, currentPosition)
			// boundingBoxPosition[0] += offsetX
			// boundingBoxPosition[1] += offsetY
			// drawCropRect(ctx2, ...boundingBoxPosition)
			drawCropList(ctx2, cropList, currentPosition, config, offsetResult.offsetInfo)
			drawTagList(ctx2, tagArr, currentPosition, config, {
				offsetX,
				offsetY,
			})
			drawDotList(ctx2, dotArr, currentPosition, config, offsetResult.offsetInfo)
			return {
				offsetX,
				offsetY,
			}
		}
	}
	return undefined
}

export function fixPoint(point: Point, zoomScale, origin: Point): Point {
	return {
		x: point.x / zoomScale + origin.x,
		y: point.y / zoomScale + origin.y,
	}
}
export function fixLength(len: number, zoomScale): number {
	return len / zoomScale
}

export function getTouchPoint(event: LayerTouchEvent, zoomScale, origin: Point, type: TouchType): TypePoint {
	let startPoint = fixPoint(
		{
			x: event.layerX,
			y: event.layerY,
		},
		zoomScale,
		origin
	)

	return {
		x: startPoint.x,
		y: startPoint.y,
		type,
	}
}

export function moveDrawUnshowTagDashRect(
	ctx: CanvasRenderingContext2D,
	mode: Mode,
	tagArr: BoundingBox[],
	zoomScale: number,
	currentPosition: Point,
	origin: Point,
	e: LayerTouchEvent,
	cropList: BoundingBox[],
	isScaleing: boolean,
	hasHoverRectInTagItem: boolean,
	config: Config
) {
	/*
  判断tagArr里边unShow的tag在坐标点，就绘制，不在页绘制为空
  */
	if (mode === 'tag' && !isScaleing) {
		let unShowArr = tagArr.filter(i => !i.isShow)
		let isHasTouchPointInArr = false
		let touchPoint = getTouchPoint(e, zoomScale, origin, 'move')
		let dashArr: BoundingBox[] = []
		unShowArr.forEach(tag => {
			let positions = transfromBoxToRect(tag, tag.__scale, currentPosition)
			if (pointIsInRect(touchPoint, positions)) {
				// console.log('DETECT hasTouchPointInArr', positions, touchPoint, [positions[0] + origin.x, positions[1] + origin.y], this, origin, zoomScale)
				dashArr.push(tag)
				isHasTouchPointInArr = true
			}
		})
		if (isHasTouchPointInArr) {
			hasHoverRectInTagItem = true
			drawTagList(ctx, dashArr, currentPosition, config, undefined, touchPoint)
		} else {
			if (hasHoverRectInTagItem) {
				// console.log('CLEAN HOVER Rect')
				drawCropList(ctx, cropList, currentPosition, config)
				drawTagList(ctx, tagArr, currentPosition, config)
				hasHoverRectInTagItem = false
			}
		}
	}

	return hasHoverRectInTagItem
}

export function getBoxFourBorderRect(box: BoundingBox, currentPosition: Point, index: number = -1, borderWidth?: number) {
	let positions = transfromBoxToRect(box, box.__scale, currentPosition)
	const BorderWidth = borderWidth != undefined ? borderWidth : device.mobile() ? DPI * 6 : 6
	let HalfBorder = BorderWidth / 2
	let list: ResizeItem[] = [
		{
			index,
			name: 'left-top',
			type: 'vertex',
			positions: [positions[0] - HalfBorder, positions[1] - HalfBorder, BorderWidth, BorderWidth],
		},
		{
			index,
			name: 'right-top',
			type: 'vertex',
			positions: [positions[0] + positions[2] - HalfBorder, positions[1] - HalfBorder, BorderWidth, BorderWidth],
		},
		{
			index,
			name: 'left-bottom',
			type: 'vertex',
			positions: [positions[0] - HalfBorder, positions[1] + positions[3] - HalfBorder, BorderWidth, BorderWidth],
		},
		{
			index,
			name: 'right-bottom',
			type: 'vertex',
			positions: [positions[0] + positions[2] - HalfBorder, positions[1] + positions[3] - HalfBorder, BorderWidth, BorderWidth],
		},
		{
			index,
			name: 'left',
			type: 'border',
			positions: [positions[0] - HalfBorder, positions[1] + HalfBorder, BorderWidth, positions[3] - HalfBorder],
		},
		{
			index,
			name: 'top',
			type: 'border',
			positions: [positions[0] + HalfBorder, positions[1] - HalfBorder, positions[2] - HalfBorder, BorderWidth],
		},
		{
			index,
			name: 'right',
			type: 'border',
			positions: [positions[0] + positions[2] - HalfBorder, positions[1] + HalfBorder, BorderWidth, positions[3] - HalfBorder],
		},
		{
			index,
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

export function detectEventIsTriggerOnBoxBorderOrVertex(
	event: LayerTouchEvent,
	boxList: BoundingBox[],
	zoomScale: number,
	currentPosition: Point,
	origin: Point
) {
	let touchPoint = getTouchPoint(event, zoomScale, origin, 'move')
	let borderList = boxList
		.map((box, index) => {
			return getBoxFourBorderRect(box, currentPosition, index)
		})
		.flat()
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

export function moveDetectBoxBorderSetCursor(
	ele: HTMLElement,
	event: LayerTouchEvent,
	boxList: BoundingBox[],
	zoomScale: number,
	currentPosition: Point,
	origin: Point,
	isScaleing: boolean
) {
	//判断鼠标是否在裁剪框的4个边加四个顶点，在的话更改container鼠标手势  nwse-resize nesw-resize
	if (!isScaleing) {
		let detectResult = detectEventIsTriggerOnBoxBorderOrVertex(event, boxList, zoomScale, currentPosition, origin)
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

export function getResizeBoundingBoxInfo(box: BoundingBox, offsetInfo: Offset, borderOrVertexInfo?: ResizeItem) {
	if (!borderOrVertexInfo) return box
	let newBox: BoundingBox = cloneDeep(box)
	let name = borderOrVertexInfo.name
	let { offsetX, offsetY } = offsetInfo
	if (name.includes('left')) {
		newBox.startX += offsetX
	}
	if (name.includes('top')) {
		newBox.startY += offsetY
	}
	if (name.includes('right')) {
		newBox.endX += offsetX
	}
	if (name.includes('bottom')) {
		newBox.endY += offsetY
	}
	return newBox
}

export function moveResizeBox(
	ctx: CanvasRenderingContext2D,
	startPoint: Point,
	endPoint: Point,
	box: BoundingBox,
	scale: number,
	zoomScale: number,
	currentPosition: Point,
	tagArr: BoundingBox[],
	resizeCropHovering: ResizeItem,
	cropList: BoundingBox[],
	config: Config
) {
	if (startPoint && startPoint.x !== undefined && endPoint && endPoint.x !== undefined) {
		let offsetResult = getTwoPointsOffsetInfo(startPoint, endPoint, zoomScale)
		if (offsetResult.isStartMove) {
			let borderOrVertex = resizeCropHovering
			let { offsetX, offsetY } = offsetResult.offsetInfo
			let newBoxInfo = getResizeBoundingBoxInfo(
				box,
				{
					offsetX: offsetX / scale,
					offsetY: offsetY / scale,
				},
				borderOrVertex
			)

			let position = transfromBoxToRect(newBoxInfo, scale, currentPosition)
			drawCropList(ctx, cropList, currentPosition, config)
			if (config.mode == 'crop') {
				drawCropRect(ctx, ...position, config, true)
			}
			drawTagList(ctx, tagArr, currentPosition, config)
			if (config.mode == 'tag') {
				drawTagRect(ctx, ...position, config, (box.__index || 0) + 1, undefined, box.isShow, box.showOutLine, box.labelText, box.tagConfig, undefined)
			}
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

export function transfromRect2Box(rect: Rect, currentPosition: Point, scale = 1) {
	let zoom = scale
	let rectInfo = {
		startX: (rect[0] - currentPosition.x) / zoom,
		startY: (rect[1] - currentPosition.y) / zoom,
		endX: (rect[0] + rect[2] - currentPosition.x) / zoom,
		endY: (rect[1] + rect[3] - currentPosition.y) / zoom,
	}
	return fixBoxInfo(rectInfo).info
}
export function fixTouchPoint2ImagePoint(point: Point, currentPosition: Point, scale = 1) {
	let zoom = scale
	let result: Point = {
		x: (point.x - currentPosition.x) / zoom,
		y: (point.y - currentPosition.y) / zoom,
	}
	return result
}

export function initBoundingArrScale(tagArr: BoundingBox[], scale: number, precision: number) {
	return tagArr.map((tag, tagIndex) => {
		tag.__scale = scale
		tag.__index = tagIndex
		return fixBoxInfo(transformBoxPrecision(tag, precision)).info
	})
}

export function initDotArrScale(dotArr: Dot[], scale: number, precision: number) {
	return dotArr.map((dot, dotIndex) => {
		dot.__scale = scale
		dot.__index = dotIndex
		return transformDotPrecision(dot, precision)
	})
}

export function initDaubStackList(list: DaubPoint[][], currentPosition, scale): DaubPoint[][] {
	return list.map(arr => {
		return arr.map(point => {
			return {
				...point,
				_x: point.x * scale + currentPosition.x,
				_y: point.y * scale + currentPosition.y,
			}
		})
	})
}

export function getBigBoxByBoxList(list: BoundingBox[]): BoundingBox | undefined {
	if (list.length === 0) return undefined
	let startXarr: number[] = []
	let endXarr: number[] = []
	let startYarr: number[] = []
	let endYarr: number[] = []
	list.forEach(box => {
		startXarr.push(box.startX)
		endXarr.push(box.endX)
		startYarr.push(box.startY)
		endYarr.push(box.endY)
	})
	return {
		startX: Math.min(...startXarr),
		endX: Math.max(...endXarr),
		startY: Math.min(...startYarr),
		endY: Math.max(...endYarr),
	}
}

export function getBoxIsIntersectWithBoxList(box: BoundingBox, list: BoundingBox[]): boolean {
	for (const item of list) {
		let intersect = getTwoBoxIntersectPart(box, item)
		if (intersect) return true
	}
	return false
}

export function boxIsAllInOtherBox(box: BoundingBox, otherBox: BoundingBox) {
	let intersectPart = getTwoBoxIntersectPart(box, otherBox)
	if (
		intersectPart &&
		intersectPart.startX === box.startX &&
		intersectPart.endX === box.endX &&
		intersectPart.startY === box.startY &&
		intersectPart.endY === box.endY
	) {
		return true
	} else {
		return false
	}
}
export function boxAllInBoxList(box: BoundingBox, list: BoundingBox[]) {
	let indexList: number[] = []
	let boxList: BoundingBox[] = []
	list.forEach((item, index) => {
		if (boxIsAllInOtherBox(box, item)) {
			boxList.push(item)
			indexList.push(index)
		}
	})
	return {
		boxList,
		indexList,
	}
}
type TagBoxRelativeTo = 'img' | 'crop'
export function transformTagListBoxRelativeTo(type: TagBoxRelativeTo, cropInfo: BoundingBox, tagList: BoundingBox[]): BoundingBox[] {
	return tagList.map(item => {
		return transformTagBoxRelativeTo(type, cropInfo, item)
	})
}
export function transformTagBoxRelativeTo(type: TagBoxRelativeTo, cropInfo: BoundingBox, tag: BoundingBox): BoundingBox {
	let item = cloneDeep(tag)
	if (type === 'img') {
		item.startX = item.startX + cropInfo.startX
		item.startY = item.startY + cropInfo.startY
		item.endX = item.endX + cropInfo.startX
		item.endY = item.endY + cropInfo.startY
	}
	if (type === 'crop') {
		item.startX = item.startX - cropInfo.startX
		item.startY = item.startY - cropInfo.startY
		item.endX = item.endX - cropInfo.startX
		item.endY = item.endY - cropInfo.startY
	}
	return item
}

export function transformPrecision(list: BoundingBox[], precision: number) {
	return list.map(box => transformBoxPrecision(box, precision))
}

export function transformBoxPrecision(box: BoundingBox, precision: number) {
	box.startX = numFixPrecision(box.startX, precision)
	box.endX = numFixPrecision(box.endX, precision)
	box.startY = numFixPrecision(box.startY, precision)
	box.endY = numFixPrecision(box.endY, precision)
	return box
}
export function transformDotPrecision(dot: Dot, precision: number) {
	dot.x = numFixPrecision(dot.x, precision)
	dot.y = numFixPrecision(dot.y, precision)
	dot.raduis = numFixPrecision(dot.raduis || 0, precision)
	return dot
}

export function numFixPrecision(num: number, precision: number) {
	return parseFloat(num.toFixed(precision))
}

export function pointInDot(point: Point, dot: Dot, config: Config): boolean {
	let finalDotConfig: Required<DotConfig> = cloneDeep(config.dotConfig)
	if (dot.dotConfig) {
		Object.assign(finalDotConfig, dot.dotConfig)
	}
	const distanceSquared = (point.x - dot.x) ** 2 + (point.y - dot.y) ** 2
	const radiusSquared = finalDotConfig.radius ** 2
	return distanceSquared <= radiusSquared
}
