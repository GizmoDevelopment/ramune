<template>
	<div>
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<div id="heading-bar">
			<h1 class="heading">Rooms</h1>
			<div v-if="rooms">
				<button class="button" @click="isCreatingRoom = true">
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
					<Error text="There are no active rooms" />
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
			<Error text="You must be logged in to view this page" />
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import Error from "@components/Error.vue";
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import RoomCard from "@components/RoomCard.vue";
	import RoomCreationPopup from "@components/RoomCreationPopup.vue";

	// Icons
	import Plus from "@assets/icons/plus.svg";

	// Types
	import { Room } from "@typings/room";
	import { SuccessResponse, ErrorResponse } from "@typings/main";

	export default defineComponent({
		name: "Rooms",
		components: {
			Error,
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

			this.fetchRooms();

		},
		methods: {
			fetchRooms () {
				if (this.user) {
					this.$socket.emit("CLIENT:FETCH_ROOMS", (res: SuccessResponse<Room[]> | ErrorResponse) => {
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