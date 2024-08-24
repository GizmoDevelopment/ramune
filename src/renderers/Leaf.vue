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
	import { defineComponent, type PropType, ref } from "vue";

	// Utils
	import { getRandomNumberFromRange } from "@utils/essentials";
	import { waitForImageLoad } from "@utils/dom";

	// Types
	import type { LeafRendererData, LeafRendererInstance } from "@typings/leaf";

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

				isVisible: false,
				backgroundColor: "transparent",

				// Simplifies timestamp match lookup
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
					this.currentData = null;
				}
			},
			async currentData (data: LeafRendererData | null) {
				if (data) {

					const
						renderQueue: LeafRendererInstance[] = [],
						{ particle } = data;

					if (this.canvas && particle) {

						const
							particleCount = particle.count,
							particleDirection = {
								x: getRandomNumberFromRange([ -1, 1 ]),
								y: getRandomNumberFromRange([ -1, 1 ])
							};
						
						let particleImage: HTMLImageElement | null = null;

						if (particle.image) {
							particleImage = new Image();
							particleImage.src = particle.image;
							await waitForImageLoad(particleImage);
						}

						for (let i = 0; i < particleCount; i++) {

							const instance: LeafRendererInstance = {
								shape: particle.shape,
								opacity: 1,
								size: {
									width: 1,
									height: 1
								},
								speed: {
									x: 1,
									y: 1
								},
								position: {
									x: Math.random() * this.canvas.width,
									y: Math.random() * this.canvas.height
								}
							};

							const instanceSize = typeof particle.size === "number"
								? particle.size
								: getRandomNumberFromRange(particle.size);

							instance.size = {
								width: instanceSize,
								height: instanceSize
							};

							if (particle.speed) {

								instance.speed.x = typeof particle.speed.x === "number"
									? particle.speed.x
									: getRandomNumberFromRange(particle.speed.x);

								instance.speed.y = typeof particle.speed.y === "number"
									? particle.speed.y
									: getRandomNumberFromRange(particle.speed.y);

								// Maintain consistent direction for all particles using "drift" movement
								if (particle.movementStyle === "drift") {
									instance.speed.x = Math.abs(instance.speed.x) * particleDirection.x;
									instance.speed.y = Math.abs(instance.speed.y) * particleDirection.y;
								}

							}

							if (particle.color) {
								instance.color = particle.color;
							}

							if (particle.movementStyle) {
								instance.movementStyle = particle.movementStyle;
							}

							if (particle.opacity) {
								if (typeof particle.opacity === "number") {
									instance.opacity = particle.opacity;
								} else {
									instance.opacity = getRandomNumberFromRange(particle.opacity);
								}
							}

							if (particleImage) {
								instance.image = particleImage;
							}

							// No point in keeping invisible particles
							if (instance.opacity !== 0) {
								renderQueue.push(instance);
							}

						}
					}

					if (data.background) {
						this.backgroundColor = data.background.color;
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

						const
							{ ctx, renderQueue } = this,
							canvas = ctx.canvas,
							instanceCount = renderQueue.length;

						ctx.clearRect(0, 0, canvas.width, canvas.height);

						for (let i = 0; i < instanceCount; i++) {

							const instance = renderQueue[i];

							if (instance) {

								const {
									size: { width: w, height: h },
									speed: { x: sX, y: sY }
								} = instance;

								let {
									position: { x, y }
								} = instance;

								// For some reason it doesn't correctly erase the previous particles
								// ctx.clearRect(x, y, w, h);

								if (x >= (canvas.width + w)) {
									x = -w;
								} else if (y >= (canvas.height + h)) {
									y = -h;
								} else {
									switch (instance.movementStyle) {
										case "sporadic":

											x += getRandomNumberFromRange([ -1, 1 ]) * sX;
											y += getRandomNumberFromRange([ -1, 1 ]) * sY;

											break;
										case "drift":

											x += sX;
											y += sY;

											break;
										default:
									}
								}

								ctx.globalAlpha = instance.opacity;

								if (instance.color) {
									ctx.fillStyle = instance.color;
								}

								if (instance.image) {
									ctx.drawImage(instance.image, 0, 0, instance.image.width, instance.image.height, x, y, w, h);
								} else {

									switch (instance.shape) {
										case "circle":
											ctx.beginPath();
											ctx.arc(x, y, w / 2, 0, FULL_RADIUS);
											break;
										case "square":
											ctx.beginPath();
											ctx.rect(x, y, w, h);
											break;
										default:
									}

									ctx.fill();
								}

								renderQueue[i].position.x = x;
								renderQueue[i].position.y = y;
							}
						}
					}

					setTimeout(() => {
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
		background-color: v-bind(backgroundColor);
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 2;
		pointer-events: none;
	}
</style>
