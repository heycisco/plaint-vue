<template>
	<div class="msg" v-if="created">
		<div v-html="content.afterSentMessage" class="msg__text"></div>
		<img v-bind:src="wepbUrl(content.images.sent)" alt="sent image" />
		<router-link to="/form">{{ content.afterSentLink }}</router-link>
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
