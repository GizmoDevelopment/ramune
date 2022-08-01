<template>
	<Popup
		:visible="showId.length > 0"
		:floating-title-bar="true"
		@dismiss="$emit('dismiss')"
	>
		<div class="show-container">
			<div v-if="show" class="show-information">
				<ShowInformation
					:show="show"
				/>
			</div>
			<Error v-else-if="error" :text="error" />
			<ShowInformationHusk v-else />
		</div>
	</Popup>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Local Components
	import Error from "@components/Error.vue";
	import ShowInformation from "@components/show/ShowInformation.vue";
	import ShowInformationHusk from "@components/husks/ShowInformationHusk.vue";
	import Popup from "@components/popups/Popup.vue";

	// Mixins
	import MainMixin from "@mixins/Main";

	// Utils
	import { getShow } from "@utils/api";

	// Types
	import type { Show } from "@typings/show";

	export default defineComponent({
		name: "ShowInformationPopup",
		components: {
			Error,
			ShowInformation,
			ShowInformationHusk,
			Popup
		},
		mixins: [ MainMixin ],
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
			show (_show: Show | null) {
				if (_show) {
					this.setPageMetaTags({
						title: _show.title,
						description: _show.description,
						image_url: _show.poster_url
					});
				} else {
					this.setPageMetaTags({});
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

	@import "@styles/main";

	// Overlay & Container

	.show-container {

		position: relative;
		width: 1040px;
		padding: 2em 1em 0 1em;

		.show-information div {
			position: relative;
			z-index: 2;
		}
	}

	@media only screen and (max-width: 1150px) {
		.show-container {
			width: 100%;
			padding-left: 0;
			padding-right: 0;
		}
	}

</style>