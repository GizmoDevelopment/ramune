<template>
	<div class="player-container">
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<Head>
			<title v-if="show">{{ show.title }} — Episode {{ episodeId }}</title>
		</Head>
		<div v-if="show && season && episode">
			<Video
				:show="show"
				:episode="episode"
			/>
			<ShowHeading
				:show="show"
				:season="season"
				:episode="episode"
			/>
			<ShowEpisodePicker
				v-if="show.format !== 'movie'"
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
	import { defineAsyncComponent, defineComponent } from "vue";

	// Components
	import { Head } from "@vueuse/head";

	// Local Components
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import Error from "@components/Error.vue";
	import ShowHeading from "@components/show/ShowHeading.vue";
	import ShowEpisodePicker from "@components/show/ShowEpisodePicker.vue";

	// Async Components
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const Video = defineAsyncComponent(() => import("@components/Video.vue"));

	// Utils
	import { getEpisodeById, getSeasonFromEpisode } from "@utils/show";
	import { getShow } from "@utils/api";

	// Types
	import type { Show, Episode, Season } from "@typings/show";

	export default defineComponent({
		name: "Player",
		components: {
			LoadingBuffer,
			Error,
			Video,
			ShowHeading,
			ShowEpisodePicker,
			Head
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
				}
			}
		}
	});

</script>

<style lang="scss" scoped>

	.player-container {
		margin-top: 2rem;
	}

</style>

<style lang="scss">

	#video-player {
		width: 100%;
		height: auto;
	}

</style>