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
			<div class="show-banner" />
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
				return this.show.description.replace(/\\n/g, "\n") || "";
			},
			bannerUrl (): string {
				return `url(${this.show.banner_url})`;
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main.scss";
	@import "@styles/components/ShowInformation.scss";

	// Show Banner

	.show-banner {
		position: absolute;
		width: calc(100% + 2em + 2em);
		height: calc(100% + 4em);
		left: -2em;
		top: -4em;
		background-image: v-bind(bannerUrl);
		background-size: cover;
		background-position: center;
		-webkit-mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
		mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
		border-top-left-radius: variable(popup-border-radius);
		border-top-right-radius: variable(popup-border-radius);
		opacity: .1;
		pointer-events: none;
	}

</style>