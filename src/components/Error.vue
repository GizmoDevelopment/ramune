<template>
	<h3 class="opaque-label">{{ label }}</h3>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "Error",
		props: {
			text: {
				type: String,
				default: "Something went wrong"
			}
		},
		data () {
			return {
				label: "" as string
			};
		},
		mounted () {
			if (parseInt(this.text) > 0) {
				switch (parseInt(this.text)) {
					case 404:
						this.label = "Not found :(";
						break;
					default:
						this.label = this.text;
				}
			} else {
				this.label = this.text;
			}
		}
	});

</script>
