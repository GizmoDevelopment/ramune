<template>
	<div>
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<div v-if="show && season && episode">
			<ShowHeading
				:show="show"
				:season="season"
				:episode="episode"
			/>
			<Video
				:show="show"
				:episode="episode"
			/>
			<ShowEpisodePicker
				:show="show"
				:current-episode-id="episodeId"
			/>
		</div>
		<div v-else-if="status">
			<Error :text="status" />
		</div>
		<div v-else>
			<LoadingBuffer />
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import Error from "@components/Error.vue";
	import Video from "@components/Video.vue";
	import ShowHeading from "@components/show/ShowHeading.vue";
	import ShowEpisodePicker from "@components/show/ShowEpisodePicker.vue";

	// Utils
	import { getEpisodeById, getSeasonFromEpisode } from "@utils/show";
	import { getShow } from "@utils/api";
	import { setPageTitle } from "@utils/dom";

	// Types
	import { Show, Episode, Season } from "@typings/show";

	export default defineComponent({
		name: "Player",
		components: {
			LoadingBuffer,
			Error,
			Video,
			ShowHeading,
			ShowEpisodePicker
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
				season: null as Season | null,
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

			const cachedShows = this.$store.state.cache.shows;

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

					if (this.episode) {
						this.season = getSeasonFromEpisode(this.show, this.episode);
					}

					setPageTitle(`${this.show.title} — Episode ${episodeId}`);
				}
			}
		}
	});

</script>

<style scoped>

	#video-player {
		width: 100%;
		height: auto;
	}

</style>