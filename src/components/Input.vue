<template>
	<div id="container">
		<p v-if="label.length > 0">{{ label }}</p>
		<input

			ref="input"
			v-model="value"

			class="input"

			:type="type"
			:theme="theme"
			:placeholder="placeholder"
			:maxlength="limit"
		>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, ref } from "vue";

	// Mixins
	import GenericMixin from "@mixins/GenericMixin";

	export default defineComponent({
		name: "Input",
		mixins: [ GenericMixin ],
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
		data () {
			return {
				value: ""
			};
		},
		watch: {
			value (newValue: string) {
				this.$emit("update", newValue);
			}
		},
		mounted () {
			if (this.input && this.autofocus) {
				this.input.focus();
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