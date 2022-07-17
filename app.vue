<template>
	<h1>Ramune</h1>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Stores
	import { useMainStore } from "@stores/main";

	export default defineComponent({
		name: "App",
		setup () {

			const mainStore = useMainStore();

			return {
				mainStore
			};
		}
	});

</script>

<style lang="scss" scoped>

</style>