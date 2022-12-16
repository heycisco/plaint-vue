<template>
	<div class="app">
		<div class="background" v-bind:style="backgroundImage"></div>
		<div class="wrapper">
			<!-- <nav-main :links="menuMainLinks"></nav-main> -->
			<logo-main></logo-main>
			<div class="main-content">
				<router-view></router-view>
			</div>
		</div>
		<footer-main></footer-main>
	</div>
</template>

<script>
import NavMain from '@/components/NavMain';
import FooterMain from '@/components/FooterMain';
import LogoMain from '@/components/LogoMain';
import '@/assets/css/style.css';
export default {
	components: { NavMain, FooterMain, LogoMain },
	data() {
		return {
			backgroundImage: 'background-image: url("img/bg.jpg")',
			menuMainLinks: [
				{
					name: 'В начало',
					adress: '/',
					description: 'Написать ещё кляузу?',
				},
				{
					name: 'Инфа',
					adress: '/about',
					description: 'Ну чето тут написать',
				},
			],
		};
	},
};
</script>

<style lang="postcss">
</style>
