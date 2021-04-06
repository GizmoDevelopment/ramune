<template>
	<h1 class="heading">All Shows</h1>
	<div id="show-container">
		<div v-for="show in shows" :key="show.id">
			<ShowCard :show="show" />
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import ShowCard from "@components/ShowCard.vue";

	// Utils
	import { getShows } from "@utils/api";

	// Types
	import { Show } from "@typings/types";

	export default defineComponent({
		name: "Shows",
		components: {
			ShowCard
		},
		data () {
			return {
				shows: [] as Show[]
			}
		},
		async mounted () {

			const shows = await getShows();

			shows.forEach(show => {
				this.$store.commit("CACHE_SHOW", show);
			});

			this.shows = shows;
		}
	});

</script>

<style scoped>

	#show-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}

</style>