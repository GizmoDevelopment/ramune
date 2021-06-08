<template>
	<div>
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<div id="heading-bar">
			<h1 class="heading">Rooms</h1>
			<div v-if="rooms">
				<button class="primary-button icon-button" @click="isCreatingRoom = true">
					<Plus class="plus-icon" />
				</button>
			</div>
		</div>
		<div v-if="user">
			<div v-if="rooms">
				<div v-if="rooms.length > 0">
					<div v-for="room in rooms" :key="room.id">
						<RoomCard :room="room" />
					</div>
				</div>
				<div v-else>
					<h3 class="faded">There are no active rooms</h3>
				</div>
				<RoomCreationPopup
					:visible="isCreatingRoom"
					@dismiss="isCreatingRoom = false"
				/>
			</div>
			<div v-else>
				<LoadingBuffer />
			</div>
		</div>
		<div v-else>
			<h3 class="faded">You must be logged in to view this page</h3>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import RoomCard from "@components/room/RoomCard.vue";
	import RoomCreationPopup from "@components/room/RoomCreationPopup.vue";

	// Icons
	import Plus from "@assets/icons/plus.svg";

	// Utils
	import { clearPageTitle } from "@utils/dom";

	// Types
	import { Room } from "@typings/room";
	import { SocketResponse } from "@typings/main";

	export default defineComponent({
		name: "Rooms",
		components: {
			LoadingBuffer,
			RoomCard,
			Plus,
			RoomCreationPopup
		},
		data () {
			return {
				rooms: null as Room[] | null,
				isCreatingRoom: false
			};
		},
		computed: {
			user () {
				return this.$store.state.user;
			}
		},
		watch: {
			user () {
				this.fetchRooms();
			}
		},
		mounted () {
			clearPageTitle();
			this.fetchRooms();
		},
		methods: {
			fetchRooms () {
				if (this.user) {
					this.$socket.emit("CLIENT:FETCH_ROOMS", (res: SocketResponse<Room[]>) => {
						if (res.type === "success") {
							this.rooms = res.data;
						} else {
							console.error(res.message);
						}
					});
				}
			}
		}
	});

</script>

<style scoped>

	#heading-bar {
		width: 100%;
		display: inline-flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.plus-icon {
		font-size: 1.2em;
	}

</style>