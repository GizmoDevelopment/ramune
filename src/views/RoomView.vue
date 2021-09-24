<template>
	<div class="room-title-bar">
		<button class="primary-button icon-button" @click="$emit('leave-room')">
			<Caret class="leave-icon" />
		</button>
		<div class="heading inner-title-bar">
			<LockClosed v-if="room.locked" class="lock-icon" />
			<MarkdownRenderer :content="room.name" />
		</div>
	</div>
	<RoomUserList
		class="user-list"
		:room="room"
		@ctx-promote-to-host="promoteUserIdToHost"
		@ctx-kick="kickUserId"
	/>
	<br>
	<!-- This is where RoomController will teleport the video element to -->
	<div id="room-video-container" />
	<div v-if="show && season && episode">
		<ShowHeading
			:show="show"
			:season="season"
			:episode="episode"
		/>
		<div v-if="isHost">
			<ShowEpisodePicker
				:show="show"
				:current-episode-id="episodeId"
			/>
		</div>
	</div>
	<div v-else>
		<h3 class="faded no-video-message">Waiting for host</h3>
		<div v-if="isLoadingRoomData">
			<LoadingBuffer />
		</div>
	</div>
	<PopupCard
		:visible="!$socket.connected"
		:dismissable="false"
		:transparent="true"
	>
		<LoadingBuffer />
	</PopupCard>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import RoomUserList from "@components/room/RoomUserList.vue";
	import ShowEpisodePicker from "@components/show/ShowEpisodePicker.vue";
	import ShowHeading from "@components/show/ShowHeading.vue";
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import PopupCard from "@components/PopupCard.vue";
	import MarkdownRenderer from "@renderers/Markdown.vue";

	// Icons
	import Caret from "@assets/icons/caret.svg?component";
	import LockClosed from "@assets/icons/lock-closed.svg?component";

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Utils
	import { setPageTitle } from "@utils/dom";

	// Types
	import { SocketResponse } from "@typings/main";
	import { Room } from "@typings/room";

	export default defineComponent({
		name: "RoomView",
		components: {
			RoomUserList,
			ShowEpisodePicker,
			Caret,
			ShowHeading,
			LoadingBuffer,
			MarkdownRenderer,
			LockClosed,
			PopupCard
		},
		mixins: [ RoomMixin ],
		props: {
			room: {
				type: Object as PropType<Room>,
				required: true
			}
		},
		emits: [ "leave-room" ],
		computed: {
			isLoadingRoomData (): boolean {
				return this.$store.state.room.isLoadingRoomData;
			}
		},
		mounted () {

			setPageTitle(`Ramune — ${this.room.name}`);

			this.$store.commit("room/UPDATE_ROOM_CONTROLLER_STATE", "room-video-container");
		},
		methods: {
			kickUserId (userId: string) {
				if (this.isHost) {
					this.$socket.client.emit("CLIENT:KICK_USER", userId, (res: SocketResponse<string>) => {
						if (res.type !== "success") {
							console.error(res.message);
						}
					});
				}
			},
			promoteUserIdToHost (userId: string) {
				if (this.isHost) {
					this.$socket.client.emit("CLIENT:UPDATE_ROOM", { hostId: userId }, (res: SocketResponse<string>) => {
						if (res.type !== "success") {
							console.error(res.message);
						}
					});
				}
			}
		},
		sockets: {
			"ROOM:USER_START_TYPING" (userId: number) {
				this.$store.commit("room/USER_START_TYPING", userId);
			},
			"ROOM:USER_STOP_TYPING" (userId: number) {
				this.$store.commit("room/USER_STOP_TYPING", userId);
			}
		}
	});

</script>

<style scoped lang="scss">

	.room-title-bar {

		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: .2em;

		> * {
			margin-right: 10px;
		}

		.lock-icon {
			font-size: .7em;
			margin-right: .2em;
		}

		.leave-icon {
			transform: rotateZ(180deg);
		}
	}

	.no-video-message {
		font-size: 1.5rem;
	}

	.inner-title-bar {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	@media only screen and (max-width: 800px) {
		.user-list {
			height: 2rem;
		}
	}

</style>