<template>
	<div
		class="toggle-container"
		@click="state = !state"
	/>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "Toggle",
		props: {
			modelValue: {
				type: Boolean,
				default: false
			},
		},
		emits: [ "update:modelValue" ],
		data () {
			return {
				state: false
			}
		},
		computed: {
			snakeColor (): string {
				return `var(--${ this.state ? "primary-color" : "container-background-color" })`;
			},
			snakeOffset (): string {
				return this.state ? "95%" : "0%";
			}
		},
		watch: {
			modelValue: {
				immediate: true,
				handler (value: boolean) {
					this.state = value;
				},
			},
			state (value: boolean) {
				this.$emit("update:modelValue", value);
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main.scss";
	@import "@styles/variables.scss";

	.toggle-container {

		position: relative;
		width: 3.5em;
		height: 2em;

		background-color: v-bind(snakeColor);
		border-radius: 10em;

		cursor: pointer;
		transition: $flavorable-transitions;

		&:after {

			position: absolute;
			width: 1.6em;
			height: 1.6em;
			top: .2em;
			margin: 0 .2em 0 .2em;

			background-color: variable(text-color);
			border-radius: 50%;
			content: "";

			transform: translateX(v-bind(snakeOffset));
			transition: transform .25s ease;
		}
	}

</style>