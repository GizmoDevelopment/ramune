// Modules
import { defineNuxtConfig } from "nuxt";

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
	vite: {
		configFile: "vite.config.ts"
	},
	app: {
		baseURL: "/src"
	},
	alias: {
		"@components": "./src/components",
		"@stores": "./src/stores"
	}
});
