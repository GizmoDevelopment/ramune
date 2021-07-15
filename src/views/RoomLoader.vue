<template>
	<div>
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<div v-if="room">
			<RoomView
				:room="room"
				@leave-room="leaveRoom()"
			/>
		</div>
		<div v-else-if="connectError || status">
			<h3 class="faded">{{ connectError || status }}</h3>
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

	// Views
	import RoomView from "@views/RoomView.vue";

	// Types
	import { Room } from "@typings/room";
	import { SocketResponse } from "@typings/main";
	import { AuthenticatedUser } from "gizmo-api/lib/types";

	export default defineComponent({
		name: "Room",
		components: {
			LoadingBuffer,
			RoomView
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
				leaving: false
			};
		},
		computed: {
			user (): AuthenticatedUser | null {
				return this.$store.state.user;
			},
			room (): Room | null {
				return this.$store.state.room;
			},
			connectError (): string {
				return this.$store.state.connectError;
			}
		},
		watch: {
			user (newUser: AuthenticatedUser) {
				if (newUser) this.joinRoom();
			},
			room (newRoom: Room | null) {
				if (!newRoom) {
					this.$router.push("/rooms");
				}
			}

		},
		mounted () {
			if (this.user) {
				if (this.room?.id !== this.roomId) {
					this.joinRoom();
				}
			} else {
				this.status = "You must be logged in to join a room.";
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