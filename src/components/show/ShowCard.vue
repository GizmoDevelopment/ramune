<template>
	<div class="show-card">
		<div class="show-poster-container">
			<img
				class="husk show-poster"
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
	import { defineComponent, type PropType } from "vue";

	// Icons
	import Play from "@assets/icons/play.svg?component";

	// Types
	import type { ShowHusk } from "@typings/show";

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

	@import "@styles/mixins";
	@import "@styles/components/ShowCard";

	.show-poster-container {

		.show-poster {
			transition: transform .3s ease-in-out, filter .25s ease;
		}

		&:hover .show-poster {
			transform: scale(104%);
			filter: blur(1px);
		}
	}

</style>
