<template>
	<div ref="episodePickerContainer" class="episode-picker-container">
		<div v-if="show.seasons.length > 1" class="title-bar">
			<Dropdown
				class="dropdown"
				:variant="variant"
				:items="seasonList"
				:current-index="currentSeasonIndex"
				@select-index="selectSeason"
			>
				<template #default="slotProps">
					<span>{{ $t('labels/season_index', [ [ "%N%", slotProps.key + 1 ] ]) }}</span>
				</template>
			</Dropdown>
		</div>
		<div v-else class="no-title-bar-spacer" />
		<div class="episode-list">
			<ShowEpisodeCard
				v-for="(episode, index) in currentSeason.episodes"
				:id="index + 1"
				:key="`${show.id}-${episode.id}`"
				:episode="episode"
				:active="episode.id === currentEpisodeId"
				:width="episodeCardWidth"
				@select-episode="selectEpisode"
			/>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, type PropType, ref } from "vue";

	// Components
	import Dropdown from "@components/Dropdown.vue";
	import ShowEpisodeCard from "@components/show/ShowEpisodeCard.vue";

	// Mixins
	import MainMixin from "@mixins/Main";
	import GenericMixin from "@mixins/Generic";

	// Utils
	import { getSeasonIndexFromEpisodeId } from "@utils/show";

	// Types
	import type { Season, Show } from "@typings/show";
	import type { SocketResponse } from "@typings/main";
	import type { Room } from "@typings/room";

	export default defineComponent({
		name: "ShowEpisodePicker",
		components: {
			Dropdown,
			ShowEpisodeCard
		},
		mixins: [ MainMixin, GenericMixin ],
		props: {
			show: {
				type: Object as PropType<Show>,
				required: true
			},
			currentEpisodeId: {
				type: Number,
				default: 0
			},
			rowCount: {
				type: Number,
				default: 6
			}
		},
		setup () {

			const episodePickerContainer = ref<HTMLDivElement>();

			return {
				episodePickerContainer
			};
		},
		data () {
			return {
				currentSeasonIndex: 0,
				seasonList: [] as string[]
			};
		},
		computed: {
			currentSeason (): Season {
				return this.show.seasons[this.currentSeasonIndex];
			},
			episodeCardWidth (): string {
				return this.episodePickerContainer
					? `${(this.episodePickerContainer.clientWidth / this.rowCount) - 8}px`
					: "200px";
			}
		},
		watch: {
			show: {
				immediate: true,
				handler () {
					this.currentSeasonIndex = getSeasonIndexFromEpisodeId(this.show, this.currentEpisodeId) || 0;
					this.seasonList = new Array(this.show.seasons.length).fill("labels/season");
				}
			}
		},
		methods: {
			selectSeason (seasonIndex: number) {
				this.currentSeasonIndex = seasonIndex;
			},
			selectEpisode (episodeId: number) {
				if (this.room && this.user && this.isHost) {

					this.$store.commit("room/UPDATE_ROOM_DATA_LOADING_STATE", true);

					this.$socket.client.emit("CLIENT:UPDATE_ROOM_DATA", { showId: this.show.id, episodeId }, (res: SocketResponse<Room>) => {
						if (res.type !== "success") {
							console.error(res.message);
						}
					});

					// Don't make the user wait to transition back to the room
					this.$router.push(`/rooms/${this.room?.id}`);
				} else {
					this.$router.push(`/watch/${this.show.id}/${episodeId}`);
				}
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main";

	.episode-picker-container {
		margin-top: 1rem;
	}

	.title-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.no-title-bar-spacer {
		margin-bottom: 3rem;
	}

	.episode-list {
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.dropdown {
		font-size: 1.2rem !important;
	}

	@media only screen and (max-width: 700px) {
		.season-title {
			font-size: 1.5rem !important;
		}
	}

</style>

<style lang="scss">

	@media only screen and (max-width: 700px) {
		.dropdown .dropdown-currently-selected-label {
			font-size: 1rem !important;
		}
	}

</style>
