<template>
	<div id="season-container">
		<div v-for="season in show.seasons" :key="season.id">
			<ShowSeasonEpisodeList
				:season="season"
				:selected-episode-id="selectedEpisodeId"
				:collapsable="collapsable"
				@play-episode="playEpisode"
			/>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import ShowSeasonEpisodeList from "@components/show/ShowSeasonEpisodeList.vue";

	// Types
	import { Show } from "@typings/show";
	import { Room } from "@typings/room";
	import { AuthenticatedUser } from "gizmo-api/lib/types";
	import { SocketResponse } from "@typings/main";

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
			},
			collapsable: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			room (): Room | null {
				return this.$store.state.room;
			},
			user (): AuthenticatedUser | null {
				return this.$store.state.user;
			},
			isHost (): boolean {
				return this.room?.host?.id === this.user?.id;
			}
		},
		methods: {
			playEpisode (episodeId: number) {
				if (this.room && this.user && this.isHost) {

					this.$store.commit("UPDATE_ROOM_DATA_LOADING_STATE", true);

					this.$socket.emit("CLIENT:UPDATE_ROOM_DATA", { showId: this.show.id, episodeId }, (res: SocketResponse<Room>) => {
						if (res.type !== "success") {
							console.error(res.message);
						}
					});

					// Don't make the user wait to transition back to the room
					this.$router.push(`/rooms/${ this.room?.id }`);

				} else {

					if (this.room) {
						this.$socket.emit("CLIENT:LEAVE_ROOM", this.room.id, (res: SocketResponse<Room>) => {
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