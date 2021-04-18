<template>
	<div class="episode-container">
		<p>{{ episode.title }}</p>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Types
	import { Episode } from "@typings/types";

	export default defineComponent({
		name: "ShowEpisodeCard",
		props: {
			episode: {
				type: Object as PropType<Episode>,
				required: true
			}
		}
	});

</script>
