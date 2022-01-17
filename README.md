# Img-Mark

在一个图片中标记一个或者多个截图区域

在截图区域中标记一个或者多个子区域

如下图：

![](./img/preview.png)

## 类型

```ts
type BoundingBox = {
	startX: number
	endX: number
	startY: number
	endY: number
	isShow?: boolean //tag是否显示
	showOutLine?: boolean //tag是否边框是否高亮
}

type CropConfig = {
	lineDash?: number[]
	strokeStyle?: string
	lineWidth?: number
}

type LayerConfig = {
	fillStyle?: string
}

type TagConfig = {
	fillStyle?: string
	textFillStyle?: string
	hoverStrokeStyle?: string
	hoverLineWidth?: number
	hoverLineDash?: number[]
	highlightStrokeStyle?: string
	highlightLineWidth?: number
	highlightLineDash?: number[]
}
```

## 属性

| 属性                   | 说明                          | 类型          | 可选值     | 默认值 |
| ---------------------- | ----------------------------- | ------------- | ---------- | ------ |
| src                    | 图片地址                      | string        | ——         | ——     |
| mode                   | 模式                          | string        | crop/tag   | crop   |
| cropList               | 裁切区域集合                  | BoundingBox[] | ——         | []     |
| tagList                | tag 区域集合                  | BoundingBox[] | ——         | []     |
| enableDrawCropOutOfImg | 是否允许 `Crop` 画到图片外    | boolean       | true/false | true   |
| enableDrawTagOutOfCrop | 是否允许 `Tag` 画到 `Crop` 外 | boolean       | true/false | true   |
| enableDrawTagOutOfImg  | 是否允许 `Tag` 画到图片外     | boolean       | true/false | true   |
| enableCropResize       | 是否允许 `Crop` 改变大小      | boolean       | true/false | true   |
| isShowTip              | 是否显示底部提示区域          | boolean       | true/false | false  |
| layerConfig            | 浮层样式                      | LayerConfig   | ——         | ——     |
| cropConfig             | `crop` 样式                   | CropConfig    | ——         | ——     |
| tagConfig              | `tag` 样式                    | TagConfig     | ——         | ——     |

## 操作

### 移动画布

按住鼠标左键拖动

### 画区域

按下空格 + 按住鼠标左键拖动

### 切换模式

Ctrl + B

### 放大缩小

鼠标滚轮
