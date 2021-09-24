<template>
	<div>
		<div
			ref="videoContainer"
			class="video-container"
			:class="{ 'video-inactive': isMouseStatic }"
		>
			<div
				class="video-overlay"
				@mouseenter="isMouseInOverlay = true"
				@mouseleave="isMouseInOverlay = false; isVolumeTrayVisible = false; isSubtitleTrayVisible = false;"
			>
				<div
					class="static-overlay"
					@click="togglePlayPause(); checkDoubleClick();"
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
				</div>
				<transition name="fade">
					<div
						v-show="isMouseInOverlay && !isMouseStatic"
						class="hover-overlay"
					>
						<div class="time-row">
							<span>{{ formattedCurrentTime }}</span>
							<div class="progress-bar-container">
								<div
									class="progress-bar"
									@click="seek"
									@mouseenter="isHoveringOverProgressBar = true"
									@mouseleave="isHoveringOverProgressBar = false"
									@mousemove="updateHoverCurrentTime"
								>
									<div class="progress-bar-snake" />
								</div>
								<div v-show="isHoveringOverProgressBar" class="progress-bar-hover-tooltip">{{ formattedHover }}</div>
							</div>
							<span>{{ formattedDuration }}</span>
						</div>
						<div class="control-row">
							<div class="control-row-left">
								<div @click="togglePlayPause">
									<Play v-if="isPaused" />
									<Pause v-else />
								</div>
								<div class="volume-button" @click="isVolumeTrayVisible = !isVolumeTrayVisible">
									<VolumeHigh v-if="volume >= .85" class="video-control-button" />
									<VolumeMedium v-else-if="volume >= .45" class="video-control-button" />
									<VolumeLow v-else-if="volume > 0" class="video-control-button" />
									<VolumeOff v-else class="video-control-button" />
									<transition name="video-tray">
										<div
											v-show="isVolumeTrayVisible"
											class="video-tray volume-tray"
											@mouseenter="isBusy = true"
											@mouseleave="isVolumeTrayVisible = false; isBusy = false"
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
							</div>
							<div class="control-row-right">
								<ClosedCaptioning class="subtitle-button" @click="isSubtitleTrayVisible = !isSubtitleTrayVisible" />
								<transition name="video-tray">
									<div
										v-show="isSubtitleTrayVisible"
										class="video-tray subtitle-tray"
										@mouseenter="isBusy = true"
										@mouseleave="isSubtitleTrayVisible = false; isBusy = false"
									>
										<span class="video-tray-title">Subtitles</span>
										<button
											v-for="subtitle in episode.subtitles"
											:key="subtitle.code"
											class="tray-button subtitle-language-button"
											@click="selectSubtitleLanguage(subtitle.code)"
										>
											<Checkmark v-show="subtitle.code === selectedSubtitleLanguage" />
											{{ subtitle.language }}
										</button>
									</div>
								</transition>
								<Expand @click="toggleFullscreen" />
							</div>
						</div>
					</div>
				</transition>
			</div>
			<video

				ref="video"

				playsinline
				controlslist="nodownload"
				preload="auto"

				:src="episode.stream_url"
				:poster="episode.thumbnail_url"
				:volume="volume"

				@play="isPaused = false"
				@pause="isPaused = true"
				@waiting="isBuffering = true"
				@timeupdate="updateCurrentTime"
				@volumechange="updateVolume"
				@durationchange="updateDuration"
				@seeked="updateCurrentTime($event); pushSync();"
				@seeking="updateCurrentTime($event); pushSync();"
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
			v-if="isLeafEnabled && episode.data.effects && !isInPopOutMode && !isFullscreen"
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
	import KaraokeRenderer from "@renderers/Karaoke.vue";
	import LeafRenderer from "@renderers/Leaf.vue";

	// Icons
	import Play from "@assets/icons/play.svg?component";
	import Pause from "@assets/icons/pause.svg?component";
	import VolumeOff from "@assets/icons/volume-off.svg?component";
	import VolumeLow from "@assets/icons/volume-low.svg?component";
	import VolumeMedium from "@assets/icons/volume-medium.svg?component";
	import VolumeHigh from "@assets/icons/volume-high.svg?component";
	import Expand from "@assets/icons/expand.svg?component";
	import ClosedCaptioning from "@assets/icons/closed-captioning.svg?component";
	import Checkmark from "@assets/icons/checkmark.svg?component";

	// Utils
	import { formatTimestamp } from "@utils/essentials";

	// Types
	import { SubtitlesOctopus } from "@typings/main";
	import { Episode, Show, Subtitles } from "@typings/show";
	import { RoomSyncData } from "@typings/room";

	// Constants
	const DEV = import.meta.env.DEV;

	// TODO: Implemnet controls prop
	// TODO: Static video size when thumbnail-less or loading

	export default defineComponent({
		name: "Video",
		components: {
			LoadingBuffer,
			LeafRenderer,
			KaraokeRenderer,
			Play,
			Pause,
			VolumeOff,
			VolumeLow,
			VolumeMedium,
			VolumeHigh,
			Expand,
			ClosedCaptioning,
			UserList,
			Checkmark
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

				// States
				isPaused: true,
				isFullscreen: false,
				isBuffering: false,
				currentTime: 0,
				volume: 1,
				duration: 0,

				// Progress Bar
				isHoveringOverProgressBar: false,
				hoverCurrentTime: 0,

				// Subtitles
				selectedSubtitleLanguage: null as string | null,
				shouldShowSubtitles: false, // Used for hiding subtitles on video first load
				subtitles: {} as Record<string, string>,
				subtitleRenderer: null as SubtitlesOctopus | null,

				// Trays
				isVolumeTrayVisible: false,
				isSubtitleTrayVisible: false,

				// Gestures
				isBusy: false,
				isMouseInOverlay: false,
				isMouseStatic: false,
				lastMousePosition: [ 0, 0 ] as [ number, number ],
				mouseChecker: 0,
				lastClickTimestamp: 0

			};
		},
		computed: {

			// States
			isLeafEnabled (): boolean {
				return this.$store.state.settings.effects;
			},
			isKaraokeEnabled (): boolean {
				return this.$store.state.settings.karaoke;
			},
			isInPopOutMode (): boolean {
				return this.$route.path.match(/^\/watch\/.+|\/rooms\/.+$/i) === null;
			},

			// Timestamps
			formattedCurrentTime (): string {
				return formatTimestamp(this.currentTime);
			},
			formattedDuration (): string {
				return formatTimestamp(this.duration);
			},
			formattedHover (): string {
				return formatTimestamp(this.hoverCurrentTime);
			},

			// Style Bindings
			subtitleVisibility (): string {
				return this.shouldShowSubtitles
					? "visible"
					: "hidden";
			},
			videoProgress (): string {
				return `${this.currentTime > 0 ? (this.currentTime / this.duration) * 100 : 0}%`;
			},
			progressBarHoverTooltipPosition (): string {
				return `${(this.hoverCurrentTime / this.duration) * 100}%`;
			}

		},
		watch: {
			episode (episode: Episode) {

				const
					_episodeId = episode.id,
					_showId = this.show.id;

				if (this.video) {
					this.video.pause();
					this.video.currentTime = 0;
				}

				this.isPaused = true;
				this.currentTime = 0;
				this.shouldShowSubtitles = false;
				this.subtitles = {};
				this.selectedSubtitleLanguage = null;

				setTimeout(() => {
					if (this.episode.id === _episodeId && this.show.id === _showId) {
						this.selectedSubtitleLanguage = this.episode.subtitles[0].code;
					}
				}, 100);
			},
			isPaused (state: boolean) {

				this.pushSync();

				if (!state && !this.shouldShowSubtitles) {
					this.shouldShowSubtitles = true;
				}
			},
			async selectedSubtitleLanguage (langCode: string) {

				const
					_showId = this.show.id,
					_episodeId = this.episode.id;

				if (langCode) {

					let subtitlesContent = this.subtitles[langCode];

					if (!subtitlesContent) {

						await this.fetchSubtitleLanguage(langCode);

						// Re-get subtitles
						subtitlesContent = this.subtitles[langCode];
					}

					// Failed to fetch subtitles, abort
					if (!subtitlesContent) {
						return;
					}

					if (!this.subtitleRenderer) {
						this.initializeSubtitleRenderer(langCode);
					}

					// Make sure we're still on the same Show, Episode and Subtitle language
					if (
						this.subtitleRenderer
						&& this.selectedSubtitleLanguage === langCode
						&& this.show.id === _showId
						&& this.episode.id && _episodeId
					) {
						this.subtitleRenderer.setTrack(subtitlesContent);
					}

				} else {
					if (this.subtitleRenderer) {
						this.subtitleRenderer.freeTrack();
					}
				}
			},
			isMouseStatic (state: boolean) {
				if (state) {
					this.isVolumeTrayVisible = false;
					this.isSubtitleTrayVisible = false;
				}
			},
		},
		mounted () {

			document.addEventListener("keydown", this.handleKeypress);
			document.addEventListener("fullscreenchange", this.updateFullscreenState);
			document.addEventListener("mousemove", this.updateMousePosition);

			this.mouseChecker = window.setInterval(this.checkForStaticMouse, 100);

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

			this.selectedSubtitleLanguage = this.episode.subtitles[0].code;
		},
		beforeUnmount () {

			document.removeEventListener("keydown", this.handleKeypress);
			document.removeEventListener("fullscreenchange", this.updateFullscreenState);
			document.removeEventListener("mousemove", this.updateMousePosition);

			clearInterval(this.mouseChecker);

			this.destroySubtitleRenderer();
		},
		methods: {
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
							e.preventDefault(); // Prevents page scrolling
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

			// Progress Bar
			getProgressBarOffset (e: MouseEvent): number {
				return e.clientX - (e.pageX - e.offsetX);
			},
			getTimeFromProgressBar (e: MouseEvent, x: number): number {

				if (this.duration && e.target) {

					const
						width = (e.target as HTMLDivElement).clientWidth,
						duration = this.duration,
						time = (x / width) * duration;

					if (!isNaN(time)) {
						return time;
					}
				}

				return 0;
			},
			updateHoverCurrentTime (e: MouseEvent) {
				if (this.isHoveringOverProgressBar) {
					this.hoverCurrentTime = this.getTimeFromProgressBar(e, this.getProgressBarOffset(e));
				}
			},
			seek (e: MouseEvent) {
				if (this.isHoveringOverProgressBar && this.video) {
					this.video.currentTime = this.getTimeFromProgressBar(e, this.getProgressBarOffset(e));
				}
			},

			// Time
			updateCurrentTime (e: Event) {

				if (e.target) {
					this.currentTime = (e.target as HTMLVideoElement).currentTime;
				}

				this.isBuffering = false;
			},
			updateDuration (e: Event) {
				if (e.target) {
					this.duration = (e.target as HTMLVideoElement).duration;
				}
			},

			// States
			updateFullscreenState () {
				this.isFullscreen = document.fullscreenElement === this.videoContainer;
			},
			updateVolume (e: Event) {
				if (e.target) {
					this.volume = (e.target as HTMLVideoElement).volume;
				}
			},
			togglePlayPause () {
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

			// Subtitles
			initializeSubtitleRenderer (langCode: string) {
				if (this.video) {
					this.subtitleRenderer = new window.SubtitlesOctopus({
						video: this.video,
						subContent: this.subtitles[langCode] || "",
						workerUrl: "/libass/subtitles-octopus-worker.js",
						legacyWorkerUrl: "/libass/subtitles-octopus-worker-legacy.js",
						debug: DEV
					})
				}
			},
			destroySubtitleRenderer () {
				if (this.subtitleRenderer) {
					this.subtitleRenderer.dispose();
					this.subtitleRenderer = null;
				}
			},
			async fetchSubtitleLanguage (langCode: string) {

				const _subtitles = this.episode.subtitles.find((subtitles: Subtitles) => subtitles.code === langCode);

				if (_subtitles) {
					try {

						const
							rawData = await fetch(_subtitles.url),
							subtitles = await rawData.text();

						// Save content
						this.subtitles[langCode] = subtitles;

					} catch (err) {
						console.error(err);
					}
				}
			},
			selectSubtitleLanguage (langCode: string) {
				this.selectedSubtitleLanguage =
					this.selectedSubtitleLanguage === langCode
						? null
						: langCode;
			},

			// Gestures
			updateMousePosition (e: MouseEvent) {
				this.lastMousePosition = [ e.screenX, e.screenY ];
			},
			checkForStaticMouse () {

				const _pos = this.lastMousePosition;

				setTimeout(() => {
					this.isMouseStatic = this.lastMousePosition === _pos && !this.isHoveringOverProgressBar && !this.isBusy;
				}, 1500);
			},
			checkDoubleClick () {

				const now = Date.now();

				if ((now - this.lastClickTimestamp) < 200) {
					this.toggleFullscreen();
				}

				this.lastClickTimestamp = now;
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

	.video-tray-enter-active {
		transition: opacity .2s ease, transform .35s variable(easing-enter);
	}

	.video-tray-leave-active {
		transition: opacity .25s ease, transform .3s ease;
	}

	.video-tray-enter-from,
	.video-tray-leave-to {
		opacity: 0;
		transform: translateY(.5em) scale(90%);
	}

	// Containers

	.video-container {

		position: relative;
		display: inline-flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		z-index: 3;

		video {
			display: inline-block;
			width: 100%;
			height: auto;
		}
	}

	.video-inactive {
		cursor: none;
	}

	.karaoke {
		position: absolute;
		bottom: 1.5rem;
		left: .7rem;
	}

	// Overlay

	.video-overlay {

		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		pointer-events: none;

		.static-overlay {
			justify-content: center;
			z-index: 2;
			pointer-events: auto;
		}

		.hover-overlay {
			justify-content: flex-end;
			z-index: 3;
			pointer-events: none;
		}

		.static-overlay,
		.hover-overlay {
			position: absolute;
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}

	// Rows

	.fade-row,
	.control-row,
	.time-row {
		width: 100%;
	}

	.control-row,
	.time-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		pointer-events: auto;
	}

	.control-row {

		justify-content: space-between;
		padding-bottom: .5rem;

		> div {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			padding: 0 .5rem 0 .5rem;
		}

		.icon {
			cursor: pointer;
			filter: drop-shadow(0 0 10px #000);
		}

		.control-row-left .icon {
			height: 1.8rem;
			margin: 0 .2rem 0 .2rem;
		}

		.control-row-right .icon {
			height: 1.3rem;
			margin: 0 .4rem 0 .4rem;
		}

		.subtitle-button {
			height: 1.2rem !important;
		}

	}

	.time-row {

		justify-content: space-evenly;
		padding: .4rem 0 .4rem 0;

		.progress-bar-container {

			position: relative;
			flex: 1;

			.progress-bar,
			.progress-bar-snake {
				border-radius: 1.25rem;
			}

			.progress-bar {

				position: relative;
				height: .5em;
				background-color: variable(text-color);
				overflow: hidden;
				cursor: pointer;
				filter: drop-shadow(0 0 10px #000);

				.progress-bar-snake {
					position: absolute;
					width: v-bind(videoProgress);
					height: 100%;
					top: 0;
					left: 0;
					background-color: variable(primary-color);
					transition: width .3s ease;
					pointer-events: none;
				}
			}

			.progress-bar-hover-tooltip {
				position: absolute;
				display: flex;
				justify-content: center;
				align-items: center;
				width: auto;
				height: 1rem;
				top: -1.6rem;
				left: v-bind(progressBarHoverTooltipPosition);
				background-color: variable(container-background-color);
				transform: translateX(-50%);
				padding: .2rem .5rem .2rem .5rem;
				border-radius: 1.5rem;
			}
		}

		span {
			margin: 0 .9rem 0 .9rem;
			text-shadow: 0 0 10px #000;
			user-select: none;
		}
	}

	// Platters

	.video-tray {

		position: absolute;
		bottom: 4.5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: variable(tray-background-color);
		border-radius: variable(popup-border-radius);
		padding: .5rem;

		.video-tray-title {
			font-weight: bold;
			font-size: 1.1rem;
			padding: 0 2rem .7rem 2rem;
		}
	}

	.volume-tray {

		left: .5rem;

		input {
			width: 9rem;
		}
	}

	.subtitle-tray {

		right: 1.5rem;
		padding-left: 0;
		padding-right: 0;

		.subtitle-language-button {

			width: 100%;
			height: 2rem;
			padding: .2rem 0 .2rem 0;
			border-radius: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 1.1rem;

			svg {
				position: absolute;
				left: .4rem;
				height: 1rem !important;
			}
		}
	}

</style>

<style lang="scss">

	// Subtitles & Captions

	.libassjs-canvas-parent {
		position: absolute !important;
		left: 0;
		pointer-events: none;
		z-index: 1;
	}

	.libassjs-canvas {
		visibility: v-bind(subtitleVisibility);
	}

</style>