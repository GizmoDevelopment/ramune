<template>
	<div>
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<div class="heading-container">
			<h1 class="heading">{{ $t("views/shows") }}</h1>
			<Input
				v-model="searchQuery"
				:placeholder="$t('inputs/search')"
				:enabled="allShows.length > 0"
			>
				<SearchIcon />
			</Input>
		</div>
		<div v-if="shows.length > 0" class="show-container">
			<ShowCard
				v-for="show in shows"
				:key="show.id"
				class="show-card"
				:show="show"
				@select-show="selectShow"
			/>
		</div>
		<h3 v-else-if="isSearching && searchedShows.length === 0" class="faded">{{ $t("errors/nothing_found") }} :(</h3>
		<div v-else class="show-container">
			<ShowCardHusk
				v-for="(_, index) in new Array(16)"
				:key="index"
				class="show-card"
			/>
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
	import { filter } from "fuzzaldrin";

	// Components
	import ShowCard from "@components/show/ShowCard.vue";
	import ShowCardHusk from "@components/husks/ShowCardHusk.vue";
	import ShowInformationPopup from "@components/popups/ShowInformationPopup.vue";
	import Input from "@components/Input.vue";

	// Icons
	import SearchIcon from "@assets/icons/search.svg?component";

	// Utils
	import { getShows } from "@utils/api";
	import { clearPageTitle } from "@utils/dom";

	// Types
	import type { ShowHusk } from "@typings/show";

	export default defineComponent({
		name: "Shows",
		components: {
			ShowCard,
			ShowCardHusk,
			ShowInformationPopup,
			Input,
			SearchIcon
		},
		props: {
			showId: {
				type: String,
				default: ""
			}
		},
		data () {
			return {

				selectedShowId: "",
				searchQuery: "",

				// Lists
				allShows: [] as ShowHusk[],
				searchedShows: [] as ShowHusk[]
			};
		},
		computed: {
			showList (): ShowHusk[] {
				return this.$store.state.cache.showList;
			},
			isSearching (): boolean {
				return this.searchQuery.trim().length > 0;
			},
			shows (): ShowHusk[] {
				return this.isSearching
					? this.searchedShows
					: this.allShows;
			}
		},
		watch: {
			searchQuery (query: string) {
				this.searchedShows = filter(this.allShows, query, { key: "title" });
			}
		},
		async mounted () {

			clearPageTitle();

			if (this.showId) {
				this.selectShow(this.showId);
			}

			if (this.showList.length > 0) {
				this.allShows = this.showList;
			} else {
				this.allShows = await getShows();
				this.$store.commit("cache/CACHE_SHOW_LIST", this.allShows);
			}

		},
		methods: {
			selectShow (showId: string) {
				if (showId) {
					this.selectedShowId = showId;
					this.$router.push(`/shows/${showId}`);
				} else {
					this.selectedShowId = "";
					this.$router.push("/shows");
					clearPageTitle();
				}
			}
		}
	});

</script>

<style scoped lang="scss">

	// Transitions

	.fade-popup-overlay-enter-active,
	.fade-popup-overlay-leave-active {
		transition: opacity .4s ease;
	}

	.fade-popup-overlay-enter-from,
	.fade-popup-overlay-leave-to {
		opacity: 0;
	}

	//

	.heading-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.faded {
		font-size: 2rem;
		margin-top: 2rem;
	}

	.show-container {

		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start;

		.show-card {
			margin: 5px 5px 2px 5px;
		}
	}

	@media only screen and (max-width: 500px) {
		.show-card {
			margin: 3px 4.5px 1px 4.5px;
		}
	}

</style>

<style lang="scss">

	.heading-container .input-container {
		font-size: 1.2rem;
	}

	@media only screen and (max-width: 700px) {
		.heading-container .input-container {
			font-size: 1rem;
		}
	}

</style>