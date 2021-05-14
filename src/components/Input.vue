<template>
	<input
		:type="type"
		:placeholder="placeholder"
		@input="inputChange"
	>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "Input",
		props: {
			type: {
				type: String,
				default: "text"
			},
			placeholder: {
				type: String,
				default: "Placeholder"
			}
		},
		emits: [ "update" ],
		methods: {
			inputChange (e: Event) {

				const target = <HTMLInputElement>e.target;

				this.$emit("update", target.value || target.placeholder);
			}
		}
	});

</script>
