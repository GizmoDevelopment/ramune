<template>
	<div ref="leaf-renderer-container" />
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType, ref } from "vue";

	interface LeafRendererData {
		background?: {
			color?: string;
		}
	}

	export default defineComponent({
		name: "Leaf",
		props: {
			data: {
				type: Object as PropType<LeafRendererData>,
				required: true
			}
		},
		setup () {

			const leafRendererContainer = ref<HTMLDivElement>();

			return {
				container: leafRendererContainer
			};
		},
		beforeUpdate () {
			if (this.container) {

				let content = "";

				if (this.data.background) {

					const background = document.createElement("div");

					if (this.data.background.color) {
						background.style.backgroundColor = this.data.background.color;
					}

					content += background;
				}

				this.container.innerHTML = content;
			}
		}
	});

</script>
