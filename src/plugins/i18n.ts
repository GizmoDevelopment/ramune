// Typings
import { App, Plugin } from "vue";
import { State } from "@typings/shims-vuex";
import { Store } from "vuex";

export type TranslateFunction = (key: string, replace?: ReplaceValues) => string;
type ReplaceValues = [ string, string | number ][];

// Variables
const numeratorMatcher = new RegExp(/\{(.?)\|(.?)\|(.?)\}/);
const numeratorReplacer = new RegExp(/(\{.+?\})/);

// TODO: Language change should be reactive

export default {
	install (app: App, store: Store<State>) {

		app.config.globalProperties.$t = (key: string, replaceValues: ReplaceValues = []) => {

			const
				[ section, string ] = key.split("/"),
				language = store.state.settings.language,
				cachedLanguages = store.state.cache.languages;

			let translatedKey = cachedLanguages[language]?.[section]?.[string] || cachedLanguages["en-us"][section][string];

			if (replaceValues.length > 0) {
				for (let i = 0; i <= replaceValues.length; i++) {

					const replaceValue = replaceValues[i];

					if (replaceValue) {

						const [ replaceString, replaceWith ] = replaceValue;

						translatedKey = translatedKey.replace(replaceString, `${replaceWith}`);

						if (replaceString === "%N%" && typeof replaceWith === "number") {

							const suffixes = translatedKey.match(numeratorMatcher);

							if (suffixes) {

								const [ , singular, dual, plural ] = suffixes;

								let chosenSuffix = "";

								switch (replaceWith) {
									case 1:
										chosenSuffix = singular;
										break;
									case 2:
										chosenSuffix = dual;
										break;
									default:
										chosenSuffix = plural;
								}

								translatedKey = translatedKey.replace(numeratorReplacer, chosenSuffix);
							}
						}
					}
				}
			}

			return translatedKey;
		};

		app.provide("i18n", store);
	}
} as Plugin;