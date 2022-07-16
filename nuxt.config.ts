// Modules
import { defineNuxtConfig } from "nuxt";

export default defineNuxtConfig({
	modules: [
		"@nuxtjs/stylelint-module"
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
		"@components": "/components"
	}
});
