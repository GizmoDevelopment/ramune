<template>
	<div id="room-video-and-chat-container" ref="videoContainer">
		<div v-if="show && episode">
			<Video

				:show="show"
				:episode="episode"
				:controls="isHost"
				:hide-controls="!allowControls"

				@update="pushSync"
			/>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, ref } from "vue";

	// Components
	import Video from "@components/Video.vue";

	// Mixins
	import MainMixin from "@mixins/Main";
	import RoomMixin from "@mixins/Room";

	// Types
	import { RoomSyncData } from "@typings/room";
	import { SocketResponse } from "@typings/main";

	export default defineComponent({
		name: "RoomVideoController",
		components: {
			Video
		},
		mixins: [ MainMixin, RoomMixin ],
		setup () {

			const videoContainer = ref<HTMLDivElement>();

			return {
				videoContainer
			};
		},
		computed: {
			teleportParent (): string | null {
				return this.$store.state.roomVideoTeleportParent;
			},
			allowControls (): boolean {
				return this.teleportParent === "room-video-container";
			}
		},
		watch: {
			teleportParent () {
				this.updateVideoParent();
			}
		},
		mounted () {
			this.updateVideoParent();
		},
		methods: {
			updateVideoParent () {
				if (this.videoContainer) {
					if (this.teleportParent) {

						const newParentElement = document.getElementById(this.teleportParent);

						if (newParentElement) {
							this.teleportToElement(this.videoContainer, newParentElement);
						}

					} else {
						this.videoContainer.parentElement?.removeChild(this.videoContainer);
					}
				}
			},
			pushSync (playing: boolean, currentTime: number) {
				if (this.isHost) {

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
