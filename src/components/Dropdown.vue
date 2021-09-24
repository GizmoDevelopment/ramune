<template>
	<div
		class="dropdown"
		:class="{ 'dropdown-active': isOpen }"
		:variant="variant"
		@click="isOpen = !isOpen"
		@mouseleave="isOpen = isOpen ? !isOpen : isOpen"
	>
		<div class="dropdown-currently-selected">
			<p class="dropdown-currently-selected-label">{{ entries[currentIndex] }}</p>
			<Caret class="dropdown-icon" :class="{ 'dropdown-icon-active': isOpen }" />
		</div>
		<transition name="dropdown">
			<div v-show="isOpen" class="dropdown-holder">
				<div
					class="dropdown-container dropdown-container-active"
					:variant="variant"
				>
					<button
						v-for="(entry, index) in entries"
						:key="index"
						v-memo="[ currentIndex === index ]"
						class="secondary-button dropdown-entry"
						:variant="variant"
						:class="{ 'dropdown-entry-active': currentIndex === index }"
						@click="$emit('select-index', index)"
					>
						{{ entry }}
					</button>
				</div>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

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
			entries: {
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

	@import "@styles/main.scss";

	// Variables
	$empty-border: 2px solid transparent;
	$filled-border: variable(border-style);
	$border-transition: .15s ease;

	// Transitions

	.dropdown-enter-from,
	.dropdown-leave-to {
		opacity: 0;
		transform: translateY(-.3em);
	}

	.dropdown-leave-active,
	.dropdown-enter-active {
		transition: opacity $border-transition, transform .2s ease;
	}

	//

	.dropdown {
		display: inline-block;
		position: relative;
		cursor: pointer;
		padding: .4rem .7rem .4rem .7rem;
		border-top: $empty-border;
	}

	.dropdown-holder {
		position: absolute;
		width: calc(100% + 4px); // ? Because border-box doesn't account for the border...?
		top: 100%;
		left: -2px; // ? Because border-box doesn't account for the border...?
		z-index: 2;
	}

	.dropdown-container {
		box-sizing: border-box;
		width: 100%;
		height: auto;
		display: flex;
		padding: 0 0 .3rem 0;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		border-top: none;
		border-bottom: $empty-border;
		border-radius: 0 0 variable(popup-border-radius) variable(popup-border-radius);
	}

	.dropdown,
	.dropdown-container {
		border-radius: variable(popup-border-radius);
		border-left: $empty-border;
		border-right: $empty-border;
		transition: border $border-transition, border-radius $border-transition;
	}

	.dropdown-active {
		border-radius: variable(popup-border-radius) variable(popup-border-radius) 0 0;
		border-top: $filled-border;
	}

	.dropdown-container-active {
		border-radius: 0 0 variable(popup-border-radius) variable(popup-border-radius);
		border-bottom: $filled-border;
	}

	.dropdown-active,
	.dropdown-container-active {
		border-left: $filled-border;
		border-right: $filled-border;
	}

	.dropdown-currently-selected {

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-weight: bold;

		.dropdown-currently-selected-label {
			margin: 0 1.5rem 0 0;
			font-size: 1.4em;
			user-select: none;
		}
	}

	.dropdown-icon {
		transition: transform .3s ease;
		transform: rotateZ(90deg);
	}

	.dropdown-icon-active {
		transform: rotateZ(90deg) rotateY(180deg);
	}

	.dropdown-entry {
		width: 100%;
		padding: .3rem .7rem .3rem .7rem;
		font-size: 1.2rem;
		border-radius: 0;
		user-select: none;
		text-align: left;
		transition: background-color .3s ease;
	}

	.dropdown-entry-active {
		background-color: variable(container-hover-color);
	}

</style>