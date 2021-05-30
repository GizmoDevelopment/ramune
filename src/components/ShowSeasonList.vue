<template>
	<div id="season-container">
		<div v-for="season in show.seasons" :key="season.title">
			<ShowSeasonEpisodeList
				:season="season"
				:selected-episode-id="selectedEpisodeId"
				@play-episode="playEpisode"
			/>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import ShowSeasonEpisodeList from "@components/ShowSeasonEpisodeList.vue";

	// Types
	import { Show } from "@typings/show";
	import { Room } from "@typings/room";
	import { AuthenticatedUser } from "gizmo-api/lib/types";
	import { SuccessResponse, ErrorResponse } from "@typings/main";

	export default defineComponent({
		name: "ShowSeasonList",
		components: {
			ShowSeasonEpisodeList
		},
		props: {
			show: {
				type: Object as PropType<Show>,
				required: true
			},
			selectedEpisodeId: {
				type: Number,
				default: 0
			}
		},
		computed: {
			room (): Room | null {
				return this.$store.state.room;
			},
			user (): AuthenticatedUser | null {
				return this.$store.state.user;
			}
		},
		methods: {
			playEpisode (episodeId: number) {
				if (this.room && this.user && this.room.host.id === this.user.id) {
					
					this.$socket.emit("CLIENT:UPDATE_ROOM_DATA", { showId: this.show.id, episodeId }, (res: SuccessResponse<Room> | ErrorResponse) => {
						if (res.type === "success") {
							this.$router.push(`/rooms/${ this.room?.id }`);
						} else {
							console.error(res.message);
						}
					});

				} else {
					
					if (this.room) {
						this.$socket.emit("CLIENT:LEAVE_ROOM", this.room.id, (res: SuccessResponse<Room> | ErrorResponse) => {
							if (res.type === "success") {
								this.$store.commit("LEAVE_ROOM");
							} else {
								console.error(res.message);
							}
						});
					}

					this.$router.push(`/watch/${ this.show.id }/${ episodeId }`);
				}
			}
		}
	});

</script>

<style scoped>

	#season-container {
		width: 100%;
	}

</style>