<template>
	<div v-if="show">
		{{ show.title }}
		{{ episodeId }}
	</div>
	<div v-else-if="status">
		<Error :text="status" />
	</div>
	<div v-else>
		<LoadingBuffer />
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import LoadingBuffer from "@components/LoadingBuffer.vue";
	import Error from "@components/Error.vue";

	// Utils
	import { getShow } from "@utils/api";

	// Types
	import { Show } from "@typings/show";

	export default defineComponent({
		name: "Player",
		components: {
			LoadingBuffer,
			Error
		},
		props: {
			showId: {
				type: String,
				required: true
			},
			episodeId: {
				type: Number,
				default: 1
			}
		},
		data () {
			return {
				show: null as Show | null,
				status: "" as string | number
			};
		},
		async mounted () {

			const cachedShows = this.$store.state.shows;

			if (cachedShows.has(this.showId)) {
				
				const _show = cachedShows.get(this.showId);

				if (_show) {
					this.show = _show;
				} else {
					this.status = 404;
				}

			} else {

				const _show = await getShow(this.showId);

				if (_show) {
					this.show = _show;
				} else {
					this.status = 404;
				}

			}

		}
	});

</script>
