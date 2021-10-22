<template>
	<teleport to="#app">
		<div class="popup">
			<transition name="fade-popup-overlay">
				<div
					v-if="visible"
					class="overlay"
				/>
			</transition>
			<div
				class="popup-scroller"
				:style="{
					pointerEvents: scrollerPointerEvents,
					overflowY: scrollerOverflowY
				}"
				@click="dismiss"
			>
				<div class="popup-container">
					<transition name="slide-popup">
						<div
							v-if="visible"
							class="popup-content"
							:class="{ 'transparent-popup': transparent }"
							@click.stop
						>
							<div
								v-if="title || dismissable"
								class="popup-title-bar"
								:class="{ 'floating-title-bar': floatingTitleBar }"
							>
								<h2 class="popup-title">{{ title }}</h2>
								<Close
									v-if="dismissable"
									class="popup-close-button"
									@click="dismiss"
								/>
							</div>
							<slot />
						</div>
					</transition>
				</div>
			</div>
		</div>
	</teleport>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Icons
	import Close from "@assets/icons/close.svg?component";

	export default defineComponent({
		name: "Popup",
		components: {
			Close
		},
		props: {
			title: {
				type: String,
				default: ""
			},
			visible: {
				type: Boolean,
				default: false
			},
			dismissable: {
				type: Boolean,
				default: true
			},
			transparent: {
				type: Boolean,
				default: false
			},
			floatingTitleBar: {
				type: Boolean,
				default: false
			}
		},
		emits: [ "dismiss" ],
		data () {
			return {
				initial: true
			};
		},
		computed: {
			scrollerPointerEvents () {
				return this.visible
					? "auto"
					: "none";
			},
			scrollerOverflowY () {
				return this.visible
					? "scroll"
					: "hidden";
			}
		},
		watch: {
			visible: {
				immediate: true,
				handler (state: boolean) {

					const body = document.getElementsByTagName("body");

					if (state) {
						body[0].classList.add("no-scroll");
					} else if (!this.initial) {
						body[0].classList.remove("no-scroll");
					}

					this.initial = false;
				}
			}
		},
		methods: {
			dismiss () {
				if (this.dismissable) {
					this.$emit("dismiss");
				}
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main";

	// Transitions

	.fade-popup-overlay-enter-active,
	.fade-popup-overlay-leave-active {
		transition: opacity .3s ease-in-out;
	}

	.fade-popup-overlay-enter-from,
	.fade-popup-overlay-leave-to {
		opacity: 0;
	}

	.slide-popup-enter-active {
		transition: transform .45s variable(easing-enter), opacity .25s ease;
	}

	.slide-popup-leave-active {
		transition: transform .3s ease-out, opacity .25s ease;
	}

	.slide-popup-enter-from,
	.slide-popup-leave-to {
		opacity: 0;
	}

	.slide-popup-enter-from {
		transform: translateY(3rem) scale(99%);
	}

	.slide-popup-leave-to {
		transform: translateY(1rem) scale(99%);
	}

	//

	.popup {

		position: fixed;

		z-index: 20;
		pointer-events: none;

		.overlay {
			position: fixed;
		}

		.popup-scroller {

			position: fixed;
			width: 100%;
			height: 100vh;
			top: 0;

			display: flex;
			justify-content: center;

			pointer-events: auto;
			overflow-x: hidden;
			overflow-y: scroll;

			.popup-container {
				.popup-content {

					position: relative;
					width: auto;
					min-width: 300px;

					margin: 10% 0 20px 0;
					padding: 1em;
					box-shadow: 0 10px 30px 5px rgba(0, 0, 0, .6);

					background-color: variable(container-background-color);
					border-radius: variable(popup-border-radius);

					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: center;
				}
			}
		}

	}

	.popup-title-bar {

		width: 100%; // Push into padding so the close button sits properly in the corner
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2em;
		z-index: 2;

		.popup-title {
			flex: 1;
			margin-top: 0;
			margin-bottom: 0;
			text-align: left;
		}

		.popup-close-button {
			height: 2em;
			cursor: pointer;
		}
	}

	.floating-title-bar {
		position: absolute;
		width: calc(100% - 2em);
		top: 1em;
		left: 1em;
	}

	.transparent-popup {
		background-color: transparent !important;
		box-shadow: none !important;
	}

	@media only screen and (max-width: 1250px) {
		.popup-content {
			width: 90%;
		}
	}

</style>