<template>
	<div class="page-test">
		<KeMathJax :content="content"></KeMathJax>
	</div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { KeMathJax } from 'learnable-lib'
onMounted(() => {})
let content = $ref(
	`已知抛物线y=ax^2+bx+5(a\\neq0)经过A(5,0),B(6,1)两点,且与y轴交于点C.\n(1)求抛物线y=ax^2+bx+5(a\\neq0)的函数关系式及点C的坐标;\n(2)连接AB,在题(1)中的抛物线上是否存在点P,是\\trianglePAB是以AB为直角边的直角三角形?\n若存在,求出点P的坐标;若不存在,请说明 理由;`
)
</script>
<style scoped lang="scss"></style>
