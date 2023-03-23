export interface Props {
    cropConfig?: CropConfig;
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
    mode?: Mode;
    mobileOperation?: MobileOperation;
    src: string;
    precision?: number;
    splitClickAndDoubleClickEvent?: boolean;
    disableDefaultShortcuts?: ShortCutItem[];
    customDrawTopCtx?: CustomDrawTopCtx;
}
import { BoundingBox, CropConfig, CropListChangeEmitType, CropListChangeType, CustomDrawTopCtx, LayerConfig, LayerTouchEvent, MobileOperation, Mode, MouseOverInfoEmitType, OnLoadImageEmitType, Point, Rect, ResizeEmitType, ResizeItem, ShortCutItem, TagConfig, TagListChangeEmitRetunType, TagListChangeType, TypePoint, VertexPosition, WH } from './ImgMarkType';
declare type RectDom = Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left' | 'width' | 'height' | 'x' | 'y'>;
declare type TagItemTmp = BoundingBox & {
    scale?: number;
    __isValidity?: boolean;
    __oprateType?: 'add' | 'resize';
    __vertexPosition?: VertexPosition;
    __groupIndex?: number;
    __parentCrop?: BoundingBox;
};
declare const _sfc_main: import("vue").DefineComponent<{
    cropConfig: {
        type: null;
        required: false;
        default: () => Required<CropConfig>;
    };
    layerConfig: {
        type: null;
        required: false;
        default: () => Required<LayerConfig>;
    };
    tagConfig: {
        type: null;
        required: false;
        default: () => Required<TagConfig>;
    };
    drawingText: {
        type: StringConstructor;
        required: false;
    };
    isShowTip: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableScale: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableMove: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableDrawCrop: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableDrawTag: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    initScale: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableInteractiveTagChangeStatus: {
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
    enableInteractiveCropDelete: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableCropResize: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableTagResize: {
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
    isImgCrop: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    isCropSingle: {
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
    mobileOperation: {
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
    splitClickAndDoubleClickEvent: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    disableDefaultShortcuts: {
        type: ArrayConstructor;
        required: false;
        default: () => any[];
    };
    customDrawTopCtx: {
        type: null;
        required: false;
    };
}, {
    drawSwitch: boolean;
    mouseDownTime: undefined;
    mouseUpTime: undefined;
    clickTimeout: null;
    clickedBox: null;
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
    __zoomIntensity: number;
    zoomIntensity: number;
    hasHoverRectInTagItem: boolean;
    initVar: () => void;
    props: {
        cropConfig: CropConfig;
        layerConfig: LayerConfig;
        tagConfig: TagConfig;
        drawingText?: string | undefined;
        isShowTip: boolean;
        enableScale: boolean;
        enableMove: boolean;
        enableDrawCrop: boolean;
        enableDrawTag: boolean;
        initScale: boolean;
        enableInteractiveTagChangeStatus: boolean;
        enableCropCross: boolean;
        handleResizeCropCross: 'delete' | 'reset';
        enableInteractiveCropDelete: boolean;
        enableCropResize: boolean;
        enableTagResize: boolean;
        enableDrawCropOutOfImg: boolean;
        enableDrawTagOutOfCrop: boolean;
        enableDrawTagOutOfImg: boolean;
        isImgCrop: boolean;
        isCropSingle: boolean;
        cropList: BoundingBox[];
        tagList: BoundingBox[];
        mode: Mode;
        mobileOperation: MobileOperation;
        src: string;
        precision: number;
        splitClickAndDoubleClickEvent: boolean;
        disableDefaultShortcuts: ShortCutItem[];
        customDrawTopCtx?: CustomDrawTopCtx | undefined;
    };
    emits: {
        (e: 'update:cropList', list: BoundingBox[]): void;
        (e: 'cropListChange', data: CropListChangeEmitType): void;
        (e: 'update:tagList', list: BoundingBox[]): void;
        (e: 'tagListChange', data: TagListChangeEmitRetunType): void;
        (e: 'update:mode', mode: Mode): void;
        (e: 'update:mobileOperation', mode: MobileOperation): void;
        (e: 'resizeStart', data: ResizeEmitType): void;
        (e: 'resizeEnd', data: ResizeEmitType): void;
        (e: 'delCrop', list: BoundingBox[]): void;
        (e: 'drawCropStart'): void;
        (e: 'drawTagStart'): void;
        (e: 'mouseOverInfo', info: MouseOverInfoEmitType): void;
        (e: 'onLoadImage', data: OnLoadImageEmitType): void;
    };
    inited: boolean;
    ctx: null;
    ctx2: null;
    img: HTMLImageElement | undefined;
    canvasWH: RectDom;
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
    tmpBoxPositionInfo: Rect | undefined;
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
        resizeHovering: ResizeItem | undefined;
        isMouseDown: () => boolean;
        isMouseUpDownPoints: () => boolean;
    };
    actions: {
        dragCreatRectInterrupt(): void;
        dragCreatOrResizeRect(type: 'drawCrop' | 'drawTag' | 'resize'): void;
        changeMode(): void;
        scale(zoom: number, mouse: Point): void;
        move(): void;
        hoverRect(event: LayerTouchEvent): void;
    };
    events: {
        onMouseOverMove(event: LayerTouchEvent): void;
        onHoldMouseLeftBtnMove(event: LayerTouchEvent): void;
        onDoubleClick(touchPoint: TypePoint): void;
        onCick(touchPoint: TypePoint): void;
        onWheel(zoom: number, mouse: Point, privateCall?: boolean | undefined): void;
        onDrawSwitchOnStartDraw(): void;
    };
    hooks: {
        shiftMode(): void;
        shiftDrawSwitch(onOrOff: 'on' | 'off'): void;
        init(): void;
        resize(): void;
    };
    onKeyDownListener: (e: KeyboardEvent) => void;
    onKeyUpListener: (e: any) => void;
    addListenerKeyUpDown: () => void;
    removeListenerKeyUpDown: () => void;
    initCropInfo: () => void;
    getContainerInfo: () => void;
    initComponent: () => Promise<true | void>;
    initResizeVar: () => void;
    initAndTransfromBoxToRect: (boundingBoxList: BoundingBox[]) => Rect[];
    renderCtx2: () => void;
    resizeRender: () => Promise<undefined>;
    initMobileOperation: () => void;
    onWindowResize: () => void;
    onMouseWheel: (e: MouseEvent, privateCall?: boolean | undefined) => void;
    setBoxResize: (newBoxInfo: BoundingBox) => void;
    cleartMousePoints: () => void;
    triggerCropListChange: (type: CropListChangeType, changedList: BoundingBox[]) => void;
    triggerTagListChange: (type: TagListChangeType, changedList: BoundingBox[]) => void;
    getTagList: (tagList?: BoundingBox[] | undefined) => TagItemTmp[];
    getCropList: (cropList?: BoundingBox[] | undefined) => BoundingBox[];
    onMouseDown: (e: MouseEvent) => void;
    triggerMouseOverInfo: any;
    onMouseMove: (e: MouseEvent) => void;
    onMouseUp: () => void;
    onMouseOut: () => void;
    clearClickTimeout: () => void;
    onClick: (e: any) => void;
    onTouchStart: (event: TouchEvent) => void;
    onTouchMove: (event: TouchEvent) => void;
    onTouchEnd: (event: any) => void;
    refreshDrawTags: () => void;
    removeTagItems: (removeList: BoundingBox[]) => void;
    removeCropItems: (removeList: BoundingBox[]) => void;
    getTagListGroupByCropIndex: (type?: 'startPoint' | 'allIn') => {
        [index: number]: BoundingBox[];
    };
    render: () => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:cropList" | "cropListChange" | "update:tagList" | "tagListChange" | "update:mode" | "update:mobileOperation" | "resizeStart" | "resizeEnd" | "delCrop" | "drawCropStart" | "drawTagStart" | "mouseOverInfo" | "onLoadImage")[], "update:cropList" | "cropListChange" | "update:tagList" | "tagListChange" | "update:mode" | "update:mobileOperation" | "resizeStart" | "resizeEnd" | "delCrop" | "drawCropStart" | "drawTagStart" | "mouseOverInfo" | "onLoadImage", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    cropConfig: {
        type: null;
        required: false;
        default: () => Required<CropConfig>;
    };
    layerConfig: {
        type: null;
        required: false;
        default: () => Required<LayerConfig>;
    };
    tagConfig: {
        type: null;
        required: false;
        default: () => Required<TagConfig>;
    };
    drawingText: {
        type: StringConstructor;
        required: false;
    };
    isShowTip: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableScale: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableMove: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableDrawCrop: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableDrawTag: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    initScale: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableInteractiveTagChangeStatus: {
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
    enableInteractiveCropDelete: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableCropResize: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    enableTagResize: {
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
    isImgCrop: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    isCropSingle: {
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
    mobileOperation: {
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
    splitClickAndDoubleClickEvent: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    disableDefaultShortcuts: {
        type: ArrayConstructor;
        required: false;
        default: () => any[];
    };
    customDrawTopCtx: {
        type: null;
        required: false;
    };
}>> & {
    "onUpdate:cropList"?: ((...args: any[]) => any) | undefined;
    onCropListChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:tagList"?: ((...args: any[]) => any) | undefined;
    onTagListChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:mode"?: ((...args: any[]) => any) | undefined;
    "onUpdate:mobileOperation"?: ((...args: any[]) => any) | undefined;
    onResizeStart?: ((...args: any[]) => any) | undefined;
    onResizeEnd?: ((...args: any[]) => any) | undefined;
    onDelCrop?: ((...args: any[]) => any) | undefined;
    onDrawCropStart?: ((...args: any[]) => any) | undefined;
    onDrawTagStart?: ((...args: any[]) => any) | undefined;
    onMouseOverInfo?: ((...args: any[]) => any) | undefined;
    onOnLoadImage?: ((...args: any[]) => any) | undefined;
}, {
    cropConfig: any;
    layerConfig: any;
    tagConfig: any;
    isShowTip: boolean;
    enableScale: boolean;
    enableMove: boolean;
    enableDrawCrop: boolean;
    enableDrawTag: boolean;
    initScale: boolean;
    enableInteractiveTagChangeStatus: boolean;
    enableCropCross: boolean;
    handleResizeCropCross: string;
    enableInteractiveCropDelete: boolean;
    enableCropResize: boolean;
    enableTagResize: boolean;
    enableDrawCropOutOfImg: boolean;
    enableDrawTagOutOfCrop: boolean;
    enableDrawTagOutOfImg: boolean;
    isImgCrop: boolean;
    isCropSingle: boolean;
    cropList: unknown[];
    tagList: unknown[];
    mode: any;
    mobileOperation: any;
    precision: number;
    splitClickAndDoubleClickEvent: boolean;
    disableDefaultShortcuts: unknown[];
}>;
export default _sfc_main;
