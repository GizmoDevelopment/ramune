<template>
	<transition name="fade-show-popup-overlay">
		<div
			v-if="showId"
			class="overlay"
			@click="$emit('dismiss')"
		/>
	</transition>
	<transition name="slide-show-popup">
		<div
			v-if="showId"
			class="content-container"
			@click="$emit('dismiss')"
		>
			<div class="show-container" @click.stop>
				<div class="popup-title-bar">
					<Close class="popup-close-button" @click="$emit('dismiss')" />
				</div>
				<div v-if="show" class="show-information">
					<ShowInformation
						:show="show"
					/>
					<img
						class="show-banner"
						:src="show.banner_url"
						draggable="false"
					>
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

					const cachedShow = this.$store.state.cache.shows.get(this.showId);

					if (cachedShow) {
						this.show = cachedShow;
					} else {

						const _show = await getShow(this.showId);

						if (_show) {
							this.show = _show;
							this.$store.commit("cache/CACHE_SHOW", _show);
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

<style scoped lang="scss">

	@import "@styles/main.scss";

	/* Transitions */

	.fade-show-popup-overlay-enter-active,
	.fade-show-popup-overlay-leave-active {
		transition: opacity .3s ease-in-out;
	}

	.fade-show-popup-overlay-enter-from,
	.fade-show-popup-overlay-leave-to {
		opacity: 0;
	}

	.slide-show-popup-enter-active {
		transition: transform .45s variable(easing-enter), opacity .25s ease
	}

	.slide-show-popup-leave-active {
		transition: transform .3s variable(easing-leave), opacity .25s ease
	}

	.slide-show-popup-enter-from,
	.slide-show-popup-leave-to {
		transform: translateY(4rem) scale(98%);
		opacity: 0;
	}

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
		background: variable(overlay-background-color);
	}

	.content-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		overflow-y: auto;
	}

	.show-container {

		position: relative;
		margin-top: 5%;
		margin-bottom: 20px;
		width: 1100px;
		background-color: variable(container-background-color);
		border-radius: variable(popup-border-radius);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding-top: 1em;
		padding-bottom: 1em;
		padding-left: 2em;
		padding-right: 2em;
		box-shadow: 0px 10px 30px 5px rgba(0, 0, 0, .6);

		.show-information div {
			position: relative;
			z-index: 2;
		}
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

	/* Close Button */

	.popup-close-button {
		height: 2em;
		z-index: 2;
	}

	.popup-close-button:hover {
		cursor: pointer;
	}

	/* Show Banner */

	.show-banner {
		position: absolute;
		width: 100%;
		height: auto;
		left: 0;
		top: 0;
		border-top-left-radius: variable(popup-border-radius);
		border-top-right-radius: variable(popup-border-radius);
		mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
		opacity: .1;
		z-index: 1;
	}

	@media only screen and (max-width: 1200px) {
		.show-banner {
			display: none;
		}
	}

</style>