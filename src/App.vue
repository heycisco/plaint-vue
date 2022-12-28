<template>
	<div class="app" v-if="loaded">
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
import axios from 'axios';
import '@/assets/css/style.css';
export default {
	components: { FooterMain, LogoMain },
	data() {
		return {
			content: null,
			loaded: false,
			title: '',
			routePath: '',
		};
	},
	methods: {
		getRoutes() {
			if (this.loaded && this.$route.name) {
				this.title =
					this.content.siteName +
					this.content.titleSeparator +
					this.$route.name;
			} else if (this.loaded) {
				this.title = this.content.siteName;
			} else {
				this.title = 'Loading';
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
	mounted() {
		axios
			.get('/content.json')
			.then((response) => {
				this.content = response.data;
			})
			.finally(() => {
				this.loaded = true;
				this.getRoutes();
			});
	},
};
</script>

<style lang="postcss"></style>
