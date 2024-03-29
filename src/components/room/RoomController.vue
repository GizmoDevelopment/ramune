<template>
	<div v-if="show && episode && videoTeleportParent">
		<teleport :to="`#${videoTeleportParent}`" :disabled="!videoTeleportParentExists">
			<Video

				:show="show"
				:episode="episode"
				:controls="isHost"

				@update="pushSync"
			/>
		</teleport>
	</div>
	<teleport :to="`#${chatTeleportParent}`" :disabled="!chatTeleportParent">
		<RoomChat :room="room" />
	</teleport>
</template>

<script lang="ts">

	// Modules
	import { defineAsyncComponent, defineComponent } from "vue";

	// Components
	import RoomChat from "@components/room/RoomChat.vue";

	// Async Components
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const Video = defineAsyncComponent(() => import("@components/Video.vue"));

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Types
	import type { RoomSyncData } from "@typings/room";
	import type { SocketResponse } from "@typings/main";

	export default defineComponent({
		name: "RoomController",
		components: {
			Video,
			RoomChat
		},
		mixins: [ RoomMixin ],
		data () {
			return {
				isFullscreen: false,
				chatTeleportParent: null as string | null
			};
		},
		computed: {
			videoTeleportParent (): string | null {
				return this.$store.state.room.roomVideoTeleportParent;
			},
			allowControls (): boolean {
				return this.videoTeleportParent === "room-video-container";
			},
			videoTeleportParentExists (): boolean {
				return this.videoTeleportParent !== null && document.getElementById(this.videoTeleportParent) !== null;
			}
		},
		mounted () {
			document.addEventListener("fullscreenchange", this.updateFullscreenState);
		},
		beforeUnmount () {
			document.removeEventListener("fullscreenchange", this.updateFullscreenState);
		},
		methods: {
			pushSync (playing: boolean, currentTime: number, targetUserId?: number) {
				if (this.isHost) {

					const payload: RoomSyncData = {
						playing: playing,
						currentTime: currentTime
					};

					if (typeof targetUserId === "number") {
						this.$socket.client.emit("CLIENT:SYNC_ROOM_CLIENT", { data: payload, userId: targetUserId }, (res: SocketResponse<string>) => {
							if (res.type !== "success") {
								console.error(res.message);
							}
						});
					} else {
						this.$socket.client.emit("CLIENT:SYNC_ROOM", payload, (res: SocketResponse<string>) => {
							if (res.type !== "success") {
								console.error(res.message);
							}
						});
					}
				}
			},
			updateFullscreenState () {

				const fullscreenElement = document.fullscreenElement;

				this.chatTeleportParent = fullscreenElement?.id || null;
				this.isFullscreen = !!fullscreenElement;
			}
		}
	});

</script>
