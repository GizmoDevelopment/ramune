<template>
	<div v-if="effect" id="effect-container">
		<div v-if="effect.renderer === 'tsparticles'">
			<Particles
				id="tsparticles"
				:options="effect.data"
			/>
		</div>
		<div v-else-if="effect.renderer === 'leaf'">
			<Leaf
				:data="effect.data"
			/>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import Leaf from "@renderers/Leaf.vue";

	// Types
	import { EpisodeEffect } from "@typings/show";

	export default defineComponent({
		name: "EffectsRenderer",
		components: {
			Leaf
		},
		props: {
			effects: {
				type: Object as PropType<EpisodeEffect[]>,
				required: true
			},
			timestamp: {
				type: Number,
				default: 0
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
		watch: {
			timestamp (time: number) {

				if (this.effect && time > this.effect.end) {
					this.currentEffectIndex = -1;
				}

				this.effects.forEach((effect: EpisodeEffect, index: number) => {
					if (time >= effect.start && time < effect.end) {
						this.currentEffectIndex = index;
					}
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
		z-index: -1;
	}

</style>