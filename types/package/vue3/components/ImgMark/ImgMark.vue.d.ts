import { BoundingBox, ResizeItem, Mode, WH, Point, Rect } from './util';
declare type RectDom = Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left' | 'width' | 'height' | 'x' | 'y'>;
declare const _sfc_main: import("vue").DefineComponent<{
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
    cropBounding: {
        type: null;
        required: false;
    };
    tagList: {
        type: ArrayConstructor;
        required: false;
        default: () => any[];
    };
    mode: {
        type: null;
        required: true;
        default: string;
    };
    src: {
        type: StringConstructor;
        required: true;
    };
}, {
    spaceKeyDown: boolean;
    isWheeling: boolean;
    wheelSetTimeout: NodeJS.Timeout | undefined;
    mouseDownTime: undefined;
    mouseUpTime: undefined;
    zoomIntensity: number;
    mouseDownOnCropBorderOrVertex: ResizeItem | undefined;
    hasHoverRectInCanvas: boolean;
    initVar: () => void;
    props: {
        enableDrawCropOutOfImg: boolean;
        enableDrawTagOutOfCrop: boolean;
        enableDrawTagOutOfImg: boolean;
        cropBounding?: BoundingBox | undefined;
        tagList: BoundingBox[];
        mode: Mode;
        src: string;
    };
    emits: {
        (e: 'update:tagList', list: BoundingBox[]): void;
        (e: 'tagListChange', list: BoundingBox[]): void;
        (e: 'update:mode', mode: Mode): void;
        (e: 'update:cropBounding', cropInfo: BoundingBox): void;
        (e: 'tagsStatusChange', list: BoundingBox[]): void;
        (e: 'cropChange'): void;
    };
    inited: boolean;
    isWheeled: boolean;
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
    initDataVar: () => void;
    containerRef: any;
    canvasRef: any;
    canvas2Ref: any;
    onKeyDownListener: (e: any) => void;
    onKeyUpListener: (e: any) => void;
    addListenerKeyUpDown: () => void;
    removeListenerKeyUpDown: () => void;
    initComponent: (isFirst?: boolean | undefined) => Promise<boolean>;
    init: (isFirst?: boolean | undefined) => void;
    onWindowResize: () => void;
    onMouseWheel: (e: MouseEvent, privateCall?: boolean | undefined) => Error | undefined;
    resetWheelStatus: (immediately?: boolean) => void;
    cleartMousePoints: () => void;
    triggerCropInfoChange: () => void;
    triggerTagListChange: () => void;
    getTagList: (tagList?: BoundingBox[] | undefined, _cropInfo?: BoundingBox | undefined, initScale?: number | undefined, imageWH?: WH | undefined) => (BoundingBox & {
        scale?: number | undefined;
        __isValidity?: boolean | undefined;
    })[];
    getCropBounding: (_cropInfo?: BoundingBox | undefined, _cropScale?: number | undefined, initScale?: number | undefined, imageWH?: WH | undefined) => BoundingBox;
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
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:tagList" | "tagListChange" | "update:mode" | "update:cropBounding" | "tagsStatusChange" | "cropChange")[], "update:tagList" | "tagListChange" | "update:mode" | "update:cropBounding" | "tagsStatusChange" | "cropChange", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    enableDrawCropOutOfImg?: unknown;
    enableDrawTagOutOfCrop?: unknown;
    enableDrawTagOutOfImg?: unknown;
    cropBounding?: unknown;
    tagList?: unknown;
    mode?: unknown;
    src?: unknown;
} & {
    enableDrawCropOutOfImg: boolean;
    enableDrawTagOutOfCrop: boolean;
    enableDrawTagOutOfImg: boolean;
    tagList: unknown[];
    mode: any;
    src: string;
} & {
    cropBounding?: any;
}> & {
    "onUpdate:tagList"?: ((...args: any[]) => any) | undefined;
    onTagListChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:mode"?: ((...args: any[]) => any) | undefined;
    "onUpdate:cropBounding"?: ((...args: any[]) => any) | undefined;
    onTagsStatusChange?: ((...args: any[]) => any) | undefined;
    onCropChange?: ((...args: any[]) => any) | undefined;
}, {
    enableDrawCropOutOfImg: boolean;
    enableDrawTagOutOfCrop: boolean;
    enableDrawTagOutOfImg: boolean;
    tagList: unknown[];
    mode: any;
}>;
export default _sfc_main;
