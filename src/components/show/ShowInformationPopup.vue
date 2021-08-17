<template>
	<PopupCard
		:visible="showId.length > 0"
		:floating-title-bar="true"
		@dismiss="$emit('dismiss')"
	>
		<div class="show-container">
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
			<Error v-else-if="error" :text="error" />
			<ShowInformationHusk v-else />
		</div>
	</PopupCard>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import Error from "@components/Error.vue";
	import ShowInformation from "@components/show/ShowInformation.vue";
	import ShowInformationHusk from "@components/show/ShowInformationHusk.vue";
	import PopupCard from "@components/PopupCard.vue";

	// Utils
	import { getShow } from "@utils/api";
	import { setPageTitle } from "@utils/dom";

	// Types
	import { Show } from "@typings/show";

	export default defineComponent({
		name: "ShowInformationPopup",
		components: {
			Error,
			ShowInformation,
			ShowInformationHusk,
			PopupCard
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

						const
							_showId = this.showId,
							_show = await getShow(_showId);

						if (_show) {

							// If the user switched shows really fast, the old requested show should just be cached
							if (this.showId === _showId) {
								this.show = _show;
							}

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

	/* Overlay & Container */

	.show-container {

		position: relative;
		width: 1100px;
		padding: 2em 1em 0 1em;

		.show-information div {
			position: relative;
			z-index: 2;
		}
	}

	@media only screen and (max-width: 1250px) {
		.show-container {
			width: 100%;
			padding-left: 0;
			padding-right: 0;
		}
	}

	/* Show Banner */

	.show-banner {
		position: absolute;
		width: calc(1100px + 2em + 2em);
		height: auto;
		left: -1em;
		top: -1em;
		border-top-left-radius: variable(popup-border-radius);
		border-top-right-radius: variable(popup-border-radius);
		-webkit-mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
		mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
		opacity: .1;
		z-index: 1;
	}

	@media only screen and (max-width: 1250px) {
		.show-banner {
			display: none;
		}
	}

</style>