# Img-Mark

在一个图片中标记一个或者多个截图区域

在截图区域中标记一个或者多个子区域

如下图：

![](./img/preview.png)

## 使用

### 引入样式

```ts
//main.ts
import 'img-mark/dist/style.css'
```

### 示例

```vue
<template>
	<div class="page-test-img-mark">
		<div style="width: 50vw; height: 100vh; background: #ccc; box-sizing: border-box; flex-shrink: 0">
			<ImgMark
				ref="imgMarkRef"
				:src="src"
				v-model:mode="mode"
				v-model:tagList="tagList"
				v-model:cropList="cropList"
				:enableDrawCropOutOfImg="false"
				:enableDrawTagOutOfCrop="false"
				:enableDrawTagOutOfImg="false"
			></ImgMark>
		</div>
		<div class="info-panel">
			<el-input v-model="src"></el-input>
			<el-button type="primary" size="small" style="margin-top: 40px" @click="getGroupInfo()">getGroupInfo</el-button>
			<el-alert
				v-for="item in tagList"
				@close="removeTag([item])"
				@mouseenter="setHoverItem(item)"
				@mouseleave="removeHoverItem(item)"
				style="margin-top: 20px"
				:key="uid(6)"
				:title="JSON.stringify(item)"
				type="warning"
			>
			</el-alert>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ImgMark, Mode, BoundingBox } from 'img-mark'
import { uid } from 'uid'
let src = $ref('https://forza.ismcdn.jp/mwimgs/8/e/1774n/img_8e8307dc5355e41385fd3568ef95f233218536.jpg')
let mode = $ref<Mode>('crop')
let cropList = $ref<BoundingBox[]>([
	{
		startX: 0,
		startY: 0,
		endX: 1774,
		endY: 100,
	},
	{
		startX: 200,
		startY: 200,
		endX: 1000,
		endY: 500,
	},
])

let tagList = $ref<BoundingBox[]>([
	{
		startX: 50,
		startY: 0,
		endX: 100,
		endY: 50,
		isShow: true,
		labelText: 'customTagLabelText',
	},
	{
		startX: 0,
		startY: 0,
		endX: 1774,
		endY: 100,
		isShow: true,
	},
])

let imgMarkRef = $ref<InstanceType<typeof ImgMark>>()

function removeTag(data?: BoundingBox[]) {
	if (data) {
		imgMarkRef.removeTagItems(data)
	}
}
function cropChange() {
	removeTag()
}

function setHoverItem(item: BoundingBox) {
	item.showOutLine = true
}
function removeHoverItem(item: BoundingBox) {
	item.showOutLine = false
}

function getGroupInfo() {
	let groupInfo = imgMarkRef.getTagListGroupByCropIndex()
	console.log(groupInfo)
}
</script>
<style scoped lang="scss">
.page-test-img-mark {
	display: flex;
	justify-content: space-between;
	.info-panel {
		width: 50vw;
		box-sizing: border-box;
		padding: 20px;
	}
}
</style>
```

## 类型

```ts
type ShortCutItem = 'ctrl+b' | 'space'

type Event = {
	onClick?: (e: unknown, item: BoundingBox) => void //tag click事件
	onDoubleClick?: (e: unknown, item: BoundingBox) => void //tag double click事件
}

type Hooks = {
	shiftMode(): void //切换模式
	shiftDrawSwitch(onOrOff: 'on' | 'off'): void //切换是否开始画的开关
	init(): void //初始化组件
	resize(): void //resize后重新初始化组件
}

type BoundingBox = {
	startX: number
	endX: number
	startY: number
	endY: number
	isShow?: boolean //tag是否显示
	showOutLine?: boolean //tag是否边框是否高亮
	labelText?: string //tag的标签文字
	tagConfig?: TagConfig //单独定义某个tagConfig
	cropConfig?: CropConfig //单独定义某个cropConfig
} & Event

type CropConfig = {
	lineDash?: number[]
	strokeStyle?: string
	lineWidth?: number
	customDraw?: CustomDraw
}

export type DaubConfig = {
	strokeStyle?: string
	lineWidth?: number
}

type LayerConfig = {
	fillStyle?: string
}

export type CustomDraw = (
	ctx: CanvasRenderingContext2D,
	info: {
		target: BoundingBox | undefined
		positions: Rect
	}
) => void

type TagConfig = {
	fontSize?: number //px单位，默认20
	showText?: boolean //是否展示tag index
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

type Point = {
	x: number
	y: number
}

export type DaubPoint = Point & {
	lineWidth?: number
	strokeStyle?: string
}

type ResizeEmitType = {
	index: number
	box: BoundingBox
}

type TagListGroupByCropIndex = {
	[key: number]: BoundingBox[]
	undefined: BoundingBox[]
}

type MouseOverInfoEmitType = {
	canvas: Point | null
	img: Point | null
}

type OnLoadImageEmitType = {
	status: 'loading' | 'success' | 'error'
	msg?: string
}

type TagListChangeType = 'add' | 'delete' | 'statusChange'

type TagListChangeEmitRetunType = {
	type: TagListChangeType
	list: BoundingBox[]
	parentCrop?: BoundingBox
}

type CropListChangeType = 'add' | 'delete' | 'resize'

type CropListChangeEmitType = {
	type: CropListChangeType
	list: BoundingBox[]
}

type BoundingBox2Rect = (boundingBoxList: BoundingBox[]) => Rect[]
type CustomDrawTopCtx = (ctx: CanvasRenderingContext2D, boundingBox2Rect: BoundingBox2Rect) => void
```

