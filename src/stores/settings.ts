// Types
import { Module } from "vuex";
import { SettingsState } from "@typings/shims-vuex";
import { Flavor } from "@typings/settings";

// Variables
import { FLAVORS } from "@utils/constants";

// ! IF YOU'RE ADDING SAVABLE OBJECTS/ARRAYS/MAPS, MAKE SURE TO STRINGIFY THEM PROPERLY

function saveSetting (name: string, value: unknown): void {
	window.localStorage.setItem(name, `${value}`);
}

function getSetting <T> (name: string, defaultValue: T): unknown {

	const setting = window.localStorage.getItem(name);

	if (setting !== null) {
		switch (typeof defaultValue) {
			case "number":
				return Number(setting);
			case "boolean":
				return setting === "true" ? true : false;
			default: // Strings
				return setting;
		}
	} else {
		return defaultValue;
	}
}

export default {
	namespaced: true,
	state () {
		return {
			flavor: getSetting("flavor", "blueberry"),
			karaoke: getSetting("karaoke", true),
			effects: getSetting("effects", true),
			volume: getSetting("volume", 1),
			language: getSetting("language", "en-us")
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
		}
	},
	getters: {
		flavor (state: SettingsState): Flavor {
			return FLAVORS[state.flavor] || FLAVORS.blueberry;
		}
	}
} as Module<SettingsState, unknown>;