<template>
	<div
		id="video-container"
		ref="videoContainer"
		@mouseenter="isOverlayVisible = true"
		@mouseleave="isOverlayVisible = false"
	>
		<div id="constant-video-overlay">
			<div v-if="isBuffering">
				<LoadingBuffer />
			</div>
		</div>
		<transition name="fade">
			<div
				v-show="isOverlayVisible"
				id="video-overlay"
			>
				<div id="video-screen" @click="togglePlayPause" />
				<div v-if="!hideControls" id="video-controls">
					<transition name="fade">
						<div
							v-if="controls"
							id="play-pause-button"
							class="video-control-button"
							@click="togglePlayPause"
						>
							<div v-if="isPaused">
								<Play />
							</div>
							<div v-else>
								<Pause />
							</div>
						</div>
					</transition>
					<span id="video-timestamp">{{ videoCurrentTimestamp }}</span>
					<div
						id="progress-bar-container"
						:class="{ 'selectable-progress-bar': controls }"
						@click="changeVideoProgress"
					>
						<div id="progress-bar" :style="`width: ${ videoProgressPercentage }%`" />
					</div>
					<span id="video-duration">{{ videoDurationTimestamp }}</span>
					<Expand class="video-control-button" @click="toggleFullscreen" />
				</div>
			</div>
		</transition>
		<video

			id="video-player"
			ref="video"

			playsinline
			controlslist="nodownload"
			preload="auto"

			:src="url"
			:poster="episode.thumbnail_url"

			@seeked="updateVideoTime(); pushSync();"
			@pause="pushSync"
			@play="pushSync"
			@timeupdate="updateVideoTime"
			@waiting="isBuffering = true"
			@durationchange="updateVideoDuration"
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
	import LoadingBuffer from "@components/LoadingBuffer.vue";

	// Icons
	import Play from "@assets/icons/play.svg?component";
	import Pause from "@assets/icons/pause.svg?component";
	import Expand from "@assets/icons/expand.svg?component";

	// Utils
	import { getStreamURL } from "@utils/api";
	import { formatTimestamp } from "@utils/essentials";

	// Types
	import { Episode, Show } from "@typings/show";
	import { RoomSyncData } from "@typings/room";

	export default defineComponent({
		name: "Video",
		components: {
			EffectsRenderer,
			Play,
			Pause,
			Expand,
			LoadingBuffer
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
			},
			hideControls: {
				type: Boolean,
				default: false
			}
		},
		emits: [ "update" ],
		setup () {

			const
				video = ref<HTMLVideoElement>(),
				videoContainer = ref<HTMLDivElement>();

			return {
				video,
				videoContainer
			};
		},
		data () {
			return {
				isPaused: true,
				isOverlayVisible: false,
				videoProgressPercentage: 0,
				isBuffering: false,
				currentVideoTime: 0,
				videoDuration: 0
			};
		},
		computed: {
			url (): string {
				return getStreamURL(this.show.id, this.episode.id);
			},
			videoCurrentTimestamp (): string {
				return formatTimestamp(this.currentVideoTime);
			},
			videoDurationTimestamp (): string {
				return formatTimestamp(this.videoDuration);
			},
			isRequestingRoomSync (): boolean {
				return this.$store.state.isRequestingRoomSync;
			}
		},
		watch: {
			isRequestingRoomSync (newState: boolean) {
				if (newState) {
					this.$store.commit("UPDATE_ROOM_SYNC_REQUEST", false);
					this.pushSync();
				}
			}
		},
		methods: {
			pushSync () {
				if (this.video) {

					this.isPaused = this.video.paused;
					this.isBuffering = false;

					this.$emit("update", !this.video.paused, this.video.currentTime);
				}
			},
			toggleFullscreen () {
				if (document.fullscreenElement) {
					document.exitFullscreen();
				} else {

					const roomVideoContainer = document.getElementById("room-video-and-chat-container");

					if (roomVideoContainer) {
						roomVideoContainer.requestFullscreen();
					} else if (this.videoContainer) {
						this.videoContainer.requestFullscreen();
					}
				}
			},
			togglePlayPause () {
				if (this.video && this.controls) {
					if (this.video.paused) {
						this.video.play();
					} else {
						this.video.pause();
					}
				}
			},
			updateVideoTime () {

				if (this.video) {

					const
						timeInSeconds = this.video.currentTime,
						durationInSeconds = this.video.duration;

					this.videoProgressPercentage = (timeInSeconds / durationInSeconds) * 100;
					this.currentVideoTime = timeInSeconds;
				}

				this.isBuffering = false;
			},
			changeVideoProgress (e: MouseEvent) {
				if (this.video && e.target && this.controls) {

					const
						{ offsetX } = e,
						width = (e.target as HTMLElement).clientWidth,
						duration = this.video.duration;

					this.video.currentTime = (offsetX / width) * duration;
				}
			},
			updateVideoDuration () {
				if (this.video) {
					this.videoDuration = this.video.duration;
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

	.fade-enter-active,
	.fade-leave-active {
		transition: .3s opacity ease;
	}

	.fade-leave-to,
	.fade-enter-from {
		opacity: 0;
	}

	#video-player {
		width: 100%;
		height: auto;
	}

	#video-container {
		position: relative;
		width: 100%;
		height: 100%;
	}

	#constant-video-overlay, #video-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	#video-overlay {
		display: flex;
		flex-direction: column;
	}

	#video-screen {
		flex: 1;
	}

	#video-controls {
		background-color: rgba(var(--container-background-color-raw), .95);
		position: absolute;
		width: 100%;
		height: 3rem;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	#progress-bar-container {
		flex: 1;
		height: .5rem;
		background-color: var(--text-color);

	}

	.selectable-progress-bar:hover {
		cursor: pointer;
	}

	#progress-bar-container, #progress-bar {
		border-radius: 1.25rem;
	}

	#progress-bar {
		height: 100%;
		background-color: var(--primary-color);
		transition: .3s width linear;
	}

	#video-timestamp, #video-duration {
		margin-left: .5rem;
		margin-right: .5rem;
	}

	#video-timestamp {
		text-align: right;
	}

	#video-duration {
		text-align: left;
	}

	.video-control-button {
		width: 30px;
		height: auto;
		margin-left: 1rem;
		margin-right: 1rem;
	}

	.video-control-button:hover {
		cursor: pointer;
	}

	#play-pause-button * {
		width: 100%;
		height: 100%;
	}

</style>