<template>
	<div id="room-title-bar">
		<h1 class="heading">{{ room.name }}</h1>
		<button class="primary-button" @click="$emit('leave-room')">Leave</button>
	</div>
	<RoomUserList :users="room.users" :host="room.host" />
	<br>
	<div v-if="show && episode">
		<div id="room-video-container" /> <!-- This is where RoomVideoController will teleport the video element to -->
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
	import RoomUserList from "@components/room/RoomUserList.vue";
	import ShowSeasonList from "@components/show/ShowSeasonList.vue";

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Utils
	import { setPageTitle } from "@utils/dom";

	// Types
	import { Room } from "@typings/room";
	import { SocketResponse } from "@typings/main";

	export default defineComponent({
		name: "Room",
		components: {
			RoomUserList,
			ShowSeasonList
		},
		mixins: [ RoomMixin ],
		props: {
			room: {
				type: Object as PropType<Room>,
				required: true
			}
		},
		emits: [ "leave-room" ],
		data () {
			return {
				isRequestingSync: false
			};
		},
		mounted () {
			setPageTitle(`Ramune — ${ this.room.name }`);
			this.toggleRoomControllerState(true);
		},
		beforeUnmount () {
			this.toggleRoomControllerState(false);
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
			"ROOM:USER_JOIN" () {
				setTimeout(() => {
					if (this.isHost) {
						this.isRequestingSync = true;
					}
				}, 500);
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