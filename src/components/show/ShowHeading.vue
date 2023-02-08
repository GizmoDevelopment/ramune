<template>
	<div class="heading-container">
		<h1 class="heading show-title">{{ show.title }}</h1>
		<p v-if="season.source !== 'N/A'" class="source-label">{{ $t("labels/video_source") }}: <b>{{ season.source }}</b></p>
	</div>
	<span v-if="show.format !=='movie'" class="faded episode-label">
		<span class="episode-badge">S{{ season.id }} E{{ id }}</span>
		<span class="episode-title">{{ episode.title }}</span>
	</span>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Utils
	import { getRelativeEpisodeId } from "@utils/show";

	// Types
	import type { Episode, Season, Show } from "@typings/show";

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

	@import "@styles/main";

	.heading-container {

		width: 100%;
		display: inline-flex;
		justify-content: space-between;
		align-items: flex-start;

		.show-title {
			margin-top: .1em;
			margin-bottom: .2em;
		}

		.source-label {

			color: variable(faded-text-color);

			b {
				color: variable(text-color);
			}
		}
	}

	.episode-label {

		text-align: left;
		margin-top: 0;
		font-size: 1.3em;

		.episode-badge {
			color: variable(text-color);
			background-color: variable(container-background-color);
			padding-left: 8px;
			padding-right: 8px;
			border: 2px solid variable(container-background-color);
			border-radius: 20px;
			font-weight: bold;
			font-size: 1em;
		}

		.episode-title {
			margin-left: .4em;
		}
	}

	@media only screen and (max-width: 570px) {

		.show-title {
			font-size: 1.6em;
			margin-bottom: .3em;
			margin-top: .2em;
		}

		.episode-index {
			font-size: 1em;
		}

		.episode-label {
			font-size: 1em;
		}
	}

</style>
