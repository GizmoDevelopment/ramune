<template>
	<div id="room-title-bar">
		<button class="primary-button icon-button" @click="$emit('leave-room')">
			<CaretLeft />
		</button>
		<h1 class="heading">{{ room.name }}</h1>
	</div>
	<RoomUserList :users="room.users" :host="room.host" />
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

	// Icons
	import CaretLeft from "@assets/icons/caret-left.svg?component";

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Utils
	import { setPageTitle } from "@utils/dom";

	// Types
	import { Room } from "@typings/room";

	export default defineComponent({
		name: "Room",
		components: {
			RoomUserList,
			ShowSeasonList,
			CaretLeft,
			ShowHeading,
			LoadingBuffer
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
			this.toggleRoomControllerState("room-video-container");
		},
		beforeUnmount () {
			this.toggleRoomControllerState(null);
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

</style>