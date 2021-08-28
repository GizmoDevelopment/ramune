<template>
	<div class="show-card">
		<div class="show-poster-container">
			<img
				class="show-poster"
				:src="show.poster_url"
				draggable="false"
				alt="Show poster"
			>
			<div class="overlay hover-opacity" @click="$emit('select-show', show.id)">
				<Play class="overlay-play-icon" />
			</div>
		</div>
		<div class="show-information">
			<p class="show-title">{{ show.title }}</p>
		</div>
	</div>
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

<style scoped lang="scss">

	@import "@styles/mixins.scss";

	.show-card {
		max-width: 170px;
	}

	.show-poster-container {
		position: relative;
		display: block;
		width: 170px;
		height: calc(170px * 1.42);
		margin-bottom: .3em;
	}

	.show-poster {
		width: inherit;
		height: inherit;
		background-color: var(--container-background-color);
		border-radius: 5px;
	}

	.overlay-play-icon {
		font-size: 4em;
	}

	.show-information {
		display: flex;
		flex-direction: column;
		margin-bottom: 5px;
	}

	.show-title {

		@include text-wrap;

		margin-top: 0;
		margin-bottom: 5px;
		font-size: 1.1rem;
		font-weight: 500;
		text-align: left;
	}

	@media only screen and (max-width: 700px) {

		.show-card {
			max-width: 110px;
		}

		.show-poster-container {
			width: 110px;
			height: calc(110px * 1.42);
		}

		.show-title {
			font-size: .9rem;
		}
	}

</style>
