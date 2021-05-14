<template>
	<transition name="fade-overlay">
		<div
			v-if="visible"
			class="overlay"
			@click="$emit('dismiss')"
		/>
	</transition>
	<transition name="slide-content">
		<div
			v-if="visible"
			id="content-container"
			@click="$emit('dismiss')"
		>
			<div
				id="content"
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
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Icons
	import Close from "@assets/icons/close.svg";

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
				return `{ align-items: ${ this.align }; }`;
			}
		}
	});

</script>

<style scoped>

	.fade-overlay-enter-active,
	.fade-overlay-leave-active {
		transition: opacity .3s ease-in-out;
	}

	.fade-overlay-enter-from,
	.fade-overlay-leave-to {
		opacity: 0;
	}

	.slide-content-enter-active,
	.slide-content-leave-active {
		transition: transform .3s ease, opacity .3s ease;
	}

	.slide-content-enter-from,
	.slide-content-leave-to {
		transform: translateY(50px);
		opacity: 0;
	}

	.overlay, #content-container {
		position: fixed;
	}

	#content-container {
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	#content-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		overflow-y: auto;
	}

	#content {
		margin-top: 5%;
		margin-bottom: 20px;
		width: auto;
		background-color: var(--container-background-color);
		border-radius: var(--popup-border-radius);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		padding-top: 1em;
		padding-bottom: 1em;
		padding-left: 2em;
		padding-right: 2em;
	}

	#popup-title-bar {
		width: calc(100% + 2em); /* Push into padding so the close button sits properly in the corner */
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2em;
		margin-left: -1em;
	}

	#popup-title-bar h2 {
		margin-top: 0;
		margin-bottom: 0;
		margin-right: 10em;
	}

	.popup-close-button {
		height: 2em;
	}

	.popup-close-button:hover {
		cursor: pointer;
	}

	@media only screen and (max-width: 600px) {

		#popup-title-bar h2 {
			margin-right: 0;
		}

	}

</style>
