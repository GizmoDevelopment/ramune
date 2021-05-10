<template>
	<router-link
		to="/test"
		class="anchor-without-decoration"
	>
		<div class="episode-container hover-container">
			<img class="episode-thumbnail" :src="episode.thumbnail_url">
			<p class="episode-title">{{ episode.title }}</p>
		</div>
	</router-link>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Types
	import { Episode } from "@typings/show";

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

<style scoped>

	.episode-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 200px;
		padding: 4px;
	}
	
	.episode-thumbnail {
		width: 100%;
		height: 112.5px;
		border-radius: var(--card-border-radius);
	}

	.episode-title {
		margin-top: 5px;
		width: calc(100% - 4px);
		text-align: left;
		min-height: 40px;
	}

</style>