<template>
	<div class="app">
		<div class="background" v-bind:style="backgroundImage"></div>
		<div class="wrapper">
			<logo-main></logo-main>
			<div class="main-content">
				<router-view></router-view>
			</div>
		</div>
		<footer-main></footer-main>
	</div>
</template>

<script>
import FooterMain from '@/components/FooterMain';
import LogoMain from '@/components/LogoMain';
import '@/assets/css/style.css';
export default {
	components: { FooterMain, LogoMain },
	data() {
		return {
			backgroundImage: 'background-image: url("img/bg.jpg")',
		};
	},
};
</script>

<style lang="postcss"></style>
