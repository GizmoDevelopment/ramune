<template>
	<div ref="videoContainer">
		<div v-if="show && episode && teleportParentExists">
			<teleport :to="`#${teleportParent}`">
				<Video

					:show="show"
					:episode="episode"
					:controls="isHost"
					:hide-controls="!allowControls"

					@update="pushSync"
				/>
			</teleport>
		</div>
		<!--<RoomChat :room="room" /> -->
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, ref } from "vue";

	// Components
	import Video from "@components/Video.vue";
	// import RoomChat from "@components/room/RoomChat.vue";

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Types
	import { RoomSyncData } from "@typings/room";
	import { SocketResponse } from "@typings/main";

	export default defineComponent({
		name: "RoomController",
		components: {
			Video,
			// RoomChat
		},
		mixins: [ RoomMixin ],
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
			},
			teleportParentExists (): boolean {
				return this.teleportParent !== null && document.getElementById(this.teleportParent) !== null;
			}
		},
		methods: {
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
