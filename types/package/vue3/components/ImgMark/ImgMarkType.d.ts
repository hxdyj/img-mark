export interface Props {
    cropConfig?: CropConfig;
    duabConfig?: DaubConfig;
    layerConfig?: LayerConfig;
    tagConfig?: TagConfig;
    drawingText?: string;
    isShowTip?: boolean;
    enableScale?: boolean;
    enableMove?: boolean;
    enableDrawCrop?: boolean;
    enableDrawTag?: boolean;
    initScale?: boolean;
    enableInteractiveTagChangeStatus?: boolean;
    enableCropCross?: boolean;
    handleResizeCropCross?: 'delete' | 'reset';
    enableInteractiveCropDelete?: boolean;
    enableCropResize?: boolean;
    enableTagResize?: boolean;
    enableDrawCropOutOfImg?: boolean;
    enableDrawTagOutOfCrop?: boolean;
    enableDrawTagOutOfImg?: boolean;
    isImgCrop?: boolean;
    isCropSingle?: boolean;
    cropList?: BoundingBox[];
    tagList?: BoundingBox[];
    daubStack?: Array<Array<DaubPoint>>;
    mode?: Mode;
    mobileOperation?: MobileOperation;
    src: string;
    precision?: number;
    splitClickAndDoubleClickEvent?: boolean;
    disableDefaultShortcuts?: ShortCutItem[];
    customDrawTopCtx?: CustomDrawTopCtx;
}
export declare type Rect = [left: number, top: number, width: number, height: number];
export declare type Mode = 'tag' | 'crop' | 'daub';
export declare type TouchType = 'move' | 'click' | 'over';
export declare type VertexPosition = 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom';
export declare type LayerTouchEvent = (MouseEvent | TouchEvent) & {
    layerX: number;
    layerY: number;
};
export declare type TypePoint = Point & {
    type: TouchType;
};
export declare type WH = {
    width: number;
    height: number;
};
export declare type Point = {
    x: number;
    y: number;
};
export declare type DaubPoint = Point & {
    lineWidth?: number;
    strokeStyle?: string;
    _x?: number;
    _y?: number;
};
export declare type Event = {
    onClick?: (e: unknown, item: BoundingBox) => void;
    onDoubleClick?: (e: unknown, item: BoundingBox) => void;
};
export declare type ResizeType = {
    vertex: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom';
    border: 'left' | 'top' | 'right' | 'bottom';
};
export declare type ResizeItem = {
    index: number;
    type: keyof ResizeType;
    name: ResizeType[keyof ResizeType];
    positions: Rect;
};
export declare type BoundingBox = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    isShow?: boolean;
    showOutLine?: boolean;
    labelText?: string;
    tagConfig?: TagConfig;
    __scale?: number;
    __index?: number;
} & Event;
export declare type BoundingBox2Rect = (boundingBoxList: BoundingBox[]) => Rect[];
export declare type CustomDrawTopCtx = (ctx: CanvasRenderingContext2D, boundingBox2Rect: BoundingBox2Rect) => void;
export declare type CustomDraw = (ctx: CanvasRenderingContext2D, info: {
    target: BoundingBox | undefined;
    positions: Rect;
}) => void;
export declare type CropConfig = {
    lineDash?: number[];
    strokeStyle?: string;
    lineWidth?: number;
};
export declare type DaubConfig = {
    strokeStyle?: string;
    lineWidth?: number;
};
export declare type ShortCutItem = 'ctrl+b' | 'space';
export declare type Config = {
    daubConfig: Required<DaubConfig>;
    cropConfig: Required<CropConfig>;
    layerConfig: Required<LayerConfig>;
    tagConfig: Required<TagConfig>;
} & Pick<Props, 'drawingText' | 'mode'>;
export declare type MobileOperation = 'draw' | 'move';
export declare type LayerConfig = {
    fillStyle?: string;
};
export declare type TagConfig = {
    fontSize?: number;
    showText?: boolean;
    fillStyle?: string;
    textFillStyle?: string;
    hoverStrokeStyle?: string;
    hoverLineWidth?: number;
    hoverLineDash?: number[];
    highlightStrokeStyle?: string;
    highlightLineWidth?: number;
    highlightLineDash?: number[];
    customDraw?: CustomDraw;
};
export declare type ResizeEmitType = {
    index: number;
    box: BoundingBox;
};
export declare type TagListChangeEmitRetunType = {
    type: TagListChangeType;
    list: BoundingBox[];
    parentCrop?: BoundingBox;
};
export declare type CropListChangeEmitType = {
    type: CropListChangeType;
    list: BoundingBox[];
};
export declare type MouseOverInfoEmitType = {
    canvas: Point | null;
    img: Point | null;
};
export declare type OnLoadImageEmitType = {
    status: 'loading' | 'success' | 'error';
    msg?: string;
};
export declare type TagListChangeType = 'add' | 'delete' | 'statusChange' | 'resize';
export declare type CropListChangeType = 'add' | 'delete' | 'resize';
