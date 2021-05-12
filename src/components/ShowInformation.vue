<template>
	<div v-if="show && show.id === 'lol'">
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
				<ShowSeasonEpisodeList
					:season="season"
					@play-episode="playEpisode"
				/>
			</div>
		</div>
	</div>
	<div v-else>
		<div class="show-information">
			<div class="show-artwork husk" />
			<div class="show-details">
				<h1 class="heading show-title husk">This is an empty title</h1>
				<div class="show-stats">
					<div class="show-score husk">O 10</div>
					<div class="show-episode-count husk">420 Episodes</div>
				</div>
				<p class="show-description husk">"Jarvis, log on discord, then take the man with a high rank from the server Gizmo, make sure that he especially has an anime pfp. Good, now send a pipebomb to his home adress and write that its a pack from the Slovenian Government on it." </p>
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
				type: Object as PropType<Show> | null,
				default: null
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
		width: 100%;
	}

	.husk.show-artwork {
		min-width: 186px;
	}

	.husk.show-description {
		letter-spacing: 15px;
	}

</style>