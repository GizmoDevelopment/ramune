<template>
	<div class="season-info">
		<h2 class="season-title">Season {{ season.id }}</h2>
		<button
			aria-label="Display episodes"
			class="expand-button"
			:class="{ 'expand-button-active': !collapsed }"
			@click="toggleExpansion()"
		>
			<CaretDown />
		</button>
	</div>
	<div v-if="!collapsed" class="episode-list-container">
		<div
			v-for="episode in season.episodes"
			:key="episode.id"
			class="episode-container"
		>
			<ShowEpisodeCard
				:episode="episode"
				:active="episode.id === selectedEpisodeId"
				@play-episode="playEpisode"
			/>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import ShowEpisodeCard from "@components/show/ShowEpisodeCard.vue";
	import CaretDown from "@assets/icons/caret-down.svg?component";

	// Types
	import { Season } from "@typings/show";

	export default defineComponent({
		name: "ShowSeasonEpisodeList",
		components: {
			ShowEpisodeCard,
			CaretDown
		},
		props: {
			season: {
				type: Object as PropType<Season>,
				required: true
			},
			selectedEpisodeId: {
				type: Number,
				default: 0
			},
			expanded: {
				type: Boolean,
				default: false
			}
		},
		emits: [ "play-episode" ],
		data: () => {
			return {
				collapsed: false
			};
		},
		watch: {
			expanded () {
				this.syncExpansion();
			}
		},
		mounted () {
			this.syncExpansion();
		},
		methods: {
			toggleExpansion () {
				this.collapsed = !this.collapsed;
			},
			syncExpansion () {
				this.collapsed = !this.expanded;
			},
			playEpisode (episodeId: number) {
				this.$emit("play-episode", episodeId);
			}
		}
	});

</script>

<style scoped>

	.season-info {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.expand-button {
		background: transparent;
		border: none;
		transition: transform .5s ease;
	}

	.expand-button-active {
		transform: rotateX(180deg);
	}

	.expand-button:hover {
		cursor: pointer;
	}

	.expand-button svg {
		width: 30px;
		height: 30px;
		fill: var(--text-color);
	}

	.season-title {
		text-align: left;
	}

	.episode-list-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.episode-container {
		margin-right: 5px;
	}

</style>