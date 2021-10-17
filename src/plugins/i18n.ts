// Typings
import { App, Plugin } from "vue";
import { State } from "@typings/shims-vuex";
import { Store } from "vuex";

export default {
	install (app: App, store: Store<State>) {

		app.config.globalProperties.$t = (key: string) => {

			const
				[ section, string ] = key.split("/"),
				language = store.state.settings.language;

			return store.state.cache.languages[language][section][string];
		};

		app.provide("i18n", store);
	}
} as Plugin;