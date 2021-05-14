<template>
	<PopupCard
		id="form"
		title="Create a room"
		align="left"
		:visible="visible"
		@dismiss="clearRoomPopup()"
	>
		<div class="form-row">
			<p>Name</p>
			<Input
				class="input-dark"
				type="text"
				placeholder="Anime night"
				limit="25"
				@update="updateRoomPreview"
			/>
		</div>
		<div id="room-preview-container" class="form-row">
			<p>Preview</p>
			<div v-if="roomPreviewObject" id="room-preview">
				<RoomCard
					:room="roomPreviewObject"
				/>
			</div>
		</div>
		<div id="create-room-button">
			<button class="button" @click="createRoom">Create</button>
		</div>
	</PopupCard>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import RoomCard from "@components/RoomCard.vue";
	import PopupCard from "@components/PopupCard.vue";
	import Input from "@components/Input.vue";

	// Utils
	import { getUserFromAuthenticatedUser } from "@utils/user";

	// Types
	import { Room, RoomOptions } from "@typings/room";

	export default defineComponent({
		name: "RoomCreationPopup",
		components: {
			PopupCard,
			Input,
			RoomCard
		},
		props: {
			visible: {
				type: Boolean,
				default: false
			}
		},
		emits: [ "dismiss", "create-room" ],
		data () {
			return {
				roomPreviewObject: null as Room | null,
				roomOptions: { name: "" } as RoomOptions
			};
		},
		computed: {
			user () {
				return this.$store.state.user;
			}
		},
		mounted () {
			this.updateRoomPreview("Anime night");
		},
		methods: {
			updateRoomPreview (roomName: string) {
				
				this.roomOptions = {
					name: roomName
				};

				if (this.user) {
					this.roomPreviewObject = {
						id: "",
						name: roomName,
						host: getUserFromAuthenticatedUser(this.user),
						users: [ getUserFromAuthenticatedUser(this.user) ],
						data: null
					};
				}

			},
			clearRoomPopup () {
				this.updateRoomPreview("Anime night");
				this.$emit("dismiss");
			},
			createRoom () {
				this.$emit("create-room", this.roomOptions);
			}
		}
	});

</script>

<style scoped>

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

	.form-row input {
		flex: 1;
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
		margin: 0;
		margin-bottom: .5em;
		margin-top: 1em;
	}

	#room-preview-container p {
		text-align: left;
		margin-bottom: 0;
	}

	#room-preview {
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-top: 0;
	}

</style>