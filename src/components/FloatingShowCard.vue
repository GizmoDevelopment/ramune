<template>
	<transition name="fade-overlay">
		<div
			v-if="show"
			class="overlay"
			@click="$emit('dismiss')"
		/>
	</transition>
	<transition name="slide-content">
		<div
			v-if="show"
			class="content-container"
			@click="$emit('dismiss')"
		>
			<div class="show-container" @click.stop>
				<div class="popup-title-bar">
					<Close class="popup-close-button" @click="$emit('dismiss')" />
				</div>
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
		</div>
	</transition>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import ShowScoreLabel from "@components/ShowScoreLabel.vue";
	import ShowSeasonEpisodeList from "@components/ShowSeasonEpisodeList.vue";

	// Icons
	import Close from "@assets/icons/close.svg";

	// Types
	import { Show, Season } from "@typings/show";

	export default defineComponent({
		name: "FloatingShowCard",
		components: {
			ShowScoreLabel,
			ShowSeasonEpisodeList,
			Close
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
	});

</script>

<style scoped>

	/* Overlay & Container */

	.overlay, .content-container {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.overlay {
		background: var(--overlay-background-color);
	}

	.fade-overlay-enter-active,
	.fade-overlay-leave-active {
		transition: opacity .3s ease-in-out;
	}

	.fade-overlay-enter-from,
	.fade-overlay-leave-to {
		opacity: 0;
	}

	.content-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		overflow-y: auto;
	}

	.slide-content-enter-active,
	.slide-content-leave-active {
		transition: transform .3s ease, opacity .3s ease;
	}

	.slide-content-enter-from,
	.slide-content-leave-to {
		transform: translateY(50px);
		opacity: 0;
	}

	.show-container {
		margin-top: 5%;
		margin-bottom: 20px;
		width: 1100px;
		background-color: var(--container-background-color);
		border-radius: var(--popup-border-radius);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		padding-top: 1em;
		padding-bottom: 1em;
		padding-left: 2em;
		padding-right: 2em;
	}

	.popup-title-bar {
		width: calc(100% + 1em); /* Push into padding so the close button sits properly in the corner */
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}

	.popup-close-button {
		height: 2em;
	}

	.popup-close-button:hover {
		cursor: pointer;
	}

	/* Show Information */


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

</style>