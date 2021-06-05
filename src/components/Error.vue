<template>
	<h3 class="faded error">{{ label }}</h3>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "Error",
		props: {
			text: {
				type: [ String, Number ],
				required: true
			}
		},
		data () {
			return {
				label: "" as string
			};
		},
		beforeUpdate () {
			if (typeof this.text === "number" && this.text > 0) {
				switch (this.text) {
					case 404:
						this.label = "Not found :(";
						break;
					default:
						this.label = `${ this.text }`;
				}
			} else {
				this.label = `${ this.text }`;
			}
		}
	});

</script>
