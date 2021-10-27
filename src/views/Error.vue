<template>
	<div>
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<h1 class="heading">404</h1>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "ErrorView"
	});

</script>

<style scoped lang="scss">

	.heading {
		font-size: 20rem;
		text-align: center;
	}

	@media only screen and (max-width: 1100px) {
		.heading {
			font-size: 10rem;
		}
	}

</style>