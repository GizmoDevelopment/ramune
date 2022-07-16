// Modules
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		eslintPlugin()
	],
	build: {
		rollupOptions: {
			plugins: [
				visualizer()
			]
		}
	}
});