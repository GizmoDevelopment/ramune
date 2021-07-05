<template>
	<h1>Idk what to put here :(</h1>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Utils
	import { clearPageTitle } from "@utils/dom";

	export default defineComponent({
		name: "Home",
		mounted () {
			clearPageTitle();
		}
	});

</script>

<style scoped>

</style>