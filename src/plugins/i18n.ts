// Typings
import { App, Plugin } from "vue";
import { State } from "@typings/shims-vuex";
import { Store } from "vuex";

export type TranslateFunction = (key: string) => string;

// TODO: Language change should be reactive
// TODO: Show badges

export default {
	install (app: App, store: Store<State>) {

		app.config.globalProperties.$t = (key: string) => {

			const
				[ section, string ] = key.split("/"),
				language = store.state.settings.language;

			return store.state.cache.languages[language]?.[section]?.[string] || store.state.cache.languages["en-us"][section][string];
		};

		app.provide("i18n", store);
	}
} as Plugin;