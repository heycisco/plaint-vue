<template>
	<div class="msg">
		<h2>Отправлено!</h2>
		<router-link to="/">Вернуться</router-link>
	</div>
</template>

<script>
export default {};
</script>

<style lang="postcss" scoped>
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
