<template>
	<div class="wrapper">
		<main-form
			v-if="ready"
			:dialogVariants="content.dialogVariants"
			:formLabels="content.formLabels"
			@update="update($event)"
		/>
	</div>
</template>

<script>
import axios from 'axios';
import MainForm from '@/components/MainForm';

export default {
	components: {
		MainForm,
	},
	props: {
		content: {
			type: [Object, Array],
			required: true,
		},
	},
	data() {
		return {
			ready: false,
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
