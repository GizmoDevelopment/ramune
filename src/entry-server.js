// Modules
import { renderToString } from "@vue/server-renderer";

// Utils
import { createApp } from "@factories/app";

export async function render (url, manifest) {

	const { app, router } = createApp();

	router.push(url);
	await router.isReady();

	const
		ctx = {},
		html = await renderToString(app, ctx),
		preloadLinks = renderPreloadLinks(ctx.modules, manifest);

	return [
		html,
		preloadLinks
	];
}

function renderPreloadLinks (modules, manifest) {

	let links = "";
	const seen = new Set();

	modules.forEach(id => {

		const files = manifest[id];

		if (files) {
			files.forEach(file => {
				if (!seen.has(file)) {
					seen.add(file);
					links += renderPreloadLink(file);
				}
			});
		}
	});

	return links;
}

function renderPreloadLink (file) {
	if (file.endsWith(".js")) {
		return `<link rel="modulepreload" crossorigin href="${file}">`;
	} else if (file.endsWith(".css")) {
		return `<link rel="stylesheet" href="${file}">`;
	} else if (file.endsWith(".woff")) {
		return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
	} else if (file.endsWith(".woff2")) {
		return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
	} else if (file.endsWith(".gif")) {
		return `<link rel="preload" href="${file}" as="image" type="image/gif">`;
	} else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
		return `<link rel="preload" href="${file}" as="image" type="image/jpeg">`;
	} else if (file.endsWith(".png")) {
		return `<link rel="preload" href="${file}" as="image" type="image/png">`;
	} else {
		return "";
	}
}