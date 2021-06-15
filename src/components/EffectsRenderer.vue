<template>
	<div v-if="effect" id="effect-container">
		<Particles
			id="tsparticles"
			:options="effect.data"
		/>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Types
	import { EpisodeEffect } from "@typings/show";

	export default defineComponent({
		name: "EffectsRenderer",
		props: {
			effects: {
				type: Object as PropType<EpisodeEffect[]>,
				required: true
			}
		},
		data () {
			return {
				currentEffectIndex: -1
			};
		},
		computed: {
			effect (): EpisodeEffect | null {
				return this.currentEffectIndex >= 0
					? this.effects[this.currentEffectIndex]
					: null;
			}
		},
		mounted () {

			const videoElement = <HTMLVideoElement | null>document.getElementById("video-player");

			if (videoElement) {
				videoElement.addEventListener("timeupdate", () => {
					
					const time = videoElement.currentTime;

					if (this.effect && time > this.effect.end) {
						this.currentEffectIndex = -1;
					}

					this.effects.forEach((effect: EpisodeEffect, index: number) => {
						if (time >= effect.start && time < effect.end) {
							this.currentEffectIndex = index;
						}
					});

				});
			}
		}
	});

</script>

<style scoped>

	#effect-container {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 2;
	}

</style>