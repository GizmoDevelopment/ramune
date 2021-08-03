<template>
	<transition name="leaf-renderer">
		<canvas
			v-show="isVisible"
			ref="canvas"
			class="canvas"
		/>
	</transition>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType, ref } from "vue";

	// Utils
	import { getRandomNumberFromRange } from "@utils/essentials";
	import { waitForImageLoad } from "@utils/dom";

	// Types
	import { LeafRendererData, LeafRendererInstance } from "@typings/leaf";

	// Variables
	const FRAME_INTERVAL = (1 / 30) * 1000; // 30 FPS is less stressful than 60 FPS and fast enough for our eyes to perceive motion
	const FULL_RADIUS = Math.PI * 2;

	export default defineComponent({
		name: "Leaf",
		props: {
			data: {
				type: Array as PropType<LeafRendererData[]>,
				required: true
			},
			timestamp: {
				type: Number,
				required: true
			}
		},
		setup () {

			const canvas = ref<HTMLCanvasElement>();

			return {
				canvas
			};
		},
		data () {
			return {
				// Simplifies timestamp match lookup
				isVisible: false,
				reversedData: [] as LeafRendererData[],
				currentData: null as LeafRendererData | null,
				ctx: null as CanvasRenderingContext2D | null,
				renderQueue: [] as LeafRendererInstance[]
			};
		},
		watch: {
			data (data: LeafRendererData[]) {

				this.reversedData = data.reverse();

				// Reset data to hide previous effects
				this.isVisible = false;
				this.currentData = null;
				this.renderQueue = [];

			},
			timestamp (timestamp: number) {

				let chosenIndex = -1;

				for (let i = 0; i <= this.reversedData.length; i++) {

					const data = this.reversedData[i];

					if (data && timestamp >= data.start && timestamp < data.end) {

						this.isVisible = timestamp < (data.end - 3);
						this.currentData = data;

						chosenIndex = i;

						break;
					}
				}

				// If nothing got picked
				if (chosenIndex === -1) {

					this.isVisible = false;

					if (this.currentData) {

						const lastData = this.currentData;

						setTimeout(() => {
							// If the same effect was last used in 3s, finish fade-out
							if (
								(this.currentData && lastData.start === this.currentData.start && lastData.end === this.currentData.end)
								&& (this.timestamp > lastData.end || this.timestamp < lastData.start)
							) {
								this.currentData = null;
							}
						}, 3000);
					} else {
						this.currentData = null;
					}
				}
			},
			async currentData (data: LeafRendererData | null) {
				if (data) {

					const
						renderQueue: LeafRendererInstance[] = [],
						{ particle } = data;

					if (this.canvas && particle) {

						let particleImage: HTMLImageElement | null = null;

						if (particle.image) {
							particleImage = new Image();
							particleImage.src = particle.image;
							await waitForImageLoad(particleImage);
						}

						for (let i = 0; i <= particle.count; i++) {

							const particleSize = typeof particle.size === "number"
								? particle.size
								: getRandomNumberFromRange(particle.size);

							let
								particleSpeedX = 1,
								particleSpeedY = 1;

							if (particle.speed) {
								particleSpeedX = typeof particle.speed.x === "number"
									? particle.speed.x
									: getRandomNumberFromRange(particle.speed.x),
								particleSpeedY = typeof particle.speed.y === "number"
									? particle.speed.y
									: getRandomNumberFromRange(particle.speed.y);
							}

							const constructedParticle: LeafRendererInstance = {
								color: particle.color,
								shape: particle.shape,
								opacity: particle.opacity
									? typeof particle.opacity === "number"
										? particle.opacity
										: getRandomNumberFromRange(particle.opacity)
									: 1,
								size: {
									width: particleSize,
									height: particleSize
								},
								speed: {
									x: particleSpeedX,
									y: particleSpeedY
								},
								position: {
									x: Math.random() * this.canvas.width,
									y: Math.random() * this.canvas.height
								}
							};

							if (particle.movementStyle) {
								constructedParticle.movementStyle = particle.movementStyle;
							}

							if (particleImage) {
								constructedParticle.image = particleImage;
							}

							renderQueue.push(constructedParticle);
						}
					}

					this.renderQueue = renderQueue;
				} else {
					this.renderQueue = [];
				}
			},
			renderQueue (renderQueue: LeafRendererInstance[]) {
				if (renderQueue.length > 0) this.animate();
			}
		},
		mounted () {

			window.addEventListener("resize", this.correctCanvasSize);

			this.correctCanvasSize();

			if (this.canvas) {
				this.ctx = this.canvas.getContext("2d");
			}

			// Slice is used to prevent #reverse() from mutating the prop value
			this.reversedData = this.data.slice().reverse();
		},
		beforeUnmount () {

			// Reset data to hide previous effects
			this.isVisible = false;
			this.currentData = null;
			this.renderQueue = [];

			window.removeEventListener("resize", this.correctCanvasSize);
		},
		methods: {
			animate () {
				requestAnimationFrame(() => {

					if (this.canvas && this.ctx) {

						const { canvas, ctx, renderQueue } = this;

						for (let i = 0; i <= renderQueue.length; i++) {

							const instance = renderQueue[i];

							if (instance) {

								ctx.fillStyle = instance.color;
								ctx.globalAlpha = instance.opacity;

								if (instance.image) {
									ctx.drawImage(instance.image, 0, 0, instance.image.width, instance.image.height, instance.position.x, instance.position.y, instance.size.width, instance.size.height);
								} else {

									switch (instance.shape) {
										case "circle":
											ctx.beginPath();
											ctx.arc(instance.position.x, instance.position.y, instance.size.width / 2, 0, FULL_RADIUS);
											break;
										default:
									}

									ctx.fill();
								}

								if (instance.position.x >= (canvas.width + instance.size.width)) {
									this.updateInstancePosition(instance, i, {
										x: -1 * instance.size.width,
										y: instance.position.y
									});
								} else if (instance.position.y >= (canvas.height + instance.size.height)) {
									this.updateInstancePosition(instance, i, {
										x: instance.position.x,
										y: -1 * instance.size.height
									});
								} else {
									switch (instance.movementStyle) {
										case "sporadic":

											this.updateInstancePosition(instance, i, {
												x: instance.position.x + getRandomNumberFromRange([ -1, 1 ]) * instance.speed.x,
												y: instance.position.y + getRandomNumberFromRange([ -1, 1 ]) * instance.speed.y
											});

											break;
										case "driftBottomRight":

											this.updateInstancePosition(instance, i, {
												x: instance.position.x + instance.speed.x,
												y: instance.position.y + instance.speed.y
											});

											break;
										default:
									}
								}
							}
						}
					}

					setTimeout(() => {

						if (this.canvas && this.ctx) {
							this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
						}

						if (this.currentData) {
							this.animate();
						}

					}, FRAME_INTERVAL);
				});
			},
			correctCanvasSize () {
				if (this.canvas) {

					const { innerWidth, innerHeight, devicePixelRatio } = window;

					this.canvas.width = Math.floor(innerWidth * devicePixelRatio);
					this.canvas.height = Math.floor(innerHeight * devicePixelRatio);
				}
			},
			updateInstancePosition (instance: LeafRendererInstance, instanceIndex: number, { x, y }: { x: number, y: number }) {
				this.renderQueue[instanceIndex] = {
					...instance,
					position: {
						x,
						y
					}
				};
			}
		}
	});

</script>

<style lang="scss" scoped>

	.leaf-renderer-enter-from,
	.leaf-renderer-leave-to {
		opacity: 0;
	}

	.leaf-renderer-enter-active,
	.leaf-renderer-leave-active {
		transition: opacity 2s ease-in-out;
	}

	.canvas {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
	}
</style>