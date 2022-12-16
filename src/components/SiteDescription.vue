<template>
	<div v-if="content" class="main-description" v-html="content"></div>
</template>

<script>
export default {
	props: {
		content: [String],
	},
};
</script>

<style lang="postcss">
</style>
