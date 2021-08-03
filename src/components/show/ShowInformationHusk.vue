<template>
	<div class="show-information">
		<div class="husk-dark show-poster" />
		<div class="show-details">
			<p class="heading husk-dark show-title">XD?????????????????????????????</p>
			<div class="show-stats">
				<div class="husk-dark show-episode-count">420 Episode</div>
			</div>
			<p class="husk-dark show-description">"Jarvis, log on discord, then take the man with a high rank from the server Gizmo, make sure that he especially has an anime pfp. Good, now send a pipebomb to his home adress and write that its a pack from the Slovenian Government on it." </p>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "ShowInformationHusk"
	});

</script>

<style scoped lang="scss">

	@import "@styles/main.scss";

	.show-information {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		margin-top: 1rem;
	}

	.show-poster {
		min-width: calc(280px * .7);
		height: 280px;
		border-radius: variable(card-border-radius);
	}

	.show-details {
		margin-left: 20px;
	}

	.show-title {
		margin-top: .2rem;
		margin-bottom: 10px;
	}

	.show-stats {

		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		* {
			margin-right: 10px;
		}
	}

	.show-episode-count {
		border: 2px solid transparent;
		border-radius: 20px;
		padding-left: 8px;
		padding-right: 8px;
		font-weight: bold;
		font-size: 1.1rem;
	}

	.show-description {
		font-size: 1.5rem;
		text-align: left;
		white-space: pre-line;
	}

	@media only screen and (max-width: 800px) {
		.show-poster {
			min-width: calc(190px * .7);
			height: 190px;
		}
	}

	@media only screen and (max-width: 600px) {
		.show-description {
			display: none;
		}
	}

</style>