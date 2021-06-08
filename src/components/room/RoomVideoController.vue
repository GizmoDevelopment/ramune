<template>
	<div v-if="room.data">
		<RoomVideo
			ref="video"
			:room="room"
			:controls="isViewingRoom ? isHost : false"
		/>
	</div>
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
			isViewingRoom (): boolean {
				return this.$route.path.match(/^\/rooms\/.*$/i) !== null;
			},
			teleportParent (): string | null {
				return this.$store.state.roomVideoTeleportParent;
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
						console.log("reparented");
						newParentInstance.innerHTML = "";
						newParentInstance.appendChild(videoRef);
					}
				}
			}
		}
	});

</script>
