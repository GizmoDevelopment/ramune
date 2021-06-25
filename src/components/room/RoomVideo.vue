<template>
	<div ref="roomVideoContainer">
		<div v-if="show && episode" id="room-video-container">
			<Video

				ref="video"

				:show="show"
				:episode="episode"
				:controls="controls"

				@update="pushSync"
			/>
		</div>
		<div v-if="room">
			<RoomChat :room="room" />
		</div>
		<button @click="handleFullscreen">XD</button>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType, ref } from "vue";

	// Components
	import Video from "@components/Video.vue";
	import RoomChat from "@components/room/RoomChat.vue";

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Types
	import { Room, RoomSyncData } from "@typings/room";
	import { SocketResponse } from "@typings/main";

	export default defineComponent({
		name: "RoomVideo",
		components: {
			Video,
			RoomChat
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
			}
		},
		setup () {

			const
				video = ref<HTMLVideoElement>(),
				roomVideoContainer = ref<HTMLDivElement>();

			return {
				video,
				roomVideoContainer
			};
		},
		mounted () {
			//document.addEventListener("fullscreenchange", this.handleFullscreen);
		},
		beforeUnmount () {
			//document.removeEventListener("fullscreenchange", this.handleFullscreen);
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
			},
			handleFullscreen () {
				if (this.roomVideoContainer) {
					this.roomVideoContainer.requestFullscreen();
				}
			}
		}
	});

</script>
