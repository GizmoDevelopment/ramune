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
	import RoomMixin from "@mixins/Room";

	// Types
	import { RoomSyncData } from "@typings/room";
	import { SocketResponse } from "@typings/main";

	export default defineComponent({
		name: "RoomVideoController",
		components: {
			Video
		},
		mixins: [ RoomMixin ],
		setup () {

			const videoContainer = ref<HTMLDivElement>();

			return {
				videoContainer
			};
		},
		data () {
			return {
				teleportParent: "room-video-container" as string | null
			};
		},
		computed: {
			savedTeleportParent (): string | null {
				return this.$store.state.roomVideoTeleportParent;
			},
			allowControls (): boolean {
				return this.teleportParent === "room-video-container";
			}
		},
		watch: {
			savedTeleportParent (newState: string | null) {
				this.teleportParent = newState;
			},
			teleportParent () {
				this.updateVideoParent();
			}
		},
		mounted () {
			this.updateVideoParent();
		},
		methods: {
			updateVideoParent () {
				if (this.teleportParent && this.videoContainer) {

					const newParentElement = document.getElementById(this.teleportParent);

					if (newParentElement) {
						newParentElement.appendChild(this.videoContainer);
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
