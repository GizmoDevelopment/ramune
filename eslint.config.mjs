// Modules
import globals from "globals";
import { configs } from "@gizmo-dev/eslint-plugin";

export default [
	...configs.ts,
	...configs.vue,
	{
		languageOptions: {
			ecmaVersion: 2021,
			globals: {
				...globals.browser
			},
			parserOptions: {
				project: true
			}
		},
		rules: {
			"vue/no-reserved-component-names": "off"
		}
	}
];
