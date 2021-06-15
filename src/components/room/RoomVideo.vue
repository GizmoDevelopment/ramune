<template>
	<div v-if="room.data">
		<Video
			:show="show"
			:episode="episode"
			:controls="controls"
		/>
	</div>
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
			controls: {
				type: Boolean,
				default: false
			}
		}
	});

</script>
