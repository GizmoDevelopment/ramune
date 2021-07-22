<template>
	<div class="karaoke-holder">
		<transition name="lyrics-appear">
			<div v-if="currentLyricsId.length && currentLine.length > 0" class="karaoke-container">
				<transition name="lyrics-line-slide" mode="out-in">
					<span>{{ currentLine }}</span>
				</transition>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">

	// TODO: Implement transitions for lines
	// TODO: Position in the subtitle field so it works in fullscreen

	// Modules
	import { defineComponent, PropType } from "vue";

	// Utils
	import { formatLyrics } from "@utils/lyrics";

	// Types
	import { Lyrics } from "@typings/show";
	import { FormattedLyrics } from "@typings/lyrics";

	export default defineComponent({
		name: "Karaoke",
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
				formattedLyrics: [] as FormattedLyrics[],
				currentLine: "",
				currentLyricsId: ""
			};
		},
		computed: {
			cachedFormattedLyrics (): Record<string, FormattedLyrics> {
				return this.$store.state.cachedFormattedLyrics;
			}
		},
		watch: {
			lyrics (lyrics: Lyrics[]) {
				this.reloadLyrics(lyrics);
			},
			timestamp (timestamp: number) {
				this.formattedLyrics.forEach((formattedLyrics: FormattedLyrics) => {
					if (timestamp >= formattedLyrics.start && timestamp < formattedLyrics.end) {

						let didPickLine = false;

						this.currentLyricsId = formattedLyrics.id;

						for (let line of formattedLyrics.lines) {

							// TODO: Add support for TimedLine
							if (typeof line.content === "string") {
								if (timestamp >= (formattedLyrics.start + line.start)) {

									didPickLine = true;
									this.currentLine = line.content;

									break;
								}
							}

						}

						if (!didPickLine) {
							this.currentLine = "";
						}

					} else if (this.currentLyricsId === formattedLyrics.id) {
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
			getCachedFormattedLyricsName (lyrics: Lyrics): string {
				return `${this.showId}-${lyrics.id}`;
			},
			reloadLyrics (lyrics: Lyrics[]) {

				const newLyrics: FormattedLyrics[] = [];

				lyrics.forEach((lyrics: Lyrics) => {

					const formattedLyricsName = this.getCachedFormattedLyricsName(lyrics);

					if (formattedLyricsName in this.cachedFormattedLyrics) {
						newLyrics.push(this.cachedFormattedLyrics[formattedLyricsName]);
					} else {

						const
							_showId = this.showId,
							_episodeId = this.episodeId;

						formatLyrics(lyrics).then((formattedLyrics: FormattedLyrics) => {
							if (this.showId === _showId && this.episodeId === _episodeId) {
								this.$store.commit("CACHE_FORMATTED_LYRICS", { showId: this.showId, lyrics: formattedLyrics });
								this.formattedLyrics.push(formattedLyrics);
							}
						}).catch(err => {
							console.error(err);
						});
					}
				});

				this.formattedLyrics = newLyrics;
			}
		}
	});

</script>

<style lang="scss" scoped>

	@import "@styles/main.scss";

	.lyrics-appear-enter-active,
	.lyrics-appear-leave-active {
		transition: opacity .5s ease;
	}

	.lyrics-appear-enter-from,
	.lyrics-appear-leave-to {
		opacity: 0;
	}

	.lyrics-line-slide-enter-active,
	.lyrics-line-slide-leave-active {
		transition: opacity .15s ease, transform .2s ease;
	}

	.lyrics-line-slide-enter-from {
		opacity: 0;
		transform: translateY(-.3em);
	}

	.lyrics-line-slide-leave-to {
		opacity: 0;
		transform: translateY(.3em);
	}

	.karaoke-holder {
		margin-top: .5rem;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.karaoke-container {
		background-color: variable(container-background-color);
		border-radius: variable(card-border-radius);
		padding: .5rem 1rem .5rem 1rem;
		font-size: 1.7em;
	}

</style>