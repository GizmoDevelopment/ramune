<template>
	<transition name="lyrics-appear">
		<div v-if="currentLyricsId.length && currentLine.length > 0" class="karaoke-holder">
			<MusicNote />
			<div class="lyrics-container">
				<transition name="lyrics-line-slide" mode="out-in">
					<span :key="currentLineIndex">
						<template v-if="isTitleLine">{{ currentLine }}</template>
						<i v-else>{{ currentLine }}</i>
					</span>
				</transition>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Icons
	import MusicNote from "@assets/icons/music-note.svg?component";

	// Utils
	import { formatLyrics } from "@utils/lyrics";

	// Types
	import { Lyrics } from "@typings/show";
	import { ParsedLyrics } from "@typings/lyrics";

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
			lyrics: {
				type: Object as PropType<Lyrics[]>,
				required: true
			},
			timestamp: {
				type: Number,
				default: 0
			}
		},
		data () {
			return {
				parsedLyrics: [] as ParsedLyrics[],
				currentLyricsId: "",
				currentLine: "",
				currentLineIndex: 0,
				isTitleLine: false
			};
		},
		computed: {
			cachedParsedLyrics (): Record<string, ParsedLyrics> {
				return this.$store.state.cachedParsedLyrics;
			}
		},
		watch: {
			lyrics (lyrics: Lyrics[]) {
				this.reloadLyrics(lyrics);
			},
			timestamp (timestamp: number) {
				this.parsedLyrics.forEach((parsedLyrics: ParsedLyrics) => {
					if (timestamp >= parsedLyrics.start && timestamp < parsedLyrics.end) {

						let
							didPickLine = false,
							lineCounter = 0;

						this.currentLyricsId = parsedLyrics.id;

						for (let line of parsedLyrics.lines) {

							// TODO: Add support for TimedLine
							if (typeof line.content === "string") {
								if (timestamp >= (parsedLyrics.start + line.start)) {

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
							if ((timestamp - parsedLyrics.start) < 5) {
								this.isTitleLine = true;
								this.currentLine = `${ parsedLyrics.artist } - ${ parsedLyrics.title }`;
							} else {
								this.currentLine = "";
							}
						}

					} else if (this.currentLyricsId === parsedLyrics.id) {
						this.currentLyricsId = "";
					}
				});
			}
		},
		mounted () {
			if (this.lyrics.length > 0) {
				this.reloadLyrics(this.lyrics);
			}
		},
		methods: {
			getCachedParsedLyricsName (lyrics: Lyrics): string {
				return `${this.showId}-${lyrics.id}`;
			},
			reloadLyrics (lyrics: Lyrics[]) {

				const newLyrics: ParsedLyrics[] = [];

				lyrics.forEach((lyrics: Lyrics) => {

					const parsedLyricsName = this.getCachedParsedLyricsName(lyrics);

					if (parsedLyricsName in this.cachedParsedLyrics) {
						newLyrics.push(this.cachedParsedLyrics[parsedLyricsName]);
					} else {

						const
							_showId = this.showId,
							_episodeId = this.episodeId;

						formatLyrics(lyrics).then((parsedLyrics: ParsedLyrics) => {
							if (this.showId === _showId && this.episodeId === _episodeId) {
								this.$store.commit("CACHE_FORMATTED_LYRICS", { showId: this.showId, lyrics: parsedLyrics });
								this.parsedLyrics.push(parsedLyrics);
							}
						}).catch(err => {
							console.error(err);
						});
					}
				});

				this.parsedLyrics = newLyrics;
			}
		}
	});

</script>

<style lang="scss" scoped>

	@import "@styles/main.scss";

	.lyrics-appear-enter-active,
	.lyrics-appear-leave-active {
		transition: opacity .4s ease, transform .3s ease-in-out;
	}

	.lyrics-appear-enter-from,
	.lyrics-appear-leave-to {
		opacity: 0;
		transform: translateY(.4rem) scale(98%);
	}

	.lyrics-line-slide-enter-active,
	.lyrics-line-slide-leave-active {
		transition: opacity .1s ease, transform .15s ease;
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
		border-radius: variable(card-border-radius);
		padding-left: 1rem;
		padding-right: 1rem;

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

		span {
			display: inline-block;
		}
	}

</style>