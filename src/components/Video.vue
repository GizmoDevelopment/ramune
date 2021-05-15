<template>
	<video

		id="video-player"

		playsinline
		controls

		:src="url"
		:poster="episode.thumbnail_url"
	/>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Utils
	import { getStreamURL } from "@utils/api";

	// Types
	import { Episode, Show } from "@typings/show";

	export default defineComponent({
		name: "Video",
		props: {
			show: {
				type: Object as PropType<Show>,
				required: true
			},
			episode: {
				type: Object as PropType<Episode>,
				required: true
			}
		},
		computed: {
			url (): string {
				return getStreamURL(this.show.id, this.episode.id);
			}
		}
	});

</script>
