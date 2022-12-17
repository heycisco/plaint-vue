<template>
	<div class="main-footer">
		<div class="content">
			<p>
				Издательство «<a href="https://starchenkov.pro/" target="_blank"
					>Старченков тунеядец</a
				>»
			</p>
			<p>Подписано в печать 2019 г.</p>
			<p>
				Носитель {{ screenSize.width }}x{{ screenSize.height }} уч. л. =
				1,25 усл.
			</p>
			<p>Отпечатано {{ currentYear }} г.</p>
			<p>
				Типография «<a href="https://mchost.ru/" target="_blank"
					>Буржуйский Макхост</a
				>»
			</p>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			screenSize: {
				width: '',
				height: '',
			},
			currentYear: '',
		};
	},
	methods: {
		getVal() {
			this.screenSize.width = document.documentElement.clientWidth;
			this.screenSize.height = document.documentElement.clientHeight;
		},
	},
	mounted() {
		this.currentYear = new Date().getFullYear();
		this.getVal();
		window.addEventListener('resize', this.getVal);
	},
};
</script>

<style lang="postcss"></style>
