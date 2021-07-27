<template>
	<div>
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<div class="heading-bar">
			<h1 class="heading">Rooms</h1>
			<div v-if="rooms">
				<button class="primary-button icon-button" @click="isCreatingRoom = true">
					<Plus class="plus-icon" />
				</button>
			</div>
		</div>
		<div v-if="user">
			<div v-if="rooms">
				<div v-if="rooms.length > 0" class="room-list">
					<div
						v-for="room in rooms"
						:key="room.id"
						class="room-card"
					>
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
			<div v-else-if="connectError">
				<h3 class="faded">{{ connectError }}</h3>
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
	import Plus from "@assets/icons/plus.svg?component";

	// Utils
	import { clearPageTitle } from "@utils/dom";

	// Types
	import { PartialRoom } from "@typings/room";
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
				rooms: null as PartialRoom[] | null,
				isCreatingRoom: false,
				roomRefreshInterval: 0
			};
		},
		computed: {
			user () {
				return this.$store.state.user;
			},
			connectError (): string {
				return this.$store.state.connectError;
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
			this.roomRefreshInterval = window.setInterval(this.fetchRooms, 2000);
		},
		beforeUnmount () {
			clearInterval(this.roomRefreshInterval);
		},
		methods: {
			fetchRooms () {
				if (this.user) {
					this.$socket.client.emit("CLIENT:FETCH_ROOMS", (res: SocketResponse<PartialRoom[]>) => {
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

	.heading-bar {
		width: 100%;
		display: inline-flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.plus-icon {
		font-size: 1.2em;
	}

	.room-list {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	}

	.room-card {
		margin-right: .5rem;
	}

</style>