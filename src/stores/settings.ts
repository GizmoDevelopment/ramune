// Types
import { Module } from "vuex";
import { SettingsState } from "@typings/shims-vuex";
import { Flavor } from "@typings/main";

// Variables
import { FLAVORS } from "@utils/constants";

export default {
	namespaced: true,
	state () {
		return {
			flavor: window.localStorage.getItem("flavorName") || "blueberry",
			karaoke: true,
			effects: true,
			volume: Number(window.localStorage.getItem("volume")) || 1,
			language: window.localStorage.getItem("language") || "en-us"
		};
	},
	mutations: {
		UPDATE_FLAVOR (state: SettingsState, flavorName: string) {
			if (flavorName in FLAVORS) {
				state.flavor = flavorName;
				window.localStorage.setItem("flavorName", flavorName);
			}
		},
		UPDATE_KARAOKE_STATE (_state: SettingsState, state: boolean) {
			_state.karaoke = state;
		},
		UPDATE_EFFECTS_STATE (_state: SettingsState, state: boolean) {
			_state.effects = state;
		},
		UPDATE_VOLUME (_state: SettingsState, state: number) {
			if (state >= 0 && state <= 1) {
				_state.volume = state;
				window.localStorage.setItem("volume", state.toString());
			}
		},
		UPDATE_LANGUAGE (_state: SettingsState, languageCode: string) {
			_state.language = languageCode;
		}
	},
	getters: {
		flavor (state: SettingsState): Flavor {
			return FLAVORS[state.flavor] || FLAVORS.blueberry;
		}
	}
} as Module<SettingsState, unknown>;