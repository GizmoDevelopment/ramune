/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
	syntax: "postcss-scss",
	plugins: [
		require("stylelint"),
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