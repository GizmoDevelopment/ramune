<template>
	<div v-if="show">
		<div class="show-information">
			<img class="husk-dark show-poster" :src="show.poster_url">
			<div class="show-details">
				<h1 class="heading show-title">{{ show.title }}</h1>
				<div class="show-stats">
					<!-- <ShowScoreLabel class="show-score" :score="show.score" /> -->
					<div class="show-episode-count">{{ episodeCount }} Episodes</div>
				</div>
				<p class="show-description">{{ formattedDescription }}</p>
			</div>
		</div>
		<ShowSeasonList
			:show="show"
		/>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import ShowSeasonList from "@components/show/ShowSeasonList.vue";

	// Types
	import { Show, Season } from "@typings/show";

	export default defineComponent({
		name: "ShowInformation",
		components: {
			ShowSeasonList
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
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main.scss";

	.show-information {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		margin-top: 1rem;
	}

	.show-poster {
		width: auto;
		min-width: calc(280px * .65);
		height: 280px;
		border-radius: variable(card-border-radius);
	}

	.show-details {
		margin-left: 20px;
	}

	.show-title {
		margin-top: .2rem;
		margin-bottom: 10px;
	}

	.show-stats {

		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		* {
			margin-right: 10px;
		}
	}

	.show-episode-count {
		background-color: variable(primary-color);
		border: 2px solid variable(primary-color);
		border-radius: 20px;
		padding-left: 8px;
		padding-right: 8px;
		font-weight: bold;
		font-size: 1.1rem;
	}

	.show-description {
		font-size: 1rem;
		text-align: left;
		white-space: pre-line;
	}

	@media only screen and (max-width: 800px) {
		.show-poster {
			min-width: calc(190px * .65);
			height: 190px;
		}
	}

	@media only screen and (max-width: 600px) {
		.show-description {
			display: none;
		}
	}

</style>