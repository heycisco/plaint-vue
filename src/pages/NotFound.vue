<template>
	<div class="msg" v-if="created">
		<!-- <img :src="image" /> -->
		<img v-bind:src="wepbUrl(content.images.notFound)" alt="404 image" />
		<router-link to="/">{{ content.notFoundLink }}</router-link>
	</div>
</template>

<script>
import webpCheck from '@/mixins/webpCheck';
export default {
	mixins: [webpCheck],
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
