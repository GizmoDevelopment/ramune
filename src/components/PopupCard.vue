<template>
	<div class="overlay" @click="$emit('dismiss')">
		<div class="container" @click.stop>
			<div class="title-bar">
				<Close
					class="icon"
					@click="$emit('dismiss')"
				/>
			</div>
			<slot class="content" />
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Icons
	import Close from "@assets/icons/close.svg";

	export default defineComponent({
		name: "PopupCard",
		components: {
			Close
		},
		emits: [ "dismiss" ]
	});

</script>

<style scoped>

	.overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		align-content: center;
		background: rgba(0, 0, 0, .5);
	}

	.container {
		position: relative;
		background-color: var(--container-background-color);
		border-radius: var(--popup-border-radius);
		padding-top: 5px;
		padding-bottom: 5px;
		padding-left: 25px;
		padding-right: 25px;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
	}

	.title-bar {
		width: calc(100% + 15px); /* Ignore padding to properly position X button */
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.icon {
		height: 2em;
	}

	.icon:hover {
		cursor: pointer;
	}

	@media only screen and (max-width: 780px) {

		.container {
			width: 100%;
			height: 100%;
			border-radius: 0;
		}

	}

	/*
	
		.slide-popup-enter-active, .slide-popup-leave-active {
		transition: all .2s ease;
	}

	.slide-popup-enter-from, .slide-popup-leave-to {
		opacity: 0;
		transform: translateY(50px);
	}
	*/

</style>
