<template>
	<div class="page-test-img-mark">
		<div style="width: 50vw; height: 100vh; background: #ccc; box-sizing: border-box">
			<ImgMark
				ref="imgMarkRef"
				style="width: 100%; height: 100%"
				:src="src"
				v-model:mode="mode"
				v-model:cropBounding="cropInfo"
				v-model:tagList="tagList"
				v-model:cropList="cropList"
				@cropChange="cropChange"
				@tagsStatusChange="tagsStatusChange"
				:enableDrawCropOutOfImg="false"
				:enableDrawTagOutOfCrop="false"
				:enableDrawTagOutOfImg="false"
			></ImgMark>
		</div>
		<div class="info-panel">
			{{ tagList }}
			<el-input v-model="src"></el-input>
			<el-alert :title="JSON.stringify(cropInfo)" type="info" style="margin-top: 20px"> </el-alert>
			<el-button type="primary" size="small" style="margin-top: 40px" @click="removeTag()">Remove All</el-button>
			<el-alert v-for="item in tagList" @close="removeTag([item])" style="margin-top: 20px" :key="uid(6)" :title="JSON.stringify(item)" type="warning">
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
let cropInfo = $ref<BoundingBox>()
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
function cropChange() {
	removeTag()
}

function tagsStatusChange(list: MyBoundingBox[]) {
	let removeList = list.filter(i => !i.type)
	if (removeList.length !== 0) {
		removeTag(removeList)
	}
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
