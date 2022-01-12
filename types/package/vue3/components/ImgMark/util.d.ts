export declare const debug = true;
export declare type WH = {
    width: number;
    height: number;
};
export declare type Point = {
    x: number;
    y: number;
};
export declare const defaultWH: WH;
export declare const defaultPoint: Point;
export declare function clearCanvas(ctx: CanvasRenderingContext2D): void;
export declare function loadImage(src: string): Promise<HTMLImageElement>;
export declare function drawImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, left: number, top: number, width: number, height: number): void;
export declare function drawLayerBg(ctx: CanvasRenderingContext2D): void;
export declare function drawLayerImageData(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number): void;
export declare function drawLayerBorder(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number): void;
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
export declare function getVariableType(value: any): ObjectToString;
export declare function amendDpi<T>(val: T, propers?: Array<keyof T>): T | (T & WH);
export declare function amendMobileTouchEventDpi(touchEvent: TouchEvent): ({
    clientX: number;
    clientY: number;
} | ({
    clientX: number;
    clientY: number;
} & WH))[];
export declare function drawCropRect(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number): void;
export declare type Rect = [left: number, top: number, width: number, height: number];
export declare function pointIsInRect(point: Point, rect: Rect): boolean;
export declare function transfromTwoPointsToLtwh(pointStart: Point, pointEnd: Point): Rect;
export declare type BoundingBox = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    scale?: number;
    isShow?: boolean;
    showOutLine?: boolean;
};
declare type FixRectInfoReturn = {
    info: BoundingBox;
    position: Rect;
};
export declare function fixRectInfo(boundingBox: BoundingBox): FixRectInfoReturn;
export declare function getTwoRectIntersectPart(rect1: BoundingBox, rect2: BoundingBox): BoundingBox | undefined;
export declare function transfromBoundingBoxToLtwh(position: BoundingBox, scale?: number, zoomScale?: number, currentPosition?: Point): Rect;
export declare function isRectValidity(rect: BoundingBox): boolean;
declare type TouchType = 'move' | 'click';
declare type TypePoint = Point & {
    type: TouchType;
};
export declare function drawTagRect(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number, index?: number, touchPoint?: TypePoint, isShow?: boolean, showOutLine?: boolean): {
    isShow: boolean;
    isCrash: boolean;
} | undefined;
declare type Offset = {
    offsetX: number;
    offsetY: number;
};
export declare function drawTagList(ctx: CanvasRenderingContext2D, list: BoundingBox[], zoomScale: number, currentPosition: Point, offsetInfo?: Offset, origin?: Point, touchPoint?: TypePoint): {
    isReDraw: boolean;
    redrawList: BoundingBox[];
};
export declare function fixMoveRectPosition(position: Rect, zoomScale: number, origin: Point): Rect;
export declare function moveDrawCropRect(ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point, zoomScale: number | undefined, origin: Point): Rect | undefined;
export declare function moveDrawTagRect(ctx: any, startPoint: any, endPoint: any, zoomScale: number | undefined, origin: any, tagArr: any, currentPosition: any): Rect | undefined;
export declare function twoPointsGetOffsetInfo(startPoint: Point, endPoint: Point, zoomScale: number): {
    isStartMove: boolean;
    offsetInfo: Offset;
};
export declare function moveCanvas(ctx: CanvasRenderingContext2D, ctx2: CanvasRenderingContext2D, img: HTMLImageElement, imgWH: WH, scale: number, currentPosition: Point, startPoint: Point, endPoint: Point, cropInfo: BoundingBox, cropScale: number, zoomScale: number, tagArr: BoundingBox[]): Offset | undefined;
export declare type LayerTouchEvent = (MouseEvent | TouchEvent) & {
    layerX: number;
    layerY: number;
};
export declare function getTouchPoint(event: LayerTouchEvent, zoomScale: any, origin: any, type: TouchType): TypePoint;
export declare type Mode = 'tag' | 'crop';
export declare function moveDrawUnshowTagDashRect(ctx: CanvasRenderingContext2D, mode: Mode, tagArr: BoundingBox[], zoomScale: number, currentPosition: Point, origin: Point, e: LayerTouchEvent, cropInfo: BoundingBox, cropScale: number, isWheeling: boolean, hasHoverRectInCanvas: boolean): void;
declare type ResizeType = {
    vertex: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom';
    border: 'left' | 'top' | 'right' | 'bottom';
};
export declare type ResizeItem = {
    type: keyof ResizeType;
    name: ResizeType[keyof ResizeType];
    positions: Rect;
};
export declare function getCropFourBorderRect(cropInfo: BoundingBox, cropScale: number, zoomScale: number, currentPosition: Point): ResizeItem[];
export declare function pointIsInRectList(point: Point, list: Rect[]): {
    hasIn: boolean;
    coverList: Rect[];
    coverIndexList: number[];
};
export declare function detectEventIsTriggerOnCropBorderOrVertex(event: LayerTouchEvent, cropInfo: BoundingBox, cropScale: number, zoomScale: number, currentPosition: Point, origin: Point): {
    hasIn: boolean;
    list: ResizeItem[];
};
export declare function findOneBorderOrVertex(list: ResizeItem[]): ResizeItem;
export declare function moveDetectCropBorderSetCursor(ele: HTMLElement, event: LayerTouchEvent, mode: Mode, cropInfo: BoundingBox, cropScale: number, zoomScale: number, currentPosition: Point, origin: Point, isWheeling: boolean): void;
export declare function getResizeCropInfo(cropInfo: BoundingBox, offsetInfo: Offset, borderOrVertexInfo?: ResizeItem): BoundingBox;
export declare function moveResizeCrop(ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point, cropInfo: BoundingBox, cropScale: number, zoomScale: number, currentPosition: Point, tagArr: BoundingBox[], mouseDownOnCropBorderOrVertex: ResizeItem): Rect | undefined;
export declare function getHypotenuseValue(width: number, height: number): number;
export declare function getDotDistence(start: number, end: number): number;
export declare function getTwoFingerTouchListDistence(touchList: Array<{
    clientX: number;
    clientY: number;
}>): {
    width: number;
    height: number;
};
export declare function getRectInfoByPosition(position: Rect, zoomScale: number, currentPosition: Point, scale?: number): BoundingBox;
export declare function initTagArrScale(tagArr: BoundingBox[], scale: number): BoundingBox[];
export {};
