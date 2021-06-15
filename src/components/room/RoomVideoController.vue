<template>
	<RoomVideo
		ref="video"
		:room="room"
		:controls="allowControls ? isHost : false"
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
				visible: false
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
			teleportParent (newParent: string | null) {
				if (newParent) {
					
					const
						newParentInstance = document.getElementById(newParent),
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
