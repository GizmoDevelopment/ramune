<template>
	<div v-if="show && episode">
		<h1 id="show-title" class="heading">{{ show.title }}</h1>
		<h3 id="episode-title" class="faded">Episode {{ episode.id }} - {{ episode.title }}</h3>
		<Video
			:show="show"
			:episode="episode"
		/>
		<ShowSeasonList
			:show="show"
			:selected-episode-id="episodeId"
		/>
	</div>
	<div v-else-if="status">
		<Error :text="status" />
	</div>
	<div v-else>
		<LoadingBuffer />
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import Error from "@components/Error.vue";
	import ShowSeasonList from "@components/show/ShowSeasonList.vue";
	import Video from "@components/Video.vue";

	// Utils
	import { getEpisodeById } from "@utils/show";
	import { getShow } from "@utils/api";
	import { setPageTitle } from "@utils/dom";

	// Types
	import { Show, Episode } from "@typings/show";

	export default defineComponent({
		name: "Player",
		components: {
			LoadingBuffer,
			Error,
			ShowSeasonList,
			Video
		},
		props: {
			showId: {
				type: String,
				required: true
			},
			episodeId: {
				type: Number,
				default: 1
			}
		},
		data () {
			return {
				show: null as Show | null,
				episode: null as Episode | null,
				status: "" as string | number
			};
		},
		watch: {
			episodeId (_episodeId: number) {
				this.setEpisode(_episodeId);
			}
		},
		async mounted () {

			const cachedShows = this.$store.state.shows;

			if (cachedShows.has(this.showId)) {
				
				const _show = cachedShows.get(this.showId);

				if (_show) {
					this.show = _show;
				} else {
					this.status = 404;
				}

			} else {

				const _show = await getShow(this.showId);

				if (_show) {
					this.show = _show;
				} else {
					this.status = 404;
				}

			}

			this.setEpisode(this.episodeId);
		},
		methods: {
			setEpisode (episodeId: number) {
				if (this.show) {
					this.episode = getEpisodeById(this.show, episodeId);
					setPageTitle(`${ this.show.title } — Episode ${ episodeId }`);
				}
			}
		}
	});

</script>

<style scoped>

	#show-title {
		margin-bottom: .1em;
	}

	#episode-title {
		text-align: left;
		margin-top: 0;
	}

	#video-player {
		width: 100%;
		height: auto;
	}

</style>