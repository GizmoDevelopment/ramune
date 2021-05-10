<template>
	<div>
		<h1 class="heading">All Shows</h1>
		<div
			v-if="shows.length > 0"
			id="show-container"
		>
			<div v-for="show in shows" :key="show.id">
				<ShowCard :show="show" />
			</div>
		</div>
		<div
			v-else
			id="show-container"
		>
			<div v-for="(_, index) in new Array(10)" :key="index">
				<ShowCardHusk />
			</div>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import ShowCard from "@components/ShowCard.vue";
	import ShowCardHusk from "@components/ShowCardHusk.vue";

	// Utils
	import { getShows } from "@utils/api";

	// Types
	import { Show } from "@typings/show";

	export default defineComponent({
		name: "Shows",
		components: {
			ShowCard,
			ShowCardHusk
		},
		data () {
			return {
				shows: [] as Show[]
			};
		},
		async mounted () {

			const cachedShows = this.$store.state.shows;

			if (cachedShows.size > 0) {
				
				this.shows = Array.from(cachedShows.values());

			} else {

				const shows = await getShows();

				shows.forEach(show => {
					this.$store.commit("CACHE_SHOW", show);
				});

				this.shows = shows;
			}			

		}
	});

</script>

<style scoped>

	#show-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

</style>