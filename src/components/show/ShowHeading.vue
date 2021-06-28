<template>
	<h1 id="show-title" class="heading">{{ show.title }}</h1>
	<h3 id="episode-title" class="faded">Episode {{ episode.id }} - {{ episode.title }}</h3>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Types
	import { Episode, Show } from "@typings/show";

	export default defineComponent({
		name: "ShowHeading",
		props: {
			show: {
				type: Object as PropType<Show>,
				required: true
			},
			episode: {
				type: Object as PropType<Episode>,
				required: true
			}
		}
	});

</script>

<style scoped>

	#show-title {
		margin-bottom: .1rem;
	}

	#episode-title {
		text-align: left;
		margin-top: 0;
	}

</style>