## 组件属性

| 属性                                    | 说明                                                                                                                                                 | 类型             | 可选值        | 默认值 |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------- | ------ |
| src                                     | 图片地址, 必选参数                                                                                                                                   | string           | ——            | ——     |
| mode/v-model:mode                       | 模式                                                                                                                                                 | string           | crop/tag/daub | crop   |
| mobileOperation/v-model:mobileOperation | 移动端单指在画布滑动是移动还是画 rect                                                                                                                | string           | move/draw     | move   |
| cropList/v-model:cropList               | 裁切区域集合，相对于`img`左上角开始定位                                                                                                              | BoundingBox[]    | ——            | []     |
| tagList/v-model:tagList                 | tag 区域集合,相对于`img`左上角开始定位                                                                                                               | BoundingBox[]    | ——            | []     |
| daubStack/v-model:daubStack             | 涂抹区域店集合,相对于`img`左上角开始定位                                                                                                             | DaubPoint[][]    | ——            | []     |
| precision                               | BoundingBox 精度                                                                                                                                     | number           | ——            | 0      |
| drawingText                             | 画`tag`时候展示的文字                                                                                                                                | number           | ——            | 0      |
| initScale                               | 是否自动缩放图片适应到画布大小                                                                                                                       | boolean          | true/false    | true   |
| enableScale                             | 是否允许缩放画布                                                                                                                                     | boolean          | true/false    | true   |
| enableMove                              | 是否允许移动画布                                                                                                                                     | boolean          | true/false    | true   |
| enableDrawCrop                          | 是否允许在画布上画 `crop`                                                                                                                            | boolean          | true/false    | true   |
| enableDrawTag                           | 是否允许在画布上画 `tag`                                                                                                                             | boolean          | true/false    | true   |
| enableInteractiveTagChangeStatus        | 是否允许交互改变 `tag` 状态                                                                                                                          | boolean          | true/false    | true   |
| enableInteractiveCropDelete             | 是否允许交互删除 `crop`                                                                                                                              | boolean          | true/false    | true   |
| enableDrawCropOutOfImg                  | 是否允许 `crop` 画到图片外                                                                                                                           | boolean          | true/false    | true   |
| enableDrawTagOutOfCrop                  | 是否允许 `tag` 画到 `crop` 外                                                                                                                        | boolean          | true/false    | true   |
| enableDrawTagOutOfImg                   | 是否允许 `tag` 画到图片外                                                                                                                            | boolean          | true/false    | true   |
| splitClickAndDoubleClickEvent           | 是否分离单击和双击事件                                                                                                                               | boolean          | true/false    | false  |
| disableDefaultShortcuts                 | 禁用默认快捷键                                                                                                                                       | ShortCutItem[]   | ——            | []     |
| enableCropResize                        | 是否允许 `crop` 改变大小                                                                                                                             | boolean          | true/false    | true   |
| enableTagResize                         | 是否允许 `tag` 改变大小                                                                                                                              | boolean          | true/false    | false  |
| enableCropCross                         | 是否允许 `crop` 和其他 `crop` 相交,不允许后，如果相交，新画的`crop`会不添加，如果是 resize 操作相交以后，按照下方 `handleResizeCropCross` 属性去处理 | boolean          | true/false    | true   |
| handleResizeCropCross                   | 当`enableCropCross`属性为 false，resize 操作相交后该如何处理进行 resize 操作的`crop`                                                                 | string           | delete/reset  | reset  |
| isShowTip                               | 是否显示底部提示区域                                                                                                                                 | boolean          | true/false    | false  |
| isCropSingle                            | 是否单个 `crop` , 在添加 `crop` 的时候自动删除旧的 `crop`                                                                                            | boolean          | true/false    | false  |
| isImgCrop                               | 是否在 `cropList` 为空时默认以图片大小为裁切区域                                                                                                     | boolean          | true/false    | false  |
| layerConfig                             | 浮层样式                                                                                                                                             | LayerConfig      | ——            | ——     |
| cropConfig                              | `crop` 样式                                                                                                                                          | CropConfig       | ——            | ——     |
| tagConfig                               | `tag` 样式                                                                                                                                           | TagConfig        | ——            | ——     |
| daubConfig                              | `daub` 样式                                                                                                                                          | DaubConfig       | ——            | ——     |
| customDrawTopCtx                        | 自定义绘制                                                                                                                                           | CustomDrawTopCtx | ——            | ——     |

