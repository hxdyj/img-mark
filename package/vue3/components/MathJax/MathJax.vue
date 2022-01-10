<template>
	<div class="ke-comp-math-jax" ref="mathJaxRef">$${{ renderText }}$$</div>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import thansformer from '../../../util/thansformer'
import { renderLatex } from './util'

const props = defineProps<{
	content: string
}>()

let mathJaxRef = $ref<HTMLDivElement>()

let renderText = $computed<string>(() => {
	return thansformer(props.content || '')
})
watch(
	() => props.content,
	() => {
		renderLatex(mathJaxRef)
	}
)

onMounted(() => {
	renderLatex(mathJaxRef)
})
</script>
<style lang="scss">
.ke-comp-math-jax {
	mjx-math.MJX-TEX {
		white-space: pre-wrap !important;
	}
	mjx-mtext {
		color: inherit !important;
	}
	*:focus {
		outline: none !important;
	}
	mjx-container [space='4'] {
		margin-left: 0px;
	}
}
</style>
