<template>
	<div class="page-test-img-mark">
		<div style="width: 50vw; height: 100vh; background: #ccc; box-sizing: border-box; flex-shrink: 0">
			<ImgMark
				ref="imgMarkRef"
				:src="src"
				v-model:mode="mode"
				v-model:tagList="tagList"
				v-model:cropList="cropList"
				@cropListChange="cropListChange"
				@tagsStatusChange="tagsStatusChange"
				@resizeStart="resizeStart"
				@resizeEnd="resizeEnd"
				@delCrop="delCrop"
				:drawingText="'lala'"
				@tagListChange="tagsListChange"
				@drawCropStart="drawCropStart"
				@drawTagStart="drawTagStart"
				@onLoadImage="onLoadImage"
				:enableInteractiveTagChangeStatus="true"
				:tagConfig="{
					fontSize: 50,
				}"
				:splitClickAndDoubleClickEvent="true"
				:isCropSingle="true"
				:isImgCrop="true"
				:isShowTip="true"
				:enableDrawCropOutOfImg="false"
				:enableDrawTagOutOfCrop="false"
				:enableDrawTagOutOfImg="false"
			>
				<template #tip> 111 </template>
			</ImgMark>
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
			<hr />
			<el-alert v-for="item in cropList" style="margin-top: 20px" :key="uid(6)" :title="JSON.stringify(item)" type="warning"> </el-alert>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ImgMark, Mode, BoundingBox, ResizeEmitType, OnLoadImageEmitType } from 'img-mark'
import { uid } from 'uid'
import { nextTick } from 'vue'
let src = $ref('https://forza.ismcdn.jp/mwimgs/8/e/1774n/img_8e8307dc5355e41385fd3568ef95f233218536.jpg')
let mode = $ref<Mode>('crop')
let cropList = $ref<
	Array<
		BoundingBox & {
			__uid: string
		}
	>
>([
	// {
	// 	__uid: '1',
	// 	startX: 0,
	// 	startY: 0,
	// 	endX: 1774,
	// 	endY: 100,
	// },
	// {
	// 	__uid: '2',
	// 	startX: 200,
	// 	startY: 200,
	// 	endX: 1000,
	// 	endY: 500,
	// },
])
type MyBoundingBox = BoundingBox & {
	__uid: string
	type: number
}
let tagList = $ref<MyBoundingBox[]>([
	{
		__uid: '1',
		startX: 50,
		startY: 0,
		endX: 100,
		endY: 50,
		isShow: true,
		type: 1,
		labelText: 'haha',
		tagConfig: {
			highlightStrokeStyle: '#ccc',
		},
		// onClick(e, item) {
		// 	console.log('Custom Click:', item)
		// },
		// onDoubleClick(e, item) {
		// 	console.log('Custom Double Click:', item)
		// },
	},
	{
		__uid: '2',
		startX: 0,
		startY: 0,
		endX: 1774,
		endY: 100,
		isShow: true,
		type: 1,
		showOutLine: true,
		tagConfig: {
			highlightStrokeStyle: 'red',
			highlightLineDash: [0],
		},
	},
])

let imgMarkRef = $ref<InstanceType<typeof ImgMark>>()

function onLoadImage(data: OnLoadImageEmitType) {
	console.log('onLoadImage', data)
}

function resizeStart(data: ResizeEmitType) {
	console.log('resizeStart', data)
}
function resizeEnd(data: ResizeEmitType) {
	console.log('resizeEnd', data)
	let group = imgMarkRef.getTagListGroupByCropIndex('allIn')
	console.log('group', group)
}
function drawCropStart() {
	console.log('drawCropStart...')
}
function drawTagStart() {
	console.log('drawTagStart...')
}
function delCrop(data: MyBoundingBox[]) {
	console.log('delCrop', data)
	//del后重新获取，然后把不在框里的tag删除
}

function removeTag(data?: BoundingBox[]) {
	if (data) {
		imgMarkRef.removeTagItems(data)
	}
}
function cropListChange(data: any) {
	console.log(111, data)
}
function tagsListChange(data: any) {
	// if (data.type === 'add') {
	// 	data.list[0].__uid = '333333'
	// 	removeTag([tagList[0]])
	// }
	console.log('tagsListChange', data)
	imgMarkRef.hooks.onKeyDownSpace()
}

function setHoverItem(item: MyBoundingBox) {
	item.showOutLine = true
}
function removeHoverItem(item: MyBoundingBox) {
	item.showOutLine = false
}

function tagsStatusChange(list: MyBoundingBox[]) {
	let removeList = list.filter(i => !i.type)
	if (removeList.length !== 0) {
		removeTag(removeList)
	}
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
