// Types
import { Module } from "vuex";
import { SettingsState } from "@typings/shims-vuex";

export default {
	namespaced: true,
	state () {
		return {
			themeColor: "#3db8f5",
			karaoke: true,
			effects: true
		};
	},
	mutations: {
		UPDATE_THEME_COLOR (state: SettingsState, color: string) {
			state.themeColor = color;
		},
		UPDATE_KARAOKE_STATE (_state: SettingsState, state: boolean) {
			_state.karaoke = state;
		},
		UPDATE_EFFECTS_STATE (_state: SettingsState, state: boolean) {
			_state.effects = state;
		}
	}
} as Module<SettingsState, unknown>;