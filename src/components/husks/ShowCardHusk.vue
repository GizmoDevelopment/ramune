<template>
	<div class="show-card">
		<div class="show-poster-container">
			<div
				class="husk show-poster"
			/>
		</div>
		<div class="show-information">
			<p class="husk show-title">Kino Show</p>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "ShowCard"
	});

</script>

<style scoped lang="scss">

	@import "@styles/mixins";
	@import "@styles/components/ShowCard";

</style>
