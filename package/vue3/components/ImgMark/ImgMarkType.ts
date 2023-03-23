export interface Props {
	cropConfig?: CropConfig
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
	mode?: Mode
	mobileOperation?: MobileOperation
	src: string
	precision?: number
	splitClickAndDoubleClickEvent?: boolean
	disableDefaultShortcuts?: ShortCutItem[]
	customDrawTopCtx?: CustomDrawTopCtx
}

export type Rect = [left: number, top: number, width: number, height: number]
export type Mode = 'tag' | 'crop'
export type TouchType = 'move' | 'click' | 'over'
export type VertexPosition = 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom'
export type LayerTouchEvent = (MouseEvent | TouchEvent) & {
	layerX: number
	layerY: number
}
export type TypePoint = Point & {
	type: TouchType
}
export type WH = {
	width: number
	height: number
}
export type Point = {
	x: number
	y: number
}

export type Event = {
	onClick?: (e: unknown, item: BoundingBox) => void
	onDoubleClick?: (e: unknown, item: BoundingBox) => void
}

export type ResizeType = {
	vertex: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom'
	border: 'left' | 'top' | 'right' | 'bottom'
}
export type ResizeItem = {
	index: number
	type: keyof ResizeType
	name: ResizeType[keyof ResizeType]
	positions: Rect
}

export type BoundingBox = {
	startX: number
	startY: number
	endX: number
	endY: number
	isShow?: boolean
	showOutLine?: boolean
	labelText?: string
	tagConfig?: TagConfig
	__scale?: number
	__index?: number
} & Event

export type BoundingBox2Rect = (boundingBoxList: BoundingBox[]) => Rect[]
export type CustomDrawTopCtx = (ctx: CanvasRenderingContext2D, boundingBox2Rect: BoundingBox2Rect) => void
export type CustomDraw = (
	ctx: CanvasRenderingContext2D,
	info: {
		target: BoundingBox | undefined
		positions: Rect
	}
) => void

export type CropConfig = {
	lineDash?: number[]
	strokeStyle?: string
	lineWidth?: number
}

export type ShortCutItem = 'ctrl+b' | 'space'

export type Config = {
	cropConfig: Required<CropConfig>
	layerConfig: Required<LayerConfig>
	tagConfig: Required<TagConfig>
} & Pick<Props, 'drawingText' | 'mode'>

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
	customDraw?: CustomDraw
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
export type CropListChangeEmitType = {
	type: CropListChangeType
	list: BoundingBox[]
}

export type MouseOverInfoEmitType = {
	canvas: Point | null
	img: Point | null
}
export type OnLoadImageEmitType = {
	status: 'loading' | 'success' | 'error'
	msg?: string
}

export type TagListChangeType = 'add' | 'delete' | 'statusChange' | 'resize'
export type CropListChangeType = 'add' | 'delete' | 'resize'
