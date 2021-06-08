<template>
	<div id="container">
		<div id="poster" class="husk-dark" />
		<div id="information">
			<p id="title" class="husk-dark">Example Anime Title</p>
			<div id="details">
				<div id="rating" class="husk-dark">10/10</div>
				<p id="season-count" class="husk-dark">50 Seaons</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "ShowCardHusk"
	});

</script>

<style scoped>

	#container {
		max-width: 170px;
		background: transparent;
		transition: .2s background ease-out;
		padding: 5px 5px 2px 5px;
	}

	#container * {
		color: transparent;
		background-color: var(--container-background-color);
		border-radius: 5px;
		user-select: none;
	}

	#information, #details {
		background: transparent;
	}

	#poster {
		width: 170px;
		height: calc(170px * 1.5);	
	}

	#information {
		display: flex;
		flex-direction: column;
		margin-bottom: 5px;
	}

	#title {
		word-wrap: normal;
		text-align: left;
		margin-top: 5px;
		margin-bottom: 5px;
		height: 18px;
	}

	#details {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	#details p {
		margin: 0;
	}

</style>
