<template>
	<transition name="fade-popup">
		<div
			v-if="show"
			class="overlay"
		/>
	</transition>
	<div
		class="overlay-container"
		@click="$emit('dismiss')"
	>
		<transition name="fade-and-slide-popup" mode="out-in">
			<div
				v-if="show"
				class="container"
				@click.stop
			>
				<div class="title-bar">
					<Close
						class="icon"
						@click="$emit('dismiss')"
					/>
				</div>
				<slot class="content" />
			</div>
		</transition>
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
		emits: [ "dismiss" ],
		data () {
			return {
				show: false
			};
		},
		mounted () {
			this.show = true;
		},
		beforeUnmount () {
			this.show = false;
		}
	});

</script>

<style scoped>

	.fade-popup-enter-active,
	.fade-popup-leave-active {
		transition: all .5s ease;
	}

	.fade-popup-enter-from,
	.fade-popup-leave-to {
		opacity: 0;
	}

	.fade-and-slide-popup-enter-active,
	.fade-and-slide-popup-leave-active {
		transition: all .4s ease;
	}

	.fade-and-slide-popup-enter-from,
	.fade-and-slide-popup-leave-to {
		transform: translateY(50px);
		opacity: 0;
	}

	.overlay, .overlay-container {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	.overlay {
		background: rgba(0, 0, 0, .5);
	}

	.overlay-container {
		display: flex;
		justify-content: center;
		align-items: center;
		align-content: center;
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
		width: calc(100% + 25px); /* Ignore padding to properly position X button */
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
	
		.fade-and-slide-popup-enter-active, .fade-and-slide-popup-leave-active {
		transition: all .2s ease;
	}

	.fade-and-slide-popup-enter-from, .fade-and-slide-popup-leave-to {
		opacity: 0;
		transform: translateY(50px);
	}
	*/

</style>
