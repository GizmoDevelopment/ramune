<template>
	<div class="rating">
		<Star />
		<p>{{ score }}</p>
	</div>
</template>

<script lang="ts">
	
	// Modules
	import { defineComponent } from "vue";

	// Icons
	import Star from "@assets/icons/star.svg";

	export default defineComponent({
		name: "ShowScoreLabel",
		components: {
			Star
		},
		props: {
			score: {
				type: String,
				required: true
			}
		}
	});

</script>

<style scoped>

	.rating {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
	}

	.rating p {
		margin-left: 4px;
		font-weight: 400;
		margin-top: 0;
		margin-bottom: 0;
	}

</style>