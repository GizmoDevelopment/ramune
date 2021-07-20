<template>
	<div
		ref="holder"
		class="ghost-element"
	>
		<div
			class="ghost-slot"
			@contextmenu.prevent="isOpen = !isOpen"
			@click.prevent="isOpen = !isOpen"
		>
			<slot />
		</div>
		<transition name="context-menu-slide">
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
		</transition>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType, ref } from "vue";

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
		setup () {

			const holder = ref<HTMLDivElement>();

			return {
				holder
			};
		},
		data () {
			return {
				isOpen: false
			};
		},
		mounted () {
			document.addEventListener("click", this.handleOutsideClick);
		},
		beforeUnmount () {
			document.removeEventListener("click", this.handleOutsideClick);
		},
		methods: {
			handleOutsideClick (e: MouseEvent) {
				if (this.holder && e.target && !this.holder.contains(e.target as HTMLElement)) {
					this.isOpen = false;
				}
			}
		}
	});

</script>

<style scoped lang="scss">

	@import "@styles/main.scss";

	.context-menu-slide-enter-active,
	.context-menu-slide-leave-active {
		transition: opacity .2s ease, transform .3s ease;
	}

	.context-menu-slide-enter-from,
	.context-menu-slide-leave-to {
		opacity: 0;
		transform: translateY(.2rem);
	}

	.ghost-element, .ghost-slot {
		width: inherit;
		height: inherit;
	}

	.ghost-slot {
		cursor: pointer;
	}

	.context-menu-positioner {

		position: absolute;
		z-index: 10;

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