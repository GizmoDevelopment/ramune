<template>
	<div class="season-info">
		<h2 class="season-title">{{ season.title }}</h2>
		<button
			:class="expanded ? 'expand-button expand-button-active' : 'expand-button'"
			@click="toggleExpansion()"
		>
			<CaretDown />
		</button>
	</div>
	<div v-if="expanded" class="episode-list-container">
		<div
			v-for="episode in season.episodes"
			:key="episode.title"
			class="episode-container"
		>
			<ShowEpisodeCard :episode="episode" />
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import ShowEpisodeCard from "@components/ShowEpisodeCard.vue";

	// Icons
	import CaretDown from "@assets/icons/caret-down.svg";

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
			}
		},
		data: () => {
			return {
				expanded: false
			};
		},
		methods: {
			toggleExpansion () {
				this.expanded = !this.expanded;
			}
		}
	});

</script>

<style scoped>

	.season-info {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
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