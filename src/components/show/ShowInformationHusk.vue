<template>
	<div id="show-information">
		<div id="show-artwork" class="husk" />
		<div id="show-details">
			<h1 id="show-title" class="heading husk">This is an empty title</h1>
			<div id="show-stats">
				<div id="show-score" class="husk">O 10</div>
				<div id="show-episode-count" class="husk">420 Episodes</div>
			</div>
			<p id="show-description" class="husk">"Jarvis, log on discord, then take the man with a high rank from the server Gizmo, make sure that he especially has an anime pfp. Good, now send a pipebomb to his home adress and write that its a pack from the Slovenian Government on it." </p>
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

<style scoped>

	#show-information {
		margin-top: 1em;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}

	#show-artwork {
		border-radius: var(--card-border-radius);
		min-width: 186px;
		height: 280px;
	}

	#show-details {
		margin-left: 20px;
	}

	#show-title {
		margin-top: .2em;
		margin-bottom: 10px;
	}

	#show-stats {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	#show-stats * {
		margin-right: 10px;
	}

	#show-score {
		background-color: var(--primary-color);
		border: 2px solid var(--primary-color);
		border-radius: 20px;
		padding-left: 6px;
		padding-right: 6px;
	}

	#show-description {
		text-align: left;
		font-size: 15px;
		white-space: pre-line;
		letter-spacing: 15px;
	}

</style>