<template>
	<transition name="fade-overlay">
		<div
			v-if="show || status"
			class="overlay"
			@click="$emit('dismiss')"
		/>
	</transition>
	<transition name="slide-content">
		<div
			v-if="show || status"
			class="content-container"
			@click="$emit('dismiss')"
		>
			<div class="show-container" @click.stop>
				<div class="popup-title-bar">
					<Close class="popup-close-button" @click="$emit('dismiss')" />
				</div>
				<div v-if="show">
					<ShowInformation
						:show="show"
					/>
				</div>
				<div v-else-if="status && status !== 'loading'">
					<Error :text="status" />
				</div>
				<div v-else>
					<ShowInformationHusk />
				</div>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import Error from "@components/Error.vue";
	import ShowInformation from "@components/ShowInformation.vue";
	import ShowInformationHusk from "@components/ShowInformationHusk.vue";

	// Icons
	import Close from "@assets/icons/close.svg";

	// Types
	import { Show } from "@typings/show";

	export default defineComponent({
		name: "ShowInformationPopup",
		components: {
			Close,
			Error,
			ShowInformation,
			ShowInformationHusk
		},
		props: {
			show: {
				type: Object as PropType<Show> | null,
				required: true
			},
			status: {
				type: [ String, Number ],
				default: 0
			}
		},
		emits: [ "dismiss" ]
	});

</script>

<style scoped>

	/* Overlay & Container */

	.overlay, .content-container {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.overlay {
		background: var(--overlay-background-color);
	}

	.fade-overlay-enter-active,
	.fade-overlay-leave-active {
		transition: opacity .3s ease-in-out;
	}

	.fade-overlay-enter-from,
	.fade-overlay-leave-to {
		opacity: 0;
	}

	.content-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		overflow-y: auto;
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

	.show-container {
		margin-top: 5%;
		margin-bottom: 20px;
		width: 1100px;
		background-color: var(--container-background-color);
		border-radius: var(--popup-border-radius);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding-top: 1em;
		padding-bottom: 1em;
		padding-left: 2em;
		padding-right: 2em;
	}

	.popup-title-bar {
		width: calc(100% + 1em); /* Push into padding so the close button sits properly in the corner */
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}

	.popup-close-button {
		height: 2em;
	}

	.popup-close-button:hover {
		cursor: pointer;
	}

</style>