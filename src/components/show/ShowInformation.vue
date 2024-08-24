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
					<div class="flavorable show-episode-count">{{ show.format === "movie" ? $t("badges/movie") : formattedEpisodeCount }}</div>
				</div>
				<p class="show-description">{{ formattedDescription }}</p>
			</div>
			<div class="show-banner" />
		</div>
		<ShowEpisodePicker
			variant="dark"
			:row-count="5"
			:show="show"
		/>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, type PropType } from "vue";

	// Components
	import ShowEpisodePicker from "@components/show/ShowEpisodePicker.vue";

	// Types
	import type { Show, Season } from "@typings/show";

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
			formattedEpisodeCount (): string {
				return this.$t("badges/episode_count", [[ "%N%", this.episodeCount ]]);
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

	@import "@styles/main";
	@import "@styles/components/ShowInformation";

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
		mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
		border-top-left-radius: variable(popup-border-radius);
		border-top-right-radius: variable(popup-border-radius);
		opacity: .1;
		pointer-events: none;
	}

</style>
