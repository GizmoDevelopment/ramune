/* eslint-disable no-undef */
module.exports = {
	plugins: [
		require("autoprefixer")({
			flexbox: false
		}),
		require("stylelint"),
		require("postcss-reporter"),
		require("@fullhuman/postcss-purgecss")({
			content: [
				"index.html",
				"./src/**/*.{css,scss,vue}"
			]
		})
	]
};