<template>
	<div>
		<div
			id="video-container"
			ref="videoContainer"
			class="video-container"
			:class="{ 'hide-mouse-cursor': isOverlayVisible && isMouseStatic }"
			@mouseenter="isOverlayVisible = true"
			@mouseleave="isOverlayVisible = false; isVolumeTrayVisible = false; isSubtitleTrayVisible = false"
		>
			<div class="constant-video-overlay">
				<div v-if="room && isFullscreen">
					<UserList
						class="overlay-user-list"
						:users="room.users"
						:host="room.host"
					/>
				</div>
				<div v-if="isBuffering">
					<LoadingBuffer :size="isInPopOutMode ? 'small' : 'normal'" />
				</div>
				<transition name="video-platter-slide">
					<div
						v-if="isSubtitleTrayVisible"
						class="video-control-tray subtitle-tray"
						@mouseleave="isSubtitleTrayVisible = false"
					>
						<h3>Subtitles</h3>
						<div v-for="subtitle in episode.subtitles" :key="subtitle.code">
							<button
								class="subtitle-language-button"
								@click="setSubtitleLanguage(`${subtitle.code}`)"
							>
								<template v-if="subtitle.code === selectedSubtitleLanguage">
									<Checkmark />
								</template>
								{{ subtitle.language }}
							</button>
						</div>
					</div>
				</transition>
				<transition name="video-platter-slide">
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
				<div v-if="episode.data.lyrics && !isInPopOutMode && isKaraokeEnabled">
					<KaraokeRenderer
						class="karaoke"
						:show-id="show.id"
						:episode-id="episode.id"
						:data="episode.data.lyrics"
						:timestamp="currentTime"
					/>
				</div>
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
							<VolumeHigh v-if="volume >= .85" class="video-control-button" />
							<VolumeMedium v-else-if="volume >= .45" class="video-control-button" />
							<VolumeLow v-else-if="volume > 0" class="video-control-button" />
							<VolumeOff v-else class="video-control-button" />
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
								<div class="progress-bar" />
							</div>
							<div
								v-if="isHoveringOverProgressBar"
								class="progress-bar-timestamp"
								:style="`left: ${hoverTimestampOffset}px`"
							>
								{{ hoverTimestamp }}
							</div>
						</div>
						<span class="video-duration">{{ durationTimestamp }}</span>
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

				:class="{ 'popped-out': isInPopOutMode }"
				:src="episode.stream_url"
				:poster="episode.thumbnail_url"
				:volume="volume"

				@seeked="updateCurrentTime(); pushSync();"
				@seeking="updateCurrentTime(); pushSync();"
				@pause="updatePlaybackState"
				@play="updatePlaybackState"
				@timeupdate="updateCurrentTime"
				@waiting="isBuffering = true"
				@durationchange="updateDuration"
				@volumechange="updateVolume"
			>
				<!-- Superseded by ASS subtitles; fuck WebVTT, no creativity allowed, huh?
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
				-->
			</video>
		</div>
		<div v-if="!isInPopOutMode && !isFullscreen && episode.data.effects && areEffectsEnabled">
			<LeafRenderer
				:data="episode.data.effects"
				:timestamp="currentTime"
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

	// Mixins
	import MainMixin from "@mixins/Main";

	// Renderers
	import LeafRenderer from "@renderers/Leaf.vue";
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
	import { Range, SubtitlesOctopus } from "@typings/main";
	import { Episode, Show, Subtitles } from "@typings/show";
	import { RoomSyncData } from "@typings/room";

	// Constants
	const DEV = import.meta.env.DEV;

	export default defineComponent({
		name: "Video",
		components: {
			LeafRenderer,
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
		mixins: [ MainMixin ],
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

				// Player
				isPaused: true,
				isBuffering: false,
				isFullscreen: false,
				currentTime: 0,
				duration: 0,
				volume: 1,

				// Overlay
				isOverlayVisible: false,
				isMouseStatic: false,

				// Trays
				selectedSubtitleLanguage: "en" as string | null,
				isSubtitleTrayVisible: false,
				isVolumeTrayVisible: false,

				// Progress Bar
				isHoveringOverProgressBar: false,
				videoProgressPercentage: 0,
				hoverTimestampOffset: 0,
				bufferedSectionsChecker: 0,
				bufferedSectionsPercentage: 0,

				// Gestures
				mouseClickCounter: 0,
				mouseChecker: 0,
				mouseClickChecker: 0,
				lastMousePosition: [ 0, 0 ] as Range,

				// Subtitles
				subtitles: {} as Record<string, string>,
				rendererASS: null as SubtitlesOctopus | null,
				shouldShowSubtitles: false
			};
		},
		computed: {

			// States
			isKaraokeEnabled (): boolean {
				return this.$store.state.settings.karaoke;
			},
			areEffectsEnabled (): boolean {
				return this.$store.state.settings.effects;
			},
			isRequestingRoomSync (): boolean {
				return this.$store.state.room.isRequestingRoomSync;
			},
			isInPopOutMode (): boolean {
				return this.$route.path.match(/^\/watch\/.+|\/rooms\/.+$/i) === null;
			},

			// Timestamps
			videoCurrentTimestamp (): string {
				return formatTimestamp(this.currentTime);
			},
			durationTimestamp (): string {
				return formatTimestamp(this.duration);
			},
			hoverTimestamp (): string {
				const offset = this.hoverTimestampOffset;
				return formatTimestamp(this.getProgressBarTimestamp(offset));
			},

			// Style Bindings
			bufferedSections (): string {
				return `linear-gradient(90deg, var(--text-color) ${this.bufferedSectionsPercentage}%, #c7c7c7 ${this.bufferedSectionsPercentage + 2}%, #c7c7c7 100%)`;
			},
			videoProgress (): string {
				return `${this.currentTime > 0 ? this.videoProgressPercentage : 0}%`;
			},
			subtitleVisibility (): string {
				return this.shouldShowSubtitles
					? "visible"
					: "hidden";
			}
		},
		watch: {
			isPaused (state: boolean) {

				this.pushSync();

				if (!state && !this.shouldShowSubtitles) {
					this.shouldShowSubtitles = true;
				}
			},
			isRequestingRoomSync (newState: boolean) {
				if (newState) {
					this.$store.commit("room/UPDATE_ROOM_SYNC_REQUEST", false);
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
			},
			episode () {

				if (this.video) {
					this.video.pause();
					this.video.currentTime = 0;
				}

				this.subtitles = {};
				this.currentTime = 0;
				this.shouldShowSubtitles = false;
				this.isPaused = true;

				this.initializeASSSubtitles();
				this.updateBufferedSections();
			}
		},
		mounted () {

			document.addEventListener("keydown", this.handleKeypress);
			document.addEventListener("mousemove", this.updateMousePosition);
			document.addEventListener("fullscreenchange", this.updateFullscreenState);

			this.mouseChecker = window.setInterval(this.checkForStaticMouse, 100);
			this.mouseClickChecker = window.setInterval(this.doubleClickChecker, 400);
			this.bufferedSectionsChecker = window.setInterval(this.updateBufferedSections, 1000);

			if (this.video) {
				this.volume = this.video.volume;
			}

			this.initializeASSRenderer();
		},
		beforeUnmount () {

			document.removeEventListener("keydown", this.handleKeypress);
			document.removeEventListener("mousemove", this.updateMousePosition);
			document.removeEventListener("fullscreenchange", this.updateFullscreenState);

			clearInterval(this.mouseChecker);
			clearInterval(this.mouseClickChecker);
			clearInterval(this.bufferedSectionsChecker);

			if (this.rendererASS) {
				this.rendererASS.dispose();
			}
		},
		methods: {
			pushSync () {
				if (this.video) {
					this.$emit("update", !this.video.paused, this.video.currentTime);
				} else { // Fallback to saved data
					this.$emit("update", !this.isPaused, this.currentTime);
					console.error("No video element found while attempting to push sync.");
				}
			},
			updatePlaybackState () {
				if (this.video) {
					this.isPaused = this.video.paused;
				}
			},
			updateFullscreenState () {
				this.isFullscreen = document.fullscreenElement !== null;
			},
			updateDuration () {
				if (this.video) {
					this.duration = this.video.duration;
				}
			},
			updateVolume () {
				if (this.video) {
					this.volume = this.video.volume;
				}
			},
			updateHoverTimestamp (e: MouseEvent) {
				if (this.isHoveringOverProgressBar) {
					this.hoverTimestampOffset = this.getProgressBarWidth(e);
				}
			},
			updateMousePosition (e: MouseEvent) {
				this.lastMousePosition = [ e.screenX, e.screenY ];
			},
			toggleFullscreen () {
				if (document.fullscreenElement) {
					if (document.webkitExitFullscreen) {
						document.webkitExitFullscreen();
					} else {
						document.exitFullscreen();
					}
				} else {
					if (this.videoContainer) {
						if (this.videoContainer.webkitRequestFullscreen) {
							this.videoContainer.webkitRequestFullscreen();
						} else if (this.videoContainer.webkitEnterFullscreen) {
							this.videoContainer.webkitEnterFullscreen();
						} else {
							this.videoContainer.requestFullscreen();
						}
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
			updateCurrentTime () {
				if (this.video) {

					const
						timeInSeconds = this.video.currentTime,
						durationInSeconds = this.video.duration;

					this.videoProgressPercentage = (timeInSeconds / durationInSeconds) * 100;
					this.currentTime = timeInSeconds;
				}

				this.isBuffering = false;
			},
			progressBarSeek (e: MouseEvent) {
				if (this.video && this.controls) {
					this.video.currentTime = this.getProgressBarTimestamp(this.getProgressBarWidth(e));
				}
			},
			handleKeypress (e: KeyboardEvent) {
				// Only process keys if user isn't focused on any inputs/spans/textareas
				if (this.video && document.activeElement && ![ "SPAN", "INPUT", "TEXTAREA" ].includes(document.activeElement.tagName)) {
					switch (e.code) {
						case "ArrowLeft":
							this.video.currentTime -= 5;
							break;
						case "ArrowRight":
							this.video.currentTime += 5;
							break;
						case "Space":
							this.togglePlayPause();
							e.preventDefault(); // Prevents space scrolling
							break;
						case "KeyF":
							this.toggleFullscreen();
							break;
						case "Digit0":
							this.video.currentTime = 0;
							break;
						default:
					}
				}
			},
			checkForStaticMouse () {

				const currentPosition = this.lastMousePosition;

				setTimeout(() => {
					this.isMouseStatic = (this.lastMousePosition === currentPosition) && this.isOverlayVisible;
				}, 2000);
			},
			setSubtitleLanguage (code: string) {
				if (this.selectedSubtitleLanguage === code) {

					this.selectedSubtitleLanguage = null;

					if (this.rendererASS) {
						this.rendererASS.freeTrack();
					}

				} else {
					this.selectedSubtitleLanguage = code;
					this.loadSubtitleLanguage(code);
				}
			},
			loadSubtitleLanguage (code: string) {
				if (this.rendererASS && this.subtitles[code]) {
					this.rendererASS.setTrack(this.subtitles[code]);
				}
			},
			toggleSubtitleTray () {
				this.isSubtitleTrayVisible = !this.isSubtitleTrayVisible;
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
			async fetchSubtitles () {

				const
					_subtitles: Record<string, string> = {},
					subtitlePromises: Promise<string | void>[] = [];

				if (this.episode) {
					this.episode.subtitles.forEach((subtitles: Subtitles) => {
						subtitlePromises.push(
							fetch(subtitles.url).then(res => res.text()).then((text: string) => {
								_subtitles[subtitles.code] = text;
							}).catch(err => {
								console.error(err);
							})
						);
					});
				}

				await Promise.all(subtitlePromises);

				this.subtitles = _subtitles;
			},
			async initializeASSRenderer () {

				await this.initializeASSSubtitles();

				if (this.video) {
					this.rendererASS = new window.SubtitlesOctopus({
						video: this.video,
						subContent: this.subtitles[this.selectedSubtitleLanguage || "en"] || "",
						workerUrl: "/libass/subtitles-octopus-worker.js",
						legacyWorkerUrl: "/libass/subtitles-octopus-worker-legacy.js",
						debug: DEV
					});
				}
			},
			async initializeASSSubtitles () {

				await this.fetchSubtitles();

				if (this.selectedSubtitleLanguage) {
					this.loadSubtitleLanguage(this.selectedSubtitleLanguage);
				}
			},
			updateBufferedSections () {
				if (this.video && this.video.buffered.length > 0) {
					this.bufferedSectionsPercentage = (this.video.buffered.end(this.video.buffered.length - 1) / this.video.duration) * 100;
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

<style scoped lang="scss">

	@import "@styles/main.scss";

	// Transitions

	.video-platter-slide-enter-active {
		transition: opacity .2s ease, transform .4s variable(easing-enter);
	}

	.video-platter-slide-leave-active {
		transition: opacity .25s ease, transform .3s ease;
	}

	.video-platter-slide-enter-from,
	.video-platter-slide-leave-to {
		opacity: 0;
		transform: translateY(.5em) scale(90%);
	}

	// Subtitles & Captions
	// ! SUPERSEDED BY ASS RENDERER

	video {

		&::cue {
			font-family: variable(font);
			font-size: 40px;
			line-height: 100%;
			background: transparent;
			text-shadow: #000 3px 3px 10px;
		}

		&::-webkit-media-text-track-display {
			margin-top: 1em;
		}
	}

	.video-container:fullscreen {
		video::cue {
			font-size: 50px;
		}
	}

	@media only screen and (max-width: 2560px) {
		.video-container:fullscreen {
			video::cue {
				font-size: 55px;
			}
		}
	}

	.popped-out::cue {
		font-size: 12px;
		text-shadow: #000 0 0 2px;
	}

	// Video Containers

	.video-player {
		width: 100%;
		height: auto;
	}

	.video-container:not(:fullscreen) .video-player {
		max-height: 763.3px; // Temporary fix for thumbnail-less videos jumping when being selected
	}

	.video-container {
		position: relative;
		width: 100%;
		height: auto;
	}

	.subtitle-container {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		pointer-events: none;
	}

	.constant-video-overlay {
		z-index: 3;
		pointer-events: none;
	}

	.constant-video-overlay,
	.video-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.video-screen {
		flex: 1;
		z-index: 2;
	}

	.hide-mouse-cursor {
		cursor: none;
	}

	// Video Controls

	.video-controls {
		background-color: variable(container-background-color);
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

	@media only screen and (max-width: 800px) {
		.video-controls {
			height: 2rem;
			font-size: 10px;
		}
	}

	.video-control-button {
		width: 2em;
		height: auto;
		margin-left: .65rem;
		margin-right: .65rem;
		cursor: pointer;
	}

	.play-pause-button * {
		width: 100%;
		height: 100%;
	}

	// Progress Bar

	.progress-bar-container {
		position: relative;
		flex: 1;
		height: .5rem;
	}

	.progress-bar-container,
	.progress-bar,
	.progress-bar-overflow {
		border-radius: 1.25rem;
	}

	.progress-bar-overflow {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: v-bind(bufferedSections);
	}

	.progress-bar {
		width: v-bind(videoProgress);
		height: 100%;
		background-color: variable(primary-color);
		transition: width .3s ease;
	}

	.progress-bar-timestamp {
		position: absolute;
		transform: translateX(-50%);
		top: -2rem;
		padding: .1rem .3rem .1rem .3rem;
		background-color: variable(background-color);
		border-radius: variable(card-border-radius);
		text-align: center;
	}

	.selectable-progress-bar {
		cursor: pointer;
	}

	// Timestamp & Duration

	.video-timestamp,
	.video-duration {
		margin-left: .5rem;
		margin-right: .5rem;
	}

	.video-timestamp {
		text-align: right;
	}

	.video-duration {
		text-align: left;
	}

	// Video Control Trays

	.video-control-tray {
		position: absolute;
		bottom: 3.8rem;
		background-color: variable(container-background-color);
		border-radius: variable(card-border-radius);
		pointer-events: visible;
		z-index: 5; // To go above chat messages
	}

	// Subtitle Tray

	.subtitle-tray {

		right: .5rem;
		width: 10rem;
		padding: 0 0 1rem 0;

		h3 {
			margin-top: .5rem;
			text-align: center;
		}
	}

	.subtitle-language-button {

		background: none;
		border: none;
		font-weight: 100;
		color: variable(text-color);
		font-size: 1.1rem;
		font-weight: lighter;
		border-radius: 0;
		width: 100%;
		height: 2rem;
		padding: .2rem 0 .2rem 0;
		transition: background-color .3s ease;
		cursor: pointer;

		&:hover {
			background-color: variable(container-hover-color);
		}

		svg {
			position: absolute;
			left: 1rem;
		}
	}

	@media only screen and (max-width: 900px) {

		.subtitle-tray {

			width: 7rem;
			padding-bottom: .3rem;

			h3 {
				margin-top: .3rem;
				margin-bottom: .3rem;
				font-size: 1rem;
			}
		}

		.subtitle-language-button {

			font-size: 1rem;

			svg {
				left: .4rem;
			}
		}
	}

	// Volume Tray

	.volume-tray {
		left: .5rem;
		padding: .6rem;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	@media only screen and (max-width: 900px) {
		.volume-tray {
			padding: .4rem;
		}
	}

	// Overlay

	.overlay-user-list {
		position: absolute;
		top: 0;
		left: 0;
		height: 2.25rem;
		margin: 1rem;
	}

	.karaoke {
		position: absolute;
		bottom: 3.7rem;
		left: .7rem;
	}

</style>

<style lang="scss">

	// Subtitles & Captions

	.libassjs-canvas {
		visibility: v-bind(subtitleVisibility);
	}

</style>