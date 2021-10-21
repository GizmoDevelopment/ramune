<template>
	<div class="input-container">
		<p v-if="label.length > 0">{{ label }}</p>
		<div
			v-if="$slots.default"
			class="input"
			:class="{ 'active': focused }"
		>
			<slot />
			<input

				ref="input"
				v-model="value"

				:alt="label"
				:type="type"
				:variant="variant"
				:placeholder="placeholder"
				:maxlength="limit"
				:name="name"
				:readonly="!enabled"

				@focus="focused = true"
				@blur="focused = false"
			>
		</div>
		<input

			v-else

			ref="input"
			v-model="value"

			class="input"

			:alt="label"
			:type="type"
			:variant="variant"
			:placeholder="placeholder"
			:maxlength="limit"
			:name="name"
			:readonly="!enabled"
		>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, ref } from "vue";

	// Mixins
	import GenericMixin from "@mixins/Generic";

	export default defineComponent({
		name: "Input",
		mixins: [ GenericMixin ],
		props: {
			modelValue: {
				type: String,
				default: ""
			},
			placeholder: {
				type: String,
				default: ""
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
			},
			name: {
				type: String,
				default: ""
			},
			enabled: {
				type: Boolean,
				default: true
			}
		},
		emits: [ "update:modelValue" ],
		setup () {

			const input = ref<HTMLInputElement>();

			return {
				input
			};
		},
		data () {
			return {
				value: "",
				focused: false
			};
		},
		watch: {
			modelValue: {
				immediate: true,
				handler (value: string) {
					this.value = value;
				}
			},
			value (value: string) {
				this.$emit("update:modelValue", value);
			}
		},
		mounted () {

			this.value = this.modelValue;

			if (this.input && this.autofocus) {
				this.input.focus();
			}
		}
	});

</script>

<style scoped lang="scss">

	.input-container {

		width: auto;
		display: flex;
		flex-direction: column;
		align-items: flex-start;

		p {
			margin-top: .6em;
			margin-bottom: .2em;
			font-size: 1.2em;
		}

		input {
			width: 100%;
		}
	}

</style>