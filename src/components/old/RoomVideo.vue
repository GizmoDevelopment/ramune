<template>
	<Video

		:show="show"
		:episode="episode"
		:controls="controls"
		:requesting-sync="requestingSync"

		@sync="sync"
	/>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import Video from "@components/Video.vue";

	// Mixins
	import RoomMixin from "@mixins/Room";

	// Types
	import { Room } from "@typings/room";

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
			requestingSync: {
				type: Boolean,
				default: false
			},
			controls: {
				type: Boolean,
				default: false
			}
		},
		emits: [ "sync" ],
		methods: {
			sync (isPaused: boolean, timestamp: number) {
				if (this.isHost) {
					
					this.$store.commit("SYNC_ROOM", { playing: !isPaused, currentTime: timestamp });

					// Propagate to parent Room view
					this.$emit("sync", isPaused, timestamp);
				}
			}
		}
	});

</script>
