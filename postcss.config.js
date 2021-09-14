/* eslint-disable no-undef */
module.exports = {
	plugins: [
		require("autoprefixer")({
			flexbox: false
		}),
		require("stylelint"),
		require("postcss-reporter")
	]
};