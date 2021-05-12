<template>
	<div id="episode-container">
		<div id="thumbnail-container">
			<img id="episode-thumbnail" :src="episode.thumbnail_url">
			<div id="episode-info">
				<div id="episode-index">{{ episode.id }}</div>
				<div id="episode-duration">24:00</div>
			</div>
			<div id="overlay" @click="$emit('play-episode', episode.id)">
				<Play class="overlay-play-icon" />
			</div>
		</div>
		<p id="episode-title">{{ episode.title }}</p>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Icons
	import Play from "@assets/icons/play.svg";

	// Types
	import { Episode } from "@typings/show";

	export default defineComponent({
		name: "ShowEpisodeCard",
		components: {
			Play
		},
		props: {
			episode: {
				type: Object as PropType<Episode>,
				required: true
			}
		},
		emits: [ "play-episode" ]
	});

</script>

<style scoped>

	#episode-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 200px;
		padding: 4px;
	}

	#thumbnail-container, .overlay {
		position: relative;
		display: block;
		width: 200px;
		height: 112px;
	}

	#overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background-color: var(--overlay-background-color);
		opacity: 0;
		transition: opacity .2s ease;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	
	#overlay:hover {
		opacity: 1;
		cursor: pointer;
	}

	#episode-thumbnail {
		width: inherit;
		height: inherit;
	}

	#episode-thumbnail, #overlay {
		border-radius: var(--card-border-radius);
	}

	#overlay-container, #episode-info {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.overlay-play-icon {
		font-size: 4em;
	}

	#episode-info {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;
		
	}

	#episode-info * {
		background-color: var(--overlay-background-color);
		border-radius: var(--card-border-radius);
		margin-left: 5px;
		margin-right: 5px;
		margin-bottom: 5px;
		padding-left: .25em;
		padding-right: .25em;
		font-weight: 400;
	}

	#episode-title {
		margin-top: 5px;
		width: calc(100% - 4px);
		text-align: left;
		min-height: 40px;
	}

</style>