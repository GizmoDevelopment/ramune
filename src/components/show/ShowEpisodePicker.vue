<template>
	<div class="episode-picker-container">
		<div v-if="show.seasons.length > 1" class="title-bar">
			<Dropdown
				class="dropdown"
				:variant="variant"
				:entries="seasonList"
				:current-index="currentSeasonIndex"
				@select-index="selectSeason"
			/>
		</div>
		<div v-else class="no-title-bar-spacer" />
		<div class="episode-list">
			<ShowEpisodeCard
				v-for="(episode, index) in currentSeason.episodes"
				:id="index + 1"
				:key="`${show.id}-${episode.id}`"
				:episode="episode"
				:active="episode.id === currentEpisodeId"
				@select-episode="selectEpisode"
			/>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import Dropdown from "@components/Dropdown.vue";
	import ShowEpisodeCard from "@components/show/ShowEpisodeCard.vue";

	// Mixins
	import MainMixin from "@mixins/Main";
	import GenericMixin from "@mixins/Generic";

	// Utils
	import { getSeasonIndexFromEpisodeId } from "@utils/show";

	// Types
	import { Season, Show } from "@typings/show";
	import { SocketResponse } from "@typings/main";
	import { Room } from "@typings/room";

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
			}
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
			}
		},
		watch: {
			show: {
				immediate: true,
				handler () {
					this.currentSeasonIndex = getSeasonIndexFromEpisodeId(this.show, this.currentEpisodeId) || 0;
					this.seasonList = this.show.seasons.map(season => `Season ${season.id}`);
				}
			}
		},
		methods: {
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
			},
			selectSeason (seasonIndex: number) {
				this.currentSeasonIndex = seasonIndex;
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main.scss";

	.episode-picker-container {
		margin-top: 1rem;
	}

	.title-bar {

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;

		.season-title {
			font-weight: bold;
			font-size: 2rem;
		}
	}

	.no-title-bar-spacer {
		margin-bottom: 3rem;
	}

	.episode-list {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: wrap;
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