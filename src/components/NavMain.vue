<template>
	<div class="main-navigation">
		<router-link v-for="item in links" :key="item" :to="item.adress" :title="item.description">
			{{item.name}}
		</router-link>
	</div>
</template>

<script>
export default {
	props: {
		links: {
			type: Array,
			required: true,
		},
	},
};
</script>

<style lang="postcss" scoped>
.main-navigation {
	display: flex;
	gap: 12px;
	justify-content: center;
	padding: 8px;
	a {
		text-decoration: none;
		color: #000;
		&:hover {
			color: #f00;
		}
	}
}
</style>
