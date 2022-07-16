// Modules
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
	build: {
		rollupOptions: {
			plugins: [
				visualizer()
			]
		}
	}
});