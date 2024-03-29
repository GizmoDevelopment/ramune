/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
	syntax: "postcss-scss",
	plugins: [
		// Fixes errors with Vite's bundled CSS
		require("stylelint")({
			rules: {
				indentation: null,
				"no-missing-end-of-source-newline": null,
				"number-leading-zero": null
			}
		}),
		require("postcss-reporter"),
		require("postcss-calc"),
		require("autoprefixer"),
		require("@fullhuman/postcss-purgecss")({
			content: [
				"index.html",
				"./src/**/*.{css,scss,vue}"
			]
		})
	]
};