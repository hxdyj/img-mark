import { BoundingBox, Config, LayerTouchEvent, Mode, Point, Rect, ResizeItem, TagConfig, TypePoint, VertexPosition, WH, TouchType, DaubPoint, Dot } from './ImgMarkType';
export declare const DPI: number;
export declare const debug = false;
export declare const DEFAULT_CONFIG: Config;
export declare const defaultWH: WH;
export declare const defaultPoint: Partial<Point>;
export declare function clearCanvas(ctx: CanvasRenderingContext2D): void;
export declare function loadImage(src: string, crossOrigin?: boolean): Promise<HTMLImageElement>;
export declare function drawImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, left: number, top: number, width: number, height: number): void;
export declare function drawLayerBg(ctx: CanvasRenderingContext2D, config: Config): void;
export declare function drawLayerImageData(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number): void;
export declare function drawLayerBorder(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number, config: Config, cropInfo?: BoundingBox): void;
export declare function getElementWH(ele: HTMLElement): {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
    x: number;
    y: number;
} | undefined;
export declare function initCanvasWH(ctx: CanvasRenderingContext2D, info: WH): void;
declare type ScaleReturn = {
    scale: number;
    fit: 'height' | 'width';
};
export declare function initScale(canvasWH: WH, imgWH: HTMLImageElement): ScaleReturn;
declare type ObjectToString = 'Number' | 'String' | 'Symbol' | 'Object' | 'Function' | 'Null';
export declare function getVariableType(value: unknown): ObjectToString;
export declare function amendDpi<T>(val: T, propers?: Array<keyof T>, reverse?: boolean): T | (T & WH);
export declare function amendMobileTouchEventDpi(touchEvent: TouchEvent): ({
    clientX: number;
    clientY: number;
} | ({
    clientX: number;
    clientY: number;
} & WH))[];
export declare function drawCropRect(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number, config: Config, unClearCanvas?: boolean): void;
export declare function drawDuabPointList(ctx: CanvasRenderingContext2D, pointList: DaubPoint[], currentPosition: Point, config: Config): void;
export declare function drawCropList(ctx: CanvasRenderingContext2D, cropList: BoundingBox[], currentPosition: Point, config: Config, offset?: Offset, unClearCanvas?: boolean): void;
export declare function pointIsInBoxList(point: Point, boxList: BoundingBox[], scale?: number, currentPosition?: Point): {
    boxList: BoundingBox[];
    indexList: number[];
};
export declare function transfromBoxSize2Visual(box: BoundingBox, scale: number, currentPosition: Point): BoundingBox;
export declare function pointIsInBox(point: Point, box: BoundingBox): boolean;
export declare function pointIsInRect(point: Point, rect: Rect): boolean;
export declare function transfromTwoPoints2Rect(pointStart: Point, pointEnd: Point): Rect;
declare type FixBoxInfoReturn = {
    info: BoundingBox;
    position: Rect;
};
export declare function fixBoxInfo(boundingBox: BoundingBox): FixBoxInfoReturn;
export declare function getTwoBoxIntersectPart(box1: BoundingBox, box2: BoundingBox): BoundingBox | undefined;
export declare function transfromDotToArc(dot: Dot, scale: number | undefined, currentPosition: Point | undefined, raduis: number, offset?: Offset): [number, number, number, number, number];
export declare function transfromBoxToRect(position: BoundingBox, scale?: number, currentPosition?: Point): Rect;
export declare function isBoxValidity(box: BoundingBox): boolean;
export declare function drawTagRect(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number, config: Config, index: number, touchPoint: TypePoint | undefined, isShow: boolean | undefined, showOutLine: boolean | undefined, tagLabel: string | undefined, tagConfig: TagConfig | undefined, tagInfo: BoundingBox | undefined): {
    isShow: boolean;
    isCrash: boolean;
} | undefined;
declare type Offset = {
    offsetX: number;
    offsetY: number;
};
export declare function drawTagList(ctx: CanvasRenderingContext2D, list: BoundingBox[], currentPosition: Point, config: Config, offsetInfo?: Offset, touchPoint?: TypePoint): {
    isReDraw: boolean;
    redrawList: BoundingBox[];
};
export declare function fixMoveRectPosition(position: Rect, zoomScale: number, origin: Point): Rect;
export declare function moveDrawCropRect(ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point, zoomScale: any, origin: Point, cropList: BoundingBox[], currentPosition: Point, config: Config): Rect | undefined;
export declare function drawDotList(ctx: CanvasRenderingContext2D, dotList: Dot[], currentPosition: Point, config: Config, offset?: Offset, unClearCanvas?: boolean): void;
export declare function getVertexPositionByTwoPoints(startPoint: Point, endPoint: Point): VertexPosition;
export declare function getPointByBoxAndVertexPosition(box: BoundingBox, vertex: VertexPosition): Point;
export declare function moveDrawTagRect(ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point, zoomScale: number, origin: Point, tagArr: BoundingBox[], currentPosition: Point, config: Config): Rect | undefined;
export declare function getTwoPointsOffsetInfo(startPoint: Point, endPoint: Point, zoomScale: number): {
    isStartMove: boolean;
    offsetInfo: Offset;
};
export declare function moveCanvas(ctx: CanvasRenderingContext2D, ctx2: CanvasRenderingContext2D, img: HTMLImageElement, imgWH: WH, scale: number, currentPosition: Point, startPoint: Point, endPoint: Point, cropList: BoundingBox[], zoomScale: number, tagArr: BoundingBox[], dotArr: Dot[], config: Config): Offset | undefined;
export declare function fixPoint(point: Point, zoomScale: any, origin: Point): Point;
export declare function fixLength(len: number, zoomScale: any): number;
export declare function getTouchPoint(event: LayerTouchEvent, zoomScale: any, origin: Point, type: TouchType): TypePoint;
export declare function moveDrawUnshowTagDashRect(ctx: CanvasRenderingContext2D, mode: Mode, tagArr: BoundingBox[], zoomScale: number, currentPosition: Point, origin: Point, e: LayerTouchEvent, cropList: BoundingBox[], isScaleing: boolean, hasHoverRectInTagItem: boolean, config: Config): boolean;
export declare function getBoxFourBorderRect(box: BoundingBox, currentPosition: Point, index?: number, borderWidth?: number): ResizeItem[];
export declare function pointIsInRectList(point: Point, list: Rect[]): {
    hasIn: boolean;
    coverList: Rect[];
    coverIndexList: number[];
};
export declare function detectEventIsTriggerOnBoxBorderOrVertex(event: LayerTouchEvent, boxList: BoundingBox[], zoomScale: number, currentPosition: Point, origin: Point): {
    hasIn: boolean;
    list: ResizeItem[];
};
export declare function findOneBorderOrVertex(list: ResizeItem[]): ResizeItem;
export declare function moveDetectBoxBorderSetCursor(ele: HTMLElement, event: LayerTouchEvent, boxList: BoundingBox[], zoomScale: number, currentPosition: Point, origin: Point, isScaleing: boolean): void;
export declare function getResizeBoundingBoxInfo(box: BoundingBox, offsetInfo: Offset, borderOrVertexInfo?: ResizeItem): BoundingBox;
export declare function moveResizeBox(ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point, box: BoundingBox, scale: number, zoomScale: number, currentPosition: Point, tagArr: BoundingBox[], resizeCropHovering: ResizeItem, cropList: BoundingBox[], config: Config): Rect | undefined;
export declare function getHypotenuseValue(width: number, height: number): number;
export declare function getDotDistence(start: number, end: number): number;
export declare function getTwoFingerTouchListDistence(touchList: Array<{
    clientX: number;
    clientY: number;
}>): {
    width: number;
    height: number;
};
export declare function transfromRect2Box(rect: Rect, currentPosition: Point, scale?: number): BoundingBox;
export declare function fixTouchPoint2ImagePoint(point: Point, currentPosition: Point, scale?: number): Point;
export declare function initBoundingArrScale(tagArr: BoundingBox[], scale: number, precision: number): BoundingBox[];
export declare function initDotArrScale(dotArr: Dot[], scale: number, precision: number): Dot[];
export declare function initDaubStackList(list: DaubPoint[][], currentPosition: any, scale: any): DaubPoint[][];
export declare function getBigBoxByBoxList(list: BoundingBox[]): BoundingBox | undefined;
export declare function getBoxIsIntersectWithBoxList(box: BoundingBox, list: BoundingBox[]): boolean;
export declare function boxIsAllInOtherBox(box: BoundingBox, otherBox: BoundingBox): boolean;
export declare function boxAllInBoxList(box: BoundingBox, list: BoundingBox[]): {
    boxList: BoundingBox[];
    indexList: number[];
};
declare type TagBoxRelativeTo = 'img' | 'crop';
export declare function transformTagListBoxRelativeTo(type: TagBoxRelativeTo, cropInfo: BoundingBox, tagList: BoundingBox[]): BoundingBox[];
export declare function transformTagBoxRelativeTo(type: TagBoxRelativeTo, cropInfo: BoundingBox, tag: BoundingBox): BoundingBox;
export declare function transformPrecision(list: BoundingBox[], precision: number): BoundingBox[];
export declare function transformBoxPrecision(box: BoundingBox, precision: number): BoundingBox;
export declare function transformDotPrecision(dot: Dot, precision: number): Dot;
export declare function numFixPrecision(num: number, precision: number): number;
export declare function pointInDot(point: Point, dot: Dot, config: Config): boolean;
export {};
