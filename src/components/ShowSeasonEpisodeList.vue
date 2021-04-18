<template>
	<h2 class="season-title">{{ season.title }}</h2>
	<div class="episode-container">
		<div v-for="episode in season.episodes" :key="episode.title">
			<ShowEpisodeCard :episode="episode" />
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import ShowEpisodeCard from "@components/ShowEpisodeCard.vue";

	// Types
	import { Season } from "@typings/types";

	export default defineComponent({
		name: "ShowSeasonEpisodeList",
		components: {
			ShowEpisodeCard
		},
		props: {
			season: {
				type: Object as PropType<Season>,
				required: true
			}
		}
	});

</script>

<style scoped>

	.season-title {
		text-align: left;
	}

	.episode-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

</style>