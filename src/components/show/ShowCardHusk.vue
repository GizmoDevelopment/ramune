<template>
	<div class="show-container">
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

	.show-container {
		max-width: 170px;
		padding: 5px 5px 2px 5px;
	}

	.show-poster-container {
		position: relative;
		display: block;
		width: 170px;
		height: calc(170px * 1.5);
		margin-bottom: .3em;
	}

	@media only screen and (max-width: 700px) {

		.show-container {
			max-width: 115px;
		}

		.show-poster-container {
			width: 115px;
			height: calc(115px * 1.5);
		}
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
		font-size: 18px;
		font-weight: 500;
		text-align: left;
	}

</style>
