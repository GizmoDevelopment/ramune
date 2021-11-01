<template>
	<div class="container">
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<h1 class="heading">Not Found</h1>
		<div class="mascot">
			<img
				src="/mascot/reflections.webp"
				class="reflections"
				draggable="false"
			>
			<img
				src="/mascot/lighting.webp"
				class="lighting"
				draggable="false"
			>
			<img
				src="/mascot/shading.webp"
				class="shading"
				draggable="false"
			>
			<img
				src="/mascot/base.webp"
				class="base"
				draggable="false"
			>
			<div class="flavorable color" />
		</div>
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

	@import "@styles/main";

	.container {
		position: relative;
	}

	.heading {
		font-size: 10rem;
		text-align: center;
		padding: 5rem 0 20rem 0;
		user-select: none;
	}

	@media only screen and (max-width: 1100px) {
		.heading {
			font-size: 8rem;
		}
	}

	@media only screen and (max-width: 700px) {
		.heading {
			font-size: 5rem;
		}
	}

	// Mascot

	.mascot {

		position: absolute;
		width: 390px;
		height: 390px;
		top: 10%;
		right: 20%;
		filter: drop-shadow(0 1rem 1rem rgba(255, 255, 255, .03));

		.color,
		.base,
		.shading,
		.lighting,
		.reflections {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 5%;
			left: 5%;
		}

		.color {
			background: variable(primary-color);
			mask-image: url("/mascot/color.webp");
			mask-size: contain;
			z-index: 1;
		}

		.base {
			z-index: 2;
		}

		.shading {
			mix-blend-mode: multiply;
			z-index: 3;
		}

		.lighting {
			mix-blend-mode: soft-light;
			z-index: 4;
		}

		.reflections {
			mix-blend-mode: normal;
			z-index: 5;
		}

	}

	@media only screen and (max-width: 1100px) {
		.mascot {
			width: 350px;
			height: 350px;
			right: 0;
		}
	}

	@media only screen and (max-width: 1100px) {
		.mascot {
			width: 250px;
			height: 250px;
		}
	}

</style>