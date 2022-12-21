<template>
	<div class="main-footer">
		<div class="content">
			<p
				v-for="(item, index) in filteredContent"
				:key="index"
				v-html="item"
			></p>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		content: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			currentYear: '',
			filteredContent: [],
		};
	},
	methods: {
		getVal() {
			this.content.forEach((item, index) => {
				this.filteredContent[index] = item
					.replace('$year', this.currentYear)
					.replace('$width', document.documentElement.clientWidth)
					.replace('$height', document.documentElement.clientHeight);
			});
			window.addEventListener('resize', this.getVal);
		},
	},
	mounted() {
		this.currentYear = new Date().getFullYear();
		this.getVal();
	},
};
</script>

<style lang="postcss"></style>
