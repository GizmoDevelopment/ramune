// Modules
import { defineConfig } from "vite";
import svgLoader from "vite-svg-loader";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
	plugins: [
		svgLoader()
	],
	build: {
		rollupOptions: {
			plugins: [
				visualizer()
			]
		}
	}
});