<template>
	<div class="episode-container">
		<div class="thumbnail-container">
			<img
				class="husk-dark episode-thumbnail"
				:src="episode.thumbnail_url"
				alt="Episode thumbnail"
			>
			<div class="episode-info">
				<div class="episode-index">{{ id }}</div>
				<div class="episode-duration">{{ formattedDuration }}</div>
			</div>
			<div
				:class="{ 'active-episode': active }"
				class="overlay hover-opacity"
				@click="$emit('select-episode', episode.id)"
			>
				<Play class="overlay-play-icon" />
			</div>
		</div>
		<p class="episode-title">{{ episode.title }}</p>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Icons
	import Play from "@assets/icons/play.svg?component";

	// Utils
	import { formatTimestamp } from "@utils/essentials";

	// Types
	import { Episode } from "@typings/show";

	export default defineComponent({
		name: "ShowEpisodeCard",
		components: {
			Play
		},
		props: {
			id: {
				type: Number,
				required: true
			},
			episode: {
				type: Object as PropType<Episode>,
				required: true
			},
			active: {
				type: Boolean,
				default: false
			}
		},
		emits: [ "select-episode" ],
		computed: {
			formattedDuration (): string {
				if (this.episode.duration) {
					return formatTimestamp(this.episode.duration);
				} else {
					return "00:00";
				}
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main.scss";

	// Variables
	$card-width: 200px;
	$card-height: calc(#{$card-width} * .56);

	.episode-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: $card-width;
		padding: 4px;
	}

	.thumbnail-container {
		position: relative;
		display: block;
		width: $card-width;
		height: $card-height;
	}

	.episode-thumbnail {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: variable(card-border-radius);
	}

	.overlay-container,
	.episode-info {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.overlay-play-icon {
		font-size: 4em;
	}

	.episode-info {

		width: calc(100% - .4rem);
		height: calc(100% - .4rem);
		margin: .2rem;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;

		* {
			background-color: variable(overlay-background-color);
			border-radius: variable(card-border-radius);
			font-weight: 400;
			padding: 1px .2rem 1px .2rem;
		}
	}

	.episode-title {
		margin-top: 3px;
		width: calc(100% - 4px);
		text-align: left;
		min-height: 40px;
	}

	.active-episode {
		opacity: 1;
		cursor: pointer;
	}

	@media only screen and (max-width: 700px) {

		$card-width: 150px;
		$card-height: calc(#{$card-width} * .56);

		.episode-container {
			width: $card-width;
		}

		.thumbnail-container {
			width: $card-width;
			height: $card-height;
		}

	}

</style>