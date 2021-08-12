<template>
	<teleport to="#app">
		<transition name="fade-popup-overlay">
			<div
				v-if="visible"
				class="overlay"
				@click="$emit('dismiss')"
			/>
		</transition>
		<transition name="slide-popup">
			<div
				v-if="visible"
				class="popup-positioner"
				@click="$emit('dismiss')"
			>
				<div
					class="popup-container"
					:style="alignment"
					@click.stop
				>
					<div id="popup-title-bar">
						<h2>{{ title }}</h2>
						<Close class="popup-close-button" @click="$emit('dismiss')" />
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
				required: true
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
			}
		},
		emits: [ "dismiss" ],
		computed: {
			alignment (): string {
				return `{ align-items: ${this.align}; }`;
			}
		}
	});

</script>

<style scoped>

	.fade-popup-overlay-enter-active,
	.fade-popup-overlay-leave-active {
		transition: opacity .3s ease-in-out;
	}

	.fade-popup-overlay-enter-from,
	.fade-popup-overlay-leave-to {
		opacity: 0;
	}

	.slide-popup-enter-active {
		transition: transform .45s var(--easing-enter), opacity .25s ease
	}

	.slide-popup-leave-active {
		transition: transform .3s var(--easing-leave), opacity .25s ease
	}

	.slide-popup-enter-from,
	.slide-popup-leave-to {
		transform: translateY(4rem) scale(98%);
		opacity: 0;
	}

	.overlay, .popup-positioner {
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
		margin-top: 5%;
		margin-bottom: 20px;
		width: auto;
		background-color: var(--container-background-color);
		border-radius: var(--popup-border-radius);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding-top: 1em;
		padding-bottom: 1em;
		padding-left: 1em;
		padding-right: 1em;
		box-shadow: 0px 10px 30px 5px rgba(0, 0, 0, .6);
	}

	#popup-title-bar {
		width: 100%; /* Push into padding so the close button sits properly in the corner */
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2em;
	}

	#popup-title-bar h2 {
		flex: 1;
		margin-top: 0;
		margin-bottom: 0;
		margin-right: 10em;
		text-align: left;
	}

	.popup-close-button {
		height: 2em;
	}

	.popup-close-button:hover {
		cursor: pointer;
	}

	@media only screen and (max-width: 500px) {

		#popup-title-bar h2 {
			margin-right: 1em;
		}

		.popup-container {
			width: 90%;
		}

	}

</style>
