<template>
	<div class="season-container">
		<div v-for="season in show.seasons" :key="season.id">
			<ShowSeasonEpisodeList
				:season="season"
				:selected-episode-id="selectedEpisodeId"
				:expanded="season.id === expandedSeasonId"
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

	// Mixinsi
	import MainMixin from "@mixins/Main";

	// Types
	import { Show } from "@typings/show";
	import { Room } from "@typings/room";
	import { SocketResponse } from "@typings/main";

	export default defineComponent({
		name: "ShowSeasonList",
		components: {
			ShowSeasonEpisodeList
		},
		mixins: [ MainMixin ],
		props: {
			show: {
				type: Object as PropType<Show>,
				required: true
			},
			selectedEpisodeId: {
				type: Number,
				default: 0
			},
			expandedSeasonId: {
				type: Number,
				default: -1
			}
		},
		computed: {
			isHost (): boolean {
				return this.room?.host?.id === this.user?.id;
			},
			shouldCollapse (): boolean {
				return this.show.seasons.length > 1;
			}
		},
		methods: {
			playEpisode (episodeId: number) {
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

					if (this.room) {
						this.$socket.client.emit("CLIENT:LEAVE_ROOM", this.room.id, (res: SocketResponse<Room>) => {
							if (res.type === "success") {
								this.$store.commit("room/LEAVE_ROOM");
							} else {
								console.error(res.message);
							}
						});
					}

					this.$router.push(`/watch/${this.show.id}/${episodeId}`);
				}
			}
		}
	});

</script>

<style scoped>

	.season-container {
		width: 100%;
	}

</style>