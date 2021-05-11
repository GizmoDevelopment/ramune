<template>
	<!--<router-link
		:to="`/shows/${ show.id }`"
		class="anchor-without-decoration"
	>-->
	<div class="container hover-container">
		<img
			class="poster"
			:src="show.poster_url"
			draggable="false"
		>
		<div class="information">
			<p class="title">{{ show.title }}</p>
			<div class="details">
				<ShowScoreLabel :score="show.score" />
				<p class="season-count">{{ seasonCount }}</p>
			</div>
		</div>
	</div>
	<!--</router-link>-->
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Components
	import ShowScoreLabel from "@components/ShowScoreLabel.vue";

	// Utils
	import { pluralize } from "@utils/essentials";

	// Types
	import { Show } from "@typings/show";

	export default defineComponent({
		name: "ShowCard",
		components: {
			ShowScoreLabel
		},
		props: {
			show: {
				type: Object as PropType<Show>,
				required: true
			}
		},
		computed: {
			seasonCount (): string {
				return pluralize("%NUM% Season%S%", this.show.seasons);
			}
		}
	});

</script>

<style scoped>

	.container {
		max-width: 170px;
		padding: 5px 5px 2px 5px;
		border-radius: 5px;
	}
	.poster {
		background-color: var(--container-background-color);
		width: 170px;
		height: calc(170px * 1.5);
		border-radius: 5px;
	}

	.information {
		display: flex;
		flex-direction: column;
		margin-bottom: 5px;
	}

	.title {
		word-wrap: normal;
		font-size: 18px;
		font-weight: 500;
		text-align: left;
		margin-top: 0;
		margin-bottom: 5px;
		height: calc(18px * 2);
	}

	.details {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.details p {
		font-weight: 300;
		margin: 0;
	}

</style>
