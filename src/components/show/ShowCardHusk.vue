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

	@import "@styles/mixins.scss";

	.show-card {
		max-width: 170px;
	}

	.show-poster-container {
		position: relative;
		display: block;
		width: 170px;
		height: calc(170px * 1.42);
		margin-bottom: .3em;
	}

	.show-poster {
		width: inherit;
		height: inherit;
		border-radius: 5px;
	}

	.overlay-play-icon {
		font-size: 4em;
	}

	.show-information {
		display: flex;
		flex-direction: column;
		margin-bottom: 5px;
	}

	.show-title {

		@include text-wrap;

		margin-top: 0;
		margin-bottom: 5px;
		font-size: 1.1rem;
		font-weight: 500;
		text-align: left;
	}

	@media only screen and (max-width: 700px) {

		.show-card {
			max-width: 110px;
		}

		.show-poster-container {
			width: 110px;
			height: calc(110px * 1.42);
		}

		.show-title {
			font-size: .9rem;
		}
	}

</style>
