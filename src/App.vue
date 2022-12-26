<template>
	<div class="app">
		<div class="background" v-bind:style="content.images.background"></div>
		<div class="wrapper">
			<logo-main
				:title="content.logoTitle"
				:currentPage="routePath"
			></logo-main>
			<div class="main-content">
				<router-view :content="content" />
			</div>
		</div>
		<footer-main :content="content.footer"></footer-main>
	</div>
</template>

<script>
import FooterMain from '@/components/FooterMain';
import LogoMain from '@/components/LogoMain';
import content from '@/content.json';
import '@/assets/css/style.css';
export default {
	components: { FooterMain, LogoMain },
	data() {
		return {
			content: content,
			title: content.siteName,
			routePath: '',
		};
	},
	methods: {
		getRoutes() {
			if (this.$route.name) {
				this.title =
					this.content.siteName +
					this.content.titleSeparator +
					this.$route.name;
			}
			document.title = this.title;
			this.$route.path === '/'
				? (this.routePath = 'start')
				: (this.routePath = 'deep');
		},
	},
	watch: {
		$route(to, from) {
			this.getRoutes();
		},
	},
};
</script>

<style lang="postcss"></style>
