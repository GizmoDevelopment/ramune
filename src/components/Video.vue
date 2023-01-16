<template>
	<div>
		<!-- ID is used for parenting the Room Chat to the container -->
		<div
			id="video-container"
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
						v-if="room"
						v-show="isFullscreen"
						class="overlay-user-list"
						:tooltips="false"
						:users="room.users"
						:host="room.host"
					/>
					<LoadingBuffer
						v-if="isBuffering"
						:size="isInPopOutMode ? 'small' : 'normal'"
					/>
					<div
						v-if="isSyncOverlayVisible"
						class="sync-overlay-container"
						@click="requestSync(); isSyncOverlayVisible = false"
					>
						<h2 class="sync-label">Click to sync</h2>
					</div>
				</div>
				<transition name="fade">
					<div
						v-show="(isMouseInOverlay && !isMouseStatic || isHoveringOverControls) && !isInPopOutMode"
						class="hover-overlay"
					>
						<div class="time-row">
							<span>{{ formattedCurrentTime }}</span>
							<div class="progress-bar-container">
								<div
									class="progress-bar"
									:class="{ 'non-selectable-progress-bar': !controls }"
									@click="seek"
									@mouseenter="isHoveringOverProgressBar = true"
									@mouseleave="isHoveringOverProgressBar = false"
									@mousemove="updateHoverCurrentTime"
								>
									<div class="flavorable progress-bar-snake" />
								</div>
								<div v-show="isHoveringOverProgressBar" class="progress-bar-hover-tooltip">{{ formattedHover }}</div>
							</div>
							<span>{{ formattedDuration }}</span>
						</div>
						<div class="control-row">
							<div
								class="control-row-left"
								@mouseenter="isHoveringOverControls = true"
								@mouseleave="isHoveringOverControls = false"
							>
								<div
									v-if="controls"
									class="icon"
									@click="togglePlayPause"
								>
									<Play v-if="isPaused" />
									<Pause v-else />
								</div>
								<Skip v-if="!room && show.format !== 'movie'" @click="skipEpisode" />
								<div class="icon volume-button" @click="isVolumeTrayVisible = !isVolumeTrayVisible">
									<VolumeOff v-if="muted" class="video-control-button" />
									<template v-else>
										<VolumeHigh v-if="volume >= .85" class="video-control-button" />
										<VolumeMedium v-else-if="volume >= .45" class="video-control-button" />
										<VolumeLow v-else-if="volume > 0" class="video-control-button" />
										<VolumeOff v-else class="video-control-button" />
									</template>
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
							<div
								class="control-row-right"
								@mouseenter="isHoveringOverControls = true"
								@mouseleave="isHoveringOverControls = false"
							>
								<ClosedCaptioning
									v-if="episode.subtitles.length > 0"
									class="subtitle-button"
									@click="isSubtitleTrayVisible = !isSubtitleTrayVisible"
								/>
								<transition name="video-tray">
									<div
										v-show="isSubtitleTrayVisible"
										class="video-tray subtitle-tray"
										@mouseenter="isBusy = true"
										@mouseleave="isSubtitleTrayVisible = false; isBusy = false"
									>
										<span class="video-tray-title">{{ $t("labels/subtitles") }}</span>
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
			<transition name="fade">
				<div v-if="isKaraokeEnabled">
					<KaraokeRenderer
						v-if="episode.data.lyrics && !isInPopOutMode"
						class="karaoke"
						:show-id="show.id"
						:episode-id="episode.id"
						:data="episode.data.lyrics"
						:timestamp="currentTime"
					/>
				</div>
			</transition>
		</div>
		<transition name="fade">
			<div v-if="isLeafEnabled">
				<LeafRenderer
					v-if="episode.data.effects && !isInPopOutMode && !isFullscreen"
					:data="episode.data.effects"
					:timestamp="currentTime"
				/>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType, ref } from "vue";
	import JASSUB from "jassub";
	import workerUrl from "jassub/dist/jassub-worker.js?url";
	// import legacyWorkerUrl from "jassub/dist/jassub-worker-legacy.js?url";
	import "jassub/dist/jassub-worker.wasm?url";
	
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
	import Skip from "@assets/icons/skip.svg?component";

	// Utils
	import { INPUT_ELEMENTS } from "@utils/constants";
	import { formatTimestamp } from "@utils/essentials";
	import { getEpisodeById } from "@utils/show";

	// Types
	import type { Episode, Show, Subtitles } from "@typings/show";
	import type { RoomSyncData } from "@typings/room";

	// Constants
	const DEV = import.meta.env.DEV;

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
			Checkmark,
			Skip
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
			}
		},
		emits: [ "update", "play-episode-id" ],
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
				isSyncOverlayVisible: false,
				muted: false,

				// Progress Bar
				isHoveringOverProgressBar: false,
				hoverCurrentTime: 0,

				// Subtitles
				selectedSubtitleLanguage: null as string | null,
				shouldShowSubtitles: false, // Used for hiding subtitles on video first load
				subtitleRenderer: null as JASSUB | null,

				// Trays
				isVolumeTrayVisible: false,
				isSubtitleTrayVisible: false,

				// Gestures
				isBusy: false,
				isMouseInOverlay: false,
				isMouseStatic: false,
				isHoveringOverControls: false,
				lastMousePosition: [ 0, 0 ] as [ number, number ],
				mouseChecker: 0,
				lastClickTimestamp: 0,

				// Misc
				volumeSaver: 0,
				firstSyncData: null as RoomSyncData | null

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
				this.selectedSubtitleLanguage = null;

				setTimeout(() => {
					if (this.episode.id === _episodeId && this.show.id === _showId) {
						this.selectedSubtitleLanguage = this.episode.subtitles[0]?.code || null;
					}
				}, 100);

				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});
			},
			isPaused (state: boolean) {

				this.pushSync();

				if (!state && !this.shouldShowSubtitles) {
					this.shouldShowSubtitles = true;
				}
			},
			async selectedSubtitleLanguage (langCode: string | null) {
				if (langCode) {
					
					const _subtitles = this.episode.subtitles.find((subtitles: Subtitles) => subtitles.code === langCode);

					if (_subtitles) {

						if (!this.subtitleRenderer) {
							this.initializeSubtitleRenderer(langCode);
						}

						if (this.subtitleRenderer) { // TS is too stupid to understand that we already checked for this
							this.subtitleRenderer.setTrackByUrl(_subtitles.url);
						}
					}

				} else {
					if (this.subtitleRenderer) {
						// !!! FIND A WAY TO NOT DESTROY THE RENDERER WITH EACH EPISODE CHANGE
						// this.subtitleRenderer.freeTrack();
						this.destroySubtitleRenderer();
					}
				}
			},
			isMouseStatic (state: boolean) {
				if (state) {
					this.isVolumeTrayVisible = false;
					this.isSubtitleTrayVisible = false;
				}
			}
		},
		mounted () {

			document.addEventListener("keydown", this.handleKeypress);
			document.addEventListener("fullscreenchange", this.updateFullscreenState);
			document.addEventListener("mousemove", this.updateMousePosition);

			this.mouseChecker = window.setInterval(this.checkForStaticMouse, 100);
			this.volumeSaver = window.setInterval(this.saveVolume, 1000);

			if (this.video) {

				this.volume = this.video.volume;

				this.video.addEventListener("canplay", () => {

					if (this.video) {

						// Fetch volume from settings
						this.video.volume = this.$store.state.settings.volume;

						// URL Timestamp
						if (this.$route.query.t && !this.room) {

							const givenTimestamp = `${this.$route.query.t}`;

							const
								minutesMatch = givenTimestamp.match(/(\d+?)m/i),
								secondsMatch = givenTimestamp.match(/(\d+?)s?$/i);

							let targetTimestamp = 0;

							if (minutesMatch) {

								const _minutes = Number(minutesMatch[1]) * 60;

								if (!isNaN(_minutes)) {
									targetTimestamp += _minutes;
								}
							}

							if (secondsMatch) {

								const _seconds = Number(secondsMatch[1]);

								if (!isNaN(_seconds)) {
									targetTimestamp += _seconds;
								}
							}

							if (targetTimestamp > 0) {
								this.video.currentTime = targetTimestamp;
							}
						}
					}

					// Request video data on Room join
					if (this.room && !this.isHost) {

						this.requestSync();

						setTimeout(() => {
							// Initial sync didn't succeed (autoplay might be off)
							if (
								this.video && this.firstSyncData
								&& this.video.paused !== !this.firstSyncData.playing
							) {
								this.isSyncOverlayVisible = true;
							}
						}, 350);
					}

				}, {
					once: true
				});
			}

			this.selectedSubtitleLanguage = this.episode.subtitles[0]?.code || null;
		},
		beforeUnmount () {

			document.removeEventListener("keydown", this.handleKeypress);
			document.removeEventListener("fullscreenchange", this.updateFullscreenState);
			document.removeEventListener("mousemove", this.updateMousePosition);

			clearInterval(this.mouseChecker);
			clearInterval(this.volumeSaver);

			this.destroySubtitleRenderer();
		},
		methods: {

			handleKeypress (e: KeyboardEvent) {
				// Only process keys if user isn't focused on any inputs/spans/textareas
				if (this.video && document.activeElement && !INPUT_ELEMENTS.includes(document.activeElement.tagName)) {
					switch (e.code) {
						case "ArrowLeft":

							if (this.controls)
								this.video.currentTime -= 5;

							break;
						case "ArrowRight":

							if (this.controls)
								this.video.currentTime += 5;

							break;
						case "Space":

							if (this.controls) {
								this.togglePlayPause();
								e.preventDefault(); // Prevents page scrolling
							}

							break;
						case "KeyF":
							this.toggleFullscreen();
							break;
						case "Digit0":

							if (this.controls) {
								this.video.currentTime = 0;
							}

							break;
						case "KeyM":

							this.video.muted = !this.video.muted;

							break;
						default:
					}
				}
			},
			skipEpisode () {

				if (this.room && !this.isHost) {
					return;
				}

				const nextEpisode = getEpisodeById(this.show, this.episode.id + 1);

				if (nextEpisode) {
					this.$emit("play-episode-id", nextEpisode.id);
				}
			},

			// Room
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
			requestSync () {
				this.$socket.client.emit("CLIENT:REQUEST_ROOM_SYNC");
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
				if (this.controls && this.isHoveringOverProgressBar && this.video) {
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
					this.muted = (e.target as HTMLVideoElement).muted;
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
						} else {
							this.videoContainer.requestFullscreen();
						}
					}
				}
			},

			// Subtitles
			initializeSubtitleRenderer (langCode: string) {
				if (this.video) {

					const notFirefox = navigator.userAgent.match(/Mozilla/i) === null;

					this.subtitleRenderer = new JASSUB({
						video: this.video,
						workerUrl,
						// legacyWorkerUrl,
						subUrl: this.episode.subtitles.find(sub => sub.code === langCode)?.url || this.episode.subtitles[0].url,
						debug: DEV,
						// ! Firefox does not currently properly implement the OffscreenCanvas API
						offscreenRender: notFirefox,
						// Async render apparently performs poorly on Firefox
						asyncRender: notFirefox,
						fallbackFont: "noto sans jp",
						availableFonts: {
							"noto sans jp": "/fonts/NotoSansJP-Regular.woff2"
						}
					});
				}
			},
			destroySubtitleRenderer () {
				if (this.subtitleRenderer) {
					this.subtitleRenderer.destroy();
					this.subtitleRenderer = null;
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
			},

			// Misc
			saveVolume () {
				if (this.$store.state.settings.volume !== this.volume) {
					this.$store.commit("settings/UPDATE_VOLUME", this.volume);
				}
			}
		},
		sockets: {
			"ROOM:SYNC" (data: RoomSyncData) {
				if (this.video && this.room) {

					this.video.currentTime = data.currentTime;

					if (data.playing) {
						this.video.play();
					} else {
						this.video.pause();
					}

					if (!this.firstSyncData) {
						this.firstSyncData = data;
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

	@import "@styles/main";
	@import "@styles/variables";

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
		transform: translateY(.4em) scale(95%);
	}

	// Containers

	.video-container {

		background-color: #000;

		min-width: 100%;
		position: relative;
		display: inline-flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		z-index: 3;

		video {
			display: inline-block;
			width: 100%;
			height: 100%;
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

	.overlay-user-list {
		position: absolute;
		top: 0;
		left: 0;
		height: 2.25rem;
		margin: 1rem;
		pointer-events: none;
	}

	// Overlays

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

	.sync-overlay-container {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: variable(container-background-color);
		display: flex;
		justify-content: center;
		align-items: center;

		.sync-label {
			user-select: none;
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
					transition: $flavorable-transitions, width .3s ease;
					pointer-events: none;
				}
			}

			.non-selectable-progress-bar {
				cursor: default;
			}

			.progress-bar-hover-tooltip {

				position: absolute;
				width: auto;
				height: 1rem;
				top: -2.2rem;

				left: v-bind(progressBarHoverTooltipPosition);
				transform: translateX(-50%);

				display: flex;
				justify-content: center;
				align-items: center;
				
				font-size: 1.2rem;
				background-color: variable(container-background-color);
				padding: .4rem .7rem .4rem .7rem;
				border-radius: 1.5rem;
			}
		}

		span {
			margin: 0 .9rem 0 .9rem;
			text-shadow: 0 0 10px #000;
			user-select: none;
		}
	}

	// Trays

	.video-tray {

		position: absolute;
		bottom: 4.5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: variable(tray-background-color);
		border: variable(border-style);
		border-radius: variable(popup-border-radius);
		padding: .5rem;

		.video-tray-title {
			font-weight: bold;
			font-size: 1.1rem;
			padding: 0 2rem .7rem 2rem;
		}
	}

	.volume-tray {

		left: -3rem;

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

	/* stylelint-disable-next-line selector-class-pattern */
	.JASSUB {

		position: absolute !important;
		width: 100%;
		left: 0;
		pointer-events: none;
		z-index: 1;

		canvas {
			visibility: v-bind(subtitleVisibility);
		}
	}

</style>
