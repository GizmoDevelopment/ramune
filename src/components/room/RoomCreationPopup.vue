<template>
	<PopupCard
		title="Create a room"
		:visible="visible"
		@dismiss="$emit('dismiss')"
	>
		<Error
			v-if="error"
			:text="error"
		/>
		<form
			id="create-room-form"
			class="form"
			autocomplete="off"
			@submit.prevent="createRoom"
		>
			<Input

				v-model="roomName"

				type="text"

				variant="dark"
				placeholder="Anime night"
				label="Name"
				autofocus

				:limit="25"
			/>
			<Input

				v-model="roomPassword"

				type="text"
				variant="dark"
				placeholder="hau~hau~ (optional)"
				label="Password"

				:limit="50"
			/>
		</form>
		<div class="room-preview-container">
			<p>Preview</p>
			<div v-if="roomPreviewObject" class="room-preview">
				<RoomCard
					:room="roomPreviewObject"
					variant="dark"
				/>
			</div>
		</div>
		<button
			form="create-room-form"
			type="submit"
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
			Error
		},
		props: {
			visible: {
				type: Boolean,
				default: false
			}
		},
		emits: [ "dismiss" ],
		data () {
			return {
				debounce: false,
				error: "",
				roomName: "",
				roomPassword: "",
				roomPreviewObject: null as Room | null
			};
		},
		computed: {
			user (): AuthenticatedUser | null {
				return this.$store.state.user.user;
			},
			isCreateButtonDisabled (): boolean {
				return this.roomName.trim().length === 0 || this.debounce;
			}
		},
		watch: {
			visible (newState: boolean) {
				if (newState) this.clearRoomPopup();
			},
			roomName () {
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

				this.error = "";
				this.roomName = "";
				this.roomPassword = "";

				this.updateRoomPreview();
			},
			createRoom () {

				if (this.isCreateButtonDisabled)
					return;

				this.debounce = true;

				const roomOptions: CreateRoomOptions = {
					name: this.roomName
				};

				if (this.roomPassword) {
					roomOptions.password = this.roomPassword;
				}

				this.$socket.client.emit("CLIENT:CREATE_ROOM", roomOptions, (res: SocketResponse<Room>) => {
					if (res.type === "success") {

						this.$store.commit("room/JOIN_ROOM", res.data);
						this.$emit("dismiss");

						setTimeout(() => {
							this.$router.push(`/rooms/${res.data.id}`);
						}, 100);

					} else {

						this.debounce = false;
						this.error = res.message;

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

		*[label="Password"] input {
			-webkit-text-security: circle;
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