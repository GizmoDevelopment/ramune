// Modules
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import svgLoader from "vite-svg-loader";

export default defineConfig({
	plugins: [
		vue(),
		svgLoader()
	],
	resolve: {
		alias: {
			"@typings": path.resolve(__dirname, "./src/typings"),
			"@views": path.resolve(__dirname, "./src/views"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@mixins": path.resolve(__dirname, "./src/mixins"),
			"@renderers": path.resolve(__dirname, "./src/renderers"),
			"@styles": path.resolve(__dirname, "./src/styles"),
			"@stores": path.resolve(__dirname, "./src/stores"),
			"@factories": path.resolve(__dirname, "./src/factories")
		}
	},
	server: {
		fs: {
			allow: [
				"..",
				"libass"
			]
		}
	}
});