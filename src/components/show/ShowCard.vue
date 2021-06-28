<template>
	<!--<router-link
		:to="`/shows/${ show.id }`"
		class="anchor-without-decoration"
	>-->
	<div id="container">
		<div id="poster-container">
			<img
				id="poster"
				:src="show.poster_url"
				draggable="false"
			>
			<div class="overlay hover-opacity" @click="$emit('select-show', show.id)">
				<Play class="overlay-play-icon" />
			</div>
		</div>
		<div id="information">
			<p id="title">{{ show.title }}</p>
			<div id="details">
				<!-- <ShowScoreLabel :score="show.score" /> -->
				<!-- <p id="season-count">{{ seasonCount }}</p> -->
			</div>
		</div>
	</div>
	<!--</router-link>-->
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Icons
	import Play from "@assets/icons/play.svg?component";

	// Types
	import { ShowHusk } from "@typings/show";

	export default defineComponent({
		name: "ShowCard",
		components: {
			Play
		},
		props: {
			show: {
				type: Object as PropType<ShowHusk>,
				required: true
			}
		},
		emits: [ "select-show" ]
	});

</script>

<style scoped>

	#container {
		max-width: 170px;
		padding: 5px 5px 2px 5px;
		border-radius: 5px;
	}

	#poster-container {
		position: relative;
		display: block;
		width: 170px;
		height: calc(170px * 1.5);
		margin-bottom: .3em;
	}

	#poster {
		width: inherit;
		height: inherit;
		background-color: var(--container-background-color);
		border-radius: 5px;
	}

	.overlay-play-icon {
		font-size: 4em;
	}

	#information {
		display: flex;
		flex-direction: column;
		margin-bottom: 5px;
	}

	#title {
		word-wrap: normal;
		font-size: 18px;
		font-weight: 500;
		text-align: left;
		margin-top: 0;
		margin-bottom: 5px;
		height: calc(18px * 2);
	}

	#details {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	#details p {
		font-weight: 300;
		margin: 0;
	}

</style>
