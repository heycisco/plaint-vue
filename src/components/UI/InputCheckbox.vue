<template>
	<div class="group">
		<label v-bind:for="identifier">
			<slot></slot>
			<input
				type="checkbox"
				v-bind:id="identifier"
				:checked="value"
				@input="updateInput"
			/>
			<span v-bind:class="{ active: value }" class="new-chackbox"></span>
		</label>
	</div>
</template>

<script>
export default {
	name: 'input-checkbox',
	props: {
		value: [Boolean],
		identifier: [String],
	},
	methods: {
		updateInput(event) {
			this.$emit('update:value', event.target.checked);
		},
	},
};
</script>

<style lang="postcss" scoped>
.group {
	pointer-events: none;
}
input {
	display: none;
}
label {
	display: flex;
	justify-content: flex-start;
}
.new-chackbox {
	font-size: var(--font-size);
	display: inline-block;
	height: 1.275em;
	width: 8em;
	text-shadow: none;
	margin-left: 0.35em;
	position: relative;
	&:before {
		position: absolute;
		size: 100%;
		left: center;
		top: center;
		pointer-events: all;
		cursor: pointer;
	}
	&:before {
		content: '';
		background: var(--border-obj) 0 1.127em;
		background-size: auto 0.086em;
		background-repeat: repeat-x;
	}
	&:after {
		position: absolute;
		height: 150%;
		width: 110%;
		content: 'Осуждаю!';
		color: var(--c-main-2);
		text-align: center;
		visibility: hidden;
		font-size: 150%;
		bottom: 10%;
		left: -8%;
		z-index: 10;
	}
	&.active:after {
		animation-name: zoomIn;
		animation-duration: 0.3s;
		animation-fill-mode: forwards;
		animation-timing-function: ease-out;
	}
}
@keyframes zoomIn {
	from {
		opacity: 0;
		transform: scale3d(12, 12, 12) rotate(40deg);
		filter: blur(5px);
	}

	to {
		transform: scale3d(1, 1, 1) rotate(-4deg);
		filter: blur(0);
		visibility: visible;
	}
}
</style>
