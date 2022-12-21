<template>
	<div class="msg">
		<!-- <img :src="image" /> -->
		<img v-bind:src="content.images.notFound" alt="404 image" />
		<router-link to="/">{{ content.notFoundLink }}</router-link>
	</div>
</template>

<script>
export default {
	props: {
		content: {
			type: [Object, Array],
			required: true,
		},
	},
	data() {
		return {
			// image: 'img/404.png',
		};
	},
};
</script>

<style lang="postcss">
.msg {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	gap: 2em;
	h2 {
		font-size: 300%;
	}
}
</style>
