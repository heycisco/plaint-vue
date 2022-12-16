<template>
	<div class="msg">
		<!-- <img :src="image" /> -->
		<h2>404</h2>
		<router-link to="/">В начало</router-link>
	</div>
</template>

<script>
export default {
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
