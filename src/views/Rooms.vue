<template>
	<div>
		<!-- SINGLE ROOT IS REQUIRED OR ELSE ROUTE TRANSITION SHITS ITSELF -->
		<div class="heading-bar">
			<h1 class="heading">{{ $t("views/rooms") }}</h1>
			<div v-if="rooms">
				<button class="primary-button icon-button" @click="isCreatingRoom = true">
					<Plus class="plus-icon" />
				</button>
			</div>
		</div>
		<div v-if="user">
			<div v-if="$socket.connected && rooms">
				<div v-if="rooms.length > 0" class="room-list">
					<RoomCard
						v-for="room in rooms"
						:key="room.id"
						class="room-card"
						:room="room"
						@request-room-password="setJoinRoomId"
					/>
				</div>
				<div v-else>
					<h3 class="faded">{{ $t("errors/no_active_rooms") }} :(</h3>
				</div>
				<RoomCreationPopup
					:visible="isCreatingRoom"
					@dismiss="isCreatingRoom = false"
				/>
				<RoomJoinPopup
					:room-id="joinRoomId"
					:visible="joinRoomId.length > 0"
					@dismiss="joinRoomId = ''"
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
			<h3 class="faded">{{ $t("errors/login_required_page") }}</h3>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import RoomCard from "@components/room/RoomCard.vue";
	import RoomCreationPopup from "@components/popups/RoomCreationPopup.vue";
	import RoomJoinPopup from "@components/popups/RoomJoinPopup.vue";

	// Mixins
	import MainMixin from "@mixins/Main";

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
			RoomCreationPopup,
			RoomJoinPopup
		},
		mixins: [ MainMixin ],
		data () {
			return {
				rooms: null as PartialRoom[] | null,
				isCreatingRoom: false,
				roomRefreshInterval: 0,
				joinRoomId: ""
			};
		},
		computed: {
			connectError (): string {
				return this.$store.state.generic.connectError;
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
			},
			setJoinRoomId (roomId: string) {
				this.joinRoomId = roomId;
			}
		}
	});

</script>

<style scoped lang="scss">

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
		flex-flow: row wrap;
		justify-content: flex-start;
		align-items: center;
	}

	.room-card {
		margin-right: .5rem;
	}

</style>