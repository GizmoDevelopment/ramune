<template>
	<div>
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
				<PopupCard
					id="form"
					title="Create a room"
					align="left"
					:visible="isCreatingRoom"
					@dismiss="isCreatingRoom = false"
				>
					<div class="form-row">
						<p>Room name</p>
						<Input
							class="input-dark"
							type="text"
							placeholder="Anime Night"
							@update="generateRoomPreview"
						/>
					</div>
					<div id="room-preview-container" class="form-row">
						<p>Preview</p>
						<div v-if="roomPreviewObject">
							<RoomCard
								:room="roomPreviewObject"
							/>
						</div>
					</div>
					<div id="create-room-button">
						<button class="button">Create</button>
					</div>
				</PopupCard>
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
	import PopupCard from "@components/PopupCard.vue";
	import Input from "@components/Input.vue";

	// Icons
	import Plus from "@assets/icons/plus.svg";

	// Utils
	import { getUserFromAuthenticatedUser } from "@utils/user";

	// Types
	import { Room } from "@typings/room";
	import { SuccessResponse, ErrorResponse } from "@typings/index";

	export default defineComponent({
		name: "Rooms",
		components: {
			Error,
			LoadingBuffer,
			RoomCard,
			Plus,
			PopupCard,
			Input
		},
		data () {
			return {
				rooms: null as Room[] | null,
				isCreatingRoom: false,
				roomPreviewObject: null as Room | null
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

			this.generateRoomPreview("anime night");

		},
		methods: {
			generateRoomPreview (roomName: string) {
				if (this.user) {
					this.roomPreviewObject = {
						id: "",
						name: roomName,
						host: getUserFromAuthenticatedUser(this.user),
						users: [ getUserFromAuthenticatedUser(this.user) ],
						data: null
					};
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

	.form-row {
		width: 100%;
		display: inline-flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
	}

	.form-row * {
		margin-right: .5em;
	}

	.form-row p {
		font-size: 1.2em;
	}

	#create-room-button {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	#create-room-button button {
		width: 50%;
	}

	#room-preview-container {
		display: block;
		margin-bottom: 2em;
	}

	#room-preview-container * {
		width: 100%;
	}

	#room-preview-container p {
		text-align: left;
	}

</style>