<template>
	<div class="show-information">
		<div class="husk-dark show-poster" />
		<div class="show-details">
			<p class="heading husk-dark show-title">K I N O</p>
			<div class="show-stats">
				<div class="husk-dark show-episode-count">1702 Episodes</div>
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
	@import "@styles/components/ShowInformation.scss";

	.show-episode-count {
		border: 2px solid transparent;
	}

</style>