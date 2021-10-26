<template>
	<div>
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<div v-if="room">
			<RoomView
				:room="room"
				@leave-room="_leaveRoom()"
			/>
		</div>
		<div v-else-if="connectError || status">
			<h3 class="faded">{{ connectError || status }}</h3>
		</div>
		<div v-else>
			<LoadingBuffer />
		</div>
		<RoomJoinPopup
			:room-id="roomId"
			:visible="joinPopupVisible"
			@dismiss="joinPopupVisible = false"
		/>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import RoomJoinPopup from "@components/popups/RoomJoinPopup.vue";

	// Mixins
	import MainMixin from "@mixins/Main";
	import RoomMethodsMixin from "@mixins/RoomMethods";

	// Views
	import RoomView from "@views/RoomView.vue";

	// Types
	import type { Room } from "@typings/room";
	import type { AuthenticatedUser } from "gizmo-api/lib/types";

	export default defineComponent({
		name: "RoomLoader",
		components: {
			LoadingBuffer,
			RoomView,
			RoomJoinPopup
		},
		mixins: [ MainMixin, RoomMethodsMixin ],
		props: {
			roomId: {
				type: String,
				required: true
			}
		},
		data () {
			return {
				status: "",
				leaving: false,
				joinPopupVisible: false
			};
		},
		computed: {
			connectError (): string {
				return this.$store.state.generic.connectError;
			},
			loginRequirement (): string {
				return this.$t("errors/login_required_room");
			}
		},
		watch: {
			user (newUser: AuthenticatedUser) {
				if (newUser) this._joinRoom();
			},
			room (newRoom: Room | null) {
				if (!newRoom) {
					this.$router.push("/rooms");
				}
			}

		},
		mounted () {
			if (this.user) {
				this._joinRoom();
			} else {
				this.status = this.loginRequirement;
			}
		},
		beforeUnmount () {
			if (this.room && this.leaving) {
				this.$store.commit("room/LEAVE_ROOM");
			}
		},
		methods: {
			_leaveRoom () {
				this.leaving = true;
				this.leaveRoom();
			},
			async _joinRoom () {
				this.joinRoom({ id: this.roomId }).catch(err => {
					switch (err) {
						case "The room requires a password.":

							this.status = this.$t("errors/room_requires_password");
							this.joinPopupVisible = true;

							break;
						case "Room doesn't exist.":
							this.status = this.$t("errors/room_not_found");
							break;
						default:
							this.status = err;
					}
				});
			}
		},
	});

</script>