## 组件事件

| 事件名         | 说明                                                                                   | 参数                                                |
| -------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------- |
| tagListChange  | 当添加或者删除或者改变组件状态 `tag` 项触发,`parentCrop` 只在 `type` 为 `add` 时候返回 | data:TagListChangeEmitRetunType                     |
| cropListChange | 当添加或者删除或者改变 `crop` 大小触发                                                 | {type:'add'/'delete'/'resize', list:BoundingBox[] } |
| resizeStart    | `crop` 开始 resize 触发                                                                | data:ResizeEmitType                                 |
| resizeEnd      | `crop` 结束 resize 触发                                                                | data:ResizeEmitType                                 |
| delCrop        | 删除 `crop` 触发                                                                       | list:BoundingBox[]                                  |
| drawCropStart  | 添加 `crop` 之前触发                                                                   | ——                                                  |
| drawTagStart   | 添加 `tag` 之前触发                                                                    | ——                                                  |
| mouseOverInfo  | 鼠标在组件上移动或者移除时候触发                                                       | info:MouseOverInfoEmitType                          |
| onLoadImage    | 图片加载状态事件                                                                       | data:OnLoadImageEmitType                            |

## 组件暴露对象

| 对象  | 类型  | 说明             |
| ----- | ----- | ---------------- |
| hooks | Hooks | 调用组件抽象方法 |

## 组件暴露方法

| 方法                       | 说明                                           | 参数                                      | 返回类型                |
| -------------------------- | ---------------------------------------------- | ----------------------------------------- | ----------------------- |
| removeTagItems             | 移除 `tag` 项                                  | list:BoundingBox[]                        | void                    |
| render                     | 重新渲染                                       | ——                                        | void                    |
| getTagListGroupByCropIndex | 获取 `tagList` 并按照 cropIndex 分组           | type: 'startPoint'/'allIn' = 'startPoint' | TagListGroupByCropIndex |
| getBase64ImageData         | 获取原图大小绘制完各种元素后的 base64 图片 url | crossOrigin?: boolean                     | Promise\<string>        |
| scrollIntoView             | 讲某个区域滚动到 0,0 点                        | box: BoundingBox                          | void                    |

## Slots

| 插槽名 | 说明                 |
| ------ | -------------------- |
| tip    | 右下角提示自定义内容 |

## Lib 方法

| 方法                          | 说明                           | 参数                                                              | 返回类型      |
| ----------------------------- | ------------------------------ | ----------------------------------------------------------------- | ------------- |
| transformTagListBoxRelativeTo | 转换 `tag` list 基于什么去定位 | type: 'img'/'crop', cropInfo: BoundingBox, tagList: BoundingBox[] | BoundingBox[] |
| transformTagBoxRelativeTo     | 转换单个 `tag` 基于什么去定位  | type: 'img'/'crop', cropInfo: BoundingBox, tag: BoundingBox       | BoundingBox   |
| boxIsAllInOtherBox            | box 是否完全包含在另一个 box   | box: BoundingBox, otherBox: BoundingBox                           | boolean       |

## 操作

### 移动画布

按住鼠标左键拖动

### 画区域

按下空格 + 按住鼠标左键拖动

### 切换模式

Ctrl + B

### 放大缩小

鼠标滚轮
