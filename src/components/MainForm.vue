<template>
	<form @submit.prevent class="plaint-form">
		<div
			class="plaint-form__wrapper"
			v-bind:class="{ blocked: !data.goNext }"
			v-if="!data.successfully"
		>
			<textarea-default
				:identifier="'message'"
				v-model:value="data.message"
				>{{ formLabels.message }}</textarea-default
			>

			<input-default
				v-model:value="data.name"
				:identifier="'name'"
				:type="'text'"
				@keydown.enter.prevent
				>{{ formLabels.name }}</input-default
			>
			<input-checkbox
				v-model:value="data.checked"
				:identifier="'criticism'"
				:criticismAccept="formLabels.criticismAccept"
				>{{ formLabels.criticism }}</input-checkbox
			>

			<div class="main-btn">
				<button-default
					class="main-btn__submit"
					type="submit"
					@click="updateFormVal"
					:style="{ marginLeft: width + 'px' }"
					>{{ formLabels.sent }}</button-default
				>

				<button-default
					class="main-btn__reset"
					type="button"
					@click="resetFormVal"
					>{{ formLabels.reset }}</button-default
				>
			</div>
		</div>
		<div class="tooltips">
			<Transition>
				<div
					class="tooltips__item"
					v-if="data.alertMessage && !data.goNext"
					:class="data.alertStyle"
				>
					<p>{{ data.alertMessage }}</p>
					<div v-if="data.answers" class="tooltips__adv">
						<button-default
							class="tooltips__adv-ignore"
							type="button"
							@click="updateFormVal(true), (scipped = 1)"
							>{{ data.answersContent.ignore }}</button-default
						>
						<button-default
							class="tooltips__adv-go"
							type="button"
							@click="data.goNext = true"
							>{{ data.answersContent.takeNote }}</button-default
						>
					</div>
				</div>
			</Transition>
		</div>
	</form>
</template>

<script>
export default {
	props: {
		dialogVariants: Array,
		formLabels: Object,
	},
	data() {
		return {
			width: '',
			data: {
				message: '',
				name: '',
				checked: false,
				alertMessage: '',
				alertStyle: '',
				answersContent: '',
				goNext: true,
				answers: false,
				successfully: false,
				scipped: '',
			},
		};
	},
	methods: {
		updateFormVal(skip) {
			let itemIndex = this.checkInputLoop(
				this.data.message.length,
				this.data.name.length,
			);
			if (skip === true) {
				itemIndex = this.checkInputLoop(this.data.message.length, 2);
			}
			let currentItem = this.dialogVariants[itemIndex - 1];
			this.data.alertMessage = currentItem.title;
			this.data.alertStyle = currentItem.style;
			this.data.answersContent = currentItem.answers;
			this.data.answers = false;
			this.data.goNext = false;
			if (currentItem.finish) {
				setTimeout(() => (this.data.goNext = true), 5000);
				return;
			}
			if (!currentItem.answers) {
				setTimeout(() => (this.data.goNext = true), 3000);
			}
			if (currentItem.answers) {
				this.data.answers = true;
			}
		},
		checkInputLoop(msg, name) {
			if (msg < 1 && name < 1) {
				return 1;
			} else if (msg < 6) {
				return 2;
			} else if (msg > 5 && name > 28) {
				return 4;
			} else if (msg > 200 && name > 0 && name < 29) {
				return 5;
			} else if (msg > 5 && name < 1 && this.scipped !== 1) {
				return 3;
			} else if (this.data.checked === false) {
				return 6;
			} else {
				this.data.successfully = true;
				this.sentData();
				return 7;
			}
		},
		sentData() {
			const toEmit = { message: this.data.message, name: this.data.name };
			this.$emit('update', toEmit);
		},
		resetFormVal() {
			this.data.message = '';
			this.data.name = '';
			this.data.checked = false;
		},
		getSize() {
			let width1 = document.querySelector('.plaint-form').offsetWidth;
			let width2 = document.querySelector('.main-btn__submit').offsetWidth;
			this.width = width1 / 2 - width2 / 2;
		},
	},
	mounted() {
		this.getSize();
		window.addEventListener('resize', this.getSize);
	},
};
</script>

<style lang="postcss">
.plaint-form {
	margin-top: var(--content-indents);
	&__wrapper {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		gap: 1em;
	}

	.main-btn {
		display: flex;
		align-items: center;
		width: 100%;
		margin-top: var(--content-indents);
		justify-content: flex-start;
		button {
			font-size: calc(var(--font-size) * 1.4);
			position: relative;
			color: #f7fbfa;
			line-height: 1;
			padding: 0.2em 0.5em;
			font-weight: 600;
			text-shadow: 0 0 1px #0000009e;
			transition: var(--transition-out) box-shadow;
			&:hover {
				transition: var(--transition-in) box-shadow;
				box-shadow: 0 1px 4px #00000085;
			}
			&:before {
				content: '';
				size: 100%;
				position: absolute;
				left: center;
				top: center;
				mix-blend-mode: color-burn;
				filter: drop-shadow(0 2px 6px var(--shadow-2-color))
					drop-shadow(0 2px 1px var(--shadow-1-color)) blur(1px);
				shape-rendering: auto;
				background: var(--c-brand);
			}
			&.main-btn__submit:hover {
				box-shadow: 0 2px 4px #000;
			}
			&.main-btn__reset {
				font-size: var(--font-size);
				color: #404040;
				margin-right: 3em;
				position: relative;
				top: 0.1em;
				&:before {
					background: #fff;
				}
			}
		}
	}
	.group {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}
	.tooltips {
		margin-top: 1em;
		&__item {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 0.3em 1em;
			gap: 0.5em;
			background: var(--c-second-4);
			border-radius: var(--border-radius);
			color: var(--c-second);
			box-shadow: var(--shadow-1);
			font-size: 82%;
			color: #000;
			border: 1px solid #0000002e;
			&.alert {
				background: var(--c-red);
			}
			&.info {
				background: var(--c-blue);
			}
			&.question {
				background: var(--c-orange);
			}
			&.success {
				background: var(--c-green);
			}
			p {
				width: 100%;
				text-align: center;
			}
		}
		&__adv {
			display: flex;
			align-items: center;
			gap: 1em;
			font-weight: 600;
			button {
				border-radius: 4px;
				padding: 0 0.5em 0.1em;
				transition: var(--transition-out) color;
				&:hover {
					color: var(--c-red);
					transition: var(--transition-in) color;
				}
			}
		}
	}
	.blocked {
		pointer-events: none;
	}
}
</style>
