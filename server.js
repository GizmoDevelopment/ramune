/* eslint-env node */

// Modules
const fs = require("fs");
const path = require("path");
const express = require("express");
const compression = require("compression");
const serveStatic = require("serve-static");
const { createServer: createViteServer } = require("vite");

// Variables
const isProduction = process.env.NODE_ENV === "production";

function resolve (...p) {
	return path.resolve(__dirname, ...p);
}

async function createServer () {

	const
		manifest = isProduction ? require("./dist/client/ssr-manifest.json") : {},
		indexFile = fs.readFileSync(resolve("dist/client/index.html"), "utf-8");

	const app = express();
	let vite = null;

	if (isProduction) {
		app.use(compression());
		app.use(serveStatic(resolve("dist/client"), { index: false }));
	} else {

		vite = await createViteServer({
			server: {
				middlewareMode: "ssr",
				watch: {
					usePolling: true,
					interval: 100
				}
			}
		});

		app.use(vite.middlewares);
	}

	app.use("*", async (req, res) => {

		const url = req.originalUrl;

		try {

			let template, render;

			if (isProduction) {
				template = indexFile;
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				render = require("./dist/server/entry-server.js").render;
			} else if (vite) {
				template = fs.readFileSync(resolve("index.html"), "utf-8");
				template = await vite.transformIndexHtml(url, template);
				render = (await vite.ssrLoadModule("./src/entry-server.js")).render;
			}

			if (render && template) {

				const [ appHtml, state, preloadLinks ] = await render(url, manifest);

				const html = template
					.replace("<!--preload-links-->", preloadLinks)
					.replace("<vuex-state>", state)
					.replace("<!--app-html-->", appHtml);

				res.status(200).set({ "Content-Type": "text/html" }).end(html);
			} else {
				res.status(500).end("No render function.");
			}

		} catch (err) {

			vite?.ssrFixStacktrace(err);
			res.status(500).end(err.message);

			console.error(err);
		}
	});

	return app;
}

createServer().then(app => {
	app.listen(3000, () => {
		console.log("Server running");
	});
});