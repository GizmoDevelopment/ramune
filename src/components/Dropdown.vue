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
			<CaretDown class="dropdown-icon" :class="{ 'dropdown-icon-active': isOpen }" />
		</div>
		<div
			v-show="isOpen"
			class="dropdown-container"
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
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Mixins
	import GenericMixin from "@mixins/Generic";

	// Icons
	import CaretDown from "@assets/icons/caret-down.svg?component";

	export default defineComponent({
		name: "Dropdown",
		components: {
			CaretDown
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

	$empty-border: 2px solid transparent;
	$filled-border: 2px solid variable(primary-color);

	.dropdown {
		display: inline-block;
		position: relative;
		cursor: pointer;
		padding: .4rem .7rem .4rem .7rem;
		border-top: $empty-border;
	}

	.dropdown-container {
		position: absolute;
		width: 100%;
		height: auto;
		top: 100%;
		left: -2px; // It is weirdly offset without this
		display: flex;
		padding: 0 0 .3rem 0;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		border-bottom: $empty-border;
		z-index: 2;
	}

	.dropdown,
	.dropdown-container {
		border-radius: variable(popup-border-radius);
		border-left: $empty-border;
		border-right: $empty-border;
	}

	.dropdown-currently-selected {

		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-weight: bold;

		.dropdown-currently-selected-label {
			margin: 0 1.3rem 0 0;
			font-size: 1.4rem;
			user-select: none;
		}
	}

	.dropdown-icon {
		transition: transform .3s ease;
	}

	.dropdown-icon-active {
		transform: rotateX(180deg);
	}

	.dropdown-active {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		border-top: $filled-border;
	}

	.dropdown-container {
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		border-bottom: $filled-border;
	}

	.dropdown-active,
	.dropdown-container {
		border-left: $filled-border;
		border-right: $filled-border;
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