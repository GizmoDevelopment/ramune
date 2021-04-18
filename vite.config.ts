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
			"@": path.resolve(__dirname, "./src"),
			"@typings": path.resolve(__dirname, "./src/typings"),
			"@views": path.resolve(__dirname, "./src/views"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@assets": path.resolve(__dirname, "./src/assets")
		}
	}
});