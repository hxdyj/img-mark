import { BoundingBox, ResizeItem, Mode, WH, Point, Rect, LayerTouchEvent, TypePoint, VertexPosition } from './util';
export declare type CropConfig = {
    lineDash?: number[];
    strokeStyle?: string;
    lineWidth?: number;
};
export declare type LayerConfig = {
    fillStyle?: string;
};
export declare type TagConfig = {
    fillStyle?: string;
    textFillStyle?: string;
    hoverStrokeStyle?: string;
    hoverLineWidth?: number;
    hoverLineDash?: number[];
    highlightStrokeStyle?: string;
    highlightLineWidth?: number;
    highlightLineDash?: number[];
};
export declare type Config = {
    cropConfig: Required<CropConfig>;
    layerConfig: Required<LayerConfig>;
    tagConfig: Required<TagConfig>;
};
export declare type ResizeEmitType = {
    index: number;
    box: BoundingBox;
};
export declare type TagListChangeType = 'add' | 'delete' | 'statusChange';
declare type RectDom = Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left' | 'width' | 'height' | 'x' | 'y'>;
declare type TagItemTmp = BoundingBox & {
    scale?: number;
    __isValidity?: boolean;
    __newAdd?: boolean;
    __vertexPosition?: VertexPosition;
    __groupIndex?: number;
};
declare const _sfc_main: import("vue").DefineComponent<{
    cropConfig: {
        type: ObjectConstructor;
        required: false;
        default: () => Required<CropConfig>;
    };
    layerConfig: {
        type: ObjectConstructor;
        required: false;
        default: () => Required<LayerConfig>;
    };
    tagConfig: {
        type: ObjectConstructor;
        required: false;
        default: () => Required<TagConfig>;
    };
    isShowTip: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableCropCross: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    handleResizeCropCross: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    enableCropResize: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableDrawCropOutOfImg: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableDrawTagOutOfCrop: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableDrawTagOutOfImg: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    cropList: {
        type: ArrayConstructor;
        required: false;
        default: () => any[];
    };
    tagList: {
        type: ArrayConstructor;
        required: false;
        default: () => any[];
    };
    mode: {
        type: null;
        required: false;
        default: string;
    };
    src: {
        type: StringConstructor;
        required: true;
    };
    precision: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
}, {
    spaceKeyDown: boolean;
    mouseDownTime: undefined;
    mouseUpTime: undefined;
    mouseQuickDoubleTapTime: {
        last: {
            down: number | undefined;
            up: number | undefined;
        };
        prev: {
            down: number | undefined;
            up: number | undefined;
        };
    };
    zoomIntensity: number;
    hasHoverRectInTagItem: boolean;
    initVar: () => void;
    props: {
        cropConfig: CropConfig;
        layerConfig: LayerConfig;
        tagConfig: TagConfig;
        isShowTip: boolean;
        enableCropCross: boolean;
        handleResizeCropCross: 'delete' | 'reset';
        enableCropResize: boolean;
        enableDrawCropOutOfImg: boolean;
        enableDrawTagOutOfCrop: boolean;
        enableDrawTagOutOfImg: boolean;
        cropList: BoundingBox[];
        tagList: BoundingBox[];
        mode: Mode;
        src: string;
        precision: number;
    };
    emits: {
        (e: 'update:cropList', list: BoundingBox[]): void;
        (e: 'cropListChange', list: BoundingBox[]): void;
        (e: 'update:tagList', list: BoundingBox[]): void;
        (e: 'tagListChange', data: {
            type: TagListChangeType;
            list: BoundingBox[];
        }): void;
        (e: 'update:mode', mode: Mode): void;
        (e: 'resizeStart', data: ResizeEmitType): void;
        (e: 'resizeEnd', data: ResizeEmitType): void;
        (e: 'delCrop', list: BoundingBox[]): void;
    };
    inited: boolean;
    ctx: null;
    ctx2: null;
    img: HTMLImageElement | undefined;
    canvasWH: RectDom | undefined;
    imgWH: WH;
    startMousePoint: Point;
    endMousePoint: Point;
    twoFingerCenterPoint: Point;
    hypotenuse: number;
    currentPosition: Point;
    origin: Point;
    scale: number;
    cropInfo: BoundingBox | undefined;
    tmpCurrentPosition: Point | undefined;
    cropScale: number;
    containerInfo: RectDom | undefined;
    zoomScale: number;
    tmpCropPositionInfo: Rect | undefined;
    tmpTagPositionInfo: Rect | undefined;
    tagArr: BoundingBox[];
    cropArr: BoundingBox[];
    config: any;
    initDataVar: () => void;
    containerRef: any;
    canvasRef: any;
    canvas2Ref: any;
    status: {
        isScaleing: boolean;
        isDrawRecting: boolean;
        isMoving: boolean;
        resizeCropHovering: ResizeItem | undefined;
        isMouseDown: () => boolean;
        isMouseUpDownPoints: () => boolean;
    };
    actions: {
        dragCreatRectInterrupt(): void;
        dragCreatOrResizeRect(type: 'drawCrop' | 'drawTag' | 'resizeCrop'): void;
        changeMode(): void;
        scale(zoom: number, mouse: Point): void;
        move(): void;
        hoverRect(event: LayerTouchEvent): void;
    };
    hooks: {
        onKeyUpCtrlB(): void;
        onKeyUpSpace(): void;
        onKeyDownSpace(): void;
        onMouseOverMove(event: LayerTouchEvent): void;
        onSpaceMove(): void;
        onHoldMouseLeftBtnMove(event: LayerTouchEvent): void;
        onDoubleClick(touchPoint: TypePoint): void;
        onCick(touchPoint: TypePoint): void;
        onWheel(zoom: number, mouse: Point): void;
        init(): void;
        resize(): void;
    };
    onKeyDownListener: (e: any) => void;
    onKeyUpListener: (e: any) => void;
    addListenerKeyUpDown: () => void;
    removeListenerKeyUpDown: () => void;
    initCropInfo: () => void;
    initComponent: () => Promise<boolean>;
    initResizeVar: () => void;
    renderCtx2: () => void;
    resizeRender: () => Promise<undefined>;
    onWindowResize: () => void;
    onMouseWheel: (e: MouseEvent, privateCall?: boolean | undefined) => void;
    setResizeCrop: (newCropInfo: BoundingBox) => void;
    cleartMousePoints: () => void;
    triggerCropListChange: () => void;
    triggerTagListChange: (type: TagListChangeType, changedList: BoundingBox[]) => void;
    getTagList: (tagList?: BoundingBox[] | undefined, _cropList?: BoundingBox[] | undefined, initScale?: number | undefined, imageWH?: WH | undefined) => TagItemTmp[];
    getCropList: () => BoundingBox[];
    onMouseDown: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
    onMouseUp: () => void;
    onMouseOut: () => void;
    onClick: (event: any) => void;
    onTouchStart: (event: TouchEvent) => void;
    onTouchMove: (event: TouchEvent) => Promise<void>;
    onTouchEnd: (event: any) => void;
    refreshDrawTags: () => void;
    removeTagItems: (removeList: BoundingBox[]) => void;
    removeCropItems: (removeList: BoundingBox[]) => void;
    getTagListGroupByCropIndex: (type?: 'startPoint' | 'allIn') => {
        [index: number]: BoundingBox[];
    };
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:cropList" | "cropListChange" | "update:tagList" | "tagListChange" | "update:mode" | "resizeStart" | "resizeEnd" | "delCrop")[], "update:cropList" | "cropListChange" | "update:tagList" | "tagListChange" | "update:mode" | "resizeStart" | "resizeEnd" | "delCrop", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    cropConfig?: unknown;
    layerConfig?: unknown;
    tagConfig?: unknown;
    isShowTip?: unknown;
    enableCropCross?: unknown;
    handleResizeCropCross?: unknown;
    enableCropResize?: unknown;
    enableDrawCropOutOfImg?: unknown;
    enableDrawTagOutOfCrop?: unknown;
    enableDrawTagOutOfImg?: unknown;
    cropList?: unknown;
    tagList?: unknown;
    mode?: unknown;
    src?: unknown;
    precision?: unknown;
} & {
    cropConfig: Record<string, any>;
    layerConfig: Record<string, any>;
    tagConfig: Record<string, any>;
    isShowTip: boolean;
    enableCropCross: boolean;
    handleResizeCropCross: string;
    enableCropResize: boolean;
    enableDrawCropOutOfImg: boolean;
    enableDrawTagOutOfCrop: boolean;
    enableDrawTagOutOfImg: boolean;
    cropList: unknown[];
    tagList: unknown[];
    mode: any;
    src: string;
    precision: number;
} & {}> & {
    "onUpdate:cropList"?: ((...args: any[]) => any) | undefined;
    onCropListChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:tagList"?: ((...args: any[]) => any) | undefined;
    onTagListChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:mode"?: ((...args: any[]) => any) | undefined;
    onResizeStart?: ((...args: any[]) => any) | undefined;
    onResizeEnd?: ((...args: any[]) => any) | undefined;
    onDelCrop?: ((...args: any[]) => any) | undefined;
}, {
    cropConfig: Record<string, any>;
    layerConfig: Record<string, any>;
    tagConfig: Record<string, any>;
    isShowTip: boolean;
    enableCropCross: boolean;
    handleResizeCropCross: string;
    enableCropResize: boolean;
    enableDrawCropOutOfImg: boolean;
    enableDrawTagOutOfCrop: boolean;
    enableDrawTagOutOfImg: boolean;
    cropList: unknown[];
    tagList: unknown[];
    mode: any;
    precision: number;
}>;
export default _sfc_main;
