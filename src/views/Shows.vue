<template>
	<div>
		<h1 class="heading">All Shows</h1>
		<div
			v-if="shows.length > 0"
			class="show-container"
		>
			<div v-for="show in shows" :key="show.id">
				<ShowCard
					:show="show"
					@click="selectShow(show)"
				/>
			</div>
		</div>
		<div
			v-else
			class="show-container"
		>
			<div v-for="(_, index) in new Array(10)" :key="index">
				<ShowCardHusk />
			</div>
		</div>
		<FloatingShowCard
			:show="selectedShow"
			@dismiss="selectShow(null)"
		/>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import ShowCard from "@components/ShowCard.vue";
	import ShowCardHusk from "@components/ShowCardHusk.vue";
	import FloatingShowCard from "@components/FloatingShowCard.vue";

	// Utils
	import { getShow, getShows } from "@utils/api";

	// Types
	import { Show } from "@typings/show";

	export default defineComponent({
		name: "Shows",
		components: {
			ShowCard,
			ShowCardHusk,
			FloatingShowCard
		},
		props: {
			showId: {
				type: String,
				default: null
			}
		},
		data () {
			return {
				shows: [] as Show[],
				selectedShow: null as Show | null
			};
		},
		async mounted () {

			const cachedShows = this.$store.state.shows;

			if (cachedShows.size > 0) {
				
				this.shows = Array.from(cachedShows.values());

			} else {

				const shows = await getShows();

				shows.forEach(show => {
					this.$store.commit("CACHE_SHOW", show);
					cachedShows.set(show.id, show);
				});

				this.shows = shows;
			}
			
			if (this.showId) {
				if (cachedShows.has(this.showId)) {
					
					const _show = cachedShows.get(this.showId);

					// TS still complains about that undefined type even after using #has()
					if (_show) {
						this.selectShow(_show);
					}

				} else {
					this.selectShow(await getShow(this.showId));
				}
			}

		},
		methods: {
			selectShow (show: Show | null) {

				this.selectedShow = show;

				if (show) {
					this.$router.push(`/shows/${ show.id }`);
				} else {
					this.$router.push("/shows");
				}

			}
		}
	});

</script>

<style scoped>

	.fade-popup-overlay-enter-active, .fade-popup-overlay-leave-active {
		transition: opacity .4s ease;
	}

	.fade-popup-overlay-enter-from, .fade-popup-overlay-leave-to {
		opacity: 0;
	}

	.show-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.show-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, .5)
	}

</style>