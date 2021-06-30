<template>
	<div
		id="video-container"
		ref="videoContainer"
		:class="{ 'hide-mouse-cursor': isOverlayVisible && isMouseStatic }"
		@mouseenter="isOverlayVisible = true"
		@mouseleave="isOverlayVisible = false; isVolumeTrayVisible = false; isSubtitleTrayVisible = false"
	>
		<div id="constant-video-overlay">
			<div v-if="isBuffering">
				<LoadingBuffer :size="isInPopOutMode ? 'small' : 'normal'" />
			</div>
			<transition name="slide">
				<div
					v-if="isSubtitleTrayVisible"
					id="subtitle-tray"
					class="video-control-tray"
					@mouseleave="isSubtitleTrayVisible = false"
				>
					<h3>Subtitles</h3>
					<div v-for="subtitle in episode.subtitles" :key="subtitle.code">
						<button
							class="subtitle-language-button"
							@click="setSubtitleLanguage(`${ subtitle.code }`)"
						>
							<template v-if="subtitle.code === selectedSubtitleLanguage">
								<Checkmark />
							</template>
							{{ subtitle.language }}
						</button>
					</div>
				</div>
			</transition>
			<transition name="slide">
				<div
					v-if="!isVolumeTrayVisible"
					id="volume-tray"
					class="video-control-tray"
					@mouseleave="isVolumeTrayVisible = false"
				>
					<input
						v-model="volume"
						type="range"
						min="0"
						max="1"
						step=".01"
					>
				</div>
			</transition>
		</div>
		<transition name="fade">
			<div
				v-show="(isOverlayVisible && !isMouseStatic) || isSubtitleTrayVisible"
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
					<div @click="toggleVolumeTray">
						<VolumeOff v-if="volume == 0" class="video-control-button" />
						<VolumeLow v-if="volume > 0 && volume < .45" class="video-control-button" />
						<VolumeMedium v-if="volume >= .45 && volume < .85" class="video-control-button" />
						<VolumeHigh v-if="volume >= .85" class="video-control-button" />
					</div>
					<span id="video-timestamp">{{ videoCurrentTimestamp }}</span>
					<div
						id="progress-bar-container"
						:class="{ 'selectable-progress-bar': controls }"
						@click="changeVideoProgress"
					>
						<div
							id="progress-bar"
							:style="`width: ${ videoProgressPercentage }%`"
						/>
					</div>
					<span id="video-duration">{{ videoDurationTimestamp }}</span>
					<Text class="video-control-button" @click="toggleSubtitleTray" />
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
			:volume="volume"

			@seeked="updateVideoTime(); pushSync();"
			@seeking="updateVideoTime(); pushSync();"
			@pause="pushSync"
			@play="pushSync()"
			@timeupdate="updateVideoTime"
			@waiting="isBuffering = true"
			@durationchange="updateVideoDuration"
			@volumechange="updateVolume"
		>
			<template v-for="subtitle in episode.subtitles" :key="subtitle.code">
				<track
					:id="subtitle.code"
					kind="subtitles"
					:srclang="subtitle.code"
					:label="subtitle.language"
					:src="subtitle.url"
					:default="subtitle.code === 'en'"
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
	import Checkmark from "@assets/icons/checkmark.svg?component";
	import Text from "@assets/icons/text.svg?component";
	import VolumeOff from "@assets/icons/volume-off.svg?component";
	import VolumeLow from "@assets/icons/volume-low.svg?component";
	import VolumeMedium from "@assets/icons/volume-medium.svg?component";
	import VolumeHigh from "@assets/icons/volume-high.svg?component";
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
			LoadingBuffer,
			Checkmark,
			Text,
			VolumeOff,
			VolumeLow,
			VolumeMedium,
			VolumeHigh
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
				videoDuration: 0,
				lastSyncTimestamp: 0,
				isMouseStatic: false,
				mouseChecker: 0,
				lastMousePosition: [ 0, 0 ] as [ number, number ],
				isFullscreen: false,
				selectedSubtitleLanguage: "en",
				isSubtitleTrayVisible: false,
				isVolumeTrayVisible: false,
				volume: 0
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
			},
			isInPopOutMode (): boolean {
				return this.$route.path.match(/^\/rooms|watch\/.*$/i) === null;
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
		mounted () {

			document.addEventListener("keydown", this.handleKeypress);
			document.addEventListener("mousemove", this.updateMousePosition);

			this.mouseChecker = window.setInterval(this.checkForStaticMouse, 100);

			if (this.video) {
				this.volume = this.video.volume;
			}
		},
		beforeUnmount () {

			document.removeEventListener("keydown", this.handleKeypress);
			document.removeEventListener("mousemove", this.updateMousePosition);

			clearInterval(this.mouseChecker);

		},
		methods: {
			pushSync () {
				if (this.video) {

					this.isPaused = this.video.paused;

					this.$emit("update", !this.video.paused, this.video.currentTime);
				}
			},
			toggleFullscreen () {
				if (document.fullscreenElement) {
					document.exitFullscreen();
					this.isFullscreen = false;
				} else {

					const roomVideoContainer = document.getElementById("room-video-and-chat-container");

					if (roomVideoContainer) {
						roomVideoContainer.requestFullscreen();
					} else if (this.videoContainer) {
						this.videoContainer.requestFullscreen();
					}

					this.isFullscreen = true;
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
			},
			handleKeypress (e: KeyboardEvent) {
				// Only process keys if user isn't focused on any inputs/spans
				if (this.video && document.activeElement && ![ "SPAN", "INPUT" ].includes(document.activeElement.tagName)) {
					switch (e.code) {
						case "ArrowLeft":
							this.video.currentTime -= 15;
							break;
						case "ArrowRight":
							this.video.currentTime += 15;
							break;
						case "Space":
							this.togglePlayPause();
							break;
						case "KeyF":
							this.toggleFullscreen();
							break;
						default:
					}
				}
			},
			updateMousePosition (e: MouseEvent) {
				this.lastMousePosition = [ e.screenX, e.screenY ];
			},
			checkForStaticMouse () {

				const currentPosition = this.lastMousePosition;

				setTimeout(() => {
					this.isMouseStatic = (this.lastMousePosition === currentPosition) && this.isOverlayVisible;
				}, 2000);
			},
			updateFullscreenState () {
				this.isFullscreen = document.fullscreenElement !== null;
			},
			setSubtitleLanguage (code: string) {

				this.selectedSubtitleLanguage = code;

				if (this.video) {

					const tracks = this.video.textTracks;

					for (let i = 0; i <= tracks.length; i++) {

						const track = tracks[i];

						track.mode = track.id === code ? "showing" : "disabled";
					}
				}
			},
			toggleSubtitleTray () {
				this.isSubtitleTrayVisible = !this.isSubtitleTrayVisible;
			},
			updateVolume () {
				if (this.video) {
					this.volume = this.video.volume;
				}
			},
			toggleVolumeTray () {
				this.isVolumeTrayVisible = !this.isVolumeTrayVisible;
			}
		},
		sockets: {
			"ROOM:SYNC" (data: RoomSyncData) {
				if (this.video) {

					this.lastSyncTimestamp = new Date().getTime() / 1000;
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

	/* Transitions */

	.fade-enter-active,
	.fade-leave-active {
		transition: .3s opacity ease;
	}

	.fade-leave-to,
	.fade-enter-from {
		opacity: 0;
	}

	.hide-mouse-cursor {
		cursor: none;
	}

	.slide-enter-active {
		transition: opacity .2s ease, transform .4s var(--easing-enter);
	}

	.slide-leave-active {
		transition: opacity .25s ease, transform .3s ease;
	}

	.slide-enter-from,
	.slide-leave-to {
		opacity: 0;
		transform: translateY(.5em);
	}

	/* Video Containers */

	#video-player {
		width: 100%;
		height: auto;
	}

	#video-container {
		position: relative;
		width: 100%;
		height: auto;
	}

	#constant-video-overlay {
		z-index: 2;
		pointer-events: none;
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

	/* Progress Bar */

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
		transition: .3s width ease	;
	}

	/* Timestamp & Duration */

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

	/* Video Controls */

	#video-controls {
		background-color: var(--container-background-color);
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

	.video-control-button {
		width: 30px;
		height: auto;
		margin-left: .65rem;
		margin-right: .65rem;
	}

	.video-control-button:hover {
		cursor: pointer;
	}

	#play-pause-button * {
		width: 100%;
		height: 100%;
	}

	/* Video Control Trays */

	.video-control-tray {
		position: absolute;
		bottom: 4rem;
		background-color: var(--container-background-color);
		border-radius: var(--card-border-radius);
		pointer-events: visible;
	}

	/* Subtitle Tray */

	#subtitle-tray {
		right: 1rem;
		width: 10rem;
		padding: 0 0 1rem 0;
	}

	#subtitle-tray h3 {
		margin-top: .5rem;
	}

	.subtitle-language-button {
		background: none;
		border: none;
		font-weight: 100;
		color: var(--text-color);
		font-size: 1.1rem;
		font-weight: lighter;
		width: 100%;
		height: 2rem;
		padding: .2rem 0 .2rem 0;
		transition: background-color .3s ease;
	}

	.subtitle-language-button svg {
		position: absolute;
		left: 1rem;
	}

	.subtitle-language-button:hover {
		cursor: pointer;
		background-color: var(--container-hover-color);
	}

	/* Volume Tray */

	#volume-tray {
		left: 1rem;
		padding: .6rem;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	/* Can we please, for the love of God, incorporate a standard for this */
	#volume-tray input::-ms-fill-lower,
	#volume-tray input::-moz-range-progress,
	#volume-tray input::-webkit-slider-runnable-track
	{
		background: var(--primary-color);
	}

</style>