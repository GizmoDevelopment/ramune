<template>
	<Popup
		title="Verification"
		:visible="visible"
		@dismiss="$emit('dismiss')"
	>
		<Error
			v-if="error"
			:text="error"
		/>
		<form
			id="join-room-form"
			class="form"
			autocomplete="off"
			@submit.prevent="verifyPassword"
		>
			<Input

				v-model="password"

				type="text"
				label="Room password"
				variant="dark"
				autofocus

				:limit="50"
			/>
		</form>
		<button
			form="join-room-form"
			type="submit"
			class="button primary-button"
			:class="{ 'disabled-button': isJoinButtonDisabled }"
			@click="verifyPassword"
		>
			Enter
		</button>
	</Popup>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import Popup from "@components/popups/Popup.vue";
	import Input from "@components/Input.vue";
	import Error from "@components/Error.vue";

	// Mixins
	import RoomMethodsMixin from "@mixins/RoomMethods";

	// Types
	import { JoinRoomOptions } from "@typings/room";

	export default defineComponent({
		name: "RoomJoinPopup",
		components: {
			Popup,
			Input,
			Error
		},
		mixins: [ RoomMethodsMixin ],
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			roomId: {
				type: String,
				required: true
			}
		},
		emits: [ "dismiss" ],
		data () {
			return {
				debounce: false,
				password: "",
				error: ""
			};
		},
		computed: {
			isJoinButtonDisabled (): boolean {
				return this.password.length === 0 || this.debounce;
			}
		},
		watch: {
			visible (state: boolean) {
				if (state) this.clearPopup();
			}
		},
		methods: {
			verifyPassword () {

				if (this.isJoinButtonDisabled)
					return;

				this.debounce = true;

				const roomOptions: JoinRoomOptions = {
					id: this.roomId,
					password: this.password
				};

				this.joinRoom(roomOptions).then(() => {
					this.$emit("dismiss");
				}).catch(err => {
					this.debounce = false;
					this.error = err;
				});
			},
			clearPopup () {
				this.error = "";
				this.password = "";
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main";

	.form {

		width: 100%;
		margin-bottom: 1rem;

		* {
			width: 100%;
		}
	}

</style>