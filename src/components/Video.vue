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

			@seeked="pushSync"
			@pause="pushSync"
			@play="pushSync"
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
		<div v-if="episode.data?.effects?.length > 0">
			<EffectsRenderer
				:effects="episode.data.effects"
			/>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType, ref } from "vue";

	// Components
	import EffectsRenderer from "@components/EffectsRenderer.vue";

	// Utils
	import { getStreamURL } from "@utils/api";

	// Types
	import { Episode, Show } from "@typings/show";
	import { RoomSyncData } from "@typings/room";

	export default defineComponent({
		name: "Video",
		components: {
			EffectsRenderer
		},
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
		emits: [ "update" ],
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
		},
		methods: {
			pushSync () {
				if (this.video) {
					this.$emit("update", !this.video.paused, this.video.currentTime);
				}
			}
		},
		sockets: {
			"ROOM:SYNC" (data: RoomSyncData) {
				if (this.video) {

					this.video.currentTime = data.currentTime;

					if (data.playing) {
						this.video.play();
					} else {
						this.video.pause();
					}
				}
			}
		}
	});

</script>

<style scoped>

	#video-player {
		width: 100%;
		height: 100%;
		z-index: 3;
	}

</style>