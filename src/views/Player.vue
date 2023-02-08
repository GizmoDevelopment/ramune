<template>
	<div class="player-container">
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<div v-if="show && season && episode">
			<Video
				:show="show"
				:episode="episode"
				@play-episode-id="navigateToEpisodeById"
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
			<Teleport to="#app">
				<transition name="splash-fade">
					<div v-show="isSplashBackgroundEnabled" class="splash-container">
						<div
							class="splash-background"
							:style="{
								backgroundImage: `url(${episode.thumbnail_url})`
							}"
						/>
					</div>
				</transition>
			</Teleport>
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

	// Local Components
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import Error from "@components/Error.vue";
	import ShowHeading from "@components/show/ShowHeading.vue";
	import ShowEpisodePicker from "@components/show/ShowEpisodePicker.vue";

	// Async Components
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const Video = defineAsyncComponent(() => import("@components/Video.vue"));

	// Mixins
	import MainMixin from "@mixins/Main";

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
			ShowEpisodePicker
		},
		mixins: [ MainMixin ],
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
		computed: {
			isSplashBackgroundEnabled (): boolean {
				return this.$store.state.settings.splashBackground;
			}
		},
		watch: {
			episodeId: {
				immediate: true,
				handler (_episodeId: number) {
					this.setEpisode(_episodeId);
					this.updateMetaTags();
				}
			},
			show: {
				immediate: true,
				handler () {
					this.updateMetaTags();
				}
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
		beforeUnmount () {
			this.setPageMetaTags({});
		},
		methods: {
			setEpisode (episodeId: number) {
				if (this.show) {

					this.episode = getEpisodeById(this.show, episodeId);

					if (this.episode) {
						this.season = getSeasonFromEpisode(this.show, this.episode);
					}
				}
			},
			updateMetaTags () {
				if (this.show) {
					this.setPageMetaTags({
						title: `${this.show.title} — Episode ${this.episodeId}`
					});
				}
			},
			navigateToEpisodeById (id: number) {
				this.$router.push(this.$route.path.replace(/(\d+?)$/, `${id}`));
			}
		}
	});

</script>

<style lang="scss" scoped>

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: .15;
		}
	}

	.splash-fade-enter-active {
		transition: opacity 0;
	}
	
	.splash-fade-leave-active {
		transition: opacity .8s ease-out;
	}

	.splash-fade-enter-from,
	.splash-fade-leave-to {
		opacity: 0;
	}

	.player-container {
		margin-top: 2rem;
	}

	.splash-container,
	.splash-background {
		height: 100%;
		top: 0;
		left: 0;
	}

	.splash-container {

		position: absolute;
		width: 100%;
		z-index: -1;

		.splash-background {

			position: absolute;
			min-width: 100%;

			background-repeat: no-repeat;
			background-size: 100% auto;
			transition: background 1s ease;

			filter: blur(50px);
			mask-image: linear-gradient(to top, transparent 0%, black 50%);

			opacity: 0;
			animation: fade-in 3s ease .1s 1;
			animation-fill-mode: forwards;

			z-index: -1;
			pointer-events: none;
		}
	}

</style>

<style lang="scss">

	#video-player {
		width: 100%;
		height: auto;
	}

</style>
