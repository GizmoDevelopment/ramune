// Modules
import { defineNuxtConfig } from "nuxt";
// import { visualizer } from "rollup-plugin-visualizer";
// import eslintPlugin from "vite-plugin-eslint";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	modules: [
		"@nuxtjs/stylelint-module",
		"@pinia/nuxt"
	],
	typescript: {
		shim: false,
		strict: true
	},
	postcss: {
		config: true
	},
	alias: {
		"@components": "./src/components",
		"@stores": "./src/stores"
	}
});
