<template>
	<div id="season-container">
		<div v-for="season in show.seasons" :key="season.title">
			<ShowSeasonEpisodeList
				:season="season"
				@play-episode="playEpisode"
			/>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import ShowSeasonEpisodeList from "@components/ShowSeasonEpisodeList.vue";

	// Types
	import { Show } from "@typings/show";

	export default defineComponent({
		name: "ShowSeasonList",
		components: {
			ShowSeasonEpisodeList
		},
		props: {
			show: {
				type: Object as PropType<Show>,
				required: true
			}
		},
		methods: {
			playEpisode (episodeId: number) {
				this.$router.push(`/watch/${ this.show.id }/${ episodeId }`);
			}
		}
	});

</script>
