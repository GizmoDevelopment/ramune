<template>
	<Head>
		
		<!-- Title -->
		<title>{{ metaTags.title }}</title>
		<meta name="title" :content="metaTags.title">
		<meta property="og:title" :content="metaTags.title">
		<meta property="twitter:title" :content="metaTags.title">

		<!-- Site -->
		<template v-if="metaTags.title !== 'Ramune'">
			<meta name="apple-mobile-web-app-title" content="Ramune">
			<meta name="og:site_name" content="Ramune">
			<meta name="twitter:site" content="Ramune">
		</template>

		<!-- Description -->
		<meta name="description" :content="metaTags.description">
		<meta name="og:description" :content="metaTags.description">
		<meta name="twitter:description" :content="metaTags.description">

		<!-- Image -->
		<meta property="og:image" :content="metaTags.image_url">
		<meta property="twitter:image" :content="metaTags.image_url">

		<!-- Misc -->
		<meta property="og:type" content="website">
		<meta name="theme-color" :content="hexFlavorColor">

	</Head>
</template>

<script lang="ts">

	// Modules
	import { defineComponent } from "vue";

	// Components
	import { Head } from "@vueuse/head";

	// Utils
	import { hslToHex } from "@utils/essentials";

	// Types
	import type { CustomMeta } from "@typings/shims-vuex";
	import type { Flavor } from "@typings/settings";

	export default defineComponent({
		name: "Meta",
		components: {
			Head
		},
		computed: {
			metaTags (): CustomMeta {
				return this.$store.getters["generic/meta"];
			},
			flavor (): Flavor {
				return this.$store.getters["settings/flavor"];
			},
			hexFlavorColor (): string {
				return hslToHex(this.flavor.primary);
			}
		}
	});

</script>