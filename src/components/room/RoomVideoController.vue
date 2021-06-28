<template>
	<RoomVideo
		ref="video"
		:room="room"
		:controls="isHost"
		:hide-controls="!allowControls"
	/>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import RoomVideo from "@components/room/RoomVideo.vue";

	// Mixins
	import RoomMixin from "@mixins/Room";

	export default defineComponent({
		name: "RoomVideoController",
		components: {
			RoomVideo
		},
		mixins: [ RoomMixin ],
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
				if (this.teleportParent) {

					const
						newParentInstance = document.getElementById(this.teleportParent),
						// eslint-disable-next-line
						videoRef = (this.$refs.video as any)?.$el as HTMLElement; // I deserve to get waterboarded for this

					if (newParentInstance && videoRef) {
						newParentInstance.innerHTML = "";
						newParentInstance.appendChild(videoRef);
					}
				}
			}
		}
	});

</script>
