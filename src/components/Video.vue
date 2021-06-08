<template>
	<div id="video-container">
		<video

			id="video-player"
			ref="video"

			playsinline
			:controls="controls"
			controlslist="nodownload"
			preload="auto"

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
	import { defineComponent, PropType, ref } from "vue";

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
			},
			controls: {
				type: Boolean,
				default: true
			}
		},
		emits: [ "sync" ],
		setup () {
		
			const video = ref<HTMLVideoElement>();

			return {
				video
			};
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