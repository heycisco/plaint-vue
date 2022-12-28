<template>
	<div class="app" v-if="mounted && created">
		<div
			class="background"
			v-bind:style="
				'background-image: url(' + wepbUrl(content.images.background) + ')'
			"
		></div>
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
import axios from 'axios';
import '@/assets/css/style.css';
import webpCheck from '@/mixins/webpCheck';
import FooterMain from '@/components/FooterMain';
import LogoMain from '@/components/LogoMain';
export default {
	mixins: [webpCheck],
	components: { FooterMain, LogoMain },
	data() {
		return {
			content: null,
			mounted: false,
			title: '',
			routePath: '',
		};
	},
	methods: {
		getRoutes() {
			if (this.mounted && this.$route.name) {
				this.title =
					this.content.siteName +
					this.content.titleSeparator +
					this.$route.name;
			} else if (this.mounted) {
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
				this.mounted = true;
				this.getRoutes();
				this.wepbUrl(this.content.images.background);
			});
	},
};
</script>

<style lang="postcss"></style>
