<template>
	<div class="msg" v-if="created">
		<div v-html="content.error.msg" class="msg__text"></div>
		<img v-bind:src="wepbUrl(content.error.img)" alt="error image" />
		<router-link to="/form">{{ content.error.linkMsg }}</router-link>
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
};
</script>

<style lang="postcss" scoped>
.msg {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	gap: 2em;
	&__text {
		font-size: 130%;
	}
}
</style>
