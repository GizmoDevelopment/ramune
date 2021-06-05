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

			@play="sync"
			@pause="sync"
			@seeked="sync"
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
	import { RoomSyncData } from "@typings/room";

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
			syncData: {
				type: Object as PropType<RoomSyncData> | null,
				default: null
			},
			controls: {
				type: Boolean,
				default: true
			},
			requestingSync: {
				type: Boolean,
				default: false
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
		},
		watch: {
			syncData (data: RoomSyncData | null) {
				if (data && this.video) {

					this.video.currentTime = data.currentTime;

					if (data.playing) {
						this.video.play();
					} else {
						this.video.pause();
					}
					
				}
			},
			requestingSync (value: boolean) {
				if (value) {
					this.sync();
				}
			}
		},
		methods: {
			sync () {
				if (this.video) {
					setTimeout(() => {
						if (this.video) {
							this.$emit("sync", this.video.paused, this.video.currentTime);
						}
					}, 500);
				}
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