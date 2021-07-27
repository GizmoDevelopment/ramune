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

	// Mixins
	import MainMixin from "@mixins/Main";

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
		mixins: [ MainMixin ],
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
			connectError (): string {
				return this.$store.state.generic.connectError;
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
			if (this.room && this.leaving) {
				this.$store.commit("room/LEAVE_ROOM");
			}
		},
		methods: {
			joinRoom () {
				this.$socket.client.emit("CLIENT:JOIN_ROOM", this.roomId, (res: SocketResponse<Room>) => {
					if (res.type === "success") {
						this.$store.commit("room/JOIN_ROOM", res.data);
					} else {
						this.status = res.message;
					}
				});
			},
			leaveRoom () {

				this.leaving = true;

				this.$socket.client.emit("CLIENT:LEAVE_ROOM", (res: SocketResponse<string>) => {
					if (res.type !== "success") {
						this.leaving = false;
						console.error(res.message);
					}
				});
			}
		}
	});

</script>