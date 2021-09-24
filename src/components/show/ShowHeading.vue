<template>
	<h1 class="heading show-title">{{ show.title }}</h1>
	<span v-if="show.format !=='movie'" class="faded episode-label">
		<span class="episode-index">S{{ season.id }} E{{ id }}</span>
		<span class="episode-title">{{ episode.title }}</span>
	</span>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Utils
	import { getRelativeEpisodeId } from "@utils/show";

	// Types
	import { Episode, Season, Show } from "@typings/show";

	export default defineComponent({
		name: "ShowHeading",
		props: {
			show: {
				type: Object as PropType<Show>,
				required: true
			},
			season: {
				type: Object as PropType<Season>,
				required: true
			},
			episode: {
				type: Object as PropType<Episode>,
				required: true
			}
		},
		computed: {
			id (): number {
				return getRelativeEpisodeId(this.season, this.episode);
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main.scss";

	.show-title {
		margin-top: .1em;
		margin-bottom: .2em;
	}

	.episode-index {
		color: variable(text-color);
		background-color: variable(container-background-color);
		padding-left: 8px;
		padding-right: 8px;
		margin-right: .5em;
		border: 2px solid variable(container-background-color);
		border-radius: 20px;
		font-weight: bold;
		font-size: 1em;
	}

	.episode-label {
		text-align: left;
		margin-top: 0;
		font-size: 1.25em;
	}

	@media only screen and (max-width: 570px) {

		.show-title {
			font-size: 1.6em;
			margin-bottom: .3em;
			margin-top: .2em;
		}

		.episode-index {
			font-size: 1em;
			margin-right: .1em;
		}

		.episode-label {
			font-size: 1em;
		}
	}

</style>