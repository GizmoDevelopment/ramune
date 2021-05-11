<template>
	<PopupCard @dismiss="$emit('dismiss')">
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
			<div class="season-container">
				<div v-for="season in show.seasons" :key="season.title">
					<ShowSeasonEpisodeList :season="season" />
				</div>
			</div>
		</div>
	</PopupCard>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import PopupCard from "@components/PopupCard.vue";
	import ShowScoreLabel from "@components/ShowScoreLabel.vue";
	import ShowSeasonEpisodeList from "@components/ShowSeasonEpisodeList.vue";

	// Utils
	import { changePageTitle } from "@utils/dom";

	// Types
	import { Show, Season } from "@typings/show";

	export default defineComponent({
		name: "FloatingShowCard",
		components: {
			PopupCard,
			ShowScoreLabel,
			ShowSeasonEpisodeList
		},
		props: {
			show: {
				type: Object as PropType<Show>,
				required: true
			}
		},
		emits: [ "dismiss" ],
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
		}
	});

</script>

<style scoped>

	.show-container {
		width: 1100px;
		height: 700px;
		display: flex;
		flex-direction: column;
	}

	.show-information {
		margin-top: 1em;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}

	.show-artwork {
		border-radius: var(--card-border-radius);
		height: 280px;
		width: auto;
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

	.season-container {
		overflow-y: auto;
	}

	@media only screen and (max-width: 1210px) {

		.show-container {
			width: 1000px;
		}

	}

	@media only screen and (max-width: 1100px) {

		.show-container {
			width: 900px;
		}

		.show-artwork {
			height: 200px;
		}

	}

	@media only screen and (max-width: 980px) {

		.show-container {
			width: 800px;
		}

	}

	@media only screen and (max-width: 880px) {

		.show-container {
			width: 700px;
		}

		.show-description {
			display: none;
		}

	}

	@media only screen and (max-width: 780px) {

		.show-container {
			width: 100%;
		}

	}

	@media only screen and (max-height: 770px) {

		.show-container {
			height: 90%;
		}

	}

</style>