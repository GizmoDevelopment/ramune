import { defineNuxtConfig } from "nuxt";

export default defineNuxtConfig({
	srcDir: "src/",
	modules: [
		"@nuxtjs/stylelint-module"
	],
	typescript: {
		shim: false
	},
	postcss: {
		config: true
	},
	vite: {
		configFile: "vite.config.ts"
	}
});
