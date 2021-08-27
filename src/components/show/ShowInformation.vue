<template>
	<div v-if="show">
		<div class="show-information">
			<img
				class="husk-dark show-poster"
				:src="show.poster_url"
				alt="Show poster"
			>
			<div class="show-details">
				<h1 class="heading show-title">{{ show.title }}</h1>
				<div class="show-stats">
					<!-- <ShowScoreLabel class="show-score" :score="show.score" /> -->
					<div class="show-episode-count">{{ episodeCount }} Episodes</div>
				</div>
				<p class="show-description">{{ formattedDescription }}</p>
			</div>
			<img
				class="show-banner"
				:src="show.banner_url"
				draggable="false"
			>
		</div>
		<ShowEpisodePicker
			:show="show"
			:variant="'dark'"
		/>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import ShowEpisodePicker from "@components/show/ShowEpisodePicker.vue";

	// Types
	import { Show, Season } from "@typings/show";

	export default defineComponent({
		name: "ShowInformation",
		components: {
			ShowEpisodePicker
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
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		margin-top: 1rem;
		padding-bottom: 1.5rem;
	}

	.show-poster {
		width: auto;
		min-width: calc(280px * .7);
		height: 280px;
		border-radius: variable(card-border-radius);
		z-index: 1;
	}

	.show-details {
		margin-left: 20px;
		z-index: 1;
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
		font-size: 1.2rem;
		text-align: left;
		white-space: pre-line;
	}

	@media only screen and (max-width: 800px) {
		.show-poster {
			min-width: calc(190px * .7);
			height: 190px;
		}
	}

	@media only screen and (max-width: 600px) {
		.show-description {
			display: none;
		}
	}

	// Show Banner

	.show-banner {
		position: absolute;
		width: auto;
		height: calc(100% + 4em);
		left: -2em;
		top: -4em;
		border-top-left-radius: variable(popup-border-radius);
		border-top-right-radius: variable(popup-border-radius);
		-webkit-mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
		mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
		opacity: .1;
	}

</style>