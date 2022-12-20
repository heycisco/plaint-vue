<template>
	<div class="wrapper">
		<main-form
			v-if="ready"
			:dialogVariants="content.dialogVariants"
			@update="update($event)"
		/>
	</div>
</template>

<script>
import axios from 'axios';
import MainForm from '@/components/MainForm';
import textContent from '@/content.json';

export default {
	components: {
		MainForm,
	},
	data() {
		return {
			ready: false,
			content: textContent,
			form: {
				name: '',
				msg: '',
			},
			filtered: {
				name: '',
				msg: '',
				check: 'gAe2ae8cY8HnENtA',
			},
			message: '',
			tooltip: '',
		};
	},
	methods: {
		update(data) {
			this.form.msg = data.message;
			this.form.name = data.name;
			this.filter();
		},
		filter() {
			let name = this.form.name;
			let msg = this.form.msg;
			msg = msg.replace(/(\r\n|\r|\n)/g, '<br>');
			if (!name) {
				name = 'Аноним';
			}
			this.filtered.name = name;
			this.filtered.msg = msg;
			this.filtered = JSON.stringify(this.filtered);
			this.send();
		},
		send() {
			axios
				.post('/mail.php', this.filtered)
				.then((response) => {
					// console.log(response.data);
				})
				.catch((error) => {
					// console.log(error);
					this.$router.push('/error');
				})
				.finally(() => {
					setTimeout(() => this.$router.push('/sent'), 5000);
				});
		},
	},
	mounted() {
		this.ready = true;
	},
};
</script>

<style lang="postcss"></style>
