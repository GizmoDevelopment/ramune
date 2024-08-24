<template>
	<div
		class="dropdown"
		:class="{ 'active': isOpen }"
		@mouseleave="isOpen = false"
	>
		<button
			class="button dropdown-button"
			:variant="variant"
			@click="isOpen = !isOpen"
		>
			<span class="dropdown-currently-selected">
				<slot
					:key="currentIndex"
					:variant="variant"
					:entry="items[currentIndex]"
				/>
			</span>
			<Caret class="dropdown-icon" />
		</button>
		<transition name="dropdown">
			<div
				v-show="isOpen"
				class="dropdown-tray"
				:variant="variant"
			>
				<button
					v-for="(item, index) in items"
					:key="index"
					v-memo="[ currentIndex === index ]"
					class="secondary-button dropdown-entry"
					:class="{ 'active': currentIndex === index }"
					:variant="variant"
					@click="$emit('select-index', index); isOpen = false"
				>
					<slot
						:key="index"
						:variant="variant"
						:item="item"
					/>
				</button>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, type PropType } from "vue";

	// Mixins
	import GenericMixin from "@mixins/Generic";

	// Icons
	import Caret from "@assets/icons/caret.svg?component";

	export default defineComponent({
		name: "Dropdown",
		components: {
			Caret
		},
		mixins: [ GenericMixin ],
		props: {
			items: {
				type: Array as PropType<string[]>,
				required: true
			},
			currentIndex: {
				type: Number,
				default: 0
			}
		},
		emits: [ "select-index" ],
		data () {
			return {
				isOpen: false
			};
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main";

	// Variables
	$empty-border: 2px solid transparent;
	$filled-border: variable(border-style);
	$border-transition: .15s ease;

	// Transitions

	.dropdown-enter-from,
	.dropdown-leave-to {
		opacity: 0;
		transform: translateY(-.2em);
	}

	.dropdown-leave-active,
	.dropdown-enter-active {
		transition: opacity $border-transition, transform .2s ease;
	}

	//

	.dropdown {

		position: relative;

		.dropdown-button {

			font-size: 1.2em;
			font-weight: bold;

			padding: .3em .7em .4em .7em;
			border: $empty-border;
			border-bottom: none;

			display: flex;
			justify-content: center;
			align-items: center;

			transition: border $border-transition, border-radius $border-transition;

			.dropdown-currently-selected {
				margin-right: 1em;
			}

			.dropdown-icon {
				transition: transform .3s ease;
				transform: rotateZ(90deg);
			}
		}

		&.active {

			.dropdown-button {
				border: $filled-border;
				border-bottom: none;
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
			}

			.dropdown-icon {
				transform: rotateZ(90deg) rotateY(180deg);
			}
		}
	}

	.dropdown-tray {

		position: absolute;
		width: 100%;

		display: flex;
		flex-flow: column wrap;
		justify-content: center;
		align-items: center;

		padding: 0 0 .3em 0;

		box-sizing: border-box;
		border-radius: 0 0 variable(button-border-radius) variable(button-border-radius);
		border: $filled-border;
		border-top: none;

		z-index: 4;

		.dropdown-entry {

			width: 100%;
			border-radius: 0;
			display: flex;
			justify-content: center;
			align-items: center;

			&:not(:hover) {
				background-color: transparent;
			}

			&.active {
				background-color: variable(container-hover-color);
			}
		}

	}

</style>
