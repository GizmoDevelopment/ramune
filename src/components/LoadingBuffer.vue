<template>
	<div class="buffer-container">
		<img
			v-if="secretLogo"
			class="logo"
			:class="[ size ]"
			:src="secretLogo"
		>
		<Logo
			v-else
			class="logo"
			:class="[ size ]"
		/>
	</div>
</template>

<script lang="ts">

	// Modules
	import { defineComponent, type PropType } from "vue";

	// Icons
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
		computed: {
			secretLogo () {
				return this.$store.state.generic.secretLogo;
			}
		}
	});

</script>

<style scoped lang="scss">

	// Animations

	@keyframes loading-s {
		0% {
			transform: scale3d(1, .3, 1);
		}
		50% {
			transform: scale3d(1, 1.1, 1) translateY(-45px);
		}
		100% {
			transform: scale3d(1, .3, 1) translateY(0);
		}
	}

	@keyframes loading-n {
		0% {
			transform: scale3d(1, .3, 1);
		}
		50% {
			transform: scale3d(1, 1.2, 1) translateY(-130px);
		}
		100% {
			transform: scale3d(1, .3, 1) translateY(0);
		}
	}

	//

	.buffer-container {

		width: 100%;
		text-align: center;

		.logo {

			width: auto;

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
	}

</style>
