<template>
	<div id="room-title-bar">
		<h1 class="heading">{{ room.name }}</h1>
		<button class="primary-button" @click="$emit('leave-room')">Leave</button>
	</div>
	<RoomUserList :users="room.users" :host="room.host" />
	<br>
	<div v-if="show && episode">
		<Video

			:show="show"
			:episode="episode"
			:sync-data="syncData"
			:controls="isHost"
			:requesting-sync="isRequestingSync"

			@sync="sync"
		/>
		<div v-if="isHost">
			<ShowSeasonList
				:show="show"
				:selected-episode-id="episodeId"
			/>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import RoomUserList from "@components/RoomUserList.vue";
	import Video from "@components/Video.vue";
	import ShowSeasonList from "@components/ShowSeasonList.vue";

	// Utils
	import { getEpisodeById } from "@utils/show";
	import { setPageTitle } from "@utils/dom";

	// Types
	import { Room, RoomSyncData } from "@typings/room";
	import { AuthenticatedUser } from "gizmo-api/lib/types";
	import { SocketResponse } from "@typings/main";
	import { Show, Episode } from "@typings/show";

	export default defineComponent({
		name: "Room",
		components: {
			RoomUserList,
			Video,
			ShowSeasonList
		},
		props: {
			room: {
				type: Object as PropType<Room>,
				required: true
			}
		},
		emits: [ "leave-room" ],
		data () {
			return {
				syncData: null as RoomSyncData | null,
				isRequestingSync: false
			};
		},
		computed: {
			user (): AuthenticatedUser | null {
				return this.$store.state.user;
			},
			show (): Show | null {
				return this.room.data?.show || null;
			},
			episodeId (): number {
				return this.room.data?.episodeId || 1;
			},
			episode (): Episode | null {
				return this.show
					? getEpisodeById(this.show, this.episodeId)
					: null;
			},
			isHost (): boolean {
				return this.room.host.id === this.user?.id;
			}
		},
		mounted () {
			setPageTitle(`Ramune — ${ this.room.name }`);
		},
		methods: {
			sync (isPaused: boolean, timestamp: number) {

				this.isRequestingSync = false;

				if (this.isHost) {
					this.$socket.emit("CLIENT:SYNC_ROOM", { playing: !isPaused, currentTime: timestamp }, (res: SocketResponse<string>) => {
						if (res.type !== "success") {
							console.error(res.message);
						}
					});
				}
			}
		},
		sockets: {
			"ROOM:SYNC" (data: RoomSyncData) {
				this.syncData = data;
			},
			"ROOM:USER_JOIN" () {
				if (this.isHost) {
					this.isRequestingSync = true;
				}
			}
		}
	});

</script>

<style scoped>

	#room-title-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

</style>