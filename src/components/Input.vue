<template>
	<div id="container">
		<p v-if="label.length > 0">{{ label }}</p>
		<input

			ref="input"
			class="input"

			:type="type"
			:theme="theme"
			:placeholder="placeholder"
			:maxlength="limit"

			@input="inputChange"
		>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, ref } from "vue";

	// Mixins
	import MainMixin from "@mixins/main";

	export default defineComponent({
		name: "Input",
		mixins: [ MainMixin ],
		props: {
			placeholder: {
				type: String,
				default: "Placeholder"
			},
			limit: {
				type: Number,
				default: Infinity
			},
			label: {
				type: String,
				default: ""
			},
			type: {
				type: String,
				default: "text"
			},
			autofocus: {
				type: Boolean,
				default: false
			}
		},
		emits: [ "update" ],
		setup () {

			const input = ref<HTMLInputElement>();

			return {
				input
			};
		},
		mounted () {
			if (this.input) {
				this.input.focus();
			}
		},
		methods: {
			inputChange (e: Event) {

				const target = <HTMLInputElement>e.target;

				this.$emit("update", target.value || target.placeholder);
			}
		}
	});

</script>

<style scoped>

	#container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	#container p {
		margin-bottom: .2em;
		font-size: 1.2em;
	}

	#container input {
		width: 100%;
	}

</style>