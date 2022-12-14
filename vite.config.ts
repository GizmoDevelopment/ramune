// Modules
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import svgLoader from "vite-svg-loader";
import { visualizer } from "rollup-plugin-visualizer";

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
			"@factories": path.resolve(__dirname, "./src/factories"),
			"@directives": path.resolve(__dirname, "./src/directives"),
			"@plugins": path.resolve(__dirname, "./src/plugins")
		}
	},
	build: {
		rollupOptions: {
			plugins: [
				visualizer()
			],
			output: {
				assetFileNames: (chunkInfo) => {

					const assetPath = chunkInfo.name || "";

					// Keep jassub's wasm worker and default font asset names as-is
					switch (assetPath.match(/.*\/jassub\/dist\/(.+)/i)?.[1]) {
						case "default.woff2":
						case "jassub-worker.wasm":
							return "assets/[name][extname]";
						default:
					}

					// Don't hash font files, as they can stay cached forever
					if (assetPath.endsWith(".ttf")) {
						return "assets/[name][extname]";
					} else {
						return "assets/[name]-[hash][extname]";
					}
				}
			}
		}
	}
});