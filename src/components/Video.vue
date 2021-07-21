<template>
	<div
		ref="videoContainer"
		class="video-container"
		:class="{ 'hide-mouse-cursor': isOverlayVisible && isMouseStatic }"
		@mouseenter="isOverlayVisible = true"
		@mouseleave="isOverlayVisible = false; isVolumeTrayVisible = false; isSubtitleTrayVisible = false"
	>
		<div v-if="room && isFullscreen" class="constant-video-overlay">
			<UserList
				class="overlay-user-list"
				:users="room.users"
				:host="room.host"
			/>
			<div v-if="isBuffering">
				<LoadingBuffer :size="isInPopOutMode ? 'small' : 'normal'" />
			</div>
			<transition name="slide">
				<div
					v-if="isSubtitleTrayVisible"
					class="video-control-tray subtitle-tray"
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
					v-if="isVolumeTrayVisible"
					class="video-control-tray volume-tray"
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
				class="video-overlay"
			>
				<div class="video-screen" @click="togglePlayPause(); mouseClickCounter += 1" />
				<div v-if="!hideControls" class="video-controls">
					<transition name="fade">
						<div
							v-if="controls"
							class="video-control-button play-pause-button"
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
					<span class="video-timestamp">{{ videoCurrentTimestamp }}</span>
					<div
						ref="progressBarContainer"
						class="progress-bar-container"
						:class="{ 'selectable-progress-bar': controls }"
						@click="progressBarSeek"
						@mouseenter="isHoveringOverProgressBar = true"
						@mouseleave="isHoveringOverProgressBar = false"
						@mousemove="updateHoverTimestamp"
					>
						<div class="progress-bar-overflow">
							<div
								class="progress-bar"
								:style="`width: ${ videoProgressPercentage }%`"
							/>
						</div>
						<div
							v-if="isHoveringOverProgressBar"
							class="progress-bar-timestamp"
							:style="`left: ${hoverTimestampOffset}px`"
						>
							{{ hoverTimestamp }}
						</div>
					</div>
					<span class="video-duration">{{ videoDurationTimestamp }}</span>
					<Text
						v-if="episode.subtitles.length > 0"
						class="video-control-button"
						@click="toggleSubtitleTray"
					/>
					<Resize class="video-control-button" @click="toggleFullscreen" />
				</div>
			</div>
		</transition>
		<video

			ref="video"
			class="video-player"

			playsinline
			controlslist="nodownload"
			preload="auto"
			crossorigin="anonymous"

			:src="episode.stream_url"
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
		<div v-if="episode.data.effects && !isInPopOutMode">
			<EffectsRenderer
				:effects="episode.data.effects"
				:timestamp="currentVideoTime"
			/>
		</div>
		<div v-if="episode.data.lyrics && !isInPopOutMode">
			<KaraokeRenderer
				:lyrics="episode.data.lyrics"
				:timestamp="currentVideoTime"
			/>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType, ref } from "vue";

	// Components
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import UserList from "@components/UserList.vue";

	// Renderers
	import EffectsRenderer from "@renderers/Effects.vue";
	import KaraokeRenderer from "@renderers/Karaoke.vue";

	// Icons
	import Play from "@assets/icons/play.svg?component";
	import Pause from "@assets/icons/pause.svg?component";
	import Resize from "@assets/icons/resize.svg?component";
	import Checkmark from "@assets/icons/checkmark.svg?component";
	import Text from "@assets/icons/text.svg?component";
	import VolumeOff from "@assets/icons/volume-off.svg?component";
	import VolumeLow from "@assets/icons/volume-low.svg?component";
	import VolumeMedium from "@assets/icons/volume-medium.svg?component";
	import VolumeHigh from "@assets/icons/volume-high.svg?component";

	// Utils
	import { formatTimestamp } from "@utils/essentials";

	// Types
	import { Episode, Show } from "@typings/show";
	import { Room, RoomSyncData } from "@typings/room";

	export default defineComponent({
		name: "Video",
		components: {
			EffectsRenderer,
			Play,
			Pause,
			Resize,
			LoadingBuffer,
			Checkmark,
			Text,
			VolumeOff,
			VolumeLow,
			VolumeMedium,
			VolumeHigh,
			UserList,
			KaraokeRenderer
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
				videoContainer = ref<HTMLDivElement>(),
				progressBarContainer = ref<HTMLDivElement>();

			return {
				video,
				videoContainer,
				progressBarContainer
			};
		},
		data () {
			return {
				isPaused: true,
				isOverlayVisible: false,
				isBuffering: false,
				isMouseStatic: false,
				isFullscreen: false,
				isSubtitleTrayVisible: false,
				isVolumeTrayVisible: false,
				isHoveringOverProgressBar: false,
				videoProgressPercentage: 0,
				currentVideoTime: 0,
				videoDuration: 0,
				lastSyncTimestamp: 0,
				mouseClickCounter: 0,
				mouseChecker: 0,
				mouseClickChecker: 0,
				volume: 1,
				hoverTimestampOffset: 0,
				lastMousePosition: [ 0, 0 ] as [ number, number ],
				selectedSubtitleLanguage: "en" as string | null
			};
		},
		computed: {
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
			},
			hoverTimestamp (): string {
				const offset = this.hoverTimestampOffset;
				return formatTimestamp(this.getProgressBarTimestamp(offset));
			},
			room (): Room | null {
				return this.$store.state.room;
			}
		},
		watch: {
			isRequestingRoomSync (newState: boolean) {
				if (newState) {
					this.$store.commit("UPDATE_ROOM_SYNC_REQUEST", false);
					this.pushSync();
				}
			},
			isMouseStatic (newState: boolean) {
				if (newState) {
					this.isVolumeTrayVisible = false;
					this.isSubtitleTrayVisible = false;
				}
			},
			mouseClickCounter (count: number) {
				if (count >= 2) {
					this.toggleFullscreen();
				}
			}
		},
		mounted () {

			document.addEventListener("keydown", this.handleKeypress);
			document.addEventListener("mousemove", this.updateMousePosition);

			this.mouseChecker = window.setInterval(this.checkForStaticMouse, 100);
			this.mouseClickChecker = window.setInterval(this.doubleClickChecker, 400);

			if (this.video) {
				this.volume = this.video.volume;
			}
		},
		beforeUnmount () {

			document.removeEventListener("keydown", this.handleKeypress);
			document.removeEventListener("mousemove", this.updateMousePosition);

			clearInterval(this.mouseChecker);
			clearInterval(this.mouseClickChecker);

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

					this.isFullscreen = true;

					if (roomVideoContainer) {
						roomVideoContainer.requestFullscreen();
					} else if (this.videoContainer) {
						this.videoContainer.requestFullscreen();
					} else {
						this.isFullscreen = false;
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
			progressBarSeek (e: MouseEvent) {
				if (this.video && this.controls) {
					this.video.currentTime = this.getProgressBarTimestamp(this.getProgressBarWidth(e));
				}
			},
			updateVideoDuration () {
				if (this.video) {
					this.videoDuration = this.video.duration;
				}
			},
			handleKeypress (e: KeyboardEvent) {
				// Only process keys if user isn't focused on any inputs/spans
				if (this.video && document.activeElement && ![ "SPAN", "INPUT", "TEXTAREA" ].includes(document.activeElement.tagName)) {
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

				if (this.selectedSubtitleLanguage === code) {
					this.selectedSubtitleLanguage = null;
				} else {
					this.selectedSubtitleLanguage = code;
				}

				if (this.video) {

					const tracks = this.video.textTracks;

					for (let i = 0; i < tracks.length; i++) {

						const track = tracks[i];

						track.mode = track.id === this.selectedSubtitleLanguage ? "showing" : "disabled";
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
			},
			doubleClickChecker () {
				this.mouseClickCounter = 0;
			},
			getProgressBarWidth (e: MouseEvent): number {
				return e.clientX - (e.pageX - e.offsetX);
			},
			getProgressBarTimestamp (x: number): number {

				if (this.video && this.progressBarContainer) {

					const
						width = this.progressBarContainer.clientWidth,
						duration = this.video.duration,
						timestamp = (x / width) * duration;

					if (!isNaN(timestamp)) {
						return timestamp;
					}
				}

				return 0;
			},
			updateHoverTimestamp (e: MouseEvent) {
				if (this.isHoveringOverProgressBar) {
					this.hoverTimestampOffset = this.getProgressBarWidth(e);
				}
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

	.video-player {
		width: 100%;
		height: auto;
	}

	.video-container {
		position: relative;
		width: 100%;
		height: auto;
	}

	.constant-video-overlay {
		z-index: 3;
		pointer-events: none;
	}

	.constant-video-overlay, .video-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.video-overlay {
		display: flex;
		flex-direction: column;
	}

	.video-screen {
		flex: 1;
		z-index: 2;
	}

	.hide-mouse-cursor {
		cursor: none;
	}

	/* Video Controls */

	.video-controls {
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
		z-index: 2;
	}

	.video-control-button {
		width: 30px;
		height: auto;
		margin-left: .65rem;
		margin-right: .65rem;
	}

	.video-control-button {
		cursor: pointer;
	}

	.play-pause-button * {
		width: 100%;
		height: 100%;
	}

	/* Progress Bar */

	.progress-bar-container {
		position: relative;
		flex: 1;
		height: .5rem;
		background-color: var(--text-color);
	}

	.progress-bar-container, .progress-bar, .progress-bar-overflow {
		border-radius: 1.25rem;
	}

	.progress-bar-overflow {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background-color: var(--primary-color);
		transition: .3s width ease;
	}

	.progress-bar-timestamp {
		position: absolute;
		transform: translateX(-50%);
		top: -2rem;
		padding: .1rem .3rem .1rem .3rem;
		background-color: var(--background-color);
		border-radius: var(--card-border-radius);
		text-align: center;
	}

	.selectable-progress-bar {
		cursor: pointer;
	}

	/* Timestamp & Duration */

	.video-timestamp, .video-duration {
		margin-left: .5rem;
		margin-right: .5rem;
	}

	.video-timestamp {
		text-align: right;
	}

	.video-duration {
		text-align: left;
	}

	/* Video Control Trays */

	.video-control-tray {
		position: absolute;
		bottom: 3.8rem;
		background-color: var(--container-background-color);
		border-radius: var(--card-border-radius);
		pointer-events: visible;
		z-index: 5; /* To go above chat messages */
	}

	/* Subtitle Tray */

	.subtitle-tray {
		right: .5rem;
		width: 10rem;
		padding: 0 0 1rem 0;
	}

	.subtitle-tray h3 {
		margin-top: .5rem;
	}

	.subtitle-language-button {
		background: none;
		border: none;
		font-weight: 100;
		color: var(--text-color);
		font-size: 1.1rem;
		font-weight: lighter;
		border-radius: 0;
		width: 100%;
		height: 2rem;
		padding: .2rem 0 .2rem 0;
		transition: background-color .3s ease;
		cursor: pointer;
	}

	.subtitle-language-button svg {
		position: absolute;
		left: 1rem;
	}

	.subtitle-language-button:hover {
		background-color: var(--container-hover-color);
	}

	/* Volume Tray */

	.volume-tray {
		left: .5rem;
		padding: .6rem;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	/* Overlay */

	.overlay-user-list {
		position: absolute;
		top: 0;
		left: 0;
		height: 2.5rem;
		margin: .5rem;
	}

</style>