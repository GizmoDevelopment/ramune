<template>
	<Logo class="logo" />
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Icons
	import Logo from "@assets/icons/logo.svg";

	export default defineComponent({
		name: "LoadingBuffer",
		components: {
			Logo
		}
	});

</script>

<style scoped>

	@keyframes loading {
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

	.logo {
		margin-top: 15em;
		width: auto;
		height: 5em;
		animation: loading 2s ease-in-out infinite;
	}

</style>