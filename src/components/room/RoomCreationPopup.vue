<template>
	<PopupCard
		id="form"
		title="Create a room"
		align="left"
		:visible="visible"
		@dismiss="clearRoomPopup()"
	>
		<div v-if="debounce">
			<LoadingBuffer id="loading-buffer" size="small" />
		</div>
		<Error
			v-if="status && !debounce"
			:text="status"
		/>
		<form class="form" @submit.prevent="createRoom">
			<Input
				type="text"
				theme="dark"
				placeholder="Anime night"
				label="Name"
				autofocus
				:limit="25"
				@update="(newRoomName) => roomName = newRoomName"
			/>
		</form>
		<div id="room-preview-container" class="form-row">
			<p>Preview</p>
			<div v-if="roomPreviewObject" id="room-preview">
				<RoomCard
					:room="roomPreviewObject"
					theme="dark"
				/>
			</div>
		</div>
		<div v-if="!debounce">
			<button class="primary-button" @click="createRoom">Create</button>
		</div>
	</PopupCard>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import RoomCard from "@components/room/RoomCard.vue";
	import PopupCard from "@components/PopupCard.vue";
	import Input from "@components/Input.vue";
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import Error from "@components/Error.vue";

	// Utils
	import { getUserFromAuthenticatedUser } from "@utils/user";

	// Types
	import { SocketResponse } from "@typings/main";
	import { Room, RoomOptions } from "@typings/room";
	import { AuthenticatedUser } from "gizmo-api/lib/types";

	export default defineComponent({
		name: "RoomCreationPopup",
		components: {
			PopupCard,
			Input,
			RoomCard,
			LoadingBuffer,
			Error
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
				roomName: "Anime night",
				roomPreviewObject: null as Room | null,
				roomOptions: { name: "" } as RoomOptions,
				debounce: false,
				status: ""
			};
		},
		computed: {
			user (): AuthenticatedUser | null {
				return this.$store.state.user;
			}
		},
		watch: {
			visible (newState: boolean) {
				if (newState) {
					this.status = "";
				}
			},
			roomName () {
				this.updateRoomPreview();
			}
		},
		mounted () {
			this.updateRoomPreview();
		},
		methods: {
			updateRoomPreview () {

				this.roomOptions = {
					name: this.roomName
				};

				if (this.user) {
					this.roomPreviewObject = {
						id: "",
						name: this.roomName,
						host: getUserFromAuthenticatedUser(this.user),
						users: [ getUserFromAuthenticatedUser(this.user) ],
						data: null
					};
				}

			},
			clearRoomPopup () {
				this.updateRoomPreview();
				this.$emit("dismiss");
			},
			createRoom () {

				this.debounce = true;

				this.$socket.emit("CLIENT:CREATE_ROOM", this.roomOptions, (res: SocketResponse<Room>) => {
					if (res.type === "success") {

						this.$store.commit("JOIN_ROOM", res.data);
						this.$emit("dismiss");

						setTimeout(() => {
							this.$router.push(`/rooms/${ res.data.id }`);
						}, 100);

					} else {

						this.debounce = false;
						this.status = res.message;

						console.error(res.message);
					}
				});

			}
		}
	});

</script>

<style scoped>

	.form {
		width: 100%;
		display: inline-flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
	}

	.form * {
		flex: 1;
	}

	#room-preview-container {
		display: block;
		width: 100%;
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
		font-size: 1.1em;
	}

	#room-preview {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-top: .2em;
	}

	#room-preview > * {
		width: 100%;
		margin-top: 0;
	}

	#loading-buffer {
		font-size: 2em;
	}

</style>