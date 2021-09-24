<template>
	<teleport to="#app">
		<transition name="fade-popup-overlay">
			<div
				v-if="visible"
				class="overlay"
				@click="dismiss"
			/>
		</transition>
		<transition name="slide-popup">
			<div
				v-if="visible"
				class="popup-positioner"
				@click="dismiss"
			>
				<div
					class="popup-container"
					:class="{ 'transparent-popup': transparent }"
					:style="alignment"
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
			</div>
		</transition>
	</teleport>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Icons
	import Close from "@assets/icons/close.svg?component";

	export default defineComponent({
		name: "PopupCard",
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
			align: {
				type: String,
				default: "center",
				validator: (prop: string) => [
					"left",
					"center",
					"right"
				].includes(prop)
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
		computed: {
			alignment (): string {
				return `{ align-items: ${this.align}; }`;
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

	@import "@styles/main.scss";

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
		transition: transform .45s variable(easing-enter), opacity .25s ease
	}

	.slide-popup-leave-active {
		transition: transform .3s variable(easing-leave), opacity .25s ease
	}

	.slide-popup-enter-from,
	.slide-popup-leave-to {
		transform: translateY(4rem) scale(98%);
		opacity: 0;
	}

	//

	.overlay,
	.popup-positioner {
		position: fixed;
		z-index: 20;
	}

	.popup-positioner {
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		overflow-y: auto;
	}

	.popup-container {
		position: relative;
		margin-top: 5%;
		margin-bottom: 20px;
		width: auto;
		min-width: 300px;
		background-color: variable(container-background-color);
		border-radius: variable(popup-border-radius);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding-top: 1em;
		padding-bottom: 1em;
		padding-left: 1em;
		padding-right: 1em;
		box-shadow: 0px 10px 30px 5px rgba(0, 0, 0, .6);
		overflow-x: hidden;
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

	@media only screen and (max-width: 1250px) {
		.popup-container {
			width: 90%;
		}
	}

	.transparent-popup {
		background-color: transparent !important;
		box-shadow: none !important;
	}

</style>
