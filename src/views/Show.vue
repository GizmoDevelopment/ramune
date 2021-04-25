<template>
	<div v-if="show">
		<div class="show-container">
			<div class="show-information">
				<img :src="show.poster_url" class="show-artwork">
				<div class="show-details">
					<h1 class="heading show-title">{{ show.title }}</h1>
					<div class="show-stats">
						<ShowScoreLabel :score="show.score" class="show-score" />
						<div class="show-episode-count">{{ episodeCount }} Episodes</div>
					</div>
					<p class="show-description">{{ formattedDescription }}</p>
				</div>
			</div>
			<div v-for="season in show.seasons" :key="season.title">
				<ShowSeasonEpisodeList :season="season" />
			</div>
		</div>
	</div>
	<div v-else>
		<LoadingBuffer class="loading-buffer" />
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import ShowScoreLabel from "@components/ShowScoreLabel.vue";
	import ShowSeasonEpisodeList from "@components/ShowSeasonEpisodeList.vue";

	// Utils
	import { getShow } from "@utils/api";
	import { changePageTitle } from "@utils/dom";

	// Types
	import { Show, Season } from "@typings/types";

	export default defineComponent({
		name: "Show",
		components: {
			LoadingBuffer,
			ShowScoreLabel,
			ShowSeasonEpisodeList
		},
		props: {
			showId: {
				type: String,
				required: true
			}
		},
		data () {
			return {
				show: null as Show | null
			};
		},
		computed: {
			episodeCount (): number {
				if (this.show) {
					return this.show.seasons.reduce((total: number, curr: Season): number => {
						return total + curr.episodes.length;
					}, 0);
				} else {
					return 0;
				}
			},
			formattedDescription (): string {
				return this.show?.description?.replace(/\\n/g, "\n") || "";
			}
		},
		watch: {
			show (val: Show | null) {
				if (val) changePageTitle(val.title);
			}
		},
		async mounted () {

			const
				cachedShows = this.$store.state.shows,
				showId = this.showId.toString();

			if (cachedShows.has(showId)) {

				// No idea why it still complains about it possibly being an undefined type since it exists in the Map
				this.show = cachedShows.get(showId) || null;

			} else {

				const freshShow = await getShow(showId);

				if (freshShow) {

					this.$store.commit("CACHE_SHOW", freshShow);

					this.show = freshShow;

				}

			}

		}
	});

</script>

<style scoped>

	.loading-buffer {
		margin-top: 30vh;
	}

	@media only screen and (min-width: 800px) {
		.show-container {
			width: 80%;
			margin-left: 10%;
		}
	}

	.show-information {
		margin-top: 2.5em;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}

	.show-artwork {
		border-radius: var(--card-border-radius);
		height: 280px;
		width: auto;
	}

	@media only screen and (max-width: 800px) {

		.show-artwork {
			height: 200px;
		}

		.show-description {
			position: relative;
			height: 50%;
			overflow-y: hidden;
			text-overflow: clip;
		}

		.show-description::before {
			position: absolute;
			content: "";
			width: 100%;
			left: 0;
			bottom: 0;
			height: 70px;
			background: linear-gradient(transparent, var(--background-color));
		}

	}

	.show-details {
		margin-left: 20px;
	}

	.show-title {
		margin-top: .2em;
		margin-bottom: 10px;
	}

	.show-stats {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.show-stats * {
		margin-right: 10px;
	}

	.show-score {
		background-color: var(--primary-color);
		border: 2px solid var(--primary-color);
		border-radius: 20px;
		padding-left: 6px;
		padding-right: 6px;
	}

	.show-description {
		text-align: left;
		font-size: 15px;
		white-space: pre-line;
	}

</style>