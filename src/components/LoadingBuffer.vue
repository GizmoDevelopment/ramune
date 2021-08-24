<template>
	<img
		v-if="shouldDisplayHanyuu"
		class="logo"
		:class="{ small: size === 'small', normal: size === 'normal' }"
		:src="Hanyuu"
	>
	<Logo
		v-else
		class="logo"
		:class="{ small: size === 'small', normal: size === 'normal' }"
	/>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, PropType } from "vue";

	// Icons
	import Hanyuu from "@assets/images/hanyuu.webp";
	import Logo from "@assets/icons/logo.svg?component";

	export default defineComponent({
		name: "LoadingBuffer",
		components: {
			Logo
		},
		props: {
			size: {
				type: String as PropType<"small" | "normal">,
				default: "normal"
			}
		},
		data () {
			return {
				Hanyuu: Hanyuu
			};
		},
		computed: {
			shouldDisplayHanyuu (): boolean {
				return this.$store.state.generic.shouldDisplayHanyuu;
			}
		}
	});

</script>

<style scoped lang="scss">

	// Animations

	@keyframes loading-s {
		0% {
			transform: scale3d(1, .2, 1);
		}
		50% {
			transform: scale3d(1, 1.2, 1) translateY(-50px);
		}
		100% {
			transform: scale3d(1, .2, 1) translateY(0px);
		}
	}

	@keyframes loading-n {
		0% {
			transform: scale3d(1, .2, 1);
		}
		50% {
			transform: scale3d(1, 1.4, 1) translateY(-150px);
		}
		100% {
			transform: scale3d(1, .2, 1) translateY(0px);
		}
	}

	//

	.logo {

		width: auto;
		text-align: center;
		width: 100%;

		&.small {
			height: 1em;
			margin-top: 1em;
			animation: loading-s 2s ease-in-out infinite;
		}

		&.normal {
			height: 5em;
			margin-top: 15em;
			animation: loading-n 2s ease-in-out infinite;
		}
	}

</style>