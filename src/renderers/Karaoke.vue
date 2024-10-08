<template>
	<transition name="lyrics-appear">
		<div v-if="currentLyricsId.length && (currentLine.length > 0 || isTitleLine)" class="karaoke-holder">
			<MusicNote />
			<div class="lyrics-container">
				<transition name="lyrics-line-slide" mode="out-in">
					<div
						v-if="isTitleLine"
						class="karaoke-title-line"
					>
						<span class="karaoke-song-title">{{ songTitle }}</span>
						<span class="karaoke-song-artist">By {{ songArtist }}</span>
					</div>
					<span
						v-else
						:key="currentLineIndex"
						class="karaoke-line"
					>
						<i>{{ currentLine }}</i>
					</span>
				</transition>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, type PropType } from "vue";

	// Icons
	import MusicNote from "@assets/icons/music-note.svg?component";

	// Utils
	import { formatLyrics } from "@utils/lyrics";

	// Types
	import type { Lyrics } from "@typings/show";
	import type { ParsedLyrics } from "@typings/lyrics";

	export default defineComponent({
		name: "Karaoke",
		components: {
			MusicNote
		},
		props: {
			showId: {
				type: String,
				required: true
			},
			episodeId: {
				type: Number,
				required: true
			},
			data: {
				type: Array as PropType<Lyrics[]>,
				default: () => []
			},
			timestamp: {
				type: Number,
				default: 0
			}
		},
		data () {
			return {
				currentLyricsId: "",
				songTitle: "",
				songArtist: "",
				currentLine: "",
				currentLineIndex: 0,
				isTitleLine: false
			};
		},
		computed: {
			cachedParsedLyrics (): Map<string, ParsedLyrics> {
				return this.$store.state.cache.parsedLyrics;
			}
		},
		watch: {
			data (lyrics: Lyrics[]) {
				this.reloadLyrics(lyrics);
			},
			timestamp (timestamp: number) {

				this.data.forEach((lyrics: Lyrics) => {

					const parsedLyrics = this.cachedParsedLyrics.get(this.getCachedParsedLyricsName(lyrics));

					if (parsedLyrics) {
						if (timestamp >= lyrics.start && timestamp < (lyrics.start + parsedLyrics.length)) {

							let
								didPickLine = false,
								lineCounter = 0;

							this.currentLyricsId = parsedLyrics.id;

							for (const line of parsedLyrics.lines) {

								// TODO: Add support for TimedLine
								if (typeof line.content === "string") {
									if (timestamp >= (lyrics.start + line.start)) {

										didPickLine = true;

										this.isTitleLine = false;
										this.currentLine = line.content;
										this.currentLineIndex = lineCounter;

										break;
									}
								}

								lineCounter++;
							}

							if (!didPickLine) {

								this.isTitleLine = (timestamp - lyrics.start) < 5;

								if (this.isTitleLine) {
									this.songTitle = parsedLyrics.title;
									this.songArtist = parsedLyrics.artist;
								} else {
									this.currentLine = "";
								}
							}

						} else if (this.currentLyricsId === parsedLyrics.id) {
							this.currentLyricsId = "";
						}
					}
				});
			}
		},
		mounted () {
			if (this.data.length > 0) {
				this.reloadLyrics(this.data);
			}
		},
		methods: {
			getCachedParsedLyricsName (lyrics: Lyrics): string {
				return `${this.showId}-${lyrics.id}`;
			},
			reloadLyrics (lyrics: Lyrics[]) {

				// Reset data so old lyrics don't stay on screen
				this.currentLyricsId = "";
				this.currentLine = "";
				this.songArtist = "";
				this.songTitle = "";
				this.currentLineIndex = 0;
				this.isTitleLine = false;

				lyrics.forEach((lyrics: Lyrics) => {

					const parsedLyricsName = this.getCachedParsedLyricsName(lyrics);

					if (!this.cachedParsedLyrics.has(parsedLyricsName)) {

						const
							_showId = this.showId,
							_episodeId = this.episodeId;

						formatLyrics(lyrics).then((parsedLyrics: ParsedLyrics) => {
							if (this.showId === _showId && this.episodeId === _episodeId) {
								this.$store.commit("cache/CACHE_PARSED_LYRICS", { showId: this.showId, lyrics: parsedLyrics });
							}
						}).catch(err => {
							console.error(err);
						});
					}

				});
			}
		}
	});

</script>

<style lang="scss" scoped>

	@import "@styles/main";

	.lyrics-appear-enter-active,
	.lyrics-appear-leave-active {
		transition: opacity .35s ease, transform .25s ease-in-out;
	}

	.lyrics-appear-enter-from,
	.lyrics-appear-leave-to {
		opacity: 0;
		transform: translateY(.4rem) scale(98%);
	}

	.lyrics-line-slide-enter-active,
	.lyrics-line-slide-leave-active {
		transition: opacity .05s ease, transform .1s ease;
	}

	.lyrics-line-slide-enter-from {
		opacity: 0;
		transform: translateY(.2rem);
	}

	.lyrics-line-slide-leave-to {
		opacity: 0;
		transform: translateY(-.2rem);
	}

	.karaoke-holder {

		background-color: variable(container-background-color);
		border-radius: variable(popup-border-radius);
		padding: 0 1rem 0 1rem;

		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		svg {
			height: 2em;
		}
	}

	.lyrics-container {

		padding: .5rem 1rem .5rem 1rem;
		font-size: 2em;

		.karaoke-line {
			display: inline-block;
			font-size: .9em;
		}
	}

	@media only screen and (max-width: 1100px) {

		.karaoke-holder {
			padding: 0 .5rem 0 .5rem;
			font-size: 10px;
		}

		.lyrics-container {
			padding: .15rem 0 .15rem .5rem;
		}

	}

	@media only screen and (max-width: 750px) {
		.karaoke-holder {
			font-size: 5px;
		}
	}

	.karaoke-title-line {

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;

		.karaoke-song-title {
			font-weight: bold;
			font-size: .8em;
			text-align: left;
		}

		.karaoke-song-artist {
			font-weight: 400;
			font-size: .5em;
			text-align: left;
		}
	}

</style>
