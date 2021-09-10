<template>
	<div class="tooltip-hitbox">
		<div class="tooltip">
			<span class="tooltip-content">
				<slot />
			</span>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "Tooltip"
	});

</script>

<style scoped lang="scss">

	@import "@styles/main.scss";

	.tooltip-hitbox {

		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;

		&:hover .tooltip {
			opacity: 1;
			transform: translateY(0) scale(100%);
		}
	}

	.tooltip {
		position: absolute;
		top: calc(-2em - (2 * .2em));
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		opacity: 0;
		transform: translateY(.5em) scale(95%);
		transition: opacity .2s ease, transform .2s ease;
	}

	.tooltip-content {
		background-color: variable(container-background-color);
		border: 2px solid variable(primary-color);
		border-radius: variable(popup-border-radius);
		padding: .2em .3em .2em .3em;
		box-shadow: 0 0 10px 10px rgba(0, 0, 0, .4);
	}

</style>