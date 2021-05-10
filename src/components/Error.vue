<template>
	<h3 class="opaque-label">{{ text }}</h3>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "Error",
		props: {
			text: {
				type: String,
				required: true
			}
		}
	});

</script>
