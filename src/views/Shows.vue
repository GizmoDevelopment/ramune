<template>
	<div>
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<h1 class="heading">All Shows</h1>
		<div
			v-if="shows.length > 0"
			class="show-container"
		>
			<div v-for="show in shows" :key="show.id">
				<ShowCard
					:show="show"
					@select-show="selectShow"
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
		<ShowInformationPopup
			:show-id="selectedShowId"
			@dismiss="selectShow('')"
		/>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import ShowCard from "@components/show/ShowCard.vue";
	import ShowCardHusk from "@components/show/ShowCardHusk.vue";
	import ShowInformationPopup from "@components/show/ShowInformationPopup.vue";

	// Utils
	import { getShows } from "@utils/api";
	import { clearPageTitle } from "@utils/dom";

	// Types
	import { ShowHusk } from "@typings/show";

	export default defineComponent({
		name: "Shows",
		components: {
			ShowCard,
			ShowCardHusk,
			ShowInformationPopup
		},
		props: {
			showId: {
				type: String,
				default: ""
			}
		},
		data () {
			return {
				shows: [] as ShowHusk[],
				selectedShowId: ""
			};
		},
		computed: {
			showList (): ShowHusk[] {
				return this.$store.state.cache.showList;
			}
		},
		async mounted () {

			clearPageTitle();

			if (this.showId) {
				this.selectShow(this.showId);
			}

			if (this.showList.length > 0) {
				this.shows = this.showList;
			} else {
				this.shows = await getShows();
				this.$store.commit("cache/CACHE_SHOW_LIST", this.shows);
			}

		},
		methods: {
			selectShow (showId: string) {
				if (showId) {
					this.selectedShowId = showId;
					this.$router.push(`/shows/${ showId }`);
				} else {
					this.selectedShowId = "";
					this.$router.push("/shows");
					clearPageTitle();
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