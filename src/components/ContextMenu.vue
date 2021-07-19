<template>
	<div
		class="ghost-element"
	>
		<div
			class="ghost-element"
			@contextmenu.prevent="isOpen = !isOpen"
			@click.prevent="isOpen = !isOpen"
		>
			<slot />
		</div>
		<div v-if="isOpen" class="context-menu-positioner">
			<div class="context-menu-platter">
				<button
					v-for="(item, index) in items"
					:key="index"
					class="secondary-button context-menu-button"
					@click="$emit(`ctx-${item.toLowerCase().replace(/\s/g, '-')}`, identifier)"
				>
					{{ item }}
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	export default defineComponent({
		name: "ContextMenu",
		props:  {
			items: {
				type: Array as PropType<string[]>,
				default: () => []
			},
			identifier: {
				type: [ String, Number ],
				required: true
			}
		},
		data () {
			return {
				isOpen: false
			};
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main.scss";

	.ghost-element {
		width: inherit;
		height: inherit;
	}

	.context-menu-positioner {

		position: absolute;

		.context-menu-platter {

			position: relative;
			background-color: variable(container-background-color);
			border-radius: variable(card-border-radius);
			padding: .3rem 0 .3rem 0;
			margin-top: 5px;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: flex-start;

			.context-menu-button {
				border-radius: 0;
				width: 100%;
				text-align: left;
			}
		}
	}

</style>