<template>
	<div id="video-container">
		<video

			id="video-player"

			playsinline
			controls

			:src="url"
			:poster="episode.thumbnail_url"
		>
			<template v-for="(subtitleURL, language) in episode.subtitles" :key="language">
				<track
					kind="subtitles"
					:srclang="language"
					:src="subtitleURL"
					:default="language === 'en' ? true : false"
				>
			</template>
		</video>
	</div>
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

<style scoped>

	#video-player {
		width: 100%;
		height: 100%;
	}

</style>