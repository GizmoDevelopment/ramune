<template>
	<div>
		<h1 class="heading">Rooms</h1>
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

	// Types
	import { Room } from "@typings/room";
	import { SuccessResponse, ErrorResponse } from "@typings/index";

	export default defineComponent({
		name: "Rooms",
		components: {
			Error,
			LoadingBuffer,
			RoomCard
		},
		data () {
			return {
				rooms: null as Room[] | null
			};
		},
		computed: {
			user () {
				return this.$store.state.user;
			}
		},
		mounted () {

			this.$socket.emit("client:fetch_rooms", ({ type, message, data }: SuccessResponse<Room[]> | ErrorResponse) => {
				if (type === "success" && data) {
					this.rooms = data;
				} else {
					console.error(message);
				}
			});

		}
	});

</script>
