<template>
	<div class="page-test-img-mark">
		<div style="height: 50vh; width: 100vw; display: flex; align-items: center; justify-content: center">
			<div style="width: 48vw; height: 48vh; background: #ccc; box-sizing: border-box">
				<ImgMark
					ref="imgMarkRef"
					style="width: 100%; height: 100%"
					:src="src"
					v-model:mode="mode"
					v-model:cropBounding="cropInfo"
					v-model:tagList="tagList"
					@cropChange="cropChange"
					@tagsStatusChange="tagsStatusChange"
					:enableDrawCropOutOfImg="false"
					:enableDrawTagOutOfCrop="false"
					:enableDrawTagOutOfImg="false"
					:enableTagResize="true"
				></ImgMark>
			</div>
			<div class="info-panel">
				{{ tagList }}
				<el-input v-model="src"></el-input>
				<el-alert :title="JSON.stringify(cropInfo)" type="info" style="margin-top: 20px"> </el-alert>
				<el-button type="primary" size="small" style="margin-top: 40px" @click="removeTag()">Remove All</el-button>
				<el-alert v-for="item in tagList" @close="removeTag([item])" style="margin-top: 20px" :key="uid(6)" :title="JSON.stringify(item)" type="warning">
				</el-alert>
			</div>
		</div>
		<div style="height: 50vh; width: 100vw; display: flex">
			<div style="width: 50vw; height: 50vh; background: #ccc; box-sizing: border-box">
				<ImgMark
					ref="imgMarkRef1"
					style="width: 100%; height: 100%"
					:src="src1"
					v-model:mode="mode1"
					v-model:cropBounding="cropInfo1"
					v-model:tagList="tagList1"
					@cropChange="cropChange1"
					@tagsStatusChange="tagsStatusChange1"
					:enableDrawCropOutOfImg="false"
					:enableDrawTagOutOfCrop="false"
					:enableDrawTagOutOfImg="false"
					:enableTagResize="true"
				></ImgMark>
			</div>
			<div class="info-panel">
				{{ tagList1 }}
				<el-input v-model="src1"></el-input>
				<el-alert :title="JSON.stringify(cropInfo1)" type="info" style="margin-top: 20px"> </el-alert>
				<el-button type="primary" size="small" style="margin-top: 40px" @click="removeTag1()">Remove All</el-button>
				<el-alert v-for="item in tagList1" @close="removeTag1([item])" style="margin-top: 20px" :key="uid(6)" :title="JSON.stringify(item)" type="warning">
				</el-alert>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ImgMark, Mode, BoundingBox } from 'img-mark'
import { uid } from 'uid'
let src = $ref('https://forza.ismcdn.jp/mwimgs/8/e/1774n/img_8e8307dc5355e41385fd3568ef95f233218536.jpg')
let src1 = $ref('https://forza.ismcdn.jp/mwimgs/8/e/1774n/img_8e8307dc5355e41385fd3568ef95f233218536.jpg')
let mode = $ref<Mode>('tag')
let mode1 = $ref<Mode>('tag')
let cropInfo = $ref<BoundingBox>()
let cropInfo1 = $ref<BoundingBox>()
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
let tagList1 = $ref<MyBoundingBox[]>([
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
let imgMarkRef1 = $ref<InstanceType<typeof ImgMark>>()

function removeTag(data?: BoundingBox[]) {
	if (data) {
		imgMarkRef.removeTagItems(data)
	}
}
function removeTag1(data?: BoundingBox[]) {
	if (data) {
		imgMarkRef1.removeTagItems(data)
	}
}
function cropChange() {
	removeTag()
}
function cropChange1() {
	removeTag1()
}

function tagsStatusChange(list: MyBoundingBox[]) {
	let removeList = list.filter(i => !i.type)
	if (removeList.length !== 0) {
		removeTag(removeList)
	}
}
function tagsStatusChange1(list: MyBoundingBox[]) {
	let removeList = list.filter(i => !i.type)
	if (removeList.length !== 0) {
		removeTag1(removeList)
	}
}
</script>
<style scoped lang="scss">
.page-test-img-mark {
	.info-panel {
		width: 50vw;
		height: 50vh;
		box-sizing: border-box;
		padding: 20px;
	}
}
</style>
