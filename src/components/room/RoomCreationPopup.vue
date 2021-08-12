<template>
	<PopupCard
		title="Create a room"
		align="left"
		:visible="visible"
		@dismiss="clearRoomPopup()"
	>
		<div v-if="debounce">
			<LoadingBuffer class="loading-buffer" size="small" />
		</div>
		<Error
			v-if="status && !debounce"
			:text="status"
		/>
		<form class="form" @submit.prevent="createRoom">
			<Input
				v-model="roomName"
				type="text"
				theme="dark"
				placeholder="Anime night"
				label="Name"
				autofocus
				:limit="25"
			/>
			<Input
				v-model="roomPassword"
				type="text"
				theme="dark"
				placeholder="hau~hau~ (optional)"
				label="Password"
				:limit="50"
			/>
		</form>
		<div class="room-preview-container form-row">
			<p>Preview</p>
			<div v-if="roomPreviewObject" class="room-preview">
				<RoomCard
					:room="roomPreviewObject"
					theme="dark"
				/>
			</div>
		</div>
		<button
			v-if="!debounce"
			class="primary-button"
			:class="{ 'disabled-button': isCreateButtonDisabled }"
			@click="createRoom"
		>
			Create
		</button>
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
	import { Room, CreateRoomOptions } from "@typings/room";
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
				roomName: "",
				roomPassword: "",
				roomPreviewObject: null as Room | null,
				roomOptions: { name: "" } as CreateRoomOptions,
				debounce: false,
				status: "",
				isCreateButtonDisabled: true
			};
		},
		computed: {
			user (): AuthenticatedUser | null {
				return this.$store.state.user.user;
			}
		},
		watch: {
			visible (newState: boolean) {
				if (newState) {
					this.status = "";
					this.roomName = "";
					this.roomPassword = "";
				}
			},
			roomName (newName: string) {
				this.isCreateButtonDisabled = newName.trim().length === 0;
				this.updateRoomPreview();
			},
			roomPassword () {
				this.updateRoomPreview();
			}
		},
		mounted () {
			this.updateRoomPreview();
		},
		methods: {
			updateRoomPreview () {

				if (this.roomPassword) {
					this.roomOptions = {
						name: this.roomName,
						password: this.roomPassword
					};
				} else {
					this.roomOptions = {
						name: this.roomName
					};
				}

				if (this.user) {
					this.roomPreviewObject = {
						id: "",
						name: this.roomName,
						locked: this.roomPassword.length > 0,
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

				if (this.isCreateButtonDisabled)
					return;

				this.debounce = true;

				this.$socket.client.emit("CLIENT:CREATE_ROOM", this.roomOptions, (res: SocketResponse<Room>) => {
					if (res.type === "success") {

						this.$store.commit("room/JOIN_ROOM", res.data);
						this.$emit("dismiss");

						setTimeout(() => {
							this.$router.push(`/rooms/${res.data.id}`);
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

<style scoped lang="scss">

	.form {

		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		align-content: center;

		* {
			width: 100%;
		}
	}

	.room-preview-container {

		display: block;
		width: 100%;
		margin-bottom: 2em;

		* {
			margin: 0;
			margin-bottom: .5em;
			margin-top: 1em;
		}

		p {
			text-align: left;
			margin-bottom: 0;
			font-size: 1.1em;
		}
	}

	.room-preview {

		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-top: .2em;

		> * {
			width: 100%;
			margin-top: 0;
		}
	}

	.loading-buffer {
		font-size: 2em;
	}

</style>