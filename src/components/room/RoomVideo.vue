<template>
	<div v-if="show && episode">
		<Video

			ref="video"

			:show="show"
			:episode="episode"
			:controls="controls"

			@update="pushSync"
		/>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType, ref } from "vue";

	// Components
	import Video from "@components/Video.vue";

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Types
	import { Room, RoomSyncData } from "@typings/room";
	import { SocketResponse } from "@typings/main";

	export default defineComponent({
		name: "RoomVideo",
		components: {
			Video
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
