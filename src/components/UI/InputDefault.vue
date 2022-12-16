<template>
	<div class="group">
		<label v-bind:for="identifier">
			<slot></slot>
		</label>
		<input
			v-bind:type="type"
			v-bind:id="identifier"
			:value="value"
			@input="updateInput"
		/>
	</div>
</template>

<script>
export default {
	name: 'input-default',
	props: {
		value: [String, Number],
		identifier: [String],
		type: [String],
	},
	methods: {
		updateInput(event) {
			this.$emit('update:value', event.target.value.trim());
		},
	},
};
</script>

<style lang="postcss" scoped>
input {
	font-size: var(--font-size);
	color: var(--c-main-2);
	width: 100%;
	background: var(--border-obj) 0 1.127em;
	background-size: auto 0.0860em;
	background-repeat: repeat-x;
	height: 1.275em;
	text-shadow: none;
}
</style>
