<template>
	<div id="room-title-bar">
		<button class="primary-button icon-button" @click="$emit('leave-room')">
			<CaretLeft />
		</button>
		<MarkdownRenderer class="heading" :content="room.name" />
	</div>
	<RoomUserList
		class="user-list"
		:room="room"
		@ctx-promote-to-host="promoteUserIdToHost"
		@ctx-kick="kickUserId"
	/>
	<br>
	<!-- This is where RoomVideoController will teleport the video element to -->
	<div id="room-video-container" />
	<div v-if="show && episode">
		<ShowHeading
			:show="show"
			:episode="episode"
		/>
		<div v-if="isHost">
			<ShowSeasonList
				:show="show"
				:selected-episode-id="episodeId"
				collapsable
			/>
		</div>
	</div>
	<div v-else>
		<h3 id="no-video-message" class="faded">Waiting for host</h3>
		<div v-if="isLoadingRoomData">
			<LoadingBuffer />
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import RoomUserList from "@components/room/RoomUserList.vue";
	import ShowSeasonList from "@components/show/ShowSeasonList.vue";
	import ShowHeading from "@components/show/ShowHeading.vue";
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import MarkdownRenderer from "@renderers/Markdown.vue";

	// Icons
	import CaretLeft from "@assets/icons/caret-left.svg?component";

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Utils
	import { setPageTitle } from "@utils/dom";

	// Types
	import { SocketResponse } from "@typings/main";
	import { Room } from "@typings/room";

	export default defineComponent({
		name: "Room",
		components: {
			RoomUserList,
			ShowSeasonList,
			CaretLeft,
			ShowHeading,
			LoadingBuffer,
			MarkdownRenderer
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
				return this.$store.state.isLoadingRoomData;
			}
		},
		mounted () {

			setPageTitle(`Ramune — ${ this.room.name }`);

			// Fix for component re-mounting during testing
			this.toggleRoomControllerState(null);

			this.$nextTick(() => {
				this.toggleRoomControllerState("room-video-container");
			});
		},
		methods: {
			kickUserId (userId: string) {
				if (this.isHost) {
					this.$socket.emit("CLIENT:KICK_USER", userId, (res: SocketResponse<string>) => {
						if (res.type !== "success") {
							console.error(res.message);
						}
					});
				}
			},
			promoteUserIdToHost (userId: string) {
				if (this.isHost) {
					this.$socket.emit("CLIENT:UPDATE_ROOM", { hostId: userId }, (res: SocketResponse<string>) => {
						if (res.type !== "success") {
							console.error(res.message);
						}
					});
				}
			}
		},
		sockets: {
			"ROOM:USER_JOIN" () {
				if (this.isHost) {
					this.$store.commit("UPDATE_ROOM_SYNC_REQUEST", true);
				}
			}
		}
	});

</script>

<style scoped>

	#room-title-bar {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	#room-title-bar > * {
		margin-right: 10px;
	}

	#no-video-message {
		font-size: 1.5rem;
	}

	@media only screen and (max-width: 800px) {
		.user-list {
			height: 2rem;
		}
	}

</style>