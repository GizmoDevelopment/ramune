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
				<div class="context-menu-tray" @mouseleave="isOpen = false">
					<button
						v-for="(item, index) in items"
						:key="index"
						class="tray-button context-menu-button"
						@click="$emit(`ctx-${actionNames[item]}`, identifier)"
					>
						{{ $t(item) }}
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
				default: null
			},
			align: {
				type: String,
				default: "left"
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
				isOpen: false,
				actionNames: {} as Record<string, string>
			};
		},
		computed: {
			alignment (): string {
				return this.align === "right" ? "-85%" : "0%";
			}
		},
		mounted () {

			document.addEventListener("click", this.handleOutsideClick);

			// Save encoded names
			this.items.forEach(item => {
				this.actionNames[item] = item.split("/")[1].replace(/_/g, "-");
			});
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

	@import "@styles/main";

	// Transitions

	.context-menu-slide-enter-active,
	.context-menu-slide-leave-active {
		transition: opacity .2s ease, transform .3s ease;
	}

	.context-menu-slide-enter-from,
	.context-menu-slide-leave-to {
		opacity: 0;
		transform: translateY(-.2rem);
	}

	//

	.ghost-element,
	.ghost-slot {
		width: inherit;
		height: inherit;
	}

	.ghost-slot {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}

	.context-menu-positioner {

		position: absolute;
		z-index: 10;

		.context-menu-tray {

			display: flex;
			position: relative;

			background-color: variable(tray-background-color);
			border-radius: variable(popup-border-radius);
			border: variable(border-style);
			box-shadow: 0 0 10px 10px rgba(0, 0, 0, .4);
			transform: translateX(v-bind(alignment));

			padding: .3rem 0 .3rem 0;
			margin-top: 5px;

			flex-direction: column;
			justify-content: flex-start;
			align-items: flex-start;

			.context-menu-button {
				width: 100%;
				border-radius: 0;
				text-align: left;
				white-space: nowrap; // Forces all text in one line
				transition: background-color .3s ease;
			}
		}
	}

</style>