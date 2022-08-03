<template>
	<div
		ref="draggable"
		class="draggable-wrapper"
	>
		<slot />
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType, ref } from "vue";

	// Types
	interface Pos2 {
		x: number;
		y: number;
	}

	export default defineComponent({
		name: "Draggable",
		props: {
			startPosition: {
				type: String as PropType<"topLeft" | "bottomLeft">,
				default: "topLeft"
			}
		},
		data () {
			return {

				// States
				isDragging: false,

				// Read-only
				originPosition: null as Pos2 | null,
				position: null as Pos2 | null,
				animationSpeed: "0s", // Start with no animation to prevent "gliding" to start position

				offset: { x: 0, y: 0 } as Pos2,
			};
		},
		computed: {
			draggableTransform () {
				return `translateX(${this.offset.x}px) translateY(${this.offset.y}px)`;
			}
		},
		watch: {
			isDragging (state: boolean) {
				this.animationSpeed = state
					? "0s"
					: ".6s";
			}
		},
		setup () {

			const draggable = ref<HTMLDivElement>();

			return {
				draggable
			};
		},
		mounted () {

			if (this.draggable) {

				const { x, y, width, height } = this.draggable.getBoundingClientRect();

				this.position = { x, y };

				this.originPosition = {
					x: width / 2,
					y: height / 2
				};

				if (this.startPosition === "bottomLeft") {
					this.offset = {
						x: 0,
						y: window.innerHeight - height - 40
					};
				}

				this.draggable.addEventListener("mousedown", this.startDragMode);
			}

			document.addEventListener("mouseup", this.stopDragMode);
			document.addEventListener("mousemove", this.updateOffset);
		},
		beforeUnmount () {

			if (this.draggable) {
				this.draggable.removeEventListener("mousedown", this.startDragMode);
			}

			document.removeEventListener("mouseup", this.stopDragMode);
			document.removeEventListener("mousemove", this.updateOffset);
		},
		methods: {
			startDragMode (e: MouseEvent) {

				// Prevents text selection while dragging
				e.preventDefault();

				this.isDragging = true;
			},
			stopDragMode () {

				this.isDragging = false;

				if (this.originPosition) {

					// Snap to corners

					const finalOffset: Pos2 = {
						x: this.offset.x,
						y: this.offset.y
					};

					const windowOrigin: Pos2 = {
						x: window.innerWidth / 2,
						y: window.innerHeight / 2
					};

					if (finalOffset.x > windowOrigin.x) {
						finalOffset.x = window.innerWidth - 2 * this.originPosition.x - 40;
					} else if (finalOffset.x < windowOrigin.x) {
						finalOffset.x = 0;
					}

					if (finalOffset.y > windowOrigin.y) {
						finalOffset.y = window.innerHeight - 2 * this.originPosition.y - 40;
					} else if (finalOffset.y < windowOrigin.y) {
						finalOffset.y = 0;
					}

					this.offset = finalOffset;
				}
			},
			updateOffset (e: MouseEvent) {
				if (this.isDragging && this.position && this.originPosition) {

					const
						x = e.pageX,
						y = e.pageY;

					const _offset: Pos2 = {
						x: this.offset.x,
						y: this.offset.y
					};

					if (
						x > this.originPosition.x
						&& x < (window.innerWidth - this.originPosition.x)
					) {
						_offset.x = x - this.position.x - this.originPosition.x;
					}

					if (
						y > this.originPosition.y
						&& y < (window.innerHeight - this.originPosition.y)
					) {
						_offset.y = y - this.position.y - this.originPosition.y;
					}

					this.offset = _offset;
				}
			}
		}
	});

</script>

<style lang="scss" scoped>

	.draggable-wrapper {
		position: relative;
		display: inline-block;
		transform: v-bind(draggableTransform);
		transition: v-bind(animationSpeed) cubic-bezier(.12, -.09, .04, 1.04);
	}

</style>