<template>
	<transition name="fade-overlay">
		<div
			v-if="showId"
			class="overlay"
			@click="$emit('dismiss')"
		/>
	</transition>
	<transition name="slide-content">
		<div
			v-if="showId"
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
				<div v-else-if="error">
					<Error :text="error" />
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
	import { defineComponent } from "vue";

	// Components
	import Error from "@components/Error.vue";
	import ShowInformation from "@components/show/ShowInformation.vue";
	import ShowInformationHusk from "@components/show/ShowInformationHusk.vue";

	// Icons
	import Close from "@assets/icons/close.svg?component";

	// Utils
	import { getShow } from "@utils/api";
	import { setPageTitle } from "@utils/dom";

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
			showId: {
				type: String,
				default: ""
			}
		},
		emits: [ "dismiss" ],
		data () {
			return {
				error: "" as number | string,
				show: null as Show | null
			};
		},
		watch: {
			showId () {
				this.fetchShow();
			},
			show (newShow: Show | null) {
				if (newShow) {
					setPageTitle(newShow.title);
				}
			}
		},
		mounted () {
			this.fetchShow();
		},
		methods: {
			async fetchShow () {
				if (this.showId.length > 0) {

					const cachedShow = this.$store.state.shows.get(this.showId);

					if (cachedShow) {
						this.show = cachedShow;
					} else {

						const _show = await getShow(this.showId);

						if (_show) {
							this.show = _show;
							this.$store.commit("CACHE_SHOW", _show);
						} else {
							this.error = 404;
						}

					}
				} else {
					this.show = null;
				}
			}
		}
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
		z-index: 20;
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

	.slide-content-enter-active {
		transition: transform .45s var(--easing-enter), opacity .25s ease
	}

	.slide-content-leave-active {
		transition: transform .3s var(--easing-leave), opacity .25s ease
	}

	.slide-content-enter-from,
	.slide-content-leave-to {
		transform: translateY(6rem);
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
		box-shadow: 0px 10px 30px 5px rgba(0, 0, 0, .6);
	}

	@media only screen and (max-width: 1250px) {
		.show-container {
			width: 100%;
			margin-left: 1rem;
			margin-bottom: 1rem;
		}
	}

	@media only screen and (max-width: 600px) {
		.show-container {
			margin-left: 0;
			margin-right: 0;
			padding-left: 1rem;
			padding-right: 1rem;
		}
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