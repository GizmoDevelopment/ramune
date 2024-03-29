// Utils
import { saveSetting, getSetting } from "@utils/storage";

// Types
import type { Module } from "vuex";
import type { SettingsState } from "@typings/shims-vuex";
import type { Flavor } from "@typings/settings";

// Variables
import { FLAVORS } from "@utils/constants";

export default {
	namespaced: true,
	state () {
		return {
			flavor: getSetting("flavor", "blueberry"),
			karaoke: getSetting("karaoke", true),
			effects: getSetting("effects", true),
			volume: getSetting("volume", 1),
			language: getSetting("language", "en-us"),
			splashBackground: getSetting("splashBackground", true)
		};
	},
	mutations: {
		UPDATE_FLAVOR (state: SettingsState, flavorName: string) {
			if (flavorName in FLAVORS) {
				state.flavor = flavorName;
				saveSetting("flavor", flavorName);
			}
		},
		UPDATE_KARAOKE_STATE (_state: SettingsState, state: boolean) {
			_state.karaoke = state;
			saveSetting("karaoke", state);
		},
		UPDATE_EFFECTS_STATE (_state: SettingsState, state: boolean) {
			_state.effects = state;
			saveSetting("effects", state);
		},
		UPDATE_VOLUME (_state: SettingsState, value: number) {
			if (value >= 0 && value <= 1) {
				_state.volume = value;
				saveSetting("volume", value);
			}
		},
		UPDATE_LANGUAGE (state: SettingsState, languageCode: string) {
			state.language = languageCode;
			saveSetting("language", languageCode);
		},
		UPDATE_SPLASH_BACKGROUND_STATE (_state: SettingsState, state: boolean) {
			_state.splashBackground = state;
			saveSetting("splashBackground", state);
		}
	},
	getters: {
		flavor (state: SettingsState): Flavor {
			return FLAVORS[state.flavor] || FLAVORS.blueberry;
		}
	}
} as Module<SettingsState, unknown>;
