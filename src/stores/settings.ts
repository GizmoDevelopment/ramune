// Types
import { Module } from "vuex";
import { SettingsState } from "@typings/shims-vuex";
import { Theme } from "@typings/main";

// Variables
import { THEMES } from "@utils/constants";

export default {
	namespaced: true,
	state () {
		return {
			theme: window.localStorage.getItem("themeColor") || "blueberry",
			karaoke: true,
			effects: true
		};
	},
	mutations: {
		UPDATE_THEME (state: SettingsState, theme: string) {
			if (theme in THEMES) {
				state.theme = theme;
				window.localStorage.setItem("themeColor", theme);
			}
		},
		UPDATE_KARAOKE_STATE (_state: SettingsState, state: boolean) {
			_state.karaoke = state;
		},
		UPDATE_EFFECTS_STATE (_state: SettingsState, state: boolean) {
			_state.effects = state;
		}
	},
	getters: {
		theme (state: SettingsState): Theme {
			return THEMES[state.theme] || THEMES.blueberry;
		}
	}
} as Module<SettingsState, unknown>;