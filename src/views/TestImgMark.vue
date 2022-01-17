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
			<hr />
			<el-alert v-for="item in cropList" style="margin-top: 20px" :key="uid(6)" :title="JSON.stringify(item)" type="warning"> </el-alert>
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
type MyBoundingBox = BoundingBox & {
	type: number
}
let tagList = $ref<MyBoundingBox[]>([
	{
		startX: 50,
		startY: 0,
		endX: 100,
		endY: 50,
		isShow: true,
		type: 1,
	},
	{
		startX: 0,
		startY: 0,
		endX: 1774,
		endY: 100,
		isShow: true,
		type: 1,
	},
])

let imgMarkRef = $ref<InstanceType<typeof ImgMark>>()

function removeTag(data?: BoundingBox[]) {
	if (data) {
		imgMarkRef.removeTagItems(data)
	}
}
function cropListChange() {
	console.log(111)
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
