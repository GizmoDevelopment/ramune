<template>
	<h1 class="heading show-title">{{ show.title }}</h1>
	<p class="faded episode-title">Season {{ season.id }} Episode {{ id }} - {{ episode.title }}</p>
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

<style scoped>

	.show-title {
		margin-bottom: .1rem;
	}

	.episode-title {
		text-align: left;
		margin-top: 0;
		font-size: 1.25rem;
	}

	@media only screen and (max-width: 570px) {

		.show-title {
			font-size: 1.9rem;
		}

		.episode-title {
			font-size: 1rem;
		}
	}

</style>