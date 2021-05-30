<template>
	<div>
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<div v-if="room">
			<h1 class="heading">{{ room.name }}</h1>
			<RoomUserList :users="room.users" :host="room.host" />
			<button class="primary-button" @click="leaveRoom()">Leave</button>
			<div v-if="show">
				<Video />
			</div>
		</div>
		<div v-else-if="status">
			<Error :text="status" />
		</div>
		<div v-else>
			<LoadingBuffer />
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import Error from "@components/Error.vue";
	import RoomUserList from "@components/RoomUserList.vue";
	import Video from "@components/Video.vue";

	// Types
	import { Room } from "@typings/room";
	import { SocketResponse } from "@typings/main";
	import { AuthenticatedUser } from "gizmo-api/lib/types";
	import { Show } from "@typings/show";

	export default defineComponent({
		name: "Room",
		components: {
			LoadingBuffer,
			Error,
			RoomUserList,
			Video
		},
		props: {
			roomId: {
				type: String,
				required: true
			}
		},
		data () {
			return {
				status: "",
				leaving: false,
				show: null as Show | null
			};
		},
		computed: {
			user (): AuthenticatedUser | null {
				return this.$store.state.user;
			},
			room (): Room | null {
				return this.$store.state.room;
			}
		},
		watch: {
			user (newUser: AuthenticatedUser) {
				if (newUser) this.joinRoom();
			},
			room (newRoom: Room | null) {
				if (newRoom) {
					if (newRoom.data?.show) {
						this.show = newRoom.data.show;
					}
				} else {
					this.$router.push("/rooms");
				}
			}

		},
		mounted () {
			if (this.user && this.room?.id !== this.roomId) {
				this.joinRoom();
			}
		},
		beforeUnmount () {
			if (this.leaving) {
				this.$store.commit("LEAVE_ROOM");
			}
		},
		methods: {
			joinRoom () {
				this.$socket.emit("CLIENT:JOIN_ROOM", this.roomId, (res: SocketResponse<Room>) => {
					if (res.type === "success") {
						this.$store.commit("JOIN_ROOM", res.data);
					} else {
						this.status = res.message;
					}
				});
			},
			leaveRoom () {

				this.leaving = true;

				this.$socket.emit("CLIENT:LEAVE_ROOM", (res: SocketResponse<string>) => {
					if (res.type === "success") {
						this.$router.push("/rooms");
					} else {
						console.error(res.message);
						this.leaving = false;
					}
				});
			}
		}
	});

</script>