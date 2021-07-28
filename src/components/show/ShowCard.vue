<template>
	<div class="show-container">
		<div class="show-poster-container">
			<img
				class="show-poster"
				:src="show.poster_url"
				draggable="false"
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

	.show-container {
		max-width: 170px;
		padding: 5px 5px 2px 5px;
	}

	.show-poster-container {
		position: relative;
		display: block;
		width: 170px;
		height: calc(170px * 1.5);
		margin-bottom: .3em;
	}

	@media only screen and (max-width: 700px) {

		.show-container {
			max-width: 115px;
		}

		.show-poster-container {
			width: 115px;
			height: calc(115px * 1.5);
		}
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
		font-size: 18px;
		font-weight: 500;
		text-align: left;
	}

</style>
