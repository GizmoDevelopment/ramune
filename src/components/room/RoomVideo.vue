<template>
	<div id="room-video-and-chat-container">
		<div v-if="show && episode">
			<Video

				ref="video"

				:show="show"
				:episode="episode"
				:controls="controls"
				:hide-controls="hideControls"

				@update="pushSync"
			/>
		</div>
		<div v-else id="no-video-message-container">
			<h3 class="faded">Waiting for host</h3>
			<LoadingBuffer :size="isViewingRoom ? 'normal' : 'small'" />
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType, ref } from "vue";

	// Components
	import Video from "@components/Video.vue";
	import LoadingBuffer from "@components/LoadingBuffer.vue";

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Types
	import { Room, RoomSyncData } from "@typings/room";
	import { SocketResponse } from "@typings/main";

	export default defineComponent({
		name: "RoomVideo",
		components: {
			Video,
			LoadingBuffer
		},
		mixins: [ RoomMixin ],
		props: {
			room: {
				type: Object as PropType<Room>,
				required: true
			},
			controls: {
				type: Boolean,
				default: false
			},
			hideControls: {
				type: Boolean,
				default: false
			}
		},
		setup () {

			const video = ref<HTMLVideoElement>();

			return {
				video
			};
		},
		methods: {
			pushSync (playing: boolean, currentTime: number) {
				if (this.isHost && this.video) {

					const payload: RoomSyncData = {
						playing: playing,
						currentTime: currentTime
					};

					this.$socket.emit("CLIENT:SYNC_ROOM", payload, (res: SocketResponse<string>) => {
						if (res.type !== "success") {
							console.error(res.message);
						}
					});
				}
			}
		}
	});

</script>

<style scoped>

	#no-video-message-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	#no-video-message-container h3 {
		font-size: 1.5rem;
	}

</style>