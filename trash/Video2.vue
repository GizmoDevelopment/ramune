<template>
	<div>
		<!-- That extra ID is used by RoomController -->
		<div
			id="video-container"
			ref="videoContainer"
			class="video-container"
		>
			<div
				class="constant-video-overlay"
			>
				<UserList
					v-if="room && isFullscreen"
					class="overlay-user-list"
					:users="room.users"
					:host="room.host"
				/>
				<LoadingBuffer
					v-if="isBuffering"
					:size="isInPopOutMode ? 'small' : 'normal'"
				/>
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
				<transition name="video-platter-slide">
					<div
						v-if="isSubtitleTrayVisible"
						class="video-control-tray subtitle-tray"
						@mouseleave="isSubtitleTrayVisible = false"
					>
						<h3>Subtitles</h3>
						<div v-for="subtitle in episode.subtitles" :key="subtitle.code">
							<button
								v-if="subtitles[subtitle.code]"
								class="subtitle-language-button"
								@click="setSubtitleLanguage(`${subtitle.code}`)"
							>
								<Checkmark v-if="subtitle.code === selectedSubtitleLanguage" />
								{{ subtitle.language }}
							</button>
						</div>
					</div>
				</transition>
			</div>
			<transition name="fade">
				<div
					class="video-controls"
				>
					<div class="main-video-controls">
						<div class="video-control-row playback-control">
							<div>
								<div
									v-if="controls"
									class="video-control-button play-pause-button"
									@click="togglePlaybackState"
								>
									<Play v-if="isPaused" />
									<Pause v-else />
								</div>
								<div @click="isVolumeTrayVisible = !isVolumeTrayVisible">
									<VolumeHigh v-if="volume >= .85" class="video-control-button" />
									<VolumeMedium v-else-if="volume >= .45" class="video-control-button" />
									<VolumeLow v-else-if="volume > 0" class="video-control-button" />
									<VolumeOff v-else class="video-control-button" />
								</div>
							</div>
							<div>
								<Text
									v-if="episode.subtitles.length > 0"
									class="video-control-button"
									@click="isSubtitleTrayVisible = !isSubtitleTrayVisible"
								/>
								<Resize class="video-control-button" @click="toggleFullscreen" />
							</div>
						</div>
						<div class="video-control-row time-control">
							<span class="video-current-timestamp">{{ videoCurrentTimestamp }}</span>
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
									<div class="progress-bar-snake" />
								</div>
								<div
									v-if="isHoveringOverProgressBar"
									class="progress-bar-timestamp"
									:style="`left: ${hoverTimestampOffset}px`"
								>
									{{ hoverTimestamp }}
								</div>
							</div>
							<span class="video-duration-timestamp">{{ videoDurationTimestamp }}</span>
						</div>
					</div>
				</div>
			</transition>
			<video

				ref="video"

				playsinline
				controlslist="nodownload"
				preload="auto"

				:src="episode.stream_url"
				:poster="episode.thumbnail_url"
				:volume="volume"

				@seeked="updateCurrentTime(); pushSync();"
				@seeking="updateCurrentTime(); pushSync();"
				@pause="isPaused = true"
				@play="isPaused = false"
				@timeupdate="updateCurrentTime"
				@waiting="isBuffering = true"
				@durationchange="updateDuration"
				@volumechange="updateVolume"
			/>
			<KaraokeRenderer
				v-if="isKaraokeEnabled && episode.data.lyrics && !isInPopOutMode"
				class="karaoke"
				:show-id="show.id"
				:episode-id="episode.id"
				:data="episode.data.lyrics"
				:timestamp="currentTime"
			/>
		</div>
		<LeafRenderer
			v-if="areEffectsEnabled && episode.data.effects && !isInPopOutMode && !isFullscreen"
			:data="episode.data.effects"
			:timestamp="currentTime"
		/>
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
	import Resize from "@assets/icons/expand.svg?component";
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

				// States
				isPaused: true,
				isFullscreen: false,
				isBuffering: false,
				currentTime: 0,
				duration: 0,
				volume: 1,

				// Trays
				isSubtitleTrayVisible: false,
				isVolumeTrayVisible: false,

				// Progress Bar
				isHoveringOverProgressBar: false,
				videoProgressPercentage: 0,
				hoverTimestampOffset: 0,
				bufferedSectionsChecker: 0,
				bufferedSectionsPercentage: 0,

				// Subtitles
				selectedSubtitleLanguage: "en" as string | null,
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
			isInPopOutMode (): boolean {
				return this.$route.path.match(/^\/watch\/.+|\/rooms\/.+$/i) === null;
			},

			// Timestamps
			videoCurrentTimestamp (): string {
				return formatTimestamp(this.currentTime);
			},
			videoDurationTimestamp (): string {
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
			document.addEventListener("fullscreenchange", this.updateFullscreenState);

			this.bufferedSectionsChecker = window.setInterval(this.updateBufferedSections, 1000);

			if (this.video) {

				this.volume = this.video.volume;

				// URL Timestamp
				if (this.$route.query.t) {

					const timestamp = Number(this.$route.query.t);

					if (!isNaN(timestamp) && !this.room) {
						this.video.addEventListener("canplay", () => {
							if (this.video) {
								this.video.currentTime = timestamp;
							}
						}, {
							once: true
						});
					}
				}

				// Request video data on Room join
				if (this.room && !this.isHost) {
					this.video.addEventListener("canplay", () => {
						this.$socket.client.emit("CLIENT:REQUEST_ROOM_SYNC");
					}, {
						once: true
					});
				}
			}

			this.initializeASSRenderer();
		},
		beforeUnmount () {

			document.removeEventListener("keydown", this.handleKeypress);
			document.removeEventListener("fullscreenchange", this.updateFullscreenState);

			clearInterval(this.bufferedSectionsChecker);

			if (this.rendererASS) {
				this.rendererASS.dispose();
			}
		},
		methods: {

			// Sync
			pushSync (targetUserId?: number) {
				if (this.isHost) {
					if (this.video) {
						this.$emit("update", !this.video.paused, this.video.currentTime, targetUserId);
					} else { // Fallback to saved data
						this.$emit("update", !this.isPaused, this.currentTime, targetUserId);
						console.error("No video element found while attempting to push sync.");
					}
				}
			},

			// Keys
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
							this.togglePlaybackState();
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

			// Video Controls
			togglePlaybackState () {
				if (this.video) {
					if (this.video.paused) {
						this.video.play();
					} else {
						this.video.pause();
					}
				}
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
			updateFullscreenState () {
				this.isFullscreen = document.fullscreenElement !== null;
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
			updateVolume () {
				if (this.video) {
					this.volume = this.video.volume;
				}
			},
			updateDuration () {
				if (this.video) {
					this.duration = this.video.duration;
				}
			},

			// Progress Bar
			updateHoverTimestamp (e: MouseEvent) {
				if (this.isHoveringOverProgressBar) {
					this.hoverTimestampOffset = this.getProgressBarWidth(e);
				}
			},
			updateBufferedSections () {
				if (this.video && this.video.buffered.length > 0) {
					this.bufferedSectionsPercentage = (this.video.buffered.end(this.video.buffered.length - 1) / this.video.duration) * 100;
				}
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
			progressBarSeek (e: MouseEvent) {
				if (this.video && this.controls) {
					this.video.currentTime = this.getProgressBarTimestamp(this.getProgressBarWidth(e));
				}
			},

			// Subtitles
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
			},
			"ROOM:CLIENT_REQUEST_ROOM_SYNC" (userId: number) {
				this.pushSync(userId);
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

	// Containers

	.video-container {
		z-index: 3;
	}

	.video-container,
	.constant-video-overlay {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.constant-video-overlay,
	.video-controls {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	video {
		display: inline-block;
		width: 100%;
		height: auto;
	}

	// Constant Overlay

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

	// Video Controls

	.video-controls {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		z-index: 2;
		pointer-events: none;
	}

	.video-control-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.video-control-button {
		width: 1.8em;
		height: auto;
		margin-right: .6rem;
		cursor: pointer;
	}

	// Bottom Controls

	.main-video-controls {
		width: 100%;
		background-color: rgba(0, 0, 0, .5);
		pointer-events: auto;
	}

	.play-pause-button * {
		width: 100%;
		height: 100%;
	}

	// Playback Control Row

	.playback-control {

		justify-content: space-between;
		padding-top: .35rem;

		> div {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			padding: 0 1rem 0 1rem;
		}
	}

	// Time Control Row

	.time-control {
		padding: .5rem 0 .5rem 0;
	}

	.video-current-timestamp,
	.video-duration-timestamp {
		padding: 0 1rem 0 1rem;
	}

	// Progress Bar

	.progress-bar-container {
		position: relative;
		flex: 1;
		height: .6rem;
	}

	.progress-bar-container,
	.progress-bar-overflow,
	.progress-bar-snake {
		border-radius: 1.25rem;
	}

	.progress-bar-overflow {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: v-bind(bufferedSections);
	}

	.progress-bar-snake {
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

	// Video Control Trays

	.video-control-tray {
		position: absolute;
		bottom: 4.8rem;
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

</style>

<style lang="scss">

	// Subtitles & Captions

	.libassjs-canvas-parent {
		position: absolute !important;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		pointer-events: none;
		z-index: 1;
	}

	.libassjs-canvas {
		visibility: v-bind(subtitleVisibility);
	}

</style>