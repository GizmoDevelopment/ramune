// Types
import type { User } from "gizmo-api";
import type { Module } from "vuex";
import type { Show, ShowHusk } from "@typings/show";
import type { CacheState } from "@typings/shims-vuex";
import type { ParsedLyrics } from "@typings/lyrics";
import type { Language } from "@typings/settings";

// Languages
import * as en from "../i18n/en-us.json";
import * as sl from "../i18n/sl-si.json";
import * as da from "../i18n/da-dk.json";
import * as jp from "../i18n/ja-jp.json";
import { getSetting, removeSetting, saveSetting } from "@utils/storage";

export default {
	namespaced: true,
	state () {
		return {
			shows: new Map(),
			showList: [],
			parsedLyrics: new Map(),
			languages: {
				"en-us": en,
				"sl-si": sl,
				"da-dk": da,
				"ja-jp": jp
			},
			cachedUser: getSetting<User | null>("cachedUser", null)
		};
	},
	mutations: {
		CACHE_SHOW (state: CacheState, show: Show) {
			state.shows.set(show.id, show);
		},
		CACHE_SHOW_LIST (state: CacheState, showList: ShowHusk[]) {
			state.showList = showList;
		},
		CACHE_PARSED_LYRICS (state: CacheState, { showId, lyrics }: { showId: string; lyrics: ParsedLyrics }) {
			state.parsedLyrics.set(`${showId}-${lyrics.id}`, lyrics);
		},
		REPLACE_SHOW_CACHE (state: CacheState, newShowCache: Map<string, Show>) {
			state.shows = newShowCache;
		},
		REPLACE_PARSED_LYRICS_CACHE (state: CacheState, newParsedLyricsCache: Map<string, ParsedLyrics>) {
			state.parsedLyrics = newParsedLyricsCache;
		},
		CACHE_LANGUAGE (state: CacheState, { code, language }: { code: string; language: Language }) {
			state.languages[code] = language;
		},
		CACHE_USER (state: CacheState, user: User | null) {

			state.cachedUser = user;

			if (user) {
				saveSetting("cachedUser", user);
			} else {
				removeSetting("cachedUser");
			}
		}
	}
} as Module<CacheState, unknown>;