// Types
import { Module } from "vuex";
import { SettingsState } from "@typings/shims-vuex";

export default {
	namespaced: true,
	state () {
		return {
			themeColor: "#3db8f5"
		};
	},
	mutations: {
		UPDATE_THEME_COLOR (state: SettingsState, color: string) {
			state.themeColor = color;
		}
	}
} as Module<SettingsState, unknown>;