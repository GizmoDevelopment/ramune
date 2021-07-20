<template>
	<div class="show-container">
		<div class="show-poster-container">
			<div
				class="husk show-poster"
			/>
		</div>
		<div class="show-information">
			<p class="husk show-title">Kino Show Title</p>
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

<style scoped>

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
		word-wrap: normal;
		font-size: 18px;
		font-weight: 500;
		text-align: left;
		margin-top: 0;
		margin-bottom: 5px;
	}

</style>
