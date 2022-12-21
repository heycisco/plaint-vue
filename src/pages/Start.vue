<template>
	<div class="wrapper">
		<h2>{{ content.title }}</h2>
		<site-description :content="content.mainDescription"></site-description>
		<router-link to="/form" class="start-btn">{{ content.startLink }}</router-link>
	</div>
</template>

<script>
import SiteDescription from '@/components/SiteDescription';
export default {
	components: {
		SiteDescription,
	},
	props: {
		content: {
			type: [Object, Array],
			required: true,
		},
	},
	data() {
		return {};
	},
};
</script>

<style lang="postcss" scoped>
.wrapper {
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

.start-btn {
	font-size: calc(var(--font-size) * 1.4);
	position: relative;
	color: #f7fbfa;
	line-height: 1;
	padding: 0.2em 0.5em;
	font-weight: 600;
	text-shadow: 0 0 1px #0000009e;
	transition: var(--transition-out) box-shadow;
	&:hover {
		transition: var(--transition-in) box-shadow;
		box-shadow: 0 1px 4px #00000085;
	}
	&:before {
		content: '';
		size: 100%;
		position: absolute;
		left: center;
		top: center;
		mix-blend-mode: color-burn;
		filter: drop-shadow(0 2px 6px var(--shadow-2-color))
			drop-shadow(0 2px 1px var(--shadow-1-color)) blur(1px);
		shape-rendering: auto;
		background: var(--c-brand);
	}
}
.main-description {
	display: flex;
	flex-direction: column;
	gap: 1em;
}
</style>
