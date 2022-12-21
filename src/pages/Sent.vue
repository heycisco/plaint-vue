<template>
	<div class="msg">
		<div v-html="content.afterSentMessage" class="msg__text"></div>
		<img v-bind:src="content.images.sent" alt="sent image" />
		<router-link to="/form">{{ content.afterSentLink }}</router-link>
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
