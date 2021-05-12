<template>
	<div v-if="show">
		<div id="show-information">
			<img id="show-poster" :src="show.poster_url">
			<div id="show-details">
				<h1 id="show-title" class="heading">{{ show.title }}</h1>
				<div id="show-stats">
					<ShowScoreLabel id="show-score" :score="show.score" />
					<div id="show-episode-count">{{ episodeCount }} Episodes</div>
				</div>
				<p id="show-description">{{ formattedDescription }}</p>
			</div>
		</div>
		<div id="season-container">
			<div v-for="season in show.seasons" :key="season.title">
				<ShowSeasonEpisodeList
					:season="season"
					@play-episode="playEpisode"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import ShowScoreLabel from "@components/ShowScoreLabel.vue";
	import ShowSeasonEpisodeList from "@components/ShowSeasonEpisodeList.vue";

	// Types
	import { Show, Season } from "@typings/show";

	export default defineComponent({
		name: "ShowInformation",
		components: {
			ShowScoreLabel,
			ShowSeasonEpisodeList
		},
		props: {
			show: {
				type: Object as PropType<Show>,
				required: true
			}
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
		methods: {
			playEpisode (episodeId: number) {
				this.$router.push(`/watch/${ this.show.id }/${ episodeId }`);
			}
		}
	});

</script>

<style scoped>

	#show-information {
		margin-top: 1em;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}

	#show-poster {
		border-radius: var(--card-border-radius);
		height: 280px;
		width: auto;
	}

	#show-details {
		margin-left: 20px;
	}

	#show-title {
		margin-top: .2em;
		margin-bottom: 10px;
	}

	#show-stats {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	#show-stats * {
		margin-right: 10px;
	}

	#show-score {
		background-color: var(--primary-color);
		border: 2px solid var(--primary-color);
		border-radius: 20px;
		padding-left: 6px;
		padding-right: 6px;
	}

	#show-description {
		text-align: left;
		font-size: 15px;
		white-space: pre-line;
	}

	#season-container {
		width: 100%;
	}

</style>