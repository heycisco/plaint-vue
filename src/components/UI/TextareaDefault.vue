<template>
	<div class="group">
		<label v-bind:for="identifier"><slot></slot></label>
		<textarea
			v-bind:id="identifier"
			:value="value"
			@input="updateInput"
		></textarea>
	</div>
</template>

<script>
export default {
	name: 'textarea-default',
	props: {
		value: [String, Number],
		identifier: [String],
	},
	data() {
		return {};
	},
	methods: {
		updateInput(event) {
			this.$emit('update:value', event.target.value);
		},
	},
};
</script>

<style lang="postcss" scoped>
textarea {
	font-size: var(--font-size);
	color: var(--c-main-2);
	width: 100%;
	background: var(--border-obj) 0 1.127em, var(--border-obj) 0 2.44em,
		var(--border-obj) 0 3.69em, var(--border-obj) 0 4.94em;
	background-size: auto 0.0860em;
	background-repeat: repeat-x;
	height: 5.1em;
	max-height: 5.1em;
	resize: none;
	text-shadow: none;
	overflow: hidden;
}
</style>
